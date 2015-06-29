//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export module axisType {
        export var scalar: string = 'Scalar';
        export var categorical: string = 'Categorical';       
        export var both: string = 'Both';
        //should be used to populate the control values
        export function members(): IEnumMember[] {
            return [
                { value: scalar, displayName: resources => resources.get('Visual_Axis_Scalar') },
                { value: categorical, displayName: resources => resources.get('Visual_Axis_Categorical') },
            ];
        }
    }
}