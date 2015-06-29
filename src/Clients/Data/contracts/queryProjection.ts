//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    /** Represents a projection from a query result. */
    export interface QueryProjection {
        /** Name of item in the semantic query Select clause. */
        queryRef: string;

        /** Optional format string. */
        format?: string; // TODO: Deprecate this, and populate format string through objects instead.
    }

    /** A set of QueryProjections, grouped by visualization property, and ordered within that property. */
    export interface QueryProjectionsByRole {
        [roleName: string]: QueryProjection[];
    }
}