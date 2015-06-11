/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.data {
    export interface DataViewObjectDefinitionsByRepetition {
        metadataOnce?: DataViewObjectDefinitionsForSelector;
        userDefined?: DataViewObjectDefinitionsForSelector[];
        metadata?: DataViewObjectDefinitionsForSelector[];
        data: DataViewObjectDefinitionsForSelectorWithRule[];
    }

    export interface DataViewObjectDefinitionsForSelector {
        selector?: Selector;
        objects: DataViewNamedObjectDefinition[];
    }

    export interface DataViewObjectDefinitionsForSelectorWithRule extends DataViewObjectDefinitionsForSelector {
        rules?: RuleEvaluation[];
    }

    export interface DataViewNamedObjectDefinition {
        name: string;
        properties: DataViewObjectPropertyDefinitions;
    }

    export module DataViewObjectEvaluationUtils {
        export function evaluateDataViewObjects(
            objectDescriptors: DataViewObjectDescriptors,
            objectDefns: DataViewNamedObjectDefinition[]): DataViewObjects {
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(objectDefns, 'objectDefns');

            var objects: DataViewObjects;

            for (var j = 0, jlen = objectDefns.length; j < jlen; j++) {
                var objectDefinition = objectDefns[j],
                    objectName = objectDefinition.name;

                var evaluatedObject: DataViewObject = DataViewObjectEvaluator.run(objectDescriptors[objectName], objectDefinition.properties);
                if (!evaluatedObject)
                    continue;

                if (!objects)
                    objects = {};

                // NOTE: this currently has last-object-wins semantics.
                objects[objectName] = evaluatedObject;
            }

            return objects;
        }

        export function groupObjectsBySelector(objectDefinitions: DataViewObjectDefinitions): DataViewObjectDefinitionsByRepetition {
            debug.assertAnyValue(objectDefinitions, 'objectDefinitions');

            var grouped: DataViewObjectDefinitionsByRepetition = {
                data: [],
            };

            if (objectDefinitions) {
                for (var objectName in objectDefinitions) {
                    var objectDefnList = objectDefinitions[objectName];

                    for (var i = 0, len = objectDefnList.length; i < len; i++) {
                        var objectDefn = objectDefnList[i];

                        ensureDefinitionListForSelector(grouped, objectDefn.selector).objects.push({
                            name: objectName,
                            properties: objectDefn.properties,
                        });
                    }
                }
            }

            return grouped;
        }

        function ensureDefinitionListForSelector(grouped: DataViewObjectDefinitionsByRepetition, selector: Selector): DataViewObjectDefinitionsForSelector {
            debug.assertValue(grouped, 'grouped');
            debug.assertAnyValue(selector, 'selector');

            if (!selector) {
                if (!grouped.metadataOnce)
                    grouped.metadataOnce = { objects: [] };
                return grouped.metadataOnce;
            }

            var groupedObjects: DataViewObjectDefinitionsForSelector[];
            if (selector.data) {
                groupedObjects = grouped.data;
            }
            else if (selector.metadata) {
                if (!grouped.metadata)
                    grouped.metadata = [];
                groupedObjects = grouped.metadata;
            }
            else if (selector.id) {
                if (!grouped.userDefined)
                    grouped.userDefined = [];
                groupedObjects = grouped.userDefined;
            }

            for (var i = 0, len = groupedObjects.length; i < len; i++) {
                var item = groupedObjects[i];
                if (Selector.equals(selector, item.selector))
                    return item;
            }

            var item: DataViewObjectDefinitionsForSelector = {
                selector: selector,
                objects: [],
            };
            groupedObjects.push(item);

            return item;
        }

        /** Registers properties for default format strings, if the properties are not explicitly provided. */
        export function addDefaultFormatString(
            objectsForAllSelectors: DataViewObjectDefinitionsByRepetition,
            objectDescriptors: DataViewObjectDescriptors,
            columns: DataViewMetadataColumn[],
            selectTransforms: DataViewSelectTransform[]): void {
            debug.assertValue(objectsForAllSelectors, 'objectsForAllSelectors');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(columns, 'columns');
            debug.assertValue(selectTransforms, 'selectTransforms');

            var formatStringProp = DataViewObjectDescriptors.findFormatString(objectDescriptors);
            if (!formatStringProp)
                return;

            for (var selectIdx = 0, selectLen = selectTransforms.length; selectIdx < selectLen; selectIdx++) {
                var selectTransform = selectTransforms[selectIdx];
                if (!selectTransform)
                    continue;
                debug.assertValue(selectTransform.queryName, 'selectTransform.queryName');

                applyFormatString(
                    objectsForAllSelectors,
                    formatStringProp,
                    selectTransform.queryName,
                    selectTransform.format || getColumnFormatForIndex(columns, selectIdx));
            }
        }

        function getColumnFormatForIndex(columns: DataViewMetadataColumn[], selectIdx: number): string {
            for (var columnIdx = 0, columnLen = columns.length; columnIdx < columnLen; columnIdx++) {
                var column = columns[columnIdx];
                if (!column || column.index !== selectIdx)
                    continue;

                return column.format;
            }
        }

        function applyFormatString(
            objectsForAllSelectors: DataViewObjectDefinitionsByRepetition,
            formatStringProp: DataViewObjectPropertyIdentifier,
            queryName: string,
            formatStringValue: string): void {
            if (!formatStringValue)
                return;

            // There is a format string specified -- apply it as an object property, if there is not already one specified.
            var metadataObjects = objectsForAllSelectors.metadata;
            if (!metadataObjects)
                metadataObjects = objectsForAllSelectors.metadata = [];

            var selector: Selector = { metadata: queryName };

            var targetMetadataObject = findWithMatchingSelector(metadataObjects, selector),
                targetObjectDefns: DataViewNamedObjectDefinition[];
            if (targetMetadataObject) {
                targetObjectDefns = targetMetadataObject.objects;
                if (hasExistingObjectProperty(targetObjectDefns, formatStringProp))
                    return;
            }
            else {
                targetObjectDefns = [];
                targetMetadataObject = { selector: selector, objects: targetObjectDefns };
                metadataObjects.push(targetMetadataObject);
            }

            var newObjectDefn: DataViewNamedObjectDefinition = {
                name: formatStringProp.objectName,
                properties: {}
            };
            newObjectDefn.properties[formatStringProp.propertyName] = SQExprBuilder.text(formatStringValue);

            targetObjectDefns.push(newObjectDefn);
        }

        function findWithMatchingSelector(objects: DataViewObjectDefinitionsForSelector[], selector: Selector): DataViewObjectDefinitionsForSelector {
            debug.assertValue(objects, 'objects');
            debug.assertValue(selector, 'selector');

            for (var i = 0, len = objects.length; i < len; i++) {
                var object = objects[i];
                if (Selector.equals(object.selector, selector))
                    return object;
            }
        }

        function hasExistingObjectProperty(objectDefns: DataViewNamedObjectDefinition[], propertyId: DataViewObjectPropertyIdentifier): boolean {
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(propertyId, 'propertyId');

            for (var i = 0, len = objectDefns.length; i < len; i++) {
                var objectDefn = objectDefns[i];

                if (objectDefn.name === propertyId.objectName && objectDefn.properties[propertyId.propertyName])
                    return true;
            }

            return false;
        }
    }
} 