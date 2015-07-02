//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    /**
        Describes a change to a schema.

        The contents of this file are mapped to C# objects representing schema changes in
        Power BI Desktop.  Any changes to this file require a corresponding update to
        the serialization code in
        <dataexplorer>\Private\Product\Client\PowerBIClientWindows\Modeling\SchemaChange.cs
    */
    export interface SchemaChange {
        entityRename?: SchemaChangeType.EntityRename;
        propertyRename?: SchemaChangeType.PropertyRename;
        itemDelete?: SchemaChangeType.ItemDelete;
        itemShowHide?: SchemaChangeType.ItemShowHide;
        newMeasure?: SchemaChangeType.NewMeasure;
        newMeasureCreated?: SchemaChangeType.NewMeasureCreated;
        newCalculatedColumn?: SchemaChangeType.NewCalculatedColumn;
        newCalculatedColumnCreated?: SchemaChangeType.NewCalculatedColumnCreated;
        updateExpression?: SchemaChangeType.UpdateExpression;
        setDataType?: SchemaChangeType.SetDataType;
        setFormatting?: SchemaChangeType.SetBasicFormatting;
        toggleThousandsSeparator?: SchemaChangeType.ToggleThousandsSeparator;
        setDecimalPlaces?: SchemaChangeType.SetDecimalPlaces;
        setDateTimeFormatInfo?: SchemaChangeType.SetDateTimeFormatInfo;
        setCurrencyFormatInfo?: SchemaChangeType.SetCurrencyFormatInfo;
        setDataCategorySchemaChange?: SchemaChangeType.SetDataCategory;
        sortByAnotherColumn?: SchemaChangeType.SortByAnotherColumn;
        entityCreate?: SchemaChangeType.EntityCreate;
        entityEdit?: SchemaChangeType.EntityEdit;
        propertyCreate?: SchemaChangeType.PropertyCreate;
    }

    export module SchemaChangeType {
        export interface EntityRename {
            schema: string;
            before: string;
            after: string;
        }

        export interface PropertyRename {
            schema: string;
            entity: string;
            before: string;
            after: string;
        }

        export interface ItemDelete {
            schema: string;
            entity: string;
            property?: string;
        }

        export interface ItemShowHide {
            schema: string;
            entity?: string;
            property?: string;
            makeHidden: boolean;
        }

        export interface NewMeasure {
            schema: string;
            entity: string;
            name?: string;
        }

        export interface NewMeasureCreated {
            schema: string;
            entity: string;
            name: string;
            expression: string;
            expressionOverride?: ExpressionOverride;
        }

        export interface NewCalculatedColumn {
            schema: string;
            entity: string;
            name?: string;
        }

        export interface NewCalculatedColumnCreated {
            schema: string;
            entity: string;
            name: string;
            expression: string;
            expressionOverride?: ExpressionOverride;
        }

        export interface UpdateExpression {
            schema: string;
            entity: string;
            property: string;
            expression: string;
            errorMessage?: string;
            /** If undefined, defaults to storing the expression property */
            expressionOverride?: ExpressionOverride
        }

        export interface SetDataType {
            schema: string;
            entity: string;
            property: string;
            dataType: string;
        }

        export interface SetBasicFormatting {
            schema: string;
            entity: string;
            property: string;
            format: string;
        }

        export interface ToggleThousandsSeparator {
            schema: string;
            entity: string;
            property: string;
        }

        export interface SetDecimalPlaces {
            schema: string;
            entity: string;
            property: string;
            decimalPlaces: string;
        }

        export interface SetDateTimeFormatInfo {
            schema: string;
            entity: string;
            property: string;
            formatType: string;
            dataTimeCustomFormatGroup: string;
            formatString: string;
        }

        export interface SetCurrencyFormatInfo {
            schema: string;
            entity: string;
            property: string;
            lcid: number;
            displayName: string;
            currencySymbol: string;
            positivePattern: number;
            negativePattern: number;
            formatType: string;
        }

        export interface SetDataCategory {
            schema: string;
            entity: string;
            property: string;
            dataCategory: string;
            dataCategorySource: string;
        }

        export interface SortByAnotherColumn {
            schema: string;
            entity: string;
            property: string;
            sortByProperty: string;
        }

        export interface EntityCreate {
            schema: string;
            entity: string;
            connectionString: string;
            commandText: string;
            columns: ColumnDefinition[];
            isLiveConnect: boolean;
        }

        export interface EntityEdit{
            schema: string;
            entity: string;
            connectionString: string;
            commandText: string;
        }

        export interface PropertyCreate {
            schema: string;
            entity: string;
            columnDefinition: ColumnDefinition;
        }

        /** 
         * If an expression update (via UpdateExpression or UpdateCalculation) can't be commited, the expression is set to a placeholder expressoin and 
         * this object can be used to rehydrate the editing surface. 
         */
        export interface ExpressionOverride {
            expression: string;
        }

        export interface ColumnDefinition {
            property: string;
            dataType: string;
        }
    }
}
