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
    export function createSchemaChangeRewriters(changes: SchemaChange[]): SQExprRewriter[] {
        debug.assertValue(changes, 'changes');
        var rewriters: SQExprRewriter[] = [];
        for (var i = 0, length = changes.length; i < length; i++) {
            var change = changes[i];
            if (change.entityRename) {
                rewriters.push(new EntityRenameRewriter(change.entityRename));
            }
            if (change.propertyRename) {
                rewriters.push(new PropertyRenameRewriter(change.propertyRename));
            }
        }
        return rewriters;
    }

    class EntityRenameRewriter extends SQExprRewriter {
        private change: SchemaChangeType.EntityRename;

        constructor(change: SchemaChangeType.EntityRename) {
            debug.assertValue(change, 'change');

            super();
            this.change = change;
        }

        public visitEntity(expr: SQEntityExpr): SQExpr {
            var change = this.change;
            if (expr.schema === change.schema && expr.entity === change.before)
                return new SQEntityExpr(expr.schema, change.after, expr.variable);

            return expr;
        }
    }

    class PropertyRenameRewriter extends SQExprRewriter {
        private change: SchemaChangeType.PropertyRename;

        constructor(change: SchemaChangeType.PropertyRename) {
            debug.assertValue(change, 'change');

            super();
            this.change = change;
        }

        public visitColumnRef(expr: SQColumnRefExpr): SQExpr {
            var change = this.change;
            if (this.matches(change, expr))
                return new SQColumnRefExpr(expr.source, change.after);

            return expr;
        }

        public visitMeasureRef(expr: SQMeasureRefExpr): SQExpr {
            var change = this.change;
            if (this.matches(change, expr))
                return new SQMeasureRefExpr(expr.source, change.after);

            return expr;
        }

        private matches(change: SchemaChangeType.PropertyRename, expr: SQPropRefExpr): boolean {
            debug.assertValue(change, 'change');
            debug.assertValue(expr, 'expr');

            var fieldDef = expr.asFieldDef();
            debug.assertValue(fieldDef, 'fieldDef');
            return (fieldDef.schema === change.schema &&
                fieldDef.entity === change.entity &&
                expr.ref === change.before);
        }
    }
}  