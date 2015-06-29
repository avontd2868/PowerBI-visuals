//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export module visualBackgroundHelper {
        export function getDefaultColor(): string {
            return '#FFF';
        }

        export function getDefaultTransparency(): number {
            return 100;
        }

        export function getDefaultShow(): boolean {
            return true;
        }

        export function getDefaultValues() {
            return {
                color: getDefaultColor(),
                transparency: getDefaultTransparency(),
                show: getDefaultShow()
            };
        }
    }
} 