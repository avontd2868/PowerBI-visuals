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
    export interface DataViewRoleMapping {
        /**
         * Defines set of conditions, at least one of which must be satisfied for this mapping to be used.
         * Any roles not specified in the condition accept any number of items.
         */
        conditions?: DataViewRoleMappingCondition[];
        categorical?: DataViewCategoricalRoleMapping;
        table?: DataViewTableRoleMapping;
        single?: DataViewSingleRoleMapping;
	    tree?: DataViewTreeRoleMapping;
    }

    /** Describes whether a particular mapping is fits the set of projections. */
    export interface DataViewRoleMappingCondition {
        [role: string]: ConstrainedNumberRange;
    }

    export interface DataViewCategoricalRoleMapping {
        categories?: DataViewSingleRoleMapping;
        values?: DataViewValuesRoleMapping;
        valueGrouping?: DataViewSingleRoleMapping;
        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange
    }

    export interface DataViewGroupingRoleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string
    }

    export interface DataViewSingleRoleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string;
    }

    export interface DataViewValuesRoleMapping {
        /** Indicates the sequence of roles which are bound to this structure. */
        roles: string[];
    }

    export interface DataViewTableRoleMapping extends DataViewValuesRoleMapping {
        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange
    }

    export interface DataViewTreeRoleMapping {
        nodes?: DataViewGroupingRoleMapping
	    values?: DataViewValuesRoleMapping
	    /** Specifies a constraint on the depth of the tree supported by the visual. */
	    depth?: AcceptabilityNumberRange
    }

    export interface AcceptabilityNumberRange {
        /** Specifies a preferred range of values for the constraint. */
        preferred?: ConstrainedNumberRange;
        /** Specifies a supported range of values for the constraint. Defaults to preferred if not specified. */
        supported?: ConstrainedNumberRange;
    }
}