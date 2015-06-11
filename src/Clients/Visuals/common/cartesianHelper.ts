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

module powerbi.visuals {   

    export module CartesianHelper {        
        export function getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject {
            var toReturn: DataViewObject = {};
            if (!dataViewMetadata)
                return toReturn;

            var objects = dataViewMetadata.objects;

            if (objects) {
                var categoryAxisObject = objects['categoryAxis'];

                if (categoryAxisObject) {
                    toReturn = {
                        show: categoryAxisObject['show'],
                        axisType: categoryAxisObject['axisType'],
                        start: categoryAxisObject['start'],
                        end: categoryAxisObject['end'],
                        showAxisTitle: categoryAxisObject['showAxisTitle'] == null ? axisTitleOnByDefault : categoryAxisObject['showAxisTitle'],
                        axisStyle: categoryAxisObject['axisStyle']
                    };
                }
            }
            return toReturn;
        }

        export function getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject {
            var toReturn: DataViewObject = {};
            if (!dataViewMetadata)
                return toReturn;

            var objects = dataViewMetadata.objects;

            if (objects) {
                var valueAxisObject = objects['valueAxis'];
                if (valueAxisObject) {
                    toReturn = {
                        show: valueAxisObject['show'],
                        position: valueAxisObject['position'],                        
                        start: valueAxisObject['start'],
                        end: valueAxisObject['end'],                        
                        showAxisTitle: valueAxisObject['showAxisTitle'] == null ? axisTitleOnByDefault : valueAxisObject['showAxisTitle'],
                        axisStyle: valueAxisObject['axisStyle'],
                        secShow: valueAxisObject['secShow'],
                        secPosition: valueAxisObject['secPosition'],
                        secStart: valueAxisObject['secStart'],
                        secEnd: valueAxisObject['secEnd'],
                        secShowAxisTitle: valueAxisObject['secShowAxisTitle'],
                        secAxisStyle: valueAxisObject['secAxisStyle']                        
                    };
                }
            }
            return toReturn;
        }

        export function forceValueDomainToZero(valueAxisProperties: DataViewObject) {            
            if (valueAxisProperties['start'] == null) {
                valueAxisProperties['start'] = 0;
            }
            if (valueAxisProperties['secStart'] == null) {
                valueAxisProperties['secStart'] = 0;
            }
        }
       
        export function isScalar(isScalar: boolean, xAxisCardProperties: DataViewObject): boolean {
            if (isScalar) {
                //now check what the user wants
                isScalar = xAxisCardProperties && xAxisCardProperties['axisType'] ? xAxisCardProperties['axisType'] === axisType.scalar : true;
            }
            return isScalar;
        }
    }
}