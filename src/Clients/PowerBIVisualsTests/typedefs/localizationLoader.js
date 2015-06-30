//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var localization;
        (function (localization) {
            var LocalizationLoader = (function () {
                function LocalizationLoader(currentLanguageLocale) {
                    this.isDataLoaded = false;
                    this.isDataLoading = false;
                    this.isDefaultLanguage = false;
                    this.currentLanguageLocale = currentLanguageLocale;
                }
                LocalizationLoader.prototype.load = function (isOptional) {
                    var _this = this;
                    // for now, all English ones will map to en-US
                    var localeRegex = /en-\w+/;
                    //isOptional=true will not localize dashboard
                    if (localeRegex.test(this.currentLanguageLocale)) {
                        this.currentLanguageLocale = isOptional ? 'en-US' : this.currentLanguageLocale;
                    }
                    var task = LocalizationLoader.promiseFactory.defer();
                    if (this.currentLanguageLocale !== LocalizationLoader.defaultLanguageLocale) {
                        this.isDefaultLanguage = this.isDataLoaded = false;
                        this.isDataLoading = true;
                        // If we're not able to load localized strings,
                        // fallback to the default language 
                        LocalizationLoader.requestLocalizedStrings(this.currentLanguageLocale).promise.then(function (strings) {
                            _this.isDataLoaded = true;
                            _this.isDataLoading = false;
                            _this.strings = strings;
                            task.resolve({});
                        }, function () {
                            _this.isDefaultLanguage = _this.isDataLoaded = true;
                            _this.isDataLoading = false;
                            task.resolve({});
                        });
                    }
                    else {
                        this.isDefaultLanguage = this.isDataLoaded = true;
                        this.isDataLoading = false;
                        task.resolve({});
                    }
                    return task;
                };
                LocalizationLoader.requestLocalizedStrings = function (language) {
                    var task = LocalizationLoader.promiseFactory.defer();
                    var parentWindow = window.parent;
                    var currentWindow = window;
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
                };
                // TODO: Remove this local promise factory instance and use DI once localization loader is changed from singleton implementation.
                LocalizationLoader.promiseFactory = powerbi.createJQueryPromiseFactory();
                LocalizationLoader.defaultLanguageLocale = 'en-US';
                return LocalizationLoader;
            })();
            localization.LocalizationLoader = LocalizationLoader;
            localization.loader = new LocalizationLoader(powerbi.common.cultureInfo || window.navigator.language || window.navigator.userLanguage);
            localization.promiseLoad = localization.loader.load();
        })(localization = common.localization || (common.localization = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
