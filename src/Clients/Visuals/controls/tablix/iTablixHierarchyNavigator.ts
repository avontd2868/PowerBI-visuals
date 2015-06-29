//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.controls {

    export interface ITablixHierarchyNavigator {
        /**
        * Returns the depth of a hierarchy.
        *
        * @param hierarchy: Object representing the hierarchy.
        */
        getDepth(hierarchy: any): number;

        /**
        * Returns the leaf count of a hierarchy.
        *
        * @param hierarchy: Object representing the hierarchy.
        */
        getLeafCount(hierarchy: any): number;

        /**
        * Returns the leaf member of a hierarchy at the specified index.
        *
        * @param hierarchy: Object representing the hierarchy.
        * @param index: Index of leaf member.
        */
        getLeafAt(hierarchy: any, index: number): any;

        /**
        * Returns the specified hierarchy member parent.
        *
        * @param item: Hierarchy member.
        */
        getParent(item: any): any;

        /**
        * Returns the index of the hierarchy member relative to its parent.
        *
        * @param item: Hierarchy member.
        */
        getIndex(item: any): number;

        /**
        * Checks whether a hierarchy member is a leaf.
        *
        * @param item: Hierarchy member.
        */
        isLeaf(item: any): boolean;

        isRowHierarchyLeaf(cornerItem: any): boolean;

        isColumnHierarchyLeaf(cornerItem: any): boolean;

        /**
        * Checks whether a hierarchy member is the last item within its parent.
        *
        * @param item: Hierarchy member.
        * @param items: A collection of hierarchy members.
        */
        isLastItem(item: any, items: any): boolean;

        /**
        * Gets the children members of a hierarchy member.
        *
        * @param item: Hierarchy member.
        */
        getChildren(item: any): any;

        /**
        * Gets the members count in a specified collection.
        *
        * @param item: Hierarchy member.
        */
        getCount(items: any): number;

        /**
        * Gets the member at the specified index.
        *
        * @param items: A collection of hierarchy members.
        * @param index: Index of member to return.
        */
        getAt(items: any, index: number): any;

        /**
        * Gets the hierarchy member level.
        *
        * @param item: Hierarchy member.
        */
        getLevel(item: any): number;

        /**
        * Returns the intersection between a row and a column item.
        *
        * @param rowItem: A row member.
        * @param columnItem: A column member.
        */
        getIntersection(rowItem: any, columnItem: any): any;

        /**
        * Returns the corner cell between a row and a column level.
        *
        * @param rowLevel: A level in the row hierarchy.
        * @param columnLevel: A level in the column hierarchy.
        */
        getCorner(rowLevel: number, columnLevel: number): any;

        headerItemEquals(item1: any, item2: any): boolean;

        bodyCellItemEquals(item1: any, item2: any): boolean;

        cornerCellItemEquals(item1: any, item2: any): boolean;
    }
}