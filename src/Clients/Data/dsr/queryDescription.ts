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

module powerbi.data.dsr {
    import ArrayExtensions = jsCommon.ArrayExtensions;

    /** Represents a logical view of the data shape result metadata. */
    export class QueryDescription {
        private _metadata: QueryMetadata;
        private _binding: QueryBindingDescriptor;

        constructor(metadata: QueryMetadata, binding: QueryBindingDescriptor) {
            debug.assertValue(metadata, 'metadata');
            debug.assertValue(metadata.Select, 'metadata.Select');
            debug.assertValue(binding, 'binding');
            debug.assertValue(binding.Select, 'binding.Select');
            debug.assert(metadata.Select.length === binding.Select.length, 'Metadata and Binding should have same number of select items.');

            this._metadata = metadata;
            this._binding = binding;
        }

        public getSelectRestatements(): string[] {
            return this.getRestatements();
        }

        public getGroupRestatements(): string[] {
            return this.getRestatements(SelectKind.Group);
        }

        public getMeasureRestatements(): string[] {
            return this.getRestatements(SelectKind.Measure);
        }

        public getFilterRestatements(): string[] {
            var filters = this._metadata.Filters;

            if (ArrayExtensions.isUndefinedOrEmpty(filters))
                return null;

            var restatements: string[] = [];

            for (var i = 0, len = filters.length; i < len; i++) {
                var filter = filters[i];
                restatements.push(filter ? filter.Restatement : '');
            }

            return ArrayExtensions.emptyToNull(restatements);
        }

        private getRestatements(kind?: SelectKind): string[] {

            var metadata: QueryMetadata = this._metadata;
            var binding: QueryBindingDescriptor = this._binding;
            var restatements: string[] = [];

            for (var i = 0, len = binding.Select.length; i < len; i++) {
                var selectBinding = binding.Select[i],
                    selectMetadata = metadata.Select[i];

                if (!selectBinding)
                    continue;

                if (kind === undefined || selectBinding.Kind === kind) {
                    restatements.push(selectMetadata.Restatement || '');
                }
            }

            return ArrayExtensions.emptyToNull(restatements);
        }
    }
}