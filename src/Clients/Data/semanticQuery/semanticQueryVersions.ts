//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    /**
     * Represents the versions of the semantic query structure.
     * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\SemanticQuery\QueryVersions.cs
     *      file in the TFS Dev branch.
     */
    export enum SemanticQueryVersions {
        /** The initial version of semantic query */
        Version0 = 0,
        /** EDM references removed, Property split into Column/Measure, Filter targets are fixed */
        Version1 = 1,
        /** Constants/DatePart replaced with Literal/DateSpan */
        Version2 = 2,
    }
}