//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    export module DataShapeUtility {
        export function findAndParseCalculation(calcs: Calculation[], id: string): any {
            var calc = findCalculation(calcs, id);
            if (calc)
                return data.PrimitiveValueEncoding.parseValue(calc.Value);
        }

        export function findAndParseCalculationToSQExpr(calcs: Calculation[], id: string): SQExpr {
            var calc = findCalculation(calcs, id);
            if (calc)
                return data.PrimitiveValueEncoding.parseValueToSQExpr(calc.Value);
        }

        export function findCalculation(calcs: Calculation[], id: string): any {
            debug.assertValue(calcs, 'calcs');

            for (var i = 0, len = calcs.length; i < len; i++) {
                var calc = calcs[i];
                if (calc.Id === id)
                    return calc;
            }
        }

        export function getCalculationInstanceCount(dsr: DataShapeResult, descriptor: QueryBindingDescriptor, selectOrdinal: number): number {
            debug.assertValue(descriptor, 'descriptor');
            debug.assertValue(selectOrdinal, 'selectOrdinal');

            if (!dsr || !dsr.DataShapes)
                return null;

            var groupId = descriptor.Select[selectOrdinal].Value;
            for (var i = 0, ilen = dsr.DataShapes.length; i < ilen; i++) {
                var dataShape = dsr.DataShapes[i];
                for (var j = 0, jlen = dataShape.PrimaryHierarchy.length; j < jlen; j++) {
                    var member = dataShape.PrimaryHierarchy[j];
                    if (member.Instances && member.Instances.length) {
                        // We need only find the calculation once.
                        if (findCalculation(member.Instances[0].Calculations, groupId))
                            return member.Instances.length;
                    }
                }
            }
        }

        // TODO: The describeDataType/toConceptualDataCategory methods are deprecated and should be removed 
        // when all usages are moved to new ValueType APIs

        /** Converts SemanticType/DataCategory into a ValueType. */
        export function describeDataType(type?: SemanticType, category?: string): ValueType {
            // Default to None type
            type = (type || SemanticType.None);

            var primitiveType = PrimitiveType.Null;
            switch (type) {
                case SemanticType.String:
                    primitiveType = PrimitiveType.Text;
                    break;
                case SemanticType.Number:
                    primitiveType = PrimitiveType.Double;
                    break;
                case SemanticType.Integer:
                    primitiveType = PrimitiveType.Integer;
                    break;
                case SemanticType.Boolean:
                    primitiveType = PrimitiveType.Boolean;
                    break;
                case SemanticType.Date:
                    primitiveType = PrimitiveType.Date;
                    break;
                case SemanticType.DateTime:
                    primitiveType = PrimitiveType.DateTime;
                    break;
                case SemanticType.Time:
                    primitiveType = PrimitiveType.Time;
                    break;
                case SemanticType.Year:
                    primitiveType = PrimitiveType.Integer;
                    debug.assert(!category || category === 'Year', 'Unexpected category for Year type.');
                    category = 'Year';
                    break;
                case SemanticType.Month:
                    primitiveType = PrimitiveType.Integer;
                    debug.assert(!category || category === 'Month', 'Unexpected category for Month type.');
                    category = 'Month';
                    break;
            }

            return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
        }

        export function increaseLimitForPrimarySegmentation(dataShapeBinding: DataShapeBinding, count: number): void {
            var limits = dataShapeBinding.Limits;
            if (limits) {
                var limitCount = count - 5;
                for (var i = 0, len = limits.length; i < len; i++) {
                    var limit = limits[i];
                    if (limit.Target.Primary !== undefined) {
                        // An extra 5 added since, the server might send more data than the limit
                        // to indicate incomplete dataset, and we don't want to lose outliers.
                        limit.Count = limitCount;
                    }
                }
            }
        }

        export function getTopLevelSecondaryDynamicMember(dataShape: DataShape, dataShapeExpressions: DataShapeExpressions): DataMember {
            debug.assertValue(dataShape, 'dataShape');

            var hierarchy = dataShape.SecondaryHierarchy;
            if (!hierarchy)
                return null;

            if (!dataShapeExpressions || !dataShapeExpressions.Secondary)
                return DataShapeUtility.getDynamicMemberFallback(hierarchy);

            return DataShapeUtility.getDynamicMember(hierarchy, dataShapeExpressions.Secondary.Groupings, 0 /*groupDepth*/);
        }

        export function getTopLevelPrimaryDynamicMember(dataShape: DataShape, dataShapeExpressions: DataShapeExpressions, useTopLevelCalculations?: boolean): DataMember {
            debug.assertValue(dataShape, 'dataShape');

            var hierarchy = dataShape.PrimaryHierarchy;
            if (!hierarchy)
                return null;

            var hasTopLevelCalcs: boolean;
            if (useTopLevelCalculations)
                hasTopLevelCalcs = dataShape.Calculations !== undefined;

            if (!dataShapeExpressions || !dataShapeExpressions.Primary)
                return DataShapeUtility.getDynamicMemberFallback(hierarchy, hasTopLevelCalcs);

            return DataShapeUtility.getDynamicMember(hierarchy, dataShapeExpressions.Primary.Groupings, 0 /*groupDepth*/, hasTopLevelCalcs);
        }

        export function getDynamicMember(dataShapeMembers: DataMember[], axisGroupings: DataShapeExpressionsAxisGrouping[], groupDepth: number, hasTopLevelCalculations?: boolean): DataMember {

            debug.assertValue(dataShapeMembers, 'dataShapeMembers');

            if (dataShapeMembers.length === 0)
                return null;

            if (!axisGroupings || axisGroupings.length === 0)
                return DataShapeUtility.getDynamicMemberFallback(dataShapeMembers, hasTopLevelCalculations);

            var dynamicMemberId = axisGroupings[groupDepth].Member;

            if (!dynamicMemberId)
                return DataShapeUtility.getDynamicMemberFallback(dataShapeMembers, hasTopLevelCalculations);

            for (var i: number = 0; i < dataShapeMembers.length; i++) {
                if (dataShapeMembers[i].Id === dynamicMemberId)
                    return dataShapeMembers[i];
            }

            return null;
        }

        /** Falback mechanism for results that did not contain Member ID on QueryBindingDescriptor. */
        export function getDynamicMemberFallback(dataShapeMembers: DataMember[], hasTopLevelCalculations?: boolean): DataMember {
            if (dataShapeMembers.length === 2) {
                return dataShapeMembers[1];
            }

            if (hasTopLevelCalculations === undefined || hasTopLevelCalculations === true)
                return dataShapeMembers[0];

            return null;
        }
    }
}