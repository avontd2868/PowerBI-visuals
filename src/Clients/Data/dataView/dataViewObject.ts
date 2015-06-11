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

            return DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
        }  
        /** Gets an object from objects. */
        export function getObject(objects: DataViewObjects, objectName: string, defaultValue?: DataViewObject): DataViewObject {            
            if (objects && objects[objectName]) {
                return objects[objectName];
            }
            else {
                return defaultValue;
            }
        }     
        /** Gets the solid color from a fill property. */
        export function getFillColor(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, defaultColor?: string): string {
            var value: Fill = getValue(objects, propertyId);
            if (!value || !value.solid)
                return defaultColor;

            return value.solid.color;
        }
    }

    export module DataViewObject {
        export function getValue<T>(object: DataViewObject, propertyName: string, defaultValue?: T): T {
            debug.assertAnyValue(object, 'object');
            debug.assertValue(propertyName, 'propertyName');

            if (!object)
                return defaultValue;

            var propertyValue = <T>object[propertyName];
            if (propertyValue === undefined)
                return defaultValue;

            return propertyValue;
        }
    }
}