//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var Helpers = powerbitests.helpers;
        /** factory method to create the localization service. */
        function createLocalizationService(telemetryService, promiseFactory, loader) {
            if (loader === void 0) { loader = common.localization.loader; }
            return new LocalizationService(loader, telemetryService, promiseFactory);
        }
        common.createLocalizationService = createLocalizationService;
        /**
         * the translation service class which implements the common.ILocalizationService
         * For localized strings in view, use Localize directive to do the translation, apply watch on it and once loaded, deregister the watch.
         * For localized strings in controller, use rootScopt.emit to make a event call to only load the values once the strings are ready.
         * If the localized string ID doesn't exist, look for it in the default localized resources
         */
        var LocalizationService = (function () {
            function LocalizationService(loader, telemetryService, promiseFactory) {
                this.promiseFactory = promiseFactory || powerbi.createJQueryPromiseFactory();
                this.loader = loader;
                this.telemetryService = telemetryService;
            }
            Object.defineProperty(LocalizationService.prototype, "currentLanguageLocale", {
                get: function () {
                    return this.loader.currentLanguageLocale;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * localize the string according to the id
             * @param {string} id - the lookup id in dictionary.
             */
            LocalizationService.prototype.get = function (id) {
                return this.getImpl(id);
            };
            LocalizationService.prototype.getOptional = function (id) {
                return this.getImpl(id, true);
            };
            LocalizationService.prototype.ensureLocalization = function (action) {
                var isLoadedDeferred = this.promiseFactory.defer();
                if (this.loader.isDataLoaded) {
                    action();
                    isLoadedDeferred.resolve({});
                }
                else if (this.loader.isDataLoading) {
                    common.localization.promiseLoad.promise.then(function () {
                        action();
                        isLoadedDeferred.resolve({});
                    }, function () {
                        debug.assertFail("LocalizationLoader failed loading data");
                        isLoadedDeferred.resolve({});
                    });
                }
                else {
                    common.localization.promiseLoad = this.loader.load();
                    common.localization.promiseLoad.promise.then(function () {
                        action();
                        isLoadedDeferred.resolve({});
                    }, function () {
                        debug.assertFail("LocalizationLoader should not fail loading in any case");
                        isLoadedDeferred.resolve({});
                    });
                }
                return isLoadedDeferred;
            };
            LocalizationService.prototype.format = function (id, args) {
                var result = this.get(id);
                var index = args.length;
                while (index--) {
                    result = result.replace(new RegExp('\\{' + index + '\\}', 'gm'), this.formatValue(args[index]));
                }
                return result;
            };
            LocalizationService.prototype.formatValue = function (arg) {
                if (arg == null) {
                    return '';
                }
                else if (jsCommon.Utility.isString(arg)) {
                    return arg;
                }
                else if (jsCommon.Utility.isNumber(arg)) {
                    return arg.toLocaleString();
                }
                else if (jsCommon.Utility.isDate(arg)) {
                    return arg.toLocaleString();
                }
                else if (jsCommon.Utility.isObject(arg)) {
                    if (arg['toLocaleString'] != null) {
                        return arg['toLocaleString']();
                    }
                    else {
                        return arg.toString();
                    }
                }
                else {
                    return '';
                }
            };
            LocalizationService.prototype.getImpl = function (id, isOptional) {
                if (this.loader.isDataLoaded && !this.loader.isDefaultLanguage) {
                    var localizationValue = this.loader.strings[id];
                    if (!Helpers.isUndefined(localizationValue) && localizationValue !== null) {
                        return localizationValue;
                    }
                }
                var defaultValue = powerbi.localization.defaultLocalizedStrings[id];
                if (Helpers.isUndefined(defaultValue) || defaultValue === null) {
                    if (!isOptional && this.telemetryService) {
                        //this.telemetryService.logEvent(telemetry.LocalizationFailedToLoadStrings, this.currentLanguageLocale);
                        debug.assertFail('Localization Resource for ' + id + ' not found');
                    }
                }
                return defaultValue;
            };
            return LocalizationService;
        })();
        /** the localization service */
        common.localize;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
