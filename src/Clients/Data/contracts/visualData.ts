//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {

    // TODO - The interfaces below ARE old and being deprecated. 

    export interface VisualElement {
        DataRoles?: DataRole[];
        Settings?: VisualElementSettings;
    }

    /** Defines common settings for a visual element. */
    export interface VisualElementSettings {
        DisplayUnitSystemType?: DisplayUnitSystemType;
    }

    export interface DataRole {
        Name: string;
        Projection: number;
    }

    /** The system used to determine display units used during formatting */
    export enum DisplayUnitSystemType {
        /** Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes. */
        Default,

        /** A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards. */
        Verbose,

        /** A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
        *   Suitable for dashboard tile cards
        */
        WholeUnits,
    }
}

module powerbi.data.contracts {

    export interface DataViewSource {
        data: any;
        type?: string;
    }
}