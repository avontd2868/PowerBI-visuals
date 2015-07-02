//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

/* tslint:disable */
var powerBIAccessToken = "fooBarBaz";
/* tslint:enable */

module powerbitests.helpers {
    debug.assertFailFunction = (message: string) => {
        expect(message).toBe('DEBUG asserts should never happen.  There is a product or test bug.');
    };

    /** Suppresses debug asserts failing tests.  This is temporary and should be removed. */
    export function suppressDebugAssertFailure(): void {
        debug.assertFailFunction = (message: string) => {
            // NOTE: This should fail test cases (asserts should never fire under normal test runs).
            console.error(message);
        };
    }

    export var SemanticQueryLatestVersion: powerbi.data.SemanticQueryVersions = powerbi.data.SemanticQueryVersions.Version2;

    export var DataShapeBindingLatestVersion: powerbi.data.DataShapeBindingVersions = powerbi.data.DataShapeBindingVersions.Version1;

    export var dataSets = {
        singleMeasureDataViewSource: '{"descriptor": {"Select": [{"Kind": 2, "Value": "M0"}]}, "dsr": {"DataShapes":[{"Id":"DS0","PrimaryHierarchy":[{"Id":"DM0","Instances":[{"Calculations":[{"Id":"M0","Value":"21852688.46698004D"}]}]}],"IsComplete":true}]}}',
        dataViewSourceWithErrors: '{"descriptor":{"Select":[{"Kind":1,"Depth":0,"Value":"G0"},{"Kind":2,"Value":"M0","Subtotal":["A0"],"Min":["A2"],"Max":["A1"]}],"Expressions":{"Primary":{"Groupings":[{"Keys":[{"Source":{"Entity":"DimDate","Property":"Month Name"},"Select":0},{"Source":{"Entity":"DimDate","Property":"Month Number"},"Calc":"K0"}]}]}}},"dsr":{"DataShapes":[{"Id":"DS0","odata.error":{"code":"rsDataShapeQueryTranslationError","message":{"lang":"da-DK","value":"Data Shape Query translation failed with error code: \'InvalidExpression\'. Check the report server logs for more information."},"azure:values":[{"timestamp":"2015-01-15T07:44:45.8135124Z"},{"details":"Microsoft.ReportingServices.DataShapeQueryTranslation.DataShapeQueryTranslationException: Data Shape Query translation failed with error code: \'InvalidExpression\'. Check the report server logs for more information."},{"helpLink":"http://go.microsoft.com/fwlink/?LinkId=20476&EvtSrc=Microsoft.ReportingServ…Error&ProdName=Microsoft%20SQL%20Server%20Reporting%20Services&ProdVer=1.0"},{"productInfo":{"productName":"change this","productVersion":"1.0","productLocaleId":127,"operatingSystem":"OsIndependent","countryLocaleId":1033}},{"moreInformation":{"odata.error":{"code":"System.Exception","message":{"lang":"da-DK","value":"For more information about this error navigate to the report server on the local server machine, or enable remote errors"},"azure:values":[{"details":"System.Exception: For more information about this error navigate to the report server on the local server machine, or enable remote errors"}]}}}]}}]}}',
    };

    export function testDom(height:string, width:string): JQuery {
        var testhtml = '<div id="item" style="height: '+height+'px; width: '+width+'px;"></div>';
        setFixtures(testhtml);
        var element = $('#item');
        return element;
    }

    export function isTranslateCloseTo(actualTranslate: string, expectedX: number, expectedY: number): boolean {
        var splitChar = actualTranslate.indexOf(",") > 0 ? ',' : ' ';
        var translateValues = actualTranslate.substr(10, actualTranslate.lastIndexOf(')') - 10).split(splitChar);
        var actualX = parseInt(translateValues[0], 10);
        var actualY = parseInt(translateValues[1], 10);

        var deltaX = Math.abs(expectedX - actualX);
        var deltaY = Math.abs(expectedY - actualY);

        // Tolerance of 1
        return deltaX <= 1 && deltaY <= 1;
    }

    /** Returns a function that can be called to trigger a dragstart. */
    export function getDragStartTriggerFunctionForD3(element: HTMLElement): (arg) => {} {
        var elem: any = element;
        if (elem.__ondragstart)
            return arg => elem.__ondragstart(arg);
    }

    /** Returns a function that can be called to trigger a click. */
    export function getClickTriggerFunctionForD3(element: HTMLElement): (arg) => {} {
        var elem: any = element;
        if (elem.__onclick)
            return arg => elem.__onclick(arg);
    }

    /** Execute a dummy expect to avoid Jasmine warnings, since some tests only perform validation directly on the httpService via expectPOST etc. */
    export function suppressJasmineMissingExpectWarning(): void {
        expect(true).toBe(true);
    }

    export enum ClickEventType {
        Default = 0,
        CtrlKey = 1,
        AltKey = 2,
        ShiftKey = 4,
        MetaKey = 8,
    }

    // Defining a simulated click event (see http://stackoverflow.com/questions/9063383/how-to-invoke-click-event-programmaticaly-in-d3)
    jQuery.fn.d3Click = function (x: number, y: number, eventType?: ClickEventType) {
        var type = eventType || ClickEventType.Default;
        this.each(function (i, e) {
            var evt: any = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", // type
                true,   // canBubble
                true,   // cancelable
                window, // view
                0,      // detail
                x,      // screenX
                y,      // screenY
                x,      // clientX
                y,      // clientY
                type & ClickEventType.CtrlKey,  // ctrlKey
                type & ClickEventType.AltKey,  // altKey
                type & ClickEventType.ShiftKey,  // shiftKey
                type & ClickEventType.MetaKey,  // metaKey
                0,      // button
                null);  // relatedTarget

            e.dispatchEvent(evt);
        }); 
    };

    export function deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

    export function getLocalTimeFromUTCBase(utcYear: number, utcMonth: number, utcDay: number, utcHours: number, utcMinutes: number, utcSeconds: number): Date {
        // IMPORTANT: We need to dynamically calculate the UTC offset to use for our test date instead of hard-coding the offset so that:
        // i) It doesn't break when daylight savings changes the UTC offset
        // ii) The test works even if your machine is not in the US Pacific Time zone :)
        var baseDate = new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds);
        var offsetMinutes = baseDate.getTimezoneOffset();
        var date = new Date();
        date.setTime(baseDate.getTime() - offsetMinutes * 60000);
        return date;
    }

    export function isUndefined(value) { return typeof value === 'undefined'; }

    export enum ContextMenuEntityButtonPosition {
        NewMeasure = 0,
        NewColumn = 1,
        Rename = 3,
        Delete = 4,
        Hide = 5,
        ViewHidden = 7,
        UnhideAll = 8,
    }
    export enum ContextMenuPropertyButtonPosition {
        AddFilter = 0,
        NewMeasure = 2,
        NewColumn = 3,
        Rename = 5,
        Delete = 6,
        Hide = 7,
        ViewHidden = 9,
        UnhideAll = 10,
    }
}