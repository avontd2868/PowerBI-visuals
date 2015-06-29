//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    /** Represents evaluated, named, custom objects in a DataView. */
    export interface DataViewObjects {
        [name: string]: DataViewObject | DataViewObjectMap
    }

    /** Represents an object (name-value pairs) in a DataView. */
    export interface DataViewObject {
        [propertyName: string]: DataViewPropertyValue;
    }

    export type DataViewPropertyValue = PrimitiveValue | StructuralObjectValue;

    export interface DataViewObjectMap {
        [id: string]: DataViewObject;
    }

    export interface DataViewObjectPropertyIdentifier {
        objectName: string;
        propertyName: string;
    }

    export module DataViewObjects {
        /** Gets the value of the given object/property pair. */
        export function getValue<T>(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultValue?: T): T {
            debug.assertAnyValue(objects, 'objects');
            debug.assertValue(propertyId, 'propertyId');

            if (!objects)
                return defaultValue;

            var object = objects[propertyId.objectName];            
            if (!object || object[propertyId.propertyName] === undefined) {
                return defaultValue;
            }

            return <T>object[propertyId.propertyName];
        }

        /** Gets the solid color from a fill property. */
        export function getFillColor(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultColor?: string): string {
            var value: Fill = getValue(objects, propertyId);
            if (!value || !value.solid)
                return defaultColor;

            return value.solid.color;
        }
    }
}