//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    /** Aids in building a SemanticQuery from a QueryDefinition. */
    export class SemanticQueryBuilder {
        private from: SQFrom;
        private whereItems: SQFilter[];
        private orderByItems: SQSortDefinition[];
        private selectItems: NamedSQExpr[];

        constructor(from: SQFrom) {
            debug.assertValue(from, 'from');

            this.from = from;
            this.selectItems = [];
        }

        public addWhere(filter: SQFilter): void {
            debug.assertValue(filter, 'filter');

            if (!this.whereItems)
                this.whereItems = [];

            this.whereItems.push(filter);
        }

        public addOrderBy(sort: SQSortDefinition): void {
            debug.assertValue(sort, 'sort');

            if (!this.orderByItems)
                this.orderByItems = [];

            this.orderByItems.push(sort);
        }

        public addSelect(select: NamedSQExpr): void {
            debug.assertValue(select, 'select');

            this.selectItems.push(select);
        }

        public toQuery(): SemanticQuery {
            return new SemanticQuery(this.from, this.whereItems, this.orderByItems, this.selectItems);
        }

        public toFilter(): SemanticFilter {
            debug.assert(!this.orderByItems && this.selectItems.length === 0, 'toFilter must not have orderBy/select specified.');

            if (this.from && this.whereItems)
                return new SemanticFilter(this.from, this.whereItems);
        }
    }
}