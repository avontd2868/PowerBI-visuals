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
    /** Defines the values for particular objects. */
    export interface DataViewObjectDefinitions {
        [objectName: string]: DataViewObjectDefinition[];
    }

    export interface DataViewObjectDefinition {
        selector?: Selector;
        properties: DataViewObjectPropertyDefinitions;
    }

    export interface DataViewObjectPropertyDefinitions {
        [name: string]: DataViewObjectPropertyDefinition;
    }

    export type DataViewObjectPropertyDefinition = SQExpr | StructuralObjectDefinition;

    export module DataViewObjectDefinitions {

        /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
        export function ensure(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector): DataViewObjectDefinition {
            debug.assertValue(defns, 'defns');

            var defnsForObject = defns[objectName];
            if (!defnsForObject)
                defns[objectName] = defnsForObject = [];

            for (var i = 0, len = defnsForObject.length; i < len; i++) {
                var defn = defnsForObject[i];
                if (Selector.equals(defn.selector, selector))
                    return defn;
            }

            var newDefn: DataViewObjectDefinition = {
                selector: selector,
                properties: {},
            };
            defnsForObject.push(newDefn);

            return newDefn;
        }

        export function deleteProperty(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector,
            propertyName: string): void {
            debug.assertValue(defns, 'defns');

            var defnsForObject = defns[objectName];
            if (!defnsForObject)
                return;
            
            for (var i = 0, len = defnsForObject.length; i < len; i++) {   
                var defn = defnsForObject[i];             
                if (Selector.equals(defn.selector, selector)) {   
                    //note: We decided that delete is acceptable here and that we don't need optimization here                
                    delete defn.properties[propertyName];
                    return;
                }
            }                   
        }

        export function getValue(
            defns: DataViewObjectDefinitions,
            propertyId: DataViewObjectPropertyIdentifier,
            selector: Selector): DataViewObjectPropertyDefinition {

            var defnsForObject = defns[propertyId.objectName];
            if (!defnsForObject)
                return;

            for (var i = 0, len = defnsForObject.length; i < len; i++) {
                var defn = defnsForObject[i];
                if (Selector.equals(defn.selector, selector))
                    return defn.properties[propertyId.propertyName];
            }
        }
    }
}