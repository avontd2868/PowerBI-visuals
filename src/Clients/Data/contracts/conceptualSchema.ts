//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    export class ConceptualSchema {
        public entities: jsCommon.ArrayNamedItems<ConceptualEntity>;

        /** Indicates whether the user can edit this ConceptualSchema.  This is used to enable/disable model authoring UX. */
        public canEdit: boolean;

        public findProperty(entityName: string, propertyName: string): ConceptualProperty {
            var entity = this.entities.withName(entityName);
            if (entity)
                return entity.properties.withName(propertyName);
        }
    }

    export interface ConceptualEntity {
        name: string;
        hidden?: boolean;
        properties: jsCommon.ArrayNamedItems<ConceptualProperty>;
    }

    export interface ConceptualProperty {
        name: string;
        type: ValueType;
        kind: ConceptualPropertyKind;
        hidden?: boolean;
        format?: string;
        column?: ConceptualColumn;
        queryable?: ConceptualQueryableState;
    }

    export interface ConceptualColumn {
        defaultAggregate?: ConceptualDefaultAggregate;
        keys?: jsCommon.ArrayNamedItems<ConceptualProperty>;
        idOnEntityKey?: boolean;
        calculated?: boolean;
    }

    export enum ConceptualQueryableState {
        Queryable = 0,
        Error = 1,
    }

    export enum ConceptualPropertyKind {
        Column,
        Measure,
        Kpi,
    }

    export enum ConceptualDefaultAggregate {
        Default,
        None,
        Sum,
        Count,
        Min,
        Max,
        Average,
        DistinctCount,
    }

    // TODO: Remove this (replaced by ValueType)
    export enum ConceptualDataCategory {
        None,
        Address,
        City,
        Company,
        Continent,
        Country,
        County,
        Date,
        Image,
        ImageUrl,
        Latitude,
        Longitude,
        Organization,
        Place,
        PostalCode,
        Product,
        StateOrProvince,
        WebUrl,
    }
}