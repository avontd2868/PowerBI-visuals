//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    /** Allows generic traversal and type discovery for a SQExpr tree. */
    export interface ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
    }

    export interface ISQExprVisitor<T> extends ISQExprVisitorWithArg<T, void> {
    }

    /** Default IQueryExprVisitorWithArg implementation that others may derive from. */
    export class DefaultSQExprVisitorWithArg<T, TArg> implements ISQExprVisitorWithArg<T, TArg> {
        public visitEntity(expr: SQEntityExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitAggr(expr: SQAggregationExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitBetween(expr: SQBetweenExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitIn(expr: SQInExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitAnd(expr: SQAndExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitOr(expr: SQOrExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitCompare(expr: SQCompareExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitContains(expr: SQContainsExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitExists(expr: SQExistsExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitNot(expr: SQNotExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitConstant(expr: SQConstantExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDateAdd(expr: SQDateAddExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitNow(expr: SQNowExpr, arg: TArg): T {
            return this.visitDefault(expr, arg);
        }

        public visitDefault(expr: SQExpr, arg: TArg): T {
            return;
        }
    }

    /** Default ISQExprVisitor implementation that others may derive from. */
    export class DefaultSQExprVisitor<T> extends DefaultSQExprVisitorWithArg<T, void> implements ISQExprVisitor<T> {
    }

    /** Default ISQExprVisitor implementation that implements default traversal and that others may derive from. */
    export class DefaultSQExprVisitorWithTraversal implements ISQExprVisitor<void> {
        public visitEntity(expr: SQEntityExpr): void {
            this.visitDefault(expr);
        }

        public visitColumnRef(expr: SQColumnRefExpr): void {
            expr.source.accept(this);
        }

        public visitMeasureRef(expr: SQMeasureRefExpr): void {
            expr.source.accept(this);
        }

        public visitAggr(expr: SQAggregationExpr): void {
            expr.arg.accept(this);
        }

        public visitBetween(expr: SQBetweenExpr): void {
            expr.arg.accept(this);
            expr.lower.accept(this);
            expr.upper.accept(this);
        }

        public visitIn(expr: SQInExpr): void {
            var args = expr.args;
            for (var i = 0, len = args.length; i < len; i++)
                args[i].accept(this);

            var values = expr.values;
            for (var i = 0, len = values.length; i < len; i++) {
                var valueTuple = values[i];
                for (var j = 0, jlen = values.length; j < jlen; j++)
                    valueTuple[j].accept(this);
            }
        }

        public visitAnd(expr: SQAndExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitOr(expr: SQOrExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitCompare(expr: SQCompareExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitContains(expr: SQContainsExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitExists(expr: SQExistsExpr): void {
            expr.arg.accept(this);
        }

        public visitNot(expr: SQNotExpr): void {
            expr.arg.accept(this);
        }

        public visitStartsWith(expr: SQStartsWithExpr): void {
            expr.left.accept(this);
            expr.right.accept(this);
        }

        public visitConstant(expr: SQConstantExpr): void {
            this.visitDefault(expr);
        }

        public visitDateSpan(expr: SQDateSpanExpr): void {
            expr.arg.accept(this);
        }

        public visitDateAdd(expr: SQDateAddExpr): void {
            expr.arg.accept(this);
        }

        public visitNow(expr: SQNowExpr): void {
            this.visitDefault(expr);
        }

        public visitDefault(expr: SQExpr): void {
            return;
        }
    }
} 