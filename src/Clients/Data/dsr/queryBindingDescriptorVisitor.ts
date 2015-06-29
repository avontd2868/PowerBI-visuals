//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
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