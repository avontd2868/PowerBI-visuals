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

    export enum PointLabelPosition {
        Above,
        Bellow,
    }

    export interface PointDataLabelsSettings extends VisualDataLabelsSettings {
        position: PointLabelPosition;
    }

    export interface VisualDataLabelsSettings {
        show: boolean;
        displayUnits?: number;
        showCategory?: boolean;
        position?: any;
        precision?: number;
        labelColor: string;
        //take settings from chart color or use label settings
        overrideDefaultColor: boolean;
        formatterOptions: ValueFormatterOptions;
    }

    export interface LabelEnabledDataPoint {
        //for collistion detection use
        labelX?: number;
        labelY?: number;
        //for overriding color from label settings
        labelFill?: string;
        //for display units and precision
        labeltext?: string;
    }

    export interface ILabelLayout {
        labelText: (d: any) => string;
        labelLayout: {
            y: (d: any, i: number) => number;
            x: (d: any, i: number) => number;
        };
        filter: (d: any) => boolean;
        style:{};
    }

    export interface DataLabelObject extends DataViewObject {
        show: boolean;
        color: Fill;
        labelDisplayUnits: number;
        labelPrecision?: number;
        labelPosition: any;
    }

    export module dataLabelUtils {

        export var labelMargin: number = 8;
        export var maxLabelWidth: number = 50;
        export var defaultColumnLabelMargin: number = 5;
        export var defaultColumnHalfLabelHeight: number = 4;
        export var LabelTextProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: '12px',
            fontWeight: 'bold',
        };
        export var defaultLabelColor = "#696969"; //dim grey
        export var defaultInsideLabelColor = "#fff"; //white
        export var hundredPercentFormat = "0.00 %;-0.00 %;0.00 %";

        var defaultLabelPrecision: number = 2;        

        var labelsClass: ClassAndSelector = {
            class: 'data-labels',
            selector: '.data-labels',
        };

        export function getDefaultLabelSettings(show: boolean = false, labelColor?: string): VisualDataLabelsSettings {
            return {
                show: show,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                overrideDefaultColor: false,
                precision: defaultLabelPrecision,
                labelColor: labelColor || defaultLabelColor,
                formatterOptions: null,
            };
        }

        export function getDefaultTreemapLabelSettings(): VisualDataLabelsSettings {
            return getDefaultLabelSettings(true, '#fff');
        }

        export function getDefaultColumnLabelSettings(isLabelPositionInside: boolean): VisualDataLabelsSettings {
            var labelSettings = getDefaultLabelSettings(false);
            labelSettings.position = null;
            labelSettings.labelColor = (isLabelPositionInside) ? defaultInsideLabelColor : null;
            return labelSettings;
        }

        export function getDefaultPointLabelSettings(): PointDataLabelsSettings {
            return {
                show: false,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                overrideDefaultColor: false,
                precision: defaultLabelPrecision,
                labelColor: defaultLabelColor,
                formatterOptions: null
            };
        }

        export function getDefaultDonutLabelSettings(): VisualDataLabelsSettings {
            return {
                show: false,
                displayUnits: 0,
                overrideDefaultColor: false,
                precision: defaultLabelPrecision,
                labelColor: defaultLabelColor,
                position: null,
                showCategory: true,
                formatterOptions: null,
            };
        }

        export function drawDefaultLabelsForDataPointChart(data: any[], context: D3.Selection, layout: ILabelLayout, viewport: IViewport, isAnimator: boolean = false, animationDuration?: number): D3.UpdateSelection {
            debug.assertValue(data, 'data could not be null or undefined');

            // Hide and reposition labels that overlap
            var dataLabelManager = new DataLabelManager();
            var filteredData = dataLabelManager.hideCollidedLabels(viewport, data, layout);

            var labels = context.selectAll(labelsClass.selector).data(filteredData);
            labels.enter().append('text').classed(labelsClass.class, true);

            labels
                .attr({ x: (d: LabelEnabledDataPoint) => d.labelX, y: (d: LabelEnabledDataPoint) => d.labelY })
                .text((d: LabelEnabledDataPoint) => d.labeltext)
                .style(layout.style);

            if (isAnimator && animationDuration) {
                labels.transition().duration(animationDuration);
            }

            labels
                .exit()
                .remove();
            return labels;
        }

        // Funnel chart uses animation and does not use collision detection
        export function drawDefaultLabelsForFunnelChart(data: any[], context: D3.Selection, layout: ILabelLayout, isAnimator: boolean = false, animationDuration?: number): D3.UpdateSelection {
            debug.assertValue(data, 'data could not be null or undefined');

            var filteredData = data.filter(layout.filter);

            var labels = context.selectAll(labelsClass.selector).data(filteredData);
            labels.enter().append('text').classed(labelsClass.class, true);

            labels
                .attr(layout.labelLayout)
                .text(layout.labelText)
                .style(layout.style);

            if (isAnimator && animationDuration) {
                labels.transition().duration(animationDuration);
            }

            labels
                .exit()
                .remove();
            return labels;
        }

        export function cleanDataLabels(context: D3.Selection) {
            var empty = [];
            var labels = context.selectAll(labelsClass.selector).data(empty);
            labels.exit().remove();
        }

        export function setHighlightedLabelsOpacity(context: D3.Selection, hasSelection: boolean, hasHighlights: boolean) {
            context.selectAll(labelsClass.selector).style("fill-opacity",(d: ColumnChartDataPoint) => {
                var labelOpacity = ColumnUtil.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights) < 1 ? 0 : 1;
                return labelOpacity;});
        }

        export function getLabelFormattedText(label: string | number, maxWidth?: number, format?: string ): string {
                    var properties: TextProperties = {
                text: formattingService.formatValue(label, format),
                        fontFamily: LabelTextProperties.fontFamily,
                        fontSize: LabelTextProperties.fontSize,
                        fontWeight: LabelTextProperties.fontWeight,
                    };
            maxWidth = maxWidth ? maxWidth : maxLabelWidth;

            return TextMeasurementService.getTailoredTextOrDefault(properties, maxWidth);
        }

        export function getMapLabelLayout(labelSettings: PointDataLabelsSettings): ILabelLayout {
            
            return {
                labelText: (d: MapVisualDataPoint) => {
                    return getLabelFormattedText(d.labeltext);
                },
                labelLayout: {
                    x: (d: MapVisualDataPoint) => d.x,
                    y: (d: MapVisualDataPoint) => {
                        var margin = d.radius + labelMargin;
                        return labelSettings.position === PointLabelPosition.Above ? d.y - margin : d.y + margin;
                    },
                },
                filter: (d: MapVisualDataPoint) => {
                    return (d != null && d.labeltext != null);
                },
                style: {
                    'fill': (d: MapVisualDataPoint) => d.labelFill,
                },
            };
        }

        export function getColumnChartLabelLayout(data: ColumnChartData, labelLayoutXY: any, isColumn: boolean, isHundredPercent: boolean, axisFormatter: IValueFormatter, axisOptions: ColumnAxisOptions): ILabelLayout {

            var value2: number = null;
            if (data.labelSettings.displayUnits === 0 && axisFormatter && axisFormatter.displayUnit)
                value2 = axisFormatter.displayUnit.value;
            
            var formatOverride: string = (isHundredPercent) ? hundredPercentFormat : null;
            var formatter = valueFormatter.create(dataLabelUtils.getLabelFormatterOptions(data.labelSettings, formatOverride, value2));
            var hasSelection = false;
            for (var i = 0, ilen = data.series.length; i < ilen; i++) {
                var dataPoints = data.series[i].data;
                if (dataHasSelection(dataPoints))
                    hasSelection = true;
            }
            

            return {
                labelText: (d: ColumnChartDataPoint) => {
                    return getLabelFormattedText(formatter.format(d.value), maxLabelWidth);
                },
                labelLayout: labelLayoutXY,
                filter: (d: ColumnChartDataPoint) => {
                    return (d != null && d.value != null && d.value !== 0 && validateLabelsSize(d, axisOptions));
                },
                style: {
                    'fill': (d: ColumnChartDataPoint) => d.labelFill,
                    'text-anchor': isColumn ? 'middle' : 'start',
                    'fill-opacity': (d: ColumnChartDataPoint) => {
                        //if bar's opacity is DimmedOpacity (less than 1) labels opacity swap to 0
                        var labelOpacity = ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, data.hasHighlights) < 1 ? 0 : 1;
                        return labelOpacity;
                    }
                },
            };
        }

        //valide for stacked column/bar chart and 100% stacked column/bar chart,
        // that labels that should to be inside the shape aren't bigger then shapes,
        function validateLabelsSize(d: ColumnChartDataPoint, axisOptions: ColumnAxisOptions): boolean {
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var columnWidth = axisOptions.columnWidth;
            var properties: TextProperties = {
                text: d.labeltext,
                fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
            };
            var textWidth = TextMeasurementService.measureSvgTextWidth(properties);
            var textHeight = TextMeasurementService.measureSvgTextHeight(properties);
            var shapeWidth, shapeHeight;
            var inside = false;
            switch (d.chartType) {
                case ColumnChartType.stackedBar:
                    shapeWidth = -StackedUtil.getSize(xScale, d.valueAbsolute);
                    shapeHeight = columnWidth;
                    inside = d.lastSeries ? false : true;
                    break;
                case ColumnChartType.hundredPercentStackedBar:
                    shapeWidth = -StackedUtil.getSize(xScale, d.valueAbsolute);
                    shapeHeight = columnWidth;
                    inside = true;
                    break;
                case ColumnChartType.stackedColumn:
                    shapeWidth = columnWidth;
                    shapeHeight = StackedUtil.getSize(yScale, d.valueAbsolute);
                    inside = d.lastSeries ? false : true;
                    break;
                case ColumnChartType.hundredPercentStackedColumn:
                    shapeWidth = columnWidth;
                    shapeHeight = StackedUtil.getSize(yScale, d.valueAbsolute);
                    inside = true;
                    break;
                default:
                    return true;
            }

            //checking that labels aren't greater than shape
            if (inside && ((textWidth > shapeWidth) || textHeight > shapeHeight)) return false;
            return true;
        }

        export function getScatterChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, viewport: IViewport, sizeRange: NumberRange): ILabelLayout {

            return {
                labelText: (d: ScatterChartDataPoint) => {
                    return getLabelFormattedText(d.category);
                },
                labelLayout: {
                    x: (d: ScatterChartDataPoint) => xScale(d.x),
                    y: (d: ScatterChartDataPoint) => {
                        var margin = ScatterChart.getBubbleRadius(d.radius, sizeRange, viewport) + labelMargin;
                        return labelSettings.position === PointLabelPosition.Above ? yScale(d.y) - margin : yScale(d.y) + margin;
                },
                },
                filter: (d: ScatterChartDataPoint) => {
                    return (d != null && d.category != null);
                },
                style: {
                    'fill': (d: ScatterChartDataPoint) => d.labelFill,
                    'fill-opacity': (d: ScatterChartDataPoint) => ScatterChart.getBubbleOpacity(d, false),
                    'font-family': LabelTextProperties.fontFamily,
                    'font-size': LabelTextProperties.fontSize,
                    'font-weight': LabelTextProperties.fontWeight,
                },
            };
        }

        export function getLineChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, isScalar: boolean): ILabelLayout {
            var formatter = valueFormatter.create(dataLabelUtils.getLabelFormatterOptions(labelSettings));
            return {
                labelText: (d: LineChartDataPoint) => {
                    return getLabelFormattedText(formatter.format(d.value));
                },
                labelLayout: {
                    x: (d: LineChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex),
                    y: (d: LineChartDataPoint) => { return labelSettings.position === PointLabelPosition.Above ? yScale(d.value) - labelMargin : yScale(d.value) + labelMargin; },
                },
                filter: (d: LineChartDataPoint) => {
                    return (d != null && d.value != null);
                },
                style: {
                    'fill': (d: LineChartDataPoint) => d.labelFill,
                    'fill-opacity': 1,
                    'font-family': LabelTextProperties.fontFamily,
                    'font-size': LabelTextProperties.fontSize,
                    'font-weight': LabelTextProperties.fontWeight,
                },
            };
        }

        export function getFunnelChartLabelLayout(
            data: FunnelData,
            axisOptions: FunnelAxisOptions, innerTextHeightDelta: number,
            textMinimumPadding: number,
            labelSettings: VisualDataLabelsSettings,
            currentViewport: IViewport): ILabelLayout {

            var yScale = axisOptions.yScale;
            var xScale = axisOptions.xScale;
            var marginLeft = axisOptions.margin.left;

            //the bars are tranform, verticalRange mean horizontal range, xScale is y, yscale is x
            var halfRangeBandPlusDelta = axisOptions.xScale.rangeBand() / 2 + innerTextHeightDelta;
            var pixelSpan = axisOptions.verticalRange / 2;
            var formatString = valueFormatter.getFormatString(data.valuesMetadata[0], funnelChartProps.general.formatString);
            var textMeasurer: (textProperties) => number = TextMeasurementService.measureSvgTextWidth;
            var formatter = valueFormatter.create(dataLabelUtils.getLabelFormatterOptions(labelSettings, formatString));

            return {
                labelText: (d: FunnelSlice) => {
                    var barWidth = Math.abs(yScale(d.value) - yScale(0));
                    var insideAvailableSpace = Math.abs(yScale(d.value) - yScale(0)) - (textMinimumPadding * 2);
                    var outsideAvailableSpace = pixelSpan - (barWidth / 2) - textMinimumPadding;

                    var maximumTextSize = Math.max(insideAvailableSpace, outsideAvailableSpace);

                    return getLabelFormattedText(formatter.format(d.value), maximumTextSize);
                },
                labelLayout: {
                    y: (d, i) => {
                        return xScale(i) + halfRangeBandPlusDelta;
                    },
                    x: (d: FunnelSlice) => {
                        var barWidth = Math.abs(yScale(d.value) - yScale(0));
                        var insideAvailableSpace = Math.abs(yScale(d.value) - yScale(0)) - (textMinimumPadding * 2);
                        var outsideAvailableSpace = pixelSpan - (barWidth / 2) - textMinimumPadding;

                        var maximumTextSize = Math.max(insideAvailableSpace, outsideAvailableSpace);

                        var properties: TextProperties = {
                            text: getLabelFormattedText(formatter.format(d.value), maximumTextSize),
                            fontFamily: LabelTextProperties.fontFamily,
                            fontSize: LabelTextProperties.fontSize,
                            fontWeight: LabelTextProperties.fontWeight,
                        };

                        var textLength = textMeasurer(properties);

                        // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
                        var labelPosition = labelSettings.position;
                        if (labelPosition === powerbi.labelPosition.outsideEnd && outsideAvailableSpace < textLength)
                            labelPosition = powerbi.labelPosition.insideCenter;
                        else if (labelPosition === powerbi.labelPosition.insideCenter && insideAvailableSpace < textLength) {
                            labelPosition = powerbi.labelPosition.outsideEnd;
                        }

                        switch (labelPosition) {
                            case powerbi.labelPosition.outsideEnd:
                                d.labelFill = d.labelFill === '#FFFFFF' ? d.color : d.labelFill;
                                return marginLeft + pixelSpan + (barWidth / 2) + textMinimumPadding + (textLength / 2);
                            default:
                                // Inside position, if color didn't override, then the color is white
                                d.labelFill = labelSettings.overrideDefaultColor ? d.labelFill : '#FFFFFF';
                                return marginLeft + pixelSpan;
                        }
                    },
                },
                filter: (d: FunnelSlice) => {
                    return (d != null && d.value != null);
                },
                style: {
                    'fill': (d: FunnelSlice) => d.labelFill,
                    'fill-opacity': (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, false, false, false),
                },
            };
        }

        export function enumerateDataLabels(dataLabelsSettings: VisualDataLabelsSettings, withPosition: boolean, withPrecision: boolean = false, withDisplayUnit: boolean  = false, labelPositionObjects?: string[]): VisualObjectInstance[] {
            if (!dataLabelsSettings)
                return [];
            var instance: VisualObjectInstance = {
                objectName: 'labels',
                selector: null,
                properties: {
                    show: dataLabelsSettings.show,
                    color: dataLabelsSettings.labelColor,
                    //labelDisplayUnits: dataLabelsSettings.displayUnits,
                    //TODO: enable that when formatting is ready
                    //labelPrecision: dataLabelsSettings.precision
                    //labelDisplayUnits: dataLabelsSettings.displayUnits,
                },
                validValues: labelPositionObjects,
            };
            //TODO: enable that when descriptor is ready for all visuals
            if (withDisplayUnit) {
                instance.properties['labelDisplayUnits'] = dataLabelsSettings.displayUnits;
            }
            //TODO: enable that when descriptor is ready for all visuals
            if (withPrecision) {
                instance.properties['labelPrecision'] = dataLabelsSettings.precision;
                }
            //TODO: enable that when descriptor is ready
            if (withPosition) {
                instance.properties['labelPosition'] = dataLabelsSettings.position;
            }

            return [instance];
        }

        export function enumerateCategoryLabels(dataLabelsSettings: VisualDataLabelsSettings, withFill: boolean, isDonutChart: boolean = false): VisualObjectInstance[] {
            var labelSettings = (dataLabelsSettings)
                ? dataLabelsSettings
                : (isDonutChart)
                ? getDefaultDonutLabelSettings()
                : getDefaultPointLabelSettings();

            var instance: VisualObjectInstance = {
                objectName: 'categoryLabels',
                selector: null,
                properties: {
                    show: isDonutChart
                    ? labelSettings.showCategory
                    : labelSettings.show,
                },
            };
            
            if (withFill) {
                instance.properties['color'] = labelSettings.labelColor;
            }
            
            return [instance];
        }

        export function getDefaultFunnelLabelSettings(defaultColor?: string): VisualDataLabelsSettings {
            return {
                show: true,
                position: powerbi.labelPosition.insideCenter,
                displayUnits: 0,
                overrideDefaultColor: false,
                precision: defaultLabelPrecision,
                labelColor: defaultColor || defaultLabelColor,
                formatterOptions: null,
            };
        }

        export function getLabelFormatterOptions(labelSetting: VisualDataLabelsSettings, formatOverride?: string, value2?: number): ValueFormatterOptions {
            //displayUnitSystem avoid scaling for year values (1000 to 3000), set value to bigger than Year.Max
            var displayUnits = (labelSetting.displayUnits === 1000) ? 10000 : labelSetting.displayUnits;

            if (formatOverride) {
                return {
                    format: formatOverride,
                    precision: labelSetting.precision,
                    value: displayUnits,
                    value2: value2,
                    allowFormatBeautification: true,
                };
            }
            return {
                format: (labelSetting && labelSetting.formatterOptions) ? labelSetting.formatterOptions.format : null,
                precision: labelSetting.precision,
                value: displayUnits,
                value2: value2,
                allowFormatBeautification: true,
            };
        }

        export function getFormatterOptionsColumn(columns: DataViewMetadataColumn[]): DataViewMetadataColumn {
            if (columns) {
                return _.find(columns, (col) => col.format != null);
            }
            return null;
        }
    }
}
