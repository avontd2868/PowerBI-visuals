//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/* tslint:disable */
var powerBIAccessToken = "fooBarBaz";
/* tslint:enable */
var powerbitests;
(function (powerbitests) {
    var helpers;
    (function (helpers) {
        debug.assertFailFunction = function (message) {
            expect(message).toBe('DEBUG asserts should never happen.  There is a product or test bug.');
        };
        /** Suppresses debug asserts failing tests.  This is temporary and should be removed. */
        function suppressDebugAssertFailure() {
            debug.assertFailFunction = function (message) {
                // NOTE: This should fail test cases (asserts should never fire under normal test runs).
                console.error(message);
            };
        }
        helpers.suppressDebugAssertFailure = suppressDebugAssertFailure;
        helpers.SemanticQueryLatestVersion = 2 /* Version2 */;
        helpers.DataShapeBindingLatestVersion = 1 /* Version1 */;
        helpers.dataSets = {
            singleMeasureDataViewSource: '{"descriptor": {"Select": [{"Kind": 2, "Value": "M0"}]}, "dsr": {"DataShapes":[{"Id":"DS0","PrimaryHierarchy":[{"Id":"DM0","Instances":[{"Calculations":[{"Id":"M0","Value":"21852688.46698004D"}]}]}],"IsComplete":true}]}}',
            dataViewSourceWithErrors: '{"descriptor":{"Select":[{"Kind":1,"Depth":0,"Value":"G0"},{"Kind":2,"Value":"M0","Subtotal":["A0"],"Min":["A2"],"Max":["A1"]}],"Expressions":{"Primary":{"Groupings":[{"Keys":[{"Source":{"Entity":"DimDate","Property":"Month Name"},"Select":0},{"Source":{"Entity":"DimDate","Property":"Month Number"},"Calc":"K0"}]}]}}},"dsr":{"DataShapes":[{"Id":"DS0","odata.error":{"code":"rsDataShapeQueryTranslationError","message":{"lang":"da-DK","value":"Data Shape Query translation failed with error code: \'InvalidExpression\'. Check the report server logs for more information."},"azure:values":[{"timestamp":"2015-01-15T07:44:45.8135124Z"},{"details":"Microsoft.ReportingServices.DataShapeQueryTranslation.DataShapeQueryTranslationException: Data Shape Query translation failed with error code: \'InvalidExpression\'. Check the report server logs for more information."},{"helpLink":"http://go.microsoft.com/fwlink/?LinkId=20476&EvtSrc=Microsoft.ReportingServ�Error&ProdName=Microsoft%20SQL%20Server%20Reporting%20Services&ProdVer=1.0"},{"productInfo":{"productName":"change this","productVersion":"1.0","productLocaleId":127,"operatingSystem":"OsIndependent","countryLocaleId":1033}},{"moreInformation":{"odata.error":{"code":"System.Exception","message":{"lang":"da-DK","value":"For more information about this error navigate to the report server on the local server machine, or enable remote errors"},"azure:values":[{"details":"System.Exception: For more information about this error navigate to the report server on the local server machine, or enable remote errors"}]}}}]}}]}}'
        };
        function testDom(height, width) {
            var testhtml = '<div id="item" style="height: ' + height + 'px; width: ' + width + 'px;"></div>';
            setFixtures(testhtml);
            var element = $('#item');
            return element;
        }
        helpers.testDom = testDom;
        function isTranslateCloseTo(actualTranslate, expectedX, expectedY) {
            var splitChar = actualTranslate.indexOf(",") > 0 ? ',' : ' ';
            var translateValues = actualTranslate.substr(10, actualTranslate.lastIndexOf(')') - 10).split(splitChar);
            var actualX = parseInt(translateValues[0], 10);
            var actualY = parseInt(translateValues[1], 10);
            var deltaX = Math.abs(expectedX - actualX);
            var deltaY = Math.abs(expectedY - actualY);
            // Tolerance of 1
            return deltaX <= 1 && deltaY <= 1;
        }
        helpers.isTranslateCloseTo = isTranslateCloseTo;
        /** Returns a function that can be called to trigger a dragstart. */
        function getDragStartTriggerFunctionForD3(element) {
            var elem = element;
            if (elem.__ondragstart)
                return function (arg) { return elem.__ondragstart(arg); };
        }
        helpers.getDragStartTriggerFunctionForD3 = getDragStartTriggerFunctionForD3;
        /** Returns a function that can be called to trigger a click. */
        function getClickTriggerFunctionForD3(element) {
            var elem = element;
            if (elem.__onclick)
                return function (arg) { return elem.__onclick(arg); };
        }
        helpers.getClickTriggerFunctionForD3 = getClickTriggerFunctionForD3;
        /** Execute a dummy expect to avoid Jasmine warnings, since some tests only perform validation directly on the httpService via expectPOST etc. */
        function suppressJasmineMissingExpectWarning() {
            expect(true).toBe(true);
        }
        helpers.suppressJasmineMissingExpectWarning = suppressJasmineMissingExpectWarning;
        (function (ClickEventType) {
            ClickEventType[ClickEventType["Default"] = 0] = "Default";
            ClickEventType[ClickEventType["CtrlKey"] = 1] = "CtrlKey";
            ClickEventType[ClickEventType["AltKey"] = 2] = "AltKey";
            ClickEventType[ClickEventType["ShiftKey"] = 4] = "ShiftKey";
            ClickEventType[ClickEventType["MetaKey"] = 8] = "MetaKey";
        })(helpers.ClickEventType || (helpers.ClickEventType = {}));
        var ClickEventType = helpers.ClickEventType;
        // Defining a simulated click event (see http://stackoverflow.com/questions/9063383/how-to-invoke-click-event-programmaticaly-in-d3)
        jQuery.fn.d3Click = function (x, y, eventType) {
            var type = eventType || 0 /* Default */;
            this.each(function (i, e) {
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, x, y, x, y, type & 1 /* CtrlKey */, type & 2 /* AltKey */, type & 4 /* ShiftKey */, type & 8 /* MetaKey */, 0, null); // relatedTarget
                e.dispatchEvent(evt);
            });
        };
        function deepCopy(object) {
            return JSON.parse(JSON.stringify(object));
        }
        helpers.deepCopy = deepCopy;
        function getLocalTimeFromUTCBase(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds) {
            // IMPORTANT: We need to dynamically calculate the UTC offset to use for our test date instead of hard-coding the offset so that:
            // i) It doesn't break when daylight savings changes the UTC offset
            // ii) The test works even if your machine is not in the US Pacific Time zone :)
            var baseDate = new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds);
            var offsetMinutes = baseDate.getTimezoneOffset();
            var date = new Date();
            date.setTime(baseDate.getTime() - offsetMinutes * 60000);
            return date;
        }
        helpers.getLocalTimeFromUTCBase = getLocalTimeFromUTCBase;
        function createUndoRedoService($rootScope, eventBridge) {
            var serializer = powerbi.explore.services.createExplorationSerializer(powerbi.visuals.visualPluginFactory.create());
            var undoRedoService = powerbi.explore.services.createUndoRedoService(serializer, $rootScope, eventBridge || powerbi.common.createEventBridge());
            undoRedoService.setHandler(new powerbitests.mocks.MockEmptyUndoRedoHandler());
            return undoRedoService;
        }
        helpers.createUndoRedoService = createUndoRedoService;
        (function (ContextMenuEntityButtonPosition) {
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["NewMeasure"] = 0] = "NewMeasure";
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["NewColumn"] = 1] = "NewColumn";
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["Rename"] = 3] = "Rename";
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["Delete"] = 4] = "Delete";
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["Hide"] = 5] = "Hide";
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["ViewHidden"] = 7] = "ViewHidden";
            ContextMenuEntityButtonPosition[ContextMenuEntityButtonPosition["UnhideAll"] = 8] = "UnhideAll";
        })(helpers.ContextMenuEntityButtonPosition || (helpers.ContextMenuEntityButtonPosition = {}));
        var ContextMenuEntityButtonPosition = helpers.ContextMenuEntityButtonPosition;
        (function (ContextMenuPropertyButtonPosition) {
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["AddFilter"] = 0] = "AddFilter";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["NewMeasure"] = 2] = "NewMeasure";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["NewColumn"] = 3] = "NewColumn";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["Rename"] = 5] = "Rename";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["Delete"] = 6] = "Delete";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["Hide"] = 7] = "Hide";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["ViewHidden"] = 9] = "ViewHidden";
            ContextMenuPropertyButtonPosition[ContextMenuPropertyButtonPosition["UnhideAll"] = 10] = "UnhideAll";
        })(helpers.ContextMenuPropertyButtonPosition || (helpers.ContextMenuPropertyButtonPosition = {}));
        var ContextMenuPropertyButtonPosition = helpers.ContextMenuPropertyButtonPosition;
    })(helpers = powerbitests.helpers || (powerbitests.helpers = {}));
})(powerbitests || (powerbitests = {}));
