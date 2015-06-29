//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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