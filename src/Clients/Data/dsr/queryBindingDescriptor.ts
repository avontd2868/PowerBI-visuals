//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
module powerbi.data.dsr {
    export interface QueryBindingDescriptor {
        Select?: SelectBinding[];
        Expressions?: DataShapeExpressions;
        Limits?: DataShapeLimits;
    }

    export interface SelectBinding {
        Kind: SelectKind;
        Depth?: number;
        SecondaryDepth?: number;
        Value?: string;
        Format?: string;

        /**
         * Holds the identifiers for user-facing subtotal values of the Select item (if any).
         * The index into the collection is determined by combining the desired primary depth, the desired
         * secondary depth, and the maximum primary and secondary depths according to the formula:
         * 
         * Index = PrimaryDepth + ((MaxSecondaryDepth - SecondaryDepth) * (MaxPrimaryDepth + 1))
         * 
         * The following diagram shows how this works:
         * 
         * SecondaryDepth:2    1      0
         * 
         * |-----------------------------|
         * |           | SG1       | Tot |
         * |           |-----|-----|     |
         * |           | SG2 | Tot |     |
         * |-----------|-----|-----|-----|    PrimaryDepth:
         * | PG1 | PG2 |  2  |  5  |  8  |    2
         * |     |-----|-----|-----|-----|
         * |     | Tot |  1  |  4  |  7  |    1
         * |-----------|-----|-----|-----|
         * | Tot       |  0  |  3  |  6  |    0
         * |-----------------------------|
         * 
         * We start numbering from the bottom left so the indices remain consistent when
         * there are no secondary groups, and when secondary totals are disabled which are the common cases.
         */
        Subtotal?: string[];
        Max?: string[];
        Min?: string[];
        Count?: string[];
        Type?: SemanticType;
        Highlight?: AuxiliarySelectBinding;
        DataCategory?: string;
    }

    export interface DataShapeExpressions {
        Primary: DataShapeExpressionsAxis;
        Secondary?: DataShapeExpressionsAxis;
    }

    export interface DataShapeExpressionsAxis {
        Groupings: DataShapeExpressionsAxisGrouping[];
    }

    export interface DataShapeExpressionsAxisGrouping {
        Keys: DataShapeExpressionsAxisGroupingKey[];
        Member?: string;
        SubtotalMember?: string;
    }

    export interface DataShapeExpressionsAxisGroupingKey {
        Source: ConceptualPropertyReference;
        Select?: number;
        Calc?: string;
    }

    export interface ConceptualPropertyReference {
        Entity: string;
        Property: string;
    }

    export interface DataShapeLimits {
        Primary?: DataShapeLimitDescriptor;
        Secondary?: DataShapeLimitDescriptor;
    }

    export interface DataShapeLimitDescriptor {
        Id: string;
        Top?: TopLimitDescriptor;
        Bottom?: BottomLimitDescriptor;
        Sample?: SampleLimitDescriptor;
    }

    export interface TopLimitDescriptor extends LimitDescriptor {
    }

    export interface BottomLimitDescriptor extends LimitDescriptor {
    }

    export interface SampleLimitDescriptor extends LimitDescriptor {
    }

    export interface LimitDescriptor {
        Count: number;
    }
}
