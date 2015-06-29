//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export module DataRoleHelper {
        export function getMeasureIndexOfRole(grouped: DataViewValueColumnGroup[], roleName: string, defaultIndexIfNoRole?: number): number {
            if (grouped && grouped.length > 0) {
                var firstGroup = grouped[0];
                if (firstGroup.values && firstGroup.values.length > 0) {
                    for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                        var value = firstGroup.values[i];
                        if (value && value.source) {
                            if (hasRole(value.source, roleName))
                                return i;

                            if (len > defaultIndexIfNoRole)
                                return defaultIndexIfNoRole;
                        }
                    }
                }
            }
            return -1;
        }

        export function hasRole(column: DataViewMetadataColumn, name: string): boolean {
            var roles = column.roles;
            return roles && roles[name];
        }
    }
}
