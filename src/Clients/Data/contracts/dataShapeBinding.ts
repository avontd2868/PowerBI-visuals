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