//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    // TODO: Deprecate this.
    export module SettingsUtil {
        export function copyCommonSettings(settings: VisualSettings): VisualSettings {
            return {
                DisplayUnitSystemType: settings.DisplayUnitSystemType
            };
        }
    }
}