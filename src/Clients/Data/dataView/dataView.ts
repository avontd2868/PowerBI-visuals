//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    /** Represents views of a data set. */
    export interface DataView {
        metadata: DataViewMetadata;
        categorical?: DataViewCategorical;
        single?: DataViewSingle;
        tree?: DataViewTree;
        table?: DataViewTable;
        matrix?: DataViewMatrix;
    }

    export interface DataViewMetadata {
        columns: DataViewMetadataColumn[];

        /** The metadata repetition objects. */
        objects?: DataViewObjects;

        /** When defined, describes whether the DataView contains just a segment of the complete data set. */
        segment?: DataViewSegmentMetadata;
    }

    export interface DataViewMetadataColumn {
        /** The user-facing display name of the column. */
        displayName: string;

        /** The query name the source column in the query. */
        queryName?: string;

        /** The format string of the column. */
        format?: string; // TODO: Deprecate this, and populate format string through objects instead.

        /** Data type information for the column. */
        type?: ValueType;

        /** Indicates that this column is a measure (aggregate) value. */
        isMeasure?: boolean;

        /** The position of the column in the select statement. */
        index?: number;

        /** The properties that this column provides to the visualization. */
        roles?: { [name: string]: boolean };

        /** The metadata repetition objects. */
        objects?: DataViewObjects;

        /** The name of the containing group. */
        groupName?: string;
    }

    export interface DataViewSegmentMetadata {
    }

    export interface DataViewCategorical {
        categories?: DataViewCategoryColumn[];
        values?: DataViewValueColumns;
    }

    export interface DataViewCategoricalColumn {
        source: DataViewMetadataColumn;
        values: any[];

        /** The data repetition objects. */
        objects?: DataViewObjects[];
    }

    export interface DataViewValueColumns extends Array<DataViewValueColumn> {
        /** Returns an array that groups the columns in this group together. */
        grouped(): DataViewValueColumnGroup[];

        /** The set of expressions that define the identity for instances of the value group.  This must match items in the DataViewScopeIdentity in the grouped items result. */
        identityFields?: data.SQExpr[];

        source?: DataViewMetadataColumn;
    }

    export interface DataViewValueColumnGroup {
        values: DataViewValueColumn[];
        identity?: DataViewScopeIdentity;

        /** The data repetition objects. */
        objects?: DataViewObjects;

        name?: string;
    }

    export interface DataViewValueColumn extends DataViewCategoricalColumn {
        subtotal?: any;
        max?: any;
        min?: any;
        highlights?: any[];
        identity?: DataViewScopeIdentity;

        /** Client-computed maximum value for a column. */
        maxLocal?: any;
        /** Client-computed maximum value for a column. */
        minLocal?: any;
    }

    export interface DataViewCategoryColumn extends DataViewCategoricalColumn {
        identity?: DataViewScopeIdentity[];

        /** The set of expressions that define the identity for instances of the category.  This must match items in the DataViewScopeIdentity in the identity. */
        identityFields?: data.SQExpr[];
    }

    export interface DataViewSingle {
        value: any;
    }

    export interface DataViewTree {
        root: DataViewTreeNode;
    }

    export interface DataViewTreeNode {
        name?: string;
        value?: any;
        values?: { [id: number]: DataViewTreeNodeValue };
        children?: DataViewTreeNode[];
        identity?: DataViewScopeIdentity;

        /** The set of expressions that define the identity for the child nodes.  This must match items in the DataViewScopeIdentity of those nodes. */
        childIdentityFields?: data.SQExpr[];
    }

    export interface DataViewTreeNodeValue {
        value?: any;
    }

    export interface DataViewTreeNodeMeasureValue extends DataViewTreeNodeValue {
        subtotal?: any;
        max?: any;
        min?: any;
        highlight?: any;

        /** Client-computed maximum value for a column. */
        maxLocal?: any;
        /** Client-computed maximum value for a column. */
        minLocal?: any;
    }

    export interface DataViewTreeNodeGroupValue extends DataViewTreeNodeValue {
        count?: any;
    }

    export interface DataViewTable {
        columns: DataViewMetadataColumn[];
        identity?: DataViewScopeIdentity[];
        rows?: any[][]; // TODO: Should become a DataViewTableRow[]
        totals?: any[];
    }

    export interface DataViewTableRow {
        values: any[];

        /** The metadata repetition objects. */
        objects?: DataViewObjects[];
    }

    export interface DataViewMatrix {
        rows: DataViewHierarchy;
        columns: DataViewHierarchy;
        valueSources: DataViewMetadataColumn[];
    }

    export interface DataViewMatrixNode extends DataViewTreeNode {
        /** Indicates the level this node is on. Zero indicates the outermost children (root node level is undefined). */
        level?: number;

        /** Indicates the source metadata index on the node's level. Its value is 0 if omitted. */
        levelSourceIndex?: number;

        /** Indicates whether or not the node is a subtotal node. Its value is false if omitted. */
        isSubtotal?: boolean;
    }

    export interface DataViewMatrixNodeValue extends DataViewTreeNodeValue {
        /** Indicates the index of the corresponding measure (held by DataViewMatrix.valueSources). Its value is 0 if omitted. */
        valueSourceIndex?: number;
    }

    export interface DataViewHierarchy {
        root: DataViewMatrixNode;
        levels: DataViewHierarchyLevel[];
    }

    export interface DataViewHierarchyLevel {
        sources: DataViewMetadataColumn[];
    }
}