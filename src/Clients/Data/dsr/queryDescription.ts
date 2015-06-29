//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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