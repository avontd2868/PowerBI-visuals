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

module powerbi.data.services {
    export module SemanticQuerySerializer {
        import StringExtensions = jsCommon.StringExtensions;

        interface StandaloneSourceRefExpression {
            Schema: string;
            Entity: string;
        }

        /** Returns the QueryDefinition that this SemanticQuery represents, including optional additional filter. */
        export function serializeQuery(query: SemanticQuery): QueryDefinition {
            debug.assertValue(query, 'query');

            // From
            var queryFrom: data.EntitySource[] = [],
                from = query.from(),
                fromKeys = from.keys();
            for (var i = 0, len = fromKeys.length; i < len; i++) {
                var key = fromKeys[i],
                    entity = from.entity(key);

                queryFrom.push({
                    Name: key,
                    Entity: entity.entity,
                    Schema: entity.schema,
                });
            }

            // Where
            var queryWhere: data.QueryFilter[],
                whereItems = query.where();
            if (whereItems && whereItems.length) {
                queryWhere = [];
                for (var i = 0, len = whereItems.length; i < len; i++) {
                    var filter = whereItems[i];

                    var queryFilter: QueryFilter = {
                        Condition: QueryExpressionBuilder.create(filter.condition),
                    };

                    if (filter.target)
                        queryFilter.Target = filter.target.map(QueryExpressionBuilder.create);

                    queryWhere.push(queryFilter);
                }
            }

            // OrderBy
            var queryOrderBy: data.QuerySortClause[],
                orderByItems = query.orderBy();
            if (orderByItems && orderByItems.length) {
                queryOrderBy = [];
                for (var i = 0, len = orderByItems.length; i < len; i++) {
                    var clause = orderByItems[i];
                    queryOrderBy.push({
                        Direction: clause.direction,
                        Expression: QueryExpressionBuilder.create(clause.expr),
                    });
                }
            }

            // Select
            var querySelect: QueryExpressionContainer[] = [],
                selectItems = query.select();
            for (var i = 0, len = selectItems.length; i < len; i++)
                querySelect.push(QueryExpressionBuilder.createNamed(selectItems[i]));

            var contract: QueryDefinition = {
                Version: SemanticQueryVersions.Version2,
                From: queryFrom,
                Select: querySelect,
            };

            if (queryWhere)
                contract.Where = queryWhere;
            if (queryOrderBy)
                contract.OrderBy = queryOrderBy;

            return contract;
        }

        export function deserializeQuery(contract: QueryDefinition): SemanticQuery {
            debug.assertValue(contract, 'contract');

            var queryVersion = contract.Version ? contract.Version : SemanticQueryVersions.Version0;
            var upgradeToV1 = queryVersion < SemanticQueryVersions.Version1;

            // From
            var from = Deserializer.from(contract.From);
            var builder = new SemanticQueryBuilder(from);

            // Where
            var where = contract.Where;
            if (where) {
                for (var i = 0, len = where.length; i < len; i++) {
                    var whereItem = Deserializer.filter(where[i], from);
                    if (whereItem) {

                        // DEVNOTE this is temporary code to upgrade the filter to the latest
                        //         version of semantic query; once the upgrade is done on the 
                        //         server side this code should turn into an assert.
                        if (upgradeToV1) {
                            whereItem = FilterTargetUpgrader.Upgrade(queryVersion, whereItem);
                        }

                        builder.addWhere(whereItem);
                    }
                }
            }

            // OrderBy
            var orderBy = contract.OrderBy;
            if (orderBy) {
                for (var i = 0, len = orderBy.length; i < len; i++)
                    builder.addOrderBy(Deserializer.sort(orderBy[i], from));
            }

            // Select
            var select = contract.Select,
                selectNames: { [name: string]: boolean } = {};
            for (var i = 0, len = select.length; i < len; i++) {
                builder.addSelect(Deserializer.select(select[i], selectNames, from));
            }

            return builder.toQuery();
        }

        export function serializeFilter(filter: SemanticFilter): FilterDefinition {
            // From
            var queryFrom: data.EntitySource[] = [],
                from = filter.from(),
                fromKeys = from.keys();
            for (var i = 0, len = fromKeys.length; i < len; i++) {
                var key = fromKeys[i],
                    entity = from.entity(key);
                queryFrom.push({
                    Name: key,
                    Entity: entity.entity,
                    Schema: entity.schema,
                });
            }

            // Where
            var queryWhere: data.QueryFilter[] = [],
                where = filter.where();
            for (var i = 0, len = where.length; i < len; i++) {
                var filterClause = where[i];

                var queryClause: QueryFilter = {
                    Condition: QueryExpressionBuilder.create(filterClause.condition),
                };

                if (filterClause.target)
                    queryClause.Target = filterClause.target.map(QueryExpressionBuilder.create);

                queryWhere.push(queryClause);
            }

            var contract: FilterDefinition = {
                Version: SemanticQueryVersions.Version2,
                From: queryFrom,
                Where: queryWhere,
            };

            return contract;
        }

        export function deserializeFilter(contract: FilterDefinition): SemanticFilter {
            debug.assertValue(contract, 'contract');

            var filterVersion = contract.Version ? contract.Version : SemanticQueryVersions.Version0;
            var upgradeToV1 = filterVersion < SemanticQueryVersions.Version1;

            // From
            var from = Deserializer.from(contract.From);
            var builder = new SemanticQueryBuilder(from);

            // Where
            var where = contract.Where;
            for (var i = 0, len = where.length; i < len; i++) {
                var whereItem = Deserializer.filter(where[i], from);
                if (whereItem) {

                    // DEVNOTE this is temporary code to upgrade the filter to the latest
                    //         version of semantic query; once the upgrade is done on the 
                    //         server side this code should turn into an assert.
                    if (upgradeToV1) {
                        whereItem = FilterTargetUpgrader.Upgrade(filterVersion, whereItem);
                    }

                    builder.addWhere(whereItem);
                }
            }

            return builder.toFilter();
        }

        export function serializeExpr(contract: SQExpr): QueryExpressionContainer {
            debug.assertValue(contract, 'contract');

            return QueryExpressionBuilder.createStandalone(contract);
        }

        export function deserializeExpr(input: QueryExpressionContainer): SQExpr {
            debug.assertValue(input, 'input');

            return ExprBuilder.createStandalone(input);
        }

        module Deserializer {
            export function from(contract: data.EntitySource[]): SQFrom {
                debug.assertValue(contract, 'contract');

                var items: { [name: string]: SQFromEntitySource } = {};
                for (var i = 0, len = contract.length; i < len; i++) {
                    var source = contract[i];
                    items[source.Name] = {
                        entity: source.Entity,
                        schema: source.Schema,
                    };
                }

                return new SQFrom(items);
            }

            export function filter(contract: data.QueryFilter, from: SQFrom): SQFilter {
                debug.assertValue(contract, 'contract');
                debug.assertValue(from, 'from');

                var condition = ExprBuilder.create(contract.Condition, from);
                if (!condition)
                    return;

                var sqFilter: SQFilter = {
                    condition: condition,
                };

                if (contract.Target)
                    sqFilter.target = contract.Target.map(t => ExprBuilder.create(t, from));

                return sqFilter;
            }

            export function sort(contract: data.QuerySortClause, from: SQFrom): SQSortDefinition {
                debug.assertValue(contract, 'contract');
                debug.assertValue(from, 'from');

                return {
                    direction: contract.Direction,
                    expr: ExprBuilder.create(contract.Expression, from),
                };
            }

            export function select(contract: QueryExpressionContainer, selectNames: { [name: string]: boolean }, from: SQFrom): NamedSQExpr {
                debug.assertValue(contract, 'contract');
                debug.assertValue(from, 'from');

                var expr = ExprBuilder.create(contract, from);
                var name: string = contract.Name || StringExtensions.findUniqueName(selectNames, SQExprUtils.defaultName(expr));
                selectNames[name] = true;

                return {
                    name: name,
                    expr: expr,
                };
            }
        }

        class QueryExpressionBuilder implements ISQExprVisitor<QueryExpressionContainer> {
            private static instance: QueryExpressionBuilder = new QueryExpressionBuilder();
            private static standaloneInstance: QueryExpressionBuilder = new QueryExpressionBuilder(true);
            private standalone: boolean;

            constructor(standalone?: boolean) {
                this.standalone = standalone;
            }

            public static create(expr: SQExpr): QueryExpressionContainer {
                return expr.accept(QueryExpressionBuilder.instance);
            }

            public static createNamed(namedExpr: NamedSQExpr): QueryExpressionContainer {
                var container = namedExpr.expr.accept(QueryExpressionBuilder.instance);
                if (namedExpr.name)
                    container.Name = namedExpr.name;

                return container;
            }

            /** Serializes standalone expressions, which include entity names directly rather than variable references. */
            public static createStandalone(expr: SQExpr): QueryExpressionContainer {
                return expr.accept(QueryExpressionBuilder.standaloneInstance);
            }

            public visitColumnRef(expr: data.SQColumnRefExpr): QueryExpressionContainer {
                return {
                    Column: {
                        Expression: expr.source.accept(this),
                        Property: expr.ref,
                    }
                };
            }

            public visitMeasureRef(expr: data.SQMeasureRefExpr): QueryExpressionContainer {
                return {
                    Measure: {
                        Expression: expr.source.accept(this),
                        Property: expr.ref,
                    }
                };
            }

            public visitAggr(expr: data.SQAggregationExpr): QueryExpressionContainer {
                return {
                    Aggregation: {
                        Expression: expr.arg.accept(this),
                        Function: expr.func,
                    }
                };
            }

            public visitBetween(expr: data.SQBetweenExpr): QueryExpressionContainer {
                return {
                    Between: {
                        Expression: expr.arg.accept(this),
                        LowerBound: expr.lower.accept(this),
                        UpperBound: expr.upper.accept(this),
                    }
                };
            }

            public visitIn(expr: data.SQInExpr): QueryExpressionContainer {
                var values = expr.values,
                    valuesSerialized: QueryExpressionContainer[][] = [];

                for (var i = 0, len = values.length; i < len; i++)
                    valuesSerialized.push(this.serializeAll(values[i]));

                return {
                    In: {
                        Expressions: this.serializeAll(expr.args),
                        Values: valuesSerialized,
                    }
                };
            }

            public visitEntity(expr: data.SQEntityExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                var sourceRef;
                if (this.standalone) {
                    var standaloneExpr: StandaloneSourceRefExpression = {
                        Schema: expr.schema,
                        Entity: expr.entity,
                    };
                    sourceRef = standaloneExpr;
                }
                else {
                    debug.assertValue(expr.variable, 'expr.variable');
                    sourceRef = { Source: expr.variable };
                }

                return {
                    SourceRef: sourceRef
                };
            }

            public visitAnd(expr: data.SQAndExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    And: {
                        Left: expr.left.accept(this),
                        Right: expr.right.accept(this),
                    }
                };
            }

            public visitOr(expr: data.SQOrExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    Or: {
                        Left: expr.left.accept(this),
                        Right: expr.right.accept(this),
                    }
                };
            }

            public visitCompare(expr: data.SQCompareExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    Comparison: {
                        ComparisonKind: expr.kind,
                        Left: expr.left.accept(this),
                        Right: expr.right.accept(this),
                    }
                };
            }

            public visitContains(expr: data.SQContainsExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    Contains: {
                        Left: expr.left.accept(this),
                        Right: expr.right.accept(this),
                    }
                };
            }

            public visitDateAdd(expr: data.SQDateAddExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    DateAdd: {
                        Expression: expr.arg.accept(this),
                        Amount: expr.amount,
                        TimeUnit: expr.unit,
                    }
                };
            }

            public visitDateSpan(expr: data.SQDateSpanExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    DateSpan: {
                        Expression: expr.arg.accept(this),
                        TimeUnit: expr.unit
                    }
                };
            }

            public visitExists(expr: data.SQExistsExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    Exists: {
                        Expression: expr.arg.accept(this),
                    }
                };
            }

            public visitNot(expr: data.SQNotExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    Not: {
                        Expression: expr.arg.accept(this),
                    }
                };
            }

            public visitNow(expr: data.SQNowExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');
                return { Now: {} };
            }

            public visitStartsWith(expr: data.SQStartsWithExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                return {
                    StartsWith: {
                        Left: expr.left.accept(this),
                        Right: expr.right.accept(this),
                    }
                };
            }

            public visitConstant(expr: data.SQConstantExpr): QueryExpressionContainer {
                debug.assertValue(expr, 'expr');

                switch (expr.type.primitiveType) {
                    case PrimitiveType.Boolean:
                    case PrimitiveType.DateTime:
                    case PrimitiveType.Decimal:
                    case PrimitiveType.Integer:
                    case PrimitiveType.Double:
                    case PrimitiveType.Null:
                    case PrimitiveType.Text:
                        return { Literal: { Value: expr.valueEncoded } };
                    default:
                        debug.assertFail('Unrecognized kind: ' + expr.type.primitiveType);
                }
            }

            private serializeAll(exprs: SQExpr[]): QueryExpressionContainer[] {
                var result: QueryExpressionContainer[] = [];

                for (var i = 0, len = exprs.length; i < len; i++)
                    result.push(exprs[i].accept(this));

                return result;
            }
        }

        // DEVNOTE: once the temporary filter target upgrade code has been removed,
        //          the VisualFilterKind and FilterKindDetector should move to the
        //          VisualFilterMappingResolver.
        export enum VisualFilterKind {
            /** Indicates a column filter (e.g., Continent == Europe). (A.k.a. attribute filter, slicer) */
            Column,
            /** Indicates a measure filter (e.g., Sum(Sales) > 10,000). */
            Measure,
            /** Indicates an exists filter. */
            Exists,
        }

        /** Visitor detecting the filter kind based on the filter condition. */
        export class FilterKindDetector extends DefaultSQExprVisitorWithTraversal {
            private filterKind: VisualFilterKind;

            constructor() {
                super();
                this.filterKind = VisualFilterKind.Column;
            }

            public static run(expr: SQExpr): VisualFilterKind {
                debug.assertValue(expr, "expr");

                var detector = new FilterKindDetector();
                expr.accept(detector);
                return detector.filterKind;
            }

            public visitMeasureRef(expr: SQMeasureRefExpr): void {
                this.filterKind = VisualFilterKind.Measure;
            }

            public visitExists(expr: SQExistsExpr): void {
                this.filterKind = VisualFilterKind.Exists;
            }

            public visitAggr(expr: SQAggregationExpr): void {
                this.filterKind = VisualFilterKind.Measure;
            }
        }

        class FilterTargetUpgrader {
            public static Upgrade(fromVersion: number, filter: SQFilter): SQFilter {
                if (!filter)
                    return null;

                if (!filter.condition)
                    return null;

                // DEVNOTE if we are deserializing a version 0 filter and the filter is
                //         not an exists filter, drop the target.
                var filterKind = FilterKindDetector.run(filter.condition);
                if (fromVersion === SemanticQueryVersions.Version0 && filterKind !== VisualFilterKind.Exists) {
                    return {
                        condition: filter.condition
                    };
                }

                return filter;
            }
        }

        module ExprBuilder {
            export function create(contract: QueryExpressionContainer, from: SQFrom): SQExpr {
                debug.assertValue(contract, 'contract');

                return fromColumnRef(contract.Column, from)
                    || fromMeasureRef(contract.Measure, from)
                    || fromSourceRef(contract.SourceRef, from)
                    || fromAggr(contract.Aggregation, from)
                    || fromAnd(contract.And, from)
                    || fromBetween(contract.Between, from)
                    || fromIn(contract.In, from)
                    || fromOr(contract.Or, from)
                    || fromContains(contract.Contains, from)
                    || fromCompare(contract.Comparison, from)
                    || fromDateAdd(contract.DateAdd, from)
                    || fromDateSpan(contract.DateSpan, from)
                    || fromExists(contract.Exists, from)
                    || fromNot(contract.Not, from)
                    || fromNow(contract.Now)
                    || fromStartsWith(contract.StartsWith, from)
                    || fromLiteral(contract.Literal)
                    || createConst(contract);
            }

            export function createStandalone(contract: QueryExpressionContainer): SQExpr {
                return create(contract, null);
            }

            function createArray(contracts: QueryExpressionContainer[], from: SQFrom): SQExpr[] {
                var result: SQExpr[] = [];

                for (var i = 0, len = contracts.length; i < len; i++)
                    result.push(create(contracts[i], from));

                return result;
            }

            export function createConst(contract: QueryExpressionContainer): SQExpr {
                return fromBool(contract.Boolean)
                    || fromDateTime(contract.DateTime)
                    || fromDateTimeSecond(contract.DateTimeSecond)
                    || fromDateTime(contract.Date)
                    || fromDecimal(contract.Decimal)
                    || fromInteger(contract.Integer)
                    || fromNull(contract.Null)
                    || fromNumber(contract.Number)
                    || fromString(contract.String);
            }

            function fromSourceRef(contract: data.QuerySourceRefExpression | StandaloneSourceRefExpression, from?: SQFrom): SQExpr {
                if (!contract)
                    return;

                if (from) {
                    // Normal mode: deserialize as a QuerySourceRefExpression (with a variable reference to the from).
                    var sourceRef = <data.QuerySourceRefExpression>contract;
                    var sourceName = sourceRef.Source;

                    var entity = from.entity(sourceName);
                    if (entity)
                        return SQExprBuilder.entity(entity.schema, entity.entity, sourceName);
                }
                else {
                    // Standalone mode: deserialize as a StandaloneEntityRefExpression (with schema & entity names).
                    var entityRef = <StandaloneSourceRefExpression>contract;
                    return SQExprBuilder.entity(entityRef.Schema, entityRef.Entity);
                }
            }

            function fromColumnRef(contract: data.QueryColumnExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var source = create(contract.Expression, from);
                    if (source)
                        return SQExprBuilder.columnRef(source, contract.Property);
                }
            }

            function fromMeasureRef(contract: data.QueryMeasureExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var source = create(contract.Expression, from);
                    if (source)
                        return SQExprBuilder.measureRef(source, contract.Property);
                }
            }

            function fromAggr(contract: data.QueryAggregationExpression, from?: SQFrom): SQExpr {
                if (contract)
                    return SQExprBuilder.aggregate(create(contract.Expression, from), contract.Function);
            }

            function fromAnd(contract: data.QueryBinaryExpression, from?: SQFrom): SQExpr {
                if (contract)
                    return SQExprBuilder.and(create(contract.Left, from), create(contract.Right, from));
            }

            function fromBetween(contract: data.QueryBetweenExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    return SQExprBuilder.between(
                        create(contract.Expression, from),
                        create(contract.LowerBound, from),
                        create(contract.UpperBound, from));
                }
            }

            function fromIn(contract: data.QueryInExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    return SQExprBuilder.inExpr(
                        createArray(contract.Expressions, from),
                        contract.Values.map(v => createArray(v, from)));
                }
            }

            function fromOr(contract: data.QueryBinaryExpression, from?: SQFrom): SQExpr {
                if (contract)
                    return SQExprBuilder.or(create(contract.Left, from), create(contract.Right, from));
            }

            function fromContains(contract: data.QueryBinaryExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var left = create(contract.Left, from);
                    var right = create(contract.Right, from);
                    if (left && right)
                        return SQExprBuilder.contains(left, right);
                }
            }

            function fromCompare(contract: data.QueryComparisonExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var left = create(contract.Left, from);
                    var right = create(contract.Right, from);
                    if (left && right)
                        return SQExprBuilder.compare(contract.ComparisonKind, left, right);
                }
            }

            function fromDateAdd(contract: data.QueryDateAddExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var expression = create(contract.Expression, from);
                    return SQExprBuilder.dateAdd(contract.TimeUnit, contract.Amount, expression);
                }
            }

            function fromDateSpan(contract: data.QueryDateSpanExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var expression = create(contract.Expression, from);
                    return SQExprBuilder.dateSpan(contract.TimeUnit, expression);
                }
            }

            function fromExists(contract: data.QueryExistsExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var arg = create(contract.Expression, from);
                    if (arg)
                        return SQExprBuilder.exists(arg);
                }
            }

            function fromNot(contract: data.QueryNotExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var arg = create(contract.Expression, from);
                    if (arg)
                        return SQExprBuilder.not(arg);
                }
            }

            function fromNow(contract: data.QueryNowExpression): SQExpr {
                if (contract)
                    return SQExprBuilder.now();
            }

            function fromStartsWith(contract: data.QueryBinaryExpression, from?: SQFrom): SQExpr {
                if (contract) {
                    var left = create(contract.Left, from);
                    var right = create(contract.Right, from);
                    if (left && right)
                        return SQExprBuilder.startsWith(left, right);
                }
            }

            function fromBool(contract: data.QueryBooleanExpression): SQExpr {
                if (contract)
                    return SQExprBuilder.boolean(contract.Value);
            }

            function fromDateTime(contract: data.QueryDateTimeExpression): SQExpr {
                if (contract) {
                    var date = fromDateTimeString(contract);
                    if (date)
                        return SQExprBuilder.dateTime(date);
                }
            }

            function fromDateTimeSecond(contract: data.QueryDateTimeSecondExpression): SQExpr {
                if (contract) {
                    var date = fromDateTimeString(contract);
                    return SQExprBuilder.dateSpan(TimeUnit.Second, SQExprBuilder.dateTime(date));
                }
            }

            function fromDecimal(contract: data.QueryDecimalExpression): SQExpr {
                if (contract) {
                    var value = contract.Value;
                    return SQExprBuilder.decimal(value);
                }
            }

            function fromInteger(contract: data.QueryIntegerExpression): SQExpr {
                if (contract) {
                    var value = contract.Value;
                    return SQExprBuilder.integer(value);
                }
            }

            function fromNull(contract: data.QueryNullExpression): SQExpr {
                if (contract)
                    return SQExprBuilder.nullConstant();
            }

            function fromNumber(contract: data.QueryNumberExpression): SQExpr {
                if (contract)
                    return PrimitiveValueEncoding.parseValueToSQExpr(contract.Value);
            }

            function fromString(contract: data.QueryStringExpression): SQExpr {
                if (contract) {
                    var value = contract.Value;
                    return SQExprBuilder.text(value);
                }
            }

            function fromDateTimeString(contract: data.QueryConstantExpression<string>): Date {
                debug.assertValue(contract, 'contract');

                    // TODO: handle date time parsing error instead of completely dropping it.
                return jsCommon.DateExtensions.tryDeserializeDate(contract.Value);
            }

            function fromLiteral(contract: data.QueryLiteralExpression): SQExpr {
                if (contract)
                    return PrimitiveValueEncoding.parseValueToSQExpr(contract.Value);
            }
        }
    }
}