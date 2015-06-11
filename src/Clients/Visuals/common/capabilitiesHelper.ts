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
