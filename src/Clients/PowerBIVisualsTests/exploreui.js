///<reference path="../../typedefs/angularFileUpload/angular-file-upload.d.ts"/>
///<reference path="../../typedefs/angular/angular.d.ts"/>
///<reference path="../../typedefs/angularUIBootstrap/angular-ui-bootstrap.d.ts" />
///<reference path="../../typedefs/d3/d3.d.ts"/>
///<reference path="../../Data/obj/data.d.ts"/>
///<reference path="../../Explore/obj/Explore.d.ts"/>
///<reference path="../../typedefs/interactjs/interact.d.ts"/>
///<reference path="../../typedefs/jquery-throttle-debounce/jquery-throttle-debounce.d.ts"/>
///<reference path="../../typedefs/jQuery/jQuery.d.ts"/>
///<reference path="../../typedefs/lodash/lodash.d.ts"/>
///<reference path="../../PowerBICommon/obj/PowerBICommon.d.ts"/>
///<reference path="../../JsCommon/obj/utility.d.ts"/>
///<reference path="../../Visuals/obj/visuals.d.ts"/>
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var util;
        (function (util) {
            var CanvasVisualsUtility;
            (function (CanvasVisualsUtility) {
                function findVisualContainerViewModel(visualContainers, visualContainerContract) {
                    for (var i = 0, len = visualContainers.length; i < len; ++i) {
                        var viewModel = visualContainers[i];
                        if (viewModel.contract === visualContainerContract)
                            return viewModel;
                    }
                }
                CanvasVisualsUtility.findVisualContainerViewModel = findVisualContainerViewModel;
                function serializeSelection(explorationSerializer, selectionService) {
                    var visuals = [];
                    var selectedElements = selectionService.getSelectedElements();
                    for (var i = 0, len = selectedElements.length; i < len; ++i) {
                        var selectedElement = selectedElements[i];
                        if (selectedElement.visualContainer)
                            visuals.push(explorationSerializer.serializeVisualContainer(selectedElement.visualContainer));
                    }
                    return visuals;
                }
                CanvasVisualsUtility.serializeSelection = serializeSelection;
                function checkBoundaryForCharts(position, defaultLength, canvasLength) {
                    position = Math.max(0, position - defaultLength / 2);
                    var outOfCanvas = position + defaultLength - canvasLength;
                    if (outOfCanvas > 0)
                        position -= outOfCanvas;
                    return position;
                }
                CanvasVisualsUtility.checkBoundaryForCharts = checkBoundaryForCharts;
                function duplicateVisuals(data, viewModel, explorationSerializer, selectionService) {
                    if (data && data.visuals) {
                        var visuals = data.visuals;
                        var visualsToSelect = [];
                        for (var i = 0, len = visuals.length; i < len; ++i) {
                            var visual = explorationSerializer.deserializeVisualContainer(visuals[i], true);
                            while (hasVisualAtPosition(visual.position, viewModel)) {
                                visual.position.x += 10;
                                visual.position.y += 10;
                            }
                            viewModel.contract.visualContainers.push(visual);
                            var model = explore.viewModels.ViewModelFactory.convertVisualContainer(viewModel.contract, visual);
                            viewModel.visualContainers.push(model);
                            visualsToSelect.push(visual);
                        }
                        explore.services.selectionUtils.selectVisualContainers(visualsToSelect, selectionService);
                    }
                }
                CanvasVisualsUtility.duplicateVisuals = duplicateVisuals;
                function hasVisualAtPosition(position, viewModel) {
                    debug.assertValue(position, 'position');
                    return _.any(viewModel.contract.visualContainers, function (visual) { return visual.position.x === position.x && visual.position.y === position.y; });
                }
            })(CanvasVisualsUtility = util.CanvasVisualsUtility || (util.CanvasVisualsUtility = {}));
        })(util = explore.util || (explore.util = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var util;
        (function (util) {
            var ColorUtility;
            (function (ColorUtility) {
                var HexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
                var RGBRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
                function getColorWheelImage(colorWheel) {
                    for (var h = 0, hLength = colorWheel.height; h < hLength; h++) {
                        for (var w = 0, wLength = colorWheel.width; w < wLength; w++) {
                            var offset = 4 * ((h * colorWheel.height) + w);
                            var hue = 180 + Math.atan2(h - colorWheel.height / 2, w - colorWheel.width / 2) * (180 / Math.PI);
                            var saturation = Math.sqrt(Math.pow(h - colorWheel.height / 2, 2) + Math.pow(w - colorWheel.width / 2, 2)) / 70;
                            saturation = Math.min(1, saturation);
                            var hsv = hsToRgb(hue, saturation);
                            colorWheel.data[offset + 0] = hsv[0];
                            colorWheel.data[offset + 1] = hsv[1];
                            colorWheel.data[offset + 2] = hsv[2];
                            colorWheel.data[offset + 3] = 255;
                        }
                    }
                    return colorWheel;
                }
                ColorUtility.getColorWheelImage = getColorWheelImage;
                function hsToRgb(hue, saturation) {
                    var c = 1 * saturation;
                    var h1 = hue / 60;
                    var x = c * (1 - Math.abs((h1 % 2) - 1));
                    var m = 1 - c;
                    var rgb;
                    if (typeof hue === 'undefined')
                        rgb = [0, 0, 0];
                    else if (h1 < 1)
                        rgb = [c, x, 0];
                    else if (h1 < 2)
                        rgb = [x, c, 0];
                    else if (h1 < 3)
                        rgb = [0, c, x];
                    else if (h1 < 4)
                        rgb = [0, x, c];
                    else if (h1 < 5)
                        rgb = [x, 0, c];
                    else if (h1 <= 6)
                        rgb = [c, 0, x];
                    var r = 255 * (rgb[0] + m);
                    var g = 255 * (rgb[1] + m);
                    var b = 255 * (rgb[2] + m);
                    return [r, g, b];
                }
                function rgbToHex(r, g, b) {
                    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                }
                ColorUtility.rgbToHex = rgbToHex;
                ;
                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                }
                ;
                function componentFromStr(numStr, percent) {
                    var num = Math.max(0, parseInt(numStr, 10));
                    return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
                }
                ;
                function rgbStringToHex(rgb) {
                    var result, r, g, b, hex = "";
                    if ((result = RGBRegex.exec(rgb))) {
                        r = componentFromStr(result[1], result[2]);
                        g = componentFromStr(result[3], result[4]);
                        b = componentFromStr(result[5], result[6]);
                        hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
                    }
                    return hex;
                }
                ;
                function convertFromRGBorHexToHex(value) {
                    if (value.match(HexPattern)) {
                        return value;
                    }
                    return rgbStringToHex(value);
                }
                ColorUtility.convertFromRGBorHexToHex = convertFromRGBorHexToHex;
                ;
                function hexToRGBString(hex, transparency) {
                    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
                    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                        return r + r + g + g + b + b;
                    });
                    // Hex format which return the format r-g-b
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    var rgb = result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                    // Wrong input
                    if (rgb === null) {
                        return '';
                    }
                    if (!transparency && transparency !== 0) {
                        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
                    }
                    else {
                        return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + transparency + ")";
                    }
                }
                ColorUtility.hexToRGBString = hexToRGBString;
            })(ColorUtility = util.ColorUtility || (util.ColorUtility = {}));
        })(util = explore.util || (explore.util = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var util;
        (function (util) {
            var ExploreClipboardHandlerUtility;
            (function (ExploreClipboardHandlerUtility) {
                function createClipboardHandler(viewModel, explorationSerializer, selectionService, visualAuthoring) {
                    return {
                        deleteSelection: function () {
                            debug.assertValue(viewModel, 'viewModel');
                            if (viewModel.exploration && viewModel.exploration.exploreCanvas)
                                visualAuthoring.deleteSelectedVisuals(viewModel.exploration.exploreCanvas);
                        },
                        deserializeAndDuplicateData: function (data) {
                            debug.assertValue(viewModel, 'viewModel');
                            if (viewModel.exploration && viewModel.exploration.exploreCanvas)
                                util.CanvasVisualsUtility.duplicateVisuals(data, viewModel.exploration.exploreCanvas, explorationSerializer, selectionService);
                        },
                        serializeSelection: function () { return util.CanvasVisualsUtility.serializeSelection(explorationSerializer, selectionService); },
                    };
                }
                ExploreClipboardHandlerUtility.createClipboardHandler = createClipboardHandler;
            })(ExploreClipboardHandlerUtility = util.ExploreClipboardHandlerUtility || (util.ExploreClipboardHandlerUtility = {}));
        })(util = explore.util || (explore.util = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var util;
        (function (util) {
            var ExploreUndoRedoHandlerUtility = (function () {
                function ExploreUndoRedoHandlerUtility() {
                }
                ExploreUndoRedoHandlerUtility.createUndoRedoHandler = function (viewModel, selectionService) {
                    return {
                        takeSnapshot: function (explorationSerializer) {
                            var currentSectionNumber = viewModel.sectionStatus.currentSectionNumber;
                            if (currentSectionNumber < 0 && viewModel.exploration.sections.length > 0) {
                                currentSectionNumber = 0;
                            }
                            var selectedSlideName = viewModel.exploration.sections[currentSectionNumber].contract.name;
                            var selectedVisuals = powerbi.explore.services.selectionUtils.getSelectedVisuals(selectionService);
                            var selectedVisualsIndex = [];
                            if (selectedVisuals) {
                                var visuals = viewModel.exploration.exploreCanvas.visualContainers;
                                for (var i = 0; i < selectedVisuals.length; i++) {
                                    for (var j = 0; j < visuals.length; j++) {
                                        if (selectedVisuals[i] === visuals[j].contract) {
                                            selectedVisualsIndex.push(j);
                                            break;
                                        }
                                    }
                                }
                            }
                            return {
                                contract: explorationSerializer.serializeExploration(viewModel.exploration.contract),
                                selectedSlide: selectedSlideName,
                                selectedVisualsIndex: selectedVisualsIndex
                            };
                        },
                        rollback: function (explorationSerializer, snapshot) {
                            var newExploration = explorationSerializer.deserializeExploration(snapshot.contract);
                            var sectionIndex = explore.SectionUtils.findSectionIndexForSectionName(newExploration, snapshot.selectedSlide);
                            viewModel.sectionStatus.currentSectionNumber = sectionIndex;
                            viewModel.exploration = explore.viewModels.ViewModelFactory.convertExploration(newExploration, sectionIndex);
                            // Selection state needs to be updated at the end of the digest cycle.
                            setTimeout(function () {
                                var visuals = viewModel.exploration.exploreCanvas.visualContainers;
                                var visualsToSelect = [];
                                if (snapshot.selectedVisualsIndex.length > 0) {
                                    for (var i = 0; i < snapshot.selectedVisualsIndex.length; i++) {
                                        if (visuals.length > snapshot.selectedVisualsIndex[i]) {
                                            visualsToSelect.push(visuals[snapshot.selectedVisualsIndex[i]].contract);
                                        }
                                    }
                                    powerbi.explore.services.selectionUtils.selectVisualContainers(visualsToSelect, selectionService);
                                }
                                else {
                                    selectionService.clearSelection();
                                }
                            }, 0);
                        }
                    };
                };
                return ExploreUndoRedoHandlerUtility;
            })();
            util.ExploreUndoRedoHandlerUtility = ExploreUndoRedoHandlerUtility;
        })(util = explore.util || (explore.util = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var util;
        (function (util) {
            var ModelAuthoringUtility;
            (function (ModelAuthoringUtility) {
                function hide(fieldDef, hide, modelAuthoring) {
                    if (!fieldDef)
                        return;
                    var schemaChange = {
                        itemShowHide: {
                            schema: fieldDef.schema,
                            entity: fieldDef.entity,
                            property: fieldDef.column || fieldDef.measure,
                            makeHidden: hide
                        }
                    };
                    applySchemaChange(schemaChange, modelAuthoring);
                }
                ModelAuthoringUtility.hide = hide;
                function deleteItem(fieldDef, modelAuthoring) {
                    if (!fieldDef)
                        return;
                    var schemaChange = {
                        itemDelete: {
                            schema: fieldDef.schema,
                            entity: fieldDef.entity,
                            property: fieldDef.column || fieldDef.measure,
                        }
                    };
                    applySchemaChange(schemaChange, modelAuthoring);
                }
                ModelAuthoringUtility.deleteItem = deleteItem;
                function rename(fieldDef, newName, modelAuthoring) {
                    if (!fieldDef)
                        return;
                    var schemaChange;
                    if (fieldDef.column || fieldDef.measure) {
                        schemaChange = {
                            propertyRename: {
                                schema: fieldDef.schema,
                                entity: fieldDef.entity,
                                before: fieldDef.column || fieldDef.measure,
                                after: newName,
                            }
                        };
                    }
                    else if (fieldDef.entity) {
                        schemaChange = {
                            entityRename: {
                                schema: fieldDef.schema,
                                before: fieldDef.entity,
                                after: newName,
                            }
                        };
                    }
                    applySchemaChange(schemaChange, modelAuthoring);
                }
                ModelAuthoringUtility.rename = rename;
                function createMeasure(fieldDef, modelAuthoring) {
                    var schemaChange = {
                        newMeasure: {
                            schema: fieldDef.schema,
                            entity: fieldDef.entity,
                        }
                    };
                    applySchemaChange(schemaChange, modelAuthoring);
                }
                ModelAuthoringUtility.createMeasure = createMeasure;
                function createCalculatedColumn(fieldDef, modelAuthoring) {
                    var schemaChange = {
                        newCalculatedColumn: {
                            schema: fieldDef.schema,
                            entity: fieldDef.entity,
                        }
                    };
                    applySchemaChange(schemaChange, modelAuthoring);
                }
                ModelAuthoringUtility.createCalculatedColumn = createCalculatedColumn;
                function applySchemaChange(schemaChange, modelAuthoring) {
                    modelAuthoring.apply({
                        changes: [schemaChange]
                    });
                }
            })(ModelAuthoringUtility = util.ModelAuthoringUtility || (util.ModelAuthoringUtility = {}));
        })(util = explore.util || (explore.util = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var util;
        (function (util) {
            function GenerateShowMoreErrorDetails(error) {
                var additionalErrors = [];
                var message = error.message;
                var title = powerbi.common.localize.get('ServiceError_CannotLoadVisual');
                if (error.additionalErrorInfo) {
                    if (error.additionalErrorInfo.length > 0) {
                        // When there is at least one additional info, show that as the first title/message.
                        title = error.additionalErrorInfo[0].errorInfoKey;
                        message = error.additionalErrorInfo[0].errorInfoValue;
                    }
                    if (error.additionalErrorInfo.length > 1) {
                        for (var i = 1; i < error.additionalErrorInfo.length; i++) {
                            additionalErrors.push(error.additionalErrorInfo[i]);
                        }
                    }
                }
                var showMoreDetails = {
                    title: title,
                    message: message,
                    additionalErrorInfo: additionalErrors,
                };
                return showMoreDetails;
            }
            util.GenerateShowMoreErrorDetails = GenerateShowMoreErrorDetails;
        })(util = explore.util || (explore.util = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
'use strict';
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        // Create and register modules
        angular.module('powerbi.explore.controllers', []);
        angular.module('powerbi.explore.directives', []);
        //TODO: remove this hack once extensibility feature switch is removed.
        var exploreUIDependencies = ['bgDirectives', 'powerbi.common', 'powerbi.explore.controllers', 'powerbi.explore.directives', 'ui.bootstrap'];
        if (window.location.search.indexOf('devToolsEnabled=true') >= 0) {
            exploreUIDependencies.push('powerbi.extensibility');
        }
        angular.module('powerbi.explore', exploreUIDependencies).factory('displayNameService', function () {
            var localize = powerbi.common.localize;
            var locOptions = {
                aggregateDisplayNames: {
                    Sum: localize.get('DisplayName_Sum'),
                    Avg: localize.get('DisplayName_Avg'),
                    Count: localize.get('DisplayName_Count'),
                    Min: localize.get('DisplayName_Min'),
                    Max: localize.get('DisplayName_Max'),
                    CountNonNull: localize.get('DisplayName_CountNonNull')
                },
                qualifiedDisplayNameTemplate: localize.get('Field_Tooltip'),
            };
            return powerbi.explore.services.createDisplayNameService(locOptions);
        }).provider('conceptualSchemaProxy', function () {
            var conceptualSchemaProxyProvider = this;
            conceptualSchemaProxyProvider.$get = ['$injector', 'promiseFactory', function ($injector, promiseFactory) {
                var communication;
                if (conceptualSchemaProxyProvider.conceptualSchemaProxyCommunicationFactory)
                    communication = conceptualSchemaProxyProvider.conceptualSchemaProxyCommunicationFactory($injector);
                var httpService = powerbi.common.httpService;
                return powerbi.explore.proxies.createConceptualSchemaProxy(promiseFactory, communication || powerbi.explore.proxies.createConceptualSchemaProxyHttpCommunication(httpService, promiseFactory));
            }];
            return conceptualSchemaProxyProvider;
        }).factory('explorationSerializer', ['visualPlugin', function (visualPlugin) { return powerbi.explore.services.createExplorationSerializer(visualPlugin); }]).factory('explorationProxy', ['promiseFactory', 'explorationSerializer', function (promiseFactory, explorationSerializer) { return powerbi.explore.proxies.createExplorationProxy(promiseFactory, powerbi.common.httpService, explorationSerializer); }]).factory('layoutInsertionHelper', function () { return powerbi.explore.services.createLayoutInsertionHelper(); }).factory('geoTaggingAnalyzerService', ['localizationService', function (localizationService) { return powerbi.createGeoTaggingAnalyzerService(function (stringId) { return localizationService.get(stringId); }); }]).directive('datepickerPopup', function () {
            return {
                restrict: 'EAC',
                require: 'ngModel',
                link: function (scope, element, attr, controller) {
                    //remove the default formatter from the input directive to prevent conflict
                    controller.$formatters.shift();
                }
            };
        }).run(['scopedProvider', function (scopedProvider) {
            scopedProvider.register('eventBridge', {
                fn: function () { return powerbi.common.createEventBridge(); },
            }).register('sectionNavigationService', {
                scopedServices: ['eventBridge'],
                fn: function (eventBridge) { return powerbi.explore.services.createSectionNavigationService(eventBridge); },
            }).register('viewModeState', {
                fn: function () { return powerbi.explore.services.createViewModeState(); },
            }).register('colorPickerService', {
                fn: function () { return powerbi.exploreui.services.createColorPickerService(); },
            }).register('selectionService', {
                scopedServices: ['eventBridge'],
                fn: function (eventBridge) { return powerbi.explore.services.createSelectionService(eventBridge); },
            }).register('undoRedoService', {
                services: ['explorationSerializer', '$rootScope'],
                scopedServices: ['eventBridge'],
                fn: function (explorationSerializer, $rootScope, eventBridge) { return powerbi.explore.services.createUndoRedoService(explorationSerializer, $rootScope, eventBridge); },
            }).register('clipboardService', {
                scopedServices: ['undoRedoService', 'eventBridge'],
                fn: function (undoRedoService, eventBridge) { return powerbi.explore.services.createClipboardService(undoRedoService, eventBridge); }
            }).register('visualPlugin', {
                services: ['featureSwitchService'],
                fn: function (featureSwitchService) { return powerbi.visuals.visualPluginFactory.createMinerva(featureSwitchService.featureSwitches); },
            }).register('sortService', {
                services: ['displayNameService'],
                scopedServices: ['visualPlugin'],
                fn: function (displayNameService, visualPlugin) { return powerbi.explore.services.createSortService(displayNameService, visualPlugin); },
            }).register('visualQueryGenerator', {
                services: ['displayNameService'],
                scopedServices: ['visualPlugin'],
                fn: function (displayNameService, visualPlugin) { return powerbi.explore.services.createVisualQueryGenerator({ displayNameService: displayNameService, plugin: visualPlugin }); },
            }).register('visualAuthoring', {
                services: ['conceptualSchemaProxy', 'explorationSerializer', 'telemetryService', 'promiseFactory', 'geoTaggingAnalyzerService'],
                scopedServices: ['eventBridge', 'undoRedoService', 'sectionNavigationService', 'selectionService', 'visualPlugin'],
                fn: function (conceptualSchemaProxy, explorationSerializer, telemetryService, promiseFactory, geotaggingAnalyserService, eventBridge, undoRedoService, sectionNavigationService, selectionService, visualPlugin) { return powerbi.explore.services.createVisualAuthoring(visualPlugin, conceptualSchemaProxy, telemetryService, sectionNavigationService, selectionService, geotaggingAnalyserService, explorationSerializer, eventBridge, promiseFactory, undoRedoService); }
            }).register('canvasKeyHandlerService', {
                services: ['explorationSerializer'],
                scopedServices: ['selectionService', 'clipboardService', 'undoRedoService', 'viewModeState', 'visualAuthoring'],
                fn: function (explorationSerializer, selectionService, clipboardService, undoRedoService, viewModeState, visualAuthoring) { return powerbi.explore.services.createCanvasKeyHandlerService(clipboardService, selectionService, explorationSerializer, viewModeState, undoRedoService, visualAuthoring); }
            }).register('modelChangeHandler', {
                services: ['conceptualSchemaProxy', 'dataProxy'],
                scopedServices: ['$scope', 'eventBridge', 'undoRedoService'],
                fn: function (conceptualSchemaProxy, dataProxy, $scope, eventBridge, undoRedoService) { return powerbi.explore.services.createModelChangeHandler(conceptualSchemaProxy, dataProxy, $scope, eventBridge, undoRedoService); }
            }).register('modelAuthoring', {
                fn: function () { return powerbi.explore.services.createModelAuthoringService(); },
            }).register('modelAuthoring', {
                fn: function () { return powerbi.explore.services.createShellService(); },
            }).register('schemaItemActivationService', {
                scopedServices: ['eventBridge'],
                fn: function (eventBridge) { return powerbi.explore.services.createSchemaItemActivationService(eventBridge); },
            }).register('shellService', {
                scopedServices: ['eventBridge'],
                fn: function (eventBridge) { return powerbi.explore.services.createShellService(); },
            }).register('pinVisualService', {
                services: ['conceptualSchemaProxy', 'displayNameService', 'singleExecutableDataProxyFactory'],
                scopedServices: ['visualQueryGenerator', 'visualPlugin'],
                fn: function (conceptualSchemaProxy, displayNameService, singleExecutableDataProxyFactory, visualQueryGenerator, visualPlugin) { return powerbi.explore.services.createPinVisualService(conceptualSchemaProxy, displayNameService, singleExecutableDataProxyFactory.create(), visualQueryGenerator, visualPlugin); }
            });
        }]);
        function registerExploreDirective(className, services) {
            if (services === void 0) { services = []; }
            var directive = className[0].toLowerCase() + className.slice(1);
            services.push(function (a, b, c, d) { return new powerbi.explore.directives[className](a, b, c, d); });
            angular.module('powerbi.explore').directive(directive, services);
        }
        explore.registerExploreDirective = registerExploreDirective;
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//
/// <reference path="module.ts"/>
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var constants;
        (function (constants) {
            constants.DragResizeElementResizeStartEventName = 'DragResizeElementResizeStart';
            constants.DragResizeElementResizeMoveEventName = 'DragResizeElementResizeMove';
            constants.DragResizeElementResizeEndEventName = 'DragResizeElementResizeEnd';
            constants.DragResizeElementDragStartEventName = 'DragResizeElementDragStart';
            constants.DragResizeElementDragMoveEventName = 'DragResizeElementDragMove';
            constants.DragResizeElementDragEndEventName = 'DragResizeElementDragEnd';
            constants.scrollCarouselToEndEventName = 'scrollCarouselToEnd';
            constants.invalidVisualContainerId = -1;
        })(constants = explore.constants || (explore.constants = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = explore.services.events;
            var SemanticFilter = powerbi.data.SemanticFilter;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var AdvancedFilterController = (function () {
                function AdvancedFilterController($scope, services) {
                    this.scope = $scope;
                    this.services = services;
                    this.initialize();
                }
                AdvancedFilterController.createOptions = function () {
                    return {
                        additionalServices: ['conceptualSchemaProxy', 'telemetryService'],
                        scopedDependencies: ['eventBridge', 'undoRedoService'],
                    };
                };
                AdvancedFilterController.prototype.initialize = function () {
                    var _this = this;
                    this.advFilterCard = this.scope.viewModel.advFilterCard;
                    this.scope.applyFilter = function (e) { return _this.applyFilter(e); };
                    this.scope.areConditionsValid = function () { return _this.advFilterCard.areConditionsValid(); };
                    this.scope.dateOptions = { showWeeks: false };
                    this.updateRestatement();
                    this.getConceptualSchema().then(function (schema) {
                        _this.advFilterCard.loadOperators(schema);
                        if (!_this.advFilterCard.operators) {
                            _this.services.telemetryService.logEvent(powerbi.telemetry.EXLoadFilterError, 'Filter operators failed to load.');
                            return;
                        }
                        var expr = SQExprBuilder.fieldDef(_this.advFilterCard.field);
                        var metadata = expr.getMetadata(schema);
                        if (metadata)
                            _this.advFilterCard.isDateTime = !!metadata.type.dateTime;
                        _this.advFilterCard.ensureConditions();
                        _this.scope.viewModel.updateFilterProperties(schema);
                    }, function () {
                        _this.services.telemetryService.logEvent(powerbi.telemetry.EXLoadFilterError, 'Conceptual schema could not be found.');
                    });
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.filterContainerChanged, function (e, arg) { return _this.onFilterContainerChanged(arg); });
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                };
                AdvancedFilterController.prototype.applyFilter = function (e) {
                    var _this = this;
                    var filterDefinition = this.scope.viewModel;
                    var telemetryEvent = this.services.telemetryService.startEvent(powerbi.telemetry.EXFilterPaneAdvancedFilterApplied, filterDefinition.isVisualFilter, 2 /* Advanced */);
                    this.services.undoRedoService.register(function () {
                        return _this.getConceptualSchema().then(function (schema) {
                            var sqExpr = _this.advFilterCard.toSQExpr(schema);
                            if (sqExpr) {
                                filterDefinition.update(SemanticFilter.fromSQExpr(sqExpr));
                                var eventArg = {
                                    filter: filterDefinition.contract,
                                    changeType: 2 /* Update */,
                                    scope: filterDefinition.getScope(),
                                };
                                _this.updateRestatement();
                                _this.services.eventBridge.publishToChannel(events.filterContainerChanged, eventArg);
                                telemetryEvent.resolve();
                            }
                            else {
                                _this.services.telemetryService.logEvent(powerbi.telemetry.EXLoadFilterError, 'Unsupported filter expression.');
                                telemetryEvent.reject();
                            }
                        }, function () {
                            telemetryEvent.reject();
                        });
                    });
                };
                AdvancedFilterController.prototype.updateRestatement = function () {
                    var viewModel = this.scope.viewModel;
                    viewModel.restatement = this.advFilterCard.getRestatement();
                };
                AdvancedFilterController.prototype.getConceptualSchema = function () {
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    debug.assertValue(dataSources, 'Unable to find data source.');
                    return this.services.conceptualSchemaProxy.get(dataSources);
                };
                AdvancedFilterController.prototype.onFilterContainerChanged = function (arg) {
                    var viewModel = this.scope.viewModel;
                    if (arg.filter === viewModel.contract && arg.changeType === 2 /* Update */) {
                        var formatter = viewModel.formatter;
                        var tempViewModels = explore.viewModels.ViewModelFactory.convertAdvancedFilter(arg.filter, formatter);
                        this.advFilterCard.conditions = tempViewModels.conditions;
                        this.updateRestatement();
                        this.advFilterCard.ensureConditions();
                    }
                };
                return AdvancedFilterController;
            })();
            controllers.AdvancedFilterController = AdvancedFilterController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = explore.services.events;
            var FilterGeneratorUtils = powerbi.explore.services.filterGeneratorUtils;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var SQExprConverter = powerbi.data.SQExprConverter;
            var CategoricalFilterController = (function () {
                function CategoricalFilterController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.selectedValues = [];
                    this.services = services;
                    this.categoricalFilterCard = this.scope.viewModel.categoricalFilterCard;
                    this.scope.toggle = function (filterValue) { return _this.toggle(filterValue); };
                    this.scope.toggleAll = function () { return _this.toggleAll(); };
                    this.scope.scrollbarsConfig = {
                        ignoreOverlay: false,
                        ignoreMobile: false,
                    };
                    this.dataProxy = this.services.singleExecutableDataProxyFactory.create();
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.filterContainerChanged, function (e, arg) { return _this.onFilterContainerChanged(arg); });
                    // Watch for the filter card get expanded to get data for the categorical filter card. This is to prevent unnecessary call to the server.
                    // The filter restatement won't show up until we get dataview, because we need to have the column metadata to format the value.
                    var unbindWatch = this.scope.$watch('viewModel.readOnlyState.expanded', function (newValue, oldValue, $scope) {
                        if (newValue !== oldValue && newValue) {
                            _this.getValues();
                            unbindWatch();
                        }
                    });
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    if (this.scope.viewModel.readOnlyState && this.scope.viewModel.readOnlyState.expanded && !this.dataLoaded)
                        this.getValues();
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                        _this.updateRestatement(schema);
                        _this.scope.viewModel.updateFilterProperties(schema);
                    });
                }
                CategoricalFilterController.createOptions = function () {
                    return {
                        additionalServices: ['conceptualSchemaProxy', 'singleExecutableDataProxyFactory'],
                        scopedDependencies: ['eventBridge', 'undoRedoService', 'visualAuthoring', 'visualQueryGenerator'],
                    };
                };
                CategoricalFilterController.prototype.getValues = function () {
                    var _this = this;
                    var scope = this.scope;
                    var viewModel = scope.viewModel;
                    this.categoricalFilterCard.isLoading = true;
                    debug.assertValue(viewModel.readOnlyState, 'state');
                    debug.assert(viewModel.readOnlyState.expanded || this.dataLoaded, 'Try get data for a card that has never been expanded');
                    var dataSources = explore.ScopeUtils.findDataSources(scope);
                    var fieldSqExpr = SQExprBuilder.fieldDef(this.categoricalFilterCard.field);
                    var aggFieldSqExpr = SQExprBuilder.aggregate(fieldSqExpr, 5 /* CountNonNull */);
                    var options = {
                        expr: [fieldSqExpr, aggFieldSqExpr],
                        dataSources: dataSources,
                        allowAggregate: false
                    };
                    var inputFilter = FilterGeneratorUtils.calculateFilterContainerInputFilter(viewModel.contract, viewModel.getSectionScope(), viewModel.getVisualScope());
                    this.services.visualAuthoring.createVisualContainerConfig(options).then(function (config) {
                        _this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                            var generatedQuery = _this.services.visualQueryGenerator.execute({
                                dataSources: dataSources,
                                schema: schema,
                                query: config.singleVisual.query,
                                inputFilter: inputFilter,
                                dataViewMapping: [{
                                    table: {
                                        rows: { for: { in: 'value' } }
                                    },
                                }],
                            });
                            if (!generatedQuery)
                                return;
                            _this.dataProxy.execute(generatedQuery.options).then(function (result) {
                                if (result) {
                                    _this.onDataChanged(result.dataProviderResult.dataView, schema);
                                }
                            });
                        });
                    }).finally(function () {
                        _this.categoricalFilterCard.isLoading = false;
                    });
                    this.dataLoaded = true;
                };
                CategoricalFilterController.prototype.onDataChanged = function (dataView, schema) {
                    if (!dataView)
                        return;
                    this.clearFilterValuesAndCachedScopeIds();
                    var rows = dataView.table.rows;
                    if (!rows)
                        return;
                    var retainedValues = this.getRetainedValues(schema);
                    var isNot = retainedValues ? retainedValues.isNot : false;
                    this.categoricalFilterCard.allChecked = isNot;
                    var identities = dataView.table.identity;
                    var formatter = this.scope.viewModel.formatter;
                    for (var i = 0, len = rows.length; i < len; i++) {
                        var data = rows[i];
                        var scopeId = identities[i];
                        if (data && data.length === 2) {
                            var isRetained = retainedValues ? this.removeSelectedValueFromRetainedList(scopeId, retainedValues) : false;
                            var label = this.formatLabel(data[0], formatter);
                            var filterValue = {
                                label: label,
                                checked: retainedValues && isRetained === !isNot,
                                scopeId: scopeId,
                                count: data[1],
                            };
                            this.categoricalFilterCard.values.push(filterValue);
                            if (isRetained)
                                this.selectedValues.push(filterValue);
                        }
                    }
                    var populatedValues = this.categoricalFilterCard.values;
                    for (var i = 0, len = populatedValues.length; i < len; i++) {
                        // If the value is not selected, check if the value equals to any of the retained value using case insensitive comparision.
                        if (populatedValues[i].checked !== !isNot) {
                            var isRetained = retainedValues ? this.removeSelectedValueFromRetainedList(populatedValues[i].scopeId, retainedValues, true) : false;
                            if (isRetained) {
                                populatedValues[i].checked = !isNot;
                                this.selectedValues.push(populatedValues[i]);
                            }
                        }
                    }
                    // Add retained values that are not in the returned dataview to the value list.
                    if (retainedValues && retainedValues.scopeIds.length > 0) {
                        var values = retainedValues.scopeIds;
                        var isNot = isNot;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var retainedValueLabel = this.getLabel(values[i], formatter);
                            var filterValue = {
                                label: retainedValueLabel,
                                checked: !isNot,
                                scopeId: values[i],
                            };
                            this.categoricalFilterCard.values.push(filterValue);
                            this.selectedValues.push(filterValue);
                        }
                    }
                    this.updateAllCheckStatus();
                };
                CategoricalFilterController.prototype.onFilterContainerChanged = function (arg) {
                    var _this = this;
                    var viewModel = this.scope.viewModel;
                    if (arg.filter === viewModel.contract && arg.changeType === 2 /* Update */) {
                        if (!jsCommon.JsonComparer.equals(this.categoricalFilterCard.filter, arg.filter.filter)) {
                            this.categoricalFilterCard.filter = arg.filter.filter;
                            if (arg.filter.filter != null)
                                this.getValues();
                            else {
                                // When filter is cleared, just uncheck all the values.
                                var valuesList = this.categoricalFilterCard.values;
                                for (var i = 0, len = valuesList.length; i < len; i++) {
                                    valuesList[i].checked = false;
                                }
                                this.selectedValues = [];
                            }
                        }
                        this.updateAllCheckStatus();
                        var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                        this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                            _this.updateRestatement(schema);
                        });
                    }
                    else if (this.dataLoaded && viewModel.getSectionScope() === arg.scope.section) {
                        // Need to update the data if the data has been previously loaded, and the changed container is in the same page.
                        // For visual filter, call getValues if the changed filter is a page filter or the changed filter is a visual filter for the same visual.
                        // For section filter, only call getValues if the changed filter is a page filter.
                        if (viewModel.isVisualFilter && (!arg.scope.visualContainer || arg.scope.visualContainer === viewModel.getVisualScope()))
                            this.getValues();
                        else if (!viewModel.isVisualFilter && !arg.scope.visualContainer)
                            this.getValues();
                    }
                };
                CategoricalFilterController.prototype.toggle = function (filterValue) {
                    if (!filterValue)
                        return;
                    // Store the scopeId when it is !not and value is checked, or when it is not but value is !checked.
                    if (filterValue.checked === !this.categoricalFilterCard.allChecked) {
                        this.selectedValues.push(filterValue);
                    }
                    else {
                        for (var i = 0, len = this.selectedValues.length; i < len; i++) {
                            //We don't create new scopeId for filter values if there is already one, so object comparison is intentional.
                            if (filterValue.scopeId === this.selectedValues[i].scopeId) {
                                this.selectedValues.splice(i, 1);
                                break;
                            }
                        }
                    }
                    this.generateFilterAndPublishToChannel();
                };
                CategoricalFilterController.prototype.toggleAll = function () {
                    this.selectedValues = [];
                    var values = this.categoricalFilterCard.values;
                    var checked = this.categoricalFilterCard.allChecked;
                    for (var i = 0, len = values.length; i < len; i++) {
                        values[i].checked = checked;
                    }
                    this.generateFilterAndPublishToChannel();
                };
                CategoricalFilterController.prototype.generateFilterAndPublishToChannel = function () {
                    var _this = this;
                    this.services.undoRedoService.register(function () {
                        var filter = _this.generateSemanticFilter();
                        var filterDefinition = _this.scope.viewModel;
                        filterDefinition.update(filter);
                        var eventArg = {
                            filter: filterDefinition.contract,
                            changeType: 2 /* Update */,
                            scope: filterDefinition.getScope(),
                        };
                        _this.categoricalFilterCard.filter = filter;
                        _this.services.eventBridge.publishToChannel(events.filterContainerChanged, eventArg);
                    });
                };
                CategoricalFilterController.prototype.generateSemanticFilter = function () {
                    // TODO: when scrolling is enabled, we need to determine whether the values are top N or all. 
                    // But for now, if all the items got selected, then clear filter. 
                    if (this.selectedValues.length === this.categoricalFilterCard.values.length)
                        return;
                    var selectedScopeIds = _.map(this.selectedValues, function (v) { return v.scopeId; });
                    return powerbi.DataViewScopeIdentity.filterFromIdentity(selectedScopeIds, this.categoricalFilterCard.allChecked);
                };
                CategoricalFilterController.prototype.getLabel = function (scopeId, formatter) {
                    // TODO: Now we just make the best guess of the label for retained value that doesn't exist in the returned value list.
                    // To get the correct label, we may need to run a seperate query to get the label or enable dsq to support union. 
                    var label = SQExprConverter.getFirstComparandValue(scopeId);
                    return this.formatLabel(label, formatter);
                };
                // Compare the sqExpr of the current filter value with sqExprs of the retained filter values. 
                // If match found, remove the item from the retainedValues list. The returned boolean indicate if
                // the filter value need to be checked.
                CategoricalFilterController.prototype.removeSelectedValueFromRetainedList = function (scopeId, retainedValues, caseInsensitive) {
                    if (!scopeId || !retainedValues)
                        return;
                    for (var i = 0, len = retainedValues.scopeIds.length; i < len; i++) {
                        var retainedValueScopeId = retainedValues.scopeIds[i];
                        if (powerbi.DataViewScopeIdentity.equals(scopeId, retainedValueScopeId, caseInsensitive)) {
                            retainedValues.scopeIds.splice(i, 1);
                            return true;
                        }
                    }
                    return false;
                };
                CategoricalFilterController.prototype.getRetainedValues = function (federatedSchema) {
                    var filter = this.categoricalFilterCard.filter;
                    if (!filter)
                        return;
                    var field = this.scope.viewModel.categoricalFilterCard.field;
                    var sqExpr = SQExprBuilder.fieldDef(field);
                    var columnExprs = sqExpr.getKeyColumns(federatedSchema);
                    if (!columnExprs)
                        return;
                    return SQExprConverter.asScopeIdsContainer(filter, columnExprs);
                };
                CategoricalFilterController.prototype.clearFilterValuesAndCachedScopeIds = function () {
                    // Clear the old value list.
                    this.categoricalFilterCard.values = [];
                    this.selectedValues = [];
                };
                CategoricalFilterController.prototype.updateRestatement = function (schema) {
                    var viewModel = this.scope.viewModel;
                    var retainedValues = this.getRetainedValues(schema);
                    if (retainedValues && retainedValues.scopeIds.length > 0) {
                        var formatter = viewModel.formatter;
                        var labelsList = [];
                        var scopeIds = retainedValues.scopeIds;
                        for (var i = 0, len = scopeIds.length; i < len; i++) {
                            labelsList.push(this.getLabel(scopeIds[i], formatter));
                        }
                        var isNot = retainedValues ? retainedValues.isNot : false;
                        viewModel.restatement = explore.viewModels.RestatementHelper.fromLabels(labelsList, isNot);
                    }
                    else
                        viewModel.restatement = explore.viewModels.RestatementHelper.fromLabels([], false);
                };
                CategoricalFilterController.prototype.updateAllCheckStatus = function () {
                    var categoricalFilterCard = this.scope.viewModel.categoricalFilterCard;
                    var selectedCount = this.selectedValues.length;
                    var valuesCount = categoricalFilterCard.values.length;
                    if (valuesCount === 0) {
                        categoricalFilterCard.allChecked = false;
                        return;
                    }
                    if (selectedCount === 0) {
                        // When the selectedCount is 0, the check status of 'All' should be the same as the filter values.         
                        categoricalFilterCard.allChecked = categoricalFilterCard.values[0].checked;
                    }
                    else if (selectedCount === valuesCount) {
                        // When the selected count equals to the total value count, then all items has been selected, 
                        // then 'All' need to have the same check status as the rest of the filter values.
                        // Also, the selected values need to be cleared, because the not condition has changed.
                        categoricalFilterCard.allChecked = categoricalFilterCard.values[0].checked;
                        this.selectedValues = [];
                    }
                };
                CategoricalFilterController.prototype.formatLabel = function (label, formatter) {
                    if (formatter)
                        return formatter.format(label);
                    return label;
                };
                return CategoricalFilterController;
            })();
            controllers.CategoricalFilterController = CategoricalFilterController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var ColorPickerController = (function () {
                function ColorPickerController($scope, $services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = $services;
                    this.scope.togglePicker = function () { return _this.togglePicker(); };
                    this.scope.toggleWheel = function (event) { return _this.toggleWheel(event); };
                    this.scope.colorSelected = function (color) { return _this.colorSelected(color); };
                    this.scope.revertToDefault = function () { return _this.revertToDefault(); };
                    this.scope.viewModel = new explore.viewModels.ColorPickerModel;
                    this.scope.viewModel.themes = this.services.colorPickerService.getThemes();
                }
                ColorPickerController.createOptions = function () {
                    return {
                        scopedDependencies: ['colorPickerService']
                    };
                };
                ColorPickerController.prototype.colorSelected = function (color) {
                    if (color)
                        this.scope.viewModel.recentColors = this.services.colorPickerService.enqueueRecentColor(color);
                    this.scope.slice.value = color;
                    this.scope.save(this.scope.slice, this.scope.card);
                };
                ColorPickerController.prototype.togglePicker = function () {
                    this.scope.viewModel.recentColors = this.services.colorPickerService.getRecentColors();
                    this.scope.viewModel.isPickerOpen = !this.scope.viewModel.isPickerOpen;
                    if (!this.scope.viewModel.isPickerOpen) {
                        this.scope.viewModel.isWheelOpen = false;
                    }
                    this.services.colorPickerService.setCurrentInstance(this.scope.viewModel);
                };
                ColorPickerController.prototype.toggleWheel = function ($event) {
                    $event.stopPropagation();
                    this.scope.viewModel.isWheelOpen = !this.scope.viewModel.isWheelOpen;
                };
                ColorPickerController.prototype.revertToDefault = function () {
                    this.colorSelected(null);
                };
                return ColorPickerController;
            })();
            controllers.ColorPickerController = ColorPickerController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var commonConstants = powerbi.constants;
            var CanvasVisualUtility = explore.util.CanvasVisualsUtility;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var events = powerbi.explore.services.events;
            var selectionUtils = explore.services.selectionUtils;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var ExploreCanvasController = (function () {
                function ExploreCanvasController($scope, services) {
                    var _this = this;
                    this.uiScale = { x: 1, y: 1 };
                    this.scope = $scope;
                    this.model = $scope.viewModel;
                    this.services = services;
                    this.scope.clearSelection = function (e) {
                        _this.services.selectionService.clearSelection();
                        _this.services.overlayService.hideAll();
                        e.stopPropagation();
                    };
                    this.scope.keyDown = function (eventObj) { return _this.onKeyDown(eventObj); };
                    $scope.$on(commonConstants.dropEventName, function (event, originalEvent, args) { return _this.drop(originalEvent, args); });
                    this.services.eventBridge.subscribeToBubbling(this.scope, events.deleteVisualContainer, function (e, visualContainer) {
                        _this.services.visualAuthoring.deleteVisualContainer(visualContainer, _this.scope.viewModel);
                        if (e.stopPropagation)
                            e.stopPropagation();
                    });
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.selectionChanged, function () { return _this.updateZIndices(); });
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    this.scope.$watch('size', function (newSize) {
                        if (!newSize)
                            return;
                        _this.scope.useResponsiveLayout = newSize.width <= ExploreCanvasController.ResponsiveLayoutMaxWidthBreakpoint;
                        _this.updateSize();
                        _this.services.eventBridge.publishToChannel(events.canvasSizeChangedEvent);
                    });
                    this.scope.$watchCollection('viewModel.visualContainers', function () { return _this.scaleVisualContainersToCanvas(_this.uiScale); });
                }
                ExploreCanvasController.createOptions = function () {
                    return {
                        additionalServices: ['conceptualSchemaProxy', 'layoutInsertionHelper', 'telemetryService', 'overlayService'],
                        scopedDependencies: ['canvasKeyHandlerService', 'eventBridge', 'selectionService', 'clipboardService', 'undoRedoService', 'viewModeState', 'visualAuthoring'],
                    };
                };
                ExploreCanvasController.prototype.updateSize = function () {
                    var canvasSize = this.scope.size;
                    this.model = this.scope.viewModel;
                    if (!canvasSize || !this.model)
                        return;
                    this.uiScale = {
                        x: canvasSize.width / this.model.width,
                        y: canvasSize.height / this.model.height
                    };
                    this.scaleVisualContainersToCanvas(this.uiScale);
                };
                ExploreCanvasController.prototype.scaleVisualContainersToCanvas = function (scale) {
                    var _this = this;
                    this.model = this.scope.viewModel;
                    if (!this.model)
                        return;
                    var visualContainers = this.model.visualContainers;
                    for (var i = 0, len = visualContainers.length; i < len; i++) {
                        var visualContainer = visualContainers[i];
                        visualContainer.uiScale = scale;
                        if (!visualContainer.isPositioned) {
                            visualContainer.rawPosition = this.getEmptyRawCanvasSpaces();
                            visualContainer.rawPosition.z = visualContainers.length;
                        }
                        // don't draw if we're in responsive - this just ensures the layout is correct
                        if (!this.scope.useResponsiveLayout) {
                            visualContainer.overridePosition = null;
                            visualContainer.updateViewState();
                        }
                    }
                    if (!this.scope.useResponsiveLayout)
                        return;
                    var responsiveStackVerticalOffsetPx = 0;
                    // responsive layout render pass
                    // this avoids spaghetti code in this logic and also allows us to process items in a different order
                    var sortedVisualContainersByXY = _.sortBy(visualContainers, function (vc) { return vc.contract.position.y * _this.model.width + vc.contract.position.x; });
                    for (var j = 0; j < sortedVisualContainersByXY.length; j++) {
                        var visualContainer = sortedVisualContainersByXY[j];
                        var currentPosition = visualContainer.position;
                        responsiveStackVerticalOffsetPx += 20;
                        visualContainer.overridePosition = {
                            width: this.scope.size.width - (ExploreCanvasController.AutoLayoutVisualSkittlesRightPadding * 2) - 20,
                            height: currentPosition.height,
                            x: ExploreCanvasController.AutoLayoutVisualSkittlesRightPadding,
                            y: responsiveStackVerticalOffsetPx,
                        };
                        responsiveStackVerticalOffsetPx += Math.round(currentPosition.height);
                        visualContainer.updateViewState();
                    }
                };
                ExploreCanvasController.prototype.updateZIndices = function () {
                    this.model = this.scope.viewModel;
                    var selectedVisual = selectionUtils.getSelectedVisual(this.services.selectionService);
                    if (!selectedVisual || !this.model)
                        return;
                    var containers = this.model.visualContainers.slice();
                    var selectedContainer = CanvasVisualUtility.findVisualContainerViewModel(this.scope.viewModel.visualContainers, selectedVisual);
                    selectedContainer.contract.position.z = containers.length;
                    var sortedContainers = containers.sort(this.sortContainersByZIndex);
                    for (var i = 0; i < sortedContainers.length; i++) {
                        var container = sortedContainers[i];
                        container.contract.position.z = i;
                        container.updateViewState();
                    }
                };
                ExploreCanvasController.prototype.getEmptyRawCanvasSpaces = function () {
                    // IMPORTANT: This logic needs to run on the contract pixel values
                    //            - the canvas could be in a different display mode, eg responsive layout
                    if (this.scope.size) {
                        var canvasRect = { x: 0, y: 0, width: this.model.width, height: this.model.height };
                        // generate pixel rounded dimensions to calculate against
                        var itemRects = _.map(this.model.visualContainers, function (visualContainer) {
                            var pos = visualContainer.rawPosition;
                            return {
                                x: Math.round(pos.x),
                                y: Math.round(pos.y),
                                width: Math.round(pos.width),
                                height: Math.round(pos.height)
                            };
                        });
                        var targetRects = this.services.layoutInsertionHelper.getEmptySpaces(canvasRect, itemRects);
                        // return the optimal position
                        if (targetRects.length > 0) {
                            // TODO: Pick the most optimal target space for the visual type - currently just selecting the first space
                            var targetSpace = targetRects[0];
                            // clamp the resulting space to prevent visuals from taking up overly large regions - eg, the entire canvas
                            targetSpace.height = Math.min(targetSpace.height, ExploreCanvasController.AutoLayoutMaxSpaceHeight);
                            targetSpace.width = Math.min(targetSpace.width, ExploreCanvasController.AutoLayoutMaxSpaceWidth);
                            // TEMPORARY: Account for skittles edge case
                            var isCanvasRightAligned = (targetSpace.x + targetSpace.width) === canvasRect.width;
                            if (isCanvasRightAligned)
                                targetSpace.width -= ExploreCanvasController.AutoLayoutVisualSkittlesRightPadding;
                            // we need to slightly inset the block so we're not directly against an edge
                            targetSpace.x += ExploreCanvasController.AutoLayoutVisualPadding;
                            targetSpace.y += ExploreCanvasController.AutoLayoutVisualPadding;
                            targetSpace.width -= ExploreCanvasController.AutoLayoutVisualPadding * 2;
                            targetSpace.height -= ExploreCanvasController.AutoLayoutVisualPadding * 2;
                            return targetSpace;
                        }
                    }
                    // return the default position
                    return { x: 100, y: 100, width: 300, height: 300 };
                };
                ExploreCanvasController.prototype.sortContainersByZIndex = function (a, b) {
                    var zA = a.contract.position.z || 0;
                    var zB = b.contract.position.z || 0;
                    if (zA < zB)
                        return -1;
                    if (zA > zB)
                        return 1;
                    return 0;
                };
                ExploreCanvasController.prototype.drop = function (eventObj, args) {
                    var value = args.dragData;
                    debug.assertValue(value, 'Drag-drop data is unavailable.');
                    var x = (eventObj.originalEvent ? eventObj.originalEvent.offsetX : 0) / this.uiScale.x;
                    var y = (eventObj.originalEvent ? eventObj.originalEvent.offsetY : 0) / this.uiScale.y;
                    if (value.source && value.data) {
                        var sourceWireContract = value.source;
                        var filter = powerbi.DataViewScopeIdentity.filterFromIdentity([value.data]);
                        var visual = this.services.visualAuthoring.copyVisualWithFilter(sourceWireContract, filter, x, y);
                        var exploreCanvas = this.scope.viewModel;
                        exploreCanvas.contract.visualContainers.push(visual);
                        var model = explore.viewModels.ViewModelFactory.convertVisualContainer(exploreCanvas.contract, visual);
                        // TODO : convert filter into correct filter type
                        exploreCanvas.visualContainers.push(model);
                        this.scope.$apply();
                        selectionUtils.selectVisualContainer(visual, this.services.selectionService);
                    }
                    else if (value.field) {
                        var width = 300;
                        var height = 300;
                        x = CanvasVisualUtility.checkBoundaryForCharts(x, width, this.model.width);
                        y = CanvasVisualUtility.checkBoundaryForCharts(y, height, this.model.height);
                        this.addVisual(SQExprBuilder.fieldDef(value.field), {
                            x: x,
                            y: y,
                            z: 0,
                            width: width,
                            height: height
                        });
                    }
                    eventObj.preventDefault();
                    eventObj.stopPropagation();
                };
                ExploreCanvasController.prototype.addVisual = function (expr, position) {
                    var _this = this;
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    if (dataSources) {
                        this.services.visualAuthoring.addVisualContainer(expr, dataSources, this.scope.viewModel, position).then(function (visualContainer) {
                            _this.services.telemetryService.logEvent(powerbi.telemetry.EXCreateVisual, 1 /* DraggedToCanvas */, VisualContainerUtils.getVisualType(visualContainer));
                        });
                    }
                };
                ExploreCanvasController.prototype.onKeyDown = function (eventObj) {
                    return this.services.canvasKeyHandlerService.onKeyDown(eventObj, this.scope.viewModel);
                };
                ExploreCanvasController.AutoLayoutVisualPadding = 10;
                ExploreCanvasController.AutoLayoutVisualSkittlesRightPadding = 30;
                ExploreCanvasController.AutoLayoutMaxSpaceHeight = 400;
                ExploreCanvasController.AutoLayoutMaxSpaceWidth = 400;
                ExploreCanvasController.ResponsiveLayoutMaxWidthBreakpoint = 500;
                return ExploreCanvasController;
            })();
            controllers.ExploreCanvasController = ExploreCanvasController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            (function (AppBarActions) {
                // File Menu
                AppBarActions[AppBarActions["SaveToDashboard"] = 0] = "SaveToDashboard";
                AppBarActions[AppBarActions["SaveAs"] = 1] = "SaveAs";
            })(controllers.AppBarActions || (controllers.AppBarActions = {}));
            var AppBarActions = controllers.AppBarActions;
            var ExplorationAppBarController = (function () {
                function ExplorationAppBarController($scope, $services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = $services;
                    this.scope.viewModeState = this.services.viewModeState;
                    this.scope.save = function () { return _this.save(); };
                    this.scope.edit = function () { return _this.services.eventBridge.publishToChannel(events.changeEditMode, true); };
                    this.scope.stopEditing = function () { return _this.services.eventBridge.publishToChannel(events.changeEditMode, false); };
                    this.scope.fileMenuActionSelected = function (selectedItem) { return _this.onFileMenuActionSelected(selectedItem); };
                    this.scope.insertTextbox = function () { return _this.insertTextbox(); };
                    var fileMenuActions = this.scope.fileMenuActions = [
                        {
                            text: this.services.localizationService.get('ReportAppBar_SaveAs'),
                            description: this.services.localizationService.get('ReportAppBar_SaveAsDescription'),
                            action: 1 /* SaveAs */,
                            itemClass: 'saveAs',
                            type: 0 /* Item */
                        }
                    ];
                    this.scope.fileMenuActionSelected = function (selectedItem) { return _this.onFileMenuActionSelected(selectedItem); };
                    // Show/Hide the 'Save' option;
                    this.scope.$watch('viewModeState.viewMode', function (viewMode) {
                        var isEditing = viewMode === 1 /* Edit */;
                        if (isEditing && fileMenuActions.length === 1) {
                            _this.scope.$emit('EditMode');
                            fileMenuActions.unshift({
                                text: _this.services.localizationService.get('ReportAppBar_SaveToDashboard'),
                                description: _this.services.localizationService.get('ReportAppBar_SaveToDashboardDescription'),
                                action: 0 /* SaveToDashboard */,
                                itemClass: 'saveToDashboard',
                                type: 0 /* Item */
                            });
                        }
                        else if (!isEditing && fileMenuActions.length === 2) {
                            _this.scope.$emit('ViewMode');
                            fileMenuActions.shift();
                        }
                    });
                }
                ExplorationAppBarController.createOptions = function () {
                    return {
                        additionalServices: ['localizationService'],
                        scopedDependencies: ['eventBridge', 'viewModeState']
                    };
                };
                ExplorationAppBarController.prototype.insertTextbox = function () {
                    this.services.eventBridge.publishBubbling(this.scope, events.createTextbox);
                };
                ExplorationAppBarController.prototype.onFileMenuActionSelected = function (selectedItem) {
                    switch (selectedItem.action) {
                        case 0 /* SaveToDashboard */:
                            this.save();
                            break;
                        case 1 /* SaveAs */:
                            this.services.eventBridge.publishBubbling(this.scope, events.saveAsExploration);
                            break;
                    }
                };
                ExplorationAppBarController.prototype.save = function () {
                    this.services.eventBridge.publishBubbling(this.scope, events.saveExploration);
                };
                return ExplorationAppBarController;
            })();
            controllers.ExplorationAppBarController = ExplorationAppBarController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var ExplorationHostController = (function () {
                function ExplorationHostController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.services.eventBridge.setBubblingScope($scope).subscribe(events.switchSection, function (e, args) { return _this.onSwitchSection(e, args); }).subscribe(events.createSection, function (e, args) { return _this.onCreateSection(e); }).subscribe(events.deleteSection, function (e, args) { return _this.onDeleteSection(e, args); }).subscribe(events.reorderSection, function (e, args) { return _this.onReorderSection(e, args); }).subscribe(events.visualConversion, function (e, args) { return _this.onVisualConversion(args); }).subscribe(events.undo, function (e, args) { return services.undoRedoService.undo(); }).subscribe(events.redo, function (e, args) { return services.undoRedoService.redo(); });
                }
                ExplorationHostController.createOptions = function () {
                    return {
                        additionalServices: ['telemetryService'],
                        scopedDependencies: ['eventBridge', 'sectionNavigationService', 'selectionService', 'undoRedoService', 'visualAuthoring'],
                    };
                };
                ExplorationHostController.prototype.onSwitchSection = function (e, targetSectionIndex) {
                    if (this.scope.viewModel.exploration) {
                        var sections = this.scope.viewModel.exploration.sections;
                        var changeSection = true;
                        for (var i = 0, len = sections.length; i < len; i++) {
                            if (this.scope.viewModel.exploration.sections[i].selected === true && i === targetSectionIndex)
                                changeSection = false;
                        }
                        if (changeSection)
                            explore.SectionUtils.gotoSection(this.scope.viewModel, targetSectionIndex, this.services.selectionService, this.services.sectionNavigationService);
                    }
                    if (e.stopPropagation)
                        e.stopPropagation();
                };
                ExplorationHostController.prototype.onCreateSection = function (e) {
                    var _this = this;
                    if (this.scope.viewModel.exploration) {
                        this.services.undoRedoService.register(function () {
                            explore.SectionUtils.createSection(_this.scope.viewModel, _this.services.selectionService, _this.services.sectionNavigationService);
                        });
                        if (e.stopPropagation)
                            e.stopPropagation();
                    }
                };
                ExplorationHostController.prototype.onDeleteSection = function (e, targetSectionIndex) {
                    var _this = this;
                    if (this.scope.viewModel.exploration) {
                        this.services.undoRedoService.register(function () {
                            explore.SectionUtils.deleteSection(_this.scope.viewModel, targetSectionIndex, _this.services.selectionService, _this.services.sectionNavigationService);
                        });
                        if (e.stopPropagation)
                            e.stopPropagation();
                    }
                };
                ExplorationHostController.prototype.onReorderSection = function (e, reorderEventArgs) {
                    var _this = this;
                    this.services.undoRedoService.register(function () {
                        return explore.SectionUtils.reorderSection(_this.scope.viewModel, reorderEventArgs.originalIndex, reorderEventArgs.targetIndex);
                    });
                    if (e.stopPropagation)
                        e.stopPropagation();
                    // Reorder is special in that to animate immediately, this needs to do a scope apply at the end of the drop logic.
                    this.scope.$apply();
                };
                ExplorationHostController.prototype.onVisualConversion = function (args) {
                    var _this = this;
                    this.services.undoRedoService.register(function () {
                        return _this.services.visualAuthoring.convert(args.visualContainer, explore.ScopeUtils.findDataSources(_this.scope), args.newVisualType).then(function () {
                            if (args.actionAfterConversion) {
                                args.actionAfterConversion();
                            }
                        });
                    });
                };
                return ExplorationHostController;
            })();
            controllers.ExplorationHostController = ExplorationHostController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var ExplorationNavigationTabController = (function () {
                function ExplorationNavigationTabController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.scope.tabIndex = $scope.tabIndex;
                    this.scope.viewModel.isTabEditable = false;
                    this.services = services;
                    this.scope.eventBridge = this.services.eventBridge;
                    this.scope.renameTab = function (newName, index) { return _this.renameTab(newName, _this.scope.tabIndex); };
                    this.scope.changeSection = function (index) { return _this.changeSection(index); };
                    this.scope.deleteSection = function (index) { return _this.deleteSection(index); };
                    this.scope.$on(powerbi.constants.editableLabelOnBlurEventName, function (event) {
                        _this.scope.viewModel.isTabEditable = false;
                    });
                }
                ExplorationNavigationTabController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge'],
                    };
                };
                ExplorationNavigationTabController.prototype.renameTab = function (newName, index) {
                    this.scope.viewModel.displayName = newName;
                    var renameSectionArgs = {
                        sectionNewName: newName,
                        sectionIndex: index
                    };
                    this.scope.toggleDraggable(true);
                    this.services.eventBridge.publishBubbling(this.scope, events.renameTab, renameSectionArgs);
                };
                ExplorationNavigationTabController.prototype.deleteSection = function (index) {
                    this.services.eventBridge.publishBubbling(this.scope, events.deleteSection, index);
                };
                ExplorationNavigationTabController.prototype.changeSection = function (index) {
                    this.services.eventBridge.publishBubbling(this.scope, events.switchSection, index);
                };
                return ExplorationNavigationTabController;
            })();
            controllers.ExplorationNavigationTabController = ExplorationNavigationTabController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var ExplorationNavigationController = (function () {
                function ExplorationNavigationController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.eventBridge = this.services.eventBridge;
                    this.scope.viewModeState = this.services.viewModeState;
                    this.scope.collapsePane = function () { return _this.scope.viewModel.isNavPaneCollapsed = true; };
                    this.scope.expandPane = function () { return _this.scope.viewModel.isNavPaneCollapsed = false; };
                    this.scope.createSection = function () { return _this.services.eventBridge.publishBubbling(_this.scope, events.createSection); };
                    this.scope.createImage = function (createImageEventArgs) { return _this.services.eventBridge.publishBubbling(_this.scope, events.createImage, createImageEventArgs); };
                    this.scope.changeSection = function (index) { return _this.services.eventBridge.publishBubbling(_this.scope, events.switchSection, index); };
                    this.scope.deleteSection = function (index) { return _this.services.eventBridge.publishBubbling(_this.scope, events.deleteSection, index); };
                    this.services.eventBridge.subscribeToBubbling(this.scope, events.renameTab, function (event, args) { return _this.renameTab(event, args); });
                }
                ExplorationNavigationController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge', 'viewModeState', 'undoRedoService'],
                    };
                };
                ExplorationNavigationController.prototype.renameTab = function (event, renameSectionEventArgs) {
                    var _this = this;
                    this.services.undoRedoService.register(function () {
                        explore.SectionUtils.renameSection(_this.scope.viewModel, renameSectionEventArgs.sectionNewName, renameSectionEventArgs.sectionIndex);
                    });
                    if (event.stopPropagation)
                        event.stopPropagation();
                };
                return ExplorationNavigationController;
            })();
            controllers.ExplorationNavigationController = ExplorationNavigationController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var ExplorationPaginatorController = (function () {
                function ExplorationPaginatorController($scope, $services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = $services;
                    this.scope.prev = function () { return _this.prev(); };
                    this.scope.next = function () { return _this.next(); };
                    this.scope.togglePane = function () { return _this.togglePane(); };
                    this.scope.getSelectedPageIndex = function () { return _this.getSelectedPageIndex(); };
                }
                ExplorationPaginatorController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge'],
                    };
                };
                ExplorationPaginatorController.prototype.prev = function () {
                    var currentSectionNumber = this.getSelectedPageIndex();
                    if (currentSectionNumber !== undefined) {
                        var targetSectionIndex = currentSectionNumber - 1;
                        if (targetSectionIndex > -1)
                            this.services.eventBridge.publishBubbling(this.scope, events.switchSection, targetSectionIndex);
                    }
                };
                ExplorationPaginatorController.prototype.next = function () {
                    var currentSectionNumber = this.getSelectedPageIndex();
                    if (currentSectionNumber !== undefined) {
                        var targetSectionIndex = currentSectionNumber + 1;
                        if (targetSectionIndex < this.scope.viewModel.exploration.sections.length)
                            this.services.eventBridge.publishBubbling(this.scope, events.switchSection, targetSectionIndex);
                    }
                };
                ExplorationPaginatorController.prototype.togglePane = function () {
                    // TODO: Support picking the specific pane akin to reports.
                };
                ExplorationPaginatorController.prototype.getSelectedPageIndex = function () {
                    if (this.scope.viewModel.exploration) {
                        var sections = this.scope.viewModel.exploration.sections;
                        for (var i = sections.length - 1; i >= 0; --i) {
                            if (sections[i].selected)
                                return i;
                        }
                    }
                };
                return ExplorationPaginatorController;
            })();
            controllers.ExplorationPaginatorController = ExplorationPaginatorController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var ExplorationStatusBarController = (function () {
                function ExplorationStatusBarController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.startEditing = function () { return _this.services.eventBridge.publishToChannel(events.changeEditMode, true); };
                    this.scope.stopEditing = function () { return _this.services.eventBridge.publishToChannel(events.changeEditMode, false); };
                }
                ExplorationStatusBarController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge'],
                    };
                };
                return ExplorationStatusBarController;
            })();
            controllers.ExplorationStatusBarController = ExplorationStatusBarController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var modelAuthoringUtility = powerbi.explore.util.ModelAuthoringUtility;
            var schemaItemActivationUtils = explore.services.schemaItemActivationUtils;
            var selectionUtils = explore.services.selectionUtils;
            var FieldListController = (function () {
                function FieldListController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.scrollbarsConfig = {
                        ignoreOverlay: false,
                        ignoreMobile: false,
                    };
                    this.scope.$on(explore.constants.explorationLoadedEventName, function () { return _this.explorationLoaded(); });
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.modelChanged, function (eventObject, modelChangeResult) { return _this.explorationLoaded(modelChangeResult); }).subscribe(events.selectionChanged, function () { return _this.updateChecked(); }).subscribe(events.visualContainerChanged, function () { return _this.updateChecked(); }).subscribe(events.selectionChanged, function () { return _this.unselect(); }).subscribe(events.modelingContextChanged, function () { return _this.unselect(); }).subscribe(events.measureCreated, function (eventObject, data) { return _this.onMeasureCreated(data); }).subscribe(events.calculatedColumnCreated, function (eventObject, data) { return _this.onCalculatedColumnCreated(data); });
                    this.services.eventBridge.subscribeToBubbling($scope, explore.viewModels.FieldListEvents.fieldListAction, function (e, args) { return _this.processFieldListAction(e, args); });
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    this.scope.unselect = function () { return _this.unselect(); };
                    this.explorationLoaded();
                }
                FieldListController.createOptions = function () {
                    return {
                        additionalServices: ['conceptualSchemaProxy'],
                        scopedDependencies: ['eventBridge', 'modelAuthoring', 'selectionService', 'shellService', 'schemaItemActivationService'],
                    };
                };
                FieldListController.prototype.explorationLoaded = function (modelChangeResult) {
                    var _this = this;
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    if (!dataSources) {
                        this.clearModel();
                        return;
                    }
                    this.services.conceptualSchemaProxy.get(dataSources).then(function (model) { return _this.loadModel(model, dataSources, modelChangeResult); }, function () { return _this.clearModel(); });
                };
                FieldListController.prototype.clearModel = function () {
                    this.loadModel(null);
                };
                FieldListController.prototype.loadModel = function (contract, dataSources, modelChangeResult) {
                    var schemaName;
                    if (dataSources && dataSources.length > 0)
                        schemaName = dataSources[0].name;
                    this.scope.viewModel = explore.viewModels.FieldListViewModelMerger.mergeModel(this.scope.viewModel, contract, schemaName, modelChangeResult);
                    if (this.scope.viewModel.schema) {
                        this.scope.modelChangeEnabled = this.scope.viewModel.schema.canEdit;
                        this.scope.viewModel.schema.showHidden = this.services.shellService.canShowHiddenSchemaItem();
                    }
                    this.updateChecked();
                    this.updateMenuCheckStatus();
                    this.updateUnsupportedProperties();
                };
                FieldListController.prototype.updateMenuCheckStatus = function () {
                    var schema = this.getConceptualModel();
                    if (!schema)
                        return;
                    explore.viewModels.FieldListViewModelFactory.updateAllMenuItemsCheckStatus(schema);
                };
                FieldListController.prototype.updateUnsupportedProperties = function () {
                    var schema = this.getConceptualModel();
                    if (!schema)
                        return;
                    explore.viewModels.FieldListViewModelFactory.updateSupportedProperties(schema);
                };
                FieldListController.prototype.updateChecked = function () {
                    var schema = this.getConceptualModel();
                    if (!schema)
                        return;
                    for (var i = 0, len = schema.entities.length; i < len; ++i) {
                        var entity = schema.entities[i];
                        entity.hasCheckedProperties = false;
                        for (var j = 0, jlen = entity.properties.length; j < jlen; ++j)
                            entity.properties[j].checked = false;
                    }
                    var selectedVisual = selectionUtils.getSelectedVisual(this.services.selectionService);
                    if (!selectedVisual)
                        return;
                    // Update the checked state based on the first checked item
                    if (selectedVisual.config.singleVisual && selectedVisual.config.singleVisual.query && selectedVisual.config.singleVisual.query.defn) {
                        var properties = selectedVisual.config.singleVisual.query.defn.select();
                        for (var i = 0, len = properties.length; i < len; ++i) {
                            var fieldDef = properties[i].expr.asFieldDef();
                            if (fieldDef) {
                                var field = schema.findProperty(fieldDef.entity, fieldDef.column || fieldDef.measure);
                                if (field) {
                                    field.checked = true;
                                    field.entity.hasCheckedProperties = true;
                                }
                            }
                        }
                    }
                };
                FieldListController.prototype.unselect = function () {
                    var schema = this.scope.viewModel.schema;
                    if (!schema)
                        return;
                    if (this.scope.modelChangeEnabled) {
                        for (var i = 0, len = schema.entities.length; i < len; ++i) {
                            var entity = schema.entities[i];
                            entity.selected = false;
                            for (var j = 0, jlen = entity.properties.length; j < jlen; ++j) {
                                entity.properties[j].selected = false;
                            }
                        }
                        this.services.schemaItemActivationService.clearActiveItem();
                    }
                };
                FieldListController.prototype.onMeasureCreated = function (data) {
                    explore.viewModels.FieldListViewModelFactory.updateSelection(this.scope.viewModel.schema, data);
                    schemaItemActivationUtils.setActiveSchemaItem(this.services.schemaItemActivationService, this.scope.viewModel.schema.schemaName, data.entity, data.measure);
                };
                FieldListController.prototype.onCalculatedColumnCreated = function (data) {
                    explore.viewModels.FieldListViewModelFactory.updateSelection(this.scope.viewModel.schema, data);
                    schemaItemActivationUtils.setActiveSchemaItem(this.services.schemaItemActivationService, this.scope.viewModel.schema.schemaName, data.entity, data.column);
                };
                FieldListController.prototype.processFieldListAction = function (e, args) {
                    var schema = this.getConceptualModel();
                    if (!schema)
                        return;
                    switch (args.action) {
                        case 0 /* Hide */:
                            var isHidden = explore.viewModels.FieldListViewModelFactory.toggleHide(this.scope.viewModel.schema, args.fieldDef);
                            // unselect -> set active schema item to null on hide
                            if (isHidden && !schema.showHidden)
                                this.unselect();
                            modelAuthoringUtility.hide(args.fieldDef, isHidden, this.services.modelAuthoring);
                            break;
                        case 4 /* Delete */:
                            explore.viewModels.FieldListViewModelFactory.deleteItem(this.scope.viewModel.schema, args.fieldDef);
                            modelAuthoringUtility.deleteItem(args.fieldDef, this.services.modelAuthoring);
                            break;
                        case 1 /* ShowHidden */:
                            explore.viewModels.FieldListViewModelFactory.toggleShowHidden(this.scope.viewModel.schema);
                            this.services.shellService.setShowHiddenSchemaItem(schema.showHidden);
                            break;
                        case 2 /* UnhideAll */:
                            explore.viewModels.FieldListViewModelFactory.unhideAll(this.scope.viewModel.schema);
                            var fieldDef = {
                                schema: this.scope.viewModel.schema.schemaName,
                                entity: null
                            };
                            modelAuthoringUtility.hide(fieldDef, false, this.services.modelAuthoring);
                            break;
                        case 3 /* Select */:
                            explore.viewModels.FieldListViewModelFactory.updateSelection(this.scope.viewModel.schema, args.fieldDef);
                            break;
                        case 5 /* NewMeasure */:
                            modelAuthoringUtility.createMeasure({
                                schema: this.scope.viewModel.schema.schemaName,
                                entity: args.fieldDef.entity,
                            }, this.services.modelAuthoring);
                            break;
                        case 6 /* NewColumn */:
                            modelAuthoringUtility.createCalculatedColumn({
                                schema: this.scope.viewModel.schema.schemaName,
                                entity: args.fieldDef.entity,
                            }, this.services.modelAuthoring);
                            break;
                    }
                    e.stopPropagation();
                };
                FieldListController.prototype.getConceptualModel = function () {
                    if (!this.scope.viewModel)
                        return;
                    return this.scope.viewModel.schema;
                };
                return FieldListController;
            })();
            controllers.FieldListController = FieldListController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var schemaItemActivationUtils = explore.services.schemaItemActivationUtils;
            var FieldListEntityController = (function () {
                function FieldListEntityController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.toggle = function ($event) { return _this.toggle($event); };
                    this.scope.select = function () { return _this.select(); };
                    this.scope.selectMenuItem = function (menuItem) { return _this.selectMenuItem(menuItem); };
                    this.scope.editLabel = function () { return _this.editLabel(); };
                    this.scope.rename = function (newName) { return _this.rename(newName); };
                    this.scope.isNameValid = function (newName) { return _this.isNameValid(newName); };
                    if (this.scope.viewModel.schema)
                        this.scope.modelChangeEnabled = this.scope.viewModel.schema.canEdit;
                    this.scope.$on(powerbi.constants.editableLabelOnBlurEventName, function (event) {
                        _this.scope.viewModel.isEditingLabel = false;
                    });
                }
                FieldListEntityController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge', 'schemaItemActivationService', 'modelAuthoring'],
                    };
                };
                FieldListEntityController.prototype.toggle = function ($event) {
                    var viewModel = this.scope.viewModel;
                    viewModel.expanded = !viewModel.expanded;
                    this.select();
                    $event.stopPropagation();
                };
                FieldListEntityController.prototype.select = function () {
                    if (!this.scope.modelChangeEnabled)
                        return;
                    var viewModel = this.scope.viewModel;
                    schemaItemActivationUtils.setActiveSchemaItem(this.services.schemaItemActivationService, viewModel.schemaName, viewModel.name);
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 3 /* Select */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListEntityController.prototype.fieldDef = function () {
                    var viewModel = this.scope.viewModel;
                    return {
                        schema: viewModel.schemaName,
                        entity: viewModel.name
                    };
                };
                FieldListEntityController.prototype.selectMenuItem = function (menuItem) {
                    debug.assertValue(menuItem, "Expected a menu item.");
                    switch (menuItem.action) {
                        case 4 /* Rename */:
                            this.editLabel();
                            break;
                        case 1 /* Hide */:
                            this.toggleHidden();
                            break;
                        case 5 /* Delete */:
                            this.delete();
                            break;
                        case 2 /* ViewHidden */:
                            this.viewHidden();
                            break;
                        case 3 /* UnhideAll */:
                            this.unHideAll();
                            break;
                        case 6 /* NewMeasure */:
                            this.addMeasure();
                            break;
                        case 7 /* NewColumn */:
                            this.addColumn();
                            break;
                        default:
                            debug.assertFail("Invalid action.");
                            break;
                    }
                };
                FieldListEntityController.prototype.toggleHidden = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 0 /* Hide */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListEntityController.prototype.viewHidden = function () {
                    var eventArg = {
                        action: 1 /* ShowHidden */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListEntityController.prototype.unHideAll = function () {
                    var eventArg = {
                        action: 2 /* UnhideAll */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListEntityController.prototype.editLabel = function () {
                    if (this.scope.modelChangeEnabled) {
                        this.scope.viewModel.isEditingLabel = true;
                        this.scope.toggleDraggable(false);
                    }
                };
                FieldListEntityController.prototype.rename = function (newName) {
                    this.scope.toggleDraggable(false);
                    if (!this.isNameValid(newName))
                        return;
                    powerbi.explore.util.ModelAuthoringUtility.rename(this.fieldDef(), newName, this.services.modelAuthoring);
                    this.scope.viewModel.contract.name = newName;
                };
                FieldListEntityController.prototype.isNameValid = function (newName) {
                    var viewModel = this.scope.viewModel;
                    if (!viewModel.schema)
                        return true;
                    var dupEntity = viewModel.schema.findEntity(newName);
                    var isNullOrWhiteSpace = jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(newName);
                    return !dupEntity && !isNullOrWhiteSpace;
                };
                FieldListEntityController.prototype.delete = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 4 /* Delete */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListEntityController.prototype.addMeasure = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 5 /* NewMeasure */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListEntityController.prototype.addColumn = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 6 /* NewColumn */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                return FieldListEntityController;
            })();
            controllers.FieldListEntityController = FieldListEntityController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var ConceptualDefaultAggregate = powerbi.data.ConceptualDefaultAggregate;
            var ConceptualPropertyKind = powerbi.data.ConceptualPropertyKind;
            var events = powerbi.explore.services.events;
            var selectionUtils = explore.services.selectionUtils;
            var schemaItemActivationUtils = explore.services.schemaItemActivationUtils;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            // Used to create a unique ID for elements to bind to
            var uniqueElementId = 0;
            var FieldListPropertyController = (function () {
                function FieldListPropertyController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.toggle = function ($event) { return _this.toggle($event); };
                    this.scope.select = function ($event) { return _this.select($event); };
                    this.scope.getDragContext = function () { return _this.getDragContext(); };
                    this.scope.editLabel = function () { return _this.editLabel(); };
                    this.scope.rename = function (newName) { return _this.rename(newName); };
                    this.scope.isNameValid = function (newName) { return _this.isNameValid(newName); };
                    this.scope.elementId = this.createUniqueId();
                    this.scope.getIconClassName = function (property) { return _this.getIconClassName(property); };
                    this.scope.selectMenuItem = function (menuItem) { return _this.selectMenuItem(menuItem); };
                    powerbi.common.localize.ensureLocalization(function () {
                        _this.scope.tooltipTitle = function () {
                            if (_this.scope.viewModel.entity) {
                                return jsCommon.StringExtensions.format(_this.services.localizationService.get('Field_Tooltip'), _this.scope.viewModel.entity.displayName, _this.scope.viewModel.displayName);
                            }
                            else {
                                return _this.scope.viewModel.displayName;
                            }
                        };
                    });
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(explore.services.events.selectionChanged, function () { return _this.updateSelection(); });
                    this.scope.$on(powerbi.constants.editableLabelOnBlurEventName, function (event) {
                        _this.scope.viewModel.isEditingLabel = false;
                    });
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    this.updateSelection();
                }
                FieldListPropertyController.createOptions = function () {
                    return {
                        additionalServices: ['telemetryService', 'localizationService'],
                        scopedDependencies: ['eventBridge', 'schemaItemActivationService', 'selectionService', 'visualAuthoring', 'modelAuthoring'],
                    };
                };
                FieldListPropertyController.prototype.createUniqueId = function () {
                    return "fieldListProp_" + (++uniqueElementId);
                };
                FieldListPropertyController.prototype.toggle = function ($event) {
                    if (this.scope.viewModel.checked)
                        this.addField();
                    else
                        this.removeField();
                    $event.stopPropagation();
                };
                FieldListPropertyController.prototype.addField = function () {
                    var _this = this;
                    var expr = powerbi.data.SQExprBuilder.fieldDef(this.fieldDef());
                    var selectedVisuals = selectionUtils.getSelectedVisuals(this.services.selectionService);
                    if (selectedVisuals.length === 1) {
                        var visualContainer = selectedVisuals[0];
                        if (visualContainer) {
                            var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                            this.services.visualAuthoring.addFieldToVisual(expr, dataSources, visualContainer).catch(function () {
                                // on error, uncheck this property
                                _this.scope.viewModel.checked = false;
                            });
                            this.services.telemetryService.logEvent(powerbi.telemetry.EXAddField, 0 /* CheckboxTickedInFieldList */, VisualContainerUtils.getVisualType(visualContainer));
                        }
                    }
                    else {
                        // If there is no visual selected, publish addVisualContainer event.
                        this.services.eventBridge.publishBubbling(this.scope, events.addVisualContainer, expr);
                    }
                };
                FieldListPropertyController.prototype.removeField = function () {
                    var expr = powerbi.data.SQExprBuilder.fieldDef(this.fieldDef());
                    this.services.visualAuthoring.removeField(expr);
                };
                FieldListPropertyController.prototype.getIconClassName = function (property) {
                    if (property.contract.queryable === 1 /* Error */)
                        return "error";
                    if (property.kind === 1 /* Measure */)
                        return "measure";
                    if (property.kind === 2 /* Kpi */)
                        return "kpi";
                    if (property.contract.type !== undefined && property.contract.type.geography !== undefined)
                        return "geoData";
                    if (property.kind === 0 /* Column */) {
                        if (property.contract.column.calculated) {
                            if (property.type.numeric)
                                return "numericCalculatedColumn";
                            return "calculatedColumn";
                        }
                        if (property.idOnEntityKey)
                            return "identity";
                    }
                    if (property.type.numeric && property.defaultAggregate !== 1 /* None */)
                        return "numeric";
                    return "none";
                };
                FieldListPropertyController.prototype.getDragContext = function () {
                    return {
                        field: this.fieldDef()
                    };
                };
                FieldListPropertyController.prototype.fieldDef = function () {
                    var viewModel = this.scope.viewModel;
                    if (viewModel.kind === 0 /* Column */) {
                        return {
                            schema: viewModel.schemaName,
                            entity: viewModel.entityName,
                            column: viewModel.name
                        };
                    }
                    if (viewModel.kind === 1 /* Measure */) {
                        return {
                            schema: viewModel.schemaName,
                            entity: viewModel.entityName,
                            measure: viewModel.name
                        };
                    }
                };
                FieldListPropertyController.prototype.updateSelection = function () {
                    this.selectedVisualContainer = null;
                    var selectedVisual = selectionUtils.getSelectedVisual(this.services.selectionService);
                    if (!selectedVisual)
                        return;
                    // Update the selection based on the first selected item.
                    this.selectedVisualContainer = selectedVisual;
                };
                FieldListPropertyController.prototype.select = function ($event) {
                    if (this.scope.viewModel.entity && this.scope.viewModel.entity.schema && !this.scope.viewModel.entity.schema.canEdit)
                        return;
                    var viewModel = this.scope.viewModel;
                    schemaItemActivationUtils.setActiveSchemaItem(this.services.schemaItemActivationService, viewModel.schemaName, viewModel.entityName, viewModel.name);
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 3 /* Select */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                    $event.stopPropagation();
                };
                FieldListPropertyController.prototype.selectMenuItem = function (menuItem) {
                    debug.assertValue(menuItem, "Expected a menu item.");
                    switch (menuItem.action) {
                        case 4 /* Rename */:
                            this.editLabel();
                            break;
                        case 0 /* AddFilter */:
                            this.addFilter();
                            break;
                        case 1 /* Hide */:
                            this.toggleHidden();
                            break;
                        case 5 /* Delete */:
                            this.delete();
                            break;
                        case 2 /* ViewHidden */:
                            this.viewHidden();
                            break;
                        case 3 /* UnhideAll */:
                            this.unHideAll();
                            break;
                        case 6 /* NewMeasure */:
                            this.addMeasure();
                            break;
                        case 7 /* NewColumn */:
                            this.addColumn();
                            break;
                        default:
                            debug.assertFail("Invalid action.");
                            break;
                    }
                };
                FieldListPropertyController.prototype.addFilter = function () {
                    var scope = this.selectedVisualContainer ? 0 /* Visual */ : 1 /* Section */;
                    this.services.visualAuthoring.addFilter(this.fieldDef(), scope, explore.ScopeUtils.findDataSources(this.scope));
                };
                FieldListPropertyController.prototype.toggleHidden = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 0 /* Hide */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListPropertyController.prototype.viewHidden = function () {
                    var eventArg = {
                        action: 1 /* ShowHidden */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListPropertyController.prototype.unHideAll = function () {
                    var eventArg = {
                        action: 2 /* UnhideAll */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListPropertyController.prototype.editLabel = function () {
                    if (this.scope.viewModel.entity && this.scope.viewModel.entity.schema && this.scope.viewModel.entity.schema.canEdit) {
                        this.scope.viewModel.isEditingLabel = true;
                        this.scope.toggleDraggable(false);
                    }
                };
                FieldListPropertyController.prototype.rename = function (newName) {
                    this.scope.toggleDraggable(true);
                    if (!this.isNameValid(newName))
                        return;
                    powerbi.explore.util.ModelAuthoringUtility.rename(this.fieldDef(), newName, this.services.modelAuthoring);
                    this.scope.viewModel.contract.name = newName;
                };
                FieldListPropertyController.prototype.isNameValid = function (newName) {
                    var viewModel = this.scope.viewModel;
                    if (!viewModel.entity)
                        return true;
                    var dupProperty = viewModel.entity.findProperty(newName);
                    var isNullOrWhiteSpace = jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(newName);
                    return !dupProperty && !isNullOrWhiteSpace;
                };
                FieldListPropertyController.prototype.delete = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 4 /* Delete */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListPropertyController.prototype.addMeasure = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 5 /* NewMeasure */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                FieldListPropertyController.prototype.addColumn = function () {
                    var eventArg = {
                        fieldDef: this.fieldDef(),
                        action: 6 /* NewColumn */
                    };
                    this.services.eventBridge.publishBubbling(this.scope, explore.viewModels.FieldListEvents.fieldListAction, eventArg);
                };
                return FieldListPropertyController;
            })();
            controllers.FieldListPropertyController = FieldListPropertyController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = explore.services.events;
            var selectionUtils = explore.services.selectionUtils;
            var FieldWellController = (function () {
                function FieldWellController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.viewModel = explore.viewModels.ViewModelFactory.createFieldWell();
                    this.scope.$on(explore.constants.explorationLoadedEventName, function () { return _this.requestModelAndUpdate(); });
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.selectionChanged, function () { return _this.requestModelAndUpdate(); }).subscribe(events.visualContainerChanged, function () { return _this.requestModelAndUpdate(); });
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    this.requestModelAndUpdate();
                }
                FieldWellController.createOptions = function () {
                    return {
                        additionalServices: ['displayNameService', 'conceptualSchemaProxy', 'featureSwitchService'],
                        scopedDependencies: ['eventBridge', 'selectionService', 'visualPlugin'],
                    };
                };
                FieldWellController.prototype.requestModelAndUpdate = function () {
                    var _this = this;
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    if (!dataSources)
                        return;
                    this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) { return _this.update(schema); }, function () { return _this.update(null); });
                };
                FieldWellController.prototype.update = function (schema) {
                    var newBuckets;
                    var visual = this.getSelectedVisual();
                    if (!schema || !visual) {
                        newBuckets = null;
                    }
                    else {
                        newBuckets = explore.viewModels.FieldWellViewModelFactory.createBuckets(visual, schema, this.services.displayNameService, this.services.visualPlugin, this.services.featureSwitchService.featureSwitches);
                    }
                    this.scope.viewModel.buckets = newBuckets;
                };
                FieldWellController.prototype.getSelectedVisual = function () {
                    return selectionUtils.getSelectedVisual(this.services.selectionService);
                };
                return FieldWellController;
            })();
            controllers.FieldWellController = FieldWellController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var commonConstants = powerbi.constants;
            var selectionUtils = explore.services.selectionUtils;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var FieldWellFieldController = (function () {
                function FieldWellFieldController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.viewModel = $scope.viewModel;
                    this.scope.deleteField = function () { return _this.deleteField(); };
                    this.scope.getDragContext = function () { return _this.getDragContext(); };
                    this.scope.selectFieldMenuItem = function (menuItem) { return _this.selectFieldMenuItem(menuItem); };
                    $scope.$on(commonConstants.dropEventName, function (event, originalEvent, args) { return _this.drop(event, args); });
                }
                FieldWellFieldController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge', 'selectionService', 'visualAuthoring'],
                    };
                };
                FieldWellFieldController.prototype.drop = function (event, args) {
                    event.stopPropagation();
                    var viewModel = this.scope.viewModel;
                    // Check for drag within the field well
                    var fieldWellPayload = args.dragData;
                    if (fieldWellPayload.sourceRole) {
                        var targetIndex = viewModel.index, sourceIndex = fieldWellPayload.sourceIndex;
                        if (targetIndex === sourceIndex || targetIndex === sourceIndex + 1)
                            return;
                        if (targetIndex > sourceIndex)
                            targetIndex = Math.max(targetIndex - 1, 0);
                        this.services.visualAuthoring.moveProjection(fieldWellPayload.sourceRole, viewModel.role, sourceIndex, targetIndex, explore.ScopeUtils.findDataSources(this.scope));
                        return;
                    }
                    // Check for drag from outside the field well
                    var explorePayload = args.dragData;
                    if (explorePayload.field) {
                        this.services.visualAuthoring.addFieldInRole(SQExprBuilder.fieldDef(explorePayload.field), viewModel.role, explore.ScopeUtils.findDataSources(this.scope), this.getSelectedVisual(), viewModel.index);
                    }
                };
                FieldWellFieldController.prototype.deleteField = function () {
                    this.services.visualAuthoring.removeProjection(this.scope.viewModel.role, this.scope.viewModel.index);
                };
                FieldWellFieldController.prototype.getDragContext = function () {
                    return {
                        sourceIndex: this.scope.viewModel.index,
                        sourceRole: this.scope.viewModel.role
                    };
                };
                FieldWellFieldController.prototype.setAggregate = function (property, aggregate) {
                    debug.assertValue(aggregate, "Must specify a new aggregate.");
                    var context = this.getAuthoringContext();
                    if (!context)
                        return;
                    this.services.visualAuthoring.setAggregate(this.scope.viewModel.role, this.scope.viewModel.index, aggregate, context.visual, context.dataSources);
                    explore.viewModels.FieldWellViewModelFactory.updateSelectedMenuItems(property);
                };
                FieldWellFieldController.prototype.removeAggregate = function (property) {
                    var context = this.getAuthoringContext();
                    if (!context)
                        return;
                    this.services.visualAuthoring.removeAggregate(this.scope.viewModel.role, this.scope.viewModel.index, context.visual, context.dataSources);
                    explore.viewModels.FieldWellViewModelFactory.updateSelectedMenuItems(property);
                };
                FieldWellFieldController.prototype.selectFieldMenuItem = function (menuItem) {
                    debug.assertValue(menuItem, "Expected a menu item.");
                    switch (menuItem.action) {
                        case 0 /* Delete */:
                            this.deleteField();
                            break;
                        case 2 /* SetAggregate */:
                            this.setAggregate(menuItem.property, menuItem.aggregate);
                            break;
                        case 1 /* RemoveAggregate */:
                            this.removeAggregate(menuItem.property);
                            break;
                        default:
                            debug.assertFail("Invalid action.");
                            break;
                    }
                };
                FieldWellFieldController.prototype.getSelectedVisual = function () {
                    return selectionUtils.getSelectedVisual(this.services.selectionService);
                };
                FieldWellFieldController.prototype.getAuthoringContext = function () {
                    var visual = this.getSelectedVisual();
                    if (!visual)
                        return;
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    if (!dataSources)
                        return;
                    return {
                        visual: visual,
                        dataSources: dataSources
                    };
                };
                return FieldWellFieldController;
            })();
            controllers.FieldWellFieldController = FieldWellFieldController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var commonConstants = powerbi.constants;
            var selectionUtils = explore.services.selectionUtils;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var VisualContainerUtils = explore.util.VisualContainerUtils;
            var FieldWellBucketController = (function () {
                function FieldWellBucketController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.viewModel = $scope.viewModel;
                    $scope.$on(commonConstants.dropEventName, function (event, originalEvent, args) { return _this.drop(event, args); });
                }
                FieldWellBucketController.createOptions = function () {
                    return {
                        additionalServices: ['telemetryService'],
                        scopedDependencies: ['selectionService', 'visualAuthoring'],
                    };
                };
                FieldWellBucketController.prototype.drop = function (event, args) {
                    if (event.stopPropagation)
                        event.stopPropagation();
                    var viewModel = this.scope.viewModel;
                    var fieldWellPayload = args.dragData;
                    if (fieldWellPayload.sourceRole) {
                        // Since we caught the event at this level, it means the property was dragged
                        // into the last position of the bucket.
                        debug.assert($.isNumeric(fieldWellPayload.sourceIndex), "Unexpected drag source");
                        var targetIndex = Math.max(viewModel.properties.length - 1, 0);
                        this.services.visualAuthoring.moveProjection(fieldWellPayload.sourceRole, viewModel.role, fieldWellPayload.sourceIndex, targetIndex, explore.ScopeUtils.findDataSources(this.scope));
                        this.services.telemetryService.logEvent(powerbi.telemetry.EXChangeFieldWell, fieldWellPayload.sourceRole, viewModel.role);
                        return;
                    }
                    var explorePayload = args.dragData;
                    if (explorePayload.field) {
                        // The field was dragged in from outside the field well.
                        var selectedVisual = this.getSelectedVisual();
                        this.services.visualAuthoring.addFieldInRole(SQExprBuilder.fieldDef(explorePayload.field), viewModel.role, explore.ScopeUtils.findDataSources(this.scope), selectedVisual);
                        this.services.telemetryService.logEvent(powerbi.telemetry.EXAddField, 2 /* DraggedToFieldWell */, VisualContainerUtils.getVisualType(selectedVisual));
                    }
                };
                FieldWellBucketController.prototype.getSelectedVisual = function () {
                    return selectionUtils.getSelectedVisual(this.services.selectionService);
                };
                return FieldWellBucketController;
            })();
            controllers.FieldWellBucketController = FieldWellBucketController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var FilterController = (function () {
                function FilterController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.scope.viewModel.updateViewState();
                    this.services = services;
                    this.scope.toggle = function (e, filterDefinition) { return _this.toggle(e, filterDefinition); };
                    this.scope.deleteFilter = function (e, filterDefinition) { return _this.deleteFilter(e, filterDefinition); };
                    this.scope.clearFilter = function (e, filterDefinition) { return _this.clearFilter(e, filterDefinition); };
                    this.scope.switchCardType = function (e, filterDefinition) { return _this.switchCardType(e, filterDefinition); };
                }
                FilterController.createOptions = function () {
                    return {
                        additionalServices: ['telemetryService'],
                        scopedDependencies: ['eventBridge', 'visualAuthoring'],
                    };
                };
                FilterController.prototype.toggle = function (e, filterDefinition) {
                    var filterContract = filterDefinition.contract;
                    filterContract.expanded = !filterContract.expanded;
                    var event = this.services.telemetryService.startEvent(powerbi.telemetry.EXFilterPaneExpandCollapseFilter, filterContract.expanded);
                    filterDefinition.updateViewState();
                    event.resolve();
                };
                FilterController.prototype.clearFilter = function (e, filterDefinition) {
                    // If the filter is already clear this should be a no-op
                    if (!filterDefinition.contract.filter) {
                        e.stopPropagation();
                        return;
                    }
                    var event = this.services.telemetryService.startEvent(powerbi.telemetry.EXFilterPaneClearAdvancedFilter);
                    filterDefinition.contract.filter = null;
                    var eventArg = {
                        filter: filterDefinition.contract,
                        changeType: 2 /* Update */,
                        scope: filterDefinition.getScope(),
                    };
                    this.services.eventBridge.publishToChannel(events.filterContainerChanged, eventArg);
                    e.stopPropagation();
                    event.resolve();
                };
                FilterController.prototype.deleteFilter = function (e, filterDefinition) {
                    var scope = filterDefinition.isVisualFilter ? 0 /* Visual */ : 1 /* Section */;
                    this.services.visualAuthoring.removeFilter(filterDefinition.contract, scope);
                    e.stopPropagation();
                };
                FilterController.prototype.switchCardType = function (e, filterDefinition) {
                    //TODO: boolean type field cannot be shown in advanced filter card.
                    var cardType = filterDefinition.contract.type;
                    if (cardType === 2 /* Advanced */) {
                        filterDefinition.switchType(0 /* Categorical */);
                        // If the categorical filter card has been created, we should use the existing one and update the filter.
                        if (!filterDefinition.categoricalFilterCard)
                            filterDefinition.categoricalFilterCard = explore.viewModels.ViewModelFactory.createCategoricalFilter(filterDefinition.contract);
                        filterDefinition.categoricalFilterCard.filter = filterDefinition.contract.filter;
                    }
                    else {
                        filterDefinition.switchType(2 /* Advanced */);
                        filterDefinition.advFilterCard = explore.viewModels.ViewModelFactory.convertAdvancedFilter(filterDefinition.contract, filterDefinition.formatter);
                    }
                    filterDefinition.updateViewState();
                    e.stopPropagation();
                };
                return FilterController;
            })();
            controllers.FilterController = FilterController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var commonConstants = powerbi.constants;
            var events = powerbi.explore.services.events;
            var FilterContainerChangeType = explore.services.FilterContainerChangeType;
            var selectionUtils = explore.services.selectionUtils;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var PageDropZoneId = 'pagefilter-drop';
            var VisualDropZoneId = 'visualfilter-drop';
            var FilterPaneController = (function () {
                function FilterPaneController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.viewModel = explore.viewModels.ViewModelFactory.createFilterPane();
                    this.scope.viewModeState = services.viewModeState;
                    // make sure this.services is initialized prior to initializing subscriptionManager;
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.selectionChanged, function () { return _this.updateSelection(); }).subscribe(events.sectionChanged, function () { return _this.onSwitchSection(); }).subscribe(events.visualContainerChanged, function (e, args) { return _this.onVisualContainerChanged(args); }).subscribe(events.filterContainerChanged, function (e, arg) { return _this.onFilterContainerChanged(arg); });
                    $scope.$on(commonConstants.dropEventName, function (event, originalEvent, args) { return _this.drop(event, args); });
                    $scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    this.updateSelection();
                    this.onSwitchSection();
                }
                FilterPaneController.createOptions = function () {
                    return {
                        additionalServices: ['conceptualSchemaProxy', 'displayNameService'],
                        scopedDependencies: ['sectionNavigationService', 'selectionService', 'eventBridge', 'viewModeState', 'visualAuthoring', 'visualPlugin'],
                    };
                };
                FilterPaneController.prototype.drop = function (event, args) {
                    // TODO: Refactor the drag/drop directives to better support multiple drop targets per scope.
                    // Currently, we use scope events to indicate a drop. This causes issues when we have multiple
                    // drop targets per scope. One possible fix is to add an 'ondrop' attribute to each drop target,
                    // and bind it to a custom handler function. This would eliminate the need to check element IDs.
                    var explorePayload = args.dragData;
                    if (!explorePayload.field)
                        return;
                    var filterScope;
                    if (args.targetElement && args.targetElement.attr('id') === VisualDropZoneId)
                        filterScope = 0 /* Visual */;
                    else if (args.targetElement && args.targetElement.attr('id') === PageDropZoneId)
                        filterScope = 1 /* Section */;
                    if (filterScope !== null && filterScope !== undefined)
                        this.services.visualAuthoring.addFilter(explorePayload.field, filterScope, explore.ScopeUtils.findDataSources(this.scope));
                };
                FilterPaneController.prototype.updateSelection = function () {
                    var _this = this;
                    var viewModel = this.scope.viewModel;
                    var selectedVisual = this.getSelectedVisual();
                    viewModel.visualFilters.length = 0;
                    if (!!selectedVisual && VisualContainerUtils.isQueryVisual(selectedVisual.config.singleVisual.visualType, this.services.visualPlugin)) {
                        viewModel.isVisualVisible = true;
                        var section = this.services.sectionNavigationService.getCurrentSection();
                        this.getConceptualSchema().then(function (schema) {
                            viewModel.visualFilters = explore.viewModels.ViewModelFactory.createVisualFilters({
                                section: section,
                                visualContainer: selectedVisual,
                            }, schema, _this.services.displayNameService);
                        });
                    }
                    else {
                        this.scope.viewModel.isVisualVisible = false;
                    }
                };
                FilterPaneController.prototype.onVisualContainerChanged = function (args) {
                    var _this = this;
                    if (!args)
                        return;
                    var selectedVisual = this.getSelectedVisual();
                    if (selectedVisual !== undefined && args.affectContainer(selectedVisual)) {
                        var section = this.services.sectionNavigationService.getCurrentSection();
                        this.getConceptualSchema().then(function (schema) {
                            _this.scope.viewModel.visualFilters = explore.viewModels.ViewModelFactory.createVisualFilters({
                                section: section,
                                visualContainer: selectedVisual,
                            }, schema, _this.services.displayNameService);
                        });
                    }
                };
                FilterPaneController.prototype.onFilterContainerChanged = function (arg) {
                    var _this = this;
                    if (arg.changeType === 2 /* Update */)
                        return;
                    var selectedVisual = this.getSelectedVisual();
                    var viewModel = this.scope.viewModel;
                    var filter = arg.filter;
                    if (arg.changeType === 1 /* Add */) {
                        this.getConceptualSchema().then(function (schema) {
                            var model = explore.viewModels.ViewModelFactory.convertFilterContainer(filter, schema, _this.services.displayNameService, arg.scope);
                            if (arg.scope.visualContainer && arg.scope.visualContainer === selectedVisual)
                                _this.scope.viewModel.visualFilters.push(model);
                            else if (arg.scope.section)
                                _this.scope.viewModel.pageFilters.push(model);
                        });
                    }
                    else if (arg.changeType === 0 /* Remove */) {
                        var filters = arg.scope.visualContainer === undefined ? viewModel.pageFilters : viewModel.visualFilters;
                        for (var i = 0, len = filters.length; i < len; i++) {
                            if (filters[i].contract === filter) {
                                filters.splice(i, 1);
                                return;
                            }
                        }
                    }
                };
                FilterPaneController.prototype.getConceptualSchema = function () {
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    debug.assertValue(dataSources, 'Unable to find data source.');
                    return this.services.conceptualSchemaProxy.get(dataSources);
                };
                FilterPaneController.prototype.getSelectedVisual = function () {
                    return selectionUtils.getSelectedVisual(this.services.selectionService);
                };
                FilterPaneController.prototype.onSwitchSection = function () {
                    var _this = this;
                    var section = this.services.sectionNavigationService.getCurrentSection();
                    if (!section)
                        return;
                    this.getConceptualSchema().then(function (schema) {
                        var viewModel = _this.scope.viewModel;
                        viewModel.pageFilters = explore.viewModels.ViewModelFactory.createPageFilters(section, schema, _this.services.displayNameService);
                    });
                };
                return FilterPaneController;
            })();
            controllers.FilterPaneController = FilterPaneController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var FilterUtils;
        (function (FilterUtils) {
            var FilterScopeType = explore.services.FilterScopeType;
            var valueFormatter = powerbi.visuals.valueFormatter;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            function getFormatter(fieldSQExpr, schema) {
                var metadata = fieldSQExpr.getMetadata(schema);
                if (!metadata)
                    return;
                var formatString = metadata.format;
                return valueFormatter.create({ format: formatString });
            }
            FilterUtils.getFormatter = getFormatter;
            function getDefaultFilterType(field, schema) {
                var metadata = getMetadata(field, schema);
                if (!metadata)
                    return;
                var propertyType = metadata.type;
                // TODO: figure out the filter card type based on property type. For text, boolean, and dateTime field,
                // the default should be Categorical if it doesn't have aggregate. For now, the rest will be Advanced.
                if (propertyType && (propertyType.text || propertyType.bool || propertyType.dateTime) && field.aggregate == null)
                    return 0 /* Categorical */;
                else
                    return 2 /* Advanced */;
            }
            FilterUtils.getDefaultFilterType = getDefaultFilterType;
            function canAdd(field, schema, scope, filterScope, visualPluginService) {
                if (!field || !schema)
                    return false;
                debug.assertValue(scope, 'scope');
                var conceptualSchema = schema.schema(field.schema);
                if (!conceptualSchema)
                    return false;
                var property = conceptualSchema.findProperty(field.entity, field.column || field.measure);
                if (!property)
                    return false;
                // We don't allow add page filter on a model measure.
                // DSQT doesn't support filter on model measure for visuals that doesn't have a group. Also, filter on model measure
                // has different implementation for different types of visual, for chart, it will filter out data point,
                // but for table or matrix, it will filter out the entire row. 
                if (scope === 1 /* Section */ && property.kind === 1 /* Measure */)
                    return false;
                if (scope === 0 /* Visual */) {
                    if (!filterScope.visualContainer)
                        return false;
                    // We don't allow add filters to non-query visuals
                    var visualType = VisualContainerUtils.getVisualType(filterScope.visualContainer);
                    return VisualContainerUtils.isQueryVisual(visualType, visualPluginService);
                }
                else if (scope === 1 /* Section */)
                    return filterScope.section != null;
                else
                    return false;
            }
            FilterUtils.canAdd = canAdd;
            function add(filtersContainer, filter) {
                if (!filtersContainer.filters)
                    filtersContainer.filters = [];
                filtersContainer.filters.push(filter);
            }
            FilterUtils.add = add;
            function isMeasureField(fieldSQExpr, schema) {
                var metadata = fieldSQExpr.getMetadata(schema);
                if (!metadata)
                    return false;
                return metadata.kind === 1 /* Measure */;
            }
            FilterUtils.isMeasureField = isMeasureField;
            function getValueType(fieldSQExpr, schema) {
                var metadata = fieldSQExpr.getMetadata(schema);
                if (!metadata)
                    return;
                return metadata.type;
            }
            FilterUtils.getValueType = getValueType;
            function getMetadata(field, schema) {
                debug.assertValue(field, "field");
                debug.assertValue(schema, "schema");
                var sqExpr = powerbi.data.SQExprBuilder.fieldDef(field);
                if (!sqExpr)
                    return;
                return sqExpr.getMetadata(schema);
            }
        })(FilterUtils = explore.FilterUtils || (explore.FilterUtils = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var ModelingContextChangerController = (function () {
                function ModelingContextChangerController($scope, services) {
                    this.scope = $scope;
                    this.services = services;
                    this.scope.eventBridge = this.services.eventBridge;
                    this.scope.schemaItemActivationService = this.services.schemaItemActivationService;
                }
                ModelingContextChangerController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge', 'schemaItemActivationService'],
                    };
                };
                return ModelingContextChangerController;
            })();
            controllers.ModelingContextChangerController = ModelingContextChangerController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var ArrayExtensions = jsCommon.ArrayExtensions;
            var DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;
            var events = powerbi.explore.services.events;
            var selectionUtils = explore.services.selectionUtils;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var GradientUtils = powerbi.visuals.GradientUtils;
            var PropertyPaneController = (function () {
                function PropertyPaneController($scope, services) {
                    var _this = this;
                    this.performUiChangesOnly = function (propertyPaneSlice, propertyPaneCard) {
                        switch (propertyPaneSlice.name) {
                            case 'showAllDataPoints':
                                for (var i = 0, len = propertyPaneCard.slices.length; i < len; i++) {
                                    propertyPaneCard.slices[i].show = propertyPaneSlice.value;
                                }
                                return true;
                        }
                        return false;
                    };
                    this.services = services;
                    this.scope = $scope;
                    this.currentTab = 0;
                    this.currentDataPointTab = PropertyPaneController.InvalidTabIndex;
                    var viewModels = powerbi.explore.viewModels;
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.selectionChanged, function () { return _this.onVisualSelectionChange(); }).subscribe(events.visualContainerDataRendered, function (e, visualContainer) { return _this.onVisualDataRendered(visualContainer); });
                    $scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    $scope.save = function (propertyPaneSlice, propertyPaneCard) {
                        if (!PropertyPaneController.validateSlice(propertyPaneSlice, propertyPaneCard))
                            return;
                        if (_this.performUiChangesOnly(propertyPaneSlice, propertyPaneCard))
                            return;
                        var selectedVisual = selectionUtils.getSelectedVisual(_this.services.selectionService);
                        if (selectedVisual) {
                            _this.services.undoRedoService.register(function () {
                                var objectDefns = selectedVisual.config.singleVisual.objects;
                                if (!objectDefns)
                                    selectedVisual.config.singleVisual.objects = objectDefns = {};
                                if (propertyPaneCard.name === 'title') {
                                    _this.saveTitleToVisualContainer(propertyPaneSlice, selectedVisual);
                                }
                                else if (propertyPaneCard.name === 'background') {
                                    _this.saveBackgroundToVisualContainer(propertyPaneSlice, selectedVisual);
                                }
                                else {
                                    _this.saveChangedSliceToDefinition(propertyPaneCard, propertyPaneSlice, objectDefns);
                                }
                                if (propertyPaneCard.name === "gradient") {
                                    _this.updateGradientFillRule(propertyPaneSlice, objectDefns);
                                }
                            });
                            _this.services.visualAuthoring.raiseVisualContainerChanged(selectedVisual);
                        }
                    };
                    $scope.getSliceComponentType = viewModels.PropertyPaneViewModelFactory.getSliceComponentType;
                    $scope.numUpDownLimitValues = {
                        minValue: 1,
                        maxValue: 999
                    };
                    $scope.currentTab = function () {
                        return _this.currentTab;
                    };
                    $scope.setCurrentTab = function (index) {
                        _this.currentTab = index !== _this.currentTab ? index : PropertyPaneController.InvalidTabIndex;
                        _this.currentDataPointTab = PropertyPaneController.InvalidTabIndex;
                    };
                    $scope.currentDataPointTab = function () {
                        return _this.currentDataPointTab;
                    };
                    $scope.setCurrentDataPointTab = function (index) {
                        _this.currentDataPointTab = index !== _this.currentDataPointTab ? index : PropertyPaneController.InvalidTabIndex;
                        _this.currentTab = PropertyPaneController.InvalidTabIndex;
                    };
                    this.onVisualSelectionChange();
                }
                PropertyPaneController.createOptions = function () {
                    return {
                        additionalServices: ['telemetryService', 'displayNameService', 'conceptualSchemaProxy', 'featureSwitchService'],
                        scopedDependencies: ['eventBridge', 'selectionService', 'undoRedoService', 'visualPlugin', 'visualAuthoring'],
                    };
                };
                PropertyPaneController.validateSlice = function (propertyPaneSlice, propertyPaneCard) {
                    if (propertyPaneSlice.value === '')
                        return true;
                    if (!this.decimalValidation.test(propertyPaneSlice.value)) {
                        switch (propertyPaneCard.name) {
                            case 'valueAxis':
                            case 'categoryAxis':
                                if (propertyPaneSlice.name === this.SliceNameStart || propertyPaneSlice.name === this.SliceNameSecStart) {
                                    if (!isNaN(propertyPaneSlice.value)) {
                                        for (var i = propertyPaneCard.slices.length - 1; i >= 0; i--) {
                                            var CurrentSlice = propertyPaneCard.slices[i];
                                            if ((propertyPaneSlice.name === this.SliceNameStart && CurrentSlice.name === this.SliceNameEnd) || (propertyPaneSlice.name === this.SliceNameSecStart && CurrentSlice.name === this.SliceNameSecEnd)) {
                                                if (CurrentSlice.value < propertyPaneSlice.value) {
                                                    propertyPaneSlice.isValid = false;
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        propertyPaneSlice.isValid = false;
                                        return false;
                                    }
                                    propertyPaneSlice.isValid = true;
                                    return true;
                                }
                                if (propertyPaneSlice.name === this.SliceNameEnd || propertyPaneSlice.name === this.SliceNameSecEnd) {
                                    if (!isNaN(propertyPaneSlice.value)) {
                                        for (var i = propertyPaneCard.slices.length - 1; i >= 0; i--) {
                                            var CurrentSlice = propertyPaneCard.slices[i];
                                            if ((propertyPaneSlice.name === this.SliceNameEnd && CurrentSlice.name === this.SliceNameStart) || (propertyPaneSlice.name === this.SliceNameSecEnd && CurrentSlice.name === this.SliceNameSecStart)) {
                                                if (CurrentSlice.value > propertyPaneSlice.value) {
                                                    propertyPaneSlice.isValid = false;
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        propertyPaneSlice.isValid = false;
                                        return false;
                                    }
                                    propertyPaneSlice.isValid = true;
                                    return true;
                                }
                                break;
                        }
                    }
                    else {
                        propertyPaneSlice.isValid = false;
                        return false;
                    }
                    propertyPaneSlice.isValid = true;
                    return true;
                };
                PropertyPaneController.prototype.updateGradientFillRule = function (propertyPaneSlice, definitions) {
                    GradientUtils.updateFillRule(propertyPaneSlice.name, propertyPaneSlice.value, definitions);
                };
                PropertyPaneController.prototype.saveChangedSliceToDefinition = function (propertyPaneCard, propertyPaneSlice, definitions) {
                    if (propertyPaneSlice.name === 'revertToDefault') {
                        definitions[propertyPaneCard.name] = [];
                        return; //nothing left to do when you simply revert
                    }
                    var value = propertyPaneSlice.value;
                    if (propertyPaneSlice.type.bool) {
                        if (typeof (value) !== 'boolean')
                            value = false; // This is fallback, which doesn't really belong here.
                        value = SQExprBuilder.boolean(value);
                    }
                    else if (propertyPaneSlice.type.text) {
                        value = SQExprBuilder.text(value);
                    }
                    else if (propertyPaneSlice.type.numeric) {
                        if ($.isNumeric(value))
                            value = +value;
                    }
                    else if (propertyPaneSlice.type.fill) {
                        value = {
                            solid: { color: value ? SQExprBuilder.text(value) : null }
                        };
                    }
                    if (value === '')
                        value = null;
                    //todo: Move this logic to somewhere else
                    if (propertyPaneCard.name === 'valueAxis') {
                        if (propertyPaneSlice.name === 'position') {
                            DataViewObjectDefinitions.ensure(definitions, propertyPaneCard.name, propertyPaneSlice.selector).properties['secPosition'] = value === powerbi.yAxisPosition.right ? powerbi.yAxisPosition.left : powerbi.yAxisPosition.right;
                        }
                        if (propertyPaneSlice.name === 'secPosition') {
                            DataViewObjectDefinitions.ensure(definitions, propertyPaneCard.name, propertyPaneSlice.selector).properties['position'] = value === powerbi.yAxisPosition.right ? powerbi.yAxisPosition.left : powerbi.yAxisPosition.right;
                        }
                    }
                    DataViewObjectDefinitions.ensure(definitions, propertyPaneCard.name, propertyPaneSlice.selector).properties[propertyPaneSlice.name] = value;
                };
                PropertyPaneController.prototype.saveTitleToVisualContainer = function (propertyPaneSlice, selectedVisual) {
                    if (!selectedVisual.config.singleVisual.title) {
                        selectedVisual.config.singleVisual.title = {};
                    }
                    if (propertyPaneSlice.name === 'text') {
                        selectedVisual.config.singleVisual.title.text = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'fontColor') {
                        selectedVisual.config.singleVisual.title.fontColor = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'backgroundColor') {
                        selectedVisual.config.singleVisual.title.background = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'show') {
                        selectedVisual.config.singleVisual.title.show = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'alignment') {
                        selectedVisual.config.singleVisual.title.alignment = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'revertToDefault') {
                        selectedVisual.config.singleVisual.title = {};
                    }
                };
                PropertyPaneController.prototype.saveBackgroundToVisualContainer = function (propertyPaneSlice, selectedVisual) {
                    var visualBackground = selectedVisual.config.singleVisual.background;
                    if (!visualBackground) {
                        // Init with default values
                        visualBackground = powerbi.visuals.visualBackgroundHelper.getDefaultValues();
                    }
                    if (propertyPaneSlice.name === 'color') {
                        visualBackground.color = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'show') {
                        visualBackground.show = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'transparency') {
                        visualBackground.transparency = propertyPaneSlice.value;
                    }
                    else if (propertyPaneSlice.name === 'revertToDefault') {
                        visualBackground = powerbi.visuals.visualBackgroundHelper.getDefaultValues();
                    }
                    selectedVisual.config.singleVisual.background = visualBackground;
                };
                PropertyPaneController.prototype.onVisualDataRendered = function (visualContainer) {
                    if (visualContainer === selectionUtils.getSelectedVisual(this.services.selectionService))
                        this.bindToVisualContainer(visualContainer);
                };
                PropertyPaneController.prototype.onVisualSelectionChange = function () {
                    this.bindToVisualContainer(selectionUtils.getSelectedVisual(this.services.selectionService));
                };
                PropertyPaneController.prototype.bindToVisualContainer = function (visualContainer) {
                    var _this = this;
                    if (visualContainer && visualContainer.config && visualContainer.config.singleVisual && visualContainer.config.singleVisual.getCurrentVisual) {
                        var visualConfig = visualContainer.config.singleVisual;
                        var visualType = visualConfig.visualType, visual = visualConfig.getCurrentVisual(), objectsDefinitions = visualConfig.objects;
                        var capabilities = this.services.visualPlugin.capabilities(visualType);
                        var dataViewObjectDescriptors = PropertyPaneController.getDataViewObjectDescriptors(capabilities, visualType);
                        if (capabilities && capabilities.objects) {
                            var visualBackground = visualConfig.background;
                            var visualTitle = visualConfig.title;
                            var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                            var showGradientCard = GradientUtils.shouldShowGradient(visualConfig);
                            var createPaneOptions = {
                                objectDescriptors: dataViewObjectDescriptors,
                                visual: visual,
                                objectDefinitions: objectsDefinitions,
                                visualTitle: visualTitle,
                                visualBackground: visualBackground,
                                featureSwitches: this.services.featureSwitchService.featureSwitches,
                                showGradientCard: showGradientCard,
                            };
                            if (!(visualTitle && visualTitle.text) && dataSources) {
                                this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                                    createPaneOptions.visualTitle = _this.services.displayNameService.getVisualTitle(visualContainer.config.singleVisual, schema, capabilities, powerbi.common.localize);
                                    _this.scope.viewModel = explore.viewModels.PropertyPaneViewModelFactory.createPane(createPaneOptions);
                                });
                            }
                            else {
                                this.scope.viewModel = explore.viewModels.PropertyPaneViewModelFactory.createPane(createPaneOptions);
                            }
                            return;
                        }
                    }
                    this.scope.viewModel = { cards: ArrayExtensions.createWithName(), inputFieldsOptions: explore.viewModels.PropertyPaneViewModelFactory.getInputFieldsOptions() };
                };
                PropertyPaneController.getDataViewObjectDescriptors = function (capabilities, visualType) {
                    var dataViewObjectDescriptors = jQuery.extend(true, {}, capabilities.objects);
                    if (!capabilities.suppressDefaultTitle) {
                        var objectDescriptors = VisualContainerUtils.getObjectDescriptors();
                        _.extend(dataViewObjectDescriptors, objectDescriptors);
                    }
                    return dataViewObjectDescriptors;
                };
                PropertyPaneController.InvalidTabIndex = -1;
                PropertyPaneController.SliceNameStart = 'start';
                PropertyPaneController.SliceNameEnd = 'end';
                PropertyPaneController.SliceNameSecStart = 'secStart';
                PropertyPaneController.SliceNameSecEnd = 'secEnd';
                PropertyPaneController.decimalValidation = /^[0-9]+([\.])$/;
                return PropertyPaneController;
            })();
            controllers.PropertyPaneController = PropertyPaneController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var SemanticFilter = powerbi.data.SemanticFilter;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var events = powerbi.explore.services.events;
            var RangeFilterController = (function () {
                function RangeFilterController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.applyFilter = function (e, filterDefinition) { return _this.applyFilter(e, filterDefinition); };
                }
                RangeFilterController.createOptions = function () {
                    return {
                        scopedDependencies: ['conceptualSchemaProxy', 'eventBridge'],
                    };
                };
                RangeFilterController.prototype.applyFilter = function (e, filterDefinition) {
                    var _this = this;
                    var minValue = filterDefinition.minValue;
                    var maxValue = filterDefinition.maxValue;
                    this.getConceptualSchema().then(function (schema) {
                        var fieldExpr = SQExprBuilder.fieldDef(filterDefinition.contract.field);
                        var valueType = fieldExpr.getMetadata(schema).type;
                        var conditions = [];
                        var minNumberValue = parseFloat(minValue);
                        if (!isNaN(minNumberValue))
                            conditions.push(new explore.viewModels.Condition(4 /* GreaterThanOrEqual */, minNumberValue));
                        var maxNumberValue = parseFloat(maxValue);
                        if (!isNaN(maxNumberValue))
                            conditions.push(new explore.viewModels.Condition(2 /* LessThanOrEqual */, maxNumberValue));
                        var sqExpr = explore.viewModels.FilterCardConverter.toSQExpr(fieldExpr, valueType, conditions);
                        var semanticFilter;
                        if (sqExpr) {
                            semanticFilter = SemanticFilter.fromSQExpr(sqExpr);
                        }
                        filterDefinition.contract.filter = semanticFilter;
                        _this.services.eventBridge.publishBubbling(_this.scope, events.filterValueChanged);
                    });
                };
                RangeFilterController.prototype.getConceptualSchema = function () {
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    debug.assertValue(dataSources, 'Unable to find data source.');
                    return this.services.conceptualSchemaProxy.get(dataSources);
                };
                return RangeFilterController;
            })();
            controllers.RangeFilterController = RangeFilterController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            // regular expression pattern that indicates an invalid reportName
            var invalidReportNameRegex = /["$&*+,/:;<=>?@\\|]+/;
            // Public for UnitTesting
            function isValidReportName(name) {
                // reseting lastindex to always search from the beginning
                invalidReportNameRegex.lastIndex = 0;
                // valid item name http://ignatu.co.uk/articles/Invalid_characters_for_Reporting_Services_report_names/
                // based on server limitations:
                // cannot be empty or all whilte space
                // cannot beging/end with space
                // Maximum length would be less than 260
                // should not contain "$&*+,/:;<=>?@\| See ValidationRegex
                var isValid = !jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(name) && name[0] !== ' ' && name[name.length - 1] !== ' ' && name.length < 260 && !invalidReportNameRegex.test(name);
                return isValid;
            }
            controllers.isValidReportName = isValidReportName;
            function showSaveAsDialog(errorService) {
                var deferred = $.Deferred();
                var saveText = powerbi.common.localize.get('ModalDialog_Save');
                var modalDialog = errorService.control();
                var dialogMessage = powerbi.common.localize.get('ReportAppBar_SaveAsDialogInstructions');
                var contentText = '<div class="content"><div class="message instructions"></div><input type="text" class="explorationSaveAsName" /></div>';
                var content = $(contentText);
                content.find('.message').text(dialogMessage);
                var nameValueQuery = content.find('.explorationSaveAsName');
                var promptActions = [
                    new InJs.ModalDialogAction(saveText, function (sender, dialogContent) {
                        var name = nameValueQuery.val();
                        modalDialog.hideDialog();
                        deferred.resolve(name);
                    }),
                    new InJs.ModalDialogAction(powerbi.common.localize.get('ModalDialog_Cancel'), function (sender, dialogContent) {
                        modalDialog.hideDialog();
                        deferred.reject();
                    })
                ];
                var dialogTitle = powerbi.common.localize.get('ReportAppBar_SaveAsDialogTitle');
                modalDialog.showCustomDialog(dialogTitle, content, promptActions, function (dialogContent) {
                    dialogContent.parent().find('input[value = "' + saveText + '"]').prop('disabled', true);
                    nameValueQuery.focus().on('change keyup paste mouseup', function (e) {
                        var shouldDisable = !isValidReportName($(e.target).val());
                        dialogContent.parent().find('input[value = "' + saveText + '"]').prop('disabled', shouldDisable);
                    }).on('keyup', function (e) {
                        if (e.which === jsCommon.DOMConstants.enterKeyCode && isValidReportName($(e.target).val())) {
                            promptActions[0].actionCallback(null, null, null);
                        }
                        else if (e.which === jsCommon.DOMConstants.escKeyCode) {
                            promptActions[1].actionCallback(null, null, null);
                        }
                    });
                }, true);
                return deferred;
            }
            controllers.showSaveAsDialog = showSaveAsDialog;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var ScopeUtils;
        (function (ScopeUtils) {
            /** Search the parent scope for the dataSources. */
            function findDataSources(scope) {
                var dataSources;
                var targetScope = scope;
                while (targetScope && !(dataSources = targetScope['dataSources'])) {
                    targetScope = targetScope.$parent;
                }
                return dataSources;
            }
            ScopeUtils.findDataSources = findDataSources;
        })(ScopeUtils = explore.ScopeUtils || (explore.ScopeUtils = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var SectionUtils;
        (function (SectionUtils) {
            var ArrayExtensions = jsCommon.ArrayExtensions;
            function gotoSection(viewModel, targetSectionIndex, selectionService, sectionNavigationService) {
                var contract = viewModel.exploration.contract;
                if (targetSectionIndex > -1 && contract && targetSectionIndex < contract.sections.length) {
                    if (selectionService && selectionService.getSelectedElements().length > 0)
                        selectionService.clearSelection();
                    viewModel.sectionStatus.currentSectionNumber = targetSectionIndex;
                    var targetSection = contract.sections[targetSectionIndex];
                    viewModel.exploration.exploreCanvas = explore.viewModels.ViewModelFactory.convertSectionToExploreCanvas(contract.sections[targetSectionIndex]);
                    var sectionViewModels = viewModel.exploration.sections;
                    for (var i = sectionViewModels.length - 1; i >= 0; --i)
                        sectionViewModels[i].selected = i === targetSectionIndex;
                    // Clear the cross-highlight as the visuals will reload and the source chart won't know that something is selected.
                    targetSection.crossHighlight = undefined;
                    sectionNavigationService.goto(targetSection);
                }
            }
            SectionUtils.gotoSection = gotoSection;
            function renameSection(viewModel, newName, sectionIndex) {
                var contract = viewModel.exploration.contract;
                contract.sections[sectionIndex].displayName = newName;
                viewModel.exploration.sections[sectionIndex].isTabEditable = false;
            }
            SectionUtils.renameSection = renameSection;
            function deleteSection(viewModel, targetSectionIndex, selectionService, sectionNavigationService) {
                var contract = viewModel.exploration.contract;
                if (targetSectionIndex > -1 && contract && targetSectionIndex < contract.sections.length) {
                    var nextSlideIndex;
                    if (viewModel.sectionStatus.currentSectionNumber === targetSectionIndex)
                        nextSlideIndex = targetSectionIndex;
                    var sectionContract = contract.sections[targetSectionIndex];
                    contract.sections.splice(targetSectionIndex, 1);
                    var currentSectionNumber = viewModel.sectionStatus.currentSectionNumber;
                    viewModel.sectionStatus.currentSectionNumber = nextSlideIndex || targetSectionIndex > currentSectionNumber ? currentSectionNumber : currentSectionNumber - 1;
                    var sectionViewModelIndex;
                    var sections = viewModel.exploration.sections;
                    for (var i = sections.length - 1; i >= 0; --i) {
                        if (sections[i].contract === sectionContract) {
                            sectionViewModelIndex = i;
                            break;
                        }
                    }
                    if (sectionViewModelIndex !== undefined) {
                        sections.splice(sectionViewModelIndex, 1);
                    }
                    if (nextSlideIndex !== undefined) {
                        if (nextSlideIndex >= contract.sections.length)
                            nextSlideIndex = contract.sections.length - 1;
                        gotoSection(viewModel, nextSlideIndex, selectionService, sectionNavigationService);
                    }
                }
            }
            SectionUtils.deleteSection = deleteSection;
            function getNextSectionName(contract) {
                var sectionNamePrefix = 'ReportSection';
                var index = 0;
                var currentSectionName = sectionNamePrefix;
                while (ArrayExtensions.findItemWithName(contract.sections, currentSectionName)) {
                    index++;
                    currentSectionName = sectionNamePrefix + index;
                }
                return currentSectionName;
            }
            function getNextSectionDisplayNameWithIndex(sections) {
                var index = 1;
                var currentSectionName = powerbi.common.localize.format('Explore_Section_Page', [index.toFixed()]);
                while (_.findLastIndex(sections, function (x) { return x.displayName === currentSectionName; }) >= 0) {
                    currentSectionName = powerbi.common.localize.format('Explore_Section_Page', [(++index).toFixed()]);
                }
                return currentSectionName;
            }
            function createSection(viewModel, selectionService, sectionNavigationService) {
                var contract = viewModel.exploration.contract;
                var sections = contract.sections;
                sections.push({
                    name: getNextSectionName(contract),
                    displayName: getNextSectionDisplayNameWithIndex(contract.sections),
                    visualContainers: [],
                    filters: []
                });
                viewModel.exploration.sections.push(explore.viewModels.ViewModelFactory.convertSectionToViewModel(sections[sections.length - 1]));
                gotoSection(viewModel, sections.length - 1, selectionService, sectionNavigationService);
            }
            SectionUtils.createSection = createSection;
            function findSectionIndexForSectionName(exploration, sectionName) {
                if (!exploration || !exploration.sections)
                    return;
                var sections = exploration.sections;
                for (var i = sections.length - 1; i >= 0; --i) {
                    var section = sections[i];
                    if (section.name === sectionName) {
                        return i;
                    }
                }
                return;
            }
            SectionUtils.findSectionIndexForSectionName = findSectionIndexForSectionName;
            function fillDefaultSectionDisplayNames(exploration) {
                var sections = exploration.sections;
                for (var i = 0, len = sections.length; i < len; i++) {
                    var section = sections[i];
                    if (!section.displayName) {
                        section.displayName = getNextSectionDisplayNameWithIndex(exploration.sections);
                    }
                }
            }
            SectionUtils.fillDefaultSectionDisplayNames = fillDefaultSectionDisplayNames;
            function reorderSection(viewModel, originalSectionIndex, targetSectionIndex) {
                if (originalSectionIndex < 0 || targetSectionIndex < 0)
                    return false;
                var reorderSucceeded = false;
                var sectionContracts = viewModel.exploration.contract.sections;
                var sectionContract = sectionContracts[originalSectionIndex];
                sectionContracts.splice(originalSectionIndex, 1);
                sectionContracts.splice(targetSectionIndex, 0, sectionContract);
                var sectionViewModelIndex;
                var sectionViewModel;
                var sections = viewModel.exploration.sections;
                for (var i = sections.length - 1; i >= 0; --i) {
                    if (sections[i].contract === sectionContract) {
                        sectionViewModelIndex = i;
                        sectionViewModel = sections[i];
                        break;
                    }
                }
                if (sectionViewModelIndex !== undefined && sectionViewModel) {
                    sections.splice(sectionViewModelIndex, 1);
                    sections.splice(targetSectionIndex, 0, sectionViewModel);
                    reorderSucceeded = true;
                }
                for (var i = sections.length - 1; i >= 0; --i) {
                    if (sections[i].selected) {
                        viewModel.sectionStatus.currentSectionNumber = i;
                        break;
                    }
                }
                return reorderSucceeded;
            }
            SectionUtils.reorderSection = reorderSection;
        })(SectionUtils = explore.SectionUtils || (explore.SectionUtils = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var TaskPaneController = (function () {
                function TaskPaneController($scope) {
                    var _this = this;
                    this.scope = $scope;
                    this.scope.toggleTaskPane = function () { return _this.toggleTaskPane(); };
                }
                TaskPaneController.createOptions = function () {
                    return {};
                };
                TaskPaneController.prototype.toggleTaskPane = function () {
                    this.scope.viewModel.isPaneExpanded = !this.scope.viewModel.isPaneExpanded;
                };
                return TaskPaneController;
            })();
            controllers.TaskPaneController = TaskPaneController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var commonConstants = powerbi.constants;
            var DataViewMerger = powerbi.data.segmentation.DataViewMerger;
            var events = powerbi.explore.services.events;
            var selectionUtils = explore.services.selectionUtils;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var VisualContainerUtils = explore.util.VisualContainerUtils;
            var visualStyles = powerbi.common.services.visualStyles;
            var VisualContainerController = (function () {
                function VisualContainerController($scope, services) {
                    var _this = this;
                    this.sortDelay = 500;
                    this.scope = $scope;
                    this.services = services;
                    this.dataProxy = this.services.singleExecutableDataProxyFactory.create();
                    this.spinnerCount = 0;
                    this.scopeEventManager = powerbi.common.createScopeEventSubscriptionManager($scope);
                    this.scope.viewModeState = services.viewModeState;
                    this.scope.extendedMenu = false;
                    this.scope.canPin = function () { return _this.canPin(); };
                    this.scope.viewModel.showWatermark = false;
                    this.scope.convertTo = function (type) { return _this.convertTo(type); };
                    this.scope.disableVisual = function (type) { return _this.disableVisual(type); };
                    this.scope.toggleExtendedMenu = function (e) {
                        _this.scope.extendedMenu = !_this.scope.extendedMenu;
                        e.stopPropagation();
                    };
                    this.scope.toggleSelect = function (e) {
                        _this.selectVisualContainer();
                        _this.services.overlayService.hideAllDropdowns();
                        jQuery(e.currentTarget).focus();
                        e.stopPropagation();
                    };
                    this.scope.toggleSort = function (e, sortableField) {
                        _this.toggleSort(sortableField);
                        e.stopPropagation();
                    };
                    this.scope.toggleSortMenu = function () {
                        if (_this.scope.sortSetting.sortableFields.length > 0 && _this.scope.sortSetting.defaultSortBehavior) {
                            _this.scope.sortSetting.sortMenu = !_this.scope.sortSetting.sortMenu;
                        }
                    };
                    this.scope.showSortMenu = function () {
                        return !_this.scope.sortSetting.defaultSortBehavior || _this.scope.sortSetting.sortableFields.length === 0;
                    };
                    this.scope.showErrorDetails = function () {
                        var showMoreErrorInfo = powerbi.explore.util.GenerateShowMoreErrorDetails(_this.scope.viewModel.errorInfo.details);
                        powerbi.common.errorService.error(showMoreErrorInfo.message, 'VisualContainer_FailedToDisplayVisual', {
                            title: showMoreErrorInfo.title,
                            additionalErrorInfo: showMoreErrorInfo.additionalErrorInfo,
                        });
                    };
                    this.scope.toggleErrorMessage = function () {
                        // For errors don't allow the show/hide.
                        if (_this.scope.viewModel.errorInfo && _this.scope.viewModel.errorInfo.showVisualOverlay)
                            return;
                        _this.scope.viewModel.isErrorMessageVisible = !_this.scope.viewModel.isErrorMessageVisible;
                    };
                    this.scope.fixReferences = function () {
                        _this.services.visualAuthoring.removeInvalidExpressions(_this.scope.viewModel.contract.config, explore.ScopeUtils.findDataSources(_this.scope));
                    };
                    this.scope.deleteVisualContainer = function () { return _this.deleteVisualContainer(); };
                    this.scope.hasPositionOverride = function () {
                        return _this.scope.viewModel.overridePosition != null;
                    };
                    this.scope.pinVisualContainer = function (e) {
                        var dataSources = explore.ScopeUtils.findDataSources(_this.scope);
                        var viewModel = _this.scope.viewModel;
                        _this.services.pinVisualService.pinVisualContainer(dataSources, viewModel.contract, viewModel.readOnlyState.visual.type, viewModel.hostServices.getFilters(_this.services.visualPlugin));
                        e.stopPropagation();
                    };
                    this.scopeEventManager.subscribe(explore.constants.explorationLoadedEventName, function () { return _this.runQuery(true); });
                    this.scope.viewModel.setServices({
                        getLocalizedString: function (id) { return _this.services.localizationService.get(id); },
                        canSelect: function (args) { return _this.canSelect(args); },
                        onDragStart: function (args) { return _this.onDragStart(args); },
                        onSelect: function (args) { return _this.onSelect(args); },
                        persistProperties: function (changes) { return _this.persistProperties(changes); },
                        loadMoreData: function () { return _this.loadMoreData(); },
                        onCustomSort: function (args) { return _this.onCustomSort(args.sortDescriptors); },
                        getViewMode: function () { return _this.scope.viewModeState.viewMode; },
                        setWarnings: function (clientWarnings) {
                            if (clientWarnings && clientWarnings.length > 0) {
                                var visualWarning = clientWarnings[0].getMessages(_this.services.localizationService);
                                _this.showInternalErrorMessage(visualWarning.message, visualWarning.title, visualWarning.detail, false);
                            }
                            else {
                                _this.clearWarning();
                            }
                        },
                        setToolbar: function ($selector) { return _this.setToolbar($selector); },
                    }, this.services.visualPlugin);
                    var themeColors = this.services.viewModeState && this.services.viewModeState.themeColors;
                    var visualStylesValue = visualStyles.create(themeColors);
                    this.scope.viewModel.setVisualStyle(visualStylesValue);
                    this.resetBackground();
                    this.resetTitle();
                    this.resetSortSettings();
                    this.scope.viewModel.updateViewState();
                    this.updateSelection();
                    this.scopeEventManager.subscribe(commonConstants.dropEventName, function (event, originalEvent, args) {
                        var field = args.dragData.field;
                        if (!field)
                            return;
                        event.stopPropagation();
                        selectionUtils.selectVisualContainer(_this.scope.viewModel.contract, _this.services.selectionService);
                        _this.services.visualAuthoring.addFieldToVisual(SQExprBuilder.fieldDef(field), explore.ScopeUtils.findDataSources(_this.scope), _this.scope.viewModel.contract);
                        _this.services.telemetryService.logEvent(powerbi.telemetry.EXAddField, 1 /* DraggedToVisual */, VisualContainerUtils.getVisualType(_this.scope.viewModel.contract));
                    }).subscribe(explore.constants.DragResizeElementDragStartEventName, function (event, size) {
                        _this.selectVisualContainer();
                        _this.scope.$apply();
                    });
                    this.scopeEventManager.subscribe(powerbi.constants.visualDataChanged, function (event) {
                        event.stopPropagation();
                        _this.services.eventBridge.publishToChannel(events.visualContainerDataRendered, _this.scope.viewModel.contract);
                    });
                    // attach drag resize events
                    this.scopeEventManager.subscribe(explore.constants.DragResizeElementDragEndEventName, function (event, dimensions) { return _this.updateDimensions(event, dimensions); }).subscribe(explore.constants.DragResizeElementResizeEndEventName, function (event, dimensions) { return _this.updateDimensions(event, dimensions); }).subscribe(explore.constants.DragResizeElementResizeMoveEventName, function (event, size) { return _this.updateVisualViewport(event, size); }).subscribe(explore.constants.DragResizeElementResizeStartEventName, function (event, size) { return _this.hideOverlays(); }).subscribe(explore.constants.DragResizeElementDragStartEventName, function (event, size) { return _this.hideOverlays(); });
                    // Channel Subscription to events: selectionChanged, visualContainerChanged, filterContainerChanged
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.selectionChanged, function () { return _this.updateSelection(); }).subscribe(events.visualContainerChanged, function (e, args) {
                        if (args && args.affectContainer(_this.scope.viewModel.contract) && !_this.tryDeleteEmptyContainer()) {
                            _this.onVisualContainerChanged();
                        }
                    }).subscribe(events.filterContainerChanged, function (e, args) {
                        // TODO: all this logic should be encapsulated in a host service instead.
                        if (args.scope.section !== undefined || args.scope.visualContainer === _this.scope.viewModel.contract)
                            _this.runQuery();
                    }).subscribe(events.dataSelectionChanged, function (e, args) {
                        if (args && args.affectContainer(_this.scope.viewModel.contract))
                            _this.clearDataSelection();
                    }).subscribe(events.explorationUnloaded, function (e, args) { return _this.scopeEventManager.unsubscribeAll(); }).subscribe(events.changeEditMode, function (e, args) { return _this.onChangeEditMode(args); });
                    this.scope.$on('$destroy', function () {
                        subscriptionManager.unsubscribeAll();
                        _this.scope.viewModel.contract.config.singleVisual.getCurrentVisual = undefined;
                    });
                    this.onVisualContainerChanged(true);
                }
                VisualContainerController.createOptions = function () {
                    return {
                        additionalServices: [
                            'displayNameService',
                            'conceptualSchemaProxy',
                            'singleExecutableDataProxyFactory',
                            'dragDataService',
                            'overlayService',
                            'explorationSerializer',
                            'localizationService',
                            'featureSwitchService',
                            'themeService',
                            'telemetryService',
                        ],
                        scopedDependencies: [
                            'eventBridge',
                            'pinVisualService',
                            'selectionService',
                            'sortService',
                            'undoRedoService',
                            'viewModeState',
                            'visualPlugin',
                            'visualAuthoring',
                            'visualQueryGenerator',
                        ],
                    };
                };
                VisualContainerController.prototype.restoreFromCache = function () {
                    var contract = this.scope.viewModel.contract;
                    if (contract.cachedData && contract.cachedData.data) {
                        if (this.services.featureSwitchService.featureSwitches.saveVisualData) {
                            var dataPayload = JSON.parse(jsCommon.GzipUtility.uncompress(contract.cachedData.data));
                            var dataObject = powerbi.data.dsr.read(dataPayload);
                            var visualData = {
                                dataView: dataObject.dataView
                            };
                            var visual = this.scope.viewModel.readOnlyState.visual;
                            visual.data = visualData;
                            //TODO QnA won't have the transforms for now.  It'll need a different way to apply the cache.
                            if (contract.cachedData.transforms) {
                                var visualType = visual.type;
                                var capabilities = this.services.visualPlugin.capabilities(visualType);
                                var objectDescs = capabilities ? capabilities.objects : undefined;
                                var transforms = powerbi.data.services.DataViewTransformActionsSerializer.deserializeTransformActions(visualType, objectDescs, contract.cachedData.transforms);
                                if (transforms)
                                    this.scope.viewModel.readOnlyState.visual.dataTransforms = transforms;
                            }
                        }
                    }
                };
                VisualContainerController.prototype.setToolbar = function ($toolbar) {
                    var _this = this;
                    if (this.scope.viewModel.$toolbarElement) {
                        this.services.overlayService.unregister($toolbar, false);
                    }
                    this.scope.viewModel.$toolbarElement = $toolbar;
                    this.setToolbarVisible(true);
                    this.services.overlayService.register($toolbar, false);
                    this.scope.$on('$destroy', function () { return _this.services.overlayService.unregister($toolbar, false); });
                };
                VisualContainerController.prototype.setToolbarVisible = function (visible) {
                    var _this = this;
                    if (!this.scope.viewModel.$toolbarElement)
                        return;
                    if (this.scope.viewModel.toolbarVisible !== visible) {
                        this.scope.$applyAsync(function () {
                            _this.scope.viewModel.toolbarVisible = visible;
                        });
                    }
                };
                VisualContainerController.prototype.hideOverlays = function () {
                    this.services.overlayService.hideAllDropdowns();
                    this.setToolbarVisible(false);
                };
                VisualContainerController.prototype.canPin = function () {
                    var visualTypeExists = false;
                    if (this.scope.viewModel) {
                        var visualType = this.scope.viewModel.readOnlyState.visual.type;
                        visualTypeExists = this.services.pinVisualService.canPinVisualType(visualType);
                    }
                    return this.services.viewModeState.supportsPinning && visualTypeExists;
                };
                VisualContainerController.prototype.onVisualContainerChanged = function (initialLoad) {
                    var viewModel = this.scope.viewModel;
                    viewModel.contract.config.singleVisual.getCurrentVisual = function () { return viewModel.readOnlyState.visual.visual; };
                    var visualType = viewModel.readOnlyState.visual.type;
                    if (visualType && !this.services.visualPlugin.getPlugin(visualType)) {
                        this.showInternalErrorMessage(this.services.localizationService.get('VisualContainer_UnableToFindVisualMessage'), this.services.localizationService.get('VisualContainer_UnableToFindVisualKey'), this.services.localizationService.get('VisualContainer_UnableToFindVisualValue'), true);
                    }
                    else {
                        viewModel.errorInfo = null;
                    }
                    this.resetBackground();
                    this.resetTitle();
                    viewModel.updateViewState();
                    var dataViewSource = viewModel.dataViewSource;
                    if (dataViewSource) {
                        this.visualizeDataViewSource(dataViewSource);
                        // reset data view source.
                        viewModel.dataViewSource = null;
                    }
                    else
                        this.runQuery(initialLoad);
                    this.resetSortSettings();
                };
                VisualContainerController.prototype.showInternalErrorMessage = function (message, key, val, isError) {
                    var details = {
                        message: message,
                        additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: val, }]
                    };
                    this.scope.viewModel.errorInfo = {
                        details: details,
                        showVisualOverlay: isError,
                    };
                    this.scope.viewModel.isErrorMessageVisible = isError;
                };
                VisualContainerController.prototype.clearWarning = function () {
                    var errorInfo = this.scope.viewModel.errorInfo;
                    if (errorInfo && errorInfo.showVisualOverlay === false) {
                        // Clear any exsiting warnings; do not clear errors.
                        this.scope.viewModel.errorInfo = null;
                    }
                };
                VisualContainerController.prototype.updateVisualViewport = function (event, size) {
                    var _this = this;
                    event.stopPropagation();
                    var viewport = { width: size.width, height: size.height };
                    var visual = this.scope.viewModel.readOnlyState.visual.visual;
                    if (visual) {
                        // Perf: We need to issue these updates directly to the IVisual - without the Angular overhead
                        window.requestAnimationFrame(function () {
                            visual.onResizing({
                                width: viewport.width,
                                height: viewport.height - explore.viewModels.VisualContainer.VisualContainerHeaderHeight - (_this.scope.viewModel.supportsTitle ? explore.viewModels.VisualContainer.VisualTitleHeight : 0)
                            }, 0);
                        });
                    }
                    this.setToolbarVisible(false);
                };
                VisualContainerController.prototype.updateDimensions = function (event, dimensions) {
                    var _this = this;
                    event.stopPropagation();
                    this.services.undoRedoService.register(function () {
                        _this.scope.viewModel.position = { x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.height };
                        _this.scope.viewModel.updateViewState();
                    });
                    this.setToolbarVisible(true);
                };
                VisualContainerController.prototype.convertTo = function (type) {
                    var _this = this;
                    this.services.eventBridge.publishBubbling(this.scope, events.visualConversion, {
                        visualContainer: this.scope.viewModel.contract,
                        newVisualType: type,
                        actionAfterConversion: function () { return _this.resetSortSettings(); },
                    });
                };
                VisualContainerController.prototype.disableVisual = function (type) {
                    //TODO: rename to isVisualDisabled and check if the visual is a query visual
                    return this.scope.viewModel.readOnlyState.visual.type === type;
                };
                VisualContainerController.prototype.selectVisualContainer = function () {
                    selectionUtils.selectVisualContainer(this.scope.viewModel.contract, this.services.selectionService);
                };
                VisualContainerController.prototype.updateSelection = function () {
                    var isSelected = selectionUtils.isVisualContainerSelected(this.scope.viewModel.contract, this.services.selectionService);
                    this.scope.viewModel.setSelected(isSelected);
                    if (!isSelected) {
                        this.scope.extendedMenu = false;
                        this.scope.sortSetting.sortMenu = false;
                        this.scope.sortSetting.sortMenuDropdown = false;
                    }
                    this.setToolbarVisible(isSelected);
                };
                VisualContainerController.prototype.clearDataSelection = function () {
                    var visualDefinition = this.scope.viewModel.readOnlyState.visual;
                    debug.assertValue(visualDefinition, 'Expected visual to be present');
                    var visual = visualDefinition.visual;
                    // May not be present if the visual is not implemented.
                    if (!visual)
                        return;
                    if (visual.onClearSelection)
                        visual.onClearSelection();
                };
                VisualContainerController.prototype.onChangeEditMode = function (editMode) {
                    var visualDefinition = this.scope.viewModel.readOnlyState.visual;
                    debug.assertValue(visualDefinition, 'Expected visual to be present');
                    var visual = visualDefinition.visual;
                    // May not be present if the visual is not implemented.
                    if (!visual)
                        return;
                    if (visual.onViewModeChanged)
                        visual.onViewModeChanged(editMode ? 1 /* Edit */ : 0 /* View */);
                };
                VisualContainerController.prototype.toggleSort = function (sortableField) {
                    var _this = this;
                    if (this.sortPromise) {
                        // if a previous sort action is pending, just cancel it
                        // since we only need to display the latest sorting order,
                        // this would improve performance in case user clicks sort button rapidly
                        // within a short period of time
                        this.services.timeout.cancel(this.sortPromise);
                    }
                    this.sortPromise = this.services.timeout(function () {
                        if (sortableField) {
                            // toggle sort order with the specific sort definition
                            _this.scope.sortSetting.sortMenu = false;
                            _this.scope.sortSetting.sortMenuDropdown = false;
                            var contract = _this.scope.viewModel.contract;
                            var sortByExpression = [{
                                direction: _this.scope.viewModel.readOnlyState.actualSortDirection || 2 /* Descending */,
                                expr: sortableField.expr
                            }];
                            var query = contract.config.singleVisual.query;
                            if (!sortableField.active) {
                                /** sortBy doesn't exist, add it */
                                _this.services.sortService.resetSort(query);
                                _this.resetSortableFieldsStatus();
                                _this.services.visualAuthoring.setOrderBy(contract, sortByExpression);
                            }
                            else {
                                /** sortBy already exists, remove it */
                                _this.services.visualAuthoring.removeOrderBy(contract, sortByExpression.map(function (expr) { return expr.expr; }));
                            }
                            var newSortableField = _.find(_this.scope.sortSetting.sortableFields, function (field) {
                                return powerbi.data.SQExpr.equals(sortableField.expr, field.expr);
                            });
                            if (newSortableField) {
                                newSortableField.active = !sortableField.active;
                            }
                        }
                        else if (_this.scope.viewModel.readOnlyState.actualSortDirection !== undefined) {
                            // toggle sort order with the current sort definition
                            var contract = _this.scope.viewModel.contract;
                            var orderBy = contract.config.singleVisual.query.defn.orderBy();
                            if (orderBy && orderBy.length > 0) {
                                orderBy[0].direction = _this.toggleDirection(_this.scope.viewModel.readOnlyState.actualSortDirection);
                                _this.services.visualAuthoring.setOrderBy(contract, orderBy);
                            }
                        }
                        // set it back to null
                        _this.sortPromise = null;
                    }, this.sortDelay);
                    this.services.overlayService.hideAllDropdowns();
                };
                VisualContainerController.prototype.resetSortableFieldsStatus = function (active) {
                    var status = active || false;
                    if (this.scope.sortSetting.sortableFields) {
                        for (var i = 0, len = this.scope.sortSetting.sortableFields.length; i < len; i++) {
                            this.scope.sortSetting.sortableFields[i].active = status;
                        }
                    }
                };
                VisualContainerController.prototype.toggleDirection = function (direction) {
                    if (direction === 1 /* Ascending */)
                        return 2 /* Descending */;
                    return 1 /* Ascending */;
                };
                VisualContainerController.prototype.resetSortSettings = function () {
                    var _this = this;
                    this.scope.sortSetting = {
                        sortMenu: false,
                        sortMenuDropdown: false,
                        defaultSortBehavior: false,
                        sortableFields: []
                    };
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    if (dataSources) {
                        this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                            var visualConfig = _this.scope.viewModel.contract.config.singleVisual;
                            if (visualConfig && visualConfig.query) {
                                var visualCapabilities = _this.services.visualPlugin.capabilities(visualConfig.visualType);
                                var query = visualConfig.query;
                                if (visualCapabilities) {
                                    _this.scope.sortSetting.defaultSortBehavior = visualCapabilities.sorting !== undefined && visualCapabilities.sorting.default !== undefined;
                                    _this.scope.sortSetting.sortableFields = _this.services.sortService.getSortableFields(query, query.projections, visualConfig.visualType, schema, visualConfig);
                                }
                            }
                            var firstActiveSortableFieldIndex = _.findIndex(_this.scope.sortSetting.sortableFields, function (sortableField) {
                                return sortableField.active;
                            });
                            if (firstActiveSortableFieldIndex >= 0) {
                                _this.scope.viewModel.readOnlyState.actualSortDirection = _this.scope.sortSetting.sortableFields[firstActiveSortableFieldIndex].sortDirection;
                            }
                        });
                    }
                };
                VisualContainerController.prototype.resetBackground = function () {
                    var visualConfig = this.scope.viewModel.contract.config.singleVisual;
                    var visualBackground = visualConfig.background;
                    if (!visualBackground) {
                        return;
                    }
                    var visualBackgroundData = powerbi.visuals.visualBackgroundHelper.getDefaultValues();
                    if (Object.prototype.hasOwnProperty.call(visualBackground, 'show')) {
                        visualBackgroundData.show = visualBackground.show;
                    }
                    if (!visualBackgroundData.show) {
                        visualBackgroundData.transparency = powerbi.visuals.visualBackgroundHelper.getDefaultTransparency();
                        visualBackgroundData.color = powerbi.visuals.visualBackgroundHelper.getDefaultColor();
                    }
                    else {
                        // Transparency can be 0 so should check it
                        if (visualBackground.transparency || visualBackground.transparency === 0) {
                            visualBackgroundData.transparency = visualBackground.transparency;
                        }
                        if (visualBackground.color) {
                            visualBackgroundData.color = visualBackground.color;
                        }
                    }
                    this.scope.viewModel.visualBackground = {
                        // Transparency should be between 0 and 1 for the browser
                        // Must use rgb because in case there is a transparency it should use rgba()
                        colorRGB: explore.util.ColorUtility.hexToRGBString(visualBackgroundData.color, visualBackgroundData.transparency / 100),
                    };
                };
                VisualContainerController.prototype.resetTitle = function () {
                    var _this = this;
                    this.scope.viewModel.visualTitle = undefined;
                    var visualConfig = this.scope.viewModel.contract.config.singleVisual;
                    var visualCapabilities = this.services.visualPlugin.capabilities(visualConfig.visualType);
                    if (visualCapabilities && !explore.contracts.VisualTitle.isHidden(visualConfig.title)) {
                        this.scope.viewModel.supportsTitle = !visualCapabilities.suppressDefaultTitle;
                        var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                        if (dataSources) {
                            this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                                if (!visualCapabilities.suppressDefaultTitle && _this.services.displayNameService) {
                                    _this.scope.viewModel.visualTitle = _this.services.displayNameService.getVisualTitle(visualConfig, schema, visualCapabilities, powerbi.common.localize);
                                    _this.scope.viewModel.showVisualTitle = !explore.contracts.VisualTitle.isHidden(_this.scope.viewModel.visualTitle);
                                }
                            });
                        }
                    }
                    else {
                        this.scope.viewModel.supportsTitle = false;
                    }
                };
                VisualContainerController.prototype.canSelect = function (args) {
                    var selectors = args.data;
                    // We can't have multiple selections if any include more than one identity
                    if (selectors.length > 1) {
                        if (selectors.some(function (value) { return value.data && value.data.length > 1; }))
                            return false;
                    }
                    // Todo: check for cases of trying to select a category and a series (not the intersection)
                    return true;
                };
                VisualContainerController.prototype.onDragStart = function (args) {
                    args.data.source = this.services.explorationSerializer.serializeVisualContainer(this.scope.viewModel.contract);
                    this.services.dragDataService.setDragContext(args.data);
                };
                VisualContainerController.prototype.onSelect = function (args) {
                    this.scope.viewModel.hostServices.selectDataPoint(this.services.eventBridge, this.services.visualPlugin, args);
                };
                VisualContainerController.prototype.runQueryImpl = function (successCallback, errorCallback, moreDataToken) {
                    var _this = this;
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    // TODO jwarner working around clearing the exploration causes the existing visuals to reload
                    if (!dataSources)
                        return;
                    // If the visual would have data, show the spinner
                    var visual = this.scope.viewModel.readOnlyState.visual;
                    if (visual && VisualContainerUtils.isQueryVisual(visual.type, visual.visualPlugin)) {
                        this.startSpinner();
                        this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                            var generatedQuery = _this.services.visualQueryGenerator.execute({
                                visualContainer: _this.scope.viewModel.contract,
                                dataSources: dataSources,
                                schema: schema,
                                additionalFilters: _this.scope.viewModel.hostServices.getFilters(_this.services.visualPlugin),
                                restartToken: moreDataToken
                            });
                            if (generatedQuery) {
                                if (generatedQuery.error)
                                    return errorCallback(generatedQuery.error);
                                return _this.dataProxy.execute(generatedQuery.options).then(function (result) { return successCallback(result, generatedQuery, schema); }, function (result) { return errorCallback(result); });
                            }
                        }).finally(function () { return _this.stopSpinner(); });
                    }
                };
                VisualContainerController.prototype.startSpinner = function () {
                    this.scope.viewModel.showSpinner = true;
                    this.spinnerCount++;
                };
                VisualContainerController.prototype.stopSpinner = function () {
                    this.scope.viewModel.showSpinner = ((--this.spinnerCount) > 0);
                };
                VisualContainerController.prototype.updateContractCache = function (dataAsObject, generatedQuery, schema) {
                    if (!this.services.featureSwitchService.featureSwitches.saveVisualData)
                        return;
                    var viewModel = this.scope.viewModel;
                    if (!viewModel)
                        return;
                    viewModel.contract.cachedData = VisualContainerUtils.createCacheEntry(viewModel.readOnlyState.visual, this.services.visualPlugin, this.services.displayNameService, dataAsObject, generatedQuery, schema, viewModel.contract.config.singleVisual);
                };
                VisualContainerController.prototype.runQuery = function (initialLoad) {
                    var _this = this;
                    if (initialLoad)
                        this.restoreFromCache();
                    var successCallback = function (result, generatedQuery, schema) {
                        _this.handleQueryResult(result, generatedQuery, schema);
                    };
                    var errorCallback = function (promiseValue) {
                        _this.handleQueryErrors(promiseValue);
                    };
                    this.runQueryImpl(successCallback, errorCallback);
                };
                VisualContainerController.prototype.visualizeDataViewSource = function (dataViewSource) {
                    var _this = this;
                    debug.assertValue(dataViewSource, 'dataViewSource');
                    var dataObject = powerbi.data.dsr.read(dataViewSource.data);
                    var error = dataObject.error;
                    if (error) {
                        this.handleQueryErrors(error);
                        return;
                    }
                    var dataSources = explore.ScopeUtils.findDataSources(this.scope);
                    debug.assertValue(dataSources, 'dataSources');
                    if (!dataSources)
                        return;
                    // TODO: refactor the code below; there are similarity with runQueryImpl.
                    this.services.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                        var viewModel = _this.scope.viewModel;
                        var generatedQuery = _this.services.visualQueryGenerator.execute({
                            visualContainer: viewModel.contract,
                            dataSources: dataSources,
                            schema: schema,
                            additionalFilters: viewModel.hostServices.getFilters(_this.services.visualPlugin),
                            restartToken: dataObject.restartToken
                        });
                        if (!generatedQuery)
                            return;
                        _this.handleQueryResult({
                            dataViewSource: dataViewSource,
                            dataProviderResult: dataObject,
                        }, generatedQuery, schema);
                    });
                };
                VisualContainerController.prototype.handleQueryResult = function (result, generatedQuery, schema) {
                    // clear error if set
                    this.clearError();
                    if (result && result.dataProviderResult.warning)
                        this.handleWarning(result.dataProviderResult.warning, generatedQuery);
                    var visual = this.scope.viewModel.readOnlyState.visual;
                    visual.dataTransforms = generatedQuery.transforms;
                    var visualData = {
                        dataView: result ? result.dataProviderResult.dataView : null
                    };
                    var isFirstSegment = visualData.dataView != null && visualData.dataView.metadata != null && visualData.dataView.metadata.segment != null;
                    if (isFirstSegment)
                        visualData.isFirstSegment = isFirstSegment;
                    visual.data = visualData;
                    var dataAsObject = result && result.dataViewSource ? result.dataViewSource.data : undefined;
                    this.updateContractCache(dataAsObject, generatedQuery, schema);
                    this.moreDataToken = result ? result.dataProviderResult.restartToken : null;
                };
                VisualContainerController.prototype.handleQueryErrors = function (clientError) {
                    if (!clientError)
                        clientError = new powerbi.UnknownClientError();
                    if (clientError.ignorable && clientError.ignorable === true)
                        return;
                    var visual = this.scope.viewModel.readOnlyState.visual;
                    this.scope.viewModel.errorInfo = {
                        details: clientError.getDetails(powerbi.common.localize),
                        showVisualOverlay: true,
                        canFixReferences: (clientError.code === 'Missing_References'),
                    };
                    this.scope.viewModel.isErrorMessageVisible = true;
                    visual.data = null;
                };
                VisualContainerController.prototype.handleWarning = function (warning, result) {
                    warning.columnNameFromIndex = function (index) {
                        var selects = result.transforms.selects;
                        if (selects.length <= index)
                            return null;
                        else
                            return selects[index].displayName;
                    };
                    this.scope.viewModel.errorInfo = {
                        details: warning.getDetails(powerbi.common.localize),
                        showVisualOverlay: false,
                    };
                };
                VisualContainerController.prototype.clearError = function () {
                    if (this.scope.viewModel.errorInfo && this.scope.viewModel.errorInfo.showVisualOverlay) {
                        // Clear out error-level messages only; if there was a warning leave it.
                        this.scope.viewModel.errorInfo = undefined;
                        this.scope.viewModel.isErrorMessageVisible = false;
                    }
                };
                VisualContainerController.prototype.loadMoreData = function () {
                    var _this = this;
                    if (!this.moreDataToken)
                        return;
                    var successCallback = function (result, generatedQuery) {
                        // clear error if set
                        _this.clearError();
                        if (result && result.dataProviderResult.warning)
                            _this.handleWarning(result.dataProviderResult.warning, generatedQuery);
                        var visual = _this.scope.viewModel.readOnlyState.visual;
                        var segment = result ? result.dataProviderResult.dataView : null;
                        if (segment) {
                            debug.assert(visual.data != null && visual.data.dataView != null, "Expected to have previous segment already");
                            var previousDataView = visual.data.dataView;
                            DataViewMerger.mergeDataViews(previousDataView, segment);
                            var newData = {
                                dataView: previousDataView,
                                isFirstSegment: false
                            };
                            _this.moreDataToken = result ? result.dataProviderResult.restartToken : null;
                            visual.data = newData;
                        }
                    };
                    var errorCallback = function (promiseValue) {
                        _this.handleQueryErrors(promiseValue);
                    };
                    this.runQueryImpl(successCallback, errorCallback, this.moreDataToken);
                };
                VisualContainerController.prototype.persistProperties = function (changes) {
                    var _this = this;
                    var singleVisual = this.scope.viewModel.contract.config.singleVisual;
                    debug.assertValue(singleVisual, 'singleVisual');
                    this.services.undoRedoService.register(function () { return singleVisual.objects = _this.services.visualAuthoring.applyPropertyChanges(changes, singleVisual.objects); });
                };
                VisualContainerController.prototype.onCustomSort = function (sortDescriptor) {
                    // For now we only support a single sortable field
                    debug.assert(sortDescriptor && sortDescriptor.length === 1, "Only a single sortable field is supported.");
                    var fieldDescriptor = sortDescriptor[0];
                    var sortableFields = this.scope.sortSetting.sortableFields.filter(function (f) { return f.queryName === fieldDescriptor.queryName; });
                    if (sortableFields && sortableFields.length === 1) {
                        var sortableField = sortableFields[0];
                        if (sortableField.active)
                            this.toggleSort();
                        else
                            this.toggleSort(sortableField);
                    }
                };
                VisualContainerController.prototype.tryDeleteEmptyContainer = function () {
                    var config = this.scope.viewModel.contract.config;
                    if (config && config.singleVisual && explore.util.VisualContainerUtils.isQueryVisual(config.singleVisual.visualType, this.services.visualPlugin) && config.singleVisual.query && config.singleVisual.query.defn.select().length === 0) {
                        this.deleteVisualContainer(true);
                        return true;
                    }
                    return false;
                };
                // If deleteVisualContainer is run as a side effect of another action such as removing the last field from the fieldlist,
                // the delete actions should not be added as part of the undoframe. Otherwise, an assert will fire to inform the developer
                // that nested transactions are not allowed.
                VisualContainerController.prototype.deleteVisualContainer = function (skipUndo) {
                    var _this = this;
                    if (!skipUndo) {
                        this.services.undoRedoService.register(function () { return _this.deleteVisualContainerInternal(); });
                    }
                    else {
                        this.deleteVisualContainerInternal();
                    }
                };
                VisualContainerController.prototype.deleteVisualContainerInternal = function () {
                    // Clear any cross-highlight put in place by the visual being deleted.
                    this.scope.viewModel.hostServices.clearHighlight(this.services.eventBridge);
                    this.services.eventBridge.publishBubbling(this.scope, events.deleteVisualContainer, this.scope.viewModel.contract);
                };
                return VisualContainerController;
            })();
            controllers.VisualContainerController = VisualContainerController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var selectionUtils = explore.services.selectionUtils;
            var events = powerbi.explore.services.events;
            var VisualContainerUtils = explore.util.VisualContainerUtils;
            var VisualizationPaneController = (function () {
                function VisualizationPaneController($scope, services) {
                    var _this = this;
                    this.scope = $scope;
                    this.services = services;
                    this.scope.viewModeState = services.viewModeState;
                    this.scope.isEditing = services.viewModeState.viewMode === 1 /* Edit */;
                    this.scope.alwaysPopulatePanes = services.viewModeState.alwaysPopulatePanes;
                    this.scope.showVisualTypes = this.scope.isEditing || this.scope.alwaysPopulatePanes;
                    this.scope.setActiveSection = function (sectionType) { return _this.setActiveSection(sectionType); };
                    this.scope.toggle = function () { return _this.toggle(); };
                    this.scope.scrollbarsConfig = {
                        ignoreOverlay: false,
                        ignoreMobile: false,
                    };
                    var subscriptionManager = this.services.eventBridge.createChannelSubscriptionManager().subscribe(events.selectionChanged, function () { return _this.updateSections(); });
                    // Creating a programmatic watch generally isn't recommended, but this is the pattern we've followed elsewhere.
                    // TODO: Create a "EditModeChanged" event and subscribe to it instead.
                    this.scope.$watch('viewModeState.viewMode', function () {
                        if (_this.scope.viewModel) {
                            _this.scope.isEditing = _this.scope.viewModeState.viewMode === 1 /* Edit */;
                            _this.scope.alwaysPopulatePanes = _this.scope.viewModeState.alwaysPopulatePanes;
                            _this.updateShowHideElements();
                            _this.updateSections();
                            _this.updateHeader();
                        }
                    });
                    if (this.scope.viewModel) {
                        this.updateHeader();
                    }
                    this.scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                }
                VisualizationPaneController.createOptions = function () {
                    return {
                        additionalServices: ['featureSwitchService'],
                        scopedDependencies: ['eventBridge', 'selectionService', 'viewModeState', 'visualPlugin'],
                    };
                };
                VisualizationPaneController.prototype.setActiveSection = function (sectionType) {
                    this.scope.viewModel.activeSection = sectionType;
                    this.updateShowHideElements();
                };
                VisualizationPaneController.prototype.updateShowHideElements = function () {
                    var activeSession = this.scope.viewModel.activeSection;
                    var editOrAlwaysPopulatePanes = this.scope.isEditing || this.scope.alwaysPopulatePanes;
                    this.scope.showVisualTypes = editOrAlwaysPopulatePanes;
                    this.scope.showFieldWell = editOrAlwaysPopulatePanes && activeSession === 0 /* Fields */;
                    this.scope.showPropertyPane = editOrAlwaysPopulatePanes && activeSession === 1 /* Format */;
                };
                VisualizationPaneController.prototype.updateSections = function () {
                    var selectedVisual = this.getSelectedVisual(), viewModel = this.scope.viewModel, isSupportedVisual = VisualContainerUtils.isSupportedVisual(selectedVisual, this.services.visualPlugin);
                    if (!selectedVisual || this.scope.viewModeState.viewMode === 0 /* View */ || !isSupportedVisual) {
                        this.setActiveSection(null);
                        viewModel.sections = [];
                        return;
                    }
                    this.setActiveSection(0 /* Fields */);
                    viewModel.sections = [
                        {
                            sectionType: 0 /* Fields */,
                            displayName: powerbi.common.localize.get('VisualizationPane_Section_Fields'),
                            cssClass: 'fields'
                        }
                    ];
                    viewModel.sections.push({
                        sectionType: 1 /* Format */,
                        displayName: powerbi.common.localize.get('VisualizationPane_Section_Format'),
                        cssClass: 'format'
                    });
                };
                VisualizationPaneController.prototype.updateHeader = function () {
                    var localizationKey;
                    if (this.scope.alwaysPopulatePanes || this.scope.isEditing)
                        localizationKey = 'VisualizationPane_Title';
                    else
                        localizationKey = 'VisualizationPane_Filters';
                    this.scope.viewModel.header = powerbi.common.localize.get(localizationKey);
                };
                VisualizationPaneController.prototype.getSelectedVisual = function () {
                    return selectionUtils.getSelectedVisual(this.services.selectionService);
                };
                VisualizationPaneController.prototype.toggle = function () {
                    this.scope.viewModel.isPaneExpanded = !this.scope.viewModel.isPaneExpanded;
                };
                return VisualizationPaneController;
            })();
            controllers.VisualizationPaneController = VisualizationPaneController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var controllers;
        (function (controllers) {
            var events = powerbi.explore.services.events;
            var selectionUtils = explore.services.selectionUtils;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var VisualTypesContainerController = (function () {
                function VisualTypesContainerController($scope, services) {
                    var _this = this;
                    this.services = services;
                    this.scope = $scope;
                    var availableVisuals = explore.viewModels.ViewModelFactory.getAvailableVisuals(this.services.visualPlugin.getVisuals());
                    var visualPluginFilter = $scope.visualPluginFilter;
                    if (visualPluginFilter)
                        availableVisuals = _.filter(availableVisuals, visualPluginFilter);
                    this.scope.viewModel = explore.viewModels.ViewModelFactory.createVisualTypesContainer(availableVisuals);
                    this.scope.isVisualEnabled = function (visual) { return _this.isVisualEnabled(visual); };
                    this.scope.isVisualActive = function (visual) { return _this.isVisualActive(visual); };
                    this.scope.visualAction = function (visual) { return _this.visualAction(visual); };
                }
                VisualTypesContainerController.createOptions = function () {
                    return {
                        scopedDependencies: ['eventBridge', 'selectionService', 'visualPlugin'],
                    };
                };
                VisualTypesContainerController.prototype.isVisualEnabled = function (visual) {
                    var selectedVisual = this.getSelectedVisual();
                    // the visual type is enabled if
                    return !selectedVisual || (selectedVisual && VisualContainerUtils.getVisualType(selectedVisual) !== visual.name && VisualContainerUtils.isQueryVisual(VisualContainerUtils.getVisualType(selectedVisual), this.services.visualPlugin)); // and the selected visual is a query visual
                };
                VisualTypesContainerController.prototype.isVisualActive = function (visual) {
                    var selectedVisual = this.getSelectedVisual();
                    return selectedVisual && VisualContainerUtils.getVisualType(selectedVisual) === visual.name;
                };
                VisualTypesContainerController.prototype.visualAction = function (visual) {
                    var selectedVisual = this.getSelectedVisual();
                    if (selectedVisual) {
                        // current visual selected, convert this visual to the desired visual
                        if (this.isVisualEnabled(visual)) {
                            this.services.eventBridge.publishBubbling(this.scope, events.visualConversion, {
                                visualContainer: selectedVisual,
                                newVisualType: visual.name,
                            });
                        }
                    }
                    else {
                        // no visuals selected, create an empty visual
                        this.services.eventBridge.publishBubbling(this.scope, events.addVisualContainer, visual.name);
                    }
                };
                VisualTypesContainerController.prototype.getSelectedVisual = function () {
                    return selectionUtils.getSelectedVisual(this.services.selectionService);
                };
                return VisualTypesContainerController;
            })();
            controllers.VisualTypesContainerController = VisualTypesContainerController;
        })(controllers = explore.controllers || (explore.controllers = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var AlignmentGroup = (function () {
                function AlignmentGroup() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/inputFields/alignmentGroup.html';
                    this.link = function ($scope) {
                        $scope.setAlignment = function (alignmentValue) {
                            $scope.slice.value = alignmentValue;
                            $scope.save($scope.slice, $scope.card);
                        };
                    };
                }
                return AlignmentGroup;
            })();
            directives.AlignmentGroup = AlignmentGroup;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("AlignmentGroup", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var NumUpDown = (function () {
                function NumUpDown() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/inputFields/numUpDown.html';
                    this.link = function (scope, element, attrs) {
                        scope.onUpDownValueChanged = function (type) {
                            if (type === "up") {
                                scope.slice.value++;
                            }
                            else if (type === "down") {
                                scope.slice.value--;
                            }
                            scope.save(scope.slice, scope.card);
                        };
                    };
                }
                return NumUpDown;
            })();
            directives.NumUpDown = NumUpDown;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("NumUpDown", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var RadioGroup = (function () {
                function RadioGroup() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        property: '=',
                        parentProperty: '=',
                        save: '='
                    };
                    this.templateUrl = 'views/inputFields/radioGroup.html';
                }
                return RadioGroup;
            })();
            directives.RadioGroup = RadioGroup;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("RadioGroup", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ToggleSwitch = (function () {
                function ToggleSwitch() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/inputFields/toggleSwitch.html';
                }
                return ToggleSwitch;
            })();
            directives.ToggleSwitch = ToggleSwitch;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("ToggleSwitch", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var SelectionBox = (function () {
                function SelectionBox() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/inputFields/selectionBox.html';
                    this.link = function ($scope) {
                        $scope.getOptionsTypeName = explore.viewModels.PropertyPaneViewModelFactory.getOptionsTypeName;
                        $scope.showDropdown = false;
                        $scope.items = $scope.viewModel.inputFieldsOptions[$scope.getOptionsTypeName($scope.card, $scope.slice)];
                        var len = $scope.items.length;
                        for (var i = 0; i < len; i++) {
                            var currentItem = $scope.items[i];
                            if (currentItem.value === $scope.slice.value) {
                                $scope.selected = currentItem;
                                break;
                            }
                        }
                        $scope.itemSelected = function (item) {
                            $scope.selected = item;
                            $scope.slice.value = item.value;
                            $scope.showDropdown = false;
                            $scope.save($scope.slice, $scope.card);
                        };
                    };
                }
                return SelectionBox;
            })();
            directives.SelectionBox = SelectionBox;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("SelectionBox", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var PercentageSlider = (function () {
                function PercentageSlider() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/inputFields/percentageSlider.html';
                }
                return PercentageSlider;
            })();
            directives.PercentageSlider = PercentageSlider;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("PercentageSlider", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var AdvancedFilter = (function () {
                function AdvancedFilter() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.AdvancedFilterController);
                    this.templateUrl = 'views/advancedFilter.html';
                }
                return AdvancedFilter;
            })();
            directives.AdvancedFilter = AdvancedFilter;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("AdvancedFilter", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var CategoricalFilter = (function () {
                function CategoricalFilter() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.CategoricalFilterController);
                    this.templateUrl = 'views/categoricalFilter.html';
                }
                return CategoricalFilter;
            })();
            directives.CategoricalFilter = CategoricalFilter;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("CategoricalFilter", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var Carousel = (function () {
                function Carousel() {
                    this.restrict = 'E';
                    this.templateUrl = 'views/carousel.html';
                    this.transclude = true;
                    this.replace = true;
                    this.scope = {
                        // autoresizes the control to its parent
                        autoResize: '=',
                    };
                    this.link = function (scope, element) {
                        scope.element = element;
                        scope.scrollPane = element.find('.carouselScrollPane');
                        scope.previousNavButton = element.find('.carouselNavButton.previousPage');
                        scope.nextNavButton = element.find('.carouselNavButton.nextPage');
                        if (scope.autoResize) {
                            scope.$watchGroup([function () {
                                return element.text().length;
                            }, function () {
                                return getScrollChildren().length;
                            }], function (newValues, oldValues) {
                                if (newValues[0] !== oldValues[0]) {
                                    scope.updateCarouselWidth();
                                }
                                if (newValues[1] - 1 === oldValues[1]) {
                                    scope.scrollToLast();
                                }
                            });
                        }
                        var sizeChangedIntervalId;
                        var previousWidth = 0;
                        var pollCarouselSize = function () {
                            sizeChangedIntervalId = window.setInterval(function () {
                                var newWidth = element.parent().width();
                                if (newWidth !== previousWidth) {
                                    previousWidth = newWidth;
                                    scope.updateCarouselWidth();
                                }
                            }, 500);
                        };
                        if (scope.autoResize) {
                            pollCarouselSize();
                        }
                        var previousNavButton = scope.previousNavButton;
                        var nextNavButton = scope.nextNavButton;
                        var element = scope.element;
                        var scrollPane = scope.scrollPane;
                        var ScrollPaneAnimationSpeedMs = 250;
                        var getScrollChildren = function () {
                            var scrollChildren = scrollPane.children();
                            return scrollChildren;
                        };
                        var scrollToChild = function (child) {
                            if (child && child.length > 0) {
                                var scrollOffset = child.position().left;
                                scrollPane.animate({ scrollLeft: '+=' + scrollOffset }, ScrollPaneAnimationSpeedMs, function () {
                                    updateNavButtonVisibility();
                                });
                            }
                        };
                        var updateNavButtonVisibility = function () {
                            previousNavButton.prop('disabled', false);
                            nextNavButton.prop('disabled', false);
                            if (scrollPane.scrollLeft() === 0) {
                                previousNavButton.prop('disabled', true);
                            }
                            // account for measurement rounding in IE
                            var errorMargin = 2;
                            if (Math.abs(scrollPane.scrollLeft() + scrollPane.width() - scrollPane[0].scrollWidth) <= errorMargin) {
                                nextNavButton.prop('disabled', true);
                            }
                        };
                        var scrollActiveItemIntoView = function () {
                            var scrollTarget = scrollPane.find('.active');
                            scrollToChild(scrollTarget);
                        };
                        scope.scrollToLast = function () {
                            var scrollChildren = getScrollChildren();
                            var targetChild = $(scrollChildren[scrollChildren.length - 1]);
                            scrollToChild(targetChild);
                        };
                        scope.updateCarouselWidth = function () {
                            var availableWidth = scope.element.parent().width();
                            var scrollChildren = getScrollChildren();
                            var totalChildWidth = 0;
                            // yield to the rendering thread to ensure any new elements are actually there
                            window.setTimeout(function () {
                                for (var i = 0, len = scrollChildren.length; i < len; i++) {
                                    totalChildWidth += $(scrollChildren[i]).outerWidth(true);
                                }
                                var staticSpace = availableWidth - Carousel.createButtonWidth - Carousel.navButtonsWidth;
                                var dynamicSpace = totalChildWidth + Carousel.navButtonsWidth;
                                var carouselWidth = dynamicSpace < staticSpace ? dynamicSpace : staticSpace + Carousel.navButtonsWidth;
                                scope.element.width(carouselWidth);
                                updateNavButtonVisibility();
                                scrollActiveItemIntoView();
                            }, 0);
                        };
                        scope.scrollToNext = function () {
                            var scrollChildren = getScrollChildren();
                            var nextScrollTarget;
                            for (var i = 0; i < scrollChildren.length; i++) {
                                nextScrollTarget = $(scrollChildren[i]);
                                if (nextScrollTarget.position().left + nextScrollTarget.width() > scrollPane.width()) {
                                    scrollToChild(nextScrollTarget);
                                    break;
                                }
                            }
                        };
                        scope.scrollToPrevious = function () {
                            var scrollChildren = getScrollChildren();
                            var previousScrollTarget;
                            var desiredScrollOffset = -1 * scrollPane.width();
                            for (var i = 0; i < scrollChildren.length; i++) {
                                previousScrollTarget = $(scrollChildren[i]);
                                if (previousScrollTarget.position().left >= desiredScrollOffset) {
                                    scrollToChild(previousScrollTarget);
                                    break;
                                }
                            }
                        };
                    };
                }
                Carousel.createButtonWidth = 41;
                Carousel.navButtonsWidth = 36;
                return Carousel;
            })();
            directives.Carousel = Carousel;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("Carousel", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ColorUtility = explore.util.ColorUtility;
            var ColorPicker = (function () {
                function ColorPicker() {
                    this.replace = true;
                    this.restrict = "E";
                    this.controller = powerbi.common.Services.createController(explore.controllers.ColorPickerController);
                    this.templateUrl = 'views/colorPicker.html';
                    this.link = function ($scope, $element) {
                        var canvas;
                        $scope.showColorWheel = function () {
                            canvas = $element.find('.colorwheel-picker')[0];
                            var context = canvas.getContext('2d');
                            var colorWheel = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
                            var imageData = ColorUtility.getColorWheelImage(colorWheel);
                            context.putImageData(imageData, 0, 0);
                        };
                        $scope.customColorPicked = function ($event) {
                            $event.stopPropagation();
                            var canvasOffset = $(canvas).offset();
                            var canvasX = Math.floor($event.pageX - canvasOffset.left);
                            var canvasY = Math.floor($event.pageY - canvasOffset.top);
                            var imageData = canvas.getContext('2d').getImageData(canvasX, canvasY, 1, 1);
                            var pixel = imageData.data;
                            var color = ColorUtility.rgbToHex(pixel[0], pixel[1], pixel[2]);
                            $scope.colorSelected(color);
                        };
                    };
                }
                return ColorPicker;
            })();
            directives.ColorPicker = ColorPicker;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ColorPicker', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ColorTile = (function () {
                function ColorTile() {
                    this.scope = {
                        color: "="
                    };
                    this.restrict = "E";
                    this.templateUrl = 'views/colorTile.html';
                }
                return ColorTile;
            })();
            directives.ColorTile = ColorTile;
            ;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ColorTile', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            function linkCanvas(scope, element, telemetryService) {
                var sizeChangedIntervalId;
                var previousSize = { width: 0, height: 0 };
                var perfLoadEvent = null;
                var updateCanvasSize = function (width, height) {
                    var size = { width: width || element.width(), height: height || element.height() };
                    // Ensure that we don't update canvas size if the element is hidden.
                    if (size.width > 0 && size.height > 0) {
                        scope.size = size;
                        scope.$apply();
                    }
                };
                var pollCanvasSize = function () {
                    sizeChangedIntervalId = window.setInterval(function () {
                        var newWidth = element.width();
                        var newHeight = element.height();
                        if (newWidth !== previousSize.width || newHeight !== previousSize.height) {
                            previousSize.width = newWidth;
                            previousSize.height = newHeight;
                            updateCanvasSize(newWidth, newHeight);
                        }
                    }, 200);
                };
                // TODO: Enable transition animations once non-animated states are defined (eg, switching slides, etc)
                scope.disableAnimations = true;
                // scroll to top on layout mode switches - this prevents scroll cutoff
                scope.$watch('useResponsiveLayout', function () {
                    element.scrollTop(0);
                });
                var unregisterVisualCountWatcher = null;
                scope.$on(explore.constants.explorationLoadedEventName, function () {
                    if (telemetryService) {
                        perfLoadEvent = telemetryService.startPerfEvent(scope, null);
                        if (unregisterVisualCountWatcher) {
                            unregisterVisualCountWatcher();
                        }
                        unregisterVisualCountWatcher = scope.$watchCollection('viewModel.visualContainers', function (newValue) {
                            if (newValue) {
                                if (newValue.length === 0 && perfLoadEvent) {
                                    perfLoadEvent.resolve();
                                    perfLoadEvent = null;
                                }
                                unregisterVisualCountWatcher();
                                unregisterVisualCountWatcher = null;
                            }
                        });
                    }
                    var canvasVisibilityTestInterval = window.setInterval(function () {
                        if (element.is(':visible')) {
                            window.clearInterval(canvasVisibilityTestInterval);
                            updateCanvasSize();
                            pollCanvasSize();
                        }
                    }, 100);
                });
                scope.$on('visualContainerRepeatFinished', function () {
                    if (perfLoadEvent) {
                        perfLoadEvent.resolve();
                        perfLoadEvent = null;
                    }
                });
                scope.$on('$destroy', function () {
                    window.clearInterval(sizeChangedIntervalId);
                });
            }
            directives.linkCanvas = linkCanvas;
            var ExploreCanvas = (function () {
                function ExploreCanvas(telemetryService) {
                    var _this = this;
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExploreCanvasController);
                    this.templateUrl = 'views/exploreCanvas.html';
                    this.link = function ($scope, $elem) {
                        linkCanvas($scope, $elem, _this.telemetryService);
                    };
                    this.telemetryService = telemetryService;
                }
                return ExploreCanvas;
            })();
            directives.ExploreCanvas = ExploreCanvas;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExploreCanvas', ['telemetryService']);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ExplorationAppBar = (function () {
                function ExplorationAppBar() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExplorationAppBarController);
                    this.templateUrl = 'views/explorationAppBar.html';
                }
                return ExplorationAppBar;
            })();
            directives.ExplorationAppBar = ExplorationAppBar;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExplorationAppBar', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ExplorationHost = (function () {
                function ExplorationHost() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.transclude = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExplorationHostController);
                    this.templateUrl = 'views/explorationHost.html';
                }
                return ExplorationHost;
            })();
            directives.ExplorationHost = ExplorationHost;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExplorationHost', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ExplorationNavigationTab = (function () {
                function ExplorationNavigationTab() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '=',
                        tabIndex: '=',
                        tabIsFirst: '=',
                        tabIsLast: '=',
                        isEditing: '='
                    };
                    this.link = function ($scope, $element, $attrs) {
                        $scope.toggleDraggable = function (draggable) {
                            $element.attr("draggable", draggable.toString());
                        };
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExplorationNavigationTabController);
                    this.templateUrl = 'views/explorationNavigationTab.html';
                }
                return ExplorationNavigationTab;
            })();
            directives.ExplorationNavigationTab = ExplorationNavigationTab;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExplorationNavigationTab', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ExplorationNavigation = (function () {
                function ExplorationNavigation() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExplorationNavigationController);
                    this.templateUrl = 'views/explorationNavigation.html';
                    this.link = function (scope, $element, $attrs) {
                        scope.$on(powerbi.constants.dragStartEventName, function (e, args) {
                            scope.dragoverIndex = -1;
                        });
                        scope.$on(powerbi.constants.dragEnterEventName, function (e, originalEvent, args) {
                            if (scope.viewModeState.viewMode !== 1 /* Edit */)
                                return;
                            var newIndex = -1;
                            // not sure how we can decouple .section
                            var sections = $element.find('.section.dynamic');
                            var drop = args.targetElement;
                            if (drop.hasClass('section')) {
                                // Dragging over a section
                                newIndex = sections.index(drop);
                            }
                            else {
                                // Dragging over the navigation area, use length -1 because of the + section button
                                newIndex = Math.max(sections.length - 1, 0);
                            }
                            scope.dragoverIndex = newIndex;
                            scope.$apply();
                            if (e.stopPropagation)
                                e.stopPropagation();
                        });
                        scope.$on(powerbi.constants.dropEventName, function (e, originalEvent, args) {
                            if (scope.viewModeState.viewMode !== 1 /* Edit */)
                                return;
                            // TODO: jwarner - Remove the direct DOM manipulations when there's a drag/drop framework to support reordering in the same way.  Other features need it.
                            var thumbnailsContainers = $element.find('.thumbnail-container[drag=sections]');
                            var drag = args.sourceElement;
                            var fromIndex = thumbnailsContainers.index(drag);
                            var toIndex = scope.dragoverIndex;
                            if (fromIndex !== toIndex && fromIndex !== -1) {
                                scope.eventBridge.publishBubbling(scope, powerbi.explore.services.events.reorderSection, {
                                    originalIndex: fromIndex,
                                    targetIndex: toIndex
                                });
                            }
                            if (e.stopPropagation)
                                e.stopPropagation();
                        });
                    };
                }
                return ExplorationNavigation;
            })();
            directives.ExplorationNavigation = ExplorationNavigation;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExplorationNavigation', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ExplorationPaginator = (function () {
                function ExplorationPaginator() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExplorationPaginatorController);
                    this.templateUrl = 'views/explorationPaginator.html';
                }
                return ExplorationPaginator;
            })();
            directives.ExplorationPaginator = ExplorationPaginator;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExplorationPaginator', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var ExplorationStatusBar = (function () {
                function ExplorationStatusBar() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.controller = powerbi.common.Services.createController(explore.controllers.ExplorationStatusBarController);
                    this.templateUrl = 'views/explorationStatusBar.html';
                }
                return ExplorationStatusBar;
            })();
            directives.ExplorationStatusBar = ExplorationStatusBar;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('ExplorationStatusBar', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var Exploration = (function () {
                function Exploration() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.templateUrl = 'views/exploration.html';
                }
                return Exploration;
            })();
            directives.Exploration = Exploration;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('Exploration', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FieldList = (function () {
                function FieldList() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {};
                    this.controller = powerbi.common.Services.createController(explore.controllers.FieldListController);
                    this.templateUrl = 'views/fieldList.html';
                }
                return FieldList;
            })();
            directives.FieldList = FieldList;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FieldList", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FieldListEntity = (function () {
                function FieldListEntity() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.FieldListEntityController);
                    this.templateUrl = 'views/fieldListEntity.html';
                    this.link = function ($scope, $element, $attrs) {
                        $scope.toggleDraggable = function (draggable) {
                            $element.attr("draggable", draggable.toString());
                        };
                        $scope.expandMenu = function () {
                            $scope.$broadcast('dropdownExpand');
                        };
                    };
                }
                return FieldListEntity;
            })();
            directives.FieldListEntity = FieldListEntity;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FieldListEntity", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FieldListProperty = (function () {
                function FieldListProperty() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.FieldListPropertyController);
                    this.templateUrl = 'views/fieldListProperty.html';
                    this.link = function ($scope, $element, $attrs) {
                        $scope.toggleDraggable = function (draggable) {
                            $element.attr("draggable", draggable.toString());
                        };
                        $scope.expandMenu = function () {
                            $scope.$broadcast('dropdownExpand');
                        };
                    };
                }
                return FieldListProperty;
            })();
            directives.FieldListProperty = FieldListProperty;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FieldListProperty", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FieldWell = (function () {
                function FieldWell() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {};
                    this.controller = powerbi.common.Services.createController(explore.controllers.FieldWellController);
                    this.templateUrl = 'views/fieldWell.html';
                }
                return FieldWell;
            })();
            directives.FieldWell = FieldWell;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FieldWell", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FieldWellBucket = (function () {
                function FieldWellBucket() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.FieldWellBucketController);
                    this.templateUrl = 'views/fieldWellBucket.html';
                }
                return FieldWellBucket;
            })();
            directives.FieldWellBucket = FieldWellBucket;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FieldWellBucket", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FieldWellField = (function () {
                function FieldWellField() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.FieldWellFieldController);
                    this.templateUrl = 'views/fieldWellField.html';
                    this.link = function ($scope, $element, $attrs) {
                        $scope.expandMenu = function () {
                            $scope.$broadcast('dropdownExpand');
                        };
                    };
                }
                return FieldWellField;
            })();
            directives.FieldWellField = FieldWellField;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FieldWellField", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var Filter = (function () {
                function Filter() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.FilterController);
                    this.templateUrl = 'views/filter.html';
                }
                return Filter;
            })();
            directives.Filter = Filter;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("Filter", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var FilterPane = (function () {
                function FilterPane() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {};
                    this.controller = powerbi.common.Services.createController(explore.controllers.FilterPaneController);
                    this.templateUrl = 'views/filterPane.html';
                }
                return FilterPane;
            })();
            directives.FilterPane = FilterPane;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("FilterPane", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var InputField = (function () {
                function InputField() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/inputField.html';
                    this.link = function ($scope) {
                        if (!$scope.slice && $scope.card.mainShow) {
                            $scope.slice = $scope.card.mainShow;
                            $scope.$watch("card.mainShow", function (newValue, oldValue) {
                                if (newValue) {
                                    $scope.slice = $scope.card.mainShow;
                                }
                            });
                        }
                    };
                }
                return InputField;
            })();
            directives.InputField = InputField;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("InputField", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var CardFooter = (function () {
                function CardFooter() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/cardFooter.html';
                }
                return CardFooter;
            })();
            directives.CardFooter = CardFooter;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("CardFooter", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var CardHeader = (function () {
                function CardHeader() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.templateUrl = 'views/cardHeader.html';
                }
                return CardHeader;
            })();
            directives.CardHeader = CardHeader;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("CardHeader", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var events = powerbi.explore.services.events;
            var ModelingContextChanger = (function () {
                function ModelingContextChanger() {
                    this.restrict = 'A';
                    this.controller = powerbi.common.Services.createController(explore.controllers.ModelingContextChangerController);
                    this.link = function (scope, $element, $attrs) {
                        var subscriptionManager = scope.eventBridge.createChannelSubscriptionManager().subscribe(events.schemaItemActivationChanged, function () {
                            if (scope.schemaItemActivationService.getActiveItem()) {
                                $element.on('click', function () {
                                    scope.eventBridge.publishToChannel(events.modelingContextChanged);
                                });
                            }
                            else {
                                $element.off('click');
                            }
                        });
                        scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                    };
                }
                return ModelingContextChanger;
            })();
            directives.ModelingContextChanger = ModelingContextChanger;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("ModelingContextChanger", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var PropertyPane = (function () {
                function PropertyPane() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {};
                    this.controller = powerbi.common.Services.createController(explore.controllers.PropertyPaneController);
                    this.templateUrl = 'views/propertyPane.html';
                }
                return PropertyPane;
            })();
            directives.PropertyPane = PropertyPane;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("PropertyPane", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var RangeFilter = (function () {
                function RangeFilter() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.RangeFilterController);
                    this.templateUrl = 'views/rangeFilter.html';
                }
                return RangeFilter;
            })();
            directives.RangeFilter = RangeFilter;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("RangeFilter", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var TaskPane = (function () {
                function TaskPane() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.TaskPaneController);
                    this.templateUrl = 'views/taskPane.html';
                }
                return TaskPane;
            })();
            directives.TaskPane = TaskPane;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("TaskPane", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var VisualContainer = (function () {
                function VisualContainer() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.VisualContainerController);
                    this.templateUrl = 'views/visualContainer.html';
                }
                return VisualContainer;
            })();
            directives.VisualContainer = VisualContainer;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("VisualContainer", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var VisualizationPane = (function () {
                function VisualizationPane() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        viewModel: '='
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.VisualizationPaneController);
                    this.templateUrl = 'views/visualizationPane.html';
                }
                return VisualizationPane;
            })();
            directives.VisualizationPane = VisualizationPane;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("VisualizationPane", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var VisualTypesContainer = (function () {
                function VisualTypesContainer() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.scope = {
                        visualPluginFilter: '=',
                    };
                    this.controller = powerbi.common.Services.createController(explore.controllers.VisualTypesContainerController);
                    this.templateUrl = 'views/visualTypesContainer.html';
                }
                return VisualTypesContainer;
            })();
            directives.VisualTypesContainer = VisualTypesContainer;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('VisualTypesContainer', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var VisualWatermark = (function () {
                function VisualWatermark(templateCache, visualPlugin) {
                    var _this = this;
                    this.restrict = 'E';
                    this.replace = true;
                    this.template = '<div class="watermark"></div>';
                    this.scope = {
                        visualType: '='
                    };
                    this.link = function (scope, element) {
                        var svgFileName = 'views/svg/visualsWatermarks.svg';
                        var svgVisualKey = _this.visualPlugin.getPlugin(scope.visualType).watermarkKey || 'defaultWatermark';
                        element.attr('data-svg-visual-key', svgVisualKey);
                        function parseTemplateCacheToSVG(svgDoc, svgVisualKey, documentEndTag, classEndTag) {
                            var indexOfSvgClass = svgDoc.indexOf('id=\"' + svgVisualKey);
                            var lengthofSvgClass = svgVisualKey.length + 6;
                            var newSvgDoc = svgDoc.substring(indexOfSvgClass + lengthofSvgClass, svgDoc.indexOf(documentEndTag));
                            var indexOfSvgEnd = newSvgDoc.indexOf(classEndTag);
                            var svgBody = newSvgDoc.substring(0, indexOfSvgEnd);
                            return svgBody;
                        }
                        ;
                        var svgDoc = _this.templateCache.get(svgFileName);
                        svgDoc = parseTemplateCacheToSVG(svgDoc, svgVisualKey, '</svg>', '</symbol>');
                        var svg = $(VisualWatermark.svgTemplate + svgDoc + '</svg>');
                        svg.appendTo(element);
                    };
                    this.templateCache = templateCache;
                    this.visualPlugin = visualPlugin;
                }
                VisualWatermark.svgTemplate = '<svg id=\"Layer_1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 400 300\" enable-background=\"new 0 0 400 300\" xml:space=\"preserve\">';
                return VisualWatermark;
            })();
            directives.VisualWatermark = VisualWatermark;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("VisualWatermark", ['$templateCache', 'visualPlugin']);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var GradientBar = (function () {
                function GradientBar() {
                    this.replace = true;
                    this.restrict = "E";
                    this.templateUrl = 'views/gradientBar.html';
                    this.link = function (scope, element, attrs) {
                        var getGradientColors = function () {
                            var card = scope.$parent.card;
                            var divergingSlice = explore.viewModels.PropertyPaneViewModelFactory.getSliceByPropertyName(card, 'diverging');
                            var minColorSlice = explore.viewModels.PropertyPaneViewModelFactory.getSliceByPropertyName(card, 'minColor');
                            var midColorSlice = explore.viewModels.PropertyPaneViewModelFactory.getSliceByPropertyName(card, 'midColor');
                            var maxColorSlice = explore.viewModels.PropertyPaneViewModelFactory.getSliceByPropertyName(card, 'maxColor');
                            var colors = [];
                            colors.push(minColorSlice.value);
                            if (divergingSlice.value) {
                                colors.push(midColorSlice.value);
                            }
                            colors.push(maxColorSlice.value);
                            var gradientColors = colors.join(",");
                            return gradientColors;
                        };
                        scope.$watch(function () {
                            return getGradientColors();
                        }, function (newValue, oldValue) {
                            scope.gradientColors = newValue;
                        });
                    };
                }
                return GradientBar;
            })();
            directives.GradientBar = GradientBar;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective('GradientBar', []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var directives;
        (function (directives) {
            var VirtualList = (function () {
                function VirtualList() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.transclude = true;
                    this.templateUrl = 'views/virtualList.html';
                    this.link = function (scope, elem, attrs) {
                        var maxScrollTop = 0;
                        var stepLimit = 10;
                        var totalItemsAmount = scope.totalItemsAmount = parseInt(attrs.totalItemsAmount, 10);
                        debug.assertValue(totalItemsAmount, 'totalItemsAmount');
                        var limitItems = scope.limitItems = +(attrs.initLimit);
                        debug.assertValue(limitItems, 'limitItems');
                        var container = $(elem[0]);
                        var list = container.find(".virtual-list");
                        var containerDoubleMaxHeight = 2 * container.height();
                        debug.assertValue(containerDoubleMaxHeight, 'containerDoubleMaxHeight');
                        container.scroll(function () {
                            var topPosition = container.scrollTop();
                            if (!containerDoubleMaxHeight) {
                                containerDoubleMaxHeight = 2 * container.height();
                            }
                            if (topPosition + containerDoubleMaxHeight > list.height()) {
                                if (totalItemsAmount >= scope.limitItems) {
                                    if (topPosition > maxScrollTop) {
                                        maxScrollTop = topPosition;
                                        scope.limitItems += stepLimit;
                                        scope.$digest();
                                    }
                                }
                            }
                        });
                    };
                }
                return VirtualList;
            })();
            directives.VirtualList = VirtualList;
        })(directives = explore.directives || (explore.directives = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
powerbi.explore.registerExploreDirective("VirtualList", []);
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            /** ViewModel base class. */
            var ViewModel = (function () {
                function ViewModel(contract, state) {
                    debug.assertValue(contract, 'contract');
                    debug.assertValue(state, 'state');
                    this._contract = contract;
                    this._state = state;
                }
                Object.defineProperty(ViewModel.prototype, "contract", {
                    get: function () {
                        return this._contract;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ViewModel.prototype, "readOnlyState", {
                    get: function () {
                        return this._state;
                    },
                    enumerable: true,
                    configurable: true
                });
                ViewModel.prototype.updateViewState = function () {
                    this.updateViewStateCore(this._state);
                };
                ViewModel.prototype.updateViewStateCore = function (state) {
                };
                return ViewModel;
            })();
            viewModels.ViewModel = ViewModel;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var ArrayExtensions = jsCommon.ArrayExtensions;
            (function (LogicalOperator) {
                LogicalOperator[LogicalOperator["And"] = 0] = "And";
                LogicalOperator[LogicalOperator["Or"] = 1] = "Or";
                LogicalOperator[LogicalOperator["Undefined"] = 2] = "Undefined";
            })(viewModels.LogicalOperator || (viewModels.LogicalOperator = {}));
            var LogicalOperator = viewModels.LogicalOperator;
            (function (FilterOperator) {
                FilterOperator[FilterOperator["None"] = 0] = "None";
                FilterOperator[FilterOperator["LessThan"] = 1] = "LessThan";
                FilterOperator[FilterOperator["LessThanOrEqual"] = 2] = "LessThanOrEqual";
                FilterOperator[FilterOperator["GreaterThan"] = 3] = "GreaterThan";
                FilterOperator[FilterOperator["GreaterThanOrEqual"] = 4] = "GreaterThanOrEqual";
                FilterOperator[FilterOperator["Contains"] = 5] = "Contains";
                FilterOperator[FilterOperator["DoesNotContain"] = 6] = "DoesNotContain";
                FilterOperator[FilterOperator["StartWith"] = 7] = "StartWith";
                FilterOperator[FilterOperator["DoesNotStartWith"] = 8] = "DoesNotStartWith";
                FilterOperator[FilterOperator["Is"] = 9] = "Is";
                FilterOperator[FilterOperator["IsNot"] = 10] = "IsNot";
                FilterOperator[FilterOperator["IsBlank"] = 11] = "IsBlank";
                FilterOperator[FilterOperator["IsNotBlank"] = 12] = "IsNotBlank";
            })(viewModels.FilterOperator || (viewModels.FilterOperator = {}));
            var FilterOperator = viewModels.FilterOperator;
            var Condition = (function () {
                function Condition(operator, value, formatter) {
                    this.op = operator;
                    this.onOperatorChanged();
                    this.isCalendarShown = false;
                    this.value = new ConditionValue(value, formatter);
                }
                Object.defineProperty(Condition.prototype, "operator", {
                    get: function () {
                        return this.op;
                    },
                    set: function (operator) {
                        if (this.op !== operator) {
                            this.op = operator;
                            this.onOperatorChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Condition.prototype, "valueRequired", {
                    get: function () {
                        return this.valRequired;
                    },
                    enumerable: true,
                    configurable: true
                });
                Condition.prototype.accept = function (visitor) {
                    return visitor.visit(this);
                };
                Condition.empty = function () {
                    return new Condition(0 /* None */);
                };
                Condition.equals = function (x, y) {
                    // Normalize falsy to null
                    x = x || null;
                    y = y || null;
                    if (x === y)
                        return true;
                    if (!x !== !y)
                        return false;
                    debug.assertValue(x, 'x');
                    debug.assertValue(y, 'y');
                    return x.operator === y.operator && ConditionValue.equals(x.value, y.value);
                };
                Condition.prototype.onOperatorChanged = function () {
                    this.valRequired = viewModels.OperatorHelper.getValueRequired(this.operator);
                    if (!this.valRequired)
                        this.value = undefined;
                };
                return Condition;
            })();
            viewModels.Condition = Condition;
            var ConditionValue = (function () {
                function ConditionValue(value, formatter) {
                    if (value != null) {
                        if (value instanceof Date)
                            this.dateValue = value;
                        var valueToFormat = value;
                        this.stringValue = formatter ? formatter.format(valueToFormat) : valueToFormat.toString();
                    }
                }
                Object.defineProperty(ConditionValue.prototype, "isDate", {
                    get: function () {
                        return this.dateValue != null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ConditionValue.prototype, "hasValue", {
                    get: function () {
                        return this.dateValue != null || !jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(this.stringValue);
                    },
                    enumerable: true,
                    configurable: true
                });
                // Return formatted value in string format
                ConditionValue.prototype.toString = function () {
                    return this.stringValue;
                };
                ConditionValue.equals = function (left, right) {
                    // Normalize falsy to null
                    left = left || null;
                    right = right || null;
                    if (left === right)
                        return true;
                    if (!left !== !right)
                        return false;
                    debug.assertValue(left, 'left');
                    debug.assertValue(right, 'right');
                    return ConditionValue.compareDateTimeValue(left, right) && left.stringValue === right.stringValue;
                };
                ConditionValue.compareDateTimeValue = function (left, right) {
                    var leftDateValue = left.dateValue ? left.dateValue.valueOf() : 0;
                    var rightDateValue = right.dateValue ? right.dateValue.valueOf() : 0;
                    return leftDateValue === rightDateValue;
                };
                return ConditionValue;
            })();
            viewModels.ConditionValue = ConditionValue;
            var AdvFilterCard = (function () {
                function AdvFilterCard(field) {
                    debug.assertValue(field, 'field');
                    this.field = field;
                    this.conditions = [];
                    this.operators = [];
                    this.logicalOperator = 2 /* Undefined */;
                    // this is added so it can be easily bind it to radio button.
                    this.logicalAndOperator = 0 /* And */;
                    this.logicalOrOperator = 1 /* Or */;
                }
                AdvFilterCard.prototype.toSQExpr = function (schema) {
                    var expr = SQExprBuilder.fieldDef(this.field), type = expr.getMetadata(schema).type;
                    return viewModels.FilterCardConverter.toSQExpr(expr, type, this.conditions, this.logicalOperator);
                };
                AdvFilterCard.prototype.getRestatement = function () {
                    return viewModels.RestatementHelper.fromCondition(this.conditions, this.logicalOperator);
                };
                AdvFilterCard.prototype.areConditionsValid = function () {
                    var conditions = this.conditions;
                    if (ArrayExtensions.isUndefinedOrEmpty(conditions))
                        return false;
                    for (var i = 0, len = conditions.length; i < len; i++) {
                        var condition = conditions[i];
                        if (!condition.operator || condition.operator === 0 /* None */) {
                            // if it is not the last one, return false
                            if (i < (len - 1))
                                return false;
                            else
                                continue;
                        }
                        if (viewModels.OperatorHelper.getValueRequired(condition.operator) && !condition.value.hasValue)
                            return false;
                    }
                    return true;
                };
                AdvFilterCard.prototype.loadOperators = function (schema) {
                    var expr = SQExprBuilder.fieldDef(this.field);
                    if (!_.isEmpty(expr.validate(schema)))
                        return;
                    var metadata = expr.getMetadata(schema);
                    this.operators = viewModels.OperatorHelper.getFilterOperators(metadata.type);
                };
                // Create two empty condition based on the operators
                AdvFilterCard.prototype.ensureConditions = function () {
                    var operators = this.operators;
                    if (!this.conditions)
                        this.conditions = [];
                    var conditions = this.conditions;
                    // Ensure there are 2 conditions created.
                    if (_.isEmpty(this.conditions) && !_.isEmpty(operators))
                        conditions.push(new Condition(operators[0].value));
                    while (conditions.length < 2) {
                        // add an empty condition
                        this.logicalOperator = 0 /* And */;
                        conditions.push(Condition.empty());
                    }
                };
                return AdvFilterCard;
            })();
            viewModels.AdvFilterCard = AdvFilterCard;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
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
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var ColorPickerModel = (function () {
                function ColorPickerModel() {
                }
                return ColorPickerModel;
            })();
            viewModels.ColorPickerModel = ColorPickerModel;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
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
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            (function (ReportViewer) {
                ReportViewer[ReportViewer["Vrm"] = 0] = "Vrm";
                ReportViewer[ReportViewer["Explore"] = 1] = "Explore";
            })(viewModels.ReportViewer || (viewModels.ReportViewer = {}));
            var ReportViewer = viewModels.ReportViewer;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var ExploreCanvas = (function () {
                function ExploreCanvas(contract) {
                    // do NOT copy values from contract to the model here... that must happen in ModelConverter
                    this.contract = contract;
                }
                return ExploreCanvas;
            })();
            viewModels.ExploreCanvas = ExploreCanvas;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var FieldListConceptualModel = (function () {
                function FieldListConceptualModel(contract) {
                    // do NOT copy values from contract to the model here... that must happen in ModelConverter
                    this.contract = contract;
                }
                FieldListConceptualModel.prototype.findEntity = function (entityName) {
                    for (var i = 0, len = this.entities.length; i < len; ++i) {
                        if (this.entities[i].name === entityName)
                            return this.entities[i];
                    }
                    return null;
                };
                FieldListConceptualModel.prototype.findProperty = function (entityName, propertyName) {
                    var entity = this.findEntity(entityName);
                    if (!entity)
                        return null;
                    return entity.findProperty(propertyName);
                };
                return FieldListConceptualModel;
            })();
            viewModels.FieldListConceptualModel = FieldListConceptualModel;
            var FieldListConceptualEntity = (function () {
                function FieldListConceptualEntity(contract, schema) {
                    this.hasCheckedProperties = false;
                    // do NOT copy values from contract to the model here... that must happen in ModelConverter
                    this.contract = contract;
                    this.schema = schema;
                }
                Object.defineProperty(FieldListConceptualEntity.prototype, "name", {
                    get: function () {
                        return this.contract.name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualEntity.prototype, "displayName", {
                    get: function () {
                        return this.contract.name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualEntity.prototype, "hidden", {
                    get: function () {
                        return this.contract.hidden;
                    },
                    set: function (value) {
                        this.contract.hidden = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualEntity.prototype, "showHidden", {
                    get: function () {
                        if (!this.schema)
                            return false;
                        return this.schema.showHidden;
                    },
                    enumerable: true,
                    configurable: true
                });
                FieldListConceptualEntity.prototype.findProperty = function (propertyName) {
                    for (var i = 0, len = this.properties.length; i < len; ++i) {
                        if (this.properties[i].name === propertyName)
                            return this.properties[i];
                    }
                    return null;
                };
                return FieldListConceptualEntity;
            })();
            viewModels.FieldListConceptualEntity = FieldListConceptualEntity;
            var FieldListConceptualProperty = (function () {
                function FieldListConceptualProperty(contract, entity) {
                    // do NOT copy values from contract to the model here... that must happen in ModelConverter
                    this.contract = contract;
                    this.entity = entity;
                }
                Object.defineProperty(FieldListConceptualProperty.prototype, "name", {
                    get: function () {
                        return this.contract.name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "displayName", {
                    get: function () {
                        return this.contract.name;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "kind", {
                    get: function () {
                        return this.contract.kind;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "defaultAggregate", {
                    get: function () {
                        if (this.contract.column)
                            return this.contract.column.defaultAggregate;
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "type", {
                    get: function () {
                        return this.contract.type;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "hidden", {
                    get: function () {
                        return this.contract.hidden;
                    },
                    set: function (value) {
                        this.contract.hidden = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "idOnEntityKey", {
                    get: function () {
                        if (this.contract.column)
                            return this.contract.column.idOnEntityKey;
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FieldListConceptualProperty.prototype, "showHidden", {
                    get: function () {
                        if (!this.entity)
                            return false;
                        return this.entity.showHidden;
                    },
                    enumerable: true,
                    configurable: true
                });
                return FieldListConceptualProperty;
            })();
            viewModels.FieldListConceptualProperty = FieldListConceptualProperty;
            (function (FieldListMenuItemAction) {
                FieldListMenuItemAction[FieldListMenuItemAction["AddFilter"] = 0] = "AddFilter";
                FieldListMenuItemAction[FieldListMenuItemAction["Hide"] = 1] = "Hide";
                FieldListMenuItemAction[FieldListMenuItemAction["ViewHidden"] = 2] = "ViewHidden";
                FieldListMenuItemAction[FieldListMenuItemAction["UnhideAll"] = 3] = "UnhideAll";
                FieldListMenuItemAction[FieldListMenuItemAction["Rename"] = 4] = "Rename";
                FieldListMenuItemAction[FieldListMenuItemAction["Delete"] = 5] = "Delete";
                FieldListMenuItemAction[FieldListMenuItemAction["NewMeasure"] = 6] = "NewMeasure";
                FieldListMenuItemAction[FieldListMenuItemAction["NewColumn"] = 7] = "NewColumn";
            })(viewModels.FieldListMenuItemAction || (viewModels.FieldListMenuItemAction = {}));
            var FieldListMenuItemAction = viewModels.FieldListMenuItemAction;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var FieldListEvents;
            (function (FieldListEvents) {
                FieldListEvents.fieldListAction = {
                    name: 'fieldListAction',
                };
                (function (FieldListActions) {
                    FieldListActions[FieldListActions["Hide"] = 0] = "Hide";
                    FieldListActions[FieldListActions["ShowHidden"] = 1] = "ShowHidden";
                    FieldListActions[FieldListActions["UnhideAll"] = 2] = "UnhideAll";
                    FieldListActions[FieldListActions["Select"] = 3] = "Select";
                    FieldListActions[FieldListActions["Delete"] = 4] = "Delete";
                    FieldListActions[FieldListActions["NewMeasure"] = 5] = "NewMeasure";
                    FieldListActions[FieldListActions["NewColumn"] = 6] = "NewColumn";
                })(FieldListEvents.FieldListActions || (FieldListEvents.FieldListActions = {}));
                var FieldListActions = FieldListEvents.FieldListActions;
            })(FieldListEvents = viewModels.FieldListEvents || (viewModels.FieldListEvents = {}));
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var FieldListViewModelFactory;
            (function (FieldListViewModelFactory) {
                function convertConceptualSchema(contract, schemaName) {
                    debug.assertValue(contract, "contract");
                    var schema = contract.schema(schemaName);
                    if (!schema)
                        return;
                    var model = new viewModels.FieldListConceptualModel(schema);
                    model.entities = _.map(schema.entities, function (entity) { return convertConceptualEntity(entity, schemaName, schema.canEdit, model); });
                    model.schemaName = schemaName;
                    model.canEdit = schema.canEdit;
                    // Entities are collapsed by default (unless there is just one entity)
                    if (model.entities.length === 1)
                        model.entities[0].expanded = true;
                    return model;
                }
                FieldListViewModelFactory.convertConceptualSchema = convertConceptualSchema;
                function convertConceptualEntity(contract, schemaName, canEdit, schemaModel) {
                    debug.assertValue(contract, "contract");
                    var model = new viewModels.FieldListConceptualEntity(contract, schemaModel);
                    model.schemaName = schemaName;
                    model.properties = _.map(contract.properties, function (prop) { return convertConceptualProperty(prop, schemaName, contract.name, canEdit, model); });
                    model.menuItems = [];
                    model.expanded = false;
                    if (canEdit)
                        model.menuItems = model.menuItems.concat(createModelOperationMenuItems(model.hidden));
                    return model;
                }
                FieldListViewModelFactory.convertConceptualEntity = convertConceptualEntity;
                function convertConceptualProperty(contract, schemaName, entityName, canEdit, entityModel) {
                    debug.assertValue(contract, "contract");
                    var property = new viewModels.FieldListConceptualProperty(contract, entityModel);
                    property.schemaName = schemaName;
                    property.entityName = entityName;
                    powerbi.common.localize.ensureLocalization(function () { return property.menuItems = createFilterMenuItem(); });
                    if (canEdit) {
                        property.menuItems = property.menuItems.concat(createMenuItemSeparator());
                        property.menuItems = property.menuItems.concat(createModelOperationMenuItems(property.hidden));
                    }
                    return property;
                }
                FieldListViewModelFactory.convertConceptualProperty = convertConceptualProperty;
                function createFilterMenuItem() {
                    return [
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_AddFilter"),
                            labelClass: "itemLabel",
                            action: 0 /* AddFilter */,
                            type: 0 /* Item */,
                            checked: false
                        }
                    ];
                }
                function createMenuItemSeparator() {
                    return [
                        {
                            labelClass: "itemLabel",
                            action: undefined,
                            type: 2 /* Separator */,
                            checked: false
                        }
                    ];
                }
                function createModelOperationMenuItems(hidden) {
                    if (hidden === void 0) { hidden = false; }
                    return [
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_NewMeasure"),
                            labelClass: "itemLabel",
                            action: 6 /* NewMeasure */,
                            type: 0 /* Item */,
                            checked: false
                        },
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_NewColumn"),
                            labelClass: "itemLabel",
                            action: 7 /* NewColumn */,
                            type: 0 /* Item */,
                            checked: false
                        },
                        {
                            labelClass: "itemLabel",
                            action: undefined,
                            type: 2 /* Separator */,
                            checked: false
                        },
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_Rename"),
                            labelClass: "itemLabel",
                            action: 4 /* Rename */,
                            type: 0 /* Item */,
                            checked: false
                        },
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_Delete"),
                            labelClass: "itemLabel",
                            action: 5 /* Delete */,
                            type: 0 /* Item */,
                            checked: false
                        },
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_Hide"),
                            labelClass: "itemLabel",
                            action: 1 /* Hide */,
                            type: 0 /* Item */,
                            checked: hidden
                        },
                        {
                            labelClass: "itemLabel",
                            action: undefined,
                            type: 2 /* Separator */,
                            checked: false
                        },
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_ViewHidden"),
                            labelClass: "itemLabel",
                            action: 2 /* ViewHidden */,
                            type: 0 /* Item */,
                            checked: false
                        },
                        {
                            text: powerbi.common.localize.get("FieldListMenuItem_UnHideAll"),
                            labelClass: "itemLabel",
                            action: 3 /* UnhideAll */,
                            type: 0 /* Item */,
                            checked: false
                        }
                    ];
                }
                FieldListViewModelFactory.createModelOperationMenuItems = createModelOperationMenuItems;
                function toggleHide(schemaModel, fieldDef) {
                    if (!fieldDef || !fieldDef.entity)
                        return;
                    if (fieldDef.column || fieldDef.measure) {
                        var targetProperty = schemaModel.findProperty(fieldDef.entity, fieldDef.column || fieldDef.measure);
                        targetProperty.hidden = !targetProperty.hidden;
                        this.updateMenuItemsCheckStatus(targetProperty.menuItems, 1 /* Hide */, targetProperty.hidden);
                        return targetProperty.hidden;
                    }
                    else {
                        var targetEntity = schemaModel.findEntity(fieldDef.entity);
                        targetEntity.hidden = !targetEntity.hidden;
                        this.updateMenuItemsCheckStatus(targetEntity.menuItems, 1 /* Hide */, targetEntity.hidden);
                        return targetEntity.hidden;
                    }
                }
                FieldListViewModelFactory.toggleHide = toggleHide;
                function deleteItem(schemaModel, fieldDef) {
                    if (!fieldDef || !fieldDef.entity)
                        return;
                    var targetEntity = schemaModel.findEntity(fieldDef.entity);
                    // We only deletes property in UI since it always cause a modelchange event and we can update the model accordingly.
                    // But for Entities, modelchange event is not always raised because of user interaction.
                    // So we should let model merger to handle the UI update.
                    if (fieldDef.column || fieldDef.measure) {
                        var targetProperty = targetEntity.findProperty(fieldDef.column || fieldDef.measure);
                        var index = targetEntity.properties.indexOf(targetProperty);
                        if (index > -1)
                            targetEntity.properties.splice(index, 1);
                    }
                }
                FieldListViewModelFactory.deleteItem = deleteItem;
                function toggleShowHidden(schemaModel) {
                    schemaModel.showHidden = !schemaModel.showHidden;
                    this.updateAllMenuItemsCheckStatus(schemaModel);
                }
                FieldListViewModelFactory.toggleShowHidden = toggleShowHidden;
                function updateAllMenuItemsCheckStatus(schemaModel) {
                    for (var i = 0, len = schemaModel.entities.length; i < len; ++i) {
                        var entity = schemaModel.entities[i];
                        this.updateMenuItemsCheckStatus(entity.menuItems, 2 /* ViewHidden */, schemaModel.showHidden);
                        this.updateMenuItemsCheckStatus(entity.menuItems, 1 /* Hide */, entity.hidden);
                        for (var j = 0, jlen = entity.properties.length; j < jlen; ++j) {
                            var prop = entity.properties[j];
                            this.updateMenuItemsCheckStatus(prop.menuItems, 2 /* ViewHidden */, schemaModel.showHidden);
                            this.updateMenuItemsCheckStatus(prop.menuItems, 1 /* Hide */, prop.hidden);
                        }
                    }
                }
                FieldListViewModelFactory.updateAllMenuItemsCheckStatus = updateAllMenuItemsCheckStatus;
                function unhideAll(schemaModel) {
                    for (var i = 0, len = schemaModel.entities.length; i < len; ++i) {
                        var entity = schemaModel.entities[i];
                        if (entity.hidden) {
                            entity.hidden = false;
                            this.updateMenuItemsCheckStatus(entity.menuItems, 1 /* Hide */, false);
                        }
                        for (var j = 0, jlen = entity.properties.length; j < jlen; ++j) {
                            var prop = entity.properties[j];
                            if (prop.hidden) {
                                prop.hidden = false;
                                this.updateMenuItemsCheckStatus(prop.menuItems, 1 /* Hide */, false);
                            }
                        }
                    }
                }
                FieldListViewModelFactory.unhideAll = unhideAll;
                function updateSelection(schemaModel, fieldDef) {
                    for (var i = 0, len = schemaModel.entities.length; i < len; ++i) {
                        var entity = schemaModel.entities[i];
                        entity.selected = false;
                        for (var j = 0, jlen = entity.properties.length; j < jlen; ++j) {
                            var prop = entity.properties[j];
                            prop.selected = false;
                        }
                    }
                    var selecteditem = fieldDef;
                    if (!selecteditem)
                        return;
                    // if property is selected, don't select entity, vice versa
                    if (selecteditem.entity) {
                        if (selecteditem.column || selecteditem.measure) {
                            var selectedProperty = schemaModel.findProperty(selecteditem.entity, selecteditem.column || selecteditem.measure);
                            if (selectedProperty)
                                selectedProperty.selected = true;
                        }
                        else {
                            var selectedEntity = schemaModel.findEntity(selecteditem.entity);
                            if (selectedEntity)
                                selectedEntity.selected = true;
                        }
                    }
                }
                FieldListViewModelFactory.updateSelection = updateSelection;
                function updateMenuItemsCheckStatus(menuItems, action, checked) {
                    if (!menuItems)
                        return;
                    for (var i = 0, len = menuItems.length; i < len; i++) {
                        var menuItem = menuItems[i];
                        if (menuItem.action === action)
                            menuItem.checked = checked;
                        if (menuItem.checked)
                            menuItem.itemClass = "itemLabel checked";
                        else
                            menuItem.itemClass = "itemLabel";
                    }
                }
                FieldListViewModelFactory.updateMenuItemsCheckStatus = updateMenuItemsCheckStatus;
                function addModelChangeMenuItems(schemaModel) {
                    if (!schemaModel)
                        return;
                    for (var i = 0, len = schemaModel.entities.length; i < len; ++i) {
                        var entity = schemaModel.entities[i];
                        entity.menuItems = entity.menuItems.concat(this.createModelOperationMenuItems(entity.hidden));
                        for (var j = 0, jlen = entity.properties.length; j < jlen; ++j) {
                            var prop = entity.properties[j];
                            prop.menuItems = prop.menuItems.concat(this.createModelOperationMenuItems(prop.hidden));
                        }
                    }
                }
                FieldListViewModelFactory.addModelChangeMenuItems = addModelChangeMenuItems;
                function updateSupportedProperties(schemaModel) {
                    for (var i = 0, len = schemaModel.entities.length; i < len; ++i) {
                        var entity = schemaModel.entities[i];
                        for (var j = 0, jlen = entity.properties.length; j < jlen; ++j) {
                            var prop = entity.properties[j];
                            prop.supported = prop.kind !== 2 /* Kpi */ && !prop.type.binary;
                        }
                    }
                }
                FieldListViewModelFactory.updateSupportedProperties = updateSupportedProperties;
            })(FieldListViewModelFactory = viewModels.FieldListViewModelFactory || (viewModels.FieldListViewModelFactory = {}));
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var FieldListViewModelMerger;
            (function (FieldListViewModelMerger) {
                function deleteKeyFromMap(key, map) {
                    if (key in map) {
                        delete map[key];
                    }
                }
                function mergeModel(fieldListViewModel, contract, schemaName, modelChangeResult) {
                    debug.assertValue(schemaName != null, "schemaName is null");
                    if (!fieldListViewModel || !fieldListViewModel.schema || !contract) {
                        fieldListViewModel = {
                            schema: contract ? viewModels.FieldListViewModelFactory.convertConceptualSchema(contract, schemaName) : null,
                            isLoaded: !!contract,
                        };
                        return fieldListViewModel;
                    }
                    var fieldListConceptualModel = fieldListViewModel.schema;
                    var schema = contract.schema(schemaName);
                    if (!schema)
                        return fieldListViewModel;
                    fieldListConceptualModel.contract = schema;
                    // Create a map<entityName, entityIndex> to keep track of entities needed to be removed
                    debug.assertValue(fieldListConceptualModel.entities, "fieldListConceptualModel.entities");
                    var existingEntities = {};
                    for (var i = 0, len = fieldListConceptualModel.entities.length; i < len; ++i) {
                        existingEntities[fieldListConceptualModel.entities[i].name] = i;
                    }
                    // Find only the entity rename ModelChangeResults
                    if (modelChangeResult && modelChangeResult.changes.length > 0) {
                        var renameModelChangeResults = _.filter(modelChangeResult.changes, function (schemaChange) {
                            return schemaChange.entityRename;
                        });
                    }
                    var isRenameModelChangeResults = renameModelChangeResults && renameModelChangeResults.length > 0;
                    for (var i = 0, len = schema.entities.length; i < len; ++i) {
                        var entityName = schema.entities[i].name;
                        var fieldListConceptualEntity = fieldListConceptualModel.findEntity(entityName);
                        // Determine if this entity was renamed
                        if (isRenameModelChangeResults) {
                            var matchingRenames = _.filter(renameModelChangeResults, function (schemaChange) {
                                return schemaChange.entityRename && schemaChange.entityRename.after === entityName;
                            });
                            if (matchingRenames && matchingRenames.length > 0) {
                                debug.assert(matchingRenames.length === 1, "There is more than one rename of an entity.");
                                // If the entity name was changed outside of the report view, we must search with the old name
                                if (!fieldListConceptualEntity) {
                                    entityName = matchingRenames[0].entityRename.before;
                                    fieldListConceptualEntity = fieldListConceptualModel.findEntity(entityName);
                                }
                            }
                        }
                        if (fieldListConceptualEntity) {
                            mergeEntity(fieldListConceptualEntity, schema.entities[i], schemaName, schema.canEdit, modelChangeResult);
                            deleteKeyFromMap(entityName, existingEntities);
                        }
                        else {
                            var newEntity = viewModels.FieldListViewModelFactory.convertConceptualEntity(schema.entities[i], schemaName, schema.canEdit, fieldListConceptualModel);
                            fieldListConceptualModel.entities.push(newEntity);
                        }
                    }
                    // Remove extra entities
                    var toBeRemovedIndices = _.values(existingEntities).sort();
                    for (var i = toBeRemovedIndices.length - 1; i >= 0; i--)
                        fieldListConceptualModel.entities.splice(toBeRemovedIndices[i], 1);
                    return fieldListViewModel;
                }
                FieldListViewModelMerger.mergeModel = mergeModel;
                function mergeEntity(fieldListConceptualEntity, contract, schemaName, canEdit, modelChangeResult) {
                    debug.assertValue(fieldListConceptualEntity, "fieldListConceptualEntity");
                    debug.assertValue(fieldListConceptualEntity.properties, "fieldListConceptualEntity.properties");
                    debug.assertValue(contract, "contract");
                    debug.assertValue(schemaName != null, "schemaName is null");
                    fieldListConceptualEntity.contract = contract;
                    // Create a map<propertyName, propertyIndex> to keep track of properties needed to be removed
                    var existingProperties = {};
                    for (var i = 0, len = fieldListConceptualEntity.properties.length; i < len; ++i) {
                        existingProperties[fieldListConceptualEntity.properties[i].name] = i;
                    }
                    // Find only the property rename ModelChangeResults for this entity
                    if (modelChangeResult && modelChangeResult.changes.length > 0) {
                        var renameChangeResults = _.filter(modelChangeResult.changes, function (schemaChange) {
                            return schemaChange.propertyRename && schemaChange.propertyRename.entity === contract.name;
                        });
                    }
                    var isRenameChangeResults = renameChangeResults && renameChangeResults.length > 0;
                    for (var i = 0, len = contract.properties.length; i < len; ++i) {
                        var propertyName = contract.properties[i].name;
                        var fieldListConceptualProperty = fieldListConceptualEntity.findProperty(propertyName);
                        // Determine if the current property was renamed
                        if (isRenameChangeResults) {
                            var matchingRenames = _.filter(renameChangeResults, function (schemaChange) {
                                return schemaChange.propertyRename && schemaChange.propertyRename.after === propertyName;
                            });
                            if (matchingRenames && matchingRenames.length > 0) {
                                debug.assert(matchingRenames.length === 1, "There is more than one rename of a property.");
                                // If the property name was changed outside of the report view, we must search with the old name
                                if (!fieldListConceptualProperty) {
                                    propertyName = matchingRenames[0].propertyRename.before;
                                    fieldListConceptualProperty = fieldListConceptualEntity.findProperty(propertyName);
                                }
                            }
                        }
                        if (fieldListConceptualProperty) {
                            mergeProperty(fieldListConceptualProperty, contract.properties[i], contract);
                            deleteKeyFromMap(propertyName, existingProperties);
                        }
                        else {
                            var newProperty = viewModels.FieldListViewModelFactory.convertConceptualProperty(contract.properties[i], schemaName, contract.name, canEdit, fieldListConceptualEntity);
                            fieldListConceptualEntity.properties.push(newProperty);
                        }
                    }
                    // Remove extra properties
                    var toBeRemovedIndices = _.values(existingProperties).sort();
                    for (var i = toBeRemovedIndices.length - 1; i >= 0; i--)
                        fieldListConceptualEntity.properties.splice(toBeRemovedIndices[i], 1);
                }
                function mergeProperty(fieldListConceptualProperty, contract, entityContract) {
                    debug.assertValue(fieldListConceptualProperty, "fieldListConceptualProperty");
                    debug.assertValue(contract, "contract");
                    debug.assertValue(entityContract, "entityContract");
                    fieldListConceptualProperty.entityName = entityContract.name;
                    fieldListConceptualProperty.contract = contract;
                }
            })(FieldListViewModelMerger = viewModels.FieldListViewModelMerger || (viewModels.FieldListViewModelMerger = {}));
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            (function (FieldWellMenuItemAction) {
                FieldWellMenuItemAction[FieldWellMenuItemAction["Delete"] = 0] = "Delete";
                FieldWellMenuItemAction[FieldWellMenuItemAction["RemoveAggregate"] = 1] = "RemoveAggregate";
                FieldWellMenuItemAction[FieldWellMenuItemAction["SetAggregate"] = 2] = "SetAggregate";
            })(viewModels.FieldWellMenuItemAction || (viewModels.FieldWellMenuItemAction = {}));
            var FieldWellMenuItemAction = viewModels.FieldWellMenuItemAction;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var FieldWellViewModelFactory;
            (function (FieldWellViewModelFactory) {
                var EnumExtensions = jsCommon.EnumExtensions;
                var QueryAggregateFunction = powerbi.data.QueryAggregateFunction;
                var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
                var BucketCaptionFormatPrefix = "Role_DisplayName_";
                var AggregateCaptionPrefix = "Aggregate_";
                ;
                /** Creates field well buckets for a visual. */
                function createBuckets(visual, schema, displayNameService, visualPluginService, featureSwitches) {
                    var dataRoles = VisualContainerUtils.getDataRolesForVisual(visual, visualPluginService);
                    // NOTE: Hiding the Gradient bucket depending using the allFormatEnabled feature switch is cheaper than modifying the capabilities based
                    // on the feature switch.  We should remove this check once the format pane feature switch is enabled.
                    if (dataRoles && !featureSwitches.allFormatEnabled)
                        dataRoles = _.filter(dataRoles, function (r) { return r.name !== 'Gradient'; });
                    if (_.isEmpty(dataRoles))
                        return [];
                    var buckets = createBucketsCore(dataRoles);
                    populateBuckets(buckets, visual.config.singleVisual.query, schema, dataRoles, displayNameService);
                    return buckets;
                }
                FieldWellViewModelFactory.createBuckets = createBuckets;
                /** Create an empty array of buckets corresponding to the given roles. */
                function createBucketsCore(dataRoles) {
                    if (!dataRoles)
                        return [];
                    var buckets = [];
                    for (var i = 0, len = dataRoles.length; i < len; i++) {
                        var dataRole = dataRoles[i];
                        if (!shouldCreateBucketForRole(dataRole))
                            continue;
                        buckets.push({
                            role: dataRole.name,
                            displayName: getDisplayNameForRole(dataRole),
                            properties: []
                        });
                    }
                    return buckets;
                }
                /** Indicates whether the propertyDefn should show a bucket. */
                function shouldCreateBucketForRole(dataRole) {
                    debug.assertValue(dataRole, 'dataRole');
                    var kind = dataRole.kind;
                    return kind === 1 /* Measure */ || kind === 0 /* Grouping */ || kind === 2 /* GroupingOrMeasure */;
                }
                /** Populate the bucket view models with their corresponding properties. */
                function populateBuckets(buckets, query, schema, dataRoles, displayNameService) {
                    if (!query || !query.defn)
                        return;
                    var projections = query.projections, usedBuckets = Object.keys(projections), selects = query.defn.select(), roleNamesToBuckets = getRoleNamesToBuckets(buckets);
                    for (var i = 0, len = usedBuckets.length; i < len; i++) {
                        var roleName = usedBuckets[i], bucket = roleNamesToBuckets[roleName], projectionsForBucket = projections[roleName];
                        for (var j = 0, jlen = projectionsForBucket.length; j < jlen; j++) {
                            var projection = projectionsForBucket[j];
                            var expr = selects.withName(projection.queryRef).expr;
                            debug.assertValue(expr, "Expression not found");
                            var property = {
                                expr: expr,
                                role: roleName,
                                index: j,
                                displayName: displayNameService.getDisplayName(expr, schema),
                                dropDownItems: null,
                                tooltip: displayNameService.getQualifiedDisplayName(expr, schema),
                            };
                            property.dropDownItems = MenuItemFactory.createDropDownItems(property, bucket, jsCommon.ArrayExtensions.findItemWithName(dataRoles, roleName), schema);
                            updateSelectedMenuItems(property);
                            bucket.properties.push(property);
                        }
                    }
                }
                // Creates a mapping from role names to buckets
                function getRoleNamesToBuckets(buckets) {
                    var result = {};
                    for (var i = 0, len = buckets.length; i < len; i++) {
                        var bucket = buckets[i];
                        result[bucket.role] = bucket;
                    }
                    return result;
                }
                function getDisplayNameForRole(dataRole) {
                    return viewModels.ViewModelFactory.getDisplayName(dataRole.displayName) || powerbi.common.localize.get(BucketCaptionFormatPrefix + dataRole.name);
                }
                // This isn't exactly a factory function, but we don't currently have a better place to put it.
                // TODO: Find a better place.
                function updateSelectedMenuItems(property) {
                    var propertyAggregate = powerbi.data.SQExprInfo.getAggregate(property.expr), hasAggregate = propertyAggregate !== undefined, menuItems = property.dropDownItems;
                    if (!menuItems)
                        return;
                    for (var i = 0, len = menuItems.length; i < len; i++) {
                        var menuItem = menuItems[i];
                        switch (menuItem.action) {
                            case 2 /* SetAggregate */:
                                menuItem.checked = hasAggregate && menuItem.aggregate === propertyAggregate;
                                break;
                            case 1 /* RemoveAggregate */:
                                menuItem.checked = !hasAggregate;
                                break;
                            default:
                                menuItem.checked = false;
                                break;
                        }
                        if (menuItem.checked)
                            menuItem.itemClass = "itemLabel checked";
                        else
                            menuItem.itemClass = "itemLabel";
                    }
                }
                FieldWellViewModelFactory.updateSelectedMenuItems = updateSelectedMenuItems;
                //
                // Private factory for creating menu items
                //
                var MenuItemFactory;
                (function (MenuItemFactory) {
                    var services = powerbi.explore.services;
                    function createDropDownItems(property, bucket, dataRole, schema) {
                        // Menu items always include a 'delete' option
                        var menuItems = [createDeleteMenuItem(property, bucket)];
                        var seperatorItem = createActionMenuItem(property, bucket);
                        seperatorItem.type = 2 /* Separator */;
                        menuItems.push(seperatorItem);
                        // If the property can be either a grouping OR a measure, we need
                        // to allow aggregation to be toggled on and off.
                        if (dataRole.kind === 2 /* GroupingOrMeasure */)
                            menuItems.push(createRemoveAggregateMenuItem(property, bucket));
                        // Create menu items for all supported aggregation functions.
                        var supportedAggregates = services.VisualAuthoringInfo.getSupportedAggregates(property.expr, dataRole, schema);
                        for (var i = 0, len = supportedAggregates.length; i < len; i++) {
                            var aggregate = supportedAggregates[i];
                            menuItems.push(createAggregateMenuItem(property, bucket, aggregate));
                        }
                        var lastItemIndex = menuItems.length - 1;
                        if (menuItems[lastItemIndex].type === 2 /* Separator */)
                            menuItems.splice(lastItemIndex, 1);
                        return menuItems;
                    }
                    MenuItemFactory.createDropDownItems = createDropDownItems;
                    function createAggregateMenuItem(property, bucket, aggregate) {
                        var item = createActionMenuItem(property, bucket);
                        item.action = 2 /* SetAggregate */;
                        item.aggregate = aggregate;
                        var resourceLookupKey = AggregateCaptionPrefix + EnumExtensions.toString(QueryAggregateFunction, aggregate);
                        item.text = powerbi.common.localize.get(resourceLookupKey);
                        return item;
                    }
                    function createDeleteMenuItem(property, bucket) {
                        var item = createActionMenuItem(property, bucket);
                        item.action = 0 /* Delete */;
                        item.text = powerbi.common.localize.get("FieldWell_Remove");
                        return item;
                    }
                    function createRemoveAggregateMenuItem(property, bucket) {
                        var item = createActionMenuItem(property, bucket);
                        item.action = 1 /* RemoveAggregate */;
                        item.text = powerbi.common.localize.get("FieldWell_RemoveAggregate");
                        return item;
                    }
                    // Creates a basic menu item whose functionality will be specialized later.
                    function createActionMenuItem(property, bucket) {
                        return {
                            property: property,
                            labelClass: "itemLabel",
                            type: 0 /* Item */,
                            text: undefined,
                            action: undefined
                        };
                    }
                })(MenuItemFactory || (MenuItemFactory = {}));
            })(FieldWellViewModelFactory = viewModels.FieldWellViewModelFactory || (viewModels.FieldWellViewModelFactory = {}));
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var Lazy = jsCommon.Lazy;
            var QueryComparisonKind = powerbi.data.QueryComparisonKind;
            var SQAndExpr = powerbi.data.SQAndExpr;
            var SQConstExpr = powerbi.data.SQConstantExpr;
            var SQCompareExpr = powerbi.data.SQCompareExpr;
            var SQContainsExpr = powerbi.data.SQContainsExpr;
            var SQDateSpanExpr = powerbi.data.SQDateSpanExpr;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var SQOrExpr = powerbi.data.SQOrExpr;
            var SQStartsWithExpr = powerbi.data.SQStartsWithExpr;
            var StringExtensions = jsCommon.StringExtensions;
            var numberWithPercentSignPattern = /[0-9]*\.?[0-9]+%/;
            var FilterCardConverter;
            (function (FilterCardConverter) {
                function createAdvFilter(sqExpr, formatter) {
                    return sqExpr.accept(new AdvFilterCardVisitor(formatter));
                }
                FilterCardConverter.createAdvFilter = createAdvFilter;
                function toSQExpr(operand, type, conditions, logicalOperator) {
                    if (logicalOperator === void 0) { logicalOperator = 0 /* And */; }
                    var visitor = new ConditionToSQExprVisitor(operand, type, logicalOperator);
                    var result;
                    for (var i = 0, len = conditions.length; i < len; i++) {
                        var condition = conditions[i];
                        if (!condition.operator || condition.operator === 0 /* None */)
                            continue;
                        result = condition.accept(visitor);
                    }
                    return result;
                }
                FilterCardConverter.toSQExpr = toSQExpr;
            })(FilterCardConverter = viewModels.FilterCardConverter || (viewModels.FilterCardConverter = {}));
            var RestatementHelper;
            (function (RestatementHelper) {
                function fromCondition(conditions, logicalOperator) {
                    var visitor = new RestatementVisitor(logicalOperator);
                    var result;
                    for (var i = 0, len = conditions.length; i < len; i++) {
                        var condition = conditions[i];
                        if (!condition.operator || condition.operator === 0 /* None */)
                            continue;
                        result = conditions[i].accept(visitor);
                    }
                    return result;
                }
                RestatementHelper.fromCondition = fromCondition;
                // The returned string will look like 'is A, B, ..., or C' 
                function fromLabels(labels, isNot, format) {
                    var result;
                    var length = labels.length;
                    if (length > 0) {
                        result = labels[0];
                        var lastIndex = length - 1;
                        for (var i = 1, len = lastIndex; i < len; i++) {
                            var value = labels[i];
                            result = StringExtensions.format(powerbi.common.localize.get('FilterRestatement_Comma'), result, value);
                        }
                        if (length > 1) {
                            var value = labels[lastIndex];
                            result = StringExtensions.format(powerbi.common.localize.get('FilterRestatement_CompoundOr'), result, value);
                        }
                        result = isNot ? StringExtensions.format(powerbi.common.localize.get('FilterRestatement_NotEqual'), result) : StringExtensions.format(powerbi.common.localize.get('FilterRestatement_Equal'), result);
                    }
                    return result;
                }
                RestatementHelper.fromLabels = fromLabels;
            })(RestatementHelper = viewModels.RestatementHelper || (viewModels.RestatementHelper = {}));
            var OperatorHelper;
            (function (OperatorHelper) {
                var dateTimeOperator = new Lazy(function () {
                    var ops = [];
                    ops.push({ value: 9 /* Is */, label: powerbi.common.localize.get('FilterOperator_Is') });
                    ops.push({ value: 10 /* IsNot */, label: powerbi.common.localize.get('FilterOperator_IsNot') });
                    ops.push({ value: 3 /* GreaterThan */, label: powerbi.common.localize.get('FilterOperator_GreaterThan_DT') });
                    ops.push({ value: 4 /* GreaterThanOrEqual */, label: powerbi.common.localize.get('FilterOperator_GreaterThanOrEqual_DT') });
                    ops.push({ value: 1 /* LessThan */, label: powerbi.common.localize.get('FilterOperator_LessThan_DT') });
                    ops.push({ value: 2 /* LessThanOrEqual */, label: powerbi.common.localize.get('FilterOperator_LessThanOrEqual_DT') });
                    ops.push({ value: 11 /* IsBlank */, label: powerbi.common.localize.get('FilterOperator_IsBlank') });
                    ops.push({ value: 12 /* IsNotBlank */, label: powerbi.common.localize.get('FilterOperator_IsNotBlank') });
                    return ops;
                });
                var stringTypeOperator = new Lazy(function () {
                    var ops = [];
                    ops.push({ value: 5 /* Contains */, label: powerbi.common.localize.get('FilterOperator_Contains') });
                    ops.push({ value: 6 /* DoesNotContain */, label: powerbi.common.localize.get('FilterOperator_DoesNotContain') });
                    ops.push({ value: 7 /* StartWith */, label: powerbi.common.localize.get('FilterOperator_StartsWith') });
                    ops.push({ value: 8 /* DoesNotStartWith */, label: powerbi.common.localize.get('FilterOperator_DoesNotStartWith') });
                    ops.push({ value: 9 /* Is */, label: powerbi.common.localize.get('FilterOperator_Is') });
                    ops.push({ value: 10 /* IsNot */, label: powerbi.common.localize.get('FilterOperator_IsNot') });
                    ops.push({ value: 11 /* IsBlank */, label: powerbi.common.localize.get('FilterOperator_IsBlank') });
                    ops.push({ value: 12 /* IsNotBlank */, label: powerbi.common.localize.get('FilterOperator_IsNotBlank') });
                    return ops;
                });
                var numericOperator = new Lazy(function () {
                    var ops = [];
                    ops.push({ value: 1 /* LessThan */, label: powerbi.common.localize.get('FilterOperator_LessThan') });
                    ops.push({ value: 2 /* LessThanOrEqual */, label: powerbi.common.localize.get('FilterOperator_LessThanOrEqual') });
                    ops.push({ value: 3 /* GreaterThan */, label: powerbi.common.localize.get('FilterOperator_GreaterThan') });
                    ops.push({ value: 4 /* GreaterThanOrEqual */, label: powerbi.common.localize.get('FilterOperator_GreaterThanOrEqual') });
                    ops.push({ value: 9 /* Is */, label: powerbi.common.localize.get('FilterOperator_Is') });
                    ops.push({ value: 10 /* IsNot */, label: powerbi.common.localize.get('FilterOperator_IsNot') });
                    ops.push({ value: 11 /* IsBlank */, label: powerbi.common.localize.get('FilterOperator_IsBlank') });
                    ops.push({ value: 12 /* IsNotBlank */, label: powerbi.common.localize.get('FilterOperator_IsNotBlank') });
                    return ops;
                });
                function getValueRequired(operator) {
                    return operator !== 11 /* IsBlank */ && operator !== 12 /* IsNotBlank */ && operator !== 0 /* None */;
                }
                OperatorHelper.getValueRequired = getValueRequired;
                function getFilterOperators(dataType) {
                    if (dataType.text)
                        return stringTypeOperator.getValue();
                    else if (dataType.integer || dataType.numeric)
                        return numericOperator.getValue();
                    else if (dataType.dateTime)
                        return dateTimeOperator.getValue();
                }
                OperatorHelper.getFilterOperators = getFilterOperators;
            })(OperatorHelper = viewModels.OperatorHelper || (viewModels.OperatorHelper = {}));
            var AdvFilterCardVisitor = (function (_super) {
                __extends(AdvFilterCardVisitor, _super);
                function AdvFilterCardVisitor(formatter) {
                    _super.call(this);
                    this.context = {
                        isNegative: false,
                        rootLevel: true,
                        logicalOperator: 2 /* Undefined */,
                    };
                    this.formatter = formatter;
                }
                AdvFilterCardVisitor.prototype.visitColumnRef = function (expr) {
                    return this.createFilterCard(expr.asFieldDef());
                };
                AdvFilterCardVisitor.prototype.visitMeasureRef = function (expr) {
                    return this.createFilterCard(expr.asFieldDef());
                };
                AdvFilterCardVisitor.prototype.visitAggr = function (expr) {
                    return this.createFilterCard(expr.asFieldDef());
                };
                AdvFilterCardVisitor.prototype.visitEntity = function (expr) {
                    return this.createFilterCard(expr.asFieldDef());
                };
                AdvFilterCardVisitor.prototype.visitAnd = function (expr) {
                    var context = this.context;
                    if (context.logicalOperator === 1 /* Or */)
                        return;
                    if (context.logicalOperator === 2 /* Undefined */)
                        context.logicalOperator = context.isNegative ? 1 /* Or */ : 0 /* And */;
                    context.rootLevel = false;
                    if (!expr.left.accept(this) || !expr.right.accept(this))
                        return;
                    return this.filter;
                };
                AdvFilterCardVisitor.prototype.visitOr = function (expr) {
                    var context = this.context;
                    if (context.logicalOperator === 0 /* And */)
                        return;
                    if (context.logicalOperator === 2 /* Undefined */)
                        context.logicalOperator = context.isNegative ? 0 /* And */ : 1 /* Or */;
                    context.rootLevel = false;
                    if (!expr.left.accept(this) || !expr.right.accept(this))
                        return;
                    return this.filter;
                };
                AdvFilterCardVisitor.prototype.visitCompare = function (expr) {
                    var context = this.context;
                    var operator = this.getFilterOperator(expr, context.isNegative);
                    if (operator === undefined || operator === 0 /* None */)
                        return;
                    context.condition = new viewModels.Condition(this.getFilterOperator(expr, context.isNegative));
                    context.rootLevel = false;
                    if (!expr.left.accept(this) || !expr.right.accept(this))
                        return;
                    if (!(expr.right instanceof SQConstExpr || expr.right instanceof SQDateSpanExpr))
                        return;
                    var filter = this.filter;
                    filter.conditions.push(this.context.condition);
                    // Merging logic
                    if (filter.conditions.length > 1 && filter.logicalOperator === 2 /* Undefined */)
                        filter.logicalOperator = 0 /* And */;
                    context.condition = null;
                    return filter;
                };
                AdvFilterCardVisitor.prototype.visitNot = function (expr) {
                    // SQNotExpr is only supported if the containing expression is a compare expression,
                    // or at the root level and the containing expression is SQAndExpr or SQOrExpr or SQContainsExpr or SQStartsWithExpr.
                    var context = this.context;
                    var containingExpr = expr.arg;
                    if (!(containingExpr instanceof SQCompareExpr)) {
                        if (!(context.rootLevel && (containingExpr instanceof SQAndExpr || containingExpr instanceof SQOrExpr || containingExpr instanceof SQContainsExpr || containingExpr instanceof SQStartsWithExpr))) {
                            return;
                        }
                    }
                    context.isNegative = true;
                    context.rootLevel = false;
                    if (!expr.arg.accept(this))
                        return;
                    context.isNegative = false;
                    return this.filter;
                };
                AdvFilterCardVisitor.prototype.visitConstant = function (expr) {
                    if (!this.context.condition)
                        return;
                    var condition = this.context.condition;
                    if (expr.type.primitiveType !== 0 /* Null */)
                        condition.value = new viewModels.ConditionValue(expr.value, this.formatter);
                    return this.filter;
                };
                AdvFilterCardVisitor.prototype.visitDateSpan = function (expr) {
                    // Pass through Second-granularity DateSpan to the underlying DateTime (if any).
                    if (expr.unit === 5 /* Second */)
                        return expr.arg.accept(this);
                };
                AdvFilterCardVisitor.prototype.visitContains = function (expr) {
                    var context = this.context;
                    context.condition = new viewModels.Condition(context.isNegative ? 6 /* DoesNotContain */ : 5 /* Contains */);
                    context.rootLevel = false;
                    if (!expr.left.accept(this) || !expr.right.accept(this))
                        return;
                    var filter = this.filter;
                    filter.conditions.push(this.context.condition);
                    return filter;
                };
                AdvFilterCardVisitor.prototype.visitStartsWith = function (expr) {
                    var context = this.context;
                    context.condition = new viewModels.Condition(context.isNegative ? 8 /* DoesNotStartWith */ : 7 /* StartWith */);
                    context.rootLevel = false;
                    if (!expr.left.accept(this) || !expr.right.accept(this))
                        return;
                    var filter = this.filter;
                    filter.conditions.push(this.context.condition);
                    return filter;
                };
                AdvFilterCardVisitor.prototype.getFilterOperator = function (expr, isNegative) {
                    switch (expr.kind) {
                        case 3 /* LessThan */:
                            return isNegative ? 3 /* GreaterThan */ : 1 /* LessThan */;
                        case 4 /* LessThanOrEqual */:
                            return isNegative ? 4 /* GreaterThanOrEqual */ : 2 /* LessThanOrEqual */;
                        case 1 /* GreaterThan */:
                            return isNegative ? 1 /* LessThan */ : 3 /* GreaterThan */;
                        case 2 /* GreaterThanOrEqual */:
                            return isNegative ? 2 /* LessThanOrEqual */ : 4 /* GreaterThanOrEqual */;
                        case 0 /* Equal */:
                            if (expr.right instanceof SQConstExpr && expr.right.type.primitiveType === 0 /* Null */)
                                return isNegative ? 12 /* IsNotBlank */ : 11 /* IsBlank */;
                            else
                                return isNegative ? 10 /* IsNot */ : 9 /* Is */;
                    }
                };
                AdvFilterCardVisitor.prototype.createFilterCard = function (field) {
                    if (!this.filter) {
                        this.filter = new viewModels.AdvFilterCard(field);
                        this.filter.logicalOperator = this.context.logicalOperator;
                    }
                    return this.filter;
                };
                return AdvFilterCardVisitor;
            })(powerbi.data.DefaultSQExprVisitor);
            var ConditionToSQExprVisitor = (function () {
                function ConditionToSQExprVisitor(propertyExpr, dataType, logicalOperator) {
                    this.propertyExpr = propertyExpr;
                    this.dataType = dataType;
                    this.logicalOperator = logicalOperator;
                }
                ConditionToSQExprVisitor.prototype.visit = function (cond) {
                    if (!this.result) {
                        this.result = this.getExpr(cond);
                    }
                    else {
                        if (this.logicalOperator === 0 /* And */)
                            this.result = SQExprBuilder.and(this.result, this.getExpr(cond));
                        else if (this.logicalOperator === 1 /* Or */)
                            this.result = SQExprBuilder.or(this.result, this.getExpr(cond));
                        else
                            debug.assertFail('Logical operator is not set for multiple conditions.');
                    }
                    return this.result;
                };
                ConditionToSQExprVisitor.prototype.getExpr = function (cond) {
                    switch (cond.operator) {
                        case 9 /* Is */:
                            return SQExprBuilder.compare(0 /* Equal */, this.propertyExpr, this.getValueExpr(cond));
                        case 10 /* IsNot */:
                            return SQExprBuilder.not(SQExprBuilder.compare(0 /* Equal */, this.propertyExpr, this.getValueExpr(cond)));
                        case 11 /* IsBlank */:
                            return SQExprBuilder.compare(0 /* Equal */, this.propertyExpr, SQExprBuilder.nullConstant());
                        case 12 /* IsNotBlank */:
                            return SQExprBuilder.not(SQExprBuilder.compare(0 /* Equal */, this.propertyExpr, SQExprBuilder.nullConstant()));
                        case 5 /* Contains */:
                            return SQExprBuilder.contains(this.propertyExpr, this.getValueExpr(cond));
                        case 6 /* DoesNotContain */:
                            return SQExprBuilder.not(SQExprBuilder.contains(this.propertyExpr, this.getValueExpr(cond)));
                        case 7 /* StartWith */:
                            return SQExprBuilder.startsWith(this.propertyExpr, this.getValueExpr(cond));
                        case 8 /* DoesNotStartWith */:
                            return SQExprBuilder.not(SQExprBuilder.startsWith(this.propertyExpr, this.getValueExpr(cond)));
                        case 3 /* GreaterThan */:
                            return SQExprBuilder.compare(1 /* GreaterThan */, this.propertyExpr, this.getValueExpr(cond));
                        case 4 /* GreaterThanOrEqual */:
                            return SQExprBuilder.compare(2 /* GreaterThanOrEqual */, this.propertyExpr, this.getValueExpr(cond));
                        case 1 /* LessThan */:
                            return SQExprBuilder.compare(3 /* LessThan */, this.propertyExpr, this.getValueExpr(cond));
                        case 2 /* LessThanOrEqual */:
                            return SQExprBuilder.compare(4 /* LessThanOrEqual */, this.propertyExpr, this.getValueExpr(cond));
                        default:
                            debug.assertFail('Not valid filter operator type.');
                    }
                };
                ConditionToSQExprVisitor.prototype.getValueExpr = function (cond) {
                    var dataType = this.dataType;
                    var stringValue = cond.value.stringValue;
                    if (dataType.integer || dataType.numeric) {
                        var numericValue = parseInt(stringValue, 10);
                        if (isNaN(numericValue))
                            return;
                        if (dataType.integer)
                            return SQExprBuilder.integer(numericValue);
                        var floatValue = parseFloat(stringValue);
                        if (stringValue.match(numberWithPercentSignPattern))
                            floatValue = floatValue / 100;
                        if (dataType.primitiveType === 2 /* Decimal */)
                            return SQExprBuilder.decimal(floatValue);
                        debug.assert(dataType.extendedType === powerbi.ExtendedType.Double, 'Unexpected data type.');
                        return SQExprBuilder.double(floatValue);
                    }
                    if (dataType.text) {
                        var value = stringValue;
                        return SQExprBuilder.text(value);
                    }
                    if (dataType.dateTime) {
                        var date = cond.value.dateValue;
                        return SQExprBuilder.dateSpan(5 /* Second */, SQExprBuilder.dateTime(date));
                    }
                };
                return ConditionToSQExprVisitor;
            })();
            var RestatementVisitor = (function () {
                function RestatementVisitor(logicalOperator) {
                    if (logicalOperator === 0 /* And */)
                        this.logicalOperatorResourceId = powerbi.common.localize.get('FilterRestatement_CompoundAnd');
                    else if (logicalOperator === 1 /* Or */)
                        this.logicalOperatorResourceId = powerbi.common.localize.get('FilterRestatement_CompoundOr');
                }
                RestatementVisitor.prototype.visit = function (cond) {
                    var condition = this.conditionToString(cond);
                    if (!condition)
                        return;
                    if (StringExtensions.isNullOrEmpty(this.result)) {
                        this.result = condition;
                    }
                    else {
                        debug.assert(!StringExtensions.isNullOrEmpty(this.logicalOperatorResourceId), 'Logical operator is not set');
                        this.result = StringExtensions.format(this.logicalOperatorResourceId, this.result, condition);
                    }
                    return this.result;
                };
                RestatementVisitor.prototype.conditionToString = function (condition) {
                    if (OperatorHelper.getValueRequired(condition.operator) && !condition.value.hasValue)
                        return;
                    switch (condition.operator) {
                        case 9 /* Is */:
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_Equal'), condition.value.toString());
                        case 10 /* IsNot */:
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_NotEqual'), condition.value.toString());
                        case 3 /* GreaterThan */:
                            if (condition.value.isDate)
                                return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_GreaterThan_DT'), condition.value.toString());
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_GreaterThan'), condition.value.toString());
                        case 4 /* GreaterThanOrEqual */:
                            if (condition.value.isDate)
                                return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_GreaterThanOrEqual_DT'), condition.value.toString());
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_GreaterThanOrEqual'), condition.value.toString());
                        case 1 /* LessThan */:
                            if (condition.value.isDate)
                                return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_LessThan_DT'), condition.value.toString());
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_LessThan'), condition.value.toString());
                        case 2 /* LessThanOrEqual */:
                            if (condition.value.isDate)
                                return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_LessThanOrEqual_DT'), condition.value.toString());
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_LessThanOrEqual'), condition.value.toString());
                        case 5 /* Contains */:
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_Contains'), condition.value.toString());
                        case 6 /* DoesNotContain */:
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_DoesNotContain'), condition.value.toString());
                        case 7 /* StartWith */:
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_StartWith'), condition.value.toString());
                        case 8 /* DoesNotStartWith */:
                            return StringExtensions.format(powerbi.common.localize.get('FilterRestatement_DoesNotStartWith'), condition.value.toString());
                        case 11 /* IsBlank */:
                            return powerbi.common.localize.get('FilterOperator_IsBlank');
                        case 12 /* IsNotBlank */:
                            return powerbi.common.localize.get('FilterOperator_IsNotBlank');
                        default:
                            debug.assertFail('Not supported filter operator');
                            return '';
                    }
                };
                return RestatementVisitor;
            })();
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            (function (FilterPaneType) {
                FilterPaneType[FilterPaneType["Page"] = 0] = "Page";
                FilterPaneType[FilterPaneType["VisualContainer"] = 1] = "VisualContainer";
            })(viewModels.FilterPaneType || (viewModels.FilterPaneType = {}));
            var FilterPaneType = viewModels.FilterPaneType;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var FilterViewModel = (function (_super) {
                __extends(FilterViewModel, _super);
                function FilterViewModel(contract, scope) {
                    // do NOT copy values from contract to the model here... that must happen in ModelConverter
                    _super.call(this, contract, {
                        expanded: false,
                    });
                    this.id = FilterViewModel.counter++;
                    this.restatement = '';
                    this.displayName = '';
                    this.isAutoGenerated = false;
                    this.scope = scope;
                }
                Object.defineProperty(FilterViewModel.prototype, "isVisualFilter", {
                    get: function () {
                        return this.scope.visualContainer != null;
                    },
                    enumerable: true,
                    configurable: true
                });
                FilterViewModel.prototype.getScope = function () {
                    return this.scope;
                };
                FilterViewModel.prototype.getSectionScope = function () {
                    return this.scope.section;
                };
                /** The visual scope can be undefined, because a filter doesn't require to have a visual scope if it is a page filter.**/
                FilterViewModel.prototype.getVisualScope = function () {
                    return this.scope.visualContainer;
                };
                FilterViewModel.prototype.update = function (filter) {
                    var filters;
                    var filterContainer = this.contract;
                    filterContainer.filter = filter;
                    // check whether the filter contract has been added to visual or not
                    if (this.isVisualFilter) {
                        var visualScope = this.getVisualScope();
                        filters = visualScope.filters || [];
                        visualScope.filters = filters;
                    }
                    else {
                        var sectionScope = this.getSectionScope();
                        filters = sectionScope.filters || [];
                        sectionScope.filters = filters;
                    }
                    if (FilterViewModel.indexOf(filters, filterContainer) === -1)
                        filters.push(filterContainer);
                };
                // Need to call updateFilterProperties when model changed.
                FilterViewModel.prototype.updateFilterProperties = function (schema) {
                    if (this.contract.field) {
                        var fieldSQExpr = powerbi.data.SQExprBuilder.fieldDef(this.contract.field);
                        this.isMeasure = explore.FilterUtils.isMeasureField(fieldSQExpr, schema);
                        this.valueType = explore.FilterUtils.getValueType(fieldSQExpr, schema);
                        this.formatter = explore.FilterUtils.getFormatter(fieldSQExpr, schema);
                    }
                    if (this.isVisualFilter) {
                        var visualContainer = this.getVisualScope();
                        this.hasGroupingScope = VisualContainerUtils.hasGrouping(visualContainer, schema);
                    }
                    else
                        this.hasGroupingScope = false;
                };
                FilterViewModel.prototype.switchType = function (filterType) {
                    this.contract.type = filterType;
                };
                FilterViewModel.prototype.updateViewStateCore = function (state) {
                    var contract = this.contract;
                    debug.assertValue(contract.type, 'Expected type to be defined for filter contract.');
                    state.type = contract.type != null ? contract.type : 2 /* Advanced */;
                    state.canSwitchCardType = state.type !== 3 /* Passthrough */ && contract.expanded && contract.field.aggregate == null && !this.isMeasure && this.valueType && !this.valueType.bool;
                    state.expanded = contract.expanded;
                    state.disabled = this.isMeasure && !this.hasGroupingScope;
                };
                FilterViewModel.indexOf = function (filters, searchFilter) {
                    for (var i = 0, len = filters.length; i < len; i++) {
                        if (filters[i] === searchFilter)
                            return i;
                    }
                    return -1;
                };
                FilterViewModel.counter = 0;
                return FilterViewModel;
            })(viewModels.ViewModel);
            viewModels.FilterViewModel = FilterViewModel;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
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
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var ArrayExtensions = jsCommon.ArrayExtensions;
            var GradientUtils = powerbi.visuals.GradientUtils;
            var PropertyPaneViewModelFactory;
            (function (PropertyPaneViewModelFactory) {
                /** Walks the objects in capabilities and converts them into a property pane model */
                function createPane(options) {
                    debug.assertValue(options, 'options');
                    debug.assertValue(options.objectDescriptors, 'options.objectDescriptors');
                    var model = { cards: ArrayExtensions.createWithName(), inputFieldsOptions: viewModels.PropertyPaneViewModelFactory.getInputFieldsOptions() };
                    if (options.visual && options.visual.enumerateObjectInstances) {
                        for (var objectName in options.objectDescriptors) {
                            var objDesc = options.objectDescriptors[objectName];
                            if (!objDesc)
                                continue;
                            // check if feature switch is enabled for this object
                            var featureSwitchName = objectName + 'FormatEnabled';
                            if (!options.featureSwitches.allFormatEnabled && !options.featureSwitches[featureSwitchName])
                                continue;
                            var visualObjectInstances = [];
                            //the following is saved directly to the visual container object
                            if (objectName === 'title') {
                                visualObjectInstances.push(enumerateTitleObjectInstances(options.visualTitle));
                            }
                            else if (objectName === 'background') {
                                visualObjectInstances.push(enumerateBackgroundObjectInstances(options.visualBackground));
                            }
                            else {
                                visualObjectInstances = options.visual.enumerateObjectInstances({ objectName: objectName });
                            }
                            if (!visualObjectInstances)
                                continue;
                            var propertyPaneCard = model.cards.withName(objectName);
                            if (!propertyPaneCard) {
                                propertyPaneCard = {
                                    name: objectName,
                                    displayName: viewModels.ViewModelFactory.getDisplayName(objDesc.displayName) || objectName,
                                    header: [],
                                    slices: [],
                                    footer: [],
                                    mainShow: null
                                };
                                model.cards.push(propertyPaneCard);
                            }
                            for (var i = 0, len = visualObjectInstances.length; i < len; i++) {
                                var instance = visualObjectInstances[i], objectProperties = objDesc.properties, instanceProperties = instance.properties;
                                for (var propertyName in instanceProperties) {
                                    var value = instanceProperties[propertyName], objectPropDesc = objectProperties[propertyName], propertyDisplayName = undefined, propertyType, objectPropDisplayName;
                                    debug.assert(!!objectPropDesc, 'Object Property Descriptor not found: ' + objectName + '.' + propertyName);
                                    if (!canVisualizeProperty(objectPropDesc))
                                        continue;
                                    updateFieldOptionsOnModel(instance, propertyName, model);
                                    if (instance.selector)
                                        propertyDisplayName = instance.displayName;
                                    if (!objectPropDesc)
                                        continue;
                                    propertyType = objectPropDesc.type;
                                    var objectPropDisplayName = viewModels.ViewModelFactory.getDisplayName(objectPropDesc.displayName);
                                    var slice = {
                                        name: propertyName,
                                        displayName: propertyDisplayName || objectPropDisplayName || propertyName,
                                        type: propertyType,
                                        selector: instance.selector,
                                        value: value && value.solid && isFillProperty(propertyType) && propertyName !== 'color' ? value.solid.color : value,
                                        show: true,
                                        placeholder: getSlicePlaceholder(propertyPaneCard.name, propertyName),
                                        isValid: true
                                    };
                                    if (isSliceBelongToHeader(propertyPaneCard.name, slice.name)) {
                                        propertyPaneCard.header.push(slice);
                                    }
                                    else {
                                        propertyPaneCard.slices.push(slice);
                                    }
                                    if (propertyName === 'show') {
                                        propertyPaneCard.mainShow = slice;
                                    }
                                    addIntermediateSlicesToCard(propertyPaneCard, propertyName);
                                }
                            }
                            if (propertyPaneCard.slices.length > 0) {
                                addFooterSlicesToCard(propertyPaneCard);
                            }
                        }
                        if (options.showGradientCard) {
                            gradientCardHandler(model, options.objectDefinitions);
                        }
                    }
                    return model;
                }
                PropertyPaneViewModelFactory.createPane = createPane;
                // Exported for testability
                function canVisualizeProperty(objectPropDesc) {
                    if (!objectPropDesc)
                        return false;
                    var valueType = powerbi.ValueType.fromDescriptor(objectPropDesc.type);
                    if (valueType.extendedType !== 0 /* Null */)
                        return true;
                    return powerbi.StructuralTypeDescriptor.isValid(objectPropDesc.type);
                }
                PropertyPaneViewModelFactory.canVisualizeProperty = canVisualizeProperty;
                function getSliceComponentType(slice) {
                    debug.assertValue(slice.type, 'sliceType');
                    switch (slice.name) {
                        case 'transparency':
                            return 'percentageSlider';
                        case 'labelPrecision':
                            return 'numUpDown';
                        case 'gradientBar':
                            return 'gradientBar';
                    }
                    var sliceTypeName = getSliceTypeName(slice.type);
                    switch (sliceTypeName) {
                        case 'legendPosition':
                        case 'axisType':
                        case 'yAxisPosition':
                        case 'axisStyle':
                        case 'labelPosition':
                        case 'labelDisplayUnits':
                            return 'selection';
                        case 'alignment':
                            return 'alignment';
                        default:
                            return sliceTypeName;
                    }
                }
                PropertyPaneViewModelFactory.getSliceComponentType = getSliceComponentType;
                function getSliceTypeName(sliceType) {
                    debug.assertValue(sliceType, 'sliceType');
                    var valueType = powerbi.ValueType.fromDescriptor(sliceType);
                    if (valueType.extendedType !== 0 /* Null */) {
                        var formattingType = valueType.formatting;
                        if (formattingType) {
                            return getFormattingKey(formattingType);
                        }
                    }
                    return Object.keys(sliceType)[0];
                }
                PropertyPaneViewModelFactory.getSliceTypeName = getSliceTypeName;
                function getOptionsTypeName(card, slice) {
                    if (card.name === 'valueAxis') {
                        if (slice.name === 'axisStyle') {
                            return 'valueAxisStyle';
                        }
                        if (slice.name === 'secAxisStyle') {
                            return 'secValueAxisStyle';
                        }
                    }
                    if (card.name === 'categoryAxis' && slice.name === 'axisStyle') {
                        return 'categoryAxisStyle';
                    }
                    return getSliceTypeName(slice.type);
                }
                PropertyPaneViewModelFactory.getOptionsTypeName = getOptionsTypeName;
                function getSliceByPropertyName(propertyPaneCard, propertyName) {
                    if (propertyPaneCard && propertyPaneCard.slices) {
                        for (var i = 0, len = propertyPaneCard.slices.length; i < len; i++) {
                            var slice = propertyPaneCard.slices[i];
                            if (slice.name === propertyName) {
                                return slice;
                            }
                        }
                    }
                    return null;
                }
                PropertyPaneViewModelFactory.getSliceByPropertyName = getSliceByPropertyName;
                function getFormattingKey(formattingType) {
                    for (var key in formattingType) {
                        if (formattingType[key] === true) {
                            return key;
                        }
                    }
                    return null;
                }
                function getInputFieldsOptions() {
                    return {
                        legendPosition: viewModels.ViewModelFactory.getDisplayNames(powerbi.legendPosition.members()),
                        axisType: viewModels.ViewModelFactory.getDisplayNames(powerbi.axisType.members()),
                        categoryAxisStyle: viewModels.ViewModelFactory.getDisplayNames(powerbi.axisStyle.members()),
                        valueAxisStyle: viewModels.ViewModelFactory.getDisplayNames(powerbi.axisStyle.members()),
                        secValueAxisStyle: viewModels.ViewModelFactory.getDisplayNames(powerbi.axisStyle.members()),
                        yAxisPosition: viewModels.ViewModelFactory.getDisplayNames(powerbi.yAxisPosition.members()),
                        labelPosition: viewModels.ViewModelFactory.getDisplayNames(powerbi.labelPosition.members()),
                        labelDisplayUnits: viewModels.ViewModelFactory.getDisplayNames(getDisplayUnits()),
                    };
                }
                PropertyPaneViewModelFactory.getInputFieldsOptions = getInputFieldsOptions;
                function updateFieldOptionsOnModel(instance, propertyName, model) {
                    if (instance.validValues && instance.validValues.length > 0) {
                        if (propertyName === 'axisStyle') {
                            if (instance.objectName === 'valueAxis') {
                                model.inputFieldsOptions['valueAxisStyle'] = viewModels.ViewModelFactory.getDisplayNames(powerbi.axisStyle.members(instance.validValues));
                            }
                        }
                        if (propertyName === 'secAxisStyle') {
                            if (instance.objectName === 'valueAxis') {
                                model.inputFieldsOptions['secValueAxisStyle'] = viewModels.ViewModelFactory.getDisplayNames(powerbi.axisStyle.members(instance.validValues));
                            }
                        }
                        if (propertyName === 'axisStyle') {
                            if (instance.objectName === 'categoryAxis') {
                                model.inputFieldsOptions['categoryAxisStyle'] = viewModels.ViewModelFactory.getDisplayNames(powerbi.axisStyle.members(instance.validValues));
                            }
                        }
                    }
                }
                function getDisplayUnits() {
                    var count = powerbi.DefaultDisplayUnitSystem._units.length;
                    var list = [count];
                    for (var i = 0; i < count; i++) {
                        list[i] = { displayName: powerbi.DefaultDisplayUnitSystem._units[i].title, value: powerbi.DefaultDisplayUnitSystem._units[i].value };
                    }
                    return list;
                }
                function addFooterSlicesToCard(propertyPaneCard) {
                    propertyPaneCard.footer.push({
                        value: '',
                        name: 'revertToDefault',
                        displayName: '',
                        type: { revertToDefault: true },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                }
                function addIntermediateSlicesToCard(propertyPaneCard, propertyName) {
                    switch (propertyPaneCard.name) {
                        case 'dataPoint':
                            if (propertyName === 'defaultColor') {
                                propertyPaneCard.header.push({
                                    value: true,
                                    name: 'showAllDataPoints',
                                    displayName: viewModels.ViewModelFactory.getDisplayName(function (resources) { return resources.get('Visual_DataPoint_Show_All'); }),
                                    type: { bool: true },
                                    show: true,
                                    placeholder: '',
                                    isValid: true
                                });
                            }
                            break;
                        case 'gradient':
                            if (propertyName === 'diverging') {
                                propertyPaneCard.slices.push({
                                    value: '',
                                    name: 'gradientBar',
                                    displayName: 'gradientBar',
                                    type: { none: true },
                                    show: true,
                                    placeholder: '',
                                    isValid: true
                                });
                            }
                            break;
                    }
                }
                function isSliceBelongToHeader(propertyPaneCardName, propertyPaneSliceName) {
                    switch (propertyPaneCardName) {
                        case 'dataPoint':
                            if (propertyPaneSliceName === 'defaultColor') {
                                return true;
                            }
                    }
                }
                function getSlicePlaceholder(propertyPaneCardName, propertyName) {
                    switch (propertyPaneCardName) {
                        case 'categoryAxis':
                            switch (propertyName) {
                                case 'start':
                                case 'end':
                                    return viewModels.ViewModelFactory.getDisplayName(function (resources) { return resources.get('Visual_Card_Placeholder_Auto'); });
                            }
                            break;
                        case 'valueAxis':
                            switch (propertyName) {
                                case 'start':
                                case 'end':
                                case 'intersection':
                                case 'secStart':
                                case 'secEnd':
                                case 'secIntersection':
                                    return viewModels.ViewModelFactory.getDisplayName(function (resources) { return resources.get('Visual_Card_Placeholder_Auto'); });
                            }
                            break;
                        case 'dataPoint':
                            switch (propertyName) {
                                case 'minmum':
                                case 'maximum':
                                case 'center':
                                    return viewModels.ViewModelFactory.getDisplayName(function (resources) { return resources.get('Visual_Card_Placeholder_Auto'); });
                            }
                            break;
                    }
                    return '';
                }
                function gradientCardHandler(model, objectDefinitions) {
                    if (model) {
                        var fillRule = GradientUtils.getFillRule(objectDefinitions);
                        if (fillRule) {
                            var gradientCard = createGradientCard(model, fillRule);
                            model.cards.push(gradientCard);
                            addFooterSlicesToCard(gradientCard);
                        }
                    }
                }
                function createGradientCard(model, fillRule) {
                    var propertyPaneCard = model.cards.withName('gradient');
                    var gradientSettings = GradientUtils.getGradientSettings(fillRule);
                    if (!propertyPaneCard) {
                        propertyPaneCard = {
                            name: 'gradient',
                            displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient')) || 'Gradient',
                            header: [],
                            slices: [],
                            footer: [],
                            mainShow: null
                        };
                    }
                    propertyPaneCard.slices.push({
                        value: gradientSettings.diverging,
                        name: 'diverging',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_Diverging')) || 'Diverging',
                        type: { bool: true },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: '',
                        name: 'gradientBar',
                        displayName: 'gradientBar',
                        type: { none: true },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: gradientSettings.minColor,
                        name: 'minColor',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_MinColor')) || 'Minimum',
                        type: { fill: { solid: { color: true } } },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: gradientSettings.midColor,
                        name: 'midColor',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_MidColor')) || 'Center',
                        type: { fill: { solid: { color: true } } },
                        show: gradientSettings.diverging,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: gradientSettings.maxColor,
                        name: 'maxColor',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_MaxColor')) || 'Maximum',
                        type: { fill: { solid: { color: true } } },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: gradientSettings.minValue,
                        name: 'minValue',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_MinValue')) || 'Minimum',
                        type: { numeric: true },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: gradientSettings.midValue,
                        name: 'midValue',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_MidValue')) || 'Center',
                        type: { numeric: true },
                        show: gradientSettings.diverging,
                        placeholder: '',
                        isValid: true
                    });
                    propertyPaneCard.slices.push({
                        value: gradientSettings.maxValue,
                        name: 'maxValue',
                        displayName: viewModels.ViewModelFactory.getDisplayName(powerbi.data.createDisplayNameGetter('Visual_Gradient_MaxValue')) || 'Maximum',
                        type: { numeric: true },
                        show: true,
                        placeholder: '',
                        isValid: true
                    });
                    return propertyPaneCard;
                }
                function enumerateTitleObjectInstances(visualTitle) {
                    visualTitle = visualTitle || {};
                    return {
                        selector: null,
                        properties: {
                            text: visualTitle.text ? visualTitle.text : '',
                            show: visualTitle.show == null ? !explore.contracts.VisualTitle.isHidden(visualTitle) : visualTitle.show,
                            fontColor: visualTitle.fontColor ? visualTitle.fontColor : '#C8C8C8',
                            backgroundColor: visualTitle.background ? visualTitle.background : '#ffffff',
                            alignment: visualTitle.alignment ? visualTitle.alignment : 'left',
                        },
                        objectName: 'title',
                    };
                }
                function enumerateBackgroundObjectInstances(visualBackground) {
                    return {
                        selector: null,
                        properties: {
                            show: visualBackground ? visualBackground.show : powerbi.visuals.visualBackgroundHelper.getDefaultShow(),
                            color: visualBackground ? visualBackground.color : powerbi.visuals.visualBackgroundHelper.getDefaultColor(),
                            transparency: visualBackground ? visualBackground.transparency : powerbi.visuals.visualBackgroundHelper.getDefaultTransparency(),
                        },
                        objectName: 'background',
                    };
                }
                function isFillProperty(propertyType) {
                    var fill = propertyType.fill;
                    if (fill) {
                        return true;
                    }
                    return false;
                }
            })(PropertyPaneViewModelFactory = viewModels.PropertyPaneViewModelFactory || (viewModels.PropertyPaneViewModelFactory = {}));
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
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
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            (function (TaskPaneType) {
                TaskPaneType[TaskPaneType["Fields"] = 0] = "Fields";
                TaskPaneType[TaskPaneType["Filters"] = 1] = "Filters";
                TaskPaneType[TaskPaneType["Format"] = 2] = "Format";
            })(viewModels.TaskPaneType || (viewModels.TaskPaneType = {}));
            var TaskPaneType = viewModels.TaskPaneType;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var ApplyStyle = powerbi.common.models.ApplyStyle;
            var ArrayExtensions = jsCommon.ArrayExtensions;
            var filterGeneratorUtils = explore.services.filterGeneratorUtils;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var SQExprUtil = powerbi.data.SQExprUtil;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var Plugins = powerbi.visuals.plugins;
            var ViewModelFactory;
            (function (ViewModelFactory) {
                function createExplorationContainer() {
                    return {
                        exploration: null,
                        taskPane: createTaskPane(),
                        visualizationPane: createVisualizationPane(),
                        sectionStatus: {
                            currentSectionNumber: -1,
                            isEditing: false
                        },
                        isNavPaneCollapsed: true
                    };
                }
                ViewModelFactory.createExplorationContainer = createExplorationContainer;
                function convertSectionToViewModel(section) {
                    return {
                        contract: section,
                        selected: false,
                        displayName: section.displayName,
                    };
                }
                ViewModelFactory.convertSectionToViewModel = convertSectionToViewModel;
                function createTaskPane() {
                    return {
                        isPaneExpanded: true
                    };
                }
                ViewModelFactory.createTaskPane = createTaskPane;
                function createVisualizationPane() {
                    return {
                        sections: [],
                        activeSection: 0 /* Fields */,
                        isPaneExpanded: false,
                    };
                }
                ViewModelFactory.createVisualizationPane = createVisualizationPane;
                function createVisualTypesContainer(availableVisuals) {
                    return {
                        visuals: availableVisuals,
                    };
                }
                ViewModelFactory.createVisualTypesContainer = createVisualTypesContainer;
                function getAvailableVisuals(visualPlugins) {
                    for (var i = 0, len = visualPlugins.length; i < len; i++) {
                        var visualPlugin = visualPlugins[i];
                        switch (visualPlugin.name) {
                            case Plugins.table.name:
                                visualPlugin.class = 'table';
                                visualPlugin.title = 'Table_ToolTip';
                                break;
                            case Plugins.matrix.name:
                                visualPlugin.class = 'matrix';
                                visualPlugin.title = 'Matrix_ToolTip';
                                break;
                            case Plugins.scatterChart.name:
                                visualPlugin.class = 'scatterChart';
                                visualPlugin.title = 'ScatterChart_ToolTip';
                                break;
                            case Plugins.barChart.name:
                                visualPlugin.class = 'barChart';
                                visualPlugin.title = 'BarChart_ToolTip';
                                break;
                            case Plugins.clusteredBarChart.name:
                                visualPlugin.class = 'clusteredBarChart';
                                visualPlugin.title = 'ClusteredBarChart_ToolTip';
                                break;
                            case Plugins.hundredPercentStackedBarChart.name:
                                visualPlugin.class = 'hundredPercentStackedBarChart';
                                visualPlugin.title = 'HundredPercentStackedBarChart_ToolTip';
                                break;
                            case Plugins.columnChart.name:
                                visualPlugin.class = 'columnChart';
                                visualPlugin.title = 'ColumnChart_ToolTip';
                                break;
                            case Plugins.clusteredColumnChart.name:
                                visualPlugin.class = 'clusteredColumnChart';
                                visualPlugin.title = 'ClusteredColumnChart_ToolTip';
                                break;
                            case Plugins.dataDotClusteredColumnComboChart.name:
                                visualPlugin.class = 'dataDotClusteredColumnComboChart';
                                visualPlugin.title = 'DataDotClusteredColumnComboChart_ToolTip';
                                break;
                            case Plugins.dataDotStackedColumnComboChart.name:
                                visualPlugin.class = 'dataDotStackedColumnComboChart';
                                visualPlugin.title = 'DataDotStackedColumnComboChart_ToolTip';
                                break;
                            case Plugins.hundredPercentStackedColumnChart.name:
                                visualPlugin.class = 'hundredPercentStackedColumnChart';
                                visualPlugin.title = 'HundredPercentStackedColumnChart_ToolTip';
                                break;
                            case Plugins.lineChart.name:
                                visualPlugin.class = 'lineChart';
                                visualPlugin.title = 'LineChart_ToolTip';
                                break;
                            case Plugins.areaChart.name:
                                visualPlugin.class = 'areaChart';
                                visualPlugin.title = 'AreaChart_ToolTip';
                                break;
                            case Plugins.lineClusteredColumnComboChart.name:
                                visualPlugin.class = 'lineClusteredColumnComboChart';
                                visualPlugin.title = 'LineClusteredColumnComboChart_ToolTip';
                                break;
                            case Plugins.lineStackedColumnComboChart.name:
                                visualPlugin.class = 'lineStackedColumnComboChart';
                                visualPlugin.title = 'LineStackedColumnComboChart_ToolTip';
                                break;
                            case Plugins.pieChart.name:
                                visualPlugin.class = 'pieChart';
                                visualPlugin.title = 'PieChart_ToolTip';
                                break;
                            case Plugins.treemap.name:
                                visualPlugin.class = 'treemap';
                                visualPlugin.title = 'Treemap_ToolTip';
                                break;
                            case Plugins.map.name:
                                visualPlugin.class = 'map';
                                visualPlugin.title = 'Map_ToolTip';
                                break;
                            case Plugins.filledMap.name:
                                visualPlugin.class = 'filledMap';
                                visualPlugin.title = 'FilledMap_ToolTip';
                                break;
                            case Plugins.funnel.name:
                                visualPlugin.class = 'funnel';
                                visualPlugin.title = 'Funnel_ToolTip';
                                break;
                            case Plugins.gauge.name:
                                visualPlugin.class = 'gauge';
                                visualPlugin.title = 'Gauge_ToolTip';
                                break;
                            case Plugins.multiRowCard.name:
                                visualPlugin.class = 'multiRowCard';
                                visualPlugin.title = 'MultiRowCard_ToolTip';
                                break;
                            case Plugins.card.name:
                                visualPlugin.class = 'card';
                                visualPlugin.title = 'Card_ToolTip';
                                break;
                            case Plugins.waterfallChart.name:
                                visualPlugin.class = 'waterfallChart';
                                visualPlugin.title = 'WaterfallChart_ToolTip';
                                break;
                            case Plugins.slicer.name:
                                visualPlugin.class = 'slicer';
                                visualPlugin.title = 'Slicer_ToolTip';
                                break;
                            case Plugins.donutChart.name:
                                visualPlugin.class = 'donutChart';
                                visualPlugin.title = 'DonutChart_ToolTip';
                                break;
                        }
                    }
                    return visualPlugins;
                }
                ViewModelFactory.getAvailableVisuals = getAvailableVisuals;
                function setVisualContainerHost(section, visualContainer) {
                    visualContainer.hostServices = {
                        getFilters: function (visualPlugins) { return filterGeneratorUtils.calculateVisualContainerFilter(section, visualContainer.contract, visualPlugins); },
                        selectDataPoint: function (eventBridge, visualPlugins, args) {
                            VisualContainerUtils.clearDataSelection(eventBridge, visualContainer.contract);
                            filterGeneratorUtils.setFilterOnSelectData(eventBridge, visualPlugins, args, section, visualContainer.contract);
                        },
                        clearHighlight: function (eventBridge) {
                            filterGeneratorUtils.clearCrossHighlight(eventBridge, section, visualContainer.contract);
                        }
                    };
                }
                function convertExploration(contract, activeSectionIndex) {
                    debug.assertValue(contract, "contract");
                    var sections = _.map(contract.sections, convertSectionToViewModel);
                    var contractSections = contract.sections;
                    var exploreCanvas = undefined;
                    if (contractSections && contractSections.length > 0) {
                        var sectionIndex = activeSectionIndex !== undefined ? activeSectionIndex : 0;
                        if (sectionIndex < contractSections.length) {
                            exploreCanvas = convertSectionToExploreCanvas(contractSections[sectionIndex]);
                            for (var i = contractSections.length - 1; i >= 0; --i) {
                                sections[i].selected = i === sectionIndex;
                            }
                        }
                    }
                    return {
                        contract: contract,
                        sections: sections,
                        exploreCanvas: exploreCanvas
                    };
                }
                ViewModelFactory.convertExploration = convertExploration;
                function convertSectionToExploreCanvas(section) {
                    debug.assertValue(section, "section");
                    var model = new viewModels.ExploreCanvas(section);
                    model.width = 960;
                    model.height = 720;
                    if (section.visualContainers) {
                        model.visualContainers = ArrayExtensions.extendWithId(_.map(section.visualContainers, convertVisualContainerStandalone));
                        if (model.visualContainers) {
                            var visualContainers = model.visualContainers;
                            for (var i = 0, len = visualContainers.length; i < len; ++i)
                                setVisualContainerHost(section, visualContainers[i]);
                        }
                    }
                    return model;
                }
                ViewModelFactory.convertSectionToExploreCanvas = convertSectionToExploreCanvas;
                function convertVisualContainerStandalone(contract) {
                    debug.assertValue(contract, "contract");
                    var style = new ApplyStyle();
                    var position = contract.position;
                    style.position({
                        y: position.y,
                        x: position.x,
                    });
                    style.zIndex(contract.position.z || 0);
                    style.viewport({
                        height: position.height,
                        width: position.width,
                    });
                    return new viewModels.VisualContainer(contract, style);
                }
                ViewModelFactory.convertVisualContainerStandalone = convertVisualContainerStandalone;
                function convertVisualContainer(section, visualContainer) {
                    var model = convertVisualContainerStandalone(visualContainer);
                    setVisualContainerHost(section, model);
                    return model;
                }
                ViewModelFactory.convertVisualContainer = convertVisualContainer;
                function getDisplayNames(options) {
                    var result = [];
                    for (var i = 0, len = options.length; i < len; i++) {
                        var option = options[i];
                        result.push({
                            value: option.value,
                            displayName: viewModels.ViewModelFactory.getDisplayName(option.displayName),
                        });
                    }
                    return result;
                }
                ViewModelFactory.getDisplayNames = getDisplayNames;
                function getDisplayName(displayNameGetter) {
                    if (typeof displayNameGetter === 'function')
                        return displayNameGetter(powerbi.common.localize);
                    if (typeof displayNameGetter === 'string')
                        return displayNameGetter;
                }
                ViewModelFactory.getDisplayName = getDisplayName;
                function createFieldList() {
                    return {
                        schema: null,
                        isLoaded: false,
                    };
                }
                ViewModelFactory.createFieldList = createFieldList;
                function createFieldWell() {
                    return {
                        buckets: []
                    };
                }
                ViewModelFactory.createFieldWell = createFieldWell;
                function createFilterPane() {
                    return {
                        isVisualVisible: false,
                        pageFilters: [],
                        visualFilters: [],
                        activeFilterPane: undefined,
                        addFilterLabel: powerbi.common.localize.get('VisualizationPane_Watermark')
                    };
                }
                ViewModelFactory.createFilterPane = createFilterPane;
                function convertFilterContainer(contract, schema, displayNameService, scope) {
                    debug.assertValue(contract, "contract");
                    debug.assert(!!contract.field || !!contract.filter, "field or filter is required");
                    var model = new viewModels.FilterViewModel(contract, scope);
                    // Currently, filters can either be represented by an advanced filter card or they are Q&A passthrough (restatement only)
                    // In the future, we may want filter card plugins and evaluate each plugin by priority to see if it can handle the filter
                    var advFilterCard = convertAdvancedFilter(contract, model.formatter);
                    if (advFilterCard) {
                        if (!contract.field)
                            contract.field = advFilterCard.field;
                        var field = contract.field;
                        if (contract.type == null)
                            contract.type = explore.FilterUtils.getDefaultFilterType(field, schema);
                        model.displayName = displayNameService.getDisplayName(SQExprBuilder.fieldDef(field), schema);
                        model.advFilterCard = advFilterCard;
                        model.categoricalFilterCard = createCategoricalFilter(contract);
                    }
                    else {
                        contract.type = 3 /* Passthrough */;
                        model.restatement = contract.restatement;
                    }
                    model.updateFilterProperties(schema);
                    return model;
                }
                ViewModelFactory.convertFilterContainer = convertFilterContainer;
                function convertAdvancedFilter(contract, formatter) {
                    if (contract.filter) {
                        var filterItems = contract.filter.conditions();
                        debug.assert(filterItems.length === 1, 'There should be exactly 1 filter expression.');
                        var filterItem = filterItems[0];
                        if (filterItem)
                            return viewModels.FilterCardConverter.createAdvFilter(filterItem, formatter);
                    }
                    if (contract.field)
                        return new viewModels.AdvFilterCard(contract.field);
                }
                ViewModelFactory.convertAdvancedFilter = convertAdvancedFilter;
                function createCategoricalFilter(contract) {
                    return {
                        filter: contract.filter,
                        field: contract.field,
                        values: [],
                        allChecked: false,
                        isLoading: false,
                    };
                }
                ViewModelFactory.createCategoricalFilter = createCategoricalFilter;
                function createVisualFilters(scope, schema, displayNameService) {
                    debug.assertValue(scope.visualContainer, 'visualContainer');
                    debug.assertValue(schema, 'schema');
                    var visualContainer = scope.visualContainer;
                    var filterContainers = visualContainer.filters || [];
                    var filterPropertyExprs = [];
                    var result = [];
                    for (var i = 0, len = filterContainers.length; i < len; i++) {
                        var filterContainer = filterContainers[i];
                        var model = convertFilterContainer(filterContainer, schema, displayNameService, scope);
                        result.push(model);
                        if (filterContainer.field) {
                            var expr = SQExprBuilder.fieldDef(filterContainer.field);
                            filterPropertyExprs.push(expr);
                        }
                    }
                    var selectExprs = explore.util.VisualContainerUtils.getSelectExprs(visualContainer);
                    if (selectExprs) {
                        for (var i = 0, len = selectExprs.length; i < len; i++) {
                            var expr = selectExprs[i].expr;
                            if (SQExprUtil.indexOfExpr(filterPropertyExprs, expr) === -1) {
                                var contract = { field: expr.asFieldDef(), expanded: false, };
                                var model = convertFilterContainer(contract, schema, displayNameService, scope);
                                model.isAutoGenerated = true;
                                result.push(model);
                            }
                        }
                    }
                    result.sort(sortFilterByDisplayName);
                    return result;
                }
                ViewModelFactory.createVisualFilters = createVisualFilters;
                function createPageFilters(section, schema, displayNameService) {
                    var result = [];
                    if (section && section.filters) {
                        var filters = section.filters;
                        for (var i = 0, len = filters.length; i < len; i++) {
                            var model = viewModels.ViewModelFactory.convertFilterContainer(filters[i], schema, displayNameService, {
                                section: section,
                            });
                            result.push(model);
                        }
                        result.sort(sortFilterByDisplayName);
                    }
                    return result;
                }
                ViewModelFactory.createPageFilters = createPageFilters;
                function sortFilterByDisplayName(left, right) {
                    // Sort filters by displayName first, followed by restatement-only filters (without a displayName)
                    var leftGroup = left.displayName ? -1 : 1, rightGroup = right.displayName ? -1 : 1;
                    if (leftGroup !== rightGroup)
                        return leftGroup - rightGroup;
                    var leftKey = left.displayName || left.restatement || '', rightKey = right.displayName || right.restatement || '';
                    return leftKey.localeCompare(rightKey);
                }
            })(ViewModelFactory = viewModels.ViewModelFactory || (viewModels.ViewModelFactory = {}));
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            var VisualContainer = (function (_super) {
                __extends(VisualContainer, _super);
                function VisualContainer(contract, style) {
                    // do NOT copy values from contract to the model here... that must happen in ModelConverter
                    _super.call(this, contract, {
                        style: style,
                    });
                    this.uiScale = { x: 1, y: 1 };
                    this.availableVisuals = [];
                    this.toolbarVisible = false;
                }
                Object.defineProperty(VisualContainer.prototype, "id", {
                    get: function () {
                        return this.contract.id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualContainer.prototype, "position", {
                    /** Gets the position in screen pixels */
                    get: function () {
                        return this.convertToScaledPosition(this.contract.position);
                    },
                    /** Sets the position in screen pixels */
                    set: function (value) {
                        this.contract.position = this.convertFromScaledPosition(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualContainer.prototype, "rawPosition", {
                    /** Gets the raw contract position */
                    get: function () {
                        return this.contract.position;
                    },
                    /** Sets the raw contract position */
                    set: function (value) {
                        this.contract.position = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VisualContainer.prototype, "isPositioned", {
                    get: function () {
                        var pos = this.contract.position;
                        return pos.width !== 0 && pos.height !== 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                VisualContainer.prototype.setServices = function (visualHostServices, visualPlugin) {
                    debug.assertValue(visualHostServices, 'visualHostServices');
                    this.visualHostServices = visualHostServices;
                    this.visualPlugin = visualPlugin;
                };
                VisualContainer.prototype.setSelected = function (isSelected) {
                    this.isSelected = isSelected;
                };
                VisualContainer.prototype.setVisualStyle = function (style) {
                    this.visualStyle = style;
                };
                VisualContainer.prototype.visualSupportsConversion = function () {
                    var visualType = this.contract.config.singleVisual.visualType;
                    var visualCapabilities = this.visualPlugin && this.visualPlugin.capabilities(visualType);
                    return visualCapabilities && visualCapabilities.dataViewMappings != null;
                };
                VisualContainer.prototype.updateViewStateCore = function (state) {
                    var contract = this.contract;
                    var visualSpaceForEntry = 4;
                    var scaledPosition = this.overridePosition || this.convertToScaledPosition(contract.position, true);
                    // Calculate height offset for title and container header
                    var offsetHeight = (this.supportsTitle ? VisualContainer.VisualTitleHeight : 0) + VisualContainer.VisualContainerHeaderHeight;
                    var singleVisual = contract.config.singleVisual;
                    if (singleVisual) {
                        if (singleVisual.query) {
                            var semanticQuery = singleVisual.query.defn;
                            if (semanticQuery) {
                                var orderBy = semanticQuery.orderBy();
                                state.actualSortDirection = (orderBy && orderBy.length) ? orderBy[0].direction : undefined;
                            }
                            this.showWatermark = false;
                        }
                        else {
                            if (this.visualPlugin && VisualContainerUtils.isQueryVisual(this.contract.config.singleVisual.visualType, this.visualPlugin))
                                this.showWatermark = true;
                        }
                        if (state.visual) {
                            if (state.visual.type !== singleVisual.visualType) {
                                //Clear out data since the visual's type has changed and the old data (e.g. dataTransforms) might not apply anymore
                                state.visual.data = null;
                            }
                            state.visual.type = singleVisual.visualType;
                            var currentViewport = state.visual.viewport;
                            if (currentViewport.height !== (scaledPosition.height - offsetHeight) || currentViewport.width !== scaledPosition.width) {
                                state.visual.viewport = {
                                    height: scaledPosition.height - offsetHeight - visualSpaceForEntry,
                                    width: scaledPosition.width,
                                };
                            }
                        }
                        else if (this.visualHostServices) {
                            // NOTE: We do not initialize the IVisual until the IHostServices can be populated.
                            state.visual = {
                                viewport: { height: scaledPosition.height - offsetHeight - visualSpaceForEntry, width: scaledPosition.width },
                                type: singleVisual.visualType,
                                dataTransforms: {
                                    objects: singleVisual.objects,
                                },
                                hostServices: this.visualHostServices,
                                interactivityOptions: {
                                    dragDataPoint: false,
                                    selection: true,
                                },
                                visualStyle: this.visualStyle,
                                allowInvalidDataView: true,
                                visualPlugin: this.visualPlugin,
                                animateOnDataChanged: this.animateOnDataChanged,
                            };
                        }
                    }
                    state.style.position({ x: scaledPosition.x, y: scaledPosition.y });
                    state.style.viewport({ width: scaledPosition.width, height: scaledPosition.height });
                    state.style.zIndex(contract.position.z || 0);
                    state.style.apply();
                    this.availableVisuals = this.visualPlugin ? this.visualPlugin.getVisuals() : [];
                    this.supportsConversion = this.visualSupportsConversion();
                };
                VisualContainer.prototype.convertToScaledPosition = function (position, roundToNearestPixel) {
                    var uiScale = this.uiScale;
                    // Since Z is optional, we need to make sure this conversion is not lossy
                    var z = position.z === undefined ? this.contract.position.z : position.z;
                    var scaledPosition = {
                        x: position.x * uiScale.x,
                        y: position.y * uiScale.y,
                        z: z,
                        width: position.width * uiScale.x,
                        height: position.height * uiScale.y
                    };
                    // rounding logic should only be used when outputting to DOM
                    if (roundToNearestPixel === true) {
                        return {
                            x: Math.round(scaledPosition.x),
                            y: Math.round(scaledPosition.y),
                            z: scaledPosition.z,
                            width: Math.round(scaledPosition.width),
                            height: Math.round(scaledPosition.height)
                        };
                    }
                    return scaledPosition;
                };
                VisualContainer.prototype.convertFromScaledPosition = function (scaledPosition) {
                    var uiScale = this.uiScale;
                    // Since Z is optional, we need to make sure this conversion is not lossy
                    var z = scaledPosition.z === undefined ? this.contract.position.z : scaledPosition.z;
                    var position = {
                        x: scaledPosition.x / uiScale.x,
                        y: scaledPosition.y / uiScale.y,
                        z: z,
                        width: scaledPosition.width / uiScale.x,
                        height: scaledPosition.height / uiScale.y
                    };
                    return position;
                };
                // This value should be the same as what we have in ExploreUI/styles/canvas.less
                VisualContainer.VisualTitleHeight = 24;
                VisualContainer.VisualContainerHeaderHeight = 16;
                return VisualContainer;
            })(viewModels.ViewModel);
            viewModels.VisualContainer = VisualContainer;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var viewModels;
        (function (viewModels) {
            (function (VisualizationPaneSectionType) {
                VisualizationPaneSectionType[VisualizationPaneSectionType["Fields"] = 0] = "Fields";
                VisualizationPaneSectionType[VisualizationPaneSectionType["Format"] = 1] = "Format";
            })(viewModels.VisualizationPaneSectionType || (viewModels.VisualizationPaneSectionType = {}));
            var VisualizationPaneSectionType = viewModels.VisualizationPaneSectionType;
        })(viewModels = explore.viewModels || (explore.viewModels = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            var DOMConstants = jsCommon.DOMConstants;
            var selectionUtils = explore.services.selectionUtils;
            function createCanvasKeyHandlerService(clipboardService, selectionService, explorationSerializer, viewModeState, undoRedoService, visualAuthoring) {
                return new CanvasKeyHandlerService(clipboardService, selectionService, explorationSerializer, viewModeState, undoRedoService, visualAuthoring);
            }
            services.createCanvasKeyHandlerService = createCanvasKeyHandlerService;
            var CanvasKeyHandlerService = (function () {
                function CanvasKeyHandlerService(clipboardService, selectionService, explorationSerializer, viewModeState, undoRedoService, visualAuthoring) {
                    debug.assertValue(clipboardService, 'clipboardService');
                    debug.assertValue(selectionService, 'selectionService');
                    debug.assertValue(explorationSerializer, 'explorationSerializer');
                    debug.assertValue(viewModeState, 'viewModeState');
                    debug.assertValue(undoRedoService, 'undoRedoService');
                    debug.assertValue(visualAuthoring, 'visualAuthoring');
                    this.clipboardService = clipboardService;
                    this.selectionService = selectionService;
                    this.explorationSerializer = explorationSerializer;
                    this.viewModeState = viewModeState;
                    this.undoRedoService = undoRedoService;
                    this.visualAuthoring = visualAuthoring;
                }
                CanvasKeyHandlerService.prototype.onKeyDown = function (eventObj, viewModel) {
                    var which = eventObj.which;
                    var ctrlKey = eventObj.ctrlKey;
                    if (which === DOMConstants.escKeyCode) {
                        this.onClearSelection(eventObj);
                        return this.preventStopAndReturnFalse(eventObj);
                    }
                    if (this.viewModeState.viewMode === 0 /* View */)
                        return;
                    if (which === DOMConstants.deleteKeyCode) {
                        this.onDelete(eventObj, viewModel);
                        return this.preventStopAndReturnFalse(eventObj);
                    }
                    if (ctrlKey) {
                        switch (which) {
                            case DOMConstants.aKeyCode:
                                this.onSelectAll(eventObj, viewModel);
                                return this.preventStopAndReturnFalse(eventObj);
                            case DOMConstants.cKeyCode:
                                this.onCopy(eventObj);
                                return this.preventStopAndReturnFalse(eventObj);
                            case DOMConstants.xKeyCode:
                                this.onCut(eventObj);
                                return this.preventStopAndReturnFalse(eventObj);
                            case DOMConstants.vKeyCode:
                                this.onPaste(eventObj);
                                return this.preventStopAndReturnFalse(eventObj);
                            case DOMConstants.yKeyCode:
                                this.onRedo();
                                return this.preventStopAndReturnFalse(eventObj);
                            case DOMConstants.zKeyCode:
                                this.onUndo();
                                return this.preventStopAndReturnFalse(eventObj);
                        }
                    }
                };
                CanvasKeyHandlerService.prototype.preventStopAndReturnFalse = function (eventObj) {
                    if (eventObj.originalEvent) {
                        eventObj.originalEvent.preventDefault();
                        eventObj.originalEvent.stopPropagation();
                    }
                    return false;
                };
                CanvasKeyHandlerService.prototype.onUndo = function () {
                    this.undoRedoService.undo();
                };
                CanvasKeyHandlerService.prototype.onRedo = function () {
                    this.undoRedoService.redo();
                };
                CanvasKeyHandlerService.prototype.onCopy = function (eventObj) {
                    this.clipboardService.copy();
                };
                CanvasKeyHandlerService.prototype.onCut = function (eventObj) {
                    this.clipboardService.cut();
                };
                CanvasKeyHandlerService.prototype.onPaste = function (eventObj) {
                    this.clipboardService.paste();
                };
                CanvasKeyHandlerService.prototype.onDelete = function (eventObj, viewModel) {
                    var _this = this;
                    this.undoRedoService.register(function () {
                        _this.visualAuthoring.deleteSelectedVisuals(viewModel);
                    });
                };
                CanvasKeyHandlerService.prototype.onClearSelection = function (eventObj) {
                    this.selectionService.clearSelection();
                };
                CanvasKeyHandlerService.prototype.onSelectAll = function (eventObj, viewModel) {
                    // Select all visuals on slide
                    var visualContainers = _.map(viewModel.visualContainers, function (visual) { return visual.contract; });
                    selectionUtils.selectVisualContainers(visualContainers, this.selectionService);
                };
                return CanvasKeyHandlerService;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var exploreui;
    (function (exploreui) {
        var services;
        (function (services) {
            var ColorTheme = (function () {
                function ColorTheme() {
                }
                return ColorTheme;
            })();
            services.ColorTheme = ColorTheme;
            function createColorPickerService() {
                return new ColorPickerService();
            }
            services.createColorPickerService = createColorPickerService;
            var ColorPickerService = (function () {
                function ColorPickerService() {
                    this.themesCount = 10;
                    this.dataColors = new powerbi.visuals.DataColorPalette();
                }
                ColorPickerService.prototype.getRecentColors = function () {
                    if (!this.recentColors) {
                        this.recentColors = new Array(this.themesCount);
                        for (var i = 0, len = this.recentColors.length; i < len; ++i) {
                            this.recentColors[i] = this.dataColors.getColor(i).value;
                        }
                    }
                    return this.recentColors;
                };
                ColorPickerService.prototype.getThemes = function () {
                    if (!this.themes) {
                        this.themes = new Array(this.themesCount);
                        var colorIndex = 0;
                        for (var i = 0; i < this.themes.length; ++i) {
                            var theme = this.themes[i] = new ColorTheme();
                            theme.parentColor = this.dataColors.getColor(colorIndex).value;
                            colorIndex++;
                            theme.children = new Array(5);
                            for (var j = 0, len = theme.children.length; j < len; ++j) {
                                theme.children[j] = this.dataColors.getColor(colorIndex).value;
                                colorIndex++;
                            }
                        }
                    }
                    return this.themes;
                };
                ColorPickerService.prototype.enqueueRecentColor = function (color) {
                    this.recentColors.unshift(color);
                    this.recentColors.pop();
                    return this.recentColors;
                };
                ColorPickerService.prototype.setCurrentInstance = function (currentScope) {
                    if (this.currentScope) {
                        this.currentScope.isPickerOpen = false;
                        this.currentScope.isWheelOpen = false;
                    }
                    this.currentScope = currentScope.isPickerOpen ? currentScope : null;
                };
                return ColorPickerService;
            })();
        })(services = exploreui.services || (exploreui.services = {}));
    })(exploreui = powerbi.exploreui || (powerbi.exploreui = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            function createLayoutInsertionHelper() {
                var targetSpaceMinWidth = 250;
                var targetSpaceMinHeight = 250;
                var targetSpaceMaxAspectRatio = 5 / 2;
                var targetSpaceMinAspectRatio = 3 / 4;
                return new LayoutInsertionHelper(targetSpaceMinWidth, targetSpaceMinHeight, targetSpaceMaxAspectRatio, targetSpaceMinAspectRatio);
            }
            services.createLayoutInsertionHelper = createLayoutInsertionHelper;
            var LayoutInsertionHelper = (function () {
                function LayoutInsertionHelper(emptySpaceMinWidth, emptySpaceMinHeight, emptySpaceMaxAspectRatio, emptySpaceMinAspectRatio) {
                    this.emptySpaceMinWidth = emptySpaceMinWidth;
                    this.emptySpaceMinHeight = emptySpaceMinHeight;
                    this.emptySpaceMaxAspectRatio = emptySpaceMaxAspectRatio;
                    this.emptySpaceMinAspectRatio = emptySpaceMinAspectRatio;
                }
                LayoutInsertionHelper.prototype.getEmptySpaces = function (parentRectangle, childRectangles) {
                    // get all inverse intersection areas in the canvas - these are block aligned horizontal empty spaces
                    var inverseRects = this.getNonOverlapingRects(parentRectangle, childRectangles);
                    // filter out spaces which don't meet the desired minimum width
                    var filteredSpaces = this.filterWithMinimumWidth(inverseRects);
                    var targetSpaces = [];
                    for (var i = 0; i < filteredSpaces.length; i++) {
                        var rect = filteredSpaces[i];
                        var extendedRect = this.extendRect(rect, inverseRects);
                        if (extendedRect.height >= this.emptySpaceMinHeight) {
                            var aspectRatio = extendedRect.width / extendedRect.height;
                            if (aspectRatio >= this.emptySpaceMinAspectRatio && aspectRatio <= this.emptySpaceMaxAspectRatio)
                                targetSpaces.push(extendedRect);
                        }
                    }
                    return targetSpaces;
                };
                /** Extends the provided rectangle vertically until a filled region is hit */
                LayoutInsertionHelper.prototype.extendRect = function (targetRect, inverseRects) {
                    var canExtend = false;
                    var extendedRect;
                    for (var i = 0; i < inverseRects.length; i++) {
                        var invRect = inverseRects[i];
                        if (invRect === targetRect)
                            continue;
                        var isVerticalTopAdjacent = false;
                        var isVerticalBottomAdjacent = false;
                        if (this.doIntersect(invRect, targetRect)) {
                            isVerticalTopAdjacent = (invRect.y + invRect.height) === targetRect.y;
                            isVerticalBottomAdjacent = invRect.y === targetRect.y + targetRect.height;
                        }
                        // optimization: discard adjacent rectangles that aren't as least as wide as the target
                        if (invRect.width < targetRect.width)
                            continue;
                        // rectangle is below target and at least as wide
                        if (isVerticalBottomAdjacent) {
                            var testRect = { x: targetRect.x, y: targetRect.y, width: targetRect.width, height: targetRect.height + invRect.height };
                            var intersection = this.getIntersectingRectangle(testRect, invRect);
                            if (intersection && intersection.width === testRect.width) {
                                canExtend = true;
                                extendedRect = testRect;
                            }
                        }
                        else if (isVerticalTopAdjacent) {
                            var testRect = { x: targetRect.x, y: invRect.y, width: targetRect.width, height: targetRect.height + invRect.height };
                            var intersection = this.getIntersectingRectangle(testRect, invRect);
                            if (intersection && intersection.width === testRect.width) {
                                canExtend = true;
                                extendedRect = testRect;
                            }
                        }
                    }
                    if (canExtend)
                        return this.extendRect(extendedRect, inverseRects);
                    return targetRect;
                };
                /** Computes the intersecting area for two rectangles. Returns null if there isn't one. */
                LayoutInsertionHelper.prototype.getIntersectingRectangle = function (rectA, rectB) {
                    var x0 = Math.max(rectA.x, rectB.x);
                    var x1 = Math.min(rectA.x + rectA.width, rectB.x + rectB.width);
                    var y0 = Math.max(rectA.y, rectB.y);
                    var y1 = Math.min(rectA.y + rectA.height, rectB.y + rectB.height);
                    if (x0 <= x1 && y0 <= y1) {
                        return {
                            x: x0,
                            y: y0,
                            width: x1 - x0,
                            height: y1 - y0
                        };
                    }
                    return null;
                };
                /** determines if two rectangles intersect */
                LayoutInsertionHelper.prototype.doIntersect = function (rectA, rectB) {
                    return !(rectB.x > rectA.x + rectA.width || rectB.x + rectB.width < rectA.x || rectB.y > rectA.y + rectA.height || rectB.y + rectB.height < rectA.y);
                };
                /** Filter to only rectangles that have an area */
                LayoutInsertionHelper.prototype.filterWithArea = function (rectangles) {
                    for (var output = [], i = 0; i < rectangles.length; i++) {
                        if (rectangles[i].width > 0 && rectangles[i].height > 0) {
                            output.push(rectangles[i]);
                        }
                    }
                    return output;
                };
                /** Filter to only rectangles that meet our minimum width criteria */
                LayoutInsertionHelper.prototype.filterWithMinimumWidth = function (rectangles) {
                    for (var output = [], i = 0; i < rectangles.length; i++) {
                        if (rectangles[i].width >= this.emptySpaceMinWidth) {
                            output.push(rectangles[i]);
                        }
                    }
                    return output;
                };
                /* If there is an intersection between the child and parent rectangle, return all surrounding rectangles that contain an area.
                   If there is no intersection, return an array containing only the child. */
                LayoutInsertionHelper.prototype.splitRectangleOnIntersection = function (parent, child) {
                    var intersection = this.getIntersectingRectangle(parent, child);
                    if (!intersection) {
                        return [parent];
                    }
                    // There will be up to 4 rectangles surrounding this box.
                    // Only include ones with an area, since empty ones won't create any future intersections.
                    return this.filterWithArea([
                        {
                            x: parent.x,
                            y: parent.y,
                            width: parent.width,
                            height: intersection.y - parent.y
                        },
                        {
                            x: parent.x,
                            y: intersection.y + intersection.height,
                            width: parent.width,
                            height: (parent.y + parent.height) - (intersection.y + intersection.height)
                        },
                        {
                            x: parent.x,
                            y: intersection.y,
                            width: intersection.x - parent.x,
                            height: intersection.height
                        },
                        {
                            x: intersection.x + intersection.width,
                            y: intersection.y,
                            width: (parent.x + parent.width) - (intersection.x + intersection.width),
                            height: intersection.height
                        }
                    ]);
                };
                /** Takes a parent rectangle and an array of child rectangles and returns an array
                    of non-overlapping rectangles that cover the inverse of the original set */
                LayoutInsertionHelper.prototype.getNonOverlapingRects = function (parentRectangle, childRectangles) {
                    if (!childRectangles.length) {
                        return [];
                    }
                    var outputRectangles = [parentRectangle];
                    for (var i = 0; i < childRectangles.length; i++) {
                        for (var j = 0, newRectangles = []; j < outputRectangles.length; j++) {
                            newRectangles = newRectangles.concat(this.splitRectangleOnIntersection(outputRectangles[j], childRectangles[i]));
                        }
                        outputRectangles = newRectangles;
                    }
                    return outputRectangles;
                };
                return LayoutInsertionHelper;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            function createModelChangeHandler(conceptualSchemaProxy, dataProxy, $scope, eventBridge, undoRedoService) {
                return new ModelChangeHandler(conceptualSchemaProxy, dataProxy, $scope, eventBridge, undoRedoService);
            }
            services.createModelChangeHandler = createModelChangeHandler;
            var ModelChangeHandler = (function () {
                function ModelChangeHandler(conceptualSchemaProxy, dataProxy, $scope, eventBridge, undoRedoService) {
                    var _this = this;
                    debug.assertValue(conceptualSchemaProxy, 'conceptualSchemaProxy');
                    debug.assertValue(dataProxy, 'dataProxy');
                    debug.assertValue(eventBridge, 'eventBridge');
                    this.dataProxy = dataProxy;
                    this.eventBridge = eventBridge;
                    this.undoRedoService = undoRedoService;
                    this.conceptualSchemaProxy = conceptualSchemaProxy;
                    var subscriptionManager = eventBridge.createChannelSubscriptionManager().subscribe(services.events.explorationLoaded, function (e, contract) { return _this.currentExplorationContract = contract; });
                    $scope.$on('$destroy', function () { return subscriptionManager.unsubscribeAll(); });
                }
                ModelChangeHandler.prototype.applyChange = function (change, providerType) {
                    var _this = this;
                    if (providerType === void 0) { providerType = 'dsr'; }
                    var conceptualSchemaProxy = this.conceptualSchemaProxy;
                    var dataProxy = this.dataProxy;
                    conceptualSchemaProxy.stopCommunication(services.events.modelChanged.name);
                    conceptualSchemaProxy.clearCache();
                    dataProxy.stopCommunication(providerType);
                    change.then(function (result) {
                        if (!result.isSchemaChangeListComplete)
                            dataProxy.clearCache(providerType);
                        var changes;
                        if (result && (changes = result.changes) && !_.isEmpty(changes)) {
                            if (result.isSchemaChangeListComplete && providerType === 'dsr')
                                powerbi.data.dsr.createQueryCacheHandler().apply(dataProxy, changes);
                            var currentExplorationContract = _this.currentExplorationContract;
                            if (currentExplorationContract)
                                services.createSchemaChangeHandler().apply(currentExplorationContract, changes);
                        }
                        _this.resumeCommunication(providerType);
                        _this.undoRedoService.clear();
                        var eventBridge = _this.eventBridge;
                        eventBridge.publishToChannel(services.events.enableEditing);
                        eventBridge.publishToChannel(services.events.modelChanged, result);
                        eventBridge.publishToChannel(services.events.visualContainerChanged, {
                            affectContainer: function () { return true; }
                        });
                    }, function () { return _this.resumeCommunication(providerType); });
                };
                /**
                 * Resume communication that was stopped in applyChanges
                 */
                ModelChangeHandler.prototype.resumeCommunication = function (providerType) {
                    this.conceptualSchemaProxy.resumeCommunication();
                    this.dataProxy.resumeCommunication(providerType);
                };
                return ModelChangeHandler;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            function createModelAuthoringService() {
                return new ModelAuthoringService();
            }
            services.createModelAuthoringService = createModelAuthoringService;
            var ModelAuthoringService = (function () {
                function ModelAuthoringService() {
                }
                ModelAuthoringService.prototype.apply = function (change) {
                    // Model authoring is not available in the web service
                    debug.assertFail("No model authoring available");
                };
                return ModelAuthoringService;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            var VisualContainerUtils = explore.util.VisualContainerUtils;
            function createPinVisualService(conceptualSchemaProxy, displayNameService, singleExecutableDataProxy, visualQueryGenerator, visualPlugin) {
                return new PinVisualService(conceptualSchemaProxy, displayNameService, singleExecutableDataProxy, visualQueryGenerator, visualPlugin);
            }
            services.createPinVisualService = createPinVisualService;
            var PinVisualService = (function () {
                function PinVisualService(conceptualSchemaProxy, displayNameService, singleExecutableDataProxy, visualQueryGenerator, visualPlugin) {
                    debug.assertValue(conceptualSchemaProxy, 'conceptualSchemaProxy');
                    debug.assertValue(displayNameService, 'displayNameService');
                    debug.assertValue(singleExecutableDataProxy, 'singleExecutableDataProxy');
                    debug.assertValue(visualQueryGenerator, 'visualQueryGenerator');
                    debug.assertValue(visualPlugin, 'visualPlugin');
                    this.conceptualSchemaProxy = conceptualSchemaProxy;
                    this.dataProxy = singleExecutableDataProxy;
                    this.displayNameService = displayNameService;
                    this.visualQueryGenerator = visualQueryGenerator;
                    this.visualPlugin = visualPlugin;
                }
                PinVisualService.prototype.pinVisualContainer = function (dataSources, visualContainer, visualType, filters) {
                    var _this = this;
                    var handler = this.handler;
                    debug.assertValue(handler, 'Pin visual handler is not set');
                    this.conceptualSchemaProxy.get(dataSources).then(function (schema) {
                        var singleVisualContract = visualContainer.config.singleVisual, generatedQuery = _this.visualQueryGenerator.execute({
                            visualContainer: visualContainer,
                            dataSources: dataSources,
                            schema: schema,
                            additionalFilters: filters,
                        });
                        if (generatedQuery) {
                            // Rerun the query in case it's changed, but expect a cache hit.
                            _this.dataProxy.execute(generatedQuery.options).then(function (result) {
                                var command = generatedQuery.options.query.command, pinMetadata = VisualContainerUtils.describeForPinning(_this.displayNameService, schema, singleVisualContract.query, _this.visualPlugin.capabilities(visualType).dataViewMappings);
                                var pinData = {
                                    binding: command.Binding,
                                    query: command.Query,
                                    dataViewSource: result.dataViewSource,
                                    visualType: visualType,
                                    queryMetadata: pinMetadata.queryMetadata,
                                    elements: pinMetadata.visualElements,
                                    objects: singleVisualContract.objects,
                                };
                                if (handler)
                                    handler.pinVisual(pinData);
                            }, function () {
                                // TODO: add pin failed notification
                            });
                        }
                        else {
                            var pinData = {
                                visualType: visualType,
                                objects: singleVisualContract.objects,
                                dataViewSource: {
                                    data: undefined
                                }
                            };
                            if (handler)
                                handler.pinVisual(pinData);
                        }
                    });
                };
                PinVisualService.prototype.canPinVisualType = function (visualType) {
                    return visualType != null && this.visualPlugin.getPlugin(visualType) != null && visualType !== powerbi.visuals.plugins.slicer.name;
                };
                PinVisualService.prototype.setHandler = function (handler) {
                    this.handler = handler;
                };
                return PinVisualService;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            function createShellService() {
                return new ShellService();
            }
            services.createShellService = createShellService;
            var ShellService = (function () {
                function ShellService() {
                }
                ShellService.prototype.canConvertVisualTo = function (visualType) {
                    // Shell Service is not available in the web service
                    debug.assertFail("No shell service available");
                    return false;
                };
                ShellService.prototype.convertVisualTo = function (visualType) {
                    // Shell Service is not available in the web service
                    debug.assertFail("No shell service available");
                };
                ShellService.prototype.canShowHiddenSchemaItem = function () {
                    return false;
                };
                ShellService.prototype.setShowHiddenSchemaItem = function (showhidden) {
                };
                return ShellService;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            var ArrayExtensions = jsCommon.ArrayExtensions;
            var clusteredColumnChart = powerbi.visuals.plugins.clusteredColumnChart;
            var FieldKind = powerbi.data.FieldKind;
            var map = powerbi.visuals.plugins.map;
            var selectionUtils = explore.services.selectionUtils;
            var SQExpr = powerbi.data.SQExpr;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            var table = powerbi.visuals.plugins.table;
            var VisualContainerUtils = powerbi.explore.util.VisualContainerUtils;
            function createVisualAuthoring(visualPluginService, conceptualSchemaProxy, telemetryService, sectionNavigationService, selectionService, geotaggingAnalyserService, explorationSerializer, eventBridge, promiseFactory, undoRedoService) {
                return new VisualAuthoring(visualPluginService, conceptualSchemaProxy, telemetryService, sectionNavigationService, selectionService, geotaggingAnalyserService, explorationSerializer, eventBridge, promiseFactory, undoRedoService);
            }
            services.createVisualAuthoring = createVisualAuthoring;
            //exported for testability
            function getVisualDefaultType(expr, model, geoTaggingAnalyzerService) {
                var exprMetaData = expr.getMetadata(model);
                if (exprMetaData.type.geography)
                    return map.name;
                if (exprMetaData.kind === 1 /* Measure */ || exprMetaData.type.numeric)
                    return clusteredColumnChart.name;
                var fieldDef = expr.asFieldDef();
                if (fieldDef && fieldDef.column) {
                    if (geoTaggingAnalyzerService && geoTaggingAnalyzerService.isGeographic(fieldDef.column))
                        return map.name;
                }
                return table.name;
            }
            services.getVisualDefaultType = getVisualDefaultType;
            /** Encapsulates high-level operations for authoring visuals. */
            var VisualAuthoring = (function () {
                function VisualAuthoring(visualPluginService, conceptualSchemaProxy, telemetryService, sectionNavigationService, selectionService, geotaggingAnalyserService, explorationSerializer, eventBridge, promiseFactory, undoRedoService) {
                    this.core = services.createVisualAuthoringCore(visualPluginService);
                    this.schemaProxy = conceptualSchemaProxy;
                    this.telemetry = telemetryService;
                    this.sectionNavigationService = sectionNavigationService;
                    this.selectionService = selectionService;
                    this.geotaggingAnalyzerService = geotaggingAnalyserService;
                    this.explorationSerializer = explorationSerializer;
                    this.eventBridge = eventBridge;
                    this.promiseFactory = promiseFactory;
                    this.visualPluginService = visualPluginService;
                    this.undoRedoService = undoRedoService;
                }
                VisualAuthoring.prototype.addFieldToVisual = function (expr, dataSources, visualContainer) {
                    var _this = this;
                    if (!visualContainer)
                        return this.promiseFactory.reject();
                    return this.undoRedoService.register(function () {
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            expr = SQExprBuilder.createExprWithAggregate(expr, schema, false);
                            var addColumnOptions = {
                                expr: expr,
                                schema: schema
                            };
                            if (_this.core.add(addColumnOptions, visualContainer.config)) {
                                _this.raiseVisualContainerChanged(visualContainer);
                                return _this.promiseFactory.resolve();
                            }
                            return _this.promiseFactory.reject();
                        });
                    });
                };
                VisualAuthoring.prototype.addFieldInRole = function (expr, roleName, dataSources, visual, index) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        var role = _this.getVisualDataRole(visual, roleName);
                        if (!role)
                            return _this.promiseFactory.reject();
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            if (role.kind === 1 /* Measure */)
                                expr = SQExprBuilder.createExprWithAggregate(expr, schema, true);
                            var addExprOptions = {
                                expr: expr,
                                schema: schema,
                                targetRole: roleName,
                                targetIndex: index
                            };
                            if (_this.core.add(addExprOptions, visual.config)) {
                                _this.raiseVisualContainerChanged(visual);
                                return _this.promiseFactory.resolve();
                            }
                            return _this.promiseFactory.reject();
                        });
                    });
                };
                VisualAuthoring.prototype.removeField = function (expr) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        return _this.removeFieldImpl(expr);
                    });
                };
                VisualAuthoring.prototype.removeProjection = function (role, index) {
                    var _this = this;
                    // Can only remove from one visual at a time.
                    return this.undoRedoService.register(function () {
                        if (selectionUtils.getSelectedVisual(_this.selectionService))
                            return _this.invokeRemoveOnSelectedVisuals({ role: role, index: index });
                        return false;
                    });
                };
                VisualAuthoring.prototype.removeInvalidExpressions = function (config, dataSources) {
                    var _this = this;
                    debug.assertValue(config, 'config');
                    debug.assertValue(dataSources, 'dataSources');
                    var singleVisual = config.singleVisual;
                    var resolvedPromise = this.promiseFactory.resolve();
                    if (!singleVisual || !singleVisual.query)
                        return this.promiseFactory.reject();
                    return this.undoRedoService.register(function () {
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            var selects = singleVisual.query.defn.select();
                            var invalidExprs = [];
                            for (var i = 0, len = selects.length; i < len; i++) {
                                var expr = selects[i].expr;
                                if (!_.isEmpty(expr.validate(schema)))
                                    invalidExprs.push(expr);
                            }
                            for (i = 0, len = invalidExprs.length; i < len; i++) {
                                _this.removeFiltersWithExpr(invalidExprs[i]);
                                _this.removeFieldImpl(invalidExprs[i]);
                            }
                            return resolvedPromise;
                        });
                    });
                };
                VisualAuthoring.prototype.moveProjection = function (sourceRole, targetRole, sourceIndex, targetIndex, dataSources) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            var selectedVisual = selectionUtils.getSelectedVisual(_this.selectionService);
                            if (!selectedVisual)
                                return _this.promiseFactory.reject();
                            var options = {
                                sourceRole: sourceRole,
                                targetRole: targetRole,
                                sourceIndex: sourceIndex,
                                targetIndex: targetIndex,
                                schema: schema
                            };
                            if (_this.core.move(options, selectedVisual.config)) {
                                _this.raiseVisualContainerChanged(selectedVisual);
                                return _this.promiseFactory.resolve();
                            }
                            return _this.promiseFactory.reject();
                        });
                    });
                };
                VisualAuthoring.prototype.setAggregate = function (role, index, newAggregate, target, dataSources) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            if (target.config.singleVisual.query.setAggregate(role, index, newAggregate, schema)) {
                                _this.raiseVisualContainerChanged(target);
                                return _this.promiseFactory.resolve();
                            }
                            return _this.promiseFactory.reject();
                        });
                    });
                };
                VisualAuthoring.prototype.removeAggregate = function (role, index, target, dataSources) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            if (target.config.singleVisual.query.removeAggregate(role, index, schema)) {
                                _this.raiseVisualContainerChanged(target);
                                return _this.promiseFactory.resolve();
                            }
                            return _this.promiseFactory.reject();
                        });
                    });
                };
                VisualAuthoring.prototype.createVisualContainerConfig = function (configOptions) {
                    var _this = this;
                    return this.schemaProxy.get(configOptions.dataSources).then(function (schema) {
                        var expr = configOptions.expr;
                        var exprIsArray = expr instanceof Array;
                        if (configOptions.allowAggregate) {
                            if (exprIsArray) {
                                var sqExprArr = expr;
                                for (var i = 0; i < sqExprArr.length; ++i)
                                    sqExprArr[i] = SQExprBuilder.createExprWithAggregate(expr[i], schema, false);
                            }
                            else
                                expr = SQExprBuilder.createExprWithAggregate(expr, schema, false);
                        }
                        var firstExpr = exprIsArray ? expr[0] : expr;
                        var visualType = services.getVisualDefaultType(firstExpr, schema, _this.geotaggingAnalyzerService);
                        var options = {
                            expr: expr,
                            schema: schema,
                            visualType: visualType
                        };
                        return _this.core.create(options);
                    });
                };
                VisualAuthoring.prototype.addVisualContainerImage = function (exploreCanvas, imageData, width, height, position) {
                    if (!position) {
                        position = VisualAuthoring.getDefaultVisualContainerPosition();
                    }
                    var visualContainer = {
                        config: {
                            singleVisual: { visualType: "image", objects: { general: [{ properties: { imageUrl: SQExprBuilder.text("data:image/png;base64," + imageData) } }] } },
                        },
                        position: position
                    };
                    exploreCanvas.contract.visualContainers.push(visualContainer);
                    var viewModel = explore.viewModels.ViewModelFactory.convertVisualContainer(exploreCanvas.contract, visualContainer);
                    exploreCanvas.visualContainers.push(viewModel);
                    selectionUtils.selectVisualContainer(visualContainer, this.selectionService);
                };
                VisualAuthoring.prototype.addVisualContainerTextbox = function (exploreCanvas, position) {
                    return this.addEmptyVisualContainer(exploreCanvas, 'textbox', position);
                };
                VisualAuthoring.prototype.addVisualContainer = function (expr, dataSources, exploreCanvas, position) {
                    var _this = this;
                    if (!position)
                        position = VisualAuthoring.getDefaultVisualContainerPosition();
                    var options = {
                        dataSources: dataSources,
                        expr: expr,
                        allowAggregate: true
                    };
                    return this.undoRedoService.register(function () {
                        return _this.createVisualContainerConfig(options).then(function (config) {
                            if (config !== undefined) {
                                return _this.createVisualFromConfig(exploreCanvas, config, position);
                            }
                        });
                    });
                };
                VisualAuthoring.prototype.addEmptyVisualContainer = function (exploreCanvas, visualType, position) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        if (!position)
                            position = VisualAuthoring.getDefaultVisualContainerPosition();
                        var config = {
                            singleVisual: { visualType: visualType },
                        };
                        return _this.createVisualFromConfig(exploreCanvas, config, position);
                    });
                };
                VisualAuthoring.prototype.copyVisualWithFilter = function (sourceWireContract, filter, centerX, centerY) {
                    var source = this.explorationSerializer.deserializeVisualContainer(sourceWireContract);
                    source.id = 100;
                    source.position = {
                        height: source.position.height,
                        width: source.position.width,
                        x: Math.max(0, centerX ? centerX - source.position.width / 2 : 0),
                        y: Math.max(0, centerY ? centerY - source.position.height / 2 : 0),
                        z: source.position.z,
                    };
                    return source;
                };
                VisualAuthoring.prototype.addFilter = function (field, scope, dataSources) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        return _this.schemaProxy.get(dataSources).then(function (schema) {
                            // 1. get the filter scope                   
                            var filterScope = {
                                section: _this.sectionNavigationService.getCurrentSection(),
                            };
                            if (scope === 0 /* Visual */)
                                filterScope.visualContainer = selectionUtils.getSelectedVisual(_this.selectionService);
                            // 2. verify if it can be added
                            if (!explore.FilterUtils.canAdd(field, schema, scope, filterScope, _this.visualPluginService))
                                return _this.promiseFactory.reject();
                            // 3. create and add the filter
                            var filterType = explore.FilterUtils.getDefaultFilterType(field, schema);
                            var filter = {
                                field: field,
                                type: filterType,
                                expanded: true,
                            };
                            if (scope === 0 /* Visual */) {
                                explore.FilterUtils.add(filterScope.visualContainer, filter);
                            }
                            else if (scope === 1 /* Section */) {
                                explore.FilterUtils.add(filterScope.section, filter);
                            }
                            // 4. fire filter added event
                            var eventArg = {
                                filter: filter,
                                changeType: 1 /* Add */,
                                scope: filterScope,
                            };
                            _this.eventBridge.publishToChannel(services.events.filterContainerChanged, eventArg);
                            return _this.promiseFactory.resolve();
                        });
                    });
                };
                VisualAuthoring.prototype.removeFilter = function (filter, scope) {
                    var _this = this;
                    return this.undoRedoService.register(function () {
                        return _this.removeFilterImpl(filter, scope);
                    });
                };
                VisualAuthoring.prototype.raiseVisualContainerChanged = function (visualContainer) {
                    debug.assertValue(visualContainer, 'visualContainer');
                    this.eventBridge.publishToChannel(services.events.visualContainerChanged, {
                        affectContainer: VisualContainerUtils.contractEqualityComparator(visualContainer)
                    });
                };
                VisualAuthoring.prototype.convert = function (visualContainer, dataSources, targetType) {
                    var _this = this;
                    var sourceType = VisualContainerUtils.getVisualType(visualContainer), convertEvent = this.telemetry.startEvent(powerbi.telemetry.EXInteractionVisualConversion, sourceType, targetType);
                    var visualQuery = visualContainer.config.singleVisual.query;
                    if (visualQuery) {
                        return this.schemaProxy.get(dataSources).then(function (schema) {
                            var success = _this.core.convert({
                                schema: schema,
                                source: visualContainer.config,
                                target: targetType,
                            });
                            if (success) {
                                convertEvent.resolve();
                                _this.raiseVisualContainerChanged(visualContainer);
                            }
                            else {
                                return convertEvent.reject();
                            }
                        }, function () { return convertEvent.reject(); });
                    }
                    // For empty visuals that doesn't have query, simply change the visualType to targetType.
                    visualContainer.config.singleVisual.visualType = targetType;
                    convertEvent.resolve();
                    this.raiseVisualContainerChanged(visualContainer);
                    return this.promiseFactory.resolve();
                };
                VisualAuthoring.prototype.setOrderBy = function (visualContainer, orderBy) {
                    debug.assertValue(visualContainer, 'visualContainer');
                    visualContainer.config.singleVisual.query.orderBy(orderBy);
                    this.raiseVisualContainerChanged(visualContainer);
                };
                VisualAuthoring.prototype.removeOrderBy = function (visualContainer, exprs) {
                    debug.assertValue(visualContainer, 'visualContainer');
                    debug.assertValue(exprs, 'exprs');
                    for (var i = 0, len = exprs.length; i < len; i++) {
                        visualContainer.config.singleVisual.query.removeOrderBy(exprs[i]);
                    }
                    this.raiseVisualContainerChanged(visualContainer);
                };
                VisualAuthoring.prototype.applyPropertyChanges = function (changes, existingObjects) {
                    if (!existingObjects) {
                        existingObjects = {};
                    }
                    for (var i = 0, len = changes.length; i < len; i++) {
                        var change = changes[i];
                        var objectDfn = powerbi.data.DataViewObjectDefinitions.ensure(existingObjects, change.objectName, change.selector);
                        objectDfn.properties = change.properties;
                    }
                    return existingObjects;
                };
                VisualAuthoring.prototype.deleteSelectedVisuals = function (viewModel) {
                    var visualContainers = _.map(this.selectionService.getSelectedElements(), function (ele) { return ele.visualContainer; });
                    var deleted = false;
                    for (var i = visualContainers.length - 1; i >= 0; --i) {
                        var visualContainer = visualContainers[i];
                        if (visualContainer)
                            deleted = this.deleteVisualContainerInternal(visualContainer, viewModel) || deleted;
                    }
                    // Send only one clear per delete
                    if (deleted) {
                        this.notifyVisualContainersAndClearSelection(visualContainers, viewModel);
                    }
                };
                VisualAuthoring.prototype.deleteVisualContainer = function (visualContainerContract, viewModel) {
                    if (this.deleteVisualContainerInternal(visualContainerContract, viewModel)) {
                        this.notifyVisualContainersAndClearSelection([visualContainerContract], viewModel);
                    }
                };
                VisualAuthoring.prototype.notifyVisualContainersAndClearSelection = function (removedVisualContainers, viewModel) {
                    var _this = this;
                    if (viewModel.contract.crossHighlight && _.any(removedVisualContainers, function (vc) { return vc === viewModel.contract.crossHighlight.sourceVisualContainer; })) {
                        // Clear the cross-highlight if any of the visuals is the source.  It notifies as a side-effect
                        powerbi.explore.services.filterGeneratorUtils.clearCrossHighlight(this.eventBridge, viewModel.contract, viewModel.contract.crossHighlight.sourceVisualContainer);
                    }
                    else if (_.any(removedVisualContainers, function (vc) { return powerbi.explore.services.filterGeneratorUtils.hasFilterOutputProp(vc, _this.visualPluginService); })) {
                        // Send a notification to update if any of the removed visuals had a filter
                        this.eventBridge.publishToChannel(powerbi.explore.services.events.visualContainerChanged, {
                            affectContainer: function (visualContainer) { return true; }
                        });
                    }
                    this.selectionService.clearSelection();
                };
                VisualAuthoring.prototype.deleteVisualContainerInternal = function (visualContainerContract, viewModel) {
                    if (!visualContainerContract)
                        return;
                    var visualContainerModel = powerbi.explore.util.CanvasVisualsUtility.findVisualContainerViewModel(viewModel.visualContainers, visualContainerContract);
                    if (!visualContainerModel)
                        return;
                    var modelIndex = viewModel.visualContainers.indexOf(visualContainerModel);
                    viewModel.visualContainers.splice(modelIndex, 1);
                    var contract = viewModel.contract;
                    var contractIndex = contract.visualContainers.indexOf(visualContainerContract);
                    contract.visualContainers.splice(contractIndex, 1);
                    return true;
                };
                VisualAuthoring.prototype.getVisualDataRole = function (visual, roleName) {
                    var roleDefs = VisualContainerUtils.getDataRolesForVisual(visual, this.visualPluginService);
                    if (_.isEmpty(roleDefs))
                        return;
                    return ArrayExtensions.findItemWithName(roleDefs, roleName);
                };
                VisualAuthoring.prototype.removeFieldImpl = function (expr) {
                    return this.invokeRemoveOnSelectedVisuals({ expr: expr, ignoreAggregates: true });
                };
                VisualAuthoring.prototype.removeFilterImpl = function (filter, scope) {
                    var eventArg = {
                        filter: filter,
                        changeType: 0 /* Remove */,
                        scope: {
                            section: this.sectionNavigationService.getCurrentSection(),
                        },
                    };
                    var filters;
                    if (scope === 0 /* Visual */) {
                        eventArg.scope.visualContainer = selectionUtils.getSelectedVisual(this.selectionService);
                        if (!eventArg.scope.visualContainer)
                            return false;
                        filters = eventArg.scope.visualContainer.filters;
                    }
                    else if (scope === 1 /* Section */) {
                        if (!eventArg.scope.section)
                            return false;
                        filters = eventArg.scope.section.filters;
                    }
                    else
                        debug.assertFail('Unknown filter scope type');
                    if (!filters)
                        return false;
                    for (var i = 0; i < filters.length; i++) {
                        if (filters[i] === filter) {
                            filters.splice(i, 1);
                            this.eventBridge.publishToChannel(services.events.filterContainerChanged, eventArg);
                            return true;
                        }
                    }
                    return false;
                };
                VisualAuthoring.prototype.removeFiltersWithExpr = function (expr) {
                    debug.assertValue(expr, 'expr');
                    var matchedFilters;
                    var filters = selectionUtils.getSelectedVisual(this.selectionService).filters;
                    if (!filters)
                        return false;
                    for (var i = filters.length - 1; i >= 0; i--) {
                        var currentFilter = filters[i];
                        var filterExpr = SQExprBuilder.fieldDef(currentFilter.field);
                        if (SQExpr.equals(filterExpr, expr))
                            matchedFilters = this.removeFilterImpl(currentFilter, 0 /* Visual */);
                    }
                    return matchedFilters;
                };
                VisualAuthoring.prototype.invokeRemoveOnSelectedVisuals = function (removeOptions) {
                    var selectedVisuals = selectionUtils.getSelectedVisuals(this.selectionService);
                    var result = false;
                    for (var i = selectedVisuals.length - 1; i > -1; i--) {
                        var visualToUpdate = selectedVisuals[i];
                        if (this.core.remove(removeOptions, visualToUpdate.config)) {
                            this.raiseVisualContainerChanged(visualToUpdate);
                            result = true;
                        }
                    }
                    return result;
                };
                VisualAuthoring.prototype.createVisualFromConfig = function (exploreCanvas, config, position) {
                    var visualContainer = {
                        position: position,
                        config: config,
                    };
                    exploreCanvas.contract.visualContainers.push(visualContainer);
                    var viewModel = explore.viewModels.ViewModelFactory.convertVisualContainer(exploreCanvas.contract, visualContainer);
                    exploreCanvas.visualContainers.push(viewModel);
                    selectionUtils.selectVisualContainer(visualContainer, this.selectionService);
                    return visualContainer;
                };
                VisualAuthoring.getDefaultVisualContainerPosition = function () {
                    return {
                        height: 0,
                        width: 0,
                        x: 0,
                        y: 0,
                        z: 0
                    };
                };
                return VisualAuthoring;
            })();
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            var ConceptualDefaultAggregate = powerbi.data.ConceptualDefaultAggregate;
            var FieldKind = powerbi.data.FieldKind;
            var QueryAggregateFunction = powerbi.data.QueryAggregateFunction;
            var SQExprBuilder = powerbi.data.SQExprBuilder;
            /**
             * Provides informational utilities for visual authoring.
             * NOTE: These utilities should not have any side effects.
             */
            var VisualAuthoringInfo;
            (function (VisualAuthoringInfo) {
                /** Returns an array of supported aggregates for a given expr and role. */
                function getSupportedAggregates(expr, dataRoles, schema) {
                    if (!_.isEmpty(expr.validate(schema)))
                        return [];
                    var metadata = getMetadataForUnderlyingType(expr, schema);
                    var targetFieldKind = dataRoles.kind, valueType = metadata.type, fieldKind = metadata.kind, isPropertyIdentity = metadata.idOnEntityKey, Agg = QueryAggregateFunction; // alias
                    if (!valueType)
                        return [];
                    // Can't aggregate on model measures
                    if (fieldKind === 1 /* Measure */)
                        return [];
                    if (valueType.numeric || valueType.integer) {
                        if (targetFieldKind === 1 /* Measure */ || targetFieldKind === 2 /* GroupingOrMeasure */)
                            if (metadata.defaultAggregate === 1 /* None */) {
                                return [2 /* Count */, 5 /* CountNonNull */];
                            }
                            else {
                                return [0 /* Sum */, 1 /* Avg */, 3 /* Min */, 4 /* Max */, 2 /* Count */, 5 /* CountNonNull */];
                            }
                        if (targetFieldKind === 0 /* Grouping */)
                            return [];
                    }
                    else if (valueType.text || valueType.bool || valueType.dateTime) {
                        if (targetFieldKind === 1 /* Measure */ || targetFieldKind === 2 /* GroupingOrMeasure */) {
                            if (isPropertyIdentity)
                                return [5 /* CountNonNull */];
                            return [2 /* Count */, 5 /* CountNonNull */];
                        }
                        if (targetFieldKind === 0 /* Grouping */)
                            return [];
                    }
                    debug.assertFail("Unexpected expr or role.");
                    return [];
                }
                VisualAuthoringInfo.getSupportedAggregates = getSupportedAggregates;
                function getValueType(expr, schema) {
                    var metadata = getMetadataForUnderlyingType(expr, schema);
                    if (!metadata)
                        return;
                    return metadata.type;
                }
                VisualAuthoringInfo.getValueType = getValueType;
                function getMetadataForUnderlyingType(expr, schema) {
                    // Unwrap the aggregate (if the expr has one), and look at the underlying type.
                    var metadata = SQExprBuilder.removeAggregate(expr).getMetadata(schema);
                    if (!metadata)
                        metadata = expr.getMetadata(schema);
                    return metadata;
                }
            })(VisualAuthoringInfo = services.VisualAuthoringInfo || (services.VisualAuthoringInfo = {}));
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var explore;
    (function (explore) {
        var services;
        (function (services) {
            var BeautifiedFormat = {
                '0.00 %;-0.00 %;0.00 %': 'Percentage',
            };
            var VisualHostServices = (function () {
                function VisualHostServices() {
                }
                // NOTE: This class is intentionally stateless.
                VisualHostServices.initialize = function (localize) {
                    debug.assertValue(localize, 'localize');
                    powerbi.visuals.valueFormatter.setLocaleOptions(VisualHostServices.createLocaleOptions(localize));
                    powerbi.visuals.TooltipManager.setLocalizedStrings(VisualHostServices.createTooltipLocaleOptions(localize));
                };
                // Public for testability
                VisualHostServices.createLocaleOptions = function (localize) {
                    debug.assertValue(localize, 'localize');
                    return {
                        null: localize.get('NullValue'),
                        true: localize.get('BooleanTrue'),
                        false: localize.get('BooleanFalse'),
                        beautify: function (format) { return VisualHostServices.beautify(localize, format); },
                        describe: function (exponent) { return VisualHostServices.describeUnit(localize, exponent); },
                    };
                };
                VisualHostServices.createTooltipLocaleOptions = function (localize) {
                    return {
                        highlightedValueDisplayName: localize.get(powerbi.visuals.ToolTipComponent.highlightedValueDisplayNameResorceKey)
                    };
                };
                VisualHostServices.prototype.getLocalizedString = function (stringId) {
                    return powerbi.common.localize.get(stringId);
                };
                // NO-OP IHostServices methods
                VisualHostServices.prototype.onDragStart = function () {
                };
                VisualHostServices.prototype.canSelect = function () {
                    return false;
                };
                VisualHostServices.prototype.onSelect = function () {
                };
                VisualHostServices.prototype.loadMoreData = function () {
                };
                VisualHostServices.prototype.persistProperties = function (changes) {
                };
                VisualHostServices.prototype.onCustomSort = function (args) {
                };
                VisualHostServices.prototype.getViewMode = function () {
                    return 0 /* View */;
                };
                VisualHostServices.prototype.setWarnings = function (warnings) {
                };
                VisualHostServices.prototype.setToolbar = function ($toolbar) {
                };
                VisualHostServices.beautify = function (localize, format) {
                    if (format) {
                        var regEx = RegExp('\.0* %', 'g');
                        format = format.replace(regEx, '.00 %');
                    }
                    var key = BeautifiedFormat[format];
                    if (key)
                        return localize.getOptional(key) || format;
                    return format;
                };
                VisualHostServices.describeUnit = function (localize, exponent) {
                    var title = localize.getOptional("DisplayUnitSystem_E" + exponent + "_Title");
                    var format = localize.getOptional("DisplayUnitSystem_E" + exponent + "_LabelFormat");
                    if (title || format)
                        return { title: title, format: format };
                };
                return VisualHostServices;
            })();
            services.VisualHostServices = VisualHostServices;
            function createVisualHostServices() {
                return new VisualHostServices();
            }
            services.createVisualHostServices = createVisualHostServices;
        })(services = explore.services || (explore.services = {}));
    })(explore = powerbi.explore || (powerbi.explore = {}));
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
        (function (HowVisualWasCreated) {
            HowVisualWasCreated[HowVisualWasCreated["CheckboxTickedInFieldList"] = 0] = "CheckboxTickedInFieldList";
            HowVisualWasCreated[HowVisualWasCreated["DraggedToCanvas"] = 1] = "DraggedToCanvas";
            HowVisualWasCreated[HowVisualWasCreated["VisualTypeIconClicked"] = 2] = "VisualTypeIconClicked";
        })(telemetry.HowVisualWasCreated || (telemetry.HowVisualWasCreated = {}));
        var HowVisualWasCreated = telemetry.HowVisualWasCreated;
        (function (HowFieldWasAddedToVisual) {
            HowFieldWasAddedToVisual[HowFieldWasAddedToVisual["CheckboxTickedInFieldList"] = 0] = "CheckboxTickedInFieldList";
            HowFieldWasAddedToVisual[HowFieldWasAddedToVisual["DraggedToVisual"] = 1] = "DraggedToVisual";
            HowFieldWasAddedToVisual[HowFieldWasAddedToVisual["DraggedToFieldWell"] = 2] = "DraggedToFieldWell";
        })(telemetry.HowFieldWasAddedToVisual || (telemetry.HowFieldWasAddedToVisual = {}));
        var HowFieldWasAddedToVisual = telemetry.HowFieldWasAddedToVisual;
        telemetry.EXOpenExploration = function (parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.OpenExploration',
                category: 1 /* CustomerAction */,
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
            if (typeof powerbi.telemetry.EXOpenExplorationLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXOpenExplorationLoggers;
            }
            return event;
        };
        telemetry.EXSaveExploration = function (isSaveAs, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                isSaveAs: isSaveAs,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.SaveExploration',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        isSaveAs: info.isSaveAs,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXSaveExplorationLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXSaveExplorationLoggers;
            }
            return event;
        };
        telemetry.EXInteractionVisualConversion = function (sourceVisualType, targetVisualType, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                sourceVisualType: sourceVisualType,
                targetVisualType: targetVisualType,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.InteractionVisualConversion',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        sourceVisualType: info.sourceVisualType,
                        targetVisualType: info.targetVisualType,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXInteractionVisualConversionLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXInteractionVisualConversionLoggers;
            }
            return event;
        };
        telemetry.EXFilterPaneAdvancedFilterApplied = function (isVisualFilter, filterType, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                isVisualFilter: isVisualFilter,
                filterType: filterType,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.FilterPaneAdvancedFilterApplied',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        isVisualFilter: info.isVisualFilter,
                        filterType: info.filterType,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXFilterPaneAdvancedFilterAppliedLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXFilterPaneAdvancedFilterAppliedLoggers;
            }
            return event;
        };
        telemetry.EXFilterPaneClearAdvancedFilter = function (parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.FilterPaneClearAdvancedFilter',
                category: 1 /* CustomerAction */,
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
            if (typeof powerbi.telemetry.EXFilterPaneClearAdvancedFilterLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXFilterPaneClearAdvancedFilterLoggers;
            }
            return event;
        };
        telemetry.EXFilterPaneExpandCollapseFilter = function (isExpanded, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                isExpanded: isExpanded,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.FilterPaneExpandCollapseFilter',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        isExpanded: info.isExpanded,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXFilterPaneExpandCollapseFilterLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXFilterPaneExpandCollapseFilterLoggers;
            }
            return event;
        };
        telemetry.EXLoadFilterError = function (message) {
            var info = {
                message: message,
            };
            var event = {
                name: 'PBI.EX.LoadFilterError',
                category: 2 /* CriticalError */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        message: info.message,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXLoadFilterErrorLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXLoadFilterErrorLoggers;
            }
            return event;
        };
        telemetry.EXCreateVisual = function (source, visualType, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                source: source,
                visualType: visualType,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.CreateVisual',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        source: powerbi.telemetry.HowVisualWasCreated[info.source],
                        visualType: info.visualType,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXCreateVisualLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXCreateVisualLoggers;
            }
            return event;
        };
        telemetry.EXAddField = function (source, targetVisualType, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                source: source,
                targetVisualType: targetVisualType,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.AddField',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        source: powerbi.telemetry.HowFieldWasAddedToVisual[info.source],
                        targetVisualType: info.targetVisualType,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXAddFieldLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXAddFieldLoggers;
            }
            return event;
        };
        telemetry.EXChangeFieldWell = function (sourceBucketRole, targetBucketRole, parentId, isError) {
            if (isError === void 0) { isError = false; }
            var info = {
                sourceBucketRole: sourceBucketRole,
                targetBucketRole: targetBucketRole,
                parentId: parentId,
                isError: isError,
            };
            var event = {
                name: 'PBI.EX.ChangeFieldWell',
                category: 1 /* CustomerAction */,
                time: Date.now(),
                id: g(),
                getFormattedInfoObject: function () {
                    return {
                        sourceBucketRole: info.sourceBucketRole,
                        targetBucketRole: info.targetBucketRole,
                        parentId: info.parentId,
                        isError: info.isError,
                    };
                },
                info: info
            };
            if (typeof powerbi.telemetry.EXChangeFieldWellLoggers !== 'undefined') {
                event.loggers = powerbi.telemetry.EXChangeFieldWellLoggers;
            }
            return event;
        };
    })(telemetry = powerbi.telemetry || (powerbi.telemetry = {}));
})(powerbi || (powerbi = {}));
angular.module('powerbi.explore').run(['$templateCache', function (t) {
    t.put('views/inputFields/alignmentGroup.html', '\u003cdiv class=\u0027alignment-group\u0027\u003e\
    \u003cdiv class=\"alignment-option-wrapper\" ng-class=\"{\u0027alignment-selected\u0027: slice.value === \u0027left\u0027}\"\u003e\
        \u003cspan class=\u0027alignment-option left\u0027 ng-click=\"setAlignment(\u0027left\u0027)\"/\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"alignment-option-wrapper\" ng-class=\"{\u0027alignment-selected\u0027: slice.value === \u0027center\u0027}\"\u003e\
        \u003cspan class=\u0027alignment-option center\u0027 ng-click=\"setAlignment(\u0027center\u0027)\"/\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"alignment-option-wrapper\" ng-class=\"{\u0027alignment-selected\u0027: slice.value === \u0027right\u0027}\"\u003e\
        \u003cspan class=\u0027alignment-option right\u0027 ng-click=\"setAlignment(\u0027right\u0027)\"/\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/inputFields/radioGroup.html', '\u003csection class=\"radioGroup\"\u003e\
    \u003c!-- This needs to be a generic radio group that can create buttons depending on the ENUM --\u003e\
    \u003cinput type=\"radio\" ng-model=\"property.value\" ng-change=\"save(property, parentProperty)\" name=\"uniqueName\" value=\"Top\" ng-checked=\"property.value === \u0027Top\u0027\"\u003eTop\u003cbr\u003e\
    \u003cinput type=\"radio\" ng-model=\"property.value\" ng-change=\"save(property, parentProperty)\" name=\"uniqueName\" value=\"Bottom\" ng-checked=\"property.value === \u0027Bottom\u0027\"\u003eBottom\u003cbr\u003e\
    \u003cinput type=\"radio\" ng-model=\"property.value\" ng-change=\"save(property, parentProperty)\" name=\"uniqueName\" value=\"Left\" ng-checked=\"property.value === \u0027Left\u0027\"\u003eLeft\u003cbr\u003e\
    \u003cinput type=\"radio\" ng-model=\"property.value\" ng-change=\"save(property, parentProperty)\" name=\"uniqueName\" value=\"Right\" ng-checked=\"property.value === \u0027Right\u0027\"\u003eRight\u003cbr\u003e\
\u003c/section\u003e\
');
    t.put('views/inputFields/toggleSwitch.html', '\u003cdiv class=\"toggle-switch\" ng-class=\"{\u0027main-show\u0027: slice.name === \u0027show\u0027}\"\u003e\
    \u003cinput ng-change=\"save(slice, card)\" ng-model=\"slice.value\" type=\"checkbox\" name=\"toggle-switch\"\
           class=\"toggle-switch-checkbox\" id={{card.name+slice.name}} ng-checked={{slice.value}} /\u003e\
    \u003c!--todo: cancel usage in id--\u003e\
    \u003clabel class=\"toggle-switch-label\" for={{card.name+slice.name}}\u003e\
        \u003cspan ng-show=\"slice.value\" class=\"toggle-switch-text\" localize=\"ToggleSwitchOn\"\u003e\u003c/span\u003e\
        \u003cspan ng-show=\"!slice.value\" class=\"toggle-switch-text\" localize=\"ToggleSwitchOff\"\u003e\u003c/span\u003e\
        \u003cspan class=\"toggle-switch-inner\"\u003e\u003c/span\u003e\
        \u003cspan class=\"toggle-switch-switch\"\u003e\u003c/span\u003e\
    \u003c/label\u003e\
\u003c/div\u003e\
');
    t.put('views/inputFields/selectionBox.html', '\u003cdiv class=\"selection-box\"\u003e\
    \u003cdiv class=\u0027selection-box-selected-block\u0027 ng-click=\"showDropdown=!showDropdown\"\u003e\
        \u003cspan class=\u0027selection-box-selected-item\u0027\u003e{{selected.displayName}}\u003c/span\u003e\
        \u003cspan class=\u0027selection-box-icon\u0027\u003e\u003c/span\u003e\
    \u003c/div\u003e\
    \u003cpopup-container ng-if=\"showDropdown\"\u003e\
        \u003cul class=\"selection-box-menu\"\u003e\
            \u003cli ng-repeat=\"item in items track by $index\" class=\u0027selection-box-item\u0027 ng-click=\"itemSelected(item)\" ng-class=\"{\u0027selected\u0027: selected === item}\"\u003e\u003cspan\u003e{{item.displayName}}\u003c/span\u003e\u003c/li\u003e\
        \u003c/ul\u003e\
    \u003c/popup-container\u003e\
\u003c/div\u003e\
');
    t.put('views/inputFields/percentageSlider.html', '\u003cdiv class=\"slider\"\u003e\
    \u003cinput class=\"barRange\" type=\"range\" ng-model=\"slice.value\" ng-change=\"save(slice, card)\" /\u003e\
    \u003cdiv class=\"outputRange\"\u003e\
        \u003coutput ng-model=\"slice.value\"\u003e{{slice.value}}\u003c/output\u003e%\
    \u003c/div\u003e\
\u003c/div\u003e \
');
    t.put('views/inputFields/numUpDown.html', '\u003cdiv class=\"numupdown\"\u003e\
    \u003cinput class=\"inputUpDown\" type=\u0027text\u0027 ng-model=\"slice.value\" ng-change=\"save(slice, card)\" value=\"{{property.value}}\" onkeypress=\u0027return event.charCode \u003e= 48 \u0026\u0026 event.charCode \u003c= 57\u0027 maxlength=\"3\" /\u003e\
    \u003cdiv class=\"nevigationButtons\"\u003e\
        \u003cinput class=\u0027up numericArrowUp\u0027 type=\u0027button\u0027 ng-click=\"onUpDownValueChanged(\u0027up\u0027)\" /\u003e\
        \u003cinput class=\u0027down numericArrowDown\u0027 type=\u0027button\u0027 ng-click=\"onUpDownValueChanged(\u0027down\u0027)\" /\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
\
');
    t.put('views/advancedFilter.html', '\u003cli class=\"advanced\"\u003e\
    \u003ch3 class=\"description\" localize=\"AdvancedFilter_Description\" /\u003e\
\
    \u003cdiv ng-repeat=\"condition in viewModel.advFilterCard.conditions\"\u003e\
        \u003cselect class=\"comparisonOperator advancedControl\"\
                ng-model=\"condition.operator\"\
                ng-disabled=\"viewModel.readOnlyState.disabled\"\
                ng-options=\"operatorInfo.value as operatorInfo.label for operatorInfo in viewModel.advFilterCard.operators\" /\u003e\
        \u003cinput class=\"conditionValue advancedControl\"\
               type=\"text\"\
               ng-model=\"condition.value.stringValue\"\
               ng-show=\"condition.valueRequired\"\
               ng-disabled=\"viewModel.readOnlyState.disabled\"\
               ng-if=\"!viewModel.advFilterCard.isDateTime\" /\u003e\
        \
        \u003csection class=\"datetime datetimePicker\" ng-if=\"viewModel.advFilterCard.isDateTime\" ng-show=\"condition.valueRequired\"\u003e\
            \u003cdiv class=\"datePicker flex\"\u003e\
                \u003cinput type=\"text\"\
                       class=\"calendarInput item-fill\"\
                       ng-model=\"condition.value.dateValue\"\
                       ng-disabled=\"!condition.valueRequired\" /\u003e\
                \u003cbutton class=\"filterPaneIcon calendar item-auto\"\
                        dropdown-overlay-invoke=\"calendar\"\u003e\u003c/button\u003e\
                \u003cdropdown-overlay class=\"datetime calendarDropDown\" dropdown-overlay-name=\"calendar\"\u003e\
                    \u003c!--The drop down menu is listening to mouse click event to close. \
                        The following ng-click is to stop propogate the click event when navigating in the calendar control--\u003e\
                    \u003cdatepicker class=\"calendar\"\
                                ng-model=\"condition.value.dateValue\"\
                                ng-disabled=\"!condition.valueRequired\"\
                                ng-click=\"$event.stopPropagation()\"\
                                show-weeks=\"false\"\u003e\u003c/datepicker\u003e\
                \u003c/dropdown-overlay\u003e\
            \u003c/div\u003e\
            \u003ctimepicker class=\"timePicker\" ng-model=\"condition.value.dateValue\"\u003e\u003c/timepicker\u003e\
        \u003c/section\u003e\
        \
        \u003csection class=\"logicalOperator advancedControl\" ng-if=\"$index \u003c (viewModel.advFilterCard.conditions.length -1)\"\u003e\
            \u003clabel class=\"logicalOperatorField\"\u003e\
                \u003cinput type=\"radio\"\
                       ng-model=\"viewModel.advFilterCard.logicalOperator\"\
                       ng-value=\"viewModel.advFilterCard.logicalAndOperator\"\
                       ng-disabled=\"viewModel.readOnlyState.disabled\"\
                       ng-checked=\"viewModel.advFilterCard.logicalOperator === viewModel.advFilterCard.logicalAndOperator\" /\u003e\
                \u003cspan localize=\"Logical_And_Operator\" /\u003e\
            \u003c/label\u003e\
            \u003clabel class=\"logicalOperatorField\"\u003e\
                \u003cinput type=\"radio\"\
                       ng-model=\"viewModel.advFilterCard.logicalOperator\"\
                       ng-value=\"viewModel.advFilterCard.logicalOrOperator\"\
                       ng-disabled=\"viewModel.readOnlyState.disabled\"\
                       ng-checked=\"viewModel.advFilterCard.logicalOperator === viewModel.advFilterCard.logicalOrOperator\" /\u003e\
                \u003cspan localize=\"Logical_Or_Operator\" /\u003e\
            \u003c/label\u003e\
        \u003c/section\u003e\
    \u003c/div\u003e\
    \u003cbutton class=\"applyFilter\"\
            localize=\"AdvancedFilter_ApplyFilter\"\
            ng-click=\"applyFilter($event)\"\
            ng-disabled=\"!areConditionsValid() || viewModel.readOnlyState.disabled\" /\u003e\
\u003c/li\u003e\
');
    t.put('views/categoricalFilter.html', '\u003cli class=\"categorical\"\u003e\
    \u003cng-scrollbars ng-scrollbars-config=\"::scrollbarsConfig\"\u003e\
    \u003cdiv class=\"item\" ng-if=\"!viewModel.categoricalFilterCard.isLoading\"\u003e\
        \u003cinput ng-click=\"toggleAll()\" type=\"checkbox\" ng-model=\"viewModel.categoricalFilterCard.allChecked\" /\u003e\
        \u003cspan class=\"label\" localize=\"FilterRestatement_All\"\u003e\u003c/span\u003e\
    \u003c/div\u003e\
    \u003col ng-if=\"!viewModel.categoricalFilterCard.isLoading\"\u003e\
        \u003cli ng-repeat=\"filterValue in viewModel.categoricalFilterCard.values\" class=\"item flex\"\u003e\
            \u003cinput class=\"item-auto\" ng-click=\"toggle(filterValue)\" type=\"checkbox\" ng-model=\"filterValue.checked\" /\u003e\
            \u003cspan class=\"label item-fill\"\u003e{{::filterValue.label}}\u003c/span\u003e\
            \u003cspan class=\"count item-auto\"\u003e{{::filterValue.count}}\u003c/span\u003e\
        \u003c/li\u003e\
    \u003c/ol\u003e\
\
    \u003cdiv class=\"centeredSpinner\" ng-if=\"viewModel.categoricalFilterCard.isLoading\"\u003e\
        \u003cspinner\u003e\u003c/spinner\u003e\
    \u003c/div\u003e\
    \u003c/ng-scrollbars\u003e\
\u003c/li\u003e\
');
    t.put('views/carousel.html', '\u003cdiv class=\"carouselControl\" ng-mouseenter=\"updateNavButtonVisibility()\"\u003e\
    \u003cbutton class=\"carouselNavButton previousPage\" ng-click=\"scrollToPrevious()\"\u003e\
        \u003ci class=\"glyphicon pbi-glyph-caretleft glyph-mini\"\u003e\u003c/i\u003e\
    \u003c/button\u003e\
    \u003cbutton class=\"carouselNavButton nextPage\" ng-click=\"scrollToNext()\"\u003e\
        \u003ci class=\"glyphicon pbi-glyph-caretright  glyph-mini\"\u003e\u003c/i\u003e\
    \u003c/button\u003e\
    \u003cdiv class=\"carouselScrollPane\" ng-transclude\u003e\u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/colorPicker.html', '\u003cdiv class=\"colorpicker\" ng-class=\"{\u0027colorpicker-open\u0027: viewModel.isPickerOpen\u0026\u0026viewModel.isOutOfScreen}\" ng-click=\"togglePicker()\"\u003e\
    \u003cdiv class=\"colorpicker-anchor\"\u003e\
        \u003ccolor-tile class=\"selected-color-box\" color=\"slice.value\"\u003e\u003c/color-tile\u003e\
        \u003cspan class=\"colorpicker-icon\"\u003e\u003c/span\u003e\
    \u003c/div\u003e\
    \u003cpopup-container ng-if=\"viewModel.isPickerOpen\"\u003e\
        \u003cdiv class=\"flyout\"\u003e\
            \u003cdiv class=\u0027color-section-title\u0027 localize=\"ColorPicker_ThemeColors\"\u003e\u003c/div\u003e\
            \u003cdiv class=\"color-theme\" ng-repeat=\"theme in viewModel.themes\"\u003e\
                \u003ccolor-tile class=\"parent-color\" color=\"theme.parentColor\" ng-click=\"colorSelected(theme.parentColor)\"\u003e\u003c/color-tile\u003e\
                \u003ccolor-tile class=\"child-color\" color=\"childColor\" ng-click=\"colorSelected(childColor)\" ng-repeat=\"childColor in theme.children track by $index\"\u003e\u003c/color-tile\u003e\
            \u003c/div\u003e\
            \u003cdiv class=\u0027color-section-title\u0027 localize=\"ColorPicker_RecentColors\"\u003e\u003c/div\u003e\
            \u003cdiv class=\u0027recent-colors-container\u0027\u003e\
                \u003ccolor-tile class=\"recent-color\" color=\"recentColor\" ng-click=\"colorSelected(recentColor)\" ng-repeat=\"recentColor in viewModel.recentColors track by $index\"\u003e\u003c/color-tile\u003e\
            \u003c/div\u003e\
            \u003cdiv class=\u0027color-section-title colorpicker-revert\u0027 ng-click=\"revertToDefault()\" localize=\"ColorPicker_RevertToDefault\"\u003e\u003c/div\u003e\
            \u003cdiv class=\u0027color-section-button\u0027 ng-click=\"toggleWheel($event)\"\u003e\
                \u003cspan class=\"color-section-morecolors-icon\"\u003e\u003c/span\u003e\
                \u003cspan class=\"color-section-morecolors-title\" localize=\"ColorPicker_CustomColor\"\u003e\u003c/span\u003e\
            \u003c/div\u003e\
        \u003c/div\u003e\
        \u003cdiv class=\"colorwheel\" ng-if=\"viewModel.isWheelOpen\" ng-init=\"showColorWheel()\"\u003e\
            \u003ccanvas class=\"colorwheel-picker\" width=\"170\" height=\"170\" ng-click=\"customColorPicked($event)\" /\u003e\
            \u003cdiv class=\"colorwheel-button\" ng-click=\"toggleWheel($event)\" localize=\"ColorWheel_Cancel\"\u003e\u003c/div\u003e\
        \u003c/div\u003e\
    \u003c/popup-container\u003e\
\u003c/div\u003e\
');
    t.put('views/colorTile.html', '\u003cdiv class=\"color-tile\" ng-style=\"{\u0027background-color\u0027: color}\"\u003e\u003c/div\u003e\
');
    t.put('views/exploration.html', '\u003cdiv class=\"exploration\"\u003e\
    \u003cexplore-canvas view-model=\"viewModel.exploreCanvas\"\u003e\u003c/explore-canvas\u003e\
\u003c/div\u003e\
');
    t.put('views/explorationAppBar.html', '\u003cul class=\"unselectable\"\u003e\
    \u003cli dropdown-menu\
        dropdown-items=\"fileMenuActions\"\
        dropdown-class=\"explorationAppBarMenu\"\
        dropdown-dark-theme=\"viewModeState.viewMode === 0\"\
        dropdown-on-item-selected=\"fileMenuActionSelected(selected)\"\
        ng-if=\"viewModel.canEdit\"\
        tabindex=\"0\"\u003e\
        \u003cspan localize=\"ReportAppBar_FileButton\"\u003e\u003c/span\u003e\
        \u003ci class=\"glyphicon pbi-glyph-caretdown glyph-mini\"\u003e\u003c/i\u003e\
    \u003c/li\u003e\
    \u003cli localize=\"ReportAppBar_SaveReportButton\"\
        ng-click=\"save()\"\
        class=\"save\"\
        ng-if=\"viewModeState.viewMode === 1 \u0026\u0026 viewModel.canWrite\"\u003e\
    \u003c/li\u003e\
    \u003cli\
        localize=\"ReportAppBar_SwitchModeButton\"\
        ng-click=\"stopEditing()\"\
        class=\"switch\"\
        ng-if=\"viewModeState.viewMode === 1 \u0026\u0026 viewModel.canWrite\"\u003e\
    \u003c/li\u003e\
    \u003cli localize=\"ReportAppBar_EditReportButton\"\
        ng-click=\"edit()\"\
        class=\"edit\"\
        ng-if=\"viewModeState.viewMode === 0 \u0026\u0026 viewModel.canEdit\"\u003e\
    \u003c/li\u003e\
    \u003cli localize=\"ReportAppBar_FileButton\"\
        localize-tooltip=\"ReportAppBar_EditReportButtonSharedDisabled\"\
        class=\"edit-disabled\"\
        ng-if=\"viewModel.canEdit === false\"\u003e\
    \u003c/li\u003e\
    \u003cli localize=\"ReportAppBar_EditReportButton\"\
        localize-tooltip=\"ReportAppBar_EditReportButtonSharedDisabled\"\
        class=\"edit-disabled\"\
        ng-if=\"viewModel.canEdit === false\"\u003e\
    \u003c/li\u003e\
    \u003cli localize=\"ReportAppBar_InsertTextboxButton\"\
        class=\"insert-textbox\"\
        ng-click=\"insertTextbox()\"\
        ng-if=\"viewModeState.viewMode === 1 \u0026\u0026 viewModel.insertTextboxEnabled\"\u003e\
    \u003c/li\u003e\
\u003c/ul\u003e\
');
    t.put('views/explorationHost.html', '\u003cdiv class=\"fillAvailableSpace verticalItemsContainer\" ng-transclude\u003e\
\u003c/div\u003e\
');
    t.put('views/explorationNavigation.html', '\u003cdiv class=\"unselectable\" tabindex=\"0\"\u003e\
    \u003cdiv class=\"background\"\u003e\u003c/div\u003e\
    \u003cul class=\"pane sections\"\u003e\
        \u003ccarousel auto-resize=\"::true\"\u003e\
            \u003cli class=\"section static\" ng-if=\"viewModeState.viewMode === 1\" ng-class=\"{\u0027selected\u0027 : page.selected}\" ng-repeat=\"page in viewModel.exploration.sections\"\u003e\
                \u003cexploration-navigation-tab view-model=\"page\" is-editing=\"true\" tab-index=\"$index\" tab-is-first=\"$first\" tab-is-last=\"$last\"  drop=\"sections\" class=\"section dynamic\" ng-style=\"page.style\"\u003e\u003c/exploration-navigation-tab\u003e\
            \u003c/li\u003e\
            \u003cli class=\"section static\" ng-if=\"viewModeState.viewMode === 0\" ng-class=\"{\u0027selected\u0027 : page.selected}\" ng-repeat=\"page in viewModel.exploration.sections\"\u003e\
                \u003cexploration-navigation-tab view-model=\"page\" is-editing=\"false\" tab-index=\"$index\" class=\"section dynamic\" ng-style=\"page.style\"\u003e\u003c/exploration-navigation-tab\u003e\
            \u003c/li\u003e\
        \u003c/carousel\u003e\
        \u003cli ng-if=\"viewModeState.viewMode === 1\" class=\"section static create\" ng-click=\"createSection()\"\u003e\
            \u003cdiv class=\"thumbnail-container\"\u003e\
                \u003cdiv class=\"thumbnail\"\u003e\u003c/div\u003e\
            \u003c/div\u003e\
        \u003c/li\u003e\
    \u003c/ul\u003e\
\u003c/div\u003e\
');
    t.put('views/explorationNavigationTab.html', '\u003cdiv drag=\"sections\" class=\"thumbnail-container\" ng-dblclick=\"viewModel.isTabEditable = true; toggleDraggable(false);\" ng-click=\"changeSection(tabIndex)\"\u003e\
    \u003ceditable-label class=\"section-index\" on-blur=\"renameTab\" view-model=\"viewModel\" editable=\"viewModel.isTabEditable \u0026\u0026 isEditing\" disable-click=\"true\"\u003e\u003c/editable-label\u003e\
    \u003cdiv class=\"sectionDeleteIcon\" ng-hide=\"tabIndex === 0 \u0026\u0026 tabIsFirst === tabIsLast\" ng-if=\"isEditing\" ng-click=\"deleteSection(tabIndex)\"\u003ex\u003c/div\u003e\
\u003c/div\u003e\
\
');
    t.put('views/explorationPaginator.html', '\u003cdiv class=\"paginator unselectable\"\u003e\
    \u003cspan class=\"prev\" ng-click=\"prev()\"\u003e\u003c/span\u003e\
    \u003cspan class=\"status\" ng-mousedown=\"togglePane()\"\u003e\
        \u003cspan localize=\"ReportPaginator_Page\"\u003e\u003c/span\u003e\
        \u003cspan\u003e{{getSelectedPageIndex() + 1}}\u003c/span\u003e \
        \u003cspan localize=\"ReportPaginator_PageOf\"\u003e\u003c/span\u003e\
        \u003cspan\u003e{{viewModel.exploration.sections.length}}\u003c/span\u003e\
    \u003c/span\u003e\
    \u003cspan class=\"next\" ng-click=\"next()\"\u003e\u003c/span\u003e\
\u003c/div\u003e\
');
    t.put('views/explorationStatusBar.html', '\u003cdiv class=\"explorationStatusBarContent\"\u003e\
    \u003cexploration-paginator ng-if=\"viewModel.exploration\" view-model=\"viewModel\"\u003e\u003c/exploration-paginator\u003e\
    \u003cdiv class=\"viewSwitch\"\u003e\
        \u003ca class=\"editMode\" localize-tooltip=\"ReportPaginator_EditingView\" ng-click=\"startEditing()\"\u003e\u003c/a\u003e\u003c!--\
        --\u003e\u003ca class=\"readMode\" localize-tooltip=\"ReportPaginator_ReadingView\" ng-click=\"stopEditing()\"\u003e\u003c/a\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/exploreCanvas.html', '\u003cdiv class=\"exploreCanvas\"\
     drop=\"field\"\
     ng-click=\"clearSelection($event)\"\
     ng-keydown=\"keyDown($event)\"\
     ng-class=\"{ \u0027disableAnimations\u0027: disableAnimations === true, \u0027responsive\u0027: useResponsiveLayout === true }\"\u003e\
    \u003cvisual-container ng-repeat=\"visualContainer in viewModel.visualContainers\" view-model=\"visualContainer\" ng-repeat-finish-event=\"visualContainerRepeatFinished\"\u003e\u003c/visual-container\u003e\
\u003c/div\u003e\
');
    t.put('views/fieldList.html', '\u003csection class=\"fieldList\" ng-click=\"unselect()\" \u003e\
    \u003cng-scrollbars ng-scrollbars-config=\"::scrollbarsConfig\"\u003e\
        \u003cdiv ng-repeat=\"entity in viewModel.schema.entities | orderBy:\u0027displayName\u0027\" ng-if=\"viewModel.isLoaded\"\u003e\
            \u003cfield-list-entity view-model=\"entity\" ng-if=\"!entity.hidden || entity.showHidden\"\u003e\u003c/field-list-entity\u003e\
        \u003c/div\u003e\
        \u003cdiv class=\"centeredSpinner\" ng-if=\"!viewModel.isLoaded\"\u003e\
            \u003cspinner\u003e\u003c/spinner\u003e\
        \u003c/div\u003e\
    \u003c/ng-scrollbars\u003e\
\u003c/section\u003e\
');
    t.put('views/fieldListEntity.html', '\u003cli\u003e\
    \u003ch1 ng-click=\"toggle($event)\"\
        ng-right-click=\"expandMenu()\"\
        class=\"fieldListEntity flex\"\
        ng-class=\"{selected: viewModel.selected, inactive: viewModel.hidden \u0026\u0026 viewModel.showHidden}\"\u003e\
        \u003ci class=\"caret glyphicon pbi-glyph-caretright item-auto\" ng-class=\"{expanded : viewModel.expanded}\" /\u003e\
        \u003ci class=\"entityIcon fieldListIcon item-auto\" /\u003e\
        \u003ceditable-label class=\"unselectable title item-fill\"\
                        ng-class=\"{hasCheckedProperties: viewModel.hasCheckedProperties}\"\
                        view-model=\"viewModel\"\
                        on-blur=\"rename\"\
                        validate=\"isNameValid\"\
                        editable=\"viewModel.isEditingLabel\"\
                        disable-click=\"true\"\
                        ng-dblclick=\"editLabel()\"\u003e\u003c/editable-label\u003e\
        \u003ci class=\"fieldListMenuContainer item-auto\" ng-if=\"modelChangeEnabled\"\u003e\
            \u003cbutton class=\"optionsMenu\"\
                    dropdown-menu\
                    dropdown-items=\"viewModel.menuItems\"\
                    dropdown-class=\"fieldList-contextMenu\"\
                    dropdown-on-item-selected=\"selectMenuItem(selected)\"\u003e\
                \u003cspan class=\"glyphicon pbi-glyph-caretdown glyph-mini\"\u003e\u003c/span\u003e\
            \u003c/button\u003e\
        \u003c/i\u003e\
    \u003c/h1\u003e\
\
    \u003cdiv class=\"entityFields\" ng-if=\"viewModel.expanded\"\u003e\
        \u003col class=\"fieldListEntityList\"\u003e\
            \u003cfield-list-property ng-repeat=\"prop in viewModel.properties | orderBy:\u0027displayName\u0027\" \
                                 ng-if=\"prop.supported \u0026\u0026 (!prop.hidden || prop.showHidden)\" \
                                 view-model=\"prop\"\u003e\
            \u003c/field-list-property\u003e\
        \u003c/ol\u003e\
    \u003c/div\u003e\
\u003c/li\u003e\
');
    t.put('views/fieldListProperty.html', '\u003cli class=\"fieldListProperty flex\"\
    ng-click=\"select($event)\"\
    ng-right-click=\"expandMenu()\"\
    ng-class=\"{selected: viewModel.selected, inactive: viewModel.hidden \u0026\u0026 viewModel.showHidden}\"\
    drag=\"field\" drag-context=\"getDragContext()\"\
    tooltip tooltip-disable=\"{{viewModel.isEditingLabel}}\" tooltip-title=\"{{tooltipTitle()}}\"\u003e\
    \u003cspan class=\"dragHandle fieldListPropertyContent item-auto\" /\u003e\
    \u003c!--TODO: get rid of the need of id/for by wrapping the input inside of the label--\u003e\
    \
    \u003cinput class=\"pane-checkbox fieldListPropertyContent item-auto\" type=\"checkbox\" id=\"{{::elementId}}\" ng-click=\"toggle($event)\" ng-model=\"viewModel.checked\" /\u003e\
    \u003c!--TODO: get rid of the extra ng-click hack on label--\u003e\
    \u003clabel class=\"fieldListPropertyContent item-auto\" for=\"{{::elementId}}\" ng-click=\"$event.stopPropagation()\" /\u003e\
    \u003ci class=\"fieldListIcon fieldListPropertyContent item-auto\" ng-class=\"getIconClassName(viewModel)\" /\u003e\
    \u003ceditable-label class=\"fieldListPropertyText fieldListPropertyContent item-fill\" \
                    view-model=\"viewModel\" \
                    on-blur=\"rename\" \
                    validate=\"isNameValid\" \
                    editable=\"viewModel.isEditingLabel\" \
                    disable-click=\"true\" \
                    ng-dblclick=\"editLabel()\" \
                    custom-tooltip=\"true\"\u003e\
    \u003c/editable-label\u003e\
\
    \u003ci class=\"fieldListMenuContainer item-auto\"\u003e\
        \u003cbutton class=\"optionsMenu\"\
                dropdown-menu\
                dropdown-items=\"viewModel.menuItems\"\
                dropdown-class=\"fieldList-contextMenu\"\
                dropdown-on-item-selected=\"selectMenuItem(selected)\"\u003e\
            \u003cspan class=\"glyphicon pbi-glyph-caretdown glyph-mini\"\u003e\u003c/span\u003e\
        \u003c/button\u003e\
    \u003c/i\u003e\
\u003c/li\u003e\
');
    t.put('views/fieldWell.html', '\u003csection class=\"fieldWell unselectable\"\u003e\
    \u003col ng-if=\"viewModel.buckets\"\u003e\
        \u003cfield-well-bucket ng-repeat=\"bucket in viewModel.buckets\" view-model=\"bucket\"\u003e\
        \u003c/field-well-bucket\u003e\
    \u003c/ol\u003e\
\u003c/section\u003e\
');
    t.put('views/fieldWellBucket.html', '\u003cli class=\"bucket\"\u003e\
    \u003ch1 class=\"caption trimmedTextWithEllipsis\" title=\"{{::viewModel.displayName}}\" ng-bind=\"::viewModel.displayName\"\u003e\u003c/h1\u003e\
    \u003col class=\"properties\"\u003e\
        \u003cfield-well-field ng-repeat=\"property in viewModel.properties\" view-model=\"property\"\u003e\u003c/field-well-field\u003e\
        \u003cli drop=\"field\"\
            ng-class=\"viewModel.properties.length === 0 ? \u0027dropzone\u0027 : \u0027end-dropzone\u0027\"\
            ng-attr-localize=\"{{viewModel.properties.length === 0 ? \u0027VisualizationPane_Watermark\u0027 : \u0027\u0027}}\"\u003e\
        \u003c/li\u003e\
    \u003c/ol\u003e\
\u003c/li\u003e\
');
    t.put('views/fieldWellField.html', '\u003cli class=\"property\"\
    drag=\"field\"\
    drag-context=\"getDragContext()\"\
    drop=\"field\"\
    drop-allow-propagation=\"true\"\
    ng-right-click=\"expandMenu()\"\
    tooltip\
    tooltip-title=\"{{viewModel.tooltip}}\"\u003e\
    \u003ch2 class=\"flex\"\u003e\
        \u003cspan class=\"caption trimmedTextWithEllipsis item-fill\"\u003e{{viewModel.displayName}}\u003c/span\u003e\
        \u003cbutton class=\"fieldWellIcon dropDown item-auto\"\
                dropdown-menu\
                dropdown-items=\"viewModel.dropDownItems\"\
                dropdown-class=\"fieldList-contextMenu\"\
                dropdown-on-item-selected=\"selectFieldMenuItem(selected)\"\u003e\u003c/button\u003e\
        \u003cbutton ng-click=\"deleteField(viewModel)\" class=\"fieldWellIcon deleteIcon item-auto\"\u003e\u003c/button\u003e\
    \u003c/h2\u003e\
\u003c/li\u003e\
');
    t.put('views/filter.html', '\u003cli class=\"card unselectable\" ng-switch=\"viewModel.readOnlyState.type\"\u003e\
    \u003cdiv class=\"passthroughCardHeader\" ng-switch-when=\"3\"\u003e\
        \u003cbutton class=\"filterPaneIcon delete\" ng-click=\"deleteFilter($event, viewModel)\" localize-tooltip=\"FilterPane_DeleteFilter\"\u003e\u003c/button\u003e\
        \u003ch2 class=\"passthroughRestatement unselectable\" ng-bind=\"viewModel.restatement\"\u003e\u003c/h2\u003e\
    \u003c/div\u003e\
    \u003cdiv ng-switch-default\u003e\
        \u003cdiv class=\"filterCardTitleSection\" ng-click=\"toggle($event, viewModel)\"\u003e\
            \u003cdiv class=\"cardHeader\"\u003e\
                \u003cbutton class=\"filterPaneIcon delete\" ng-click=\"deleteFilter($event, viewModel)\" localize-tooltip=\"FilterPane_DeleteFilter\" ng-if=\"!viewModel.isAutoGenerated\"\u003e\u003c/button\u003e\
                \u003cspan ng-class=\"viewModel.readOnlyState.expanded ? \u0027expand\u0027 : \u0027collapse\u0027\"\u003e\u003c/span\u003e\
                \u003ch2 class=\"title trimmedTextWithEllipsis unselectable\" title=\"{{viewModel.displayName}}\"\u003e\
                    \u003cspan ng-bind=\"viewModel.displayName\"\u003e\u003c/span\u003e\
                    \u003cspan ng-if=\"!viewModel.restatement\" localize=\"FilterRestatement_All\"\u003e\u003c/span\u003e\
                \u003c/h2\u003e\
            \u003c/div\u003e\
            \u003cdiv class=\"controlPanel\" ng-if=\"viewModel.restatement\"\u003e\
                \u003cbutton class=\"filterPaneIcon clear\" ng-click=\"clearFilter($event, viewModel)\" localize-tooltip=\"FilterPane_ClearFilter\"\u003e\u003c/button\u003e\
                \u003ch2 class=\"restatement trimmedTextWithEllipsis\" title=\"{{viewModel.restatement}}\" ng-bind=\"viewModel.restatement\"\u003e\u003c/h2\u003e\
            \u003c/div\u003e\
        \u003c/div\u003e\
        \u003c!-- The following types correspond to the FilterType enum in contracts.ts --\u003e\
        \u003cdiv ng-switch=\"viewModel.readOnlyState.type\" ng-show=\"viewModel.readOnlyState.expanded\"\u003e\
            \u003ccategorical-filter view-model=\"viewModel\" ng-switch-when=\"0\"\u003e\u003c/categorical-filter\u003e\
            \u003crange-filter view-model=\"viewModel\" ng-switch-when=\"1\"\u003e\u003c/range-filter\u003e\
            \u003cadvanced-filter view-model=\"viewModel\" ng-switch-when=\"2\"\u003e\u003c/advanced-filter\u003e\
        \u003c/div\u003e\
        \u003cdiv class=\"cardFooter\" ng-if=\"viewModel.readOnlyState.canSwitchCardType\" ng-click=\"switchCardType($event, viewModel)\"\u003e\
            \u003cbutton class=\"filterPaneIcon\" ng-class=\"viewModel.readOnlyState.type === 2 ? \u0027switchTypeActive\u0027 : \u0027switchType\u0027\"\u003e\u003c/button\u003e\
            \u003cspan class=\"advancedCaption\" ng-class=\"{\u0027active\u0027: viewModel.readOnlyState.type === 2}\" localize=\"FilterPane_Advanced\"\u003e\u003c/span\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/li\u003e\
');
    t.put('views/filterPane.html', '\u003csection class=\"filterPane\"\u003e\
    \u003cdiv id=\"visualFilterContainer\" ng-if=\"(viewModeState.viewMode === 1 \u0026\u0026 viewModel.isVisualVisible) || (viewModeState.viewMode === 0 \u0026\u0026 viewModel.visualFilters.length)\"\u003e\
        \u003ch3 class=\"header unselectable\" localize=\"FilterPane_Visual\"\u003e\u003c/h3\u003e\
        \u003cdiv class=\"cards\"\u003e\
            \u003cul ng-repeat=\"filter in viewModel.visualFilters\"\u003e\
                \u003cfilter view-model=\"filter\"\u003e\u003c/filter\u003e\
            \u003c/ul\u003e\
            \u003cdiv id=\"visualfilter-drop\"\
                 ng-if=\"viewModeState.viewMode === 1\"\
                 drop=\"field\"\
                 class=\"unselectable\"\
                 ng-class=\"viewModel.visualFilters.length === 0 ? \u0027dropzone\u0027 : \u0027end-dropzone\u0027\"\u003e\
                {{viewModel.visualFilters.length === 0 ? viewModel.addFilterLabel : \u0027\u0027}}\
            \u003c/div\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
    \u003cdiv id=\"pageFilterContainer\" ng-if=\"viewModeState.alwaysPopulatePanes || viewModeState.viewMode === 1 || viewModel.pageFilters.length\"\u003e\
        \u003ch3 class=\"header unselectable\" localize=\"FilterPane_Page\"\u003e\u003c/h3\u003e\
        \u003cdiv class=\"cards\"\u003e\
            \u003cul ng-repeat=\"filter in viewModel.pageFilters\"\u003e\
                \u003cfilter view-model=\"filter\"\u003e\u003c/filter\u003e\
            \u003c/ul\u003e\
            \u003cdiv id=\"pagefilter-drop\"\
                 ng-if=\"viewModeState.alwaysPopulatePanes || viewModeState.viewMode === 1\"\
                 drop=\"field\"\
                 class=\"unselectable\"\
                 ng-class=\"viewModel.pageFilters.length === 0 ? \u0027dropzone\u0027 : \u0027end-dropzone\u0027\"\u003e\
                {{viewModel.pageFilters.length === 0 ? viewModel.addFilterLabel : \u0027\u0027}}\
            \u003c/div\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/section\u003e\
');
    t.put('views/inputField.html', '\u003cdiv class=\"flex\" ng-show=\"slice.show\" ng-switch=\"getSliceComponentType(slice)\"\u003e\
    \u003cdiv class=\"title item-auto\" ng-bind=\"slice.displayName\" ng-if=\"slice.name !== \u0027show\u0027 \u0026\u0026 slice.name !== \u0027gradientBar\u0027\"\u003e\u003c/div\u003e\
    \u003cinput class=\"inputFieldInSlice item-fill\" ng-class=\"{\u0027invalid\u0027: !slice.isValid}\" ng-change=\"save(slice, card)\" ng-model=\"slice.value\" type=\"text\" ng-switch-when=\"text\" value=\"{{slice.value}}\" placeholder=\"{{::slice.placeholder}}\" /\u003e\
    \u003cinput class=\"inputFieldInSlice item-fill\" ng-class=\"{\u0027invalid\u0027: !slice.isValid}\" ng-change=\"save(slice, card)\" ng-model=\"slice.value\" type=\"text\" ng-switch-when=\"numeric\" value=\"{{slice.value}}\" placeholder=\"{{::slice.placeholder}}\" /\u003e\
    \u003cdiv ng-switch-when=\"revertToDefault\" class=\"clearAll\" localize=\"Visual_RevertToDefault\" ng-click=\"save(slice, card)\"\u003e\u003c/div\u003e\
    \u003ctoggle-switch class=\"item-auto\" ng-switch-when=\"bool\"\u003e\u003c/toggle-switch\u003e\
    \u003cselection-box class=\"item-auto\" ng-switch-when=\"selection\"\u003e\u003c/selection-box\u003e\
    \u003cpercentage-slider class=\"item-auto\" ng-switch-when=\"percentageSlider\"\u003e\u003c/percentage-slider\u003e\
    \u003calignment-group class=\"item-auto\" ng-switch-when=\"alignment\"\u003e\u003c/alignment-group\u003e\
    \u003cnum-up-down class=\"item-auto\" ng-switch-when=\"numUpDown\"\u003e\u003c/num-up-down\u003e\
    \u003ccolor-picker class=\"item-auto\" ng-switch-when=\"fill\"\u003e\u003c/color-picker\u003e\
    \u003cgradient-bar class=\"item-auto\" ng-switch-when=\"gradientBar\"\u003e\u003c/gradient-bar\u003e\
\u003c/div\u003e\
');
    t.put('views/cardFooter.html', '\u003cdiv ng-repeat=\"slice in card.footer track by $index\"\u003e\
    \u003cinput-field class=\"inputField\" slice=\"slice\" card=\"card\" on-slice-change=\"save\" get-slice-component-type=\"getSliceComponentType\"\u003e\u003c/input-field\u003e\
\u003c/div\u003e\
');
    t.put('views/cardHeader.html', '\u003cdiv ng-repeat=\"slice in card.header track by $index\"\u003e\
    \u003cinput-field class=\"inputField\" slice=\"slice\" card=\"card\" on-slice-change=\"save\" get-slice-component-type=\"getSliceComponentType\"\u003e\u003c/input-field\u003e\
\u003c/div\u003e\
');
    t.put('views/propertyPane.html', '\u003csection class=\"propertyPane\"\u003e\
    \u003cdiv class=\"unavailable\" ng-if=\"!viewModel.cards || viewModel.cards.length === 0\" localize=\"PropertyPane_Unavailable\"\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"card\" ng-repeat=\"card in viewModel.cards track by $index\"\u003e\
        \u003cdiv class=\"cardTitle\" ng-click=\"setCurrentTab($index)\"\u003e\
            \u003cdiv class=\"cardTitleExpender arrowTop\" ng-class=\"{\u0027selected\u0027: (currentTab() === $index \u0026\u0026 (!card.mainShow || card.mainShow.value))}\"\u003e\u003c/div\u003e\
            \u003cdiv class=\"cardTitleDisplayName\" ng-bind=\"card.displayName\"\u003e\u003c/div\u003e\
            \u003cdiv class=\"cardTitleToggle\" ng-if=\"card.mainShow\"\u003e\
                \u003cinput-field class=\"inputField\"\u003e\u003c/input-field\u003e\
            \u003c/div\u003e\
        \u003c/div\u003e\
        \u003cdiv ng-if=\"currentTab() === $index \u0026\u0026 (!card.mainShow || card.mainShow.value)\"\u003e\
            \u003ccard-header\u003e\u003c/card-header\u003e\
            \u003cvirtual-list total-items-amount=\"{{card.slices.length}}\" init-limit=\"20\"\u003e\
                \u003cdiv class=\"card-slice\" ng-repeat=\"slice in card.slices | filter: {name: \u0027!show\u0027 }:true | limitTo:limitItems track by $index\"\u003e\
                    \u003cinput-field class=\"inputField\"\u003e\u003c/input-field\u003e\
                \u003c/div\u003e\
            \u003c/virtual-list\u003e\
            \u003ccard-footer\u003e\u003c/card-footer\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
\u003c/section\u003e\
');
    t.put('views/rangeFilter.html', '\u003cli class=\"filterContents\"\u003e\
    \u003cinput type=\"text\" class=\"minValueText\" ng-model=\"viewModel.minValue\" /\u003e to \u003cinput type=\"text\" class=\"maxValueText\" ng-model=\"viewModel.maxValue\"/\u003e\
    \u003cinput type=\"button\" ng-click=\"applyFilter($event, viewModel)\" value=\"Apply Filter\" /\u003e\
\u003c/li\u003e\
');
    t.put('views/svg/visualsWatermarks.svg', '\u003c?xml version=\"1.0\" encoding=\"utf-8\"?\u003e\
\u003c!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --\u003e\
\u003csvg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 479 492\" enable-background=\"new 0 0 479 492\" xml:space=\"preserve\"\u003e\
\u003csymbol id=\"100stackedbar\"\u003e\
\u003crect x=\"0\" y=\"0\" fill=\"#F4F4F4\" width=\"400\" height=\"299.8\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"93.1\" y1=\"0\" x2=\"93.1\" y2=\"299.5\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"199.7\" y1=\"0\" x2=\"199.7\" y2=\"299.3\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"298.6\" y1=\"0\" x2=\"298.6\" y2=\"299.5\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" fill=\"#E1E2E3\" width=\"380.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" fill=\"#E1E2E3\" width=\"380.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" fill=\"#E1E2E3\" width=\"380.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" fill=\"#E1E2E3\" width=\"380.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" fill=\"#E1E2E3\" width=\"380.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" fill=\"#D0D2D3\" width=\"313.6\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" fill=\"#D0D2D3\" width=\"284.9\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" fill=\"#D0D2D3\" width=\"318.8\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" fill=\"#D0D2D3\" width=\"308.6\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" fill=\"#D0D2D3\" width=\"278.6\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"211.1\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"186.2\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"211.1\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"200\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"184\" height=\"39\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"100stackedcolumn\"\u003e\
\u003crect x=\"-0.1\" y=\"-0.1\" fill=\"#F4F4F4\" width=\"400.1\" height=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"-0.1\" y1=\"73.4\" x2=\"400\" y2=\"73.4\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"-0.1\" y1=\"147.8\" x2=\"400\" y2=\"147.8\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"-0.1\" y1=\"222.3\" x2=\"400\" y2=\"222.3\"/\u003e\
\u003crect x=\"19\" y=\"20\" fill=\"#E1E2E3\" width=\"40.9\" height=\"280.1\"/\u003e\
\u003crect x=\"83.1\" y=\"20\" fill=\"#E1E2E3\" width=\"40.9\" height=\"280.1\"/\u003e\
\u003crect x=\"147.1\" y=\"20\" fill=\"#E1E2E3\" width=\"40.9\" height=\"280.1\"/\u003e\
\u003crect x=\"211.1\" y=\"20\" fill=\"#E1E2E3\" width=\"40.9\" height=\"280.1\"/\u003e\
\u003crect x=\"275.1\" y=\"20\" fill=\"#E1E2E3\" width=\"40.9\" height=\"280.1\"/\u003e\
\u003crect x=\"339.1\" y=\"20\" fill=\"#E1E2E3\" width=\"40.9\" height=\"280.1\"/\u003e\
\u003crect x=\"19\" y=\"104.6\" fill=\"#D0D2D3\" width=\"40.9\" height=\"195.5\"/\u003e\
\u003crect x=\"83.1\" y=\"58\" fill=\"#D0D2D3\" width=\"40.9\" height=\"242.1\"/\u003e\
\u003crect x=\"147.1\" y=\"94.6\" fill=\"#D0D2D3\" width=\"40.9\" height=\"205.5\"/\u003e\
\u003crect x=\"211.1\" y=\"99.5\" fill=\"#D0D2D3\" width=\"40.9\" height=\"200.6\"/\u003e\
\u003crect x=\"275.1\" y=\"60.6\" fill=\"#D0D2D3\" width=\"40.9\" height=\"239.5\"/\u003e\
\u003crect x=\"339.1\" y=\"136.5\" fill=\"#D0D2D3\" width=\"40.9\" height=\"163.6\"/\u003e\
\u003crect x=\"19\" y=\"197.6\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"102.5\"/\u003e\
\u003crect x=\"83.1\" y=\"173.2\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"126.9\"/\u003e\
\u003crect x=\"147.1\" y=\"192.3\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"107.8\"/\u003e\
\u003crect x=\"211.1\" y=\"184.7\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"115.4\"/\u003e\
\u003crect x=\"275.1\" y=\"162.3\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"137.8\"/\u003e\
\u003crect x=\"339.1\" y=\"206\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"94.1\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"area\"\u003e\
\u003crect x=\"0.1\" fill=\"#F4F4F4\" width=\"399.8\" height=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.7\" y1=\"73.5\" x2=\"399.8\" y2=\"73.5\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.7\" y1=\"147.9\" x2=\"399.8\" y2=\"147.9\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.7\" y1=\"222.4\" x2=\"399.8\" y2=\"222.4\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"-0.2\" y1=\"73.5\" x2=\"399.8\" y2=\"73.5\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"-0.1\" y1=\"147.9\" x2=\"399.8\" y2=\"147.9\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.7\" y1=\"222.4\" x2=\"399.8\" y2=\"222.4\"/\u003e\
\u003cg\u003e\
\t\u003cg\u003e\
\t\t\u003cg\u003e\
\t\t\t\u003cpolygon fill=\"#E1E2E3\" points=\"345.1,93.4 287.8,77 230.6,82.1 173.9,211.9 115.1,204.3 56.9,217.5 0.1,172.3 0.1,300 \
\t\t\t\t399.8,300 399.8,82.3 \t\t\t\"/\u003e\
\t\t\u003c/g\u003e\
\t\u003c/g\u003e\
\u003c/g\u003e\
\u003cg\u003e\
\t\u003cpolygon fill=\"#D0D2D3\" points=\"115.1,206.7 175,214.5 231.8,84.9 287.3,80 344.6,96.4 399.8,85.2 399.8,81.1 344.8,92.3 \
\t\t288.1,76.1 287.7,76 229,81.2 172.5,210.1 114.9,202.7 57.5,215.7 0.1,170.2 0.1,175.3 56.5,220 \t\"/\u003e\
\u003c/g\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"bar\"\u003e\
\u003crect y=\"0\" fill=\"#F4F4F4\" width=\"400\" height=\"299.8\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"93.1\" y1=\"0\" x2=\"93.1\" y2=\"299.5\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"199.7\" y1=\"0\" x2=\"199.7\" y2=\"299.3\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"298.6\" y1=\"0\" x2=\"298.6\" y2=\"299.5\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" fill=\"#D0D2D3\" width=\"179.9\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" fill=\"#D0D2D3\" width=\"253.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" fill=\"#D0D2D3\" width=\"224.6\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" fill=\"#D0D2D3\" width=\"311.1\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" fill=\"#D0D2D3\" width=\"367.2\" height=\"39\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"card\"\u003e\
\u003crect x=\"0\" y=\"0.3\" fill=\"#F4F4F4\" width=\"400\" height=\"299.6\"/\u003e\
\u003crect x=\"0\" y=\"0.3\" fill=\"#A6A6A6\" width=\"8\" height=\"299.6\"/\u003e\
\u003crect x=\"221.6\" y=\"42.2\" fill=\"#A6A6A6\" width=\"139.9\" height=\"4\"/\u003e\
\u003crect x=\"221.6\" y=\"109.7\" fill=\"#A6A6A6\" width=\"139.9\" height=\"4\"/\u003e\
\u003crect x=\"221.6\" y=\"180\" fill=\"#A6A6A6\" width=\"141.7\" height=\"4\"/\u003e\
\u003crect x=\"221.6\" y=\"249.5\" fill=\"#A6A6A6\" width=\"141.7\" height=\"4\"/\u003e\
\u003crect x=\"34.1\" y=\"41.8\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"142\" height=\"142\"/\u003e\
\u003crect x=\"36.1\" y=\"249.5\" fill=\"#A6A6A6\" width=\"141.7\" height=\"4\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"column\"\u003e\
\u003crect x=\"0\" fill=\"#F4F4F4\" width=\"400.1\" height=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"73.5\" x2=\"400\" y2=\"73.5\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"147.9\" x2=\"400\" y2=\"147.9\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"222.4\" x2=\"400\" y2=\"222.4\"/\u003e\
\u003crect x=\"19.1\" y=\"193.3\" fill=\"#D0D2D3\" width=\"40.9\" height=\"106.9\"/\u003e\
\u003crect x=\"83.1\" y=\"167.8\" fill=\"#D0D2D3\" width=\"40.9\" height=\"132.4\"/\u003e\
\u003crect x=\"147.1\" y=\"187.8\" fill=\"#D0D2D3\" width=\"40.9\" height=\"112.4\"/\u003e\
\u003crect x=\"211.2\" y=\"82.1\" fill=\"#D0D2D3\" width=\"40.9\" height=\"218.1\"/\u003e\
\u003crect x=\"275.2\" y=\"39.9\" fill=\"#D0D2D3\" width=\"40.9\" height=\"260.3\"/\u003e\
\u003crect x=\"339.2\" y=\"122.3\" fill=\"#D0D2D3\" width=\"40.9\" height=\"177.9\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"combo\"\u003e\
\u003crect x=\"0\" y=\"0.3\" fill=\"#F4F4F4\" width=\"399.8\" height=\"299.7\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"73.4\" x2=\"399.7\" y2=\"73.4\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"147.9\" x2=\"399.7\" y2=\"147.9\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"222.3\" x2=\"399.7\" y2=\"222.3\"/\u003e\
\u003crect x=\"20.4\" y=\"189.5\" fill=\"#D0D2D3\" width=\"40.7\" height=\"110.6\"/\u003e\
\u003crect x=\"84.1\" y=\"163.1\" fill=\"#D0D2D3\" width=\"40.7\" height=\"137\"/\u003e\
\u003crect x=\"147.9\" y=\"183.8\" fill=\"#D0D2D3\" width=\"40.7\" height=\"116.4\"/\u003e\
\u003crect x=\"211.6\" y=\"74.4\" fill=\"#D0D2D3\" width=\"40.7\" height=\"225.8\"/\u003e\
\u003crect x=\"275.3\" y=\"30.7\" fill=\"#D0D2D3\" width=\"40.7\" height=\"269.5\"/\u003e\
\u003crect x=\"339\" y=\"116.1\" fill=\"#D0D2D3\" width=\"40.7\" height=\"184.1\"/\u003e\
\u003cpolyline opacity=\"0.5\" fill=\"none\" stroke=\"#A6A8AB\" stroke-width=\"4\" stroke-miterlimit=\"10\" points=\"399.3,95.6 344.1,106.8 \
\t287.4,90.5 230.7,95.6 174.6,224.8 116.4,217.1 58.8,230.3 2.4,185.2 \"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"defaultWatermark\"\u003e\
  \u003cg\u003e\
    \u003ctitle\u003e\
      Layer 1\
    \u003c/title\u003e\
    \u003crect x=\"0\" y=\"1\" opacity=\"0.5\" fill=\"#F4F4F4\" width=\"400\" height=\"300\"/\u003e\
    \u003cpath fill=\"#929497\" d=\"m93.79999 69.79999v47l30.20001 36.09998c10.29999-8.59998 16.79999-21.59998 16.79999-36.09998l0 0c0-25.89999-21.09998-47-47-47z\"/\u003e\
    \u003cpath fill=\"#D0D2D3\" d=\"m46.7 116.9c0 22.1 15.3 40.49999 35.6 45.7l11.39999-45.7h-47l0 0 0 0z\"/\u003e\
    \u003cpath fill=\"#E1E2E3\" d=\"m93.79999 116.89999l-11.39999 45.69999c3.69998 0.90001 7.39999 1.5 11.39999 1.5 11.5 0 22-4.09999 30.20001-11l-30.20001-36.19999z\"/\u003e\
    \u003cpath fill=\"#A6A8AB\" d=\"m93.79999 69.79999c-25.99998 0-46.99998 21-46.99998 47l0 0h46.99998v-47l0 0z\"/\u003e\
    \u003cg\u003e\
      \u003cpolygon fill=\"#E1E2E3\" points=\"200.89999389648438 193.5999755859375 167.70001220703125 185.0999755859375 134.29998779296875 187.70001220703125 101.29998779296875 254.9000244140625 67.10000610351562 251 33.30000305175781 257.79998779296875 0.1999969482421875 234.4000244140625 0.1999969482421875 300.5 399.9000244140625 300.5 399.9000244140625 187.9000244140625 349.20001220703125 182.0999755859375 314.1000061035156 194.5999755859375 286.8999938964844 191.0999755859375 242 214.5 \"/\u003e\
    \u003c/g\u003e\
    \u003cg\u003e\
      \u003cpolyline fill=\"none\" stroke=\"#D0D2D3\" stroke-width=\"2\" stroke-miterlimit=\"10\" points=\"399.9000244140625 187.70001220703125 349.20001220703125 182.0999755859375 314.1000061035156 194.5999755859375 286.8999938964844 191.0999755859375 242 214.5 200.89999389648438 193.4000244140625 167.70001220703125 185 134.29998779296875 187.5999755859375 101.29998779296875 254.79998779296875 67.10000610351562 251 33.30000305175781 257.70001220703125 0.1999969482421875 234.4000244140625 \"/\u003e\
    \u003c/g\u003e\
    \u003crect x=\"185.6\" y=\"115.9\" fill=\"#E1E2E3\" width=\"20.7\" height=\"48\"/\u003e\
    \u003crect x=\"217.8\" y=\"104.4\" fill=\"#E1E2E3\" width=\"20.7\" height=\"59.5\"/\u003e\
    \u003crect x=\"250.1\" y=\"113.4\" fill=\"#E1E2E3\" width=\"20.7\" height=\"50.5\"/\u003e\
    \u003crect x=\"282.3\" y=\"66\" fill=\"#E1E2E3\" width=\"20.7\" height=\"97.9\"/\u003e\
    \u003crect x=\"314.6\" y=\"47\" fill=\"#E1E2E3\" width=\"20.7\" height=\"116.9\"/\u003e\
    \u003crect x=\"346.8\" y=\"84\" fill=\"#E1E2E3\" width=\"20.7\" height=\"79.9\"/\u003e\
    \u003crect x=\"185.6\" y=\"129.5\" fill=\"#D0D2D3\" width=\"20.7\" height=\"34.4\"/\u003e\
    \u003crect x=\"217.8\" y=\"121.2\" fill=\"#D0D2D3\" width=\"20.7\" height=\"42.7\"/\u003e\
    \u003crect x=\"250.1\" y=\"127.7\" fill=\"#D0D2D3\" width=\"20.7\" height=\"36.1\"/\u003e\
    \u003crect x=\"282.3\" y=\"93.7\" fill=\"#D0D2D3\" width=\"20.7\" height=\"70.2\"/\u003e\
    \u003crect x=\"314.6\" y=\"80.1\" fill=\"#D0D2D3\" width=\"20.7\" height=\"83.8\"/\u003e\
    \u003crect x=\"346.8\" y=\"106.6\" fill=\"#D0D2D3\" width=\"20.7\" height=\"57.2\"/\u003e\
    \u003crect x=\"185.6\" y=\"145.1\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"20.7\" height=\"18.7\"/\u003e\
    \u003crect x=\"217.8\" y=\"140.7\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"20.7\" height=\"23.2\"/\u003e\
    \u003crect x=\"250.1\" y=\"144.1\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"20.7\" height=\"19.7\"/\u003e\
    \u003crect x=\"282.3\" y=\"125.6\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"20.7\" height=\"38.2\"/\u003e\
    \u003crect x=\"314.6\" y=\"118.3\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"20.7\" height=\"45.6\"/\u003e\
    \u003crect x=\"346.8\" y=\"132.7\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"20.7\" height=\"31.1\"/\u003e\
  \u003c/g\u003e\
\u003c/symbol\u003e\
  \
\u003csymbol id=\"donut\"\u003e\
\u003crect x=\"1.3\" y=\"0.2\" fill=\"#F4F4F4\" width=\"398.7\" height=\"299.8\"/\u003e\
\u003cpath fill=\"#929497\" d=\"M200.6,55.6v94.5l60.6,72.5c20.7-17.3,33.9-43.4,33.9-72.5v0C295.1,97.9,252.8,55.6,200.6,55.6z\"/\u003e\
\u003cpath fill=\"#D0D2D3\" d=\"M106.1,150.1c0,44.3,30.5,81.4,71.6,91.7l22.9-91.7H106.1z\"/\u003e\
\u003cpath fill=\"#E1E2E3\" d=\"M200.6,150.1l-22.9,91.7c7.3,1.8,15,2.8,22.9,2.8c23.1,0,44.2-8.3,60.6-22L200.6,150.1z\"/\u003e\
\u003cpath fill=\"#A6A8AB\" d=\"M200.6,55.6c-52.2,0-94.5,42.3-94.5,94.5v0h94.5V55.6z\"/\u003e\
\u003ccircle fill=\"#F4F4F4\" cx=\"200.6\" cy=\"151\" r=\"53.4\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"funnel\"\u003e\
\u003crect x=\"1.3\" y=\"0\" fill=\"#F4F4F4\" width=\"398.7\" height=\"300\"/\u003e\
\u003cg\u003e\
\t\u003cg\u003e\
\t\t\u003cg\u003e\
\t\t\t\u003crect x=\"46.5\" y=\"59.7\" fill=\"#D0D2D3\" width=\"317.6\" height=\"33.9\"/\u003e\
\t\t\u003c/g\u003e\
\t\t\u003cg\u003e\
\t\t\t\u003crect x=\"82.7\" y=\"97.9\" fill=\"#D0D2D3\" width=\"245.2\" height=\"33.9\"/\u003e\
\t\t\u003c/g\u003e\
\t\t\u003cg\u003e\
\t\t\t\u003crect x=\"141.2\" y=\"136.2\" fill=\"#D0D2D3\" width=\"128.3\" height=\"33.9\"/\u003e\
\t\t\u003c/g\u003e\
\t\t\u003cg\u003e\
\t\t\t\u003crect x=\"181.2\" y=\"174.4\" fill=\"#D0D2D3\" width=\"48.3\" height=\"33.9\"/\u003e\
\t\t\u003c/g\u003e\
\t\t\u003cg\u003e\
\t\t\t\u003crect x=\"194.1\" y=\"212.6\" fill=\"#D0D2D3\" width=\"23.4\" height=\"33.9\"/\u003e\
\t\t\u003c/g\u003e\
\t\u003c/g\u003e\
\u003c/g\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"gauge\"\u003e\
\u003crect y=\"0.4\" opacity=\"0.5\" fill=\"#F4F4F4\" width=\"400.1\" height=\"299.6\"/\u003e\
\u003cpath fill=\"#E1E2E3\" d=\"M200,82.3c-73.7,0-133.4,59.7-133.4,133.4h51.6c0-45.2,36.6-81.8,81.8-81.8s81.8,36.6,81.8,81.8h51.6\
\tC333.4,142,273.7,82.3,200,82.3z\"/\u003e\
\u003crect x=\"280.7\" y=\"165.2\" transform=\"matrix(0.9548 -0.2973 0.2973 0.9548 -36.2329 96.1216)\" fill=\"#676868\" width=\"34.4\" height=\"4\"/\u003e\
\u003cpath fill=\"#A6A8AB\" d=\"M94.4,134.3C77,156.8,66.7,185,66.7,215.7h51.6c0-18.9,6.4-36.2,17.1-50.1L94.4,134.3z\"/\u003e\
\u003cg\u003e\
\t\u003ctext transform=\"matrix(1 0 0 1 152.9638 216.0626)\" fill=\"#A6A8AB\" font-family=\"\u0027DIN1451\u0027\" font-size=\"38.4954\"\u003e200M\u003c/text\u003e\
\u003c/g\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"line\"\u003e\
\u003crect x=\"0.1\" fill=\"#F4F4F4\" width=\"399.3\" height=\"300.2\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.1\" y1=\"73\" x2=\"399.4\" y2=\"73\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.1\" y1=\"147\" x2=\"399.4\" y2=\"147\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.1\" y1=\"220.9\" x2=\"399.4\" y2=\"220.9\"/\u003e\
\u003cg\u003e\
\t\u003cpolygon fill=\"#D0D2D3\" points=\"115.1,206.7 175,214.5 231.8,84.9 287.3,80 344.6,96.4 399.8,85.2 399.8,81.1 344.8,92.3 \
\t\t288.1,76.1 287.7,76 229,81.2 172.5,210.1 114.9,202.7 57.5,215.7 0.1,170.2 0.1,175.3 56.5,220 \t\"/\u003e\
\u003c/g\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"matrix\"\u003e\
\u003crect x=\"0\" y=\"0.1\" fill=\"#F4F4F4\" width=\"400\" height=\"299.9\"/\u003e\
\u003crect x=\"0.3\" y=\"0\" fill=\"#E1E2E3\" width=\"92.8\" height=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"93.1\" y1=\"0\" x2=\"93.1\" y2=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"199.7\" y1=\"0.5\" x2=\"199.7\" y2=\"299.8\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"298.6\" y1=\"0\" x2=\"298.6\" y2=\"300\"/\u003e\
\u003crect x=\"14.7\" y=\"46.4\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"46.4\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"46.4\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"46.4\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"79.7\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"79.7\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"79.7\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"79.7\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"114\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"114\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"114\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"114\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"148.5\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"148.5\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"148.5\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"148.5\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"182.3\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"182.3\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"182.3\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"182.3\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"215.3\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"215.3\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"215.3\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"215.3\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"248.6\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"248.6\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"248.6\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"248.6\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"281.5\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"281.5\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"281.5\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"281.5\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"14.7\" y=\"15.2\" fill=\"#A6A6A6\" width=\"61.2\" height=\"3.1\"/\u003e\
\u003crect x=\"108.8\" y=\"15.2\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"212.2\" y=\"15.2\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"311.1\" y=\"15.2\" fill=\"#A6A6A6\" width=\"76.8\" height=\"3.1\"/\u003e\
\u003crect x=\"0\" y=\"0\" fill=\"#D0D2D3\" width=\"399.8\" height=\"30.4\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"pie\"\u003e\
\u003crect y=\"0.2\" fill=\"#F4F4F4\" width=\"400\" height=\"299.8\"/\u003e\
\u003cpath fill=\"#929497\" d=\"M200,55.3v94.8l60.8,72.7c20.8-17.4,34-43.5,34-72.7v0C294.8,97.7,252.3,55.3,200,55.3z\"/\u003e\
\u003cpath fill=\"#D0D2D3\" d=\"M105.2,150.1c0,44.4,30.6,81.7,71.8,92l23-92H105.2z\"/\u003e\
\u003cpath fill=\"#E1E2E3\" d=\"M200,150.1l-23,92c7.4,1.8,15.1,2.8,23,2.8c23.1,0,44.3-8.3,60.8-22.1L200,150.1z\"/\u003e\
\u003cpath fill=\"#A6A8AB\" d=\"M200,55.3c-52.3,0-94.8,42.4-94.8,94.8v0H200V55.3z\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"scatterplot\"\u003e\
\u003crect x=\"1.3\" y=\"0\" fill=\"#F4F4F4\" width=\"398.7\" height=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"133.9\" y1=\"0.4\" x2=\"133.9\" y2=\"298\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"266.9\" y1=\"0.4\" x2=\"266.9\" y2=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"149.8\" x2=\"400\" y2=\"149.8\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"74.9\" cy=\"214.1\" r=\"36.2\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"186\" cy=\"94\" r=\"12.9\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"266.9\" cy=\"124.1\" r=\"17.2\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"310.4\" cy=\"193.8\" r=\"26.3\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"214.5\" cy=\"176.3\" r=\"18.6\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"137\" cy=\"150.2\" r=\"12.9\"/\u003e\
\u003ccircle fill=\"#D0D2D3\" cx=\"346.4\" cy=\"68.1\" r=\"12.9\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"stackedbar\"\u003e\
\u003crect y=\"0\" fill=\"#F4F4F4\" width=\"400\" height=\"299.8\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"93.1\" y1=\"0\" x2=\"93.1\" y2=\"299.5\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"199.7\" y1=\"0\" x2=\"199.7\" y2=\"299.3\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"298.6\" y1=\"0\" x2=\"298.6\" y2=\"299.5\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" fill=\"#E1E2E3\" width=\"179.9\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" fill=\"#E1E2E3\" width=\"253.4\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" fill=\"#E1E2E3\" width=\"224.6\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" fill=\"#E1E2E3\" width=\"311.1\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" fill=\"#E1E2E3\" width=\"367.2\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" fill=\"#D0D2D3\" width=\"138.7\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" fill=\"#D0D2D3\" width=\"195.3\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" fill=\"#D0D2D3\" width=\"173.1\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" fill=\"#D0D2D3\" width=\"239.8\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" fill=\"#D0D2D3\" width=\"283\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"20.6\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"90.2\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"74.7\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"127\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"129.8\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"112.5\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"184\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"155.9\" height=\"39\"/\u003e\
\u003crect x=\"0\" y=\"241\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"184\" height=\"39\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"stackedcolumn\"\u003e\
\u003crect x=\"0.2\" y=\"-0.1\" fill=\"#F4F4F4\" width=\"400.1\" height=\"300\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.2\" y1=\"73.4\" x2=\"400.2\" y2=\"73.4\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.2\" y1=\"147.9\" x2=\"400.2\" y2=\"147.9\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0.2\" y1=\"222.3\" x2=\"400.2\" y2=\"222.3\"/\u003e\
\u003crect x=\"19.3\" y=\"193.2\" fill=\"#E1E2E3\" width=\"40.9\" height=\"106.9\"/\u003e\
\u003crect x=\"83.3\" y=\"167.7\" fill=\"#E1E2E3\" width=\"40.9\" height=\"132.4\"/\u003e\
\u003crect x=\"147.3\" y=\"187.7\" fill=\"#E1E2E3\" width=\"40.9\" height=\"112.4\"/\u003e\
\u003crect x=\"211.3\" y=\"82\" fill=\"#E1E2E3\" width=\"40.9\" height=\"218.1\"/\u003e\
\u003crect x=\"275.4\" y=\"39.8\" fill=\"#E1E2E3\" width=\"40.9\" height=\"260.3\"/\u003e\
\u003crect x=\"339.4\" y=\"122.3\" fill=\"#E1E2E3\" width=\"40.9\" height=\"177.9\"/\u003e\
\u003crect x=\"19.3\" y=\"219.2\" fill=\"#D0D2D3\" width=\"40.9\" height=\"80.9\"/\u003e\
\u003crect x=\"83.3\" y=\"199.9\" fill=\"#D0D2D3\" width=\"40.9\" height=\"100.2\"/\u003e\
\u003crect x=\"147.3\" y=\"215.1\" fill=\"#D0D2D3\" width=\"40.9\" height=\"85\"/\u003e\
\u003crect x=\"211.3\" y=\"129.8\" fill=\"#D0D2D3\" width=\"40.9\" height=\"170.3\"/\u003e\
\u003crect x=\"275.4\" y=\"103.2\" fill=\"#D0D2D3\" width=\"40.9\" height=\"197\"/\u003e\
\u003crect x=\"339.4\" y=\"165.6\" fill=\"#D0D2D3\" width=\"40.9\" height=\"134.6\"/\u003e\
\u003crect x=\"19.3\" y=\"254\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"46.1\"/\u003e\
\u003crect x=\"83.3\" y=\"243\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"57.1\"/\u003e\
\u003crect x=\"147.3\" y=\"251.6\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"48.5\"/\u003e\
\u003crect x=\"211.3\" y=\"206.1\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"94.1\"/\u003e\
\u003crect x=\"275.4\" y=\"187.8\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"112.3\"/\u003e\
\u003crect x=\"339.4\" y=\"223.4\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"40.9\" height=\"76.7\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"table\"\u003e\
\u003crect x=\"0\" y=\"0\" fill=\"#F4F4F4\" width=\"399.8\" height=\"265.4\"/\u003e\
\u003crect x=\"0\" y=\"0\" fill=\"#D0D2D3\" width=\"399.8\" height=\"30.1\"/\u003e\
\u003crect x=\"14.4\" y=\"46.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"46.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"46.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"46.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"64.8\" x2=\"400\" y2=\"64.8\"/\u003e\
\u003crect x=\"14.4\" y=\"79.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"79.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"79.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"79.6\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"98.6\" x2=\"399.3\" y2=\"98.6\"/\u003e\
\u003crect x=\"14.4\" y=\"113.4\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"113.4\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"113.4\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"113.4\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"132.7\" x2=\"400\" y2=\"132.7\"/\u003e\
\u003crect x=\"14.4\" y=\"147.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"147.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"147.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"147.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"166.2\" x2=\"400\" y2=\"166.2\"/\u003e\
\u003crect x=\"14.4\" y=\"181\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"181\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"181\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"181\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"198.8\" x2=\"400\" y2=\"198.8\"/\u003e\
\u003crect x=\"14.4\" y=\"213.7\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"213.7\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"213.7\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"213.7\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"231.7\" x2=\"400\" y2=\"231.7\"/\u003e\
\u003crect x=\"14.4\" y=\"246.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"246.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"246.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"246.5\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"0\" y=\"265.4\" fill=\"#F4F4F4\" width=\"399.3\" height=\"34.6\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"265.4\" x2=\"400\" y2=\"265.4\"/\u003e\
\u003crect x=\"14.4\" y=\"281.1\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"111.4\" y=\"281.1\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"208.5\" y=\"281.1\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003crect x=\"304.8\" y=\"281.1\" fill=\"#A6A6A6\" width=\"76.7\" height=\"3.1\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"tree\"\u003e\
\u003crect x=\"204.3\" y=\"0\" fill=\"#E1E2E3\" width=\"195.3\" height=\"150\"/\u003e\
\u003crect x=\"0\" y=\"0\" fill=\"#D0D2D3\" width=\"204.3\" height=\"150\"/\u003e\
\u003crect x=\"0\" y=\"150\" fill=\"#E1E2E3\" width=\"180.9\" height=\"79.6\"/\u003e\
\u003crect x=\"0\" y=\"229.6\" fill=\"#A6A8AB\" width=\"180.9\" height=\"70.4\"/\u003e\
\u003crect x=\"180.9\" y=\"150\" fill=\"#F4F4F4\" width=\"121.1\" height=\"103.8\"/\u003e\
\u003crect x=\"302\" y=\"150\" opacity=\"0.5\" fill=\"#A6A8AB\" width=\"97.7\" height=\"103.8\"/\u003e\
\u003crect x=\"180.9\" y=\"253.8\" fill=\"#E1E2E3\" width=\"218.8\" height=\"46.2\"/\u003e\
\u003c/symbol\u003e\
\
\u003csymbol id=\"waterfall\"\u003e\
\u003crect y=\"-0.5\" fill=\"#F4F4F4\" width=\"399.5\" height=\"300.5\"/\u003e\
\u003cline fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"72.8\" x2=\"399.5\" y2=\"72.8\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"147.5\" x2=\"399.5\" y2=\"147.5\"/\u003e\
\u003cline fill=\"#D0D2D3\" stroke=\"#FFFFFF\" stroke-width=\"2\" stroke-miterlimit=\"10\" x1=\"0\" y1=\"222.2\" x2=\"399.5\" y2=\"222.2\"/\u003e\
\u003crect x=\"19.4\" y=\"189.3\" fill=\"#D0D2D3\" width=\"41\" height=\"65.3\"/\u003e\
\u003crect x=\"83.2\" y=\"118.3\" fill=\"#D0D2D3\" width=\"41\" height=\"72.9\"/\u003e\
\u003crect x=\"147.6\" y=\"44.6\" fill=\"#D0D2D3\" width=\"41\" height=\"75.8\"/\u003e\
\u003crect x=\"211.6\" y=\"118.3\" fill=\"#D0D2D3\" width=\"41\" height=\"84.7\"/\u003e\
\u003crect x=\"275.7\" y=\"161.8\" fill=\"#D0D2D3\" width=\"41\" height=\"41.3\"/\u003e\
\u003crect x=\"339.8\" y=\"161.8\" fill=\"#D0D2D3\" width=\"41\" height=\"98.3\"/\u003e\
\u003crect x=\"186.1\" y=\"118.3\" fill=\"#D0D2D3\" width=\"25.7\" height=\"2\"/\u003e\
\u003crect x=\"124.1\" y=\"118.3\" fill=\"#D0D2D3\" width=\"25.7\" height=\"2\"/\u003e\
\u003crect x=\"250.9\" y=\"201.1\" fill=\"#D0D2D3\" width=\"25.7\" height=\"2\"/\u003e\
\u003crect x=\"315.9\" y=\"161.8\" fill=\"#D0D2D3\" width=\"25.7\" height=\"2\"/\u003e\
\u003crect x=\"58.4\" y=\"189.3\" fill=\"#D0D2D3\" width=\"25.7\" height=\"2\"/\u003e\
\u003c/symbol\u003e\
\
\u003c/svg\u003e\
');
    t.put('views/visualTypesContainer.html', '\u003cdiv class=\"visual-types-container\"\u003e\
    \u003cbutton class=\"visual-container-icon\" ng-repeat=\"visual in viewModel.visuals track by visual.name\" ng-class=\"{\u0027active\u0027: isVisualActive(visual)}\" ng-disabled=\"!isVisualEnabled(visual)\" ng-click=\"visualAction(visual)\" localize-tooltip=\"{{::visual.title}}\"\u003e\
        \u003cspan class=\"visual-icon {{::visual.class}}\" ng-class=\"{\u0027disabled\u0027: !isVisualEnabled(visual)}\"\u003e\u003c/span\u003e\
    \u003c/button\u003e\
\u003c/div\u003e\
');
    t.put('views/taskPane.html', '\u003carticle class=\"taskPane sidePane rightSidePane\" ng-class=\"{ isCollapsed: !viewModel.isPaneExpanded }\" modeling-context-changer\u003e\
    \u003cdiv class=\"paneHeader\"\u003e\
        \u003cbutton class=\"toggleBtn\" ng-class=\"{ isCollapsed: !viewModel.isPaneExpanded }\" ng-click=\"toggleTaskPane()\"\u003e\
            \u003cdiv class=\"BtnIcon glyphicon pbi-glyph-chevronrightmedium glyph-mini\" localize-tooltip=\"TaskPane_Toggle\"\u003e\u003c/div\u003e\
        \u003c/button\u003e\
        \u003cdiv class=\"taskPaneTitle\" ng-if=\"viewModel.isPaneExpanded\"\u003e\
            \u003ch2 class=\"taskPaneTab fieldsTab\" localize=\"TaskPane_Fields\"\u003e\u003c/h2\u003e\
        \u003c/div\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"paneContents\" ng-if=\"viewModel.isPaneExpanded\"\u003e\
        \u003cfield-list\u003e\u003c/field-list\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"verticalTitle\"\u003e\
        \u003ch2 localize=\"TaskPane_Fields\"\u003e\u003c/h2\u003e\
    \u003c/div\u003e\
\u003c/article\u003e\
');
    t.put('views/visualContainer.html', '\u003cdiv class=\"visualContainer unselectable\"\
     drop=\"field\"\
     ng-click=\"toggleSelect($event)\"\
     ng-class=\"{selected: viewModel.isSelected, \u0027invalid\u0027: viewModel.errorInfo.showVisualOverlay, \u0027reading\u0027: viewModeState.viewMode === 0}\"\
     ng-keyup=\"keyUp($event)\"\
     apply-style=\"::viewModel.readOnlyState.style\"\
     ng-style=\"{ \u0027background-color\u0027: viewModel.visualBackground.colorRGB}\"\
     tabindex=\"-1\"\
     drag-resize\
     drag-resize-disabled=\"{{viewModel.disableResize || viewModeState.viewMode === 0 || hasPositionOverride()}}\"\u003e\
    \u003ctoolbar-overlay\u003e\u003c/toolbar-overlay\u003e\
    \u003c!-- drag-resize manipulation is disabled for reading mode as well as override/responsive layouts --\u003e\
    \u003c!-- container header --\u003e\
    \u003cdiv class=\"vcHeader\"\u003e\
        \u003ci class=\"dragGrip glyphicon pbi-glyph-gripperbarhorizontal glyph-small\"\u003e\u003c/i\u003e\
    \u003cdiv class=\"optionsMenu\"\u003e\
            \u003cbutton class=\"vcPinBtn\" ng-click=\"pinVisualContainer($event);\" ng-if=\"viewModeState.supportsPinning\" localize-tooltip=\"PinVisual_ToolTip\"\u003e\
                \u003ci class=\"glyphicon pbi-glyph-pinned glyph-small\"\u003e\u003c/i\u003e\
            \u003c/button\u003e\u003c!--\
            --\u003e\u003cbutton class=\"vcMenuBtn\" dropdown-overlay-invoke=\"vcMenu{{::$id}}\" localize-tooltip=\"Options_Menu\" ng-hide=\"viewModeState.viewMode === 0 \u0026\u0026 showSortMenu()\"\u003e\
                \u003ci class=\"glyphicon pbi-glyph-more glyph-small\"\u003e\u003c/i\u003e\
                    \u003c/button\u003e\
                        \u003c/div\u003e\
                    \u003c/div\u003e\
    \u003c!-- container body layout --\u003e\
    \u003cdiv class=\"vcBody\" ng-switch=\"viewModel.showWatermark\"\u003e\
        \u003cdiv class=\"visualTitle\" ng-switch-when=\"false\" ng-if=\"viewModel.supportsTitle\" title=\"{{viewModel.visualTitle.text}}\" ng-bind=\"viewModel.visualTitle.text\" ng-style=\"{\u0027color\u0027: viewModel.visualTitle.fontColor, \u0027background-color\u0027: viewModel.visualTitle.background, \u0027text-align\u0027: viewModel.visualTitle.alignment, \u0027visibility\u0027: viewModel.showVisualTitle ? \u0027visible\u0027 : \u0027hidden\u0027}\"\u003e\u003c/div\u003e\
        \u003cvisual ng-switch-when=\"false\" view-model=\"viewModel.readOnlyState.visual\" allow-deferred-rendering=\"::viewModel.allowDeferredRendering\"\u003e\u003c/visual\u003e\
        \u003cvisual-watermark ng-switch-when=\"true\" visual-type=\"::viewModel.contract.config.singleVisual.visualType\"\u003e \u003c/visual-watermark\u003e\
\
    \u003cdiv class=\"errorBar\" ng-if=\"viewModel.errorInfo.details\" ng-class=\"{\u0027expanded\u0027: viewModel.isErrorMessageVisible}\"\u003e\
        \u003cdiv\u003e\
            \u003cdiv class=\"errorIconContainer\" ng-class=\"{\u0027expanded\u0027: viewModel.isErrorMessageVisible}\"\u003e\
                \u003cdiv class=\"errorIcon\" ng-click=\"toggleErrorMessage()\" /\u003e\
            \u003c/div\u003e\
            \u003cdiv class=\"errorMessage\" ng-show=\"viewModel.isErrorMessageVisible\"\u003e\
                \u003cspan ng-bind=\"viewModel.errorInfo.details.message\" /\u003e\
                \u003ca localize=\"VisualContainer_ShowErrorDetails\" class=\"errorSeeMore\" href ng-click=\"showErrorDetails()\" /\u003e\
            \u003c/div\u003e\
            \u003c!-- Button is temporary until Scott get the button --\u003e\
            \u003cdiv ng-click=\"fixReferences()\" ng-if=\"viewModel.errorInfo \u0026\u0026 viewModel.errorInfo.canFixReferences\" localize-tooltip=\"FixReferences_ToolTip\" localize=\"Fix_This\"\u003e\
            \u003c/div\u003e\
\
        \u003c/div\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"centeredSpinner\" ng-class=\"{ \u0027loading\u0027: viewModel.showSpinner, \u0027ready\u0027: !viewModel.showSpinner}\"\u003e\
        \u003cspinner\u003e\u003c/spinner\u003e\
    \u003c/div\u003e\
    \u003c/div\u003e\
    \u003c!-- vc options menu --\u003e\
    \u003cdropdown-overlay dropdown-overlay-name=\"vcMenu{{::$id}}\" class=\"vcOptionsMenu\"\u003e\
        \u003cul ng-if=\"(viewModeState.viewMode === 0 \u0026\u0026 showSortMenu()) === false\"\u003e\
            \u003cli class=\"sortMenuItem\" ng-hide=\"showSortMenu()\" localize-tooltip=\"Sort_ToolTip\"\u003e\
                \u003cbutton class=\"toggleSortBtn\" ng-disabled=\"!viewModel.readOnlyState.actualSortDirection\" ng-click=\"toggleSort($event)\"\u003e\
                    \u003cspan class=\"itemIcon visual-icon\" ng-class=\"{\u0027sort-asc\u0027: viewModel.readOnlyState.actualSortDirection !== 2, \u0027sort-desc\u0027: viewModel.readOnlyState.actualSortDirection === 2}\"\u003e\u003c/span\u003e\
                \u003c/button\u003e\
                \u003cbutton class=\"toggleSortSubMenuBtn\" ng-click=\"sortSetting.sortMenuDropdown = !sortSetting.sortMenuDropdown\"\u003e\
                    \u003cspan class=\"itemLabel\" localize=\"Sort_SortBy\"\u003e\u003c/span\u003e\
                    \u003ci class=\"itemIcon glyphicon pbi-glyph-caretdown glyph-mini\"\u003e\u003c/i\u003e\
                \u003c/button\u003e\
                \u003cul class=\"sortMenuDropdown\" ng-show=\"sortSetting.sortMenuDropdown\"\u003e\
                    \u003cli ng-repeat=\"sortableField in sortSetting.sortableFields\"\
                        ng-class=\"{\u0027selected\u0027: sortableField.active}\"\
                        ng-click=\"toggleSort($event, sortableField)\"\
                        ng-bind=\"::sortableField.displayName\"\u003e\
                    \u003c/li\u003e\
                \u003c/ul\u003e\
            \u003c/li\u003e\
            \u003cli ng-if=\"viewModeState.viewMode === 1 \u0026\u0026 viewModeState.supportsDeletion\" ng-click=\"deleteVisualContainer($event);\"\u003e\
                \u003ci class=\"itemIcon glyphicon pbi-glyph-close glyph-mini\"\u003e\u003c/i\u003e\
                \u003cspan class=\"itemLabel\" localize-tooltip=\"Remove_ToolTip\" localize=\"Remove_visual\"\u003e\u003c/span\u003e\
            \u003c/li\u003e\
        \u003c/ul\u003e\
    \u003c/dropdown-overlay\u003e\
\u003c/div\u003e\
');
    t.put('views/visualizationPane.html', '\u003carticle class=\"visualizationPane sidePane rightSidePane\" ng-class=\"{ isCollapsed: !viewModel.isPaneExpanded }\" modeling-context-changer\u003e\
    \u003cdiv class=\"paneHeader\"\u003e\
        \u003cbutton class=\"toggleBtn\" ng-class=\"{ isCollapsed: !viewModel.isPaneExpanded }\" ng-click=\"toggle()\"\u003e\
            \u003cdiv class=\"BtnIcon glyphicon pbi-glyph-chevronrightmedium glyph-mini\" localize-tooltip=\"VisualizationPane_Toggle\"\u003e\u003c/div\u003e\
        \u003c/button\u003e\
        \u003ch2 class=\"vizPaneTitle\" ng-bind=\"viewModel.header\" ng-show=\"viewModel.isPaneExpanded\"\u003e\u003c/h2\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"paneContents\" ng-if=\"viewModel.isPaneExpanded\"\u003e\
        \u003cvisual-types-container ng-if=\"showVisualTypes\" visual-plugin-filter=\"viewModel.visualPluginFilter\"\u003e\u003c/visual-types-container\u003e\
        \u003cnav class=\"sectionHeader\" ng-if=\"viewModel.sections.length\"\u003e\
            \u003cul\u003e\
                \u003cli ng-repeat=\"section in viewModel.sections\" ng-click=\"setActiveSection(section.sectionType)\"\
                    class=\"sectionTab\" ng-class=\"{active: section.sectionType === viewModel.activeSection}\" title=\"{{::section.displayName}}\"\u003e\
                    \u003ci ng-class=\"[\u0027sectionIcon\u0027, section.cssClass]\"\u003e\u003c/i\u003e\
                \u003c/li\u003e\
            \u003c/ul\u003e\
        \u003c/nav\u003e\
        \u003cdiv class=\"sectionHost\" ng-if=\"viewModel.activeSection !== 1\" ng-class=\"{\u0027readOnly\u0027 : !isEditing \u0026\u0026 !alwaysPopulatePanes}\"\u003e\
            \u003cng-scrollbars ng-scrollbars-config=\"::scrollbarsConfig\"\u003e\
                \u003cfield-well ng-if=\"showFieldWell\"\u003e\u003c/field-well\u003e\
                \u003ch3 class=\"sectionHeader\" ng-if=\"isEditing || alwaysPopulatePanes\"\u003e\
                    \u003cspan class=\"sectionTitle\" localize=\"VisualizationPane_Filters\"\u003e\u003c/span\u003e\
                \u003c/h3\u003e\
                \u003cfilter-pane\u003e\u003c/filter-pane\u003e\
            \u003c/ng-scrollbars\u003e\
        \u003c/div\u003e\
        \u003cproperty-pane ng-if=\"showPropertyPane\"\u003e\u003c/property-pane\u003e\
    \u003c/div\u003e\
    \u003cdiv class=\"verticalTitle\" ng-show=\"!viewModel.isPaneExpanded\"\u003e\
        \u003cdiv class=\"collapsedVisualsTitle\" localize=\"VisualizationPane_Title\" ng-show=\"isEditing || alwaysPopulatePanes\"\u003e\u003c/div\u003e\
        \u003cdiv class=\"collapsedFiltersTitle\" localize=\"VisualizationPane_Filters\"\u003e\u003c/div\u003e\
    \u003c/div\u003e\
\u003c/article\u003e\
');
    t.put('views/gradientBar.html', '\u003cdiv class=\"gradient-bar-container\"\u003e\
    \u003cdiv class=\"gradient-bar\" style=\"background: -webkit-linear-gradient(left, {{gradientColors}}); -o-linear-gradient(right, {{gradientColors}}); -moz-linear-gradient(right, {{gradientColors}}); linear-gradient(to right, {{gradientColors}});\"\u003e\u003c/div\u003e\
\u003c/div\u003e\
');
    t.put('views/virtualList.html', '\u003cdiv class=\"virtual-list-container\"\u003e\
    \u003cdiv class=\"virtual-list\"\u003e\
        \u003cng-transclude\u003e\u003c/ng-transclude\u003e\
    \u003c/div\u003e\
\u003c/div\u003e\
');
}]);
//# sourceMappingURL=ExploreUI.js.map