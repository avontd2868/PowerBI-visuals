//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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