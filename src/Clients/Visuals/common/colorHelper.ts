//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import SQExprShortSerializer = data.SQExprShortSerializer;

    export class ColorHelper {
        private fillProp: DataViewObjectPropertyIdentifier;
        private defaultDataPointColor: string;
        private colors: IDataColorPalette;

        constructor(colors: IDataColorPalette, fillProp: DataViewObjectPropertyIdentifier, defaultDataPointColor?: string) {
            this.colors = colors;
            this.fillProp = fillProp;
            this.defaultDataPointColor = defaultDataPointColor;
        }

        /**
         * Gets the color for the given series value. If no explicit color or default color has been set then the color is
         */
        public getColorForSeriesValue(objects: DataViewObjects, fieldIds: powerbi.data.SQExpr[], value: string): string {
            return (this.fillProp && DataViewObjects.getFillColor(objects, this.fillProp))
                || this.defaultDataPointColor
                || this.colors.getColorByScale(SQExprShortSerializer.serializeArray(fieldIds || []), value).value;
        }

        /** Gets the color for the given measure. */
        public getColorForMeasure(objects: DataViewObjects, queryName: string): string {
            return (this.fillProp && DataViewObjects.getFillColor(objects, this.fillProp))
                || this.defaultDataPointColor
                || this.colors.getColor(queryName).value;
        }

        public static normalizeSelector(selector: data.Selector, isSingleSeries?: boolean): data.Selector {
            debug.assertValue(selector, 'selector');

            // For dynamic series charts, colors are set per category.  So, exclude any measure (metadata repetition) from the selector.
            if (isSingleSeries || selector.data)
                return { data: selector.data };

            return selector;
        }
    }
}