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

module powerbi.data.services {
    export module wireContracts {
        export interface DataViewTransformActions {
            queryMetadata: data.QueryMetadata;
            visualElements: VisualElement[];
            objects: data.services.wireContracts.DataViewObjectDefinitions;
        }
    }

    export module DataViewTransformActionsSerializer {
        export function deserializeTransformActions(visualType: string, objectDescs: data.DataViewObjectDescriptors, transformsString: string): powerbi.data.DataViewTransformActions {
            if (!visualType || !transformsString)
                return;

            var serializedTransform = <wireContracts.DataViewTransformActions>JSON.parse(transformsString);
            var dataViewObjectDefns: data.DataViewObjectDefinitions;
            var dataViewObjectDescs: data.DataViewObjectDescriptors = objectDescs;

            if (objectDescs) {
                var objects: wireContracts.DataViewObjectDefinitions = serializedTransform.objects;
                if (objects)
                    dataViewObjectDefns = services.DataViewObjectSerializer.deserializeObjects(objects, dataViewObjectDescs);
            }

            return data.DataViewTransform.createTransformActions(
                serializedTransform.queryMetadata,
                serializedTransform.visualElements,
                dataViewObjectDescs,
                dataViewObjectDefns);
        }

        export function serializeTransformActions(actions: wireContracts.DataViewTransformActions): string {
            return JSON.stringify(actions);
        }
    }
} 