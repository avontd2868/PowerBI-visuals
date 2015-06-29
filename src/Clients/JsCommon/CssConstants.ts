//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {

    /** CSS constants */
    export module CssConstants {
        export var styleAttribute = 'style';
        export var pixelUnits = 'px';

        export var heightProperty = 'height';
        export var widthProperty = 'width';
        export var topProperty = 'top';
        export var bottomProperty = 'bottom';
        export var leftProperty = 'left';
        export var rightProperty = 'right';
        export var marginTopProperty = 'margin-top';
        export var marginLeftProperty = 'margin-left';
        export var displayProperty = 'display';
        export var backgroundProperty = 'background';
        export var backgroundColorProperty = 'background-color';
        export var backgroundRepeatProperty = 'background-repeat';
        export var backgroundSizeProperty = 'background-size';
        export var backgroundImageProperty = 'background-image';
        export var textShadowProperty = 'text-shadow';
        export var borderTopWidthProperty = 'border-top-width';
        export var borderBottomWidthProperty = 'border-bottom-width';
        export var borderLeftWidthProperty = 'border-left-width';
        export var borderRightWidthProperty = 'border-right-width';
        export var fontWeightProperty = 'font-weight';
        export var colorProperty = 'color';
        export var opacityProperty = 'opacity';
        export var paddingLeftProperty = 'padding-left';
        export var paddingRightProperty = 'padding-right';
        export var positionProperty = 'position';
        export var maxWidthProperty = 'max-width';
        export var minWidthProperty = 'min-width';
        export var overflowProperty = 'overflow';
        export var cursorProperty = 'cursor';
        export var visibilityProperty = 'visibility';

        export var absoluteValue = 'absolute';
        export var zeroPixelValue = '0px';
        export var autoValue = 'auto';
        export var hiddenValue = 'hidden';
        export var noneValue = 'none';
        export var blockValue = 'block';
        export var inlineBlockValue = 'inline-block';
        export var transparentValue = 'transparent';
        export var boldValue = 'bold';
        export var visibleValue = 'visible';
        export var tableRowValue = 'table-row';
        export var coverValue = 'cover';
        export var pointerValue = 'pointer';
    }

    export interface ExtendedCSSProperties extends MSStyleCSSProperties {
        webkitTransform: string;
    }
}