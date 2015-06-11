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