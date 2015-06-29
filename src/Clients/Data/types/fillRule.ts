//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    import SQExpr = powerbi.data.SQExpr;

    export interface FillRuleTypeDescriptor {
    }

    export interface FillRuleDefinition extends FillRuleGeneric<SQExpr, SQExpr> {
    }

    export interface FillRule extends FillRuleGeneric<string, number> {
    }

    export interface FillRuleGeneric<TColor, TValue> {
        linearGradient2?: LinearGradient2Generic<TColor, TValue>;
        linearGradient3?: LinearGradient3Generic<TColor, TValue>;
        // stepped2?
        // ...
    }

    export type LinearGradient2 = LinearGradient2Generic<string, number>;
    export type LinearGradient3 = LinearGradient3Generic < string, number>;

    export interface LinearGradient2Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }

    export interface LinearGradient3Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        mid: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }

    export type RuleColorStopDefinition = RuleColorStopGeneric<SQExpr, SQExpr>;
    export type RuleColorStop = RuleColorStopGeneric<string, number>;

    export interface RuleColorStopGeneric<TColor, TValue> {
        color: TColor;
        value?: TValue;
    }
}