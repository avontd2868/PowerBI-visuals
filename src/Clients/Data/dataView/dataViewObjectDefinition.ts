//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    /** Defines the values for particular objects. */
    export interface DataViewObjectDefinitions {
        [objectName: string]: DataViewObjectDefinition[];
    }

    export interface DataViewObjectDefinition {
        selector?: Selector;
        properties: DataViewObjectPropertyDefinitions;
    }

    export interface DataViewObjectPropertyDefinitions {
        [name: string]: DataViewObjectPropertyDefinition;
    }

    export type DataViewObjectPropertyDefinition = SQExpr | StructuralObjectDefinition;

    export module DataViewObjectDefinitions {

        /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
        export function ensure(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector): DataViewObjectDefinition {
            debug.assertValue(defns, 'defns');

            var defnsForObject = defns[objectName];
            if (!defnsForObject)
                defns[objectName] = defnsForObject = [];

            for (var i = 0, len = defnsForObject.length; i < len; i++) {
                var defn = defnsForObject[i];
                if (Selector.equals(defn.selector, selector))
                    return defn;
            }

            var newDefn: DataViewObjectDefinition = {
                selector: selector,
                properties: {},
            };
            defnsForObject.push(newDefn);

            return newDefn;
        }

        export function deleteProperty(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector,
            propertyName: string): void {
            debug.assertValue(defns, 'defns');

            var defnsForObject = defns[objectName];
            if (!defnsForObject)
                return;
            
            for (var i = 0, len = defnsForObject.length; i < len; i++) {   
                var defn = defnsForObject[i];             
                if (Selector.equals(defn.selector, selector)) {   
                    //note: We decided that delete is acceptable here and that we don't need optimization here                
                    delete defn.properties[propertyName];
                    return;
                }
            }                   
        }

        export function getValue(
            defns: DataViewObjectDefinitions,
            propertyId: DataViewObjectPropertyIdentifier,
            selector: Selector): DataViewObjectPropertyDefinition {

            var defnsForObject = defns[propertyId.objectName];
            if (!defnsForObject)
                return;

            for (var i = 0, len = defnsForObject.length; i < len; i++) {
                var defn = defnsForObject[i];
                if (Selector.equals(defn.selector, selector))
                    return defn.properties[propertyId.propertyName];
            }
        }
    }
}