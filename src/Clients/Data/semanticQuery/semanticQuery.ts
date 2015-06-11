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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import ArrayNamedItems = jsCommon.ArrayNamedItems;

    export interface NamedSQExpr {
        name: string;
        expr: SQExpr;
    }

    export interface SQFilter {
        target?: SQExpr[];
        condition: SQExpr;
    }

    /** Represents an entity reference in SemanticQuery from. */
    export interface SQFromEntitySource {
        entity: string;
        schema: string;
    }

    /** Represents a sort over an expression. */
    export interface SQSortDefinition {
        expr: SQExpr;
        direction: QuerySortDirection;
    }

    export interface QueryFromEnsureEntityResult {
        name: string;
        new?: boolean;
    }

    export interface SQSourceRenames {
        [from: string]: string
    }

    /**
     * Represents a semantic query that is:
     * 1) Round-trippable with a JSON QueryDefinition.
     * 2) Immutable
     * 3) Long-lived and does not have strong references to a conceptual model (only names).
     */
    export class SemanticQuery {
        private static empty: SemanticQuery;
        private fromValue: SQFrom;
        private whereItems: SQFilter[];
        private orderByItems: SQSortDefinition[];
        private selectItems: NamedSQExpr[];

        constructor(from, where, orderBy, select: NamedSQExpr[]) {
            debug.assertValue(from, 'from');
            debug.assertValue(select, 'select');

            this.fromValue = from;
            this.whereItems = where;
            this.orderByItems = orderBy;
            this.selectItems = select;
        }

        public static create(): SemanticQuery {
            if (!SemanticQuery.empty)
                SemanticQuery.empty = new SemanticQuery(new SQFrom(), null, null, []);

            return SemanticQuery.empty;
        }

        private static createWithTrimmedFrom(
            from: SQFrom,
            where: SQFilter[],
            orderBy: SQSortDefinition[],
            select: NamedSQExpr[]): SemanticQuery {

            var unreferencedKeyFinder = new UnreferencedKeyFinder(from.keys());

            // Where
            if (where) {
                for (var i = 0, len = where.length; i < len; i++) {
                    var filter = where[i];

                    filter.condition.accept(unreferencedKeyFinder);

                    var filterTarget = filter.target;
                    if (filterTarget) {
                        for (var j = 0, jlen = filterTarget.length; j < jlen; j++)
                            if (filterTarget[j])
                                filterTarget[j].accept(unreferencedKeyFinder);
                    }
                }
            }

            // OrderBy
            if (orderBy) {
                for (var i = 0, len = orderBy.length; i < len; i++)
                    orderBy[i].expr.accept(unreferencedKeyFinder);
            }

            // Select
            for (var i = 0, len = select.length; i < len; i++)
                select[i].expr.accept(unreferencedKeyFinder);

            var unreferencedKeys = unreferencedKeyFinder.result();
            for (var i = 0, len = unreferencedKeys.length; i < len; i++)
                from.remove(unreferencedKeys[i]);

            return new SemanticQuery(from, where, orderBy, select);
        }

        public from(): SQFrom {
            return this.fromValue.clone();
        }

        /** Returns a query equivalent to this, with the specified selected items. */
        select(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the items being selected in this query. */
        select(): ArrayNamedItems<NamedSQExpr>;
        public select(values?: NamedSQExpr[]): any {
            if (arguments.length === 0)
                return this.getSelect();

            return this.setSelect(values);
        }

        private getSelect(): ArrayNamedItems<NamedSQExpr> {
            return ArrayExtensions.extendWithName<NamedSQExpr>(this.selectItems.map(s => {
                return {
                    name: s.name,
                    expr: s.expr,
                };
            }));
        }

        private setSelect(values: NamedSQExpr[]): SemanticQuery {
            var selectItems: NamedSQExpr[] = [],
                from = this.fromValue.clone();

            for (var i = 0, len = values.length; i < len; i++) {
                var value = values[i];
                selectItems.push({
                    name: value.name,
                    expr: SQExprRewriterWithSourceRenames.rewrite(value.expr, from)
                });
            }

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.orderByItems, selectItems);
        }

        /** Removes the given expression from the select. */
        public removeSelect(expr: SQExpr): SemanticQuery {
            debug.assertValue(expr, 'expr');

            var originalItems = this.selectItems,
                selectItems: NamedSQExpr[] = [];
            for (var i = 0, len = originalItems.length; i < len; i++) {
                var originalExpr = originalItems[i];
                if (SQExpr.equals(originalExpr.expr, expr))
                    continue;

                selectItems.push(originalExpr);
        }

            return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, this.orderByItems, selectItems);
        }

        /** Removes the given expression from order by. */
        public removeOrderBy(expr: SQExpr): SemanticQuery {
            var sorts = this.orderBy();
            for (var i = sorts.length - 1; i >= 0; i--) {
                if (SQExpr.equals(sorts[i].expr, expr))
                    sorts.splice(i, 1);
            }

            return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, sorts, this.selectItems);
        }

        public selectNameOf(expr: SQExpr): string {
            var index = SQExprUtils.indexOfExpr(this.selectItems.map(s => s.expr), expr);
            if (index >= 0)
                return this.selectItems[index].name;
        }

        public setSelectAt(index: number, expr: SQExpr): SemanticQuery {
            debug.assertValue(expr, 'expr');

            if (index >= this.selectItems.length)
                return;

            var select = this.select(),
                from = this.fromValue.clone(),
                originalName = select[index].name;
            select[index] = {
                name: originalName,
                expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
            };

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.orderByItems, select);
        }

        /** Adds a the expression to the select clause. */
        public addSelect(expr: SQExpr): SemanticQuery {
            debug.assertValue(expr, 'expr');

            var selectItems = this.select(),
                from = this.fromValue.clone();
            selectItems.push({
                name: SQExprUtils.uniqueName(selectItems, expr),
                expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
            });

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.orderByItems, selectItems);
        }

        /** Gets or sets the sorting for this query. */
        orderBy(values: SQSortDefinition[]): SemanticQuery;
        orderBy(): SQSortDefinition[];

        public orderBy(values?: SQSortDefinition[]): any {
            if (arguments.length === 0)
                return this.getOrderBy();

            return this.setOrderBy(values);
        }

        private getOrderBy(): SQSortDefinition[] {
            var result: SQSortDefinition[] = [];

            var orderBy = this.orderByItems;
            if (orderBy) {
                for (var i = 0, len = orderBy.length; i < len; i++) {
                    var clause = orderBy[i];

                    result.push({
                        expr: clause.expr,
                        direction: clause.direction,
                    });
                }
            }

            return result;
        }

        private setOrderBy(values: SQSortDefinition[]): SemanticQuery {
            debug.assertValue(values, 'values');

            var updatedOrderBy: SQSortDefinition[] = [],
                from = this.fromValue.clone();
            for (var i = 0, len = values.length; i < len; i++) {
                var clause = values[i];
                updatedOrderBy.push({
                    expr: SQExprRewriterWithSourceRenames.rewrite(clause.expr, from),
                    direction: clause.direction,
                });
            }

            return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, updatedOrderBy, this.selectItems);
        }

        /** Gets or sets the filters for this query. */
        where(values: SQFilter[]): SemanticQuery;
        where(): SQFilter[];

        public where(values?: SQFilter[]): any {
            if (arguments.length === 0)
                return this.getWhere();

            return this.setWhere(values);
        }

        private getWhere(): SQFilter[] {
            var result: SQFilter[] = [];

            var whereItems = this.whereItems;
            if (whereItems) {
                for (var i = 0, len = whereItems.length; i < len; i++)
                    result.push(whereItems[i]);
            }

            return result;
        }

        private setWhere(values: SQFilter[]): SemanticQuery {
            debug.assertValue(values, 'values');

            var updatedWhere: SQFilter[] = [],
                from = this.fromValue.clone();
            for (var i = 0, len = values.length; i < len; i++) {
                var filter = values[i];
                var updatedFilter: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(filter.condition, from),
                };

                var filterTarget = filter.target;
                if (filterTarget) {
                    updatedFilter.target = [];
                    for (var j = 0, jlen = filterTarget.length; j < jlen; j++)
                        if (filterTarget[j]) {
                            var updatedTarget = SQExprRewriterWithSourceRenames.rewrite(filterTarget[j], from);
                            updatedFilter.target.push(updatedTarget);
                        }
                }

                updatedWhere.push(updatedFilter);
            }

            return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.orderByItems, this.selectItems);
        }

        public addWhere(filter: SemanticFilter): SemanticQuery {
            debug.assertValue(filter, 'filter');

            var updatedWhere: SQFilter[] = this.where(),
                incomingWhere: SQFilter[] = filter.where(),
                from = this.fromValue.clone();

            for (var i = 0, len = incomingWhere.length; i < len; i++) {
                var clause = incomingWhere[i];

                var updatedClause: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(clause.condition, from),
                };

                if (clause.target)
                    updatedClause.target = clause.target.map(t => SQExprRewriterWithSourceRenames.rewrite(t, from));

                updatedWhere.push(updatedClause);
            }

            return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.orderByItems, this.selectItems);
        }

        public rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticQuery {
            var rewriter = new SemanticQueryRewriter(exprRewriter);
            var from = rewriter.rewriteFrom(this.fromValue);
            var where = rewriter.rewriteWhere(this.whereItems, from);
            var orderBy = rewriter.rewriteOrderBy(this.orderByItems, from);
            var select = rewriter.rewriteSelect(this.selectItems, from);

            return SemanticQuery.createWithTrimmedFrom(from, where, orderBy, select);
        }
    }

    /** Represents a semantic filter condition.  Round-trippable with a JSON FilterDefinition.  Instances of this class are immutable. */
    export class SemanticFilter {
        private fromValue: SQFrom;
        private whereItems: SQFilter[];

        constructor(from: SQFrom, where: SQFilter[]) {
            debug.assertValue(from, 'from');
            debug.assertValue(where, 'where');

            this.fromValue = from;
            this.whereItems = where;
        }

        public static fromSQExpr(contract: SQExpr): SemanticFilter {
            debug.assertValue(contract, 'contract');

            var from = new SQFrom();

            var rewrittenContract = SQExprRewriterWithSourceRenames.rewrite(contract, from);
            // DEVNOTE targets of some filters are visual specific and will get resolved only during query generation.
            //         Thus not setting a target here.
            var where: SQFilter[] = [{
                condition: rewrittenContract
            }];

            return new SemanticFilter(from, where);
        }

        public from(): SQFrom {
            return this.fromValue.clone();
        }

        public conditions(): SQExpr[] {
            var expressions: SQExpr[] = [];

            var where = this.whereItems;
            for (var i = 0, len = where.length; i < len; i++) {
                var filter = where[i];
                expressions.push(filter.condition);
            }
            return expressions;
        }

        public where(): SQFilter[] {
            var result: SQFilter[] = [];

            var whereItems = this.whereItems;
            for (var i = 0, len = whereItems.length; i < len; i++)
                result.push(whereItems[i]);

            return result;
        }

        public rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticFilter {
            var rewriter = new SemanticQueryRewriter(exprRewriter);
            var from = rewriter.rewriteFrom(this.fromValue);
            var where = rewriter.rewriteWhere(this.whereItems, from);

            return new SemanticFilter(from, where);
        }

        /** Merges a list of SemanticFilters into one. */
        public static merge(filters: SemanticFilter[]): SemanticFilter {
            if (ArrayExtensions.isUndefinedOrEmpty(filters))
                return null;

            if (filters.length === 1)
                return filters[0];

            var firstFilter = filters[0];
            var from = firstFilter.from(),
                where: SQFilter[] = ArrayExtensions.take(firstFilter.whereItems, firstFilter.whereItems.length);

            for (var i = 1, len = filters.length; i < len; i++)
                SemanticFilter.applyFilter(filters[i], from, where);

            return new SemanticFilter(from, where);
        }

        private static applyFilter(filter: SemanticFilter, from: SQFrom, where: SQFilter[]): void {
            debug.assertValue(filter, 'filter');
            debug.assertValue(from, 'from');
            debug.assertValue(where, 'where');

            // Where
            var filterWhereItems = filter.whereItems;
            for (var i = 0; i < filterWhereItems.length; i++) {
                var filterWhereItem = filterWhereItems[i];

                var updatedWhereItem: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(filterWhereItem.condition, from),
                };

                if (filterWhereItem.target)
                    updatedWhereItem.target = filterWhereItem.target.map(e => SQExprRewriterWithSourceRenames.rewrite(e, from));

                where.push(updatedWhereItem);
            }
        }
    }

    /** Represents a SemanticQuery/SemanticFilter from clause. */
    export class SQFrom {
        private items: { [name: string]: SQFromEntitySource };

        constructor(items?: { [name: string]: SQFromEntitySource }) {
            this.items = items || {};
        }

        public keys(): string[] {
            return Object.keys(this.items);
        }

        public entity(key: string): SQFromEntitySource {
            return this.items[key];
        }

        public ensureEntity(entity: SQFromEntitySource, desiredVariableName?: string): QueryFromEnsureEntityResult {
            debug.assertValue(entity, 'entity');

            // 1) Reuse a reference to the entity among the already referenced
            var keys = this.keys();
            for (var i = 0, len = keys.length; i < len; i++) {
                var key = keys[i],
                    item = this.items[key];
                if (item && entity.entity === item.entity && entity.schema === item.schema)
                    return { name: key };
            }

            // 2) Add a reference to the entity
            var candidateName = desiredVariableName || this.candidateName(entity.entity),
                uniqueName: string = candidateName,
                i = 2;
            while (this.items[uniqueName]) {
                uniqueName = candidateName + i++;
            }

            this.items[uniqueName] = entity;
            return { name: uniqueName, new: true };
        }

        public remove(key: string): void {
            delete this.items[key];
        }

        /** Converts the entity name into a short reference name.  Follows the Semantic Query convention of a short name. */
        private candidateName(ref: string): string {
            debug.assertValue(ref, 'ref');

            var idx = ref.lastIndexOf('.');
            if (idx >= 0 && (idx !== ref.length - 1))
                ref = ref.substr(idx + 1);

            return ref.substring(0, 1).toLowerCase();
        }

        public clone(): SQFrom {
            // NOTE: consider deprecating this method and instead making QueryFrom be CopyOnWrite (currently we proactively clone).
            var cloned = new SQFrom();

            // NOTE: we use extend rather than prototypical inheritance on items because we use Object.keys.
            $.extend(cloned.items, this.items);

            return cloned;
        }
    }

    export class SQExprRewriterWithSourceRenames extends SQExprRewriter {
        private renames: SQSourceRenames;

        constructor(renames: SQSourceRenames) {
            debug.assertValue(renames, 'renames');

            super();
            this.renames = renames;
        }

        public visitEntity(expr: SQEntityExpr): SQExpr {
            var updatedName = this.renames[expr.entity];

            if (updatedName)
                return new SQEntityExpr(expr.schema, expr.entity, updatedName);

            return super.visitEntity(expr);
        }

        public rewriteFilter(filter: SQFilter): SQFilter {
            debug.assertValue(filter, 'filter');

            var updatedTargets = undefined;
            if (filter.target)
                updatedTargets = this.rewriteArray(filter.target);

            var updatedCondition = filter.condition.accept(this);

            if (filter.condition === updatedCondition && filter.target === updatedTargets)
                return filter;

            var updatedFilter: SQFilter = {
                condition: updatedCondition,
            };

            if (updatedTargets)
                updatedFilter.target = updatedTargets;

            return updatedFilter;
        }

        public rewriteArray(exprs: SQExpr[]): SQExpr[] {
            debug.assertValue(exprs, 'exprs');

            var updatedExprs: SQExpr[];

            for (var i = 0, len = exprs.length; i < len; i++) {
                var expr = exprs[i],
                    rewrittenExpr = expr.accept(this);

                if (expr !== rewrittenExpr && !updatedExprs)
                    updatedExprs = ArrayExtensions.take(exprs, i);

                if (updatedExprs)
                    updatedExprs.push(rewrittenExpr);
            }

            return updatedExprs || exprs;
        }

        public static rewrite(expr: SQExpr, from: SQFrom): SQExpr {
            debug.assertValue(expr, 'expr');
            debug.assertValue(from, 'from');

            var renames = QuerySourceRenameDetector.run(expr, from);
            var rewriter = new SQExprRewriterWithSourceRenames(renames);
            return expr.accept(rewriter);
        }
    }

    /** Responsible for updating a QueryFrom based on SQExpr references. */
    class QuerySourceRenameDetector extends DefaultSQExprVisitorWithTraversal {
        private from: SQFrom;
        private renames: SQSourceRenames;

        public static run(expr: SQExpr, from: SQFrom): SQSourceRenames {
            var detector = new QuerySourceRenameDetector(from);
            expr.accept(detector);

            return detector.renames;
        }

        constructor(from: SQFrom) {
            debug.assertValue(from, 'from');
            super();

            this.from = from;
            this.renames = {};
        }

        public visitEntity(expr: SQEntityExpr): void {
            // TODO: Renames must take the schema into account, not just entity set name.
            var existingEntity = this.from.entity(expr.variable);
            if (existingEntity && existingEntity.schema === expr.schema && existingEntity.entity === expr.entity)
                return;

            var actualEntity = this.from.ensureEntity(
                {
                    schema: expr.schema,
                    entity: expr.entity,
                },
                expr.variable);

            this.renames[expr.entity] = actualEntity.name;
        }
    }

    /** Visitor for finding unreferenced sources. */
    class UnreferencedKeyFinder extends DefaultSQExprVisitorWithTraversal {
        private keys: string[];

        constructor(keys: string[]) {
            debug.assertValue(keys, 'keys');

            super();
            this.keys = keys;
        }

        public visitEntity(expr: SQEntityExpr): void {
            var index = this.keys.indexOf(expr.variable);
            if (index >= 0)
                this.keys.splice(index, 1);
        }

        public result(): string[] {
            return this.keys;
        }
    }
}