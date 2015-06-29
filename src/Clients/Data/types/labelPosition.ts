//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (coffee) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {

    export module labelPosition {
        export var topLeft: string = 'TopLeft';
        export var topCenter: string = 'TopCenter';
        export var topRight: string = 'TopRight';
        export var middleLeft: string = 'MiddleLeft';
        export var middleCenter: string = 'MiddleCenter';
        export var middleRight: string = 'MiddleRight';
        export var bottomLeft: string = 'BottomLeft';
        export var bottomCenter: string = 'BottomCenter';
        export var bottomRight: string = 'BottomRight';
        export var insideCenter: string = 'InsideCenter';
        export var insideBase: string = 'InsideBase';
        export var insideEnd: string = 'InsideEnd';
        export var outsideBase: string = 'OutsideBase';
        export var outsideEnd: string = 'OutsideEnd';

        export function members(): IEnumMember[] {
            return [
                { value: topLeft, displayName: resources => resources.get('Visual_LabelPosition_TopLeft') },
                { value: topCenter, displayName: resources => resources.get('Visual_LabelPosition_TopCenter') },
                { value: topRight, displayName: resources => resources.get('Visual_LabelPosition_TopRight') },
                { value: middleLeft, displayName: resources => resources.get('Visual_LabelPosition_MiddleLeft') },
                { value: middleCenter, displayName: resources => resources.get('Visual_LabelPosition_MiddleCenter') },
                { value: middleRight, displayName: resources => resources.get('Visual_LabelPosition_MiddleRight') },
                { value: bottomLeft, displayName: resources => resources.get('Visual_LabelPosition_BottomLeft') },
                { value: bottomCenter, displayName: resources => resources.get('Visual_LabelPosition_BottomCenter') },
                { value: bottomRight, displayName: resources => resources.get('Visual_LabelPosition_BottomRight') },
                { value: insideCenter, displayName: resources => resources.get('Visual_LabelPosition_InsideCenter') },
                { value: insideBase, displayName: resources => resources.get('Visual_LabelPosition_InsideBase') },
                { value: insideEnd, displayName: resources => resources.get('Visual_LabelPosition_InsideEnd') },
                { value: outsideBase, displayName: resources => resources.get('Visual_LabelPosition_OutsideBase') },
                { value: outsideEnd, displayName: resources => resources.get('Visual_LabelPosition_OutsideEnd') },
            ];
        }
    }
}