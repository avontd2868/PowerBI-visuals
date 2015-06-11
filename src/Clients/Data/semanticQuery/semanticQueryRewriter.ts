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

    export class SemanticQueryRewriter {
        private exprRewriter: ISQExprVisitor<SQExpr>;

        constructor(exprRewriter: ISQExprVisitor<SQExpr>) {
            this.exprRewriter = exprRewriter;
        }

        public rewriteFrom(fromValue: SQFrom): SQFrom {
            var fromContents: { [name: string]: SQFromEntitySource } = {};
            var originalFrom = fromValue,
                originalFromKeys = originalFrom.keys();
            for (var i = 0, len = originalFromKeys.length; i < len; i++) {
                var keyName = originalFromKeys[i],
                    originalEntityRef = originalFrom.entity(keyName),
                    originalEntityExpr = SQExprBuilder.entity(originalEntityRef.schema, originalEntityRef.entity, keyName),
                    updatedEntityExpr = <SQEntityExpr>originalEntityExpr.accept(this.exprRewriter);
                

                fromContents[keyName] = {
                    schema: updatedEntityExpr.schema,
                    entity: updatedEntityExpr.entity,
                };
            }
            return new SQFrom(fromContents);
        }

        public rewriteSelect(selectItems: NamedSQExpr[], from: SQFrom): NamedSQExpr[] {
            debug.assertValue(from, 'from');

            if (!selectItems || selectItems.length === 0)
                return;

            var select: NamedSQExpr[] = [];
            for (var i = 0, len = selectItems.length; i < len; i++) {
                var item = selectItems[i];
                select.push({
                    name: item.name,
                    expr: SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from)
                });
            }

            return select;
        }

        public rewriteOrderBy(orderByItems: SQSortDefinition[], from: SQFrom): SQSortDefinition[]{
            debug.assertValue(from, 'from');

            if (!orderByItems || orderByItems.length === 0)
                return;

            var orderBy: SQSortDefinition[] = [];
            for (var i = 0, len = orderByItems.length; i < len; i++) {
                var item = orderByItems[i],
                    updatedExpr = SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from);
                orderBy.push({
                        direction: item.direction,
                        expr: updatedExpr,
                    });
            }

            return orderBy;
        }

        public rewriteWhere(whereItems: SQFilter[], from: SQFrom): SQFilter[]{
            debug.assertValue(from, 'from');

            if (!whereItems || whereItems.length === 0)
                return;

            var where: SQFilter[] = [];
            for (var i = 0, len = whereItems.length; i < len; i++) {
                var originalWhere = whereItems[i];

                var updatedWhere: SQFilter = {
                    condition: SQExprRewriterWithSourceRenames.rewrite(originalWhere.condition.accept(this.exprRewriter), from),
                };

                if (originalWhere.target)
                    updatedWhere.target = originalWhere.target.map(e => SQExprRewriterWithSourceRenames.rewrite(e.accept(this.exprRewriter), from));

                where.push(updatedWhere);
            }

            return where;
        }
    }
} 