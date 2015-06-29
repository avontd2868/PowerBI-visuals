//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import Utility = jsCommon.Utility;

    export module UrlHelper {
        export function isValidUrl(columnItem: DataViewMetadataColumn, value: string): boolean {
            return columnItem != null
                && columnItem.type != null
                && columnItem.type.misc != null
                && columnItem.type.misc.webUrl != null
                && columnItem.type.misc.webUrl
                && value != null
                && Utility.isValidUrl(value);
        }
    }
}