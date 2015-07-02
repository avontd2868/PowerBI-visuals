//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export interface IVisualStyle{
        colorPalette: IColorPalette;
        isHighContrast: boolean;
        titleText: ITextStyle;
        subTitleText: ITextStyle;
        labelText: ITextStyle;
        // TODO 4486317: This is a host-specific property that should be exposed through DataViewObjects.
        maxMarginFactor?: number;
    }

    export interface ITextStyle extends IStyleInfo {
        fontFace?: string;
        fontSize?: string;
        fontWeight?: string;
        color: IColorInfo;
    }

    export interface IColorPalette {
        background?: IColorInfo;
        foreground?: IColorInfo;

        positive?: IColorInfo;
        negative?: IColorInfo;
        separator?: IColorInfo;
        selection?: IColorInfo;

        dataColors: IDataColorPalette;
    }

    export interface IDataColorPalette {
        /** Gets a color based for the specified key value. */
        getColor(key: any): IColorInfo;
        getColorByScale(scaleKey: string, key: string): IColorInfo

        /** Gets the set of sentiment colors used for visuals such as KPIs
        * Note: This is only a temporary API so that we can have reasonable color schemes for KPIs
        * and gauges until the conditional formatting feature is implemented.
        */
        getSentimentColors(): IColorInfo[];

        getBasePickerColors(): IColorInfo[];
    }

    export interface IColorInfo extends IStyleInfo {
        value: string;
    }

    export interface IStyleInfo {
        className?: string;
    }
}