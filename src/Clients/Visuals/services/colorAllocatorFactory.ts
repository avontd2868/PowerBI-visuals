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
    export function createColorAllocatorFactory(): IColorAllocatorFactory {
        return new ColorAllocatorFactory();
    }

    class ColorAllocatorFactory implements IColorAllocatorFactory {
        public linearGradient2(options: LinearGradient2): IColorAllocator {
            return new LinearGradient2Allocator(options);
        }

        public linearGradient3(options: LinearGradient3): IColorAllocator {
            return new LinearGradient3Allocator(options);
        }
    }

    class LinearGradient2Allocator implements IColorAllocator {
        private scale: D3.Scale.LinearScale;

        constructor(options: LinearGradient2) {
            debug.assertValue(options, 'options');

            var min = options.min,
                max = options.max;
            this.scale = d3.scale.linear()
                .domain([min.value, max.value])
                .range([min.color, max.color])
                .clamp(true); // process a value outside of the domain - set to extremum values
        }

        public color(value: number): string {
            return <any>this.scale(value);
        }
    }

    class LinearGradient3Allocator implements IColorAllocator {
        private scale: D3.Scale.LinearScale;

        constructor(options: LinearGradient3) {
            debug.assertValue(options, 'options');

            var min = options.min,
                mid = options.mid,
                max = options.max;
            this.scale = d3.scale.linear()
                .domain([min.value, mid.value, max.value])
                .range([min.color, mid.color, max.color])
                .clamp(true); // process a value outside of the domain- set to extremum values
        }

        public color(value: number): string {
            return <any>this.scale(value);
        }
    }
}