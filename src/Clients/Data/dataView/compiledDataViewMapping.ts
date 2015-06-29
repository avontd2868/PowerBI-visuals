//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    export interface CompiledDataViewMapping {
        metadata: CompiledDataViewMappingMetadata;

        categorical?: CompiledDataViewCategoricalMapping;
        table?: CompiledDataViewTableMapping;
        single?: CompiledDataViewSingleMapping;
        tree?: CompiledDataViewTreeMapping;
        matrix?: CompiledDataViewMatrixMapping;
    }

    export interface CompiledDataViewMappingMetadata {
        /** The metadata repetition objects. */
        objects?: DataViewObjects;
    }

    export interface CompiledDataViewCategoricalMapping {
        categories?: CompiledDataViewRoleMappingWithReduction;
        values?: CompiledDataViewRoleMapping | CompiledDataViewGroupedRoleMapping | CompiledDataViewListRoleMapping;
    }

    export interface CompiledDataViewGroupingRoleMapping {
        role: CompiledDataViewRole
    }

    export interface CompiledDataViewSingleMapping {
        role: CompiledDataViewRole;
    }

    export interface CompiledDataViewValuesRoleMapping {
        roles: CompiledDataViewRole[];
    }

    export interface CompiledDataViewTableMapping {
        rows: CompiledDataViewRoleMappingWithReduction | CompiledDataViewListRoleMappingWithReduction;
    }

    export interface CompiledDataViewTreeMapping {
        nodes?: CompiledDataViewGroupingRoleMapping
        values?: CompiledDataViewValuesRoleMapping
    }

    export interface CompiledDataViewMatrixMapping {
        rows?: CompiledDataViewRoleForMappingWithReduction;
        columns?: CompiledDataViewRoleForMappingWithReduction;
        values?: CompiledDataViewRoleForMapping;
    }

    export type CompiledDataViewRoleMapping = CompiledDataViewRoleBindMapping | CompiledDataViewRoleForMapping;

    export interface CompiledDataViewRoleBindMapping {
        bind: {
            to: CompiledDataViewRole;
        };
    }

    export interface CompiledDataViewRoleForMapping {
        for: {
            in: CompiledDataViewRole;
        };
    }

    export type CompiledDataViewRoleMappingWithReduction = CompiledDataViewRoleBindMappingWithReduction | CompiledDataViewRoleForMappingWithReduction;

    export interface CompiledDataViewRoleBindMappingWithReduction extends CompiledDataViewRoleBindMapping, HasReductionAlgorithm {
    }

    export interface CompiledDataViewRoleForMappingWithReduction extends CompiledDataViewRoleForMapping, HasReductionAlgorithm {
    }

    export interface CompiledDataViewGroupedRoleMapping {
        group: {
            by: CompiledDataViewRole;
            select: CompiledDataViewRoleMapping[];
            dataReductionAlgorithm?: ReductionAlgorithm;
        };
    }

    export interface CompiledDataViewListRoleMapping {
        select: CompiledDataViewRoleMapping[];
    }

    export interface CompiledDataViewListRoleMappingWithReduction extends CompiledDataViewListRoleMapping, HasReductionAlgorithm {
    }

    export enum CompiledSubtotalType {
        None = 0,
        Before = 1,
        After = 2
    }

    export interface CompiledDataViewRole {
        role: string;
        items: CompiledDataViewRoleItem[];
        subtotalType?: CompiledSubtotalType;
    }

    export interface CompiledDataViewRoleItem {
        type?: ValueType;
    }
} 