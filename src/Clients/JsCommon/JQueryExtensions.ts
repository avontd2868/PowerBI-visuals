//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

$.fn.multiline = function (text) {
    this.text(text);
    this.html(this.html().replace(/\n/g, '<br/>'));
    return this;
};

$.fn.togglePanelControl = function () {
    return this.each(function () {
        $(this).addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset")
            .find(".accordionHeader")
            .addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom")
            .hover(function() {
                $(this).toggleClass("ui-state-hover");
            })
            .prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>')
            .click(function() {
                $(this)
                    .toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
                    .find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
                    .next().slideToggle();
                return false;
            })
            .next()
            .addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom")
            .hide();
    });
};

module jsCommon {
    /** Represents a promise that may be rejected by its consumer. */    
    export interface IRejectablePromise extends JQueryPromise<void> {
        reject(...args: any[]): void;
    }

    export module JQueryConstants {
        export var VisibleSelector: string = ':visible';
    }
}