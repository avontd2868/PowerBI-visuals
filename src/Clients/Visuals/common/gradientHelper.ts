//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export interface GradientSettings {
        diverging: boolean;
        minColor: any;
        midColor?: any;
        maxColor: any;
        minValue?: number;
        midValue?: number;
        maxValue?: number;
    };

    interface GradientColors {
        minColor: string;
        midColor?: string;
        maxColor: string;
    }

    export module GradientUtils {

        import SQExprBuilder = powerbi.data.SQExprBuilder;
        import DataViewObjectPropertyDefinition = powerbi.data.DataViewObjectPropertyDefinition;
        var DefaultMidColor: string = "#ffffff";

        export function shouldShowGradient(visualConfig): boolean {
            var isShowGradienCard: boolean = visualConfig && visualConfig.query && visualConfig.query.projections && visualConfig.query.projections['Gradient'] ? true : false;
            return isShowGradienCard;
        }

        export function getUpdatedGradientSettings(gradientObject: data.DataViewObjectDefinitions): GradientSettings {
            var gradientSettings: GradientSettings;

            if (gradientObject && !$.isEmptyObject(gradientObject)) {

                gradientSettings = getDefaultGradientSettings();

                for (var propertyName in gradientSettings) {
                    var hasProperty: boolean = (<Object>gradientObject).hasOwnProperty(propertyName);
                    if (hasProperty) {
                        var value: any = gradientObject[propertyName];

                        if (value && value.solid && value.solid.color) {
                            value = value.solid.color;
                        }

                        gradientSettings[propertyName] = value;
                    }
                }
            }

            return gradientSettings;
        }

        export function getGradientMeasureIndex(dataViewCategorical: DataViewCategorical): number {
            if (dataViewCategorical && dataViewCategorical.values) {
                var grouped = dataViewCategorical.values.grouped();
                return DataRoleHelper.getMeasureIndexOfRole(grouped, 'Gradient');
            }
            return -1;
        }

        export function hasGradientRole(dataViewCategorical: DataViewCategorical): boolean {
            var gradientMeasureIndex = getGradientMeasureIndex(dataViewCategorical);
            return gradientMeasureIndex >= 0;
        }

        export function getDefaultGradientSettings(): GradientSettings {

            var colors: GradientColors = getDefaultColors();
            var gradientSettings: GradientSettings = {
                diverging: false,
                minColor: colors.minColor,
                midColor: DefaultMidColor,
                maxColor: colors.maxColor,
                minValue: undefined,
                midValue: undefined,
                maxValue: undefined,
            };

            return gradientSettings;
        }

        export function getDefaultFillRuleDefinition(): DataViewObjectPropertyDefinition {
            return getLinearGradien2FillRuleDefinition();
        }

        export function updateFillRule(propertyName: string, propertyValue: any, definitions: powerbi.data.DataViewObjectDefinitions): void {

            var dataPointProperties: any = definitions["dataPoint"][0].properties;
            var fillRule: any = dataPointProperties.fillRule;
            var numericValueExpr: data.SQConstantExpr;

            if (!fillRule) {
                return;
            }

            if ($.isNumeric(propertyValue)) {
                numericValueExpr = propertyValue !== undefined ? SQExprBuilder.double(+propertyValue) : undefined;;
            }

            if (propertyName === "minColor") {
                updateMinColor(fillRule, propertyValue);
            }
            else if (propertyName === "midColor") {
                updateMidColor(fillRule, propertyValue);
            }
            else if (propertyName === "maxColor") {
                updateMaxColor(fillRule, propertyValue);
            }
            else if (propertyName === "minValue") {
                updateMinValue(fillRule, numericValueExpr);
            }
            else if (propertyName === "midValue") {
                updateMidValue(fillRule, numericValueExpr);
            }
            else if (propertyName === "maxValue") {
                updateMaxValue(fillRule, numericValueExpr);
            }
            else if (propertyName === "diverging") {
                if (propertyValue) {
                    fillRule = getLinearGradien3FillRuleDefinition(fillRule);
                }
                else {
                    fillRule = getLinearGradien2FillRuleDefinition(fillRule);
                }
                dataPointProperties.fillRule = fillRule;
            }
            else if (propertyName === "revertToDefault") {
                fillRule = this.getDefaultFillRuleDefinition();
                dataPointProperties.fillRule = fillRule;
            }
        }

        export function getGradientSettings(baseFillRule: FillRuleDefinition): GradientSettings {
            if (baseFillRule) {
                return getGradientSettingsFromRule(baseFillRule);
            }
            else {
                return getDefaultGradientSettings();
            }
        }

        export function getFillRule(objectDefinitions: data.DataViewObjectDefinitions): FillRuleDefinition {
            if (objectDefinitions && objectDefinitions["dataPoint"] && objectDefinitions["dataPoint"].length > 0 && objectDefinitions["dataPoint"][0].properties) {
                return <FillRuleDefinition>objectDefinitions["dataPoint"][0].properties['fillRule'];
            }
            return null;
        }

        function getDefaultColors(): GradientColors {

            var dataColors: IDataColorPalette = new powerbi.visuals.DataColorPalette();
            var maxColorInfo: IColorInfo = dataColors.getColor(0);
            var colors = d3.scale.linear()
                .domain([0, 100])
                .range(["#ffffff", maxColorInfo.value]);
            var maxColor: string = maxColorInfo.value;
            var minColor: string = <any>colors(20);
            var midColor: string = DefaultMidColor;

            return {
                minColor: minColor,
                midColor: midColor,
                maxColor: maxColor,
            };
        }

        export function getGradientSettingsFromRule(fillRule: FillRuleDefinition): GradientSettings {
            var maxColor: string;
            var minColor: string;
            var midColor: string = DefaultMidColor;
            var maxValue: number;
            var midValue: number;
            var minValue: number;
            var diverging: boolean = fillRule.linearGradient3 !== undefined;

            if (fillRule.linearGradient2) {
                var maxColorExpr: any = fillRule.linearGradient2.max.color;
                var minColorExpr: any = fillRule.linearGradient2.min.color;
                var maxValueExpr: any = fillRule.linearGradient2.max.value;
                var minValueExpr: any = fillRule.linearGradient2.min.value;
                maxColor = maxColorExpr.value;
                minColor = minColorExpr.value;
                if (maxValueExpr) {
                    maxValue = <number>maxValueExpr.value;
                }
                if (minValueExpr) {
                    minValue = <number>minValueExpr.value;
                }
            }
            else if (fillRule.linearGradient3) {
                var maxColorExpr: any = fillRule.linearGradient3.max.color;
                var midColorExpr: any = fillRule.linearGradient3.mid.color;
                var minColorExpr: any = fillRule.linearGradient3.min.color;
                var maxValueExpr: any = fillRule.linearGradient3.max.value;
                var midValueExpr: any = fillRule.linearGradient3.mid.value;
                var minValueExpr: any = fillRule.linearGradient3.min.value;
                maxColor = maxColorExpr.value;
                midColor = midColorExpr.value;
                minColor = minColorExpr.value;
                if (maxValueExpr) {
                    maxValue = <number>maxValueExpr.value;
                }
                if (midValueExpr) {
                    midValue = <number>midValueExpr.value;
                }
                if (minValueExpr) {
                    minValue = <number>minValueExpr.value;
                }
            }

            return {
                diverging: diverging,
                minColor: minColor,
                midColor: midColor,
                maxColor: maxColor,
                minValue: minValue,
                midValue: midValue,
                maxValue: maxValue,
            };
        }

        function getLinearGradien2FillRuleDefinition(baseFillRule?: FillRuleDefinition): DataViewObjectPropertyDefinition {
            var gradientSettings: GradientSettings = getGradientSettings(baseFillRule);
            var fillRuleDefinition: FillRuleDefinition = {
                linearGradient2: {
                    max: { color: SQExprBuilder.text(gradientSettings.maxColor) },
                    min: { color: SQExprBuilder.text(gradientSettings.minColor) },
                }
            };

            return fillRuleDefinition;
        }

        function getLinearGradien3FillRuleDefinition(baseFillRule?: FillRuleDefinition): DataViewObjectPropertyDefinition {
            var gradientSettings: GradientSettings = getGradientSettings(baseFillRule);
            var fillRuleDefinition: FillRuleDefinition = {
                linearGradient3: {
                    max: { color: SQExprBuilder.text(gradientSettings.maxColor) },
                    mid: { color: SQExprBuilder.text(gradientSettings.midColor) },
                    min: { color: SQExprBuilder.text(gradientSettings.minColor) },
                }
            };

            return fillRuleDefinition;
        }

        function updateMinColor(fillRule: FillRuleDefinition, value: string) {
            if (fillRule.linearGradient2) {
                fillRule.linearGradient2.min.color = SQExprBuilder.text(value);
            }
            else if (fillRule.linearGradient3) {
                fillRule.linearGradient3.min.color = SQExprBuilder.text(value);
            }
        }

        function updateMidColor(fillRule: FillRuleDefinition, value: string) {
            if (fillRule.linearGradient3) {
                fillRule.linearGradient3.mid.color = SQExprBuilder.text(value);
            }
        }

        function updateMaxColor(fillRule: FillRuleDefinition, value: string) {
            if (fillRule.linearGradient2) {
                fillRule.linearGradient2.max.color = SQExprBuilder.text(value);
            }
            else if (fillRule.linearGradient3) {
                fillRule.linearGradient3.max.color = SQExprBuilder.text(value);
            }
        }

        function updateMinValue(fillRule: FillRuleDefinition, value: data.SQConstantExpr) {
            if (fillRule.linearGradient2) {
                fillRule.linearGradient2.min.value = value;
            }
            else if (fillRule.linearGradient3) {
                fillRule.linearGradient3.min.value = value;
            }
        }

        function updateMidValue(fillRule: FillRuleDefinition, value: data.SQConstantExpr) {
            if (fillRule.linearGradient3) {
                fillRule.linearGradient3.mid.value = value;
            }
        }

        function updateMaxValue(fillRule: FillRuleDefinition, value: data.SQConstantExpr) {
            if (fillRule.linearGradient2) {
                fillRule.linearGradient2.max.value = value;
            }
            else if (fillRule.linearGradient3) {
                fillRule.linearGradient3.max.value = value;
            }
        }
    };
} 