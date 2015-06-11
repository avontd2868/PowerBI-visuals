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

module powerbi.common.localization {
    /** 
     * If the browser's default language matches the default language of this service, use the embedded resources.
     * Otherwise, send HTTP request for localized string resources. Before the strings are ready, load default language
     * resources. Once they are ready, load it.
     * We separate the loading localized strings logics here because it should have nothing to do with Angular.
     * This ensures that the downloading (if necessary) happens before angular is loaded.
     */
    export interface ILocalizationWindow extends Window {
        localizedStrings: jsCommon.IStringDictionary<string>;
        queryStringValue: string;
    }

    export interface ILocalizationLoader {
        currentLanguageLocale: string;
        isDataLoaded: boolean;
        isDataLoading: boolean;
        isDefaultLanguage: boolean;
        strings: jsCommon.IStringDictionary<string>;
        load(isOptional?: boolean): IDeferred<{}>;
    }

    export class LocalizationLoader implements ILocalizationLoader {
        public currentLanguageLocale: string;
        public isDataLoaded: boolean = false;
        public isDataLoading: boolean = false;
        public isDefaultLanguage: boolean = false;
        public strings: jsCommon.IStringDictionary<string>;

        // TODO: Remove this local promise factory instance and use DI once localization loader is changed from singleton implementation.
        private static promiseFactory: IPromiseFactory = createJQueryPromiseFactory();
        private static defaultLanguageLocale: string = 'en-US';

        public constructor(currentLanguageLocale: string) {
            this.currentLanguageLocale = currentLanguageLocale;
        }

        public load(isOptional?: boolean): IDeferred<{}> {
            // for now, all English ones will map to en-US
            var localeRegex: RegExp = /en-\w+/;

            //isOptional=true will not localize dashboard
            if (localeRegex.test(this.currentLanguageLocale)) {
                this.currentLanguageLocale = isOptional ? 'en-US' : this.currentLanguageLocale;
            }

            var task = LocalizationLoader.promiseFactory.defer<{}>();
            if (this.currentLanguageLocale !== LocalizationLoader.defaultLanguageLocale) {
                this.isDefaultLanguage = this.isDataLoaded = false;
                this.isDataLoading = true;

                // If we're not able to load localized strings,
                // fallback to the default language 
                LocalizationLoader.requestLocalizedStrings(this.currentLanguageLocale).promise.then(
                    (strings: jsCommon.IStringDictionary<string>) => {
                        this.isDataLoaded = true;
                        this.isDataLoading = false;
                        this.strings = strings;
                        task.resolve({});
                    },
                    () => {
                        this.isDefaultLanguage = this.isDataLoaded = true;
                        this.isDataLoading = false;
                        task.resolve({});
                    });
            } else {
                this.isDefaultLanguage = this.isDataLoaded = true;
                this.isDataLoading = false;
                task.resolve({});
            }
            return task;
        }

        private static requestLocalizedStrings(language: string): IDeferred<jsCommon.IStringDictionary<string>> {
            var task = LocalizationLoader.promiseFactory.defer<jsCommon.IStringDictionary<string>>();
            var parentWindow = <ILocalizationWindow>window.parent;
            var currentWindow = <ILocalizationWindow>window;

            //If we have loaded localized strings for parent window, use it
            if (parentWindow.localizedStrings) {
                currentWindow.localizedStrings = parentWindow.localizedStrings;
                task.resolve(currentWindow.localizedStrings);
            }
            else {
                currentWindow.localizedStrings = powerbi.common.localizedStrings;
                if (!currentWindow.localizedStrings) {
                    task.reject();
                }
                else {
                    task.resolve(currentWindow.localizedStrings);
                }
            }
            return task;
        }
    }

    export var loader: LocalizationLoader = new LocalizationLoader(powerbi.common.cultureInfo || window.navigator.language || window.navigator.userLanguage);
    export var promiseLoad = loader.load();
}

