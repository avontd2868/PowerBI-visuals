//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.controls {

    export module HTMLElementUtils {
        export function clearChildren(element: HTMLElement): void {
            if (!element) {
                return;
            }

            while (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
        }

        export function setElementTop(element: HTMLElement, top: number): void {
            element.style.top = top + "px";
        }

        export function setElementLeft(element: HTMLElement, left: number): void {
            element.style.left = left + "px";
        }

        export function setElementHeight(element: HTMLElement, height: number): void {
            if (HTMLElementUtils.isAutoSize(height))
                element.style.height = "auto";
            else
                element.style.height = height + "px";
        }

        export function setElementWidth(element: HTMLElement, width: number): void {
            if (HTMLElementUtils.isAutoSize(width))
                element.style.width = "auto";
            else
                element.style.width = width + "px";
        }

        export function getElementWidth(element: HTMLElement): number {
            return element.offsetWidth;
        }

        export function getElementHeight(element: HTMLElement): number {
            return element.offsetHeight;
        }

        export function isAutoSize(size: number): boolean {
            return size === -1;
        }

        export function getAccumulatedScale(element: HTMLElement): number {
            var scale: number = 1;
            while (element) {
                scale *= HTMLElementUtils.getScale(element);
                element = element.parentElement;
            }

            return scale;
        }

        // Get scale of element, return 1 when not scaled
        export function getScale(element: any): number {
            element = $(element);

            var str = element.css('-webkit-transform') ||
                element.css('-moz-transform') ||
                element.css('-ms-transform') ||
                element.css('-o-transform') ||
                element.css('transform');

            return (str && (
                str.match(/\d*\.\d*/) && Number(str.match(/\d*\.\d*/)[0]) ||
                str.match(/\d+/) && Number(str.match(/\d+/)[0]))
                ) || 1;
        }
    }
}

module powerbi.visuals.controls.internal {

    export module TablixUtils {

        export function createTable(): HTMLTableElement {
            return <HTMLTableElement>document.createElement("table");
        }

        export function createDiv(): HTMLDivElement {
            var div: HTMLDivElement = <HTMLDivElement>document.createElement("div");

            // TODO: Fold these into CSS as well combined with the styling done for the different scenarios where div are used.
            var divStyle = div.style;
            divStyle.whiteSpace = "nowrap";
            divStyle.overflow = "hidden";
            divStyle.lineHeight = "normal";

            return div;
        }

        export function appendATagToBodyCell(value: string, cell: controls.ITablixCell): void {
            var element = <HTMLElement>cell.extension.contentHost;
            var atag: HTMLAnchorElement = null;
            if(element.childElementCount === 0) {
                atag = document.createElement('a');
                element.appendChild(atag);
            } else {
                atag = <HTMLAnchorElement>element.children[0];
            }

            atag.href = value;
            atag.target = '_blank';
            atag.title = value;
            atag.innerText = value;
        }
    }
}