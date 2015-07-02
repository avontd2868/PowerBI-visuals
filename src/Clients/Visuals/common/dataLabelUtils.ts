//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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

        export function getDefaultColumnLabelSettings(): VisualDataLabelsSettings {
            var labelSettings = getDefaultLabelSettings(false);
            labelSettings.position = null;
            labelSettings.labelColor = null;
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

        export function drawDefaultLabelsForDataPointChart(data: any[], context: D3.Selection, layout: ILabelLayout, viewport: IViewport): D3.UpdateSelection {
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

            if (isAnimator) {
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

        export function getColumnChartLabelLayout(data: ColumnChartData, labelLayoutXY: any, isColumn: boolean, isHundredPercent:boolean): ILabelLayout {

            var formatOverride: string = (isHundredPercent) ? hundredPercentFormat : null;
            var formatter = valueFormatter.create(dataLabelUtils.getLabelFormatterOptions(data.labelSettings, formatOverride));

            return {
                labelText: (d: ColumnChartDataPoint) => {
                    return getLabelFormattedText(formatter.format(d.value), maxLabelWidth);
                },
                labelLayout: labelLayoutXY,
                filter: (d: ColumnChartDataPoint) => {
                    return (d != null && d.value != null && d.value !== 0);
                },
                style: {
                    'fill': (d: ColumnChartDataPoint) => d.labelFill,
                    'text-anchor': isColumn ? 'middle' : 'start',
                },
            };
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

        export function enumerateDataLabels(dataLabelsSettings: VisualDataLabelsSettings, withPosition: boolean, withPrecision: boolean = false, withDisplayUnit: boolean  = false): VisualObjectInstance[] {
            var instance: VisualObjectInstance ={
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
                    value2: value2
                };
            }
            return {
                format: (labelSetting && labelSetting.formatterOptions) ? labelSetting.formatterOptions.format : null,
                precision: labelSetting.precision,
                value: displayUnits,
                value2: value2
            };
        }
    }
}
