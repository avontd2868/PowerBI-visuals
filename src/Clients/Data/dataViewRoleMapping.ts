//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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