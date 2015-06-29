///<reference path="../../typedefs/angularFileUpload/angular-file-upload.d.ts"/>
///<reference path="../../typedefs/angular/angular-route.d.ts"/>
///<reference path="../../typedefs/angular/angular.d.ts"/>
///<reference path="../../typedefs/d3/d3.d.ts"/>
///<reference path="../../Data/obj/data.d.ts"/>
///<reference path="../../FeatureSwitches/featureSwitches.d.ts"/>
///<reference path="../../InfoNav/obj/InfoNav.d.ts"/>
///<reference path="../../typedefs/interactjs/interact.d.ts"/>
///<reference path="../../typedefs/jquery-visible/jquery-visible.d.ts"/>
///<reference path="../../typedefs/jQuery/jQuery.d.ts"/>
///<reference path="../../JsCommon/obj/utility.d.ts"/>
///<reference path="../../Visuals/obj/visuals.d.ts"/>
///<reference path="../../typedefs/jquery.scrollbar/jquery.scrollbar.d.ts"/>
///<reference path="../../typedefs/jquery-throttle-debounce/jquery-throttle-debounce.d.ts"/>
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var registeredDirectives = [];
        (function (EndPoints) {
            EndPoints[EndPoints["Designer"] = 1] = "Designer";
            EndPoints[EndPoints["ExploreHost"] = 2] = "ExploreHost";
            EndPoints[EndPoints["Providers"] = 4] = "Providers";
            EndPoints[EndPoints["Web"] = 8] = "Web";
            EndPoints[EndPoints["WindowsApp"] = 16] = "WindowsApp";
            EndPoints[EndPoints["All"] = 1 /* Designer */ | 2 /* ExploreHost */ | 4 /* Providers */ | 8 /* Web */ | 16 /* WindowsApp */] = "All";
        })(common.EndPoints || (common.EndPoints = {}));
        var EndPoints = common.EndPoints;
        ;
        var commonDirectivesDefinition = [
            { name: 'ApplyStyle', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 8 /* Web */ },
            { name: 'AuthDialog', dependencies: [], consumerEndPointFlags: 4 /* Providers */ | 8 /* Web */ },
            { name: 'ClickTelemetry', dependencies: ['telemetryService'], consumerEndPointFlags: 1 /* Designer */ | 4 /* Providers */ | 8 /* Web */ },
            { name: 'CollapsibleSection', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 4 /* Providers */ | 8 /* Web */ },
            { name: 'DatasetParametersDialog', dependencies: [], consumerEndPointFlags: 4 /* Providers */ | 8 /* Web */ },
            { name: 'DialogConfirmContent', dependencies: [], consumerEndPointFlags: EndPoints.All },
            { name: 'DialogPromptContent', dependencies: [], consumerEndPointFlags: EndPoints.All },
            { name: 'Drag', dependencies: ['dragDataService'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'DragResize', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'DragScroll', dependencies: ['dragDataService'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'Drop', dependencies: ['dragDataService'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'DropdownOverlay', dependencies: ['overlayService'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'DropdownOverlayInvoke', dependencies: ['overlayService'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'DropdownMenu', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 8 /* Web */ | 16 /* WindowsApp */ },
            { name: 'DropdownMenuItems', dependencies: [], consumerEndPointFlags: 8 /* Web */ },
            { name: 'EditableLabel', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 8 /* Web */ },
            { name: 'FocusOn', dependencies: [], consumerEndPointFlags: 4 /* Providers */ },
            { name: 'InlineMessage', dependencies: [], consumerEndPointFlags: 4 /* Providers */ | 8 /* Web */ },
            { name: 'InlineNameValuePairs', dependencies: [], consumerEndPointFlags: 4 /* Providers */ | 8 /* Web */ },
            { name: 'Localize', dependencies: ['localizationService'], consumerEndPointFlags: EndPoints.All },
            { name: 'LocalizeTooltip', dependencies: ['localizationService'], consumerEndPointFlags: EndPoints.All },
            { name: 'ModalDialog', dependencies: [], consumerEndPointFlags: EndPoints.All },
            { name: 'ModalOverlay', dependencies: [], consumerEndPointFlags: 4 /* Providers */ },
            { name: 'ModalThreeButtonDialog', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 4 /* Providers */ | 8 /* Web */ },
            { name: 'NgRightClick', dependencies: ['$parse'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'NgRepeatFinishEvent', dependencies: ['$timeout'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'NgScrollbars', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'NotificationBar', dependencies: ['notificationBar'], consumerEndPointFlags: 8 /* Web */ },
            { name: 'PopupContainer', dependencies: [], consumerEndPointFlags: 8 /* Web */ | 1 /* Designer */ },
            { name: 'QnaQuestionbox', dependencies: ['localizationService'], consumerEndPointFlags: 2 /* ExploreHost */ | 4 /* Providers */ | 8 /* Web */ },
            { name: 'Resizable', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 8 /* Web */ },
            { name: 'Spinner', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 4 /* Providers */ | 8 /* Web */ },
            { name: 'ToolbarOverlay', dependencies: ['overlayService'], consumerEndPointFlags: 1 /* Designer */ | 8 /* Web */ },
            { name: 'Tooltip', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 8 /* Web */ },
            { name: 'Visual', dependencies: [], consumerEndPointFlags: 1 /* Designer */ | 2 /* ExploreHost */ | 8 /* Web */ | 16 /* WindowsApp */ }
        ];
        function registerDirectivesForEndPoint(endPoint) {
            for (var i = 0, len = commonDirectivesDefinition.length; i < len; i++) {
                var directive = commonDirectivesDefinition[i];
                var requiresDirective = (directive.consumerEndPointFlags & endPoint) === endPoint;
                if (requiresDirective)
                    registerCommonDirective(directive.name, directive.dependencies);
            }
        }
        common.registerDirectivesForEndPoint = registerDirectivesForEndPoint;
        /** used to pass telemetryService to child popup or iframe. Please DO NOT call this directly.*/
        common.parentTelemetryService;
        angular.module('powerbi.common', []);
        angular.module('powerbi.common.directives', []);
        angular.module('powerbi.common.controllers', []);
        angular.module('powerbi.common', ['powerbi.common.directives', 'powerbi.common.controllers']).factory('promiseFactory', ['$q', function ($q) { return powerbi.common.createPromiseFactory($q); }]).factory('scopedProvider', ['$injector', function ($injector) { return powerbi.common.createScopedProvider($injector); }]).factory('dragDataService', function () { return common.createDragDataService(); }).factory('overlayService', function () { return common.createOverlayService(); }).factory('dropdownMenuService', function () { return common.createDropdownMenuService(); }).factory('localizationService', function () { return powerbi.common.createLocalizationService(); }).factory('delayedQueryResultHandler', function () { return powerbi.common.createDelayedQueryResultHandler(); }).factory('tooltipService', function () { return powerbi.common.createTooltipService(); }).provider('featureSwitches', function () {
            var featureSwitchServiceProvider = this;
            featureSwitchServiceProvider.prototypeSwitches = new common.ClientFeatureSwitches();
            var webConfigBasedClientFeatureSwitch = window['featureSwitches'];
            if (webConfigBasedClientFeatureSwitch) {
                for (var key in webConfigBasedClientFeatureSwitch) {
                    if (typeof webConfigBasedClientFeatureSwitch[key] === 'function') {
                        featureSwitchServiceProvider.prototypeSwitches[key] = webConfigBasedClientFeatureSwitch[key]();
                    }
                }
            }
            var params = jsCommon.QueryStringUtil.parseQueryString(top.location.search);
            for (var key in featureSwitchServiceProvider.prototypeSwitches) {
                if (params[key])
                    featureSwitchServiceProvider.prototypeSwitches[key] = params[key] !== 'false';
            }
            featureSwitchServiceProvider.$get = ['$q', function ($q) { return powerbi.common.createEditableFeatureSwitchService($q, featureSwitchServiceProvider.prototypeSwitches); }];
            return featureSwitchServiceProvider;
        }).factory('visualPlugin', ['featureSwitchService', function (featureSwitchService) { return powerbi.visuals.visualPluginFactory.createDashboard(featureSwitchService.featureSwitches); }]).provider('dataProviderFactory', function () {
            var dataProviderFactoryProvider = this;
            dataProviderFactoryProvider.$get = ['promiseFactory', 'featureSwitchService', 'delayedQueryResultHandler', function (promiseFactory, featureSwitchService, delayedQueryResultHandler) {
                var httpService = powerbi.common.httpService;
                var plugins = {
                    dsr: {
                        name: 'dsr',
                        create: function (h) { return new powerbi.data.dsr.DsrDataProvider(h, dataProviderFactoryProvider.executeSemanticQueryProxyCommunication || powerbi.data.dsr.createExecuteSemanticQueryProxyHttpCommunication(httpService), delayedQueryResultHandler); },
                    },
                    bingNews: {
                        name: 'bingNews',
                        create: function (h) { return new powerbi.data.bingNews.BingNewsDataProvider(h, httpService); }
                    },
                };
                return powerbi.data.createDataProviderFactory(plugins);
            }];
            return dataProviderFactoryProvider;
        }).factory('dataProxy', ['promiseFactory', 'dataProviderFactory', function (promiseFactory, dataProviderFactory) { return powerbi.data.createDataProxy(promiseFactory, dataProviderFactory); }]).factory('singleExecutableDataProxyFactory', ['dataProxy', 'promiseFactory', function (dataProxy, promiseFactory, timerFactory) {
            return { create: function () { return powerbi.data.createSingleExecutableDataProxy(dataProxy, promiseFactory, timerFactory); } };
        }]).provider('telemetryService', function () {
            var telemetryServiceProvider = this;
            telemetryServiceProvider.$get = function () {
                // This is a workaround for a regression when we moved telemetry service from global service to angular service.
                // The code retrieves telemetry service with top most window powerbi app's telemetry service.
                // it accounts for different way child window is hosted <popup vs. iframe> and the fact some content provider's window hierarchy might be more than 2 levels.
                // TODO 4293161: the real fix is to pass in the session id when child is loaded; and have the child app's telemetry service to use the sessionid.
                var telemetryService;
                var parent = window;
                while (parent && parent.powerbi && parent.powerbi.common && parent.powerbi.common.parentTelemetryService && (parent.opener != null || parent !== parent.parent) && telemetryService == null) {
                    parent = parent.opener || parent.parent;
                    telemetryService = parent.powerbi && parent.powerbi.common.parentTelemetryService;
                }
                if (telemetryService)
                    return telemetryService;
                telemetryService = powerbi.createTelemetryService(telemetryServiceProvider.hostService);
                jsCommon.Trace.resetListeners();
                jsCommon.Trace.addListener(telemetryService);
                common.parentTelemetryService = telemetryService;
                return telemetryService;
            };
            return telemetryServiceProvider;
        }).factory('editableFeatureSwitchService', ['featureSwitches', function (featureSwitches) { return featureSwitches; }]).factory('featureSwitchService', ['featureSwitches', function (featureSwitches) { return featureSwitches; }]).factory('errorService', ['telemetryService', function (telemetryService) { return powerbi.common.createErrorService(telemetryService); }]).factory('themeService', function () { return powerbi.common.createThemeService(); }).factory('activeGroupId', function () { return powerbi.common.createActiveGroupIdService(); }).factory('notificationBar', function () { return powerbi.common.createNotificationBarService(); }).factory('viralTenantMergeHelperService', ['localizationService', function (localizationService) { return powerbi.common.createViralTenantMergeHelperService(localizationService); }]);
        function registerCommonDirective(className, services) {
            if (services === void 0) { services = []; }
            var directiveConstructorFn = powerbi.common.directives[className];
            registerDirective(className, directiveConstructorFn, services, true);
        }
        common.registerCommonDirective = registerCommonDirective;
        function registerDirective(directiveName, directiveConstructor, services, isCommonDirective) {
            if (services === void 0) { services = []; }
            if (isCommonDirective === void 0) { isCommonDirective = false; }
            debug.assertValue(directiveConstructor, 'directiveConstructor');
            var directive = directiveName[0].toLowerCase() + directiveName.slice(1);
            // prevent duplicate registration of directives
            if (registeredDirectives.indexOf(directive) >= 0)
                return;
            services.push(function () {
                var args = [];
                for (var i = 0, len = arguments.length; i < len; i++) {
                    args.push(arguments[i]);
                }
                //bind constructor with arguments passed in
                //[null] refers to the context directiveConstructor will be called on, needed for apply invocation
                var boundDirectiveConstructor = Function.prototype.bind.apply(directiveConstructor, [null].concat(args));
                return new boundDirectiveConstructor();
            });
            var moduleTarget = isCommonDirective ? 'powerbi.common.directives' : 'powerbi.directives';
            angular.module(moduleTarget).directive(directive, services);
            registeredDirectives.push(directive);
        }
        common.registerDirective = registerDirective;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var constants;
    (function (constants) {
        constants.activityId = 'ActivityId';
        constants.requestId = 'RequestId';
        constants.enableConfirmButtonEventName = 'enableConfirmButton';
        constants.disableConfirmButtonEventName = 'disableConfirmButton';
        constants.uploadFileSizeHeaderName = 'X-PowerBI-UploadFileSize';
        constants.previousTenantIdHeaderName = "X-PowerBI-User-PreviousTenantId";
        constants.liveClientIdKey = 'LiveClientId';
        constants.liveLogoutUrl = 'https://login.live.com/oauth20_logout.srf?client_id={0}&redirect_uri={1}/providers/excel/msaRedirect?logout=1';
        constants.loadPowerViewReportEventName = 'loadPowerViewReport';
        constants.reportContainerLoadedEventName = 'reportContainerLoaded';
        constants.loadExcelWorkbookEventName = 'loadExcelWorkbook';
        constants.visualDataChanged = 'visualDataChanged';
        constants.onReportChangedEventName = 'onReportChanged';
        constants.currentActiveReportInfoChangedEventName = 'currentActiveReportInfoChanged';
        constants.dragStartEventName = 'dragstart';
        constants.dragEnterEventName = 'dragenter';
        constants.dragOverEventName = 'dragover';
        constants.dragLeaveEventName = 'dragleave';
        constants.dropEventName = 'drop';
        constants.dragEndEventName = 'dragend';
        constants.DragResizeElementResizeStartEventName = 'DragResizeElementResizeStart';
        constants.DragResizeElementResizeMoveEventName = 'DragResizeElementResizeMove';
        constants.DragResizeElementResizeEndEventName = 'DragResizeElementResizeEnd';
        constants.DragResizeElementDragStartEventName = 'DragResizeElementDragStart';
        constants.DragResizeElementDragMoveEventName = 'DragResizeElementDragMove';
        constants.DragResizeElementDragEndEventName = 'DragResizeElementDragEnd';
        constants.editableLabelOnBlurEventName = 'editableLabelOnBlur';
        constants.openReportActionName = "/openReport";
        constants.tagName = 'tagName';
        constants.myWorkspaceGroupId = 'myWorkspaceId';
        var navigation;
        (function (navigation) {
            navigation.stateChangeStart = '$stateChangeStart';
            navigation.stateChangeSuccess = '$stateChangeSuccess';
            navigation.locationChangeStart = '$locationChangeStart';
            navigation.getDataDirectQueryUrlParams = 'advancedOptions&server&database&user&dsid';
            var states;
            (function (states) {
                states.reports = 'landing.reports';
                states.report = 'landing.reports.report';
                states.reportPage = 'landing.reports.report.page';
                states.datasets = 'landing.datasets';
                states.dataset = 'landing.datasets.dataset';
                states.workbooks = 'landing.workbooks';
            })(states = navigation.states || (navigation.states = {}));
        })(navigation = constants.navigation || (constants.navigation = {}));
        // if contract.row  > 50, then it is assumed that it is using old protocol
        constants.contractRowProtocolThreshold = 50;
        constants.datasetShowDatasourceUpdatedNotification = 'datasetShowDatasourceUpdatedNotification';
        constants.contentProviderStoreCloseModalDialogMessage = 'contentProviderStoreCloseModalDialogMessage';
        constants.scopeDestroyEventName = '$destroy';
        constants.oAuthRedirectUrl = 'https://preview.powerbi.com/views/oauthredirect.html';
        constants.preparingPackageRefreshNotificationDuration = 30000;
        constants.packageRefreshNotificationDuration = 300000;
        constants.notificationDuration = 5000;
        constants.showSettingsViewerEventName = 'showSettingsViewer';
        constants.defaultPopupWindowWidth = 980;
        constants.defaultPopupWindowHeight = 640;
        constants.datasetShowAuthDialog = 'datasetShowAuthDialog';
        // Refresh Settings
        constants.allWeekDays = 0x7F;
        constants.maxRefreshTimeNumber = 8;
        // Datasource connectionStringGeneralProperties key
        constants.database = "Database";
        constants.server = "Server";
        constants.errorCode = "ErrorCode";
        constants.time = "Time";
        constants.version = "Version";
        var serverErrors;
        (function (serverErrors) {
            serverErrors.packageOperationInProgress = 'PackageOperationInProgress';
            serverErrors.dataRefreshTooSoon = 'DataRefreshTooSoon';
        })(serverErrors = constants.serverErrors || (constants.serverErrors = {}));
        constants.contentProviderStoreTileListRefreshEventName = 'contentProviderStoreTileListRefresh';
        constants.contentProviderStoreConnectEventName = 'contentProviderStoreConnect';
        constants.contentProviderStoreMashupContentProviderLoadedMessage = 'contentProviderStoreMashupContentProviderLoadedMessage';
        constants.contentProviderStoreCloseModalDialogMessage = 'contentProviderStoreCloseModalDialogMessage';
        constants.contentProviderStoreRenderAsModalDialogMode = 'renderAsModalDialog';
        constants.contentProviderStoreRenderAsFullScreenMode = 'renderAsFullScreen';
        constants.contentProviderStoreTileLowestPriority = 999;
        constants.contentProviderStoreMicrosoftOrgAppEnabled = 'microsoftOrgAppEnabled';
        constants.contentProviderStoreVsoVnextAppEnabled = 'vsoVnextAppEnabled';
        constants.contentProviderStoreWithInDXTFeatureSwitchEnabled = 'withinDXT'; // TODO: fix 4842399:Rename 'withinDXT' to a more generic name (don't mention DXT)
        constants.contentProviderStoreAuthenticationParentScope = '$parentScope';
        constants.contentProviderStoreAuthorizationCodePostbackEventName = 'authorizationCodePostback';
        constants.contentProviderStoreZuoraAppEnabled = 'zuoraAppEnabled';
        constants.excelContentProviderId = 6;
        // Note: Ensure telemetry can identify sample dashboards generated by Retail Sales connect if content providers are changed
        constants.retailSamplesContentProviderId = 22;
        /** The map of content provider Ids to provider names that generate sample dashboards (as opposed to the shared sample dashboard) */
        constants.generatedSamplesContentProvidersMap = {
            22: 'Retail Sales Analysis',
        };
    })(constants = powerbi.constants || (powerbi.constants = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var models;
    (function (models) {
        // maps contentProviderId to its helpLink
        models.contentProviderHelpLink = {
            // appFigures
            13: 'http://go.microsoft.com/fwlink/?LinkId=546971',
            // Github
            19: 'http://go.microsoft.com/fwlink/?LinkID=528958',
            // Google Analytics
            10: 'http://go.microsoft.com/fwlink/?LinkID=528796',
            // MailChimp
            30: 'http://go.microsoft.com/fwlink/?LinkId=613552',
            // Marketo
            23: 'http://go.microsoft.com/fwlink/?LinkID=528959',
            // Microsoft Dynamics CRM
            16: 'http://go.microsoft.com/fwlink/?LinkID=528957',
            // Microsoft Dynamics Marketing
            17: 'http://go.microsoft.com/fwlink/?LinkID=528797',
            // QuickBooks Online
            20: 'http://go.microsoft.com/fwlink/?LinkId=613120',
            // Salesforce
            9: 'http://go.microsoft.com/fwlink/?LinkID=528963',
            // SendGrid
            26: 'http://go.microsoft.com/fwlink/?LinkID=528960',
            // SQL DB Auditing
            42: 'http://go.microsoft.com/fwlink/?LinkId=536680',
            // SQL Sentry
            41: 'http://go.microsoft.com/fwlink/?LinkId=613402',
            // SweetIQ
            52: 'http://go.microsoft.com/fwlink/?LinkId=615189',
            // Twilio
            14: 'http://go.microsoft.com/fwlink/?LinkId=544911',
            // UserVoice
            38: 'http://go.microsoft.com/fwlink/?LinkID=615577',
            // VSO
            18: 'http://go.microsoft.com/fwlink/?LinkId=533295',
            // Zenddesk
            24: 'http://go.microsoft.com/fwlink/?LinkID=528961',
        };
        models.contentProviderFallbackLink = "http://go.microsoft.com/fwlink/?LinkId=532757";
        models.excelWorkbookUploadFailedHelpLink = "https://go.microsoft.com/fwlink/?LinkId=525916";
    })(models = powerbi.models || (powerbi.models = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var helpers;
        (function (helpers) {
            var expiredTokenPromptHelper;
            (function (expiredTokenPromptHelper) {
                var expiredPowerBITokenEventAlreadyProcessed = false;
                var expiredBITokenEventAlreadyProcessed = false;
                function promptExpiredPowerBITokenRefreshDialog(telemetryService) {
                    if (!expiredPowerBITokenEventAlreadyProcessed) {
                        expiredPowerBITokenEventAlreadyProcessed = true;
                        telemetryService.logEvent(powerbi.telemetry.DashboardTokenRefreshPrompt);
                        promptTokenRefreshDialog();
                    }
                }
                expiredTokenPromptHelper.promptExpiredPowerBITokenRefreshDialog = promptExpiredPowerBITokenRefreshDialog;
                function promptExpiredBITokenRefreshDialog(telemetryService) {
                    if (!expiredBITokenEventAlreadyProcessed) {
                        expiredBITokenEventAlreadyProcessed = true;
                        telemetryService.logEvent(powerbi.telemetry.DashboardBITokenRefreshPrompt);
                        promptTokenRefreshDialog();
                    }
                }
                expiredTokenPromptHelper.promptExpiredBITokenRefreshDialog = promptExpiredBITokenRefreshDialog;
                function promptTokenRefreshDialog() {
                    // We want to use the errorService from the main window (even when we are inside of an IFrame) because:
                    //      - The dialog has to be displayed in the main window otherwise the "Refresh Page" button will refresh the IFrame instead of refreshing the main window
                    // If a window does not have a parent, its parent property is a reference to itself
                    var parentApp = parent.powerbi.common;
                    parentApp.errorService.fatalCustom(common.localize.get('ExpiredTokenError_Title'), common.localize.get('ExpiredTokenError_Text'), null);
                }
            })(expiredTokenPromptHelper = helpers.expiredTokenPromptHelper || (helpers.expiredTokenPromptHelper = {}));
        })(helpers = common.helpers || (common.helpers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var helpers;
        (function (helpers) {
            var ModelConverterHelper = (function () {
                function ModelConverterHelper() {
                }
                ModelConverterHelper.onpremGatewayRequired = function (model) {
                    var refreshConnections = model.refreshConnections;
                    var length = (refreshConnections !== undefined) ? refreshConnections.length : 0;
                    for (var i = 0; i < length; i++)
                        if (refreshConnections[i].onpremGatewayRequired)
                            return true;
                    return false;
                };
                ModelConverterHelper.convertRefreshTimeToJsDateTime = function (jsonDate) {
                    if (jsonDate) {
                        var start = jsonDate.indexOf('(');
                        var end = jsonDate.indexOf(')');
                        var milliseconds = jsonDate.substr(start + 1, end - start - 1);
                        var millisecondsInt = parseInt(milliseconds, 10);
                        if (isNaN(millisecondsInt)) {
                            common.localize.ensureLocalization(function () {
                                powerbi.common.errorService.error(common.localize.get('SettingsDataset_Error_InvalidDataFromServer_NextRefreshOrLastRefreshNaN'), 'SettingsDataset_Error_InvalidDataFromServer_NextRefreshOrLastRefreshNaN');
                            });
                            millisecondsInt = 0; // fallback
                        }
                        var jsDate = new Date(millisecondsInt);
                        return jsDate;
                    }
                    return null;
                };
                ModelConverterHelper.convertDiscoverAggregatedDatasourcesResponseToDatasources = function (modelId, aggregatedDatasourcesResponse) {
                    var datasources = new Array();
                    for (var i = 0, len = aggregatedDatasourcesResponse.length; i < len; i++) {
                        var datasource = ModelConverterHelper.convertModelDatasourceToDatasetDatasource(modelId, aggregatedDatasourcesResponse[i].discoverDataSourceEntry);
                        datasource.testConnectionState = (aggregatedDatasourcesResponse[i].discoverDataSourceEntry.credentialStatus === 0 /* HasCredential */) ? 1 /* NotStart */ : 0 /* NotSpecified */;
                        datasource.alreadyExecutedTestConnection = false;
                        datasources.push(datasource);
                    }
                    return datasources;
                };
                ModelConverterHelper.convertModelDatasourceToDatasetDatasource = function (modelId, modelDatasource) {
                    var settingDatasetCredentialTypes = new Array();
                    for (var j = 0; j < modelDatasource.credentialTypes.length; j++) {
                        settingDatasetCredentialTypes.push(common.contracts.CredentialType[modelDatasource.credentialTypes[j]]);
                    }
                    var datasetDatasource = {
                        modelId: modelId,
                        datasourceId: modelDatasource.dataSourceId,
                        name: (common.contracts.DatabaseType[24 /* Extension */]) === common.contracts.DatabaseType[modelDatasource.databaseType] ? modelDatasource.extensionDatabaseType : common.contracts.DatabaseType[modelDatasource.databaseType],
                        oAuth2URL: modelDatasource.oAuth2Endpoint,
                        oAuth2Nonce: modelDatasource.oAuth2Nonce,
                        databaseType: modelDatasource.databaseType,
                        credentialTypes: settingDatasetCredentialTypes,
                        connectionStringGeneralProperties: modelDatasource.connectionStringGeneralProperties,
                        onpremGatewayRequired: modelDatasource.onPremGatewayRequired
                    };
                    return datasetDatasource;
                };
                ModelConverterHelper.convertModelToDataset = function (model) {
                    var refreshSettings = {
                        importAndRefreshBehavior: model.refreshSchedule.importAndRefreshBehavior,
                        refreshEnabled: model.refreshSchedule.refreshEnabled,
                        refreshFrequencyIndex: model.refreshSchedule.isDaily ? 0 : 1,
                        refreshDays: ModelConverterHelper.convertModelWeekdaysToDatasetWeekdays(model.refreshSchedule.weekDays),
                        refreshTimeWindowIndex: ModelConverterHelper.getTimeWindowIndexFromExecutionTime(model.refreshSchedule.executionTime),
                        refreshTimesHourly: ModelConverterHelper.getTimeProWindowIndexFromExecutionTime(model.refreshSchedule.executionTimeHourly),
                        refreshTimeZoneId: model.refreshSchedule.localTimeZoneId,
                        sendFailureEmail: true,
                        isRefreshable: model.refreshSchedule.isRefreshable,
                        refreshNotificationEnabled: model.refreshSchedule.refreshNotificationEnabled,
                    };
                    var returnDataset = new common.models.SettingsDataset(model.id, model.displayName, model.description, (model.lastRefreshStatus === 4 /* RefreshError */) ? true : false, "", ModelConverterHelper.convertRefreshTimeToJsDateTime(model.nextRefreshTime).toString(), refreshSettings, model.parameters);
                    return returnDataset;
                };
                ModelConverterHelper.convertModelsToDatasets = function (modelCollection) {
                    var returnDatasets = new Array();
                    for (var i = 0; i < modelCollection.length; i++) {
                        var dataset = ModelConverterHelper.convertModelToDataset(modelCollection[i]);
                        returnDatasets.push(dataset);
                    }
                    return returnDatasets;
                };
                ModelConverterHelper.convertModelWeekdaysToDatasetWeekdays = function (modelWeekdays) {
                    var datasetWeekdays = new Array();
                    for (var i = 0; i < 7; i++) {
                        datasetWeekdays[i] = ((modelWeekdays & 1) === 1) ? true : false;
                        modelWeekdays = modelWeekdays >> 1;
                    }
                    return datasetWeekdays;
                };
                ModelConverterHelper.getTimeWindowIndexFromExecutionTime = function (executionTime) {
                    var timeWindowIndex;
                    if (executionTime === null) {
                        // nToDo - 3877298: This happens only for SamplesDashboard which we do not display. Disable this for public preview and figure out how to filter it out post public preview
                        //errorService.error(
                        //    common.localize.get('SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimeNull'),
                        //    'SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimeNull'
                        //    );
                        timeWindowIndex = 0; // fallback
                    }
                    else {
                        var executionTimeParts = executionTime.split(':');
                        var executionTimePartsHour = parseInt(executionTimeParts[0], 10);
                        if ((executionTimePartsHour >= 0) && (executionTimePartsHour < 24)) {
                            timeWindowIndex = Math.floor(executionTimePartsHour / 6);
                        }
                        else {
                            powerbi.common.errorService.error(common.localize.get('SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimeInvalidHour'), 'SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimeInvalidHour');
                            timeWindowIndex = 0; // fallback
                        }
                    }
                    return timeWindowIndex;
                };
                ModelConverterHelper.getTimeProWindowIndexFromExecutionTime = function (executionTimes) {
                    var refreshTimesHourly = [];
                    if (executionTimes) {
                        try {
                            var executionTimeList = JSON.parse(executionTimes);
                        }
                        catch (e) {
                            common.localize.ensureLocalization(function () {
                                powerbi.common.errorService.error(common.localize.get('SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidJsonFormat'), 'SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidJsonFormat');
                            });
                            return;
                        }
                        var length = executionTimeList.length;
                        for (var i = 0; i < length; i++) {
                            var executionTime = executionTimeList[i];
                            var executionTimeParts = executionTime.split(':');
                            var executionTimePartsHour = parseInt(executionTimeParts[0], 10);
                            var executionTimePartsMinutes = parseInt(executionTimeParts[1], 10);
                            if ((executionTimePartsHour < 0) || (executionTimePartsHour >= 24)) {
                                // ToDo - 3877298: add telemetry log for this
                                common.localize.ensureLocalization(function () {
                                    powerbi.common.errorService.error(common.localize.get('SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidHour'), 'SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidHour');
                                });
                            }
                            else if ((executionTimePartsMinutes < 0) || (executionTimePartsMinutes >= 60)) {
                                // ToDo - 3877298: add telemetry log for this
                                common.localize.ensureLocalization(function () {
                                    powerbi.common.errorService.error(common.localize.get('SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidMinute'), 'SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidMinute');
                                });
                            }
                            else {
                                var refreshTimeIndex = {
                                    refreshHourIndex: (executionTimePartsHour + 11) % 12,
                                    refreshMinuteIndex: Math.floor(executionTimePartsMinutes / 30),
                                    refreshAmPmIndex: Math.floor(executionTimePartsHour / 12),
                                    isIncomplete: false,
                                    isDuplicate: false,
                                };
                                refreshTimesHourly.push(refreshTimeIndex);
                            }
                        }
                    }
                    return refreshTimesHourly;
                };
                return ModelConverterHelper;
            })();
            helpers.ModelConverterHelper = ModelConverterHelper;
        })(helpers = common.helpers || (common.helpers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var helpers;
        (function (helpers) {
            var OAuthPopupWindowHelper = (function () {
                function OAuthPopupWindowHelper() {
                }
                OAuthPopupWindowHelper.popupOAuthWindow = function (redirectUri) {
                    var rootWindow = window;
                    if (window.parent !== window) {
                        rootWindow = window.parent;
                    }
                    return OAuthPopupWindowHelper.popUpWindow(redirectUri, rootWindow);
                };
                OAuthPopupWindowHelper.authResponse = function (parentWindow, oauthResponse) {
                    debug.assertValue(parentWindow, 'parentWindow');
                    debug.assertValue(oauthResponse, 'oauthResponse');
                    // if we can find the get-data iframe, we post a message back
                    // otherwise post message on own window
                    var providerWindow = parentWindow;
                    var iframeDocument = ($('iframe[name=contentProviderDialogFrame]')[0]);
                    if (iframeDocument) {
                        providerWindow = iframeDocument.contentWindow;
                    }
                    providerWindow.postMessage(JSON.stringify({ OAuthResponse: oauthResponse }), '*');
                };
                OAuthPopupWindowHelper.popUpWindow = function (url, rootWindow) {
                    var width = Math.max(Math.min(rootWindow.screen.width, powerbi.constants.defaultPopupWindowWidth), rootWindow.screen.width / 2);
                    var height = Math.max(Math.min(rootWindow.screen.height, powerbi.constants.defaultPopupWindowHeight), rootWindow.screen.height / 2);
                    var leftOffset = (rootWindow.outerWidth - width) / 2;
                    leftOffset += window.screenX;
                    var topOffset = (rootWindow.outerHeight - height) / 2;
                    topOffset += rootWindow.screenY;
                    rootWindow.name = 'mainWindow';
                    return rootWindow.open(url, '_blank', 'top=' + topOffset + ', left=' + leftOffset + ', screenX=' + leftOffset + ', screenY=' + topOffset + ', width=' + width + ', height=' + height + ', resizable=yes');
                };
                return OAuthPopupWindowHelper;
            })();
            helpers.OAuthPopupWindowHelper = OAuthPopupWindowHelper;
        })(helpers = common.helpers || (common.helpers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var helpers;
        (function (helpers) {
            var powerBICompanionHelper;
            (function (powerBICompanionHelper) {
                function getDownloadLink() {
                    var is64BitOS = jsCommon.Utility.is64BitOperatingSystem();
                    var powerBICompanionDownloadLink = clusterUri + "/powerbi/resource/powerbicompanionapp/";
                    if (is64BitOS)
                        powerBICompanionDownloadLink += "x64";
                    else
                        powerBICompanionDownloadLink += "x86";
                    return powerBICompanionDownloadLink;
                }
                powerBICompanionHelper.getDownloadLink = getDownloadLink;
                function getDownloadCenterLink(x64Link, x86Link) {
                    var is64BitOS = jsCommon.Utility.is64BitOperatingSystem();
                    if (is64BitOS)
                        return x64Link;
                    else
                        return x86Link;
                }
                powerBICompanionHelper.getDownloadCenterLink = getDownloadCenterLink;
            })(powerBICompanionHelper = helpers.powerBICompanionHelper || (helpers.powerBICompanionHelper = {}));
        })(helpers = common.helpers || (common.helpers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var helpers;
        (function (helpers) {
            var powerBIExcelHelper;
            (function (powerBIExcelHelper) {
                function getDownloadLink() {
                    var powerBISampleWorkbookDownloadLink = "https://go.microsoft.com/fwlink/?LinkID=521962";
                    return powerBISampleWorkbookDownloadLink;
                }
                powerBIExcelHelper.getDownloadLink = getDownloadLink;
            })(powerBIExcelHelper = helpers.powerBIExcelHelper || (helpers.powerBIExcelHelper = {}));
        })(helpers = common.helpers || (common.helpers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// no business logic in this file please
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var contracts;
        (function (contracts) {
            (function (PublishOrRefreshStatus) {
                PublishOrRefreshStatus[PublishOrRefreshStatus["FinishedSuccessfully"] = 0] = "FinishedSuccessfully";
                PublishOrRefreshStatus[PublishOrRefreshStatus["PublishInProgress"] = 1] = "PublishInProgress";
                PublishOrRefreshStatus[PublishOrRefreshStatus["PublishError"] = 2] = "PublishError";
                PublishOrRefreshStatus[PublishOrRefreshStatus["RefreshInProgress"] = 3] = "RefreshInProgress";
                PublishOrRefreshStatus[PublishOrRefreshStatus["RefreshError"] = 4] = "RefreshError";
            })(contracts.PublishOrRefreshStatus || (contracts.PublishOrRefreshStatus = {}));
            var PublishOrRefreshStatus = contracts.PublishOrRefreshStatus;
            (function (Permissions) {
                Permissions[Permissions["None"] = 0x0] = "None";
                Permissions[Permissions["Read"] = 0x1] = "Read";
                Permissions[Permissions["Write"] = 0x2] = "Write";
                Permissions[Permissions["ReShare"] = 0x4] = "ReShare";
                Permissions[Permissions["Explore"] = 0x8] = "Explore";
                Permissions[Permissions["CopyOnWrite"] = 0x11] = "CopyOnWrite";
                Permissions[Permissions["ReadWrite"] = Permissions.Read | Permissions.Write] = "ReadWrite";
                Permissions[Permissions["ReadReshare"] = Permissions.Read | Permissions.ReShare] = "ReadReshare";
                Permissions[Permissions["All"] = Permissions.ReadWrite | Permissions.ReShare] = "All";
            })(contracts.Permissions || (contracts.Permissions = {}));
            var Permissions = contracts.Permissions;
            (function (ImportAndRefreshBehavior) {
                ImportAndRefreshBehavior[ImportAndRefreshBehavior["DoNotGetData"] = 0x0] = "DoNotGetData";
                ImportAndRefreshBehavior[ImportAndRefreshBehavior["GetDataOnImport"] = 0x1] = "GetDataOnImport";
                ImportAndRefreshBehavior[ImportAndRefreshBehavior["GetDataOnRefresh"] = 0x2] = "GetDataOnRefresh";
                ImportAndRefreshBehavior[ImportAndRefreshBehavior["GetDataOnImportAndRefresh"] = ImportAndRefreshBehavior.GetDataOnImport | ImportAndRefreshBehavior.GetDataOnRefresh] = "GetDataOnImportAndRefresh";
            })(contracts.ImportAndRefreshBehavior || (contracts.ImportAndRefreshBehavior = {}));
            var ImportAndRefreshBehavior = contracts.ImportAndRefreshBehavior;
            (function (ServicePlan) {
                ServicePlan[ServicePlan["PowerBIServicePlan0"] = 0x1] = "PowerBIServicePlan0";
                ServicePlan[ServicePlan["PowerBIServicePlan1"] = 0x2] = "PowerBIServicePlan1";
                ServicePlan[ServicePlan["PowerBIServicePlan2"] = 0x4] = "PowerBIServicePlan2";
            })(contracts.ServicePlan || (contracts.ServicePlan = {}));
            var ServicePlan = contracts.ServicePlan;
            (function (CredentialStatus) {
                CredentialStatus[CredentialStatus["HasCredential"] = 0] = "HasCredential";
                CredentialStatus[CredentialStatus["NotSpecified"] = 1] = "NotSpecified";
            })(contracts.CredentialStatus || (contracts.CredentialStatus = {}));
            var CredentialStatus = contracts.CredentialStatus;
            (function (CredentialType) {
                CredentialType[CredentialType["Sql"] = 0] = "Sql";
                CredentialType[CredentialType["Windows"] = 1] = "Windows";
                CredentialType[CredentialType["Anonymous"] = 2] = "Anonymous";
                CredentialType[CredentialType["Basic"] = 3] = "Basic";
                CredentialType[CredentialType["Key"] = 4] = "Key";
                CredentialType[CredentialType["oAuth2"] = 5] = "oAuth2";
            })(contracts.CredentialType || (contracts.CredentialType = {}));
            var CredentialType = contracts.CredentialType;
            (function (DatabaseType) {
                DatabaseType[DatabaseType["Unknown"] = 0] = "Unknown";
                DatabaseType[DatabaseType["SqlServer"] = 1] = "SqlServer";
                DatabaseType[DatabaseType["Oracle"] = 2] = "Oracle";
                DatabaseType[DatabaseType["Teradata"] = 3] = "Teradata";
                DatabaseType[DatabaseType["Sybase"] = 4] = "Sybase";
                DatabaseType[DatabaseType["Db2"] = 5] = "Db2";
                DatabaseType[DatabaseType["MySql"] = 6] = "MySql";
                DatabaseType[DatabaseType["PostgreSql"] = 7] = "PostgreSql";
                DatabaseType[DatabaseType["SqlAzure"] = 8] = "SqlAzure";
                DatabaseType[DatabaseType["File"] = 9] = "File";
                DatabaseType[DatabaseType["Folder"] = 10] = "Folder";
                DatabaseType[DatabaseType["ActiveDirectory"] = 11] = "ActiveDirectory";
                DatabaseType[DatabaseType["Hdfs"] = 12] = "Hdfs";
                DatabaseType[DatabaseType["AzureMarketPlace"] = 13] = "AzureMarketPlace";
                DatabaseType[DatabaseType["HdInsight"] = 14] = "HdInsight";
                DatabaseType[DatabaseType["AzureBlob"] = 15] = "AzureBlob";
                DatabaseType[DatabaseType["AzureTable"] = 16] = "AzureTable";
                DatabaseType[DatabaseType["SAP"] = 17] = "SAP";
                DatabaseType[DatabaseType["SharePoint"] = 18] = "SharePoint";
                DatabaseType[DatabaseType["Web"] = 19] = "Web";
                DatabaseType[DatabaseType["ODATA"] = 20] = "ODATA";
                DatabaseType[DatabaseType["SharePointDocLib"] = 21] = "SharePointDocLib";
                DatabaseType[DatabaseType["PowerQueryMashup"] = 22] = "PowerQueryMashup";
                DatabaseType[DatabaseType["AnalysisServices"] = 23] = "AnalysisServices";
                DatabaseType[DatabaseType["Extension"] = 24] = "Extension";
                DatabaseType[DatabaseType["ODBC"] = 25] = "ODBC";
                DatabaseType[DatabaseType["OLEDB"] = 26] = "OLEDB";
                DatabaseType[DatabaseType["AdoNet"] = 27] = "AdoNet";
                DatabaseType[DatabaseType["Database"] = 28] = "Database";
            })(contracts.DatabaseType || (contracts.DatabaseType = {}));
            var DatabaseType = contracts.DatabaseType;
            (function (EncryptedConnection) {
                EncryptedConnection[EncryptedConnection["Encryption"] = 0] = "Encryption";
                EncryptedConnection[EncryptedConnection["NotEncryption"] = 1] = "NotEncryption";
            })(contracts.EncryptedConnection || (contracts.EncryptedConnection = {}));
            var EncryptedConnection = contracts.EncryptedConnection;
            (function (PrivacyLevel) {
                PrivacyLevel[PrivacyLevel["None"] = 0] = "None";
                PrivacyLevel[PrivacyLevel["Private"] = 1] = "Private";
                PrivacyLevel[PrivacyLevel["Organizational"] = 2] = "Organizational";
                PrivacyLevel[PrivacyLevel["Public"] = 3] = "Public";
            })(contracts.PrivacyLevel || (contracts.PrivacyLevel = {}));
            var PrivacyLevel = contracts.PrivacyLevel;
            (function (ContentProviderConfigurationUIStyle) {
                ContentProviderConfigurationUIStyle[ContentProviderConfigurationUIStyle["ModalDialog"] = 0] = "ModalDialog";
                ContentProviderConfigurationUIStyle[ContentProviderConfigurationUIStyle["FullScreen"] = 1] = "FullScreen";
                ContentProviderConfigurationUIStyle[ContentProviderConfigurationUIStyle["DirectConnect"] = 2] = "DirectConnect";
                ContentProviderConfigurationUIStyle[ContentProviderConfigurationUIStyle["LocalFile"] = 3] = "LocalFile";
                ContentProviderConfigurationUIStyle[ContentProviderConfigurationUIStyle["FWLink"] = 4] = "FWLink"; // No any content configuration UI will be displayed. Instead, the user will be redirected in a forward link defined in the manifest in new window.
            })(contracts.ContentProviderConfigurationUIStyle || (contracts.ContentProviderConfigurationUIStyle = {}));
            var ContentProviderConfigurationUIStyle = contracts.ContentProviderConfigurationUIStyle;
            // values must match those in managed PowerBIServiceContracts code
            (function (ContentProviderCategory) {
                ContentProviderCategory[ContentProviderCategory["Service"] = 1] = "Service";
                ContentProviderCategory[ContentProviderCategory["Organizational"] = 2] = "Organizational";
                ContentProviderCategory[ContentProviderCategory["File"] = 3] = "File";
                ContentProviderCategory[ContentProviderCategory["Sample"] = 4] = "Sample";
                ContentProviderCategory[ContentProviderCategory["Learn"] = 5] = "Learn";
                ContentProviderCategory[ContentProviderCategory["BigDataAndMore"] = 6] = "BigDataAndMore";
            })(contracts.ContentProviderCategory || (contracts.ContentProviderCategory = {}));
            var ContentProviderCategory = contracts.ContentProviderCategory;
            (function (ConfigurationPageType) {
                ConfigurationPageType[ConfigurationPageType["FullConfigurationFlow"] = 0] = "FullConfigurationFlow";
                ConfigurationPageType[ConfigurationPageType["LoginFlowOnly"] = 1] = "LoginFlowOnly";
            })(contracts.ConfigurationPageType || (contracts.ConfigurationPageType = {}));
            var ConfigurationPageType = contracts.ConfigurationPageType;
            (function (RefreshType) {
                RefreshType[RefreshType["Scheduled"] = 0x0] = "Scheduled";
                RefreshType[RefreshType["OnDemand"] = 0x1] = "OnDemand";
            })(contracts.RefreshType || (contracts.RefreshType = {}));
            var RefreshType = contracts.RefreshType;
        })(contracts = common.contracts || (common.contracts = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// no business logic in this file please
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var contracts;
        (function (contracts) {
            //TODO: iconUrl mapped to sprites
            contracts.contentProviderManifest = [
                {
                    id: 1003,
                    providerName: 'files-tutorial',
                    displayText: 'Learn about importing files',
                    displayTextLocalizationKey: 'GetData_FilesTutorial_Title',
                    iconCSSClass: 'content-provider-files-tutorial',
                    category: 3 /* File */,
                    configurationUIstyle: 4 /* FWLink */,
                    providerConfig: '{"FWLink":"http://go.microsoft.com/fwlink/?LinkID=613513"}',
                    sortPriority: powerbi.constants.contentProviderStoreTileLowestPriority
                },
                {
                    id: 1000,
                    providerName: 'local-file',
                    displayText: 'Local File',
                    displayTextLocalizationKey: 'GetData_LocalFile_Title',
                    iconCSSClass: 'content-provider-local-file',
                    category: 3 /* File */,
                    configurationUIstyle: 3 /* LocalFile */,
                    searchKeywords: 'Excel, PBIX, Power BI Designer',
                    sortPriority: 0
                },
                {
                    id: 1001,
                    providerName: 'onedrive-personal',
                    displayText: 'OneDrive - Personal',
                    displayTextLocalizationKey: 'GetData_OneDrivePersonal_Title',
                    iconCSSClass: 'content-provider-onedrive',
                    category: 3 /* File */,
                    configurationPageUrl: '/providers/cloudfile/onedrive',
                    configurationUIstyle: 1 /* FullScreen */,
                    disableDetailPane: true,
                    searchKeywords: 'Excel, PBIX, Power BI Designer',
                    sortPriority: 2,
                    authentication: {
                        oAuth: {
                            endpointRetrievalAPI: '/powerbi/providers/excel/authorizationEndpoint?storageProvider=1'
                        }
                    }
                },
                {
                    id: 1002,
                    providerName: 'onedrive-for-business',
                    displayText: 'OneDrive - Business',
                    displayTextLocalizationKey: 'GetData_OneDriveBusiness_Title',
                    iconCSSClass: 'content-provider-onedrive',
                    category: 3 /* File */,
                    configurationPageUrl: '/providers/cloudfile/onedrivepro',
                    configurationUIstyle: 1 /* FullScreen */,
                    disableDetailPane: true,
                    searchKeywords: 'Excel, PBIX, Power BI Designer',
                    sortPriority: 1,
                    disabledInArchivedContent: true
                },
                {
                    id: 25,
                    providerKey: '9f29a2e5-02d7-4420-b133-d0a663befe00',
                    providerName: 'sql-server-analysis-services',
                    displayText: 'SQL Server Analysis Services',
                    description: 'GetData_SqlServerAnalysisServices',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528956',
                    iconCSSClass: 'content-provider-sql-server-analysis-services',
                    category: 6 /* BigDataAndMore */,
                    configurationPageUrl: '/providers/AnalysisServer/',
                    configurationUIstyle: 1 /* FullScreen */,
                    sortPriority: 2
                },
                {
                    id: 38,
                    providerKey: 'B8EEABC6-26A4-4CAE-8F8E-E918E1D5BBE7',
                    providerName: 'uservoice',
                    displayText: 'UserVoice',
                    description: 'GetData_UserVoice',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=615577',
                    iconCSSClass: 'content-provider-uservoice',
                    smallIconCSSClass: 'content-provider-uservoice-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/UserVoice/?contentProviderId=38&displayText=UserVoice',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 19,
                    providerKey: 'cc2d7c39-cb58-4ff0-ac02-2e0d3f80508c',
                    providerName: 'github',
                    displayText: 'GitHub',
                    description: 'GetData_GitHub',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528958',
                    iconCSSClass: 'content-provider-github',
                    smallIconCSSClass: 'content-provider-github-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/GitHub/?contentProviderId=19&displayText=GitHub',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 13,
                    providerKey: '6ab8831d-b1f6-4f48-9b70-32a66a25fc75appfigures',
                    providerName: 'appfigures',
                    displayText: 'appFigures',
                    description: 'GetData_Appfigures',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=546971',
                    iconCSSClass: 'content-provider-appfigures',
                    smallIconCSSClass: 'content-provider-appfigures-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/AppFigures/?contentProviderId=13&displayText=appFigures',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 30,
                    providerKey: '629a1404-f870-421e-a5d0-daf455b1a15e',
                    providerName: 'mailchimp',
                    displayText: 'MailChimp',
                    description: 'GetData_Mailchimp',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=613552',
                    iconCSSClass: 'content-provider-mailchimp',
                    smallIconCSSClass: 'content-provider-mailchimp-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/MailChimp/?contentProviderId=30&displayText=MailChimp',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 42,
                    providerKey: '2128e7e4-9004-452c-86ab-4ce555effdf4',
                    providerName: 'sql-db-auditing',
                    displayText: 'SQL Database Auditing',
                    description: 'GetData_SqlDbAuditing',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=536680',
                    iconCSSClass: 'content-provider-sql-db-auditing',
                    smallIconCSSClass: 'content-provider-sql-db-auditing-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/SQLDBAuditing/?contentProviderId=42&displayText=SQL%20Database%20Auditing',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 14,
                    providerKey: '4d72ac76-d7d9-4d53-89ed-a7d210dcb985',
                    providerName: 'twilio',
                    displayText: 'Twilio',
                    description: 'GetData_Twilio',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=544911',
                    iconCSSClass: 'content-provider-twilio',
                    smallIconCSSClass: 'content-provider-twilio-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/Twilio/?contentProviderId=14&displayText=Twilio',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 10,
                    providerKey: 'badc1aad-ff6b-457f-87e5-9b93ee058ef0',
                    providerName: 'google-analytics',
                    displayText: 'Google Analytics',
                    description: 'GetData_GoogleAnalytics',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528796',
                    iconCSSClass: 'content-provider-google-analytics',
                    smallIconCSSClass: 'content-provider-google-analytics-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/GoogleAnalytics/?contentProviderId=10&displayText=Google%20Analytics',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 23,
                    providerKey: 'f17d3e2b-7248-49c6-af9e-ac9e594b8b06',
                    providerName: 'marketo',
                    displayText: 'Marketo',
                    description: 'GetData_Marketo',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528959',
                    iconCSSClass: 'content-provider-marketo',
                    smallIconCSSClass: 'content-provider-marketo-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/Marketo/?contentProviderId=23&displayText=Marketo',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 16,
                    providerKey: 'cafb2591-2578-4f88-a8c1-f1530b464696',
                    providerName: 'microsoft-dynamics-crm',
                    displayText: 'Microsoft Dynamics CRM',
                    description: 'GetData_MicrosoftDynamicsCrm',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528957',
                    iconCSSClass: 'content-provider-microsoft-dynamics-crm',
                    smallIconCSSClass: 'content-provider-microsoft-dynamics-crm-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/DynamicsCRM/?contentProviderId=16&displayText=Microsoft%20Dynamics%20CRM',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 17,
                    providerKey: '007a08ed-748b-4db3-9d0b-047f4295afa6',
                    providerName: 'microsoft-dynamics-marketing',
                    displayText: 'Microsoft Dynamics Marketing',
                    description: 'GetData_MicrosoftDynamicsMarketing',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528797',
                    iconCSSClass: 'content-provider-microsoft-dynamics-marketing',
                    smallIconCSSClass: 'content-provider-microsoft-dynamics-marketing-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/DynamicsMarketing/?contentProviderId=17&displayText=Microsoft%20Dynamics%20Marketing',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 22,
                    providerKey: 'bb35a484-389d-4cc6-ab18-57d6eef86a23',
                    providerName: 'retail-analysis-sample',
                    displayText: 'Retail Analysis Sample',
                    displayTextLocalizationKey: 'GetData_Retail_Analysis_Sample_Title',
                    description: 'GetData_Retail_Analysis_Sample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=522048',
                    iconCSSClass: 'content-provider-retail-analysis-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"RetailSalesSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */
                },
                {
                    id: 9,
                    providerKey: '909545e0-1c5e-44a9-b9db-bae412465c89',
                    providerName: 'salesforce',
                    displayText: 'Salesforce',
                    description: 'GetData_Salesforce',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528963',
                    iconCSSClass: 'content-provider-salesforce',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/salesforce',
                    configurationUIstyle: 1 /* FullScreen */,
                    authentication: {
                        oAuth: {
                            endpointRetrievalAPI: '/powerbi/providers/salesforce/authorizationEndpoint'
                        }
                    }
                },
                {
                    id: 26,
                    providerKey: '70d60c83-cf35-4d3a-a80f-37b653b5ff50',
                    providerName: 'sendgrid',
                    displayText: 'SendGrid',
                    description: 'GetData_Sendgrid',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528960',
                    iconCSSClass: 'content-provider-sendgrid',
                    smallIconCSSClass: 'content-provider-sendgrid-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/SendGrid/?contentProviderId=26&displayText=SendGrid',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 24,
                    providerKey: 'ccc45ff5-ea82-4a82-904d-913d5aba659d',
                    providerName: 'zendesk',
                    displayText: 'Zendesk',
                    description: 'GetData_Zendesk',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=528961',
                    iconCSSClass: 'content-provider-zendesk',
                    smallIconCSSClass: 'content-provider-zendesk-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/Zendesk/?contentProviderId=24&displayText=Zendesk',
                    configurationUIstyle: 0 /* ModalDialog */,
                    finePrint: 'GetData_Zendesk_FinePrint'
                },
                {
                    id: 29,
                    providerKey: '156B0EF1-E21C-4BEA-B187-6530269821F5',
                    providerName: 'zuora',
                    displayText: 'Zuora',
                    description: 'GetData_Zuora',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=615603',
                    iconCSSClass: 'content-provider-zuora',
                    smallIconCSSClass: 'content-provider-zuora-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashup/Zuora/?contentProviderId=29&displayText=Zuora',
                    configurationUIstyle: 0 /* ModalDialog */,
                    featureSwitch: powerbi.constants.contentProviderStoreZuoraAppEnabled
                },
                {
                    id: 62,
                    providerKey: 'EAF6690A-F3CD-4C8A-9BD2-A4F884857DC7',
                    providerName: 'acumatica',
                    displayText: 'Acumatica',
                    description: 'GetData_Acumatica',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=616430',
                    iconCSSClass: 'content-provider-acumatica',
                    smallIconCSSClass: 'content-provider-acumatica-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashup/Acumatica/?contentProviderId=62&displayText=Acumatica',
                    configurationUIstyle: 0 /* ModalDialog */,
                },
                {
                    id: 31,
                    providerKey: 'b019fa14-15cf-4baf-bc0f-0b4b07b2a2dc',
                    providerName: 'msft-it-new-technology-adoption',
                    displayText: 'Microsoft: IT New Technology Adoption',
                    description: 'GetData_MsftItNewTechnologyAdoption',
                    iconCSSClass: 'content-provider-msft-it-new-technology-adoption',
                    category: 2 /* Organizational */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"MSITNTA\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreMicrosoftOrgAppEnabled
                },
                {
                    id: 32,
                    providerKey: '09ea17d2-a321-4021-94b9-bb8949fd19b7',
                    providerName: 'msft-windows-uservoice',
                    displayText: 'Microsoft: Windows UserVoice',
                    description: 'GetData_MsftWindowsUservoice',
                    iconCSSClass: 'content-provider-msft-windows-uservoice',
                    category: 2 /* Organizational */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"WinUserVoice\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreMicrosoftOrgAppEnabled
                },
                {
                    id: 33,
                    providerKey: '0d2d1835-934a-486d-b712-b898e02a4353',
                    providerName: 'msft-digital-crimes-unit',
                    displayText: 'Microsoft: Digital Crimes Unit',
                    description: 'GetData_MsftDigitalCrimesUnit',
                    iconCSSClass: 'content-provider-msft-digital-crimes-unit',
                    category: 2 /* Organizational */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"DCU\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreMicrosoftOrgAppEnabled
                },
                {
                    id: 34,
                    providerKey: '4f1864d0-5c45-49e9-a721-8bf017e6d905',
                    providerName: 'msft-people-view',
                    displayText: 'Microsoft: People View',
                    description: 'GetData_MsftPeopleView',
                    iconCSSClass: 'content-provider-msft-people-view',
                    category: 2 /* Organizational */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"HR\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreMicrosoftOrgAppEnabled
                },
                {
                    id: 61,
                    providerKey: 'C9D39A14-FE1B-4952-B895-A3763B5C47B7',
                    providerName: 'visual-studio-online-vnext',
                    displayText: 'Visual Studio Online vNext',
                    description: 'GetData_VisualStudioOnlineVNext',
                    iconCSSClass: 'content-provider-visual-studio-online',
                    smallIconCSSClass: 'content-provider-visual-studio-online-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/VnextVisualStudioOnline/?contentProviderId=61&displayText=Visual%20Studio%20Online%20vNext',
                    configurationUIstyle: 0 /* ModalDialog */,
                    featureSwitch: powerbi.constants.contentProviderStoreVsoVnextAppEnabled
                },
                {
                    id: 27,
                    providerKey: '029a8b9d-b743-46d6-9f98-ee10b2873482',
                    providerName: 'stats-nfl-2014-season-recap',
                    displayText: 'STATS NFL 2014 Season Recap',
                    displayTextLocalizationKey: 'GetData_StatsNFL2014SeasonRecap_Title',
                    description: 'GetData_StatsNFL2014SeasonRecap',
                    iconCSSClass: 'content-provider-placeholder',
                    category: 1 /* Service */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"NFL2014SeasonRecap\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 50,
                    providerKey: '99baada2-cf09-41f2-afd9-6835059b94d3',
                    providerName: 'azure-sql-database-with-live-connect',
                    displayText: 'Azure SQL Database',
                    description: 'GetData_AzureSqlDatabaseWithLiveConnect',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=544900',
                    iconCSSClass: 'content-provider-sql-db-auditing',
                    category: 6 /* BigDataAndMore */,
                    configurationPageUrl: '/providers/sqlazure',
                    configurationUIstyle: 1 /* FullScreen */,
                    autoRedirectUrlParams: powerbi.constants.navigation.getDataDirectQueryUrlParams,
                    sortPriority: 0
                },
                {
                    id: 51,
                    providerKey: '9574d7ff-7b97-4917-9535-e67fd09393d2',
                    providerName: 'azure-sql-datawarehouse-live-connect',
                    displayText: 'Azure SQL Data Warehouse',
                    description: 'GetData_AzureSqlDatawarehouseLiveConnect',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=544902',
                    iconCSSClass: 'content-provider-azure-sql-datawarehouse-live-connect',
                    category: 6 /* BigDataAndMore */,
                    configurationPageUrl: '/providers/pdw',
                    configurationUIstyle: 1 /* FullScreen */,
                    autoRedirectUrlParams: powerbi.constants.navigation.getDataDirectQueryUrlParams,
                    sortPriority: 1
                },
                {
                    id: 70,
                    providerKey: '47024A6F-E6D5-4B93-937A-B6BA1226A223',
                    providerName: 'spark-sql-live-connect',
                    displayText: 'Spark on Azure HDInsight',
                    description: 'GetData_AzureHDInsightSparkLiveConnect',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=616055',
                    iconCSSClass: 'content-provider-spark-sql-live-connect',
                    category: 6 /* BigDataAndMore */,
                    configurationPageUrl: '/providers/spark',
                    configurationUIstyle: 1 /* FullScreen */,
                    autoRedirectUrlParams: powerbi.constants.navigation.getDataDirectQueryUrlParams,
                    sortPriority: 3
                },
                {
                    id: 18,
                    providerKey: 'be72f833-0a48-4311-935e-bb32bc05f0c6',
                    providerName: 'visual-studio-online',
                    displayText: 'Visual Studio Online',
                    description: 'GetData_VisualStudioOnline',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=533295',
                    iconCSSClass: 'content-provider-visual-studio-online',
                    smallIconCSSClass: 'content-provider-visual-studio-online-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/VisualStudioOnline/?contentProviderId=18&displayText=Visual%20Studio%20Online',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 20,
                    providerKey: 'd33ebf56-4499-4d43-970d-5edc2368d289',
                    providerName: 'quickbooks-online',
                    displayText: 'QuickBooks Online',
                    description: 'GetData_QuickbooksOnline',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkID=613120',
                    iconCSSClass: 'content-provider-quickbooks-online',
                    smallIconCSSClass: 'content-provider-quickbooks-online-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/QuickBooks/?contentProviderId=20&displayText=QuickBooks%20Online',
                    configurationUIstyle: 0 /* ModalDialog */
                },
                {
                    id: 1004,
                    providerName: 'business-user',
                    displayText: 'Business User',
                    displayTextLocalizationKey: 'GetData_BusinessUser_Title',
                    iconCSSClass: 'content-provider-business-user',
                    category: 5 /* Learn */,
                    configurationUIstyle: 4 /* FWLink */,
                    providerConfig: '{"FWLink":"http://go.microsoft.com/fwlink/?LinkID=613515"}',
                    sortPriority: 0
                },
                {
                    id: 1005,
                    providerName: 'business-analyst',
                    displayText: 'Business Analyst',
                    displayTextLocalizationKey: 'GetData_BusinessAnalyst_Title',
                    iconCSSClass: 'content-provider-business-analyst',
                    category: 5 /* Learn */,
                    configurationUIstyle: 4 /* FWLink */,
                    providerConfig: '{"FWLink":"http://go.microsoft.com/fwlink/?LinkID=613516"}',
                    sortPriority: 1
                },
                {
                    id: 1006,
                    providerName: 'bi-professional',
                    displayText: 'BI Professional',
                    displayTextLocalizationKey: 'GetData_BIProfessional_Title',
                    iconCSSClass: 'content-provider-bi-professional',
                    category: 5 /* Learn */,
                    configurationUIstyle: 4 /* FWLink */,
                    providerConfig: '{"FWLink":"http://go.microsoft.com/fwlink/?LinkID=613517"}',
                    sortPriority: 2
                },
                {
                    id: 1007,
                    providerName: 'developer',
                    displayText: 'Developer',
                    displayTextLocalizationKey: 'GetData_Developer_Title',
                    iconCSSClass: 'content-provider-developer',
                    category: 5 /* Learn */,
                    configurationUIstyle: 4 /* FWLink */,
                    providerConfig: '{"FWLink":"http://go.microsoft.com/fwlink/?LinkID=613518"}',
                    sortPriority: 3
                },
                {
                    id: 43,
                    providerKey: '8b5f82f6-9a6e-4135-92c6-f6072f111f4c',
                    providerName: 'human-resources-sample',
                    displayText: 'Human Resources Sample',
                    displayTextLocalizationKey: 'GetData_HumanResourcesSample_Title',
                    description: 'GetData_HumanResourcesSample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528586',
                    iconCSSClass: 'content-provider-human-resources-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"HumanResourcesSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 44,
                    providerKey: '7158743e-08ad-4884-9a20-4c66ef741812',
                    providerName: 'customer-profitability-sample',
                    displayText: 'Customer Profitability Sample',
                    displayTextLocalizationKey: 'GetData_CustomerProfitabilitySample_Title',
                    description: 'GetData_CustomerProfitabilitySample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528587',
                    iconCSSClass: 'content-provider-customer-profitability-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"CustomerProfitabilitySample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 45,
                    providerKey: 'bc6e5524-d894-46ef-8d0b-e99f42df8f31',
                    providerName: 'opportunity-analysis-sample',
                    displayText: 'Opportunity Analysis Sample',
                    displayTextLocalizationKey: 'GetData_OpportunityAnalysisSample_Title',
                    description: 'GetData_OpportunityAnalysisSample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528588',
                    iconCSSClass: 'content-provider-opportunity-analysis-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"OpportunityTrackingSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 46,
                    providerKey: '8b4eff17-adfe-485c-b6b7-d7df36f04c24',
                    providerName: 'it-spend-analysis-sample',
                    displayText: 'IT Spend Analysis Sample',
                    displayTextLocalizationKey: 'GetData_ITSpendAnalysisSample_Title',
                    description: 'GetData_ITSpendAnalysisSample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528589',
                    iconCSSClass: 'content-provider-it-spend-analysis-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"ITSpendAnalysisSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 47,
                    providerKey: '00100b6a-5aba-4de1-bf62-a3a91cdff527',
                    providerName: 'procurement-analysis-sample',
                    displayText: 'Procurement Analysis Sample',
                    displayTextLocalizationKey: 'GetData_ProcurementAnalysisSample_Title',
                    description: 'GetData_ProcurementAnalysisSample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528590',
                    iconCSSClass: 'content-provider-procurement-analysis-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"ProcurementAnalysisSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 48,
                    providerKey: 'e96a9f16-42da-4020-aae7-07315691b016',
                    providerName: 'sales-and-marketing-sample',
                    displayText: 'Sales and Marketing Sample',
                    displayTextLocalizationKey: 'GetData_SalesAndMarketingSample_Title',
                    description: 'GetData_SalesAndMarketingSample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528591',
                    iconCSSClass: 'content-provider-sales-and-marketing-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"SalesMarketingSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 49,
                    providerKey: '0ee5f075-5b0a-42a9-9e64-e9c5cb5e23c4',
                    providerName: 'supplier-quality-analysis-sample',
                    displayText: 'Supplier Quality Analysis Sample',
                    displayTextLocalizationKey: 'GetData_SupplierQualityAnalysisSample_Title',
                    description: 'GetData_SupplierQualityAnalysisSample',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=528585',
                    iconCSSClass: 'content-provider-supplier-quality-analysis-sample',
                    category: 4 /* Sample */,
                    providerConfig: '{\"dataAccessInfo\":{\"DSID\":\"{\\\"providerName\\\":\\\"SupplierQualityAnalysisSample\\\"}\",\"SID\":\"{GUID}\"}}',
                    configurationUIstyle: 2 /* DirectConnect */,
                    featureSwitch: powerbi.constants.contentProviderStoreWithInDXTFeatureSwitchEnabled
                },
                {
                    id: 52,
                    providerKey: 'F191E418-8585-45B3-BEA2-5D5CEBE9E981',
                    providerName: 'sweetiq',
                    displayText: 'SweetIQ',
                    description: 'GetData_SweetIQ',
                    learnMoreUrl: 'http://go.microsoft.com/fwlink/?LinkId=615189',
                    iconCSSClass: 'content-provider-sweetiq',
                    smallIconCSSClass: 'content-provider-sweetiq-small',
                    category: 1 /* Service */,
                    configurationPageUrl: '/providers/mashUp/SweetIQ/?contentProviderId=52&displayText=SweetIQ',
                    configurationUIstyle: 0 /* ModalDialog */
                }
            ];
        })(contracts = common.contracts || (common.contracts = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var CredentialType = powerbi.common.contracts.CredentialType;
            var DatabaseType = powerbi.common.contracts.DatabaseType;
            var EncryptedConnection = powerbi.common.contracts.EncryptedConnection;
            var pbiConstants = powerbi.constants;
            var PrivacyLevel = powerbi.common.contracts.PrivacyLevel;
            var AuthDialogController = (function () {
                function AuthDialogController($scope, $services) {
                    var _this = this;
                    this.scope = $scope;
                    this.model = this.scope.viewModel;
                    this.services = $services;
                    this.scope.customizeAuthDialog = function () { return _this.customizeAuthDialog(); };
                    this.scope.dismissSpinnerError = function () { return _this.dismissSpinnerError(); };
                    this.scope.signInThroughOAuth = function () { return _this.signInThroughOAuth(); };
                    this.initModalDialog();
                    this.initAuthDialog();
                    if (this.model && this.model.datasource && this.model.datasource.onpremGatewayRequired) {
                        var deferredEvent = this.services.telemetryService.startEvent(powerbi.telemetry.DashboardAuthenticationDiscoverPublicKey, this.model.providerId);
                        this.services.datasetsService.discoverPublicKey(deferredEvent.event).then(function (result) {
                            deferredEvent.resolve();
                            _this.gatewayPublicKey = atob(result.data.gatewayPublicKey).split(/<\/Modulus>|<Modulus>/)[1];
                            _this.cloudPublicKey = atob(result.data.cloudPublicKey).split(/<\/Modulus>|<Modulus>/)[1];
                            _this.entropy = [];
                            if (result.data.randomSecret) {
                                var entropyString = atob(result.data.randomSecret);
                                var entropyLength = entropyString.length;
                                for (var i = 0; i < entropyLength; i++) {
                                    _this.entropy.push(entropyString.charCodeAt(i));
                                }
                            }
                            else {
                                _this.entropy = jsCommon.EncryptionContext.generateEntropy();
                            }
                        }, function (result) {
                            // TODO show public key retrieve error
                            _this.scope.traceDetails = {
                                activityId: result.activityId,
                                requestId: result.requestId,
                                errorCode: result.status.toString(),
                                time: new Date().toString(),
                                version: powerbi.build
                            };
                            _this.model.showSpinner = false;
                            _this.model.showError = true;
                            _this.model.showWaitingMessageForOAuth = false;
                            _this.scope.dialogModel.isConfirmButtonDisabled = false;
                            deferredEvent.reject();
                        });
                    }
                }
                AuthDialogController.createOptions = function () {
                    return {
                        additionalServices: ['$window', 'datasetsService', 'telemetryService', 'localizationService']
                    };
                };
                AuthDialogController.prototype.relocateToLink = function () {
                    var helpLink = powerbi.models.contentProviderHelpLink[this.model.providerId];
                    if (helpLink) {
                        this.services.$window.open(helpLink, '_blank');
                    }
                    else {
                        this.services.$window.open(powerbi.models.contentProviderFallbackLink, '_blank');
                    }
                };
                AuthDialogController.prototype.initModalDialog = function () {
                    var _this = this;
                    this.scope.dialogModel = new common.models.ModalDialogModel(false, this.services.localizationService.get('AuthDialog_LinkText_SignIn'), true, false, false);
                    this.scope.dialogModel.cancelButtonText = this.services.localizationService.get('AuthDialog_CancelButtonText');
                    this.scope.dialogModel.isConfirmButtonDisabled = false;
                    this.scope.dialogModel.autoCloseDialogOnConfirmButtonSelected = false;
                    this.scope.dialogModel.confirmButtonImportance = common.models.ButtonImportance.Elevated;
                    this.scope.dialogModel.cancelButtonImportance = common.models.ButtonImportance.Elevated;
                    this.scope.relocateToLink = function () { return _this.relocateToLink(); };
                    this.scope.confirmDialog = function () { return _this.confirmDialog(); };
                    this.scope.closeDialog = function () { return _this.closeDialog(); };
                    this.scope.showOAuthError = false;
                    this.model.showModalDialog = true;
                    this.model.showError = false;
                };
                AuthDialogController.prototype.initAuthDialog = function () {
                    this.model.selectedAuthenticationIndex = 0; // needed to not generate 'empty options' in the select box
                    this.model.editableField1Value = "";
                    this.model.editableField2Value = "";
                    this.customizeAuthDialog();
                    this.dismissSpinnerError();
                };
                AuthDialogController.prototype.confirmDialog = function () {
                    // if it is OAuth do the SignIn first
                    if (this.model.datasource.credentialTypes[this.model.selectedAuthenticationIndex] === CredentialType[5 /* oAuth2 */]) {
                        if (this.scope.oAuthResponse === undefined) {
                            this.signInThroughOAuth();
                            return;
                        }
                    }
                    this.model.showSpinner = true;
                    this.updateDatasourceRequest();
                };
                AuthDialogController.prototype.sendUpdateDatasourceRequest = function (request, newVersion) {
                    if (newVersion === void 0) { newVersion = false; }
                    var telemetryService = this.services.telemetryService;
                    var controller = this;
                    this.scope.dialogModel.isConfirmButtonDisabled = true;
                    this.model.showError = false;
                    var deferredEvent;
                    if (this.model.isImportScenario)
                        deferredEvent = telemetryService.startEvent(powerbi.telemetry.MashUpContentProviderUpdateDatasource, this.model.providerId);
                    else
                        deferredEvent = telemetryService.startEvent(powerbi.telemetry.DashboardAuthenticationDialogSaveCredentials, this.model.providerId);
                    // Call UpdateDatasource with TestConnection
                    this.services.datasetsService.updateDatasource(this.model.datasource.datasourceId, true, newVersion, request, deferredEvent.event).then(function (result) {
                        deferredEvent.resolve();
                        controller.model.showSpinner = false;
                        controller.model.showWaitingMessageForOAuth = false;
                        controller.model.datasource.testConnectionState = 4 /* Passed */;
                        controller.scope.$emit(pbiConstants.datasetShowDatasourceUpdatedNotification, controller.model.datasource.name);
                        controller.closeDialog();
                    }, function (result) {
                        controller.scope.traceDetails = {
                            activityId: result.activityId,
                            requestId: result.requestId,
                            errorCode: result.status.toString(),
                            time: new Date().toString(),
                            version: powerbi.build
                        };
                        controller.model.showSpinner = false;
                        controller.model.showError = true;
                        controller.model.showWaitingMessageForOAuth = false;
                        controller.scope.dialogModel.isConfirmButtonDisabled = false;
                        deferredEvent.reject();
                    });
                };
                AuthDialogController.prototype.closeDialog = function () {
                    var _this = this;
                    this.model.showModalDialog = false;
                    if (this.scope.viewModel.showPlainUI) {
                        if (this.services.$window.parent != null) {
                            var contentProviderModalDialogMessage = {
                                message: powerbi.constants.contentProviderStoreCloseModalDialogMessage
                            };
                            this.services.$window.parent.postMessage(JSON.stringify(contentProviderModalDialogMessage), '*');
                        }
                    }
                    // why 'setTimeout'
                    //      if i set "showAuthDialog" here the 'auth-dialog' directive is distroyed by ng-if first and the 'modal-dialog' directive is left on the screen. 
                    //      because of that i have to delay it a bit so i set "showAuthDialog" inside a setTimeout
                    // however
                    //      this trick does not guaranties when 'showAuthDialog = false' gets executed, sometimes it takes a few seconds for the 'auth-dialog' directive to go away
                    //      because of that i need to force an apply here
                    // nToDo - 3877298: revisit this and if possible get rid of $apply
                    setTimeout(function () {
                        _this.model.showAuthDialog = false;
                        _this.scope.$apply();
                    }, 0);
                };
                AuthDialogController.prototype.customizeAuthDialog = function () {
                    switch (this.model.datasource.credentialTypes[this.model.selectedAuthenticationIndex]) {
                        case CredentialType[2 /* Anonymous */]:
                            this.customizeAuthDialogShowNothing();
                            break;
                        case CredentialType[3 /* Basic */]:
                            this.customizeAuthDialogShowUserNameAndPassword();
                            break;
                        case CredentialType[5 /* oAuth2 */]:
                            this.customizeAuthDialogShowSignIn();
                            break;
                        case CredentialType[4 /* Key */]:
                            this.customizeAuthDialogShowAccountKey();
                            break;
                        case CredentialType[0 /* Sql */]:
                            this.customizeAuthDialogShowUserNameAndPassword();
                            break;
                        case CredentialType[1 /* Windows */]:
                            this.customizeAuthDialogShowNothing();
                            break;
                    }
                };
                AuthDialogController.prototype.customizeAuthDialogShowUserNameAndPassword = function () {
                    this.model.showEditableField1 = true;
                    this.model.showEditableField2 = true;
                    this.model.showWaitingMessageForOAuth = false;
                    this.model.editableField1Label = this.services.localizationService.get('AuthDialog_FieldName_Username');
                    this.model.editableField2Label = this.services.localizationService.get('AuthDialog_FieldName_Password');
                };
                AuthDialogController.prototype.customizeAuthDialogShowAccountKey = function () {
                    this.model.showEditableField1 = true;
                    this.model.showEditableField2 = false;
                    this.model.showWaitingMessageForOAuth = false;
                    this.model.editableField1Label = this.services.localizationService.get('AuthDialog_FieldName_AccountKey');
                };
                AuthDialogController.prototype.customizeAuthDialogShowSignIn = function () {
                    this.model.showEditableField1 = false;
                    this.model.showEditableField2 = false;
                    this.model.showWaitingMessageForOAuth = false;
                };
                AuthDialogController.prototype.customizeAuthDialogShowNothing = function () {
                    this.model.showEditableField1 = false;
                    this.model.showEditableField2 = false;
                    this.model.showWaitingMessageForOAuth = false;
                    this.model.editableField1Label = '';
                };
                AuthDialogController.prototype.updateDatasourceRequest = function () {
                    var credentialDetails;
                    var privacyLevel = 1 /* Private */;
                    switch (this.model.datasource.credentialTypes[this.model.selectedAuthenticationIndex]) {
                        case CredentialType[2 /* Anonymous */]:
                            credentialDetails = []; // empty
                            privacyLevel = 3 /* Public */; // only anonymous use public privacy level
                            break;
                        case CredentialType[3 /* Basic */]:
                            credentialDetails = this.getCredentialDetailsUserNameAndPassword();
                            break;
                        case CredentialType[4 /* Key */]:
                            credentialDetails = this.getCredentialDetailsKey();
                            break;
                        case CredentialType[5 /* oAuth2 */]:
                            credentialDetails = this.getCredentialDetailsRedirectEndpoint();
                            break;
                        case CredentialType[0 /* Sql */]:
                            credentialDetails = this.getCredentialDetailsUserNameAndPassword();
                            break;
                        case CredentialType[1 /* Windows */]:
                            credentialDetails = []; // empty
                            break;
                        default:
                            break;
                    }
                    this.buildUpdateDatasourceRequest(credentialDetails, privacyLevel);
                };
                AuthDialogController.prototype.buildUpdateDatasourceRequest = function (credentialDetails, privacyLevel) {
                    var _this = this;
                    var encryptedConnection = ((this.model.datasource.databaseType === 8 /* SqlAzure */) || (this.model.datasource.databaseType === 1 /* SqlServer */)) ? 0 /* Encryption */ : 1 /* NotEncryption */;
                    var credentialType = this.model.datasource.credentialTypes[this.model.selectedAuthenticationIndex];
                    if (this.model.datasource.onpremGatewayRequired) {
                        if (credentialType === CredentialType[1 /* Windows */] || credentialType === CredentialType[2 /* Anonymous */]) {
                            var requestV2 = {
                                credentials: null,
                                credentialType: CredentialType[credentialType],
                                encryptedConnection: encryptedConnection,
                                privacyLevel: privacyLevel,
                                encryptionAlgorithmVersion: "RSA-OAEP"
                            };
                            this.sendUpdateDatasourceRequest(requestV2, true);
                        }
                        else {
                            var credentials = {
                                credentialDetails: credentialDetails,
                                connectionStringGeneralProperties: this.model.datasource.connectionStringGeneralProperties
                            };
                            var encryptionContext = new jsCommon.EncryptionContext(JSON.stringify(credentials), this.gatewayPublicKey, this.entropy, function (encryptedCrendentialBase64) {
                                var requestV2 = {
                                    credentials: encryptedCrendentialBase64,
                                    credentialType: CredentialType[credentialType],
                                    encryptedConnection: encryptedConnection,
                                    privacyLevel: privacyLevel,
                                    encryptionAlgorithmVersion: "RSA-OAEP"
                                };
                                _this.sendUpdateDatasourceRequest(requestV2, true);
                            });
                            encryptionContext.RSAEncrypt();
                        }
                    }
                    else {
                        var requestV1 = {
                            credentialDetails: credentialDetails,
                            credentialType: CredentialType[credentialType],
                            encryptedConnection: encryptedConnection,
                            privacyLevel: privacyLevel
                        };
                        this.sendUpdateDatasourceRequest(requestV1);
                    }
                };
                AuthDialogController.prototype.getCredentialDetailsUserNameAndPassword = function () {
                    var credentialDetails;
                    credentialDetails = [
                        { name: "userName", value: this.model.editableField1Value },
                        { name: "password", value: this.model.editableField2Value }
                    ];
                    return credentialDetails;
                };
                AuthDialogController.prototype.getCredentialDetailsKey = function () {
                    var credentialDetails;
                    credentialDetails = [
                        { name: "key", value: this.model.editableField1Value },
                    ];
                    return credentialDetails;
                };
                AuthDialogController.prototype.getCredentialDetailsRedirectEndpoint = function () {
                    var credentialDetails;
                    credentialDetails = [
                        { name: "redirectEndpoint", value: this.scope.oAuthResponse },
                        { name: "oAuth2Nonce", value: this.scope.viewModel.datasource.oAuth2Nonce }
                    ];
                    return credentialDetails;
                };
                AuthDialogController.prototype.dismissSpinnerError = function () {
                    this.model.showSpinner = false;
                    this.model.showError = false;
                };
                AuthDialogController.prototype.signInThroughOAuth = function () {
                    var _this = this;
                    var oAuthRequestUrl = this.scope.viewModel.datasource.oAuth2URL;
                    // We will show error message and block sign in process if user doesn't use HTTPS url           
                    if (oAuthRequestUrl.substring(0, 6).toLowerCase() !== 'https:') {
                        this.scope.showOAuthError = true;
                        return;
                    }
                    else {
                        this.scope.showOAuthError = false;
                    }
                    // Replace 'state' value with current host, which will be used in later redirection
                    var currentHost = window.location.host;
                    var modifiedValues = this.reformUrlWithNewState(oAuthRequestUrl, currentHost);
                    var state = modifiedValues[1];
                    var listener = function (event) {
                        var oAuthResponse = JSON.parse(event.data);
                        if (oAuthResponse && oAuthResponse.OAuthResponse) {
                            var oauthCode = oAuthResponse.OAuthResponse;
                            // Here we recover the response with original values
                            var response = powerbi.constants.oAuthRedirectUrl;
                            if (oauthCode.substring(0, 1) === '?')
                                response += oauthCode;
                            else
                                response += '?' + oauthCode;
                            _this.scope.oAuthResponse = decodeURIComponent(_this.reformUrlWithNewState(response, state)[0]);
                            _this.model.showWaitingMessageForOAuth = true;
                            _this.confirmDialog();
                        }
                        else {
                            _this.scope.showOAuthError = true;
                        }
                    };
                    this.services.$window.addEventListener(InJs.DOMConstants.messageEventName, listener);
                    this.scope.$on(powerbi.constants.scopeDestroyEventName, function () {
                        _this.services.$window.removeEventListener(InJs.DOMConstants.messageEventName, listener, false);
                    });
                    var modifiedUrl = modifiedValues[0];
                    // Pop up login window by using modifiedRequestUrl
                    if (modifiedUrl) {
                        var redirectUriParameters = {
                            'login_uri': modifiedUrl,
                            'redirect_targeturi': currentHost,
                        };
                        var redirectUri = powerbi.constants.oAuthRedirectUrl + jsCommon.QueryStringUtil.rebuildQueryString(redirectUriParameters);
                        var loginWindow = powerbi.common.helpers.OAuthPopupWindowHelper.popupOAuthWindow(redirectUri);
                        if (!loginWindow) {
                            this.scope.showOAuthError = true;
                        }
                    }
                };
                // This function will replace the state's value in the Url
                AuthDialogController.prototype.reformUrlWithNewState = function (currentUrl, newState) {
                    var queryParams = jsCommon.QueryStringUtil.parseQueryString(currentUrl.substring(currentUrl.indexOf('?')));
                    var oldState = null;
                    if (queryParams['state']) {
                        oldState = queryParams['state'];
                        queryParams['state'] = newState;
                    }
                    if (queryParams['#state']) {
                        oldState = queryParams['#state'];
                        queryParams['#state'] = newState;
                    }
                    var modifiedUrl = currentUrl.substring(0, currentUrl.indexOf('?')) + jsCommon.QueryStringUtil.rebuildQueryString(queryParams);
                    var result = [modifiedUrl, oldState];
                    return result;
                };
                return AuthDialogController;
            })();
            controllers.AuthDialogController = AuthDialogController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var CollapsibleSectionController = (function () {
                function CollapsibleSectionController($scope, services) {
                    this.scope = $scope;
                    this.services = services;
                    this.scope.localizedExpandedTitle = this.services.localizationService.get(this.scope.expandedTitleLocalizationId);
                    this.scope.localizedCollapsedTitle = this.services.localizationService.get(this.scope.collapsedTitleLocalizationId);
                }
                CollapsibleSectionController.createOptions = function () {
                    return {
                        additionalServices: ['localizationService']
                    };
                };
                return CollapsibleSectionController;
            })();
            controllers.CollapsibleSectionController = CollapsibleSectionController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var ModelConverterHelper = powerbi.common.helpers.ModelConverterHelper;
            var DatasetParametersDialogController = (function () {
                function DatasetParametersDialogController($scope, $services) {
                    this.scope = $scope;
                    this.model = this.scope.viewModel;
                    this.services = $services;
                    this.initModalDialog();
                }
                DatasetParametersDialogController.createOptions = function () {
                    return {
                        additionalServices: ['$window', 'datasetsService', 'errorService', 'telemetryService', 'localizationService']
                    };
                };
                DatasetParametersDialogController.prototype.relocateToLink = function () {
                    var helpLink = powerbi.models.contentProviderHelpLink[this.model.providerId];
                    if (helpLink) {
                        this.services.$window.open(helpLink, '_blank');
                    }
                    else {
                        this.services.$window.open(powerbi.models.contentProviderFallbackLink, '_blank');
                    }
                };
                DatasetParametersDialogController.prototype.initModalDialog = function () {
                    var _this = this;
                    var dialogModel = this.scope.dialogModel = new common.models.ModalDialogModel(false, this.services.localizationService.get('DatasetParametersDialog_NextButtonText'), true, false, false);
                    dialogModel.cancelButtonText = this.services.localizationService.get('DatasetParametersDialog_CancelButtonText');
                    dialogModel.isConfirmButtonDisabled = false;
                    dialogModel.autoCloseDialogOnConfirmButtonSelected = false;
                    dialogModel.confirmButtonImportance = common.models.ButtonImportance.Elevated;
                    dialogModel.cancelButtonImportance = common.models.ButtonImportance.Elevated;
                    this.scope.confirmDialog = function () { return _this.confirmDialog(); };
                    this.scope.closeDialog = function () { return _this.closeDialog(); };
                    this.scope.relocateToLink = function () { return _this.relocateToLink(); };
                };
                DatasetParametersDialogController.prototype.confirmDialog = function () {
                    var _this = this;
                    if (!this.areAllParametersValueSet()) {
                        this.model.showValidationError = true;
                        return;
                    }
                    this.model.showValidationError = false;
                    this.model.showSpinner = true;
                    var telemetryService = this.services.telemetryService;
                    var datasetsService = this.services.datasetsService;
                    var controller = this;
                    this.scope.dialogModel.isConfirmButtonDisabled = true;
                    if (controller.model.isImportScenario) {
                        var saveEvent = telemetryService.startEvent(powerbi.telemetry.MashUpContentProviderSaveModelParameters, controller.model.providerId);
                        // call UpdateParameters
                        common.mashupProviderService.updateMashUpProviderPackageModelParameters(controller.model.providerId, controller.model.datasetModel.dataset.parameters, saveEvent.event).then(function (dataAccessInfoResult) {
                            saveEvent.resolve();
                            var dai = dataAccessInfoResult.data;
                            controller.model.dataAccessInfo = dai;
                            var getDataSourceEvent = telemetryService.startEvent(powerbi.telemetry.MashUpContentProviderGetAggregatedDatasourcesForImport, controller.model.providerId);
                            datasetsService.getAggregatedDatasourcesForImport(controller.model.providerId.toString(), dai, false, getDataSourceEvent.event).then(function (result) {
                                getDataSourceEvent.resolve();
                                controller.model.datasetModel.dataset.datasources = ModelConverterHelper.convertDiscoverAggregatedDatasourcesResponseToDatasources(0, result.data);
                                if (!_this.scope.viewModel.showPlainUI) {
                                    controller.closeDialog();
                                }
                                else {
                                    _this.scope.viewModel.showDatasetParametersDialog = false;
                                }
                                // nToDo - 3877298: revisit this and if possible get rid of $apply
                                setTimeout(function () {
                                    controller.scope.$emit(powerbi.constants.datasetShowAuthDialog, 0);
                                    controller.scope.$apply();
                                }, 0);
                            }, function (result) {
                                _this.resetState();
                                datasetsService.displayOopsErrorAndEndTelemetry(telemetryService, _this.services.errorService, 'SettingsDataset_Error_FailedToLoadDatasources', result, getDataSourceEvent);
                            });
                        }, function (result) {
                            _this.resetState();
                            datasetsService.displayOopsErrorAndEndTelemetry(telemetryService, _this.services.errorService, 'DatasetParametersDialog_Error_FailedToUpdateModelParameters', result, saveEvent);
                        });
                    }
                    else {
                        var reentryEvent = telemetryService.startEvent(powerbi.telemetry.DashboardParametersDialogSaveParameters, controller.model.providerId);
                        // call UpdateParameters
                        datasetsService.updateModelParameters(controller.model.datasetModel.dataset.modelId.toString(), controller.model.datasetModel.dataset.parameters, reentryEvent.event).then(function (result) {
                            reentryEvent.resolve();
                            var getDataSourceEvent = telemetryService.startEvent(powerbi.telemetry.DashboardGetAggregatedDatasourcesForOneModel, controller.model.providerId);
                            datasetsService.getAggregatedDatasourcesForOneModel(controller.model.datasetModel.dataset.modelId.toString(), false, getDataSourceEvent.event).then(function (result) {
                                getDataSourceEvent.resolve();
                                controller.model.datasetModel.dataset.datasources = ModelConverterHelper.convertDiscoverAggregatedDatasourcesResponseToDatasources(controller.model.datasetModel.dataset.modelId, result.data);
                                controller.closeDialog();
                                // nToDo - 3877298: revisit this and if possible get rid of $apply
                                setTimeout(function () {
                                    controller.scope.$emit(powerbi.constants.datasetShowAuthDialog, 0);
                                    controller.scope.$apply();
                                }, 0);
                            }, function (result) {
                                _this.resetState();
                                datasetsService.displayOopsErrorAndEndTelemetry(telemetryService, _this.services.errorService, 'SettingsDataset_Error_FailedToLoadDatasources', result, getDataSourceEvent);
                            });
                        }, function (result) {
                            _this.resetState();
                            datasetsService.displayOopsErrorAndEndTelemetry(telemetryService, _this.services.errorService, 'DatasetParametersDialog_Error_FailedToUpdateModelParameters', result, reentryEvent);
                        });
                    }
                };
                DatasetParametersDialogController.prototype.closeDialog = function () {
                    this.resetState();
                    this.model.showDatasetParametersDialog = false;
                    if (this.scope.viewModel.showPlainUI) {
                        if (this.services.$window.parent != null) {
                            var contentProviderModalDialogMessage = {
                                message: powerbi.constants.contentProviderStoreCloseModalDialogMessage
                            };
                            this.services.$window.parent.postMessage(JSON.stringify(contentProviderModalDialogMessage), '*');
                        }
                    }
                };
                DatasetParametersDialogController.prototype.resetState = function () {
                    this.model.showSpinner = false; // dismiss the spinner so next time when we pop up the dialog it won't continue to spin
                    this.scope.dialogModel.isConfirmButtonDisabled = false;
                };
                DatasetParametersDialogController.prototype.areAllParametersValueSet = function () {
                    return _.filter(this.model.datasetModel.dataset.parameters, function (value) { return value.value === undefined || value.value === ''; }).length === 0;
                };
                return DatasetParametersDialogController;
            })();
            controllers.DatasetParametersDialogController = DatasetParametersDialogController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            (function (DragResizeRestriction) {
                DragResizeRestriction[DragResizeRestriction["Parent"] = 1] = "Parent";
                DragResizeRestriction[DragResizeRestriction["None"] = 2] = "None";
            })(controllers.DragResizeRestriction || (controllers.DragResizeRestriction = {}));
            var DragResizeRestriction = controllers.DragResizeRestriction;
            (function (DragResizeHandleDirections) {
                DragResizeHandleDirections[DragResizeHandleDirections["Up"] = 1] = "Up";
                DragResizeHandleDirections[DragResizeHandleDirections["Down"] = 2] = "Down";
                DragResizeHandleDirections[DragResizeHandleDirections["Left"] = 4] = "Left";
                DragResizeHandleDirections[DragResizeHandleDirections["Right"] = 8] = "Right";
                DragResizeHandleDirections[DragResizeHandleDirections["UpLeft"] = 16] = "UpLeft";
                DragResizeHandleDirections[DragResizeHandleDirections["UpRight"] = 32] = "UpRight";
                DragResizeHandleDirections[DragResizeHandleDirections["DownLeft"] = 64] = "DownLeft";
                DragResizeHandleDirections[DragResizeHandleDirections["DownRight"] = 128] = "DownRight";
                DragResizeHandleDirections[DragResizeHandleDirections["All"] = 255] = "All";
            })(controllers.DragResizeHandleDirections || (controllers.DragResizeHandleDirections = {}));
            var DragResizeHandleDirections = controllers.DragResizeHandleDirections;
            var DragResizeElement = (function () {
                function DragResizeElement(element, options) {
                    this.resizeHandleDirections = 255 /* All */;
                    this.dimensions = {};
                    this.restricted = {};
                    if (!window.interact)
                        return;
                    interact.pointerMoveTolerance(DragResizeElement.DefaultPointerMoveTolerance);
                    this.element = element;
                    this.rawElement = this.element.get(0);
                    if (options) {
                        this.options = options;
                        this.snapToGridIfNeeded();
                        this.options = this.extend({
                            minWidth: DragResizeElement.MinWidth,
                            minHeight: DragResizeElement.MinHeight,
                            maxWidth: DragResizeElement.MaxWidth,
                            maxHeight: DragResizeElement.MaxHeight,
                            maintainAspectRatio: false,
                            autoScrollParent: null,
                            inertia: true,
                            disableDrawing: false
                        }, this.options);
                    }
                    this.resizeHandleDirections = (this.options && this.options.resizeHandleDirections) ? this.options.resizeHandleDirections : this.resizeHandleDirections;
                    if (this.element && this.element.length > 0) {
                        this.element.addClass(DragResizeElement.DragResizeElementClass);
                        this.attachDragHandle();
                        this.attachResizeHandles();
                    }
                }
                DragResizeElement.prototype.destroy = function () {
                    if (typeof this.dragInteractable !== 'undefined') {
                        this.dragInteractable.unset();
                    }
                    if (typeof this.resizeInteractable !== 'undefined') {
                        this.resizeInteractable.unset();
                    }
                    if (this.autoScrollParent) {
                        this.autoScrollParent.off('scroll', this.autoScrollParentScrollHandlerFn);
                    }
                };
                DragResizeElement.prototype.getResizeHandleDirectionArray = function () {
                    var result = [];
                    var resizeHandleDirections = this.options.resizeHandleDirections;
                    if (resizeHandleDirections & 1 /* Up */) {
                        result.push('up');
                    }
                    if (resizeHandleDirections & 2 /* Down */) {
                        result.push('down');
                    }
                    if (resizeHandleDirections & 4 /* Left */) {
                        result.push('left');
                    }
                    if (resizeHandleDirections & 8 /* Right */) {
                        result.push('right');
                    }
                    if (resizeHandleDirections & 16 /* UpLeft */) {
                        result.push('up-left');
                    }
                    if (resizeHandleDirections & 32 /* UpRight */) {
                        result.push('up-right');
                    }
                    if (resizeHandleDirections & 64 /* DownLeft */) {
                        result.push('down-left');
                    }
                    if (resizeHandleDirections & 128 /* DownRight */) {
                        result.push('down-right');
                    }
                    return result;
                };
                DragResizeElement.prototype.getRestrictionString = function () {
                    var restriction;
                    switch (this.options.restriction) {
                        case 1 /* Parent */:
                            restriction = 'parent';
                            break;
                        case 2 /* None */:
                            restriction = '';
                            break;
                    }
                    return restriction;
                };
                DragResizeElement.prototype.attachDragHandle = function () {
                    var _this = this;
                    var rawElem = this.element.get(0);
                    var autoScrollParent = this.options.autoScrollParent;
                    this.dragInteractable = interact(rawElem).styleCursor(false).ignoreFrom('[draggable=true], [drag-resize-disabled=true]').draggable({
                        inertia: this.options.inertia,
                        restrict: this.getRestrictionString().length === 0 ? undefined : {
                            restriction: this.getRestrictionString(),
                            endOnly: false,
                            elementRect: {
                                top: 0,
                                left: 0,
                                bottom: 1,
                                right: 1
                            }
                        },
                        autoScroll: autoScrollParent === null ? undefined : {
                            enabled: true,
                            container: autoScrollParent[0],
                        },
                        onstart: function (event) { return _this.onDragStart(event); },
                        onmove: function (event) { return _this.onDragMove(event); },
                        onend: function (event) { return _this.onDragEnd(event); }
                    });
                    var prevTopScroll = 0;
                    var prevLeftScroll = 0;
                    var deferUntilNextFrame = jsCommon.DeferUtility.deferUntilNextFrame;
                    if (autoScrollParent) {
                        this.autoScrollParent = autoScrollParent;
                        this.autoScrollParentScrollHandlerFn = deferUntilNextFrame(function () {
                            // No sense looking at the DOM for scroll offsets if we're not dragging...
                            if (!_this.element.hasClass(DragResizeElement.DraggingClass))
                                return;
                            var scrollTop = autoScrollParent.scrollTop();
                            var scrollLeft = autoScrollParent.scrollLeft();
                            var dx = scrollLeft - prevLeftScroll;
                            var dy = scrollTop - prevTopScroll;
                            if ((dx !== 0 || dy !== 0)) {
                                _this.onDragMove({ dx: dx, dy: dy });
                            }
                            prevTopScroll = scrollTop;
                            prevLeftScroll = scrollLeft;
                        });
                        autoScrollParent.on('scroll.dragResizeElement', this.autoScrollParentScrollHandlerFn);
                    }
                };
                DragResizeElement.prototype.onDragStart = function (event) {
                    this.dimensions = this.getDimensionsFromElement(this.element);
                    this.element.addClass(DragResizeElement.DraggingClass);
                    this.notifyDragStart(this.dimensions);
                };
                DragResizeElement.prototype.onDragMove = function (event) {
                    this.dimensions.x += event.dx;
                    this.dimensions.y += event.dy;
                    this.draw(this.dimensions);
                    this.notifyDragMove(this.dimensions);
                };
                DragResizeElement.prototype.onDragEnd = function (event) {
                    this.element.removeClass(DragResizeElement.DraggingClass);
                    this.snapToGridIfNeeded();
                    this.notifyDragEnd(this.dimensions);
                };
                DragResizeElement.prototype.attachResizeHandles = function () {
                    var _this = this;
                    var resizeHandleDirectionArray = this.getResizeHandleDirectionArray();
                    for (var i = 0, len = resizeHandleDirectionArray.length; i < len; i++) {
                        var resizeHandle = $('<div/>').addClass(DragResizeElement.ResizeHandleClass).attr(DragResizeElement.ResizeHandleDataDirectionAttr, resizeHandleDirectionArray[i]).appendTo(this.element);
                        if (this.options.useCustomResizeHandles)
                            resizeHandle.addClass(DragResizeElement.CustomResizeHandleClass);
                    }
                    this.resizeInteractable = interact('.resizeHandle', { context: this.rawElement }).styleCursor(false).ignoreFrom('[draggable=true], [drag-resize-disabled=true]').draggable({
                        restrict: {
                            restriction: this.getRestrictionString() === "" ? undefined : this.element.parent().get(0),
                            elementRect: {
                                top: 0,
                                left: 0,
                                bottom: 1,
                                right: 1
                            }
                        },
                        onstart: function (event) { return _this.onResizeStart(event); },
                        onmove: function (event) { return _this.onResizeMove(event); },
                        onend: function (event) { return _this.onResizeEnd(event); }
                    });
                };
                DragResizeElement.prototype.onResizeStart = function (event) {
                    var handle = event.target;
                    this.element.addClass(DragResizeElement.ResizingClass);
                    this.dimensions = this.getDimensionsFromElement(this.element);
                    this.resizeStartRect = {
                        left: this.dimensions.x,
                        top: this.dimensions.y,
                        right: this.dimensions.x + this.dimensions.width,
                        bottom: this.dimensions.y + this.dimensions.height,
                        width: this.dimensions.width,
                        height: this.dimensions.height
                    };
                    var handleDir = handle.getAttribute('data-direction');
                    this.resizeDirection = {
                        up: /up/.test(handleDir),
                        down: /down/.test(handleDir),
                        left: /left/.test(handleDir),
                        right: /right/.test(handleDir)
                    };
                    this.extend(this.restricted, this.dimensions);
                    this.notifyResizeStart(this.dimensions);
                };
                DragResizeElement.prototype.onResizeMove = function (event) {
                    var minWidth = this.options.minWidth;
                    var minHeight = this.options.minHeight;
                    var maxWidth = this.options.maxWidth;
                    var maxHeight = this.options.maxHeight;
                    if (this.resizeDirection.left) {
                        this.dimensions.x += event.dx;
                        this.dimensions.width -= event.dx;
                    }
                    if (this.resizeDirection.up) {
                        this.dimensions.y += event.dy;
                        this.dimensions.height -= event.dy;
                    }
                    if (this.resizeDirection.right) {
                        this.dimensions.width += event.dx;
                    }
                    if (this.resizeDirection.down) {
                        this.dimensions.height += event.dy;
                    }
                    var width = this.dimensions.width;
                    var height = this.dimensions.height;
                    if (this.options.maintainAspectRatio) {
                        var ratio = Math.sqrt(width * width + height * height) / Math.sqrt(minWidth * minWidth + minHeight * minHeight);
                        height = minHeight * ratio;
                        width = minWidth * ratio;
                    }
                    this.restricted.width = Math.min(Math.max(width, minWidth), maxWidth);
                    this.restricted.height = Math.min(Math.max(height, minHeight), maxHeight);
                    if (this.resizeDirection.left) {
                        this.restricted.x = this.resizeStartRect.right - this.restricted.width;
                    }
                    if (this.resizeDirection.up) {
                        this.restricted.y = this.resizeStartRect.bottom - this.restricted.height;
                    }
                    this.draw(this.restricted);
                    this.notifyResizeMove(this.restricted);
                };
                DragResizeElement.prototype.onResizeEnd = function (event) {
                    this.element.removeClass(DragResizeElement.ResizingClass);
                    this.extend(this.dimensions, this.restricted);
                    this.snapToGridIfNeeded();
                    this.notifyResizeEnd(this.dimensions);
                };
                DragResizeElement.prototype.getDimensionsFromElement = function (element) {
                    var position = this.getPositionFromElement(element);
                    var size = this.getSizeFromElement(element);
                    return { x: position.x, y: position.y, width: size.width, height: size.height };
                };
                DragResizeElement.prototype.getSizeFromElement = function (element) {
                    return { width: element.width(), height: element.height() };
                };
                DragResizeElement.prototype.getPositionFromElement = function (element) {
                    var rawElemStyle = element.get(0).style;
                    // IE will recognize "webkitTransform" as "WebkitTransform" and set that as style property. This means transform property is not read. We put the "transform" before the "webkitTransform" to counteract the weirdness of IE. 
                    var transformString = rawElemStyle.transform || rawElemStyle.webkitTransform;
                    var retValue = { x: 0, y: 0 };
                    if (transformString && transformString.length > 0) {
                        var transform = transformString.match(/translate\((-?\d+(?:\.\d*)?)px, (-?\d+(?:\.\d*)?)px\)/);
                        if (transform) {
                            retValue.x = parseFloat(transform[1]);
                            retValue.y = parseFloat(transform[2]);
                        }
                    }
                    return retValue;
                };
                DragResizeElement.prototype.draw = function (dimensions) {
                    var _this = this;
                    // Sometimes user class manually handles drawing
                    // In that case we do don't do anything
                    // user class can use notify callbacks and handle its own drawing. 
                    if (this.options.disableDrawing)
                        return;
                    window.requestAnimationFrame(function () {
                        dimensions = _this.extend({}, dimensions || _this.dimensions);
                        var elementStyle = _this.element.get(0).style;
                        elementStyle.webkitTransform = elementStyle.transform = 'translate(' + dimensions.x + 'px, ' + dimensions.y + 'px)';
                        elementStyle.width = dimensions.width + 'px';
                        elementStyle.height = dimensions.height + 'px';
                    });
                };
                DragResizeElement.prototype.snapToGridIfNeeded = function () {
                    if (this.options.snapToGrid === true && this.options.gridSize) {
                        if (!this.dimensions)
                            this.dimensions = this.getDimensionsFromElement(this.element);
                        this.snapToGrid(this.dimensions);
                    }
                };
                DragResizeElement.prototype.snapToGrid = function (dimensions) {
                    var gridSize = this.options.gridSize;
                    dimensions.x = Math.round(dimensions.x / gridSize.width) * gridSize.width;
                    dimensions.y = Math.round(dimensions.y / gridSize.height) * gridSize.height;
                    dimensions.width = Math.round(dimensions.width / gridSize.width) * gridSize.width;
                    dimensions.height = Math.round(dimensions.height / gridSize.height) * gridSize.height;
                    this.draw(dimensions);
                };
                DragResizeElement.prototype.notifyResizeStart = function (size) {
                    if (this.options && this.options.onResizeStart)
                        this.options.onResizeStart(size);
                };
                DragResizeElement.prototype.notifyResizeMove = function (size) {
                    if (this.options && this.options.onResizeMove)
                        this.options.onResizeMove(size);
                };
                DragResizeElement.prototype.notifyResizeEnd = function (size) {
                    if (this.options && this.options.onResizeEnd)
                        this.options.onResizeEnd(size);
                };
                DragResizeElement.prototype.notifyDragStart = function (position) {
                    if (this.options && this.options.onDragStart)
                        this.options.onDragStart(position);
                };
                DragResizeElement.prototype.notifyDragMove = function (position) {
                    if (this.options && this.options.onDragMove)
                        this.options.onDragMove(position);
                };
                DragResizeElement.prototype.notifyDragEnd = function (position) {
                    if (this.options && this.options.onDragEnd)
                        this.options.onDragEnd(position);
                };
                DragResizeElement.prototype.extend = function (dest, source) {
                    for (var prop in source) {
                        if (source[prop] !== undefined) {
                            dest[prop] = source[prop];
                        }
                    }
                    return dest;
                };
                DragResizeElement.DragResizeElementClass = 'dragResizeElement';
                DragResizeElement.DraggingClass = 'dragging';
                DragResizeElement.ResizingClass = 'resizing';
                DragResizeElement.ResizeHandleClass = 'resizeHandle';
                DragResizeElement.CustomResizeHandleClass = 'customHandle';
                DragResizeElement.ResizeHandleDataDirectionAttr = 'data-direction';
                DragResizeElement.MinWidth = 100;
                DragResizeElement.MinHeight = 50;
                DragResizeElement.MaxWidth = 10000;
                DragResizeElement.MaxHeight = 10000;
                DragResizeElement.DefaultPointerMoveTolerance = 5;
                return DragResizeElement;
            })();
            controllers.DragResizeElement = DragResizeElement;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var EditableLabelController = (function () {
                function EditableLabelController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    // Avoid using element in controller for DOM manipulation.Using services to inject elemt as we need it in constructor 
                    // when directive is not initialized. Avoid this pattern. 
                    this.element = this.services.$element;
                    this.scope.disableClick = $scope.disableClick || false;
                    ;
                    this.scope.maxInputLength = $scope.maxInputLength || EditableLabelController.defaultMaxLength;
                    this.scope.makeEditable = function () { return _this.makeEditable(); };
                    this.scope.updateInputState = function () { return _this.updateInputState(); };
                    this.scope.onInternalBlur = function () { return _this.onInternalBlur(); };
                    this.scope.onInternalKeyDown = function (event) { return _this.onInternalKeyDown(event); };
                    this.editableLabel = this.element.find('.editableLabel');
                    this.inputTextbox = this.element.find('.textInput');
                    this.textLabel = this.element.find('.textLabel');
                    if (this.scope.disableClick) {
                        //if click is disabled, watch the editable variable and make it editable
                        this.editableState = $scope.editable || false;
                        this.setEditableState(this.editableState);
                        $scope.$watch('editable', function (isEditable, wasEditable) {
                            if (_this.editableState !== isEditable) {
                                if (isEditable && !wasEditable) {
                                    _this.makeEditable();
                                }
                                else {
                                    _this.setEditableState(false);
                                    _this.editableLabel.removeClass(EditableLabelController.cssErrorClass);
                                    _this.inputTextbox.val('');
                                }
                            }
                        });
                    }
                    else {
                        this.setEditableState(false);
                    }
                }
                EditableLabelController.createOptions = function () {
                    return {
                        additionalServices: ['$element']
                    };
                };
                // TODO - Can use ng-pattern if we want to support stronger validations
                EditableLabelController.prototype.isInputValid = function () {
                    return this.scope.validate ? this.scope.validate(this.inputTextbox.val()) : true;
                };
                EditableLabelController.prototype.updateInputState = function () {
                    this.editableLabel.removeClass(EditableLabelController.cssErrorClass);
                    if (!this.isInputValid()) {
                        this.editableLabel.addClass(EditableLabelController.cssErrorClass);
                    }
                };
                EditableLabelController.prototype.onInternalBlur = function () {
                    if (!this.cancelInput && this.scope.onBlur) {
                        var t = $(this.inputTextbox).val();
                        this.scope.onBlur(t);
                    }
                    this.cancelInput = false;
                    this.setEditableState(false);
                    this.editableLabel.removeClass(EditableLabelController.cssErrorClass);
                    this.inputTextbox.val('');
                    this.scope.$emit(powerbi.constants.editableLabelOnBlurEventName);
                };
                EditableLabelController.prototype.onInternalKeyDown = function (event) {
                    switch (event.keyCode) {
                        case jsCommon.DOMConstants.enterKeyCode:
                            this.inputTextbox.blur();
                            break;
                        case jsCommon.DOMConstants.escKeyCode:
                            this.cancelInput = true;
                            this.inputTextbox.blur();
                            break;
                    }
                };
                EditableLabelController.prototype.makeEditable = function () {
                    var _this = this;
                    var width = powerbi.TextMeasurementService.getDivElementWidth(this.textLabel);
                    this.services.timeout(function () {
                        _this.editableState = true;
                        _this.inputTextbox = _this.element.find('.textInput');
                        _this.inputTextbox.width(width);
                        _this.inputTextbox.val(_this.textLabel.text());
                        _this.setEditableState(true);
                        _this.services.timeout(function () {
                            _this.inputTextbox.focus();
                            _this.inputTextbox.select();
                        }, 0);
                    }, 0);
                };
                EditableLabelController.prototype.setEditableState = function (isEditable) {
                    this.editableState = isEditable;
                    if (this.editableState) {
                        this.editableLabel.addClass(EditableLabelController.cssActiveClass);
                        this.inputTextbox.show();
                        this.textLabel.hide();
                        // Listen to mouse click, keyboard and rightclick events and stopPropagation
                        // So we can have the default behavior in Text input
                        this.inputTextbox.on(jsCommon.DOMConstants.mouseClickEventName, function ($event) {
                            event.stopPropagation();
                        });
                        this.inputTextbox.on(jsCommon.DOMConstants.keyDownEventName, function ($event) {
                            switch ($event.keyCode) {
                                case jsCommon.DOMConstants.enterKeyCode:
                                case jsCommon.DOMConstants.escKeyCode:
                                    return;
                            }
                            event.stopPropagation();
                        });
                        this.inputTextbox.on(jsCommon.DOMConstants.contextmenuEventName, function ($event) {
                            event.stopPropagation();
                        });
                    }
                    else {
                        this.editableLabel.removeClass(EditableLabelController.cssActiveClass);
                        this.textLabel.show();
                        this.inputTextbox.hide();
                        this.inputTextbox.off(jsCommon.DOMConstants.mouseClickEventName);
                        this.inputTextbox.off(jsCommon.DOMConstants.keyDownEventName);
                        this.inputTextbox.off(jsCommon.DOMConstants.contextmenuEventName);
                    }
                };
                EditableLabelController.cssActiveClass = 'active';
                EditableLabelController.cssErrorClass = 'error';
                EditableLabelController.defaultMaxLength = 100;
                return EditableLabelController;
            })();
            controllers.EditableLabelController = EditableLabelController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var ModalDialogController = (function () {
                function ModalDialogController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.close = function () { return _this.onClose(); };
                    this.scope.confirm = function () { return _this.onConfirm(); };
                    this.scope.cancel = function () { return _this.onCancel(); };
                }
                ModalDialogController.prototype.onClose = function () {
                    if (this.scope.onCloseAction)
                        this.scope.onCloseAction();
                };
                ModalDialogController.prototype.onConfirm = function () {
                    if (this.scope.onConfirmAction)
                        this.scope.onConfirmAction();
                    var model = this.scope.viewModel;
                    if (model.autoCloseDialogOnConfirmButtonSelected) {
                        this.onClose();
                    }
                };
                ModalDialogController.prototype.onCancel = function () {
                    if (this.scope.onCancelAction)
                        this.scope.onCancelAction();
                };
                return ModalDialogController;
            })();
            controllers.ModalDialogController = ModalDialogController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var ModalThreeButtonDialogController = (function () {
                function ModalThreeButtonDialogController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.close = function () { return _this.onClose(); };
                    this.scope.confirm = function () { return _this.onConfirm(); };
                    this.scope.deny = function () { return _this.onDeny(); };
                    this.scope.cancel = function () { return _this.onCancel(); };
                }
                ModalThreeButtonDialogController.prototype.onClose = function () {
                    if (this.scope.onCloseAction)
                        this.scope.onCloseAction();
                };
                ModalThreeButtonDialogController.prototype.onConfirm = function () {
                    if (this.scope.onConfirmAction)
                        this.scope.onConfirmAction();
                    var model = this.scope.viewModel;
                    if (model.autoCloseDialogOnConfirmButtonSelected)
                        this.onClose();
                };
                ModalThreeButtonDialogController.prototype.onCancel = function () {
                    if (this.scope.onCancelAction)
                        this.scope.onCancelAction();
                };
                ModalThreeButtonDialogController.prototype.onDeny = function () {
                    if (this.scope.onDenyAction)
                        this.scope.onDenyAction();
                };
                return ModalThreeButtonDialogController;
            })();
            controllers.ModalThreeButtonDialogController = ModalThreeButtonDialogController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var controllers;
        (function (controllers) {
            var DataViewTransform = powerbi.data.DataViewTransform;
            var PerformanceUtil = jsCommon.PerformanceUtil;
            var VisualController = (function () {
                function VisualController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.visualPlugin = services.visualPlugin;
                    if (services.telemetryService)
                        this.perfLoadEvent = services.telemetryService.startPerfEvent(this.scope, null);
                    if ($scope.viewModel.visualPlugin)
                        this.visualPlugin = $scope.viewModel.visualPlugin;
                    // Avoid using Element in controller this way to initialize other objects. 
                    this.element = services.$element;
                    this.allowDeferredRendering = this.scope.allowDeferredRendering;
                    this.initialize();
                    this.scope.$on('$destroy', function () {
                        _this.destroyVisual();
                        _this.element = null;
                        _this.model.visual = null;
                        if (_this.perfLoadEvent)
                            _this.perfLoadEvent.resolve();
                    });
                }
                VisualController.createOptions = function () {
                    return {
                        additionalServices: ['$element', 'visualPlugin', 'telemetryService']
                    };
                };
                VisualController.prototype.initialize = function () {
                    var _this = this;
                    if (this.processModel(this.scope.viewModel))
                        return;
                    if (this.perfLoadEvent) {
                        this.perfLoadEvent.resolve();
                        this.perfLoadEvent = null;
                    }
                    var deregister = this.scope.$watch('viewModel', function (model) {
                        if (_this.processModel(model)) {
                            // You can only set the viewModel once!
                            deregister();
                        }
                    });
                };
                VisualController.prototype.processModel = function (model) {
                    var wasModelSet = !!this.model;
                    this.model = model;
                    if (!model || !model.type)
                        return false;
                    var plugin = this.visualPlugin.getPlugin(model.type);
                    if (!plugin)
                        return false;
                    this.capabilities = plugin.capabilities;
                    var initOptions = {
                        element: this.element,
                        host: model.hostServices,
                        style: model.visualStyle || common.services.visualStyles.create(),
                        viewport: model.viewport,
                        animation: { transitionImmediate: false }
                    };
                    if (model.interactivityOptions)
                        initOptions.interactivity = model.interactivityOptions;
                    this.initVisual(plugin, initOptions, model, wasModelSet);
                    return true;
                };
                /** This allows us to run an action in deferred mode */
                VisualController.prototype.executeDeferred = function (fn) {
                    if (this.allowDeferredRendering === true && window.setImmediate) {
                        window.setImmediate(function () { return fn(); });
                    }
                    else {
                        fn();
                    }
                };
                VisualController.prototype.initVisual = function (plugin, initOptions, model, wasModelSet) {
                    var _this = this;
                    // It's possible that the visualController has been instantiated before dashboard layout has had a chance 
                    // to run and assign a viewport value (due to layout batching). Therefore if we are yet to have a valid
                    // viewport, we should wait before initializing the visual.
                    if (!initOptions.viewport) {
                        var deregister = this.scope.$watch('viewModel.viewport', function (viewport, old) {
                            if (viewport) {
                                deregister();
                                initOptions.viewport = viewport;
                                _this.initVisual(plugin, initOptions, model, wasModelSet);
                            }
                        });
                        return;
                    }
                    // Clean up previous visual, if any.
                    this.destroyVisual();
                    var visual = plugin.create();
                    this.model.visual = visual;
                    visual.init(initOptions);
                    if (visual.onDataChanged) {
                        this.onDataChanged(model.data);
                        if (!wasModelSet) {
                            this.scope.$watch('viewModel.data', function (newData, oldData) {
                                if (newData !== oldData)
                                    _this.onDataChanged(newData);
                            });
                        }
                    }
                    if (!wasModelSet) {
                        this.scope.$watch('viewModel.type', function (newData, oldData) {
                            if (oldData && newData && newData !== oldData) {
                                _this.element.empty();
                                _this.processModel(_this.model);
                            }
                        });
                        // Should not rely on watcher's old value to determine whether the viewport has changed.
                        // Since we have stored this.currentViewPort, we should use the value instead and this is already done inside onViewPortChanged.
                        this.scope.$watch('viewModel.viewport', function (viewport) { return _this.onViewportChanged(viewport); });
                    }
                };
                VisualController.prototype.destroyVisual = function () {
                    var model = this.model;
                    if (!model)
                        return;
                    var visual = model.visual;
                    if (visual && visual.destroy)
                        visual.destroy();
                };
                VisualController.prototype.onViewportChanged = function (viewport) {
                    viewport = viewport || { height: 0, width: 0 };
                    if (this.currentViewport && (this.currentViewport.height === viewport.height && this.currentViewport.width === viewport.width)) {
                        return;
                    }
                    this.currentViewport = viewport;
                    this.viewport = viewport;
                    if (this.model.visual.update) {
                        if (this.dataViews) {
                            var marker = PerformanceUtil.create('update(' + this.model.type + ')');
                            this.model.visual.update({
                                viewport: viewport,
                                dataViews: this.dataViews,
                                duration: 0
                            });
                            marker.end();
                        }
                    }
                    else {
                        var marker = PerformanceUtil.create('onViewportChanged(' + this.model.type + ')');
                        this.model.visual.onResizing(viewport, 0);
                        marker.end();
                    }
                };
                VisualController.prototype.onDataChanged = function (data) {
                    var _this = this;
                    var visual = this.model.visual;
                    if (!visual.onDataChanged)
                        return;
                    var capabilities = this.capabilities;
                    var originalDataView;
                    if (data && data.dataView)
                        originalDataView = data.dataView;
                    var validation = powerbi.DataViewAnalysis.validateAndReshape(originalDataView, capabilities.dataViewMappings);
                    var dataChangedOptions;
                    if (validation.isValid) {
                        var dataViews = DataViewTransform.apply({
                            prototype: validation.dataView,
                            objectDescriptors: capabilities ? capabilities.objects : null,
                            dataViewMappings: capabilities ? capabilities.dataViewMappings : null,
                            transforms: this.model.dataTransforms,
                            colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory(),
                        });
                        dataChangedOptions = { dataViews: dataViews };
                        if (data && data.isFirstSegment === false)
                            dataChangedOptions.operationKind = 1 /* Append */;
                        if (this.model.animateOnDataChanged)
                            dataChangedOptions.duration = VisualController.animationDurationInMilliseconds;
                    }
                    else if (this.model.allowInvalidDataView) {
                        dataChangedOptions = { dataViews: [] };
                    }
                    if (dataChangedOptions) {
                        this.executeDeferred(function () {
                            if (visual === _this.model.visual) {
                                _this.dataViews = dataChangedOptions.dataViews;
                                if (_this.model.visual.update) {
                                    if (_this.viewport) {
                                        var marker = PerformanceUtil.create('update(' + _this.model.type + ')');
                                        _this.model.visual.update({
                                            viewport: _this.viewport,
                                            dataViews: _this.dataViews,
                                            duration: dataChangedOptions.duration
                                        });
                                        marker.end();
                                    }
                                }
                                else {
                                    var marker = PerformanceUtil.create('onDataChanged(' + _this.model.type + ')');
                                    visual.onDataChanged(dataChangedOptions);
                                    marker.end();
                                }
                                if (!_this.visualHasInitialData && dataChangedOptions.dataViews.length > 0) {
                                    _this.element.attr('initialized', '');
                                    _this.visualHasInitialData = true;
                                    if (_this.perfLoadEvent) {
                                        _this.perfLoadEvent.resolve();
                                        _this.perfLoadEvent = null;
                                    }
                                    _this.scope.$emit(powerbi.constants.visualDataChanged);
                                }
                            }
                        });
                    }
                };
                VisualController.animationDurationInMilliseconds = 250;
                return VisualController;
            })();
            controllers.VisualController = VisualController;
        })(controllers = common.controllers || (common.controllers = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var ApplyStyle = (function () {
                function ApplyStyle() {
                    this.restrict = 'A';
                    // DO NOT CREATE AN ISOLATED SCOPE
                    // It is likely that this directive will be applied to a reusable component with its own isolated scope.
                    this.link = function ($scope, $element, $attributes) {
                        var model = $scope.$eval($attributes['applyStyle']);
                        model.element($element);
                        model.apply();
                    };
                }
                return ApplyStyle;
            })();
            directives.ApplyStyle = ApplyStyle;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var AuthDialog = (function () {
                function AuthDialog() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = "views/authDialogView.html";
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = common.Services.createController(common.controllers.AuthDialogController);
                }
                return AuthDialog;
            })();
            directives.AuthDialog = AuthDialog;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var ClickTelemetry = (function () {
                function ClickTelemetry(telemetryService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attributes) {
                        $element.on(jsCommon.DOMConstants.mouseClickEventName, function (event) {
                            // log the click event for openning link
                            if ($element.prop(powerbi.constants.tagName).toLowerCase() === jsCommon.DOMConstants.Anchor) {
                                var link = $element.attr(jsCommon.DOMConstants.hrefAttribute);
                                if (!jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(link)) {
                                    _this.telemetryService.logEvent(powerbi.telemetry.DashboardOpenLink, link);
                                }
                            }
                        });
                    };
                    this.telemetryService = telemetryService;
                }
                return ClickTelemetry;
            })();
            directives.ClickTelemetry = ClickTelemetry;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var CollapsibleSection = (function () {
                function CollapsibleSection() {
                    this.restrict = 'E';
                    this.transclude = true;
                    this.replace = true;
                    this.templateUrl = 'views/collapsibleSectionView.html';
                    this.scope = {
                        expandedTitleLocalizationId: '@expandedTitleLocalizationId',
                        collapsedTitleLocalizationId: '@collapsedTitleLocalizationId'
                    };
                    this.link = function (scope, element, attrs) {
                        scope.$watch(
                        // this is to ensure that all the time when the collapsibleSection is displayed it is collapsed
                        function () {
                            return element.is(':visible');
                        }, function (newValue, oldValue) {
                            if (newValue === false) {
                                scope.isCollapsibleSectionExpanded = false;
                            }
                        }, true);
                    };
                    this.controller = common.Services.createController(common.controllers.CollapsibleSectionController);
                }
                return CollapsibleSection;
            })();
            directives.CollapsibleSection = CollapsibleSection;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DatasetParametersDialog = (function () {
                function DatasetParametersDialog() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = "views/datasetParametersDialogView.html";
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = common.Services.createController(common.controllers.DatasetParametersDialogController);
                }
                return DatasetParametersDialog;
            })();
            directives.DatasetParametersDialog = DatasetParametersDialog;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DialogConfirmContent = (function () {
                function DialogConfirmContent() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/dialogConfirmContent.html';
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                    };
                }
                return DialogConfirmContent;
            })();
            directives.DialogConfirmContent = DialogConfirmContent;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DialogPromptContent = (function () {
                function DialogPromptContent() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/dialogPromptContent.html';
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                    };
                    this.link = function ($scope, $element, $attrs) {
                        $element.find('input[type=text]').on('change keyup paste mouseup', function (event) {
                            if ($(event.target).val().length === 0) {
                                $scope.$emit(powerbi.constants.disableConfirmButtonEventName);
                            }
                            else {
                                $scope.$emit(powerbi.constants.enableConfirmButtonEventName);
                            }
                        }).on('keyup', function (event) {
                            if (event.which === jsCommon.DOMConstants.enterKeyCode) {
                                event.stopPropagation();
                                var confirmDialog = $scope.$parent.confirmDialog;
                                if (confirmDialog) {
                                    confirmDialog();
                                    $scope.$apply();
                                }
                            }
                            else if (event.which === jsCommon.DOMConstants.escKeyCode) {
                                event.stopPropagation();
                                var closeDialog = $scope.$parent.closeDialog;
                                if (closeDialog) {
                                    closeDialog();
                                    $scope.$apply();
                                }
                            }
                        });
                        setTimeout(function () {
                            $element.find('input[type=text]').focus();
                        });
                    };
                }
                return DialogPromptContent;
            })();
            directives.DialogPromptContent = DialogPromptContent;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// Supply a drag type to the drag attribute so it can only be dropped on corresponding drops.
// Example: <div drop="foo"> accepts <div drag="foo"> but not <div drag="foo2">
//
// By default, drag/drop works against DOM elements. You can specify a custom payload by using
// the dragContext attribute.
// Example: <div drag="foo" drag-context="getDragContext()">
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var Drag = (function () {
                function Drag(dragDataService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        $element.attr('draggable', 'true').on('dragstart', function (event) {
                            _this.dragDataService.setDragElement($element);
                            if ($attrs.dragContext)
                                _this.dragDataService.setDragContext($scope.$eval($attrs.dragContext));
                            var args = {
                                sourceElement: $element,
                                dragData: _this.dragDataService.getDragContext()
                            };
                            // This logic is requried for Firefox but optional for Chrome and IE.
                            // For Firefox, you need to set some data on the DataTransfer object to make the element draggable
                            // The first parameter MUST be 'Text' for IE and the second one can be whatever non-empty string.
                            var dragEvent = event.originalEvent;
                            if (dragEvent && dragEvent.dataTransfer) {
                                dragEvent.dataTransfer.setData('Text', 'powerBIRocks');
                            }
                            $scope.$emit(powerbi.constants.dragStartEventName, event, args);
                        }).on('dragend', function (event) {
                            _this.dragDataService.setDragElement(null);
                            _this.dragDataService.setDragContext(null);
                            var args = {
                                sourceElement: $element
                            };
                            $scope.$emit(powerbi.constants.dragEndEventName, event, args);
                        });
                    };
                    this.dragDataService = dragDataService;
                }
                return Drag;
            })();
            directives.Drag = Drag;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/* tslint:disable:no-unused-variable */
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DragResize = (function () {
                function DragResize() {
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var context = $scope.$eval($attrs.dragResizeContext);
                        var onDragStartHandler = $scope.$eval($attrs.onDragStart);
                        var onDragMoveHandler = $scope.$eval($attrs.onDragMove);
                        var onDragEndHandler = $scope.$eval($attrs.onDragEnd);
                        var onResizeStartHandler = $scope.$eval($attrs.onResizeStart);
                        var onResizeMoveHandler = $scope.$eval($attrs.onResizeMove);
                        var onResizeEndHandler = $scope.$eval($attrs.onResizeEnd);
                        var dragResizeRestriction;
                        switch ($attrs.dragResizeRestriction) {
                            case 'none':
                                dragResizeRestriction = 2 /* None */;
                                break;
                            default:
                                dragResizeRestriction = 1 /* Parent */;
                                break;
                        }
                        var dragResizeElement = new common.controllers.DragResizeElement($element, {
                            // drag events
                            onDragStart: function (position) {
                                if (context && onDragStartHandler) {
                                    onDragStartHandler.apply(context, [context, $element, position]);
                                }
                                $scope.$emit(powerbi.constants.DragResizeElementDragStartEventName, position);
                            },
                            onDragMove: function (position) {
                                if (context && onDragMoveHandler) {
                                    onDragMoveHandler.apply(context, [context, $element, position]);
                                }
                                $scope.$emit(powerbi.constants.DragResizeElementDragMoveEventName, position);
                            },
                            onDragEnd: function (position) {
                                if (context && onDragEndHandler) {
                                    onDragEndHandler.apply(context, [context, $element, position]);
                                }
                                $scope.$emit(powerbi.constants.DragResizeElementDragEndEventName, position);
                            },
                            // resize events
                            onResizeStart: function (size) {
                                if (context && onResizeStartHandler) {
                                    onResizeStartHandler.apply(context, [context, $element, size]);
                                }
                                $scope.$emit(powerbi.constants.DragResizeElementResizeStartEventName, size);
                            },
                            onResizeMove: function (size) {
                                if (context && onResizeMoveHandler) {
                                    onResizeMoveHandler.apply(context, [context, $element, size]);
                                }
                                $scope.$emit(powerbi.constants.DragResizeElementResizeMoveEventName, size);
                            },
                            onResizeEnd: function (size) {
                                if (context && onResizeEndHandler) {
                                    onResizeEndHandler.apply(context, [context, $element, size]);
                                }
                                $scope.$emit(powerbi.constants.DragResizeElementResizeEndEventName, size);
                            },
                            restriction: dragResizeRestriction,
                            resizeHandleDirections: 255 /* All */
                        });
                        $scope.$on('$destroy', function () {
                            dragResizeElement.destroy();
                        });
                    };
                }
                return DragResize;
            })();
            directives.DragResize = DragResize;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// Define a drag scroll parent. And you need to add this directive to the scroll parent where
// you want to enable auto-scrolling. Ideally you may want to add allow-propagation to the drop area
// to ensure the parent always get the drag over event
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var scrollDistance = 10;
            var DragScroll = (function () {
                function DragScroll(dragDataService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        $element.on('dragover', function (event) {
                            var dragElement = _this.dragDataService.getDragElement();
                            onDragOver(dragElement, $element, event.originalEvent.pageX, event.originalEvent.pageY);
                            event.preventDefault();
                            event.stopPropagation();
                        });
                    };
                    this.dragDataService = dragDataService;
                }
                return DragScroll;
            })();
            directives.DragScroll = DragScroll;
            function onDragOver(sourceElement, targetElement, mouseOffsetX, mouseOffsetY) {
                var targetOffset = targetElement.offset();
                var sourceWidth = sourceElement.width();
                var sourceHeight = sourceElement.height();
                var targetWidth = targetElement.width();
                var targetHeight = targetElement.height();
                if (isVerticalScrollable(targetElement)) {
                    if (mouseOffsetY - sourceHeight / 2 < targetOffset.top) {
                        scrollToTop(targetElement, scrollDistance * -1);
                    }
                    else if (mouseOffsetY + sourceHeight / 2 > targetOffset.top + targetHeight) {
                        scrollToTop(targetElement, scrollDistance);
                    }
                }
                if (isHorizontalScrollable(targetElement)) {
                    if (mouseOffsetX - sourceWidth / 2 < targetOffset.left) {
                        scrollToLeft(targetElement, scrollDistance * -1);
                    }
                    else if (mouseOffsetX + sourceWidth / 2 > targetOffset.left + targetWidth) {
                        scrollToLeft(targetElement, scrollDistance);
                    }
                }
            }
            function scrollToLeft(element, distance) {
                element.stop(true, true).animate({ scrollLeft: element.scrollLeft() + distance }, 100);
            }
            function scrollToTop(element, distance) {
                element.stop(true, true).animate({ scrollTop: element.scrollTop() + distance }, 100);
            }
            function isVerticalScrollable(element) {
                return element[0].scrollHeight > element.height();
            }
            function isHorizontalScrollable(element) {
                return element[0].scrollWidth > element.width();
            }
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// Supply a list of drag types to the drop attribute, only those drag types can be dropped on this.
// Example: <div drop="foo"> accepts <div drag="foo"> but not <div drag="foo2">
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var Drop = (function () {
                function Drop(dragDataService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var validDrops = $attrs.drop.split(/\s/);
                        var allowPropagation = $attrs.dropAllowPropagation;
                        $element.on('dragover', function (event) {
                            var dragElement = _this.dragDataService.getDragElement();
                            if (isValidDropLocation(dragElement, validDrops)) {
                                if (!allowPropagation) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                                $element.addClass(Drop.dragoverClass);
                                var args = createDragDropArgs(dragElement, $element, _this.dragDataService.getDragContext());
                                $scope.$emit(powerbi.constants.dragOverEventName, event, args);
                            }
                        }).on('drop', function (event) {
                            if (!allowPropagation) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            var dragElement = _this.dragDataService.getDragElement();
                            if (isValidDropLocation(dragElement, validDrops)) {
                                $element.removeClass(Drop.dragoverClass);
                                var args = createDragDropArgs(dragElement, $element, _this.dragDataService.getDragContext());
                                $scope.$emit(powerbi.constants.dropEventName, event, args);
                            }
                        }).on('dragenter', function (event) {
                            if (!allowPropagation) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            var dragElement = _this.dragDataService.getDragElement();
                            if (isValidDropLocation(dragElement, validDrops)) {
                                var args = createDragDropArgs(dragElement, $element, _this.dragDataService.getDragContext());
                                $scope.$emit(powerbi.constants.dragEnterEventName, event, args);
                            }
                        }).on('dragleave', function (event) {
                            if (!allowPropagation) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            var dragElement = _this.dragDataService.getDragElement();
                            if (isValidDropLocation(dragElement, validDrops)) {
                                $element.removeClass(Drop.dragoverClass);
                                var args = createDragDropArgs(dragElement, $element, _this.dragDataService.getDragContext());
                                $scope.$emit(powerbi.constants.dragLeaveEventName, event, args);
                            }
                        });
                    };
                    this.dragDataService = dragDataService;
                }
                Drop.dragoverClass = "dragover";
                return Drop;
            })();
            directives.Drop = Drop;
            function createDragDropArgs(source, target, dragData) {
                return {
                    sourceElement: source,
                    targetElement: target,
                    dragData: dragData
                };
            }
            function isValidDropLocation(dragElement, validDrops) {
                // If there's no drag element, the drop likely came from an external source,
                // such as a visual, that isn't annotated with our custom <drop> directive.
                // If this happens, assume the drop is valid.
                if (!dragElement)
                    return true;
                return validDrops.indexOf(dragElement.attr('drag')) >= 0;
            }
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var DropDownMenuItemType;
(function (DropDownMenuItemType) {
    DropDownMenuItemType[DropDownMenuItemType["Item"] = 0] = "Item";
    DropDownMenuItemType[DropDownMenuItemType["Title"] = 1] = "Title";
    DropDownMenuItemType[DropDownMenuItemType["Separator"] = 2] = "Separator";
})(DropDownMenuItemType || (DropDownMenuItemType = {}));
var DropdownOrientation;
(function (DropdownOrientation) {
    DropdownOrientation[DropdownOrientation["Horizontal"] = 0] = "Horizontal";
    DropdownOrientation[DropdownOrientation["Vertical"] = 1] = "Vertical";
})(DropdownOrientation || (DropdownOrientation = {}));
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DropdownMenu = (function () {
                function DropdownMenu() {
                    this.restrict = 'A';
                    this.replace = false;
                    this.scope = {
                        dropdownItems: '=',
                        dropdownClass: '@',
                        dropdownDarkTheme: '=',
                        dropdownOnItemSelected: '&',
                        dropdownOrientation: '=?',
                    };
                    this.link = function ($scope, $element, $attrs) {
                        $scope.dropdownClass = $attrs['dropdownMenuClass'];
                        $scope.$applyAsync(function () {
                            $scope.dropdownOrientation = $attrs.dropdownOrientation === "horizontal" ? 0 /* Horizontal */ : 1 /* Vertical */;
                        });
                    };
                    this.controller = common.Services.createController(DropDownMenuInternal);
                }
                return DropdownMenu;
            })();
            directives.DropdownMenu = DropdownMenu;
            var DropDownMenuInternal = (function () {
                function DropDownMenuInternal($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.element = services.$element;
                    this.services = services;
                    this.scope.select = function (item) { return _this.select(item); };
                    $scope.$on('$destroy', function () { return _this.dispose(); });
                    this.element.bind(jsCommon.DOMConstants.mouseClickEventName, function (event) { return _this.toggleMenu(event); });
                    $scope.$on('dropdownExpand', function (event) {
                        if (event.defaultPrevented) {
                            return;
                        }
                        event.preventDefault();
                        _this.toggleMenu();
                    });
                }
                DropDownMenuInternal.createOptions = function () {
                    return {
                        additionalServices: ['$element', 'dropdownMenuService']
                    };
                };
                DropDownMenuInternal.prototype.dispose = function () {
                    if (this.menuElement) {
                        this.menuElement.remove();
                    }
                };
                DropDownMenuInternal.prototype.toggleMenu = function (event) {
                    var _this = this;
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    if (!this.menuElement)
                        this.compileMenuElement();
                    this.services.timeout(function () {
                        _this.services.dropdownMenuService.toggleActive(_this.menuElement, _this.element, event);
                    });
                };
                DropDownMenuInternal.prototype.select = function (selected) {
                    this.scope.dropdownOnItemSelected({ selected: selected });
                    this.services.dropdownMenuService.hideMenu();
                };
                DropDownMenuInternal.prototype.compileMenuElement = function () {
                    var $template;
                    $template = angular.element(DropDownMenuInternal.template);
                    $template.data('$dropdownMenuController', this);
                    this.menuElement = this.services.compile($template)(this.scope);
                    this.scope.menuElement = this.menuElement;
                };
                DropDownMenuInternal.template = "<ul class='angular-dropdown {{dropdownClass}}' ng-class='{dark: dropdownDarkTheme === true}'>" + "<li ng-repeat='item in dropdownItems' class='dropdown-item' ng-mousedown='select(item); $event.stopPropagation();'>" + "<a ng-if='::item.type === 0' class='{{::item.containerClass}}' ng-href='{{::item.href}}' target='{{::item.hrefTarget ? item.hrefTarget : \"_blank\" }}'>" + "<div class='dropdown-content {{item.itemClass}}' >" + "<div class='dropdown-label {{::item.labelClass}}'>{{::item.text}}</div>" + "<div class='dropdown-description {{::item.descriptionClass}}' ng-if='::item.description'>{{::item.description}}</div>" + "</div>" + "</a>" + "<span ng-if='::item.type === 1' class='{{::item.containerClass}}'>" + "<div class='dropdown-content {{item.itemClass}}' >" + "<div class='dropdown-label {{::item.labelClass}}'>{{::item.text}}</div>" + "<div class='dropdown-description {{::item.descriptionClass}}' ng-if='::item.description'>{{::item.description}}</div>" + "</div>" + "</span>" + "<span ng-if='::item.type === 2' class='dropdown-separator'>" + "</span>" + "</li>" + "</ul>";
                return DropDownMenuInternal;
            })();
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DropdownMenuItems = (function () {
                function DropdownMenuItems() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/dropdownMenuItems.html';
                    this.scope = {
                        dropdownItems: '=',
                        dropdownClass: '@',
                        dropdownDarkTheme: '=',
                        dropdownOnItemSelected: '&',
                        dropdownOrientation: '=?'
                    };
                }
                return DropdownMenuItems;
            })();
            directives.DropdownMenuItems = DropdownMenuItems;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DropdownOverlay = (function () {
                function DropdownOverlay(overlayService) {
                    var _this = this;
                    this.restrict = 'E';
                    this.replace = true;
                    this.transclude = true;
                    this.template = '<div class="dropdownOverlay" ng-transclude></div>';
                    this.link = function ($scope, $element, $attrs) {
                        var dropdownOverlayClass = $attrs["dropdownOverlayClass"];
                        if (dropdownOverlayClass) {
                            $element.removeClass('dropdownOverlay');
                            $element.addClass(dropdownOverlayClass);
                        }
                        _this.overlayService.register($element, true);
                        $scope.$on('$destroy', function () { return _this.overlayService.unregister($element, true); });
                    };
                    this.overlayService = overlayService;
                }
                return DropdownOverlay;
            })();
            directives.DropdownOverlay = DropdownOverlay;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var DropdownOverlayInvoke = (function () {
                function DropdownOverlayInvoke(overlayService) {
                    var _this = this;
                    this.clickAction = 'click';
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var preferLeft = $attrs["preferLeft"];
                        var needBlur = $attrs["needBlur"];
                        var menu;
                        $element.on(_this.clickAction, function (event) {
                            if (!menu || menu.length === 0) {
                                var menuName = $attrs["dropdownOverlayInvoke"];
                                menu = $element.siblings('[dropdown-overlay-name="' + menuName + '"]');
                                if (menu.length === 0)
                                    menu = $('[dropdown-overlay-name="' + menuName + '"]');
                            }
                            debug.assert(menu.length > 0, "Invoke a menu that does not exist");
                            $scope.$applyAsync(function () {
                                _this.overlayService.toggleDropdown(menu, $element, event, preferLeft === "true");
                            });
                        });
                        if (needBlur === 'true') {
                            $element.on('blur', function (event) {
                                $scope.$applyAsync(function () {
                                    _this.overlayService.hideAllDropdowns();
                                });
                            });
                        }
                    };
                    this.overlayService = overlayService;
                }
                return DropdownOverlayInvoke;
            })();
            directives.DropdownOverlayInvoke = DropdownOverlayInvoke;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var EditableLabel = (function () {
                function EditableLabel() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/editableLabel.html';
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                        onBlur: '=',
                        validate: '=',
                        disableClick: '=?',
                        editable: '=?',
                        maxInputLength: '=?',
                        customTooltip: '=?'
                    };
                    this.link = function ($scope, $element, $attrs) {
                        var inputElement = $element.find('input');
                        if (inputElement && inputElement.length > 0) {
                            //clear text selection when mouse down
                            inputElement.on(jsCommon.DOMConstants.mouseDownEventName, function (event) {
                                inputElement.get(0).setSelectionRange(-1, -1);
                            });
                        }
                    };
                    this.controller = common.Services.createController(common.controllers.EditableLabelController);
                }
                return EditableLabel;
            })();
            directives.EditableLabel = EditableLabel;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            /**
             * directive for focusing elements programmatically.
             * usage: <someTag focus-on='watchvariable'></someTag>
             */
            var FocusOn = (function () {
                function FocusOn() {
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var focusWatch = $scope.$watch($attrs.focusOn, function (currentValue, previousValue) {
                            if (currentValue !== undefined) {
                                setTimeout(function () {
                                    $element.focus();
                                }, 0);
                            }
                        });
                        $scope.$on('$destroy', function () {
                            focusWatch();
                        });
                    };
                }
                return FocusOn;
            })();
            directives.FocusOn = FocusOn;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var InlineMessage = (function () {
                function InlineMessage() {
                    this.restrict = 'E';
                    this.transclude = true;
                    this.replace = true;
                    this.templateUrl = 'views/inlineMessageView.html';
                    this.scope = {
                        mode: '=',
                        traceDetails: '=',
                    };
                }
                return InlineMessage;
            })();
            directives.InlineMessage = InlineMessage;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var InlineNameValuePairs = (function () {
                function InlineNameValuePairs() {
                    this.restrict = 'E';
                    this.transclude = true;
                    this.replace = true;
                    this.templateUrl = 'views/inlineNameValuePairsView.html';
                    this.scope = {
                        mode: '=',
                        showTitle: '=',
                        detailExpand: '=',
                        nameValuePairs: '=',
                    };
                }
                return InlineNameValuePairs;
            })();
            directives.InlineNameValuePairs = InlineNameValuePairs;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            /**
             * directive for string localization.
             * usage: <someTage localize='stringID'></someTage>
             * The string ID should match the ones either in strings.resjson or
             * default embeded en-US dictionary.
             */
            var Localize = (function () {
                function Localize(localizationService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var localizationID = $attrs['localize'];
                        debug.assertValue(localizationID, 'localizationID');
                        if (!common.localization.loader.isDataLoaded) {
                            var deregister = $scope.$watch(function () { return common.localization.loader.isDataLoaded; }, function (newValue, oldValue) {
                                var value = _this.localizationService.get(localizationID);
                                $element.text(value || '');
                                if (newValue)
                                    deregister();
                            });
                        }
                        else {
                            // data already loaded, load the strings directly
                            var value = _this.localizationService.get(localizationID);
                            $element.text(value || '');
                        }
                    };
                    this.localizationService = localizationService;
                }
                return Localize;
            })();
            directives.Localize = Localize;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            /**
             * directive for string localization.
             * usage: <someTag localize-tooltip='stringID'></someTag>
             * The string ID should match the ones either in strings.resjson or
             * default embeded en-US dictionary.
             */
            var LocalizeTooltip = (function () {
                function LocalizeTooltip(localizationService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var localizationID = $attrs['localizeTooltip'];
                        debug.assertValue(localizationID, 'localizationID');
                        if (!common.localization.loader.isDataLoaded) {
                            var deregister = $scope.$watch(function () { return common.localization.loader.isDataLoaded; }, function (newValue, oldValue) {
                                var value = _this.localizationService.get(localizationID);
                                $element.attr('title', value || '');
                                if (newValue === true)
                                    deregister();
                            });
                        }
                        else {
                            // data already loaded, load the strings directly
                            var value = _this.localizationService.get(localizationID);
                            $element.attr('title', value || '');
                        }
                    };
                    this.localizationService = localizationService;
                }
                return LocalizeTooltip;
            })();
            directives.LocalizeTooltip = LocalizeTooltip;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var ModalDialog = (function () {
                function ModalDialog() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/modalDialog.html';
                    this.transclude = true;
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                        onCloseAction: '&',
                        onConfirmAction: '&',
                        onCancelAction: '&',
                    };
                    this.link = function (scope, element, attrs) {
                        var confirmButtonText = attrs.confirmButtonText;
                        if (!confirmButtonText)
                            confirmButtonText = 'OK';
                        scope.confirmButtonText = confirmButtonText;
                        element.appendTo($('body'));
                    };
                    this.controller = common.Services.createController(common.controllers.ModalDialogController);
                }
                return ModalDialog;
            })();
            directives.ModalDialog = ModalDialog;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var ModalOverlay = (function () {
                function ModalOverlay() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/modalOverlay.html';
                    this.transclude = true;
                    this.replace = true;
                }
                return ModalOverlay;
            })();
            directives.ModalOverlay = ModalOverlay;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var ModalThreeButtonDialog = (function () {
                function ModalThreeButtonDialog() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/modalThreeButtonDialog.html';
                    this.transclude = true;
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                        onCloseAction: '&',
                        onConfirmAction: '&',
                        onDenyAction: '&',
                        onCancelAction: '&',
                    };
                    this.link = function (scope, element, attrs) {
                        var confirmButtonText = attrs.confirmButtonText;
                        if (!confirmButtonText)
                            confirmButtonText = 'OK';
                        scope.confirmButtonText = confirmButtonText;
                        element.appendTo($('body'));
                        // Enter should confirm.  Escape cancel
                        element.on('keyup', function (event) {
                            if (event.which === jsCommon.DOMConstants.enterKeyCode) {
                                event.stopPropagation();
                                var confirmDialog = scope.confirmDialog;
                                if (confirmDialog) {
                                    confirmDialog();
                                    scope.$apply();
                                }
                            }
                            else if (event.which === jsCommon.DOMConstants.escKeyCode) {
                                event.stopPropagation();
                                var closeDialog = scope.$parent.closeDialog;
                                if (closeDialog) {
                                    closeDialog();
                                    scope.$apply();
                                }
                            }
                        });
                        setTimeout(function () {
                            element.find('.confirm').focus();
                        });
                    };
                    this.controller = common.Services.createController(common.controllers.ModalThreeButtonDialogController);
                }
                return ModalThreeButtonDialog;
            })();
            directives.ModalThreeButtonDialog = ModalThreeButtonDialog;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var NgRightClick = (function () {
                function NgRightClick(ngParseService) {
                    var _this = this;
                    this.restrict = 'A';
                    this.replace = false;
                    this.link = function ($scope, $element, $attributes) {
                        $element.on(jsCommon.DOMConstants.contextmenuEventName, function (event) {
                            // if right click action is set, do the action and disable the default browser context menu
                            var action = _this.$parse($attributes['ngRightClick']);
                            if (action) {
                                $scope.$apply(function () {
                                    event.preventDefault();
                                    action($scope, event);
                                });
                            }
                        });
                    };
                    this.$parse = ngParseService;
                }
                return NgRightClick;
            })();
            directives.NgRightClick = NgRightClick;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            /** This directive fires an event after ng-repeat has finished rendering a list */
            var NgRepeatFinishEvent = (function () {
                function NgRepeatFinishEvent(timeout) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function ($scope, $element, $attrs) {
                        var eventName = $attrs['ngRepeatFinishEvent'];
                        if ($scope.$last === true) {
                            _this.$timeout(function () {
                                $scope.$emit(eventName);
                            });
                        }
                    };
                    this.$timeout = timeout;
                }
                return NgRepeatFinishEvent;
            })();
            directives.NgRepeatFinishEvent = NgRepeatFinishEvent;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var NgScrollbars = (function () {
                function NgScrollbars() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.transclude = true;
                    this.template = '<div class="ng-scrollbar-container scrollbar-inner" drag-scroll ng-transclude></div>';
                    this.link = function ($scope, $element, $attributes) {
                        var config = $scope.$eval($attributes['ngScrollbarsConfig']);
                        setTimeout(function () {
                            $element.scrollbar(config);
                        }, 0);
                    };
                }
                return NgScrollbars;
            })();
            directives.NgScrollbars = NgScrollbars;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var NotificationBar = (function () {
                function NotificationBar(service) {
                    var _this = this;
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = "views/notificationBar.html";
                    this.link = function ($scope, $element, $attrs) {
                        $scope.service = _this.service;
                        $scope.dismiss = function (notification) {
                            if (notification.onClose)
                                notification.onClose();
                            _this.service.hide(notification.id);
                        };
                    };
                    this.service = service;
                }
                return NotificationBar;
            })();
            directives.NotificationBar = NotificationBar;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var PopupContainer = (function () {
                function PopupContainer() {
                    this.restrict = "E";
                    this.replace = true;
                    this.transclude = true;
                    this.templateUrl = 'views/popupContainer.html';
                    this.link = function ($scope, $element) {
                        $scope.$evalAsync(function () {
                            var elementHeight = $element.outerHeight();
                            var overflowScreen = elementHeight + $element.offset().top > $(window).height();
                            var topPosition = $element.parent().offset().top - elementHeight;
                            if (overflowScreen) {
                                $element.css({
                                    top: topPosition
                                });
                                $scope.isOutOfScreen = true;
                            }
                            else {
                                $element.css({
                                    top: $element.parent().offset().top + $element.parent().innerHeight()
                                });
                            }
                        });
                    };
                }
                return PopupContainer;
            })();
            directives.PopupContainer = PopupContainer;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var QnaQuestionbox = (function () {
                function QnaQuestionbox(localizationService) {
                    var _this = this;
                    this.restrict = 'E';
                    this.templateUrl = 'views/qnaQuestionBox.html';
                    this.scope = {
                        connectionGroup: '=connectionGroup',
                        options: '=options',
                        getInterpretRequestScope: '=getInterpretRequestScope',
                    };
                    this.replace = true;
                    this.link = function (scope, element, attrs) {
                        var initialized = false;
                        var unregisterViewModelWatch;
                        var initialize = function (connectionGroup, localizationService) {
                            if (!initialized && connectionGroup && clusterUri) {
                                var options = {
                                    group: scope.connectionGroup,
                                    interpretRequestOptons: scope.options,
                                    disableBlurOnConfirmQuery: true,
                                    disableNotification: true,
                                    telemetryHostName: 'PowerBI',
                                    getInterpretRequestScope: scope.getInterpretRequestScope,
                                };
                                // InfoNav Initialization
                                var questionBox = new InJs.QuestionBox.QuestionBoxControl(element, options);
                                localizationService.ensureLocalization(function () {
                                    questionBox.placeholder = localizationService.get('QnaTextBoxPlaceholder');
                                    questionBox.placeholderOnInit = localizationService.get('QnaTextBoxLoadingPlaceholder');
                                    questionBox.utteranceFeedbackTooltip = localizationService.get('UtteranceFeedbackTooltip');
                                    questionBox.getLocalizedResource = function (resourceId) { return localizationService.get(resourceId); };
                                });
                                $(scope.connectionGroup).on(InJs.Events.InterpretIssuedEventName, function () { return scope.showLoadingIndicator = true; });
                                $(scope.connectionGroup).on(InJs.Events.InterpretErrorEventName, function () { return scope.showLoadingIndicator = false; });
                                $(scope.connectionGroup).on(InJs.Events.InterpretRetryCountExceededEventName, function () { return scope.showLoadingIndicator = false; });
                                $(scope.connectionGroup).on(InJs.Events.InterpretSuccessEventName, function () { return scope.showLoadingIndicator = false; });
                                $(scope.connectionGroup).on(InJs.Events.ConnectionGroupInvalidatedEventName, function () { return scope.showLoadingIndicator = false; });
                                scope.$on('$destroy', function () {
                                    if (unregisterViewModelWatch) {
                                        unregisterViewModelWatch();
                                    }
                                });
                                initialized = true;
                            }
                        };
                        initialize(scope.connectionGroup, _this.localizationService);
                        if (!initialized) {
                            var unregisterViewModelWatch = scope.$watch('connectionGroup', function (connectionGroup) {
                                initialize(connectionGroup, _this.localizationService);
                            });
                        }
                    };
                    this.localizationService = localizationService;
                }
                return QnaQuestionbox;
            })();
            directives.QnaQuestionbox = QnaQuestionbox;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var Resizable = (function () {
                function Resizable() {
                    this.restrict = 'A';
                    this.transclude = true;
                    this.link = function ($scope, $element, $attributes) {
                        var containerWidth;
                        var currentPaneRight;
                        var siblingPaneWidth;
                        var isDragging;
                        var splitter = angular.element('<div class="pane-splitter"></div>');
                        $element.append(splitter);
                        var collapsedWidth = parseInt($attributes['resizableCollapsedWidth'], 10);
                        var defaultWidth = parseInt($attributes['resizableDefaultWidth'], 10);
                        var minWidth = parseInt($attributes['resizableMinWidth'], 10);
                        var containerid = $attributes['resizableContainerid'];
                        var resizableSibling = $attributes['resizableSibling'];
                        var splitterWidth = parseInt(splitter.css('width'), 10);
                        var resizeExpandedChanged = function (value) {
                            if (value !== "true") {
                                $element.css('width', collapsedWidth + 'px');
                                splitter.hide();
                            }
                            else {
                                // need to check if there is enough space to expand the pane.
                                var containerElement = $(document).find('#' + containerid);
                                containerWidth = containerElement.width();
                                if (containerWidth > 0 && resizableSibling) {
                                    var siblingElement = $(containerElement).find("." + resizableSibling);
                                    if (siblingElement.length === 1) {
                                        siblingPaneWidth = siblingElement.width();
                                        var avaliableSpace = containerWidth - siblingPaneWidth;
                                        //resize sibling so that both panes can fit in the container
                                        if (avaliableSpace < defaultWidth) {
                                            var siblingWidth = containerWidth - defaultWidth - splitterWidth;
                                            if (siblingWidth > 0)
                                                siblingElement.css('width', siblingWidth + 'px');
                                        }
                                    }
                                }
                                $element.css('width', defaultWidth + 'px');
                                splitter.show();
                            }
                        };
                        var mouseUpHandler = function (e) {
                            e.preventDefault();
                            isDragging = false;
                            $(document).off('mousemove', mouseMoveHandler);
                            $(document).off('mousedown', mouseUpHandler);
                        };
                        var mouseMoveHandler = function (e) {
                            if (!isDragging)
                                return;
                            var maxWidth = containerWidth;
                            if (siblingPaneWidth)
                                maxWidth = maxWidth - siblingPaneWidth - splitterWidth;
                            var paneWidth = currentPaneRight - e.clientX;
                            if (paneWidth > maxWidth)
                                paneWidth = maxWidth;
                            if (paneWidth < minWidth)
                                paneWidth = minWidth;
                            $element.css('width', paneWidth + 'px');
                        };
                        var mouseDownHandler = function (e) {
                            e.preventDefault();
                            var containerElement = $(document).find('#' + containerid);
                            containerWidth = containerElement.width();
                            currentPaneRight = $element.offset().left + $element.width();
                            if (resizableSibling) {
                                var siblingElement = $(containerElement).find("." + resizableSibling);
                                if (siblingElement.length === 1)
                                    siblingPaneWidth = siblingElement.width();
                            }
                            else
                                siblingPaneWidth = undefined;
                            isDragging = true;
                            $(document).on('mouseup', mouseUpHandler);
                            $(document).on('mousemove', mouseMoveHandler);
                        };
                        resizeExpandedChanged($attributes['resizableExpanded']);
                        $attributes.$observe('resizableExpanded', resizeExpandedChanged);
                        splitter.on('mousedown', mouseDownHandler);
                        $scope.$on('$destroy', function () {
                            splitter.off('mousedown', mouseDownHandler);
                        });
                    };
                }
                return Resizable;
            })();
            directives.Resizable = Resizable;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var Spinner = (function () {
                function Spinner() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/spinner.html';
                    this.link = function (scope, element, attr) {
                        if (attr.dots !== undefined) {
                            scope.dots = true;
                        }
                    };
                }
                return Spinner;
            })();
            directives.Spinner = Spinner;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var ToolbarOverlay = (function () {
                function ToolbarOverlay(overlayService) {
                    var _this = this;
                    this.restrict = 'E';
                    this.link = function ($scope, $element, $attrs) {
                        $scope.$watchGroup(['viewModel.toolbarVisible', 'viewModel.isSelected'], function () {
                            _this.refreshToolbar($scope, $element.parent());
                        });
                        _this.refreshToolbar($scope, $element.parent());
                    };
                    this.overlayService = overlayService;
                }
                ToolbarOverlay.prototype.refreshToolbar = function ($scope, $element) {
                    var viewModel = $scope.viewModel;
                    var toolbar = viewModel.$toolbarElement;
                    if (toolbar) {
                        if (viewModel.toolbarVisible && viewModel.isSelected)
                            this.overlayService.showOverlay(toolbar, $element, false);
                        else
                            this.overlayService.hideOverlay(toolbar);
                    }
                };
                return ToolbarOverlay;
            })();
            directives.ToolbarOverlay = ToolbarOverlay;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var Tooltip = (function () {
                function Tooltip() {
                    this.restrict = 'A';
                    this.controller = common.Services.createController(TooltipInternal);
                }
                return Tooltip;
            })();
            directives.Tooltip = Tooltip;
            var TooltipInternal = (function () {
                function TooltipInternal($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.element = this.services.$element;
                    this.attrs = this.services.$attrs;
                    this.showTooltip = $.proxy(this.showTooltipInternal, this);
                    this.hideTooltip = $.proxy(this.hideTooltipInternal, this);
                    $scope.$on('$destroy', function () { return _this.dispose(); });
                    this.services.$element.on(jsCommon.DOMConstants.mouseMoveEventName, this.showTooltip);
                    this.services.$element.on(jsCommon.DOMConstants.mouseLeaveEventName, this.hideTooltip);
                }
                TooltipInternal.createOptions = function () {
                    return {
                        additionalServices: ['$element', 'tooltipService', '$attrs']
                    };
                };
                TooltipInternal.prototype.showTooltipInternal = function (event) {
                    var element = this.services.$element;
                    var disable = element.attr('tooltip-disable');
                    var title = element.attr('tooltip-title');
                    var description = element.attr('tooltip-description');
                    var delay = Number(element.attr('tooltip-delay'));
                    var arrowPosition = element.attr('tooltip-arrow-position');
                    if (disable !== "true") {
                        this.services.tooltipService.showTooltip(this.element, event, title, description, delay, arrowPosition);
                    }
                };
                TooltipInternal.prototype.hideTooltipInternal = function (event) {
                    this.services.tooltipService.hideTooltip(event);
                };
                TooltipInternal.prototype.dispose = function () {
                    this.services.tooltipService.hideTooltip();
                    this.services.$element.off(jsCommon.DOMConstants.mouseMoveEventName, this.showTooltip);
                    this.services.$element.off(jsCommon.DOMConstants.mouseLeaveEventName, this.hideTooltip);
                };
                return TooltipInternal;
            })();
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var directives;
        (function (directives) {
            var Visual = (function () {
                function Visual() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/visual.html';
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                        allowDeferredRendering: '=allowDeferredRendering'
                    };
                    this.controller = common.Services.createController(common.controllers.VisualController);
                }
                return Visual;
            })();
            directives.Visual = Visual;
        })(directives = common.directives || (common.directives = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
/* tslint:disable:no-consecutive-blank-lines */
//-----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//==============================================================================
//          !!!!!!!!! AUTO GENERATED !!!!!!!!!
//
// This code was generated by t4 template in PowerBI project.
// To edit resources change the PowerBI.resx file in the PowerBI project.
//
// Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
//==============================================================================
var powerbi;
(function (powerbi) {
    var localization;
    (function (localization) {
        localization.defaultLocalizedStrings = {
            ContinueToPowerBI: 'Go back home',
            DashboardInvitationEmailSubject: '{0} has shared Power BI Dashboard \'{1}\' with you',
            DashboardInvitationEmailViewDashboardLink: 'Open',
            ExistingAccount: 'Have an account? {0}Sign In{1}',
            ClusterUriNotFound: 'Cluster URI not found. Please try again later.',
            Forbidden: 'You are not authorized to view this page.',
            GenericError: 'Something went wrong. <br/>Please try again later.',
            GenericErrorDescription: 'An unknown error occured. If you continue to see this error please provide the following information when requesting support.',
            PageDoesNotExist: 'Oops, we couldn\'t find the page you were looking for',
            PowerBILogoTxt: 'Microsoft Power BI Preview',
            PowerBILogoTxtNoPreview: 'Microsoft Power BI',
            SignUpButton: 'Sign up',
            SignUpDifferentEmail: 'Don\'t have an account? {0}Sign up{1}.',
            SignUpHeader: 'Welcome to Power BI Preview',
            SignUpHeaderNoPreview: 'Welcome to Power BI',
            SignUpTextLine1: 'Someone has shared a dashboard with you.',
            SignUpTextLine2: 'Sign up for a Microsoft Power BI account to see it.',
            SignInButton: 'Sign in',
            SignInDifferentEmail: 'Already a user? {0}Sign in{1}',
            SignInTextLine1: 'Someone has shared a dashboard with you.',
            SignInTextLine2: 'Sign in to see it.',
            Unauthorized: 'We do not recognize you. Did you enter your credentials right?',
            RequestAnInvite: 'Request an invite',
            UserNeedsInvitation: 'You need an invitation to use Power BI.',
            UserNotSignedUp: 'You’re not signed up yet.',
            DashboardInvitationEmailDefaultMessage: 'Here\'s the dashboard that {0} shared with you',
            DateAndTimeLabel: 'Date and Time:',
            TechnicalDetails: 'TECHNICAL DETAILS <br/>',
            ErrorDescription_UserAccountDisabled: 'This user account has been disabled.',
            ActivityIdLabel: 'ActivityId:',
            TopNav_PowerBILogoText: 'Microsoft Power BI Preview',
            TopNav_PowerBILogoTextNoPreview: 'Microsoft Power BI',
            TopNav_HelpMenu_GettingStarted: 'Getting started',
            TopNav_HelpMenu_ContactSupport: 'Contact support',
            TopNav_HelpMenu_Developers: 'Power BI for developers',
            TopNav_HelpMenu_Suggestions: 'What should we build next?',
            TopNav_HelpMenu_Topics: 'Help topics',
            TopNav_HelpMenu_About: 'About Power BI',
            TopNav_HelpMenu_AboutDialog_Close: 'Close',
            TopNav_HelpMenu_Community: 'Community',
            TopNav_HelpMenu_FeatureRequests: 'Feature Requests',
            TopNav_UserInfoMenu_SignOut: 'Sign out',
            TopNav_SettingsMenu_ASConnector: 'Analysis Services Connector Preview',
            TopNav_SettingsMenu_OnPremGateway: 'Power BI Personal Gateway Preview',
            TopNav_SettingsMenu_ASConnectorNoPreview: 'Analysis Services Connector',
            TopNav_SettingsMenu_OnPremGatewayNoPreview: 'Power BI Personal Gateway',
            TopNav_SettingsMenu_MobileDownload: 'Power BI for Mobile',
            TopNav_SettingsMenu_PowerBICompanion: 'Power BI Designer Preview',
            TopNav_SettingsMenu_PowerBICompanionNoPreview: 'Power BI Designer',
            TopNav_SettingsMenu_Download: 'DOWNLOAD',
            TopNav_SettingsMenu_PowerBISettings: 'Power BI Settings',
            TopNav_SettingsMenu_Office365Settings: 'Office 365 Settings',
            TopNav_SettingsMenu_ChangeTheme: 'Change Theme',
            TopNav_SettingsMenu_PurchasePowerBIPro: 'Purchase Power BI Pro',
            TopNav_SettingsMenu_PowerBI: 'Power BI',
            TopNav_SettingsMenu_PowerBIForO365: 'Power BI for Office 365',
            TopNav_SettingsMenu_Settings: 'Settings',
            TopNav_O365ApplicationLauncher_Error: 'Application launcher cannot be loaded at this time',
            TopNav_O365ApplicationLauncher_Loading: 'Loading ...',
            NullValue: '(Blank)',
            BooleanTrue: 'True',
            BooleanFalse: 'False',
            NavigationPane_OpenMenu: 'Open Menu',
            NavigationPane_SharedWithYou: 'Shared with you',
            NavigationPane_GetData: 'Get Data',
            NavigationPane_CreateDashboard: 'Create dashboard',
            NavigationPane_FilterContent: 'Filter content',
            NavigationPane_Minimize: 'Minimize the Navigator Pane',
            NavigationPane_Expand: 'Expand the Navigator Pane',
            NavigationPane_RefreshPublishError: 'Failed to publish or refresh',
            NavigationPane_PackagePublishErrorTitle: 'Failed to import data',
            NavigationPane_ReportPublishErrorTitle: 'Failed to publish report',
            NavigationPane_ModelPublishErrorTitle: 'Failed to publish dataset',
            NavigationPane_PackagePublishErrorContent: 'Do you want to delete the dataset and report?',
            NavigationPane_ReportPublishErrorContent: 'Do you want to delete the report?',
            NavigationPane_ModelPublishErrorContent: 'Do you want to delete the dataset?',
            NavigationPane_NoDashboardText: 'You have no dashboards',
            NavigationPane_NoReportText: 'You have no reports',
            NavigationPane_NoDatasetText: 'You have no datasets',
            NavigationPane_NoDashboardSearchResultText: 'No dashboards found',
            NavigationPane_NoReportSearchResultText: 'No reports found',
            NavigationPane_NoDatasetSearchResultText: 'No datasets found',
            Options_Menu: 'More Options',
            ReportAppBar_FileButton: 'FILE',
            ReportAppBar_SaveReportButton: 'SAVE',
            ReportAppBar_EditReportButton: 'EDIT REPORT',
            ReportAppBar_ShareButton: 'Share Dashboard',
            ReportAppBar_EditReportButtonSharedDisabled: 'You cannot edit a shared report',
            ReportAppBar_SaveToDashboard: 'Save',
            ReportAppBar_SaveToDashboardDescription: 'Save this report.',
            ReportAppBar_SaveAs: 'Save As',
            ReportAppBar_SaveAsDescription: 'Save a copy of this report.',
            ReportAppBar_SaveAsDialogTitle: 'Save Your Report',
            ReportAppBar_SaveAsDialogInstructions: 'Enter a name for your report:',
            ReportAppBar_ExportToPowerPoint: 'Export to Power Point',
            ReportAppBar_ExportToPowerPointDescription: 'Save this report as a Power Point presentation',
            ReportAppBar_ShareWithPeople: 'Share with People',
            ReportAppBar_ShareWithPeopleDescription: 'Invite other people to view and edit this report',
            ReportAppBar_Embed: 'Embed',
            ReportAppBar_EmbedDescription: 'Embed this report in your blog or website',
            ReportPaginator_Page: 'PAGE',
            ReportPaginator_PageOf: 'OF',
            ReportPaginator_EditingView: 'Editing View',
            ReportPaginator_ReadingView: 'Reading View',
            ReportContainer_UnsavedChangeWarningTitle: 'You have unsaved changes.',
            ReportContainer_UnsavedChangeWarningMessage: 'You might want to save them first.',
            ReportContainer_WindowUnload: 'You have unsaved changes. You might want to save them first.',
            ReportContainer_Dontsave: 'Don\'t Save',
            ReportContainer_Cancel: 'Cancel',
            ReportContainer_Save: 'Save',
            ReportNavigation_Thumbnails: 'Thumbnails',
            SettingsViewer_Title: 'Settings',
            SettingsDashboards_Title: 'Dashboards',
            SettingsGeneral_Title: 'General',
            SettingsGeneral_Privacy_Title: 'Privacy',
            SettingsPrivacy_Title: 'Privacy Settings',
            SettingsPrivacy_DataCollection_Title: 'Search Term Collection',
            SettingsPrivacy_DataCollection_Info: 'Help make Power BI better by sending search terms used in Power BI Q&A to Microsoft for product feedback and improvement.',
            SettingsPrivacy_DataCollection_LearnMore: 'Learn more',
            SettingsGeneral_Error_FailedToLoad: 'Failed to load settings',
            SettingsGeneral_Error_FailedToSave: 'Failed to update settings',
            SettingsDashboards_Error_FailedToLoadDashboards: 'Failed to load dashboards',
            SettingsDashboards_Error_FailedToSaveDashboards: 'Failed to update dashboard',
            SettingsDashboard_Title: 'Settings for {0}',
            SettingsDashboard_QnA_Title: 'Q&A',
            SettingsDashboard_QnA_Info1: 'Q&A allows users to find data and create charts using natural language for datasets used on a dashboard.',
            SettingsDashboard_QnA_Info2: 'Q&A capabilities are not available for datasets using direct connections to data that does not reside in Power BI.',
            SettingsDashboard_QnA_LearnMore: 'Learn more',
            SettingsDashboard_QnA_QnaEnabledMessage: 'Show the Q&A search box on this dashboard',
            SettingsDashboard_QnA_QnaUnavailableWarning: 'There are no datasets used on this dashboard for which Q&A is available.',
            SettingsDatasets_Title: 'Datasets',
            SettingsWorkbooks_Title: 'Workbooks',
            SettingsDataset_Title: 'Settings for ',
            SettingsDataset_Welcome_Before_Configuration: 'Before you can setup a refresh schedule, you\'ll need to configure a few things.',
            SettingsDataset_Install_OnPrem_Gateway: '1. Install the Power BI Personal Gateway on a computer that is always on.',
            SettingsDataset_OnPrem_Gateway_InstallNow: 'Install Now',
            SettingsDataset_OnPrem_Gateway_LearnMore: 'Learn More',
            SettingsDataset_OnPrem_Gateway_InstallPage: 'You can install the Gateway from: ',
            SettingsDataset_OnPrem_Gateway_InstallPage_EmailToYou: '. This link has been emailed to you.',
            SettingsDataset_Install_OnPrem_Gateway_Succeed: '1. The Gateway is installed and running on ',
            SettingsDataset_Provide_Credential: '2. Provide credentials in Manage Data Sources.',
            SettingsDataset_Provide_Credential_Valid: '2. Your data sources are valid.',
            SettingsDataset_SetScheduleRefresh: '3. Specify a schedule in Schedule Refresh.',
            SettingsDataset_SetScheduleRefresh_Done: '3. Your refresh schedule has been set.',
            SettingsDataset_Gateway_Title: 'Gateway',
            SettingsDataset_GatewayErrorMessage_NoGatewayInstalled: 'Please install the Gateway first.',
            SettingsDataset_Gateway_Location: 'The on-premise Gateway on ',
            SettingsDataset_Gateway_Location2: ' is online.',
            SettingsDataset_GatewayErrorMessage_GatewayOffline2: ' appears to be offline. Make sure ',
            SettingsDataset_GatewayErrorMessage_GatewayOffline3: ' is turned on and the service is running. Then try refreshing your report in PowerBI.com.',
            SettingsDataset_GatewayIsRunning: 'Gateway is running and connected on ',
            SettingsDataset_ScheduleRefresh_Title: 'Schedule Refresh',
            SettingsDataset_ScheduleRefresh_NextRefresh: 'Next refresh: ',
            SettingsDataset_ScheduleRefresh_EnableRefresh_Title: 'Keep your data up-to-date',
            SettingsDataset_ScheduleRefresh_EnableRefresh_Yes: 'Yes',
            SettingsDataset_ScheduleRefresh_EnableRefresh_No: 'No',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Title: 'Refresh frequency',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Daily: 'Daily',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Weekly: 'Weekly',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Monday: 'Monday',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Tuesday: 'Tuesday',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Wednesday: 'Wednesday',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Thursday: 'Thursday',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Friday: 'Friday',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Saturday: 'Saturday',
            SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Sunday: 'Sunday',
            SettingsDataset_ScheduleRefresh_TimeWindow: 'Refresh between',
            SettingsDataset_ScheduleRefresh_TimeWindow_1: '12 AM - 6 AM',
            SettingsDataset_ScheduleRefresh_TimeWindow_2: '6 AM - 12 PM',
            SettingsDataset_ScheduleRefresh_TimeWindow_3: '12 PM - 6 PM',
            SettingsDataset_ScheduleRefresh_TimeWindow_4: '6 PM - 12 AM',
            SettingsDataset_ScheduleRefresh_TimeZone: 'Time Zone',
            SettingsDataset_ScheduleRefresh_TimeProWindow: 'Time',
            SettingsDataset_ScheduleRefresh_Timezone_Afghanistan_Standard_Time: '(UTC+04:30) Kabul',
            SettingsDataset_ScheduleRefresh_Timezone_Alaskan_Standard_Time: '(UTC-09:00) Alaska',
            SettingsDataset_ScheduleRefresh_Timezone_Arab_Standard_Time: '(UTC+03:00) Kuwait, Riyadh',
            SettingsDataset_ScheduleRefresh_Timezone_Arabian_Standard_Time: '(UTC+04:00) Abu Dhabi, Muscat',
            SettingsDataset_ScheduleRefresh_Timezone_Arabic_Standard_Time: '(UTC+03:00) Baghdad',
            SettingsDataset_ScheduleRefresh_Timezone_Argentina_Standard_Time: '(UTC-03:00) Buenos Aires',
            SettingsDataset_ScheduleRefresh_Timezone_Atlantic_Standard_Time: '(UTC-04:00) Atlantic Time (Canada)',
            SettingsDataset_ScheduleRefresh_Timezone_AUS_Central_Standard_Time: '(UTC+09:30) Darwin',
            SettingsDataset_ScheduleRefresh_Timezone_AUS_Eastern_Standard_Time: '(UTC+10:00) Canberra, Melbourne, Sydney',
            SettingsDataset_ScheduleRefresh_Timezone_Azerbaijan_Standard_Time: '(UTC+04:00) Baku',
            SettingsDataset_ScheduleRefresh_Timezone_Azores_Standard_Time: '(UTC-01:00) Azores',
            SettingsDataset_ScheduleRefresh_Timezone_Bangladesh_Standard_Time: '(UTC+06:00) Dhaka',
            SettingsDataset_ScheduleRefresh_Timezone_Cabo_Verde_Standard_Time: '(UTC-01:00) Cabo Verde Is.',
            SettingsDataset_ScheduleRefresh_Timezone_Canada_Central_Standard_Time: '(UTC-06:00) Saskatchewan',
            SettingsDataset_ScheduleRefresh_Timezone_Caucasus_Standard_Time: '(UTC+04:00) Yerevan',
            SettingsDataset_ScheduleRefresh_Timezone_Cen_Australia_Standard_Time: '(UTC+09:30) Adelaide',
            SettingsDataset_ScheduleRefresh_Timezone_Central_America_Standard_Time: '(UTC-06:00) Central America',
            SettingsDataset_ScheduleRefresh_Timezone_Central_Asia_Standard_Time: '(UTC+06:00) Astana',
            SettingsDataset_ScheduleRefresh_Timezone_Central_Brazilian_Standard_Time: '(UTC-04:00) Cuiaba',
            SettingsDataset_ScheduleRefresh_Timezone_Central_Europe_Standard_Time: '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
            SettingsDataset_ScheduleRefresh_Timezone_Central_European_Standard_Time: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
            SettingsDataset_ScheduleRefresh_Timezone_Central_Pacific_Standard_Time: '(UTC+11:00) Solomon Is., New Caledonia',
            SettingsDataset_ScheduleRefresh_Timezone_Central_Standard_Time: '(UTC-06:00) Central Time (US and Canada)',
            SettingsDataset_ScheduleRefresh_Timezone_Central_Standard_Time_Mexico: '((UTC-06:00) Guadalajara, Mexico City, Monterrey',
            SettingsDataset_ScheduleRefresh_Timezone_China_Standard_Time: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
            SettingsDataset_ScheduleRefresh_Timezone_Dateline_Standard_Time: '(UTC-12:00) International Date Line West',
            SettingsDataset_ScheduleRefresh_Timezone_E_Africa_Standard_Time: '(UTC+03:00) Nairobi',
            SettingsDataset_ScheduleRefresh_Timezone_E_Australia_Standard_Time: '(UTC+10:00) Brisbane',
            SettingsDataset_ScheduleRefresh_Timezone_E_Europe_Standard_Time: '(UTC+02:00) Minsk',
            SettingsDataset_ScheduleRefresh_Timezone_E_South_America_Standard_Time: '(UTC-03:00) Brasilia',
            SettingsDataset_ScheduleRefresh_Timezone_Eastern_Standard_Time: '(UTC-05:00) Eastern Time (US and Canada)',
            SettingsDataset_ScheduleRefresh_Timezone_Egypt_Standard_Time: '(UTC+02:00) Cairo',
            SettingsDataset_ScheduleRefresh_Timezone_Ekaterinburg_Standard_Time: '(UTC+06:00) Ekaterinburg',
            SettingsDataset_ScheduleRefresh_Timezone_Fiji_Standard_Time: '(UTC+12:00) Fiji',
            SettingsDataset_ScheduleRefresh_Timezone_FLE_Standard_Time: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
            SettingsDataset_ScheduleRefresh_Timezone_Georgian_Standard_Time: '(UTC+04:00) Tbilisi',
            SettingsDataset_ScheduleRefresh_Timezone_GMT_Standard_Time: '(UTC) Dublin, Edinburgh, Lisbon, London',
            SettingsDataset_ScheduleRefresh_Timezone_Greenland_Standard_Time: '(UTC-03:00) Greenland',
            SettingsDataset_ScheduleRefresh_Timezone_Greenwich_Standard_Time: '(UTC) Monrovia, Reykjavik',
            SettingsDataset_ScheduleRefresh_Timezone_GTB_Standard_Time: '(UTC+02:00) Athens, Bucharest',
            SettingsDataset_ScheduleRefresh_Timezone_Hawaiian_Standard_Time: '(UTC-10:00) Hawaii',
            SettingsDataset_ScheduleRefresh_Timezone_India_Standard_Time: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
            SettingsDataset_ScheduleRefresh_Timezone_Iran_Standard_Time: '(UTC+03:30) Tehran',
            SettingsDataset_ScheduleRefresh_Timezone_Israel_Standard_Time: '(UTC+02:00) Jerusalem',
            SettingsDataset_ScheduleRefresh_Timezone_Jordan_Standard_Time: '(UTC+02:00) Amman',
            SettingsDataset_ScheduleRefresh_Timezone_Kaliningrad_Standard_Time: '(UTC+03:00) Kaliningrad',
            SettingsDataset_ScheduleRefresh_Timezone_Korea_Standard_Time: '(UTC+09:00) Seoul',
            SettingsDataset_ScheduleRefresh_Timezone_Magadan_Standard_Time: '(UTC+12:00) Magadan',
            SettingsDataset_ScheduleRefresh_Timezone_Mauritius_Standard_Time: '(UTC+04:00) Port Louis',
            SettingsDataset_ScheduleRefresh_Timezone_Mid_Atlantic_Standard_Time: '(UTC-02:00) Mid-Atlantic',
            SettingsDataset_ScheduleRefresh_Timezone_Middle_East_Standard_Time: '(UTC+02:00) Beirut',
            SettingsDataset_ScheduleRefresh_Timezone_Montevideo_Standard_Time: '(UTC-03:00) Montevideo',
            SettingsDataset_ScheduleRefresh_Timezone_Morocco_Standard_Time: '(UTC) Casablanca',
            SettingsDataset_ScheduleRefresh_Timezone_Mountain_Standard_Time: '(UTC-07:00) Mountain Time (US and Canada)',
            SettingsDataset_ScheduleRefresh_Timezone_Mountain_Standard_Time_Mexico: '(UTC-07:00) Chihuahua, La Paz, Mazatlan',
            SettingsDataset_ScheduleRefresh_Timezone_Myanmar_Standard_Time: '(UTC+06:30) Yangon (Rangoon)',
            SettingsDataset_ScheduleRefresh_Timezone_N_Central_Asia_Standard_Time: '(UTC+07:00) Novosibirsk',
            SettingsDataset_ScheduleRefresh_Timezone_Namibia_Standard_Time: '(UTC+01:00) Windhoek',
            SettingsDataset_ScheduleRefresh_Timezone_Nepal_Standard_Time: '(UTC+05:45) Kathmandu',
            SettingsDataset_ScheduleRefresh_Timezone_New_Zealand_Standard_Time: '(UTC+12:00) Auckland, Wellington',
            SettingsDataset_ScheduleRefresh_Timezone_Newfoundland_Standard_Time: '(UTC-03:30) Newfoundland',
            SettingsDataset_ScheduleRefresh_Timezone_North_Asia_East_Standard_Time: '(UTC+09:00) Irkutsk',
            SettingsDataset_ScheduleRefresh_Timezone_North_Asia_Standard_Time: '(UTC+08:00) Krasnoyarsk',
            SettingsDataset_ScheduleRefresh_Timezone_Pacific_SA_Standard_Time: '(UTC-04:00) Santiago',
            SettingsDataset_ScheduleRefresh_Timezone_Pacific_Standard_Time: '(UTC-08:00) Pacific Time (US and Canada)',
            SettingsDataset_ScheduleRefresh_Timezone_Pacific_Standard_Time_Mexico: '(UTC-08:00) Baja California',
            SettingsDataset_ScheduleRefresh_Timezone_Pakistan_Standard_Time: '(UTC+05:00) Islamabad, Karachi',
            SettingsDataset_ScheduleRefresh_Timezone_Paraguay_Standard_Time: '(UTC-04:00) Asuncion',
            SettingsDataset_ScheduleRefresh_Timezone_Romance_Standard_Time: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
            SettingsDataset_ScheduleRefresh_Timezone_Russian_Standard_Time: '(UTC+04:00) Moscow, St. Petersburg, Volgograd',
            SettingsDataset_ScheduleRefresh_Timezone_SA_Eastern_Standard_Time: '(UTC-03:00) Cayenne, Fortaleza',
            SettingsDataset_ScheduleRefresh_Timezone_SA_Pacific_Standard_Time: '(UTC-05:00) Bogota, Lima, Quito',
            SettingsDataset_ScheduleRefresh_Timezone_SA_Western_Standard_Time: '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
            SettingsDataset_ScheduleRefresh_Timezone_Samoa_Standard_Time: '(UTC-11:00) Samoa',
            SettingsDataset_ScheduleRefresh_Timezone_SE_Asia_Standard_Time: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
            SettingsDataset_ScheduleRefresh_Timezone_Singapore_Standard_Tim: '(UTC+08:00) Kuala Lumpur, Singapore',
            SettingsDataset_ScheduleRefresh_Timezone_South_Africa_Standard_Time: '(UTC+02:00) Harare, Pretoria',
            SettingsDataset_ScheduleRefresh_Timezone_Sri_Lanka_Standard_Time: '(UTC+05:30) Sri Jayawardenepura',
            SettingsDataset_ScheduleRefresh_Timezone_Syria_Standard_Time: '(UTC+02:00) Damascus',
            SettingsDataset_ScheduleRefresh_Timezone_Taipei_Standard_Time: '(UTC+08:00) Taipei',
            SettingsDataset_ScheduleRefresh_Timezone_Tasmania_Standard_Time: '(UTC+10:00) Hobart',
            SettingsDataset_ScheduleRefresh_Timezone_Tokyo_Standard_Time: '(UTC+09:00) Osaka, Sapporo, Tokyo',
            SettingsDataset_ScheduleRefresh_Timezone_Tonga_Standard_Time: '(UTC+13:00) Nuku\'alofa',
            SettingsDataset_ScheduleRefresh_Timezone_Turkey_Standard_Time: '(UTC+02:00) Istanbul',
            SettingsDataset_ScheduleRefresh_Timezone_Ulaanbaatar_Standard_Time: '(UTC+08:00) Ulaanbaatar',
            SettingsDataset_ScheduleRefresh_Timezone_US_Eastern_Standard_Time: '(UTC-05:00) Indiana (East)',
            SettingsDataset_ScheduleRefresh_Timezone_US_Mountain_Standard_Time: '(UTC-07:00) Arizona',
            SettingsDataset_ScheduleRefresh_Timezone_UTC: '(UTC) Coordinated Universal Time',
            SettingsDataset_ScheduleRefresh_Timezone_UTC_Plus_12: '(UTC+12:00) Coordinated Universal Time +12',
            SettingsDataset_ScheduleRefresh_Timezone_UTC_Minus_11: '(UTC-11:00) Coordinated Universal Time -11',
            SettingsDataset_ScheduleRefresh_Timezone_UTC_Minus_2: '(UTC-02:00) Coordinated Universal Time -02',
            SettingsDataset_ScheduleRefresh_Timezone_Venezuela_Standard_Time: '(UTC-04:30) Caracas',
            SettingsDataset_ScheduleRefresh_Timezone_Vladivostok_Standard_Time: '(UTC+11:00) Vladivostok',
            SettingsDataset_ScheduleRefresh_Timezone_W_Australia_Standard_Time: '(UTC+08:00) Perth',
            SettingsDataset_ScheduleRefresh_Timezone_W_Central_Africa_Standard_Time: '(UTC+01:00) West Central Africa',
            SettingsDataset_ScheduleRefresh_Timezone_W_Europe_Standard_Time: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
            SettingsDataset_ScheduleRefresh_Timezone_West_Asia_Standard_Time: '(UTC+05:00) Tashkent',
            SettingsDataset_ScheduleRefresh_Timezone_West_Pacific_Standard_Time: '(UTC+10:00) Guam, Port Moresby',
            SettingsDataset_ScheduleRefresh_Timezone_Yakutsk_Standard_Time: '(UTC+10:00) Yakutsk',
            SettingsDataset_ScheduleRefresh_AmPmWindows_Am: 'AM',
            SettingsDataset_ScheduleRefresh_AmPmWindows_Pm: 'PM',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_1: '1',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_10: '10',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_11: '11',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_12: '12',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_2: '2',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_3: '3',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_4: '4',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_5: '5',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_6: '6',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_7: '7',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_8: '8',
            SettingsDataset_ScheduleRefresh_TimeHourWindows_9: '9',
            SettingsDataset_ScheduleRefresh_TimeMinuteWindos_00: '00',
            SettingsDataset_ScheduleRefresh_TimeMinuteWindos_30: '30',
            SettingsDataset_Add_Refresh_Time: 'Add another time',
            SettingsDataset_DuplicateTime: 'Duplicate times are not allowed.',
            SettingsDataset_IncompleteTime: 'A complete time must be specified.',
            SettingsDataset_ScheduleRefresh_SendRefreshFailureEmail: 'Send refresh failure notification email to me',
            SettingsDataset_ScheduleRefresh_FlyoutMessage_RefreshNotEnabled: 'Refresh Schedule not enabled',
            SettingsDataset_ScheduleRefresh_FlyoutMessage_NextRefresh: 'Next refresh : ',
            SettingsDataset_ScheduleRefresh_FlyoutMessage_LastRefreshFailed: 'Last refresh failed: ',
            SettingsDataset_ScheduleRefresh_FlyoutMessage_LastRefreshSucceeded: 'Last refresh succeeded : ',
            SettingsDataset_ScheduleRefresh_FlyoutMessage_LastPackagePublishFailed: 'Package publish failed',
            SettingsDataset_ScheduleRefresh_FlyoutMessage_RefreshFailed: 'The last refresh failed because we couldn’t connect to the data sources in your dataset. Make sure the data sources are configured correctly.',
            SettingsDataset_ManageDataSources_Title: 'Manage Data Sources',
            SettingsDataset_ManageDataSources_EditButtonText: 'Edit credentials',
            SettingsDataset_ApplyButtonText: 'Apply',
            SettingsDataset_DiscardButtonText: 'Discard',
            SettingsDataset_RefreshHistoryText: 'Refresh History',
            SettingsDataset_ShowDetails: 'Show details',
            SettingsDataset_HideDetails: 'Hide details',
            SettingsDataset_ManageDataSources_Warning_YouNeedToProvideCredentials: 'Your data source cannot be kept up to date because the credentials are incorrect.',
            SettingsDataset_Notification_RefreshScheduleUpdated_Title: ' refresh schedule updated',
            SettingsDataset_Notification_RefreshScheduleUpdated_Message_Part1: 'Your updates to the ',
            SettingsDataset_Notification_RefreshScheduleUpdated_Message_Part2: ' Refresh Schedule have been applied',
            SettingsDataset_Notification_RefreshScheduleCannotBeUpdated_Title: ' refresh schedule cannot be updated',
            SettingsDataset_Notification_RefreshScheduleCannotBeUpdated_Message: 'When \'Refresh frequency\' is \'Weekly\' you have to select at least one day.',
            SettingsDataset_Notification_RefreshScheduleCannotBeUpdatedTimeFormat_Message: 'Please verify all refresh times are valid.',
            SettingsDataset_Notification_DatasourceUpdated_Title: ' Data Source Updated',
            SettingsDataset_Notification_DatasourceUpdated_Message_Part1: 'Your updates to the ',
            SettingsDataset_Notification_DatasourceUpdated_Message_Part2: ' data source have been applied',
            SettingsDataset_Notification_RefreshNow_Scheduled_Title: '',
            SettingsDataset_Notification_RefreshNow_Scheduled_Message: ' dataset will be refreshed soon',
            SettingsDataset_Notification_RefreshNow_NotScheduled_Title: '',
            SettingsDataset_Notification_RefreshNow_NotScheduled_Message_Part1: 'We couldn’t schedule refresh for ',
            SettingsDataset_Notification_RefreshNow_NotScheduled_Message_Part2: '. Be sure to check your refresh settings.',
            SettingsDataset_AreYouSureYouWantToLeaveThisDataset_Title: 'Are you sure you want to leave this Dataset',
            SettingsDataset_AreYouSureYouWantToLeaveThisWorkbook_Title: 'Are you sure you want to leave this Workbook',
            SettingsDataset_AreYouSureYouWantToLeaveThisDataset_Message: 'Your changes will be lost!',
            SettingsDataset_DisableEntireRefreshPageErrorMessage_ModelNotSupported: 'We don’t support scheduled refresh for this dataset.',
            SettingsDataset_DisableEntireRefreshPageErrorMessage_DataSourcesNotSupported: 'You cannot schedule refresh for this dataset because it gets data from sources that currently don’t support refresh.',
            SettingsDataset_Error_FailedToLoadModelForRefresh: 'Failed to load model for Refresh',
            SettingsDataset_Error_FailedToLoadDatasets: 'Failed to load datasets',
            SettingsDataset_Error_FailedToLoadDatasources: 'Failed to load Datasources',
            SettingsDataset_Error_FailedToTestConnection: 'Failed to test connection',
            SettingsDataset_Error_FailedToRetrieveGateway: 'Failed to retrieve gateway',
            SettingsDataset_Error_FailedToLoadRefreshHistory: 'Failed to load refresh history',
            SettingsDataset_Error_DatasourceCredentialsIncorrectTitle: 'You cannot refresh yet because you need to provide valid credentials for your data sources in the dataset.',
            SettingsDataset_Error_DatasourceCredentialsIncorrect: 'You can update the credentials for the data sources in the Manage Data Sources section on the Schedule Refresh settings page.',
            SettingsDataset_Error_GatewayOfflineTitle: 'You cannot refresh yet because your Personal Gateway is offline',
            SettingsDataset_Error_GatewayOffline: 'Make sure the computer where the Gateway is installed is turned on and the Gateway is running.  Also make sure the credentials provided in the Manage Data Sources section in the refresh settings are up-to-date.',
            SettingsDataset_Error_GatewayNotExistTitle: 'You cannot refresh now because your on-premise gateway is not installed.',
            SettingsDataset_Error_GatewayNotExist: 'An on-premise gateways is not found. Please install the Gateway before refreshing the model.',
            SettingsDataset_Error_FailedDuringTestConnection: 'Failed during TestConnection call',
            SettingsDataset_Error_FailedToSaveRefreshSettings: 'Failed to Update Refresh Schedule',
            SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimeNull: 'We received invalid data from server: RefreshSchedule.ExecutionTime is NULL. Assumed default value (0)',
            SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimeInvalidHour: 'We received invalid data from server: RefreshSchedule.ExecutionTime.Hour < 0 or > 23. Assumed default value (0)',
            SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidJsonFormat: 'We received invalid data from server: RefreshSchedule.executionTimesHourly has invalid format',
            SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidHour: 'We received invalid data from server: RefreshSchedule.executionTimesHourly.Hour < 0 or > 23. Assumed default value (0)',
            SettingsDataset_Error_InvalidDataFromServer_RefreshSettings_ExecutionTimesHourlyInvalidMinute: 'We received invalid data from server: RefreshSchedule.executionTimesHourly.Minute < 0 or > 59. Assumed default value (0)',
            SettingsDataset_Error_InvalidDataFromServer_NextRefreshOrLastRefreshNaN: 'We received invalid data from server: NextRefresh or LastRefresh is NaN. Assumed default value (0)',
            SettingsDataset_TakeOverButton_CancelTakeOver: 'Cancel Takeover',
            SettingsDataset_TakeOverButton_TakeOver: 'Take Over',
            SettingsDataset_TakeOverStatusText_Before: 'This schedule has been set by {0}. Would you like to take over the schedule?',
            SettingsDataset_TakeOverStatusText_After: 'You have chosen to take over this schedule.',
            SettingsDataset_TakeOverDetailsText: 'Changes will take affect once the schedule has been applied. You can cancel out at any time.',
            DatasetParametersDialog_NextButtonText: 'Next',
            DatasetParametersDialog_CancelButtonText: 'Cancel',
            DatasetParametersDialog_HelpButtonText: 'Help',
            DatasetParametersDialog_Configure: 'Configure',
            DatasetParametersDialog_ValidationError: 'Parameter validation failed, please make sure all parameters are valid.',
            DatasetParametersDialog_Error_FailedToUpdateModelParameters: 'Failed to update model parameters',
            HistoryDialog_Title: 'Refresh History',
            HistoryDialog_TableHeader_Type: 'Type',
            HistoryDialog_TableHeader_Start: 'Start',
            HistoryDialog_TableHeader_End: 'End',
            HistoryDialog_TableHeader_Status: 'Status',
            HistoryDialog_TableHeader_FailMessage: 'Fail Message',
            HistoryDialog_TableHeader_Details: 'Details',
            HistoryDialog_RefreshType_Scheduled: 'Scheduled',
            HistoryDialog_RefreshType_OnDemand: 'On demand',
            HistoryDialog_RefreshStatus_Completed: 'Completed',
            HistoryDialog_RefreshStatus_Failed: 'Failed',
            HistoryDialog_RefreshStatus_InProgress: 'In Progress',
            HistoryDialog_RefreshDetail_Show: 'Show',
            HistoryDialog_RefreshDetail_Hide: 'Hide',
            HistoryDialog_CloseButtonText: 'Close',
            AuthDialog_ApplyButtonText: 'Apply',
            AuthDialog_CancelButtonText: 'Cancel',
            AuthDialog_Configure: 'Configure',
            AuthDialog_FieldName_Authentication: 'Authentication Method:',
            AuthDialog_FieldName_Username: 'Username',
            AuthDialog_FieldName_Password: 'Password',
            AuthDialog_FieldName_AccountKey: 'Account key',
            AuthDialog_LinkText_GetYourMarketplaceAccountKey: 'Get your marketplace account key',
            AuthDialog_LinkText_SignUpForWindowsAzureMarketplace: 'Sign up for windows azure marketplace',
            AuthDialog_DisablePopupBlocker_OAuth: 'Ensure pop-ups are not being blocked by your browser',
            AuthDialog_LinkText_SignIn: 'Sign In',
            AuthDialog_LinkText_Edit: 'Edit',
            AuthDialog_LinkMessage_YouAreSignedIn: 'You are signed in',
            AuthDialog_Error_LoginFailed: 'Login failed.',
            AuthDialog_Error_FailedToUpdateDatasource: 'Failed to update the datasource',
            Dashboard_AddFeaturedQuestion: 'Add Featured Question...',
            DashboardTaskPane_Title: 'Welcome to Power BI',
            ContentProvider_Title: 'Bring your own data',
            ContentProvider_GetConfigurationFailed: 'Failed to retrieve configuration page for content provider.',
            ContentProvider_LoadingConfigurationPage: 'Loading configuration page',
            DashboardContainer_Ok: 'OK',
            TileEditor_PaneTitle_Details: 'Tile Details',
            TileEditor_PaneSubtitle_Title: 'Tile Title',
            TileEditor_EmptyTitleWarning: 'Title cannot be empty',
            TileEditor_EmptySubtitleWarning: 'Subtitle cannot be empty',
            TileEditor_SetCustomLink: 'Set custom link',
            TileEditor_UseDefaultText: 'Restore Default',
            TileEditor_UpdateFailed: 'Failed to update tile',
            TileHeadings_By: 'by {0}',
            ListJoin_Separator: ', ',
            TileEditor_Action_Url_WarningInvalidUrl: 'Please provide a valid URL beginning with http:// or https://',
            TileEditor_ApplyButtonText: 'Apply',
            TileEditor_DiscardButtonText: 'Discard',
            UploadExcel_BrowserPopUpDisabled: 'Browser pop-up is disabled. Please verify browser settings.',
            UploadExcel_Cancel: 'Cancel',
            UploadExcel_ConfigureFileFailed: 'Failed to configure selected file',
            UploadExcel_Error_WorkbookAlreadyExists: 'Workbook already exists',
            UploadExcel_ConfirmButtonText: 'upload',
            UploadExcel_DropBox: 'DropBox',
            UploadExcel_DropboxSignIn: 'Sign in to access your files',
            UploadExcel_Description: 'Add Excel data to your dashboard',
            UploadExcel_GetAuthEndpointFailed: 'Unable to retrieve authorization endpoint',
            UploadExcel_GetUserPropertiesFailed: 'Failed to retrieve user properties',
            UploadExcel_GetFileMetadataFailed: 'Failed to retrieve file metadata',
            UploadExcel_GetServicePropertiesFailed: 'Failed to retrieve service properties',
            UploadExcel_LocalBrowse: 'Browse',
            UploadExcel_LocalDevice: 'upload from device',
            UploadExcel_LoadingFiles: 'Loading files ...',
            UploadExcel_Connect: 'Connect',
            UploadExcel_ChooseFormatDescription: 'Choose how to connect to your Excel workbook',
            UploadExcel_ChooseFormat_Or: 'or',
            UploadExcel_ChooseFormat_ViewExcel: 'Connect, Manage and View Excel in Power BI',
            UploadExcel_ChooseFormat_ViewExcelDescription: 'Connect to your workbook and see it exactly as it is in Excel Online -- charts, PivotTables, worksheets, Power View sheets, and all.',
            UploadExcel_ChooseFormat_ImportData: 'Connect Power BI to data in Excel',
            UploadExcel_ChooseFormat_ImportDataDescription: 'Connect to the data in your workbook on OneDrive so you can create Power BI reports and dashboards for it. Data is automatically refreshed from OneDrive.',
            UploadExcel_ChooseFormat_Get: 'Connect',
            UploadExcel_Connecting_Toast: 'Connecting to your Excel workbook...',
            UploadExcel_Success_Toast: 'Your Excel workbook is ready in your list of reports.',
            UploadExcel_Success_Toast_MetaText: 'Take a look: {0}',
            UploadExcel_OfflineAccessRequest: 'Please provide offline access to the document',
            UploadExcel_OneDrive: 'OneDrive - Personal',
            UploadExcel_OneDriveDescription: 'Use OneDrive to access your files from anywhere and share with anyone.',
            UploadExcel_OneDriveFileName: 'Name',
            UploadExcel_OneDriveFileModifiedDate: 'Modified Date',
            UploadExcel_OneDriveFileSize: 'Size',
            UploadExcel_OneDriveSignIn: 'Sign in',
            UploadExcel_OneDriveSignOut: 'Sign out',
            UploadExcel_OneDrivePersonal: 'OneDrive - Personal',
            UploadExcel_OneDrivePro: 'OneDrive for Business',
            UploadExcel_OneDriveProDescription: 'Save your work files to OneDrive for Business so they\'re always with you.',
            UploadExcel_OneDriveProNoSharePointError: 'It looks like you don\'t have OneDrive for Business. Try using OneDrive - Personal.',
            UploadExcel_OneDriveProNoPowerBiForO365Error: 'In order to use Power BI with OneDrive for Business you need to sign up for Power BI for Office 365.',
            UploadExcel_OneDriveProNoPowerBiForO365Error2: 'If you have already signed up for Power BI for Office 365 please try again in 1 hour.',
            UploadExcel_OneDriveProConnecting: 'Connecting ...',
            UploadExcel_OneDriveProSignUp: 'Sign up',
            UploadExcel_OneDriveProSignUpForPowerBIForOffice365: 'Sign up for Power BI for Office 365',
            UploadExcel_OneDriveBusiness: 'OneDrive - Business',
            UploadExcel_NoOneDriveEmail: 'Unspecified account address',
            UploadExcel_ProcessingInProgress: 'Processing selected file, please wait ...',
            UploadExcel_ProgressDescriptionLoading: 'Loading ...',
            UploadExcel_PublishInProgress: 'Publishing selected file, please wait ...',
            UploadExcel_PublishWorkbookCanceled: 'Excel workbook publishing has been canceled',
            UploadExcel_PublishWorkbookFailed: 'Failed to publish Excel workbook',
            UploadExcel_ResolveAccessTokenFailed: 'Failed to resolve access token',
            UploadExcel_Title: 'Excel Workbook',
            UploadExcel_TitleUpload: 'Excel Workbook Upload',
            UploadExcel_UploadLimit: 'Only Excel workbooks up to 250 MB are supported.',
            UploadExcel_UploadLimit_ViewExcelMode: 'Power BI supports workbooks up to 250 MB, and the non-model part of the workbook must be less than 10MB. Get tips for ways to reduce workbook size.',
            UploadExcel_UnsupportedFileType: 'Only Excel 2007 or newer workbooks are supported',
            UploadExcel_WatermarkDescription: 'Drop file here',
            UploadExcel_Computer: 'Computer',
            UploadExcel_PlaceholderText: 'Choose file',
            ReportOptStatus_Idle: '',
            ReportOptStatus_Saving: 'SAVING...',
            ReportOptStatus_Saved: 'SAVED',
            ReportOptStatus_SaveFailed: 'FAILED',
            ReportOptStatus_Default: '',
            Landing_DashboardConnectionsButtonText: 'CONNECTIONS: ',
            Landing_DashboardConnectionsTitleText: 'Dashboard Connections',
            Landing_DashboardConnectionsLastUpdatedText: 'Last updated: ',
            Landing_DashboardConnectionsNoDataAvailableText: 'No Data Connection Available',
            ModalDialog_Save: 'Save',
            ModalDialog_Send: 'Send',
            ModalDialog_Cancel: 'Cancel',
            PowerViewError_Reload: 'Reload',
            PowerViewError_Close: 'Close',
            PowerViewError_DefaultTitle: 'oops, something went wrong',
            RenameService_Success: 'Rename Successful',
            RenameService_Error: 'Unable to rename tile group',
            RenameService_Reason: 'Could not contact service',
            ErrorBar_ConnectionErrorText: 'Connection Error',
            ErrorBar_FixItText: 'Fix it',
            ErrorBar_YesText: 'YES',
            ErrorBar_NoText: 'NO',
            ExternalContentViewer_BackToDashboard: 'Back to Dashboard',
            ExternalContentViewer_Title: 'Get data',
            ExternalContentViewer_GiveFeedback: 'Suggest a data source',
            ExternalContentViewer_UploadInProgress: 'Upload in Progress',
            ExternalContentViewer_Upload: 'Uploading your file to Power BI...',
            ExternalContentViewer_Cancel: 'Cancel',
            ShareView_Invite: 'Invite',
            ShareView_SharedWith: 'Shared With',
            ActivityPane_Tooltip: 'Activity Pane',
            ActivityPane_ConnectAction: 'Connect',
            ActivityPane_ShareAction: 'Share Dashboard',
            ActivityPane_SettingsAction: 'Settings',
            ActivityPane_AddTileAction: 'Add Tile',
            DashboardTaskPane_ReportsSectionHeader: 'Reports',
            DashboardTaskPane_DateSourcesSectionHeader: 'Data Sources',
            DashboardContextMenu_Open: 'OPEN',
            DashboardContextMenu_Explore: 'EXPLORE',
            DashboardContextMenu_ManageRefresh: 'SCHEDULE REFRESH',
            DashboardContextMenu_RefreshNow: 'REFRESH NOW',
            DashboardContextMenu_Rename: 'RENAME',
            DashboardContextMenu_Remove: 'REMOVE',
            DashboardContextMenu_Delete: 'DELETE',
            DashboardContextMenu_Settings: 'SETTINGS',
            DashboardContextMenu_Share: 'SHARE',
            DashboardContextMenu_Export: 'EXPORT',
            DashboardContextMenu_AllPermissionMessage: 'You can access, edit and reshare this dashboard',
            DashboardContextMenu_NonePermissionMessage: 'You don\'t have any permission on this dashboard',
            DashboardContextMenu_ReadPermissionMessage: 'You can access this dashboard',
            DashboardContextMenu_ReadResharePermissionMessage: 'You can access and reshare this dashboard',
            DashboardContextMenu_ReadWritePermissionMessage: 'You can access and edit this dashboard',
            DashboardContextMenu_ReSharePermissionMessage: 'You can reshare this dashboard',
            DashboardContextMenu_WritePermissionMessage: 'You can edit this dashboard',
            DashboardContextMenu_UnknownPermissionMessage: 'Cannot identify your permission on this dashboard',
            Model_FailToDeleteModelMessage: 'We failed to delete the dataset. Please try again later.',
            Model_FailToRenameModelMessage: 'We failed to rename the dataset. Please try again later.',
            Model_NoPermissionToDeleteMessage: 'You don\'t have permission to delete this dataset.',
            Model_NoPermissionToRenameMessage: 'You don\'t have permission to rename this dataset.',
            Report_NoPermissionToDeleteMessage: 'You don\'t have permission to delete this report.',
            Workbook_NoPermissionToRemoveMessage: 'You don\'t have permission to remove this workbook.',
            Report_NoPermissionToRenameMessage: 'You don\'t have permission to rename this report.',
            Workbook_NoPermissionToRenameMessage: 'You don\'t have permission to rename this workbook.',
            Report_FailToDeleteReportMessage: 'We failed to delete the report. Please try again later.',
            Workbook_FailToRemoveMessage: 'We failed to remove the workbook. Please try again later.',
            Report_FailToRenameReportMessage: 'We failed to rename the report. Please try again later.',
            Workbook_FailToRenameWorkbookMessage: 'We failed to rename the workbook. Please try again later.',
            Dashboard_FailToCreateDashboardMessage: 'We failed to create the dashboard. Please try again later.',
            Dashboard_FailToDeleteDashboardMessage: 'We failed to delete the dashboard. Please try again later.',
            Dashboard_FailToExportDashboardMessage: 'We failed to export the dashboard. Please try again later.',
            Dashboard_FailToRenameDashboardMessage: 'We failed to rename the dashboard. Please try again later.',
            Dashboard_FailToRemoveDashboardMessage: 'We failed to remove the dashboard. Please try again later.',
            DashboardDoesNotExistMessage: 'It may have been deleted or you may not have access to view it.',
            DashboardDoesNotExistTitle: 'Sorry, we couldn\'t find that dashboard',
            NotificationMessage_ExportingPackage: 'Exporting package',
            DashboardReadOnlyExportWarning_Message: 'This dashboard is read only, export is not allowed.',
            Dashboard_DeleteConfirmationMessage: 'Are you sure you want to permanently delete this dashboard?',
            Dashboard_DeleteConfirmationTitle: 'Delete Dashboard',
            Dashboard_RemoveConfirmationTitle: 'Remove Dashboard',
            Dashboard_RemoveConfirmationMessage: 'Are you sure you want to remove this dashboard?',
            Report_DeleteConfirmationMessage: 'Are you sure you want to permanently delete this report?',
            Workbook_RemoveConfirmationMessage: 'Are you sure you want to permanently remove this workbook?',
            Report_DeleteConfirmationTitle: 'Delete Report',
            Workbook_RemoveConfirmationTitle: 'Remove Workbook',
            Report_ExitOnDeletionConfirmationMessage: 'Another user has deleted this report.',
            Report_ExitOnDeletionConfirmationTitle: 'Report deleted',
            Report_ExitOnDeletionConfirmationButtonText: 'Close report',
            Model_DeleteConfirmationMessage: 'Are you sure you want to permanently delete this dataset?',
            Model_DeleteConfirmationTitle: 'Delete Dataset',
            Tile_LoadingText: 'LOADING...',
            Tile_ErrorText: 'We can’t load the content of this tile now. Please try again later.',
            PinTile_Error: 'Sorry, can\'t pin this visualization yet',
            PinTile_Error_DefaultDetails: 'We\'re working on this feature. Please send us any other feedback about Power BI.',
            PinTile_Success: 'Pinned to Dashboard',
            PinTile_Success_DefaultDetails: 'The visualization has been pinned to your dashboard.',
            SaveReport_Success: 'Report successfully saved.',
            SaveReport_Success_DefaultDetails: 'This report has been saved.',
            SaveReport_Error: 'An error occured during save.',
            SaveReport_Error_DefaultDetails: 'This report currently cannot be saved.',
            DashboardReadOnlyWarning_Title: 'Warning',
            DashboardReadOnlyWarning_Message: 'This dashboard is read only, your changes will not be saved.',
            BingSearchMetricsContentProvider_EnterUrl: 'Please enter a URL.',
            BingSearchMetricsContentProvider_SelectVisual: 'Please select at least one visual.',
            BingSearchMetricsContentProvider_Title: 'Bing Search Metrics',
            BingSearchMetricsContentProvider_Description: 'Track and explore search trends from Bing for the topics, search terms, or websites that matter most to you.',
            BingSearchMetricsContentProvider_UrlPrompt: 'Get metrics for URL:',
            BingSearchMetricsContentProvider_AddButtonText: 'Add',
            BingNewsContentProvider_EnterSearchTerm: 'Bing News Search:',
            BingNewsContentProvider_NoSearchTerm: 'Please enter a search term.',
            BingNewsContentProvider_AddButtonText: 'Add',
            BingNewsContentProvider_Title: 'Bing News',
            BingNewsContentProvider_Description: 'Track the latest news headlines on your dashboard with Bing News and stay up to date with news for the topics that matter most to you. Provide the search terms for topics you want to track and add a news tiles to the currently selected dashboard. Clicking on the listed news headlines opens the original articles so you can read further.',
            BingNewsTile_NoResults: 'We didn\'t find any results',
            AdditionalErrorInfo_RequestIdText: 'Request Id',
            AdditionalErrorInfo_ActivityIdText: 'Activity Id',
            AdditionalErrorInfo_TimestampText: 'Time',
            AdditionalErrorInfo_ErrorCodeText: 'Status Code',
            AdditionalErrorInfo_VersionText: 'Version',
            AdditionalErrorInfo_ClusterUriText: 'Cluster URI',
            AdditionalErrorInfo_ecsCorrelationId: 'ecsCorrelationId',
            ErrorMessage_FailedLoadGroup: 'Failed to load group content',
            ErrorMessage_FailedLoadDashboards: 'Failed to load all dashboards',
            ErrorMessage_FailedLoadContentProviders: 'Failed to load content providers',
            ErrorTitle_FailedToStorePackage: 'We couldn\'t import data from ',
            ErrorMessage_FailedToStorePackageExcel: 'Your data might not be formatted properly. You\'ll need to edit your workbook in Excel and then import it again.',
            ErrorMessage_FailedToGetPackageModels: 'Failed to store the data for new tile',
            ErrorMessage_DefaultTitle: 'oops, something went wrong',
            ErrorMessage_FailedToOpenExcelFile: 'This is not an Excel file or it is a password protected Excel file. If that\'s the case, try removing the password and uploading the file again.',
            ErrorMessage_NoConnectorAssociatedWithModel: 'This workbook connects to an Analysis Services server, but the server has not yet been connected to Power BI. Contact your administrator to configure a Analysis Services Connector to connect the server and Power BI.',
            ErrorTitle_FailedToStorePackageExcel: 'We couldn\'t find any data in your Excel workbook',
            NotificationMessage_ImportingPackage: 'Importing data',
            NotificationMessage_ImportingMashUpPackage: 'Connecting to data sources, please stay on this page',
            NotificationMessage_RetrievingAggregatedDataSourcesFromModel: 'Retrieving data sources, please stay on this page',
            NotificationMessage_NewDashboardCreatedTitle: 'Your new dashboard is ready',
            NotificationMessage_NewDashboardCreatedLinkDescription: 'Take a look',
            DisplayUnitSystem_E3_LabelFormat: '{0}K',
            DisplayUnitSystem_E3_Title: 'Thousands',
            DisplayUnitSystem_E6_LabelFormat: '{0}M',
            DisplayUnitSystem_E6_Title: 'Millions',
            DisplayUnitSystem_E9_LabelFormat: '{0}bn',
            DisplayUnitSystem_E9_Title: 'Billions',
            DisplayUnitSystem_E12_LabelFormat: '{0}T',
            DisplayUnitSystem_E12_Title: 'Trillions',
            Percentage: '#,0.##%',
            ResyncSessionTile_Warning: 'Warning',
            ResyncSessionToPreviousState_WarningMessage: 'We were unable to restore your session to the latest state. We have restored your session to a previously saved state.',
            NewDashboard_Placeholder: 'New Dashboard',
            NewDashboard_AddDashboardLabelText: 'Add Dashboard',
            DashboardName_InvalidNameNotificationTitle: 'Dashboard name invalid',
            DashboardName_EmptyWhitespaceErrorMessage: 'Dashboard name cannot be empty or whitespaces.',
            DashboardName_DuplicatedNameErrorMessage: 'Duplicate name exists.',
            SalesforceContentProvider_Landing_Title: 'Salesforce',
            SalesforceContentProvider_Landing_Description_Top1: 'With the Salesforce connector, you import and analyze your Salesforce data in Power BI. After connecting to your Salesforce account, you import a variety of data to explore and monitor in your Power BI dashboards.',
            SalesforceContentProvider_Landing_Description_Top2: 'Based on the persona you select, Power BI automatically creates a dashboard with customized visualizations of your data. This dashboard provides immediate insights into your data.',
            SalesforceContentProvider_Landing_Description_Bottom: 'You can also customize the dashboard, adding metrics that are important to you. All of your Salesforce data is updated automatically, ensuring you have the latest information available.',
            SalesforceContentProvider_Landing_MetricsHeading: 'Sample metrics include:',
            SalesforceContentProvider_Landing_Metrics_OpportunitiesValue: 'Value of opportunities in each stage',
            SalesforceContentProvider_Landing_Metrics_OpportunitiesCount: 'Number of open opportunities',
            SalesforceContentProvider_Landing_Metrics_Accounts: 'Top accounts by the total amount',
            SalesforceContentProvider_Landing_More1: 'More about',
            SalesforceContentProvider_Landing_More2: ' connecting to Salesforce data',
            SalesforceContentProvider_Landing_ConnectButton: 'Connect',
            SalesforceContentProvider_Landing_Error_BrowserPopUpDisabled: 'Browser pop-up is disabled. Please verify browser settings.',
            SalesforceContentProvider_Landing_Error_GetAuthEndpointFailed: 'Unable to resolve Salesforce authentication endpoint. Please try again later.',
            SalesforceContentProvider_Landing_Error_ConfigurationOptionsUnavailable: 'Unable to log in to Salesforce with provided credentials. Please make sure your Salesforce account allows API access and try again.',
            SalesforceContentProvider_Configuration_Title: 'Import from Salesforce',
            SalesforceContentProvider_Configuration_Type_Templates: 'Dashboards',
            SalesforceContentProvider_Configuration_Type_Reports: 'Reports',
            SalesforceContentProvider_Configuration_OKButtonText: 'OK',
            SalesforceContentProvider_Configuration_CancelButtonText: 'Cancel',
            SalesforceContentProvider_Configuration_ConnectButton: 'Connect',
            SalesforceContentProvider_Configuration_Dashboards_Title: 'Select an out of box dashboard customized by persona:',
            SalesforceContentProvider_Configuration_Embedded_Title: 'Salesforce',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Title: 'Select an out of box dashboard designed to get the most of your Salesforce data',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Preview_Title: 'Preview',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Preview_Description_SalesManager: 'Sales Manager Dashboard contains lots of info that may be relevant to you if you were a sales manager. Included tiles:',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Preview_Description_SalesRep: 'Sales Rep Dashboard contains lots of info that may be relevant to you if you were a sales representative. Included tiles:',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Preview_Metric_SaleOverTime: 'Sale over time',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Preview_Metric_CustomerRepsInLocation: 'Customer Reps in Location',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_Preview_Metric_TrendingSales: 'Trending Sales',
            SalesforceContentProvider_Configuration_Embedded_Reports_Title: 'Choose any Salesforce reports you would like to import into PowerBI.com.',
            SalesforceContentProvider_Configuration_Embedded_Reports_DateTime_Never: 'Never',
            SalesforceContentProvider_Configuration_Dashboards_SalesManager: 'Sales Manager Dashboard',
            SalesforceContentProvider_Configuration_Dashboards_SalesRep: 'Sales Rep Dashboard',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_SalesManager: 'Sales Manager',
            SalesforceContentProvider_Configuration_Embedded_Dashboards_SalesRep: 'Sales Rep',
            SalesforceContentProvider_Configuration_Reports_NameHeader: 'Name',
            SalesforceContentProvider_Configuration_Reports_LastViewedHeader: 'Last Viewed',
            SalesforceContentProvider_Configuration_Reports_LastEditied: 'Last Edited',
            SalesforceContentProvider_Configuration_Reports_Loading: 'Loading your Salesforce reports...',
            SalesforceContentProvider_Configuration_Reports_NoneAvailable: 'We didn’t find any reports in your Salesforce account. Please add some and then try again.',
            SalesforceContentProvider_Configuration_ReportsSelectionInfo_Single: 'You\'ve selected {0} report.',
            SalesforceContentProvider_Configuration_ReportsSelectionInfo_Multiple: 'You\'ve selected {0} reports.',
            SalesforceContentProvider_Configuration_Error_UnableToAccessSalesforceAccount: 'Sorry, we weren\'t able to access your account. Please contact your administrator.',
            SalesforceContentProvider_Configuration_Error_ReportsLoadFailedGeneric: 'Sorry, something went wrong while retrieving the list of your reports. Please try again later.',
            SalesforceContentProvider_Configuration_Error_Unknown: 'Sorry, something went wrong. Please try again later.',
            MashUpContentProvider_Title: 'MashUp Content Provider',
            MashUpContentProvider_Description: 'Third party content providers for PowerBI.',
            MashUpContentProvider_ImportButtonText: 'Connect',
            MashUpContentProvider_Error_MissingModelFromPackage: 'Missing model from the package',
            MashUpContentProvider_RetailSalesSample_Title: 'Retail Sales Sample',
            MashUpContentProvider_RetailSalesSample_Description1: 'This industry sample dashboard and underlying report analyzes retail sales data of items sold across multiple stores and districts. The metrics compare this year\'s performance to last year\'s in these areas: sales, units, gross margin, and variance, as well as new store analysis. This is real data that has been anonymized.',
            MashUpContentProvider_Sample_Usage: 'How to use this sample',
            MashUpContentProvider_Sample_DataReportDashboard: 'This sample contains a dashboard, a report, and data.',
            MashUpContentProvider_NFL2014SeasonRecap_Description1: 'Explore statistics from National Football League regular season and playoff games for the 2014 season. Statistics and key measures are provided game by game for each team and player, with additional data for fan attendance, game day weather, and player backgrounds. ',
            MashUpContentProvider_NFL2014SeasonRecap_GetStarted: 'To get you started with the data, the sample provides these reports:',
            MashUpContentProvider_NFL2014SeasonRecap_GetStarted1: 'Team weekly scoring recap with statistical leaders',
            MashUpContentProvider_NFL2014SeasonRecap_GetStarted2: 'Game by game recap',
            MashUpContentProvider_NFL2014SeasonRecap_GetStarted3: 'Passing, rushing, receiving, and defensive stat recaps',
            MashUpContentProvider_NFL2014SeasonRecap_GetStarted4: 'Outcomes against the spread',
            MashUpContentProvider_NFL2014SeasonRecap_GetStarted5: 'Player demographics',
            MashUpContentProvider_NFL2014SeasonRecap_ExploreFurtherDesc1: 'Want to explore the data further? Go ahead! Ever wondered… ',
            MashUpContentProvider_NFL2014SeasonRecap_ExploreFurther1: 'Which draft round produced the players who scored most touchdowns in the playoffs?',
            MashUpContentProvider_NFL2014SeasonRecap_ExploreFurther2: 'How colleges rank based on the number of snaps their former players were on the field for?',
            MashUpContentProvider_NFL2014SeasonRecap_ExploreFurther3: 'The average QB rating for quarterbacks playing in domed stadiums, when favored? ',
            MashUpContentProvider_NFL2014SeasonRecap_ExploreFurtherDesc2: 'If so, then this data set is for you. The answers to these and many other questions are waiting in this data.',
            MashUpContentProvider_NFL2014SeasonRecap_Description2: 'This copy of the sample is yours to experiment with. You can always connect to the sample again for a fresh copy.',
            MashUpContentProvider_Sample_Click: 'Click ',
            MashUpContentProvider_Sample_Connect: 'Connect ',
            MashUpContentProvider_Sample_ConnectSuffix: 'above to get started. Power BI automatically creates a dashboard with visualizations based on the sample data.',
            MashUpContentProvider_Sample_InDashboard: 'In the dashboard:',
            MashUpContentProvider_Sample_InDashboard1: 'Try typing natural-language questions to explore the data. Pin the resulting visualizations and metrics to your dashboard.',
            MashUpContentProvider_Sample_InDashboard2: 'Click a tile to explore the underlying data and reports.',
            MashUpContentProvider_Sample_InReport: 'In the report:',
            MashUpContentProvider_Sample_Report1: 'Change visualizations from one type to another.',
            MashUpContentProvider_Sample_Report2: 'Move visualizations and add new ones.',
            MashUpContentProvider_Sample_Report3: 'Pin interesting visualizations to the dashboard. ',
            MashUpContentProvider_Sample_Report4: 'See what insights you can discover in the data.',
            MashUpContentProvider_Sample_Description3: 'This copy of the sample is yours to experiment with. You can always connect to the sample again for another copy.',
            MashUpContentProvider_Sample_More: 'About the sample',
            MashUpContentProvider_Sample_LearnMore: 'More about the specifics of this sample',
            MashUpContentProvider_Sample_LearnMoreDescription: 'and how you can enhance it.',
            MashUpContentProvider_GitHub_Description1: 'Visualize different types of repository activity in Power BI by connecting to your GitHub data. You get a Power BI dashboard and reports with insights about how many commits, who contributes most, and at what time of day. Use the dashboard and reports provided, or customize them to highlight the information you care about most.',
            MashUpContentProvider_GitHub_Description2: 'The data in Power BI is updated daily from GitHub according to a schedule that you control.',
            MashUpContentProvider_GitHub_More1: 'More about',
            MashUpContentProvider_GitHub_More2: ' connecting to GitHub Data',
            MashUpContentProvider_GoogleAnalytics_Description1: 'Visualize data from your Google Analytics account directly in Power BI. Connect using your Google credentials and immediately gain insights from the sites that you’re tracking, such as the site traffic over the last 30 days or the days of the week your site is most popular. Data from the last 180 days is included and will automatically refresh each day. Existing reports provide a view of trends over time and can be customized based on the metrics important to you.',
            MashUpContentProvider_Marketo_Description1: 'Bring rich marketing analytics directly into Power BI by connecting to Marketo. Extend the power of your Power BI dashboards with reports that provide rich insights into your buyer profiles, marketing campaign success rates, email engagement, and more. Use the dashboard and reports provided, or customize them to highlight the information you care about most.',
            MashUpContentProvider_Marketo_Description2: 'The data in Power BI is automatically updated from Marketo, so you always see the latest data.',
            MashUpContentProvider_Marketo_More1: 'More about',
            MashUpContentProvider_Marketo_More2: ' connecting to Marketo Data',
            MashUpContentProvider_QuickBooks_Description1: 'Get insights into your business by connecting Power BI with QuickBooks Online.  Connect Power BI to QuickBooks Online using you QuickBooks Online admin credentials to get a dashboard with insights to your business cash flow, profitability, customers, and more.  Use the default dashboard and reports, or customize them to highlight the information you care most about.',
            MashUpContentProvider_QuickBooks_Description2: 'The data that appears in Power BI will be updated daily from QuickBooks Online based on the schedule that you set.',
            MashUpContentProvider_QuickBooks_Description3: 'With the current version of the Power BI and QuickBooks Online integration, one QuickBooks Online admin user can connect and create the Power BI dashboard, which can then be shared with other Power BI users.',
            MashUpContentProvider_QuickBooks_More1: 'More about',
            MashUpContentProvider_QuickBooks_More2: ' connecting to QuickBooks Online data',
            MashUpContentProvider_Zendesk_Description1: 'Analyze your Zendesk data in Power BI by connecting with your Zendesk admin account credentials. Power BI creates a dashboard with reports that provide insights about your ticket volumes and agent performance. Use the dashboard and reports provided, or customize them to highlight the information you care about most.',
            MashUpContentProvider_Zendesk_Description2: 'Your data in the Zendesk service is transmitted to Power BI so that you can perform business analytics. This data is updated daily from Zendesk according to a schedule that you control.',
            MashUpContentProvider_Zendesk_More1: 'More about',
            MashUpContentProvider_Zendesk_More2: ' connecting to Zendesk data',
            MashUpContentProvider_VisualStudioOnline_Description1: 'Visualize your source code activity in Power BI by connecting to Microsoft Visual Studio Online. The default dashboard and report provide at-a-glance views of git, pull request, and version control activity across the projects you configure for your account.  You can customize the dashboard and report to highlight the deeper insights you care about most.',
            MashUpContentProvider_VisualStudioOnline_Description2: 'The data that appears in Power BI will be updated from Microsoft Visual Studio Online according to a schedule that you control.',
            MashUpContentProvider_VisualStudioOnline_More1: 'More about',
            MashUpContentProvider_VisualStudioOnline_More2: ' connecting to Visual Studio Online data',
            MashUpContentProvider_Sage_Description1: 'The Sage One Accounting application allows you to import and analyze your financial and sales data in Power BI. After connecting to your Sage One account, you\'ll be able to import your data and view your company\'s performance using flexible Power BI dashboards. You’ll have immediate insight into your data to make informed business decisions.',
            MashUpContentProvider_Sage_Description2: 'Customize the dashboards to include metrics that provide you with the information you need for your business, then slice, dice and analyze the data any way you like using the variety of tools available in Power BI. All your latest Sage One Accounting information will be updated automatically, ensuring you always have your finger on the pulse.',
            MashUpContentProvider_Sage_Title: 'Sample metrics include:',
            MashUpContentProvider_Sage_Top4Sales: 'Top 5 Items by Sales',
            MashUpContentProvider_Sage_Top5Customers: 'Top 5 Customers by Sales',
            MashUpContentProvider_Sage_AndMore: 'And More.',
            MashUpContentProvider_Sage_More1: 'More about',
            MashUpContentProvider_Sage_More2: ' connecting to Sage data',
            MashUpContentProvider_SendGrid_Description1: 'With the SendGrid connector, monitor all your important email metrics in one dashboard using Power BI. After you connect with your SendGrid credentials, Power BI imports your email metrics into a single dashboard. From there, you can customize your dashboard and drill down for greater detail.',
            MashUpContentProvider_SendGrid_Description2: 'With SendGrid advanced statistics enabled, you can monitor your most important metrics at a glance and measure user engagement for the emails you send.',
            MashUpContentProvider_SendGrid_Title: 'Sample metrics include:',
            MashUpContentProvider_SendGrid_AggregatedStats: 'Trend data for specified periods of time including requests, delivered, opens, clicks, unsubscribes, bounces, and spam reports',
            MashUpContentProvider_SendGrid_EmailMetricsByCategory: 'By client, device, ISP, and browser',
            MashUpContentProvider_SendGrid_EmailMetricsByGeography: 'By geographical location including country, state, and city',
            MashUpContentProvider_SendGrid_EmailMetricsByISP: 'By email category (for example, user alerts, welcome emails, confirmations, or newsletters)',
            MashUpContentProvider_SendGrid_More1: 'More about',
            MashUpContentProvider_SendGrid_More2: ' connecting to SendGrid data',
            MashUpContentProvider_DynamicCRM_Description1: 'Connect to your Microsoft Dynamics CRM account for immediate access to insights about your opportunities, accounts, and more. This connector is designed specifically for sales managers, providing details on sales performance, pipeline, and activities. The dashboard and report are built on top of a fully featured model, so you can explore and analyze your data as you need. Automatic refresh ensures you always see the latest data.',
            MashUpContentProvider_DynamicCRM_More1: 'More about',
            MashUpContentProvider_DynamicCRM_More2: ' connecting to Microsoft Dynamics CRM data',
            MashUpContentProvider_DynamicMarketing_Description1: 'Use the Microsoft Dynamics Marketing Content Pack for Power BI to quickly build your marketing performance analytics. The content pack is designed specifically for marketing managers who focus on demand generation. Its components draw directly from your marketing database to provide reports on topics that include: marketing contacts and companies; territory analysis; campaign ownership and ROMI; lead pipeline, scoring and generation over time; segment analysis; and the performance of landing pages, marketing emails and tracked web pages. The reports and dashboards are built on top of a model that focuses on demand generation. The out-of-box reports and dashboards give you a great starting point for exploring and analyzing your marketing data.',
            MashUpContentProvider_PBIExecutionReview_Title: 'PowerBI Execution Review',
            MashUpContentProvider_PBIExecutionReview_Description1: 'Power BI enables your organization to publish sources of data that are relevant to your business. This sample includes a collection of data, reports and a dashboard.',
            MashUpContentProvider_PBIExecutionReview_Description2: 'Click on the Connect button to get started. You will see a new dashboard automatically created with a collection of visuals based on the sample data. From the dashboard, you can click on a tile to explore the underlying data and reports. You will also be able to pin interesting visuals to the dashboard, that you can continue to monitor. Additionally you can use natural language to explore the data and pin interesting visuals and metrics to your dashboard.',
            MashUpContentProvider_MSITNTA_Title: 'IT New Technology Adoption',
            MashUpContentProvider_MSITNTA_Description1: 'Connect to Microsoft’s organizational data to gain insights into Microsoft IT Applications’ adoption of latest technologies across the portfolio of solutions Microsoft employees use. You will get a dashboard with a report backed by data from an on premise SQL Server Analysis Services instance.  You will be able to customize the dashboard adding metrics that are important to you.',
            MashUpContentProvider_MSITNTA_Support: 'Questions on data and reports: ntacore@microsoft.com',
            MashUpContentProvider_WinUserVoice_Title: 'Windows UserVoice',
            MashUpContentProvider_WinUserVoice_Description1: 'Windows and Windows Phone UserVoice are feedback portals where Windows and Windows Phone users can submit feature suggestions, vote and/comment on those suggestions, and be heard! Through the portals, engineering teams can identify innovative features that our users crave.',
            MashUpContentProvider_WinUserVoice_Description2: 'Connect to Microsoft’s organizational data of Windows and Windows Phone UserVoice feedback to get a quick and up-to-date view of the total users, total suggestions and total votes for both Windows UserVoice and Windows Phone UserVoice. You will get a dashboard with a report backed by data from an on premise SQL Server Analysis Services instance.  The reports include top categories for both portals, and trends in suggestions, votes and comments, during a given period of time. You will be able to customize the dashboard adding metrics that are important to you.',
            MashUpContentProvider_WinUserVoice_Support: 'Questions on data and reports: winuservoice@microsoft.com',
            MashUpContentProvider_DCU_Title: 'Digital Crimes Unit',
            MashUpContentProvider_DCU_Description1: 'The Digital Crimes Unit (DCU) is an international legal and technical team working with partners, to help create a safe digital world. The DCU operates in conjunction with Internet Service Providers and Computer Emergency Response Teams to disrupt botnets from cybercriminals. These botnets can be involved in activities ranging from e-mail spam and click fraud to financial fraud and privacy invasion. After Microsoft disrupts these botnets, affected devices continue to call into Digital Crimes Unit allowing reporting and to notify those still affected by malware.',
            MashUpContentProvider_DCU_Description2: 'Connect to Microsoft’s organizational data to gain insights into the summary of calls that are made to the DCU every day by devices still affected by several of the botnets that the Digital Crimes Unit has disrupted. You will get a dashboard with a report backed by data from an on premise SQL Server Analysis Services instance.  You will be able to customize the dashboard adding metrics that are important to you.',
            MashUpContentProvider_DCU_Support: 'Questions on data and reports: DCU_BI_Status@microsoft.com',
            MashUpContentProvider_HR_Title: 'People View',
            MashUpContentProvider_HR_Description1: 'Connect to Microsoft’s organizational data to gain insights into Headcount, Average Directs and Anniversaries. You will get a dashboard with a report backed by data from an on premise SQL Server Analysis Services instance.  You will be able to customize the reports and dashboard adding metrics that are important to your group.',
            MashUpContentProvider_HR_Support: 'Questions on data and reports: hrreport@microsoft.com',
            MashUpContentProvider_OrgApps_Legal: 'This dataset is based on Microsoft confidential information and cannot be shared with external non-Microsoft parties under any circumstances',
            DashboardInvitationInvalid: 'This invitation is invalid',
            DashboardInvitationRevoked: 'The dashboard owner has removed access to this dashboard',
            DashboardInvitationExpired: 'This invitation has expired',
            DashboardInvitationRemoteTenant: 'The data for the invitation is not currently available',
            DashboardInvitationUnverifiedEmail: 'This invitation was not intended for the current signed in user. Only the intended recipient can access this dashboard',
            DashboardInvitationInvalidTenant: 'This invitation contains dashboards, reports or data outside your organization which cannot be viewed',
            DashboardInvitationInvalidParameters: 'Invalid parameters specified',
            DashboardInvitationInvalidRequest: 'There was an error processing the invitation',
            DashboardInvitationErrorTitle: 'You do not have access to this dashboard',
            Sharing_WrongEmailAddresses: 'Invalid list of email addresses. Please correct them',
            Sharing_EmailAddressExceeded: 'You can only share to {{maxEmails}} contacts at a time, please remove some',
            Sharing_NoEmailAddressSpecified: 'Please specify one or more e-mail addresses',
            Sharing_InvalidEntry: 'Invalid entry',
            Sharing_MessageSizeExceeded: 'Message is too long',
            Sharing_FailedToLoadInvitedUsers: 'Failed to load invited users',
            Sharing_FailedToLoadUsers: 'Failed to load dashboard users',
            Sharing_FailedToInvitedUsers: 'Failed to send email to invite users',
            Sharing_FailedToCancelInvitation: 'Failed to cancel invite',
            Sharing_FailedToDeleteDashboardUser: 'Failed to delete dashboard user',
            Sharing_Status: 'Status',
            Sharing_Success: 'Success!',
            Sharing_Failure: 'Failure',
            Sharing_EditDashboardUsersSuccess: 'Your changes were successfully saved',
            Sharing_SendEmailSuccess: 'Your dashboard has been shared successfully.',
            Sharing_UsersCanReshare: 'Allow recipients to share your dashboard',
            Sharing_CancelInvite: 'Cancel Invite',
            Sharing_StopSharing: 'Stop Sharing',
            Sharing_InviteWillBeCancelled: 'Invite will be cancelled',
            Sharing_UserDeleted: 'Sharing will be removed',
            Sharing_Owner: 'Owner',
            Sharing_DashboardOwner: 'Dashboard owner is ',
            Sharing_OnlyWithYou: 'Not shared with anyone',
            Sharing_SharedWith: 'Shared with ',
            Sharing_EmailText: 'Check out this dashboard I created to track our data.',
            Sharing_EnterEmailText: 'Enter email addresses separated by ; or ,',
            Sharing_UsersCannotReshare: 'You do not have sufficient permissions to share this dashboard',
            Sharing_SharedWithNOthers: ' and {{numberOthers}} others',
            Sharing_FailedToEditPermissions: 'Unable to edit permissions',
            Sharing_PermissionDisplay_CanView: 'Can view',
            Sharing_PermissionDisplay_CanEdit: 'Can edit',
            Sharing_PermissionOptions_StopSharing: 'Stop sharing',
            Sharing_PermissionOptions_DisableReshares: 'Disable reshares',
            Sharing_PermissionOptions_EnableReshares: 'Enable reshares',
            Sharing_EmailDomainNotInTenant: 'One or more e-mail addresses are outside your organization: {{invalidDomains}}',
            Sharing_DataAccessNotification: 'Recipients will have access to the same data and reports as you have in this dashboard.',
            Sharing_DataAccessNotificationLink: 'Learn more',
            Publish_SuccessMessage: 'The content pack "{0}" has been published to the organization content gallery.',
            Publish_Success: 'Success!',
            Publish_Failure: 'Failure',
            ActivityPane_ErrorMessage_FailedLoadPaneContent: 'Failed to load activity pane data.',
            ActivityPane_ConnectionOptionsText: 'Connection Options',
            ActivityPane_Explore: 'EXPLORE',
            ActivityPane_CuratedContentReportTitle: 'REPORTS',
            ActivityPane_CuratedContentDashboardTitle: 'DASHBOARDS',
            ActivityPane_CuratedContentTileTitle: 'TILES',
            ConnectionsSettingsDialog_Title_Text: 'Connection Settings',
            ConnectionsSettingsDialog_Load_Content_Error_Text: 'An error occured during getting data for connection settings dialog.',
            ConnectionsSettingsDialog_Refresh_Settings_Title_Text: 'Refresh Settings',
            ConnectionsSettingsDialog_Refresh_Settings_Last_Updated_Title_Text: 'Last updated: ',
            ConnectionsSettingsDialog_Delete_Connection_Title_Text: 'Delete Connection',
            ConnectionsSettingsDialog_Delete_Connection_Content_Text: 'Deleteing a connection cannot be undone.',
            ConnectionsSettingsDialog_Delete_Connection_Link_Text: 'Delete Connection',
            ConnectionsSettingsDialog_Delete_Done_Button_Text: 'Done',
            ConnectionsSettingsDialog_Delete_Confirmation_Text: 'Are you sure you want to delete this connection?',
            ConnectionsSettingsDialog_Delete_Error_Text: 'An error happened during deleting the package.',
            TableTotalLabel: 'Total',
            ExpiredTokenError_Title: 'Session has expired',
            ExpiredTokenError_Text: 'Your login session has expired. Please refresh the page.',
            ExcelContentProvider_Landing_Title: 'Excel Workbook',
            ExcelContentProvider_Landing_Description: 'Unlocking the insights stored in your Excel workbooks couldn\'t be easier. By either directly uploading or connecting Power BI to your OneDrive account, you can begin to track your most important metrics on an interactive, real-time dashboard. Data is automatically refreshed from OneDrive, ensuring you have the latest information as you make decisions and take actions.',
            ExcelContentProvider_Landing_SupportedObjectsHeading: 'Supported Excel objects:',
            ExcelContentProvider_Landing_Supported_1: 'Worksheet tables',
            ExcelContentProvider_Landing_Supported_2: 'Excel Data Model tables',
            ExcelContentProvider_Landing_Supported_3: 'Power View sheets',
            ExcelContentProvider_Landing_WorksWellHeading: 'Works well with:',
            ExcelContentProvider_Landing_WorksWell_1: 'Excel 2007 workbooks and later (.xlsx and .xlsm files)',
            ExcelContentProvider_Landing_DownloadSample_1: 'Need a workbook to try?',
            ExcelContentProvider_Landing_DownloadSample_2: 'Download this one',
            ExcelContentProvider_Landing_LearnMore1: 'More about',
            ExcelContentProvider_Landing_LearnMore2: ' connecting to Excel data',
            ExcelContentProvider_Landing_ConnectButton: 'Connect',
            QnAVisualization_ModelDetailsTitle: 'Showing data from',
            QnAVisualization_ModelDetailsExploreLink: 'explore more...',
            ModalDialogButtonText_Yes: 'Yes',
            ModalDialogButtonText_No: 'No',
            PowerBICompanionProvider_Landing_Title: 'Power BI Designer File',
            PowerBICompanionContentProvider_Landing_Description1: 'Upload reports and data created with Power BI Designer. With the Designer app, you unleash the full power of Power BI: easily create reports based on data from a wide range of data sources, shape and combine the data to fit your needs, and create stunning visualizations to make your data speak for itself.',
            PowerBICompanionContentProvider_Landing_Description2: 'If you haven\'t tried it yet, ',
            PowerBICompanionContentProvider_Landing_Description3: 'download Power BI Designer today',
            PowerBICompanionContentProvider_Landing_Description4: ' and bring your Power BI reports and dashboards to the next level.',
            PowerBICompanionContentProvider_Landing_PowerBIDesignerData_1: 'More about',
            PowerBICompanionContentProvider_Landing_PowerBIDesignerData_2: ' connecting to Power BI Designer data',
            PowerBICompanionContentProvider_Landing_ConnectButton: 'Connect',
            UploadPowerBICompanion_YourComputer: 'Computer',
            UploadPowerBICompanion_Connect: 'Connect',
            UploadPowerBICompanion_Cancel: 'Cancel',
            UploadPowerBICompanion_LocalBrowse: 'Browse',
            UploadPowerBICompanion_PlaceholderText: 'Choose file',
            UploadPowerBICompanion_UnsupportedFileType: 'Only .pbix files are supported',
            UploadPowerBICompanion_PublishInProgress: 'Publishing selected file, please wait ...',
            UploadPowerBICompanion_PublishFileCanceled: '.pbix file publishing has been canceled',
            UploadPowerBICompanion_PublishFileFailed: 'Failed to publish .pbix file',
            UploadPowerBICompanion_UploadLimit: 'Only .pbix files up to 250 MB are supported.',
            UploadPowerBICompanion_TitleUpload: '.pbix file Upload',
            QnAVisualization_ModelsListDescription: 'Here\'s the data used on this dashboard. To ask questions about this data try starting with words that appear in the data (such as column names or row values). Or, open any of the data sources to explore on your own...',
            QnAVisualization_NoModelMessage: 'It looks like you haven\'t added any data to this dashboard.',
            QnAVisualization_NoSupportedModelMessage: 'You\'re connected to data sources that are not supported by Q&A. Open any of the data sources to explore on your own...',
            QnAVisualization_NoModelDescription1: 'Get data',
            QnAVisualization_NoModelDescription2: 'or add tiles to this dashboard from data sources you\'ve already connected to and Q&A will allow you to ask questions about this data.',
            QnAVisualization_DataSources: 'Data sources',
            AddDashboard_ToolTip: 'Add a dashboard',
            SettingsGroupsNames_General: 'General',
            SettingsGroupsNames_Dashboards: 'Dashboards',
            SettingsGroupsNames_Datasets: 'Datasets',
            SettingsGroupsNames_Workbooks: 'Workbooks',
            QnaTextBoxPlaceholder: 'Ask a question about the data on this dashboard',
            QnaTextBoxLoadingPlaceholder: 'LOADING...',
            InterpretRetryMaxCountExceededMessageText: 'There was a timeout executing your query. Please try again later.',
            WorkbooksLoadingTimeoutTitle: 'Please wait',
            WorkbooksLoadingTimeoutText: 'Contacting Power BI Q&A service...',
            UtteranceFeedbackTooltip: 'Help improve Q&A',
            UtteranceFeedbackDialogTitle: 'Q&A Feedback',
            UtteranceFeedbackDialogPrompt: 'Please rate how well Q&A helped find data to answer your question.',
            UtteranceFeedbackResultBad: 'Way Off',
            UtteranceFeedbackResultMedium: 'Got Close',
            UtteranceFeedbackResultGood: 'Great',
            PackageOperationBlocked: 'We can’t perform this operation right now because another delete or refresh is in progress. Try again later.',
            PackageRefreshUnknownFailure: 'There was an unknown error while refreshing your data.',
            DataRefreshBlocked: 'We cannot refresh your workbook right now. Try again after five minutes.',
            RefreshingData: 'Refreshing data',
            PreparingForRefresh: 'Preparing for refresh',
            TutorialPopup_GetStarted: 'Get started',
            TutorialPopup_GotIt: 'Got it',
            TutorialPopup_WelcomeButtonLabel: 'Get Data',
            TutorialPopup_WelcomeTitle: 'Welcome to Power BI',
            TutorialPopup_WelcomeText: 'You\'re on your way to exploring your data and monitoring what matters. \\n Let\'s start by getting some data.',
            TutorialPopup_WelcomeTutorialLinkText: 'View a Tutorial',
            TutorialPopup_WelcomeLearnMoreText: 'Want to learn more first?',
            TutorialPopup_FindContentTitle: 'Find your content',
            TutorialPopup_FindContentText: 'Notice that your new dashboards, reports and datasets show up in this pane. Click one to take a look.',
            TutorialPopup_ConnectDataTitle: 'Connect to your data',
            TutorialPopup_ConnectDataText: 'Start by connecting your own data to Power BI. Click Get Data and select your source.',
            TutorialPopup_PinVisualTitle: 'Pin to the dashboard',
            TutorialPopup_PinVisualText: 'Want to monitor this chart? Click this button to pin the chart to your dashboard so you can easily monitor it.',
            TutorialPopup_CreateFirstChartTitle: 'Create your first chart',
            TutorialPopup_CreateFirstChartText: 'Drag a field onto the screen to start building a new chart.',
            TutorialPopup_CustomizeChartTitle: 'Customize your chart',
            TutorialPopup_CustomizeChartText: 'Drag fields to or from these buckets to customize your chart.',
            Role_DisplayName_Axis: 'Axis',
            Role_DisplayName_Category: 'Category',
            Role_DisplayName_Color: 'Color',
            Role_DisplayName_Columns: 'Columns',
            Role_DisplayName_Details: 'Details',
            Role_DisplayName_Field: 'Field',
            Role_DisplayName_Fields: 'Fields',
            Role_DisplayName_Group: 'Group',
            Role_DisplayName_Latitude: 'Latitude',
            Role_DisplayName_Legend: 'Legend',
            Role_DisplayName_Location: 'Location',
            Role_DisplayName_Longitude: 'Longitude',
            Role_DisplayName_MaxValue: 'Maximum Value',
            Role_DisplayName_MinValue: 'Minimum Value',
            Role_DisplayName_Rows: 'Rows',
            Role_DisplayName_Series: 'Series',
            Role_DisplayName_Size: 'Size',
            Role_DisplayName_Slices: 'Slices',
            Role_DisplayName_TargetValue: 'Target Value',
            Role_DisplayName_Value: 'Value',
            Role_DisplayName_Values: 'Values',
            Role_DisplayName_X: 'X Axis',
            Role_DisplayName_Y: 'Y Axis',
            Role_DisplayName_Y2: 'Y2',
            Aggregate_Sum: 'Sum',
            Aggregate_Avg: 'Average',
            Aggregate_Min: 'Minimum',
            Aggregate_Max: 'Maximum',
            Aggregate_CountNonNull: 'Count',
            Aggregate_Count: 'Count (Distinct)',
            FieldWell_Remove: 'Remove Field',
            FieldWell_RemoveAggregate: 'Do Not Summarize',
            DisplayName_Sum: 'Sum of {0}',
            DisplayName_Avg: 'Average of {0}',
            DisplayName_Count: 'Count of {0}',
            DisplayName_Min: 'Min of {0}',
            DisplayName_Max: 'Max of {0}',
            DisplayName_CountNonNull: 'Count of {0}',
            TaskPane_Fields: 'Fields',
            TaskPane_Format: 'Format',
            VisualizationPane_Title: 'Visualizations',
            VisualizationPane_Filters: 'Filters',
            VisualizationPane_Section_Fields: 'Fields',
            VisualizationPane_Section_Format: 'Format',
            VisualizationPane_Watermark: 'Drag data fields here',
            AnalysisServerContentProvider_Title: 'SQL Server Analysis Services Servers in your organization',
            AnalysisServerContentProvider_Description: 'With Power BI, you can create dynamic reports and mashups with data and metrics you already have in your on-premises SQL Server Analysis Services solutions. To get started, click Connect, select a server, then select a data model.',
            AnalysisServerContentProvider_SupportedObjectsHeading: 'Supported Analysis Services Servers: ',
            AnalysisServerContentProvider_Landing_Supported_1: 'SQL Server 2012 and later Analysis Services Tabular models',
            AnalysisServerContentProvider_Landing_More_1: 'More about',
            AnalysisServerContentProvider_Landing_More_2: ' connecting to Analysis Services data',
            AnalysisServerContentProvider_ConnectButtonText: 'Connect',
            AnalysisServer_ResourceName: 'Name',
            AnalysisServer_ResourceDescription: 'Description',
            AnalysisServer_ServerName: 'Server Name',
            AnalysisServer_PublishedBy: 'Published By',
            AnalysisServer_PublishedDate: 'Published Date',
            AnalysisServer_DatabaseName: 'Name',
            AnalysisServer_DatabaseType: 'Type',
            AnalysisServer_ResourceDatabaseType_Model: 'Model',
            AnalysisServer_ResourceDatabaseType_Perspective: 'Perspective',
            AnalysisServer_Loading: 'Loading...',
            AnalysisServer_LoadResourcesFailed: 'Could not load list of resources.',
            AnalysisServer_LoadDatabasesFailed: 'Could not load list of databases.',
            AnalysisServer_ResourcesEmpty: 'No resources found.',
            AnalysisServer_DatabasesEmpty: 'No databases found.',
            LearnMore_Title: 'Learn to add your own data',
            LearnMore_Designer_Title: 'Excel + Power BI Designer',
            LearnMore_Designer_Description: 'Is Excel your go-to tool for working with data? Leverage your Excel expertise and investments by uploading your Excel workbooks to Power BI. Don\'t have the latest version of Excel? Download the optional, dedicated Power BI Designer to begin building your reports for Power BI.',
            LearnMore_Excel1: 'More about',
            LearnMore_Excel2: ' Excel 2013',
            LearnMore_PowerBI_Designer1: 'More about',
            LearnMore_PowerBI_Designer2: ' Power BI Designer',
            LearnMore_OrganizationalData_Title: 'Organizational Data',
            LearnMore_OrganizationalData_Description: 'Are you looking for your organization\'s data? With Power BI you can securely and easily connect to a wide range of data sources like SQL Server and SQL Server Analysis Services tabular models, both on premises and in the cloud.',
            LearnMore_OrganizationalData_Link1: 'More about',
            LearnMore_OrganizationalData_Link2: ' Organizational Data',
            LearnMore_DataAnywhere_Title: 'Data From Anywhere',
            LearnMore_DataAnywhere_Description: 'Are you a developer? Do you want to partner with us to extend Power BI to your data source? Use our developer APIs and tools to connect to your data sources with Power BI.',
            LearnMore_PowerBI_Developer_Center: 'Power BI Developer Center',
            LearnMore_DataAnywhere_Link1: 'More about',
            LearnMore_DataAnywhere_Link2: ' Data From Anywhere',
            AnalysisServer_CustomErrorTechnicalDetails: 'Technical details:',
            AnalysisServer_CustomErrorTechnicalDetails_ActivityId: 'Activity Id: {0}',
            AnalysisServer_CustomErrorTechnicalDetails_RequestId: 'Request Id: {0}',
            AnalysisServer_CustomErrorTechnicalDetails_Date: 'Date: {0}',
            AnalysisServer_CustomErrorTechnicalDetails_ErrorText: 'Error Text: {0}',
            AnalysisServer_CustomErrorTechnicalDetails_ClusterUriText: 'Cluster URI: {0}',
            CollapsibleSectionControl_Title_More: 'More',
            CollapsibleSectionControl_Title_Less: 'Less',
            PinTile_SaveReportFirstDialog_CancelButtonText: 'Cancel',
            PinTile_SaveReportFirstDialog_Message: 'We\'ll need to point this tile to a report that has been saved at least once so it exists in our system.',
            PinTile_SaveReportFirstDialog_SaveButtonText: 'Save, then pin',
            PinTile_SaveReportFirstDialog_Title: 'Please save before pinning',
            Tile_LoseReportConnection: 'Looks like the report no longer exists.',
            OAuth_Security_Error: 'You need to use SSL (HTTPS) when you use OAuth 2.0 authentication.',
            ErrorDescription_StillSettingUpAccount: 'We are still setting up your account. Please refresh the page in a few minutes. If this persists, please {0}contact us{1}.',
            ErrorTitle_StillSettingUpAccount: 'Almost there',
            FieldListMenuItem_AddFilter: 'Add Filter',
            FieldListMenuItem_Rename: 'Rename',
            FieldListMenuItem_Delete: 'Delete',
            FieldListMenuItem_Hide: 'Hide',
            FieldListMenuItem_ViewHidden: 'View Hidden',
            FieldListMenuItem_UnHideAll: 'Unhide All',
            Field_Tooltip: '\'{0}\'[{1}]',
            AdvancedFilter_ApplyFilter: 'Apply Filter',
            AdvancedFilter_Description: 'Show items when the value:',
            FilterOperator_Is: 'is',
            FilterOperator_GreaterThan: 'is greater than',
            FilterOperator_GreaterThanOrEqual: 'is greater than or equal to',
            FilterOperator_LessThan: 'is less than',
            FilterOperator_LessThanOrEqual: 'is less than or equal to',
            FilterOperator_IsNot: 'is not',
            Logical_And_Operator: 'And',
            Logical_Or_Operator: 'Or',
            FilterPane_Page: 'Page Level Filters',
            FilterPane_Visual: 'Visual Level Filters',
            FilterPane_Advanced: 'Advanced Filtering',
            TileEditor_DeleteTile: 'Delete Tile',
            QueryFailed: 'Query Failed',
            VisualContainer_UnableToFindVisualKey: 'Visual not supported.',
            NavigationPane_DashboardsTitle: 'Dashboards',
            NavigationPane_DatasetsTitle: 'Datasets',
            NavigationPane_ReportsTitle: 'Reports',
            PowerBI_Landing_Title: 'Power BI',
            ShareView_ShareButtonText: 'Share',
            ShareView_ShareDashboard: 'Share Dashboard',
            ExplorationContainer_FailedToLoadReport: 'Unable to load report',
            ExplorationContainer_FailedToLoadReport_DefaultDetails: 'The requested report failed to load',
            FilterRestatement_All: '(All)',
            FilterRestatement_CompoundAnd: '{0} and {1}',
            FilterRestatement_CompoundOr: '{0} or {1}',
            FilterRestatement_Equal: 'is {0}',
            FilterRestatement_GreaterThan: 'is greater than {0}',
            FilterRestatement_GreaterThan_DT: 'is after {0}',
            FilterRestatement_GreaterThanOrEqual: 'is greater than or equal to {0}',
            FilterRestatement_GreaterThanOrEqual_DT: 'is on or after {0}',
            FilterRestatement_LessThan: 'is less than {0}',
            FilterRestatement_LessThan_DT: 'is before {0}',
            FilterRestatement_LessThanOrEqual: 'is less than or equal to {0}',
            FilterRestatement_LessThanOrEqual_DT: 'is on or before {0}',
            FilterRestatement_NotEqual: 'is not {0}',
            FilterOperator_Contains: 'contains',
            FilterOperator_DoesNotContain: 'does not contain',
            FilterOperator_DoesNotStartWith: 'does not start with',
            FilterOperator_GreaterThanOrEqual_DT: 'is on or after',
            FilterOperator_GreaterThan_DT: 'is after',
            FilterOperator_IsBlank: 'is blank',
            FilterOperator_IsNotBlank: 'is not blank',
            FilterOperator_LessThanOrEqual_DT: 'is on or before',
            FilterOperator_LessThan_DT: 'is before',
            FilterOperator_StartsWith: 'starts with',
            FilterRestatement_Contains: 'contains \'{0}\'',
            FilterRestatement_DoesNotContain: 'does not contain \'{0}\'',
            FilterRestatement_DoesNotStartWith: 'does not start with \'{0}\'',
            FilterRestatement_StartWith: 'starts with \'{0}\'',
            ErrorDialogOption_FailedToStorePackageExcel: 'Learn how to solve this problem',
            ExternalContentViewer_Search: 'Search',
            FilterPane_ClearFilter: 'Clear filter',
            FilterPane_DeleteFilter: 'Delete filter',
            ExplorationContainer_FailedToSaveReport: 'Unable to save the report',
            ExplorationContainer_FailedToSaveReportDefaultDetails: 'The server failed to save the report',
            MobileLandingPage_ContinueToPbiCom: 'continue to powerbi.com',
            MobileLandingPage_DownloadApp: 'Download the app',
            MobileLandingPage_SubTitle: 'Bring your data to life',
            MobileLandingPage_Title: 'Power BI',
            DataSourceSupport_LearnMore: 'Learn More',
            DataSourceSupport_LearnMoreMessage: 'about data sources that currently support refresh.',
            OnPremises_Admin_Error: 'Power BI can\'t connect to the On-Premises Analysis Services Server {0}. The administrator of the server provided the following message : {1}.',
            ServerError_OnPremises_Admin_Error: 'Power BI can\'t connect to the On-Premises Analysis Services Server {resourceName}. The administrator of the server provided the following message : {adminMessage}.',
            ServerError_HRESULT_0x82040136: 'SQL Server Analysis Services Connector appears to be offline(error code: 0x82040136). Please contact your Server Administrator.',
            ServerError_HRESULT_0x82070BC4: 'SQL Server Analysis Services Connector appears to be offline(error code: 0x82070BC4). Please contact your Server Administrator.',
            ServerError_HRESULT_0x82031772: 'SQL Server Analysis Services Connector is unable to connect to the Analysis Server. Please make sure that the password in the Connector is up to date and the Analysis Server is running.',
            FilterRestatement_Comma: '{0}, {1}',
            QnAVisualization_EmptyResultTitleText: 'Sorry, I wasn\'t able to find a good answer.',
            Visualization_NoData: 'This result returned no data.',
            SettingsDataset_DisableEntireRefreshPageErrorMessage_OnPremAnalysisServicesScheduleInfo: 'This dataset connects to a SQL Server Analysis Services Tabular database & is always up-to-date. You do not have to schedule a refresh on this dataset.',
            SettingsDataset_DisableEntireRefreshPageErrorMessage_SalesforceScheduleRefreshInfo: 'Your Salesforce dataset is updated daily. You do not need to schedule a periodic refresh for this dataset.',
            ExplorationContainer_FailedToLoadModel: 'Unable to Load the Model',
            ExplorationContainer_FailedToLoadModel_DefaultDetails: 'Unable to retrieve the model information at this time',
            Dataset_Mashup_Desc_DynamicsCRM_0: 'Dynamics CRM OData Service URL',
            Dataset_Mashup_Desc_DynamicsMarketing_0: 'Dynamics Marketing OData Service URL (case sensitive)',
            Dataset_Mashup_Desc_GitHub_0: 'Owner or organization of the GitHub repository',
            Dataset_Mashup_Desc_GitHub_1: 'GitHub repository name',
            Dataset_Mashup_Desc_GoogleAnalytics_0: 'Account Name (case sensitive) configured for your Google Analytics account',
            Dataset_Mashup_Desc_GoogleAnalytics_1: 'Property Name (case sensitive)',
            Dataset_Mashup_Desc_GoogleAnalytics_2: 'View Name (case sensitive)',
            Dataset_Mashup_Desc_Zendesk_0: 'Enter the web address for your account',
            Dataset_Mashup_Name_DynamicsCRM_0: 'Service URL',
            Dataset_Mashup_Name_DynamicsMarketing_0: 'Service URL',
            Dataset_Mashup_Name_GitHub_0: 'Repository Owner',
            Dataset_Mashup_Name_GitHub_1: 'Repository',
            Dataset_Mashup_Name_GoogleAnalytics_0: 'Account',
            Dataset_Mashup_Name_GoogleAnalytics_1: 'Property',
            Dataset_Mashup_Name_GoogleAnalytics_2: 'View',
            Dataset_Mashup_Name_Zendesk_0: 'Zendesk URL',
            ServerError_HRESULT_0x82030FA4: 'User name and password provided to the SQL Server Analysis Services Connector is no longer correct.',
            ServerError_HRESULT_0x82031774: 'SQL Server Analysis Services Connector is unable to connect to the Analysis Server instance. Please make sure the Analysis Server instance is up and running.',
            ServerError_OnPremisesNoConnectorError: 'Power BI service requires SQL Server Analysis Services Connector installed on-premises in order to be able to access the server {resourceName}.',
            ServerError_OnPremisesTechnicalDetailsOpenConnectionError: 'Power BI service is unable to connect to SQL Server Analysis Services Connector. Please make sure the Connector is up and running.',
            ServerError_OnPremisesTechnicalDetailsConnectorError: 'Connector Error Message',
            ServerError_OnPremisesTechnicalDetailsConnectorErrorCode: 'Connector Error Code',
            ServerError_OnPremisesTechnicalDetailsDataSourceError: 'Analysis Services Error',
            PBIDesigner_ContentProvider_LandingTitle: 'Power BI Designer',
            DatasetParametersDialog_HelpMessage: 'Need help entering this information? ',
            DatasetParametersDialog_LearnMore: 'Learn More',
            ErrorDialogOption_FailedToStorePackage: 'Learn More',
            ErrorMessage_FailedToStorePackage: 'Make sure you\'re entering the information correctly.',
            SR_GatewayOffline_Details: 'Ensure that the computer on which the gateway is installed is turned on and the gateway is running',
            SR_GatewayOffline_Heading: '! {0} failed to refresh. Your gateway on {1} is offline or can not be reached.',
            SR_Failure_Subject: 'Refresh failed: {0} has failed to refresh',
            SR_Failure_DebugClusterName: 'Cluster Name: {0}',
            SR_Failure_DebugCorrelationId: 'Correlation ID: {0}',
            SR_Failure_DebugStartTimeStamp: 'Refresh Start Time: {0}',
            SR_Failure_NextRefreshTime: 'Next refresh for {0} is scheduled for {1}.',
            SR_Failure_DebugEndTimeStamp: 'Refresh End Time: {0}',
            Explore_Section_Page: 'Page {0}',
            MashUpContentProvider_Sample_Origin: 'This sample is part of a series that illustrates how you can use Power BI with business-oriented data, reports, and dashboards. This is real data from Obvience (',
            MashUpContentProvider_Sample_OriginSuffix: ') that has been anonymized.',
            MashUpContentProvider_SupplierQualityAnalysisSample_Description1: 'This industry sample dashboard and underlying report focus on one of the typical supply chain challenges — supplier quality analysis. Two primary metrics are at play in this analysis: total number of defects and the total downtime that these defects caused. This sample has two main objectives:',
            MashUpContentProvider_SupplierQualityAnalysisSample_Description2: 'Understand who the best and worst suppliers are, with respect to quality.',
            MashUpContentProvider_SupplierQualityAnalysisSample_Description3: 'Identify which plants do a better job finding and rejecting defects, to minimize downtime.',
            MashUpContentProvider_SupplierQualityAnalysisSample_Title: 'Supplier Quality Analysis Sample',
            MashUpContentProvider_CustomerProfitabilitySample_Description1: 'This industry sample dashboard and underlying report analyze a company that manufactures marketing materials.  This dashboard was created by a CFO to see key metrics about her 5 business unit managers (aka executives), products, customers, and gross margins (GM). At a glance she can see what factors are impacting profitability.',
            MashUpContentProvider_HumanResourcesSample_Description1: 'This industry sample dashboard and underlying report analyze HR information. The HR department has the same reporting model across different companies, even when they differ by industry or size. This sample looks at new hires, active employees, and employees who left and tries to uncover any trends in the hiring strategy. Our main objectives are to understand:',
            MashUpContentProvider_HumanResourcesSample_Description2: 'Who we hire.',
            MashUpContentProvider_HumanResourcesSample_Description3: 'Biases in our hiring strategy.',
            MashUpContentProvider_HumanResourcesSample_Description4: 'Trends in voluntary separations.',
            MashUpContentProvider_ITSpendAnalysisSampleSample_Description1: 'This industry sample dashboard and underlying report analyze the planned vs. actual costs of the IT department of a company. This comparison helps us understand how well the company planned for the year and allows us to investigate areas with huge deviations from the plan. The company in this example goes through a yearly planning cycle, and then quarterly it produces a new Latest Estimate (LE) to help analyze changes in IT spend over the fiscal year.',
            MashUpContentProvider_OpportunityTrackingSample_Description1: 'This industry sample dashboard and underlying report analyze a software company that has 2 sales channels: direct and partner.  The Sales Manager created this dashboard to track opportunities and revenue by region, deal size, and channel. The Sales Manager relies on 2 measures of revenue:',
            MashUpContentProvider_OpportunityTrackingSample_Description2: 'Revenue – this is a salesperson’s estimate of what the company’s revenue will be.',
            MashUpContentProvider_OpportunityTrackingSample_Description3: 'Factored Revenue – this is calculated as Revenue X Probability % and is generally accepted as being a more-accurate predictor of actual sales revenue.  Probability is determined by the deal’s current Sales Stage.',
            MashUpContentProvider_ProcurementAnalysisSample_Description1: 'This industry sample dashboard and underlying report analyze a manufacturing company’s spending on vendors by category and location, and lets us explore the following areas:',
            MashUpContentProvider_ProcurementAnalysisSample_Description2: 'Who the top vendors are',
            MashUpContentProvider_ProcurementAnalysisSample_Description3: 'What categories we spend most on',
            MashUpContentProvider_ProcurementAnalysisSample_Description4: 'Which vendors give us the highest discount and when',
            MashUpContentProvider_SalesAndMarketingSample_Description1: 'This industry sample dashboard and underlying report analyze a manufacturing company named VanArsdel Ltd.  This dashboard was created by the VanArsdel Chief Marketing Officer (CMO) to keep an eye on the industry and his company’s market share, product volume, sales, and sentiment.',
            FeedbackTicket_Message: 'Microsoft uses third-party services to deliver a great feedback experience. By clicking Next, you agree to the {{startLink}} UserVoice Terms of Service and Privacy Policy {{endLink}} and Microsoft will contact you by email associated with your organizational account',
            PowerBI_Build_Version_Text: 'Version',
            PowerBI_Copyright_Text: 'Microsoft Corporation {{year}}. All rights reserved.',
            SupportTicket_Message: 'Microsoft uses third-party services to deliver a great support experience. By clicking Next, you agree to the {{startLink}} UserVoice Terms of Service and Privacy Policy {{endLink}} and Microsoft will contact you by email associated with your organizational account',
            Sort_SortBy: 'Sort By',
            Remove_visual: 'Remove',
            VisualTitle_By_Template: '{0} by {1}',
            VisualTitle_And_Template: '{0} and {1}',
            BarChart_ToolTip: 'Bar Chart',
            Card_ToolTip: 'Card',
            ClusteredBarChart_ToolTip: 'Clustered Bar Chart',
            ClusteredColumnChart_ToolTip: 'Clustered Column Chart',
            ColumnChart_ToolTip: 'Column Chart',
            Funnel_ToolTip: 'Funnel',
            Gauge_ToolTip: 'Gauge',
            HundredPercentStackedBarChart_ToolTip: '100% Stacked Bar Chart',
            HundredPercentStackedColumnChart_ToolTip: '100% Stacked Column Chart',
            LineChart_ToolTip: 'Line Chart',
            Map_ToolTip: 'Map',
            Matrix_ToolTip: 'Matrix',
            MultiRowCard_ToolTip: 'Multi Row Card',
            PieChart_ToolTip: 'Pie Chart',
            ScatterChart_ToolTip: 'Scatter Chart',
            Table_ToolTip: 'Table',
            Treemap_ToolTip: 'Treemap',
            Delete_ToolTip: 'Delete',
            Remove_ToolTip: 'Remove Visual',
            PinVisual_ToolTip: 'Pin Visual',
            ShowConversionOptions_ToolTip: 'Show Conversion Options',
            Sort_ToolTip: 'Sort',
            NavigationPane_GroupsTitle_HasGroups: 'GROUPS',
            NavigationPane_CreateGroup: 'Create Group',
            NavigationPane_NoGroupText: 'You have no groups',
            Waterfall_TotalLabel: 'Total',
            Visual_DataPoint: 'Data Points Colors',
            GeotaggingString_Address: 'Address',
            GeotaggingString_Addresses: 'Addresses',
            GeotaggingString_Cities: 'Cities',
            GeotaggingString_City: 'City',
            GeotaggingString_Code: 'Code',
            GeotaggingString_Continent: 'Continent',
            GeotaggingString_Continents: 'Continents',
            GeotaggingString_Counties: 'Counties',
            GeotaggingString_Countries: 'Countries',
            GeotaggingString_Country: 'Country',
            GeotaggingString_County: 'County',
            GeotaggingString_Latitude: 'Latitude',
            GeotaggingString_Longitude: 'Longitude',
            GeotaggingString_Place: 'Place',
            GeotaggingString_Places: 'Places',
            GeotaggingString_Post: 'Post',
            GeotaggingString_Province: 'Province',
            GeotaggingString_Provinces: 'Provinces',
            GeotaggingString_State: 'State',
            GeotaggingString_States: 'States',
            GeotaggingString_Street: 'Street',
            GeotaggingString_Streets: 'Streets',
            GeotaggingString_Town: 'Town',
            GeotaggingString_Towns: 'Towns',
            GeotaggingString_Village: 'Village',
            GeotaggingString_Villages: 'Villages',
            GeotaggingString_Zip: 'Zip',
            GeotaggingString_Latitude_Short: 'Lat',
            GeotaggingString_Longitude_Short: 'Lon',
            GeotaggingString_PostalCode: 'Postal Code',
            GeotaggingString_PostalCodes: 'Postal Codes',
            GeotaggingString_ZipCode: 'Zip Code',
            GeotaggingString_ZipCodes: 'Zip Codes',
            GeotaggingString_Territories: 'Territories',
            GeotaggingString_Territory: 'Territory',
            Visual_Legend: 'Legend',
            Visual_CategoryAxis: 'Category Axis',
            Visual_CategoryAxis_Scalar: 'Scalar Axis',
            Visual_Fill: 'Fill',
            Visual_LegendPosition: 'Legend Position',
            Visual_Show: 'Show',
            NavigationPane_Groups_MyWorkspace: 'My Workspace',
            NavigationPane_GroupIconTitle: 'Group',
            Landing_DefaultReportName: 'Untitled',
            Slicer_ToolTip: 'Slicer',
            WaterfallChart_ToolTip: 'Waterfall Chart',
            SqlAzureDbContentProvider_DatabaseName: 'Database:',
            SqlAzureDbContentProvider_Description1: 'Azure SQL Database is a fully managed relational database-as-a-service that makes tier-1 capabilities easily accessible. SQL Database supports massive scale-out, predictable performance, flexible manageability and includes built-in high availability and self-management for near-zero maintenance.',
            SqlAzureDbContentProvider_Description2: 'With Power BI, you can create dynamic reports, mashups with data and metrics you already have in your Azure SQL Database. To get started, we need some information to connect to your database.',
            SqlAzureDbContentProvider_Description3: 'NOTE: To allow Power BI to connect to your Azure SQL Database, please make sure firewall rules for the database are configured to "Allow access to Azure services".',
            SqlAzureDbContentProvider_Description4: 'More about',
            SqlAzureDbContentProvider_Error1: 'Please enter Server.',
            SqlAzureDbContentProvider_Error2: 'Please enter Database.',
            SqlAzureDbContentProvider_Error3: 'Please enter User.',
            SqlAzureDbContentProvider_Error4: 'Please enter Password.',
            SqlAzureDbContentProvider_Landing_ConnectButton: 'Connect',
            SqlAzureDbContentProvider_Password: 'Password:',
            SqlAzureDbContentProvider_ServerName: 'Server:',
            SqlAzureDbContentProvider_Title: 'Azure SQL Database',
            SqlAzureDbContentProvider_UserName: 'User:',
            SqlAzurePdwContentProvider_DatabaseName: 'Database:',
            SqlAzurePdwContentProvider_Description1: 'Drive immediate insight from all of your data using the elastic scale SQL Data Warehouse with Direct Connect. Seamlessly combine a petabyte or more of relational data with non-relational Hadoop data using Polybase for a full view of your data. To get started, simply click Connect.',
            SqlAzurePdwContentProvider_Description3: 'More about',
            SqlAzurePdwContentProvider_Description2: 'With Power BI, you can create dynamic reports, mashups with data and metrics you already have in your Azure SQL Data Warehouse. To get started, we need some information to connect to your database.',
            SqlAzurePdwContentProvider_Error1: 'Please enter Server.',
            SqlAzurePdwContentProvider_Error2: 'Please enter Database.',
            SqlAzurePdwContentProvider_Error3: 'Please enter User.',
            SqlAzurePdwContentProvider_Error4: 'Please enter Password.',
            SqlAzurePdwContentProvider_Password: 'Password:',
            SqlAzurePdwContentProvider_ServerName: 'Server:',
            SqlAzurePdwContentProvider_Title: 'Azure SQL Data Warehouse',
            SqlAzurePdwContentProvider_UserName: 'User:',
            SqlAzurePdwontentProvider_Landing_ConnectButton: 'Connect',
            ComboChart_ToolTip: 'Combo Chart',
            Role_ComboChart_Category: 'Shared Axis',
            Role_ComboChart_Series: 'Column Series',
            Role_ComboChart_Y: 'Column Values',
            Role_ComboChart_Y2: 'Line Values',
            Dataset_Mashup_Desc_Marketo_0: 'Marketo REST API endpoint',
            Dataset_Mashup_Name_Marketo_0: 'Endpoint',
            TopNav_Download: 'Download',
            TopNav_Feedback: 'Feedback',
            TopNav_Help: 'Help & Support',
            Tooltip_HighlightedValueDisplayName: 'Highlighted',
            ReportAppBar_SwitchModeButton: 'PRESENTATION MODE',
            SqlAzureDbContentProvider_Description5: 'direct connect with Azure SQL Database',
            SqlAzurePdwContentProvider_Description4: 'direct connect with Azure SQL Data Warehouse',
            MashupContentProvider_SQLDBAuditing_More2: ' connecting to SQL Database Auditing data',
            MashupContentProvider_Moreabout: 'More about',
            MashUpContentProvider_SQLDBAuditing_Description1: 'Azure SQL Database Auditing',
            MashUpContentProvider_SQLDBAuditing_Description2: ' tracks database events and writes audited events to an audit log in your Azure Storage account. Auditing is generally available for Basic, Standard, and Premium service tiers.',
            MashUpContentProvider_SQLDBAuditing_Description3: 'This content pack can help maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.',
            MashUpContentProvider_SQLDBAuditing_Description4: 'The content pack imports data from all tables that contain “AuditLogs” in their name and append it to a single data model table named “AuditLogs”.',
            MashUpContentProvider_Twilio_Description1: 'Visualize data from your Twilio account directly in Power BI. Connect using your Twilio credentials and immediately gain insights from your Twilio usage, such as your calls and messages over time, your most active Twilio phone numbers, amount of messages and calls sent and received and many more. A full dashboard will be created for you to monitor your data as well as a rich report to further explore your data.',
            MashUpContentProvider_Twilio_More2: ' connecting to Twilio data',
            Publish_ChooseContentPackAccess: 'Choose who will have access to this content pack:',
            Publish_ContentPack: 'Publish Content Packs',
            Publish_ContentPackCancelButton: 'Cancel',
            Publish_ContentPackName: 'Name',
            Publish_ContentPackPublishButton: 'Publish',
            Publish_ContentPackPublishedTo: 'Published To',
            Publish_CreateContentPack: 'Create Content Pack',
            Publish_DataAccessNotification: 'The content pack will be available in your organization\'s content gallery.',
            Publish_DataAccessNotificationLink: 'Learn more',
            Publish_DeleteContentPack: 'Delete',
            Publish_Description: 'Description',
            Publish_EditContentPack: 'Edit',
            Publish_Group: 'Specific Groups',
            Publish_Organization: 'My Entire Organization',
            Publish_Title: 'Title',
            Publish_ViewContentPack: 'View Content Packs',
            TopNav_SettingsMenu_CreateContentPack: 'Create Content Pack',
            Publish_DescriptionText: 'This is the People View content pack created for anyone in the company and get business insights. If you need help, contact hrbisupport.com.',
            Publish_EnterTitleText: 'People View',
            Publish_Dashboards: 'Dashboards',
            TopNav_Settings: 'Settings',
            Publish_Datasets: 'Datasets',
            Publish_ImageText: 'Image:',
            Publish_ItemsToPublish: 'Select items to publish',
            Publish_Reports: 'Reports',
            Publish_UpdateContentPackInfo: 'You\'ve made changes to a dashboard or report from this content pack that\'s published to \'My Entire Organization\'. In order for others to see your changes, click here to update',
            Publish_UploadImage: 'Upload',
            Publish_UploadText: 'an image or company logo',
            Publish_UseDefaultImage: 'Use Default',
            Publish_GroupsText: 'Enter group names separated by ; or ,',
            GroupNavigationPaneContextMenuItem_Calendar: 'Calendar',
            GroupNavigationPaneContextMenuItem_Conversations: 'Conversations',
            GroupNavigationPaneContextMenuItem_EditGroup: 'Edit Group',
            GroupNavigationPaneContextMenuItem_Files: 'Files',
            GroupNavigationPaneContextMenuItem_LeaveGroup: 'Leave Group',
            GroupNavigationPaneContextMenuItem_Members: 'Members',
            GroupNavigationPaneContextMenuItem_Notebook: 'Notebook',
            GroupNavigationPaneContextMenuItem_Subscribe: 'Subscribe',
            Groups_LessButtonText: 'Less',
            Groups_MoreButtonText: 'More',
            NotificationMessage_ImportingPackage_AdditionalMessage: 'This could take a little while.',
            GetData_Connect: 'Connect',
            GetData_SelectAFileFromYourOneDrivePersonalAccount: 'Select a file from your OneDrive Personal account',
            GetData_SignInToYourOneDrivePersonalAccount: 'Sign in to your OneDrive personal account',
            GetData_Cancel: 'Cancel',
            GetData_Uploading: 'Uploading',
            GetData_SalesforceEmbeddedConfigurationDescription: 'Get the most from your Salesforce data by letting Power BI build a custom dashboard. You also have the option to import your Salesforce reports.',
            GetData_SelectADashboardBasedOnYourRoleInYourOrganization: 'Select a dashboard based on your role in your organization.',
            GetData_SelectYourSalesforceData: 'Select Your Salesforce Data',
            GetData_SignInToYourSalesforceAccount: 'Sign in to your Salesforce account',
            GetData_ConnectTo: 'Connect to',
            GetData_DataInPowerBIFollowThePromptsBelow: 'data in Power BI, follow the prompts below.',
            GetData_LearnMore: 'Learn More',
            GetDataSeeMoreOptions: 'See more options.',
            GetData_LearnToAddTileCategoryDescription: 'Select your role within your organization to learn more about getting your data into Power BI.',
            GetData_ToStartUsingYour: 'To start using your',
            MashUpContentProvider_AppFigures_Description1: 'Connect and explore your appFigures data in Power BI. The out of box dashboard allows you to monitor and explore data about all your apps in a single place. For each app you can track the number of downloads, including how they’re being rated and which countries are using your app. You can also track in-app purchases and ad clicks, to fully understand the revenue from your apps.',
            MashUpContentProvider_AppFigures_More2: ' connecting to appFigures data',
            GetData_ChooseDataSource: 'Choose a Data Source',
            GetData_ConnectYourData: 'Connect Your Data',
            GetData_Dashboard: 'Dashboard',
            GetData_Files: 'Files',
            GetData_FilesDesc: 'Import data from Excel workbooks or Power BI Designer files.',
            GetData_Get: 'Get',
            GetData_HelpfulLinks: 'Explore other options:',
            GetData_AddYourContent: 'Add Your Content',
            GetData_MyOrganization: 'My Organization',
            GetData_Or: 'or',
            GetData_Samples: 'Samples',
            GetData_Services: 'Services',
            GetData_ServicesDesc: 'Connect to online services you use and we’ll create dashboards and reports for you.',
            GetData_ViewTutorial: 'Tutorial',
            GetData_WelcomeDescLine1: 'You’re on your way to exploring your data and monitoring what matters.',
            GetData_WelcomeDescLine2: 'Let\'s start by getting some data.',
            GetData_WelcomeTitle: 'Welcome to Power BI',
            GetData_MyOrganizationDesc: 'Get content that other people in your organization have published.',
            GetData_ConnectData: 'Connect your data',
            GetData_NeedHelpConnecting: 'Need help connecting?',
            GetData_BigDataAndMore: 'Databases & More',
            GetData_LearnToAddData: 'Learn to Add Data',
            GetData_SubmitAnIdea: 'Submit an Idea',
            GetData_DontSeeWhatYoureLookingFor: 'Don\'t see what you\'re looking for?',
            GetData_ConnectToPartner: 'Connect to a partner',
            GetData_ConnectToPartnerBlurb: 'Don’t see the data you care most about in Power BI? We have a global network of Power BI partners ready to help. ',
            GetData_MyWorkspace: 'My Workspace',
            GetData_GetData: 'Get Data',
            GetData_MsftDigitalCrimesUnit: 'The Digital Crimes Unit is an international legal and technical team working with partners, to help create a safe digital world. The DCU operates in conjunction with Internet Service Providers and Computer Emergency Response Teams to disrupt botnets from cybercriminals. These botnets can be involved in activities ranging from e-mail spam and click fraud to financial fraud and privacy invasion. This dashboard shows a summary of the calls that are made every day by devices still affected by several of the botnets that the Digital Crimes Unit has disrupted.',
            GetData_AzureSqlDatabaseWithLiveConnect: 'Azure SQL Database is a fully managed relational database-as-a-service that makes tier-1 capabilities easily accessible. SQL Database supports massive scale-out, predictable performance, flexible manageability and includes built-in high availability and self-management for near-zero maintenance. With Power BI, you can create dynamic reports, mashups with data and metrics you already have in your Azure SQL Database.',
            GetData_AzureSqlDatawarehouseLiveConnect: 'Gain immediate insights from your data using the elastic scale SQL Data Warehouse with direct connect. Seamlessly combine a petabyte or more of relational data with non-relational Hadoop data using Polybase for a full view of your data. To get started, simply click Connect.',
            GetData_BingNews: 'Track the latest news headlines on your dashboard with Bing News and stay up to date with news for the topics that matter most to you. Provide the search terms for topics you want to track and add a news tiles to the currently selected dashboard. Clicking on the listed news headlines opens the original articles so you can read further.',
            GetData_GitHub: 'Visualize different types of repository activity in Power BI by connecting to your GitHub data. With the GitHub content pack, you get a Power BI dashboard and reports with insights about how many commits, who contributes most, and at what time of day. Use the dashboard and reports as provided, or customize them to highlight the information you care about most.<br/><br/>The data in Power BI is updated daily from GitHub according to a schedule that you control.',
            GetData_GoogleAnalytics: 'Visualize data from your Google Analytics account directly in Power BI. Gain insights from the sites that you’re tracking, such as the site traffic over the last 30 days, or the days of the week when your site is most popular. The content pack includes data from the last 180 days. Use the reports that Power BI creates as is, or customize them for the metrics important to you.',
            GetData_HideDetails: 'Hide details.',
            GetData_Marketo: 'Bring rich marketing analytics directly into Power BI with the Marketo content pack. Your Marketo dashboards and reports in Power BI provide rich insights into your buyer profiles, marketing campaign success rates, email engagement, and more. Use the dashboard and reports as provided, or customize them to highlight the information you care about most.',
            GetData_MicrosoftDynamicsCrm: 'Connect to your Microsoft Dynamics CRM account for access to insights about your opportunities, accounts, and more. This content pack is designed specifically for sales managers, providing details on sales performance, pipeline, and activities. The dashboard and report are built on top of a fully featured model, so you can explore and analyze your data as you need.',
            GetData_MicrosoftDynamicsMarketing: 'With the Microsoft Dynamics Marketing content pack for Power BI, quickly build your marketing performance analytics. The content pack is designed specifically for marketing managers who focus on demand generation. Its components draw directly from your marketing database to provide reports on marketing contacts, lead pipeline, segment analysis, and more. Power BI automatically creates reports and dashboards that give you a great starting point for exploring and analyzing your marketing data.',
            GetData_MsftItNewTechnologyAdoption: 'This dashboard and report provides a glimpse into the complexity of adopting the latest technologies across more than 50k servers across the world, managed by IT to run the Application Portfolios that Microsoft employees use every day. These technologies span OnPrem, Azure (IaaS & PaaS), Cloud SaaS, Marketplaces, and modern UIs (across phones, tablets, and the browser). You can explore the data model and add your own analytic charts while you explore for insights. The data refreshes daily.',
            GetData_MsftPeopleView: 'People View provides a collection of data, reports and a dashboard around people at Microsoft, including such topics as Headcount, Average Directs and Anniversaries. From the dashboard, you can explore the underlying data model and add new interesting visuals while you gain deeper insights. The data refreshes daily.',
            GetData_MsftWindowsUservoice: 'This dashboard provides a quick and up-to-date view of the total users, suggestions and votes for both Windows and Windows Phone UserVoice.  It also lists the top categories, trends in suggestions, votes and comments, during any given period of time.  The data refreshes daily.  This is for internal Microsoft use only and cannot be shared outside of Microsoft without written approval from OSG. For more information, please contact winuservoice@microsoft.com.',
            GetData_QuickbooksOnline: 'Get insights into your business by connecting to QuickBooks Online with this Power BI content pack. With your QuickBooks Online admin credentials, Power BI automatically creates a dashboard with insights into your business cash flow, profitability, customers, and more. Use the default dashboard and reports, or customize them to highlight the information you care about most.',
            GetData_Salesforce: 'Import and analyze your Salesforce data in Power BI. After connecting to your Salesforce account, you import a variety of data to explore and monitor in your Power BI dashboards. Based on the persona you select, Power BI automatically creates a dashboard with customized visualizations of your data.',
            GetData_SeeDetails: 'See details.',
            GetData_Sendgrid: 'With the SendGrid content pack, monitor all your important email metrics in one dashboard using Power BI. Drill into detailed reports that you can customize as needed. With SendGrid advanced statistics enabled, monitor your most important metrics at a glance and measure user engagement for the emails you send.',
            GetData_SqlServerAnalysisServices: 'With Power BI, you can create dynamic reports and mashups with data and metrics you already have in your on-premises SQL Server Analysis Services solutions. To get started, click Connect, select a server, then select a data model.<br/><br/>Supported Analysis Services Servers:<br/>	- SQL Server 2012 and later Analysis Services Tabular models',
            GetData_VisualStudioOnline: 'Visualize your source code activity in Power BI by connecting to Microsoft Visual Studio Online. The Power BI content pack automatically creates a dashboard and report with at-a-glance views of Git, pull request, and version control activity across the projects you configure for your account.  You can customize the dashboard and report to highlight the deeper insights you care about most.<br/><br/>The data that appears in Power BI will be updated from Microsoft Visual Studio Online according to a schedule that you control.',
            GetData_Zendesk: 'Analyze your Zendesk data in Power BI with the Zendesk content pack. Connect with your Zendesk admin account credentials, and Power BI creates a dashboard with reports that provide insights about your ticket volumes and agent performance. Use the dashboard and reports provided, or customize them to highlight the information you care about most.',
            GetData_Appfigures: 'Connect and explore your appFigures data in Power BI. The appFigures content pack automatically creates a dashboard where you can monitor and explore data about all your apps in a single place. For each app you can track the number of downloads, including how they’re being rated and which countries are using your app. You can also track in-app purchases and ad clicks, to fully understand the revenue from your apps.',
            GetData_SqlDbAuditing: 'Azure SQL Database Auditing tracks database events and writes audited events to an audit log in your Azure Storage account. The Power BI content pack reports over the audit log data, and can help you maintain regulatory compliance and understand database activity. Gain insights into discrepancies and anomalies that could indicate business concerns or suspected security violations,  using the dashboard and reports that Power BI creates automatically.',
            GetData_Twilio: 'Visualize data from your Twilio account directly in Power BI. Connect using your Twilio credentials and immediately gain insights from your Twilio usage, such as your calls and messages over time, your most active Twilio phone numbers, amount of messages and calls sent and received and much more. The Power BI content pack creates a full dashboard for you to monitor your data, plus a rich report to explore your data further.',
            GetData_NoSearchResultsFound: 'No search results found.',
            GetData_CustomerProfitabilitySample: 'This industry sample dashboard and underlying report analyze a company that manufactures marketing materials. This dashboard was created by a CFO to see key metrics about her 5 business unit managers (aka executives), products, customers, and gross margins (GM). At a glance she can see what factors are impacting profitability. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_HumanResourcesSample: 'This industry sample dashboard and underlying report analyze HR information. The HR department has the same reporting model across different companies, even when they differ by industry or size. This sample looks at new hires, active employees, and employees who left and tries to uncover any trends in the hiring strategy. Our main objectives are to understand who we hire, biases in our hiring strategy, and trends in voluntary separations. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_ITSpendAnalysisSample: 'This industry sample dashboard and underlying report analyze the planned vs. actual costs of the IT department of a company. This comparison helps us understand how well the company planned for the year and allows us to investigate areas with huge deviations from the plan. The company in this example goes through a yearly planning cycle, and then quarterly it produces a new Latest Estimate (LE) to help analyze changes in IT spend over the fiscal year. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_OpportunityAnalysisSample: 'This industry sample dashboard and underlying report analyze a software company that has 2 sales channels: direct and partner. The Sales Manager created this dashboard to track opportunities and revenue by region, deal size, and channel. The Sales Manager relies on 2 measures of revenue, revenue and factored revenue. Revenue is a salesperson’s estimate of what the company’s revenue will be. Factored Revenue is calculated as Revenue X Probability % and is generally accepted as being a more-accurate predictor of actual sales revenue. Probability is determined by the deal’s current Sales Stage. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_ProcurementAnalysisSample: 'This industry sample dashboard and underlying report analyze a manufacturing company’s spending on vendors by category and location, and lets us explore the following areas: who the top vendors are, what categories we spend most on, which vendors give us the highest discount, and when those discounts occur. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_Retail_Analysis_Sample: 'This industry sample dashboard and underlying report analyzes retail sales data of items sold across multiple stores and districts. The metrics compare this year\'s performance to last year\'s in sales, units, gross margin, and variance, as well as new store analysis. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_SalesAndMarketingSample: 'This industry sample dashboard and underlying report analyze a manufacturing company named VanArsdel Ltd. This dashboard was created by the VanArsdel Chief Marketing Officer (CMO) to keep an eye on the industry and his company’s market share, product volume, sales, and sentiment. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            GetData_SupplierQualityAnalysisSample: 'This industry sample dashboard and underlying report focus on one of the typical supply chain challenges — supplier quality analysis. Two primary metrics are at play in this analysis: total number of defects and the total downtime that these defects caused. This sample has two main objectives. The first is to understand who the best and worst suppliers are, with respect to quality. The second is to identify which plants do a better job finding and rejecting defects, to minimize downtime. This is real data from obviEnce (www.obvience.com) that has been anonymized.',
            ToggleSwitchOff: 'Off',
            ToggleSwitchOn: 'On',
            NavigationPane_GroupsTitle_CreateGroup: 'CREATE A GROUP',
            Visual_DisplayUnits: 'Display Units',
            Visual_LabelsFill: 'Color',
            Visual_DataPointsLabels: 'Data Points Labels',
            Visual_Precision: 'Precision',
            Visual_Position: 'Position',
            Role_DisplayName_Gradient: 'Gradient',
            Visual_Gradient: 'Gradient',
            Visual_Axis_End: 'End',
            Visual_Axis_Intersection: 'Intersection',
            Visual_Axis_Start: 'Start',
            Visual_Axis_Style: 'Style',
            Visual_Axis_Title: 'Title',
            Visual_Axis_Type: 'Type',
            Visual_Axis_Scalar: 'Continuous',
            Visual_Axis_Categorical: 'Categorical',
            Visual_CategoryLabels: 'Category Labels',
            Visual_Axis_ShowBoth: 'Show Both',
            Visual_Axis_ShowTitleOnly: 'Show title only',
            Visual_Background: 'Background',
            Visual_Background_Color: 'Color',
            Visual_Background_Transparency: 'Transparency',
            Visual_DataPoint_Show_All: 'Show All',
            Visual_LegendShowTitle: 'Title',
            Visual_LegendTitleText: 'Text',
            Visual_RevertToDefault: 'Revert To Default',
            Visual_Title: 'Title',
            Visual_Title_Alignment: 'Alignment',
            Visual_Title_BackgroundColor: 'Background Color',
            Visual_Title_FontColor: 'Font Color',
            Visual_Title_Text: 'Text',
            Visual_XAxis: 'X-Axis',
            Visual_YAxis: 'Y-Axis',
            Visual_YAxis_ColumnTitle: 'Y-Axis (Column)',
            Visual_YAxis_LineTitle: 'Y-Axis (Line)',
            Visual_YAxis_Position: 'Position',
            Visual_YAxis_ShowSecondery: 'Show Secondery',
            ColorPicker_CustomColor: 'Custom color',
            ColorPicker_RecentColors: 'Recent Colors',
            ColorPicker_RevertToDefault: 'Revert to default',
            ColorPicker_ThemeColors: 'Theme Colors',
            ColorWheel_Cancel: 'Cancel',
            Publish_ContentPackActions: 'Actions',
            Publish_ContentPackDatePublished: 'Date Published',
            Publish_ViewContentPacks: 'View Content Packs',
            TopNav_SettingsMenu_ViewContentPack: 'View Content Pack',
            TaskPane_Toggle: 'Toggle Task Pane',
            VisualizationPane_Toggle: 'Toggle Visualization Pane',
            MashUpContentProvider_MailChimp_Description1: 'Use MailChimp’s analytics to quickly identify trends within your campaigns, reports, and individual subscribers. Find out who your most engaged subscribers are, which countries open the most campaigns, or how trends have changed over time. Power BI lets users drill down into their MailChimp data without any coding knowledge, and automatic data updates help you make the most informed decisions possible.',
            MashUpContentProvider_MailChimp_More2: ' connecting to MailChimp data',
            MashUpContentProvider_SQLSentry_Bullet1: 'Server Health',
            MashUpContentProvider_SQLSentry_Bullet2: 'Server Availability',
            MashUpContentProvider_SQLSentry_Bullet3: 'Disk Utilization',
            MashUpContentProvider_SQLSentry_Bullet4: 'CPU Utilization',
            MashUpContentProvider_SQLSentry_Bullet5: 'Memory Utilization',
            MashUpContentProvider_SQLSentry_Description1: 'Use Power BI to analyze and share performance and operational data collected by SQL Sentry. Get insights into the health of your SQL Server and Windows environment. This content pack includes powerful visualizations to help you to better evaluate and manage resources for several key areas, including:',
            MashUpContentProvider_SQLSentry_Description2: 'To use this dashboard, you must have SQL Sentry installed and monitoring at least one server, and cloud synchronization must be enabled.',
            MashUpContentProvider_SQLSentry_More2: ' connecting to SQL Sentry data to the cloud',
            QuotaManagement_FreeUser: 'Free User',
            QuotaManagement_ManageAccount: 'Manage Account',
            QuotaManagement_ModelAssociatedWith: 'Associated With',
            QuotaManagement_ModelLastRefreshedTime: 'Last Refreshed',
            QuotaManagement_ModelName: 'Name',
            QuotaManagement_ModelSize: 'Size',
            QuotaManagement_ModelType: 'Type',
            QuotaManagement_ModelType_Report: 'Report',
            QuotaManagement_ModelType_Dataset: 'Dataset',
            QuotaManagement_OwnedByMe: 'Owned By Me',
            QuotaManagement_OwnedByOthers: 'Owned By Others',
            QuotaManagement_OwnedByUs: 'Owned By Us',
            QuotaManagement_PaidUser: 'Paid User',
            QuotaManagement_UpgradeAccount: 'Upgrade Account',
            QuotaManagement_ManageStorage: 'Manage Storage',
            QuotaManagement_ManagePersonalStorage: 'Manage Personal Storage',
            QuotaManagement_ManageGroupStorage: 'Manage Group Storage',
            QuotaManagement_AssociatedDashboards: 'Associated Dashboards',
            QuotaManagement_AssociatedReports: 'Associated Reports',
            QuotaManagement_AssociatedWorkbooks: 'Associated Workbooks',
            QuotaManagement_DeleteButtonText: 'Delete',
            QuotaManagement_DeleteConfirmationTitle: 'Delete Item',
            QuotaManagement_DeleteConfirmationMessage: 'Are you sure you want to delete this item? This action may affect some of your dashboards and reports, and anyone with whom those dashboards and reports are shared.',
            QuotaManagement_RemoveConfirmationTitle: 'Remove Item',
            QuotaManagement_RemoveConfirmationMessage: 'Are you sure you want to remove the link to this item? This action may affect some of your dashboards, reports, and shared datasets.',
            QuotaExceedDialogButtonText_DismissMessage: 'Dismiss Message',
            QuotaExceedDialogButtonText_ManageAccount: 'Manage Account',
            QuotaExceedDialogButtonText_ManageStorage: 'Manage Storage',
            QuotaExceedDialogButtonText_UpgradeAccount: 'Upgrade Account',
            QuotaExceedDialogTitle: 'Over your storage limit',
            QuotaExceedDialogMessage_FreeUser: 'You are over your storage limit. To get data, pin tiles or share your dashboards, upgrade your account to Power BI Pro or manage your storage.',
            QuotaExceedDialogMessage_TrialAndPaidUser: 'You are over your storage limit. To get data, pin tiles or share your dashboards, you need to manage your storage.',
            QuotaExceedBannerMessage_FreeUser: 'You are over your storage limit. To get data or share your dashboards, upgrade your account to Power BI Pro or manage your storage.',
            QuotaExceedBannerMessage_TrialAndPaidUser: 'You are over your storage limit. To get data or share your dashboards, you need to manage your storage.',
            QuotaManagement_UsageDescription: '{0} of {1} used',
            QuotaManagement_CancelButtonText: 'Cancel',
            QuotaManagement_RemoveButtonText: 'Remove',
            QuotaUsage_SizeInMB: '{0} MB',
            QuotaUsage_SizeInGB: '{0} GB',
            InfoNav_SourceLabel: 'Source: {0}',
            UserMetadata_FailedRefresh: 'We failed to refresh user metadata. Please try again later.',
            Visual_DefaultColor: 'Default Color',
            FieldListMenuItem_NewColumn: 'New Column',
            FieldListMenuItem_NewMeasure: 'New Measure',
            Visual_ColumnTotals: 'Column Totals',
            Visual_General: 'General',
            Visual_RowTotals: 'Row Totals',
            Visual_Totals: 'Totals',
            NavigationPane_ExcelWorkbook: 'Excel Workbook',
            WorkbookContextMenu_Edit: 'EDIT',
            WorkbookContextMenu_RefreshNow: 'REFRESH NOW',
            WorkbookContextMenu_Remove: 'REMOVE',
            WorkbookContextMenu_Rename: 'RENAME',
            WorkbookContextMenu_ScheduleRefresh: 'SCHEDULE REFRESH',
            WorkbookContextMenu_View: 'VIEW',
            WorkbookReadyNotificationTitle: 'Your workbook is ready',
            WorkbookReadyNotificationMessage: 'Your Excel workbook is now in your list of reports. Take a look: {0}',
            UpgradeDialogButtonText_Trial: 'Try Power BI Pro',
            UpgradeDialogButtonText_UpgradeAccount: 'Upgrade Account',
            UpgradeDialogMessage: 'Want to use Power BI with {0}? Try Power BI Pro for free or upgrade your account today.',
            UpgradeDialogTitle: 'Need Power BI Pro for {0}',
            UpgradeReasonText_Groups: 'Groups',
            ServiceError_CannotLoadVisual: 'Can\'t display this visual.',
            ServiceError_ExecuteSemanticQueryErrorKey: 'Can\'t display this visual',
            ServiceError_ExecuteSemanticQueryErrorValue: 'Couldn’t retrieve the data for this visual. Please try again later.',
            ServiceError_ExecuteSemanticQueryInvalidStreamFormatKey: 'Can\'t display this visual',
            ServiceError_ExecuteSemanticQueryInvalidStreamFormatValue: 'Power BI couldn’t load the data for this visual because it isn’t in the right format. Please contact the dashboard owner.',
            ServiceError_GeneralError: 'An unexpected error occurred.',
            ServiceError_GeneralErrorKey: 'An unexpected error occurred',
            ServiceError_GeneralErrorValue: 'An unexpected error occurred. Please try again later.',
            ServiceError_ModelCannotLoad: 'Couldn’t load the model schema.',
            ServiceError_ModelConvertFailureKey: 'Internal error prevented loading the schema',
            ServiceError_ModelConvertFailureValue: 'An internal error prevented loading the model schema associated with this report. Please try again later. If the issue persists, contact Power BI support.',
            ServiceError_ModelCreationFailureKey: 'Internal error prevented preparing the schema',
            ServiceError_ModelCreationFailureValue: 'An internal error prevented preparing the model schema associated with this report. Please try again later. If the issue persists, contact Power BI support.',
            ServiceError_ModelFetchingFailureKey: 'Couldn’t load the schema for the database model',
            ServiceError_ModelFetchingFailureValue: 'Couldn’t load the model schema associated with this report. Make sure you have a connection to the server, and try again.',
            VisualContainer_FailedToLoadVisual: 'Can\'t display this visual.',
            VisualContainer_ShowErrorDetails: 'See details',
            ClientError_UnknownClientErrorKey: 'Unknown error',
            ClientError_UnknownClientErrorValue: 'An unexpected script error occurred.',
            VisualContainer_UnableToFindVisualValue: 'Support for this type of visual is coming soon.',
            DsrError_LoadingModelKey: 'The model could not be loaded',
            DsrError_InvalidDataShapeValue: 'Data shapes must contain at least one group or calculation that outputs data. Please contact the dashboard owner.',
            DsrError_InvalidUnconstrainedJoinKey: 'Can’t determine relationships between the fields',
            DsrError_InvalidUnconstrainedJoinValue: 'Can’t display the data because Power BI can’t determine the relationship between two or more fields.',
            DsrError_Key: 'Couldn\'t load the data for this visual',
            DsrError_LoadingModelValue: 'Power BI encountered an unexpected error while loading the model. Please try again later.',
            DsrError_Message: 'Can\'t display the visual.',
            DsrError_ModelGroupingInstructionsIgnoredKey: 'Model grouping instructions ignored',
            DsrError_ModelGroupingInstructionsIgnoredValue: 'The groups on a key should be grouped on another field.',
            DsrError_ModelUnavailableValue: 'Couldn’t retrieve the data model. Please contact the dashboard owner to make sure the data sources and model exist and are accessible.',
            DsrError_MoreInfo: 'More Details',
            DsrError_OverlappingKeysKey: 'Data in the visual is structured incorrectly',
            DsrError_OverlappingKeysValue: 'The groups in the primary axis and the secondary axis overlap. Groups in the primary axis can’t have the same keys as groups in the secondary axis.',
            DsrError_SuppressJoinPredicateValue: 'The column included in the join predicate must refer to a measure. Please contact the dashboard owner.',
            DsrError_UnknownErrorValue: 'Couldn’t retrieve the data for this visual. Please try again later.',
            Publish_DescriptionSizeExceeded: 'Description is too long',
            Publish_GroupAddressExceeded: 'You can only publish to {maxGroups} groups at a time, please remove some',
            Publish_InvalidEntry: 'Invalid entry',
            Publish_NoGroupAddressSpecified: 'Please specify one or more group addresses',
            Publish_TitleSizeExceeded: 'Title is too long',
            Publish_WrongGrouplAddresses: 'Invalid list of group addresses. Please correct them',
            Visual_LegendPosition_Bottom: 'Bottom',
            Visual_LegendPosition_Left: 'Left',
            Visual_LegendPosition_Right: 'Right',
            Visual_LegendPosition_Top: 'Top',
            Visual_yAxis_Left: 'Left',
            Visual_yAxis_Right: 'Right',
            DashboardReadOnly_Tooltip: 'This is a read-only dashboard',
            GetData_BrowserPopUpDisabled: 'Browser pop-up is disabled. Please verify browser settings.',
            GetData_AuthenticationError_Title: 'Failed to show authentication dialog',
            GetData_OK: 'OK',
            GetData_UnableToRetrieveTheAuthenticationEndpoint: 'Unable to retrieve the authentication endpoint',
            GetData_Zendesk_FinePrint: 'Your data in the Zendesk service is transmitted to Power BI so that you can perform business analytics.',
            DataDotClusteredColumnComboChart_ToolTip: 'Data-Dot and Clustered Column Chart',
            DataDotStackedColumnComboChart_ToolTip: 'Data-Dot and Stacked Column Chart',
            Visual_DisplayUnits_Auto: 'Auto',
            Visual_LabelPosition_BottomCenter: 'Bottom Center',
            Visual_LabelPosition_BottomLeft: 'Bottom Left',
            Visual_LabelPosition_BottomRight: 'Bottom Right',
            Visual_LabelPosition_InsideBase: 'Inside Base',
            Visual_LabelPosition_InsideCenter: 'Inside Center',
            Visual_LabelPosition_InsideEnd: 'Inside End',
            Visual_LabelPosition_MiddleCenter: 'Middle Center',
            Visual_LabelPosition_MiddleLeft: 'Middle Left',
            Visual_LabelPosition_MiddleRight: 'Middle Right',
            Visual_LabelPosition_OutsideBase: 'Outside Base',
            Visual_LabelPosition_OutsideEnd: 'Outside End',
            Visual_LabelPosition_TopCenter: 'Top Center',
            Visual_LabelPosition_TopLeft: 'Top Left',
            Visual_LabelPosition_TopRight: 'Top Right',
            Visual_DisplayUnits_Billions: 'B',
            Visual_DisplayUnits_Millions: 'M',
            Visual_DisplayUnits_Thousands: 'K',
            Visual_Card_Placeholder_Auto: 'Automatic',
            AreaChart_ToolTip: 'Area Chart',
            VisualContainer_UnableToFindVisualMessage: 'This visual type is not yet supported.',
            Waterfall_DecreaseLabel: 'Decrease',
            Waterfall_IncreaseLabel: 'Increase',
            Waterfall_SentimentColors: 'Sentiment Colors',
            GetData_StatsNFL2014SeasonRecap: 'Explore statistics from National Football League regular season and playoff games for the 2014 season. Statistics and key measures are provided game by game for each team and player, with additional data for fan attendance, game day weather, and player backgrounds.<br>This copy of the sample is yours to experiment with. You can always connect to the sample again for a fresh copy.',
            ExploreCompatibility_ToggleExplore: 'Explore the new Power BI report canvas',
            ExploreCompatibility_ToggleLegacy: 'Go back to classic report',
            ExploreCompatibility_WarnMessage: 'Would you like to keep a copy of your report in the classic format? Selecting "No" will overwrite the file and you will be unable to go back.',
            ExploreCompatibility_WarnTitle: 'You\'re about to save your report in the new format',
            ExploreCompatibility_PromptMessageLegacy: 'Power BI is changing the way you view, interact with and create reports. Please {0}send us feedback{1} about the new experience.',
            ExploreCompatibility_PromptTitleLegacy: 'New Power BI report canvas',
            ExploreCompatibility_TryNow: 'Try it now',
            MashUpContentProvider_UserVoice_Description1: 'Monitor and explore your UserVoice data in Power BI by simply connecting to UserVoice using your admin credentials. With Power BI, you will have your tickets, suggestions and user satisfaction data right at your fingertips. Use the dashboard and reports that are readily available for you to analyze your data, or customize your own to highlight the information you care about most. Power BI will refresh your User Voice data daily so your dashboards and reports are always up to date.',
            MashUpContentProvider_UserVoice_More2: ' connecting to UserVoice data',
            GetData_Mailchimp: 'With the MailChimp content pack for Power BI, quickly identify trends within your campaigns, reports, and individual subscribers. Find out who your most engaged subscribers are, which countries open the most campaigns, or how trends have changed over time. Drill down into your MailChimp data in Power BI without any coding knowledge. Automatic data updates help you make the most timely decisions.',
            FilledMap_ToolTip: 'Filled Map',
            Visual_Gradient_Diverging: 'Diverging',
            Visual_Gradient_MaxColor: 'Maximum',
            Visual_Gradient_MaxValue: 'Maximum',
            Visual_Gradient_MidColor: 'Center',
            Visual_Gradient_MidValue: 'Center',
            Visual_Gradient_MinColor: 'Minimum',
            Visual_Gradient_MinValue: 'Minimum',
            DonutChart_ToolTip: 'Donut Chart',
            MashUpContentProvider_SweetIQ_Description1: 'Easily track and analyze your local search ecosystem with the SweetIQ Power BI connector. Log in with your SweetIQ account to review search listings for all of your locations as well as analyze and monitor customer reviews. Use the dashboard and reports provided, or customize them to highlight the information you care about most. Data is automatically updated daily with the latest from SweetIQ based on a schedule that you set.',
            MashUpContentProvider_SweetIQ_More2: ' connecting to SweetIQ data',
            DirectQueryContentProvider_Error1: 'Please enter Server.',
            DirectQueryContentProvider_Error2: 'Please enter Database.',
            DirectQueryContentProvider_Error3: 'Please enter User.',
            DirectQueryContentProvider_Error4: 'Please enter Password.',
            DirectQueryContentProvider_Error5: 'Refresh Interval cannot be less than 15 minutes',
            DirectQueryContentProvider_InvalidConnectionString: 'We are unable to establish connection, please check connection information.',
            DirectQueryContentProvider_UnableToReachService: 'We are unable to reach our service to perform test connection, please retry.',
            DirectQueryContentProvider_RefreshInterval: 'Refresh Interval in Minutes:',
            SettingsDataset_DisableEntireRefreshPageErrorMessage_DirectQueryScheduleInfo: 'This dataset connects to a source with direct connect which is always up-to-date. You do not have to schedule a refresh on this dataset.',
            SettingsWorkbook_NoModel_workbookIsUpToDate: 'This workbook is always up-to-date.',
            LineClusteredColumnComboChart_ToolTip: 'Line and Clustered Column Chart',
            LineStackedColumnComboChart_ToolTip: 'Line and Stacked Column Chart',
            ReportAppBar_InsertTextboxButton: 'Insert Textbox',
            GetData_SweetIQ: 'Easily track and analyze your local search ecosystem with the SweetIQ Power BI connector. Log in with your SweetIQ account to review search listings for all of your locations as well as analyze and monitor customer reviews. Use the dashboard and reports provided, or customize them to highlight the information you care about most. Data is automatically updated daily with the latest from SweetIQ based on a schedule that you set.',
            GetData_Acumatica: 'Connecting to Acumatica directly from Power BI allows you to access powerful business insights. Log in to Power BI using Acumatica ERP credentials, and build valuable insights into the opportunity pipeline, opportunities in various stages, and opportunities won and lost. The out-of-the-box dashboard provides a set of views and this can be fully customized. You can ask a question about the data in Q&A, or click a tile to open the underlying report and change the tiles in the dashboard. Acumatica will continue to release additional dashboards for leads, support analysis, financials and more.',
            Clear: 'Clear',
            DsrLimitWarning_RepresentativeSampleKey: 'Showing representative sample.',
            DsrLimitWarning_RepresentativeSampleMessage: 'Showing representative sample.',
            DsrLimitWarning_RepresentativeSampleVal: 'Too many \'{0}\' values. Showing a representative sample. Filter the data or choose another field.',
            DsrLimitWarning_RepresentativeSampleValMultipleColumns: 'Showing representative sample. Filter the data or choose another field.',
            DsrLimitWarning_TooMuchDataKey: 'Too many values',
            DsrLimitWarning_TooMuchDataMessage: 'Too many values. Not showing all data.',
            DsrLimitWarning_TooMuchDataVal: 'Too many \'{0}\' values. Not displaying all data. Filter the data or choose another field.',
            DsrLimitWarning_TooMuchDataValMultipleColumns: 'Too many values. Not showing all data. Filter the data or choose another field.',
            GroupEditor_DiscardButton_Text: 'Discard',
            GroupEditor_SaveButton_Text: 'Save',
            GroupEditor_Title_CreateGroup: 'Create a Group',
            GroupEditor_Title_EditGroup: 'Edit Group',
            GroupEditor_GroupNameLabel_Text_CreateGroup: 'Name your group',
            GroupEditor_GroupNameLabel_Text_EditViewGroup: 'Name',
            GroupEditor_PrivacyLabel_Text: 'Privacy',
            GroupEditor_PrivacyOptions_Private: 'Private - Only approved members can see what\'s inside',
            GroupEditor_PrivacyOptions_Public: 'Public - Anyone can see what\'s inside',
            GroupEditor_AddGroupMembersLabel_Text: 'Add group members',
            GroupEditor_AddButton_Text: 'Add',
            GroupEditor_GroupIdLabel_Text: 'Group ID',
            GroupEditor_CreateGroup_GroupId_Available_Text: 'Available',
            GroupEditor_CreateGroup_GroupId_NotAvailable_Text: 'Not available; please edit',
            EmailsListPlaceholder: 'Enter email addresses separated by ; or ,',
            EmailsList_EmailAddressExceeded: 'You can only email {{maxEmails}} contacts at a time, please remove some.',
            EmailsList_EmailDomainNotInTenant: 'One or more email addresses are outside your organization: {{invalidDomains}}',
            EmailsList_FailureToValidateEmailsDomains_Message: 'Couldn\'t validate the domains for these email addresses',
            EmailsList_FailureToValidateEmailsDomains_Title: 'Couldn\'t validate',
            EmailsList_NoEmailAddressSpecified: 'Specify at least one email address',
            EmailsList_WrongEmailAddresses: 'These email addresses aren’t valid: {0}',
            GroupEditor_CreateGroup_GroupId_GroupIdEditing_NotAvailable_Text: 'Not available',
            GroupEditor_CreateGroup_GroupId_HasInvalidCharacters: 'The Group ID can\'t contain symbols',
            GroupEditor_AreYouSureYouWantToDiscard_Message: 'Your changes will be lost.',
            GroupEditor_AreYouSureYouWantToDiscard_Title: 'Are you sure you want to leave Group Editor?',
            GroupEditor_DeleteGroup_Text: 'Delete Group',
            ServerError_PersonalGateway_DataSourceErrorLabel: 'Data Source Error',
            ServerError_PersonalGateway_LongMessage_DataSource_Inaccessible: 'Last refresh attempt failed. Cannot connect to the data source. Ensure the data source is accessible.',
            ServerError_PersonalGateway_LongMessage_DataSource_InvalidCredential: 'Last refresh attempt failed. The data source has invalid credentials. Update the credentials & also ensure the rest of the data sources in the dataset have valid credentials.',
            ServerError_PersonalGateway_LongMessage_DataSource_MissingProvider: 'Last refresh attempt failed. The right data provider must be installed on the computer on which the gateway is installed.',
            ServerError_PersonalGateway_LongMessage_Gateway_Offline: 'Last refresh attempt failed. Your gateway is offline or could not be reached. Ensure the computer on which the gateway is installed is not switched off during the scheduled refresh period.',
            ServerError_PersonalGateway_LongMessage_Gateway_OfflineNonAdminUser: 'Last refresh attempt failed. Your gateway is offline or could not be reached. Ensure the computer on which the gateway is installed is not switched off or logged off during the scheduled refresh period.',
            ServerError_PersonalGateway_LongMessage_Gateway_WindowsCredentialError: 'Last refresh attempt failed. Power BI Personal Gateway cannot connect due to invalid windows credentials. Go to the machine where gateway was installed and update the windows credentials in the gateway. You can find the gateway in the tray or can search for \'Power BI Gateway\' on your computer.',
            ServerError_PersonalGateway_LongMessage_ProcessingError: 'Error during processing the data in the dataset',
            ServerError_PersonalGateway_LongMessage_ServiceError: 'Last refresh attempt failed. An unexpected error happened in the service that prevented the refresh.',
            ServerError_PersonalGateway_ProcessingErrorLabel: 'Processing Error',
            ServerError_PersonalGateway_ShortMessage_DataSource_Inaccessible: 'Last refresh attempt failed. Cannot connect to the data source.',
            ServerError_PersonalGateway_ShortMessage_DataSource_InvalidCredential: 'Last refresh attempt failed. Cannot connect to the data source.',
            ServerError_PersonalGateway_ShortMessage_DataSource_MissingProvider: 'Last refresh attempt failed.',
            ServerError_PersonalGateway_ShortMessage_Gateway_Offline: 'Last refresh attempt failed. Your gateway is offline or could not be reached.',
            ServerError_PersonalGateway_ShortMessage_Gateway_OfflineNonAdminUser: 'Last refresh attempt failed. Your gateway is offline or could not be reached.',
            ServerError_PersonalGateway_ShortMessage_Gateway_WindowsCredentialError: 'Last refresh attempt failed. Power BI Personal Gateway cannot start due to invalid windows credentials.',
            ServerError_PersonalGateway_ShortMessage_ProcessingError: 'Error during processing the data in the dataset',
            ServerError_PersonalGateway_ShortMessage_ServiceError: 'Last refresh attempt failed. Internal service error.',
            NavigationPane_ArchivedContent: 'Archived Content',
            TutorialPopup_ViewArchivedContentText: 'To view and interact with your archived content click on the button below.',
            TutorialPopup_ViewArchivedContentTitle: 'View archived content',
            TutorialPopup_WelcomeArchivedContentGoingForward: 'Going forward, create and share content in this new space managed by your administrator.',
            TutorialPopup_WelcomeArchivedContentLearnMoreLinkText: 'Learn more about archived Power BI content',
            TutorialPopup_WelcomeArchivedContentParagraphOne: 'An administrator has started managing Power BI for users at your organization. A new space has been created for all of your business data so it can be securely stored and shared with others in your organization.',
            TutorialPopup_WelcomeArchivedContentParagraphTwo: 'As a part of this transition, we have archived all of the Power BI content you created before your administrator started managing Power BI. You can click the Archived Content button to view this  archive at any time. Data in your archive will continue to refresh. You and any existing users that your content is shared with will be able to continue viewing dashboards and reports. However, you can’t share your archived content with new users in your organization.',
            TutorialPopup_WelcomeArchivedContentTitle: 'Say hello to the new Power BI for your organization',
            TutorialPopup_ArchivedContentText: 'Your previously acquired content.',
            TutorialPopup_ArchivedContentTitle: 'Archived<br/>Content',
            TutorialPopup_ForYourOrganizationText: 'New content you create and share with others.',
            TutorialPopup_ForYourOrganizationTitle: 'Power BI for your organization',
            ArchivedContent_BackToPowerBI: 'Back to Power BI',
            ArchivedContent_HeaderLinkText: 'Learn More',
            ArchivedContent_HeaderMessage: 'This is your archived content. Some features, like sharing and access on mobile devices, are disabled.',
            ArchivedContent_ErrorMessageGroup: 'Creating a group is not supported while you are in your archived content. Go back to Power BI to create a group with others in your organization.',
            ArchivedContent_ErrorMessageOneDrivePro: 'OneDrive for Business is not supported while you are in your archived content. Go back to PowerBI to connect to your OneDrive for Business account.',
            ArchivedContent_ErrorMessageSharing: 'Sharing with other members of your organization is not supported while you are in your archived content. Go to back to Power BI to share work.',
            ArchivedContent_ErrorOptionOneText: 'Go back to Power BI',
            ArchivedContent_ErrorOptionTwoText: 'Stay in Archived Content',
            ArchivedContent_ErrorTitle: 'You\'re in Archived Content',
            CloseAccount_Description: 'Didn\'t mean to close your account?',
            CloseAccount_ReopenYourAccount: 'Reopen your account',
            CloseAccount_YourAccountIsClosed: 'Your account is closed.',
            GetData_FindAPartner: 'Find a Partner',
            Groups_Splash_Description1: 'You\'re on your way to exploring your data and monitoring what matters with all your group members.',
            Groups_Splash_Description2: 'Let\'s start by getting some data.',
            Groups_Splash_Title: 'Welcome to the {0} group',
            GroupEditor_Email_Address_DoNotExist: 'These email addresses don’t exist in your organization: {0}',
            GroupEditor_Email_Address_DoNotExistOrNotPowerBiUsers: 'These email addresses don’t exist in your organization or aren’t Power BI users: {0}',
            Settings_CloseAccount: 'Close Account',
            Settings_CloseAccount_Button: 'Close Account',
            Settings_CloseAccount_Description: 'You can close your Power BI account. You will no longer be able to access Power BI and any content you created will be deleted.',
            Settings_CloseAccount_Reason_DecidedToUseOtherSoftware: 'Decided to use other software',
            Settings_CloseAccount_Reason_DidntNeedToUseIt: 'Didn\'t need to use it',
            Settings_CloseAccount_Reason_ForgotAboutIt: 'Forgot about it',
            Settings_CloseAccount_Reason_HardToUse: 'Hard to use',
            Settings_CloseAccount_Reason_HaventHadTimeToUseIt: 'Haven\'t had time to use it',
            Settings_CloseAccount_Reason_MissingFeatures: 'Missing features',
            Settings_CloseAccount_Reason_NotValuableEnoughToMe: 'Not valuable enough to me',
            Settings_CloseAccount_Reason_PlaceHolder: 'Select Reason (optional)',
            Settings_CloseAccount_Reason_TooManyErrors: 'Too many errors',
            Settings_CloseAccount_WhyAreYouClosingYourAccount: 'Why are you closing your account?',
            AfterUpgradeDialogTitle: 'After you upgrade',
            AfterUpgradeDialogMessage: 'After you upgrade successfully to Power BI Pro, click Refresh to take advantage of new features.',
            AfterUpgradeDialogRefreshButton: 'Refresh',
            UpgradeAccount_BrowseContentMessage: 'You may browse through the gallery of your organizational content. To connect to them, upgrade your account to Power BI Pro.',
            UpgradeAccount_ConnectContentMessage: 'To connect to your organizational content in Power BI, upgrade your account to Power BI Pro.',
            UpgradeAccount_ConnectContentTitle: 'Organizational content in Power BI',
            UpgradeAccount_GroupsCollaborationMessage: 'To collaborate with your team in Power BI, upgrade your account to Power BI Pro.',
            UpgradeAccount_GroupsCollaborationTitle: 'Team Collaboration in Power BI',
            UpgradeAccount_ScheduleOnPremDataRefreshMessage: 'This dataset contains on-premise data source. To schedule data refresh, upgrade your account to Power BI Pro.',
            UpgradeAccount_ScheduleDataRefreshMessage: 'To schedule hourly data refresh, upgrade your account to Power BI Pro.',
            UpgradeAccount_ShareDashboardWarnMessage: 'This dashboard contains {0}. Only users who have Power BI Pro can access this dashboard. {1}Learn more{2}',
            UpgradeAccount_ShareDashboardTitle: '{0} contains Power BI Pro content',
            UpgradeAccount_ShareDashboardMessage: 'To see this dashboard, upgrade your account to Power BI Pro.',
            UpgradeAccount_TryfreeButton: 'Try free for {0} days',
            UpgradeAccount_SuccessMessage: 'After you have successfully upgraded to Power BI Pro, click reload to refresh this page and take advantage of new features.',
            UpgradeAccount_SuccessTitle: 'Once you\'ve upgraded..',
            GetData_UserVoice: 'Monitor and explore your UserVoice data in Power BI by simply connecting to UserVoice using your admin credentials. With Power BI, you will have your tickets, suggestions and user satisfaction data right at your fingertips. Use the dashboard and reports that are readily available for you to analyze your data, or customize your own to highlight the information you care about most. Power BI will refresh your UserVoice data daily so your dashboards and reports are always up to date.',
            PublishContentPack_EmptyTitle: 'Be sure to enter a title for your content pack.',
            PublishContentPack_EmptyDescription: 'Be sure to enter a description for your content pack.',
            PublishContentPack_Changes: 'You\'ve made changes to this published content pack. Do you want others to see these changes?',
            PublishContentPack_NoItemsSelected: 'Be sure to select a dashboard, report or dataset for your content pack.',
            PublishContentPack_PersonalizeDashboard_Desc: 'You\'re making changes to a dashboard created from an organizational content pack. Click Save to create your own personal copy.',
            PublishContentPack_PersonalizeReport_Desc: 'You\'re making changes to a report created from an organizational content pack. Click Save to create your own personal copy.',
            PublishContentPack_Personalize_Dashboard: 'Personalize this dashboard',
            PublishContentPack_Personalize_DontSave: 'Don\'t Save',
            PublishContentPack_Personalize_Save: 'Save',
            PublishContentPack_UnsavedChanges: 'You have unsaved changes',
            PublishContentPack_UnsavedChanges_Desc: 'You\'ve made changes to a content pack. Do you want to publish them or cancel?',
            PublishContentPack_Failed_Desc: 'Failed to publish Organizational Apps',
            UploadReplace_DatasetExists: 'You already have a dataset named {0} in Power BI. Do you want to replace the existing dataset with this one?',
            UploadReplace_MultipleDatasetExists: 'You already have more than one dataset named {0} in Power BI. To replace an existing dataset make sure you have only one dataset with this name. Otherwise rename the file and try again.',
            UploadReplace_ReplaceButton: 'Replace it',
            UploadReplace_DontImportButton: 'Don\'t import',
            NewVisualThemeWelcomeNotificationText: 'You might notice our new look and feel. We’ve optimized our visualization colors across dashboards and reports to make your Power BI experience even better.',
            NavigationPane_DevTools: 'Dev Tools',
            Extensibility_DevTools: 'Dev Tools',
            Error_PleaseWait: 'Preparing Power BI',
            Error_PleaseWaitDescription: 'Finishing set up...',
            ErrorDescription_TenantNotAllowed_RetryLimitReached: 'We were not able to retrieve your tenant license within the allotted time limit.',
            ErrorDescription_UserNotLicensed_RetryLimitReached: 'We were not able to retrieve your user license within the allotted time limit.',
            ServerError_ActivityIdText: 'Activity Id',
            ServerError_ClusterUriText: 'Cluster URI',
            ServerError_RequestIdText: 'Request Id',
            ServerError_TimestampText: 'Time',
            ServerError_VersionText: 'Version',
            VisualContainer_Hide: 'Hide',
            GetData_FindOneHere: 'Find one here!',
            ExploreCompatibility_PromptMessageNew: 'We encourage you to try out the new report canvas and {0}send us your feedback{1}.  Prefer the classic report canvas?  You can go back by clicking above.',
            ExploreCompatibility_PromptTitleNew: 'Welcome to the new Power BI report canvas',
            ExploreCompatibility_TakeTour: 'Take the tour',
            Error_PleaseWaitSubtext: 'less than a minute remaining',
            GroupEditor_FailedCreateGroup_Message: 'Couldn\'t create the group',
            GroupEditor_FailedValidateMembers_Message: 'Couldn\'t validate group members',
            GroupEditor_FailedGetGroupMembers_Message: 'Couldn\'t get group members',
            GroupEditor_AreYouSureYouWantToDeleteGroup_Message: 'Power BI will delete all dashboards, reports, and models in this group.',
            GroupEditor_AreYouSureYouWantToDeleteGroup_Title: 'Are you sure you want to delete this group?',
            GroupEditor_FailedDeleteGroup_Message: 'Couldn\'t delete the group',
            GroupEditor_FailedUpdateGroup_Message: 'Couldn\'t update the group',
            GroupEditor_FailedValidateGroupId_Message: 'Unable to validate group ID, please try again later.',
            GroupEditor_WaitForSave: 'Saving...',
            GroupEditor_WaitForAddingMembers: 'Adding members...',
            GroupEditor_WaitLoadMembers: 'Loading members...',
            GroupEditor_WaitDeleteGroup: 'Deleting group...',
            GetData_Zuora: 'Visualize important revenue, billing, and subscription data in Power BI by connecting your Zuora account. Use the default dashboard and reports to analyze usage trends, track billings and payments, and monitor recurring revenue, or customize them to meet your own unique dashboard and reporting needs. Different users in your organization can customize their own reports and dashboards, and these can be shared with other users if desired. Data is automatically updated daily, ensuring you have the latest information available.',
            GetData_BIProfessional_Title: 'BI Professional',
            GetData_BusinessAnalyst_Title: 'Business Analyst',
            GetData_BusinessUser_Title: 'Business User',
            GetData_CustomerProfitabilitySample_Title: 'Customer Profitability Sample',
            GetData_Developer_Title: 'Developer',
            GetData_FilesTutorial_Title: 'Learn about importing files',
            GetData_HumanResourcesSample_Title: 'Human Resources Sample',
            GetData_ITSpendAnalysisSample_Title: 'IT Spend Analysis Sample',
            GetData_LocalFile_Title: 'Local File',
            GetData_OpportunityAnalysisSample_Title: 'Opportunity Analysis Sample',
            GetData_ProcurementAnalysisSample_Title: 'Procurement Analysis Sample',
            GetData_Retail_Analysis_Sample_Title: 'Retail Analysis Sample',
            GetData_SalesAndMarketingSample_Title: 'Sales and Marketing Sample',
            GetData_StatsNFL2014SeasonRecap_Title: 'STATS NFL 2014 Season Recap',
            GetData_SupplierQualityAnalysisSample_Title: 'Supplier Quality Analysis Sample',
            GetData_OneDriveBusiness_Title: 'OneDrive - Business',
            GetData_OneDrivePersonal_Title: 'OneDrive - Personal',
            NoMapLocationKey: 'Need a location to place values on the map',
            NoMapLocationMessage: 'Location is required to create a map.',
            NoMapLocationValue: 'Add a field to the Location box that specifies the position of data points on the map. The field can contain either specific geographic names or longitude and latitude values.',
            GetData_AzureHDInsightSparkLiveConnect: 'Apache Spark™ is a fast and general engine for large-scale data processing. Azure HDInsight offers a fully managed Spark service which allows for massive scale-out and interactive performance. HDInsight Spark can connect to any Blob storage in Azure Storage or Azure Data Lake. With the Spark on Azure HDInsight connector for Power BI, users can query and visualize the large volumes of unstructured data that have been modeled in Spark. The result is interactive data exploration and reporting in Power BI on a massive scale of data.',
            SparkContentProvider_Description: 'With Power BI you can create dynamic reports mashups with data and metrics you already have in Spark on Azure HDInsight. To get started, we need some information to connect.',
            SparkContentProvider_Landing_ConnectButton: 'Connect',
            SparkContentProvider_Password: 'Password:',
            SparkContentProvider_ServerName: 'Server:',
            SparkContentProvider_Title: 'Spark on Azure HDInsight',
            SparkContentProvider_UserName: 'User:',
            SparkContentProvider_Description2: 'More about',
            SparkContentProvider_Description3: 'direct connect with Spark on Azure HDInsight',
            PropertyPane_Unavailable: 'Formatting options are unavailable for this visual',
            DesignerContainer_FailedToLoadReport: 'Failed to load the report.',
            GetData_VisualStudioOnlineVNext: 'Visualize your engineering activity in Power BI by connecting to Microsoft Visual Studio Online. The default dashboard and report provide at-a-glance views of work and code across the projects you configure for your account.  You can customize the dashboard and report to highlight the deeper insights you care about most. The data that appears in Power BI will be updated from Microsoft Visual Studio Online according to a schedule that you control.',
            GroupEditor_Title_ViewGroup: 'View Group',
            GroupNavigationPaneContextMenuItem_ViewGroup: 'View Group',
            GroupEditor_AddGroupMembers_ViewMode_Label_Text: 'Group members',
            HistoryDialog_RefreshStatus_TimedOut: 'Timed Out',
            GroupEditor_ViewMode_OkButton_Text: 'Ok',
            GroupEditor_WaitForGroupIdValidation: 'Validating...',
            PublishContentPack_Update: 'Update',
            Publish_UpdateContentPack: 'Update Content Pack',
            UpdateContentPack_NoChangesMade: 'No content pack changes has been made.',
            PublishContentPack_GroupsValidationFailed: 'Be sure to enter valid groups',
            PublishContentPack_InvalidGroupAddresses: 'The following groups have failed validation : {0}',
            DashboardContentPackNewVersion: 'A new version of the "{0}" content pack is available.',
            Extensibility_Download: 'Download',
            Extensibility_Import: 'Import',
            Extensibility_Properties: 'Properties',
            Extensibility_Run: 'Run',
            Extensibility_Undo: 'Undo',
            Extensibility_DeveloperTools: 'Developer Tools',
            Extensibility_Extensibility: 'Extensibility',
            FixReferences_ToolTip: 'Fix References',
            Missing_References_Details_Title: 'List of Missing References',
            Missing_References_Message: 'This visual in broken due to missing references',
            Fix_This: 'Fix This',
        };
    })(localization = powerbi.localization || (powerbi.localization = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            var ApplyStyle = (function () {
                function ApplyStyle() {
                    this.css = {};
                }
                ApplyStyle.prototype.element = function (element) {
                    debug.assertValue(element, 'element');
                    debug.assert(!this.elem, 'element has already been set');
                    this.elem = element;
                };
                ApplyStyle.prototype.position = function (position) {
                    debug.assertValue(position, 'position');
                    var css = this.css;
                    // we need to set webkit transform for Safari support
                    css.WebkitTransform = css.transform = 'translate(' + position.x + 'px, ' + position.y + 'px)';
                };
                ApplyStyle.prototype.viewport = function (viewport) {
                    debug.assertValue(viewport, 'viewport');
                    var css = this.css;
                    css.height = viewport.height;
                    css.width = viewport.width;
                };
                ApplyStyle.prototype.zIndex = function (zIndex) {
                    debug.assertValue(zIndex, 'zIndex');
                    this.css.zIndex = zIndex;
                };
                /** Applies the css to the element. */
                ApplyStyle.prototype.apply = function () {
                    var element = this.elem;
                    if (element) {
                        element.css(this.css);
                        this.css = {};
                    }
                };
                return ApplyStyle;
            })();
            models.ApplyStyle = ApplyStyle;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            var AuthDialogModel = (function () {
                function AuthDialogModel() {
                    this.showAuthDialog = false;
                    this.showModalDialog = false;
                    this.showSpinner = false;
                    this.selectedAuthenticationIndex = 0;
                    this.showError = false;
                }
                return AuthDialogModel;
            })();
            models.AuthDialogModel = AuthDialogModel;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            var DatasetParametersDialogModel = (function () {
                function DatasetParametersDialogModel() {
                    this.showDatasetParametersDialog = false;
                    this.showSpinner = false;
                    this.showValidationError = false;
                }
                return DatasetParametersDialogModel;
            })();
            models.DatasetParametersDialogModel = DatasetParametersDialogModel;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            var DialogType = (function () {
                function DialogType() {
                }
                DialogType.Confirm = 'confirm';
                DialogType.Prompt = 'prompt';
                DialogType.Custom = 'custom';
                return DialogType;
            })();
            models.DialogType = DialogType;
            var ButtonImportance = (function () {
                function ButtonImportance() {
                }
                ButtonImportance.Normal = 'normal';
                ButtonImportance.Elevated = 'elevated';
                return ButtonImportance;
            })();
            models.ButtonImportance = ButtonImportance;
            var ConfirmDialogContentModel = (function () {
                function ConfirmDialogContentModel(title, message) {
                    if (title === void 0) { title = ''; }
                    if (message === void 0) { message = ''; }
                    this.title = title;
                    this.message = message;
                    this.dialogType = DialogType.Confirm;
                }
                return ConfirmDialogContentModel;
            })();
            models.ConfirmDialogContentModel = ConfirmDialogContentModel;
            var PromptDialogContentModel = (function () {
                function PromptDialogContentModel(title, instructions) {
                    if (title === void 0) { title = ''; }
                    if (instructions === void 0) { instructions = ''; }
                    this.title = title;
                    this.instructions = instructions;
                    this.dialogType = DialogType.Prompt;
                    this.userInput = '';
                }
                return PromptDialogContentModel;
            })();
            models.PromptDialogContentModel = PromptDialogContentModel;
            var ModalDialogModel = (function () {
                function ModalDialogModel(isConfirmButtonDisabled, confirmButtonText, autoCloseDialogOnConfirmButtonSelected, contentFilledDialog, hideActionsButtons) {
                    var _this = this;
                    if (contentFilledDialog === void 0) { contentFilledDialog = false; }
                    if (hideActionsButtons === void 0) { hideActionsButtons = false; }
                    this.isConfirmButtonDisabled = isConfirmButtonDisabled;
                    this.confirmButtonText = confirmButtonText;
                    this.autoCloseDialogOnConfirmButtonSelected = autoCloseDialogOnConfirmButtonSelected;
                    common.localize.ensureLocalization(function () { return _this.cancelButtonText = common.localize.get('ModalDialog_Cancel'); });
                    this.contentFilledDialog = contentFilledDialog;
                    this.hideActionsButtons = hideActionsButtons;
                    this.confirmButtonImportance = ButtonImportance.Normal;
                    this.cancelButtonImportance = ButtonImportance.Normal;
                }
                return ModalDialogModel;
            })();
            models.ModalDialogModel = ModalDialogModel;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            var ModalThreeButtonDialogModel = (function () {
                function ModalThreeButtonDialogModel(isConfirmButtonDisabled, confirmButtonText, denyButtonText, autoCloseDialogOnConfirmButtonSelected, contentFilledDialog, hideActionsButtons) {
                    var _this = this;
                    if (contentFilledDialog === void 0) { contentFilledDialog = false; }
                    if (hideActionsButtons === void 0) { hideActionsButtons = false; }
                    this.isConfirmButtonDisabled = isConfirmButtonDisabled;
                    this.confirmButtonText = confirmButtonText;
                    this.denyButtonText = denyButtonText;
                    this.autoCloseDialogOnConfirmButtonSelected = autoCloseDialogOnConfirmButtonSelected;
                    common.localize.ensureLocalization(function () { return _this.cancelButtonText = common.localize.get('ModalDialog_Cancel'); });
                    this.contentFilledDialog = contentFilledDialog;
                    this.hideActionsButtons = hideActionsButtons;
                    this.confirmButtonImportance = models.ButtonImportance.Normal;
                    this.cancelButtonImportance = models.ButtonImportance.Normal;
                    this.denyButtonImportance = models.ButtonImportance.Normal;
                }
                return ModalThreeButtonDialogModel;
            })();
            models.ModalThreeButtonDialogModel = ModalThreeButtonDialogModel;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            var IDatasource = (function () {
                function IDatasource() {
                }
                return IDatasource;
            })();
            models.IDatasource = IDatasource;
            (function (TestConnectionState) {
                TestConnectionState[TestConnectionState["NotSpecified"] = 0x0] = "NotSpecified";
                TestConnectionState[TestConnectionState["NotStart"] = 0x1] = "NotStart";
                TestConnectionState[TestConnectionState["Progressing"] = 0x2] = "Progressing";
                TestConnectionState[TestConnectionState["Failed"] = 0x3] = "Failed";
                TestConnectionState[TestConnectionState["Passed"] = 0x4] = "Passed";
            })(models.TestConnectionState || (models.TestConnectionState = {}));
            var TestConnectionState = models.TestConnectionState;
            var ISettingsDataset = (function () {
                function ISettingsDataset() {
                }
                return ISettingsDataset;
            })();
            models.ISettingsDataset = ISettingsDataset;
            var SettingsDataset = (function () {
                function SettingsDataset(modelId, name, description, lastRefreshFailed, lastRefreshFailedMessage, nextRefresh, refreshSettings, parameters) {
                    this.modelId = modelId;
                    this.name = name;
                    this.description = description;
                    this.lastRefreshFailed = lastRefreshFailed;
                    this.lastRefreshFailedMessage = lastRefreshFailedMessage;
                    this.nextRefresh = nextRefresh;
                    this.refreshSettings = refreshSettings;
                    this.parameters = parameters;
                    this.takenOver = false;
                    this.refreshStaticConstants = new RefreshStaticConstants();
                    this.isDirty = false;
                    this.areDatasourcesDirty = false;
                }
                Object.defineProperty(SettingsDataset.prototype, "takeOverStatusText", {
                    get: function () {
                        if (this.takenOver)
                            return common.localize.get('SettingsDataset_TakeOverStatusText_After');
                        else
                            return common.localize.format('SettingsDataset_TakeOverStatusText_Before', ['<a href=mailto:"' + this.lastTakeoverEmailAddress + '">' + this.lastTakeoverEmailAddress + '</a>']);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "takeOverButtonText", {
                    get: function () {
                        if (this.takenOver)
                            return common.localize.get('SettingsDataset_TakeOverButton_CancelTakeOver');
                        else
                            return common.localize.get('SettingsDataset_TakeOverButton_TakeOver');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "enableRefreshControlLabel", {
                    get: function () {
                        if (this.refreshSettings.refreshEnabled)
                            return common.localize.get('SettingsDataset_ScheduleRefresh_EnableRefresh_Yes');
                        else
                            return common.localize.get('SettingsDataset_ScheduleRefresh_EnableRefresh_No');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "showWeekDays", {
                    get: function () {
                        return this.refreshSettings.refreshFrequencyIndex === 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "hasDatasourceWithWrongCredentials", {
                    get: function () {
                        var length = (this.datasources !== undefined) ? this.datasources.length : 0;
                        for (var i = 0; i < length; i++)
                            if (this.datasources[i].testConnectionState === 0 /* NotSpecified */)
                                return true;
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshFrequencies", {
                    get: function () {
                        return RefreshStaticConstants.refreshFrequencies;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshDays", {
                    get: function () {
                        return RefreshStaticConstants.refreshDays;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshTimeWindows", {
                    get: function () {
                        return RefreshStaticConstants.refreshTimeWindows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshTimeHourWindows", {
                    get: function () {
                        return RefreshStaticConstants.refreshTimeHourWindows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshTimeMinuteWindows", {
                    get: function () {
                        return RefreshStaticConstants.refreshTimeMinuteWindows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshTimeAmPmWindows", {
                    get: function () {
                        return RefreshStaticConstants.refreshTimeAmPmWindows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshTimeZones", {
                    get: function () {
                        return RefreshStaticConstants.refreshTimeZones;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SettingsDataset.prototype, "refreshTimeZonesViewModel", {
                    get: function () {
                        return RefreshStaticConstants.refreshTimeZonesViewModel;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SettingsDataset;
            })();
            models.SettingsDataset = SettingsDataset;
            var RefreshStaticConstants = (function () {
                function RefreshStaticConstants() {
                    this.initRefreshFrequencies();
                    this.initRefreshDays();
                    this.initTimeWindows();
                    this.initTimeHourWindows();
                    this.initTimeMinuteWindows();
                    this.initTimeAmPmWindow();
                    this.initTimeZones();
                    this.initTimeZonesViewModel();
                }
                RefreshStaticConstants.prototype.initRefreshFrequencies = function () {
                    RefreshStaticConstants.refreshFrequencies = [
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Daily'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Weekly'),
                    ];
                };
                RefreshStaticConstants.prototype.initRefreshDays = function () {
                    RefreshStaticConstants.refreshDays = [
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Sunday'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Monday'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Tuesday'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Wednesday'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Thursday'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Friday'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_RefreshFrequency_Days_Saturday'),
                    ];
                };
                RefreshStaticConstants.prototype.initTimeWindows = function () {
                    RefreshStaticConstants.refreshTimeWindows = [
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeWindow_1'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeWindow_2'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeWindow_3'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeWindow_4'),
                    ];
                };
                RefreshStaticConstants.prototype.initTimeHourWindows = function () {
                    RefreshStaticConstants.refreshTimeHourWindows = [
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_1'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_2'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_3'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_4'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_5'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_6'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_7'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_8'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_9'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_10'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_11'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeHourWindows_12')
                    ];
                };
                RefreshStaticConstants.prototype.initTimeMinuteWindows = function () {
                    RefreshStaticConstants.refreshTimeMinuteWindows = [
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeMinuteWindos_00'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_TimeMinuteWindos_30')
                    ];
                };
                RefreshStaticConstants.prototype.initTimeAmPmWindow = function () {
                    RefreshStaticConstants.refreshTimeAmPmWindows = [
                        common.localize.get('SettingsDataset_ScheduleRefresh_AmPmWindows_Am'),
                        common.localize.get('SettingsDataset_ScheduleRefresh_AmPmWindows_Pm')
                    ];
                };
                RefreshStaticConstants.prototype.initTimeZones = function () {
                    RefreshStaticConstants.refreshTimeZones = {
                        'Dateline Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Dateline_Standard_Time'),
                        'UTC-11': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_UTC_Minus_11'),
                        'Hawaiian Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Hawaiian_Standard_Time'),
                        'Alaskan Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Alaskan_Standard_Time'),
                        'Pacific Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Pacific_Standard_Time'),
                        'Pacific Standard Time (Mexico)': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Pacific_Standard_Time_Mexico'),
                        'Mountain Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Mountain_Standard_Time'),
                        'Mountain Standard Time (Mexico)': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Mountain_Standard_Time_Mexico'),
                        'US Mountain Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_US_Mountain_Standard_Time'),
                        'Canada Central Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Canada_Central_Standard_Time'),
                        'Central America Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_America_Standard_Time'),
                        'Central Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_Standard_Time'),
                        'Central Standard Time (Mexico)': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_Standard_Time_Mexico'),
                        'Eastern Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Eastern_Standard_Time'),
                        'SA Pacific Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_SA_Pacific_Standard_Time'),
                        'US Eastern Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_US_Eastern_Standard_Time'),
                        'Venezuela Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Venezuela_Standard_Time'),
                        'Atlantic Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Atlantic_Standard_Time'),
                        'Central Brazilian Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_Brazilian_Standard_Time'),
                        'Pacific SA Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Pacific_SA_Standard_Time'),
                        'SA Western Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_SA_Western_Standard_Time'),
                        'Paraguay Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Paraguay_Standard_Time'),
                        'Newfoundland Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Newfoundland_Standard_Time'),
                        'E. South America Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_E_South_America_Standard_Time'),
                        'Greenland Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Greenland_Standard_Time'),
                        'Montevideo Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Montevideo_Standard_Time'),
                        'SA Eastern Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_SA_Eastern_Standard_Time'),
                        'Argentina Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Argentina_Standard_Time'),
                        'Mid-Atlantic Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Mid_Atlantic_Standard_Time'),
                        'UTC-2': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_UTC_Minus_2'),
                        'Azores Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Azores_Standard_Time'),
                        'Cabo Verde Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Cabo_Verde_Standard_Time'),
                        'GMT Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_GMT_Standard_Time'),
                        'Greenwich Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Greenwich_Standard_Time'),
                        'Morocco Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Morocco_Standard_Time'),
                        'UTC': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_UTC'),
                        'Central Europe Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_Europe_Standard_Time'),
                        'Central European Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_European_Standard_Time'),
                        'Romance Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Romance_Standard_Time'),
                        'W. Central Africa Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_W_Central_Africa_Standard_Time'),
                        'W. Europe Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_W_Europe_Standard_Time'),
                        'Namibia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Namibia_Standard_Time'),
                        'E. Europe Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_E_Europe_Standard_Time'),
                        'Egypt Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Egypt_Standard_Time'),
                        'FLE Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_FLE_Standard_Time'),
                        'GTB Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_GTB_Standard_Time'),
                        'Israel Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Israel_Standard_Time'),
                        'Jordan Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Jordan_Standard_Time'),
                        'Middle East Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Middle_East_Standard_Time'),
                        'South Africa Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_South_Africa_Standard_Time'),
                        'Syria Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Syria_Standard_Time'),
                        'Turkey Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Turkey_Standard_Time'),
                        'Arab Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Arab_Standard_Time'),
                        'Arabic Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Arabic_Standard_Time'),
                        'E. Africa Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_E_Africa_Standard_Time'),
                        'Kaliningrad Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Kaliningrad_Standard_Time'),
                        'Iran Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Iran_Standard_Time'),
                        'Russian Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Russian_Standard_Time'),
                        'Arabian Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Arabian_Standard_Time'),
                        'Azerbaijan Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Azerbaijan_Standard_Time'),
                        'Caucasus Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Caucasus_Standard_Time'),
                        'Georgian Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Georgian_Standard_Time'),
                        'Mauritius Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Mauritius_Standard_Time'),
                        'Afghanistan Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Afghanistan_Standard_Time'),
                        'West Asia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_West_Asia_Standard_Time'),
                        'Pakistan Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Pakistan_Standard_Time'),
                        'India Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_India_Standard_Time'),
                        'Sri Lanka Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Sri_Lanka_Standard_Time'),
                        'Nepal Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Nepal_Standard_Time'),
                        'Ekaterinburg Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Ekaterinburg_Standard_Time'),
                        'Central Asia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_Asia_Standard_Time'),
                        'Bangladesh Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Bangladesh_Standard_Time'),
                        'Myanmar Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Myanmar_Standard_Time'),
                        'N. Central Asia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_N_Central_Asia_Standard_Time'),
                        'SE Asia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_SE_Asia_Standard_Time'),
                        'North Asia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_North_Asia_Standard_Time'),
                        'China Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_China_Standard_Time'),
                        'Singapore Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Singapore_Standard_Tim'),
                        'Taipei Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Taipei_Standard_Time'),
                        'W. Australia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_W_Australia_Standard_Time'),
                        'Ulaanbaatar Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Ulaanbaatar_Standard_Time'),
                        'North Asia East Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_North_Asia_East_Standard_Time'),
                        'Korea Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Korea_Standard_Time'),
                        'Tokyo Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Tokyo_Standard_Time'),
                        'AUS Central Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_AUS_Central_Standard_Time'),
                        'Cen. Australia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Cen_Australia_Standard_Time'),
                        'Yakutsk Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Yakutsk_Standard_Time'),
                        'AUS Eastern Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_AUS_Eastern_Standard_Time'),
                        'E. Australia Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_E_Australia_Standard_Time'),
                        'Tasmania Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Tasmania_Standard_Time'),
                        'West Pacific Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_West_Pacific_Standard_Time'),
                        'Vladivostok Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Vladivostok_Standard_Time'),
                        'Central Pacific Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Central_Pacific_Standard_Time'),
                        'Magadan Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Magadan_Standard_Time'),
                        'Fiji Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Fiji_Standard_Time'),
                        'New Zealand Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_New_Zealand_Standard_Time'),
                        'UTC+12': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_UTC_Plus_12'),
                        'Tonga Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Tonga_Standard_Time'),
                        'Samoa Standard Time': common.localize.get('SettingsDataset_ScheduleRefresh_Timezone_Samoa_Standard_Time'),
                    };
                };
                RefreshStaticConstants.prototype.initTimeZonesViewModel = function () {
                    RefreshStaticConstants.refreshTimeZonesViewModel = new Array();
                    angular.forEach(RefreshStaticConstants.refreshTimeZones, function (value, key) {
                        RefreshStaticConstants.refreshTimeZonesViewModel.push({ key: key, value: value });
                    });
                };
                return RefreshStaticConstants;
            })();
            models.RefreshStaticConstants = RefreshStaticConstants;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//----------------------------------------------------------------------- 
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var models;
        (function (models) {
            (function (SettingsGroupsType) {
                SettingsGroupsType[SettingsGroupsType["Dashboards"] = 0] = "Dashboards";
                SettingsGroupsType[SettingsGroupsType["Datasets"] = 1] = "Datasets";
                SettingsGroupsType[SettingsGroupsType["Workbooks"] = 2] = "Workbooks";
            })(models.SettingsGroupsType || (models.SettingsGroupsType = {}));
            var SettingsGroupsType = models.SettingsGroupsType;
            var SettingsGroup = (function () {
                function SettingsGroup(type, name) {
                    this.type = type;
                    this.name = name;
                }
                return SettingsGroup;
            })();
            models.SettingsGroup = SettingsGroup;
        })(models = common.models || (common.models = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var ContentProviderManifest = powerbi.common.contracts.contentProviderManifest;
        var CommonUtility = jsCommon.Utility;
        function createContentProviderService($featureSwitchService) {
            return new ContentProviderService($featureSwitchService);
        }
        common.createContentProviderService = createContentProviderService;
        function findContentProviderName(contentProviders, contentProviderId) {
            var contentProviderName = 'Unknown';
            if (contentProviders) {
                // The ID 6 & 7 related content provider will be decommissioned.
                // There is no direct mapping for those 2 content providers in the current manifest.
                // TODO: remove the following check for ID 6 & 7 once the related content provider is officially decommissioned (including the related legacy data).
                if (contentProviderId === 6) {
                    contentProviderName = 'Excel Workbook';
                }
                else if (contentProviderId === 7) {
                    contentProviderName = 'Power BI Designer File';
                }
                else {
                    var filteredContentProviders = _.filter(contentProviders, function (provider) { return provider.id === contentProviderId; });
                    if (filteredContentProviders && filteredContentProviders.length > 0)
                        contentProviderName = filteredContentProviders[0].displayText;
                }
            }
            return contentProviderName;
        }
        common.findContentProviderName = findContentProviderName;
        var ContentProviderService = (function () {
            function ContentProviderService(featureSwitchService) {
                this.featureSwitchService = featureSwitchService;
            }
            ContentProviderService.prototype.getBuiltInContentProviders = function () {
                var _this = this;
                return ContentProviderManifest.filter(function (contentProvider) { return !contentProvider.featureSwitch || (contentProvider.featureSwitch && _this.featureSwitchService.featureSwitches[contentProvider.featureSwitch]); });
            };
            ContentProviderService.prototype.getContentProviders = function (parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'GetContentProviders');
                var url = ContentProviderService._baseUrlEndPoint;
                var includeFlightingContentProviders = this.featureSwitchService.featureSwitches.includeFlightingContentProviders;
                if (includeFlightingContentProviders)
                    url += '?includeFlightedContentProviders=true';
                return common.httpService.get(url, requestOptions);
            };
            ContentProviderService.prototype.getOrganizationalContentProviders = function (parentEvent, isOwned) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'GetContentProviders');
                var url = ContentProviderService._baseUrlEndPoint;
                if (isOwned) {
                    url += '?category=Organizational&owned=true';
                }
                else {
                    url += '?category=Organizational';
                }
                return common.httpService.get(url, requestOptions);
            };
            ContentProviderService.prototype.getConfiguration = function (contentProviderId, type, parentEvent, packageId) {
                CommonUtility.throwIfNullOrUndefined(contentProviderId, this, 'getConfiguration', 'contentProviderId');
                CommonUtility.throwIfNullOrUndefined(type, this, 'getConfiguration', 'type');
                var url = CommonUtility.urlCombine(ContentProviderService._baseUrlEndPoint, contentProviderId + '/configuration');
                if (packageId)
                    url = CommonUtility.urlCombine(url, packageId.toString());
                url = CommonUtility.urlCombine(url, '?type=' + type);
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'GetConiguration');
                return common.httpService.get(url, requestOptions);
            };
            ContentProviderService.prototype.storeConfiguration = function (currentDashboardId, contentProviderId, dataAccessInfo, parentEvent, contentProviderKey, packageId) {
                CommonUtility.throwIfNullOrUndefined(currentDashboardId, this, 'storeConfiguration', 'dashboardId');
                CommonUtility.throwIfNullOrUndefined(contentProviderId, this, 'storeConfiguration', 'contentProviderId');
                CommonUtility.throwIfNullOrUndefined(dataAccessInfo, this, 'storeConfiguration', 'dataAccessInfo');
                var url = CommonUtility.urlCombine(ContentProviderService._baseUrlEndPoint, '/' + contentProviderId + '/configuration');
                if (contentProviderKey) {
                    url = CommonUtility.urlCombine(ContentProviderService._baseUrlEndPoint, '/' + contentProviderKey + '/configuration');
                }
                if (packageId)
                    url = CommonUtility.urlCombine(url, packageId.toString());
                url = CommonUtility.urlCombine(url, '?currentDashboardId=' + currentDashboardId);
                var dataAccessInfoWrapper = {
                    dataAccessInfo: dataAccessInfo
                };
                var requestOption = common.httpService.powerbiRequestOptions(parentEvent, 'StoreConfiguration');
                requestOption.retryCount = 0;
                return common.httpService.put(url, dataAccessInfoWrapper, requestOption);
            };
            ContentProviderService._baseUrlEndPoint = '/powerbi/content/providers/';
            return ContentProviderService;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createDatasetsService() {
            return new DatasetsService();
        }
        common.createDatasetsService = createDatasetsService;
        var DatasetsService = (function () {
            function DatasetsService() {
            }
            DatasetsService.prototype.updateDatasource = function (datasourceID, testOnSave, newVersion, request, parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'UpdateDataSource');
                requestOptions.retryCount = 0;
                return common.httpService.post('powerbi/dmm/datasources/' + datasourceID + (newVersion ? "/v2" : "") + '?testOnSave=' + testOnSave, request, requestOptions);
            };
            DatasetsService.prototype.updateModelParameters = function (modelID, parameters, parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'UpdateModelParameters');
                return common.httpService.post('powerbi/metadata/models/' + modelID + '/parameters', parameters, requestOptions);
            };
            DatasetsService.prototype.getAggregatedDatasourcesForOneModel = function (modelId, testConnection, parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'GetAggregatedDatasources');
                return common.httpService.get('powerbi/dmm/aggregateDataSource/' + modelId + '?testConnection=' + testConnection, requestOptions);
            };
            DatasetsService.prototype.getAggregatedDatasourcesForImport = function (providerId, dataAccessInfo, testConnection, parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'GetAggregatedDatasourcesImport');
                return common.httpService.post('powerbi/dmm/aggregateDataSourceImport/' + providerId + '?testConnection=' + testConnection, dataAccessInfo, requestOptions);
            };
            DatasetsService.prototype.discoverPublicKey = function (parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'DiscoverPublicKey');
                return common.httpService.get('powerbi/dmm/gateways/publicKeys', requestOptions);
            };
            DatasetsService.prototype.displayOopsErrorAndEndTelemetry = function (telemetryService, errorService, errMsgId, result, event) {
                event.reject();
                errorService.error(common.localize.get(errMsgId), errMsgId, {
                    requestId: result.requestId,
                    statusCode: result.status.toString()
                });
            };
            DatasetsService.prototype.testDataSourceConnection = function (datasourceId, parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'TestDataSourceConnection');
                return common.httpService.post('powerbi/dmm/dataSources/' + datasourceId + '/testConnection', null, requestOptions);
            };
            return DatasetsService;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var mashupProviderService;
        (function (mashupProviderService) {
            function getMashUpProviderPackageModels(providerId, parentEvent) {
                var options = common.httpService.powerbiRequestOptions(parentEvent, 'GetMashUpProviderPackageModels');
                return common.httpService.get('powerbi/providers/mashup/provider/' + providerId.toString() + '/models', options);
            }
            mashupProviderService.getMashUpProviderPackageModels = getMashUpProviderPackageModels;
            function updateMashUpProviderPackageModelParameters(providerId, parameters, parentEvent) {
                var requestOptions = common.httpService.powerbiRequestOptions(parentEvent, 'UpdateMashUpProviderPackageModelParameters');
                return common.httpService.post('powerbi/providers/mashup/provider/' + providerId.toString() + '/parameters', parameters, requestOptions);
            }
            mashupProviderService.updateMashUpProviderPackageModelParameters = updateMashUpProviderPackageModelParameters;
        })(mashupProviderService = common.mashupProviderService || (common.mashupProviderService = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var settingsService;
        (function (settingsService) {
            function getSettingsGroups() {
                var settingsGroups = [];
                common.localize.ensureLocalization(function () {
                    settingsGroups.push(new common.models.SettingsGroup(0 /* Dashboards */, common.localize.get('SettingsGroupsNames_Dashboards')));
                    settingsGroups.push(new common.models.SettingsGroup(1 /* Datasets */, common.localize.get('SettingsGroupsNames_Datasets')));
                    settingsGroups.push(new common.models.SettingsGroup(2 /* Workbooks */, common.localize.get('SettingsGroupsNames_Workbooks')));
                });
                return settingsGroups;
            }
            settingsService.getSettingsGroups = getSettingsGroups;
        })(settingsService = common.settingsService || (common.settingsService = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var AADTokenService = (function () {
            function AADTokenService() {
            }
            AADTokenService.prototype.refreshToken = function (onTokenRefreshed) {
                // Add timestamp to force page reload and disable any attempts by browser to cache
                var refreshTokenFrame = $('<iframe height="1" width="1" frameborder="0" name="refreshTokenFrame" id="refreshTokenFrameId" sandbox="allow-scripts allow-same-origin allow-forms" src="/tokenRefresh?ver=' + Date.now() + '"></iframe>');
                var body = $('body');
                body.find('#refreshTokenFrameId').remove();
                body.append(refreshTokenFrame);
                refreshTokenFrame[0].onload = function () {
                    onTokenRefreshed();
                };
            };
            return AADTokenService;
        })();
        common.tokenService = new AADTokenService();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createActiveGroupIdService() {
            return new ActiveGroupIdService();
        }
        common.createActiveGroupIdService = createActiveGroupIdService;
        var ActiveGroupIdService = (function () {
            function ActiveGroupIdService() {
                // if the service is intialized inside an iframe, inherit the activeGroupObjectId from its root
                if (this.isInIframe()) {
                    var topFrame = window.top;
                    this.activeGroupObjectId = topFrame.powerbi.common.httpService.activeGroupIdService.activeGroupObjectId;
                }
            }
            Object.defineProperty(ActiveGroupIdService.prototype, "headerActiveGroupObjectId", {
                get: function () {
                    return (this.activeGroupObjectId === powerbi.constants.myWorkspaceGroupId) ? "" : this.activeGroupObjectId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActiveGroupIdService.prototype, "myWorkspaceGroupId", {
                get: function () {
                    return powerbi.constants.myWorkspaceGroupId;
                },
                enumerable: true,
                configurable: true
            });
            ActiveGroupIdService.prototype.isInIframe = function () {
                try {
                    return window.self !== window.top;
                }
                catch (e) {
                    return true;
                }
            };
            return ActiveGroupIdService;
        })();
        common.ActiveGroupIdService = ActiveGroupIdService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        /**
        * creates a ChannelSubscriptionManager of type IChannelSubscriptionManager
        * @param {subscribeFunction} [handler] Triggered by channel based on the event name
        */
        function createChannelSubscriptionManager(subscribeFunction) {
            return new ChannelSubscriptionManager(subscribeFunction);
        }
        common.createChannelSubscriptionManager = createChannelSubscriptionManager;
        /**
        * Manages the channel subscription by tracking subscriptions that are passed to a subscription bridge
        */
        var ChannelSubscriptionManager = (function () {
            /**
            * @constructor
            * @property {IEventBridge} [subscriptionBridge] Use to get the channel associated with an event
            */
            function ChannelSubscriptionManager(subscribeFunction) {
                this.subscribeFunction = subscribeFunction;
                // initialize subscriptionList to an empty array
                this.unsubscribeList = [];
            }
            /**
            * Implementation of subscribe function from IChannelSubscriptionManager
            */
            ChannelSubscriptionManager.prototype.subscribe = function (event, handler) {
                var unsubscribeFunction = this.subscribeFunction(event, handler);
                // ensure that unsubscribeFunction is actually a function
                if (unsubscribeFunction && $.isFunction(unsubscribeFunction)) {
                    // push unsubscribe function to the unsubscribe list
                    this.unsubscribeList.push(unsubscribeFunction);
                }
                return this;
            };
            /**
            * Implementation of unsubscribeAll function from IChannelSubscriptionManager
            */
            ChannelSubscriptionManager.prototype.unsubscribeAll = function () {
                var subscriptionCount = -1;
                var index = this.unsubscribeList.length;
                if (index) {
                    subscriptionCount = index;
                    while (index) {
                        // call the unsubscription callback and decrement the index
                        this.unsubscribeList[--index]();
                    }
                    // purge all the entries
                    this.unsubscribeList.splice(0, subscriptionCount);
                }
                return subscriptionCount;
            };
            return ChannelSubscriptionManager;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createDelayedQueryResultHandler() {
            return new DelayedQueryResultHandler();
        }
        common.createDelayedQueryResultHandler = createDelayedQueryResultHandler;
        var DelayedQueryResultHandler = (function () {
            function DelayedQueryResultHandler() {
            }
            DelayedQueryResultHandler.prototype.setQueryResolver = function (resolver) {
                debug.assert(!this.queryResolver, "Query Resolver was set twice on DelayedQueryResultHandler");
                this.queryResolver = resolver;
            };
            DelayedQueryResultHandler.prototype.registerDelayedResult = function (jobId, deferred, schemaName) {
                if (this.queryResolver) {
                    this.queryResolver.resolveDelayedQuery(jobId, deferred, schemaName);
                }
                else {
                    // If we don't have a query resolver reject the query so that any visuals stop waiting for data
                    deferred.reject();
                }
            };
            return DelayedQueryResultHandler;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createDragDataService() {
            return new DragDataServiceImpl();
        }
        common.createDragDataService = createDragDataService;
        var DragDataServiceImpl = (function () {
            function DragDataServiceImpl() {
            }
            DragDataServiceImpl.prototype.setDragElement = function (element) {
                this.dragElement = element;
            };
            DragDataServiceImpl.prototype.setDragContext = function (context) {
                this.dragContext = context;
            };
            DragDataServiceImpl.prototype.getDragElement = function () {
                return this.dragElement;
            };
            DragDataServiceImpl.prototype.getDragContext = function () {
                return this.dragContext;
            };
            return DragDataServiceImpl;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createDropdownMenuService() {
            return new DropdownMenuService();
        }
        common.createDropdownMenuService = createDropdownMenuService;
        var DropdownMenuService = (function () {
            function DropdownMenuService() {
                var _this = this;
                $(window).on('resize', function () { return _this.hideMenu(); });
            }
            DropdownMenuService.prototype.showMenu = function (menuElement, anchorElement, event, horizontalOrientation) {
                this.prepareMenuItem(menuElement, anchorElement, horizontalOrientation);
                this.showMenuCore();
                if (event)
                    event.stopPropagation();
            };
            DropdownMenuService.prototype.toggleActive = function (menuElement, anchorElement, event, horizontalOrientation) {
                this.prepareMenuItem(menuElement, anchorElement, horizontalOrientation);
                if (!menuElement.hasClass(DropdownMenuService.dropDownActiveClass))
                    this.showMenuCore();
                else
                    this.hideMenu();
                if (event)
                    event.stopPropagation();
            };
            DropdownMenuService.prototype.hideMenu = function () {
                if (this.currentDropdownElement && this.currentDropdownElement.hasClass(DropdownMenuService.dropDownActiveClass)) {
                    this.currentDropdownElement.removeClass(DropdownMenuService.dropDownActiveClass);
                    this.currentDropdownElement.detach();
                    this.currentDropdownElement = null;
                    $(window).off(jsCommon.DOMConstants.mouseDownEventName, this.mouseDownHideDialog);
                }
            };
            DropdownMenuService.prototype.showMenuCore = function () {
                var _this = this;
                if (this.currentDropdownElement) {
                    $(window).on(jsCommon.DOMConstants.mouseDownEventName, function (event) { return _this.mouseDownHideDialog(event); });
                    this.currentDropdownElement.addClass(DropdownMenuService.dropDownActiveClass);
                }
            };
            DropdownMenuService.prototype.prepareMenuItem = function (menuElement, anchorElement, horizontalOrientation) {
                if (this.currentDropdownElement) {
                    var menu = this.currentDropdownElement;
                    if (!menu.is(menuElement)) {
                        menu.removeClass(DropdownMenuService.dropDownActiveClass);
                        menu.detach();
                        this.currentDropdownElement = null;
                        this.currentAnchorElement = null;
                    }
                }
                if (!this.currentDropdownElement) {
                    this.currentDropdownElement = menuElement;
                    this.currentAnchorElement = anchorElement;
                    this.currentDropdownElement.appendTo('body');
                }
                if (anchorElement) {
                    // test to see if the menu can fit on the screen
                    var anchorOffsetLeft = horizontalOrientation ? anchorElement.offset().left + anchorElement.width() : anchorElement.offset().left;
                    var menuWidth = menuElement.outerWidth(true);
                    var overflowsScreen = menuWidth + anchorOffsetLeft > $(window).width();
                    var leftPosition = overflowsScreen ? anchorOffsetLeft + anchorElement.outerWidth(true) - menuWidth : anchorOffsetLeft;
                    var preferredTop = horizontalOrientation ? anchorElement.offset().top : anchorElement.offset().top + anchorElement.height();
                    var menuHeight = menuElement.outerHeight(true);
                    overflowsScreen = menuHeight + preferredTop > $(window).height();
                    var topPosition = overflowsScreen ? preferredTop - menuHeight : preferredTop;
                    menuElement.css({
                        position: 'absolute',
                        zIndex: 1000,
                        top: topPosition,
                        left: Math.ceil(leftPosition),
                        opacity: 1
                    });
                }
            };
            DropdownMenuService.prototype.mouseDownHideDialog = function (event) {
                if (this.currentDropdownElement && this.currentDropdownElement.hasClass(DropdownMenuService.dropDownActiveClass) && this.outOfBoundsClickHandler(event)) {
                    this.currentDropdownElement.removeClass(DropdownMenuService.dropDownActiveClass);
                }
            };
            DropdownMenuService.prototype.outOfBoundsClickHandler = function (event) {
                var mouseX = event.pageX;
                var mouseY = event.pageY;
                if (this.currentAnchorElement && this.currentDropdownElement && this.currentDropdownElement.hasClass(DropdownMenuService.dropDownActiveClass)) {
                    if (!this.isOutOfBounds(this.currentAnchorElement, mouseX, mouseY))
                        return false;
                }
                if (this.currentDropdownElement && this.currentDropdownElement.hasClass(DropdownMenuService.dropDownActiveClass))
                    return this.isOutOfBounds(this.currentDropdownElement, mouseX, mouseY);
            };
            DropdownMenuService.prototype.isOutOfBounds = function (element, mouseX, mouseY) {
                var elementOffset = element.offset();
                var elementHeadX = elementOffset.left;
                var elementHeadY = elementOffset.top;
                var elementTailX = elementHeadX + element.outerWidth();
                var elementTailY = elementHeadY + element.outerHeight();
                return elementHeadX > mouseX || mouseX > elementTailX || elementHeadY > mouseY || mouseY > elementTailY;
            };
            DropdownMenuService.dropDownActiveClass = 'active';
            return DropdownMenuService;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createOverlayService(root) {
            return new OverlayService(root);
        }
        common.createOverlayService = createOverlayService;
        var OverlayService = (function () {
            function OverlayService(root) {
                var _this = this;
                this.overlays = [];
                this.dropdowns = [];
                $(window).on(jsCommon.DOMConstants.mouseClickEventName, function (event) { return _this.mouseClickHideDialog(event, _this.dropdowns); });
                $(window).on('resize', function () {
                    _this.hideAllDropdowns();
                });
                if (root)
                    this.root = root;
                else
                    this.root = $('body');
            }
            OverlayService.prototype.register = function (element, dropdown) {
                if (dropdown)
                    this.dropdowns.push(element);
                else
                    this.overlays.push(element);
                element.addClass(OverlayService.overlayClass);
                element.appendTo(this.root);
            };
            OverlayService.prototype.unregister = function (element, dropdown) {
                var collection = dropdown ? this.dropdowns : this.overlays;
                var index = collection.map(function (jqueryElement) {
                    return jqueryElement[0];
                }).indexOf(element[0]);
                if (index > -1) {
                    collection[index].remove();
                    collection.splice(index, 1);
                }
                element.removeClass(OverlayService.overlayClass);
                element.removeClass(OverlayService.overlayActiveClass);
                element.remove();
            };
            OverlayService.prototype.mouseClickHideDialog = function (event, currentMenus) {
                if (this.dropdowns.length > 0) {
                    for (var i = 0, len = this.dropdowns.length; i < len; i++) {
                        var currentDropdownElement = this.dropdowns[i];
                        if (currentDropdownElement.hasClass(OverlayService.overlayActiveClass) && this.outOfBoundsClickHandler(event, currentDropdownElement)) {
                            this.hideAllDropdowns();
                            break;
                        }
                    }
                }
            };
            OverlayService.prototype.showOverlay = function (element, anchorElement, dropdown) {
                if (dropdown)
                    this.repositionDropdown(element, anchorElement, true);
                else
                    this.repositionToolbar(element, anchorElement);
                element.addClass(OverlayService.overlayActiveClass);
            };
            OverlayService.prototype.toggleDropdown = function (element, anchorElement, event, preferLeft) {
                for (var i = 0, len = this.dropdowns.length; i < len; i++) {
                    var dropdown = this.dropdowns[i];
                    if (!dropdown.is(element)) {
                        dropdown.removeClass(OverlayService.overlayActiveClass);
                    }
                }
                this.repositionDropdown(element, anchorElement, preferLeft);
                element.toggleClass(OverlayService.overlayActiveClass);
                if (event)
                    event.stopPropagation();
            };
            OverlayService.prototype.hideAll = function () {
                this.hideAllDropdowns();
                for (var i = 0, len = this.overlays.length; i < len; i++) {
                    this.hideOverlay(this.overlays[i]);
                }
            };
            OverlayService.prototype.outOfBoundsClickHandler = function (event, currentMenu) {
                var mouseX = event.pageX;
                var mouseY = event.pageY;
                var overlayOffset = currentMenu.offset();
                var overlayHeadX = overlayOffset.left;
                var overlayHeadY = overlayOffset.top;
                var overlayTailX = overlayHeadX + currentMenu.width();
                var overlayTailY = overlayHeadY + currentMenu.height();
                return overlayHeadX > mouseX || mouseX > overlayTailX || overlayHeadY > mouseY || mouseY > overlayTailY;
            };
            OverlayService.prototype.repositionDropdown = function (element, anchorElement, preferLeft) {
                var anchorOffsetLeft = anchorElement.offset().left;
                var menuWidth = element.outerWidth(true);
                var overflowsScreen = menuWidth + anchorOffsetLeft > $(window).width();
                var leftPosition = preferLeft || overflowsScreen ? anchorOffsetLeft + anchorElement.outerWidth(true) - menuWidth : anchorOffsetLeft;
                var preferredTop = anchorElement.offset().top + anchorElement.outerHeight(true);
                var menuHeight = element.outerHeight(true);
                overflowsScreen = menuHeight + preferredTop > $(window).height();
                var topPosition = overflowsScreen ? preferredTop - menuHeight : preferredTop;
                element.css({
                    top: topPosition,
                    left: Math.ceil(leftPosition),
                });
            };
            OverlayService.prototype.repositionToolbar = function (element, anchorElement) {
                var width = element.outerWidth(true);
                var height = element.outerHeight(true);
                var anchorLeft = anchorElement.offset().left;
                var anchorTop = anchorElement.offset().top;
                var anchorHeight = anchorElement.outerHeight(true);
                var anchorWidth = anchorElement.outerWidth(true);
                var floatAbove = anchorTop - height - OverlayService.VerticalMargin;
                var floatBelow = anchorTop + anchorHeight + OverlayService.VerticalMargin;
                var left = anchorLeft;
                if (left + width > $(window).width())
                    left = anchorLeft + anchorWidth - width;
                if (left < 0)
                    left = 0;
                var top = floatAbove;
                if (top < 0)
                    top = floatBelow;
                else if (top + height > $(window).height())
                    top = floatAbove;
                element.css({
                    top: top,
                    left: left,
                });
            };
            OverlayService.prototype.hideAllDropdowns = function () {
                for (var i = 0, len = this.dropdowns.length; i < len; i++) {
                    var menuElement = this.dropdowns[i];
                    if (menuElement && menuElement.hasClass(OverlayService.overlayActiveClass)) {
                        this.hideDropdown(menuElement);
                    }
                    this.dropdowns[i].removeClass(OverlayService.overlayActiveClass);
                }
            };
            OverlayService.prototype.hideDropdown = function (menuElement) {
                menuElement.animate({ opacity: 0 }, OverlayService.menuFadeOutAnimationMs, function () {
                    menuElement.removeClass(OverlayService.overlayActiveClass);
                    menuElement.removeAttr('style');
                });
            };
            OverlayService.prototype.hideOverlay = function (element) {
                element.removeClass(OverlayService.overlayActiveClass);
            };
            OverlayService.overlayActiveClass = 'overlayActive';
            OverlayService.overlayClass = 'overlay';
            OverlayService.VerticalMargin = 12;
            OverlayService.menuFadeOutAnimationMs = 250;
            return OverlayService;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var TraceType = jsCommon.TraceType;
        function createErrorService(telemetryService) {
            // storing errorService in powerbi.errorService because it is needed for IFrames to access the errorService from the main window
            powerbi.common.errorService = new ErrorService(telemetryService);
            return powerbi.common.errorService;
        }
        common.createErrorService = createErrorService;
        var ErrorService = (function () {
            function ErrorService(telemetryService) {
                this.modalDialog = new jsCommon.ModalDialog();
                debug.assertValue(telemetryService, 'telemetryService');
                this.telemetryService = telemetryService;
            }
            ErrorService.prototype.error = function (errorMsg, errorType, errorOptions) {
                var _this = this;
                var additionalErrorInfo = [];
                var errorKeyValuePair;
                var raid = (errorOptions && !jsCommon.StringExtensions.isNullOrEmpty(errorOptions.requestId)) ? errorOptions.requestId : '';
                var caid = (errorOptions && !jsCommon.StringExtensions.isNullOrEmpty(errorOptions.ecsCorrelationId)) ? errorOptions.ecsCorrelationId : '';
                this.logTelemetry(raid, caid, errorType);
                if (errorOptions && errorOptions.additionalErrorInfo)
                    additionalErrorInfo = errorOptions.additionalErrorInfo;
                common.localize.ensureLocalization(function () {
                    errorKeyValuePair = {
                        errorInfoKey: common.localize.get('AdditionalErrorInfo_ActivityIdText'),
                        errorInfoValue: _this.telemetryService.sessionId
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                    if (raid) {
                        errorKeyValuePair = {
                            errorInfoKey: common.localize.get('AdditionalErrorInfo_RequestIdText'),
                            errorInfoValue: raid
                        };
                        additionalErrorInfo.push(errorKeyValuePair);
                    }
                    if (errorOptions && !jsCommon.StringExtensions.isNullOrEmpty(errorOptions.statusCode)) {
                        errorKeyValuePair = {
                            errorInfoKey: common.localize.get('AdditionalErrorInfo_ErrorCodeText'),
                            errorInfoValue: errorOptions.statusCode
                        };
                        additionalErrorInfo.push(errorKeyValuePair);
                    }
                    if (caid) {
                        errorKeyValuePair = {
                            errorInfoKey: common.localize.get('AdditionalErrorInfo_ecsCorrelationId'),
                            errorInfoValue: caid
                        };
                        additionalErrorInfo.push(errorKeyValuePair);
                    }
                    errorKeyValuePair = {
                        errorInfoKey: common.localize.get('AdditionalErrorInfo_TimestampText'),
                        errorInfoValue: new Date().toString()
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                    if ((typeof (powerbi.build) !== 'undefined') && !jsCommon.StringExtensions.isNullOrEmpty(powerbi.build)) {
                        errorKeyValuePair = {
                            errorInfoKey: common.localize.get('AdditionalErrorInfo_VersionText'),
                            errorInfoValue: powerbi.build
                        };
                        additionalErrorInfo.push(errorKeyValuePair);
                    }
                    if ((typeof (clusterUri) !== 'undefined') && !jsCommon.StringExtensions.isNullOrEmpty(clusterUri)) {
                        errorKeyValuePair = {
                            errorInfoKey: common.localize.get('AdditionalErrorInfo_ClusterUriText'),
                            errorInfoValue: clusterUri
                        };
                        additionalErrorInfo.push(errorKeyValuePair);
                    }
                    var showAdditionalErrorInfo = true;
                    if (errorOptions && errorOptions.showAdditionalErrorInfo === false) {
                        showAdditionalErrorInfo = false;
                    }
                    var defaultErrorTitle = common.localize.get('ErrorMessage_DefaultTitle');
                    _this.modalDialog.showCustomError(errorOptions ? errorOptions.title || defaultErrorTitle : defaultErrorTitle, errorMsg, errorOptions ? errorOptions.level : 3 /* Error */, errorOptions ? errorOptions.isDismissable : true, showAdditionalErrorInfo ? additionalErrorInfo : null, errorOptions ? errorOptions.dismissCallback : null, errorOptions ? errorOptions.dialogOptions : null);
                });
            };
            ErrorService.prototype.fatalCustom = function (errorTitle, errorMsg, errorType) {
                if (!jsCommon.StringExtensions.isNullOrEmpty(errorType)) {
                    this.logTelemetry('', '', errorType);
                }
                this.modalDialog.showCustomError(errorTitle, errorMsg, 6 /* Fatal */, false);
            };
            ErrorService.prototype.fatal = function (errorMsg, errorType) {
                this.logTelemetry('', '', errorType);
                this.modalDialog.showError(errorMsg, 6 /* Fatal */);
            };
            ErrorService.prototype.warning = function (warningMsg) {
                this.modalDialog.showError(warningMsg, 2 /* Warning */);
            };
            ErrorService.prototype.info = function (infoMsg) {
                this.modalDialog.showError(infoMsg, 0 /* Information */);
            };
            ErrorService.prototype.infoCustom = function (infoTitle, infoMsg) {
                this.modalDialog.showMessage(infoTitle, infoMsg);
            };
            ErrorService.prototype.control = function () {
                return this.modalDialog;
            };
            ErrorService.prototype.logTelemetry = function (requestId, ecsCorrelationId, errorType) {
                var telemetryService = this.telemetryService;
                telemetryService.logEvent(powerbi.telemetry.DashboardErrorDialog, requestId, ecsCorrelationId, errorType, "");
            };
            return ErrorService;
        })();
        common.ErrorService = ErrorService;
        common.errorService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        (function (EventChannelType) {
            EventChannelType[EventChannelType["Data"] = 0] = "Data";
            EventChannelType[EventChannelType["Section"] = 1] = "Section";
            EventChannelType[EventChannelType["Visual"] = 2] = "Visual";
        })(common.EventChannelType || (common.EventChannelType = {}));
        var EventChannelType = common.EventChannelType;
        /** Manages subscription to Bubbling Scope, implements IBubblingSubscriptionManager interface */
        var BubblingScopeSubscriptionManager = (function () {
            function BubblingScopeSubscriptionManager(scope) {
                this.scope = scope;
            }
            BubblingScopeSubscriptionManager.prototype.subscribe = function (event, handler) {
                var scope = this.scope;
                if (scope) {
                    scope.$on(event.name, handler);
                }
                return this;
            };
            return BubblingScopeSubscriptionManager;
        })();
        function createEventBridge() {
            return new EventBridge();
        }
        common.createEventBridge = createEventBridge;
        var EventChannel = (function () {
            function EventChannel(type) {
                this.type = type;
            }
            return EventChannel;
        })();
        var EventBridge = (function () {
            function EventBridge() {
                this.channelMap = {};
            }
            EventBridge.prototype.getChannel = function (channelType) {
                return this.getOrCreateChannel(channelType, true);
            };
            EventBridge.prototype.getOrCreateChannel = function (channelType, shouldCreate) {
                var channel = this.channelMap[channelType];
                if (!channel) {
                    if (!shouldCreate)
                        return;
                    channel = new EventChannel(channelType);
                    this.channelMap[channelType] = channel;
                }
                return $(channel);
            };
            EventBridge.prototype.createChannelSubscriptionManager = function () {
                var _this = this;
                return common.createChannelSubscriptionManager(function (event, handler) { return _this.subscribeToChannel(event, handler); });
            };
            EventBridge.prototype.subscribeToChannel = function (event, handler) {
                debug.assertValue(event, 'event');
                debug.assertValue(handler, 'handler');
                var channel = this.getChannel(event.type);
                var unsubscribe = function () {
                    $(channel).off(event.name, null, handler);
                };
                // Avoid multi subscription
                unsubscribe();
                $(channel).on(event.name, {}, handler);
                return unsubscribe;
            };
            EventBridge.prototype.publishToChannel = function (event, data) {
                debug.assertValue(event, 'event');
                // only publish to channel if channel exists
                // this avoids creating a channel if it has no subscribers thus avoiding polution of channel list
                var $channel = this.getOrCreateChannel(event.type, false);
                if ($channel)
                    $channel.trigger(event.name, data);
            };
            EventBridge.prototype.setBubblingScope = function (scope) {
                return new BubblingScopeSubscriptionManager(scope);
            };
            EventBridge.prototype.subscribeToBubbling = function (scope, event, handler) {
                debug.assertValue(scope, 'scope');
                debug.assertValue(event, 'event');
                return scope.$on(event.name, handler);
            };
            EventBridge.prototype.publishBubbling = function (scope, event, data) {
                debug.assertValue(scope, 'scope');
                debug.assertValue(event, 'event');
                scope.$emit(event.name, data);
            };
            return EventBridge;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var ClientFeatureSwitches = (function () {
            function ClientFeatureSwitches() {
                // Please add featureSwitches here with a default value of false, so key iterators will find the values (ie routing, featureswitch loading, ...)
                // Also add a short comment on what the feature switch does
                this.orgAppsEnabled = false; // Org Apps
                this.microsoftOrgAppEnabled = false; // web.config based feature switch to enable org apps such as 'people view', 'tech adoption'
                this.withinDXT = false; // is the current enviroment DXT? TODO: rename to meaningful name. This will go away very soon.
                this.groupsEnabled = false; // Org Groups
                this.newGetDataEnabled = false; // New Get Data experience
                this.includeFlightingContentProviders = false; // Content provider flighting
                this.showFlagUtteranceButton = false; // Show feedback button near QnA textbox
                this.exportallowed = false; //Export dashboard for content package
                this.unmin = false; // serve .js files instead of .min.js files
                this.pgw = true; // New dataset refresh page. This will be removed once the new schedule refresh page is sign off from PM
                this.showGettingStartedPopups = false; // Show all getting started popups
                this.ignoreGettingStartedPopups = false; // Ignore all getting started popups
                this.useNewGridSize = false; // New grid size with different aspect ratios
                this.devToolsEnabled = false; // Developer Tools
                this.explore = false; // Minerva feature switch
                this.newTable = false;
                this.heatMap = false;
                this.dataDotChartEnabled = false; //This feature switch enables the data-dot & column combo charts
                this.richTextboxEnabled = false;
                this.quotaEnabled = false; //Quota Management
                this.quotaEnforcementEnabled = false; //This feature switch enables blocking of certain user actions when quota is full
                this.quotaSmallLimitEnabled = false; // Temporary feature switch. This feature switch is for testing and bug bash purpose.
                this.forceFreeUserEnabled = false; // Temporary feature switch. This feature switch is for testing and bug bash purpose. When turn on, user will become free user.
                this.fullFidelityExcelEnabled = false; // temporary feature switch until fully support full fidelity excel.
                this.vsoVnextAppEnabled = false; //feature switch to enable Visual Studio Online vNext feature.
                this.exploreToggleEnabled = false;
                this.saveVisualData = false; // Minerva should save data for the visuals
                this.zuoraAppEnabled = false; //Zuora feature switch for testing purposes.
                this.interpretWithData = false; // Athena should get data when doing the interpretation
                this.languageQueryParamEnabled = false; // Allow "language" query string parameter to set language
                // this should be refactored out to a different service
                this.currentContentProviderFlightCode = null; // Content provider flight code
                this.cpcode = null; // Content provider flight code (short version)
                // Formatting Pane feature switches
                this.allFormatEnabled = false; // Switch to enable all formatting panes
                this.titleFormatEnabled = true; // Title formatting
                this.dataPointFormatEnabled = true; // Data Point formatting
                this.categoryAxisFormatEnabled = true; // Category Axis formatting
                this.legendFormatEnabled = true; // Legend formatting
                this.backgroundFormatEnabled = true; // Background formatting
                // Add feature switch for signup
                this.redirectedFromSignup = false; // If the user just came from signup then several functions must behave differently
                this.csvContentProviderEnabled = false; // This feature switch controls whether to support CSV file type in file based content providers.
            }
            return ClientFeatureSwitches;
        })();
        common.ClientFeatureSwitches = ClientFeatureSwitches;
        function createEditableFeatureSwitchService($q, prototype) {
            return new FeatureSwitchService($q, prototype);
        }
        common.createEditableFeatureSwitchService = createEditableFeatureSwitchService;
        var FeatureSwitchService = (function () {
            function FeatureSwitchService($q, prototype) {
                debug.assertValue($q, '$q');
                this.featureSwitchValues = prototype;
                this.initializationDeferred = $q.defer();
            }
            FeatureSwitchService.prototype.registerFeatureSwitches = function (featureSwitches) {
                // Initial prototype should override those registered.
                this.featureSwitchValues = $.extend({}, featureSwitches, this.featureSwitchValues);
                this.initializationDeferred.resolve(this.featureSwitchValues);
            };
            FeatureSwitchService.prototype.getFeatureSwitches = function () {
                return this.initializationDeferred.promise;
            };
            Object.defineProperty(FeatureSwitchService.prototype, "featureSwitches", {
                get: function () {
                    return this.featureSwitchValues;
                },
                enumerable: true,
                configurable: true
            });
            return FeatureSwitchService;
        })();
        common.featureSwitchService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
'use strict';
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var ArrayExtensions = jsCommon.ArrayExtensions;
        var expiredTokenPromptHelper = powerbi.common.helpers.expiredTokenPromptHelper;
        var Utility = jsCommon.Utility;
        var StringExtensions = jsCommon.StringExtensions;
        common.PowerBIErrorHeader = 'x-powerbi-error-info';
        common.PowerBIErrorDetailsHeader = 'x-powerbi-error-details';
        /**
         * Default implementation for Cluster Uri retriever which fits for the web app purposes
         */
        var DefaultClusterUriRetriever = (function () {
            function DefaultClusterUriRetriever() {
            }
            Object.defineProperty(DefaultClusterUriRetriever.prototype, "frontendUri", {
                get: function () {
                    return (location.protocol + '//' + location.host);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultClusterUriRetriever.prototype, "backendUri", {
                get: function () {
                    return clusterUri;
                },
                enumerable: true,
                configurable: true
            });
            return DefaultClusterUriRetriever;
        })();
        var DefaultinterceptUrl = (function () {
            function DefaultinterceptUrl() {
            }
            DefaultinterceptUrl.prototype.interceptUrl = function (requestUrl) {
                return requestUrl;
            };
            return DefaultinterceptUrl;
        })();
        /**
         * Default implementation for http redirection which fits for the web app purposes
         */
        var DefaultHttpUriRedirector = (function () {
            function DefaultHttpUriRedirector() {
            }
            DefaultHttpUriRedirector.prototype.redirectToSignupUrl = function (pbiSource, deferred, httpResult) {
                location.href = '/SignupRedirect' + pbiSource;
            };
            DefaultHttpUriRedirector.prototype.redirectToErrorPage = function (errorCode, errorType, deferred, httpResult) {
                location.href = StringExtensions.format('/ErrorPage?code={0}&errorType={1}', status, errorType);
            };
            DefaultHttpUriRedirector.prototype.redirectToPleaseWaitPage = function (pbiSource, redirectedFromSignup, deferred, httpResult) {
                var queryString = pbiSource;
                if (redirectedFromSignup === '1') {
                    queryString = pbiSource.length > 0 ? (pbiSource + '&redirectedFromSignup=1') : ('?redirectedFromSignup=1');
                }
                location.href = '/PleaseWait' + queryString;
            };
            return DefaultHttpUriRedirector;
        })();
        /**
         * Default implementation for PowerBI expired token sink which fits for the web app purposes
         */
        var DefaultExpiredTokenSink = (function () {
            function DefaultExpiredTokenSink() {
            }
            DefaultExpiredTokenSink.prototype.onExpiredPowerBITokenRefresh = function (telemetryService, deferred, httpResult) {
                expiredTokenPromptHelper.promptExpiredPowerBITokenRefreshDialog(telemetryService);
            };
            return DefaultExpiredTokenSink;
        })();
        /**
         * Wrapper around Angular $http service adding retries, total timeout
         * and a more robust api for request and result chaining.
         */
        var HttpService = (function () {
            function HttpService($http, $upload, promiseFactory, telemetryService, errorService, activeGroupIdService, featureSwitchService, clusterUriRetriever, httpUriRedirector, urlInterceptor, expiredTokenSink) {
                if (clusterUriRetriever === void 0) { clusterUriRetriever = new DefaultClusterUriRetriever(); }
                if (httpUriRedirector === void 0) { httpUriRedirector = new DefaultHttpUriRedirector(); }
                if (urlInterceptor === void 0) { urlInterceptor = new DefaultinterceptUrl(); }
                if (expiredTokenSink === void 0) { expiredTokenSink = new DefaultExpiredTokenSink(); }
                /* Callbacks for listeners that are notified after every response */
                this.responseCallbacks = [];
                this.http = $http;
                this.uploader = $upload;
                this.promiseFactory = promiseFactory;
                this.telemetryService = telemetryService;
                this.errorService = errorService;
                this.activeGroupIdService = activeGroupIdService;
                this.clusterUriRetriever = clusterUriRetriever;
                this.httpUriRedirector = httpUriRedirector;
                this.urlInterceptor = urlInterceptor;
                this.expiredTokenSink = expiredTokenSink;
                if (featureSwitchService)
                    this.featureSwitchService = featureSwitchService;
            }
            HttpService.prototype.getAll = function (urls, additionalRequestConfigs) {
                var _this = this;
                if (!this.verifyAllParamsForUrl(urls, additionalRequestConfigs))
                    return;
                var requestConfigs = urls.map(function (url, index) {
                    var additionalRequestConfig = additionalRequestConfigs[index];
                    return _this.prepareGetRequestConfig(url, additionalRequestConfig);
                });
                return this.requestAll(requestConfigs);
            };
            HttpService.prototype.deleteAll = function (urls, additionalRequestConfigs) {
                var _this = this;
                if (!this.verifyAllParamsForUrl(urls, additionalRequestConfigs))
                    return;
                var requestConfigs = urls.map(function (url, index) {
                    var additionalRequestConfig = additionalRequestConfigs[index];
                    return _this.prepareDeleteRequestConfig(url, additionalRequestConfig);
                });
                return this.requestAll(requestConfigs);
            };
            HttpService.prototype.postAll = function (urls, data, additionalRequestConfigs) {
                var _this = this;
                if (!this.verifyAllParamsForUrlAndData(urls, data, additionalRequestConfigs))
                    return;
                var requestConfigs = urls.map(function (url, index) {
                    var additionalRequestConfig = additionalRequestConfigs[index];
                    return _this.preparePostRequestConfig(url, data[index], additionalRequestConfig);
                });
                return this.requestAll(requestConfigs);
            };
            HttpService.prototype.putAll = function (urls, data, additionalRequestConfigs) {
                var _this = this;
                if (!this.verifyAllParamsForUrlAndData(urls, data, additionalRequestConfigs))
                    return;
                var requestConfigs = urls.map(function (url, index) {
                    var additionalRequestConfig = additionalRequestConfigs[index];
                    return _this.preparePutRequestConfig(url, data[index], additionalRequestConfig);
                });
                return this.requestAll(requestConfigs);
            };
            HttpService.prototype.requestAll = function (configsAndTelemetry) {
                var _this = this;
                if (ArrayExtensions.isUndefinedOrEmpty(configsAndTelemetry))
                    return null;
                var aggregatedRequestChain = this.promiseFactory.defer();
                var results = [];
                var expectedResultCount = configsAndTelemetry.length;
                var resultCount = 0;
                var failureCount = 0;
                for (var i = 0, len = configsAndTelemetry.length; i < len; i++) {
                    // We need to create an inner closure in order to retain the current index
                    (function (currentIndex) {
                        var currentConfig = configsAndTelemetry[i];
                        _this.request(currentConfig).then(function (httpResult) {
                            resultCount++;
                            _this.processPartialResult(results, httpResult, currentIndex, expectedResultCount, resultCount, failureCount, aggregatedRequestChain);
                        }, function (httpResult) {
                            resultCount++;
                            failureCount++;
                            _this.processPartialResult(results, httpResult, currentIndex, expectedResultCount, resultCount, failureCount, aggregatedRequestChain);
                        });
                    })(i);
                }
                return aggregatedRequestChain.promise;
            };
            HttpService.prototype.get = function (url, additionalRequestConfig) {
                var requestConfig = this.prepareGetRequestConfig(url, additionalRequestConfig);
                return this.request(requestConfig);
            };
            HttpService.prototype.delete = function (url, additionalRequestConfig) {
                var requestConfig = this.prepareDeleteRequestConfig(url, additionalRequestConfig);
                return this.request(requestConfig);
            };
            HttpService.prototype.post = function (url, data, additionalRequestConfig) {
                var requestConfig = this.preparePostRequestConfig(url, data, additionalRequestConfig);
                return this.request(requestConfig);
            };
            HttpService.prototype.put = function (url, data, additionalRequestConfig) {
                var requestConfig = this.preparePutRequestConfig(url, data, additionalRequestConfig);
                return this.request(requestConfig);
            };
            HttpService.prototype.patch = function (url, data, additionalRequestConfig) {
                var requestConfig = this.preparePatchRequestConfig(url, data, additionalRequestConfig);
                return this.request(requestConfig);
            };
            HttpService.prototype.uploadUsingPost = function (url, files, additionalRequestConfig) {
                var config = this.preparePostRequestConfig(url, null, additionalRequestConfig);
                config.file = files;
                config.url = this.qualifyUrl(config.url);
                return this.requestInternal(config, null, this.uploader.upload);
            };
            HttpService.prototype.uploadUsingPut = function (url, files, additionalRequestConfig) {
                var config = this.preparePutRequestConfig(url, null, additionalRequestConfig);
                config.file = files;
                config.url = this.qualifyUrl(config.url);
                return this.requestInternal(config, null, this.uploader.upload);
            };
            HttpService.prototype.getResolvedHttpChain = function () {
                var newChain = this.promiseFactory.defer();
                newChain.resolve(null);
                return newChain.promise;
            };
            HttpService.prototype.powerbiRequestOptions = function (activity, telemetryDescription) {
                var options = {
                    retryCount: HttpService.DefaultRetryCount,
                    headers: {}
                };
                this.setGroupHeader(options);
                this.setTelemetryHeaders(options, activity);
                this.setAuthorizationHeader(options);
                this.setPreviousTenantIdHeader(options);
                if (telemetryDescription)
                    options.telemetryDescription = telemetryDescription;
                return options;
            };
            HttpService.prototype.setGroupHeader = function (options) {
                if (this.featureSwitchService && this.featureSwitchService.featureSwitches.groupsEnabled) {
                    options.headers['X-PowerBI-User-GroupId'] = this.activeGroupIdService.headerActiveGroupObjectId;
                }
            };
            HttpService.prototype.setTelemetryHeaders = function (options, activity) {
                var currentRequestId = activity ? activity.id : Utility.generateGuid();
                var ts = this.telemetryService;
                options.headers['ActivityId'] = ts.sessionId;
                options.headers['RequestId'] = currentRequestId;
            };
            HttpService.prototype.setPreviousTenantIdHeader = function (options) {
                if (!jsCommon.StringExtensions.isNullOrEmpty(previousTenantId)) {
                    options.headers['X-PowerBI-User-PreviousTenantId'] = previousTenantId;
                }
            };
            HttpService.prototype.defaultRetryRequestOptions = function () {
                return { retryCount: HttpService.DefaultRetryCount };
            };
            Object.defineProperty(HttpService.prototype, "frontendUri", {
                get: function () {
                    return this.clusterUriRetriever.frontendUri;
                },
                enumerable: true,
                configurable: true
            });
            HttpService.prototype.registerResponseCallback = function (callback) {
                this.responseCallbacks.push(callback);
            };
            HttpService.prototype.unregisterResponseCallback = function (callback) {
                var index = this.responseCallbacks.indexOf(callback);
                if (index >= 0)
                    this.responseCallbacks.splice(index, 1);
            };
            HttpService.prototype.setAuthorizationHeader = function (options) {
                // We want to use powerBIAccessToken from the main window (even when we are inside of an IFrame) because that is the one that gets refreshed by AADTokenService
                // If a window does not have a parent, its parent property is a reference to itself
                var parentWindow = window.parent;
                if (jsCommon.StringExtensions.isNullOrEmpty(parentWindow.powerBIAccessToken)) {
                    this.expiredTokenSink.onExpiredPowerBITokenRefresh(this.telemetryService, null, null);
                    return;
                }
                options.headers['Authorization'] = 'Bearer ' + parentWindow.powerBIAccessToken;
            };
            HttpService.prototype.request = function (config) {
                config.url = this.qualifyUrl(config.url);
                return this.requestInternal(config);
            };
            HttpService.prototype.requestInternal = function (requestConfig, currentChain, requestor, retryCount) {
                var _this = this;
                currentChain = currentChain || this.promiseFactory.defer();
                // Must use the longer != null checks here because 0 is an expected value (x || y returns y if x is zero)
                retryCount = (retryCount != null) ? retryCount : (requestConfig.retryCount != null) ? requestConfig.retryCount : 0;
                var httpPromise;
                if (requestor) {
                    httpPromise = requestor(requestConfig);
                }
                else {
                    httpPromise = this.http(requestConfig);
                }
                httpPromise.success(function (data, status, headers, config) {
                    currentChain.resolve({
                        data: data,
                        status: status,
                        headers: headers,
                        activityId: config.headers[powerbi.constants.activityId],
                        requestId: config.headers[powerbi.constants.requestId],
                    });
                    // Notify listeners to let them know a request succeeded
                    _this.notifyResponseListeners(true);
                }).error(function (data, status, headers, config) {
                    if (HttpService.shouldRetry(status) && retryCount > 0) {
                        _this.requestInternal(config, currentChain, requestor, retryCount - 1);
                    }
                    else if (!requestConfig.silentlyFailOnExpiry && HttpService.isTokenExpired(status, headers)) {
                        _this.expiredTokenSink.onExpiredPowerBITokenRefresh(_this.telemetryService, currentChain, {
                            data: data,
                            status: status,
                            headers: headers,
                            activityId: config.headers[powerbi.constants.activityId],
                            requestId: config.headers[powerbi.constants.requestId],
                        });
                    }
                    else if (HttpService.isUserAccountDisabled(status, headers)) {
                        _this.httpUriRedirector.redirectToErrorPage(status, 'UserAccountDisabled', currentChain, {
                            data: data,
                            status: status,
                            headers: headers,
                            activityId: config.headers[powerbi.constants.activityId],
                            requestId: config.headers[powerbi.constants.requestId],
                        });
                    }
                    else if (!requestConfig.disableRedirectToSignupOnUnlicensedUser && HttpService.isUnlicensedUser(status, headers)) {
                        var pbi_source = jsCommon.QueryStringUtil.getQueryStringValue('pbi_source');
                        pbi_source = pbi_source ? '?pbi_source=' + encodeURIComponent(pbi_source) : '';
                        var redirectedFromSignup = jsCommon.QueryStringUtil.getQueryStringValue('redirectedFromSignup');
                        if (redirectedFromSignup === '1') {
                            _this.httpUriRedirector.redirectToPleaseWaitPage(pbi_source, redirectedFromSignup, currentChain, {
                                data: data,
                                status: status,
                                headers: headers,
                                activityId: config.headers[powerbi.constants.activityId],
                                requestId: config.headers[powerbi.constants.requestId],
                            });
                        }
                        else {
                            _this.httpUriRedirector.redirectToSignupUrl(pbi_source, currentChain, {
                                data: data,
                                status: status,
                                headers: headers,
                                activityId: config.headers[powerbi.constants.activityId],
                                requestId: config.headers[powerbi.constants.requestId],
                            });
                        }
                    }
                    else {
                        currentChain.reject({
                            data: data,
                            status: status,
                            headers: headers,
                            activityId: config.headers[powerbi.constants.activityId],
                            requestId: config.headers[powerbi.constants.requestId],
                        });
                    }
                    // Notify listeners to let them know a request failed
                    _this.notifyResponseListeners(false);
                });
                return currentChain.promise;
            };
            HttpService.prototype.notifyResponseListeners = function (success) {
                var callbacks = this.responseCallbacks;
                for (var i = 0, ilen = this.responseCallbacks.length; i < ilen; ++i) {
                    callbacks[i](success);
                }
            };
            HttpService.prototype.prepareGetRequestConfig = function (url, additionalRequestConfig) {
                return this.prepareRequestConfigWithUrl('GET', url, additionalRequestConfig);
            };
            HttpService.prototype.prepareDeleteRequestConfig = function (url, additionalRequestConfig) {
                return this.prepareRequestConfigWithUrl('DELETE', url, additionalRequestConfig);
            };
            HttpService.prototype.preparePostRequestConfig = function (url, data, additionalRequestConfig) {
                return this.prepareRequestConfigWithUrlAndData('POST', url, data, additionalRequestConfig);
            };
            HttpService.prototype.preparePutRequestConfig = function (url, data, additionalRequestConfig) {
                return this.prepareRequestConfigWithUrlAndData('PUT', url, data, additionalRequestConfig);
            };
            HttpService.prototype.preparePatchRequestConfig = function (url, data, additionalRequestConfig) {
                return this.prepareRequestConfigWithUrlAndData('PATCH', url, data, additionalRequestConfig);
            };
            HttpService.prototype.prepareRequestConfigWithUrl = function (method, url, additionalRequestConfig) {
                var requestConfig = {
                    method: method,
                    url: url,
                };
                return angular.extend(requestConfig, additionalRequestConfig);
            };
            HttpService.prototype.prepareRequestConfigWithUrlAndData = function (method, url, data, additionalRequestConfig) {
                var requestConfig = {
                    method: method,
                    url: url,
                    data: data,
                };
                return angular.extend(requestConfig, additionalRequestConfig);
            };
            HttpService.prototype.verifyAllParamsForUrl = function (uris, additionalRequestConfigs) {
                if (ArrayExtensions.isUndefinedOrEmpty(uris) || ArrayExtensions.isUndefinedOrEmpty(additionalRequestConfigs) || uris.length !== additionalRequestConfigs.length) {
                    console.warn('Invalid request parameters');
                    return false;
                }
                return true;
            };
            HttpService.prototype.verifyAllParamsForUrlAndData = function (uris, data, additionalRequestConfigs) {
                if (ArrayExtensions.isUndefinedOrEmpty(uris) || ArrayExtensions.isUndefinedOrEmpty(data) || ArrayExtensions.isUndefinedOrEmpty(additionalRequestConfigs) || uris.length !== additionalRequestConfigs.length || additionalRequestConfigs.length !== data.length) {
                    console.warn('Invalid request parameters');
                    return false;
                }
                return true;
            };
            HttpService.prototype.processPartialResult = function (results, currentResult, currentResultIndex, expectedResultCount, resultCount, failureCount, aggreagedPromise) {
                results[currentResultIndex] = currentResult;
                if (resultCount === expectedResultCount) {
                    if (failureCount === 0) {
                        aggreagedPromise.resolve(results);
                    }
                    else {
                        aggreagedPromise.reject(results);
                    }
                }
            };
            HttpService.shouldRetry = function (status) {
                return status !== 401 /* Unauthorized */ && status !== 403 /* Forbidden */;
            };
            HttpService.isUserAccountDisabled = function (status, headers) {
                return (status === 401 /* Unauthorized */ || status === 403 /* Forbidden */) && headers(powerbi.common.PowerBIErrorHeader) === HttpService.UserAccountDisabledErrorHeader;
            };
            HttpService.isTokenExpired = function (status, headers) {
                return status === 401 /* Unauthorized */ && headers(powerbi.common.PowerBIErrorHeader) === HttpService.TokenExpiredErrorHeader;
            };
            HttpService.isUnlicensedUser = function (status, headers) {
                return (status === 401 /* Unauthorized */ || status === 403 /* Forbidden */) && (headers(powerbi.common.PowerBIErrorHeader) === HttpService.UserNotLicensedErrorHeader || headers(powerbi.common.PowerBIErrorHeader) === HttpService.TenantNotAllowedErrorHeader);
            };
            HttpService.isAbsoluteUrl = function (requestUrl) {
                return HttpService.AbsoluteUrlRegex.test(requestUrl);
            };
            HttpService.prototype.qualifyUrl = function (requestUrl) {
                requestUrl = this.urlInterceptor.interceptUrl(requestUrl); //decide if to add a version to the uri
                if (!this.clusterUriRetriever.backendUri || HttpService.isAbsoluteUrl(requestUrl)) {
                    return requestUrl;
                }
                return Utility.urlCombine(this.clusterUriRetriever.backendUri, requestUrl);
            };
            HttpService.AbsoluteUrlRegex = /^(https?:)?\/\//;
            HttpService.TokenExpiredErrorHeader = 'TokenExpired';
            HttpService.UserAccountDisabledErrorHeader = 'UserAccountDisabled';
            HttpService.UserNotLicensedErrorHeader = 'UserNotLicensed';
            HttpService.TenantNotAllowedErrorHeader = 'TenantNotAllowed';
            HttpService.DefaultRetryCount = 2;
            return HttpService;
        })();
        common.HttpService = HttpService;
        common.httpService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
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
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
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
                    if (!angular.isUndefined(localizationValue) && localizationValue !== null) {
                        return localizationValue;
                    }
                }
                var defaultValue = powerbi.localization.defaultLocalizedStrings[id];
                if (angular.isUndefined(defaultValue) || defaultValue === null) {
                    if (!isOptional && this.telemetryService) {
                        this.telemetryService.logEvent(powerbi.telemetry.LocalizationFailedToLoadStrings, this.currentLanguageLocale);
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
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/** IMPORTANT: This file will be deprecated in favor of the implementation in notificationService.ts */
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        (function (NotificationType) {
            NotificationType[NotificationType["Default"] = 0] = "Default";
            NotificationType[NotificationType["Alert"] = 1] = "Alert";
            NotificationType[NotificationType["Error"] = 2] = "Error";
            NotificationType[NotificationType["Loading"] = 3] = "Loading";
            NotificationType[NotificationType["Success"] = 4] = "Success";
            NotificationType[NotificationType["Warning"] = 5] = "Warning";
        })(common.NotificationType || (common.NotificationType = {}));
        var NotificationType = common.NotificationType;
        (function (NotificationDuration) {
            NotificationDuration[NotificationDuration["Short"] = 2000] = "Short";
            NotificationDuration[NotificationDuration["Medium"] = 4000] = "Medium";
            NotificationDuration[NotificationDuration["Long"] = 8000] = "Long";
        })(common.NotificationDuration || (common.NotificationDuration = {}));
        var NotificationDuration = common.NotificationDuration;
        var NotificationService = (function () {
            function NotificationService() {
                this._control = new InJs.Notifications.NotificationControl();
            }
            NotificationService.prototype.notify = function (title, message, notificationType, isDismissable, timeoutMs, onClose, links) {
                if (notificationType === void 0) { notificationType = 0 /* Default */; }
                if (isDismissable === void 0) { isDismissable = true; }
                if (timeoutMs === void 0) { timeoutMs = 5000; }
                var iconClass;
                var inNotificationType = 0 /* Default */;
                switch (notificationType) {
                    case 1 /* Alert */:
                        iconClass = 'alert';
                        inNotificationType = 3 /* OfficeFabric */;
                        break;
                    case 2 /* Error */:
                        iconClass = 'xCircle';
                        inNotificationType = 3 /* OfficeFabric */;
                        break;
                    case 3 /* Loading */:
                        iconClass = 'spinny';
                        inNotificationType = 3 /* OfficeFabric */;
                        break;
                }
                var id = InJs.Utility.generateGuid();
                if (links) {
                    var messageElement = InJs.DomFactory.div().append(message);
                    var linkCount = links.length;
                    for (var i = 0; i < linkCount; i++) {
                        var link = links[i];
                        var actionContent = jsCommon.StringExtensions.format(NotificationService.linkActionTemplate, link.displayText, link.linkId.toString());
                        var linkContent;
                        if (link.description) {
                            var linkDescription = jsCommon.StringExtensions.format(NotificationService.linkDescriptionTemplate, link.description);
                            linkContent = jsCommon.StringExtensions.format(NotificationService.linkTemplateWithDescription, linkDescription, actionContent);
                        }
                        else {
                            linkContent = jsCommon.StringExtensions.format(NotificationService.linkTemplateWithoutDescription, actionContent);
                        }
                        var linkElement = $(linkContent);
                        linkElement.find('.linkAction').on(jsCommon.DOMConstants.mouseClickEventName, function (event) {
                            link.action();
                        });
                        messageElement.append(linkElement);
                    }
                    this._control.showNotification(id, title, messageElement, onClose, isDismissable, timeoutMs, inNotificationType, iconClass);
                    return id;
                }
                this._control.showNotification(id, title, message, onClose, isDismissable, timeoutMs, inNotificationType, iconClass);
                return id;
            };
            NotificationService.prototype.hide = function (notificationId) {
                if (notificationId && typeof notificationId === 'string') {
                    this._control.hideNotification(notificationId);
                }
                else {
                    this._control.hide();
                }
            };
            NotificationService.linkTemplateWithDescription = "<div class='linkMessage'>{0} : {1}</div>";
            NotificationService.linkTemplateWithoutDescription = "<div class='linkMessage'>{0}</div>";
            NotificationService.linkDescriptionTemplate = "<span class='linkDescription' title='{0}'>{0}</span>";
            NotificationService.linkActionTemplate = "<span class='linkAction' title='{0}' data-id='{1}'>{0}</span>";
            return NotificationService;
        })();
        common.notificationService = new NotificationService();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createNotificationBarService() {
            return new NotificationBarService();
        }
        common.createNotificationBarService = createNotificationBarService;
        var NotificationBarService = (function () {
            function NotificationBarService() {
                this.notifications = [];
            }
            NotificationBarService.prototype.notify = function (message, notificationType, isDismissable, onClose, actions, secondaryLink) {
                if (notificationType === void 0) { notificationType = 0 /* Default */; }
                if (isDismissable === void 0) { isDismissable = true; }
                var notification = {
                    id: InJs.Utility.generateGuid(),
                    message: message,
                    type: notificationType,
                    isDismissable: isDismissable,
                    onClose: onClose,
                    actions: actions,
                    secondaryLink: secondaryLink
                };
                this.notifications.push(notification);
                return notification.id;
            };
            NotificationBarService.prototype.hide = function (notificationId) {
                if (notificationId && typeof notificationId === 'string') {
                    var notificationIndex = _.findIndex(this.notifications, function (item) { return item.id === notificationId; });
                    this.notifications.splice(notificationIndex, 1);
                }
            };
            return NotificationBarService;
        })();
        common.NotificationBarService = NotificationBarService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        /** factory method to create the pop up window service. */
        function createPopupWindowService($window) {
            return new PopupWindowService($window);
        }
        common.createPopupWindowService = createPopupWindowService;
        var PopupWindowService = (function () {
            function PopupWindowService($window) {
                this.windowService = $window;
            }
            PopupWindowService.prototype.open = function (url, width, height) {
                if (width === void 0) { width = 600; }
                if (height === void 0) { height = 480; }
                var leftOffset = (this.windowService.outerWidth - width) / 2;
                leftOffset += this.windowService.screenX;
                var topOffset = (this.windowService.outerHeight - height) / 2;
                topOffset += this.windowService.screenY;
                return this.windowService.open('/popupserverredirect?url=' + encodeURIComponent(url), '_blank', 'top=' + topOffset + ', left=' + leftOffset + ', screenX=' + leftOffset + ', screenY=' + topOffset + ', width=' + width + ', height=' + height + ', resizable=yes');
            };
            return PopupWindowService;
        })();
        common.popupWindowService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createPromiseFactory($q) {
            return new AngularPromiseFactory($q);
        }
        common.createPromiseFactory = createPromiseFactory;
        /** Angular $q based implementation of IPromiseFactory. */
        var AngularPromiseFactory = (function () {
            function AngularPromiseFactory(q) {
                debug.assertValue(q, 'q');
                this.q = q;
            }
            AngularPromiseFactory.prototype.defer = function () {
                return this.q.defer();
            };
            AngularPromiseFactory.prototype.reject = function (reason) {
                return this.q.reject(reason);
            };
            AngularPromiseFactory.prototype.resolve = function (value) {
                var deferred = this.defer();
                deferred.resolve(value);
                return deferred.promise;
            };
            return AngularPromiseFactory;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// TODO: Consider merging this with ChannelSubscriptionManager.
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createScopeEventSubscriptionManager(scope) {
            return new ScopeEventSubscriptionManager(scope);
        }
        common.createScopeEventSubscriptionManager = createScopeEventSubscriptionManager;
        var ScopeEventSubscriptionManager = (function () {
            function ScopeEventSubscriptionManager(scope) {
                this.scope = scope;
                this.unsubscribeList = [];
            }
            ScopeEventSubscriptionManager.prototype.subscribe = function (name, listener) {
                var unsubscribeFunction = this.scope.$on(name, listener);
                if (unsubscribeFunction)
                    this.unsubscribeList.push(unsubscribeFunction);
                return this;
            };
            ScopeEventSubscriptionManager.prototype.unsubscribeAll = function () {
                for (var i = this.unsubscribeList.length - 1; i >= 0; --i)
                    this.unsubscribeList[i]();
                this.unsubscribeList = [];
            };
            return ScopeEventSubscriptionManager;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var Errors = jsCommon.Errors;
        var Utility = jsCommon.Utility;
        function createScopedProvider(injector) {
            return new ScopedProvider(injector);
        }
        common.createScopedProvider = createScopedProvider;
        var ScopedProvider = (function () {
            function ScopedProvider(injector) {
                debug.assertValue(injector, 'injector');
                this.injector = injector;
                this.factories = {};
            }
            ScopedProvider.prototype.register = function (name, scopedAnnotatedFunction) {
                debug.assertValue(name, 'name');
                debug.assertValue(scopedAnnotatedFunction, 'scopedAnnotatedFunction');
                this.factories[name] = scopedAnnotatedFunction;
                return this;
            };
            ScopedProvider.prototype.attachTo = function (scope) {
                // NOTE: At the time of this writing, there is no scenario for a scoped instance to override a named value at an
                // ancestor scope.  So, we validate that this is not the case.  If we relax this in the future, we can remove this check.
                if (this.find(scope))
                    Utility.throwException(Errors.invalidOperation('Scoped service create hides instance from ancestor scope.'));
                return scope[ScopedProvider.PropertyName] = new ScopedProviderInstance(this.injector, this.factories);
            };
            ScopedProvider.prototype.find = function (scope) {
                debug.assertValue(scope, 'scope');
                var scopeInstancesPropName = ScopedProvider.PropertyName;
                var targetScope = scope;
                do {
                    var instances = targetScope[scopeInstancesPropName];
                    if (instances)
                        return instances;
                } while (targetScope = targetScope.$parent);
            };
            ScopedProvider.PropertyName = 'scopedInstances';
            return ScopedProvider;
        })();
        var ScopedProviderInstance = (function () {
            function ScopedProviderInstance(injector, factories) {
                debug.assertValue(injector, 'injector');
                debug.assertValue(factories, 'factories');
                this.injector = injector;
                this.factories = factories;
                this.instances = {};
            }
            ScopedProviderInstance.prototype.get = function (name, scope) {
                debug.assertValue(name, 'name');
                debug.assertValue(scope, 'scope');
                if (name === '$scope')
                    return scope;
                var instance = this.instances[name];
                if (instance !== undefined)
                    return instance;
                var factory = this.factories[name];
                debug.assert(factory !== undefined, 'Could not find statefulService: ' + name);
                var args = [];
                // Get service dependencies from the injector
                var serviceDependencies = factory.services;
                if (serviceDependencies) {
                    var injector = this.injector;
                    for (var i = 0, len = serviceDependencies.length; i < len; i++)
                        args.push(injector.get(serviceDependencies[i]));
                }
                // Get scoped dependencies
                var scopedDependencies = factory.scopedServices;
                if (scopedDependencies) {
                    for (var i = 0, len = scopedDependencies.length; i < len; i++) {
                        var dependencyName = scopedDependencies[i], dependencyValue = this.get(dependencyName, scope);
                        args.push(dependencyValue);
                    }
                }
                // Register this instance on the scope
                this.instances[name] = instance = factory.fn.apply(factory, args);
                return instance;
            };
            return ScopedProviderInstance;
        })();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var Services = (function () {
            function Services($rootScope, $http, $timeout, $interval, $sce, $compile, $document, $location) {
                this.rootScope = $rootScope;
                this.http = $http;
                this.timeout = $timeout;
                this.interval = $interval;
                this.sce = $sce;
                this.compile = $compile;
                this.document = $document;
                this.location = $location;
            }
            /** Creates factory method for a Controller, where services are optionally extended by additionalServices. */
            Services.createController = function (Controller) {
                var annotatedFunction = ['$scope', '$rootScope', '$attrs', '$http', '$timeout', '$interval', '$sce', '$compile', '$document', '$location', 'scopedProvider'];
                var baseArgCount = annotatedFunction.length;
                var options;
                if (Controller.createOptions)
                    options = Controller.createOptions();
                if (options && options.additionalServices)
                    annotatedFunction.push.apply(annotatedFunction, options.additionalServices);
                annotatedFunction.push(function ($scope, $rootScope, $attrs, $http, $timeout, $interval, $sce, $compile, $document, $location, scopedProvider) {
                    var services = new Services($rootScope, $http, $timeout, $interval, $sce, $compile, $document, $location);
                    if (options) {
                        var additionalServices = options.additionalServices;
                        if (additionalServices) {
                            // Extend the services object with the additional dependencies.
                            debug.assert(baseArgCount + additionalServices.length === arguments.length, 'Wrong number of arguments.');
                            for (var i = baseArgCount, len = annotatedFunction.length - 1; i < len; i++)
                                services[annotatedFunction[i]] = arguments[i];
                        }
                        if (options.scopedServiceRoot)
                            scopedProvider.attachTo($scope);
                        var scopedDependencies = options.scopedDependencies;
                        if (scopedDependencies) {
                            var scopedProviderInstance = scopedProvider.find($scope);
                            for (var i = 0, len = scopedDependencies.length; i < len; i++) {
                                var scopedDependencyName = scopedDependencies[i];
                                services[scopedDependencyName] = scopedProviderInstance.get(scopedDependencyName, $scope);
                            }
                        }
                    }
                    var controller = new Controller($scope, services);
                    if (controller.onDestroy)
                        $scope.$on('$destroy', function () { return controller.onDestroy(); });
                    return controller;
                });
                return annotatedFunction;
            };
            return Services;
        })();
        common.Services = Services;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var SessionStorageService = (function () {
            function SessionStorageService() {
            }
            SessionStorageService.prototype.getData = function (key) {
                if (sessionStorage) {
                    try {
                        return JSON.parse(sessionStorage[key]);
                    }
                    catch (e) {
                        return null;
                    }
                }
                return null;
            };
            SessionStorageService.prototype.setData = function (key, data) {
                if (sessionStorage) {
                    try {
                        sessionStorage[key] = JSON.stringify(data);
                    }
                    catch (e) {
                    }
                }
            };
            return SessionStorageService;
        })();
        common.sessionStorageService = new SessionStorageService();
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        function createThemeService() {
            return new ThemeService();
        }
        common.createThemeService = createThemeService;
        var ThemeService = (function () {
            function ThemeService() {
            }
            ThemeService.prototype.getColors = function (themeName) {
                if (!themeName)
                    return;
                var theme = jsCommon.ArrayExtensions.findItemWithName(themeData, themeName);
                if (!theme)
                    return;
                var colors = [];
                for (var key in theme) {
                    if (key.indexOf('accent') === 0) {
                        colors.push({
                            value: theme[key]
                        });
                    }
                }
                return colors;
            };
            return ThemeService;
        })();
        var themeData = [
            {
                "name": "Adjacency",
                "dk1": "#2F2B20",
                "dk2": "#675E47",
                "lt1": "#FFFFFF",
                "lt2": "#DFDCB7",
                "hlink": "#D25814",
                "folHlink": "#849A0A",
                "majorFont": "Cambria",
                "minorFont": "Calibri",
                "accent1": "#A9A57C",
                "accent2": "#9CBEBD",
                "accent3": "#D2CB6C",
                "accent4": "#95A39D",
                "accent5": "#C89F5D",
                "accent6": "#B1A089",
                "accent7": "#97A97C",
                "accent8": "#9CAEBE",
                "accent9": "#A8D26C",
                "accent10": "#95A2A3",
                "accent11": "#BCC85D",
                "accent12": "#AEB189"
            },
            {
                "name": "Angles",
                "dk1": "#000000",
                "dk2": "#434342",
                "lt1": "#FFFFFF",
                "lt2": "#CDD7D9",
                "hlink": "#5F5F5F",
                "folHlink": "#969696",
                "majorFont": "Franklin Gothic Medium",
                "minorFont": "Franklin Gothic Book",
                "accent1": "#797B7E",
                "accent2": "#F96A1B",
                "accent3": "#08A1D9",
                "accent4": "#7C984A",
                "accent5": "#C2AD8D",
                "accent6": "#506E94",
                "accent7": "#79797E",
                "accent8": "#F9D71B",
                "accent9": "#083ED9",
                "accent10": "#57984A",
                "accent11": "#BDC28D",
                "accent12": "#535094"
            },
            {
                "name": "Apex",
                "dk1": "#000000",
                "dk2": "#69676D",
                "lt1": "#FFFFFF",
                "lt2": "#C9C2D1",
                "hlink": "#410082",
                "folHlink": "#932968",
                "majorFont": "Lucida Sans",
                "minorFont": "Book Antiqua",
                "accent1": "#CEB966",
                "accent2": "#9CB084",
                "accent3": "#6BB1C9",
                "accent4": "#6585CF",
                "accent5": "#7E6BC9",
                "accent6": "#A379BB",
                "accent7": "#B2CE66",
                "accent8": "#87B084",
                "accent9": "#6B83C9",
                "accent10": "#7965CF",
                "accent11": "#AB6BC9",
                "accent12": "#BB79B2"
            },
            {
                "name": "Apothecary",
                "dk1": "#000000",
                "dk2": "#564B3C",
                "lt1": "#FFFFFF",
                "lt2": "#ECEDD1",
                "hlink": "#CCCC00",
                "folHlink": "#B2B2B2",
                "majorFont": "Book Antiqua",
                "minorFont": "Century Gothic",
                "accent1": "#93A299",
                "accent2": "#CF543F",
                "accent3": "#B5AE53",
                "accent4": "#848058",
                "accent5": "#E8B54D",
                "accent6": "#786C71",
                "accent7": "#93A2A0",
                "accent8": "#CF9A3F",
                "accent9": "#8CB553",
                "accent10": "#728458",
                "accent11": "#D0E84D",
                "accent12": "#786D6C"
            },
            {
                "name": "Aspect",
                "dk1": "#000000",
                "dk2": "#323232",
                "lt1": "#FFFFFF",
                "lt2": "#E3DED1",
                "hlink": "#6B9F25",
                "folHlink": "#B26B02",
                "majorFont": "Verdana",
                "minorFont": "Verdana",
                "accent1": "#F07F09",
                "accent2": "#9F2936",
                "accent3": "#1B587C",
                "accent4": "#4E8542",
                "accent5": "#604878",
                "accent6": "#C19859",
                "accent7": "#F0ED09",
                "accent8": "#9F5529",
                "accent9": "#1B287C",
                "accent10": "#428556",
                "accent11": "#774878",
                "accent12": "#B8C159"
            },
            {
                "name": "Austin",
                "dk1": "#000000",
                "dk2": "#3E3D2D",
                "lt1": "#FFFFFF",
                "lt2": "#CAF278",
                "hlink": "#E68200",
                "folHlink": "#FFA94A",
                "majorFont": "Century Gothic",
                "minorFont": "Century Gothic",
                "accent1": "#94C600",
                "accent2": "#71685A",
                "accent3": "#FF6700",
                "accent4": "#909465",
                "accent5": "#956B43",
                "accent6": "#FEA022",
                "accent7": "#33C600",
                "accent8": "#6F715A",
                "accent9": "#FFE400",
                "accent10": "#799465",
                "accent11": "#959243",
                "accent12": "#F1FE22"
            },
            {
                "name": "BlackTie",
                "dk1": "#000000",
                "dk2": "#46464A",
                "lt1": "#FFFFFF",
                "lt2": "#E3DCCF",
                "hlink": "#67AABF",
                "folHlink": "#B1B5AB",
                "majorFont": "Garamond",
                "minorFont": "Garamond",
                "accent1": "#6F6F74",
                "accent2": "#A7B789",
                "accent3": "#BEAE98",
                "accent4": "#92A9B9",
                "accent5": "#9C8265",
                "accent6": "#8D6974",
                "accent7": "#716F74",
                "accent8": "#90B789",
                "accent9": "#BBBE98",
                "accent10": "#9297B9",
                "accent11": "#9B9C65",
                "accent12": "#8D6F69"
            },
            {
                "name": "Civic",
                "dk1": "#000000",
                "dk2": "#646B86",
                "lt1": "#FFFFFF",
                "lt2": "#C5D1D7",
                "hlink": "#00A3D6",
                "folHlink": "#694F07",
                "majorFont": "Georgia",
                "minorFont": "Georgia",
                "accent1": "#D16349",
                "accent2": "#CCB400",
                "accent3": "#8CADAE",
                "accent4": "#8C7B70",
                "accent5": "#8FB08C",
                "accent6": "#D19049",
                "accent7": "#D1A649",
                "accent8": "#81CC00",
                "accent9": "#8C9DAE",
                "accent10": "#8C8870",
                "accent11": "#8CB09A",
                "accent12": "#CFD149"
            },
            {
                "name": "Clarity",
                "dk1": "#292934",
                "dk2": "#D2533C",
                "lt1": "#FFFFFF",
                "lt2": "#F3F2DC",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Arial",
                "minorFont": "Arial",
                "accent1": "#93A299",
                "accent2": "#AD8F67",
                "accent3": "#726056",
                "accent4": "#4C5A6A",
                "accent5": "#808DA0",
                "accent6": "#79463D",
                "accent7": "#93A2A0",
                "accent8": "#A8AD67",
                "accent9": "#726D56",
                "accent10": "#4C4C6A",
                "accent11": "#8280A0",
                "accent12": "#79633D"
            },
            {
                "name": "Composite",
                "dk1": "#000000",
                "dk2": "#5B6973",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#26CBEC",
                "folHlink": "#598C8C",
                "majorFont": "Calibri",
                "minorFont": "Calibri",
                "accent1": "#98C723",
                "accent2": "#59B0B9",
                "accent3": "#DEAE00",
                "accent4": "#B77BB4",
                "accent5": "#E0773C",
                "accent6": "#A98D63",
                "accent7": "#49C723",
                "accent8": "#5981B9",
                "accent9": "#A1DE00",
                "accent10": "#B77B97",
                "accent11": "#E0C73C",
                "accent12": "#A3A963"
            },
            {
                "name": "Concourse",
                "dk1": "#000000",
                "dk2": "#464646",
                "lt1": "#FFFFFF",
                "lt2": "#DEF5FA",
                "hlink": "#FF8119",
                "folHlink": "#44B9E8",
                "majorFont": "Lucida Sans Unicode",
                "minorFont": "Lucida Sans Unicode",
                "accent1": "#2DA2BF",
                "accent2": "#DA1F28",
                "accent3": "#EB641B",
                "accent4": "#39639D",
                "accent5": "#474B78",
                "accent6": "#7D3C4A",
                "accent7": "#2D5DBF",
                "accent8": "#DA6E1F",
                "accent9": "#EBC61B",
                "accent10": "#40399D",
                "accent11": "#5A4778",
                "accent12": "#7D4D3C"
            },
            {
                "name": "Couture",
                "dk1": "#000000",
                "dk2": "#37302A",
                "lt1": "#FFFFFF",
                "lt2": "#D0CCB9",
                "hlink": "#B6A272",
                "folHlink": "#8A784F",
                "majorFont": "Garamond",
                "minorFont": "Garamond",
                "accent1": "#9E8E5C",
                "accent2": "#A09781",
                "accent3": "#85776D",
                "accent4": "#AEAFA9",
                "accent5": "#8D878B",
                "accent6": "#6B6149",
                "accent7": "#8D9E5C",
                "accent8": "#99A081",
                "accent9": "#85826D",
                "accent10": "#ABAFA9",
                "accent11": "#8D8788",
                "accent12": "#656B49"
            },
            {
                "name": "Elemental",
                "dk1": "#000000",
                "dk2": "#242852",
                "lt1": "#FFFFFF",
                "lt2": "#ACCBF9",
                "hlink": "#9454C3",
                "folHlink": "#3EBBF0",
                "majorFont": "Palatino Linotype",
                "minorFont": "Palatino Linotype",
                "accent1": "#629DD1",
                "accent2": "#297FD5",
                "accent3": "#7F8FA9",
                "accent4": "#4A66AC",
                "accent5": "#5AA2AE",
                "accent6": "#9D90A0",
                "accent7": "#6267D1",
                "accent8": "#292DD5",
                "accent9": "#837FA9",
                "accent10": "#5C4AAC",
                "accent11": "#5A79AE",
                "accent12": "#A0909B"
            },
            {
                "name": "Equity",
                "dk1": "#000000",
                "dk2": "#696464",
                "lt1": "#FFFFFF",
                "lt2": "#E9E5DC",
                "hlink": "#CC9900",
                "folHlink": "#96A9A9",
                "majorFont": "Franklin Gothic Book",
                "minorFont": "Perpetua",
                "accent1": "#D34817",
                "accent2": "#9B2D1F",
                "accent3": "#A28E6A",
                "accent4": "#956251",
                "accent5": "#918485",
                "accent6": "#855D5D",
                "accent7": "#D3A417",
                "accent8": "#9B681F",
                "accent9": "#9AA26A",
                "accent10": "#958251",
                "accent11": "#918984",
                "accent12": "#85705D"
            },
            {
                "name": "Essential",
                "dk1": "#000000",
                "dk2": "#D1282E",
                "lt1": "#FFFFFF",
                "lt2": "#C8C8B1",
                "hlink": "#CC9900",
                "folHlink": "#969696",
                "majorFont": "Arial Black",
                "minorFont": "Arial",
                "accent1": "#7A7A7A",
                "accent2": "#F5C201",
                "accent3": "#526DB0",
                "accent4": "#989AAC",
                "accent5": "#DC5924",
                "accent6": "#B4B392",
                "accent7": "#7A7A7A",
                "accent8": "#B3F501",
                "accent9": "#6352B0",
                "accent10": "#9F98AC",
                "accent11": "#DCB224",
                "accent12": "#A4B492"
            },
            {
                "name": "Executive",
                "dk1": "#000000",
                "dk2": "#2F5897",
                "lt1": "#FFFFFF",
                "lt2": "#E4E9EF",
                "hlink": "#3399FF",
                "folHlink": "#B2B2B2",
                "majorFont": "Century Gothic",
                "minorFont": "Palatino Linotype",
                "accent1": "#6076B4",
                "accent2": "#9C5252",
                "accent3": "#E68422",
                "accent4": "#846648",
                "accent5": "#63891F",
                "accent6": "#758085",
                "accent7": "#7160B4",
                "accent8": "#9C7652",
                "accent9": "#E6E322",
                "accent10": "#848348",
                "accent11": "#30891F",
                "accent12": "#757885"
            },
            {
                "name": "Flow",
                "dk1": "#000000",
                "dk2": "#04617B",
                "lt1": "#FFFFFF",
                "lt2": "#DBF5F9",
                "hlink": "#F49100",
                "folHlink": "#85DFD0",
                "majorFont": "Calibri",
                "minorFont": "Constantia",
                "accent1": "#0F6FC6",
                "accent2": "#009DD9",
                "accent3": "#0BD0D9",
                "accent4": "#10CF9B",
                "accent5": "#7CCA62",
                "accent6": "#A5C249",
                "accent7": "#0F18C6",
                "accent8": "#0033D9",
                "accent9": "#0B6BD9",
                "accent10": "#10A8CF",
                "accent11": "#62CA7A",
                "accent12": "#6BC249"
            },
            {
                "name": "Foundry",
                "dk1": "#000000",
                "dk2": "#676A55",
                "lt1": "#FFFFFF",
                "lt2": "#EAEBDE",
                "hlink": "#DB5353",
                "folHlink": "#903638",
                "majorFont": "Rockwell",
                "minorFont": "Rockwell",
                "accent1": "#72A376",
                "accent2": "#B0CCB0",
                "accent3": "#A8CDD7",
                "accent4": "#C0BEAF",
                "accent5": "#CEC597",
                "accent6": "#E8B7B7",
                "accent7": "#72A38D",
                "accent8": "#B0CCBD",
                "accent9": "#A8B6D7",
                "accent10": "#B9C0AF",
                "accent11": "#BCCE97",
                "accent12": "#E8CFB7"
            },
            {
                "name": "Grid",
                "dk1": "#000000",
                "dk2": "#534949",
                "lt1": "#FFFFFF",
                "lt2": "#CCD1B9",
                "hlink": "#CC9900",
                "folHlink": "#C0C0C0",
                "majorFont": "Franklin Gothic Medium",
                "minorFont": "Franklin Gothic Medium",
                "accent1": "#C66951",
                "accent2": "#BF974D",
                "accent3": "#928B70",
                "accent4": "#87706B",
                "accent5": "#94734E",
                "accent6": "#6F777D",
                "accent7": "#C6A151",
                "accent8": "#B0BF4D",
                "accent9": "#889270",
                "accent10": "#877D6B",
                "accent11": "#93944E",
                "accent12": "#6F707D"
            },
            {
                "name": "Hardcover",
                "dk1": "#000000",
                "dk2": "#895D1D",
                "lt1": "#FFFFFF",
                "lt2": "#ECE9C6",
                "hlink": "#CC9900",
                "folHlink": "#B2B2B2",
                "majorFont": "Book Antiqua",
                "minorFont": "Book Antiqua",
                "accent1": "#873624",
                "accent2": "#D6862D",
                "accent3": "#D0BE40",
                "accent4": "#877F6C",
                "accent5": "#972109",
                "accent6": "#AEB795",
                "accent7": "#876524",
                "accent8": "#D4D62D",
                "accent9": "#9BD040",
                "accent10": "#82876C",
                "accent11": "#976609",
                "accent12": "#9EB795"
            },
            {
                "name": "Horizon",
                "dk1": "#000000",
                "dk2": "#1F2123",
                "lt1": "#FFFFFF",
                "lt2": "#DC9E1F",
                "hlink": "#646464",
                "folHlink": "#969696",
                "majorFont": "Arial Narrow",
                "minorFont": "Arial Narrow",
                "accent1": "#7E97AD",
                "accent2": "#CC8E60",
                "accent3": "#7A6A60",
                "accent4": "#B4936D",
                "accent5": "#67787B",
                "accent6": "#9D936F",
                "accent7": "#7E80AD",
                "accent8": "#CCC360",
                "accent9": "#7A7660",
                "accent10": "#B3B46D",
                "accent11": "#676E7B",
                "accent12": "#909D6F"
            },
            {
                "name": "Median",
                "dk1": "#000000",
                "dk2": "#775F55",
                "lt1": "#FFFFFF",
                "lt2": "#EBDDC3",
                "hlink": "#F7B615",
                "folHlink": "#704404",
                "majorFont": "Tw Cen MT",
                "minorFont": "Tw Cen MT",
                "accent1": "#94B6D2",
                "accent2": "#DD8047",
                "accent3": "#A5AB81",
                "accent4": "#D8B25C",
                "accent5": "#7BA79D",
                "accent6": "#968C8C",
                "accent7": "#9498D2",
                "accent8": "#DDC947",
                "accent9": "#91AB81",
                "accent10": "#C2D85C",
                "accent11": "#7B9CA7",
                "accent12": "#96918C"
            },
            {
                "name": "Metal",
                "dk1": "#000000",
                "dk2": "#4E5B6F",
                "lt1": "#FFFFFF",
                "lt2": "#D6ECFF",
                "hlink": "#EB8803",
                "folHlink": "#5F7791",
                "majorFont": "Consolas",
                "minorFont": "Corbel",
                "accent1": "#7FD13B",
                "accent2": "#EA157A",
                "accent3": "#FEB80A",
                "accent4": "#00ADDC",
                "accent5": "#738AC8",
                "accent6": "#1AB39F",
                "accent7": "#3BD13E",
                "accent8": "#EA1515",
                "accent9": "#CDFE0A",
                "accent10": "#0043DC",
                "accent11": "#8573C8",
                "accent12": "#1A7FB3"
            },
            {
                "name": "Module",
                "dk1": "#000000",
                "dk2": "#5A6378",
                "lt1": "#FFFFFF",
                "lt2": "#D4D4D6",
                "hlink": "#168BBA",
                "folHlink": "#680000",
                "majorFont": "Corbel",
                "minorFont": "Corbel",
                "accent1": "#F0AD00",
                "accent2": "#60B5CC",
                "accent3": "#E66C7D",
                "accent4": "#6BB76D",
                "accent5": "#E88651",
                "accent6": "#C64847",
                "accent7": "#C0F000",
                "accent8": "#6081CC",
                "accent9": "#E6976C",
                "accent10": "#6BB792",
                "accent11": "#E8CD51",
                "accent12": "#C68547"
            },
            {
                "name": "NewsPrint",
                "dk1": "#000000",
                "dk2": "#303030",
                "lt1": "#FFFFFF",
                "lt2": "#DEDEE0",
                "hlink": "#D26900",
                "folHlink": "#D89243",
                "majorFont": "Impact",
                "minorFont": "Times New Roman",
                "accent1": "#AD0101",
                "accent2": "#726056",
                "accent3": "#AC956E",
                "accent4": "#808DA9",
                "accent5": "#424E5B",
                "accent6": "#730E00",
                "accent7": "#AD5601",
                "accent8": "#726D56",
                "accent9": "#A5AC6E",
                "accent10": "#8780A9",
                "accent11": "#42425B",
                "accent12": "#734600"
            },
            {
                "name": "Opulent",
                "dk1": "#000000",
                "dk2": "#B13F9A",
                "lt1": "#FFFFFF",
                "lt2": "#F4E7ED",
                "hlink": "#FFDE66",
                "folHlink": "#D490C5",
                "majorFont": "Trebuchet MS",
                "minorFont": "Trebuchet MS",
                "accent1": "#B83D68",
                "accent2": "#AC66BB",
                "accent3": "#DE6C36",
                "accent4": "#F9B639",
                "accent5": "#CF6DA4",
                "accent6": "#FA8D3D",
                "accent7": "#B84E3D",
                "accent8": "#BB66A0",
                "accent9": "#DEBC36",
                "accent10": "#E0F939",
                "accent11": "#CF6D74",
                "accent12": "#FAE63D"
            },
            {
                "name": "Oriel",
                "dk1": "#000000",
                "dk2": "#575F6D",
                "lt1": "#FFFFFF",
                "lt2": "#FFF39D",
                "hlink": "#D2611C",
                "folHlink": "#3B435B",
                "majorFont": "Century Schoolbook",
                "minorFont": "Century Schoolbook",
                "accent1": "#FE8637",
                "accent2": "#7598D9",
                "accent3": "#B32C16",
                "accent4": "#F5CD2D",
                "accent5": "#AEBAD5",
                "accent6": "#777C84",
                "accent7": "#FEE437",
                "accent8": "#8375D9",
                "accent9": "#B37616",
                "accent10": "#BAF52D",
                "accent11": "#B4AED5",
                "accent12": "#787784"
            },
            {
                "name": "Origin",
                "dk1": "#000000",
                "dk2": "#464653",
                "lt1": "#FFFFFF",
                "lt2": "#DDE9EC",
                "hlink": "#B292CA",
                "folHlink": "#6B5680",
                "majorFont": "Bookman Old Style",
                "minorFont": "Gill Sans MT",
                "accent1": "#727CA3",
                "accent2": "#9FB8CD",
                "accent3": "#D2DA7A",
                "accent4": "#FADA7A",
                "accent5": "#B88472",
                "accent6": "#8E736A",
                "accent7": "#8072A3",
                "accent8": "#9FA2CD",
                "accent9": "#A2DA7A",
                "accent10": "#DDFA7A",
                "accent11": "#B8A572",
                "accent12": "#8E846A"
            },
            {
                "name": "Paper",
                "dk1": "#000000",
                "dk2": "#444D26",
                "lt1": "#FFFFFF",
                "lt2": "#FEFAC9",
                "hlink": "#8E58B6",
                "folHlink": "#7F6F6F",
                "majorFont": "Constantia",
                "minorFont": "Constantia",
                "accent1": "#A5B592",
                "accent2": "#F3A447",
                "accent3": "#E7BC29",
                "accent4": "#D092A7",
                "accent5": "#9C85C0",
                "accent6": "#809EC2",
                "accent7": "#94B592",
                "accent8": "#F0F347",
                "accent9": "#B8E729",
                "accent10": "#D09A92",
                "accent11": "#B885C0",
                "accent12": "#8280C2"
            },
            {
                "name": "Perspective",
                "dk1": "#000000",
                "dk2": "#283138",
                "lt1": "#FFFFFF",
                "lt2": "#FF8600",
                "hlink": "#6187E3",
                "folHlink": "#7B8EB8",
                "majorFont": "Arial",
                "minorFont": "Arial",
                "accent1": "#838D9B",
                "accent2": "#D2610C",
                "accent3": "#80716A",
                "accent4": "#94147C",
                "accent5": "#5D5AD2",
                "accent6": "#6F6C7D",
                "accent7": "#84839B",
                "accent8": "#D2C10C",
                "accent9": "#807B6A",
                "accent10": "#94143E",
                "accent11": "#985AD2",
                "accent12": "#776C7D"
            },
            {
                "name": "Pushpin",
                "dk1": "#000000",
                "dk2": "#465E9C",
                "lt1": "#FFFFFF",
                "lt2": "#CCDDEA",
                "hlink": "#D83E2C",
                "folHlink": "#ED7D27",
                "majorFont": "Constantia",
                "minorFont": "Franklin Gothic Book",
                "accent1": "#FDA023",
                "accent2": "#AA2B1E",
                "accent3": "#71685C",
                "accent4": "#64A73B",
                "accent5": "#EB5605",
                "accent6": "#B9CA1A",
                "accent7": "#F0FD23",
                "accent8": "#AA6D1E",
                "accent9": "#6F715C",
                "accent10": "#3BA745",
                "accent11": "#EBC205",
                "accent12": "#64CA1A"
            },
            {
                "name": "Slipstream",
                "dk1": "#000000",
                "dk2": "#212745",
                "lt1": "#FFFFFF",
                "lt2": "#B4DCFA",
                "hlink": "#56C7AA",
                "folHlink": "#59A8D1",
                "majorFont": "Trebuchet MS",
                "minorFont": "Trebuchet MS",
                "accent1": "#4E67C8",
                "accent2": "#5ECCF3",
                "accent3": "#A7EA52",
                "accent4": "#5DCEAF",
                "accent5": "#FF8021",
                "accent6": "#F14124",
                "accent7": "#704EC8",
                "accent8": "#5E84F3",
                "accent9": "#5DEA52",
                "accent10": "#5DB7CE",
                "accent11": "#FFEC20",
                "accent12": "#F1A624"
            },
            {
                "name": "Solstice",
                "dk1": "#000000",
                "dk2": "#4F271C",
                "lt1": "#FFFFFF",
                "lt2": "#E7DEC9",
                "hlink": "#8DC765",
                "folHlink": "#AA8A14",
                "majorFont": "Gill Sans MT",
                "minorFont": "Gill Sans MT",
                "accent1": "#3891A7",
                "accent2": "#FEB80A",
                "accent3": "#C32D2E",
                "accent4": "#84AA33",
                "accent5": "#964305",
                "accent6": "#475A8D",
                "accent7": "#385CA7",
                "accent8": "#CDFE0A",
                "accent9": "#C3732D",
                "accent10": "#49AA33",
                "accent11": "#968A05",
                "accent12": "#56478D"
            },
            {
                "name": "Technic",
                "dk1": "#000000",
                "dk2": "#3B3B3B",
                "lt1": "#FFFFFF",
                "lt2": "#D4D2D0",
                "hlink": "#00C8C3",
                "folHlink": "#A116E0",
                "majorFont": "Franklin Gothic Book",
                "minorFont": "Arial",
                "accent1": "#6EA0B0",
                "accent2": "#CCAF0A",
                "accent3": "#8D89A4",
                "accent4": "#748560",
                "accent5": "#9E9273",
                "accent6": "#7E848D",
                "accent7": "#6E80B0",
                "accent8": "#89CC0A",
                "accent9": "#9A89A4",
                "accent10": "#628560",
                "accent11": "#959E73",
                "accent12": "#7F7E8D"
            },
            {
                "name": "Thatch",
                "dk1": "#000000",
                "dk2": "#1D3641",
                "lt1": "#FFFFFF",
                "lt2": "#DFE6D0",
                "hlink": "#66AACD",
                "folHlink": "#809DB3",
                "majorFont": "Tw Cen MT",
                "minorFont": "Tw Cen MT",
                "accent1": "#759AA5",
                "accent2": "#CFC60D",
                "accent3": "#99987F",
                "accent4": "#90AC97",
                "accent5": "#FFAD1C",
                "accent6": "#B9AB6F",
                "accent7": "#7582A5",
                "accent8": "#7ACF0D",
                "accent9": "#8D997F",
                "accent10": "#90ACA4",
                "accent11": "#E1FF1C",
                "accent12": "#A3B96F"
            },
            {
                "name": "Theme1",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#00B8F1",
                "accent2": "#DE3A15",
                "accent3": "#FF9A00",
                "accent4": "#3ACB35",
                "accent5": "#BBA8E8",
                "accent6": "#DD6952",
                "accent7": "#7FD5DB",
                "accent8": "#60AF89",
                "accent9": "#91A9D0",
                "accent10": "#C7F073",
                "accent11": "#5E69D8",
                "accent12": "#BD8E29"
            },
            {
                "name": "Theme2",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#BD1799",
                "accent2": "#FF9A00",
                "accent3": "#3ACB35",
                "accent4": "#BBA8E8",
                "accent5": "#DD6952",
                "accent6": "#7FD5DB",
                "accent7": "#60AF89",
                "accent8": "#91A9D0",
                "accent9": "#C7F073",
                "accent10": "#5E69D8",
                "accent11": "#BD8E29",
                "accent12": "#00B8F1"
            },
            {
                "name": "Theme3",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#CE4C2C",
                "accent2": "#FF9A00",
                "accent3": "#3ACB35",
                "accent4": "#BBA8E8",
                "accent5": "#DD6952",
                "accent6": "#7FD5DB",
                "accent7": "#60AF89",
                "accent8": "#91A9D0",
                "accent9": "#C7F073",
                "accent10": "#5E69D8",
                "accent11": "#BD8E29",
                "accent12": "#00B8F1"
            },
            {
                "name": "Theme4",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#F07800",
                "accent2": "#3ACB35",
                "accent3": "#BBA8E8",
                "accent4": "#DD6952",
                "accent5": "#7FD5DB",
                "accent6": "#60AF89",
                "accent7": "#91A9D0",
                "accent8": "#C7F073",
                "accent9": "#5E69D8",
                "accent10": "#BD8E29",
                "accent11": "#00B8F1",
                "accent12": "#DE3A15"
            },
            {
                "name": "Theme5",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#BEB113",
                "accent2": "#BBA8E8",
                "accent3": "#DD6952",
                "accent4": "#7FD5DB",
                "accent5": "#60AF89",
                "accent6": "#91A9D0",
                "accent7": "#C7F073",
                "accent8": "#5E69D8",
                "accent9": "#BD8E29",
                "accent10": "#00B8F1",
                "accent11": "#DE3A15",
                "accent12": "#FF9A00"
            },
            {
                "name": "Theme6",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#78A560",
                "accent2": "#BBA8E8",
                "accent3": "#DD6952",
                "accent4": "#7FD5DB",
                "accent5": "#60AF89",
                "accent6": "#91A9D0",
                "accent7": "#C7F073",
                "accent8": "#5E69D8",
                "accent9": "#BD8E29",
                "accent10": "#00B8F1",
                "accent11": "#DE3A15",
                "accent12": "#FF9A00"
            },
            {
                "name": "Theme7",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#419DB0",
                "accent2": "#DE3A15",
                "accent3": "#FF9A00",
                "accent4": "#3ACB35",
                "accent5": "#BBA8E8",
                "accent6": "#DD6952",
                "accent7": "#7FD5DB",
                "accent8": "#60AF89",
                "accent9": "#91A9D0",
                "accent10": "#C7F073",
                "accent11": "#5E69D8",
                "accent12": "#BD8E29"
            },
            {
                "name": "Theme8",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#8D35DE",
                "accent2": "#BD8E29",
                "accent3": "#00B8F1",
                "accent4": "#DE3A15",
                "accent5": "#FF9A00",
                "accent6": "#3ACB35",
                "accent7": "#BBA8E8",
                "accent8": "#DD6952",
                "accent9": "#7FD5DB",
                "accent10": "#60AF89",
                "accent11": "#91A9D0",
                "accent12": "#C7F073"
            },
            {
                "name": "ThemeNew1",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#E7ECED",
                "hlink": "#0000FF",
                "folHlink": "#800080",
                "majorFont": "Segoe UI Light",
                "minorFont": "Segoe UI",
                "accent1": "#01B8AA",
                "accent2": "#374649",
                "accent3": "#FD625E",
                "accent4": "#F2C80F",
                "accent5": "#5F6B6D",
                "accent6": "#8AD4EB",
                "accent7": "#FE9666",
                "accent8": "#A66999",
                "accent9": "#3599B8",
                "accent10": "#DFBFBF",
                "accent11": "#4AC5BB",
                "accent12": "#5F6B6D",
                "accent13": "#FB8281",
                "accent14": "#F4D25A",
                "accent15": "#7F898A",
                "accent16": "#A4DDEE",
                "accent17": "#FDAB89",
                "accent18": "#B687AC",
                "accent19": "#28738A",
                "accent20": "#A78F8F",
                "accent21": "#168980",
                "accent22": "#293537",
                "accent23": "#BB4A4A",
                "accent24": "#B59525",
                "accent25": "#475052",
                "accent26": "#6A9FB0",
                "accent27": "#BD7150",
                "accent28": "#7B4F71",
                "accent29": "#1B4D5C",
                "accent30": "#706060",
                "accent31": "#0F5C55",
                "accent32": "#1C2325",
                "accent33": "#7D3231",
                "accent34": "#796419",
                "accent35": "#303637",
                "accent36": "#476A75",
                "accent37": "#7E4B36",
                "accent38": "#52354C",
                "accent39": "#0D262E",
                "accent40": "#544848",
            },
            {
                "name": "Trek",
                "dk1": "#000000",
                "dk2": "#4E3B30",
                "lt1": "#FFFFFF",
                "lt2": "#FBEEC9",
                "hlink": "#AD1F1F",
                "folHlink": "#FFC42F",
                "majorFont": "Franklin Gothic Medium",
                "minorFont": "Franklin Gothic Book",
                "accent1": "#F0A22E",
                "accent2": "#A5644E",
                "accent3": "#B58B80",
                "accent4": "#C3986D",
                "accent5": "#A19574",
                "accent6": "#C17529",
                "accent7": "#E0F02E",
                "accent8": "#A58D4E",
                "accent9": "#B5A480",
                "accent10": "#C3C16D",
                "accent11": "#96A174",
                "accent12": "#C1BF29"
            },
            {
                "name": "Urban",
                "dk1": "#000000",
                "dk2": "#424456",
                "lt1": "#FFFFFF",
                "lt2": "#DEDEDE",
                "hlink": "#67AFBD",
                "folHlink": "#C2A874",
                "majorFont": "Trebuchet MS",
                "minorFont": "Georgia",
                "accent1": "#53548A",
                "accent2": "#438086",
                "accent3": "#A04DA3",
                "accent4": "#C4652D",
                "accent5": "#8B5D3D",
                "accent6": "#5C92B5",
                "accent7": "#6D538A",
                "accent8": "#435F86",
                "accent9": "#A34D7B",
                "accent10": "#C4AC2D",
                "accent11": "#8B823D",
                "accent12": "#5C66B5"
            },
            {
                "name": "Verve",
                "dk1": "#000000",
                "dk2": "#666666",
                "lt1": "#FFFFFF",
                "lt2": "#D2D2D2",
                "hlink": "#17BBFD",
                "folHlink": "#FF79C2",
                "majorFont": "Century Gothic",
                "minorFont": "Century Gothic",
                "accent1": "#FF388C",
                "accent2": "#E40059",
                "accent3": "#9C007F",
                "accent4": "#68007F",
                "accent5": "#005BD3",
                "accent6": "#00349E",
                "accent7": "#FF4638",
                "accent8": "#E41500",
                "accent9": "#9C0033",
                "accent10": "#7F0059",
                "accent11": "#0900D3",
                "accent12": "#1A009E"
            },
            {
                "name": "Waveform",
                "dk1": "#000000",
                "dk2": "#073E87",
                "lt1": "#FFFFFF",
                "lt2": "#C6E7FC",
                "hlink": "#0080FF",
                "folHlink": "#5EAEFF",
                "majorFont": "Candara",
                "minorFont": "Candara",
                "accent1": "#31B6FD",
                "accent2": "#4584D3",
                "accent3": "#5BD078",
                "accent4": "#A5D028",
                "accent5": "#F5C040",
                "accent6": "#05E0DB",
                "accent7": "#3153FD",
                "accent8": "#4C45D3",
                "accent9": "#5BD0B0",
                "accent10": "#54D028",
                "accent11": "#D0F540",
                "accent12": "#057BE0"
            }
        ];
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        /** factory method to create the pop up tooltip service. */
        function createTooltipService() {
            return new TooltipService();
        }
        common.createTooltipService = createTooltipService;
        var TooltipService = (function () {
            function TooltipService() {
                this.arrowPostionClassSet = this.getArrowPostionClassSet();
            }
            TooltipService.prototype.showTooltip = function (anchorElement, event, title, description, delay, arrowPosition) {
                var _this = this;
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                delay = delay || TooltipService.defaultDisplayDelay;
                arrowPosition = this.isValidArrowPosition(arrowPosition) ? arrowPosition : TooltipService.arrowPositions.BottomRight;
                if (!this.isTooltipVisible()) {
                    var mouseEvent = event.originalEvent;
                    // if mouse doesn't move and an existing promise exists, just return and wait for the tooltip to appear
                    if (this.showTooltipTimeoutId && (this.previousMouseX === mouseEvent.pageX || this.previousMouseY === mouseEvent.pageY)) {
                        this.previousMouseX = mouseEvent.pageX;
                        this.previousMouseY = mouseEvent.pageY;
                        return;
                    }
                    this.previousMouseX = mouseEvent.pageX;
                    this.previousMouseY = mouseEvent.pageY;
                    if (this.showTooltipTimeoutId) {
                        window.clearTimeout(this.showTooltipTimeoutId);
                    }
                    this.showTooltipTimeoutId = window.setTimeout(function () {
                        if (!_this.tooltipElement) {
                            _this.tooltipElement = $(TooltipService.htmlTemplate);
                            _this.tooltipTitleElement = _this.tooltipElement.find('.title');
                            _this.tooltipDescriptionElement = _this.tooltipElement.find('.description');
                        }
                        $('body').append(_this.tooltipElement);
                        _this.tooltipTitleElement.text(title);
                        _this.tooltipDescriptionElement.text(description);
                        _this.tooltipElement.addClass(arrowPosition);
                        _this.updateTooltipPosition(anchorElement, arrowPosition);
                        _this.tooltipElement.addClass(TooltipService.tooltipActiveClass);
                        _this.showTooltipTimeoutId = null;
                    }, delay);
                }
            };
            TooltipService.prototype.hideTooltip = function (event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                if (this.showTooltipTimeoutId) {
                    window.clearTimeout(this.showTooltipTimeoutId);
                    this.showTooltipTimeoutId = null;
                }
                if (this.tooltipElement) {
                    this.tooltipElement.removeClass(TooltipService.tooltipActiveClass);
                    this.tooltipElement.removeClass(this.arrowPostionClassSet);
                    this.tooltipTitleElement.empty();
                    this.tooltipDescriptionElement.empty();
                    this.tooltipElement.detach();
                }
            };
            TooltipService.prototype.isTooltipVisible = function () {
                return this.tooltipElement && this.tooltipElement.hasClass(TooltipService.tooltipActiveClass) && this.tooltipElement.visible();
            };
            TooltipService.prototype.updateTooltipPosition = function (anchorElement, arrowPosition) {
                var elementOffset = this.getElementOffset(anchorElement, arrowPosition);
                this.tooltipElement.css({
                    left: elementOffset.left,
                    top: elementOffset.top,
                });
            };
            TooltipService.prototype.isValidArrowPosition = function (position) {
                for (var validPostionKey in TooltipService.arrowPositions) {
                    if (TooltipService.arrowPositions[validPostionKey] === position) {
                        return true;
                    }
                }
                return false;
            };
            TooltipService.prototype.getArrowPostionClassSet = function () {
                var arrowPositionSet = '';
                for (var validPostionKey in TooltipService.arrowPositions) {
                    arrowPositionSet = arrowPositionSet + ' ' + TooltipService.arrowPositions[validPostionKey];
                }
                return arrowPositionSet;
            };
            //TODO: create a new service for offset calculation. We can reuse that service in contextMenu and tutorialPopupService
            TooltipService.prototype.getElementOffset = function (anchorElement, arrowPosition) {
                var elementWidth = this.tooltipElement.outerWidth();
                var elementHeight = this.tooltipElement.outerHeight();
                var anchorWidth = anchorElement.width();
                var anchorHeight = anchorElement.height();
                var anchorOffset = anchorElement.offset();
                var arrowOffset = TooltipService.arrowOffset;
                switch (arrowPosition) {
                    case TooltipService.arrowPositions.TopLeft:
                        return {
                            left: anchorOffset.left + anchorWidth / 2 - arrowOffset.x,
                            top: anchorOffset.top + anchorHeight + arrowOffset.y,
                        };
                    case TooltipService.arrowPositions.TopRight:
                        return {
                            left: anchorOffset.left + anchorWidth / 2 - elementWidth + arrowOffset.x,
                            top: anchorOffset.top + anchorHeight + arrowOffset.y,
                        };
                    case TooltipService.arrowPositions.BottomLeft:
                        return {
                            left: anchorOffset.left + anchorWidth / 2 - arrowOffset.x,
                            top: anchorOffset.top - elementHeight - arrowOffset.y,
                        };
                    case TooltipService.arrowPositions.BottomRight:
                        return {
                            left: anchorOffset.left + anchorWidth / 2 - elementWidth + arrowOffset.x,
                            top: anchorOffset.top - elementHeight - arrowOffset.y,
                        };
                }
            };
            TooltipService.defaultDisplayDelay = 1000;
            TooltipService.tooltipActiveClass = 'active';
            TooltipService.htmlTemplate = "<div class='tooltip'>" + "<div class='title'></div>" + "<div class='description'></div>" + "</div>";
            TooltipService.arrowPositions = {
                TopLeft: 'arrowTopLeft',
                TopRight: 'arrowTopRight',
                BottomLeft: 'arrowBottomLeft',
                BottomRight: 'arrowBottomRight',
            };
            TooltipService.arrowOffset = {
                x: 20,
                y: 7
            };
            return TooltipService;
        })();
        common.TooltipService = TooltipService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        /** factory method to create the localization service. */
        function createViralTenantMergeHelperService(localizationService) {
            return new ViralTenantMergeHelperService(localizationService);
        }
        common.createViralTenantMergeHelperService = createViralTenantMergeHelperService;
        var ViralTenantMergeHelperService = (function () {
            function ViralTenantMergeHelperService(localizationService) {
                this.backToPowerBI = 'backToPowerBIErrorLink';
                this.stayInArchivedContent = 'stayInArchivedContentErrorLink';
                this.localizationService = localizationService;
            }
            ViralTenantMergeHelperService.prototype.viewingDataFromMergedViralTenant = function () {
                return !jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(previousTenantId);
            };
            ViralTenantMergeHelperService.prototype.displayFeatureDisabledErrorMessage = function (errorMessageId) {
                var _this = this;
                var dismissCallback = function (callbackReason) {
                    // If the error dialog is dismissed by clicking a button "Back to Power BI", we need to open a link in a new tab
                    if (callbackReason === _this.backToPowerBI) {
                        window.location.href = window.location.protocol + "//" + window.location.host;
                    }
                };
                // Values for error dialog options for accessing features that are disabled in Archived Content     
                var dialogOptions = [{
                    label: this.localizationService.get('ArchivedContent_ErrorOptionOneText'),
                    resultValue: this.backToPowerBI
                }, {
                    label: this.localizationService.get('ArchivedContent_ErrorOptionTwoText'),
                    resultValue: this.stayInArchivedContent
                }];
                common.errorService.error(this.localizationService.get(errorMessageId), 'FeatureDisabledInArchivedContent', {
                    title: this.localizationService.get('ArchivedContent_ErrorTitle'),
                    dialogOptions: dialogOptions,
                    dismissCallback: dismissCallback,
                    showAdditionalErrorInfo: false
                });
            };
            return ViralTenantMergeHelperService;
        })();
        common.ViralTenantMergeHelperService = ViralTenantMergeHelperService;
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var services;
        (function (services) {
            var visualStyles;
            (function (visualStyles) {
                function create(colors) {
                    // We shouldn't share data color palette's across visuals
                    var dataColors = new powerbi.visuals.DataColorPalette(colors);
                    return {
                        titleText: {
                            color: { value: 'rgba(51,51,51,1)' }
                        },
                        subTitleText: {
                            color: { value: 'rgba(145,145,145,1)' }
                        },
                        colorPalette: {
                            dataColors: dataColors,
                        },
                        labelText: {
                            color: {
                                value: 'rgba(51,51,51,1)',
                            },
                            fontSize: '11px'
                        },
                        isHighContrast: false,
                    };
                }
                visualStyles.create = create;
            })(visualStyles = services.visualStyles || (services.visualStyles = {}));
        })(services = common.services || (common.services = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
/* tslint:disable */
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>  
//-----------------------------------------------------------------------
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
// 
//     Tool     : bondc, Version=3.0.1, Build=bond-git.retail.not
//     Template : bondTypeScriptTransform.TT
//     File     : events.ts
//
//     Changes to this file may cause incorrect behavior and will be lost when
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var telemetry;
    (function (telemetry) {
        var g = jsCommon.Utility.generateGuid;
        telemetry.LocalizationFailedToLoadStrings = function (languageLocale, message) {
            var info = {
                languageLocale: languageLocale,
                message: message,
            };
            var event = {
                name: 'PBI.Localization.FailedToLoadStrings',
                category: 2 /* CriticalError */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        languageLocale: info.languageLocale,
                        message: info.message,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.LocalizationFailedToLoadStringsLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.LocalizationFailedToLoadStringsLoggers;
            }
            return event;
        };
        telemetry.DashboardTokenRefreshPrompt = function (parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.TokenRefreshPrompt',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardTokenRefreshPromptLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardTokenRefreshPromptLoggers;
            }
            return event;
        };
        telemetry.DashboardBITokenRefreshPrompt = function (parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.BITokenRefreshPrompt',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardBITokenRefreshPromptLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardBITokenRefreshPromptLoggers;
            }
            return event;
        };
        telemetry.DashboardOpenLink = function (url, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                url: url,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.OpenLink',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        url: info.url,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardOpenLinkLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardOpenLinkLoggers;
            }
            return event;
        };
        telemetry.BaseMashupContentProviderChildEvent = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'BaseMashupContentProviderChildEvent',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.BaseMashupContentProviderChildEventLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.BaseMashupContentProviderChildEventLoggers;
            }
            return event;
        };
        telemetry.BaseMashupContentProviderCustomerActionEvent = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'BaseMashupContentProviderCustomerActionEvent',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.BaseMashupContentProviderCustomerActionEventLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.BaseMashupContentProviderCustomerActionEventLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderConnectButtonClicked = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.ConnectButtonClicked',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderConnectButtonClickedLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderConnectButtonClickedLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderOrgAppPassThrough = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.OrgAppPassThrough',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderOrgAppPassThroughLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderOrgAppPassThroughLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderPreparePackageSucceed = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.PreparePackageSucceed',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderPreparePackageSucceedLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderPreparePackageSucceedLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderGetPackageModels = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.GetPackageModels',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderGetPackageModelsLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderGetPackageModelsLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderSaveModelParameters = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.SaveModelParameters',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderSaveModelParametersLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderSaveModelParametersLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderGetAggregatedDatasourcesForImport = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.GetAggregatedDatasourcesForImport',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderGetAggregatedDatasourcesForImportLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderGetAggregatedDatasourcesForImportLoggers;
            }
            return event;
        };
        telemetry.MashUpContentProviderUpdateDatasource = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.MashUpContentProvider.UpdateDatasource',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.MashUpContentProviderUpdateDatasourceLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.MashUpContentProviderUpdateDatasourceLoggers;
            }
            return event;
        };
        telemetry.BaseDataSetChildEvent = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'BaseDataSetChildEvent',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.BaseDataSetChildEventLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.BaseDataSetChildEventLoggers;
            }
            return event;
        };
        telemetry.DashboardSettingsDatasetsSaveRefreshSettings = function (refreshEnabled, isDaily, weekDays, refreshNotificationEnabled, providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                refreshEnabled: refreshEnabled,
                isDaily: isDaily,
                weekDays: weekDays,
                refreshNotificationEnabled: refreshNotificationEnabled,
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.SettingsDatasetsSaveRefreshSettings',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        refreshEnabled: info.refreshEnabled,
                        isDaily: info.isDaily,
                        weekDays: info.weekDays,
                        refreshNotificationEnabled: info.refreshNotificationEnabled,
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardSettingsDatasetsSaveRefreshSettingsLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardSettingsDatasetsSaveRefreshSettingsLoggers;
            }
            return event;
        };
        telemetry.DashboardParametersDialogSaveParameters = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.ParametersDialogSaveParameters',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardParametersDialogSaveParametersLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardParametersDialogSaveParametersLoggers;
            }
            return event;
        };
        telemetry.DashboardRefreshNowFailedToRetrieveModel = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.RefreshNowFailedToRetrieveModel',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardRefreshNowFailedToRetrieveModelLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardRefreshNowFailedToRetrieveModelLoggers;
            }
            return event;
        };
        telemetry.DashboardAuthenticationDialogSaveCredentials = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.AuthenticationDialogSaveCredentials',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardAuthenticationDialogSaveCredentialsLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardAuthenticationDialogSaveCredentialsLoggers;
            }
            return event;
        };
        telemetry.DashboardAuthenticationDiscoverPublicKey = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.AuthenticationDiscoverPublicKey',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardAuthenticationDiscoverPublicKeyLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardAuthenticationDiscoverPublicKeyLoggers;
            }
            return event;
        };
        telemetry.DashboardRetrieveGateway = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.RetrieveGateway',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardRetrieveGatewayLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardRetrieveGatewayLoggers;
            }
            return event;
        };
        telemetry.DashboardPrepareRefreshNow = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.PrepareRefreshNow',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardPrepareRefreshNowLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardPrepareRefreshNowLoggers;
            }
            return event;
        };
        telemetry.DashboardGetAggregatedDatasourcesForOneModel = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.GetAggregatedDatasourcesForOneModel',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardGetAggregatedDatasourcesForOneModelLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardGetAggregatedDatasourcesForOneModelLoggers;
            }
            return event;
        };
        telemetry.DashboardDatasetRefresh = function (providerId, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                providerId: providerId,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.DatasetRefresh',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        providerId: info.providerId,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardDatasetRefreshLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardDatasetRefreshLoggers;
            }
            return event;
        };
        telemetry.DashboardInitializeSettingsDatasetModel = function (parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.InitializeSettingsDatasetModel',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardInitializeSettingsDatasetModelLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardInitializeSettingsDatasetModelLoggers;
            }
            return event;
        };
        telemetry.DashboardGetRefreshHistory = function (parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.Dashboard.GetRefreshHistory',
                category: 0 /* Verbose */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.DashboardGetRefreshHistoryLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.DashboardGetRefreshHistoryLoggers;
            }
            return event;
        };
    })(telemetry = powerbi.telemetry || (powerbi.telemetry = {}));
})(powerbi || (powerbi = {}));
angular.module('powerbi.common').run(['$templateCache', function (t) {
    t.put('views/dialogConfirmContent.html', '\u003cdiv class=\"content\"\u003e\
    \u003cdiv class=\"title\"\u003e{{viewModel.title}}\u003c/div\u003e\
    \u003cdiv class=\"message\" ng-if=\"viewModel.message\"\u003e{{viewModel.message}}\u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/dialogPromptContent.html', '\u003cdiv class=\"content\"\u003e\
    \u003cdiv class=\"title\"\u003e{{viewModel.title}}\u003c/div\u003e\
    \u003cdiv class=\"message instructions\" ng-if=\"viewModel.instructions\"\u003e{{viewModel.instructions}}\u003c/div\u003e\
    \u003cinput type=\"text\" ng-model=\"viewModel.userInput\" /\u003e\
\u003c/div\u003e\
');
    t.put('views/dropdownMenu.html', '\u003cul class=\u0027angular-dropdown\u0027 ng-class=\u0027{dropdownMenuClass: true, dark: dropdownDarkTheme === true}\u0027\u003e\
    \u003cli ng-repeat=\u0027item in dropdownMenu\u0027 class=\u0027dropdown-item\u0027 dropdown-item-label=\u0027labelField\u0027 dropdown-item-description=\u0027descriptionField\u0027 dropdown-item-class=\u0027classField\u0027 dropdown-menu-item=\u0027item\u0027\u003e\u003c/li\u003e\
\u003c/ul\u003e\
');
    t.put('views/dropdownMenuItems.html', '\u003cul class=\"angular-dropdown {{dropdownClass}}\" ng-class=\"{dark: dropdownDarkTheme === true}\"\u003e\
    \u003cli ng-repeat=\"item in dropdownItems track by $index\" class=\"dropdown-item {{item.dropdownItemClass}}\" ng-mousedown=\"dropdownOnItemSelected({ selected: item }); $event.stopPropagation();\"\u003e\
        \u003ca ng-if=\"::item.type === 0\" class=\"{{::item.containerClass}}\" ng-href=\"{{::item.href}}\" target=\"{{::item.hrefTarget ? item.hrefTarget : \\\"_blank\\\" }}\"\u003e\
            \u003cdiv class=\"dropdown-content {{item.itemClass}}\"\u003e\
                \u003cdiv class=\"dropdown-label {{::item.labelClass}}\"\u003e{{::item.text}}\u003c/div\u003e\
                \u003cdiv class=\"dropdown-description {{::item.descriptionClass}}\" ng-if=\"::item.description\"\u003e{{::item.description}}\u003c/div\u003e\
            \u003c/div\u003e\
        \u003c/a\u003e\
        \u003cspan ng-if=\"::item.type === 1\" class=\"{{::item.containerClass}}\"\u003e\
            \u003cdiv class=\"dropdown-content {{item.itemClass}}\"\u003e\
                \u003cdiv class=\"dropdown-label {{::item.labelClass}}\"\u003e{{::item.text}}\u003c/div\u003e\
                \u003cdiv class=\"dropdown-description {{::item.descriptionClass}}\" ng-if=\"::item.description\"\u003e{{::item.description}}\u003c/div\u003e\
            \u003c/div\u003e\
        \u003c/span\u003e\
        \u003cspan ng-if=\"::item.type === 2\" class=\"dropdown-separator\"\u003e\u003c/span\u003e\
    \u003c/li\u003e\
\u003c/ul\u003e\
');
    t.put('views/editableLabel.html', '\u003cdiv class=\"editableLabel\"\u003e\
    \u003cdiv class=\"textLabel\" ng-click=\"disableClick || makeEditable()\" ng-attr-title=\"{{customTooltip? undefined : viewModel.displayName}}\" ng-bind=\"viewModel.displayName\"\u003e\u003c/div\u003e\
    \u003cinput class=\"textInput\" type=\"text\" ng-if=\"editable\" ng-blur=\"onInternalBlur()\" ng-keydown=\"onInternalKeyDown($event)\" spellcheck=\"false\" ng-keyup=\"updateInputState()\" maxlength=\"{{::maxInputLength}}\" /\u003e\
\u003c/div\u003e\
');
    t.put('views/inlineMessageView.html', '\u003cdiv class=\"inlineWarning\"\u003e\
    \u003ci ng-class=\"mode==\u0027info\u0027?\u0027infoIcon\u0027:\u0027alert\u0027\"\u003e\u003c/i\u003e\
    \u003cdiv class=\"message\" ng-init=\"detailExpand=false\"\u003e\
        \u003cdiv ng-transclude /\u003e\
        \u003cdiv ng-if=\"traceDetails!=null\"\u003e\
            \u003cdiv class=\"warningDetailLink\" ng-click=\"detailExpand=!detailExpand\" ng-switch=\"detailExpand\"\u003e\
                \u003cspan localize=\"SettingsDataset_ShowDetails\" ng-switch-when=\"false\"\u003e\u003c/span\u003e\
                \u003cspan localize=\"SettingsDataset_HideDetails\" ng-switch-when=\"true\"\u003e\u003c/span\u003e\
            \u003c/div\u003e\
            \u003ctable class=\"warningDetails\" ng-show=\"detailExpand\"\u003e\
                \u003ctr\u003e\
                    \u003ctd class=\"warningDetailName\"\u003e\u003cspan localize=\"AdditionalErrorInfo_ActivityIdText\"\u003e\u003c/span\u003e:\u003c/td\u003e\
                    \u003ctd class=\"warningDetailValue\" ng-bind=\"traceDetails.activityId\"\u003e\u003c/td\u003e\
                \u003c/tr\u003e\
                \u003ctr\u003e\
                    \u003ctd class=\"warningDetailName\"\u003e\u003cspan localize=\"AdditionalErrorInfo_RequestIdText\"\u003e\u003c/span\u003e:\u003c/td\u003e\
                    \u003ctd class=\"warningDetailValue\" ng-bind=\"traceDetails.requestId\"\u003e\u003c/td\u003e\
                \u003c/tr\u003e\
                \u003ctr\u003e\
                    \u003ctd class=\"warningDetailName\"\u003e\u003cspan localize=\"AdditionalErrorInfo_ErrorCodeText\"\u003e\u003c/span\u003e:\u003c/td\u003e\
                    \u003ctd class=\"warningDetailValue\" ng-bind=\"traceDetails.errorCode\"\u003e\u003c/td\u003e\
                \u003c/tr\u003e\
                \u003ctr\u003e\
                    \u003ctd class=\"warningDetailName\"\u003e\u003cspan localize=\"AdditionalErrorInfo_TimestampText\"\u003e\u003c/span\u003e:\u003c/td\u003e\
                    \u003ctd class=\"warningDetailValue\" ng-bind=\"traceDetails.time\"\u003e\u003c/td\u003e\
                \u003c/tr\u003e\
                \u003ctr\u003e\
                    \u003ctd class=\"warningDetailName\"\u003e\u003cspan localize=\"AdditionalErrorInfo_VersionText\"\u003e\u003c/span\u003e:\u003c/td\u003e\
                    \u003ctd class=\"warningDetailValue\" ng-bind=\"traceDetails.version\"\u003e\u003c/td\u003e\
                \u003c/tr\u003e\
            \u003c/table\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/modalDialog.html', '\u003cdiv class=\"modal\"\u003e\
    \u003cdiv class=\"overlay\"\u003e\u003c/div\u003e\
    \u003cdiv class=\"dialog\"\u003e\
        \u003cdiv ng-transclude ng-class=\"{\u0027dialog-content-filled\u0027: viewModel.contentFilledDialog, \u0027dialog-content\u0027: !viewModel.contentFilledDialog}\"\u003e\u003c/div\u003e\
        \u003cdiv class=\"closeBtn\" ng-click=\"cancel()\" /\u003e\
        \u003cdiv class=\"actions\" ng-if=\"!viewModel.hideActionsButtons\"\u003e\
            \u003cbutton class=\"confirm biButton primary\" ng-class=\"{\u0027elevated\u0027: viewModel.confirmButtonImportance === \u0027elevated\u0027, \u0027normal\u0027: viewModel.confirmButtonImportance === \u0027normal\u0027 }\" ng-click=\"confirm()\" ng-disabled=\"viewModel.isConfirmButtonDisabled\"\u003e{{viewModel.confirmButtonText}}\u003c/button\u003e\
            \u003cbutton class=\"cancel biButton\" ng-class=\"{\u0027elevated\u0027: viewModel.cancelButtonImportance === \u0027elevated\u0027, \u0027normal\u0027: viewModel.cancelButtonImportance === \u0027normal\u0027 }\" ng-click=\"cancel()\"\u003e{{viewModel.cancelButtonText}}\u003c/button\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/modalThreeButtonDialog.html', '\u003cdiv class=\"modal\"\u003e\
    \u003cdiv class=\"overlay\"\u003e\u003c/div\u003e\
    \u003cdiv class=\"dialog\"\u003e\
        \u003cdiv ng-transclude ng-class=\"{\u0027dialog-content-filled\u0027: viewModel.contentFilledDialog, \u0027dialog-content\u0027: !viewModel.contentFilledDialog}\"\u003e\u003c/div\u003e\
        \u003cdiv class=\"closeBtn\" ng-click=\"cancel()\" /\u003e\
        \u003cdiv class=\"actions\" ng-if=\"!viewModel.hideActionsButtons\"\u003e\
            \u003cbutton class=\"confirm biButton primary\" ng-class=\"{\u0027elevated\u0027: viewModel.confirmButtonImportance === \u0027elevated\u0027, \u0027normal\u0027: viewModel.confirmButtonImportance === \u0027normal\u0027 }\" ng-click=\"confirm()\" ng-disabled=\"viewModel.isConfirmButtonDisabled\"\u003e{{viewModel.confirmButtonText}}\u003c/button\u003e\
            \u003cbutton class=\"deny biButton\" ng-class=\"{\u0027elevated\u0027: viewModel.denyButtonImportance === \u0027elevated\u0027, \u0027normal\u0027: viewModel.denyButtonImportance === \u0027normal\u0027 }\" ng-click=\"deny()\"\u003e{{viewModel.denyButtonText}}\u003c/button\u003e\
            \u003cbutton class=\"cancel biButton\" ng-class=\"{\u0027elevated\u0027: viewModel.cancelButtonImportance === \u0027elevated\u0027, \u0027normal\u0027: viewModel.cancelButtonImportance === \u0027normal\u0027 }\" ng-click=\"cancel()\"\u003e{{viewModel.cancelButtonText}}\u003c/button\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/modalOverlay.html', '\u003cdiv class=\"modal\"\u003e\
    \u003cdiv class=\"overlay\"\u003e\u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/notificationBar.html', '\u003cdiv class=\"notification-bar unselectable\" ng-repeat=\"notification in service.notifications track by notification.id\" ng-if=\"$first\"\u003e\
    \u003cdiv class=\"bar-actions\"\u003e\
        \u003cdiv class=\"infiniteLoader\" ng-if=\"notification.type === 3\"\u003e\u003c/div\u003e\
        \u003cbutton ng-repeat=\"action in notification.actions\" ng-bind=\"action.displayText\" ng-click=\"action.action()\" ng-class=\"{\u0027primary\u0027: $first, \u0027last\u0027: $last}\"\u003e\u003c/button\u003e\
        \u003cbutton class=\"dismissBtn glyphicon pbi-glyph-close glyph-small\" ng-if=\"notification.isDismissable\" ng-click=\"dismiss(notification)\"\u003e\u003c/button\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"bar-content\" ng-switch=\"notification.type\"\u003e\
        \u003cspan ng-switch-when=\"2\" class=\"icon glyphicon pbi-glyph-error glyph-small\"\u003e\u003c/span\u003e\
        \u003cspan ng-switch-when=\"4\" class=\"icon glyphicon pbi-glyph-success glyph-small\"\u003e\u003c/span\u003e\
        \u003cspan ng-switch-when=\"5\" class=\"icon glyphicon pbi-glyph-warning glyph-small\"\u003e\u003c/span\u003e\
\
        \u003cspan class=\"message\"\u003e\u003cspan ng-bind=\"::notification.message\"\u003e\u003c/span\u003e\u003ca ng-if=\"notification.secondaryLink\" ng-href=\"{{::notification.secondaryLink.urlString}}\" target=\"_blank\" ng-bind=\"::notification.secondaryLink.displayText\"\u003e\u003c/a\u003e\u003c/span\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/qnaQuestionBox.html', '\u003cdiv class=\"qnaQuestionBoxContainer\"\u003e\
    \u003cspinner class=\"qnaSpinner\" ng-show=\"showLoadingIndicator\"\u003e\u003c/spinner\u003e\
\u003c/div\u003e\
');
    t.put('views/spinner.html', '\u003cdiv class=\"powerbi-spinner\"\u003e\
    \u003cdiv class=\"spinner\" ng-if=\"dots == true\"\u003e\
        \u003cdiv class=\"dots\"\u003e\
            \u003cspan\u003e\u0026#9679;\u003c/span\u003e\
            \u003cspan\u003e\u0026#9679;\u003c/span\u003e\
            \u003cspan\u003e\u0026#9679;\u003c/span\u003e\
            \u003cspan\u003e\u0026#9679;\u003c/span\u003e\
            \u003cspan\u003e\u0026#9679;\u003c/span\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\
    \u003cdiv class=\"circleSpinner\" ng-if=\"dots == null\"\u003e\
        \u003cdiv class=\"circle first\" /\u003e\
        \u003cdiv class=\"circle second\" /\u003e\
        \u003cdiv class=\"circle third\" /\u003e\
        \u003cdiv class=\"circle fourth\" /\u003e\
        \u003cdiv class=\"circle fifth\" /\u003e\
        \u003cdiv class=\"circle sixth\" /\u003e\
        \u003cdiv class=\"circle seventh\" /\u003e\
        \u003cdiv class=\"circle eighth\" /\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/visual.html', '\u003cdiv class=\"visual\"\u003e\u003c/div\u003e\
');
    t.put('views/authDialogBodyView.html', '\u003cdiv\u003e\
    \u003cinline-message class=\"warning\" trace-details=\"traceDetails\" ng-show=\"viewModel.showError\"\u003e\
        \u003cspan localize=\"AuthDialog_Error_LoginFailed\"\u003e\u003c/span\u003e\
    \u003c/inline-message\u003e\
\
    \u003cdiv class=\"authForm\"\u003e\
        \u003cinline-message class=\"warning\" ng-show=\"showOAuthError\"\u003e\
            \u003cspan localize=\"OAuth_Security_Error\"\u003e\u003c/span\u003e\
        \u003c/inline-message\u003e\
\
        \u003cdiv class=\"disabledField\" ng-repeat=\"property in viewModel.datasource.connectionStringGeneralProperties\"\u003e\
            \u003cspan\u003e{{property.name}}\u003c/span\u003e\
            \u003cinput type=\"text\" class=\"textBox\" value=\"{{property.value}}\" /\u003e\
        \u003c/div\u003e\
\
        \u003cdiv class=\"group\"\u003e\
            \u003cspan localize=\"AuthDialog_FieldName_Authentication\" /\u003e\
        \u003c!-- nToDo - 3877298: Using ng-click in the following \u003cselect\u003e because ng-change does not fire --\u003e\
        \u003cselect ng-model=\"viewModel.selectedAuthenticationIndex\"\
                ng-click=\"customizeAuthDialog()\"\
                ng-options=\"viewModel.datasource.credentialTypes.indexOf(credentialType) as credentialType for credentialType in viewModel.datasource.credentialTypes\"\
                ng-disabled=\"viewModel.showSpinner\" tabindex=\"1\" /\u003e\
        \u003c/div\u003e\
        \u003cdiv class=\"editableField1\" ng-if=\"viewModel.showEditableField1\"\u003e\
            \u003cspan\u003e{{viewModel.editableField1Label}}\u003c/span\u003e\
            \u003cinput type=\"text\" class=\"textBox\" value=\"{{viewModel.editableField1Value}}\" ng-model=\"viewModel.editableField1Value\" ng-change=\"dismissSpinnerError()\" ng-disabled=\"viewModel.showSpinner\" tabindex=\"2\" focus-on=\"true\" /\u003e\
        \u003c/div\u003e\
        \u003cdiv class=\"editableField2\" ng-if=\"viewModel.showEditableField2\"\u003e\
            \u003cspan\u003e{{viewModel.editableField2Label}}\u003c/span\u003e\
            \u003cinput type=\"password\" class=\"textBox\" value=\"{{viewModel.editableField2Value}}\" ng-model=\"viewModel.editableField2Value\" ng-change=\"dismissSpinnerError()\" ng-disabled=\"viewModel.showSpinner\" tabindex=\"3\" /\u003e\
        \u003c/div\u003e\
        \u003cdiv class=\"waitingMessageWhenApplyOAuthCredential\" ng-if=\"viewModel.showWaitingMessageForOAuth\"\u003e\
        \u003c/div\u003e\
        \u003cspinner circle class=\"signInSpinner\" ng-show=\"viewModel.showSpinner\"\u003e\u003c/spinner\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/authDialogView.html', '\u003cdiv\u003e\
    \u003cmodal-dialog class=\"authDialog\" auth-dialog=\"viewModel\" view-model=\"dialogModel\" ng-if=\"viewModel.showModalDialog\u0026\u0026 !viewModel.showPlainUI\" on-confirm-action=\"confirmDialog()\" on-cancel-action=\"closeDialog()\" on-close-action=\"closeDialog()\"\u003e\
        \u003cdiv class=\"title\"\u003e\u003cspan localize=\"AuthDialog_Configure\"\u003e\u003c/span\u003e {{viewModel.datasetModel.dataset.name}}\u003c/div\u003e\
        \u003cdiv ng-include=\"\u0027views/authDialogBodyView.html\u0027\"\u003e\u003c/div\u003e\
    \u003c/modal-dialog\u003e\
    \u003cdiv ng-if=\"viewModel.showModalDialog\u0026\u0026 viewModel.showPlainUI\" class=\"authDialog plain\"\u003e\
        \u003cdiv ng-include=\"\u0027views/authDialogBodyView.html\u0027\" class=\"authDialogContent\"\u003e\u003c/div\u003e\
        \u003cdiv class=\"action\"\u003e\
            \u003cbutton ng-click=\"confirmDialog()\" class=\"primary\" localize=\"AuthDialog_LinkText_SignIn\"\u003e\u003c/button\u003e\
            \u003cbutton ng-click=\"closeDialog()\" localize=\"GetData_Cancel\"\u003e\u003c/button\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/collapsibleSectionView.html', '\u003cdiv class=\"collapsibleSectionControl\" ng-class=\"{isExpanded: isCollapsibleSectionExpanded === true}\"\u003e\
    \u003cdiv class=\"sectionTitle\"\u003e\
        \u003cspan class=\"collapseToggleContainer\" ng-click=\"isCollapsibleSectionExpanded = !isCollapsibleSectionExpanded\"\u003e\
            \u003ci class=\"glyphicon pbi-glyph-caretright collapseToggle\"\u003e\u003c/i\u003e\
            \u003cspan\u003e{{isCollapsibleSectionExpanded ? localizedExpandedTitle : localizedCollapsedTitle}}\u003c/span\u003e\
        \u003c/span\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"content\" ng-show=\"isCollapsibleSectionExpanded\" ng-transclude\u003e\u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/datasetParametersDialogBodyView.html', '\u003cdiv\u003e\
    \u003cform name=\"parametersForm\" ng-submit=\"confirmDialog()\"\u003e\
        \u003cdiv class=\"parameterGroup\"\u003e\
            \u003cdiv class=\"parameter\" ng-repeat=\"parameter in viewModel.datasetModel.dataset.parameters\"\u003e\
                \u003cspan tabindex=\"-1\" class=\"fieldName\"\u003e{{parameter.name}}\u003c/span\u003e\
                \u003cspan class=\"description\" tabindex=\"-1\"\u003e{{parameter.description}}\u003c/span\u003e\
                \u003cinput class=\"textBox\" type=\"text\" placeholder=\"{{parameter.sample}}\" ng-model=\"parameter.value\" ng-disabled=\"viewModel.showSpinner\" autofocus tabindex=\"{{$index + 1}}\" required ng-pattern=\"parameter.valueValidator\"\u003e\
            \u003c/div\u003e\
        \u003c/div\u003e\
    \u003c/form\u003e\
    \u003cspinner class=\"spinner\" ng-if=\"viewModel.showSpinner\" /\u003e\
\u003c/div\u003e\
');
    t.put('views/datasetParametersDialogView.html', '\u003cdiv\u003e\
    \u003cmodal-dialog class=\"datasetParametersDialog\" view-model=\"dialogModel\" ng-if=\"viewModel.showDatasetParametersDialog \u0026\u0026 !viewModel.showPlainUI\" on-confirm-action=\"confirmDialog()\" on-cancel-action=\"closeDialog()\" on-close-action=\"closeDialog()\"\u003e\
        \u003cdiv class=\"title\"\u003e\u003cspan localize=\"DatasetParametersDialog_Configure\"\u003e\u003c/span\u003e {{viewModel.datasetModel.dataset.name}}\u003c/div\u003e\
        \u003cdiv class=\"description\"\u003e{{viewModel.datasetModel.dataset.description}}\u003c/div\u003e\
        \u003cspan localize=\"DatasetParametersDialog_HelpMessage\"\u003e\u003c/span\u003e\
        \u003ca ng-click=\"relocateToLink()\" href=\"\"\u003e\
            \u003cspan localize=\"DatasetParametersDialog_LearnMore\"\u003e\u003c/span\u003e\
        \u003c/a\u003e\
        \u003cdiv ng-include=\"\u0027views/datasetParametersDialogBodyView.html\u0027\"\u003e\u003c/div\u003e\
        \u003cdiv class=\"validationError\" ng-if=\"viewModel.showValidationError\"\u003e\
            \u003cspan localize=\"DatasetParametersDialog_ValidationError\"\u003e\u003c/span\u003e\
        \u003c/div\u003e\
    \u003c/modal-dialog\u003e\
    \u003cdiv ng-if=\"viewModel.showDatasetParametersDialog \u0026\u0026 viewModel.showPlainUI\" class=\"datasetParametersDialog plain\"\u003e\
        \u003cdiv class=\"validationError\" ng-if=\"viewModel.showValidationError\"\u003e\
            \u003ci class=\"glyphicon pbi-glyph-error\"\u003e\u003c/i\u003e\u003cspan localize=\"DatasetParametersDialog_ValidationError\"\u003e\u003c/span\u003e\
        \u003c/div\u003e\
        \u003cdiv ng-include=\"\u0027views/datasetParametersDialogBodyView.html\u0027\" class=\"datasetParametersDialogContent\"\u003e\u003c/div\u003e\
        \u003cdiv class=\"action\"\u003e\
            \u003cbutton class=\"primary\" ng-click=\"confirmDialog()\" localize=\"DatasetParametersDialog_NextButtonText\"\u003e\u003c/button\u003e\
            \u003cbutton ng-click=\"closeDialog()\" localize=\"GetData_Cancel\"\u003e\u003c/button\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/popupContainer.html', '\u003cdiv class=\"popup-container\"\u003e \
    \u003cng-transclude\u003e\u003c/ng-transclude\u003e\
\u003c/div\u003e\
');
    t.put('views/inlineNameValuePairsView.html', '\u003cdiv class=\"inlineWarning\"\u003e\
    \u003ci ng-class=\"mode==\u0027info\u0027?\u0027infoIcon\u0027:\u0027alert\u0027\"\u003e\u003c/i\u003e\
    \u003cdiv class=\"message\" ng-init=\"detailExpand=false\"\u003e\
        \u003cdiv ng-transclude /\u003e\
        \u003cdiv ng-if=\"nameValuePairs!=null\"\u003e\
            \u003cdiv class=\"warningDetailLink\" ng-click=\"detailExpand=!detailExpand\" ng-switch=\"detailExpand\" ng-show=\"showTitle\"\u003e\
                \u003cspan localize=\"SettingsDataset_ShowDetails\" ng-switch-when=\"false\"\u003e\u003c/span\u003e\
                \u003cspan localize=\"SettingsDataset_HideDetails\" ng-switch-when=\"true\"\u003e\u003c/span\u003e\
            \u003c/div\u003e\
            \u003ctable class=\"warningDetails\" ng-show=\"detailExpand\"\u003e\
                \u003ctr ng-repeat=\"pair in nameValuePairs\"\u003e\
                    \u003ctd class=\"warningDetailName\"\u003e\u003cspan ng-bind=\"::pair.Name\" /\u003e:\u003c/td\u003e\
                    \u003ctd class=\"warningDetailValue\"\u003e\u003cspan ng-bind=\"::pair.Value\" /\u003e\u003c/td\u003e\
                \u003c/tr\u003e\
            \u003c/table\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
}]);
//# sourceMappingURL=PowerBICommon.js.map