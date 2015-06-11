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