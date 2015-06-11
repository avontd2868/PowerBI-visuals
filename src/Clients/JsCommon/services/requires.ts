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

    var doc: HTMLDocument = document,
        headElement: HTMLElement = doc.head,
        firstScriptInHeadElement: HTMLElement = headElement.getElementsByTagName('script')[0],
        linkElement: HTMLElement = doc.createElement('link'),
        scriptElement: HTMLElement = doc.createElement('script'),
        styleSheetLoaded: string[] = [],
        javaScriptFilesLoaded: string[] = [],
        javaScriptFilesLoading: any[] = [];

    linkElement.setAttribute('rel', 'stylesheet');

    // Public API
	export interface IJavaScriptDependency {
		javascriptFile: string;

        // Callback that indicates when the script is loaded, after writing a <script> tag
		onLoadCallback?: () => JQueryPromise<void>;
	}

    export interface IDependency {
        javaScriptFiles?: string[];
        cssFiles?: string[];
		javaScriptFilesWithCallback?: IJavaScriptDependency[];
    }

    export function requires(dependency: IDependency, to: () => void = () => { }): void {
        loadStyleSheets(dependency.cssFiles || []);

		var scriptsToRun = dependency.javaScriptFilesWithCallback || [];

		if (dependency.javaScriptFiles) {
			for(var i=0, len=dependency.javaScriptFiles.length; i<len; ++i) {
				scriptsToRun.push({javascriptFile:dependency.javaScriptFiles[i]});
			}
		}
        loadJavaScriptFiles(scriptsToRun, to);
    }

    // Private Helpers
    function loadStyleSheets(hrefList: string[]): void {
        hrefList.forEach(href => {
            if (styleSheetLoaded.indexOf(href) === -1) {
                styleSheetLoaded.push(href);
                loadStyleSheet(href);
            }
        });
    }

    function loadJavaScriptFiles(scripts: IJavaScriptDependency[], callback: () => void): void {
        var loadingCount = scripts.length,
            parsingCount = loadingCount,
            sourceCodeList: IJavaScriptDependency[] = [];

        function parseIfLoadingComplete(): void {
            if (!--loadingCount) {
                parseJavaScriptSourceCodes(scripts, sourceCodeList);
            }
        }

        function makeCallbackIfParsingComplete(): void {
            if (!--parsingCount) {
                callback();
            }
        }

        scripts.forEach((script: IJavaScriptDependency, index: number) => {
            var file = script.javascriptFile;
            if (javaScriptFilesLoaded.indexOf(file) === -1) { // not loaded

                if (file in javaScriptFilesLoading) { // loading
                    javaScriptFilesLoading[file].push(() => {
                        parseIfLoadingComplete();
                        makeCallbackIfParsingComplete();
                    });

                } else { // not loading
                    javaScriptFilesLoading[file] = [() => {
                        makeCallbackIfParsingComplete();
                    }];

                    if (isExternalUrl(file)) { // external JS file
                        sourceCodeList[index] = script;
                        parseIfLoadingComplete();

                    } else { // internal JS file
                        loadJavaScriptSourceCode(file, (sourceCode: string) => {
                            sourceCodeList[index] = {javascriptFile: sourceCode};
                            parseIfLoadingComplete();
                        });
                    }
                }

            } else { // loaded
                parseIfLoadingComplete();
                makeCallbackIfParsingComplete();
            }
        });
    }

    function loadStyleSheet(href: string): void {
        var link = <any>linkElement.cloneNode();
        link.href = href;
        if (firstScriptInHeadElement) {
            headElement.insertBefore(link, firstScriptInHeadElement);
        } else {
            headElement.appendChild(link);
        }
    }

    function loadJavaScriptSourceCode(src: string, onload: (code: string) => void): void {
        webGet(src, function (): void {
            onload(this.responseText);
        });
    }

    function parseJavaScript(script: IJavaScriptDependency, onComplete: () => void = () => { }): void {
        if (!script) {
            onComplete();
            return;
        }

		var sourceCodeOrFileName = script.javascriptFile;

		var targetCallback = onComplete;
		if (script.onLoadCallback) {
			var promiseAsCallback = () => {
				script.onLoadCallback().then(onComplete);
			};
			targetCallback = promiseAsCallback;
		}

        isExternalUrl(sourceCodeOrFileName)
        ? loadExternalJavaScriptFile(sourceCodeOrFileName, targetCallback)
        : parseInternalJavaScriptCode(sourceCodeOrFileName, targetCallback);
    }

    function parseInternalJavaScriptCode(sourceCode: string, onComplete: () => void = () => { }): void {
        var script: HTMLElement;
        if (sourceCode) {
            script = <any>scriptElement.cloneNode();
            script.setAttribute('type', 'text/javascript');
            script.innerHTML = sourceCode;
            headElement.appendChild(script);
        }
        setTimeout(onComplete, 0);
    }

    function loadExternalJavaScriptFile(src, onload: () => void): void {
        var script: HTMLElement;
        if (src) {
            script = <any>scriptElement.cloneNode();
            script.setAttribute('src', src);
            script.setAttribute('charset', 'utf-8');
            script.onload = onload;
            headElement.appendChild(script);
        }
    }

    function parseJavaScriptSourceCodes(scripts: IJavaScriptDependency[], sourceCodeList: IJavaScriptDependency[]): void {
        asyncLoop(sourceCodeList, parseJavaScript, /*on all files parsed*/() => {
            scripts.forEach((script: IJavaScriptDependency) => {
                var file = script.javascriptFile;
                var listeners = javaScriptFilesLoading[file];
                if (listeners) {
                    listeners.forEach((listener) => {
                        listener();
                    });
                }

                delete javaScriptFilesLoading[file];
                if (javaScriptFilesLoaded.indexOf(file) === -1) {
                    javaScriptFilesLoaded.push(file);
                }
            });
        });
    }

    function webGet(src: string, onload: () => void, onerror?: (error: any) => void): void {
        var xhr = new XMLHttpRequest();

        try {
            xhr.open('GET', src, true);
            xhr.onload = onload;
            xhr.onerror = onerror;
            xhr.send(null);
        }
        catch (e) {
            // handle it
        }
    }

    function isExternalUrl(url: string): boolean {
        var origin = location.protocol + '//' + location.host + '/';
        return /^http[s]?:\/\/.+/i.test(url) && url.indexOf(origin) !== 0;
    }

    function _(...args: any[]): any { }

    function asyncSteps(...args: Function[]): void {
        if (args.length === 0) {
            return;
        }

        var steps = [],
            i = args.length;

        while (i--) {
            (function (j) {
                steps[j] = function () {
                    args[j](steps[j + 1] || _);
                };
            })(i);
        }
        steps[0]();
    }

    function asyncLoop(enumerable: any[], func: (item, next) => void, callback: () => void): void {
        var steps = [],
            i = 0,
            len = enumerable.length;

        for (; i < len - 1; i++) {
            (function (i) {
                steps[i] = (next) => {
                    func(enumerable[i], next);
                };
            } (i));
        }

        steps[len - 1] = (next) => {
            func(enumerable[len - 1], callback);
        };

        asyncSteps.apply(null, steps);
    }
}