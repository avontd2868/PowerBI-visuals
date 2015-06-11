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
    export interface IQueryBindingDescriptorVisitorWithArg<T> {
        visitDescriptor(discriptor: QueryBindingDescriptor, arg: T): void;
        visitSelect(select: SelectBinding, arg: T): void;
        visitExpressions(expressions: DataShapeExpressions, arg: T): void;
        visitDataShapeExpressionsAxis(axis: DataShapeExpressionsAxis, arg: T): void;
        visitDataShapeExpressionsAxisGrouping(grouping: DataShapeExpressionsAxisGrouping, arg: T): void;
        visitDataShapeExpressionsAxisGroupingKey(groupingKey: DataShapeExpressionsAxisGroupingKey, arg: T): void;
        visitConceptualPropertyReference(propertyRef: ConceptualPropertyReference, arg: T): void;
    }

    /**
     * traverse a query binding descriptior
     * @param {QueryBindingDescriptor} descriptor - Query Binding Descriptor
     * @param {IQueryBindingDescriptorVisitorWithArg} visitor - visitor of query binding descriptor
     */
    export function traverseQueryBindingDescriptorWithArg<T>(descriptor: QueryBindingDescriptor, visitor: IQueryBindingDescriptorVisitorWithArg<T>, arg: T): void {
        debug.assertValue(visitor, "visitor");
        debug.assertValue(descriptor, "descriptor");

        visitor.visitDescriptor(descriptor, arg);
        var selects = descriptor.Select;
        if (selects && selects.length)
            for (var i = 0, length = selects.length; i < length; i++)
                visitor.visitSelect(selects[i], arg);
        var expressions = descriptor.Expressions;
        if (expressions)
            traverseExpressions(expressions, visitor, arg);         
    }

    function traverseExpressions<T>(expressions: DataShapeExpressions, visitor: IQueryBindingDescriptorVisitorWithArg<T>, arg: T): void {
        debug.assertValue(expressions, 'expressions');
        visitor.visitExpressions(expressions, arg);
        debug.assertValue(expressions.Primary, 'Primary');
        traverseDataShapeExpressionsAxis(expressions.Primary, visitor, arg);
        var secondary = expressions.Secondary;
        if (secondary)
            traverseDataShapeExpressionsAxis(secondary, visitor, arg);   
    }

    function traverseDataShapeExpressionsAxis<T>(axis: DataShapeExpressionsAxis, visitor: IQueryBindingDescriptorVisitorWithArg<T>, arg: T): void {
        debug.assertValue(axis, 'axis');
        visitor.visitDataShapeExpressionsAxis(axis, arg);
        var groupings = axis.Groupings;
        debug.assertValue(groupings, 'groupings');
        for (var i = 0, length = groupings.length; i < length; i++)
            traverseDataShapeExpressionsAxisGrouping(groupings[i], visitor, arg);
    }

    function traverseDataShapeExpressionsAxisGrouping<T>(grouping: DataShapeExpressionsAxisGrouping, visitor: IQueryBindingDescriptorVisitorWithArg<T>, arg: T): void {
        debug.assertValue(grouping, 'grouping');
        visitor.visitDataShapeExpressionsAxisGrouping(grouping, arg);
        var keys = grouping.Keys;
        debug.assertValue(keys, 'keys');
        for (var i = 0, length = keys.length; i < length; i++)
            traverseDataShapeExpressionsAxisGroupingKey(keys[i], visitor, arg);
    }

    function traverseDataShapeExpressionsAxisGroupingKey<T>(groupingKey: DataShapeExpressionsAxisGroupingKey, visitor: IQueryBindingDescriptorVisitorWithArg<T>, arg: T): void {
        debug.assertValue(groupingKey, 'groupingKey');
        visitor.visitDataShapeExpressionsAxisGroupingKey(groupingKey, arg);
        debug.assertValue(groupingKey.Source, 'Source');
        visitor.visitConceptualPropertyReference(groupingKey.Source, arg);
    }

    export class DefaultQueryBindingDescriptorVisitor<T> implements IQueryBindingDescriptorVisitorWithArg<T> {
        public visitDescriptor(discriptor: QueryBindingDescriptor, arg: T): void { }
        public visitSelect(select: SelectBinding, arg: T): void { }
        public visitExpressions(expressions: DataShapeExpressions, arg: T): void { }
        public visitDataShapeExpressionsAxis(axis: DataShapeExpressionsAxis, arg: T): void { }
        public visitDataShapeExpressionsAxisGrouping(grouping: DataShapeExpressionsAxisGrouping, arg: T): void { }
        public visitDataShapeExpressionsAxisGroupingKey(groupingKey: DataShapeExpressionsAxisGroupingKey, arg: T): void { }
        public visitConceptualPropertyReference(propertyRef: ConceptualPropertyReference, arg: T): void { }
    }
}