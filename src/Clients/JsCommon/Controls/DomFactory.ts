//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module InJs {
    export module DomFactory {

        export function div(): JQuery {
            return $('<div/>');
        }

        export function span(): JQuery {
            return $('<span/>');
        }

        export function checkbox(): JQuery {
            return $('<input type="checkbox"/>');
        }

        export function ul(): JQuery {
            return $('<ul/>');
        }

        export function li(): JQuery {
            return $('<li/>');
        }

        export function button(): JQuery {
            return $('<input type="button"/>');
        }

        export function select(): JQuery {
            return $('<select/>');
        }

        export function textBox(): JQuery {
            return $('<input type="text"/>');
        }

        export function img(): JQuery {
            return $('<img/>');
        }

        export function iframe(): JQuery {
            return $('<iframe/>');
        }
    }
}