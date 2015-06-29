//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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