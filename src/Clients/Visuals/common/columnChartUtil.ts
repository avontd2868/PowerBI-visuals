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

module powerbi.visuals {
    var rectName = 'rect';

    export module ColumnUtil {
        export var DimmedOpacity = 0.4;
        export var DefaultOpacity = 1.0;

        export function getTickCount(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, is100Pct: boolean, forcedTickCount?: number): number {
            return forcedTickCount !== undefined
                ? (maxTickCount !== 0 ? forcedTickCount : 0)
                : AxisHelper.getBestNumberOfTicks(min, max, valuesMetadata, maxTickCount);
        }

        export function applyUserMinMax(isScalar: boolean, dataView: DataViewCategorical, xAxisCardProperties: DataViewObject): DataViewCategorical {
            if (isScalar) {
                var min = xAxisCardProperties['start'];
                var max = xAxisCardProperties['end'];

                return ColumnUtil.transformDomain(dataView, min, max);
            }       
            
            return dataView;              
        }       

        export function transformDomain(dataView: DataViewCategorical, min: DataViewPropertyValue, max: DataViewPropertyValue): DataViewCategorical {
            if (!dataView.categories || dataView.categories.length === 0)
                return dataView;// no need to do something when there are no categories  
            
            if (typeof min !== "number" && typeof max !== "number")
                return dataView;//user did not set min max, nothing to do here        
            
            var category = dataView.categories[0];//at the moment we only support one category
            var categoryValues = category.values;
            var categoryObjects = category.objects;

            var newcategoryValues = [];
            var newValues = [];
            var newObjects = [];

            //get new min max
            if (typeof min !== "number") {
                min = categoryValues[0];
            }
            if (typeof max !== "number") {
                max = categoryValues[categoryValues.length - 1];
            }

            //don't allow this
            if (min > max)
                return dataView;
            

            //build measure array
            for (var j = 0, len = dataView.values.length; j < len; j++) {
                newValues.push([]);
            }                        

            for (var t = 0, len = categoryValues.length; t < len; t++) {
                if (categoryValues[t] >= min && categoryValues[t] <= max) {
                    newcategoryValues.push(categoryValues[t]);
                    if (categoryObjects) {
                        newObjects.push(categoryObjects[t]);
                    }
                          
                    //on each measure set the new range
                    if (dataView.values) {
                        for (var k = 0; k < dataView.values.length; k++) {
                            newValues[k].push(dataView.values[k].values[t]);
                        }
                    }
                }
            }            

            //don't write directly to dataview
            var resultDataView = Prototype.inherit(dataView);
            var resultDataViewValues = resultDataView.values = Prototype.inherit(resultDataView.values);
            var resultDataViewCategories = resultDataView.categories = Prototype.inherit(dataView.categories);
            var resultDataViewCategories0 = resultDataView.categories[0] = Prototype.inherit(resultDataViewCategories[0]);

            resultDataViewCategories0.values = newcategoryValues;
            //only if we had objects, then you set the new objects
            if (resultDataViewCategories0.objects) {
                resultDataViewCategories0.objects = newObjects;
            }

            //update measure array
            for (var t = 0, len = dataView.values.length; t < len; t++) {
                var measureArray = resultDataViewValues[t] = Prototype.inherit(resultDataViewValues[t]);
                measureArray.values = newValues[t];
            }

            return resultDataView;
        }

        export function getCategoryAxis(
            data: ColumnChartData,
            size: number,
            layout: CategoryLayout,
            isVertical: boolean,
            forcedXMin?: DataViewPropertyValue,
            forcedXMax?: DataViewPropertyValue): IAxisProperties {

            var categoryThickness = layout.categoryThickness;
            var isScalar = layout.isScalar;
            var outerPaddingRatio = layout.outerPaddingRatio;
            var dw = new DataWrapper(data, isScalar);
            var domain = AxisHelper.createDomain(data.series, data.categoryMetadata ? data.categoryMetadata.type : ValueType.fromDescriptor({ text: true }), isScalar, [forcedXMin, forcedXMax]);

            var axisProperties = AxisHelper.createAxis({
                pixelSpan: size,
                dataDomain: domain,
                metaDataColumn: data.categoryMetadata,
                formatStringProp: columnChartProps.general.formatString,
                outerPadding: categoryThickness * outerPaddingRatio,
                isCategoryAxis: true,
                isScalar: isScalar,
                isVertical: isVertical,
                categoryThickness: categoryThickness,
                useTickIntervalForDisplayUnits: true,
                getValueFn: (index, type) => dw.lookupXValue(index, type)
            });

            // intentionally updating the input layout by ref
            layout.categoryThickness = axisProperties.categoryThickness;

            return axisProperties;
        }

        export function applyInteractivity(columns: D3.Selection, onDragStart): void {
            debug.assertValue(columns, 'columns');

            if (onDragStart) {
                columns
                    .attr('draggable', 'true')
                    .on('dragstart', onDragStart);
            }
        }

        export function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number {
            if ((hasPartialHighlights && !highlight) || (hasSelection && !selected))
                return DimmedOpacity;
            return DefaultOpacity;
        }

        export function getClosestColumnIndex(coordinate: number, columnsCenters: number[]): number {
            var currentIndex = 0;
            var distance: number = Number.MAX_VALUE;
            for (var i = 0, ilen = columnsCenters.length; i < ilen; i++) {
                var currentDistance = Math.abs(coordinate - columnsCenters[i]);
                if (currentDistance < distance) {
                    distance = currentDistance;
                    currentIndex = i;
                }
            }

            return currentIndex;
        }

        export function setChosenColumnOpacity(mainGraphicsContext: D3.Selection, columnGroupSelector: string, selectedColumnIndex: number, lastColumnIndex: number): void {
            var series = mainGraphicsContext.selectAll(ColumnChart.SeriesClasses.selector);
            var lastColumnUndefined = typeof lastColumnIndex === 'undefined';
            // find all columns that do not belong to the selected column and set a dimmed opacity with a smooth animation to those columns
            series.selectAll(rectName + columnGroupSelector).filter((d: ColumnChartDataPoint) => {
                return (d.categoryIndex !== selectedColumnIndex) && (lastColumnUndefined || d.categoryIndex === lastColumnIndex);
            }).transition().style('fill-opacity', DimmedOpacity);

            // set the default opacity for the selected column
            series.selectAll(rectName + columnGroupSelector).filter((d: ColumnChartDataPoint) => {
                return d.categoryIndex === selectedColumnIndex;
            }).style('fill-opacity', DefaultOpacity);
        }

        export function drawSeries(data: ColumnChartData, graphicsContext: D3.Selection, axisOptions: ColumnAxisOptions): D3.UpdateSelection {
            var colGroupSelection = graphicsContext.selectAll(ColumnChart.SeriesClasses.selector);
            var series = colGroupSelection.data(data.series,(d: ColumnChartSeries) => d.key);

            series
                .enter()
                .append('g')
                .classed(ColumnChart.SeriesClasses.class, true);
            series
                .exit()
                .remove();
            return series;
        }

        export function drawDefaultShapes(data: ColumnChartData, series: D3.UpdateSelection, layout: IColumnLayout, itemCS: ClassAndSelector, filterZeros: boolean): D3.UpdateSelection {
            // We filter out invisible (0, null, etc.) values from the dataset
            // based on whether animations are enabled or not, Dashboard and
            // Exploration mode, respectively.
            var dataSelector: (d: ColumnChartSeries) => any[];
            if (filterZeros) {
                dataSelector = (d: ColumnChartSeries) => {
                    var filteredData = _.filter(d.data,(datapoint: ColumnChartDataPoint) => !!datapoint.value);
                    return filteredData;
                };
            }
            else {
                dataSelector = (d: ColumnChartSeries) => d.data;
            }

            var shapeSelection = series.selectAll(itemCS.selector);
            var shapes = shapeSelection.data(dataSelector, (d: ColumnChartDataPoint) => d.key);
            var hasSelection = data.hasSelection;

            shapes.enter()
                .append(rectName)
                .attr("class",(d: ColumnChartDataPoint) => itemCS.class.concat(d.highlight ? " highlight" : ""));

            shapes
                .style("fill",(d: ColumnChartDataPoint) => d.color)
                .style("fill-opacity",(d: ColumnChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, data.hasHighlights))
                .attr(layout.shapeLayout);

            shapes
                .exit()
                .remove();

            return shapes;

        }

        export function drawDefaultLabels(series: D3.UpdateSelection, context: D3.Selection, layout: ILabelLayout, viewPort: IViewport, isAnimator: boolean = false, animationDuration?: number): D3.UpdateSelection {
            if (series && series.data().length > 0) {
                var seriesData = series.data();
                var dataPoints: LineChartDataPoint[] = [];

                for (var i = 0, len = seriesData.length; i < len; i++) {
                    Array.prototype.push.apply(dataPoints, seriesData[i].data);
                }

                return dataLabelUtils.drawDefaultLabelsForDataPointChart(dataPoints, context, layout, viewPort, isAnimator, animationDuration);
            }
        }

        export function normalizeInfinityInScale(scale: D3.Scale.GenericScale<any>): void {
            // When large values (eg Number.MAX_VALUE) are involved, a call to scale.nice occasionally
            // results in infinite values being included in the domain. To correct for that, we need to
            // re-normalize the domain now to not include infinities.
            var scaledDomain = scale.domain();
            for (var i = 0, len = scaledDomain.length; i < len; ++i) {
                if (scaledDomain[i] === Number.POSITIVE_INFINITY)
                    scaledDomain[i] = Number.MAX_VALUE;
                else if (scaledDomain[i] === Number.NEGATIVE_INFINITY)
                    scaledDomain[i] = -Number.MAX_VALUE;
            }

            scale.domain(scaledDomain);
        }
    }

    export module ClusteredUtil {

        export function createValueFormatter(valuesMetadata: DataViewMetadataColumn[], interval: number): IValueFormatter {
            return StackedUtil.createValueFormatter(valuesMetadata, /*is100pct*/ false, interval);
        }

        export function clearColumns(
            mainGraphicsContext: D3.Selection,
            itemCS: ClassAndSelector): void {

            debug.assertValue(mainGraphicsContext, 'mainGraphicsContext');
            debug.assertValue(itemCS, 'itemCS');

            var cols = mainGraphicsContext.selectAll(itemCS.selector)
                .data([]);

            cols.exit().remove();
        }
    }

    export interface ValueMultiplers {
        pos: number;
        neg: number;
    }

    export module StackedUtil {
        var constants = {
            percentFormat: '0%',
            roundingError: 0.0001,
        };

        export function getSize(scale: D3.Scale.GenericScale<any>, size: number): number {
            return AxisHelper.diffScaled(scale, 0, size);
        }

        export function calcValueDomain(data: ColumnChartSeries[], is100pct: boolean): NumberRange {
            var defaultNumberRange = {
                min: 0,
                max: 10
            };

            if (data.length === 0)
                return defaultNumberRange;

            // Can't use AxisHelper because Stacked layout has a slightly different calc, (position - valueAbs)
            var min = d3.min<ColumnChartSeries, number>(data, d => d3.min<ColumnChartDataPoint, number>(d.data, e => e.position - e.valueAbsolute));
            var max = d3.max<ColumnChartSeries, number>(data, d => d3.max<ColumnChartDataPoint, number>(d.data, e => e.position));

            if (is100pct) {
                min = Double.roundToPrecision(min, constants.roundingError);
                max = Double.roundToPrecision(max, constants.roundingError);
            }

            return {
                min: min,
                max: max,
            };
        }

        export function getValueAxis(
            data: ColumnChartData,
            is100Pct: boolean,
            size: number,
            scaleRange: number[],
            forcedTickCount?: number,
            forcedYDomain?: any[]
            ): IAxisProperties {
            var valueDomain = calcValueDomain(data.series, is100Pct),
                min = valueDomain.min,
                max = valueDomain.max;

            var maxTickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(size);
            var bestTickCount = ColumnUtil.getTickCount(min, max, data.valuesMetadata, maxTickCount, is100Pct, forcedTickCount);
            var normalizedRange = AxisHelper.normalizeLinearDomain({ min: min, max: max });
            var valueDomainNorm = [normalizedRange.min, normalizedRange.max];

            var combinedDomain = AxisHelper.combineDomain(forcedYDomain, valueDomainNorm);

            var scale = d3.scale.linear()
                .range(scaleRange)
                .domain(combinedDomain)
                .nice(bestTickCount || undefined)
                .clamp(AxisHelper.scaleShouldClamp(combinedDomain, valueDomainNorm));

            ColumnUtil.normalizeInfinityInScale(scale);

            var yTickValues: any[] = AxisHelper.getRecommendedTickValuesForALinearRange(bestTickCount, scale);

            var d3Axis = d3.svg.axis()
                .scale(scale)
                .tickValues(yTickValues);

            var yInterval = ColumnChart.getTickInterval(yTickValues);
            var yFormatter = StackedUtil.createValueFormatter(
                data.valuesMetadata,
                is100Pct,
                yInterval);
            d3Axis.tickFormat(yFormatter.format);

            var values = yTickValues.map((d: ColumnChartDataPoint) => yFormatter.format(d));

            return {
                axis: d3Axis,
                scale: scale,
                formatter: yFormatter,
                values: values,
                axisType: ValueType.fromDescriptor({ numeric: true }),
                axisLabel: null,
                isCategoryAxis: false
            };
        }

        export function createValueFormatter(valuesMetadata: DataViewMetadataColumn[], is100Pct: boolean, interval: number): IValueFormatter {
            // TODO: Passing 0 in createFormatter below is a temporary workaround. As long as we fix createFormatter
            // to pass scaleInterval parameter instead min and max, we can remove it.
            if (is100Pct)
                return valueFormatter.create({ format: constants.percentFormat, value: interval, value2: /* temporary workaround */ 0, allowFormatBeautification: true });

            // Default to apply formatting from the first measure.
            return valueFormatter.create({
                format: valueFormatter.getFormatString(valuesMetadata[0], columnChartProps.general.formatString),
                value: interval,
                value2: /* temporary workaround */ 0,
                allowFormatBeautification: true
            });
        }

        export function getStackedMultiplier(
            dataView: DataViewCategorical,
            rowIdx: number,
            seriesCount: number,
            categoryCount: number,
            converterStrategy: IColumnChartConverterStrategy): ValueMultiplers {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(rowIdx, 'rowIdx');

            var pos: number = 0,
                neg: number = 0;
            
            for (var i = 0; i < seriesCount; i++) {
                var value: number = converterStrategy.getValueBySeriesAndCategory(i, rowIdx);
                value = AxisHelper.normalizeNonFiniteNumber(value);

                if (value > 0)
                    pos += value;
                else if (value < 0)
                    neg -= value;
            }

            var absTotal = pos + neg;
            return {
                pos: pos ? (pos / absTotal) / pos : 1,
                neg: neg ? (neg / absTotal) / neg : 1,
            };
        }

        export function clearColumns(
            mainGraphicsContext: D3.Selection,
            itemCS: ClassAndSelector): void {

            debug.assertValue(mainGraphicsContext, 'mainGraphicsContext');
            debug.assertValue(itemCS, 'itemCS');

            var bars = mainGraphicsContext.selectAll(itemCS.selector)
                .data([]);

            bars.exit().remove();
        }
    }

    export class DataWrapper {
        private data: CartesianData;
        private isScalar: boolean;

        public constructor(columnChartData: CartesianData, isScalar: boolean) {
            this.data = columnChartData;
            this.isScalar = isScalar;
        }

        public lookupXValue(index: number, type: ValueType): any {
            debug.assertValue(this.data, 'this.data');

            var isDateTime = AxisHelper.isDateTime(type);
            if (isDateTime && this.isScalar)
                return new Date(index);

            var data = this.data;
            if (type.text) {
                debug.assert(index < data.categories.length, 'category index out of range');
                return data.categories[index];
            }
            else {
                var firstSeries = data.series[0];
                if (firstSeries) {
                    var seriesValues = firstSeries.data;
                    if (seriesValues) {
                        if (this.data.hasHighlights)
                            index = index * 2;
                        var dataPoint = seriesValues[index];
                        if (dataPoint) {
                            if (isDateTime)
                                return new Date(dataPoint.categoryValue);
                            return dataPoint.categoryValue;
                        }
                    }
                }
            }

            return index;
        }
    }
}