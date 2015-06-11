/// <reference path="../../typedefs/jQuery/jQuery.d.ts" />
/// <reference path="../../typedefs/globalize/globalize.d.ts" />
/// <reference path="../../JsCommon/obj/utility.d.ts" />
declare module powerbi.data {
    /** Allows generic traversal and type discovery for a SQExpr tree. */
    interface ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
    }
    interface ISQExprVisitor<T> extends ISQExprVisitorWithArg<T, void> {
    }
    /** Default IQueryExprVisitorWithArg implementation that others may derive from. */
    class DefaultSQExprVisitorWithArg<T, TArg> implements ISQExprVisitorWithArg<T, TArg> {
        visitEntity(expr: SQEntityExpr, arg: TArg): T;
        visitColumnRef(expr: SQColumnRefExpr, arg: TArg): T;
        visitMeasureRef(expr: SQMeasureRefExpr, arg: TArg): T;
        visitAggr(expr: SQAggregationExpr, arg: TArg): T;
        visitBetween(expr: SQBetweenExpr, arg: TArg): T;
        visitIn(expr: SQInExpr, arg: TArg): T;
        visitAnd(expr: SQAndExpr, arg: TArg): T;
        visitOr(expr: SQOrExpr, arg: TArg): T;
        visitCompare(expr: SQCompareExpr, arg: TArg): T;
        visitContains(expr: SQContainsExpr, arg: TArg): T;
        visitExists(expr: SQExistsExpr, arg: TArg): T;
        visitNot(expr: SQNotExpr, arg: TArg): T;
        visitStartsWith(expr: SQStartsWithExpr, arg: TArg): T;
        visitConstant(expr: SQConstantExpr, arg: TArg): T;
        visitDateSpan(expr: SQDateSpanExpr, arg: TArg): T;
        visitDateAdd(expr: SQDateAddExpr, arg: TArg): T;
        visitNow(expr: SQNowExpr, arg: TArg): T;
        visitDefault(expr: SQExpr, arg: TArg): T;
    }
    /** Default ISQExprVisitor implementation that others may derive from. */
    class DefaultSQExprVisitor<T> extends DefaultSQExprVisitorWithArg<T, void> implements ISQExprVisitor<T> {
    }
    /** Default ISQExprVisitor implementation that implements default traversal and that others may derive from. */
    class DefaultSQExprVisitorWithTraversal implements ISQExprVisitor<void> {
        visitEntity(expr: SQEntityExpr): void;
        visitColumnRef(expr: SQColumnRefExpr): void;
        visitMeasureRef(expr: SQMeasureRefExpr): void;
        visitAggr(expr: SQAggregationExpr): void;
        visitBetween(expr: SQBetweenExpr): void;
        visitIn(expr: SQInExpr): void;
        visitAnd(expr: SQAndExpr): void;
        visitOr(expr: SQOrExpr): void;
        visitCompare(expr: SQCompareExpr): void;
        visitContains(expr: SQContainsExpr): void;
        visitExists(expr: SQExistsExpr): void;
        visitNot(expr: SQNotExpr): void;
        visitStartsWith(expr: SQStartsWithExpr): void;
        visitConstant(expr: SQConstantExpr): void;
        visitDateSpan(expr: SQDateSpanExpr): void;
        visitDateAdd(expr: SQDateAddExpr): void;
        visitNow(expr: SQNowExpr): void;
        visitDefault(expr: SQExpr): void;
    }
}
declare module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    class InvalidDataFormatClientError implements IClientError {
        code: string;
        ignorable: boolean;
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    class InvalidDataResponseClientError implements IClientError {
        code: string;
        ignorable: boolean;
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
}
declare module powerbi.data.services {
    module wireContracts {
        interface DataViewTransformActions {
            queryMetadata: data.QueryMetadata;
            visualElements: VisualElement[];
            objects: data.services.wireContracts.DataViewObjectDefinitions;
        }
    }
    module DataViewTransformActionsSerializer {
        function deserializeTransformActions(visualType: string, objectDescs: data.DataViewObjectDescriptors, transformsString: string): powerbi.data.DataViewTransformActions;
        function serializeTransformActions(actions: wireContracts.DataViewTransformActions): string;
    }
}
declare module powerbi {
    module alignment {
        var right: string;
        var left: string;
        var center: string;
    }
}
declare module powerbi {
    module axisStyle {
        var showBoth: string;
        var showTitleOnly: string;
        var showUnitOnly: string;
        function members(validMembers?: string[]): IEnumMember[];
    }
}
declare module powerbi {
    module axisType {
        var scalar: string;
        var categorical: string;
        var both: string;
        function members(): IEnumMember[];
    }
}
declare module powerbi {
    interface IEnumMember {
        value: string | number;
        displayName: data.DisplayNameGetter;
    }
}
declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface FillTypeDescriptor extends FillGeneric<boolean> {
    }
    interface FillDefinition extends FillGeneric<SQExpr> {
    }
    interface Fill extends FillGeneric<string> {
    }
    /** The "master" interface of a fill object.  Non-generic extensions define the type. */
    interface FillGeneric<T> {
        solid?: {
            color?: T;
        };
        gradient?: {
            startColor?: T;
            endColor?: T;
        };
        pattern?: {
            patternKind?: T;
            color?: T;
        };
    }
}
declare module powerbi {
    import SQExpr = powerbi.data.SQExpr;
    interface FillRuleTypeDescriptor {
    }
    interface FillRuleDefinition extends FillRuleGeneric<SQExpr, SQExpr> {
    }
    interface FillRule extends FillRuleGeneric<string, number> {
    }
    interface FillRuleGeneric<TColor, TValue> {
        linearGradient2?: LinearGradient2Generic<TColor, TValue>;
        linearGradient3?: LinearGradient3Generic<TColor, TValue>;
    }
    type LinearGradient2 = LinearGradient2Generic<string, number>;
    type LinearGradient3 = LinearGradient3Generic<string, number>;
    interface LinearGradient2Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }
    interface LinearGradient3Generic<TColor, TValue> {
        max: RuleColorStopGeneric<TColor, TValue>;
        mid: RuleColorStopGeneric<TColor, TValue>;
        min: RuleColorStopGeneric<TColor, TValue>;
    }
    type RuleColorStopDefinition = RuleColorStopGeneric<SQExpr, SQExpr>;
    type RuleColorStop = RuleColorStopGeneric<string, number>;
    interface RuleColorStopGeneric<TColor, TValue> {
        color: TColor;
        value?: TValue;
    }
}
declare module powerbi {
    interface FilterTypeDescriptor {
    }
}
declare module powerbi {
    module labelPosition {
        var topLeft: string;
        var topCenter: string;
        var topRight: string;
        var middleLeft: string;
        var middleCenter: string;
        var middleRight: string;
        var bottomLeft: string;
        var bottomCenter: string;
        var bottomRight: string;
        var insideCenter: string;
        var insideBase: string;
        var insideEnd: string;
        var outsideBase: string;
        var outsideEnd: string;
        function members(): IEnumMember[];
    }
}
declare module powerbi {
    module legendPosition {
        var top: string;
        var bottom: string;
        var left: string;
        var right: string;
        function members(): IEnumMember[];
    }
}
declare module powerbi {
    import SemanticFilter = powerbi.data.SemanticFilter;
    /** Describes a structural type in the client type system. Leaf properties should use ValueType. */
    interface StructuralTypeDescriptor {
        fill?: FillTypeDescriptor;
        fillRule?: FillRuleTypeDescriptor;
        filter?: FilterTypeDescriptor;
    }
    type StructuralObjectDefinition = FillDefinition | FillRuleDefinition | SemanticFilter;
    /** Defines instances of structural types. */
    type StructuralObjectValue = Fill | FillRule | SemanticFilter;
    module StructuralTypeDescriptor {
        function isValid(type: StructuralTypeDescriptor): boolean;
    }
}
declare module powerbi {
    /** Describes instances of value type objects. */
    type PrimitiveValue = string | number | boolean | Date;
    /** Describes a data value type in the client type system. Can be used to get a concrete ValueType instance. */
    interface ValueTypeDescriptor {
        text?: boolean;
        numeric?: boolean;
        integer?: boolean;
        bool?: boolean;
        dateTime?: boolean;
        duration?: boolean;
        binary?: boolean;
        none?: boolean;
        temporal?: TemporalTypeDescriptor;
        geography?: GeographyTypeDescriptor;
        misc?: MiscellaneousTypeDescriptor;
        formatting?: FormattingTypeDescriptor;
        extendedType?: ExtendedType;
    }
    interface TemporalTypeDescriptor {
        year?: boolean;
        month?: boolean;
    }
    interface GeographyTypeDescriptor {
        address?: boolean;
        city?: boolean;
        continent?: boolean;
        country?: boolean;
        county?: boolean;
        region?: boolean;
        postalCode?: boolean;
        stateOrProvince?: boolean;
        place?: boolean;
        latitude?: boolean;
        longitude?: boolean;
    }
    interface MiscellaneousTypeDescriptor {
        image?: boolean;
        imageUrl?: boolean;
        webUrl?: boolean;
    }
    interface FormattingTypeDescriptor {
        color?: boolean;
        formatString?: boolean;
        legendPosition?: boolean;
        axisType?: boolean;
        yAxisPosition?: boolean;
        axisStyle?: boolean;
        alignment?: boolean;
        labelDisplayUnits?: boolean;
        labelPosition?: boolean;
    }
    /** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
    class ValueType implements ValueTypeDescriptor {
        private static typeCache;
        private underlyingType;
        private category;
        private temporalType;
        private geographyType;
        private miscType;
        private formattingType;
        /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
        constructor(type: ExtendedType, category?: string);
        /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
        static fromDescriptor(descriptor: ValueTypeDescriptor): ValueType;
        /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
        static fromExtendedType(extendedType: ExtendedType): ValueType;
        /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
        static fromPrimitiveTypeAndCategory(primitiveType: PrimitiveType, category?: string): ValueType;
        /** Gets the exact primitive type of this ValueType. */
        primitiveType: PrimitiveType;
        /** Gets the exact extended type of this ValueType. */
        extendedType: ExtendedType;
        /** Gets the data category string (if any) for this ValueType. */
        categoryString: string;
        /** Indicates whether the type represents text values. */
        text: boolean;
        /** Indicates whether the type represents any numeric value. */
        numeric: boolean;
        /** Indicates whether the type represents integer numeric values. */
        integer: boolean;
        /** Indicates whether the type represents Boolean values. */
        bool: boolean;
        /** Indicates whether the type represents any date/time values. */
        dateTime: boolean;
        /** Indicates whether the type represents duration values. */
        duration: boolean;
        /** Indicates whether the type represents binary values. */
        binary: boolean;
        /** Indicates whether the type represents none values. */
        none: boolean;
        /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
        temporal: TemporalType;
        /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
        geography: GeographyType;
        /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
        misc: MiscellaneousType;
        /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
        formatting: FormattingType;
    }
    class TemporalType implements TemporalTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        year: boolean;
        month: boolean;
    }
    class GeographyType implements GeographyTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        address: boolean;
        city: boolean;
        continent: boolean;
        country: boolean;
        county: boolean;
        region: boolean;
        postalCode: boolean;
        stateOrProvince: boolean;
        place: boolean;
        latitude: boolean;
        longitude: boolean;
    }
    class MiscellaneousType implements MiscellaneousTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        image: boolean;
        imageUrl: boolean;
        webUrl: boolean;
    }
    class FormattingType implements FormattingTypeDescriptor {
        private underlyingType;
        constructor(type: ExtendedType);
        color: boolean;
        formatString: boolean;
        legendPosition: boolean;
        axisType: boolean;
        yAxisPosition: boolean;
        axisStyle: boolean;
        alignment: boolean;
        labelDisplayUnits: boolean;
        labelPosition: boolean;
    }
    /** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
    enum PrimitiveType {
        Null = 0,
        Text = 1,
        Decimal = 2,
        Double = 3,
        Integer = 4,
        Boolean = 5,
        Date = 6,
        DateTime = 7,
        DateTimeZone = 8,
        Time = 9,
        Duration = 10,
        Binary = 11,
        None = 12,
    }
    /** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
    enum ExtendedType {
        Numeric,
        Temporal,
        Geography,
        Miscellaneous,
        Formatting,
        Null = 0,
        Text = 1,
        Decimal,
        Double,
        Integer,
        Boolean = 5,
        Date,
        DateTime,
        DateTimeZone,
        Time,
        Duration = 10,
        Binary = 11,
        None = 12,
        Year,
        Year_Text,
        Year_Integer,
        Year_Date,
        Year_DateTime,
        Month,
        Month_Text,
        Month_Integer,
        Month_Date,
        Month_DateTime,
        Address,
        City,
        Continent,
        Country,
        County,
        Region,
        PostalCode,
        PostalCode_Text,
        PostalCode_Integer,
        StateOrProvince,
        Place,
        Latitude,
        Latitude_Decimal,
        Latitude_Double,
        Longitude,
        Longitude_Decimal,
        Longitude_Double,
        Image,
        ImageUrl,
        WebUrl,
        Color,
        FormatString,
        LegendPosition,
        AxisType,
        YAxisPosition,
        AxisStyle,
        Alignment,
        LabelDisplayUnits,
        LabelPosition,
    }
}
declare module powerbi.data {
    class ConceptualSchema {
        entities: jsCommon.ArrayNamedItems<ConceptualEntity>;
        /** Indicates whether the user can edit this ConceptualSchema.  This is used to enable/disable model authoring UX. */
        canEdit: boolean;
        findProperty(entityName: string, propertyName: string): ConceptualProperty;
    }
    interface ConceptualEntity {
        name: string;
        hidden?: boolean;
        properties: jsCommon.ArrayNamedItems<ConceptualProperty>;
    }
    interface ConceptualProperty {
        name: string;
        type: ValueType;
        kind: ConceptualPropertyKind;
        hidden?: boolean;
        format?: string;
        column?: ConceptualColumn;
        queryable?: ConceptualQueryableState;
    }
    interface ConceptualColumn {
        defaultAggregate?: ConceptualDefaultAggregate;
        keys?: jsCommon.ArrayNamedItems<ConceptualProperty>;
        idOnEntityKey?: boolean;
        calculated?: boolean;
    }
    enum ConceptualQueryableState {
        Queryable = 0,
        Error = 1,
    }
    enum ConceptualPropertyKind {
        Column = 0,
        Measure = 1,
        Kpi = 2,
    }
    enum ConceptualDefaultAggregate {
        Default = 0,
        None = 1,
        Sum = 2,
        Count = 3,
        Min = 4,
        Max = 5,
        Average = 6,
        DistinctCount = 7,
    }
    enum ConceptualDataCategory {
        None = 0,
        Address = 1,
        City = 2,
        Company = 3,
        Continent = 4,
        Country = 5,
        County = 6,
        Date = 7,
        Image = 8,
        ImageUrl = 9,
        Latitude = 10,
        Longitude = 11,
        Organization = 12,
        Place = 13,
        PostalCode = 14,
        Product = 15,
        StateOrProvince = 16,
        WebUrl = 17,
    }
}
declare module powerbi.data {
    /**
     * Represents the versions of the data shape binding structure.
     * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\DsqGeneration\DataShapeBindingVersions.cs
     *      file in the TFS Dev branch.
     */
    enum DataShapeBindingVersions {
        /** The initial version of data shape binding */
        Version0 = 0,
        /** Explicit subtotal support for axis groupings. */
        Version1 = 1,
    }
    interface DataShapeBindingLimitTarget {
        Primary?: number;
    }
    enum DataShapeBindingLimitType {
        Top = 0,
        First = 1,
        Last = 2,
        Sample = 3,
        Bottom = 4,
    }
    interface DataShapeBindingLimit {
        Count?: number;
        Target: DataShapeBindingLimitTarget;
        Type: DataShapeBindingLimitType;
    }
    interface DataShapeBinding {
        Version?: number;
        Primary: DataShapeBindingAxis;
        Secondary?: DataShapeBindingAxis;
        Limits?: DataShapeBindingLimit[];
        Highlights?: FilterDefinition[];
        DataReduction?: DataShapeBindingDataReduction;
    }
    interface DataShapeBindingDataReduction {
        Primary?: DataShapeBindingDataReductionAlgorithm;
        Secondary?: DataShapeBindingDataReductionAlgorithm;
        DataVolume?: number;
    }
    interface DataShapeBindingDataReductionAlgorithm {
        Top?: DataShapeBindingDataReductionTopLimit;
        Sample?: DataShapeBindingDataReductionSampleLimit;
        Bottom?: DataShapeBindingDataReductionBottomLimit;
        Window?: DataShapeBindingDataReductionDataWindow;
    }
    interface DataShapeBindingDataReductionTopLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionSampleLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionBottomLimit {
        Count?: number;
    }
    interface DataShapeBindingDataReductionDataWindow {
        Count?: number;
        RestartTokens?: RestartToken;
    }
    interface DataShapeBindingAxis {
        Groupings: DataShapeBindingAxisGrouping[];
    }
    enum SubtotalType {
        None = 0,
        Before = 1,
        After = 2,
    }
    interface DataShapeBindingAxisGrouping {
        Projections: number[];
        SuppressedProjections?: number[];
        Subtotal?: SubtotalType;
    }
}
declare module powerbi.data {
    interface FederatedConceptualSchemaInitOptions {
        schemas: {
            [name: string]: ConceptualSchema;
        };
        links?: ConceptualSchemaLink[];
    }
    /** Represents a federated conceptual schema. */
    class FederatedConceptualSchema {
        private schemas;
        private links;
        constructor(options: FederatedConceptualSchemaInitOptions);
        schema(name: string): ConceptualSchema;
    }
    /** Describes a semantic relationship between ConceptualSchemas. */
    interface ConceptualSchemaLink {
    }
}
declare module powerbi.data {
    /**
        Describes a change to a schema.

        The contents of this file are mapped to C# objects representing schema changes in
        Power BI Desktop.  Any changes to this file require a corresponding update to
        the serialization code in
        <dataexplorer>\Private\Product\Client\PowerBIClientWindows\Modeling\SchemaChange.cs
    */
    interface SchemaChange {
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
    module SchemaChangeType {
        interface EntityRename {
            schema: string;
            before: string;
            after: string;
        }
        interface PropertyRename {
            schema: string;
            entity: string;
            before: string;
            after: string;
        }
        interface ItemDelete {
            schema: string;
            entity: string;
            property?: string;
        }
        interface ItemShowHide {
            schema: string;
            entity?: string;
            property?: string;
            makeHidden: boolean;
        }
        interface NewMeasure {
            schema: string;
            entity: string;
            name?: string;
        }
        interface NewMeasureCreated {
            schema: string;
            entity: string;
            name: string;
            expression: string;
            expressionOverride?: ExpressionOverride;
        }
        interface NewCalculatedColumn {
            schema: string;
            entity: string;
            name?: string;
        }
        interface NewCalculatedColumnCreated {
            schema: string;
            entity: string;
            name: string;
            expression: string;
            expressionOverride?: ExpressionOverride;
        }
        interface UpdateExpression {
            schema: string;
            entity: string;
            property: string;
            expression: string;
            errorMessage?: string;
            /** If undefined, defaults to storing the expression property */
            expressionOverride?: ExpressionOverride;
        }
        interface SetDataType {
            schema: string;
            entity: string;
            property: string;
            dataType: string;
        }
        interface SetBasicFormatting {
            schema: string;
            entity: string;
            property: string;
            format: string;
        }
        interface ToggleThousandsSeparator {
            schema: string;
            entity: string;
            property: string;
        }
        interface SetDecimalPlaces {
            schema: string;
            entity: string;
            property: string;
            decimalPlaces: string;
        }
        interface SetDateTimeFormatInfo {
            schema: string;
            entity: string;
            property: string;
            formatType: string;
            dataTimeCustomFormatGroup: string;
            formatString: string;
        }
        interface SetCurrencyFormatInfo {
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
        interface SetDataCategory {
            schema: string;
            entity: string;
            property: string;
            dataCategory: string;
            dataCategorySource: string;
        }
        interface SortByAnotherColumn {
            schema: string;
            entity: string;
            property: string;
            sortByProperty: string;
        }
        interface EntityCreate {
            schema: string;
            entity: string;
            connectionString: string;
            commandText: string;
            columns: ColumnDefinition[];
            isLiveConnect: boolean;
        }
        interface EntityEdit {
            schema: string;
            entity: string;
            connectionString: string;
            commandText: string;
        }
        interface PropertyCreate {
            schema: string;
            entity: string;
            columnDefinition: ColumnDefinition;
        }
        /**
         * If an expression update (via UpdateExpression or UpdateCalculation) can't be commited, the expression is set to a placeholder expressoin and
         * this object can be used to rehydrate the editing surface.
         */
        interface ExpressionOverride {
            expression: string;
        }
        interface ColumnDefinition {
            property: string;
            dataType: string;
        }
    }
}
declare module powerbi.data {
    /** Defines a selector for content, including data-, metadata, and user-defined repetition. */
    interface Selector {
        /** Data-bound repetition selection. */
        data?: DataRepetitionSelector[];
        /** Metadata-bound repetition selection.  Refers to a DataViewMetadataColumn queryName. */
        metadata?: string;
        /** User-defined repetition selection. */
        id?: string;
    }
    type DataRepetitionSelector = DataViewScopeIdentity | DataViewScopeWildcard;
    module Selector {
        function filterFromSelector(selectors: Selector[], isNot?: boolean): SemanticFilter;
        function matchesData(selector: Selector, identities: DataViewScopeIdentity[]): boolean;
        function matchesKeys(selector: Selector, keysList: SQExpr[][]): boolean;
        /** Determines whether two selectors are equal. */
        function equals(x: Selector, y: Selector): boolean;
        function getKey(selector: Selector): string;
        function containsWildcard(selector: Selector): boolean;
    }
}
declare module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    interface ServiceError {
        statusCode: number;
        message?: string;
        stackTrace?: string;
        errorDetails?: PowerBIErrorDetail[];
    }
    interface PowerBIErrorDetail {
        code: string;
        detail: PowerBIErrorDetailValue;
    }
    interface PowerBIErrorDetailValue {
        type: PowerBIErrorResourceType;
        value: string;
    }
    enum PowerBIErrorResourceType {
        ResourceCodeReference = 0,
        EmbeddedString = 1,
    }
    enum ServiceErrorStatusCode {
        GeneralError = 0,
        CsdlFetching = 1,
        CsdlConvertXmlToConceptualSchema = 2,
        CsdlCreateClientSchema = 3,
        ExecuteSemanticQueryError = 4,
        ExecuteSemanticQueryInvalidStreamFormat = 5,
    }
    class ServiceErrorToClientError implements IClientError {
        private m_serviceError;
        private static codeName;
        code: string;
        ignorable: boolean;
        constructor(serviceError: ServiceError);
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    class PowerBIErrorDetailHelper {
        private static serverErrorPrefix;
        static addAdditionalInfo(errorDetails: ErrorDetails, pbiErrorDetails: data.PowerBIErrorDetail[], localize: IStringResourceProvider): ErrorDetails;
        static GetDetailsFromServerErrorStatusCode(localize: IStringResourceProvider, statusCode: number): ErrorDetails;
    }
}
declare module powerbi.data {
    interface QueryDefinition {
        Version?: number;
        From: EntitySource[];
        Where?: QueryFilter[];
        OrderBy?: QuerySortClause[];
        Select: QueryExpressionContainer[];
    }
    interface FilterDefinition {
        Version?: number;
        From: EntitySource[];
        Where: QueryFilter[];
    }
    interface EntitySource {
        Name: string;
        EntitySet?: string;
        Entity?: string;
        Schema?: string;
    }
    interface QueryFilter {
        Target?: QueryExpressionContainer[];
        Condition: QueryExpressionContainer;
    }
    interface QuerySortClause {
        Expression: QueryExpressionContainer;
        Direction: QuerySortDirection;
    }
    interface QueryExpressionContainer {
        Name?: string;
        SourceRef?: QuerySourceRefExpression;
        Column?: QueryColumnExpression;
        Measure?: QueryMeasureExpression;
        Aggregation?: QueryAggregationExpression;
        And?: QueryBinaryExpression;
        Between?: QueryBetweenExpression;
        In?: QueryInExpression;
        Or?: QueryBinaryExpression;
        Comparison?: QueryComparisonExpression;
        Not?: QueryNotExpression;
        Contains?: QueryContainsExpression;
        StartsWith?: QueryStartsWithExpression;
        Exists?: QueryExistsExpression;
        Boolean?: QueryBooleanExpression;
        DateTime?: QueryDateTimeExpression;
        DateTimeSecond?: QueryDateTimeSecondExpression;
        Date?: QueryDateTimeExpression;
        Decimal?: QueryDecimalExpression;
        Integer?: QueryIntegerExpression;
        Null?: QueryNullExpression;
        Number?: QueryNumberExpression;
        String?: QueryStringExpression;
        Literal?: QueryLiteralExpression;
        DateSpan?: QueryDateSpanExpression;
        DateAdd?: QueryDateAddExpression;
        Now?: QueryNowExpression;
    }
    interface QueryPropertyExpression {
        Expression: QueryExpressionContainer;
        Property: string;
    }
    interface QueryColumnExpression extends QueryPropertyExpression {
    }
    interface QueryMeasureExpression extends QueryPropertyExpression {
    }
    interface QuerySourceRefExpression {
        Source: string;
    }
    interface QueryAggregationExpression {
        Function: QueryAggregateFunction;
        Expression: QueryExpressionContainer;
    }
    interface QueryBinaryExpression {
        Left: QueryExpressionContainer;
        Right: QueryExpressionContainer;
    }
    interface QueryBetweenExpression {
        Expression: QueryExpressionContainer;
        LowerBound: QueryExpressionContainer;
        UpperBound: QueryExpressionContainer;
    }
    interface QueryInExpression {
        Expressions: QueryExpressionContainer[];
        Values: QueryExpressionContainer[][];
    }
    interface QueryComparisonExpression extends QueryBinaryExpression {
        ComparisonKind: QueryComparisonKind;
    }
    interface QueryContainsExpression extends QueryBinaryExpression {
    }
    interface QueryNotExpression {
        Expression: QueryExpressionContainer;
    }
    interface QueryStartsWithExpression extends QueryBinaryExpression {
    }
    interface QueryExistsExpression {
        Expression: QueryExpressionContainer;
    }
    interface QueryConstantExpression<T> {
        Value: T;
    }
    interface QueryLiteralExpression {
        Value: string;
    }
    interface QueryBooleanExpression extends QueryConstantExpression<boolean> {
    }
    interface QueryDateTimeExpression extends QueryConstantExpression<string> {
    }
    interface QueryDateTimeSecondExpression extends QueryConstantExpression<string> {
    }
    interface QueryDecimalExpression extends QueryConstantExpression<number> {
    }
    interface QueryIntegerExpression extends QueryConstantExpression<number> {
    }
    interface QueryNumberExpression extends QueryConstantExpression<string> {
    }
    interface QueryNullExpression {
    }
    interface QueryStringExpression extends QueryConstantExpression<string> {
    }
    interface QueryDateSpanExpression {
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }
    interface QueryDateAddExpression {
        Amount: number;
        TimeUnit: TimeUnit;
        Expression: QueryExpressionContainer;
    }
    interface QueryNowExpression {
    }
    enum TimeUnit {
        Day = 0,
        Week = 1,
        Month = 2,
        Year = 3,
        Decade = 4,
        Second = 5,
        Minute = 6,
        Hour = 7,
    }
    enum QueryAggregateFunction {
        Sum = 0,
        Avg = 1,
        Count = 2,
        Min = 3,
        Max = 4,
        CountNonNull = 5,
    }
    enum QuerySortDirection {
        Ascending = 1,
        Descending = 2,
    }
    enum QueryComparisonKind {
        Equal = 0,
        GreaterThan = 1,
        GreaterThanOrEqual = 2,
        LessThan = 3,
        LessThanOrEqual = 4,
    }
    interface SemanticQueryDataShapeCommand {
        Query: QueryDefinition;
        Binding: DataShapeBinding;
    }
    /** Defines semantic data types. */
    enum SemanticType {
        None = 0,
        Number = 1,
        Integer,
        DateTime = 4,
        Time = 8,
        Date,
        Month,
        Year,
        YearAndMonth = 128,
        MonthAndDay = 256,
        Decade,
        YearAndWeek = 1024,
        String = 2048,
        Boolean = 4096,
        Table = 8192,
        Range = 16384,
    }
    enum SelectKind {
        None = 0,
        Group = 1,
        Measure = 2,
    }
    interface AuxiliarySelectBinding {
        Value?: string;
    }
    interface QueryMetadata {
        Select?: SelectMetadata[];
        Filters?: FilterMetadata[];
    }
    interface SelectMetadata {
        Restatement: string;
        Type?: SemanticType;
        /** (Optional) The format string for this select.  This can be populated for legacy Q&A tiles. */
        Format?: string;
        DataCategory?: ConceptualDataCategory;
        /** The select projection name. */
        Name?: string;
    }
    interface FilterMetadata {
        Restatement: string;
        Kind?: FilterKind;
    }
    enum FilterKind {
        Default = 0,
        Period = 1,
    }
}
declare module powerbi.data {
    /** Represents a projection from a query result. */
    interface QueryProjection {
        /** Name of item in the semantic query Select clause. */
        queryRef: string;
        /** Optional format string. */
        format?: string;
    }
    /** A set of QueryProjections, grouped by visualization property, and ordered within that property. */
    interface QueryProjectionsByRole {
        [roleName: string]: QueryProjection[];
    }
}
declare module powerbi {
    interface VisualElement {
        DataRoles?: DataRole[];
        Settings?: VisualElementSettings;
    }
    /** Defines common settings for a visual element. */
    interface VisualElementSettings {
        DisplayUnitSystemType?: DisplayUnitSystemType;
    }
    interface DataRole {
        Name: string;
        Projection: number;
    }
    /** The system used to determine display units used during formatting */
    enum DisplayUnitSystemType {
        /** Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes. */
        Default = 0,
        /** A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards. */
        Verbose = 1,
        /** A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
        *   Suitable for dashboard tile cards
        */
        WholeUnits = 2,
    }
}
declare module powerbi.data.contracts {
    interface DataViewSource {
        data: any;
        type?: string;
    }
}
declare module powerbi {
    interface IColorAllocator {
        /** Computes the color corresponding to the provided value. */
        color(value: number): string;
    }
    interface IColorAllocatorFactory {
        /** Creates a gradient that that transitions between two colors. */
        linearGradient2(options: LinearGradient2): IColorAllocator;
        /** Creates a gradient that that transitions between three colors. */
        linearGradient3(options: LinearGradient3): IColorAllocator;
    }
}
declare module powerbi.data {
    interface CompiledDataViewMapping {
        metadata: CompiledDataViewMappingMetadata;
        categorical?: CompiledDataViewCategoricalMapping;
        table?: CompiledDataViewTableMapping;
        single?: CompiledDataViewSingleMapping;
        tree?: CompiledDataViewTreeMapping;
        matrix?: CompiledDataViewMatrixMapping;
    }
    interface CompiledDataViewMappingMetadata {
        /** The metadata repetition objects. */
        objects?: DataViewObjects;
    }
    interface CompiledDataViewCategoricalMapping {
        categories?: CompiledDataViewRoleMappingWithReduction;
        values?: CompiledDataViewRoleMapping | CompiledDataViewGroupedRoleMapping | CompiledDataViewListRoleMapping;
    }
    interface CompiledDataViewGroupingRoleMapping {
        role: CompiledDataViewRole;
    }
    interface CompiledDataViewSingleMapping {
        role: CompiledDataViewRole;
    }
    interface CompiledDataViewValuesRoleMapping {
        roles: CompiledDataViewRole[];
    }
    interface CompiledDataViewTableMapping {
        rows: CompiledDataViewRoleMappingWithReduction | CompiledDataViewListRoleMappingWithReduction;
    }
    interface CompiledDataViewTreeMapping {
        nodes?: CompiledDataViewGroupingRoleMapping;
        values?: CompiledDataViewValuesRoleMapping;
    }
    interface CompiledDataViewMatrixMapping {
        rows?: CompiledDataViewRoleForMappingWithReduction;
        columns?: CompiledDataViewRoleForMappingWithReduction;
        values?: CompiledDataViewRoleForMapping;
    }
    type CompiledDataViewRoleMapping = CompiledDataViewRoleBindMapping | CompiledDataViewRoleForMapping;
    interface CompiledDataViewRoleBindMapping {
        bind: {
            to: CompiledDataViewRole;
        };
    }
    interface CompiledDataViewRoleForMapping {
        for: {
            in: CompiledDataViewRole;
        };
    }
    type CompiledDataViewRoleMappingWithReduction = CompiledDataViewRoleBindMappingWithReduction | CompiledDataViewRoleForMappingWithReduction;
    interface CompiledDataViewRoleBindMappingWithReduction extends CompiledDataViewRoleBindMapping, HasReductionAlgorithm {
    }
    interface CompiledDataViewRoleForMappingWithReduction extends CompiledDataViewRoleForMapping, HasReductionAlgorithm {
    }
    interface CompiledDataViewGroupedRoleMapping {
        group: {
            by: CompiledDataViewRole;
            select: CompiledDataViewRoleMapping[];
            dataReductionAlgorithm?: ReductionAlgorithm;
        };
    }
    interface CompiledDataViewListRoleMapping {
        select: CompiledDataViewRoleMapping[];
    }
    interface CompiledDataViewListRoleMappingWithReduction extends CompiledDataViewListRoleMapping, HasReductionAlgorithm {
    }
    enum CompiledSubtotalType {
        None = 0,
        Before = 1,
        After = 2,
    }
    interface CompiledDataViewRole {
        role: string;
        items: CompiledDataViewRoleItem[];
        subtotalType?: CompiledSubtotalType;
    }
    interface CompiledDataViewRoleItem {
        type?: ValueType;
    }
}
declare module powerbi.data {
    import FederatedConceptualSchema = powerbi.data.FederatedConceptualSchema;
    interface CompileDataViewOptions {
        mappings: DataViewMapping[];
        queryDefn: SemanticQuery;
        queryProjections: QueryProjectionsByRole;
        schema: FederatedConceptualSchema;
        objectDescriptors?: DataViewObjectDescriptors;
        objectDefinitions?: DataViewObjectDefinitions;
    }
    function compileDataView(options: CompileDataViewOptions): CompiledDataViewMapping[];
}
declare module powerbi.data {
    /** Defines the values for particular objects. */
    interface DataViewObjectDefinitions {
        [objectName: string]: DataViewObjectDefinition[];
    }
    interface DataViewObjectDefinition {
        selector?: Selector;
        properties: DataViewObjectPropertyDefinitions;
    }
    interface DataViewObjectPropertyDefinitions {
        [name: string]: DataViewObjectPropertyDefinition;
    }
    type DataViewObjectPropertyDefinition = SQExpr | StructuralObjectDefinition;
    module DataViewObjectDefinitions {
        /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
        function ensure(defns: DataViewObjectDefinitions, objectName: string, selector: Selector): DataViewObjectDefinition;
        function deleteProperty(defns: DataViewObjectDefinitions, objectName: string, selector: Selector, propertyName: string): void;
        function getValue(defns: DataViewObjectDefinitions, propertyId: DataViewObjectPropertyIdentifier, selector: Selector): DataViewObjectPropertyDefinition;
    }
}
declare module powerbi.data {
    interface DataViewObjectDescriptors {
        /** Defines general properties for a visualization. */
        general?: DataViewObjectDescriptor;
        [objectName: string]: DataViewObjectDescriptor;
    }
    /** Defines a logical object in a visualization. */
    interface DataViewObjectDescriptor {
        displayName?: DisplayNameGetter;
        properties: DataViewObjectPropertyDescriptors;
    }
    interface DataViewObjectPropertyDescriptors {
        [propertyName: string]: DataViewObjectPropertyDescriptor;
    }
    /** Defines a property of a DataViewObjectDefinition. */
    interface DataViewObjectPropertyDescriptor {
        displayName?: DisplayNameGetter;
        type: DataViewObjectPropertyTypeDescriptor;
        rule?: DataViewObjectPropertyRuleDescriptor;
    }
    type DataViewObjectPropertyTypeDescriptor = ValueTypeDescriptor | StructuralTypeDescriptor;
    interface DataViewObjectPropertyRuleDescriptor {
        /** For rule typed properties, defines the input visual role name. */
        inputRole?: string;
        /** Defines the output for rule-typed properties. */
        output?: DataViewObjectPropertyRuleOutputDescriptor;
    }
    interface DataViewObjectPropertyRuleOutputDescriptor {
        /** Name of the target property for rule output. */
        property: string;
        /** Names roles that define the selector for the output properties. */
        selector: string[];
    }
    module DataViewObjectDescriptors {
        /** Attempts to find the format string property.  This can be useful for upgrade and conversion. */
        function findFormatString(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
        /** Attempts to find the filter property.  This can be useful for propagating filters from one visual to others. */
        function findFilterOutput(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier;
    }
}
declare module powerbi.data {
    interface DataViewObjectDefinitionsByRepetition {
        metadataOnce?: DataViewObjectDefinitionsForSelector;
        userDefined?: DataViewObjectDefinitionsForSelector[];
        metadata?: DataViewObjectDefinitionsForSelector[];
        data: DataViewObjectDefinitionsForSelectorWithRule[];
    }
    interface DataViewObjectDefinitionsForSelector {
        selector?: Selector;
        objects: DataViewNamedObjectDefinition[];
    }
    interface DataViewObjectDefinitionsForSelectorWithRule extends DataViewObjectDefinitionsForSelector {
        rules?: RuleEvaluation[];
    }
    interface DataViewNamedObjectDefinition {
        name: string;
        properties: DataViewObjectPropertyDefinitions;
    }
    module DataViewObjectEvaluationUtils {
        function evaluateDataViewObjects(objectDescriptors: DataViewObjectDescriptors, objectDefns: DataViewNamedObjectDefinition[]): DataViewObjects;
        function groupObjectsBySelector(objectDefinitions: DataViewObjectDefinitions): DataViewObjectDefinitionsByRepetition;
        /** Registers properties for default format strings, if the properties are not explicitly provided. */
        function addDefaultFormatString(objectsForAllSelectors: DataViewObjectDefinitionsByRepetition, objectDescriptors: DataViewObjectDescriptors, columns: DataViewMetadataColumn[], selectTransforms: DataViewSelectTransform[]): void;
    }
}
declare module powerbi.data {
    /** Responsible for evaluating object property expressions to be applied at various scopes in a DataView. */
    module DataViewObjectEvaluator {
        function run(objectDescriptor: DataViewObjectDescriptor, propertyDefinitions: DataViewObjectPropertyDefinitions): DataViewObject;
        function evaluateProperty(propertyDescriptor: DataViewObjectPropertyDescriptor, propertyDefinition: DataViewObjectPropertyDefinition): any;
    }
}
declare module powerbi {
    /** Represents evaluated, named, custom objects in a DataView. */
    interface DataViewObjects {
        [name: string]: DataViewObject | DataViewObjectMap;
    }
    /** Represents an object (name-value pairs) in a DataView. */
    interface DataViewObject {
        [propertyName: string]: DataViewPropertyValue;
    }
    type DataViewPropertyValue = PrimitiveValue | StructuralObjectValue;
    interface DataViewObjectMap {
        [id: string]: DataViewObject;
    }
    interface DataViewObjectPropertyIdentifier {
        objectName: string;
        propertyName: string;
    }
    module DataViewObjects {
        /** Gets the value of the given object/property pair. */
        function getValue<T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T;
        /** Gets an object from objects. */
        function getObject(objects: DataViewObjects, objectName: string, defaultValue?: DataViewObject): DataViewObject;
        /** Gets the solid color from a fill property. */
        function getFillColor(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultColor?: string): string;
    }
    module DataViewObject {
        function getValue<T>(object: DataViewObject, propertyName: string, defaultValue?: T): T;
    }
}
declare module powerbi.data {
    module DataViewPivotCategorical {
        /**
         * Pivots categories in a categorical DataView into valueGroupings.
         * This is akin to a mathematical matrix transpose.
         */
        function apply(dataView: DataView): DataView;
    }
}
declare module powerbi.data {
    module DataViewPivotMatrix {
        /** Pivots row hierarchy members in a matrix DataView into column hierarchy. */
        function apply(dataViewMatrix: DataViewMatrix, context: MatrixTransformationContext): void;
        function cloneTree(node: DataViewMatrixNode): DataViewMatrixNode;
        function cloneTreeExecuteOnLeaf(node: DataViewMatrixNode, callback?: (node: DataViewMatrixNode) => void): DataViewMatrixNode;
    }
}
declare module powerbi.data {
    module DataViewSelfCrossJoin {
        /**
         * Returns a new DataView based on the original, with a single DataViewCategorical category that is "cross joined"
         * to itself as a value grouping.
         * This is the mathematical equivalent of taking an array and turning it into an identity matrix.
         */
        function apply(dataView: DataView): DataView;
    }
}
declare module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    type DisplayNameGetter = ((resourceProvider: IStringResourceProvider) => string) | string;
    function createDisplayNameGetter(displayNameKey: string): (IStringResourceProvider) => string;
    function getDisplayName(displayNameGetter: data.DisplayNameGetter, resourceProvider: jsCommon.IStringResourceProvider): string;
}
declare module powerbi.data {
    /** Represents a data provider. */
    interface IDataProvider {
        /** Executes a query, with a promise of completion.  The response object should be compatible with the transform implementation. */
        execute?(options: DataProviderExecutionOptions): RejectablePromise2<DataProviderData, IClientError>;
        /** Transforms the given data into a DataView.  When this function is not specified, the data is put on a property on the DataView. */
        transform?(obj: DataProviderData): DataProviderTransformResult;
        /** Stops all future communication and reject and pending communication  */
        stopCommunication?(): void;
        /** Resumes communication which enables future requests */
        resumeCommunication?(): void;
        /** Clear cache */
        clearCache?(): void;
        /** rewriteCacheEntries */
        rewriteCacheEntries?(rewriter: DataProviderCacheRewriter): void;
    }
    interface DataProviderTransformResult {
        dataView?: DataView;
        restartToken?: RestartToken;
        error?: IClientError;
        warning?: IClientWarning;
    }
    interface RestartToken {
    }
    /** Represents a custom data provider plugin, to be registered in the powerbi.data.plugins object. */
    interface IDataProviderPlugin {
        /** The name of this plugin. */
        name: string;
        /** Factory method for the IDataProvider. */
        create(hostServices: IDataProviderHostServices): IDataProvider;
    }
    /** Represents a query command defined by an IDataProvider. */
    interface DataProviderCommand {
    }
    /** Represents a data source defined by an IDataProvider. */
    interface DataProviderDataSource {
    }
    /** Represents arbitrary data defined by an IDataProvider. */
    interface DataProviderData {
    }
    /** Represents cacheRewriter that will rewrite the cache of provider as defined by an IDataProvider. */
    interface DataProviderCacheRewriter {
    }
    interface DataProviderExecutionOptions {
        dataSource?: DataProviderDataSource;
        command: DataProviderCommand;
        allowCache?: boolean;
        cacheResponseOnServer?: boolean;
    }
    interface IDataProviderHostServices {
        promiseFactory(): IPromiseFactory;
    }
}
declare module powerbi {
    /** Enumeration of DateTimeUnits */
    enum DateTimeUnit {
        Year = 0,
        Month = 1,
        Week = 2,
        Day = 3,
        Hour = 4,
        Minute = 5,
        Second = 6,
        Millisecond = 7,
    }
    interface IFormattingService {
        /** Formats the value using provided format expression and culture
          * @param value - value to be formatted and converted to string.
          * @param format - format to be applied. If undefined or empty then generic format is used.
          */
        formatValue(value: any, format?: string): string;
        /** Replaces the indexed format tokens (for example {0:c2}) in the format string with the localized formatted arguments.
         * @param formatWithIndexedTokens - format string with a set of indexed format tokens.
         * @param args - array of values which should replace the tokens in the format string.
         * @param culture - localization culture. If undefined then the current culture is used.
         */
        format(formatWithIndexedTokens: string, args: any[], culture?: string): string;
        /** Gets a value indicating whether the specified format a standard numeric format specifier. */
        isStandardNumberFormat(format: string): boolean;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        formatNumberWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string): string;
        /** Gets the format string to use for dates in particular units. */
        dateFormatString(unit: DateTimeUnit): string;
    }
}
declare module powerbi.data {
    interface DataProviderReference {
        type?: string;
    }
    interface IDataProviderFactory {
        getPlugin(type: string): IDataProviderPlugin;
    }
    function createDataProviderFactory(plugins: {
        [name: string]: IDataProviderPlugin;
    }): IDataProviderFactory;
    module DataProviderUtils {
        /** Finds the IDataProvider plugin name referred to by the set of references. */
        function findType(references: DataProviderReference[]): string;
    }
}
declare module powerbi {
    /** Represents views of a data set. */
    interface DataView {
        metadata: DataViewMetadata;
        categorical?: DataViewCategorical;
        single?: DataViewSingle;
        tree?: DataViewTree;
        table?: DataViewTable;
        matrix?: DataViewMatrix;
    }
    interface DataViewMetadata {
        columns: DataViewMetadataColumn[];
        /** The metadata repetition objects. */
        objects?: DataViewObjects;
        /** When defined, describes whether the DataView contains just a segment of the complete data set. */
        segment?: DataViewSegmentMetadata;
    }
    interface DataViewMetadataColumn {
        /** The user-facing display name of the column. */
        displayName: string;
        /** The query name the source column in the query. */
        queryName?: string;
        /** The format string of the column. */
        format?: string;
        /** Data type information for the column. */
        type?: ValueType;
        /** Indicates that this column is a measure (aggregate) value. */
        isMeasure?: boolean;
        /** The position of the column in the select statement. */
        index?: number;
        /** The properties that this column provides to the visualization. */
        roles?: {
            [name: string]: boolean;
        };
        /** The metadata repetition objects. */
        objects?: DataViewObjects;
        /** The name of the containing group. */
        groupName?: string;
    }
    interface DataViewSegmentMetadata {
    }
    interface DataViewCategorical {
        categories?: DataViewCategoryColumn[];
        values?: DataViewValueColumns;
    }
    interface DataViewCategoricalColumn {
        source: DataViewMetadataColumn;
        values: any[];
        /** The data repetition objects. */
        objects?: DataViewObjects[];
    }
    interface DataViewValueColumns extends Array<DataViewValueColumn> {
        /** Returns an array that groups the columns in this group together. */
        grouped(): DataViewValueColumnGroup[];
        /** The set of expressions that define the identity for instances of the value group.  This must match items in the DataViewScopeIdentity in the grouped items result. */
        identityFields?: data.SQExpr[];
        source?: DataViewMetadataColumn;
    }
    interface DataViewValueColumnGroup {
        values: DataViewValueColumn[];
        identity?: DataViewScopeIdentity;
        /** The data repetition objects. */
        objects?: DataViewObjects;
        name?: string;
    }
    interface DataViewValueColumn extends DataViewCategoricalColumn {
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
    interface DataViewCategoryColumn extends DataViewCategoricalColumn {
        identity?: DataViewScopeIdentity[];
        /** The set of expressions that define the identity for instances of the category.  This must match items in the DataViewScopeIdentity in the identity. */
        identityFields?: data.SQExpr[];
    }
    interface DataViewSingle {
        value: any;
    }
    interface DataViewTree {
        root: DataViewTreeNode;
    }
    interface DataViewTreeNode {
        name?: string;
        value?: any;
        values?: {
            [id: number]: DataViewTreeNodeValue;
        };
        children?: DataViewTreeNode[];
        identity?: DataViewScopeIdentity;
        /** The set of expressions that define the identity for the child nodes.  This must match items in the DataViewScopeIdentity of those nodes. */
        childIdentityFields?: data.SQExpr[];
    }
    interface DataViewTreeNodeValue {
        value?: any;
    }
    interface DataViewTreeNodeMeasureValue extends DataViewTreeNodeValue {
        subtotal?: any;
        max?: any;
        min?: any;
        highlight?: any;
        /** Client-computed maximum value for a column. */
        maxLocal?: any;
        /** Client-computed maximum value for a column. */
        minLocal?: any;
    }
    interface DataViewTreeNodeGroupValue extends DataViewTreeNodeValue {
        count?: any;
    }
    interface DataViewTable {
        columns: DataViewMetadataColumn[];
        identity?: DataViewScopeIdentity[];
        rows?: any[][];
        totals?: any[];
    }
    interface DataViewTableRow {
        values: any[];
        /** The metadata repetition objects. */
        objects?: DataViewObjects[];
    }
    interface DataViewMatrix {
        rows: DataViewHierarchy;
        columns: DataViewHierarchy;
        valueSources: DataViewMetadataColumn[];
    }
    interface DataViewMatrixNode extends DataViewTreeNode {
        /** Indicates the level this node is on. Zero indicates the outermost children (root node level is undefined). */
        level?: number;
        /** Indicates the source metadata index on the node's level. Its value is 0 if omitted. */
        levelSourceIndex?: number;
        /** Indicates whether or not the node is a subtotal node. Its value is false if omitted. */
        isSubtotal?: boolean;
    }
    interface DataViewMatrixNodeValue extends DataViewTreeNodeValue {
        /** Indicates the index of the corresponding measure (held by DataViewMatrix.valueSources). Its value is 0 if omitted. */
        valueSourceIndex?: number;
    }
    interface DataViewHierarchy {
        root: DataViewMatrixNode;
        levels: DataViewHierarchyLevel[];
    }
    interface DataViewHierarchyLevel {
        sources: DataViewMetadataColumn[];
    }
}
declare module powerbi {
    module DataViewAnalysis {
        import QueryProjectionByProperty = powerbi.data.QueryProjectionsByRole;
        interface ValidateAndReshapeResult {
            dataView?: DataView;
            isValid: boolean;
        }
        /** Reshapes the data view to match the provided schema if possible. If not, returns null */
        function validateAndReshape(dataView: DataView, dataViewMappings: DataViewMapping[]): ValidateAndReshapeResult;
        function countGroups(columns: DataViewMetadataColumn[]): number;
        function countMeasures(columns: DataViewMetadataColumn[]): number;
        /** Indicates whether the dataView conforms to the specified schema. */
        function supports(dataView: DataView, roleMapping: DataViewMapping, usePreferredDataViewSchema?: boolean): boolean;
        function conforms(value: number, range: NumberRange): boolean;
        /** Determines the appropriate DataViewMappings for the projections. */
        function chooseDataViewMappings(projections: QueryProjectionByProperty, mappings: DataViewMapping[]): DataViewMapping[];
        function getPropertyCount(roleName: string, projections: QueryProjectionByProperty): number;
    }
}
declare module powerbi {
    interface DataViewMapping {
        /**
         * Defines set of conditions, at least one of which must be satisfied for this mapping to be used.
         * Any roles not specified in the condition accept any number of items.
         */
        conditions?: DataViewMappingCondition[];
        categorical?: DataViewCategoricalMapping;
        table?: DataViewTableMapping;
        single?: DataViewSingleMapping;
        tree?: DataViewTreeMapping;
        matrix?: DataViewMatrixMapping;
    }
    /** Describes whether a particular mapping is fits the set of projections. */
    interface DataViewMappingCondition {
        [dataRole: string]: NumberRange;
    }
    interface DataViewCategoricalMapping {
        categories?: DataViewRoleMappingWithReduction;
        values?: DataViewRoleMapping | DataViewGroupedRoleMapping | DataViewListRoleMapping;
        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange;
    }
    interface DataViewGroupingRoleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string;
    }
    interface DataViewSingleMapping {
        /** Indicates the role which is bound to this structure. */
        role: string;
    }
    interface DataViewValuesRoleMapping {
        /** Indicates the sequence of roles which are bound to this structure. */
        roles: string[];
    }
    interface DataViewTableMapping {
        rows: DataViewRoleMappingWithReduction | DataViewListRoleMappingWithReduction;
        /** Specifies a constraint on the number of data rows supported by the visual. */
        rowCount?: AcceptabilityNumberRange;
    }
    interface DataViewTreeMapping {
        nodes?: DataViewGroupingRoleMapping;
        values?: DataViewValuesRoleMapping;
        /** Specifies a constraint on the depth of the tree supported by the visual. */
        depth?: AcceptabilityNumberRange;
    }
    interface DataViewMatrixMapping {
        rows?: DataViewRoleForMappingWithReduction;
        columns?: DataViewRoleForMappingWithReduction;
        values?: DataViewRoleForMapping;
    }
    type DataViewRoleMapping = DataViewRoleBindMapping | DataViewRoleForMapping;
    interface DataViewRoleBindMapping {
        /**
         * Indicates evaluation of a single-valued data role.
         * Equivalent to for, without support for multiple items.
         */
        bind: {
            to: string;
        };
    }
    interface DataViewRoleForMapping {
        /** Indicates iteration of the in data role, as an array. */
        for: {
            in: string;
        };
    }
    type DataViewRoleMappingWithReduction = DataViewRoleBindMappingWithReduction | DataViewRoleForMappingWithReduction;
    interface DataViewRoleBindMappingWithReduction extends DataViewRoleBindMapping, HasReductionAlgorithm {
    }
    interface DataViewRoleForMappingWithReduction extends DataViewRoleForMapping, HasReductionAlgorithm {
    }
    interface DataViewGroupedRoleMapping {
        group: {
            by: string;
            select: DataViewRoleMapping[];
            dataReductionAlgorithm?: ReductionAlgorithm;
        };
    }
    interface DataViewListRoleMapping {
        select: DataViewRoleMapping[];
    }
    interface DataViewListRoleMappingWithReduction extends DataViewListRoleMapping, HasReductionAlgorithm {
    }
    interface HasReductionAlgorithm {
        dataReductionAlgorithm?: ReductionAlgorithm;
    }
    /** Describes how to reduce the amount of data exposed to the visual. */
    interface ReductionAlgorithm {
        top?: DataReductionTop;
        bottom?: DataReductionBottom;
        sample?: DataReductionSample;
        window?: DataReductionWindow;
    }
    /** Reduce the data to the Top(count) items. */
    interface DataReductionTop {
        count?: number;
    }
    /** Reduce the data to the Bottom count items. */
    interface DataReductionBottom {
        count?: number;
    }
    /** Reduce the data using a simple Sample of count items. */
    interface DataReductionSample {
        count?: number;
    }
    /** Allow the data to be loaded one window, containing count items, at a time. */
    interface DataReductionWindow {
        count?: number;
    }
    interface AcceptabilityNumberRange {
        /** Specifies a preferred range of values for the constraint. */
        preferred?: NumberRange;
        /** Specifies a supported range of values for the constraint. Defaults to preferred if not specified. */
        supported?: NumberRange;
    }
    /** Defines the acceptable values of a number. */
    interface NumberRange {
        min?: number;
        max?: number;
    }
}
declare module powerbi {
    /** Encapsulates the identity of a data scope in a DataView. */
    interface DataViewScopeIdentity {
        /** Predicate expression that identifies the scope. */
        expr: data.SQExpr;
        /** Key string that identifies the DataViewScopeIdentity to a string, which can be used for equality comparison. */
        key: string;
    }
    module DataViewScopeIdentity {
        /** Compares the two DataViewScopeIdentity values for equality. */
        function equals(x: DataViewScopeIdentity, y: DataViewScopeIdentity, ignoreCase?: boolean): boolean;
        function filterFromIdentity(identities: DataViewScopeIdentity[], isNot?: boolean): data.SemanticFilter;
    }
    module data {
        function createDataViewScopeIdentity(expr: SQExpr): DataViewScopeIdentity;
    }
}
declare module powerbi.data {
    /** Defines a match against all instances of a given DataView scope. */
    interface DataViewScopeWildcard {
        exprs: SQExpr[];
        key: string;
    }
    module DataViewScopeWildcard {
        function matches(wildcard: DataViewScopeWildcard, instance: DataViewScopeIdentity): boolean;
        function fromExprs(exprs: SQExpr[]): DataViewScopeWildcard;
    }
}
declare module powerbi.data {
    import INumberDictionary = jsCommon.INumberDictionary;
    interface DataViewTransformApplyOptions {
        prototype: DataView;
        objectDescriptors: DataViewObjectDescriptors;
        dataViewMappings?: DataViewMapping[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
    }
    /** Describes the Transform actions to be done to a prototype DataView. */
    interface DataViewTransformActions {
        /** Describes transform metadata for each semantic query select item, as the arrays align, by index. */
        selects?: DataViewSelectTransform[];
        /** Describes the DataViewObject definitions. */
        objects?: DataViewObjectDefinitions;
        /** Describes the splitting of a single input DataView into multiple DataViews. */
        splits?: DataViewSplitTransform[];
        /** Describes the order of selects (referenced by query index) in each role. */
        projectionOrdering?: DataViewProjectionOrdering;
    }
    interface DataViewSelectTransform {
        displayName?: string;
        queryName?: string;
        format?: string;
        type?: ValueType;
        roles?: {
            [roleName: string]: boolean;
        };
    }
    interface DataViewSplitTransform {
        selects: INumberDictionary<boolean>;
    }
    interface DataViewProjectionOrdering {
        [roleName: string]: number[];
    }
    interface MatrixTransformationContext {
        rowHierarchyRewritten: boolean;
        columnHierarchyRewritten: boolean;
        hierarchyTreesRewritten: boolean;
    }
    module DataViewTransform {
        function apply(options: DataViewTransformApplyOptions): DataView[];
        function upgradeSettingsToObjects(settings: VisualElementSettings, objectDefns?: DataViewObjectDefinitions): DataViewObjectDefinitions;
        function createTransformActions(queryMetadata: QueryMetadata, visualElements: VisualElement[], objectDescs: DataViewObjectDescriptors, objectDefns: DataViewObjectDefinitions): DataViewTransformActions;
        function createValueColumns(values?: DataViewValueColumn[], valueIdentityFields?: SQExpr[]): DataViewValueColumns;
    }
}
declare module powerbi.data {
    class RuleEvaluation {
        scopeId: DataViewScopeIdentity;
        inputRole: string;
        protected value: any;
        constructor(inputRole?: string);
        setContext(scopeId: DataViewScopeIdentity, value: any): void;
        evaluate(): any;
    }
}
declare module powerbi.data {
    class ColorRuleEvaluation extends RuleEvaluation {
        private allocator;
        constructor(inputRole: string, allocator: IColorAllocator);
        evaluate(): any;
    }
}
declare module powerbi.data {
    class FilterRuleEvaluation extends RuleEvaluation {
        private selection;
        constructor(scopeIds: FilterValueScopeIdsContainer);
        evaluate(): any;
    }
}
declare module powerbi.data.dsr {
    interface MergedMappings {
        mapping: CompiledDataViewMapping;
        splits?: DataViewSplitTransform[];
    }
    function mergeMappings(mappings: CompiledDataViewMapping[], projections: QueryProjectionsByRole, indicesByName: NameToIndex): MergedMappings;
}
declare module powerbi.data.dsr {
    /** Top-level container for a Data Shape Result. */
    interface DataShapeResult {
        DataShapes: DataShape[];
    }
    /** Represents a Data Shape. */
    interface DataShape {
        Id: string;
        'odata.error'?: ODataError;
        IsComplete?: boolean;
        PrimaryHierarchy?: DataMember[];
        SecondaryHierarchy?: DataMember[];
        Calculations?: Calculation[];
        RestartTokens?: (string | boolean)[][];
        DataLimitsExceeded?: Limit[];
    }
    interface ODataError {
        code: string;
        message: ODataErrorMessage;
        'azure:values'?: AzureValue[];
    }
    interface AzureValue {
        timestamp?: Date;
        details?: string;
        additionalMessages?: AdditionalErrorMessage[];
    }
    interface ODataErrorMessage {
        lang: string;
        value: string;
    }
    interface AdditionalErrorMessage {
        Code: string;
        Severity?: string;
        Message?: string;
        ObjectType?: string;
        ObjectName?: string;
        PropertyName?: string;
    }
    interface Limit {
        id: string;
    }
    /** Represents a Data Member, with optional Instances for nested groups. */
    interface DataMember {
        Id: string;
        Instances: GroupInstance[];
    }
    /** Represents instances of a group. */
    interface GroupInstance {
        RestartFlag?: RestartFlagKind;
        Calculations?: Calculation[];
        Members?: DataMember[];
        Intersections?: Intersection[];
    }
    /** Represents a calculation group. */
    interface Calculation {
        Id: string;
        /** Value of the calculation. Can be parsed with PrimitiveValueEncoding.parseValue. */
        Value: string;
    }
    /** Represents a DSR intersection. */
    interface Intersection {
        Id: string;
        Calculations?: Calculation[];
    }
    enum RestartFlagKind {
        Append = 0,
        Merge = 1,
    }
}
declare module powerbi.data.dsr {
    module DataShapeUtility {
        function findAndParseCalculation(calcs: Calculation[], id: string): any;
        function findAndParseCalculationToSQExpr(calcs: Calculation[], id: string): SQExpr;
        function findCalculation(calcs: Calculation[], id: string): any;
        function getCalculationInstanceCount(dsr: DataShapeResult, descriptor: QueryBindingDescriptor, selectOrdinal: number): number;
        /** Converts SemanticType/DataCategory into a ValueType. */
        function describeDataType(type?: SemanticType, category?: string): ValueType;
        function increaseLimitForPrimarySegmentation(dataShapeBinding: DataShapeBinding, count: number): void;
        function getTopLevelSecondaryDynamicMember(dataShape: DataShape, dataShapeExpressions: DataShapeExpressions): DataMember;
        function getTopLevelPrimaryDynamicMember(dataShape: DataShape, dataShapeExpressions: DataShapeExpressions, useTopLevelCalculations?: boolean): DataMember;
        function getDynamicMember(dataShapeMembers: DataMember[], axisGroupings: DataShapeExpressionsAxisGrouping[], groupDepth: number, hasTopLevelCalculations?: boolean): DataMember;
        /** Falback mechanism for results that did not contain Member ID on QueryBindingDescriptor. */
        function getDynamicMemberFallback(dataShapeMembers: DataMember[], hasTopLevelCalculations?: boolean): DataMember;
    }
}
declare module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import ODataError = powerbi.data.dsr.ODataError;
    class DsrClientError implements IClientError {
        private oDataError;
        private oDataCode;
        code: string;
        ignorable: boolean;
        constructor(oDataError: ODataError);
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
        private getErrorKeyValueFromStatusCode(code, resourceProvider);
        private parseCode();
        private static isCodeKnown(code);
    }
}
declare module powerbi.data.dsr {
    import ITimerPromiseFactory = jsCommon.ITimerPromiseFactory;
    class DsrDataProvider implements IDataProvider {
        private proxy;
        private static undefinedData;
        constructor(host: IDataProviderHostServices, communication: IExecuteSemanticQueryProxyCommunication, delayedResultHandler?: IExecuteSemanticQueryDelayedResultHandler, timerFactory?: ITimerPromiseFactory);
        execute(options: DataProviderExecutionOptions): RejectablePromise<DataProviderData>;
        transform(obj: DataProviderData): DataProviderTransformResult;
        stopCommunication(): void;
        resumeCommunication(): void;
        clearCache(): void;
        rewriteCacheEntries(rewriter: data.DataProviderCacheRewriter): void;
    }
}
declare module powerbi.data.dsr {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    enum LimitType {
        Unknown = -1,
        Top = 0,
        Bottom = 1,
        Sample = 2,
    }
    class DsrLimitsWarning implements IClientWarning {
        private queryBindingDescriptor;
        columnNameFromIndex: (index: number) => string;
        constructor(queryBindingDescriptor: QueryBindingDescriptor);
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
        private static getMessage(type, resourceProvider);
        private static getKey(type, resourceProvider);
        private getDetailedMessage(groupings, type, defaultString, resourceProvider);
        private static getDetailedMessageFormatForOneColumn(type, resourceProvider);
        private static getDefaultDetailedMessage(type, resourceProvider);
        private static getLimitType(limitDescriptor);
    }
}
declare module powerbi.data.dsr {
    /** This is the data contract for the DataViewSource.data string, which should be JSON. */
    interface DataViewData {
        descriptor: QueryBindingDescriptor;
        dsr: dsr.DataShapeResult;
        schemaName: string;
    }
    function read(arg: any): DataProviderTransformResult;
    function readDsr(descriptor: QueryBindingDescriptor, dsr: DataShapeResult, schemaName: string): DataProviderTransformResult;
}
declare module powerbi.data.dsr {
    class ExecuteSemanticQueryBatcher {
        private currentBatchDeferred;
        private maxBatches;
        private pending;
        private queryExecuteCallback;
        private timerFactory;
        /** Creates an ExecuteSemanticQueryBatcher object that will arrange a collection of executeSemanticQueries into
        *   batches before calling you back with the batch list.
        * @param preferredMaxBatches The maximum number of batches we would prefer to have. We cannot set a hard limit
        *                            on the number of batches for multi-model scenarios because with our current server
        *                            APIs we can only specify one model per request, therefore the mininum number of
        *                            batches will be the number of distinct models in the query collection.
        *                            Note: In future when we have multi-model support, if we find that users frequently
        *                            load slides with more datasources than our preferred max we can consider adding
        *                            server endpoints that allow specifying multiple datasources.
        * @param onBatchExecute      The callback that is invoked when the ExecuteSemanticQueryBatcher is done creating
        *                            the batches.
        * @ param timerFactory       Optional factory instance for creating timers
        */
        constructor(preferredMaxBatches: number, onBatchExecute: (batches: QueryBatch[]) => void, timerFactory?: jsCommon.ITimerPromiseFactory);
        /** Enqueue a query to run as part of one of the batches. The promise returned from this
            this function will be resolved when the batch runs. */
        enqueue(queudQuery: QueuedExecution): JQueryPromise<void>;
        clearPending(): void;
        private createBatches();
        private sortQueriesByDataSource();
        private findDataSourceGroup(dataSource, dataSourceGroups, shouldCache);
        private createBatchFromDataSourceGroup(dataSourceGroup);
        private splitDataSourcesIntoBatches(dataSourceGroups, maxBatches);
        private splitBatches(initialBatches, maxBatches);
        /** Splits half of the commands/promises out of the batch into a new batch. The new batch is set as the return value. */
        private splitBatch(batch);
    }
}
declare module powerbi.data.dsr {
    import ITimerPromiseFactory = jsCommon.ITimerPromiseFactory;
    import SemanticQueryDataShapeCommand = data.SemanticQueryDataShapeCommand;
    interface ExecuteSemanticQueryDataSource {
        schemaName: string;
        securityToken?: string;
        vsName?: string;
        dbName?: string;
        modelId?: number;
    }
    /** Defines the atomic query execution options. */
    interface IExecuteSemanticQueryProxyCommunication {
        execute(commands: SemanticQueryDataShapeCommand[], dataSource: ExecuteSemanticQueryDataSource, cacheResponseOnServer?: boolean): IPromise<ExecuteSemanticQueryResult>;
    }
    interface IExecuteSemanticQueryProxy {
        execute(options: DataProviderExecutionOptions): RejectablePromise<DataProviderData>;
        stopCommunication(): void;
        resumeCommunication(): void;
        rewriteCacheEntries(rewriter: ISemanticQueryCacheRewriter): void;
        clearCache(): void;
    }
    function createExecuteSemanticQueryProxyHttpCommunication(httpService: IHttpService): IExecuteSemanticQueryProxyCommunication;
    interface QueuedExecution {
        options: DataProviderExecutionOptions;
        deferred: IDeferred2<DataViewData, IClientError>;
        execution: RejectablePromise2<DataView, IClientError>;
    }
    interface QueryBatch {
        dataSource: ExecuteSemanticQueryDataSource;
        commands: powerbi.data.SemanticQueryDataShapeCommand[];
        promises: IDeferred2<DataViewData, IClientError>[];
        cacheResponseOnServer?: boolean;
    }
    interface ExecuteSemanticQueryRequest {
        semanticQueryDataShapeCommands?: powerbi.data.SemanticQueryDataShapeCommand[];
        commands?: SemanticQueryDataShapeCommandWithCacheKey[];
        databaseName: string;
        virtualServerName: string;
        modelId: number;
    }
    interface SemanticQueryDataShapeCommandWithCacheKey {
        Command: powerbi.data.SemanticQueryDataShapeCommand;
        CacheKey?: string;
    }
    interface ExecuteSemanticQueryResult {
        jobIds: string[];
        results: QueryResultWrapperWithJobId[];
    }
    interface QueryResultWrapperWithJobId {
        jobId: string;
        result: QueryResultWrapper;
    }
    interface QueryResultWrapper {
        data?: QueryResultData;
        asyncResult?: QueryResultAsyncPlaceholder;
        error?: ServiceError;
    }
    interface QueryResultData {
        descriptor: QueryBindingDescriptor;
        dsr: dsr.DataShapeResult;
    }
    interface QueryResultAsyncPlaceholder {
    }
    interface IExecuteSemanticQueryDelayedResultHandler {
        registerDelayedResult(jobId: string, deferred: IDeferred2<DataViewData, IClientError>, schemaName: string): void;
        setQueryResolver(resolver: IExecuteSemanticQueryDelayedResultResolver): void;
    }
    interface IExecuteSemanticQueryDelayedResultResolver {
        resolveDelayedQuery(jobId: string, deferred: IDeferred2<data.dsr.DataViewData, IClientError>, schemaName: string): void;
    }
    interface ISemanticQueryCacheRewriter {
        rewriteCacheKey?(cacheKey: CacheKeyObject): CacheKeyObject;
        rewriteCacheResult?(result: DataViewData): DataViewData;
    }
    interface CacheKeyObject {
        dbName: string;
        vsName: string;
        schemaName: string;
        command: powerbi.data.DataProviderCommand;
    }
    class ExecuteSemanticQueryProxy implements IExecuteSemanticQueryProxy {
        private static defaultPreferredMaxConnections;
        private promiseFactory;
        private communication;
        private delayedResultHandler;
        private batcher;
        private isCommunicationStopped;
        private queryCache;
        private pausedQueries;
        constructor(host: IDataProviderHostServices, communication: IExecuteSemanticQueryProxyCommunication, delayedResultHandler?: IExecuteSemanticQueryDelayedResultHandler, timerFactory?: ITimerPromiseFactory, preferredMaxConnections?: number);
        execute(options: DataProviderExecutionOptions): RejectablePromise2<DataProviderData, IClientError>;
        /**
        * Stops all future communication and reject and pending communication
        */
        stopCommunication(): void;
        /**
        * Resumes communication which enables future requests
        */
        resumeCommunication(): void;
        /**
         * Updates cache entries using an updater object. If a cache entry is affected by the update
         * it is either re-written or cleared
         * @param {ICacheUpdater} updater - updates the cache entry
         * queryCache {RejectablePromiseCache<DataProviderData>} queryCache
         */
        rewriteCacheEntries(rewriter: ISemanticQueryCacheRewriter): void;
        /**
         * Clear all cache entries
         */
        clearCache(): void;
        /**
        * Generates key used to access query cache based on the provided options
        * @param {DataProviderExecutionOptions} options - Properties of this object are used to generate cache key
        */
        private generateCacheKey(options);
        private executeBatch(batch);
        private onSuccess(result, executions, schemaName);
        private onError<T, U>(executions);
    }
    /**
     * Updates cache entries using an updater object. If a cache entry is affected by the update
     * it is either re-written or cleared
     * @param {ICacheUpdater} updater - updates the cache entry
     * queryCache {RejectablePromiseCache<DataProviderData>} queryCache
     */
    function rewriteSemanticQueryCacheEntries(rewriter: ISemanticQueryCacheRewriter, queryCache: RejectablePromiseCache<DataProviderData>): void;
}
declare module powerbi.data.dsr {
    interface QueryBindingDescriptor {
        Select?: SelectBinding[];
        Expressions?: DataShapeExpressions;
        Limits?: DataShapeLimits;
    }
    interface SelectBinding {
        Kind: SelectKind;
        Depth?: number;
        SecondaryDepth?: number;
        Value?: string;
        Format?: string;
        /**
         * Holds the identifiers for user-facing subtotal values of the Select item (if any).
         * The index into the collection is determined by combining the desired primary depth, the desired
         * secondary depth, and the maximum primary and secondary depths according to the formula:
         *
         * Index = PrimaryDepth + ((MaxSecondaryDepth - SecondaryDepth) * (MaxPrimaryDepth + 1))
         *
         * The following diagram shows how this works:
         *
         * SecondaryDepth:2    1      0
         *
         * |-----------------------------|
         * |           | SG1       | Tot |
         * |           |-----|-----|     |
         * |           | SG2 | Tot |     |
         * |-----------|-----|-----|-----|    PrimaryDepth:
         * | PG1 | PG2 |  2  |  5  |  8  |    2
         * |     |-----|-----|-----|-----|
         * |     | Tot |  1  |  4  |  7  |    1
         * |-----------|-----|-----|-----|
         * | Tot       |  0  |  3  |  6  |    0
         * |-----------------------------|
         *
         * We start numbering from the bottom left so the indices remain consistent when
         * there are no secondary groups, and when secondary totals are disabled which are the common cases.
         */
        Subtotal?: string[];
        Max?: string[];
        Min?: string[];
        Count?: string[];
        Type?: SemanticType;
        Highlight?: AuxiliarySelectBinding;
        DataCategory?: string;
    }
    interface DataShapeExpressions {
        Primary: DataShapeExpressionsAxis;
        Secondary?: DataShapeExpressionsAxis;
    }
    interface DataShapeExpressionsAxis {
        Groupings: DataShapeExpressionsAxisGrouping[];
    }
    interface DataShapeExpressionsAxisGrouping {
        Keys: DataShapeExpressionsAxisGroupingKey[];
        Member?: string;
        SubtotalMember?: string;
    }
    interface DataShapeExpressionsAxisGroupingKey {
        Source: ConceptualPropertyReference;
        Select?: number;
        Calc?: string;
    }
    interface ConceptualPropertyReference {
        Entity: string;
        Property: string;
    }
    interface DataShapeLimits {
        Primary?: DataShapeLimitDescriptor;
        Secondary?: DataShapeLimitDescriptor;
    }
    interface DataShapeLimitDescriptor {
        Id: string;
        Top?: TopLimitDescriptor;
        Bottom?: BottomLimitDescriptor;
        Sample?: SampleLimitDescriptor;
    }
    interface TopLimitDescriptor extends LimitDescriptor {
    }
    interface BottomLimitDescriptor extends LimitDescriptor {
    }
    interface SampleLimitDescriptor extends LimitDescriptor {
    }
    interface LimitDescriptor {
        Count: number;
    }
}
declare module powerbi.data.dsr {
    interface IQueryBindingDescriptorVisitorWithArg<T> {
        visitDescriptor(discriptor: QueryBindingDescriptor, arg: T): void;
        visitSelect(select: SelectBinding, arg: T): void;
        visitExpressions(expressions: DataShapeExpressions, arg: T): void;
        visitDataShapeExpressionsAxis(axis: DataShapeExpressionsAxis, arg: T): void;
        visitDataShapeExpressionsAxisGrouping(grouping: DataShapeExpressionsAxisGrouping, arg: T): void;
        visitDataShapeExpressionsAxisGroupingKey(groupingKey: DataShapeExpressionsAxisGroupingKey, arg: T): void;
        visitConceptualPropertyReference(propertyRef: ConceptualPropertyReference, arg: T): void;
    }
    /**
     * traverse a query binding descriptior
     * @param {QueryBindingDescriptor} descriptor - Query Binding Descriptor
     * @param {IQueryBindingDescriptorVisitorWithArg} visitor - visitor of query binding descriptor
     */
    function traverseQueryBindingDescriptorWithArg<T>(descriptor: QueryBindingDescriptor, visitor: IQueryBindingDescriptorVisitorWithArg<T>, arg: T): void;
    class DefaultQueryBindingDescriptorVisitor<T> implements IQueryBindingDescriptorVisitorWithArg<T> {
        visitDescriptor(discriptor: QueryBindingDescriptor, arg: T): void;
        visitSelect(select: SelectBinding, arg: T): void;
        visitExpressions(expressions: DataShapeExpressions, arg: T): void;
        visitDataShapeExpressionsAxis(axis: DataShapeExpressionsAxis, arg: T): void;
        visitDataShapeExpressionsAxisGrouping(grouping: DataShapeExpressionsAxisGrouping, arg: T): void;
        visitDataShapeExpressionsAxisGroupingKey(groupingKey: DataShapeExpressionsAxisGroupingKey, arg: T): void;
        visitConceptualPropertyReference(propertyRef: ConceptualPropertyReference, arg: T): void;
    }
}
declare module powerbi.data.dsr {
    /** Responsible for responding to changes to the conceptual schema. */
    interface IQueryCacheHandler {
        /** Applies changes to the given exploration. */
        apply(queryProxy: IDataProxy, changes: SchemaChange[]): void;
    }
    function createQueryCacheHandler(): IQueryCacheHandler;
}
declare module powerbi.data.dsr {
    /** Represents a logical view of the data shape result metadata. */
    class QueryDescription {
        private _metadata;
        private _binding;
        constructor(metadata: QueryMetadata, binding: QueryBindingDescriptor);
        getSelectRestatements(): string[];
        getGroupRestatements(): string[];
        getMeasureRestatements(): string[];
        getFilterRestatements(): string[];
        private getRestatements(kind?);
    }
}
declare module powerbi.data.dsr {
    import SemanticQueryDataShapeCommand = powerbi.data.SemanticQueryDataShapeCommand;
    interface IQueryGenerator {
        run(options: QueryGeneratorOptions): QueryGeneratorResult;
    }
    interface ISemanticQuerySerializer {
        serializeQuery(query: SemanticQuery): QueryDefinition;
        serializeFilter(filter: SemanticFilter): FilterDefinition;
    }
    function createQueryGenerator(): IQueryGenerator;
    interface QueryGeneratorOptions {
        query: SemanticQuery;
        mappings: CompiledDataViewMapping[];
        projections: QueryProjectionsByRole;
        highlightFilter?: SemanticFilter;
        dataVolume?: number;
        restartToken?: RestartToken;
    }
    interface QueryGeneratorResult {
        command: SemanticQueryDataShapeCommand;
        splits?: DataViewSplitTransform[];
    }
    interface NameToIndex {
        [name: string]: number;
    }
    function generateDataShapeBinding(serializer: ISemanticQuerySerializer, projections: QueryProjectionsByRole, indicesByName: NameToIndex, mapping: CompiledDataViewMapping, highlightFilter?: SemanticFilter, dataVolume?: number, restartToken?: RestartToken): DataShapeBinding;
}
declare module powerbi.data.segmentation {
    interface DataViewTableSegment extends DataViewTable {
        lastMergeIndex?: number;
    }
    interface DataViewTreeSegmentNode extends DataViewTreeNode {
        isMerge?: boolean;
    }
    interface DataViewCategoricalSegment extends DataViewCategorical {
        lastMergeIndex?: number;
    }
    interface DataViewMatrixSegmentNode extends DataViewMatrixNode {
        isMerge?: boolean;
    }
    module DataViewMerger {
        function mergeDataViews(source: DataView, segment: DataView): void;
        function mergeTables(source: DataViewTable, segment: DataViewTableSegment): void;
        function mergeCategorical(source: DataViewCategorical, segment: DataViewCategoricalSegment): void;
        function mergeTreeNodes(sourceRoot: DataViewTreeNode, segmentRoot: DataViewTreeNode, allowDifferentStructure: boolean): void;
        function areColumnArraysMergeEquivalent(sourceColumns: DataViewMetadataColumn[], segmentColumns: DataViewMetadataColumn[]): boolean;
    }
}
declare module powerbi.data {
    interface FilterValueScopeIdsContainer {
        isNot: boolean;
        scopeIds: DataViewScopeIdentity[];
    }
    module SQExprConverter {
        function asScopeIdsContainer(filter: SemanticFilter, fieldSQExprs: SQExpr[]): FilterValueScopeIdsContainer;
        /** Gets a comparand value from the given DataViewScopeIdentity. */
        function getFirstComparandValue(identity: DataViewScopeIdentity): any;
    }
}
declare module powerbi.data {
    /** Recognizes DataViewScopeIdentity expression trees to extract comparison keys. */
    module ScopeIdentityKeyExtractor {
        function run(expr: SQExpr): SQExpr[];
    }
}
declare module powerbi.data {
    /** Represents a simplified table aggregate/column/column aggregate reference within a SQ. */
    interface SQFieldDef {
        schema: string;
        entity: string;
        column?: string;
        measure?: string;
        aggregate?: data.QueryAggregateFunction;
        entityVar?: string;
    }
    module SQExprConverter {
        function asSQFieldDef(sqExpr: SQExpr): SQFieldDef;
    }
    module SQExprBuilder {
        function fieldDef(fieldDef: SQFieldDef): SQExpr;
    }
}
declare module powerbi.data {
    module PrimitiveValueEncoding {
        function decimal(value: number): string;
        function double(value: number): string;
        function integer(value: number): string;
        function dateTime(value: Date): string;
        function text(value: string): string;
        function nullEncoding(): string;
        function boolean(value: boolean): string;
        /** Parses a typed value in a Data Shape Result. */
        function parseValue(dsqValue: any): any;
        function parseValueToSQExpr(dsqValue: any): SQExpr;
    }
}
declare module powerbi.data {
    /**
     * Represents the versions of the semantic query structure.
     * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\SemanticQuery\QueryVersions.cs
     *      file in the TFS Dev branch.
     */
    enum SemanticQueryVersions {
        /** The initial version of semantic query */
        Version0 = 0,
        /** EDM references removed, Property split into Column/Measure, Filter targets are fixed */
        Version1 = 1,
        /** Constants/DatePart replaced with Literal/DateSpan */
        Version2 = 2,
    }
}
declare module powerbi.data {
    /** Rewrites an expression tree, including all descendant nodes. */
    class SQExprRewriter implements ISQExprVisitor<SQExpr> {
        visitColumnRef(expr: SQColumnRefExpr): SQExpr;
        visitMeasureRef(expr: SQMeasureRefExpr): SQExpr;
        visitAggr(expr: SQAggregationExpr): SQExpr;
        visitEntity(expr: SQEntityExpr): SQExpr;
        visitAnd(orig: SQAndExpr): SQExpr;
        visitBetween(orig: SQBetweenExpr): SQExpr;
        visitIn(orig: SQInExpr): SQExpr;
        private rewriteAll(origExprs);
        visitOr(orig: SQOrExpr): SQExpr;
        visitCompare(orig: SQCompareExpr): SQExpr;
        visitContains(orig: SQContainsExpr): SQExpr;
        visitExists(orig: SQExistsExpr): SQExpr;
        visitNot(orig: SQNotExpr): SQExpr;
        visitStartsWith(orig: SQStartsWithExpr): SQExpr;
        visitConstant(expr: SQConstantExpr): SQExpr;
        visitDateSpan(orig: SQDateSpanExpr): SQExpr;
        visitDateAdd(orig: SQDateAddExpr): SQExpr;
        visitNow(orig: SQNowExpr): SQExpr;
    }
}
declare module powerbi.data {
    function createSchemaChangeRewriters(changes: SchemaChange[]): SQExprRewriter[];
}
declare module powerbi.data {
    /** Represents an immutable expression within a SemanticQuery. */
    class SQExpr {
        constructor();
        asFieldDef(): SQFieldDef;
        static equals(x: SQExpr, y: SQExpr, ignoreCase?: boolean): boolean;
        validate(schema: FederatedConceptualSchema): SQExprValidationError[];
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
        getMetadata(federatedSchema: FederatedConceptualSchema): SQExprMetadata;
        getDefaultAggregate(federatedSchema: FederatedConceptualSchema, forceAggregation?: boolean): QueryAggregateFunction;
        /** Return the SQExpr[] of group on columns if it has group on keys otherwise return the SQExpr of the column.*/
        getKeyColumns(schema: FederatedConceptualSchema): SQExpr[];
        private getConceptualProperty(federatedSchema);
        private getMetadataForProperty(field, federatedSchema);
        private static getMetadataForEntity(field, federatedSchema);
    }
    interface SQExprMetadata {
        kind: FieldKind;
        type: ValueType;
        format?: string;
        idOnEntityKey?: boolean;
        aggregate?: QueryAggregateFunction;
        defaultAggregate?: ConceptualDefaultAggregate;
    }
    enum FieldKind {
        /** Indicates the field references a column, which evaluates to a distinct set of values (e.g., Year, Name, SalesQuantity, etc.). */
        Column = 0,
        /** Indicates the field references a measure, which evaluates to a single value (e.g., SalesYTD, Sum(Sales), etc.). */
        Measure = 1,
    }
    function defaultAggregateForDataType(type: ValueType): QueryAggregateFunction;
    function defaultAggregateToQueryAggregateFunction(aggregate: ConceptualDefaultAggregate): QueryAggregateFunction;
    class SQEntityExpr extends SQExpr {
        schema: string;
        entity: string;
        variable: string;
        constructor(schema: string, entity: string, variable?: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQPropRefExpr extends SQExpr {
        ref: string;
        source: SQExpr;
        constructor(source: SQExpr, ref: string);
    }
    class SQColumnRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQMeasureRefExpr extends SQPropRefExpr {
        constructor(source: SQExpr, ref: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAggregationExpr extends SQExpr {
        arg: SQExpr;
        func: QueryAggregateFunction;
        constructor(arg: SQExpr, func: QueryAggregateFunction);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQAndExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQBetweenExpr extends SQExpr {
        arg: SQExpr;
        lower: SQExpr;
        upper: SQExpr;
        constructor(arg: SQExpr, lower: SQExpr, upper: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQInExpr extends SQExpr {
        args: SQExpr[];
        values: SQExpr[][];
        constructor(args: SQExpr[], values: SQExpr[][]);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQOrExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQCompareExpr extends SQExpr {
        kind: QueryComparisonKind;
        left: SQExpr;
        right: SQExpr;
        constructor(kind: QueryComparisonKind, left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQContainsExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQStartsWithExpr extends SQExpr {
        left: SQExpr;
        right: SQExpr;
        constructor(left: SQExpr, right: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQExistsExpr extends SQExpr {
        arg: SQExpr;
        constructor(arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQNotExpr extends SQExpr {
        arg: SQExpr;
        constructor(arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQConstantExpr extends SQExpr {
        type: ValueType;
        /** The native JavaScript representation of the value. */
        value: any;
        /** The string encoded, lossless representation of the value. */
        valueEncoded: string;
        constructor(type: ValueType, value: any, valueEncoded: string);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQDateSpanExpr extends SQExpr {
        unit: TimeUnit;
        arg: SQExpr;
        constructor(unit: TimeUnit, arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQDateAddExpr extends SQExpr {
        unit: TimeUnit;
        amount: number;
        arg: SQExpr;
        constructor(unit: TimeUnit, amount: number, arg: SQExpr);
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    class SQNowExpr extends SQExpr {
        constructor();
        accept<T, TArg>(visitor: ISQExprVisitorWithArg<T, TArg>, arg?: TArg): T;
    }
    /** Provides utilities for creating & manipulating expressions. */
    module SQExprBuilder {
        function entity(schema: string, entity: string, variable?: string): SQEntityExpr;
        function columnRef(source: SQExpr, prop: string): SQColumnRefExpr;
        function measureRef(source: SQExpr, prop: string): SQMeasureRefExpr;
        function aggregate(source: SQExpr, aggregate: QueryAggregateFunction): SQAggregationExpr;
        function and(left: SQExpr, right: SQExpr): SQAndExpr;
        function between(arg: SQExpr, lower: SQExpr, upper: SQExpr): SQBetweenExpr;
        function inExpr(args: SQExpr[], values: SQExpr[][]): SQInExpr;
        function or(left: SQExpr, right: SQExpr): SQAndExpr;
        function compare(kind: QueryComparisonKind, left: SQExpr, right: SQExpr): SQCompareExpr;
        function contains(left: SQExpr, right: SQExpr): SQContainsExpr;
        function exists(arg: SQExpr): SQExistsExpr;
        function equal(left: SQExpr, right: SQExpr): SQCompareExpr;
        function not(arg: SQExpr): SQNotExpr;
        function startsWith(left: SQExpr, right: SQExpr): SQStartsWithExpr;
        function nullConstant(): SQConstantExpr;
        function now(): SQNowExpr;
        function boolean(value: boolean): SQConstantExpr;
        function dateAdd(unit: TimeUnit, amount: number, arg: SQExpr): SQDateAddExpr;
        function dateTime(value: Date, valueEncoded?: string): SQConstantExpr;
        function dateSpan(unit: TimeUnit, arg: SQExpr): SQDateSpanExpr;
        function decimal(value: number, valueEncoded?: string): SQConstantExpr;
        function double(value: number, valueEncoded?: string): SQConstantExpr;
        function integer(value: number, valueEncoded?: string): SQConstantExpr;
        function text(value: string, valueEncoded?: string): SQConstantExpr;
        function setAggregate(expr: SQExpr, aggregate: QueryAggregateFunction): SQExpr;
        function removeAggregate(expr: SQExpr): SQExpr;
        function removeEntityVariables(expr: SQExpr): SQExpr;
        function createExprWithAggregate(expr: SQExpr, schema: FederatedConceptualSchema, aggregateNonNumericFields: boolean): SQExpr;
    }
    /** Provides utilities for obtaining information about expressions. */
    module SQExprInfo {
        function getAggregate(expr: SQExpr): QueryAggregateFunction;
    }
    enum SQExprValidationError {
        invalidAggregateFunction = 0,
        invalidSchemaReference = 1,
        invalidEntityReference = 2,
        invalidColumnReference = 3,
        invalidMeasureReference = 4,
        invalidLeftOperandType = 5,
        invalidRightOperandType = 6,
    }
}
declare module powerbi.data {
    module SQExprUtils {
        /** Returns an array of supported aggregates for a given expr and role. */
        function getSupportedAggregates(expr: SQExpr, isGroupingOnly: boolean, schema: FederatedConceptualSchema): QueryAggregateFunction[];
        function indexOfExpr(items: SQExpr[], searchElement: SQExpr): number;
        function sequenceEqual(x: SQExpr[], y: SQExpr[]): boolean;
        function uniqueName(namedItems: NamedSQExpr[], expr: SQExpr): string;
        /** Generates a default expression name  */
        function defaultName(expr: SQExpr, fallback?: string): string;
    }
}
declare module powerbi.data {
    class SemanticQueryRewriter {
        private exprRewriter;
        constructor(exprRewriter: ISQExprVisitor<SQExpr>);
        rewriteFrom(fromValue: SQFrom): SQFrom;
        rewriteSelect(selectItems: NamedSQExpr[], from: SQFrom): NamedSQExpr[];
        rewriteOrderBy(orderByItems: SQSortDefinition[], from: SQFrom): SQSortDefinition[];
        rewriteWhere(whereItems: SQFilter[], from: SQFrom): SQFilter[];
    }
}
declare module powerbi.data {
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    interface NamedSQExpr {
        name: string;
        expr: SQExpr;
    }
    interface SQFilter {
        target?: SQExpr[];
        condition: SQExpr;
    }
    /** Represents an entity reference in SemanticQuery from. */
    interface SQFromEntitySource {
        entity: string;
        schema: string;
    }
    /** Represents a sort over an expression. */
    interface SQSortDefinition {
        expr: SQExpr;
        direction: QuerySortDirection;
    }
    interface QueryFromEnsureEntityResult {
        name: string;
        new?: boolean;
    }
    interface SQSourceRenames {
        [from: string]: string;
    }
    /**
     * Represents a semantic query that is:
     * 1) Round-trippable with a JSON QueryDefinition.
     * 2) Immutable
     * 3) Long-lived and does not have strong references to a conceptual model (only names).
     */
    class SemanticQuery {
        private static empty;
        private fromValue;
        private whereItems;
        private orderByItems;
        private selectItems;
        constructor(from: any, where: any, orderBy: any, select: NamedSQExpr[]);
        static create(): SemanticQuery;
        private static createWithTrimmedFrom(from, where, orderBy, select);
        from(): SQFrom;
        /** Returns a query equivalent to this, with the specified selected items. */
        select(values: NamedSQExpr[]): SemanticQuery;
        /** Gets the items being selected in this query. */
        select(): ArrayNamedItems<NamedSQExpr>;
        private getSelect();
        private setSelect(values);
        /** Removes the given expression from the select. */
        removeSelect(expr: SQExpr): SemanticQuery;
        /** Removes the given expression from order by. */
        removeOrderBy(expr: SQExpr): SemanticQuery;
        selectNameOf(expr: SQExpr): string;
        setSelectAt(index: number, expr: SQExpr): SemanticQuery;
        /** Adds a the expression to the select clause. */
        addSelect(expr: SQExpr): SemanticQuery;
        /** Gets or sets the sorting for this query. */
        orderBy(values: SQSortDefinition[]): SemanticQuery;
        orderBy(): SQSortDefinition[];
        private getOrderBy();
        private setOrderBy(values);
        /** Gets or sets the filters for this query. */
        where(values: SQFilter[]): SemanticQuery;
        where(): SQFilter[];
        private getWhere();
        private setWhere(values);
        addWhere(filter: SemanticFilter): SemanticQuery;
        rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticQuery;
    }
    /** Represents a semantic filter condition.  Round-trippable with a JSON FilterDefinition.  Instances of this class are immutable. */
    class SemanticFilter {
        private fromValue;
        private whereItems;
        constructor(from: SQFrom, where: SQFilter[]);
        static fromSQExpr(contract: SQExpr): SemanticFilter;
        from(): SQFrom;
        conditions(): SQExpr[];
        where(): SQFilter[];
        rewrite(exprRewriter: ISQExprVisitor<SQExpr>): SemanticFilter;
        /** Merges a list of SemanticFilters into one. */
        static merge(filters: SemanticFilter[]): SemanticFilter;
        private static applyFilter(filter, from, where);
    }
    /** Represents a SemanticQuery/SemanticFilter from clause. */
    class SQFrom {
        private items;
        constructor(items?: {
            [name: string]: SQFromEntitySource;
        });
        keys(): string[];
        entity(key: string): SQFromEntitySource;
        ensureEntity(entity: SQFromEntitySource, desiredVariableName?: string): QueryFromEnsureEntityResult;
        remove(key: string): void;
        /** Converts the entity name into a short reference name.  Follows the Semantic Query convention of a short name. */
        private candidateName(ref);
        clone(): SQFrom;
    }
    class SQExprRewriterWithSourceRenames extends SQExprRewriter {
        private renames;
        constructor(renames: SQSourceRenames);
        visitEntity(expr: SQEntityExpr): SQExpr;
        rewriteFilter(filter: SQFilter): SQFilter;
        rewriteArray(exprs: SQExpr[]): SQExpr[];
        static rewrite(expr: SQExpr, from: SQFrom): SQExpr;
    }
}
declare module powerbi.data {
    /** Aids in building a SemanticQuery from a QueryDefinition. */
    class SemanticQueryBuilder {
        private from;
        private whereItems;
        private orderByItems;
        private selectItems;
        constructor(from: SQFrom);
        addWhere(filter: SQFilter): void;
        addOrderBy(sort: SQSortDefinition): void;
        addSelect(select: NamedSQExpr): void;
        toQuery(): SemanticQuery;
        toFilter(): SemanticFilter;
    }
}
declare module powerbi.data {
    import ITimerPromiseFactory = jsCommon.ITimerPromiseFactory;
    interface IExecutableDataProxy {
        /** Enqueues a query for execution.  Callers may cancel this execution by rejecting the returned promise. */
        execute(options: DataProxyQueryExecutionOptions): QueryExecutionPromise;
    }
    /** Responsible for running, batching, and query cancellation. */
    interface IDataProxy extends IExecutableDataProxy {
        stopCommunication(providerType: string): void;
        resumeCommunication(providerType: string): void;
        clearCache(providerType: string): void;
        rewriteCacheEntries(providerType: string, rewriter: data.DataProviderCacheRewriter): void;
    }
    interface DataProxyQueryExecutionResult {
        dataViewSource?: contracts.DataViewSource;
        dataProviderResult?: DataProviderTransformResult;
        errorFactory?: IClientError;
    }
    interface QueryExecutionPromise extends RejectablePromise2<DataProxyQueryExecutionResult, IClientError> {
    }
    interface ISingleExecutionDataProxy extends IExecutableDataProxy {
    }
    interface DataProxyQueryExecutionOptions {
        type: string;
        query: DataProviderExecutionOptions;
    }
    /** Factory method to create an IDataProxy instance. */
    function createDataProxy(promiseFactory: IPromiseFactory, dataProviderFactory: IDataProviderFactory): IDataProxy;
    /** Factory interface for creating ISingleExecutionDataProxy. */
    interface ISingleExecutionDataProxyFactory {
        create(): ISingleExecutionDataProxy;
    }
    /** Factory method to create an ISingleExecutableDataProxy. */
    function createSingleExecutableDataProxy(dataProxy: IDataProxy, promiseFactory: IPromiseFactory, timerFactory: ITimerPromiseFactory): ISingleExecutionDataProxy;
}
declare module powerbi {
    interface Culture {
        name: string;
        calendar: Calendar;
        calendars: CalendarDictionary;
        numberFormat: NumberFormatInfo;
    }
    interface Calendar {
        patterns: any;
        firstDay: number;
    }
    interface CalendarDictionary {
        [key: string]: Calendar;
    }
    interface NumberFormatInfo {
        decimals: number;
        groupSizes: number[];
        negativeInfinity: string;
        positiveInfinity: string;
    }
    module NumberFormat {
        interface NumericFormatMetadata {
            format: string;
            hasEscapes: boolean;
            hasQuotes: boolean;
            hasE: boolean;
            hasCommas: boolean;
            hasDots: boolean;
            hasPercent: boolean;
            hasPermile: boolean;
            precision: number;
            scale: number;
        }
        function canFormat(value: any): boolean;
        function isStandardFormat(format: string): boolean;
        function format(value: number, format: string, culture: Culture): string;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        function formatWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string, culture: Culture): string;
        function getCustomFormatMetadata(format: string): NumericFormatMetadata;
    }
    var formattingService: IFormattingService;
}
declare module powerbi.data.services {
    module wireContracts {
        interface DataViewObjectDefinitions {
            [objectName: string]: DataViewObjectDefinition[];
        }
        interface DataViewObjectDefinition {
            selector?: Selector;
            properties: DataViewObjectPropertyDefinitions;
        }
        interface Selector {
            data?: DataRepetitionSelector[];
            metadata?: string;
            id?: string;
        }
        interface DataRepetitionSelector {
            scopeId?: data.QueryExpressionContainer;
            wildcard?: data.QueryExpressionContainer[];
        }
        interface DataViewObjectPropertyDefinitions {
            [name: string]: DataViewObjectPropertyDefinition | {}[];
        }
        interface Expr {
            expr: data.QueryExpressionContainer;
        }
        interface DataViewObjectPropertyDefinition {
            expr?: data.QueryExpressionContainer;
            fill?: FillDefinition;
            fillRule?: FillRuleDefinition;
            filter?: FilterDefinition;
        }
        type FillDefinition = FillGeneric<Expr>;
        type FillRuleDefinition = FillRuleGeneric<Expr, Expr>;
    }
    module DataViewObjectSerializer {
        function deserializeObjects(input: wireContracts.DataViewObjectDefinitions, descriptors: DataViewObjectDescriptors): DataViewObjectDefinitions;
        function serializeObjects(contract: DataViewObjectDefinitions, descriptors: DataViewObjectDescriptors): wireContracts.DataViewObjectDefinitions;
    }
}
declare module powerbi.data.services {
    module SemanticQuerySerializer {
        /** Returns the QueryDefinition that this SemanticQuery represents, including optional additional filter. */
        function serializeQuery(query: SemanticQuery): QueryDefinition;
        function deserializeQuery(contract: QueryDefinition): SemanticQuery;
        function serializeFilter(filter: SemanticFilter): FilterDefinition;
        function deserializeFilter(contract: FilterDefinition): SemanticFilter;
        function serializeExpr(contract: SQExpr): QueryExpressionContainer;
        function deserializeExpr(input: QueryExpressionContainer): SQExpr;
        enum VisualFilterKind {
            /** Indicates a column filter (e.g., Continent == Europe). (A.k.a. attribute filter, slicer) */
            Column = 0,
            /** Indicates a measure filter (e.g., Sum(Sales) > 10,000). */
            Measure = 1,
            /** Indicates an exists filter. */
            Exists = 2,
        }
        /** Visitor detecting the filter kind based on the filter condition. */
        class FilterKindDetector extends DefaultSQExprVisitorWithTraversal {
            private filterKind;
            constructor();
            static run(expr: SQExpr): VisualFilterKind;
            visitMeasureRef(expr: SQMeasureRefExpr): void;
            visitExists(expr: SQExistsExpr): void;
            visitAggr(expr: SQAggregationExpr): void;
        }
    }
}
declare module powerbi.data {
    /** Serializes SQExpr in a form optimized in-memory comparison, but not intended for storage on disk. */
    module SQExprShortSerializer {
        function serialize(expr: SQExpr): string;
        function serializeArray(exprs: SQExpr[]): string;
    }
}
declare module powerbi {
    module yAxisPosition {
        var left: string;
        var right: string;
        function members(): IEnumMember[];
    }
}
