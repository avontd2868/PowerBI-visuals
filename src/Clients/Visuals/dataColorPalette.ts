//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export class DataColorPalette implements IDataColorPalette {
        private palettes: { [index: string]: D3.Scale.OrdinalScale };
        private colors: IColorInfo[];
        private defaultColors: D3.Scale.OrdinalScale;

        /**
        * Colors used for sentiment visuals, e.g. KPI, Gauge. Since this is only a temporary implementation which will
        * eventually be superseded by conditional formatting, we don't declare them as part of the theme and instead
        * use a hardcoded color scheme here until conditional formatting is ready.
        */
        private sentimentColors: IColorInfo[] = [
            { value: '#C0433A' }, // Red
            { value: '#E8D62E' }, // Yellow
            { value: '#79C75B' }, // Green
        ];

        /**
         * Creates a DataColorPalette using the given theme, or the default theme.
         */
        constructor(colors?: IColorInfo[]) {
            // TODO: Default theme is currently hardcoded. Theme should eventually come from PV and be added as a parameter in the ctor. 
            this.colors = colors || ThemeManager.getDefaultTheme();
            this.defaultColors = d3.scale.ordinal().range(this.colors);
            this.palettes = {};
        }

        public getColor(key: any): IColorInfo {
            // For now though, just return colors in order.
            return this.defaultColors(key);
        }

        public getColorByScale(scaleKey: string, key: string): IColorInfo {
            var colors = this.palettes[scaleKey];
            if (colors === undefined) {
                colors = d3.scale.ordinal().range(this.colors);
                this.palettes[scaleKey] = colors;
            }

            return colors(key);
        }

        public getSentimentColors(): IColorInfo[] {
            return this.sentimentColors;
        }
    }

    // TODO: When theming support is added, this should be changed into a fully fledged service. For now though we will
    // declare the Theme code as a private implementation detail inside the DataColorPalette so that the code stays hidden
    // until it's ready for wider use.
    class ThemeManager {
        private static colorSectorCount = 12;

        private static defaultBaseColors: IColorInfo[] = [
            // First loop
            { value: '#01B8AA' },
            { value: '#374649' },
            { value: '#FD625E' },
            { value: '#F2C80F' },
            { value: '#5F6B6D' },
            { value: '#8AD4EB' },
            { value: '#FE9666' }, // Bethany's Mango
            { value: '#A66999' },
            { value: '#3599B8' },
            { value: '#DFBFBF' },

            // Second loop
            { value: '#4AC5BB' },
            { value: '#5F6B6D' },
            { value: '#FB8281' },
            { value: '#F4D25A' },
            { value: '#7F898A' },
            { value: '#A4DDEE' },
            { value: '#FDAB89' },
            { value: '#B687AC' },
            { value: '#28738A' },
            { value: '#A78F8F' },

            // Third loop
            { value: '#168980' },
            { value: '#293537' },
            { value: '#BB4A4A' },
            { value: '#B59525' },
            { value: '#475052' },
            { value: '#6A9FB0' },
            { value: '#BD7150' },
            { value: '#7B4F71' },
            { value: '#1B4D5C' },
            { value: '#706060' },

            // Fourth loop
            { value: '#0F5C55' },
            { value: '#1C2325' },
            { value: '#7D3231' },
            { value: '#796419' },
            { value: '#303637' },
            { value: '#476A75' },
            { value: '#7E4B36' },
            { value: '#52354C' },
            { value: '#0D262E' },
            { value: '#544848' },
        ];

        private static defaultTheme: IColorInfo[];

        public static getDefaultTheme(): IColorInfo[] {
            if (!ThemeManager.defaultTheme) {
                // Extend the list of available colors by cycling the base colors
                ThemeManager.defaultTheme = [];
                var baseColors = ThemeManager.defaultBaseColors;
                for (var i = 0; i < ThemeManager.colorSectorCount; ++i) {
                    for (var j = 0, jlen = baseColors.length; j < jlen; ++j) {
                        ThemeManager.defaultTheme.push(
                            {
                                value: jsCommon.color.rotate(baseColors[j].value, i / ThemeManager.colorSectorCount)
                            });
                    }
                }
            }

            return ThemeManager.defaultTheme;
        }
    }
} 