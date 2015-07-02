//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export module axisStyle {
        export var showBoth: string = 'showBoth';
        export var showTitleOnly: string = 'showTitleOnly';  
        var allMembers: IEnumMember[] = [
            { value: showTitleOnly, displayName: resources => resources.get('Visual_Axis_ShowTitleOnly') },
            { value: showBoth, displayName: resources => resources.get('Visual_Axis_ShowBoth') }
        ];     
        
        //should be used to populate the control values
        export function members(validMembers?: string[]): IEnumMember[]{
            var validMembersToReturn: IEnumMember[] = [];
            if (validMembers) {
                for (var i = 0, len = allMembers.length; i < len; i++) {
                    if (validMembers.indexOf(<string>allMembers[i].value) !== -1) {
                        validMembersToReturn.push(allMembers[i]);
                    }
                }
            }
            
            return validMembersToReturn;
        }
    }
}