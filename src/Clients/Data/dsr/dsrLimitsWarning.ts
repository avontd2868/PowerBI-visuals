//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export enum LimitType {
        Unknown = -1,
        Top = 0,
        Bottom = 1,
        Sample = 2,
    }

    export class DsrLimitsWarning implements IClientWarning {
        private queryBindingDescriptor: QueryBindingDescriptor;

        public columnNameFromIndex: (index: number) => string;

        constructor(queryBindingDescriptor: QueryBindingDescriptor) {
            this.queryBindingDescriptor = queryBindingDescriptor;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            var limitType: LimitType = LimitType.Unknown;
            var type1: LimitType = LimitType.Unknown;
            var type2: LimitType = LimitType.Unknown;
            var groupings1 = [];
            var groupings2 = [];
            var groupings = [];
            var numberOfTypes: number = 0;

            var limits = this.queryBindingDescriptor.Limits;
            
            if (limits) {
                if (limits.Primary) {
                    type1 = DsrLimitsWarning.getLimitType(limits.Primary);
                    groupings1 = this.queryBindingDescriptor.Expressions.Primary.Groupings;
                }

                if (limits.Secondary) {
                    type2 = DsrLimitsWarning.getLimitType(limits.Secondary);
                    groupings2 = this.queryBindingDescriptor.Expressions.Secondary.Groupings;
                }

                if (type1 !== LimitType.Unknown && type2 !== LimitType.Unknown) {
                    // In this case there are two separate limit warnings; mark type as type 1
                    limitType = type1;
                    groupings = groupings1;
                    numberOfTypes = 2;
                }
                else if (type1 !== LimitType.Unknown || type2 !== LimitType.Unknown) {
                    // There is one unique type, so set the main type to the known one, and second type to unknown.
                    if (type1 === LimitType.Unknown) {
                        limitType = type2;
                        type2 = LimitType.Unknown;
                        groupings = groupings2;
                        groupings2 = [];
                    }
                    else {
                        limitType = type1;
                        type2 = LimitType.Unknown;
                        groupings = groupings1;
                        groupings2 = [];
                    }
                    numberOfTypes = 1;
                }
            }

            var limitInfoValue: string = limitType === LimitType.Unknown
                ? resourceProvider.get('DsrLimitWarning_TooMuchDataValMultipleColumns')
                : this.getDetailedMessage(groupings, limitType, DsrLimitsWarning.getDefaultDetailedMessage(limitType, resourceProvider), resourceProvider);

            if (numberOfTypes > 1 && groupings2.length > 0) {
                // In the future we should consider separate lines here.
                var secondString: string = this.getDetailedMessage(groupings2, type2, '', resourceProvider);

                if (secondString !== '')
                    limitInfoValue = limitInfoValue + " " + secondString;
            }

            var message: string = DsrLimitsWarning.getMessage(limitType, resourceProvider);
            var key: string = DsrLimitsWarning.getKey(limitType, resourceProvider);
            var details: ErrorDetails = {
                message: message,
                additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: limitInfoValue, }, ],
            };

            return details;
        }

        private static getMessage(type: LimitType, resourceProvider: IStringResourceProvider): string {
            var message: string;

            switch (type) {
                case LimitType.Sample:
                    message = resourceProvider.get('DsrLimitWarning_RepresentativeSampleMessage');
                    break;
                case LimitType.Top:
                case LimitType.Bottom:
                default:
                    message = resourceProvider.get('DsrLimitWarning_TooMuchDataMessage');
                    break;
            }

            return message;
        }

        private static getKey(type: LimitType, resourceProvider: IStringResourceProvider): string {
            var key: string;

            switch (type) {
                case LimitType.Sample:
                    key = resourceProvider.get('DsrLimitWarning_RepresentativeSampleKey');
                    break;
                case LimitType.Top:
                case LimitType.Bottom:
                default:
                    key = resourceProvider.get('DsrLimitWarning_TooMuchDataKey');
                    break;
            }

            return key;
        }

        private getDetailedMessage(groupings: DataShapeExpressionsAxisGrouping[], type: LimitType, defaultString: string, resourceProvider: IStringResourceProvider): string {
            if (!groupings || groupings.length !== 1) {
                return defaultString;
            }

            var keys = groupings[0].Keys;
            for (var i = 0; i < keys.length; i++) {
                var currentKey = keys[i];
                if (currentKey.Select !== null && currentKey.Select !== undefined) {
                    var colName: string = this.columnNameFromIndex(currentKey.Select);
                    if (colName) {
                        var format: string = DsrLimitsWarning.getDetailedMessageFormatForOneColumn(type, resourceProvider);
                        return jsCommon.StringExtensions.format(format, colName);
                    }
                    else {
                        return defaultString;
                    }
                }
            }

            return defaultString;
        }

        private static getDetailedMessageFormatForOneColumn(type: LimitType, resourceProvider: IStringResourceProvider): string {
            switch (type) {
                case LimitType.Sample:
                    return resourceProvider.get('DsrLimitWarning_RepresentativeSampleVal');
                case LimitType.Top:
                case LimitType.Bottom:
                default:
                    return resourceProvider.get('DsrLimitWarning_TooMuchDataVal');
            }
        }

        private static getDefaultDetailedMessage(type: LimitType, resourceProvider: IStringResourceProvider): string {
            switch (type) {
                case LimitType.Sample:
                    return resourceProvider.get('DsrLimitWarning_RepresentativeSampleValMultipleColumns');
                case LimitType.Top:
                case LimitType.Bottom:
                default:
                    return resourceProvider.get('DsrLimitWarning_TooMuchDataValMultipleColumns');
            }
        }

        private static getLimitType(limitDescriptor: DataShapeLimitDescriptor): LimitType {
            var type: LimitType = LimitType.Unknown;

            if (limitDescriptor.Top)
                type = LimitType.Top;
            else if (limitDescriptor.Bottom)
                type = LimitType.Bottom;
            else if (limitDescriptor.Sample)
                type = LimitType.Sample;

            return type;
        }
    }
}