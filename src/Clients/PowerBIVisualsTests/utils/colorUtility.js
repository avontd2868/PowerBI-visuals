//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var utils;
    (function (utils) {
        var ColorUtility;
        (function (ColorUtility) {
            var HexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
            var RGBRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
            function convertFromRGBorHexToHex(value) {
                if (value.match(HexPattern)) {
                    return value;
                }
                return rgbStringToHex(value);
            }
            ColorUtility.convertFromRGBorHexToHex = convertFromRGBorHexToHex;
            ;
            function rgbStringToHex(rgb) {
                var result, r, g, b, hex = "";
                if ((result = RGBRegex.exec(rgb))) {
                    r = componentFromStr(result[1], result[2]);
                    g = componentFromStr(result[3], result[4]);
                    b = componentFromStr(result[5], result[6]);
                    hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
                }
                return hex;
            }
            ;
            function componentFromStr(numStr, percent) {
                var num = Math.max(0, parseInt(numStr, 10));
                return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
            }
            ;
        })(ColorUtility = utils.ColorUtility || (utils.ColorUtility = {}));
    })(utils = powerbitests.utils || (powerbitests.utils = {}));
})(powerbitests || (powerbitests = {}));
