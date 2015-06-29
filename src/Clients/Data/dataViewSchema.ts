//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    /** Defines the schema for a DataView. */
    export interface DataViewSchema {
        categorical?: DataViewSchemaCategorical;
        single?: DataViewSchemaSingle;
        tree?: DataViewSchemaTree;
        table?: DataViewSchemaTable;
    }

    /** Defines the schema for a flat DataView. */
    export interface DataViewSchemaCategorical {
        categories?: ConstrainedNumberRange;
        values?: ConstrainedNumberRange;
        rows?: ConstrainedNumberRange;
    }

    /** Defines the schema for a single value DataView. */
    export interface DataViewSchemaSingle {
    }

    /** Defines the schema for a table value DataView. */
    export interface DataViewSchemaTable {
        rows?: ConstrainedNumberRange;
    }

    /** Defines the schema for a tree DataView. */
    export interface DataViewSchemaTree {
        depth?: ConstrainedNumberRange;
        aggregates?: ConstrainedNumberRange;
    }

    /** Defines the acceptable values of a number. */
    export interface ConstrainedNumberRange {  // TODO: Rename to NumberRange (update column chart) (dinael)
        min?: number;
        max?: number;
    }
}