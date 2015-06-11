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

    export var cheerMeterProps = {
        dataPoint: {
            defaultColor: <DataViewObjectPropertyIdentifier>{
                objectName: 'dataPoint',
                propertyName: 'defaultColor'
            },
            fill: <DataViewObjectPropertyIdentifier>{
                objectName: 'dataPoint',
                propertyName: 'fill'
            },
        },
    };

    export interface TeamData {
        name: string;
        value: number;
        color: string;
    }

    export interface CheerData {
        teamA: TeamData;
        teamB: TeamData;
    }

    interface CheerLayout {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        fontSize: string;
    }

    export class CheerMeter implements IVisual {
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                },
                {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                },
            ],
            dataViewMappings: [{
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                    },
                },
            }],
            dataPoint: {
                displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                properties: {
                    fill: {
                        displayName: data.createDisplayNameGetter('Visual_Fill'),
                        type: { fill: { solid: { color: true } } }
                    },
                }
            },
        };

        private static DefaultFontFamily = 'cursive';
        private static DefaultFontColor = 'rgb(165, 172, 175)';
        private static DefaultBackgroundColor = '#243C18';
        private static PaddingBetweenText = 15;

        private textOne: D3.Selection;
        private textTwo: D3.Selection;
        private svg: D3.Selection;
        private isFirstTime: boolean = true;

        public static converter(dataView: DataView): CheerData {
            var catValues = dataView.categorical.categories[0].values;
            var values = dataView.categorical.values[0].values;
            var objects = dataView.categorical.categories[0].objects;

            var color1 = DataViewObjects.getFillColor(
                objects[0],
                cheerMeterProps.dataPoint.fill,
                CheerMeter.DefaultFontColor);

            var color2 = DataViewObjects.getFillColor(
                objects[1],
                cheerMeterProps.dataPoint.fill,
                CheerMeter.DefaultFontColor);

            var data = {
                teamA: {
                    name: catValues[0],
                    value: values[0],
                    color: color1
                },
                teamB: {
                        name: catValues[1],
                        value: values[1],
                        color: color2
                    }
                };

            return data;
        }

        public init(options: VisualInitOptions): void {
            var svg = this.svg = d3.select(options.element.get(0)).append('svg');

            this.textOne = svg.append('text')
                .style('font-family', CheerMeter.DefaultFontFamily);

            this.textTwo = svg.append('text')
                .style('font-family', CheerMeter.DefaultFontFamily);
        }

        public onResizing(viewport: IViewport, duration: number) { /* This API will be depricated */ }

        public onDataChanged(options: VisualDataChangedOptions) {/* This API will be depricated */ }

        public update(options: VisualUpdateOptions) {
            var data = CheerMeter.converter(options.dataViews[0]);
            this.draw(data, options.duration, options.viewport);
        }

        private getRecomendedFontProperties(text1: string, text2: string, parentViewport: IViewport): TextProperties {
            var textProperties: TextProperties = {
                fontSize: '',
                fontFamily: CheerMeter.DefaultFontFamily,
                text: text1+text2
            };

            var min = 1;
            var max = 1000;
            var i;
            var maxWidth = parentViewport.width;
            var width = 0;

            while (min <= max) {
                i = (min + max) / 2 | 0;

                textProperties.fontSize = i + 'px';
                width = TextMeasurementService.measureSvgTextWidth(textProperties);

                if (maxWidth > width)
                    min = i + 1;
                else if (maxWidth < width)
                    max = i - 1;
                else
                    break;
            }

            textProperties.fontSize = i + 'px';
            width = TextMeasurementService.measureSvgTextWidth(textProperties);
            if (width > maxWidth) {
                i--;
                textProperties.fontSize = i + 'px';
            }

            return textProperties;
        }

        private calculateLayout(data: CheerData, viewport: IViewport): CheerLayout {
            var text1 = data.teamA.name;
            var text2 = data.teamB.name;
            
            var avaliableViewport: IViewport = { height: viewport.height, width: viewport.width - CheerMeter.PaddingBetweenText };
            var recomendedFontProperties = this.getRecomendedFontProperties(text1, text2, avaliableViewport);

            recomendedFontProperties.text = text1;
            var width1 = TextMeasurementService.measureSvgTextWidth(recomendedFontProperties) | 0;
            
            recomendedFontProperties.text = text2;
            var width2 = TextMeasurementService.measureSvgTextWidth(recomendedFontProperties) | 0;

            var padding = ((viewport.width - width1 - width2 - CheerMeter.PaddingBetweenText) / 2) | 0;

            debug.assert(padding > 0, 'padding');

            recomendedFontProperties.text = text1 + text2;
            var offsetHeight = (TextMeasurementService.measureSvgTextHeight(recomendedFontProperties)) | 0;

            var max = 100;
            var availableHeight = viewport.height - offsetHeight;
            var y1 = (((max - data.teamA.value) / max) * availableHeight + offsetHeight/2) | 0;
            var y2 = (((max - data.teamB.value) / max) * availableHeight + offsetHeight/2) | 0;

            return {
                x1: padding,
                x2: padding + width1 + CheerMeter.PaddingBetweenText,
                y1: y1,
                y2: y2,
                fontSize: recomendedFontProperties.fontSize
            };
        }

        private ensureStartState(layout: CheerLayout, viewport: IViewport) {
            if (this.isFirstTime) {
                this.isFirstTime = false;
                var startY = viewport.height / 2;
                this.textOne.attr(
                    {
                        'x': layout.x1,
                        'y': startY
                    });

                this.textTwo.attr(
                    {
                        'x': layout.x2,
                        'y': startY
                    });
            }
        }

        private draw(data: CheerData, duration: number, viewport: IViewport) {
            var easeName = 'back';
            var textOne = this.textOne;
            var textTwo = this.textTwo;

            this.svg
                .attr({
                    'height': viewport.height,
                    'width': viewport.width
                })
                .style('background-color', CheerMeter.DefaultBackgroundColor);

            var layout = this.calculateLayout(data, viewport);

            this.ensureStartState(layout, viewport);

            textOne
                .style('font-size', layout.fontSize)
                .style('fill', data.teamA.color)
                .text(data.teamA.name);

            textTwo
                .style('fill', data.teamB.color)
                .style('font-size', layout.fontSize)
                .text(data.teamB.name);

            textOne.transition()
                .duration(duration)
                .ease(easeName)
                .attr({
                y: layout.y1,
                x: layout.x1
            });

            textTwo.transition()
                .duration(duration)
                .ease(easeName)
                .attr({
                y: layout.y2,
                x: layout.x2
            });
        }

        public destroy(): void {
            this.svg = null;
            this.textOne = this.textTwo = null;
        }
    }
}