//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    export interface QueryDefinition {
        Version?: number;
        From: EntitySource[];
        Where?: QueryFilter[];
        OrderBy?: QuerySortClause[];
        Select: QueryExpressionContainer[];
    }

    export interface FilterDefinition {
        Version?: number;
        From: EntitySource[];
        Where: QueryFilter[];
    }

    export interface EntitySource {
        Name: string;
        EntitySet?: string; // TODO: Remove this when Q&A Silverlight is removed and make Entity required
        Entity?: string;
        Schema?: string;
    }

    export interface QueryFilter {
        Target?: QueryExpressionContainer[];
        Condition: QueryExpressionContainer;
    }

    export interface QuerySortClause {
        Expression: QueryExpressionContainer;
        Direction: QuerySortDirection;
    }

    export interface QueryExpressionContainer {
        Name?: string;

        SourceRef?: QuerySourceRefExpression;
        Column?: QueryColumnExpression;
        Measure?: QueryMeasureExpression;
        Aggregation?: QueryAggregationExpression;

        // Logical
        And?: QueryBinaryExpression;
        Between?: QueryBetweenExpression;
        In?: QueryInExpression;
        Or?: QueryBinaryExpression;
        Comparison?: QueryComparisonExpression;
        Not?: QueryNotExpression;
        Contains?: QueryContainsExpression;
        StartsWith?: QueryStartsWithExpression;
        Exists?: QueryExistsExpression;

        // Constants
        Boolean?: QueryBooleanExpression
        DateTime?: QueryDateTimeExpression;
        DateTimeSecond?: QueryDateTimeSecondExpression;
        Date?: QueryDateTimeExpression;
        Decimal?: QueryDecimalExpression;
        Integer?: QueryIntegerExpression;
        Null?: QueryNullExpression;
        Number?: QueryNumberExpression;
        String?: QueryStringExpression;
        Literal?: QueryLiteralExpression;

        DateSpan?: QueryDateSpanExpression;
        DateAdd?: QueryDateAddExpression;
        Now?: QueryNowExpression;
        // TODO: Still need to add the rest of the QueryExpression types.
    }

    export interface QueryPropertyExpression {
        Expression: QueryExpressionContainer;
        Property: string;
    }

    export interface QueryColumnExpression extends QueryPropertyExpression {
    }

    export interface QueryMeasureExpression extends QueryPropertyExpression  {
    }

    export interface QuerySourceRefExpression {
        Source: string
    }

    export interface QueryAggregationExpression {
        Function: QueryAggregateFunction;
        Expression: QueryExpressionContainer;
    }

    export interface QueryBinaryExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
    }

    export interface QueryBetweenExpression {
        Expression: QueryExpressionContainer;
        LowerBound: QueryExpressionContainer;
        UpperBound: QueryExpressionContainer;
    }

    export interface QueryInExpression {
        Expressions: QueryExpressionContainer[];
        Values: QueryExpressionContainer[][];
    }

    export interface QueryComparisonExpression extends QueryBinaryExpression {
        ComparisonKind: QueryComparisonKind;
    }

    export interface QueryContainsExpression extends QueryBinaryExpression { }

    export interface QueryNotExpression {
        Expression: QueryExpressionContainer;
    }

    export interface QueryStartsWithExpression extends QueryBinaryExpression { }

    export interface QueryExistsExpression {
        Expression: QueryExpressionContainer;
    }

    export interface QueryConstantExpression<T> {
        Value: T
    }

    export interface QueryLiteralExpression {
        Value: string
    }

    export interface QueryBooleanExpression extends QueryConstantExpression<boolean> { }
    export interface QueryDateTimeExpression extends QueryConstantExpression<string> { }
    export interface QueryDateTimeSecondExpression extends QueryConstantExpression<string> { }
    export interface QueryDecimalExpression extends QueryConstantExpression<number> { }
    export interface QueryIntegerExpression extends QueryConstantExpression<number> { }
    export interface QueryNumberExpression extends QueryConstantExpression<string> { }
    export interface QueryNullExpression { }
    export interface QueryStringExpression extends QueryConstantExpression<string> { }

    export interface QueryDateSpanExpression {
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }

    export interface QueryDateAddExpression {
        Amount: number;
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }

    export interface QueryNowExpression { }

    export enum TimeUnit {
        Day = 0,
        Week = 1,
        Month = 2,
        Year = 3,
        Decade = 4,
        Second = 5,
        Minute = 6,
        Hour = 7,
    }

    export enum QueryAggregateFunction {
        Sum = 0,
        Avg = 1,
        Count = 2,
        Min = 3,
        Max = 4,
        CountNonNull = 5,
    }

    export enum QuerySortDirection {
        Ascending = 1,
        Descending = 2,
    }

    export enum QueryComparisonKind {
        Equal = 0,
        GreaterThan = 1,
        GreaterThanOrEqual = 2,
        LessThan = 3,
        LessThanOrEqual = 4,
    }

    export interface SemanticQueryDataShapeCommand {
        Query: QueryDefinition;
        Binding: DataShapeBinding;
    }

    /** Defines semantic data types. */
    export enum SemanticType {
        None = 0x0,
        Number = 0x1,
        Integer = Number + 0x2,
        DateTime = 0x4,
        Time = 0x08,
        Date = DateTime + 0x10,
        Month = Integer + 0x20,
        Year = Integer + 0x40,
        YearAndMonth = 0x80,
        MonthAndDay = 0x100,
        Decade = Integer + 0x200,
        YearAndWeek = 0x400,
        String = 0x800,
        Boolean = 0x1000,
        Table = 0x2000,
        Range = 0x4000,
    }

    export enum SelectKind {
        None,
        Group,
        Measure,
    }

    export interface AuxiliarySelectBinding {
        Value?: string;
    }

    export interface QueryMetadata {
        Select?: SelectMetadata[];
        Filters?: FilterMetadata[];
    }

    // TODO: Stop using SemanticType and ConceptualDataCategory here (may need server contract changes)
    export interface SelectMetadata {
        Restatement: string;
        Type?: SemanticType;

        /** (Optional) The format string for this select.  This can be populated for legacy Q&A tiles. */
        Format?: string;
        DataCategory?: ConceptualDataCategory;

        /** The select projection name. */
        Name?: string;
    }

    export interface FilterMetadata {
        Restatement: string;
        Kind?: FilterKind;
    }

    export enum FilterKind {
        Default,
        Period,
    }
} 