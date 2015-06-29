//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    /** Top-level container for a Data Shape Result. */
    export interface DataShapeResult {
        DataShapes: DataShape[];
    }

    /** Represents a Data Shape. */
    export interface DataShape {
        Id: string;
        'odata.error'?: ODataError;
        IsComplete?: boolean;
        PrimaryHierarchy?: DataMember[];
        SecondaryHierarchy?: DataMember[];
        Calculations?: Calculation[];
        RestartTokens?: (string | boolean)[][];
        DataLimitsExceeded?: Limit[];
    }

    export interface ODataError {
        code: string;
        message: ODataErrorMessage;
        'azure:values'?: AzureValue[];
    }

    export interface AzureValue {
        timestamp?: Date;
        details?: string;
        additionalMessages?: AdditionalErrorMessage[];
    }

    export interface ODataErrorMessage {
        lang: string;
        value: string;
    }

    export interface AdditionalErrorMessage {
        Code: string;
        Severity?: string;
        Message?: string;
        ObjectType?: string;
        ObjectName?: string;
        PropertyName?: string;

    }

    export interface Limit {
        id: string;
    }

    /** Represents a Data Member, with optional Instances for nested groups. */
    export interface DataMember {
        Id: string;
        Instances: GroupInstance[];
    }

    /** Represents instances of a group. */
    export interface GroupInstance {
        RestartFlag?: RestartFlagKind;
        Calculations?: Calculation[];
        Members?: DataMember[];
        Intersections?: Intersection[];
    }

    /** Represents a calculation group. */
    export interface Calculation {
        Id: string;

        /** Value of the calculation. Can be parsed with PrimitiveValueEncoding.parseValue. */
        Value: string;
    }

    /** Represents a DSR intersection. */
    export interface Intersection {
        Id: string;
        Calculations?: Calculation[];
    }

    export enum RestartFlagKind {
        Append = 0,
        Merge = 1,
    }
}