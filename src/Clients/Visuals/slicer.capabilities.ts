//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export var slicerCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Values',
                kind: VisualDataRoleKind.Grouping,
                displayName: powerbi.data.createDisplayNameGetter('Role_DisplayName_Field'),
            }
        ],
        dataViewMappings: [{
            conditions: [{ 'Values': { max: 1 } }],
            categorical: {
                categories: {
                    for: { in: 'Values' },
                    dataReductionAlgorithm: { window: {} }
                }
            }
        }],
        objects: {
            general: {
                properties: {
                    selected: {
                        type: { bool: true }
                    },
                    filter: {
                        type: { filter: {} },
                        rule: {
                            output: {
                                property: 'selected',
                                selector: ['Values'],
                            }
                        }
                    },
                    formatString: {
                        type: { formatting: { formatString: true } },
                    },
                }
            }
        },
        sorting: {
            custom: {},
        },
        suppressDefaultTitle: true,
    };

    export var slicerProps = {
        selectedPropertyIdentifier: <DataViewObjectPropertyIdentifier>{
            objectName: 'general',
            propertyName: 'selected'
        },

        filterPropertyIdentifier: <DataViewObjectPropertyIdentifier> {
            objectName: 'general',
            propertyName: 'filter'
        },

        formatString: <DataViewObjectPropertyIdentifier> {
            objectName: 'general',
            propertyName: 'formatString'
        },
    };

}