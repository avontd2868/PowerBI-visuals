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