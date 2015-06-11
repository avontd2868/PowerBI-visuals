/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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