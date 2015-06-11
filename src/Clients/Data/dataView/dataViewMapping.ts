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

module powerbi {
    export interface DataViewMapping {
        /**
         * Defines set of conditions, at least one of which must be satisfied for this mapping to be used.
         * Any roles not specified in the condition accept any number of items.
         */
        conditions?: DataViewMappingCondition[];
        categorical?: DataViewCategoricalMapping;
        table?: DataViewTableMapping;
        single?: DataViewSingleMapping;
        tree?: DataViewTreeMapping;
        matrix?: DataViewMatrixMapping;
    }

    /** Describes whether a particular mapping is fits the set of projections. */
    export interface DataViewMappingCondition {
        [dataRole: string]: NumberRange;
    }

    export interface DataViewCategoricalMapping {
        categories?: DataViewRoleMappingWithReduction;
        values?: DataViewRoleMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping;

        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange
    }

    export interface DataViewGroupingRoleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string
    }

    export interface DataViewSingleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string;
    }

    export interface DataViewValuesRoleMapping {
        /** Indicates the sequence of roles which are bound to this structure. */
        roles: string[];
    }

    export interface DataViewTableMapping {
        rows: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction;

        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange
    }

    export interface DataViewTreeMapping {
        nodes?: DataViewGroupingRoleMapping
	    values?: DataViewValuesRoleMapping
	    /** Specifies a constraint on the depth of the tree supported by the visual. */
	    depth?: AcceptabilityNumberRange
    }

    export interface DataViewMatrixMapping {
        rows?: DataViewRoleForMappingWithReduction;
        columns?: DataViewRoleForMappingWithReduction;
        values?: DataViewRoleForMapping;
    }

    /* tslint:disable:no-unused-expression */
    export type DataViewRoleMapping = DataViewRoleBindMapping | DataViewRoleForMapping;
    /* tslint: enable */

    export interface DataViewRoleBindMapping {
        /**
         * Indicates evaluation of a single-valued data role.
         * Equivalent to for, without support for multiple items.
         */
        bind: {
            to: string;
        };
    }

    export interface DataViewRoleForMapping {
        /** Indicates iteration of the in data role, as an array. */
        for: {
            in: string;
        };
    }

    export type DataViewRoleMappingWithReduction = DataViewRoleBindMappingWithReduction | DataViewRoleForMappingWithReduction;

    export interface DataViewRoleBindMappingWithReduction extends DataViewRoleBindMapping, HasReductionAlgorithm {
    }

    export interface DataViewRoleForMappingWithReduction extends DataViewRoleForMapping, HasReductionAlgorithm {
    }

    export interface DataViewGroupedRoleMapping {
        group: {
            by: string;
            select: DataViewRoleMapping[];
            dataReductionAlgorithm?: ReductionAlgorithm;
        };
    }

    export interface DataViewListRoleMapping {
        select: DataViewRoleMapping[];
    }

    export interface DataViewListRoleMappingWithReduction extends DataViewListRoleMapping, HasReductionAlgorithm {
    }

    export interface HasReductionAlgorithm {
        dataReductionAlgorithm?: ReductionAlgorithm;
    }

    /** Describes how to reduce the amount of data exposed to the visual. */
    export interface ReductionAlgorithm {
        top?: DataReductionTop;
        bottom?: DataReductionBottom;
        sample?: DataReductionSample;
        window?: DataReductionWindow;
    }

    /** Reduce the data to the Top(count) items. */
    export interface DataReductionTop {
        count?: number;
    }

    /** Reduce the data to the Bottom count items. */
    export interface DataReductionBottom {
        count?: number;
    }

    /** Reduce the data using a simple Sample of count items. */
    export interface DataReductionSample {
        count?: number;
    }

    /** Allow the data to be loaded one window, containing count items, at a time. */
    export interface DataReductionWindow {
        count?: number;
    }

    export interface AcceptabilityNumberRange {
        /** Specifies a preferred range of values for the constraint. */
        preferred?: NumberRange;
        /** Specifies a supported range of values for the constraint. Defaults to preferred if not specified. */
        supported?: NumberRange;
    }

    /** Defines the acceptable values of a number. */
    export interface NumberRange {
        min?: number;
        max?: number;
    }
}