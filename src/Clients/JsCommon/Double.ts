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

    /** Class Double contains a set of constants and precision based utility methods for dealing with doubles and their decimal garbage in the javascript */
    export module Double {

        // Constants
        export var MIN_VALUE = -Number.MAX_VALUE;
        export var MAX_VALUE = Number.MAX_VALUE;
        export var MIN_EXP = -308;
        export var MAX_EXP = 308;
        export var EPSILON = 1E-323;
        export var DEFAULT_PRECISION = 0.0001;
        export var DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12;
        export var LOG_E_10 = Math.log(10);
        export var POSITIVE_POWERS = [
                1E0, 1E1, 1E2, 1E3, 1E4, 1E5, 1E6, 1E7, 1E8, 1E9, 1E10, 1E11, 1E12, 1E13, 1E14, 1E15, 1E16, 1E17, 1E18, 1E19, 1E20, 1E21, 1E22, 1E23, 1E24, 1E25, 1E26, 1E27, 1E28, 1E29, 1E30, 1E31, 1E32, 1E33, 1E34, 1E35, 1E36, 1E37, 1E38, 1E39, 1E40, 1E41, 1E42, 1E43, 1E44, 1E45, 1E46, 1E47, 1E48, 1E49, 1E50, 1E51, 1E52, 1E53, 1E54, 1E55, 1E56, 1E57, 1E58, 1E59, 1E60, 1E61, 1E62, 1E63, 1E64, 1E65, 1E66, 1E67, 1E68, 1E69, 1E70, 1E71, 1E72, 1E73, 1E74, 1E75, 1E76, 1E77, 1E78, 1E79, 1E80, 1E81, 1E82, 1E83, 1E84, 1E85, 1E86, 1E87, 1E88, 1E89, 1E90, 1E91, 1E92, 1E93, 1E94, 1E95, 1E96, 1E97, 1E98, 1E99,
                1E100, 1E101, 1E102, 1E103, 1E104, 1E105, 1E106, 1E107, 1E108, 1E109, 1E110, 1E111, 1E112, 1E113, 1E114, 1E115, 1E116, 1E117, 1E118, 1E119, 1E120, 1E121, 1E122, 1E123, 1E124, 1E125, 1E126, 1E127, 1E128, 1E129, 1E130, 1E131, 1E132, 1E133, 1E134, 1E135, 1E136, 1E137, 1E138, 1E139, 1E140, 1E141, 1E142, 1E143, 1E144, 1E145, 1E146, 1E147, 1E148, 1E149, 1E150, 1E151, 1E152, 1E153, 1E154, 1E155, 1E156, 1E157, 1E158, 1E159, 1E160, 1E161, 1E162, 1E163, 1E164, 1E165, 1E166, 1E167, 1E168, 1E169, 1E170, 1E171, 1E172, 1E173, 1E174, 1E175, 1E176, 1E177, 1E178, 1E179, 1E180, 1E181, 1E182, 1E183, 1E184, 1E185, 1E186, 1E187, 1E188, 1E189, 1E190, 1E191, 1E192, 1E193, 1E194, 1E195, 1E196, 1E197, 1E198, 1E199,
                1E200, 1E201, 1E202, 1E203, 1E204, 1E205, 1E206, 1E207, 1E208, 1E209, 1E210, 1E211, 1E212, 1E213, 1E214, 1E215, 1E216, 1E217, 1E218, 1E219, 1E220, 1E221, 1E222, 1E223, 1E224, 1E225, 1E226, 1E227, 1E228, 1E229, 1E230, 1E231, 1E232, 1E233, 1E234, 1E235, 1E236, 1E237, 1E238, 1E239, 1E240, 1E241, 1E242, 1E243, 1E244, 1E245, 1E246, 1E247, 1E248, 1E249, 1E250, 1E251, 1E252, 1E253, 1E254, 1E255, 1E256, 1E257, 1E258, 1E259, 1E260, 1E261, 1E262, 1E263, 1E264, 1E265, 1E266, 1E267, 1E268, 1E269, 1E270, 1E271, 1E272, 1E273, 1E274, 1E275, 1E276, 1E277, 1E278, 1E279, 1E280, 1E281, 1E282, 1E283, 1E284, 1E285, 1E286, 1E287, 1E288, 1E289, 1E290, 1E291, 1E292, 1E293, 1E294, 1E295, 1E296, 1E297, 1E298, 1E299,
                1E300, 1E301, 1E302, 1E303, 1E304, 1E305, 1E306, 1E307, 1E308];
        export var NEGATIVE_POWERS = [
                1E0, 1E-1, 1E-2, 1E-3, 1E-4, 1E-5, 1E-6, 1E-7, 1E-8, 1E-9, 1E-10, 1E-11, 1E-12, 1E-13, 1E-14, 1E-15, 1E-16, 1E-17, 1E-18, 1E-19, 1E-20, 1E-21, 1E-22, 1E-23, 1E-24, 1E-25, 1E-26, 1E-27, 1E-28, 1E-29, 1E-30, 1E-31, 1E-32, 1E-33, 1E-34, 1E-35, 1E-36, 1E-37, 1E-38, 1E-39, 1E-40, 1E-41, 1E-42, 1E-43, 1E-44, 1E-45, 1E-46, 1E-47, 1E-48, 1E-49, 1E-50, 1E-51, 1E-52, 1E-53, 1E-54, 1E-55, 1E-56, 1E-57, 1E-58, 1E-59, 1E-60, 1E-61, 1E-62, 1E-63, 1E-64, 1E-65, 1E-66, 1E-67, 1E-68, 1E-69, 1E-70, 1E-71, 1E-72, 1E-73, 1E-74, 1E-75, 1E-76, 1E-77, 1E-78, 1E-79, 1E-80, 1E-81, 1E-82, 1E-83, 1E-84, 1E-85, 1E-86, 1E-87, 1E-88, 1E-89, 1E-90, 1E-91, 1E-92, 1E-93, 1E-94, 1E-95, 1E-96, 1E-97, 1E-98, 1E-99,
                1E-100, 1E-101, 1E-102, 1E-103, 1E-104, 1E-105, 1E-106, 1E-107, 1E-108, 1E-109, 1E-110, 1E-111, 1E-112, 1E-113, 1E-114, 1E-115, 1E-116, 1E-117, 1E-118, 1E-119, 1E-120, 1E-121, 1E-122, 1E-123, 1E-124, 1E-125, 1E-126, 1E-127, 1E-128, 1E-129, 1E-130, 1E-131, 1E-132, 1E-133, 1E-134, 1E-135, 1E-136, 1E-137, 1E-138, 1E-139, 1E-140, 1E-141, 1E-142, 1E-143, 1E-144, 1E-145, 1E-146, 1E-147, 1E-148, 1E-149, 1E-150, 1E-151, 1E-152, 1E-153, 1E-154, 1E-155, 1E-156, 1E-157, 1E-158, 1E-159, 1E-160, 1E-161, 1E-162, 1E-163, 1E-164, 1E-165, 1E-166, 1E-167, 1E-168, 1E-169, 1E-170, 1E-171, 1E-172, 1E-173, 1E-174, 1E-175, 1E-176, 1E-177, 1E-178, 1E-179, 1E-180, 1E-181, 1E-182, 1E-183, 1E-184, 1E-185, 1E-186, 1E-187, 1E-188, 1E-189, 1E-190, 1E-191, 1E-192, 1E-193, 1E-194, 1E-195, 1E-196, 1E-197, 1E-198, 1E-199,
                1E-200, 1E-201, 1E-202, 1E-203, 1E-204, 1E-205, 1E-206, 1E-207, 1E-208, 1E-209, 1E-210, 1E-211, 1E-212, 1E-213, 1E-214, 1E-215, 1E-216, 1E-217, 1E-218, 1E-219, 1E-220, 1E-221, 1E-222, 1E-223, 1E-224, 1E-225, 1E-226, 1E-227, 1E-228, 1E-229, 1E-230, 1E-231, 1E-232, 1E-233, 1E-234, 1E-235, 1E-236, 1E-237, 1E-238, 1E-239, 1E-240, 1E-241, 1E-242, 1E-243, 1E-244, 1E-245, 1E-246, 1E-247, 1E-248, 1E-249, 1E-250, 1E-251, 1E-252, 1E-253, 1E-254, 1E-255, 1E-256, 1E-257, 1E-258, 1E-259, 1E-260, 1E-261, 1E-262, 1E-263, 1E-264, 1E-265, 1E-266, 1E-267, 1E-268, 1E-269, 1E-270, 1E-271, 1E-272, 1E-273, 1E-274, 1E-275, 1E-276, 1E-277, 1E-278, 1E-279, 1E-280, 1E-281, 1E-282, 1E-283, 1E-284, 1E-285, 1E-286, 1E-287, 1E-288, 1E-289, 1E-290, 1E-291, 1E-292, 1E-293, 1E-294, 1E-295, 1E-296, 1E-297, 1E-298, 1E-299,
                1E-300, 1E-301, 1E-302, 1E-303, 1E-304, 1E-305, 1E-306, 1E-307, 1E-308, 1E-309, 1E-310, 1E-311, 1E-312, 1E-313, 1E-314, 1E-315, 1E-316, 1E-317, 1E-318, 1E-319, 1E-320, 1E-321, 1E-322, 1E-323, 1E-324];

        // Methods

        /** Returns powers of 10. Unlike the Math.pow this function produces no decimal garbage.
          * @param exp - exponent
          */
        export function pow10(exp: number): number {
            debug.assertValue(exp, "exp");

            // Positive & zero
            if (exp >= 0) {
                if (exp < Double.POSITIVE_POWERS.length) {
                    return Double.POSITIVE_POWERS[exp];
                } else {
                    return Infinity;
                }
            }
            // Negative
            exp = -exp;
            if (exp > 0 && exp < Double.NEGATIVE_POWERS.length) { // if exp==int.MIN_VALUE then changing the sign will overflow and keep the number negative - we need to check for exp > 0 to filter out this corner case
                return Double.NEGATIVE_POWERS[exp];
            } else {
                return 0;
            }
        }

        /** Returns the 10 base logarithm of the number. Unlike Math.log function this produces integer results with no decimal garbage.
          * @param value - positive value or zero
          */
        export function log10(val: number): number {
            debug.assert(val >= 0, "val");

            // Fast Log10() algorithm 
            if (val > 1 && val < 1E16) {
                if (val < 1E8) {
                    if (val < 1E4) {
                        if (val < 1E2) {
                            if (val < 1E1) {
                                return 0;
                            } else {
                                return 1;
                            }
                        } else {
                            if (val < 1E3) {
                                return 2;
                            } else {
                                return 3;
                            }
                        }
                    } else {
                        if (val < 1E6) {
                            if (val < 1E5) {
                                return 4;
                            } else {
                                return 5;
                            }
                        } else {
                            if (val < 1E7) {
                                return 6;
                            } else {
                                return 7;
                            }
                        }
                    }
                } else {
                    if (val < 1E12) {
                        if (val < 1E10) {
                            if (val < 1E9) {
                                return 8;
                            } else {
                                return 9;
                            }
                        } else {
                            if (val < 1E11) {
                                return 10;
                            } else {
                                return 11;
                            }
                        }
                    } else {
                        if (val < 1E14) {
                            if (val < 1E13) {
                                return 12;
                            } else {
                                return 13;
                            }
                        } else {
                            if (val < 1E15) {
                                return 14;
                            } else {
                                return 15;
                            }
                        }
                    }
                }
            }

            if (val > 1E-16 && val < 1) {
                if (val < 1E-8) {
                    if (val < 1E-12) {
                        if (val < 1E-14) {
                            if (val < 1E-15) {
                                return -16;
                            } else {
                                return -15;
                            }
                        } else {
                            if (val < 1E-13) {
                                return -14;
                            } else {
                                return -13;
                            }
                        }
                    } else {
                        if (val < 1E-10) {
                            if (val < 1E-11) {
                                return -12;
                            } else {
                                return -11;
                            }
                        } else {
                            if (val < 1E-9) {
                                return -10;
                            } else {
                                return -9;
                            }
                        }
                    }
                } else {
                    if (val < 1E-4) {
                        if (val < 1E-6) {
                            if (val < 1E-7) {
                                return -8;
                            } else {
                                return -7;
                            }
                        } else {
                            if (val < 1E-5) {
                                return -6;
                            } else {
                                return -5;
                            }
                        }
                    } else {
                        if (val < 1E-2) {
                            if (val < 1E-3) {
                                return -4;
                            } else {
                                return -3;
                            }
                        } else {
                            if (val < 1E-1) {
                                return -2;
                            } else {
                                return -1;
                            }
                        }
                    }
                }
            }
            // JS Math provides only natural log function so we need to calc the 10 base logarithm:
            // logb(x) = logk(x)/logk(b); 
            var log10 = Math.log(val) / Double.LOG_E_10;
            return Double.floorWithPrecision(log10);
        }

        /** Returns a power of 10 representing precision of the number based on the number of meaningfull decimal digits. 
          * For example the precision of 56,263.3767 with the 6 meaningfull decimal digit is 0.1
          * @param x - value
          * @param decimalDigits - how many decimal digits are meaningfull
          */
        export function getPrecision(x: number, decimalDigits?: number): number {
            if (decimalDigits === undefined) {
                decimalDigits = Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS;
            } else {
                debug.assert(decimalDigits >= 0, "decimalDigits");
            }
            if (!x) {
                return undefined; 
            }

            var exp = Double.log10(Math.abs(x));

            if (exp < Double.MIN_EXP) {
                return 0;
            }
            var precisionExp = Math.max(exp - decimalDigits, -Double.NEGATIVE_POWERS.length + 1);
            return Double.pow10(precisionExp);
        }

        /** Checks if a delta between 2 numbers is less than provided precision.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        export function equalWithPrecision(x: number, y: number, precision?: number): boolean {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");

            return x === y || Math.abs(x - y) < precision;
        }

        /** Checks if a first value is less than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        export function lessWithPrecision(x: number, y: number, precision?: number): boolean {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            
            return x < y && Math.abs(x - y) > precision;
        }

        /** Checks if a first value is less or equal than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        export function lessOrEqualWithPrecision(x: number, y: number, precision?: number): boolean {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            
            return x < y || Math.abs(x - y) < precision;
        }

        /** Checks if a first value is greater than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        export function greaterWithPrecision(x: number, y: number, precision?: number): boolean {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            
            return x > y && Math.abs(x - y) > precision;
        }

        /** Checks if a first value is greater or equal to another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        export function greaterOrEqualWithPrecision(x: number, y: number, precision?: number): boolean {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            
            return x > y || Math.abs(x - y) < precision;
        }

        /** Floors the number unless it's withing the precision distance from the higher int.
          * @param x - one value
          * @param precision - precision value
          */
        export function floorWithPrecision(x: number, precision?: number): number {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            
            var roundX = Math.round(x);
            if (Math.abs(x - roundX) < precision) {
                return roundX;
            } else {
                return Math.floor(x);
            }
        }

        /** Ciels the number unless it's withing the precision distance from the lower int.
          * @param x - one value
          * @param precision - precision value
          */
        export function ceilWithPrecision(x: number, precision?: number): number {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            
            var roundX = Math.round(x);
            if (Math.abs(x - roundX) < precision) {
                return roundX;
            } else {
                return Math.ceil(x);
            }
        }

        /** Floors the number to the provided precision. For example 234,578 floored to 1,000 precision is 234,000.
          * @param x - one value
          * @param precision - precision value
          */
        export function floorToPrecision(x: number, precision?: number): number {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            if (precision === 0 || x === 0) {
                return x;
            }
            //Precision must be a Power of 10
            return Math.floor(x / precision) * precision;
        }

        /** Ciels the number to the provided precision. For example 234,578 floored to 1,000 precision is 235,000.
          * @param x - one value
          * @param precision - precision value
          */
        export function ceilToPrecision(x: number, precision?: number): number {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            if (precision === 0 || x === 0) {
                return x;
            }
            //Precision must be a Power of 10
            return Math.ceil(x / precision) * precision;
        }

        /** Rounds the number to the provided precision. For example 234,578 floored to 1,000 precision is 235,000.
          * @param x - one value
          * @param precision - precision value
          */
        export function roundToPrecision(x: number, precision?: number): number {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            if (precision === 0 || x === 0) {
                return x;
            } 
            //Precision must be a Power of 10
            var result = Math.round(x / precision) * precision;
            var decimalDigits = Math.round(Double.log10(Math.abs(x)) - Double.log10(precision)) + 1;
            if (decimalDigits > 0 && decimalDigits < 16) {
                result = parseFloat(result.toPrecision(decimalDigits));
            }

            return result;
        }

        /** Returns the value making sure that it's restricted to the provided range.
          * @param x - one value
          * @param min - range min boundary
          * @param max - range max boundary
          */
        export function ensureInRange(x: number, min: number, max: number): number {
            debug.assert(min <= max, "min must be less or equal to max");
            if (x === undefined || x === null) {
                return x;
            }
            if (x < min) {
                return min;
            }
            if (x > max) {
                return max;
            }
            return x;
        }

        /** Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
          * @param x - value to round
          */
        export function round(x: number): number {
            debug.assert(x >= 0, "x must be greater or equal to 0");

            return (0.5 + x) << 0;
        }

        /** Projects the value from the source range into the target range.
          * @param value - value to project
          * @param fromMin - minimum of the source range
          * @param fromMax - maximum of the source range
          * @param toMin - minimum of the target range
          * @param toMax - maximum of the target range 
          */
        export function project(value: number, fromMin: number, fromSize: number, toMin: number, toSize: number) { 
            if (fromSize===0 || toSize===0) {
                if (fromMin <= value && value <= fromMin + fromSize) {
                    return toMin;
                } else { 
                    return NaN;
                }
            }
            var relativeX = (value - fromMin) / fromSize;
            var projectedX = toMin + relativeX * toSize;
            return projectedX;
        }

        /** Removes decimal noise
          * @param value - value to be processed
          */
		export function removeDecimalNoise(value: number): number {
			return roundToPrecision(value, getPrecision(value));
		}

        /** Checks whether the number is integer
          * @param value - value to be checked
          */
        export function isInteger(value: number): boolean {
            return value !== null && value % 1 === 0;
        }
    }

    function applyDefault(value: number, defaultValue: number): number { 
        return value !== undefined ? value : defaultValue;
    }
}
