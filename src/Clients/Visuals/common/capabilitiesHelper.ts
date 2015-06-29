//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    // TODO: Delete this file once supported/preferred data views are removed from VisualCapabilities (dinael).

    export interface Capabilities {
        roleDefinitions?: VisualRoleDefinition[];
        dataViewMapping?: DataViewRoleMapping[];
        supported: DataViewSchema;
        withPreferred?: DataViewSchema;
        supportsHighlight?: boolean;
    }

    export interface CategoricalVisualRoles {
        category: string;
        values: string[];
        valueGrouping: string;
    }

    export interface RoleCapabilitiesMetadata {
        mappings: DataViewRoleMapping[];
        definitions: VisualRoleDefinition[];
    }

    export module CapabilitiesHelper {
        export function create(capabilities: Capabilities): VisualCapabilities {
            var supportedDataViews = capabilities.supported;
            var withPreferredDataViews = capabilities.withPreferred;

            // Creates a new preferredDataViews that is a combination of the supportedDataViews and
            // additional constraints specified in withPreferredDataViews
            if (withPreferredDataViews) {
                var preferredDataViews = $.extend(true, {}, supportedDataViews);
                $.extend(true, preferredDataViews, withPreferredDataViews);
            }

            var result: VisualCapabilities = {
                supportedDataViews: supportedDataViews,
                preferredDataViews: preferredDataViews != null ? preferredDataViews : supportedDataViews,
                supportsHighlight: capabilities.supportsHighlight
            };

            if (capabilities.roleDefinitions)
                result.roleDefinitions = capabilities.roleDefinitions;
            if (capabilities.dataViewMapping)
                result.dataViewMapping = capabilities.dataViewMapping;

            return result;
        }
    }
}
