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