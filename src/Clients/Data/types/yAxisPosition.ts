//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export module yAxisPosition {
        export var left: string = 'Left';
        export var right: string = 'Right';       
        
        //should be used to populate the control values
        export function members(): IEnumMember[] {
            return [{ value: left, displayName: resources => resources.get('Visual_yAxis_Left') },
                { value: right, displayName: resources => resources.get('Visual_yAxis_Right') }];
        }
    }
}