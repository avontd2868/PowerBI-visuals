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