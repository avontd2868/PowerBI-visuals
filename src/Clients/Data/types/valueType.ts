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
    import EnumExtensions = jsCommon.EnumExtensions;

    /* tslint:disable:no-unused-expression */
    /** Describes instances of value type objects. */
    export type PrimitiveValue = string | number | boolean | Date;
    /* tslint: enable */

    /** Describes a data value type in the client type system. Can be used to get a concrete ValueType instance. */
    export interface ValueTypeDescriptor {
        // Simplified primitive types
        text?: boolean;
        numeric?: boolean;
        integer?: boolean;
        bool?: boolean;
        dateTime?: boolean;
        duration?: boolean;
        binary?: boolean;
        none?: boolean; //TODO: 5005022 remove none type when we introduce property categories.

        // Extended types
        temporal?: TemporalTypeDescriptor;
        geography?: GeographyTypeDescriptor;
        misc?: MiscellaneousTypeDescriptor;
        formatting?: FormattingTypeDescriptor;
        extendedType?: ExtendedType;
    }

    export interface TemporalTypeDescriptor {
        year?: boolean;
        month?: boolean;
    }

    export interface GeographyTypeDescriptor {
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

    export interface MiscellaneousTypeDescriptor {
        image?: boolean;
        imageUrl?: boolean;
        webUrl?: boolean;
    }

    export interface FormattingTypeDescriptor {
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
    export class ValueType implements ValueTypeDescriptor {
        private static typeCache: { [id: string]: ValueType } = {};

        private underlyingType: ExtendedType;
        private category: string;

        private temporalType: TemporalType;
        private geographyType: GeographyType;
        private miscType: MiscellaneousType;
        private formattingType: FormattingType;

        /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
        constructor(type: ExtendedType, category?: string) {
            debug.assert((!!type && ExtendedType[type] != null) || type === ExtendedType.Null, 'type');
            debug.assert(!!category || category === null, 'category');

            this.underlyingType = type;
            this.category = category;

            if (EnumExtensions.hasFlag(type, ExtendedType.Temporal)) {
                this.temporalType = new TemporalType(type);
            }
            if (EnumExtensions.hasFlag(type, ExtendedType.Geography)) {
                this.geographyType = new GeographyType(type);
            }
            if (EnumExtensions.hasFlag(type, ExtendedType.Miscellaneous)) {
                this.miscType = new MiscellaneousType(type);
            }
            if (EnumExtensions.hasFlag(type, ExtendedType.Formatting)) {
                this.formattingType = new FormattingType(type);
            }
        }

        /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
        public static fromDescriptor(descriptor: ValueTypeDescriptor): ValueType {
            descriptor = descriptor || {};

            // Simplified primitive types
            if (descriptor.text) return ValueType.fromExtendedType(ExtendedType.Text);
            if (descriptor.integer) return ValueType.fromExtendedType(ExtendedType.Integer);
            if (descriptor.numeric) return ValueType.fromExtendedType(ExtendedType.Double);
            if (descriptor.bool) return ValueType.fromExtendedType(ExtendedType.Boolean);
            if (descriptor.dateTime) return ValueType.fromExtendedType(ExtendedType.DateTime);
            if (descriptor.duration) return ValueType.fromExtendedType(ExtendedType.Duration);
            if (descriptor.binary) return ValueType.fromExtendedType(ExtendedType.Binary);
            if (descriptor.none) return ValueType.fromExtendedType(ExtendedType.None);

            // Extended types
            if (descriptor.temporal) {
                if (descriptor.temporal.year) return ValueType.fromExtendedType(ExtendedType.Year_Integer);
                if (descriptor.temporal.month) return ValueType.fromExtendedType(ExtendedType.Month_Integer);
            }
            if (descriptor.geography) {
                if (descriptor.geography.address) return ValueType.fromExtendedType(ExtendedType.Address);
                if (descriptor.geography.city) return ValueType.fromExtendedType(ExtendedType.City);
                if (descriptor.geography.continent) return ValueType.fromExtendedType(ExtendedType.Continent);
                if (descriptor.geography.country) return ValueType.fromExtendedType(ExtendedType.Country);
                if (descriptor.geography.county) return ValueType.fromExtendedType(ExtendedType.County);
                if (descriptor.geography.region) return ValueType.fromExtendedType(ExtendedType.Region);
                if (descriptor.geography.postalCode) return ValueType.fromExtendedType(ExtendedType.PostalCode_Text);
                if (descriptor.geography.stateOrProvince) return ValueType.fromExtendedType(ExtendedType.StateOrProvince);
                if (descriptor.geography.place) return ValueType.fromExtendedType(ExtendedType.Place);
                if (descriptor.geography.latitude) return ValueType.fromExtendedType(ExtendedType.Latitude_Double);
                if (descriptor.geography.longitude) return ValueType.fromExtendedType(ExtendedType.Longitude_Double);
            }
            if (descriptor.misc) {
                if (descriptor.misc.image) return ValueType.fromExtendedType(ExtendedType.Image);
                if (descriptor.misc.imageUrl) return ValueType.fromExtendedType(ExtendedType.ImageUrl);
                if (descriptor.misc.webUrl) return ValueType.fromExtendedType(ExtendedType.WebUrl);
            }
            if (descriptor.formatting) {
                if (descriptor.formatting.color) return ValueType.fromExtendedType(ExtendedType.Color);
                if (descriptor.formatting.formatString) return ValueType.fromExtendedType(ExtendedType.FormatString);
                if (descriptor.formatting.legendPosition) return ValueType.fromExtendedType(ExtendedType.LegendPosition);
                if (descriptor.formatting.axisType) return ValueType.fromExtendedType(ExtendedType.AxisType);
                if (descriptor.formatting.yAxisPosition) return ValueType.fromExtendedType(ExtendedType.YAxisPosition);
                if (descriptor.formatting.axisStyle) return ValueType.fromExtendedType(ExtendedType.AxisStyle);
                if (descriptor.formatting.alignment) return ValueType.fromExtendedType(ExtendedType.Alignment);
                if (descriptor.formatting.labelDisplayUnits) return ValueType.fromExtendedType(ExtendedType.LabelDisplayUnits);
                if (descriptor.formatting.labelPosition) return ValueType.fromExtendedType(ExtendedType.LabelPosition);
            }
            if (descriptor.extendedType) {
                return ValueType.fromExtendedType(descriptor.extendedType);
            }

            return ValueType.fromExtendedType(ExtendedType.Null);
        }

        /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
        public static fromExtendedType(extendedType: ExtendedType): ValueType {
            extendedType = extendedType || ExtendedType.Null;

            var primitiveType = getPrimitiveType(extendedType),
                category = getCategoryFromExtendedType(extendedType);
            debug.assert(
                primitiveType !== PrimitiveType.Null || extendedType === ExtendedType.Null,
                'Cannot create ValueType for abstract extended type. Consider using fromDescriptor instead.');
            return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
        }

        /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
        public static fromPrimitiveTypeAndCategory(primitiveType: PrimitiveType, category?: string): ValueType {
            primitiveType = primitiveType || PrimitiveType.Null;
            category = category || null;

            var id = primitiveType.toString();
            if (category)
                id += '|' + category;

            return ValueType.typeCache[id] || (ValueType.typeCache[id] = new ValueType(toExtendedType(primitiveType, category), category));
        }

        /** Gets the exact primitive type of this ValueType. */
        public get primitiveType(): PrimitiveType {
            return getPrimitiveType(this.underlyingType);
        }

        /** Gets the exact extended type of this ValueType. */
        public get extendedType(): ExtendedType {
            return this.underlyingType;
        }

        /** Gets the data category string (if any) for this ValueType. */
        public get categoryString(): string {
            return this.category;
        }

        // Simplified primitive types

        /** Indicates whether the type represents text values. */
        public get text(): boolean {
            return this.primitiveType === PrimitiveType.Text;
        }
        /** Indicates whether the type represents any numeric value. */
        public get numeric(): boolean {
            return EnumExtensions.hasFlag(this.underlyingType, ExtendedType.Numeric);
        }
        /** Indicates whether the type represents integer numeric values. */
        public get integer(): boolean {
            return this.primitiveType === PrimitiveType.Integer;
        }
        /** Indicates whether the type represents Boolean values. */
        public get bool(): boolean {
            return this.primitiveType === PrimitiveType.Boolean;
        }
        /** Indicates whether the type represents any date/time values. */
        public get dateTime(): boolean {
            return this.primitiveType === PrimitiveType.DateTime ||
                this.primitiveType === PrimitiveType.Date ||
                this.primitiveType === PrimitiveType.Time;
        }
        /** Indicates whether the type represents duration values. */
        public get duration(): boolean {
            return this.primitiveType === PrimitiveType.Duration;
        }
        /** Indicates whether the type represents binary values. */
        public get binary(): boolean {
            return this.primitiveType === PrimitiveType.Binary;
        }

        /** Indicates whether the type represents none values. */
        public get none(): boolean {
            return this.primitiveType === PrimitiveType.None;
        }
        // Extended types

        /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
        public get temporal(): TemporalType {
            return this.temporalType;
        }
        /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
        public get geography(): GeographyType {
            return this.geographyType;
        }
        /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
        public get misc(): MiscellaneousType {
            return this.miscType;
        }
        /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
        public get formatting(): FormattingType {
            return this.formattingType;
        }
    }

    export class TemporalType implements TemporalTypeDescriptor {
        private underlyingType: ExtendedType;

        constructor(type: ExtendedType) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Temporal), 'type');
            this.underlyingType = type;
        }

        public get year(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Year);
        }
        public get month(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Month);
        }
    }

    export class GeographyType implements GeographyTypeDescriptor {
        private underlyingType: ExtendedType;

        constructor(type: ExtendedType) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Geography), 'type');
            this.underlyingType = type;
        }

        public get address(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Address);
        }
        public get city(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.City);
        }
        public get continent(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Continent);
        }
        public get country(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Country);
        }
        public get county(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.County);
        }
        public get region(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Region);
        }
        public get postalCode(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PostalCode);
        }
        public get stateOrProvince(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.StateOrProvince);
        }
        public get place(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Place);
        }
        public get latitude(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Latitude);
        }
        public get longitude(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Longitude);
        }
    }

    export class MiscellaneousType implements MiscellaneousTypeDescriptor {
        private underlyingType: ExtendedType;

        constructor(type: ExtendedType) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Miscellaneous), 'type');
            this.underlyingType = type;
        }

        public get image(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Image);
        }
        public get imageUrl(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ImageUrl);
        }
        public get webUrl(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.WebUrl);
        }
    }

    export class FormattingType implements FormattingTypeDescriptor {
        private underlyingType: ExtendedType;

        constructor(type: ExtendedType) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Formatting), 'type');
            this.underlyingType = type;
        }

        public get color(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Color);
        }

        public get formatString(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FormatString);
        }

        public get legendPosition(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LegendPosition);
        }

        public get axisType(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.AxisType);
        }

        public get yAxisPosition(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.YAxisPosition);
        }

        public get axisStyle(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.AxisStyle);
        }

        public get alignment(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Alignment);
        }

        public get labelDisplayUnits(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDisplayUnits);
        }

        public get labelPosition(): boolean {
            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelPosition);
        }
    }

    /** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
    export enum PrimitiveType {
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
    export enum ExtendedType {
        // Flags (1 << 8-15 range [0xFF00])
        // Important: Enum members must be declared before they are used in TypeScript.
        Numeric = 1 << 8,
        Temporal = 1 << 9,
        Geography = 1 << 10,
        Miscellaneous = 1 << 11,
        Formatting = 1 << 12,

        // Primitive types (0-255 range [0xFF] | flags)
        // The member names and base values must match those in PrimitiveType.
        Null = 0,
        Text = 1,
        Decimal = Numeric | 2,
        Double = Numeric | 3,
        Integer = Numeric | 4,
        Boolean = 5,
        Date = Temporal | 6,
        DateTime = Temporal | 7,
        DateTimeZone = Temporal | 8,
        Time = Temporal | 9,
        Duration = 10,
        Binary = 11,
        None = 12,

        // Extended types (0-32767 << 16 range [0xFFFF0000] | corresponding primitive type | flags)
        // Temporal
        Year = Temporal | (1 << 16),
        Year_Text = Year | Text,
        Year_Integer = Year | Integer,
        Year_Date = Year | Date,
        Year_DateTime = Year | DateTime,
        Month = Temporal | (2 << 16),
        Month_Text = Month | Text,
        Month_Integer = Month | Integer,
        Month_Date = Month | Date,
        Month_DateTime = Month | DateTime,
        // Geography
        Address = Text | Geography | (100 << 16),
        City = Text | Geography | (101 << 16),
        Continent = Text | Geography | (102 << 16),
        Country = Text | Geography | (103 << 16),
        County = Text | Geography | (104 << 16),
        Region = Text | Geography | (105 << 16),
        PostalCode = Geography | (106 << 16),
        PostalCode_Text = PostalCode | Text,
        PostalCode_Integer = PostalCode | Integer,
        StateOrProvince = Text | Geography | (107 << 16),
        Place = Text | Geography | (108 << 16),
        Latitude = Geography | (109 << 16),
        Latitude_Decimal = Latitude | Decimal,
        Latitude_Double = Latitude | Double,
        Longitude = Geography | (110 << 16),
        Longitude_Decimal = Longitude | Decimal,
        Longitude_Double = Longitude | Double,
        // Miscellaneous
        Image = Binary | Miscellaneous | (200 << 16),
        ImageUrl = Text | Miscellaneous | (201 << 16),
        WebUrl = Text | Miscellaneous | (202 << 16),
        // Formatting
        Color = Text | Formatting | (300 << 16),
        FormatString = Text | Formatting | (301 << 16),
        LegendPosition = Text | Formatting | (302 << 16),
        AxisType = Text | Formatting | (303 << 16),
        YAxisPosition = Text | Formatting | (304 << 16),
        AxisStyle = Text | Formatting | (305 << 16),
        Alignment = Text | Formatting | (306 << 16),
        LabelDisplayUnits = Text | Formatting | (307 << 16),
        LabelPosition = Text | Formatting | (308 << 16),

        // NOTE: To avoid confusion, underscores should be used only to delimit primitive type variants of an extended type
        // (e.g. Year_Integer or Latitude_Double above)
    }

    var PrimitiveTypeMask = 0xFF; // const
    var PrimitiveTypeWithFlagsMask = 0xFFFF; // const
    var PrimitiveTypeFlagsExcludedMask = 0xFFFF0000; // const

    function getPrimitiveType(extendedType: ExtendedType): PrimitiveType {
        return extendedType & PrimitiveTypeMask;
    }

    function isPrimitiveType(extendedType: ExtendedType): boolean {
        return (extendedType & PrimitiveTypeWithFlagsMask) === extendedType;
    }

    function getCategoryFromExtendedType(extendedType: ExtendedType): string {
        if (isPrimitiveType(extendedType))
            return null;

        var category = ExtendedType[extendedType];
        if (category) {
            // Check for ExtendedType declaration without a primitive type.
            // If exists, use it as category (e.g. Longitude rather than Longitude_Double)
            // Otherwise use the ExtendedType declaration with a primitive type (e.g. Address)
            var delimIdx = category.lastIndexOf('_');
            if (delimIdx > 0) {
                var baseCategory = category.slice(0, delimIdx);
                if (ExtendedType[baseCategory]) {
                    debug.assert(
                        (ExtendedType[baseCategory] & PrimitiveTypeFlagsExcludedMask) === (extendedType & PrimitiveTypeFlagsExcludedMask),
                        'Unexpected value for ExtendedType base member of ' + extendedType);
                    category = baseCategory;
                }
            }
        }
        return category || null;
    }

    function toExtendedType(primitiveType: PrimitiveType, category?: string): ExtendedType {
        var primitiveString = PrimitiveType[primitiveType];
        var t = ExtendedType[primitiveString];
        if (t == null) {
            debug.assertFail('Unexpected primitiveType ' + primitiveType);
            t = ExtendedType.Null;
        }

        if (primitiveType && category) {
            var categoryType: ExtendedType = ExtendedType[category];
            if (categoryType) {
                var categoryPrimitiveType = getPrimitiveType(categoryType);
                if (categoryPrimitiveType === PrimitiveType.Null) {
                    // Category supports multiple primitive types, check if requested primitive type is supported
                    // (note: important to use t here rather than primitiveType as it may include primitive type flags)
                    categoryType = t | categoryType;
                    if (ExtendedType[categoryType]) {
                        debug.assert(
                            ExtendedType[categoryType] === (category + '_' + primitiveString),
                            'Unexpected name for ExtendedType member ' + categoryType);
                        t = categoryType;
                    }
                }
                else if (categoryPrimitiveType === primitiveType) {
                    // Primitive type matches the single supported type for the category
                    t = categoryType;
                }
            }
        }

        return t;
    }

    function matchesExtendedTypeWithAnyPrimitive(a: ExtendedType, b: ExtendedType): boolean {
        return (a & PrimitiveTypeFlagsExcludedMask) === (b & PrimitiveTypeFlagsExcludedMask);
    }
}