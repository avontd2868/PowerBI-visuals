//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export module legendPosition {
        export var top: string = 'Top';
        export var bottom: string = 'Bottom';
        export var left: string = 'Left';
        export var right: string = 'Right';

        export function members(): IEnumMember[] {
            return [{ value: top, displayName: resources => resources.get('Visual_LegendPosition_Top') },
                { value: bottom, displayName: resources => resources.get('Visual_LegendPosition_Bottom') },
                { value: left, displayName: resources => resources.get('Visual_LegendPosition_Left') },
                { value: right, displayName: resources => resources.get('Visual_LegendPosition_Right') }];
        }
    }
}