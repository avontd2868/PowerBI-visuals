//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    export module SQExprUtils {
        /** Returns an array of supported aggregates for a given expr and role. */
        export function getSupportedAggregates(
            expr: SQExpr,
            isGroupingOnly: boolean,
            schema: FederatedConceptualSchema): QueryAggregateFunction[] {
            var emptyList: QueryAggregateFunction[] = [];

            var metadata = getMetadataForUnderlyingType(expr, schema);
            // don't use expr.validate as validate will be using this function and we end up in a recursive loop
            if (!metadata) {
                return emptyList;
            }

            var valueType = metadata.type,
                fieldKind = metadata.kind,
                isPropertyIdentity = metadata.idOnEntityKey,
                Agg = QueryAggregateFunction; // alias

            if (!valueType)
                return emptyList;

            // Cannot aggregate on model measures
            if (fieldKind === FieldKind.Measure)
                return emptyList;

            // Cannot aggregate grouping exprs
            if (isGroupingOnly)
                return emptyList;

            if (valueType.numeric || valueType.integer) {
                if (metadata.defaultAggregate === ConceptualDefaultAggregate.None) {
                    return [Agg.Count, Agg.CountNonNull];
                } else {
                    return [Agg.Sum, Agg.Avg, Agg.Min, Agg.Max, Agg.Count, Agg.CountNonNull];
                }
            } else if (valueType.text || valueType.bool || valueType.dateTime) {
                if (isPropertyIdentity)
                    return [Agg.CountNonNull];
                return [Agg.Count, Agg.CountNonNull];
            }

            debug.assertFail("Unexpected expr or role.");
            return emptyList;
        }

        export function indexOfExpr(items: SQExpr[], searchElement: SQExpr): number {
            debug.assertValue(items, 'items');
            debug.assertValue(searchElement, 'searchElement');

            for (var i = 0, len = items.length; i < len; i++) {
                if (SQExpr.equals(items[i], searchElement))
                    return i;
            }
            return -1;
        }

        export function sequenceEqual(x: SQExpr[], y: SQExpr[]): boolean {
            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');

            var len = x.length;
            if (len !== y.length)
                return false;

            for (var i = 0; i < len; i++) {
                if (!SQExpr.equals(x[i], y[i]))
                    return false;
            }

            return true;
        }

        function getMetadataForUnderlyingType(expr: SQExpr, schema: FederatedConceptualSchema): SQExprMetadata {
            // Unwrap the aggregate (if the expr has one), and look at the underlying type.
            var metadata = SQExprBuilder.removeAggregate(expr).getMetadata(schema);

            if (!metadata)
                metadata = expr.getMetadata(schema);

            return metadata;
        }
    }
}