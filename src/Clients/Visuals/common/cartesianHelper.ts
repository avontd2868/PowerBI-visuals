//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
       
        export function isScalar(isScalar: boolean, xAxisCardProperties: DataViewObject): boolean {
            if (isScalar) {
                //now check what the user wants
                isScalar = xAxisCardProperties && xAxisCardProperties['axisType'] ? xAxisCardProperties['axisType'] === axisType.scalar : true;
            }
            return isScalar;
        }
    }
}