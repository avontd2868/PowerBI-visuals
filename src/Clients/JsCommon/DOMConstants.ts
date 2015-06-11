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
    /** DOM constants */
    export module DOMConstants {

        /** Integer codes corresponding to individual keys on the keyboard */
        export var escKeyCode = 27;
        export var enterKeyCode = 13;
        export var tabKeyCode = 9;
        export var upArrowKeyCode = 38;
        export var downArrowKeyCode = 40;
        export var leftArrowKeyCode = 37;
        export var rightArrowKeyCode = 39;
        export var homeKeyCode = 36;
        export var endKeyCode = 35;
        export var backSpaceKeyCode = 8;
        export var deleteKeyCode = 46;
        export var spaceKeyCode = 32;
        export var shiftKeyCode = 16;
        export var ctrlKeyCode = 17;
        export var altKeyCode = 18;

        export var aKeyCode = 65;
        export var cKeyCode = 67;
        export var vKeyCode = 86;
        export var xKeyCode = 88;
        export var yKeyCode = 89;
        export var zKeyCode = 90;

        /** DOM Elements */
        export var DocumentBody = 'body';
        export var Anchor = 'a';
        export var EditableTextElements = 'input, textarea, select';

        /** DOM Attributes and values */
        export var disabledAttributeOrValue = 'disabled';
        export var readonlyAttributeOrValue = 'readonly';
        export var styleAttribute = 'style';
        export var hrefAttribute = 'href';
        export var targetAttribute = 'target';
        export var blankValue = '_blank';
        export var classAttribute = 'class';
        export var titleAttribute = 'title';
        export var srcAttribute = 'src';

        /** DOM event names */
        export var contextmenuEventName = 'contextmenu';
        export var blurEventName = 'blur';
        export var keyUpEventName = 'keyup';
        export var inputEventName = 'input';
        export var changeEventName = 'change';
        export var cutEventName = 'cut';
        export var keyDownEventName = 'keydown';
        export var mouseMoveEventName = 'mousemove';
        export var mouseDownEventName = 'mousedown';
        export var mouseEnterEventName = 'mouseenter';
        export var mouseLeaveEventName = 'mouseleave';
        export var mouseOverEventName = 'mouseover';
        export var mouseOutEventName = 'mouseout';
        export var mouseClickEventName = 'click';
        export var pasteEventName = 'paste';
        export var scrollEventName = 'scroll';
        export var dropEventName = 'drop';
        export var focusInEventName = 'focusin';
        export var focusOutEventName = 'focusout';
        export var selectEventName = 'select';
        export var messageEventName = 'message';
        export var loadEventName = 'load';
        export var beforeUnload = 'beforeunload';
        
        /** Common DOM event combination names */
        export var inputAndSelectEventNames = 'input, select';
    }
}