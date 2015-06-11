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
    export interface DataViewObjectDescriptors {
        /** Defines general properties for a visualization. */
        general?: DataViewObjectDescriptor;

        [objectName: string]: DataViewObjectDescriptor;
    }

    /** Defines a logical object in a visualization. */
    export interface DataViewObjectDescriptor {
        displayName?: DisplayNameGetter;
        properties: DataViewObjectPropertyDescriptors;
    }

    export interface DataViewObjectPropertyDescriptors {
        [propertyName: string]: DataViewObjectPropertyDescriptor;
    }

    /** Defines a property of a DataViewObjectDefinition. */
    export interface DataViewObjectPropertyDescriptor {
        displayName?: DisplayNameGetter;
        type: DataViewObjectPropertyTypeDescriptor;

        rule?: DataViewObjectPropertyRuleDescriptor;
    }

    export type DataViewObjectPropertyTypeDescriptor = ValueTypeDescriptor | StructuralTypeDescriptor;

    export interface DataViewObjectPropertyRuleDescriptor {
        /** For rule typed properties, defines the input visual role name. */
        inputRole?: string;

        /** Defines the output for rule-typed properties. */
        output?: DataViewObjectPropertyRuleOutputDescriptor;
    }

    export interface DataViewObjectPropertyRuleOutputDescriptor {
        /** Name of the target property for rule output. */
        property: string;

        /** Names roles that define the selector for the output properties. */
        selector: string[];
    }

    export module DataViewObjectDescriptors {
        /** Attempts to find the format string property.  This can be useful for upgrade and conversion. */
        export function findFormatString(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(
                descriptors,
                (propDesc: DataViewObjectPropertyDescriptor) => {
                    var formattingTypeDesc = ValueType.fromDescriptor(propDesc.type).formatting;
                    return formattingTypeDesc && formattingTypeDesc.formatString;
                });
        }

        /** Attempts to find the filter property.  This can be useful for propagating filters from one visual to others. */
        export function findFilterOutput(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(
                descriptors,
                (propDesc: DataViewObjectPropertyDescriptor) => {
                    var propType: StructuralTypeDescriptor = propDesc.type;
                    return propType && !!propType.filter;
                });
        }

        function findProperty(descriptors: DataViewObjectDescriptors, propPredicate: (propDesc: DataViewObjectPropertyDescriptor) => boolean): DataViewObjectPropertyIdentifier {
            debug.assertAnyValue(descriptors, 'descriptors');
            debug.assertAnyValue(propPredicate, 'propPredicate');

            if (!descriptors)
                return;

            for (var objectName in descriptors) {
                var objPropDescs = descriptors[objectName].properties;

                for (var propertyName in objPropDescs) {
                    if (propPredicate(objPropDescs[propertyName])) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName,
                        };
                    }
                }
            }
        }
    }
}