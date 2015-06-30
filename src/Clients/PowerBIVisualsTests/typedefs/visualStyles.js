//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var common;
    (function (common) {
        var services;
        (function (services) {
            var visualStyles;
            (function (visualStyles) {
                function create(colors) {
                    // We shouldn't share data color palette's across visuals
                    var dataColors = new powerbi.visuals.DataColorPalette(colors);
                    return {
                        titleText: {
                            color: { value: 'rgba(51,51,51,1)' }
                        },
                        subTitleText: {
                            color: { value: 'rgba(145,145,145,1)' }
                        },
                        colorPalette: {
                            dataColors: dataColors,
                        },
                        labelText: {
                            color: {
                                value: 'rgba(51,51,51,1)',
                            },
                            fontSize: '11px'
                        },
                        isHighContrast: false,
                    };
                }
                visualStyles.create = create;
            })(visualStyles = services.visualStyles || (services.visualStyles = {}));
        })(services = common.services || (common.services = {}));
    })(common = powerbi.common || (powerbi.common = {}));
})(powerbi || (powerbi = {}));
