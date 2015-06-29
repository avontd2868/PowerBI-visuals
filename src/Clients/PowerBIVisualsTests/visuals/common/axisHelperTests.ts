//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import AxisHelper = powerbi.visuals.AxisHelper;
    import ValueType = powerbi.ValueType;

    describe("AxisHelper invertOrdinalScale tests",() => {
        var range;
        var ordinalScale: D3.Scale.OrdinalScale;
        var domain;

        beforeEach(() => {
            range = [0, 99];
            domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            ordinalScale = d3.scale.ordinal();
            ordinalScale.rangeRoundBands(range, 0.1);
            ordinalScale.domain(domain);
        });

        it('invertOrdinalScale in middle',() => {
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 50);
            expect(invertedValue).toBe(5);
        });

        it('invertOrdinalScale at start',() => {
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 0);
            expect(invertedValue).toBe(0);
        });

        it('invertOrdinalScale at end',() => {
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 99);
            expect(invertedValue).toBe(9);
        });

        it('invertOrdinalScale at before start',() => {
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, -4);
            expect(invertedValue).toBe(0);
        });

        it('invertOrdinalScale at after end',() => {
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 1222);
            expect(invertedValue).toBe(9);
        });
    });

    describe("AxisHelper create scales tests",() => {
        var dataStrings = ['Sun', 'Mon', 'Holiday'];
        var dataNumbers = [47.5, 98.22, 127.3];
        var dataTime = [new Date('10/15/2014'), new Date('10/15/2015'), new Date('10/15/2016')];
        var domainOrdinal3 = [0, 1, 2];
        var domainBoolIndex = [0, 1];
        var domainNaN = [NaN, NaN];

        var metaDataColumnText: powerbi.DataViewMetadataColumn = {
            name: 'Column',
            type: ValueType.fromDescriptor({ text: true })
        };
        var metaDataColumnNumeric: powerbi.DataViewMetadataColumn = {
            name: 'Column',
            type: ValueType.fromDescriptor({ numeric: true })
        };
        var metaDataColumnBool: powerbi.DataViewMetadataColumn = {
            name: 'Column',
            type: ValueType.fromDescriptor({ bool: true })
        };
        var metaDataColumnTime: powerbi.DataViewMetadataColumn = {
            name: 'Column',
            type: ValueType.fromDescriptor({ dateTime: true })
        };
        var formatStringProp: powerbi.DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        // TODO: add a getValueFn mock to provide to createAxis so we can test tickValue generation

        it('create ordinal scale',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainOrdinal3,
                metaDataColumn: metaDataColumnText,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                getValueFn: (index, type) => { return dataStrings[index]; }
            });

            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe('Sun');

            // Provides category thickness is not set when not defined
            var categoryThickness = <any>os.categoryThickness;
            expect(categoryThickness).toBeUndefined();        

            // Proves label max width is pixelSpan/tickValues when categoryThickness not defined
            var xLabelMaxWidth = <any>os.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toEqual(25);
        });

        it('create ordinal scale with linear values',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainOrdinal3,
                metaDataColumn: metaDataColumnNumeric,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                getValueFn: (index, type) => { return dataNumbers[index]; }
            });

            var scale = <any>os.scale;
            expect(scale).toBeDefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe('47.50');

            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();
        });

        it('create ordinal scale with no categories',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainOrdinal3,
                metaDataColumn: undefined,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                getValueFn: (index, type) => { return dataStrings[index]; }
            });
            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(0);
        });

        it('create ordinal scale with boolean values',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainBoolIndex,
                metaDataColumn: metaDataColumnBool,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                getValueFn: (d, dataType) => { if (d === 0) return true; else return false; }
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();

            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();

            // check tick labels values
            expect(os.values[0]).toBe('True');
            expect(os.values[1]).toBe('False');
        });

        it('create ordinal scale with category thickness',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainOrdinal3,
                metaDataColumn: metaDataColumnText,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                categoryThickness: 5,
                getValueFn: (index, type) => { return dataStrings[index]; }
            });

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe('Sun');

            // Provides category thickness set when defined
            var categoryThickness = <any>os.categoryThickness;
            expect(categoryThickness).toBeDefined();
            expect(categoryThickness).toEqual(5);

            // Provides category thickness used as xLabelMaxWidth when not is scalar
            var xLabelMaxWidth = <any>os.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toEqual(5);
        });

        it('create linear scale',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [dataNumbers[0], dataNumbers[2]],
                metaDataColumn: metaDataColumnNumeric,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: true,
                isVertical: false
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // Provides category thickness is not set when not defined
            var categoryThickness = <any>os.categoryThickness;
            expect(categoryThickness).toBeUndefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[1]).toBe('100.00');

            // Proves label max width is pixelSpan/tickValues when is scalar and category thickness not defined
            var xLabelMaxWidth = <any>os.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toBeGreaterThan(33);
            expect(xLabelMaxWidth).toBeLessThan(34);
        });

        it('create linear scale with NaN domain',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainNaN,
                metaDataColumn: metaDataColumnNumeric,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: true,
                isVertical: true
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // check for default value fallbackDomain
            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[2]).toBe('10.00');
        });

        it('create value scale - near zero min check',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [-0.000001725, 15],
                metaDataColumn: metaDataColumnNumeric,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: true,
                isVertical: true
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[0]).toBe('0.00');
        });

        it('create linear scale with category thickness',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [dataNumbers[0], dataNumbers[2]],
                metaDataColumn: metaDataColumnNumeric,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: true,
                isVertical: false,
                categoryThickness: 5
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // Provides category thickness set when defined
            var categoryThickness = <any>os.categoryThickness;
            expect(categoryThickness).toBeDefined();
            expect(categoryThickness).toEqual(5);       

            // Proves category thickness not considered for label max width when is scalar
            var xLabelMaxWidth = <any>os.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toBeGreaterThan(33);
            expect(xLabelMaxWidth).toBeLessThan(34);
        });

        it('create scalar time scale',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [dataTime[0].getTime(), dataTime[2].getTime()],
                metaDataColumn: metaDataColumnTime,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: true,
                isVertical: false,
                getValueFn: (index, type) => { return new Date(index); } //index is actually milliseconds in this case
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[0]).toBe('2015');
        });

        it('create scalar time scale - single day',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [dataTime[0].getTime(), dataTime[0].getTime()],
                metaDataColumn: metaDataColumnTime,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: true,
                isVertical: false,
                getValueFn: (index, type) => { return new Date(index); } //index is actually milliseconds in this case
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(1);
            expect(values[0]).toBe('Oct 15');
        });

        it('create ordinal time scale',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: domainOrdinal3,
                metaDataColumn: metaDataColumnTime,
                formatStringProp: formatStringProp,
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                getValueFn: (index, type) => { return dataTime[index]; }
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe('2014');
        });
    });

    describe("AxisHelper column type tests",() => {
        it('createOrdinalType',() => {
            var ordinalType = AxisHelper.createOrdinalType();
            expect(AxisHelper.isOrdinal(ordinalType)).toBe(true);
            expect(AxisHelper.isDateTime(ordinalType)).toBe(false);
        });

        it('isOrdinal not valid for DateTime',() => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ dateTime: true }))).toBe(false);
        });

        it('isOrdinal valid for bool',() => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ bool: true }))).toBe(true);
        });

        it('isOrdinal not valid for numeric',() => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ numeric: true }))).toBe(false);
        });

        it('isOrdinal valid for text',() => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ text: true }))).toBe(true);
        });

        it('isDateTime valid for DateTime',() => {
            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ dateTime: true }))).toBe(true);
        });

        it('isDateTime not valid for non-DateTIme',() => {
            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ numeric: true }))).toBe(false);

            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ text: true }))).toBe(false);

            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ bool: true }))).toBe(false);
        });

        it('isDateTime null',() => {
            expect(AxisHelper.isDateTime(null)).toBe(false);
        });

        it('isDateTime undefined',() => {
            expect(AxisHelper.isDateTime(undefined)).toBe(false);
        });
    });

    describe("AxisHelper get Recommended tick values tests",() => {
        var labels = ['VRooom', 'FROM', '1984', 'OR', 'YEAR', '3000', '?', '?'];

        it('max is half the ticks',() => {
            var expected = ['VRooom', '1984', 'YEAR', '?'];
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(4, labels);
            expect(actual).toEqual(expected);
        });

        it('max is zero ticks',() => {
            var expected = [];
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(0, labels);
            expect(actual).toEqual(expected);
        });

        it('max is negative ticks',() => {
            var expected = [];
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(-1, labels);
            expect(actual).toEqual(expected);
        });

        it('max is equal to ticks',() => {
            var expected = labels;
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(8, labels);
            expect(actual).toEqual(expected);
        });

        it('max is more than ticks',() => {
            var expected = labels;
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(10, labels);
            expect(actual).toEqual(expected);
        });

        it('getRecommendedTickValues: ordinal index',() => {
            var expected = [0, 2, 4, 6, 8];
            var scale = AxisHelper.createOrdinalScale(400, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.4);
            var actual = AxisHelper.getRecommendedTickValues(5, scale, ValueType.fromDescriptor({ text: true }), false);
            expect(actual).toEqual(expected);
        });

        it('getRecommendedTickValues: ordinal index - zero maxTicks',() => {
            var vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var scale = AxisHelper.createOrdinalScale(400, vals, 0.4);
            var actual = AxisHelper.getRecommendedTickValues(0, scale, ValueType.fromDescriptor({ text: true }), false);
            expect(actual).toEqual([]);
        });

        it('getRecommendedTickValues: ordinal index - maxTicks greater than len',() => {
            var vals = [0, 1, 2, 3, 4];
            var scale = AxisHelper.createOrdinalScale(400, vals, 0.4);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ text: true }), false);
            expect(actual).toEqual(vals);
        });

        // linear domains are always [min,max], only two values, and are already D3.nice()
        it('getRecommendedTickValues: scalar numeric - easy',() => {
            var expected = [0, 20, 40, 60, 80, 100];
            var scale = AxisHelper.createLinearScale(400, [0, 100]);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it('getRecommendedTickValues: 0 tick count',() => {
            var expected = [];
            var scale = AxisHelper.createLinearScale(400, [0, 100]);
            var actual = AxisHelper.getRecommendedTickValues(0, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it('getRecommendedTickValues: positive range',() => {
            var expected = [60, 80, 100];
            var scale = AxisHelper.createLinearScale(400, [60, 100]);
            var actual = AxisHelper.getRecommendedTickValues(3, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it('getRecommendedTickValues: negative range',() => {
            var expected = [-200, -180, -160, -140, -120, -100];
            var scale = AxisHelper.createLinearScale(400, [-200, -100]);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it('getRecommendedTickValues: 0 between min and max',() => {
            var expected = [0, 50, 100];
            var scale = AxisHelper.createLinearScale(400, [-20, 100]);
            var actual = AxisHelper.getRecommendedTickValues(4, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it('ensureValuesInRange: unsorted tick values',() => {
            var values = [1, 2, 3, 4, 5];
            var actual = AxisHelper.ensureValuesInRange(values, 2.2, 5.5);
            expect(actual).toEqual([3, 4, 5]);
        });

        it('ensureValuesInRange: only one value in range',() => {
            var values = [1, 2, 3, 4, 5];
            var actual = AxisHelper.ensureValuesInRange(values, 1.5, 2.5);
            expect(actual).toEqual([1.5, 2.5]);
        });

        it('ensureValuesInRange: no value in range',() => {
            var values = [1, 2];
            var actual = AxisHelper.ensureValuesInRange(values, 1.25, 1.75);
            expect(actual).toEqual([1.25, 1.75]);
        });
    });

    describe("AxisHelper get best number of ticks tests",() => {
        var dataViewMetadataColumnWithIntegersOnly: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                isMeasure: true,
                type: ValueType.fromDescriptor({ integer: true })
            },
            {
                name: 'col2',
                isMeasure: true,
                type: ValueType.fromDescriptor({ integer: true })
            }
        ];

        var dataViewMetadataColumnWithNonInteger: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                isMeasure: true,
                type: ValueType.fromDescriptor({ integer: true })
            },
            {
                name: 'col2',
                isMeasure: true,
                type: ValueType.fromDescriptor({ numeric: true })
            }
        ];

        it('dataViewMetadataColumn with only integers small range',() => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 3, dataViewMetadataColumnWithIntegersOnly, 6);
            expect(actual).toBe(4); // [0,1,2,3]
        });

        it('dataViewMetadataColumn with only integers large range',() => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 10, dataViewMetadataColumnWithIntegersOnly, 6);
            expect(actual).toBe(6);
        });

        it('hundred percent dataViewMetadataColumn with only integers',() => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 1, dataViewMetadataColumnWithIntegersOnly, 6);
            expect(actual).toBe(6);
        });

        it('dataViewMetadataColumn with non integers',() => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 3, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(6);
        });

        it('dataViewMetadataColumn with NaN min/max',() => {
            var actual = AxisHelper.getBestNumberOfTicks(NaN, 3, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(3);
            actual = AxisHelper.getBestNumberOfTicks(1, NaN, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(3);
            actual = AxisHelper.getBestNumberOfTicks(NaN, NaN, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(3);
        });
    });

    describe("AxisHelper diffScaled",() => {
        var scale: D3.Scale.GenericQuantitativeScale<any>;

        beforeEach(() => {
            var range = [0, 999];
            var domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 999];
            scale = d3.scale.linear()
                .range(range)
                .domain(domain);
        });

        it('diffScaled: zero',() => {
            expect(AxisHelper.diffScaled(scale, 0, 0)).toBe(0);
        });

        it('diffScaled: small nonzero +ve',() => {
            expect(AxisHelper.diffScaled(scale, 0.00000001, 0)).toBe(1);
        });

        it('diffScaled: small nonzero -ve',() => {
            expect(AxisHelper.diffScaled(scale, -0.00000001, 0)).toBe(-1);
        });
    });

    describe("AxisHelper getRecommendedNumberOfTicks tests",() => {
        it('getRecommendedNumberOfTicksForXAxis small tile',() => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForXAxis(220);
            expect(tickCount).toBe(3);
        });

        it('getRecommendedNumberOfTicksForXAxis median tile',() => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForXAxis(480);
            expect(tickCount).toBe(6);
        });

        it('getRecommendedNumberOfTicksForXAxis large tile',() => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForXAxis(730);
            expect(tickCount).toBe(6);
        });

        it('getRecommendedNumberOfTicksForYAxis small tile',() => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(80);
            expect(tickCount).toBe(3);
        });

        it('getRecommendedNumberOfTicksForYAxis median tile',() => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(230);
            expect(tickCount).toBe(6);
        });

        it('getRecommendedNumberOfTicksForYAxis large tile',() => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(350);
            expect(tickCount).toBe(6);
        });
    });
}
