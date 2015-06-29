//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    /**
     * Represents the versions of the data shape binding structure.
     * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\DsqGeneration\DataShapeBindingVersions.cs
     *      file in the TFS Dev branch.
     */
    export enum DataShapeBindingVersions {
        /** The initial version of data shape binding */
        Version0 = 0,
        /** Explicit subtotal support for axis groupings. */
        Version1 = 1,
    }

    export interface DataShapeBindingLimitTarget {
        Primary?: number;
    }

    export enum DataShapeBindingLimitType {
        Top = 0,
        First = 1,
        Last = 2,
        Sample = 3,
        Bottom = 4,
    }

    export interface DataShapeBindingLimit {
        Count?: number
        Target: DataShapeBindingLimitTarget;
        Type: DataShapeBindingLimitType;
    }

    export interface DataShapeBinding {
        Version?: number;
        Primary: DataShapeBindingAxis;
        Secondary?: DataShapeBindingAxis;
        Limits?: DataShapeBindingLimit[];
        Highlights?: FilterDefinition[];
        DataReduction?: DataShapeBindingDataReduction;
    }

    export interface DataShapeBindingDataReduction {
        Primary?: DataShapeBindingDataReductionAlgorithm;
        Secondary?: DataShapeBindingDataReductionAlgorithm;
        DataVolume?: number;
    }

    export interface DataShapeBindingDataReductionAlgorithm {
        Top?: DataShapeBindingDataReductionTopLimit;
        Sample?: DataShapeBindingDataReductionSampleLimit;
        Bottom?: DataShapeBindingDataReductionBottomLimit;
        Window?: DataShapeBindingDataReductionDataWindow;
    }

    export interface DataShapeBindingDataReductionTopLimit {
        Count?: number;
    }

    export interface DataShapeBindingDataReductionSampleLimit {
        Count?: number;
    }

    export interface DataShapeBindingDataReductionBottomLimit {
        Count?: number;
    }

    export interface DataShapeBindingDataReductionDataWindow {
        Count?: number;
        RestartTokens?: RestartToken;
    }

    export interface DataShapeBindingAxis {
        Groupings: DataShapeBindingAxisGrouping[];
    }

    export enum SubtotalType {
        None = 0,
        Before = 1,
        After = 2
    }

    export interface DataShapeBindingAxisGrouping {
        Projections: number[];
        SuppressedProjections?: number[];
        Subtotal?: SubtotalType;
    }    
} 