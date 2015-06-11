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