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