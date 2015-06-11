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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /** Default IQueryExprVisitorWithArg implementation that others may derive from. */
        var DefaultSQExprVisitorWithArg = (function () {
            function DefaultSQExprVisitorWithArg() {
            }
            DefaultSQExprVisitorWithArg.prototype.visitEntity = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitColumnRef = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitMeasureRef = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitAggr = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitBetween = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitIn = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitAnd = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitOr = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitCompare = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitContains = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitExists = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitNot = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitStartsWith = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitConstant = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitDateSpan = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitDateAdd = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitNow = function (expr, arg) {
                return this.visitDefault(expr, arg);
            };
            DefaultSQExprVisitorWithArg.prototype.visitDefault = function (expr, arg) {
                return;
            };
            return DefaultSQExprVisitorWithArg;
        })();
        data.DefaultSQExprVisitorWithArg = DefaultSQExprVisitorWithArg;
        /** Default ISQExprVisitor implementation that others may derive from. */
        var DefaultSQExprVisitor = (function (_super) {
            __extends(DefaultSQExprVisitor, _super);
            function DefaultSQExprVisitor() {
                _super.apply(this, arguments);
            }
            return DefaultSQExprVisitor;
        })(DefaultSQExprVisitorWithArg);
        data.DefaultSQExprVisitor = DefaultSQExprVisitor;
        /** Default ISQExprVisitor implementation that implements default traversal and that others may derive from. */
        var DefaultSQExprVisitorWithTraversal = (function () {
            function DefaultSQExprVisitorWithTraversal() {
            }
            DefaultSQExprVisitorWithTraversal.prototype.visitEntity = function (expr) {
                this.visitDefault(expr);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitColumnRef = function (expr) {
                expr.source.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitMeasureRef = function (expr) {
                expr.source.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitAggr = function (expr) {
                expr.arg.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitBetween = function (expr) {
                expr.arg.accept(this);
                expr.lower.accept(this);
                expr.upper.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitIn = function (expr) {
                var args = expr.args;
                for (var i = 0, len = args.length; i < len; i++)
                    args[i].accept(this);
                var values = expr.values;
                for (var i = 0, len = values.length; i < len; i++) {
                    var valueTuple = values[i];
                    for (var j = 0, jlen = values.length; j < jlen; j++)
                        valueTuple[j].accept(this);
                }
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitAnd = function (expr) {
                expr.left.accept(this);
                expr.right.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitOr = function (expr) {
                expr.left.accept(this);
                expr.right.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitCompare = function (expr) {
                expr.left.accept(this);
                expr.right.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitContains = function (expr) {
                expr.left.accept(this);
                expr.right.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitExists = function (expr) {
                expr.arg.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitNot = function (expr) {
                expr.arg.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitStartsWith = function (expr) {
                expr.left.accept(this);
                expr.right.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitConstant = function (expr) {
                this.visitDefault(expr);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitDateSpan = function (expr) {
                expr.arg.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitDateAdd = function (expr) {
                expr.arg.accept(this);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitNow = function (expr) {
                this.visitDefault(expr);
            };
            DefaultSQExprVisitorWithTraversal.prototype.visitDefault = function (expr) {
                return;
            };
            return DefaultSQExprVisitorWithTraversal;
        })();
        data.DefaultSQExprVisitorWithTraversal = DefaultSQExprVisitorWithTraversal;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var InvalidDataFormatClientError = (function () {
            function InvalidDataFormatClientError() {
            }
            Object.defineProperty(InvalidDataFormatClientError.prototype, "code", {
                get: function () {
                    return 'InvalidDataFormat';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InvalidDataFormatClientError.prototype, "ignorable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            InvalidDataFormatClientError.prototype.getDetails = function (resourceProvider) {
                // To avoid creating a duplicate entry the same message and key can be used from the generic cannot load visual.
                var message = resourceProvider.get('ServiceError_CannotLoadVisual');
                var key = resourceProvider.get('ServiceError_ExecuteSemanticQueryErrorKey');
                var val = resourceProvider.get('InvalidDataFormat_DataFormatIsInvalid');
                var details = {
                    message: message,
                    additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: val, },],
                };
                return details;
            };
            return InvalidDataFormatClientError;
        })();
        data.InvalidDataFormatClientError = InvalidDataFormatClientError;
        var InvalidDataResponseClientError = (function () {
            function InvalidDataResponseClientError() {
            }
            Object.defineProperty(InvalidDataResponseClientError.prototype, "code", {
                get: function () {
                    return 'InvalidDataResponse';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InvalidDataResponseClientError.prototype, "ignorable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            InvalidDataResponseClientError.prototype.getDetails = function (resourceProvider) {
                // To avoid creating a duplicate entry the same message and key can be used from the generic cannot load visual.
                var message = resourceProvider.get('ServiceError_CannotLoadVisual');
                var key = resourceProvider.get('ServiceError_ExecuteSemanticQueryErrorKey');
                var val = resourceProvider.get('InvalidDataResponse_ServerError');
                var details = {
                    message: message,
                    additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: val, },],
                };
                return details;
            };
            return InvalidDataResponseClientError;
        })();
        data.InvalidDataResponseClientError = InvalidDataResponseClientError;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var services;
        (function (services) {
            var DataViewTransformActionsSerializer;
            (function (DataViewTransformActionsSerializer) {
                function deserializeTransformActions(visualType, objectDescs, transformsString) {
                    if (!visualType || !transformsString)
                        return;
                    var serializedTransform = JSON.parse(transformsString);
                    var dataViewObjectDefns;
                    var dataViewObjectDescs = objectDescs;
                    if (objectDescs) {
                        var objects = serializedTransform.objects;
                        if (objects)
                            dataViewObjectDefns = services.DataViewObjectSerializer.deserializeObjects(objects, dataViewObjectDescs);
                    }
                    return data.DataViewTransform.createTransformActions(serializedTransform.queryMetadata, serializedTransform.visualElements, dataViewObjectDescs, dataViewObjectDefns);
                }
                DataViewTransformActionsSerializer.deserializeTransformActions = deserializeTransformActions;
                function serializeTransformActions(actions) {
                    return JSON.stringify(actions);
                }
                DataViewTransformActionsSerializer.serializeTransformActions = serializeTransformActions;
            })(DataViewTransformActionsSerializer = services.DataViewTransformActionsSerializer || (services.DataViewTransformActionsSerializer = {}));
        })(services = data.services || (data.services = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
///<reference path="../../typedefs/jQuery/jQuery.d.ts"/>
///<reference path="../../typedefs/globalize/globalize.d.ts"/>
///<reference path="../../JsCommon/obj/utility.d.ts"/>
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
var powerbi;
(function (powerbi) {
    var alignment;
    (function (alignment) {
        alignment.right = 'right';
        alignment.left = 'left';
        alignment.center = 'center';
    })(alignment = powerbi.alignment || (powerbi.alignment = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var axisStyle;
    (function (axisStyle) {
        axisStyle.showBoth = 'showBoth';
        axisStyle.showTitleOnly = 'showTitleOnly';
        axisStyle.showUnitOnly = 'showUnitOnly';
        var allMembers = [
            { value: axisStyle.showTitleOnly, displayName: function (resources) { return resources.get('Visual_Axis_ShowTitleOnly'); } },
            { value: axisStyle.showUnitOnly, displayName: function (resources) { return resources.get('Visual_Axis_ShowUnitOnly'); } },
            { value: axisStyle.showBoth, displayName: function (resources) { return resources.get('Visual_Axis_ShowBoth'); } }
        ];
        //should be used to populate the control values
        function members(validMembers) {
            var validMembersToReturn = [];
            if (validMembers) {
                for (var i = 0, len = allMembers.length; i < len; i++) {
                    if (validMembers.indexOf(allMembers[i].value) !== -1) {
                        validMembersToReturn.push(allMembers[i]);
                    }
                }
            }
            return validMembersToReturn;
        }
        axisStyle.members = members;
    })(axisStyle = powerbi.axisStyle || (powerbi.axisStyle = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var axisType;
    (function (axisType) {
        axisType.scalar = 'Scalar';
        axisType.categorical = 'Categorical';
        axisType.both = 'Both';
        //should be used to populate the control values
        function members() {
            return [
                { value: axisType.scalar, displayName: function (resources) { return resources.get('Visual_Axis_Scalar'); } },
                { value: axisType.categorical, displayName: function (resources) { return resources.get('Visual_Axis_Categorical'); } },
            ];
        }
        axisType.members = members;
    })(axisType = powerbi.axisType || (powerbi.axisType = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var labelPosition;
    (function (labelPosition) {
        labelPosition.insideEnd = 'InsideEnd';
        labelPosition.insideCenter = 'InsideCenter';
        labelPosition.outsideEnd = 'OutsideEnd';
        labelPosition.insideBase = 'InsideBase';
        var allMembers = [
            { value: labelPosition.insideEnd, displayName: function (resources) { return resources.get('Visual_LabelPosition_InsideEnd'); } },
            { value: labelPosition.outsideEnd, displayName: function (resources) { return resources.get('Visual_LabelPosition_OutsideEnd'); } },
            { value: labelPosition.insideCenter, displayName: function (resources) { return resources.get('Visual_LabelPosition_InsideCenter'); } },
            { value: labelPosition.insideBase, displayName: function (resources) { return resources.get('Visual_LabelPosition_InsideBase'); } },
        ];
        function members(validMembers) {
            var validMembersToReturn = [];
            if (validMembers) {
                for (var i = 0, len = allMembers.length; i < len; i++) {
                    if (validMembers.indexOf(allMembers[i].value) !== -1) {
                        validMembersToReturn.push(allMembers[i]);
                    }
                }
            }
            return validMembersToReturn;
        }
        labelPosition.members = members;
    })(labelPosition = powerbi.labelPosition || (powerbi.labelPosition = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var legendPosition;
    (function (legendPosition) {
        legendPosition.top = 'Top';
        legendPosition.bottom = 'Bottom';
        legendPosition.left = 'Left';
        legendPosition.right = 'Right';
        function members() {
            return [{ value: legendPosition.top, displayName: function (resources) { return resources.get('Visual_LegendPosition_Top'); } }, { value: legendPosition.bottom, displayName: function (resources) { return resources.get('Visual_LegendPosition_Bottom'); } }, { value: legendPosition.left, displayName: function (resources) { return resources.get('Visual_LegendPosition_Left'); } }, { value: legendPosition.right, displayName: function (resources) { return resources.get('Visual_LegendPosition_Right'); } }];
        }
        legendPosition.members = members;
    })(legendPosition = powerbi.legendPosition || (powerbi.legendPosition = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var StructuralTypeDescriptor;
    (function (StructuralTypeDescriptor) {
        function isValid(type) {
            debug.assertValue(type, 'type');
            if (type.fill || type.fillRule || type.filter) {
                return true;
            }
            return false;
        }
        StructuralTypeDescriptor.isValid = isValid;
    })(StructuralTypeDescriptor = powerbi.StructuralTypeDescriptor || (powerbi.StructuralTypeDescriptor = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var EnumExtensions = jsCommon.EnumExtensions;
    /** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
    var ValueType = (function () {
        /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
        function ValueType(type, category) {
            debug.assert((!!type && ExtendedType[type] != null) || type === 0 /* Null */, 'type');
            debug.assert(!!category || category === null, 'category');
            this.underlyingType = type;
            this.category = category;
            if (EnumExtensions.hasFlag(type, ExtendedType.Temporal)) {
                this.temporalType = new TemporalType(type);
            }
            if (EnumExtensions.hasFlag(type, ExtendedType.Geography)) {
                this.geographyType = new GeographyType(type);
            }
            if (EnumExtensions.hasFlag(type, ExtendedType.Miscellaneous)) {
                this.miscType = new MiscellaneousType(type);
            }
            if (EnumExtensions.hasFlag(type, ExtendedType.Formatting)) {
                this.formattingType = new FormattingType(type);
            }
        }
        /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
        ValueType.fromDescriptor = function (descriptor) {
            descriptor = descriptor || {};
            // Simplified primitive types
            if (descriptor.text)
                return ValueType.fromExtendedType(1 /* Text */);
            if (descriptor.integer)
                return ValueType.fromExtendedType(ExtendedType.Integer);
            if (descriptor.numeric)
                return ValueType.fromExtendedType(ExtendedType.Double);
            if (descriptor.bool)
                return ValueType.fromExtendedType(5 /* Boolean */);
            if (descriptor.dateTime)
                return ValueType.fromExtendedType(ExtendedType.DateTime);
            if (descriptor.duration)
                return ValueType.fromExtendedType(10 /* Duration */);
            if (descriptor.binary)
                return ValueType.fromExtendedType(11 /* Binary */);
            if (descriptor.none)
                return ValueType.fromExtendedType(12 /* None */);
            // Extended types
            if (descriptor.temporal) {
                if (descriptor.temporal.year)
                    return ValueType.fromExtendedType(ExtendedType.Year_Integer);
                if (descriptor.temporal.month)
                    return ValueType.fromExtendedType(ExtendedType.Month_Integer);
            }
            if (descriptor.geography) {
                if (descriptor.geography.address)
                    return ValueType.fromExtendedType(ExtendedType.Address);
                if (descriptor.geography.city)
                    return ValueType.fromExtendedType(ExtendedType.City);
                if (descriptor.geography.continent)
                    return ValueType.fromExtendedType(ExtendedType.Continent);
                if (descriptor.geography.country)
                    return ValueType.fromExtendedType(ExtendedType.Country);
                if (descriptor.geography.county)
                    return ValueType.fromExtendedType(ExtendedType.County);
                if (descriptor.geography.region)
                    return ValueType.fromExtendedType(ExtendedType.Region);
                if (descriptor.geography.postalCode)
                    return ValueType.fromExtendedType(ExtendedType.PostalCode_Text);
                if (descriptor.geography.stateOrProvince)
                    return ValueType.fromExtendedType(ExtendedType.StateOrProvince);
                if (descriptor.geography.place)
                    return ValueType.fromExtendedType(ExtendedType.Place);
                if (descriptor.geography.latitude)
                    return ValueType.fromExtendedType(ExtendedType.Latitude_Double);
                if (descriptor.geography.longitude)
                    return ValueType.fromExtendedType(ExtendedType.Longitude_Double);
            }
            if (descriptor.misc) {
                if (descriptor.misc.image)
                    return ValueType.fromExtendedType(ExtendedType.Image);
                if (descriptor.misc.imageUrl)
                    return ValueType.fromExtendedType(ExtendedType.ImageUrl);
                if (descriptor.misc.webUrl)
                    return ValueType.fromExtendedType(ExtendedType.WebUrl);
            }
            if (descriptor.formatting) {
                if (descriptor.formatting.color)
                    return ValueType.fromExtendedType(ExtendedType.Color);
                if (descriptor.formatting.formatString)
                    return ValueType.fromExtendedType(ExtendedType.FormatString);
                if (descriptor.formatting.legendPosition)
                    return ValueType.fromExtendedType(ExtendedType.LegendPosition);
                if (descriptor.formatting.axisType)
                    return ValueType.fromExtendedType(ExtendedType.AxisType);
                if (descriptor.formatting.yAxisPosition)
                    return ValueType.fromExtendedType(ExtendedType.YAxisPosition);
                if (descriptor.formatting.axisStyle)
                    return ValueType.fromExtendedType(ExtendedType.AxisStyle);
                if (descriptor.formatting.alignment)
                    return ValueType.fromExtendedType(ExtendedType.Alignment);
                if (descriptor.formatting.labelDisplayUnits)
                    return ValueType.fromExtendedType(ExtendedType.LabelDisplayUnits);
                if (descriptor.formatting.labelPosition)
                    return ValueType.fromExtendedType(ExtendedType.LabelPosition);
            }
            if (descriptor.extendedType) {
                return ValueType.fromExtendedType(descriptor.extendedType);
            }
            return ValueType.fromExtendedType(0 /* Null */);
        };
        /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
        ValueType.fromExtendedType = function (extendedType) {
            extendedType = extendedType || 0 /* Null */;
            var primitiveType = getPrimitiveType(extendedType), category = getCategoryFromExtendedType(extendedType);
            debug.assert(primitiveType !== 0 /* Null */ || extendedType === 0 /* Null */, 'Cannot create ValueType for abstract extended type. Consider using fromDescriptor instead.');
            return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
        };
        /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
        ValueType.fromPrimitiveTypeAndCategory = function (primitiveType, category) {
            primitiveType = primitiveType || 0 /* Null */;
            category = category || null;
            var id = primitiveType.toString();
            if (category)
                id += '|' + category;
            return ValueType.typeCache[id] || (ValueType.typeCache[id] = new ValueType(toExtendedType(primitiveType, category), category));
        };
        Object.defineProperty(ValueType.prototype, "primitiveType", {
            /** Gets the exact primitive type of this ValueType. */
            get: function () {
                return getPrimitiveType(this.underlyingType);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "extendedType", {
            /** Gets the exact extended type of this ValueType. */
            get: function () {
                return this.underlyingType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "categoryString", {
            /** Gets the data category string (if any) for this ValueType. */
            get: function () {
                return this.category;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "text", {
            // Simplified primitive types
            /** Indicates whether the type represents text values. */
            get: function () {
                return this.primitiveType === 1 /* Text */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "numeric", {
            /** Indicates whether the type represents any numeric value. */
            get: function () {
                return EnumExtensions.hasFlag(this.underlyingType, ExtendedType.Numeric);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "integer", {
            /** Indicates whether the type represents integer numeric values. */
            get: function () {
                return this.primitiveType === 4 /* Integer */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "bool", {
            /** Indicates whether the type represents Boolean values. */
            get: function () {
                return this.primitiveType === 5 /* Boolean */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "dateTime", {
            /** Indicates whether the type represents any date/time values. */
            get: function () {
                return this.primitiveType === 7 /* DateTime */ || this.primitiveType === 6 /* Date */ || this.primitiveType === 9 /* Time */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "duration", {
            /** Indicates whether the type represents duration values. */
            get: function () {
                return this.primitiveType === 10 /* Duration */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "binary", {
            /** Indicates whether the type represents binary values. */
            get: function () {
                return this.primitiveType === 11 /* Binary */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "none", {
            /** Indicates whether the type represents none values. */
            get: function () {
                return this.primitiveType === 12 /* None */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "temporal", {
            // Extended types
            /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
            get: function () {
                return this.temporalType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "geography", {
            /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
            get: function () {
                return this.geographyType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "misc", {
            /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
            get: function () {
                return this.miscType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueType.prototype, "formatting", {
            /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
            get: function () {
                return this.formattingType;
            },
            enumerable: true,
            configurable: true
        });
        ValueType.typeCache = {};
        return ValueType;
    })();
    powerbi.ValueType = ValueType;
    var TemporalType = (function () {
        function TemporalType(type) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Temporal), 'type');
            this.underlyingType = type;
        }
        Object.defineProperty(TemporalType.prototype, "year", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Year);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TemporalType.prototype, "month", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Month);
            },
            enumerable: true,
            configurable: true
        });
        return TemporalType;
    })();
    powerbi.TemporalType = TemporalType;
    var GeographyType = (function () {
        function GeographyType(type) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Geography), 'type');
            this.underlyingType = type;
        }
        Object.defineProperty(GeographyType.prototype, "address", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Address);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "city", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.City);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "continent", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Continent);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "country", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Country);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "county", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.County);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "region", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Region);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "postalCode", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PostalCode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "stateOrProvince", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.StateOrProvince);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "place", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Place);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "latitude", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Latitude);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeographyType.prototype, "longitude", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Longitude);
            },
            enumerable: true,
            configurable: true
        });
        return GeographyType;
    })();
    powerbi.GeographyType = GeographyType;
    var MiscellaneousType = (function () {
        function MiscellaneousType(type) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Miscellaneous), 'type');
            this.underlyingType = type;
        }
        Object.defineProperty(MiscellaneousType.prototype, "image", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Image);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MiscellaneousType.prototype, "imageUrl", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ImageUrl);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MiscellaneousType.prototype, "webUrl", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.WebUrl);
            },
            enumerable: true,
            configurable: true
        });
        return MiscellaneousType;
    })();
    powerbi.MiscellaneousType = MiscellaneousType;
    var FormattingType = (function () {
        function FormattingType(type) {
            debug.assert(!!type && EnumExtensions.hasFlag(type, ExtendedType.Formatting), 'type');
            this.underlyingType = type;
        }
        Object.defineProperty(FormattingType.prototype, "color", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Color);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "formatString", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FormatString);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "legendPosition", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LegendPosition);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "axisType", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.AxisType);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "yAxisPosition", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.YAxisPosition);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "axisStyle", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.AxisStyle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "alignment", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Alignment);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "labelDisplayUnits", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDisplayUnits);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormattingType.prototype, "labelPosition", {
            get: function () {
                return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelPosition);
            },
            enumerable: true,
            configurable: true
        });
        return FormattingType;
    })();
    powerbi.FormattingType = FormattingType;
    /** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
    (function (PrimitiveType) {
        PrimitiveType[PrimitiveType["Null"] = 0] = "Null";
        PrimitiveType[PrimitiveType["Text"] = 1] = "Text";
        PrimitiveType[PrimitiveType["Decimal"] = 2] = "Decimal";
        PrimitiveType[PrimitiveType["Double"] = 3] = "Double";
        PrimitiveType[PrimitiveType["Integer"] = 4] = "Integer";
        PrimitiveType[PrimitiveType["Boolean"] = 5] = "Boolean";
        PrimitiveType[PrimitiveType["Date"] = 6] = "Date";
        PrimitiveType[PrimitiveType["DateTime"] = 7] = "DateTime";
        PrimitiveType[PrimitiveType["DateTimeZone"] = 8] = "DateTimeZone";
        PrimitiveType[PrimitiveType["Time"] = 9] = "Time";
        PrimitiveType[PrimitiveType["Duration"] = 10] = "Duration";
        PrimitiveType[PrimitiveType["Binary"] = 11] = "Binary";
        PrimitiveType[PrimitiveType["None"] = 12] = "None";
    })(powerbi.PrimitiveType || (powerbi.PrimitiveType = {}));
    var PrimitiveType = powerbi.PrimitiveType;
    /** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
    (function (ExtendedType) {
        // Flags (1 << 8-15 range [0xFF00])
        // Important: Enum members must be declared before they are used in TypeScript.
        ExtendedType[ExtendedType["Numeric"] = 1 << 8] = "Numeric";
        ExtendedType[ExtendedType["Temporal"] = 1 << 9] = "Temporal";
        ExtendedType[ExtendedType["Geography"] = 1 << 10] = "Geography";
        ExtendedType[ExtendedType["Miscellaneous"] = 1 << 11] = "Miscellaneous";
        ExtendedType[ExtendedType["Formatting"] = 1 << 12] = "Formatting";
        // Primitive types (0-255 range [0xFF] | flags)
        // The member names and base values must match those in PrimitiveType.
        ExtendedType[ExtendedType["Null"] = 0] = "Null";
        ExtendedType[ExtendedType["Text"] = 1] = "Text";
        ExtendedType[ExtendedType["Decimal"] = ExtendedType.Numeric | 2] = "Decimal";
        ExtendedType[ExtendedType["Double"] = ExtendedType.Numeric | 3] = "Double";
        ExtendedType[ExtendedType["Integer"] = ExtendedType.Numeric | 4] = "Integer";
        ExtendedType[ExtendedType["Boolean"] = 5] = "Boolean";
        ExtendedType[ExtendedType["Date"] = ExtendedType.Temporal | 6] = "Date";
        ExtendedType[ExtendedType["DateTime"] = ExtendedType.Temporal | 7] = "DateTime";
        ExtendedType[ExtendedType["DateTimeZone"] = ExtendedType.Temporal | 8] = "DateTimeZone";
        ExtendedType[ExtendedType["Time"] = ExtendedType.Temporal | 9] = "Time";
        ExtendedType[ExtendedType["Duration"] = 10] = "Duration";
        ExtendedType[ExtendedType["Binary"] = 11] = "Binary";
        ExtendedType[ExtendedType["None"] = 12] = "None";
        // Extended types (0-32767 << 16 range [0xFFFF0000] | corresponding primitive type | flags)
        // Temporal
        ExtendedType[ExtendedType["Year"] = ExtendedType.Temporal | (1 << 16)] = "Year";
        ExtendedType[ExtendedType["Year_Text"] = ExtendedType.Year | ExtendedType.Text] = "Year_Text";
        ExtendedType[ExtendedType["Year_Integer"] = ExtendedType.Year | ExtendedType.Integer] = "Year_Integer";
        ExtendedType[ExtendedType["Year_Date"] = ExtendedType.Year | ExtendedType.Date] = "Year_Date";
        ExtendedType[ExtendedType["Year_DateTime"] = ExtendedType.Year | ExtendedType.DateTime] = "Year_DateTime";
        ExtendedType[ExtendedType["Month"] = ExtendedType.Temporal | (2 << 16)] = "Month";
        ExtendedType[ExtendedType["Month_Text"] = ExtendedType.Month | ExtendedType.Text] = "Month_Text";
        ExtendedType[ExtendedType["Month_Integer"] = ExtendedType.Month | ExtendedType.Integer] = "Month_Integer";
        ExtendedType[ExtendedType["Month_Date"] = ExtendedType.Month | ExtendedType.Date] = "Month_Date";
        ExtendedType[ExtendedType["Month_DateTime"] = ExtendedType.Month | ExtendedType.DateTime] = "Month_DateTime";
        // Geography
        ExtendedType[ExtendedType["Address"] = ExtendedType.Text | ExtendedType.Geography | (100 << 16)] = "Address";
        ExtendedType[ExtendedType["City"] = ExtendedType.Text | ExtendedType.Geography | (101 << 16)] = "City";
        ExtendedType[ExtendedType["Continent"] = ExtendedType.Text | ExtendedType.Geography | (102 << 16)] = "Continent";
        ExtendedType[ExtendedType["Country"] = ExtendedType.Text | ExtendedType.Geography | (103 << 16)] = "Country";
        ExtendedType[ExtendedType["County"] = ExtendedType.Text | ExtendedType.Geography | (104 << 16)] = "County";
        ExtendedType[ExtendedType["Region"] = ExtendedType.Text | ExtendedType.Geography | (105 << 16)] = "Region";
        ExtendedType[ExtendedType["PostalCode"] = ExtendedType.Geography | (106 << 16)] = "PostalCode";
        ExtendedType[ExtendedType["PostalCode_Text"] = ExtendedType.PostalCode | ExtendedType.Text] = "PostalCode_Text";
        ExtendedType[ExtendedType["PostalCode_Integer"] = ExtendedType.PostalCode | ExtendedType.Integer] = "PostalCode_Integer";
        ExtendedType[ExtendedType["StateOrProvince"] = ExtendedType.Text | ExtendedType.Geography | (107 << 16)] = "StateOrProvince";
        ExtendedType[ExtendedType["Place"] = ExtendedType.Text | ExtendedType.Geography | (108 << 16)] = "Place";
        ExtendedType[ExtendedType["Latitude"] = ExtendedType.Geography | (109 << 16)] = "Latitude";
        ExtendedType[ExtendedType["Latitude_Decimal"] = ExtendedType.Latitude | ExtendedType.Decimal] = "Latitude_Decimal";
        ExtendedType[ExtendedType["Latitude_Double"] = ExtendedType.Latitude | ExtendedType.Double] = "Latitude_Double";
        ExtendedType[ExtendedType["Longitude"] = ExtendedType.Geography | (110 << 16)] = "Longitude";
        ExtendedType[ExtendedType["Longitude_Decimal"] = ExtendedType.Longitude | ExtendedType.Decimal] = "Longitude_Decimal";
        ExtendedType[ExtendedType["Longitude_Double"] = ExtendedType.Longitude | ExtendedType.Double] = "Longitude_Double";
        // Miscellaneous
        ExtendedType[ExtendedType["Image"] = ExtendedType.Binary | ExtendedType.Miscellaneous | (200 << 16)] = "Image";
        ExtendedType[ExtendedType["ImageUrl"] = ExtendedType.Text | ExtendedType.Miscellaneous | (201 << 16)] = "ImageUrl";
        ExtendedType[ExtendedType["WebUrl"] = ExtendedType.Text | ExtendedType.Miscellaneous | (202 << 16)] = "WebUrl";
        // Formatting
        ExtendedType[ExtendedType["Color"] = ExtendedType.Text | ExtendedType.Formatting | (300 << 16)] = "Color";
        ExtendedType[ExtendedType["FormatString"] = ExtendedType.Text | ExtendedType.Formatting | (301 << 16)] = "FormatString";
        ExtendedType[ExtendedType["LegendPosition"] = ExtendedType.Text | ExtendedType.Formatting | (302 << 16)] = "LegendPosition";
        ExtendedType[ExtendedType["AxisType"] = ExtendedType.Text | ExtendedType.Formatting | (303 << 16)] = "AxisType";
        ExtendedType[ExtendedType["YAxisPosition"] = ExtendedType.Text | ExtendedType.Formatting | (304 << 16)] = "YAxisPosition";
        ExtendedType[ExtendedType["AxisStyle"] = ExtendedType.Text | ExtendedType.Formatting | (305 << 16)] = "AxisStyle";
        ExtendedType[ExtendedType["Alignment"] = ExtendedType.Text | ExtendedType.Formatting | (306 << 16)] = "Alignment";
        ExtendedType[ExtendedType["LabelDisplayUnits"] = ExtendedType.Text | ExtendedType.Formatting | (307 << 16)] = "LabelDisplayUnits";
        ExtendedType[ExtendedType["LabelPosition"] = ExtendedType.Text | ExtendedType.Formatting | (308 << 16)] = "LabelPosition";
    })(powerbi.ExtendedType || (powerbi.ExtendedType = {}));
    var ExtendedType = powerbi.ExtendedType;
    var PrimitiveTypeMask = 0xFF; // const
    var PrimitiveTypeWithFlagsMask = 0xFFFF; // const
    var PrimitiveTypeFlagsExcludedMask = 0xFFFF0000; // const
    function getPrimitiveType(extendedType) {
        return extendedType & PrimitiveTypeMask;
    }
    function isPrimitiveType(extendedType) {
        return (extendedType & PrimitiveTypeWithFlagsMask) === extendedType;
    }
    function getCategoryFromExtendedType(extendedType) {
        if (isPrimitiveType(extendedType))
            return null;
        var category = ExtendedType[extendedType];
        if (category) {
            // Check for ExtendedType declaration without a primitive type.
            // If exists, use it as category (e.g. Longitude rather than Longitude_Double)
            // Otherwise use the ExtendedType declaration with a primitive type (e.g. Address)
            var delimIdx = category.lastIndexOf('_');
            if (delimIdx > 0) {
                var baseCategory = category.slice(0, delimIdx);
                if (ExtendedType[baseCategory]) {
                    debug.assert((ExtendedType[baseCategory] & PrimitiveTypeFlagsExcludedMask) === (extendedType & PrimitiveTypeFlagsExcludedMask), 'Unexpected value for ExtendedType base member of ' + extendedType);
                    category = baseCategory;
                }
            }
        }
        return category || null;
    }
    function toExtendedType(primitiveType, category) {
        var primitiveString = PrimitiveType[primitiveType];
        var t = ExtendedType[primitiveString];
        if (t == null) {
            debug.assertFail('Unexpected primitiveType ' + primitiveType);
            t = 0 /* Null */;
        }
        if (primitiveType && category) {
            var categoryType = ExtendedType[category];
            if (categoryType) {
                var categoryPrimitiveType = getPrimitiveType(categoryType);
                if (categoryPrimitiveType === 0 /* Null */) {
                    // Category supports multiple primitive types, check if requested primitive type is supported
                    // (note: important to use t here rather than primitiveType as it may include primitive type flags)
                    categoryType = t | categoryType;
                    if (ExtendedType[categoryType]) {
                        debug.assert(ExtendedType[categoryType] === (category + '_' + primitiveString), 'Unexpected name for ExtendedType member ' + categoryType);
                        t = categoryType;
                    }
                }
                else if (categoryPrimitiveType === primitiveType) {
                    // Primitive type matches the single supported type for the category
                    t = categoryType;
                }
            }
        }
        return t;
    }
    function matchesExtendedTypeWithAnyPrimitive(a, b) {
        return (a & PrimitiveTypeFlagsExcludedMask) === (b & PrimitiveTypeFlagsExcludedMask);
    }
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var ConceptualSchema = (function () {
            function ConceptualSchema() {
            }
            ConceptualSchema.prototype.findProperty = function (entityName, propertyName) {
                var entity = this.entities.withName(entityName);
                if (entity)
                    return entity.properties.withName(propertyName);
            };
            return ConceptualSchema;
        })();
        data.ConceptualSchema = ConceptualSchema;
        (function (ConceptualQueryableState) {
            ConceptualQueryableState[ConceptualQueryableState["Queryable"] = 0] = "Queryable";
            ConceptualQueryableState[ConceptualQueryableState["Error"] = 1] = "Error";
        })(data.ConceptualQueryableState || (data.ConceptualQueryableState = {}));
        var ConceptualQueryableState = data.ConceptualQueryableState;
        (function (ConceptualPropertyKind) {
            ConceptualPropertyKind[ConceptualPropertyKind["Column"] = 0] = "Column";
            ConceptualPropertyKind[ConceptualPropertyKind["Measure"] = 1] = "Measure";
            ConceptualPropertyKind[ConceptualPropertyKind["Kpi"] = 2] = "Kpi";
        })(data.ConceptualPropertyKind || (data.ConceptualPropertyKind = {}));
        var ConceptualPropertyKind = data.ConceptualPropertyKind;
        (function (ConceptualDefaultAggregate) {
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["Default"] = 0] = "Default";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["None"] = 1] = "None";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["Sum"] = 2] = "Sum";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["Count"] = 3] = "Count";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["Min"] = 4] = "Min";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["Max"] = 5] = "Max";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["Average"] = 6] = "Average";
            ConceptualDefaultAggregate[ConceptualDefaultAggregate["DistinctCount"] = 7] = "DistinctCount";
        })(data.ConceptualDefaultAggregate || (data.ConceptualDefaultAggregate = {}));
        var ConceptualDefaultAggregate = data.ConceptualDefaultAggregate;
        // TODO: Remove this (replaced by ValueType)
        (function (ConceptualDataCategory) {
            ConceptualDataCategory[ConceptualDataCategory["None"] = 0] = "None";
            ConceptualDataCategory[ConceptualDataCategory["Address"] = 1] = "Address";
            ConceptualDataCategory[ConceptualDataCategory["City"] = 2] = "City";
            ConceptualDataCategory[ConceptualDataCategory["Company"] = 3] = "Company";
            ConceptualDataCategory[ConceptualDataCategory["Continent"] = 4] = "Continent";
            ConceptualDataCategory[ConceptualDataCategory["Country"] = 5] = "Country";
            ConceptualDataCategory[ConceptualDataCategory["County"] = 6] = "County";
            ConceptualDataCategory[ConceptualDataCategory["Date"] = 7] = "Date";
            ConceptualDataCategory[ConceptualDataCategory["Image"] = 8] = "Image";
            ConceptualDataCategory[ConceptualDataCategory["ImageUrl"] = 9] = "ImageUrl";
            ConceptualDataCategory[ConceptualDataCategory["Latitude"] = 10] = "Latitude";
            ConceptualDataCategory[ConceptualDataCategory["Longitude"] = 11] = "Longitude";
            ConceptualDataCategory[ConceptualDataCategory["Organization"] = 12] = "Organization";
            ConceptualDataCategory[ConceptualDataCategory["Place"] = 13] = "Place";
            ConceptualDataCategory[ConceptualDataCategory["PostalCode"] = 14] = "PostalCode";
            ConceptualDataCategory[ConceptualDataCategory["Product"] = 15] = "Product";
            ConceptualDataCategory[ConceptualDataCategory["StateOrProvince"] = 16] = "StateOrProvince";
            ConceptualDataCategory[ConceptualDataCategory["WebUrl"] = 17] = "WebUrl";
        })(data.ConceptualDataCategory || (data.ConceptualDataCategory = {}));
        var ConceptualDataCategory = data.ConceptualDataCategory;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /**
         * Represents the versions of the data shape binding structure.
         * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\DsqGeneration\DataShapeBindingVersions.cs
         *      file in the TFS Dev branch.
         */
        (function (DataShapeBindingVersions) {
            /** The initial version of data shape binding */
            DataShapeBindingVersions[DataShapeBindingVersions["Version0"] = 0] = "Version0";
            /** Explicit subtotal support for axis groupings. */
            DataShapeBindingVersions[DataShapeBindingVersions["Version1"] = 1] = "Version1";
        })(data.DataShapeBindingVersions || (data.DataShapeBindingVersions = {}));
        var DataShapeBindingVersions = data.DataShapeBindingVersions;
        (function (DataShapeBindingLimitType) {
            DataShapeBindingLimitType[DataShapeBindingLimitType["Top"] = 0] = "Top";
            DataShapeBindingLimitType[DataShapeBindingLimitType["First"] = 1] = "First";
            DataShapeBindingLimitType[DataShapeBindingLimitType["Last"] = 2] = "Last";
            DataShapeBindingLimitType[DataShapeBindingLimitType["Sample"] = 3] = "Sample";
            DataShapeBindingLimitType[DataShapeBindingLimitType["Bottom"] = 4] = "Bottom";
        })(data.DataShapeBindingLimitType || (data.DataShapeBindingLimitType = {}));
        var DataShapeBindingLimitType = data.DataShapeBindingLimitType;
        (function (SubtotalType) {
            SubtotalType[SubtotalType["None"] = 0] = "None";
            SubtotalType[SubtotalType["Before"] = 1] = "Before";
            SubtotalType[SubtotalType["After"] = 2] = "After";
        })(data.SubtotalType || (data.SubtotalType = {}));
        var SubtotalType = data.SubtotalType;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /** Represents a federated conceptual schema. */
        var FederatedConceptualSchema = (function () {
            function FederatedConceptualSchema(options) {
                debug.assertValue(options, 'options');
                this.schemas = options.schemas;
                if (options.links)
                    this.links = options.links;
            }
            FederatedConceptualSchema.prototype.schema = function (name) {
                return this.schemas[name];
            };
            return FederatedConceptualSchema;
        })();
        data.FederatedConceptualSchema = FederatedConceptualSchema;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (_data) {
        /* tslint:enable */
        var Selector;
        (function (Selector) {
            var ArrayExtensions = jsCommon.ArrayExtensions;
            function filterFromSelector(selectors, isNot) {
                if (ArrayExtensions.isUndefinedOrEmpty(selectors))
                    return;
                var expr;
                for (var i = 0, ilen = selectors.length; i < ilen; i++) {
                    var identity = selectors[i];
                    var data = identity.data;
                    var exprToAdd = undefined;
                    if (data && data.length) {
                        for (var j = 0, jlen = data.length; j < jlen; j++) {
                            var newExpr = identity.data[j].expr;
                            if (newExpr) {
                                if (exprToAdd)
                                    exprToAdd = _data.SQExprBuilder.and(exprToAdd, newExpr);
                                else
                                    exprToAdd = newExpr;
                            }
                        }
                    }
                    if (exprToAdd)
                        expr = expr ? _data.SQExprBuilder.or(expr, exprToAdd) : exprToAdd;
                }
                if (expr && isNot)
                    expr = _data.SQExprBuilder.not(expr);
                return _data.SemanticFilter.fromSQExpr(expr);
            }
            Selector.filterFromSelector = filterFromSelector;
            function matchesData(selector, identities) {
                debug.assertValue(selector, 'selector');
                debug.assertValue(selector.data, 'selector.data');
                debug.assertValue(identities, 'identities');
                var selectorData = selector.data;
                if (selectorData.length !== identities.length)
                    return false;
                for (var i = 0, len = selectorData.length; i < len; i++) {
                    var dataItem = selector.data[i];
                    var selectorDataItem = dataItem;
                    if (selectorDataItem.expr) {
                        if (!powerbi.DataViewScopeIdentity.equals(selectorDataItem, identities[i]))
                            return false;
                    }
                    else {
                        if (!_data.DataViewScopeWildcard.matches(dataItem, identities[i]))
                            return false;
                    }
                }
                return true;
            }
            Selector.matchesData = matchesData;
            function matchesKeys(selector, keysList) {
                debug.assertValue(selector, 'selector');
                debug.assertValue(selector.data, 'selector.data');
                debug.assertValue(keysList, 'keysList');
                var selectorData = selector.data, selectorDataLength = selectorData.length;
                if (selectorDataLength !== keysList.length)
                    return false;
                for (var i = 0; i < selectorDataLength; i++) {
                    var selectorDataItem = selector.data[i], selectorDataExprs;
                    if (selectorDataItem.expr) {
                        selectorDataExprs = _data.ScopeIdentityKeyExtractor.run(selectorDataItem.expr);
                    }
                    else {
                        selectorDataExprs = selectorDataItem.exprs;
                    }
                    if (!selectorDataExprs)
                        continue;
                    if (!_data.SQExprUtils.sequenceEqual(keysList[i], selectorDataExprs))
                        return false;
                }
                return true;
            }
            Selector.matchesKeys = matchesKeys;
            /** Determines whether two selectors are equal. */
            function equals(x, y) {
                // Normalize falsy to null
                x = x || null;
                y = y || null;
                if (x === y)
                    return true;
                if (!x !== !y)
                    return false;
                debug.assertValue(x, 'x');
                debug.assertValue(y, 'y');
                if (x.id !== y.id)
                    return false;
                if (x.metadata !== y.metadata)
                    return false;
                if (!equalsDataArray(x.data, y.data))
                    return false;
                return true;
            }
            Selector.equals = equals;
            function equalsDataArray(x, y) {
                // Normalize falsy to null
                x = x || null;
                y = y || null;
                if (x === y)
                    return true;
                if (!x !== !y)
                    return false;
                if (x.length !== y.length)
                    return false;
                for (var i = 0, len = x.length; i < len; i++) {
                    if (!equalsData(x[i], y[i]))
                        return false;
                }
                return true;
            }
            function equalsData(x, y) {
                if (!x.expr && y.expr) {
                    // TODO: We need to also check wildcard selectors too (once that's supported/figured out).
                    return false;
                }
                return powerbi.DataViewScopeIdentity.equals(x, y);
            }
            function getKey(selector) {
                var toStringify = {};
                if (selector.data) {
                    var data = [];
                    for (var i = 0, ilen = selector.data.length; i < ilen; i++) {
                        data.push(selector.data[i].key);
                    }
                    toStringify.data = data;
                }
                if (selector.metadata)
                    toStringify.metadata = selector.metadata;
                if (selector.id)
                    toStringify.id = selector.id;
                return JSON.stringify(toStringify);
            }
            Selector.getKey = getKey;
            function containsWildcard(selector) {
                debug.assertValue(selector, 'selector');
                var dataItems = selector.data;
                if (!dataItems)
                    return false;
                for (var i = 0, len = dataItems.length; i < len; i++) {
                    var wildcard = dataItems[i];
                    if (wildcard.exprs)
                        return true;
                }
                return false;
            }
            Selector.containsWildcard = containsWildcard;
        })(Selector = _data.Selector || (_data.Selector = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        (function (PowerBIErrorResourceType) {
            PowerBIErrorResourceType[PowerBIErrorResourceType["ResourceCodeReference"] = 0] = "ResourceCodeReference";
            PowerBIErrorResourceType[PowerBIErrorResourceType["EmbeddedString"] = 1] = "EmbeddedString";
        })(data.PowerBIErrorResourceType || (data.PowerBIErrorResourceType = {}));
        var PowerBIErrorResourceType = data.PowerBIErrorResourceType;
        (function (ServiceErrorStatusCode) {
            ServiceErrorStatusCode[ServiceErrorStatusCode["GeneralError"] = 0] = "GeneralError";
            ServiceErrorStatusCode[ServiceErrorStatusCode["CsdlFetching"] = 1] = "CsdlFetching";
            ServiceErrorStatusCode[ServiceErrorStatusCode["CsdlConvertXmlToConceptualSchema"] = 2] = "CsdlConvertXmlToConceptualSchema";
            ServiceErrorStatusCode[ServiceErrorStatusCode["CsdlCreateClientSchema"] = 3] = "CsdlCreateClientSchema";
            ServiceErrorStatusCode[ServiceErrorStatusCode["ExecuteSemanticQueryError"] = 4] = "ExecuteSemanticQueryError";
            ServiceErrorStatusCode[ServiceErrorStatusCode["ExecuteSemanticQueryInvalidStreamFormat"] = 5] = "ExecuteSemanticQueryInvalidStreamFormat";
        })(data.ServiceErrorStatusCode || (data.ServiceErrorStatusCode = {}));
        var ServiceErrorStatusCode = data.ServiceErrorStatusCode;
        var ServiceErrorToClientError = (function () {
            function ServiceErrorToClientError(serviceError) {
                this.m_serviceError = serviceError;
            }
            Object.defineProperty(ServiceErrorToClientError.prototype, "code", {
                get: function () {
                    return ServiceErrorToClientError.codeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServiceErrorToClientError.prototype, "ignorable", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            ServiceErrorToClientError.prototype.getDetails = function (resourceProvider) {
                var errorDetails = PowerBIErrorDetailHelper.GetDetailsFromServerErrorStatusCode(resourceProvider, this.m_serviceError.statusCode);
                PowerBIErrorDetailHelper.addAdditionalInfo(errorDetails, this.m_serviceError.errorDetails, resourceProvider);
                return errorDetails;
            };
            ServiceErrorToClientError.codeName = 'ServiceErrorToClientError';
            return ServiceErrorToClientError;
        })();
        data.ServiceErrorToClientError = ServiceErrorToClientError;
        var PowerBIErrorDetailHelper = (function () {
            function PowerBIErrorDetailHelper() {
            }
            PowerBIErrorDetailHelper.addAdditionalInfo = function (errorDetails, pbiErrorDetails, localize) {
                if (pbiErrorDetails) {
                    for (var i = 0; i < pbiErrorDetails.length; i++) {
                        var element = pbiErrorDetails[i];
                        var additionErrorInfoKeyValuePair = {
                            errorInfoKey: localize.get(PowerBIErrorDetailHelper.serverErrorPrefix + element.code),
                            errorInfoValue: element.detail.type === 0 /* ResourceCodeReference */ ? localize.get(PowerBIErrorDetailHelper.serverErrorPrefix + element.detail.value) : element.detail.value
                        };
                        errorDetails.additionalErrorInfo.push(additionErrorInfoKeyValuePair);
                    }
                }
                return errorDetails;
            };
            PowerBIErrorDetailHelper.GetDetailsFromServerErrorStatusCode = function (localize, statusCode) {
                // TODO: Localize
                var message = "";
                var key = "";
                var val = "";
                switch (statusCode) {
                    case 2 /* CsdlConvertXmlToConceptualSchema */:
                        message = localize.get('ServiceError_ModelCannotLoad');
                        key = localize.get('ServiceError_ModelConvertFailureKey');
                        val = localize.get('ServiceError_ModelConvertFailureValue');
                        break;
                    case 3 /* CsdlCreateClientSchema */:
                        message = localize.get('ServiceError_ModelCannotLoad');
                        key = localize.get('ServiceError_ModelCreationFailureKey');
                        val = localize.get('ServiceError_ModelCreationFailureValue');
                        break;
                    case 1 /* CsdlFetching */:
                        message = localize.get('ServiceError_ModelCannotLoad');
                        key = localize.get('ServiceError_ModelFetchingFailureKey');
                        val = localize.get('ServiceError_ModelFetchingFailureValue');
                        break;
                    case 4 /* ExecuteSemanticQueryError */:
                        message = localize.get('ServiceError_CannotLoadVisual');
                        key = localize.get('ServiceError_ExecuteSemanticQueryErrorKey');
                        val = localize.get('ServiceError_ExecuteSemanticQueryErrorValue');
                        break;
                    case 5 /* ExecuteSemanticQueryInvalidStreamFormat */:
                        message = localize.get('ServiceError_CannotLoadVisual');
                        key = localize.get('ServiceError_ExecuteSemanticQueryInvalidStreamFormatKey');
                        val = localize.get('ServiceError_ExecuteSemanticQueryInvalidStreamFormatValue');
                        break;
                    case 0 /* GeneralError */:
                    default:
                        message = localize.get('ServiceError_GeneralError');
                        key = localize.get('ServiceError_GeneralErrorKey');
                        val = localize.get('ServiceError_GeneralErrorValue');
                        break;
                }
                var additionalInfo = [];
                additionalInfo.push({ errorInfoKey: key, errorInfoValue: val, });
                var errorDetails = {
                    message: message,
                    additionalErrorInfo: additionalInfo,
                };
                return errorDetails;
            };
            PowerBIErrorDetailHelper.serverErrorPrefix = "ServerError_";
            return PowerBIErrorDetailHelper;
        })();
        data.PowerBIErrorDetailHelper = PowerBIErrorDetailHelper;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        (function (TimeUnit) {
            TimeUnit[TimeUnit["Day"] = 0] = "Day";
            TimeUnit[TimeUnit["Week"] = 1] = "Week";
            TimeUnit[TimeUnit["Month"] = 2] = "Month";
            TimeUnit[TimeUnit["Year"] = 3] = "Year";
            TimeUnit[TimeUnit["Decade"] = 4] = "Decade";
            TimeUnit[TimeUnit["Second"] = 5] = "Second";
            TimeUnit[TimeUnit["Minute"] = 6] = "Minute";
            TimeUnit[TimeUnit["Hour"] = 7] = "Hour";
        })(data.TimeUnit || (data.TimeUnit = {}));
        var TimeUnit = data.TimeUnit;
        (function (QueryAggregateFunction) {
            QueryAggregateFunction[QueryAggregateFunction["Sum"] = 0] = "Sum";
            QueryAggregateFunction[QueryAggregateFunction["Avg"] = 1] = "Avg";
            QueryAggregateFunction[QueryAggregateFunction["Count"] = 2] = "Count";
            QueryAggregateFunction[QueryAggregateFunction["Min"] = 3] = "Min";
            QueryAggregateFunction[QueryAggregateFunction["Max"] = 4] = "Max";
            QueryAggregateFunction[QueryAggregateFunction["CountNonNull"] = 5] = "CountNonNull";
        })(data.QueryAggregateFunction || (data.QueryAggregateFunction = {}));
        var QueryAggregateFunction = data.QueryAggregateFunction;
        (function (QuerySortDirection) {
            QuerySortDirection[QuerySortDirection["Ascending"] = 1] = "Ascending";
            QuerySortDirection[QuerySortDirection["Descending"] = 2] = "Descending";
        })(data.QuerySortDirection || (data.QuerySortDirection = {}));
        var QuerySortDirection = data.QuerySortDirection;
        (function (QueryComparisonKind) {
            QueryComparisonKind[QueryComparisonKind["Equal"] = 0] = "Equal";
            QueryComparisonKind[QueryComparisonKind["GreaterThan"] = 1] = "GreaterThan";
            QueryComparisonKind[QueryComparisonKind["GreaterThanOrEqual"] = 2] = "GreaterThanOrEqual";
            QueryComparisonKind[QueryComparisonKind["LessThan"] = 3] = "LessThan";
            QueryComparisonKind[QueryComparisonKind["LessThanOrEqual"] = 4] = "LessThanOrEqual";
        })(data.QueryComparisonKind || (data.QueryComparisonKind = {}));
        var QueryComparisonKind = data.QueryComparisonKind;
        /** Defines semantic data types. */
        (function (SemanticType) {
            SemanticType[SemanticType["None"] = 0x0] = "None";
            SemanticType[SemanticType["Number"] = 0x1] = "Number";
            SemanticType[SemanticType["Integer"] = SemanticType.Number + 0x2] = "Integer";
            SemanticType[SemanticType["DateTime"] = 0x4] = "DateTime";
            SemanticType[SemanticType["Time"] = 0x08] = "Time";
            SemanticType[SemanticType["Date"] = SemanticType.DateTime + 0x10] = "Date";
            SemanticType[SemanticType["Month"] = SemanticType.Integer + 0x20] = "Month";
            SemanticType[SemanticType["Year"] = SemanticType.Integer + 0x40] = "Year";
            SemanticType[SemanticType["YearAndMonth"] = 0x80] = "YearAndMonth";
            SemanticType[SemanticType["MonthAndDay"] = 0x100] = "MonthAndDay";
            SemanticType[SemanticType["Decade"] = SemanticType.Integer + 0x200] = "Decade";
            SemanticType[SemanticType["YearAndWeek"] = 0x400] = "YearAndWeek";
            SemanticType[SemanticType["String"] = 0x800] = "String";
            SemanticType[SemanticType["Boolean"] = 0x1000] = "Boolean";
            SemanticType[SemanticType["Table"] = 0x2000] = "Table";
            SemanticType[SemanticType["Range"] = 0x4000] = "Range";
        })(data.SemanticType || (data.SemanticType = {}));
        var SemanticType = data.SemanticType;
        (function (SelectKind) {
            SelectKind[SelectKind["None"] = 0] = "None";
            SelectKind[SelectKind["Group"] = 1] = "Group";
            SelectKind[SelectKind["Measure"] = 2] = "Measure";
        })(data.SelectKind || (data.SelectKind = {}));
        var SelectKind = data.SelectKind;
        (function (FilterKind) {
            FilterKind[FilterKind["Default"] = 0] = "Default";
            FilterKind[FilterKind["Period"] = 1] = "Period";
        })(data.FilterKind || (data.FilterKind = {}));
        var FilterKind = data.FilterKind;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    /** The system used to determine display units used during formatting */
    (function (DisplayUnitSystemType) {
        /** Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes. */
        DisplayUnitSystemType[DisplayUnitSystemType["Default"] = 0] = "Default";
        /** A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards. */
        DisplayUnitSystemType[DisplayUnitSystemType["Verbose"] = 1] = "Verbose";
        /** A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
        *   Suitable for dashboard tile cards
        */
        DisplayUnitSystemType[DisplayUnitSystemType["WholeUnits"] = 2] = "WholeUnits";
    })(powerbi.DisplayUnitSystemType || (powerbi.DisplayUnitSystemType = {}));
    var DisplayUnitSystemType = powerbi.DisplayUnitSystemType;
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        (function (CompiledSubtotalType) {
            CompiledSubtotalType[CompiledSubtotalType["None"] = 0] = "None";
            CompiledSubtotalType[CompiledSubtotalType["Before"] = 1] = "Before";
            CompiledSubtotalType[CompiledSubtotalType["After"] = 2] = "After";
        })(data.CompiledSubtotalType || (data.CompiledSubtotalType = {}));
        var CompiledSubtotalType = data.CompiledSubtotalType;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var UnionExtensions = jsCommon.UnionExtensions;
        function compileDataView(options) {
            debug.assertValue(options, "options");
            var compiler = new DataViewMappingCompiler(options.queryDefn, options.queryProjections, options.schema);
            var result = [], mappings = options.mappings;
            for (var i = 0, len = mappings.length; i < len; i++)
                result.push(compiler.compileMapping(mappings[i], options.objectDescriptors, options.objectDefinitions));
            return result;
        }
        data.compileDataView = compileDataView;
        var DataViewMappingCompiler = (function () {
            function DataViewMappingCompiler(queryDefn, queryProjections, schema) {
                debug.assertValue(queryDefn, 'queryDefn');
                debug.assertValue(queryProjections, 'queryProjections');
                debug.assertValue(schema, 'schema');
                this.queryDefn = queryDefn;
                this.queryProjections = queryProjections;
                this.schema = schema;
            }
            DataViewMappingCompiler.prototype.compileMapping = function (mapping, objectDescriptors, objectDefinitions) {
                debug.assertValue(mapping, 'mapping');
                debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
                debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
                var metadata = this.compileMetadata(objectDescriptors, objectDefinitions);
                var compiledMapping = {
                    metadata: metadata
                };
                if (mapping.categorical)
                    compiledMapping.categorical = this.compileCategorical(mapping.categorical);
                if (mapping.table)
                    compiledMapping.table = this.compileTable(mapping.table);
                if (mapping.single)
                    compiledMapping.single = this.compileSingle(mapping.single);
                if (mapping.tree)
                    compiledMapping.tree = this.compileTree(mapping.tree);
                if (mapping.matrix)
                    compiledMapping.matrix = this.compileMatrix(mapping.matrix);
                return compiledMapping;
            };
            DataViewMappingCompiler.prototype.compileMetadata = function (objectDescriptors, objectDefinitions) {
                debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
                debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
                var metadata = {};
                var objects = this.evaluateConstantMetadataObjects(objectDescriptors, objectDefinitions);
                if (objects)
                    metadata.objects = objects;
                return metadata;
            };
            DataViewMappingCompiler.prototype.evaluateConstantMetadataObjects = function (objectDescriptors, objectDefinitions) {
                debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
                debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
                if (!objectDefinitions || !objectDescriptors)
                    return;
                var objectsForAllSelectors = data.DataViewObjectEvaluationUtils.groupObjectsBySelector(objectDefinitions);
                if (objectsForAllSelectors.metadataOnce)
                    return data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectsForAllSelectors.metadataOnce.objects);
            };
            DataViewMappingCompiler.prototype.compileCategorical = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiled = {};
                if (mapping.categories)
                    compiled.categories = this.compileRoleMappingWithReduction(mapping.categories);
                var values = mapping.values;
                if (values) {
                    var grouped = this.compileGrouped(values);
                    var list = this.compileList(values);
                    var roleMapping = this.compileRoleMapping(values);
                    compiled.values = UnionExtensions.mergeUnionType(grouped, list, roleMapping);
                }
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileTable = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var roleMapping = this.compileRoleMappingWithReduction(mapping.rows);
                var listMapping = this.compileListWithReduction(mapping.rows);
                var rows = UnionExtensions.mergeUnionType(roleMapping, listMapping);
                return {
                    rows: rows
                };
            };
            DataViewMappingCompiler.prototype.compileSingle = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var role = this.compileRole(mapping.role);
                return {
                    role: role
                };
            };
            DataViewMappingCompiler.prototype.compileTree = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiled = {};
                if (mapping.nodes)
                    compiled.nodes = this.compileGroupingRoleMapping(mapping.nodes);
                if (mapping.values)
                    compiled.values = this.compileValuesRoleMapping(mapping.values);
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileMatrix = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiled = {};
                if (mapping.rows)
                    compiled.rows = this.compileForWithReduction(mapping.rows);
                if (mapping.columns)
                    compiled.columns = this.compileForWithReduction(mapping.columns);
                if (mapping.values)
                    compiled.values = this.compileFor(mapping.values);
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileGroupingRoleMapping = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                if (!mapping.role)
                    return;
                var role = this.compileRole(mapping.role);
                return {
                    role: role
                };
            };
            DataViewMappingCompiler.prototype.compileValuesRoleMapping = function (mapping) {
                var _this = this;
                debug.assertValue(mapping, 'mapping');
                if (!mapping.roles)
                    return;
                var roles = mapping.roles.map(function (item) { return _this.compileRole(item); });
                return {
                    roles: roles
                };
            };
            DataViewMappingCompiler.prototype.compileListWithReduction = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiled = this.compileList(mapping);
                if (!compiled)
                    return;
                if (mapping.dataReductionAlgorithm)
                    compiled.dataReductionAlgorithm = this.compileReduction(mapping.dataReductionAlgorithm);
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileList = function (mapping) {
                var _this = this;
                debug.assertValue(mapping, 'mapping');
                if (!mapping.select)
                    return;
                var select = mapping.select.map(function (item) { return _this.compileRoleMapping(item); });
                return {
                    select: select
                };
            };
            DataViewMappingCompiler.prototype.compileGrouped = function (mapping) {
                var _this = this;
                debug.assertValue(mapping, 'mapping');
                if (!mapping.group)
                    return;
                var byItems = this.compileRole(mapping.group.by);
                var select = mapping.group.select.map(function (item) { return _this.compileRoleMapping(item); });
                var compiled = {
                    group: {
                        by: byItems,
                        select: select
                    }
                };
                if (mapping.group.dataReductionAlgorithm)
                    compiled.group.dataReductionAlgorithm = this.compileReduction(mapping.group.dataReductionAlgorithm);
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileRoleMapping = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiledBind = this.compileBind(mapping);
                var compiledFor = this.compileFor(mapping);
                return UnionExtensions.mergeUnionType(compiledBind, compiledFor);
            };
            DataViewMappingCompiler.prototype.compileRoleMappingWithReduction = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiled = this.compileRoleMapping(mapping);
                if (!compiled)
                    return;
                if (mapping.dataReductionAlgorithm)
                    compiled.dataReductionAlgorithm = this.compileReduction(mapping.dataReductionAlgorithm);
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileBind = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                if (!mapping.bind)
                    return;
                var items = this.compileRole(mapping.bind.to);
                return {
                    bind: {
                        to: items
                    }
                };
            };
            DataViewMappingCompiler.prototype.compileForWithReduction = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                var compiled = this.compileFor(mapping);
                if (!compiled)
                    return;
                if (mapping.dataReductionAlgorithm)
                    compiled.dataReductionAlgorithm = this.compileReduction(mapping.dataReductionAlgorithm);
                return compiled;
            };
            DataViewMappingCompiler.prototype.compileFor = function (mapping) {
                debug.assertValue(mapping, 'mapping');
                if (!mapping.for)
                    return;
                var items = this.compileRole(mapping.for.in);
                return {
                    for: {
                        in: items
                    }
                };
            };
            DataViewMappingCompiler.prototype.compileRole = function (role) {
                var _this = this;
                debug.assertValue(role, 'role');
                var items;
                var selects = this.queryDefn.select();
                var projections = this.queryProjections[role];
                if (!jsCommon.ArrayExtensions.isUndefinedOrEmpty(projections)) {
                    items = projections.map(function (projection) { return _this.createDataViewRoleItem(selects.withName(projection.queryRef)); });
                }
                return {
                    role: role,
                    items: items
                };
            };
            DataViewMappingCompiler.prototype.createDataViewRoleItem = function (select) {
                debug.assertValue(select, 'select');
                var item = {};
                var metadata = select.expr.getMetadata(this.schema);
                if (metadata)
                    item.type = metadata.type;
                return item;
            };
            DataViewMappingCompiler.prototype.compileReduction = function (algorithm) {
                debug.assertAnyValue(algorithm, 'algorithm');
                if (!algorithm)
                    return;
                var compiled = {};
                if (algorithm.top) {
                    compiled.top = {};
                    if (algorithm.top.count)
                        compiled.top.count = algorithm.top.count;
                }
                if (algorithm.bottom) {
                    compiled.bottom = {};
                    if (algorithm.bottom.count)
                        compiled.bottom.count = algorithm.bottom.count;
                }
                if (algorithm.sample) {
                    compiled.sample = {};
                    if (algorithm.sample.count)
                        compiled.sample.count = algorithm.sample.count;
                }
                if (algorithm.window) {
                    compiled.window = {};
                    if (algorithm.window.count)
                        compiled.window.count = algorithm.window.count;
                }
                return compiled;
            };
            return DataViewMappingCompiler;
        })();
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var DataViewObjectDefinitions;
        (function (DataViewObjectDefinitions) {
            /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
            function ensure(defns, objectName, selector) {
                debug.assertValue(defns, 'defns');
                var defnsForObject = defns[objectName];
                if (!defnsForObject)
                    defns[objectName] = defnsForObject = [];
                for (var i = 0, len = defnsForObject.length; i < len; i++) {
                    var defn = defnsForObject[i];
                    if (data.Selector.equals(defn.selector, selector))
                        return defn;
                }
                var newDefn = {
                    selector: selector,
                    properties: {},
                };
                defnsForObject.push(newDefn);
                return newDefn;
            }
            DataViewObjectDefinitions.ensure = ensure;
            function deleteProperty(defns, objectName, selector, propertyName) {
                debug.assertValue(defns, 'defns');
                var defnsForObject = defns[objectName];
                if (!defnsForObject)
                    return;
                for (var i = 0, len = defnsForObject.length; i < len; i++) {
                    var defn = defnsForObject[i];
                    if (data.Selector.equals(defn.selector, selector)) {
                        //note: We decided that delete is acceptable here and that we don't need optimization here                
                        delete defn.properties[propertyName];
                        return;
                    }
                }
            }
            DataViewObjectDefinitions.deleteProperty = deleteProperty;
            function getValue(defns, propertyId, selector) {
                var defnsForObject = defns[propertyId.objectName];
                if (!defnsForObject)
                    return;
                for (var i = 0, len = defnsForObject.length; i < len; i++) {
                    var defn = defnsForObject[i];
                    if (data.Selector.equals(defn.selector, selector))
                        return defn.properties[propertyId.propertyName];
                }
            }
            DataViewObjectDefinitions.getValue = getValue;
        })(DataViewObjectDefinitions = data.DataViewObjectDefinitions || (data.DataViewObjectDefinitions = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var DataViewObjectDescriptors;
        (function (DataViewObjectDescriptors) {
            /** Attempts to find the format string property.  This can be useful for upgrade and conversion. */
            function findFormatString(descriptors) {
                return findProperty(descriptors, function (propDesc) {
                    var formattingTypeDesc = powerbi.ValueType.fromDescriptor(propDesc.type).formatting;
                    return formattingTypeDesc && formattingTypeDesc.formatString;
                });
            }
            DataViewObjectDescriptors.findFormatString = findFormatString;
            /** Attempts to find the filter property.  This can be useful for propagating filters from one visual to others. */
            function findFilterOutput(descriptors) {
                return findProperty(descriptors, function (propDesc) {
                    var propType = propDesc.type;
                    return propType && !!propType.filter;
                });
            }
            DataViewObjectDescriptors.findFilterOutput = findFilterOutput;
            function findProperty(descriptors, propPredicate) {
                debug.assertAnyValue(descriptors, 'descriptors');
                debug.assertAnyValue(propPredicate, 'propPredicate');
                if (!descriptors)
                    return;
                for (var objectName in descriptors) {
                    var objPropDescs = descriptors[objectName].properties;
                    for (var propertyName in objPropDescs) {
                        if (propPredicate(objPropDescs[propertyName])) {
                            return {
                                objectName: objectName,
                                propertyName: propertyName,
                            };
                        }
                    }
                }
            }
        })(DataViewObjectDescriptors = data.DataViewObjectDescriptors || (data.DataViewObjectDescriptors = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var DataViewObjectEvaluationUtils;
        (function (DataViewObjectEvaluationUtils) {
            function evaluateDataViewObjects(objectDescriptors, objectDefns) {
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(objectDefns, 'objectDefns');
                var objects;
                for (var j = 0, jlen = objectDefns.length; j < jlen; j++) {
                    var objectDefinition = objectDefns[j], objectName = objectDefinition.name;
                    var evaluatedObject = data.DataViewObjectEvaluator.run(objectDescriptors[objectName], objectDefinition.properties);
                    if (!evaluatedObject)
                        continue;
                    if (!objects)
                        objects = {};
                    // NOTE: this currently has last-object-wins semantics.
                    objects[objectName] = evaluatedObject;
                }
                return objects;
            }
            DataViewObjectEvaluationUtils.evaluateDataViewObjects = evaluateDataViewObjects;
            function groupObjectsBySelector(objectDefinitions) {
                debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
                var grouped = {
                    data: [],
                };
                if (objectDefinitions) {
                    for (var objectName in objectDefinitions) {
                        var objectDefnList = objectDefinitions[objectName];
                        for (var i = 0, len = objectDefnList.length; i < len; i++) {
                            var objectDefn = objectDefnList[i];
                            ensureDefinitionListForSelector(grouped, objectDefn.selector).objects.push({
                                name: objectName,
                                properties: objectDefn.properties,
                            });
                        }
                    }
                }
                return grouped;
            }
            DataViewObjectEvaluationUtils.groupObjectsBySelector = groupObjectsBySelector;
            function ensureDefinitionListForSelector(grouped, selector) {
                debug.assertValue(grouped, 'grouped');
                debug.assertAnyValue(selector, 'selector');
                if (!selector) {
                    if (!grouped.metadataOnce)
                        grouped.metadataOnce = { objects: [] };
                    return grouped.metadataOnce;
                }
                var groupedObjects;
                if (selector.data) {
                    groupedObjects = grouped.data;
                }
                else if (selector.metadata) {
                    if (!grouped.metadata)
                        grouped.metadata = [];
                    groupedObjects = grouped.metadata;
                }
                else if (selector.id) {
                    if (!grouped.userDefined)
                        grouped.userDefined = [];
                    groupedObjects = grouped.userDefined;
                }
                for (var i = 0, len = groupedObjects.length; i < len; i++) {
                    var item = groupedObjects[i];
                    if (data.Selector.equals(selector, item.selector))
                        return item;
                }
                var item = {
                    selector: selector,
                    objects: [],
                };
                groupedObjects.push(item);
                return item;
            }
            /** Registers properties for default format strings, if the properties are not explicitly provided. */
            function addDefaultFormatString(objectsForAllSelectors, objectDescriptors, columns, selectTransforms) {
                debug.assertValue(objectsForAllSelectors, 'objectsForAllSelectors');
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(columns, 'columns');
                debug.assertValue(selectTransforms, 'selectTransforms');
                var formatStringProp = data.DataViewObjectDescriptors.findFormatString(objectDescriptors);
                if (!formatStringProp)
                    return;
                for (var selectIdx = 0, selectLen = selectTransforms.length; selectIdx < selectLen; selectIdx++) {
                    var selectTransform = selectTransforms[selectIdx];
                    if (!selectTransform)
                        continue;
                    debug.assertValue(selectTransform.queryName, 'selectTransform.queryName');
                    applyFormatString(objectsForAllSelectors, formatStringProp, selectTransform.queryName, selectTransform.format || getColumnFormatForIndex(columns, selectIdx));
                }
            }
            DataViewObjectEvaluationUtils.addDefaultFormatString = addDefaultFormatString;
            function getColumnFormatForIndex(columns, selectIdx) {
                for (var columnIdx = 0, columnLen = columns.length; columnIdx < columnLen; columnIdx++) {
                    var column = columns[columnIdx];
                    if (!column || column.index !== selectIdx)
                        continue;
                    return column.format;
                }
            }
            function applyFormatString(objectsForAllSelectors, formatStringProp, queryName, formatStringValue) {
                if (!formatStringValue)
                    return;
                // There is a format string specified -- apply it as an object property, if there is not already one specified.
                var metadataObjects = objectsForAllSelectors.metadata;
                if (!metadataObjects)
                    metadataObjects = objectsForAllSelectors.metadata = [];
                var selector = { metadata: queryName };
                var targetMetadataObject = findWithMatchingSelector(metadataObjects, selector), targetObjectDefns;
                if (targetMetadataObject) {
                    targetObjectDefns = targetMetadataObject.objects;
                    if (hasExistingObjectProperty(targetObjectDefns, formatStringProp))
                        return;
                }
                else {
                    targetObjectDefns = [];
                    targetMetadataObject = { selector: selector, objects: targetObjectDefns };
                    metadataObjects.push(targetMetadataObject);
                }
                var newObjectDefn = {
                    name: formatStringProp.objectName,
                    properties: {}
                };
                newObjectDefn.properties[formatStringProp.propertyName] = data.SQExprBuilder.text(formatStringValue);
                targetObjectDefns.push(newObjectDefn);
            }
            function findWithMatchingSelector(objects, selector) {
                debug.assertValue(objects, 'objects');
                debug.assertValue(selector, 'selector');
                for (var i = 0, len = objects.length; i < len; i++) {
                    var object = objects[i];
                    if (data.Selector.equals(object.selector, selector))
                        return object;
                }
            }
            function hasExistingObjectProperty(objectDefns, propertyId) {
                debug.assertValue(objectDefns, 'objectDefns');
                debug.assertValue(propertyId, 'propertyId');
                for (var i = 0, len = objectDefns.length; i < len; i++) {
                    var objectDefn = objectDefns[i];
                    if (objectDefn.name === propertyId.objectName && objectDefn.properties[propertyId.propertyName])
                        return true;
                }
                return false;
            }
        })(DataViewObjectEvaluationUtils = data.DataViewObjectEvaluationUtils || (data.DataViewObjectEvaluationUtils = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /** Responsible for evaluating object property expressions to be applied at various scopes in a DataView. */
        var DataViewObjectEvaluator;
        (function (DataViewObjectEvaluator) {
            var colorValueType = powerbi.ValueType.fromDescriptor({ formatting: { color: true } });
            var numericType = powerbi.ValueType.fromDescriptor({ numeric: true });
            function run(objectDescriptor, propertyDefinitions) {
                debug.assertAnyValue(objectDescriptor, 'objectDescriptor');
                debug.assertValue(propertyDefinitions, 'propertyDefinitions');
                if (!objectDescriptor)
                    return;
                var object, propertyDescriptors = objectDescriptor.properties;
                for (var propertyName in propertyDefinitions) {
                    var propertyDefinition = propertyDefinitions[propertyName], propertyDescriptor = propertyDescriptors[propertyName];
                    if (!propertyDescriptor)
                        continue;
                    var propertyValue = evaluateProperty(propertyDescriptor, propertyDefinition);
                    if (propertyValue === undefined)
                        continue;
                    if (!object)
                        object = {};
                    object[propertyName] = propertyValue;
                }
                return object;
            }
            DataViewObjectEvaluator.run = run;
            // Exported for testability
            function evaluateProperty(propertyDescriptor, propertyDefinition) {
                debug.assertValue(propertyDescriptor, 'propertyDescriptor');
                debug.assertValue(propertyDefinition, 'propertyDefinition');
                var value = evaluateValue(propertyDefinition, powerbi.ValueType.fromDescriptor(propertyDescriptor.type));
                if (value !== undefined || (propertyDefinition instanceof data.RuleEvaluation))
                    return value;
                var structuralType = propertyDescriptor.type;
                var valueFill = evaluateFill(propertyDefinition, structuralType);
                if (valueFill)
                    return valueFill;
                var valueFillRule = evaluateFillRule(propertyDefinition, structuralType);
                if (valueFillRule)
                    return valueFillRule;
                return propertyDefinition;
            }
            DataViewObjectEvaluator.evaluateProperty = evaluateProperty;
            function evaluateFill(fillDefn, type) {
                var fillType = type.fill;
                if (!fillType)
                    return;
                if (fillType && fillType.solid && fillType.solid.color && fillDefn.solid) {
                    return {
                        solid: {
                            color: evaluateValue(fillDefn.solid.color, powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Color)),
                        }
                    };
                }
            }
            function evaluateFillRule(fillRuleDefn, type) {
                if (!type.fillRule)
                    return;
                if (fillRuleDefn.linearGradient2) {
                    var linearGradient2 = fillRuleDefn.linearGradient2;
                    return {
                        linearGradient2: {
                            min: evaluateColorStop(linearGradient2.min),
                            max: evaluateColorStop(linearGradient2.max),
                        }
                    };
                }
                if (fillRuleDefn.linearGradient3) {
                    var linearGradient3 = fillRuleDefn.linearGradient3;
                    return {
                        linearGradient3: {
                            min: evaluateColorStop(linearGradient3.min),
                            mid: evaluateColorStop(linearGradient3.mid),
                            max: evaluateColorStop(linearGradient3.max),
                        }
                    };
                }
            }
            function evaluateColorStop(colorStop) {
                debug.assertValue(colorStop, 'colorStop');
                var step = {
                    color: evaluateValue(colorStop.color, colorValueType),
                };
                var value = evaluateValue(colorStop.value, numericType);
                if (value)
                    step.value = value;
                return step;
            }
            function evaluateValue(definition, valueType) {
                if (definition instanceof data.SQExpr)
                    return ExpressionEvaluator.evaluate(definition, valueType);
                if (definition instanceof data.RuleEvaluation)
                    return definition.evaluate();
            }
            /** Responsible for evaluating SQExprs into values. */
            var ExpressionEvaluator = (function (_super) {
                __extends(ExpressionEvaluator, _super);
                function ExpressionEvaluator() {
                    _super.apply(this, arguments);
                }
                ExpressionEvaluator.evaluate = function (expr, type) {
                    if (expr == null)
                        return;
                    return expr.accept(ExpressionEvaluator.instance, type);
                };
                ExpressionEvaluator.prototype.visitConstant = function (expr, type) {
                    // TODO: We should coerce/respect property type.
                    // NOTE: There shouldn't be a need to coerce color strings, since the UI layers can handle that directly.
                    return expr.value;
                };
                ExpressionEvaluator.instance = new ExpressionEvaluator();
                return ExpressionEvaluator;
            })(data.DefaultSQExprVisitorWithArg);
        })(DataViewObjectEvaluator = data.DataViewObjectEvaluator || (data.DataViewObjectEvaluator = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var DataViewObjects;
    (function (DataViewObjects) {
        /** Gets the value of the given object/property pair. */
        function getValue(objects, propertyId, defaultValue) {
            debug.assertAnyValue(objects, 'objects');
            debug.assertValue(propertyId, 'propertyId');
            if (!objects)
                return defaultValue;
            return DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
        }
        DataViewObjects.getValue = getValue;
        /** Gets an object from objects. */
        function getObject(objects, objectName, defaultValue) {
            if (objects && objects[objectName]) {
                return objects[objectName];
            }
            else {
                return defaultValue;
            }
        }
        DataViewObjects.getObject = getObject;
        /** Gets the solid color from a fill property. */
        function getFillColor(objects, propertyId, defaultColor) {
            var value = getValue(objects, propertyId);
            if (!value || !value.solid)
                return defaultColor;
            return value.solid.color;
        }
        DataViewObjects.getFillColor = getFillColor;
    })(DataViewObjects = powerbi.DataViewObjects || (powerbi.DataViewObjects = {}));
    var DataViewObject;
    (function (DataViewObject) {
        function getValue(object, propertyName, defaultValue) {
            debug.assertAnyValue(object, 'object');
            debug.assertValue(propertyName, 'propertyName');
            if (!object)
                return defaultValue;
            var propertyValue = object[propertyName];
            if (propertyValue === undefined)
                return defaultValue;
            return propertyValue;
        }
        DataViewObject.getValue = getValue;
    })(DataViewObject = powerbi.DataViewObject || (powerbi.DataViewObject = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var inherit = powerbi.Prototype.inherit;
        var ArrayExtensions = jsCommon.ArrayExtensions;
        var DataViewPivotCategorical;
        (function (DataViewPivotCategorical) {
            /**
             * Pivots categories in a categorical DataView into valueGroupings.
             * This is akin to a mathematical matrix transpose.
             */
            function apply(dataView) {
                debug.assertValue(dataView, 'dataView');
                var categorical = dataView.categorical;
                if (!categorical)
                    return null;
                var categories = categorical.categories;
                if (!categories || categories.length !== 1)
                    return null;
                var values = categorical.values;
                if (ArrayExtensions.isUndefinedOrEmpty(values) || values.source)
                    return null;
                var category = categories[0], categoryIdentities = category.identity, categoryValues = category.values, pivotedColumns = [], pivotedValues = [];
                for (var rowIdx = 0, rowCount = categoryValues.length; rowIdx < rowCount; rowIdx++) {
                    var categoryValue = categoryValues[rowIdx], categoryIdentity = categoryIdentities[rowIdx];
                    for (var colIdx = 0, colCount = values.length; colIdx < colCount; colIdx++) {
                        var value = values[colIdx], pivotedColumn = inherit(value.source);
                        // A value has a series group, which is not implemented for pivoting -- just give up.
                        if (value.identity)
                            return null;
                        pivotedColumn.groupName = categoryValue;
                        var pivotedValue = {
                            source: pivotedColumn,
                            values: [value.values[rowIdx]],
                            identity: categoryIdentity,
                            min: value.min,
                            max: value.max,
                            subtotal: value.subtotal
                        };
                        var highlights = value.highlights;
                        if (highlights) {
                            pivotedValue.highlights = [highlights[rowIdx]];
                        }
                        pivotedColumns.push(pivotedColumn);
                        pivotedValues.push(pivotedValue);
                    }
                }
                var pivotedMetadata = inherit(dataView.metadata);
                pivotedMetadata.columns = pivotedColumns;
                var values = data.DataViewTransform.createValueColumns(pivotedValues, category.identityFields);
                values.source = category.source;
                return {
                    metadata: pivotedMetadata,
                    categorical: {
                        values: values,
                    },
                    matrix: dataView.matrix
                };
            }
            DataViewPivotCategorical.apply = apply;
        })(DataViewPivotCategorical = data.DataViewPivotCategorical || (data.DataViewPivotCategorical = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var DataViewPivotMatrix;
        (function (DataViewPivotMatrix) {
            /** Pivots row hierarchy members in a matrix DataView into column hierarchy. */
            function apply(dataViewMatrix, context) {
                debug.assertValue(dataViewMatrix, 'dataViewMatrix');
                if (!context.columnHierarchyRewritten)
                    dataViewMatrix.columns = powerbi.Prototype.inherit(dataViewMatrix.columns);
                var columns = dataViewMatrix.columns;
                if (!context.rowHierarchyRewritten)
                    dataViewMatrix.rows = powerbi.Prototype.inherit(dataViewMatrix.rows);
                var rows = dataViewMatrix.rows;
                if (columns.levels.length > 1)
                    return;
                var pivotedRowNode = {
                    level: 0
                };
                var columnLeafNodes = columns.root.children;
                var columnCount = columnLeafNodes.length;
                if (columnCount > 0) {
                    var index = 0;
                    var callback = function (node) {
                        // Collect values and remove them from row leaves
                        if (node.values) {
                            if (!pivotedRowNode.values)
                                pivotedRowNode.values = {};
                            for (var i = 0; i < columnCount; i++)
                                pivotedRowNode.values[index++] = node.values[i];
                            delete node.values;
                        }
                        // Create measure headers if there are more than one measures
                        if (columnCount > 1) {
                            var level = node.level + 1;
                            if (!node.children)
                                node.children = [];
                            for (var j = 0; j < columnCount; j++) {
                                var measureHeaderLeaf = { level: level };
                                // Copy levelSourceIndex from columnLeafNodes (as they might have been reordered)
                                var columnLeafNode = columnLeafNodes[j];
                                measureHeaderLeaf.levelSourceIndex = columnLeafNode.levelSourceIndex;
                                if (node.isSubtotal)
                                    measureHeaderLeaf.isSubtotal = true;
                                node.children.push(measureHeaderLeaf);
                            }
                        }
                    };
                    if (context.hierarchyTreesRewritten) {
                        forEachLeaf(rows.root, callback);
                    }
                    else {
                        dataViewMatrix.columns.root = cloneTreeExecuteOnLeaf(rows.root, callback);
                    }
                }
                else {
                    if (!context.hierarchyTreesRewritten) {
                        dataViewMatrix.columns.root = cloneTree(rows.root);
                    }
                }
                if (columnCount > 1) {
                    // Keep measure headers, but move them to the innermost level
                    var level = { sources: columns.levels[0].sources };
                    rows.levels.push(level);
                    columns.levels.length = 0;
                }
                if (context.hierarchyTreesRewritten) {
                    dataViewMatrix.columns.root = rows.root;
                    dataViewMatrix.rows.root = {
                        children: [pivotedRowNode]
                    };
                }
                else {
                    var updatedRowRoot = powerbi.Prototype.inherit(dataViewMatrix.rows.root);
                    updatedRowRoot.children = [pivotedRowNode];
                    dataViewMatrix.rows.root = updatedRowRoot;
                }
                dataViewMatrix.columns.levels = rows.levels;
                dataViewMatrix.rows.levels = [];
            }
            DataViewPivotMatrix.apply = apply;
            function forEachLeaf(root, callback) {
                var children = root.children;
                if (children && children.length > 0) {
                    for (var i = 0, ilen = children.length; i < ilen; i++)
                        forEachLeaf(children[i], callback);
                    return;
                }
                callback(root);
            }
            function cloneTree(node) {
                return cloneTreeExecuteOnLeaf(node);
            }
            DataViewPivotMatrix.cloneTree = cloneTree;
            function cloneTreeExecuteOnLeaf(node, callback) {
                var updatedNode = powerbi.Prototype.inherit(node);
                var children = node.children;
                if (children && children.length > 0) {
                    var newChildren = [];
                    for (var i = 0, ilen = children.length; i < ilen; i++) {
                        var updatedChild = cloneTreeExecuteOnLeaf(children[i], callback);
                        newChildren.push(updatedChild);
                    }
                    updatedNode.children = newChildren;
                }
                else {
                    if (callback)
                        callback(updatedNode);
                }
                return updatedNode;
            }
            DataViewPivotMatrix.cloneTreeExecuteOnLeaf = cloneTreeExecuteOnLeaf;
        })(DataViewPivotMatrix = data.DataViewPivotMatrix || (data.DataViewPivotMatrix = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var DataViewSelfCrossJoin;
        (function (DataViewSelfCrossJoin) {
            /**
             * Returns a new DataView based on the original, with a single DataViewCategorical category that is "cross joined"
             * to itself as a value grouping.
             * This is the mathematical equivalent of taking an array and turning it into an identity matrix.
             */
            function apply(dataView) {
                debug.assertValue(dataView, 'dataView');
                if (!dataView.categorical)
                    return;
                var dataViewCategorical = dataView.categorical;
                if (!dataViewCategorical.categories || dataViewCategorical.categories.length !== 1)
                    return;
                if (dataViewCategorical.values && dataViewCategorical.values.source)
                    return;
                return applyCategorical(dataView.metadata, dataViewCategorical);
            }
            DataViewSelfCrossJoin.apply = apply;
            function applyCategorical(dataViewMetadata, dataViewCategorical) {
                debug.assertValue(dataViewMetadata, 'dataViewMetadata');
                debug.assertValue(dataViewCategorical, 'dataViewCategorical');
                debug.assertValue(dataViewCategorical.categories, 'dataViewCategorical.categories');
                dataViewMetadata = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadata.columns = [];
                var valuesArray = dataViewCategorical.values ? dataViewCategorical.values.grouped()[0].values : [];
                var category = dataViewCategorical.categories[0], categoryValues = category.values, categoryLength = categoryValues.length;
                if (categoryLength === 0)
                    return;
                var categoryIdentities = category.identity, crossJoinedValuesArray = [], nullValuesArray = createNullValues(categoryLength);
                debug.assertValue(categoryIdentities, 'categoryIdentities');
                dataViewMetadata.columns.push(category.source);
                for (var i = 0; i < categoryLength; i++) {
                    var identity = categoryIdentities[i], categoryValue = categoryValues[i];
                    for (var j = 0, jlen = valuesArray.length; j < jlen; j++) {
                        var originalValueColumn = valuesArray[j], originalHighlightValues = originalValueColumn.highlights;
                        var crossJoinedValueColumnSource = powerbi.Prototype.inherit(originalValueColumn.source);
                        crossJoinedValueColumnSource.groupName = categoryValue;
                        dataViewMetadata.columns.push(crossJoinedValueColumnSource);
                        var crossJoinedValueColumn = {
                            source: crossJoinedValueColumnSource,
                            identity: identity,
                            values: inheritArrayWithValue(nullValuesArray, originalValueColumn.values, i),
                        };
                        if (originalHighlightValues)
                            crossJoinedValueColumn.highlights = inheritArrayWithValue(nullValuesArray, originalHighlightValues, i);
                        crossJoinedValuesArray.push(crossJoinedValueColumn);
                    }
                }
                var crossJoinedValues = data.DataViewTransform.createValueColumns(crossJoinedValuesArray, category.identityFields);
                crossJoinedValues.source = category.source;
                return {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: dataViewCategorical.categories,
                        values: crossJoinedValues,
                    },
                };
            }
            function createNullValues(length) {
                debug.assertValue(length, 'length');
                var array = new Array(length);
                for (var i = 0; i < length; i++)
                    array[i] = null;
                return array;
            }
            function inheritArrayWithValue(nullValues, original, index) {
                var inherited = powerbi.Prototype.inherit(nullValues);
                inherited[index] = original[index];
                return inherited;
            }
        })(DataViewSelfCrossJoin = data.DataViewSelfCrossJoin || (data.DataViewSelfCrossJoin = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        function createDisplayNameGetter(displayNameKey) {
            return function (resourceProvider) { return resourceProvider.get(displayNameKey); };
        }
        data.createDisplayNameGetter = createDisplayNameGetter;
        function getDisplayName(displayNameGetter, resourceProvider) {
            if (typeof displayNameGetter === 'function')
                return displayNameGetter(resourceProvider);
            if (typeof displayNameGetter === 'string')
                return displayNameGetter;
        }
        data.getDisplayName = getDisplayName;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    /** Enumeration of DateTimeUnits */
    (function (DateTimeUnit) {
        DateTimeUnit[DateTimeUnit["Year"] = 0] = "Year";
        DateTimeUnit[DateTimeUnit["Month"] = 1] = "Month";
        DateTimeUnit[DateTimeUnit["Week"] = 2] = "Week";
        DateTimeUnit[DateTimeUnit["Day"] = 3] = "Day";
        DateTimeUnit[DateTimeUnit["Hour"] = 4] = "Hour";
        DateTimeUnit[DateTimeUnit["Minute"] = 5] = "Minute";
        DateTimeUnit[DateTimeUnit["Second"] = 6] = "Second";
        DateTimeUnit[DateTimeUnit["Millisecond"] = 7] = "Millisecond";
    })(powerbi.DateTimeUnit || (powerbi.DateTimeUnit = {}));
    var DateTimeUnit = powerbi.DateTimeUnit;
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        function createDataProviderFactory(plugins) {
            return new DataProviderFactory(plugins);
        }
        data.createDataProviderFactory = createDataProviderFactory;
        var DataProviderFactory = (function () {
            function DataProviderFactory(plugins) {
                debug.assertValue(plugins, 'plugins');
                this.plugins = plugins;
            }
            /** Returns the IDataProvider plugin for the specified type, if any.  If the type is unspecified, dsr is assumed. */
            DataProviderFactory.prototype.getPlugin = function (type) {
                var plugin = this.plugins[normalizeProviderName(type || 'dsr')];
                if (!plugin) {
                    debug.assertFail('Failed to load DataPlugin of type: ' + type);
                    return;
                }
                return plugin;
            };
            return DataProviderFactory;
        })();
        var DataProviderUtils;
        (function (DataProviderUtils) {
            /** Finds the IDataProvider plugin name referred to by the set of references. */
            function findType(references) {
                var type;
                for (var i = 0, len = references.length; i < len; i++) {
                    var currentType = normalizeProviderName(references[i].type);
                    if (type && type !== currentType)
                        return;
                    type = currentType;
                }
                return type;
            }
            DataProviderUtils.findType = findType;
        })(DataProviderUtils = data.DataProviderUtils || (data.DataProviderUtils = {}));
        function normalizeProviderName(type) {
            return type || 'dsr';
        }
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var DataViewAnalysis;
    (function (DataViewAnalysis) {
        var ArrayExtensions = jsCommon.ArrayExtensions;
        /** Reshapes the data view to match the provided schema if possible. If not, returns null */
        function validateAndReshape(dataView, dataViewMappings) {
            if (!dataViewMappings || dataViewMappings.length === 0)
                return { dataView: dataView, isValid: true };
            if (dataView) {
                var dataViewMapping = dataViewMappings[0];
                // Keep the original when possible.
                if (supports(dataView, dataViewMapping))
                    return { dataView: dataView, isValid: true };
                if (dataViewMapping.categorical)
                    return reshapeCategorical(dataView, dataViewMapping);
                if (dataViewMapping.tree)
                    return reshapeTree(dataView, dataViewMapping.tree);
                if (dataViewMapping.single)
                    return reshapeSingle(dataView, dataViewMapping.single);
                if (dataViewMapping.table)
                    return reshapeTable(dataView, dataViewMapping.table);
            }
            return { isValid: false };
        }
        DataViewAnalysis.validateAndReshape = validateAndReshape;
        function reshapeCategorical(dataView, dataViewMapping) {
            debug.assertValue(dataViewMapping, 'dataViewMapping');
            //The functionality that used to compare categorical.values.length to schema.values doesn't apply any more, we don't want to use the same logic for re-shaping.
            var categoryRoleMapping = dataViewMapping.categorical;
            var categorical = dataView.categorical;
            if (!categorical)
                return { isValid: false };
            var rowCount;
            if (categoryRoleMapping.rowCount) {
                rowCount = categoryRoleMapping.rowCount.supported;
                if (rowCount && rowCount.max) {
                    var updated;
                    var categories = categorical.categories;
                    var maxRowCount = rowCount.max;
                    if (categories) {
                        for (var i = 0, len = categories.length; i < len; i++) {
                            var category = categories[i];
                            var originalLength = category.values.length;
                            if (maxRowCount !== undefined && originalLength > maxRowCount) {
                                // Row count too large: Trim it to fit.
                                var updatedCategories = ArrayExtensions.range(category.values, 0, maxRowCount - 1);
                                updated = updated || { categories: [] };
                                updated.categories.push({
                                    source: category.source,
                                    values: updatedCategories
                                });
                            }
                        }
                    }
                    if (categorical.values && categorical.values.length > 0 && maxRowCount) {
                        if (!originalLength)
                            originalLength = categorical.values[0].values.length;
                        if (maxRowCount !== undefined && originalLength > maxRowCount) {
                            updated = updated || {};
                            updated.values = powerbi.data.DataViewTransform.createValueColumns();
                            for (var i = 0, len = categorical.values.length; i < len; i++) {
                                var column = categorical.values[i], updatedColumn = {
                                    source: column.source,
                                    values: ArrayExtensions.range(column.values, 0, maxRowCount - 1)
                                };
                                if (column.min !== undefined)
                                    updatedColumn.min = column.min;
                                if (column.max !== undefined)
                                    updatedColumn.max = column.max;
                                if (column.subtotal !== undefined)
                                    updatedColumn.subtotal = column.subtotal;
                                updated.values.push(updatedColumn);
                            }
                        }
                    }
                    if (updated) {
                        dataView = {
                            metadata: dataView.metadata,
                            categorical: updated,
                        };
                    }
                }
            }
            if (supportsCategorical(dataView, dataViewMapping))
                return { dataView: dataView, isValid: true };
            return null;
        }
        function reshapeSingle(dataView, singleRoleMapping) {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(singleRoleMapping, 'singleRoleMapping');
            if (dataView.single)
                return { dataView: dataView, isValid: true };
            return { isValid: false };
        }
        function reshapeTree(dataView, treeRoleMapping) {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(treeRoleMapping, 'treeRoleMapping');
            // TODO: Need to implement the reshaping of Tree
            var metadata = dataView.metadata;
            if (conforms(countGroups(metadata.columns), treeRoleMapping.depth))
                return { dataView: dataView, isValid: true };
            return { isValid: false };
        }
        function reshapeTable(dataView, tableRoleMapping) {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(tableRoleMapping, 'tableRoleMapping');
            if (dataView.table)
                return { dataView: dataView, isValid: true };
            return { isValid: false };
        }
        function countGroups(columns) {
            var count = 0;
            for (var i = 0, len = columns.length; i < len; i++) {
                if (!columns[i].isMeasure)
                    ++count;
            }
            return count;
        }
        DataViewAnalysis.countGroups = countGroups;
        function countMeasures(columns) {
            var count = 0;
            for (var i = 0, len = columns.length; i < len; i++) {
                if (columns[i].isMeasure)
                    ++count;
            }
            return count;
        }
        DataViewAnalysis.countMeasures = countMeasures;
        /** Indicates whether the dataView conforms to the specified schema. */
        function supports(dataView, roleMapping, usePreferredDataViewSchema) {
            if (!roleMapping || !dataView)
                return false;
            if (roleMapping.categorical && !supportsCategorical(dataView, roleMapping.categorical, usePreferredDataViewSchema))
                return false;
            if (roleMapping.tree && !supportsTree(dataView, roleMapping.tree))
                return false;
            if (roleMapping.single && !supportsSingle(dataView.single, roleMapping.single))
                return false;
            if (roleMapping.table && !supportsTable(dataView.table, roleMapping.table, usePreferredDataViewSchema))
                return false;
            return true;
        }
        DataViewAnalysis.supports = supports;
        function supportsCategorical(dataView, categoryRoleMapping, usePreferredDataViewSchema) {
            debug.assertValue(categoryRoleMapping, 'categoryRoleMapping');
            var dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical)
                return false;
            // TODO: Disabling this implementation isn't right.
            //if (!conforms(countMeasures(dataView.metadata.columns), categoryRoleMapping.values.roles.length))
            //    return false;
            if (categoryRoleMapping.rowCount) {
                var rowCount = categoryRoleMapping.rowCount.supported;
                if (usePreferredDataViewSchema && categoryRoleMapping.rowCount.preferred)
                    rowCount = categoryRoleMapping.rowCount.preferred;
                if (rowCount) {
                    var len = 0;
                    if (dataViewCategorical.values && dataViewCategorical.values.length)
                        len = dataViewCategorical.values[0].values.length;
                    else if (dataViewCategorical.categories && dataViewCategorical.categories.length)
                        len = dataViewCategorical.categories[0].values.length;
                    if (!conforms(len, rowCount))
                        return false;
                }
            }
            return true;
        }
        function supportsSingle(dataViewSingle, singleRoleMapping) {
            debug.assertValue(singleRoleMapping, 'singleRoleMapping');
            if (!dataViewSingle)
                return false;
            return true;
        }
        function supportsTree(dataView, treeRoleMapping) {
            debug.assertValue(treeRoleMapping, 'treeRoleMapping');
            var metadata = dataView.metadata;
            return conforms(countGroups(metadata.columns), treeRoleMapping.depth);
        }
        function supportsTable(dataViewTable, tableRoleMapping, usePreferredDataViewSchema) {
            debug.assertValue(tableRoleMapping, 'tableRoleMapping');
            if (!dataViewTable)
                return false;
            if (tableRoleMapping.rowCount) {
                var rowCount = tableRoleMapping.rowCount.supported;
                if (usePreferredDataViewSchema && tableRoleMapping.rowCount.preferred)
                    rowCount = tableRoleMapping.rowCount.preferred;
                if (rowCount) {
                    var len = 0;
                    if (dataViewTable.rows && dataViewTable.rows.length)
                        len = dataViewTable.rows.length;
                    if (!conforms(len, rowCount))
                        return false;
                }
            }
            return true;
        }
        function conforms(value, range) {
            debug.assertValue(value, 'value');
            if (!range)
                return value === 0;
            if (range.min !== undefined && range.min > value)
                return false;
            if (range.max !== undefined && range.max < value)
                return false;
            return true;
        }
        DataViewAnalysis.conforms = conforms;
        /** Determines the appropriate DataViewMappings for the projections. */
        function chooseDataViewMappings(projections, mappings) {
            debug.assertValue(projections, 'projections');
            debug.assertValue(mappings, 'mappings');
            var supportedMappings = [];
            for (var i = 0, len = mappings.length; i < len; i++) {
                var mapping = mappings[i], mappingConditions = mapping.conditions;
                if (mappingConditions && mappingConditions.length) {
                    for (var j = 0, jlen = mappingConditions.length; j < jlen; j++) {
                        var condition = mappingConditions[j];
                        if (matchesCondition(projections, condition)) {
                            supportedMappings.push(mapping);
                            break;
                        }
                    }
                }
                else {
                    supportedMappings.push(mapping);
                }
            }
            return ArrayExtensions.emptyToNull(supportedMappings);
        }
        DataViewAnalysis.chooseDataViewMappings = chooseDataViewMappings;
        function matchesCondition(projections, condition) {
            debug.assertValue(projections, 'projections');
            debug.assertValue(condition, 'condition');
            var conditionRoles = Object.keys(condition);
            for (var i = 0, len = conditionRoles.length; i < len; i++) {
                var roleName = conditionRoles[i], range = condition[roleName];
                var roleCount = getPropertyCount(roleName, projections);
                if (!conforms(roleCount, range))
                    return false;
            }
            return true;
        }
        function getPropertyCount(roleName, projections) {
            debug.assertValue(roleName, 'roleName');
            debug.assertValue(projections, 'projections');
            var projectionsForRole = projections[roleName];
            if (projectionsForRole)
                return projectionsForRole.length;
            return 0;
        }
        DataViewAnalysis.getPropertyCount = getPropertyCount;
        function hasSameCategoryIdentity(dataView1, dataView2) {
            if (dataView1 && dataView2 && dataView1.categorical && dataView2.categorical) {
                var dv1Categories = dataView1.categorical.categories;
                var dv2Categories = dataView2.categorical.categories;
                if (dv1Categories && dv2Categories && dv1Categories.length === dv2Categories.length) {
                    for (var i = 0, len = dv1Categories.length; i < len; i++) {
                        var dv1Identity = dv1Categories[i].identity;
                        var dv2Identity = dv2Categories[i].identity;
                        if ((dv1Identity != null) !== (dv2Identity != null))
                            return false;
                        if (dv1Identity.length !== dv2Identity.length) {
                            return false;
                        }
                        for (var j = 0, jlen = dv1Identity.length; j < jlen; j++) {
                            if (!powerbi.DataViewScopeIdentity.equals(dv1Identity[j], dv2Identity[j]))
                                return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        }
        DataViewAnalysis.hasSameCategoryIdentity = hasSameCategoryIdentity;
    })(DataViewAnalysis = powerbi.DataViewAnalysis || (powerbi.DataViewAnalysis = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var ArrayExtensions = jsCommon.ArrayExtensions;
    var DataViewScopeIdentity;
    (function (DataViewScopeIdentity) {
        /** Compares the two DataViewScopeIdentity values for equality. */
        function equals(x, y, ignoreCase) {
            // Normalize falsy to null
            x = x || null;
            y = y || null;
            if (x === y)
                return true;
            if (!x !== !y)
                return false;
            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');
            return data.SQExpr.equals(x.expr, y.expr, ignoreCase);
        }
        DataViewScopeIdentity.equals = equals;
        function filterFromIdentity(identities, isNot) {
            if (ArrayExtensions.isUndefinedOrEmpty(identities))
                return;
            var expr;
            for (var i = 0, len = identities.length; i < len; i++) {
                var identity = identities[i];
                expr = expr ? powerbi.data.SQExprBuilder.or(expr, identity.expr) : identity.expr;
            }
            if (expr && isNot)
                expr = powerbi.data.SQExprBuilder.not(expr);
            return powerbi.data.SemanticFilter.fromSQExpr(expr);
        }
        DataViewScopeIdentity.filterFromIdentity = filterFromIdentity;
    })(DataViewScopeIdentity = powerbi.DataViewScopeIdentity || (powerbi.DataViewScopeIdentity = {}));
    var data;
    (function (data) {
        var Lazy = jsCommon.Lazy;
        function createDataViewScopeIdentity(expr) {
            return new DataViewScopeIdentityImpl(expr);
        }
        data.createDataViewScopeIdentity = createDataViewScopeIdentity;
        var DataViewScopeIdentityImpl = (function () {
            function DataViewScopeIdentityImpl(expr) {
                debug.assertValue(expr, 'expr');
                this._expr = expr;
                this._key = new Lazy(function () { return data.SQExprShortSerializer.serialize(expr); });
            }
            Object.defineProperty(DataViewScopeIdentityImpl.prototype, "expr", {
                get: function () {
                    return this._expr;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataViewScopeIdentityImpl.prototype, "key", {
                get: function () {
                    return this._key.getValue();
                },
                enumerable: true,
                configurable: true
            });
            return DataViewScopeIdentityImpl;
        })();
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var Lazy = jsCommon.Lazy;
        var DataViewScopeWildcard;
        (function (DataViewScopeWildcard) {
            function matches(wildcard, instance) {
                var instanceExprs = data.ScopeIdentityKeyExtractor.run(instance.expr);
                if (!instanceExprs)
                    return false;
                return data.SQExprUtils.sequenceEqual(wildcard.exprs, instanceExprs);
            }
            DataViewScopeWildcard.matches = matches;
            function fromExprs(exprs) {
                return new DataViewScopeWildcardImpl(exprs);
            }
            DataViewScopeWildcard.fromExprs = fromExprs;
            var DataViewScopeWildcardImpl = (function () {
                function DataViewScopeWildcardImpl(exprs) {
                    debug.assertValue(exprs, 'exprs');
                    this._exprs = exprs;
                    this._key = new Lazy(function () { return data.SQExprShortSerializer.serializeArray(exprs); });
                }
                Object.defineProperty(DataViewScopeWildcardImpl.prototype, "exprs", {
                    get: function () {
                        return this._exprs;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataViewScopeWildcardImpl.prototype, "key", {
                    get: function () {
                        return this._key.getValue();
                    },
                    enumerable: true,
                    configurable: true
                });
                return DataViewScopeWildcardImpl;
            })();
        })(DataViewScopeWildcard = data.DataViewScopeWildcard || (data.DataViewScopeWildcard = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var inherit = powerbi.Prototype.inherit;
        var ArrayExtensions = jsCommon.ArrayExtensions;
        var CategoricalDataViewTransformation;
        (function (CategoricalDataViewTransformation) {
            CategoricalDataViewTransformation[CategoricalDataViewTransformation["None"] = 0] = "None";
            CategoricalDataViewTransformation[CategoricalDataViewTransformation["Pivot"] = 1] = "Pivot";
            CategoricalDataViewTransformation[CategoricalDataViewTransformation["SelfCrossJoin"] = 2] = "SelfCrossJoin";
        })(CategoricalDataViewTransformation || (CategoricalDataViewTransformation = {}));
        // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
        var DataViewTransform;
        (function (DataViewTransform) {
            function apply(options) {
                debug.assertValue(options, 'options');
                // TODO: Flow a context object through to capture errors/warnings about what happens here for better diagnosability.
                var prototype = options.prototype, objectDescriptors = options.objectDescriptors, dataViewMappings = options.dataViewMappings, transforms = options.transforms, colorAllocatorFactory = options.colorAllocatorFactory;
                if (!prototype)
                    return transformEmptyDataView(objectDescriptors, transforms, colorAllocatorFactory);
                if (!transforms)
                    return [prototype];
                var splits = transforms.splits;
                if (ArrayExtensions.isUndefinedOrEmpty(splits)) {
                    return [transformDataView(prototype, objectDescriptors, dataViewMappings, transforms, colorAllocatorFactory)];
                }
                var transformedDataviews = [];
                for (var i = 0, len = splits.length; i < len; i++) {
                    var transformed = transformDataView(prototype, objectDescriptors, dataViewMappings, transforms, colorAllocatorFactory, splits[i].selects);
                    transformedDataviews.push(transformed);
                }
                return transformedDataviews;
            }
            DataViewTransform.apply = apply;
            function transformEmptyDataView(objectDescriptors, transforms, colorAllocatorFactory) {
                if (transforms && transforms.objects) {
                    var emptyDataView = {
                        metadata: {
                            columns: [],
                        }
                    };
                    transformObjects(emptyDataView, objectDescriptors, transforms.objects, transforms.selects, colorAllocatorFactory);
                    return [emptyDataView];
                }
                return [];
            }
            function transformDataView(prototype, objectDescriptors, roleMappings, transforms, colorAllocatorFactory, selectsToInclude) {
                debug.assertValue(prototype, 'prototype');
                var transformed = inherit(prototype);
                transformed.metadata = inherit(prototype.metadata);
                transformed = transformSelects(transformed, roleMappings, transforms.selects, transforms.projectionOrdering, selectsToInclude);
                transformObjects(transformed, objectDescriptors, transforms.objects, transforms.selects, colorAllocatorFactory);
                return transformed;
            }
            function transformSelects(dataView, roleMappings, selectTransforms, projectionOrdering, selectsToInclude) {
                var columnRewrites = [];
                if (selectTransforms) {
                    dataView.metadata.columns = applyTransformsToColumns(dataView.metadata.columns, selectTransforms, columnRewrites);
                }
                // NOTE: no rewrites necessary for Tree (it doesn't reference the columns)
                if (dataView.categorical) {
                    dataView.categorical = applyRewritesToCategorical(dataView.categorical, columnRewrites, selectsToInclude);
                    // NOTE: This is slightly DSR-specific.
                    dataView = pivotIfNecessary(dataView, roleMappings);
                }
                if (dataView.matrix) {
                    var matrixTransformationContext = {
                        rowHierarchyRewritten: false,
                        columnHierarchyRewritten: false,
                        hierarchyTreesRewritten: false
                    };
                    dataView.matrix = applyRewritesToMatrix(dataView.matrix, columnRewrites, roleMappings, projectionOrdering, matrixTransformationContext);
                    if (shouldPivotMatrix(dataView.matrix, roleMappings))
                        data.DataViewPivotMatrix.apply(dataView.matrix, matrixTransformationContext);
                }
                if (dataView.table)
                    dataView.table = applyRewritesToTable(dataView.table, columnRewrites, roleMappings, projectionOrdering);
                return dataView;
            }
            function applyTransformsToColumns(prototypeColumns, selects, rewrites) {
                debug.assertValue(prototypeColumns, 'columns');
                if (!selects)
                    return prototypeColumns;
                var columns = inherit(prototypeColumns);
                for (var i = 0, len = prototypeColumns.length; i < len; i++) {
                    var prototypeColumn = prototypeColumns[i];
                    var select = selects[prototypeColumn.index];
                    if (!select)
                        continue;
                    var column = columns[i] = inherit(prototypeColumn);
                    if (select.roles)
                        column.roles = select.roles;
                    if (select.type)
                        column.type = select.type;
                    column.format = getFormatForColumn(select, column);
                    if (select.displayName)
                        column.displayName = select.displayName;
                    if (select.queryName)
                        column.queryName = select.queryName;
                    rewrites.push({
                        from: prototypeColumn,
                        to: column,
                    });
                }
                return columns;
            }
            /** Get the column format. Order of precendence is:
            * 1. Select format
            * 2. Column format
            * 3. Default PowerView policy for column type
            */
            function getFormatForColumn(select, column) {
                // TODO: we already copied the select.Format to column.format, we probably don't need this check
                if (select.format)
                    return select.format;
                if (column.format)
                    return column.format;
                // TODO: deprecate this, default format string logic has been added to valueFormatter
                var type = column.type;
                if (type) {
                    if (type.dateTime)
                        return 'd';
                    if (type.integer)
                        return 'g';
                    if (type.numeric)
                        return '#,0.00';
                }
                return undefined;
            }
            // Exported for testability
            function upgradeSettingsToObjects(settings, objectDefns) {
                if (!settings)
                    return;
                if (!objectDefns)
                    objectDefns = {};
                for (var propertyKey in settings) {
                    var propertyValue = settings[propertyKey], upgradedPropertyKey = propertyKey, upgradedPropertyValue = propertyValue, objectName = 'general';
                    switch (propertyKey) {
                        case 'hasScalarCategoryAxis':
                            // hasScalarCategoryAxis -> categoryAxis.axisType
                            objectName = 'categoryAxis';
                            upgradedPropertyKey = 'axisType';
                            upgradedPropertyValue = data.SQExprBuilder.text(propertyValue ? powerbi.axisType.scalar : powerbi.axisType.categorical);
                            break;
                        case 'Totals':
                            // Totals -> general.totals
                            upgradedPropertyKey = 'totals';
                            upgradedPropertyValue = data.SQExprBuilder.boolean(!!propertyValue);
                            break;
                        case 'textboxSettings':
                            // textboxSettings.paragraphs -> general.paragraphs
                            upgradedPropertyKey = 'paragraphs';
                            if (propertyValue && propertyValue.paragraphs)
                                upgradedPropertyValue = propertyValue.paragraphs;
                            break;
                        case 'VisualType1':
                            // VisualType1 -> general.visualType1
                            upgradedPropertyKey = 'visualType1';
                            upgradedPropertyValue = data.SQExprBuilder.text(propertyValue);
                            break;
                        case 'VisualType2':
                            // VisualType2 -> general.visualType2
                            upgradedPropertyKey = 'visualType2';
                            upgradedPropertyValue = data.SQExprBuilder.text(propertyValue);
                            break;
                        case 'imageVisualSettings':
                            // imageVisualSettings.imageUrl -> general.imageUrl
                            upgradedPropertyKey = 'imageUrl';
                            if (propertyValue && propertyValue.imageUrl)
                                upgradedPropertyValue = data.SQExprBuilder.text(propertyValue.imageUrl);
                            break;
                        default:
                            continue;
                    }
                    setObjectDefinition(objectDefns, objectName, upgradedPropertyKey, upgradedPropertyValue);
                }
                return objectDefns;
            }
            DataViewTransform.upgradeSettingsToObjects = upgradeSettingsToObjects;
            function setObjectDefinition(objects, objectName, propertyName, value) {
                debug.assertValue(objects, 'objects');
                debug.assertValue(objectName, 'objectName');
                debug.assertValue(propertyName, 'propertyName');
                var objectContainer = objects[objectName];
                if (objectContainer === undefined)
                    objectContainer = objects[objectName] = [];
                var object = objectContainer[0];
                if (object === undefined)
                    object = objectContainer[0] = { properties: {} };
                object.properties[propertyName] = value;
            }
            function applyRewritesToCategorical(prototype, columnRewrites, selectsToInclude) {
                debug.assertValue(prototype, 'prototype');
                debug.assertValue(columnRewrites, 'columnRewrites');
                var categorical = inherit(prototype);
                function override(value) {
                    var rewrittenSource = findOverride(value.source, columnRewrites);
                    if (rewrittenSource) {
                        var rewritten = inherit(value);
                        rewritten.source = rewrittenSource;
                        return rewritten;
                    }
                }
                var categories = powerbi.Prototype.overrideArray(prototype.categories, override);
                if (categories)
                    categorical.categories = categories;
                var values = powerbi.Prototype.overrideArray(prototype.values, override);
                if (values) {
                    if (selectsToInclude) {
                        for (var i = values.length - 1; i >= 0; i--) {
                            if (!selectsToInclude[values[i].source.index])
                                values.splice(i, 1);
                        }
                    }
                    if (values.source) {
                        if (selectsToInclude && !selectsToInclude[values.source.index]) {
                            values.source = undefined;
                        }
                        else {
                            var rewrittenValuesSource = findOverride(values.source, columnRewrites);
                            if (rewrittenValuesSource)
                                values.source = rewrittenValuesSource;
                        }
                    }
                    categorical.values = values;
                    setGrouped(values);
                }
                return categorical;
            }
            function applyRewritesToTable(prototype, columnRewrites, roleMappings, projectionOrdering) {
                debug.assertValue(prototype, 'prototype');
                debug.assertValue(columnRewrites, 'columnRewrites');
                // Don't perform this potentially expensive transform unless we actually have a table. 
                // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
                if (!roleMappings || roleMappings.length !== 1 || !roleMappings[0].table)
                    return prototype;
                var table = inherit(prototype);
                // Copy the rewritten columns into the table view
                var override = function (metadata) { return findOverride(metadata, columnRewrites); };
                var columns = powerbi.Prototype.overrideArray(prototype.columns, override);
                if (columns)
                    table.columns = columns;
                if (!projectionOrdering)
                    return table;
                var newToOldPositions = createTableColumnPositionMapping(projectionOrdering, columnRewrites);
                if (!newToOldPositions)
                    return table;
                // Reorder the columns
                var columnsClone = columns.slice(0);
                var keys = Object.keys(newToOldPositions);
                for (var i = 0, len = keys.length; i < len; i++) {
                    var sourceColumn = columnsClone[newToOldPositions[keys[i]]];
                    // In the case we've hit the end of our columns array, but still have position reordering keys,
                    // there is a duplicate column so we will need to add a new column for the duplicate data
                    if (i === columns.length)
                        columns.push(sourceColumn);
                    else {
                        debug.assert(i < columns.length, 'The column index is out of range for reordering.');
                        columns[i] = sourceColumn;
                    }
                }
                // Reorder the rows
                var rows = powerbi.Prototype.overrideArray(table.rows, function (row) {
                    var newRow = [];
                    for (var i = 0, len = keys.length; i < len; ++i)
                        newRow[i] = row[newToOldPositions[keys[i]]];
                    return newRow;
                });
                if (rows)
                    table.rows = rows;
                return table;
            }
            // Creates a mapping of new position to original position.
            function createTableColumnPositionMapping(projectionOrdering, columnRewrites) {
                var roles = Object.keys(projectionOrdering);
                debug.assert(roles.length === 1, "Tables should have exactly one role.");
                var role = roles[0], originalOrder = columnRewrites.map(function (rewrite) { return rewrite.from.index; }), newOrder = projectionOrdering[role];
                // Optimization: avoid rewriting the table if all columns are in their default positions.
                if (ArrayExtensions.sequenceEqual(originalOrder, newOrder, function (x, y) { return x === y; }))
                    return;
                return createOrderMapping(originalOrder, newOrder);
            }
            function applyRewritesToMatrix(prototype, columnRewrites, roleMappings, projectionOrdering, context) {
                debug.assertValue(prototype, 'prototype');
                debug.assertValue(columnRewrites, 'columnRewrites');
                // Don't perform this potentially expensive transform unless we actually have a matrix. 
                // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
                if (!roleMappings || roleMappings.length !== 1 || !roleMappings[0].matrix)
                    return prototype;
                var matrix = inherit(prototype);
                function override(metadata) {
                    return findOverride(metadata, columnRewrites);
                }
                function overrideHierarchy(hierarchy) {
                    var rewrittenHierarchy = null;
                    var newLevels = powerbi.Prototype.overrideArray(hierarchy.levels, function (level) {
                        var newLevel = null;
                        var levelSources = powerbi.Prototype.overrideArray(level.sources, override);
                        if (levelSources)
                            newLevel = ensureRewritten(newLevel, level, function (h) { return h.sources = levelSources; });
                        return newLevel;
                    });
                    if (newLevels)
                        rewrittenHierarchy = ensureRewritten(rewrittenHierarchy, hierarchy, function (r) { return r.levels = newLevels; });
                    return rewrittenHierarchy;
                }
                var rows = overrideHierarchy(matrix.rows);
                if (rows) {
                    matrix.rows = rows;
                    context.rowHierarchyRewritten = true;
                }
                var columns = overrideHierarchy(matrix.columns);
                if (columns) {
                    matrix.columns = columns;
                    context.columnHierarchyRewritten = true;
                }
                var valueSources = powerbi.Prototype.overrideArray(matrix.valueSources, override);
                if (valueSources) {
                    matrix.valueSources = valueSources;
                    // Only need to reorder if we have more than one value source
                    if (projectionOrdering && valueSources.length > 1) {
                        var columnLevels = columns.levels.length;
                        if (columnLevels > 0) {
                            var newToOldPositions = createMatrixValuesPositionMapping(roleMappings[0].matrix, projectionOrdering, valueSources, columnRewrites);
                            if (newToOldPositions) {
                                var keys = Object.keys(newToOldPositions);
                                var numKeys = keys.length;
                                // Reorder the value columns
                                columns.root = data.DataViewPivotMatrix.cloneTree(columns.root);
                                if (columnLevels === 1)
                                    reorderChildNodes(columns.root, newToOldPositions);
                                else
                                    forEachNodeAtLevel(columns.root, columnLevels - 2, function (node) { return reorderChildNodes(node, newToOldPositions); });
                                // Reorder the value rows
                                matrix.rows.root = data.DataViewPivotMatrix.cloneTreeExecuteOnLeaf(matrix.rows.root, function (node) {
                                    var newValues = {};
                                    var iterations = Object.keys(node.values).length / numKeys;
                                    for (var i = 0, len = iterations; i < len; i++) {
                                        var offset = i * numKeys;
                                        for (var keysIndex = 0; keysIndex < numKeys; keysIndex++)
                                            newValues[offset + keysIndex] = node.values[offset + newToOldPositions[keys[keysIndex]]];
                                    }
                                    node.values = newValues;
                                });
                                context.hierarchyTreesRewritten = true;
                            }
                        }
                    }
                }
                return matrix;
            }
            function reorderChildNodes(node, newToOldPositions) {
                var keys = Object.keys(newToOldPositions);
                var numKeys = keys.length;
                var children = node.children;
                var childrenClone = children.slice(0);
                for (var i = 0, len = numKeys; i < len; i++) {
                    var sourceColumn = childrenClone[newToOldPositions[keys[i]]];
                    // In the case we've hit the end of our columns array, but still have position reordering keys,
                    // there is a duplicate column so we will need to add a new column for the duplicate data
                    if (i === children.length)
                        children.push(sourceColumn);
                    else {
                        debug.assert(i < children.length, 'The column index is out of range for reordering.');
                        children[i] = sourceColumn;
                    }
                }
            }
            // Creates a mapping of new position to original position.
            function createMatrixValuesPositionMapping(matrixMapping, projectionOrdering, valueSources, columnRewrites) {
                var role = matrixMapping.values.for.in;
                function matchValueSource(columnRewrite) {
                    for (var i = 0, len = valueSources.length; i < len; i++) {
                        var valueSource = valueSources[i];
                        if (valueSource === columnRewrite.to)
                            return columnRewrite;
                    }
                }
                var valueRewrites = [];
                for (var i = 0, len = columnRewrites.length; i < len; i++) {
                    var columnRewrite = columnRewrites[i];
                    if (matchValueSource(columnRewrite))
                        valueRewrites.push(columnRewrite);
                }
                var newOrder = projectionOrdering[role];
                var originalOrder = valueRewrites.map(function (rewrite) { return rewrite.from.index; });
                // Optimization: avoid rewriting the matrix if all leaf nodes are in their default positions.
                if (ArrayExtensions.sequenceEqual(originalOrder, newOrder, function (x, y) { return x === y; }))
                    return;
                return createOrderMapping(originalOrder, newOrder);
            }
            function createOrderMapping(originalOrder, newOrder) {
                var mapping = {};
                for (var i = 0, len = newOrder.length; i < len; ++i) {
                    var newPosition = newOrder[i];
                    mapping[i] = originalOrder.indexOf(newPosition);
                }
                return mapping;
            }
            function forEachNodeAtLevel(node, targetLevel, callback) {
                if (node.level === targetLevel) {
                    callback(node);
                    return;
                }
                var children = node.children;
                if (children && children.length > 0) {
                    for (var i = 0, ilen = children.length; i < ilen; i++)
                        forEachNodeAtLevel(children[i], targetLevel, callback);
                }
            }
            function findOverride(source, columnRewrites) {
                for (var i = 0, len = columnRewrites.length; i < len; i++) {
                    var columnRewrite = columnRewrites[i];
                    if (columnRewrite.from === source)
                        return columnRewrite.to;
                }
            }
            function ensureRewritten(rewritten, prototype, callback) {
                if (!rewritten)
                    rewritten = inherit(prototype);
                if (callback)
                    callback(rewritten);
                return rewritten;
            }
            function transformObjects(dataView, objectDescriptors, objectDefinitions, selectTransforms, colorAllocatorFactory) {
                debug.assertValue(dataView, 'dataView');
                debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
                debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
                debug.assertAnyValue(selectTransforms, 'selectTransforms');
                debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
                if (!objectDescriptors)
                    return;
                var objectsForAllSelectors = data.DataViewObjectEvaluationUtils.groupObjectsBySelector(objectDefinitions);
                if (selectTransforms)
                    data.DataViewObjectEvaluationUtils.addDefaultFormatString(objectsForAllSelectors, objectDescriptors, dataView.metadata.columns, selectTransforms);
                var metadataOnce = objectsForAllSelectors.metadataOnce;
                var dataObjects = objectsForAllSelectors.data;
                if (metadataOnce)
                    evaluateMetadataObjects(dataView, objectDescriptors, metadataOnce.objects, dataObjects, colorAllocatorFactory);
                var metadataObjects = objectsForAllSelectors.metadata;
                if (metadataObjects) {
                    for (var i = 0, len = metadataObjects.length; i < len; i++) {
                        var metadataObject = metadataObjects[i];
                        evaluateMetadataRepetition(dataView, objectDescriptors, metadataObject.selector, metadataObject.objects);
                    }
                }
                for (var i = 0, len = dataObjects.length; i < len; i++) {
                    var dataObject = dataObjects[i];
                    evaluateDataRepetition(dataView, objectDescriptors, dataObject.selector, dataObject.rules, dataObject.objects);
                }
                if (objectsForAllSelectors.userDefined) {
                }
            }
            /** Evaluates and sets properties on the DataView metadata. */
            function evaluateMetadataObjects(dataView, objectDescriptors, objectDefns, dataObjects, colorAllocatorFactory) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(objectDefns, 'objectDefns');
                debug.assertValue(dataObjects, 'dataObjects');
                debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
                var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                if (objects) {
                    dataView.metadata.objects = objects;
                    for (var objectName in objects) {
                        var object = objects[objectName], objectDesc = objectDescriptors[objectName];
                        for (var propertyName in object) {
                            var propertyDesc = objectDesc.properties[propertyName], ruleDesc = propertyDesc.rule;
                            if (!ruleDesc)
                                continue;
                            var definition = createRuleEvaluationInstance(dataView, colorAllocatorFactory, ruleDesc, objectName, object[propertyName], propertyDesc.type);
                            if (!definition)
                                continue;
                            dataObjects.push(definition);
                        }
                    }
                }
            }
            function createRuleEvaluationInstance(dataView, colorAllocatorFactory, ruleDesc, objectName, propertyValue, ruleType) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
                debug.assertValue(ruleDesc, 'ruleDesc');
                debug.assertValue(propertyValue, 'propertyValue');
                debug.assertValue(ruleType, 'ruleType');
                var ruleOutput = ruleDesc.output;
                if (!ruleOutput)
                    return;
                var selectorToCreate = findSelectorForRuleInput(dataView, ruleOutput.selector);
                if (ruleType.fillRule)
                    return createRuleEvaluationInstanceFillRule(dataView, colorAllocatorFactory, ruleDesc, selectorToCreate, objectName, propertyValue);
                if (ruleType.filter)
                    return createRuleEvaluationInstanceFilter(dataView, ruleDesc, selectorToCreate, objectName, propertyValue);
            }
            function createRuleEvaluationInstanceFillRule(dataView, colorAllocatorFactory, ruleDesc, selectorToCreate, objectName, propertyValue) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
                debug.assertValue(ruleDesc, 'ruleDesc');
                debug.assertValue(selectorToCreate, 'selectorToCreate');
                debug.assertValue(propertyValue, 'propertyValue');
                var colorAllocator;
                if (propertyValue.linearGradient2)
                    colorAllocator = createColorAllocatorLinearGradient2(dataView, colorAllocatorFactory, ruleDesc, propertyValue, propertyValue.linearGradient2);
                else if (propertyValue.linearGradient3)
                    colorAllocator = createColorAllocatorLinearGradient3(dataView, colorAllocatorFactory, ruleDesc, propertyValue, propertyValue.linearGradient3);
                if (!colorAllocator)
                    return;
                var rule = new data.ColorRuleEvaluation(ruleDesc.inputRole, colorAllocator);
                var fillRuleProperties = {};
                fillRuleProperties[ruleDesc.output.property] = {
                    solid: { color: rule }
                };
                return {
                    selector: selectorToCreate,
                    rules: [rule],
                    objects: [{
                        name: objectName,
                        properties: fillRuleProperties,
                    }]
                };
            }
            function createColorAllocatorLinearGradient2(dataView, colorAllocatorFactory, ruleDesc, propertyValueFillRule, linearGradient2) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
                debug.assertValue(ruleDesc, 'ruleDesc');
                debug.assertValue(linearGradient2, 'linearGradient2');
                var linearGradient2 = propertyValueFillRule.linearGradient2;
                if (linearGradient2.min.value === undefined || linearGradient2.max.value === undefined) {
                    var inputRange = findRuleInputColumnNumberRange(dataView, ruleDesc.inputRole);
                    if (!inputRange)
                        return;
                    if (linearGradient2.min.value === undefined)
                        linearGradient2.min.value = inputRange.min;
                    if (linearGradient2.max.value === undefined)
                        linearGradient2.max.value = inputRange.max;
                }
                return colorAllocatorFactory.linearGradient2(propertyValueFillRule.linearGradient2);
            }
            function createColorAllocatorLinearGradient3(dataView, colorAllocatorFactory, ruleDesc, propertyValueFillRule, linearGradient3) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
                debug.assertValue(ruleDesc, 'ruleDesc');
                debug.assertValue(linearGradient3, 'linearGradient3');
                var linearGradient3 = propertyValueFillRule.linearGradient3;
                if (linearGradient3.min.value === undefined || linearGradient3.mid.value === undefined || linearGradient3.max.value === undefined) {
                    var inputRange = findRuleInputColumnNumberRange(dataView, ruleDesc.inputRole);
                    if (!inputRange)
                        return;
                    if (linearGradient3.min.value === undefined) {
                        linearGradient3.min.value = inputRange.min;
                    }
                    if (linearGradient3.max.value === undefined) {
                        linearGradient3.max.value = inputRange.max;
                    }
                    if (linearGradient3.mid.value === undefined) {
                        var midValue = (linearGradient3.max.value + linearGradient3.min.value) / 2;
                        linearGradient3.mid.value = midValue;
                    }
                }
                return colorAllocatorFactory.linearGradient3(propertyValueFillRule.linearGradient3);
            }
            function createRuleEvaluationInstanceFilter(dataView, ruleDesc, selectorToCreate, objectName, propertyValue) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(ruleDesc, 'ruleDesc');
                debug.assertValue(selectorToCreate, 'selectorToCreate');
                debug.assertValue(propertyValue, 'propertyValue');
                // NOTE: This is not right -- we ought to discover the keys from an IN operator expression to avoid additional dependencies.
                if (!dataView.categorical || !dataView.categorical.categories || dataView.categorical.categories.length !== 1)
                    return;
                var identityFields = dataView.categorical.categories[0].identityFields;
                if (!identityFields)
                    return;
                var scopeIds = data.SQExprConverter.asScopeIdsContainer(propertyValue, identityFields);
                if (!scopeIds)
                    return;
                var rule = new data.FilterRuleEvaluation(scopeIds);
                var properties = {};
                properties[ruleDesc.output.property] = rule;
                return {
                    selector: selectorToCreate,
                    rules: [rule],
                    objects: [{
                        name: objectName,
                        properties: properties,
                    }]
                };
            }
            function evaluateDataRepetition(dataView, objectDescriptors, selector, rules, objectDefns) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(selector, 'selector');
                debug.assertAnyValue(rules, 'rules');
                debug.assertValue(objectDefns, 'objectDefns');
                var containsWildcard = data.Selector.containsWildcard(selector);
                var dataViewCategorical = dataView.categorical;
                if (dataViewCategorical) {
                    var selectorMatched = false;
                    // 1) Match against categories
                    selectorMatched = evaluateDataRepetitionCategoricalCategory(dataViewCategorical, objectDescriptors, selector, rules, containsWildcard, objectDefns) || selectorMatched;
                    // 2) Match against valueGrouping
                    selectorMatched = evaluateDataRepetitionCategoricalValueGrouping(dataViewCategorical, objectDescriptors, selector, rules, containsWildcard, objectDefns) || selectorMatched;
                    if (selectorMatched)
                        return;
                }
                // If we made it here, nothing matched the selector.  Consider capturing this in a diagnostics/context object to help debugging.
            }
            function evaluateDataRepetitionCategoricalCategory(dataViewCategorical, objectDescriptors, selector, rules, containsWildcard, objectDefns) {
                debug.assertValue(dataViewCategorical, 'dataViewCategorical');
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(selector, 'selector');
                debug.assertAnyValue(rules, 'rules');
                debug.assertValue(containsWildcard, 'containsWildcard');
                debug.assertValue(objectDefns, 'objectDefns');
                if (!dataViewCategorical.categories || dataViewCategorical.categories.length === 0)
                    return;
                var targetColumn = findSelectedCategoricalColumn(dataViewCategorical, selector);
                if (!targetColumn)
                    return;
                var identities = targetColumn.identities, foundMatch, matchedRules;
                if (!identities)
                    return;
                debug.assert(targetColumn.column.values.length === identities.length, 'Column length mismatch');
                for (var i = 0, len = identities.length; i < len; i++) {
                    var identity = identities[i];
                    if (containsWildcard || data.Selector.matchesData(selector, [identity])) {
                        // Set the context for any rules.
                        if (rules) {
                            if (!matchedRules)
                                matchedRules = matchRulesToDataViewCategorical(rules, dataViewCategorical);
                            for (var ruleIdx = 0, ruleLen = matchedRules.length; ruleIdx < ruleLen; ruleIdx++) {
                                var matchedRule = matchedRules[ruleIdx];
                                matchedRule.rule.setContext(identity, matchedRule.inputValues ? matchedRule.inputValues[i] : undefined);
                            }
                        }
                        var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                        if (objects) {
                            // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                            // revisit this, likely when we do lazy evaluation of DataView.
                            if (!targetColumn.column.objects) {
                                targetColumn.column.objects = [];
                                targetColumn.column.objects.length = len;
                            }
                            targetColumn.column.objects[i] = objects;
                        }
                        if (!containsWildcard)
                            return true;
                        foundMatch = true;
                    }
                }
                return foundMatch;
            }
            function matchRulesToDataViewCategorical(rules, dataViewCategorical) {
                var result = [];
                for (var i = 0, len = rules.length; i < len; i++) {
                    var rule = rules[i], inputColumn = findRuleInputCategoricalColumn(dataViewCategorical, rule.inputRole);
                    var inputValues;
                    if (inputColumn)
                        inputValues = inputColumn.values;
                    result.push({
                        rule: rule,
                        inputValues: inputValues,
                    });
                }
                return result;
            }
            function evaluateDataRepetitionCategoricalValueGrouping(dataViewCategorical, objectDescriptors, selector, rules, containsWildcard, objectDefns) {
                debug.assertValue(dataViewCategorical, 'dataViewCategorical');
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(selector, 'selector');
                debug.assertAnyValue(rules, 'rules');
                debug.assertValue(containsWildcard, 'containsWildcard');
                debug.assertValue(objectDefns, 'objectDefns');
                var dataViewCategoricalValues = dataViewCategorical.values;
                if (!dataViewCategoricalValues || !dataViewCategoricalValues.identityFields)
                    return;
                if (!data.Selector.matchesKeys(selector, [dataViewCategoricalValues.identityFields]))
                    return;
                var valuesGrouped = dataViewCategoricalValues.grouped();
                if (!valuesGrouped)
                    return;
                var foundMatch;
                for (var i = 0, len = valuesGrouped.length; i < len; i++) {
                    var valueGroup = valuesGrouped[i];
                    if (containsWildcard || data.Selector.matchesData(selector, [valueGroup.identity])) {
                        var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                        if (objects) {
                            // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                            // revisit this, likely when we do lazy evaluation of DataView.
                            valueGroup.objects = objects;
                            setGrouped(dataViewCategoricalValues, valuesGrouped);
                        }
                        if (!containsWildcard)
                            return true;
                        foundMatch = true;
                    }
                }
                return foundMatch;
            }
            function evaluateMetadataRepetition(dataView, objectDescriptors, selector, objectDefns) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(objectDescriptors, 'objectDescriptors');
                debug.assertValue(selector, 'selector');
                debug.assertValue(objectDefns, 'objectDefns');
                // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                // revisit this, likely when we do lazy evaluation of DataView.
                var columns = dataView.metadata.columns, metadataId = selector.metadata;
                for (var i = 0, len = columns.length; i < len; i++) {
                    var column = columns[i];
                    if (column.queryName === metadataId) {
                        var objects = data.DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                        if (objects)
                            column.objects = objects;
                    }
                }
            }
            /** Attempts to find a column that can possibly match the selector. */
            function findSelectedCategoricalColumn(dataViewCategorical, selector) {
                debug.assertValue(dataViewCategorical.categories[0], 'dataViewCategorical.categories[0]');
                var categoricalColumn = dataViewCategorical.categories[0];
                if (!categoricalColumn.identityFields)
                    return;
                if (!data.Selector.matchesKeys(selector, [categoricalColumn.identityFields]))
                    return;
                var identities = categoricalColumn.identity, targetColumn = categoricalColumn;
                var selectedMetadataId = selector.metadata;
                if (selectedMetadataId) {
                    var valueColumns = dataViewCategorical.values;
                    if (valueColumns) {
                        for (var i = 0, len = valueColumns.length; i < len; i++) {
                            var valueColumn = valueColumns[i];
                            if (valueColumn.source.queryName === selectedMetadataId) {
                                targetColumn = valueColumn;
                                break;
                            }
                        }
                    }
                }
                return {
                    column: targetColumn,
                    identities: identities,
                };
            }
            function findSelectorForRuleInput(dataView, selectorRoles) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(selectorRoles, 'selectorRoles');
                if (selectorRoles.length !== 1)
                    return;
                var dataViewCategorical = dataView.categorical;
                if (!dataViewCategorical)
                    return;
                var categories = dataViewCategorical.categories;
                if (!categories || categories.length !== 1)
                    return;
                var categoryColumn = categories[0], categoryRoles = categoryColumn.source.roles, categoryIdentityFields = categoryColumn.identityFields;
                if (!categoryRoles || !categoryIdentityFields || !categoryRoles[selectorRoles[0]])
                    return;
                return { data: [data.DataViewScopeWildcard.fromExprs(categoryIdentityFields)] };
            }
            function findRuleInputCategoricalColumn(dataViewCategorical, inputRole) {
                debug.assertValue(dataViewCategorical, 'dataViewCategorical');
                return findRuleInputInCategoricalColumns(dataViewCategorical.values, inputRole) || findRuleInputInCategoricalColumns(dataViewCategorical.categories, inputRole);
            }
            function findRuleInputInCategoricalColumns(columns, inputRole) {
                debug.assertAnyValue(columns, 'columns');
                if (!columns)
                    return;
                for (var i = 0, len = columns.length; i < len; i++) {
                    var column = columns[i], roles = column.source.roles;
                    if (!roles || !roles[inputRole])
                        continue;
                    return column;
                }
            }
            /** Attempts to find the value range for the single column with the given inputRole. */
            function findRuleInputColumnNumberRange(dataView, inputRole) {
                debug.assertValue(dataView, 'dataView');
                debug.assertValue(inputRole, 'inputRole');
                // NOTE: This implementation currently only supports categorical DataView, becuase that's the
                // only scenario that has custom colors, as of this writing.  This would be rewritten to be more generic
                // as required, when needed.
                var dataViewCategorical = dataView.categorical;
                if (!dataViewCategorical)
                    return;
                var values = dataViewCategorical.values;
                if (!values)
                    return;
                for (var i = 0, len = values.length; i < len; i++) {
                    var valueCol = values[i], valueColRoles = valueCol.source.roles;
                    if (!valueColRoles || !valueColRoles[inputRole])
                        continue;
                    var min = valueCol.min;
                    if (min === undefined)
                        min = valueCol.minLocal;
                    if (min === undefined)
                        continue;
                    var max = valueCol.max;
                    if (max === undefined)
                        max = valueCol.maxLocal;
                    if (max === undefined)
                        continue;
                    return { min: min, max: max };
                }
            }
            function createTransformActions(queryMetadata, visualElements, objectDescs, objectDefns) {
                debug.assertAnyValue(queryMetadata, 'queryMetadata');
                debug.assertAnyValue(visualElements, 'visualElements');
                debug.assertAnyValue(objectDescs, 'objectDescs');
                debug.assertAnyValue(objectDefns, 'objectDefns');
                if ((!queryMetadata || ArrayExtensions.isUndefinedOrEmpty(queryMetadata.Select)) && ArrayExtensions.isUndefinedOrEmpty(visualElements) && !objectDefns)
                    return;
                var transforms = {};
                if (queryMetadata) {
                    var querySelects = queryMetadata.Select;
                    if (querySelects) {
                        var transformSelects = transforms.selects = [];
                        for (var i = 0, len = querySelects.length; i < len; i++) {
                            var selectMetadata = querySelects[i], selectTransform = toTransformSelect(selectMetadata, i);
                            transformSelects.push(selectTransform);
                            if (selectTransform.format && objectDescs) {
                                debug.assert(!!selectTransform.queryName, 'selectTransform.queryName should be defined (or defaulted).');
                                var formatStringProp = data.DataViewObjectDescriptors.findFormatString(objectDescs);
                                if (formatStringProp) {
                                    // Select Format strings are migrated into objects
                                    if (!objectDefns)
                                        objectDefns = {};
                                    data.DataViewObjectDefinitions.ensure(objectDefns, formatStringProp.objectName, { metadata: selectTransform.queryName }).properties[formatStringProp.propertyName] = data.SQExprBuilder.text(selectTransform.format);
                                }
                            }
                        }
                    }
                }
                if (visualElements) {
                    var visualElementsLength = visualElements.length;
                    if (visualElementsLength > 1)
                        transforms.splits = [];
                    for (var i = 0; i < visualElementsLength; i++) {
                        var visualElement = visualElements[i];
                        if (visualElement.Settings && i === 0)
                            objectDefns = upgradeSettingsToObjects(visualElement.Settings, objectDefns);
                        if (visualElement.DataRoles) {
                            if (!transforms.selects)
                                transforms.selects = [];
                            populateDataRoles(visualElement.DataRoles, transforms.selects);
                        }
                        if (transforms.splits)
                            transforms.splits.push(populateSplit(visualElement.DataRoles));
                    }
                }
                if (objectDefns)
                    transforms.objects = objectDefns;
                return transforms;
            }
            DataViewTransform.createTransformActions = createTransformActions;
            function toTransformSelect(select, index) {
                debug.assertValue(select, 'select');
                var result = {};
                if (select.Restatement)
                    result.displayName = select.Restatement;
                if (select.Name)
                    result.queryName = select.Name;
                else if (!result.queryName)
                    result.queryName = '$select' + index;
                if (select.Format)
                    result.format = select.Format;
                if (select.Type)
                    result.type = data.dsr.DataShapeUtility.describeDataType(select.Type, data.ConceptualDataCategory[select.DataCategory]);
                return result;
            }
            function populateDataRoles(roles, selects) {
                debug.assertValue(roles, 'roles');
                debug.assertValue(selects, 'selects');
                for (var i = 0, len = roles.length; i < len; i++) {
                    var role = roles[i], roleProjection = role.Projection;
                    var select = selects[roleProjection];
                    if (select === undefined) {
                        fillArray(selects, roleProjection);
                        select = selects[roleProjection] = {};
                    }
                    var selectRoles = select.roles;
                    if (select.roles === undefined)
                        selectRoles = select.roles = {};
                    selectRoles[role.Name] = true;
                }
            }
            function fillArray(selects, length) {
                debug.assertValue(selects, 'selects');
                debug.assertValue(length, 'length');
                for (var i = selects.length; i < length; i++)
                    selects[i] = {};
            }
            function populateSplit(roles) {
                debug.assertAnyValue(roles, 'roles');
                var selects = {};
                var split = {
                    selects: selects
                };
                if (roles) {
                    for (var i = 0, len = roles.length; i < len; i++) {
                        var role = roles[i];
                        selects[role.Projection] = true;
                    }
                }
                return split;
            }
            function createValueColumns(values, valueIdentityFields) {
                if (values === void 0) { values = []; }
                var result = values;
                setGrouped(values);
                if (valueIdentityFields)
                    result.identityFields = valueIdentityFields;
                return result;
            }
            DataViewTransform.createValueColumns = createValueColumns;
            function setGrouped(values, groupedResult) {
                values.grouped = groupedResult ? function () { return groupedResult; } : function () { return groupValues(values); };
            }
            /** Group together the values with a common identity. */
            function groupValues(values) {
                debug.assertValue(values, 'values');
                var groups = [], currentGroup;
                for (var i = 0, len = values.length; i < len; i++) {
                    var value = values[i];
                    if (!currentGroup || currentGroup.identity !== value.identity) {
                        currentGroup = {
                            values: []
                        };
                        if (value.identity) {
                            currentGroup.identity = value.identity;
                            var source = value.source;
                            // allow null, which will be formatted as (Blank).
                            if (source.groupName !== undefined)
                                currentGroup.name = source.groupName;
                            else if (source.displayName)
                                currentGroup.name = source.displayName;
                        }
                        groups.push(currentGroup);
                    }
                    currentGroup.values.push(value);
                }
                return groups;
            }
            function pivotIfNecessary(dataView, dataViewMappings) {
                debug.assertValue(dataView, 'dataView');
                var transformedDataView;
                switch (determineCategoricalTransformation(dataView.categorical, dataViewMappings)) {
                    case 1 /* Pivot */:
                        transformedDataView = data.DataViewPivotCategorical.apply(dataView);
                        break;
                    case 2 /* SelfCrossJoin */:
                        transformedDataView = data.DataViewSelfCrossJoin.apply(dataView);
                        break;
                }
                return transformedDataView || dataView;
            }
            function determineCategoricalTransformation(categorical, dataViewMappings) {
                if (!categorical || ArrayExtensions.isUndefinedOrEmpty(dataViewMappings))
                    return;
                var categories = categorical.categories;
                if (!categories || categories.length !== 1)
                    return;
                var values = categorical.values;
                if (ArrayExtensions.isUndefinedOrEmpty(values))
                    return;
                if (values.grouped().some(function (vg) { return !!vg.identity; }))
                    return;
                // If we made it here, the DataView has a single category and no valueGrouping.
                var categoryRoles = categories[0].source.roles;
                for (var i = 0, len = dataViewMappings.length; i < len; i++) {
                    var roleMappingCategorical = dataViewMappings[i].categorical;
                    if (!roleMappingCategorical)
                        continue;
                    if (!hasRolesGrouped(categoryRoles, roleMappingCategorical.values))
                        continue;
                    // If we made it here, the DataView's single category has the value grouping role.
                    var categoriesMapping = roleMappingCategorical.categories;
                    var hasCategoryRole = hasRolesBind(categoryRoles, categoriesMapping) || hasRolesFor(categoryRoles, categoriesMapping);
                    if (hasCategoryRole)
                        return 2 /* SelfCrossJoin */;
                    return 1 /* Pivot */;
                }
            }
            function shouldPivotMatrix(matrix, dataViewMappings) {
                if (!matrix || ArrayExtensions.isUndefinedOrEmpty(dataViewMappings))
                    return;
                var rowLevels = matrix.rows.levels;
                if (rowLevels.length < 1)
                    return;
                var rows = matrix.rows.root.children;
                if (!rows || rows.length === 0)
                    return;
                var rowRoles = rowLevels[0].sources[0].roles;
                for (var i = 0, len = dataViewMappings.length; i < len; i++) {
                    var roleMappingMatrix = dataViewMappings[i].matrix;
                    if (!roleMappingMatrix)
                        continue;
                    if (!hasRolesFor(rowRoles, roleMappingMatrix.rows) && hasRolesFor(rowRoles, roleMappingMatrix.columns)) {
                        return true;
                    }
                }
            }
            function hasRolesBind(roles, roleMapping) {
                if (roles && roleMapping && roleMapping.bind)
                    return roles[roleMapping.bind.to];
            }
            function hasRolesFor(roles, roleMapping) {
                if (roles && roleMapping && roleMapping.for)
                    return roles[roleMapping.for.in];
            }
            function hasRolesGrouped(roles, roleMapping) {
                if (roles && roleMapping && roleMapping.group)
                    return roles[roleMapping.group.by];
            }
        })(DataViewTransform = data.DataViewTransform || (data.DataViewTransform = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var RuleEvaluation = (function () {
            function RuleEvaluation(inputRole) {
                debug.assertAnyValue(inputRole, 'inputRole');
                if (inputRole)
                    this.inputRole = inputRole;
            }
            // TODO: This method should be removed, and instead provide a context object to evaluate that allows the implementor to pull from the context
            // (rather than pushing parts of the context into it).
            RuleEvaluation.prototype.setContext = function (scopeId, value) {
                this.scopeId = scopeId;
                this.value = value;
            };
            RuleEvaluation.prototype.evaluate = function () {
                debug.assertFail('Abstract method RuleEvaluation.evaluate not implemented.');
            };
            return RuleEvaluation;
        })();
        data.RuleEvaluation = RuleEvaluation;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var ColorRuleEvaluation = (function (_super) {
            __extends(ColorRuleEvaluation, _super);
            function ColorRuleEvaluation(inputRole, allocator) {
                debug.assertAnyValue(inputRole, 'inputRole');
                debug.assertValue(allocator, 'allocator');
                _super.call(this, inputRole);
                this.allocator = allocator;
            }
            ColorRuleEvaluation.prototype.evaluate = function () {
                return this.allocator.color(this.value);
            };
            return ColorRuleEvaluation;
        })(data.RuleEvaluation);
        data.ColorRuleEvaluation = ColorRuleEvaluation;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var FilterRuleEvaluation = (function (_super) {
            __extends(FilterRuleEvaluation, _super);
            function FilterRuleEvaluation(scopeIds) {
                debug.assertValue(scopeIds, 'scopeIds');
                _super.call(this);
                this.selection = scopeIds;
            }
            FilterRuleEvaluation.prototype.evaluate = function () {
                var currentScopeId = this.scopeId, selectedScopeIds = this.selection.scopeIds;
                for (var i = 0, len = selectedScopeIds.length; i < len; i++) {
                    if (powerbi.DataViewScopeIdentity.equals(currentScopeId, selectedScopeIds[i]))
                        return !this.selection.isNot;
                }
            };
            return FilterRuleEvaluation;
        })(data.RuleEvaluation);
        data.FilterRuleEvaluation = FilterRuleEvaluation;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            function mergeMappings(mappings, projections, indicesByName) {
                debug.assertValue(mappings, 'mappings');
                var mappingsLength = mappings.length;
                if (mappingsLength === 1)
                    return { mapping: mappings[0] };
                var mapping, splits = [];
                for (var i = 0; i < mappingsLength; i++) {
                    var currentMapping = mappings[i];
                    // NOTE: merging is only currently implemented against categorical DataView, because this is the only
                    // thing that currently needs it. In the future, can implement more surface area here as needed.
                    if (!currentMapping.categorical)
                        return;
                    if (i === 0) {
                        mapping = {
                            metadata: currentMapping.metadata,
                            categorical: {},
                        };
                    }
                    Impl.mergeCategorical(mapping.categorical, currentMapping.categorical);
                    splits.push(Impl.createSplit(projections, indicesByName, currentMapping.categorical));
                }
                return {
                    mapping: mapping,
                    splits: splits,
                };
            }
            dsr.mergeMappings = mergeMappings;
            var Impl;
            (function (Impl) {
                function mergeCategorical(target, source) {
                    if (source.categories) {
                        if (target.categories) {
                            debug.assert(jsCommon.JsonComparer.equals(target.categories, source.categories), 'target.categories & source.categories must match when multiple mappings are used.');
                        }
                        else {
                            target.categories = source.categories;
                        }
                    }
                    if (source.values) {
                        var targetValues = target.values;
                        if (!targetValues)
                            targetValues = target.values = {};
                        var sourceValues = source.values, sourceValuesGrouping = sourceValues.group;
                        pushRolesToTargetList(targetValues, sourceValues);
                        pushArrayRolesToTargetList(targetValues, sourceValues.select);
                        if (sourceValuesGrouping) {
                            var targetValuesGrouping = target.values.group;
                            if (targetValuesGrouping) {
                                pushArrayRolesToTargetList(targetValuesGrouping, sourceValuesGrouping.select);
                            }
                            else {
                                target.values.group = {
                                    select: sourceValuesGrouping.select.concat([]),
                                    by: sourceValuesGrouping.by,
                                    dataReductionAlgorithm: sourceValuesGrouping.dataReductionAlgorithm,
                                };
                            }
                        }
                    }
                }
                Impl.mergeCategorical = mergeCategorical;
                function pushRolesToTargetList(targetValues, sourceValues) {
                    if (sourceValues.bind || sourceValues.for) {
                        if (!targetValues.select)
                            targetValues.select = [];
                        targetValues.select.push(sourceValues);
                    }
                }
                function pushArrayRolesToTargetList(targetValues, select) {
                    if (!select)
                        return;
                    if (!targetValues.select)
                        targetValues.select = [];
                    Array.prototype.push.apply(targetValues.select, select);
                }
                function createSplit(projections, indicesByName, mapping) {
                    var result = { selects: {} };
                    if (mapping.categories) {
                        var categories = mapping.categories;
                        splitIfAnyBind(result, projections, indicesByName, categories);
                        splitIfAnyFor(result, projections, indicesByName, categories);
                    }
                    if (mapping.values) {
                        var valuesGrouped = mapping.values;
                        if (valuesGrouped.group) {
                            var valueGroupingProjections = projections[valuesGrouped.group.by.role];
                            splitIfAny(result, valueGroupingProjections, indicesByName);
                            for (var i = 0, len = valuesGrouped.group.select.length; i < len; i++)
                                splitIfAnyRole(result, projections, indicesByName, valuesGrouped.group.select[i]);
                        }
                        else {
                            splitIfAnyRole(result, projections, indicesByName, mapping.values);
                            splitIfAnySelect(result, projections, indicesByName, mapping.values);
                        }
                    }
                    return result;
                }
                Impl.createSplit = createSplit;
                function splitIfAnyBind(split, projections, indicesByName, bindMapping) {
                    debug.assertValue(split, 'split');
                    debug.assertValue(projections, 'projections');
                    if (bindMapping && bindMapping.bind)
                        return splitIfAny(split, projections[bindMapping.bind.to.role], indicesByName);
                }
                function splitIfAnyFor(split, projections, indicesByName, forMapping) {
                    debug.assertValue(split, 'split');
                    debug.assertValue(projections, 'projections');
                    if (forMapping && forMapping.for)
                        return splitIfAny(split, projections[forMapping.for.in.role], indicesByName);
                }
                function splitIfAnySelect(split, projections, indicesByName, selectMapping) {
                    debug.assertValue(split, 'split');
                    debug.assertValue(projections, 'projections');
                    if (selectMapping && selectMapping.select) {
                        for (var i = 0, len = selectMapping.select.length; i < len; i++)
                            splitIfAnyRole(split, projections, indicesByName, selectMapping.select[i]);
                    }
                }
                function splitIfAnyRole(split, projections, indicesByName, mapping) {
                    debug.assertValue(split, 'split');
                    debug.assertValue(projections, 'projections');
                    splitIfAnyBind(split, projections, indicesByName, mapping);
                    splitIfAnyFor(split, projections, indicesByName, mapping);
                }
                function splitIfAny(split, projections, indicesByName) {
                    debug.assertValue(split, 'split');
                    debug.assertValue(indicesByName, 'indicesByName');
                    if (!projections)
                        return;
                    var isAlreadyIncluded = [];
                    for (var i = 0, len = projections.length; i < len; i++) {
                        var queryReference = projections[i].queryRef, queryIndex = indicesByName[queryReference];
                        // indices should be a unique set of query references
                        if (isAlreadyIncluded[queryIndex])
                            continue;
                        split.selects[queryIndex] = true;
                        isAlreadyIncluded[queryIndex] = true;
                    }
                }
            })(Impl || (Impl = {}));
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            (function (RestartFlagKind) {
                RestartFlagKind[RestartFlagKind["Append"] = 0] = "Append";
                RestartFlagKind[RestartFlagKind["Merge"] = 1] = "Merge";
            })(dsr.RestartFlagKind || (dsr.RestartFlagKind = {}));
            var RestartFlagKind = dsr.RestartFlagKind;
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (_dsr) {
            var DataShapeUtility;
            (function (DataShapeUtility) {
                function findAndParseCalculation(calcs, id) {
                    var calc = findCalculation(calcs, id);
                    if (calc)
                        return data.PrimitiveValueEncoding.parseValue(calc.Value);
                }
                DataShapeUtility.findAndParseCalculation = findAndParseCalculation;
                function findAndParseCalculationToSQExpr(calcs, id) {
                    var calc = findCalculation(calcs, id);
                    if (calc)
                        return data.PrimitiveValueEncoding.parseValueToSQExpr(calc.Value);
                }
                DataShapeUtility.findAndParseCalculationToSQExpr = findAndParseCalculationToSQExpr;
                function findCalculation(calcs, id) {
                    debug.assertValue(calcs, 'calcs');
                    for (var i = 0, len = calcs.length; i < len; i++) {
                        var calc = calcs[i];
                        if (calc.Id === id)
                            return calc;
                    }
                }
                DataShapeUtility.findCalculation = findCalculation;
                function getCalculationInstanceCount(dsr, descriptor, selectOrdinal) {
                    debug.assertValue(descriptor, 'descriptor');
                    debug.assertValue(selectOrdinal, 'selectOrdinal');
                    if (!dsr || !dsr.DataShapes)
                        return null;
                    var groupId = descriptor.Select[selectOrdinal].Value;
                    for (var i = 0, ilen = dsr.DataShapes.length; i < ilen; i++) {
                        var dataShape = dsr.DataShapes[i];
                        for (var j = 0, jlen = dataShape.PrimaryHierarchy.length; j < jlen; j++) {
                            var member = dataShape.PrimaryHierarchy[j];
                            if (member.Instances && member.Instances.length) {
                                // We need only find the calculation once.
                                if (findCalculation(member.Instances[0].Calculations, groupId))
                                    return member.Instances.length;
                            }
                        }
                    }
                }
                DataShapeUtility.getCalculationInstanceCount = getCalculationInstanceCount;
                // TODO: The describeDataType/toConceptualDataCategory methods are deprecated and should be removed 
                // when all usages are moved to new ValueType APIs
                /** Converts SemanticType/DataCategory into a ValueType. */
                function describeDataType(type, category) {
                    // Default to None type
                    type = (type || 0 /* None */);
                    var primitiveType = 0 /* Null */;
                    switch (type) {
                        case 2048 /* String */:
                            primitiveType = 1 /* Text */;
                            break;
                        case 1 /* Number */:
                            primitiveType = 3 /* Double */;
                            break;
                        case data.SemanticType.Integer:
                            primitiveType = 4 /* Integer */;
                            break;
                        case 4096 /* Boolean */:
                            primitiveType = 5 /* Boolean */;
                            break;
                        case data.SemanticType.Date:
                            primitiveType = 6 /* Date */;
                            break;
                        case 4 /* DateTime */:
                            primitiveType = 7 /* DateTime */;
                            break;
                        case 8 /* Time */:
                            primitiveType = 9 /* Time */;
                            break;
                        case data.SemanticType.Year:
                            primitiveType = 4 /* Integer */;
                            debug.assert(!category || category === 'Year', 'Unexpected category for Year type.');
                            category = 'Year';
                            break;
                        case data.SemanticType.Month:
                            primitiveType = 4 /* Integer */;
                            debug.assert(!category || category === 'Month', 'Unexpected category for Month type.');
                            category = 'Month';
                            break;
                    }
                    return powerbi.ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
                }
                DataShapeUtility.describeDataType = describeDataType;
                function increaseLimitForPrimarySegmentation(dataShapeBinding, count) {
                    var limits = dataShapeBinding.Limits;
                    if (limits) {
                        var limitCount = count - 5;
                        for (var i = 0, len = limits.length; i < len; i++) {
                            var limit = limits[i];
                            if (limit.Target.Primary !== undefined) {
                                // An extra 5 added since, the server might send more data than the limit
                                // to indicate incomplete dataset, and we don't want to lose outliers.
                                limit.Count = limitCount;
                            }
                        }
                    }
                }
                DataShapeUtility.increaseLimitForPrimarySegmentation = increaseLimitForPrimarySegmentation;
                function getTopLevelSecondaryDynamicMember(dataShape, dataShapeExpressions) {
                    debug.assertValue(dataShape, 'dataShape');
                    var hierarchy = dataShape.SecondaryHierarchy;
                    if (!hierarchy)
                        return null;
                    if (!dataShapeExpressions || !dataShapeExpressions.Secondary)
                        return DataShapeUtility.getDynamicMemberFallback(hierarchy);
                    return DataShapeUtility.getDynamicMember(hierarchy, dataShapeExpressions.Secondary.Groupings, 0);
                }
                DataShapeUtility.getTopLevelSecondaryDynamicMember = getTopLevelSecondaryDynamicMember;
                function getTopLevelPrimaryDynamicMember(dataShape, dataShapeExpressions, useTopLevelCalculations) {
                    debug.assertValue(dataShape, 'dataShape');
                    var hierarchy = dataShape.PrimaryHierarchy;
                    if (!hierarchy)
                        return null;
                    var hasTopLevelCalcs;
                    if (useTopLevelCalculations)
                        hasTopLevelCalcs = dataShape.Calculations !== undefined;
                    if (!dataShapeExpressions || !dataShapeExpressions.Primary)
                        return DataShapeUtility.getDynamicMemberFallback(hierarchy, hasTopLevelCalcs);
                    return DataShapeUtility.getDynamicMember(hierarchy, dataShapeExpressions.Primary.Groupings, 0, hasTopLevelCalcs);
                }
                DataShapeUtility.getTopLevelPrimaryDynamicMember = getTopLevelPrimaryDynamicMember;
                function getDynamicMember(dataShapeMembers, axisGroupings, groupDepth, hasTopLevelCalculations) {
                    debug.assertValue(dataShapeMembers, 'dataShapeMembers');
                    if (dataShapeMembers.length === 0)
                        return null;
                    if (!axisGroupings || axisGroupings.length === 0)
                        return DataShapeUtility.getDynamicMemberFallback(dataShapeMembers, hasTopLevelCalculations);
                    var dynamicMemberId = axisGroupings[groupDepth].Member;
                    if (!dynamicMemberId)
                        return DataShapeUtility.getDynamicMemberFallback(dataShapeMembers, hasTopLevelCalculations);
                    for (var i = 0; i < dataShapeMembers.length; i++) {
                        if (dataShapeMembers[i].Id === dynamicMemberId)
                            return dataShapeMembers[i];
                    }
                    return null;
                }
                DataShapeUtility.getDynamicMember = getDynamicMember;
                /** Falback mechanism for results that did not contain Member ID on QueryBindingDescriptor. */
                function getDynamicMemberFallback(dataShapeMembers, hasTopLevelCalculations) {
                    if (dataShapeMembers.length === 2) {
                        return dataShapeMembers[1];
                    }
                    if (hasTopLevelCalculations === undefined || hasTopLevelCalculations === true)
                        return dataShapeMembers[0];
                    return null;
                }
                DataShapeUtility.getDynamicMemberFallback = getDynamicMemberFallback;
            })(DataShapeUtility = _dsr.DataShapeUtility || (_dsr.DataShapeUtility = {}));
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var DsrClientError = (function () {
        function DsrClientError(oDataError) {
            this.oDataError = oDataError;
            this.oDataCode = this.parseCode();
        }
        Object.defineProperty(DsrClientError.prototype, "code", {
            get: function () {
                return this.oDataCode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DsrClientError.prototype, "ignorable", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        DsrClientError.prototype.getDetails = function (resourceProvider) {
            // Convert the oDataError into a client error. Use a localized client error
            // when it is a known error code; otherwise use the azure details field. If
            // the code is not known and there are no azure details, then just use the
            // simple localized text.
            var values = this.oDataError['azure:values'];
            var azureDetails = null;
            if (values) {
                for (var i = 0; i < values.length; i++) {
                    if (values[i].details) {
                        azureDetails = values[i].details;
                        break;
                    }
                }
            }
            var details = DsrClientError.getErrorDetailsFromStatusCode(this.code, resourceProvider);
            var key = details.additionalErrorInfo[0].errorInfoKey;
            // When the code is unknown and the details  message is available, use it
            // instead of the localized message.
            if (!DsrClientError.isCodeKnown(this.code) && azureDetails)
                details.additionalErrorInfo = [];
            if (azureDetails) {
                // If the additionalErrorInfo already has text to display, then use
                // 'More Info' as the key.
                var detailsKey = details.additionalErrorInfo.length === 0 ? key : resourceProvider.get('DsrError_MoreInfo');
                details.additionalErrorInfo.push({
                    errorInfoKey: detailsKey,
                    errorInfoValue: azureDetails,
                });
            }
            return details;
        };
        DsrClientError.getErrorDetailsFromStatusCode = function (code, resourceProvider) {
            var key = resourceProvider.get('DsrError_Key');
            var val = resourceProvider.get('DsrError_UnknownErrorValue');
            var message = resourceProvider.get('DsrError_Message');
            switch (code) {
                case 'ErrorLoadingModel':
                    key = resourceProvider.get('DsrError_LoadingModelKey');
                    val = resourceProvider.get('DsrError_LoadingModelValue');
                    break;
                case 'InvalidDataShapeNoOutputData':
                    val = resourceProvider.get('DsrError_InvalidDataShapeValue');
                    break;
                case 'InvalidUnconstrainedJoin':
                    key = resourceProvider.get('DsrError_InvalidUnconstrainedJoinKey');
                    val = resourceProvider.get('DsrError_InvalidUnconstrainedJoinValue');
                    break;
                case 'ModelUnavailable':
                    val = resourceProvider.get('DsrError_ModelUnavailableValue');
                    break;
                case 'OverlappingKeysOnOppositeHierarchies':
                    key = resourceProvider.get('DsrError_OverlappingKeysKey');
                    val = resourceProvider.get('DsrError_OverlappingKeysValue');
                    break;
                case 'rsQueryMemoryLimitExceeded':
                case 'rsQueryTimeoutExceeded':
                    key = resourceProvider.get('DsrError_ResourcesExceededKey');
                    val = resourceProvider.get('DsrError_ResourcesExceededValue');
                    message = resourceProvider.get('DsrError_ResourcesExceededMessage');
                    break;
                case 'rsDataShapeProcessingError':
                case 'rsDataShapeQueryGenerationError':
                case 'rsDataShapeQueryTranslationError':
                case 'rsErrorExecutingCommand':
                    break;
            }
            var details = {
                message: message,
                additionalErrorInfo: [{
                    errorInfoKey: key,
                    errorInfoValue: val
                }],
            };
            return details;
        };
        DsrClientError.prototype.parseCode = function () {
            var code = this.oDataError.code;
            var values = this.oDataError['azure:values'];
            var additionalMessages = [];
            if (values) {
                for (var i = 0; i < values.length; i++) {
                    if (values[i].additionalMessages) {
                        additionalMessages = values[i].additionalMessages;
                    }
                }
            }
            if (additionalMessages.length > 0) {
                for (var i = 0; i < additionalMessages.length; i++) {
                    if (DsrClientError.isCodeKnown(additionalMessages[i].Code)) {
                        code = additionalMessages[i].Code;
                    }
                }
            }
            return code;
        };
        DsrClientError.isCodeKnown = function (code) {
            switch (code) {
                case 'ErrorLoadingModel':
                case 'InvalidDataShapeNoOutputData':
                case 'InvalidUnconstrainedJoin':
                case 'ModelUnavailable':
                case 'OverlappingKeysOnOppositeHierarchies':
                case 'rsQueryMemoryLimitExceeded':
                case 'rsQueryTimeoutExceeded':
                    return true;
                default:
                    return false;
            }
        };
        return DsrClientError;
    })();
    powerbi.DsrClientError = DsrClientError;
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            var DsrDataProvider = (function () {
                function DsrDataProvider(host, communication, delayedResultHandler, timerFactory) {
                    debug.assertValue(host, 'host');
                    this.proxy = new dsr.ExecuteSemanticQueryProxy(host, communication, delayedResultHandler, timerFactory);
                }
                DsrDataProvider.prototype.execute = function (options) {
                    return this.proxy.execute(options);
                };
                DsrDataProvider.prototype.transform = function (obj) {
                    if (obj === undefined)
                        return {
                            dataView: {
                                metadata: { columns: [] },
                                error: { code: DsrDataProvider.undefinedData }
                            }
                        };
                    return dsr.read(obj);
                };
                DsrDataProvider.prototype.stopCommunication = function () {
                    this.proxy.stopCommunication();
                };
                DsrDataProvider.prototype.resumeCommunication = function () {
                    this.proxy.resumeCommunication();
                };
                DsrDataProvider.prototype.clearCache = function () {
                    this.proxy.clearCache();
                };
                DsrDataProvider.prototype.rewriteCacheEntries = function (rewriter) {
                    this.proxy.rewriteCacheEntries(rewriter);
                };
                DsrDataProvider.undefinedData = 'UndefinedData';
                return DsrDataProvider;
            })();
            dsr.DsrDataProvider = DsrDataProvider;
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            (function (LimitType) {
                LimitType[LimitType["Unknown"] = -1] = "Unknown";
                LimitType[LimitType["Top"] = 0] = "Top";
                LimitType[LimitType["Bottom"] = 1] = "Bottom";
                LimitType[LimitType["Sample"] = 2] = "Sample";
            })(dsr.LimitType || (dsr.LimitType = {}));
            var LimitType = dsr.LimitType;
            var DsrLimitsWarning = (function () {
                function DsrLimitsWarning(queryBindingDescriptor) {
                    this.queryBindingDescriptor = queryBindingDescriptor;
                }
                DsrLimitsWarning.prototype.getDetails = function (resourceProvider) {
                    var limitType = -1 /* Unknown */;
                    var type1 = -1 /* Unknown */;
                    var type2 = -1 /* Unknown */;
                    var groupings1 = [];
                    var groupings2 = [];
                    var groupings = [];
                    var numberOfTypes = 0;
                    var limits = this.queryBindingDescriptor.Limits;
                    if (limits) {
                        if (limits.Primary) {
                            type1 = DsrLimitsWarning.getLimitType(limits.Primary);
                            groupings1 = this.queryBindingDescriptor.Expressions.Primary.Groupings;
                        }
                        if (limits.Secondary) {
                            type2 = DsrLimitsWarning.getLimitType(limits.Secondary);
                            groupings2 = this.queryBindingDescriptor.Expressions.Secondary.Groupings;
                        }
                        if (type1 !== -1 /* Unknown */ && type2 !== -1 /* Unknown */) {
                            // In this case there are two separate limit warnings; mark type as type 1
                            limitType = type1;
                            groupings = groupings1;
                            numberOfTypes = 2;
                        }
                        else if (type1 !== -1 /* Unknown */ || type2 !== -1 /* Unknown */) {
                            // There is one unique type, so set the main type to the known one, and second type to unknown.
                            if (type1 === -1 /* Unknown */) {
                                limitType = type2;
                                type2 = -1 /* Unknown */;
                                groupings = groupings2;
                                groupings2 = [];
                            }
                            else {
                                limitType = type1;
                                type2 = -1 /* Unknown */;
                                groupings = groupings1;
                                groupings2 = [];
                            }
                            numberOfTypes = 1;
                        }
                    }
                    var limitInfoValue = limitType === -1 /* Unknown */ ? resourceProvider.get('DsrLimitWarning_TooMuchDataValMultipleColumns') : this.getDetailedMessage(groupings, limitType, DsrLimitsWarning.getDefaultDetailedMessage(limitType, resourceProvider), resourceProvider);
                    if (numberOfTypes > 1 && groupings2.length > 0) {
                        // In the future we should consider separate lines here.
                        var secondString = this.getDetailedMessage(groupings2, type2, '', resourceProvider);
                        if (secondString !== '')
                            limitInfoValue = limitInfoValue + " " + secondString;
                    }
                    var message = DsrLimitsWarning.getMessage(limitType, resourceProvider);
                    var key = DsrLimitsWarning.getKey(limitType, resourceProvider);
                    var details = {
                        message: message,
                        additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: limitInfoValue, },],
                    };
                    return details;
                };
                DsrLimitsWarning.getMessage = function (type, resourceProvider) {
                    var message;
                    switch (type) {
                        case 2 /* Sample */:
                            message = resourceProvider.get('DsrLimitWarning_RepresentativeSampleMessage');
                            break;
                        case 0 /* Top */:
                        case 1 /* Bottom */:
                        default:
                            message = resourceProvider.get('DsrLimitWarning_TooMuchDataMessage');
                            break;
                    }
                    return message;
                };
                DsrLimitsWarning.getKey = function (type, resourceProvider) {
                    var key;
                    switch (type) {
                        case 2 /* Sample */:
                            key = resourceProvider.get('DsrLimitWarning_RepresentativeSampleKey');
                            break;
                        case 0 /* Top */:
                        case 1 /* Bottom */:
                        default:
                            key = resourceProvider.get('DsrLimitWarning_TooMuchDataKey');
                            break;
                    }
                    return key;
                };
                DsrLimitsWarning.prototype.getDetailedMessage = function (groupings, type, defaultString, resourceProvider) {
                    if (!groupings || groupings.length !== 1) {
                        return defaultString;
                    }
                    var keys = groupings[0].Keys;
                    for (var i = 0; i < keys.length; i++) {
                        var currentKey = keys[i];
                        if (currentKey.Select !== null && currentKey.Select !== undefined) {
                            var colName = this.columnNameFromIndex(currentKey.Select);
                            if (colName) {
                                var format = DsrLimitsWarning.getDetailedMessageFormatForOneColumn(type, resourceProvider);
                                return jsCommon.StringExtensions.format(format, colName);
                            }
                            else {
                                return defaultString;
                            }
                        }
                    }
                    return defaultString;
                };
                DsrLimitsWarning.getDetailedMessageFormatForOneColumn = function (type, resourceProvider) {
                    switch (type) {
                        case 2 /* Sample */:
                            return resourceProvider.get('DsrLimitWarning_RepresentativeSampleVal');
                        case 0 /* Top */:
                        case 1 /* Bottom */:
                        default:
                            return resourceProvider.get('DsrLimitWarning_TooMuchDataVal');
                    }
                };
                DsrLimitsWarning.getDefaultDetailedMessage = function (type, resourceProvider) {
                    switch (type) {
                        case 2 /* Sample */:
                            return resourceProvider.get('DsrLimitWarning_RepresentativeSampleValMultipleColumns');
                        case 0 /* Top */:
                        case 1 /* Bottom */:
                        default:
                            return resourceProvider.get('DsrLimitWarning_TooMuchDataValMultipleColumns');
                    }
                };
                DsrLimitsWarning.getLimitType = function (limitDescriptor) {
                    var type = -1 /* Unknown */;
                    if (limitDescriptor.Top)
                        type = 0 /* Top */;
                    else if (limitDescriptor.Bottom)
                        type = 1 /* Bottom */;
                    else if (limitDescriptor.Sample)
                        type = 2 /* Sample */;
                    return type;
                };
                return DsrLimitsWarning;
            })();
            dsr.DsrLimitsWarning = DsrLimitsWarning;
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (_dsr) {
            function read(arg) {
                debug.assertValue(arg, 'arg');
                var dataObj = arg;
                if (typeof (arg) === 'string')
                    dataObj = JSON.parse(arg);
                return readDsr(dataObj.descriptor, dataObj.dsr, dataObj.schemaName);
            }
            _dsr.read = read;
            // Public for testability
            function readDsr(descriptor, dsr, schemaName) {
                debug.assertAnyValue(descriptor, 'descriptor');
                debug.assertValue(dsr, 'dsr');
                if (!dsr.DataShapes || dsr.DataShapes.length !== 1)
                    return null;
                var dataShape = dsr.DataShapes[0];
                var oDataError = dataShape['odata.error'];
                if (oDataError) {
                    var clientError = new powerbi.DsrClientError(dataShape['odata.error']);
                    var result = {
                        error: clientError,
                    };
                    return result;
                }
                var dsrReaderResult = {
                    dataView: loadStrategy(new DsrReaderContext(descriptor.Select, schemaName)).read(descriptor.Expressions, dataShape),
                };
                if (dataShape.RestartTokens)
                    dsrReaderResult.restartToken = dataShape.RestartTokens;
                if (dataShape.DataLimitsExceeded && dataShape.DataLimitsExceeded.length > 0)
                    dsrReaderResult.warning = new _dsr.DsrLimitsWarning(descriptor);
                return dsrReaderResult;
            }
            _dsr.readDsr = readDsr;
            function loadStrategy(context) {
                debug.assertValue(context, 'context');
                var primaryDepth = 0, secondaryDepth = 0, selects = context.selects;
                for (var i = 0, len = selects.length; i < len; i++) {
                    var select = selects[i];
                    if (select) {
                        if (select.Depth != null)
                            primaryDepth = Math.max(primaryDepth, select.Depth + 1);
                        if (select.SecondaryDepth != null)
                            secondaryDepth = Math.max(secondaryDepth, select.SecondaryDepth + 1);
                    }
                }
                if (secondaryDepth >= 1 && primaryDepth === 1)
                    return new DsrWithPivotedColumnsStrategy(context);
                return new DsrToTreeStrategy(context);
            }
            function ensureTreeNodeValues(node, ordinal) {
                debug.assertValue(node, 'node');
                var values = node.values;
                if (!values)
                    values = node.values = {};
                var value = values[ordinal];
                if (!value)
                    value = values[ordinal] = {};
                return value;
            }
            /** Reads the DSR into a matrix DataView.
             *
             *  Matrix data view:
             *    > hierarchies:
             *      - row headers are in the primary hierarchy, column headers are in the secondary hierarchy
             *      - row and column hierarchies are represented by tree of nodes
             *      - the root node's role is to hold references to the first level nodes. It's not part of the matrix layout
             *      - in case of multiple measures an extra level is added to the column hierarchy (each measure will have its header) ->
             *        there may be multiple sources on the same level (i.e. Measure Column 1, Measure Column 2)
             *      - tree nodes don't contain member calculations (e.g. subtotal), except row hierarchy leaf nodes
             *      - each node has a reference to its own metadata column
             *
             *    > values (cells):
             *      - values for cells are stored in a value collection exposed by the leaf nodes in the primary hierarchy
             *      - each value (cell) has a reference to its own metadata column
             *
             *    > totals:
             *
             */
            var DsrToMatrixParser;
            (function (DsrToMatrixParser) {
                var MemberType;
                (function (MemberType) {
                    MemberType[MemberType["Undetermined"] = 0] = "Undetermined";
                    MemberType[MemberType["GroupDynamic"] = 1] = "GroupDynamic";
                    MemberType[MemberType["MeasureStatic"] = 2] = "MeasureStatic";
                    MemberType[MemberType["SubtotalStatic"] = 3] = "SubtotalStatic";
                    MemberType[MemberType["Unsupported"] = 4] = "Unsupported";
                })(MemberType || (MemberType = {}));
                function parse(context, dataShapeExprs, dataShape, metadata) {
                    debug.assertValue(context, 'context');
                    debug.assertValue(dataShape, 'dataShape');
                    debug.assertValue(metadata, 'metadata');
                    var primaryLevelSources = [], secondaryLevelSources = [], measures = [];
                    if (!processMetadata(context, primaryLevelSources, secondaryLevelSources, measures, metadata.columns))
                        return null;
                    // Maps the position of an intersection within a row (the index into the array) with the secondary
                    // component of the aggregate index (the value in the array).
                    var intersectionToSecondaryAggIdx = [];
                    var secondaryRoot = parseSecondaryTree(context, secondaryLevelSources, measures.length, dataShapeExprs, dataShape, intersectionToSecondaryAggIdx);
                    var primaryRoot = parsePrimaryTree(context, primaryLevelSources, dataShapeExprs, dataShape, intersectionToSecondaryAggIdx);
                    var rows = { root: primaryRoot, levels: primaryLevelSources };
                    var columns = { root: secondaryRoot, levels: secondaryLevelSources };
                    var result = {
                        rows: rows,
                        columns: columns,
                        valueSources: measures
                    };
                    return result;
                }
                DsrToMatrixParser.parse = parse;
                function createHierarchyLevel(metadataColumns) {
                    debug.assertValue(metadataColumns, 'metadataColumns');
                    var levels = { sources: [] };
                    for (var i = 0, ilen = metadataColumns.length; i < ilen; i++)
                        levels.sources.push(metadataColumns[i]);
                    return levels;
                }
                function getOrCreateColumnMetadata(context, metadataColumns, index) {
                    debug.assertValue(metadataColumns, 'metadataColumns');
                    for (var i = 0, ilen = metadataColumns.length; i < ilen; i++) {
                        var metadataColumn = metadataColumns[i];
                        if (metadataColumn && metadataColumn.index === index && metadataColumn.groupName === undefined)
                            return metadataColumn;
                    }
                    var newMetadataColumn = context.columnMetadata(index);
                    metadataColumns.push(newMetadataColumn);
                    return newMetadataColumn;
                }
                function processMetadata(context, primaryLevelSources, secondaryLevelSources, measures, metadataColumns) {
                    debug.assertValue(metadataColumns, 'metadataColumns');
                    var selects = context.selects;
                    for (var i = 0, len = selects.length; i < len; i++) {
                        var select = selects[i];
                        if (!select)
                            continue;
                        if (select.Kind === 2 /* Measure */) {
                            var measureMetadata = getOrCreateColumnMetadata(context, metadataColumns, i);
                            measures.push(measureMetadata);
                        }
                        else if (select.Depth != null) {
                            if (primaryLevelSources[select.Depth] != null)
                                return false;
                            primaryLevelSources[select.Depth] = createHierarchyLevel([getOrCreateColumnMetadata(context, metadataColumns, i)]);
                        }
                        else if (select.SecondaryDepth != null) {
                            if (secondaryLevelSources[select.SecondaryDepth] != null)
                                return false;
                            secondaryLevelSources[select.SecondaryDepth] = createHierarchyLevel([getOrCreateColumnMetadata(context, metadataColumns, i)]);
                        }
                    }
                    if (measures.length > 1 || (measures.length > 0 && (primaryLevelSources.length === 0 || secondaryLevelSources.length === 0)))
                        secondaryLevelSources.push(createHierarchyLevel(measures));
                    return true;
                }
                function parsePrimaryTree(context, levelSources, dataShapeExprs, dataShape, intersectionToSecondaryAggIdx) {
                    if (!dataShape.PrimaryHierarchy || dataShape.PrimaryHierarchy.length === 0)
                        return;
                    var primaryAxisGroupings;
                    if (dataShapeExprs && dataShapeExprs.Primary)
                        primaryAxisGroupings = dataShapeExprs.Primary.Groupings;
                    var maxPrimaryAggIdx = 0;
                    var maxSecondaryAggIdx = 0;
                    if (dataShapeExprs) {
                        maxPrimaryAggIdx = getMaxAggIdx(dataShapeExprs.Primary);
                        maxSecondaryAggIdx = getMaxAggIdx(dataShapeExprs.Secondary);
                    }
                    var measureSelects = context.selects.filter(function (s) { return s && s.Kind === 2 /* Measure */; });
                    return parseTree(context, levelSources, dataShape.PrimaryHierarchy, primaryAxisGroupings, function (memberType, instance, node, depth) { return parseIntersections(memberType, measureSelects, instance, node, intersectionToSecondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx); });
                }
                function parseSecondaryTree(context, levelSources, measureCount, dataShapeExprs, dataShape, intersectionToSecondaryAggIdx) {
                    if (!dataShape.SecondaryHierarchy || dataShape.SecondaryHierarchy.length === 0) {
                        // No secondary hierarchy, populate the tree with measure headers
                        var root = {};
                        addMeasureHeaders(root, measureCount, 0, false);
                        return root;
                    }
                    var secondaryAxisGroupings;
                    if (dataShapeExprs && dataShapeExprs.Secondary)
                        secondaryAxisGroupings = dataShapeExprs.Secondary.Groupings;
                    return parseTree(context, levelSources, dataShape.SecondaryHierarchy, secondaryAxisGroupings, function (memberType, instance, node, depth) {
                        if (depth < levelSources.length) {
                            if (node.isSubtotal) {
                                // Let's check the innermost level if there are multiple measures.
                                // In case of multiple measures, the subtotal member will also need multiple children (the count must match the number of measures).
                                var innermostLevelIndex = levelSources.length - 1;
                                var measureCount = levelSources[innermostLevelIndex].sources.length;
                                if (measureCount > 1)
                                    addMeasureHeaders(node, measureCount, innermostLevelIndex, true);
                            }
                            else {
                                // There is still one level to populate and that's for measure headers
                                debug.assert(depth === levelSources.length - 1, 'We only support one extra level in the column hierarchy (for measures)');
                                var level = levelSources[depth];
                                addMeasureHeaders(node, level.sources.length, depth, false);
                            }
                        }
                        intersectionToSecondaryAggIdx.push(getAggIdxForNode(node));
                    });
                }
                function getAggIdxForNode(node) {
                    debug.assertValue(node, 'node');
                    // We add one to the leaf dynamic level because the outermost subtotal represents level 0.
                    // See the comment on SelectBinding.Subtotal.
                    return node.isSubtotal ? node.level : node.level + 1;
                }
                function getMaxAggIdx(axis) {
                    debug.assertAnyValue(axis, 'axis');
                    // Use length, rather than the last valid index because the outermost subtotal represents level 0
                    // and the innermost group is index + 1.
                    // See the comment on SelectBinding.Subtotal.
                    if (axis && axis.Groupings)
                        return axis.Groupings.length;
                    return 0;
                }
                function computeAggIdx(primaryAggIdx, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx) {
                    // See the comment on SelectBinding.Subtotal.
                    return primaryAggIdx + ((maxSecondaryAggIdx - secondaryAggIdx) * (maxPrimaryAggIdx + 1));
                }
                function addMeasureHeaders(root, count, depth, isSubtotal) {
                    root.children = [];
                    for (var i = 0; i < count; i++) {
                        var child = { level: depth };
                        // Size optimization: only set if it's not zero
                        if (i > 0)
                            child.levelSourceIndex = i;
                        root.children.push(child);
                        if (isSubtotal)
                            child.isSubtotal = true;
                    }
                }
                function parseTree(context, levelSources, rootMembers, axisGroupings, leafMemberCallback) {
                    debug.assertValue(context, 'context');
                    var root = {};
                    parseRecursive(context, levelSources, root, rootMembers, axisGroupings, 0, leafMemberCallback);
                    return root;
                }
                function parseRecursive(context, levelSources, node, members, axisGroupings, depth, leafMemberCallback) {
                    debug.assertValue(context, 'context');
                    debug.assertValue(levelSources, 'levelSources');
                    debug.assertValue(node, 'node');
                    debug.assertValue(depth, 'depth');
                    if (!members)
                        return;
                    var selects = context.selects;
                    for (var i = 0, ilen = members.length; i < ilen; i++) {
                        var member = members[i];
                        var memberType = 0 /* Undetermined */;
                        for (var j = 0, jlen = member.Instances.length; j < jlen; j++) {
                            var instance = member.Instances[j];
                            // Check for member type, if it's not determined yet - for certain types we need to look into the member instance.
                            // The member type must be the same for all member instances, so we only check it for the first instance
                            if (memberType === 0 /* Undetermined */) {
                                var memberType = getMemberType(selects, axisGroupings, depth, member, instance);
                                if (memberType === 4 /* Unsupported */)
                                    break;
                            }
                            var nestedNode = {
                                level: depth
                            };
                            // Add child
                            if (!node.children)
                                node.children = [];
                            node.children.push(nestedNode);
                            // Read group value for the node
                            if (memberType === 1 /* GroupDynamic */) {
                                var value = getGroupValue(selects, instance.Calculations);
                                if (value != null)
                                    nestedNode.value = value;
                            }
                            else if (memberType === 3 /* SubtotalStatic */) {
                                nestedNode.isSubtotal = true;
                            }
                            if (instance.RestartFlag && instance.RestartFlag === 1 /* Merge */)
                                nestedNode.isMerge = true;
                            // Read the identity of the node
                            if (axisGroupings && memberType === 1 /* GroupDynamic */) {
                                node.childIdentityFields = context.readKeys(axisGroupings, depth);
                                nestedNode.identity = context.readIdentity(axisGroupings, instance, depth);
                            }
                            // Recursively read nested content
                            var nestedMembers = instance.Members;
                            if (nestedMembers && nestedMembers.length > 0) {
                                parseRecursive(context, levelSources, nestedNode, nestedMembers, axisGroupings, depth + 1, leafMemberCallback);
                            }
                            else {
                                // Leaf member reached, call into the callback function
                                if (leafMemberCallback)
                                    leafMemberCallback(memberType, instance, nestedNode, depth + 1);
                            }
                        }
                    }
                }
                function getGroupValue(selects, calculations) {
                    debug.assertValue(selects, 'selects');
                    debug.assertValue(calculations, 'calculations');
                    for (var i = 0, ilen = selects.length; i < ilen; i++) {
                        var select = selects[i];
                        if (select && select.Value && select.Kind === 1 /* Group */) {
                            var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, select.Value);
                            if (value != null)
                                return value;
                        }
                    }
                }
                function getMemberType(selects, axisGroupings, groupDepth, member, instance) {
                    debug.assertValue(selects, 'selects');
                    debug.assertValue(member, 'member');
                    // In order to determine if it's a dynamic or total member, we only need the member definition and the groupings
                    if (axisGroupings && axisGroupings.length > groupDepth && member.Id != null) {
                        var grouping = axisGroupings[groupDepth];
                        if (member.Id === grouping.Member)
                            return 1 /* GroupDynamic */;
                        if (member.Id === grouping.SubtotalMember)
                            return 3 /* SubtotalStatic */;
                    }
                    // If the member definition does not give us enough information, check the instance
                    var calculations = instance.Calculations;
                    if (calculations) {
                        var measureFound = false;
                        for (var i = 0, ilen = selects.length; i < ilen; i++) {
                            var select = selects[i];
                            if (!select)
                                continue;
                            if (_dsr.DataShapeUtility.findCalculation(calculations, select.Value)) {
                                if (select.Kind === 1 /* Group */)
                                    return 1 /* GroupDynamic */;
                                if (!measureFound && select.Kind === 2 /* Measure */)
                                    measureFound = true;
                            }
                        }
                        if (measureFound)
                            return 2 /* MeasureStatic */;
                    }
                    return 4 /* Unsupported */;
                }
                function readAndAddMeasureValues(rowMemberType, measureSelects, calculations, node, valueIndex, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx) {
                    debug.assertValue(measureSelects, 'selects');
                    debug.assertValue(node, 'node');
                    if (!calculations)
                        return;
                    var measureIndex = 0;
                    for (var i = 0, ilen = measureSelects.length; i < ilen; i++) {
                        var select = measureSelects[i];
                        debug.assert(select.Kind === 2 /* Measure */, 'measureSelects is expected to have measure select bindings only');
                        var measureValue = ensureTreeNodeValues(node, valueIndex.index);
                        var result = null;
                        // Intersections are rows with calculations. If the row is a subtotal row, it can only contain subtotals,
                        // however, dynamic rows can also have column subtotals.
                        // If it's not a subtotal row, check for measure value.
                        if (rowMemberType !== 3 /* SubtotalStatic */)
                            result = _dsr.DataShapeUtility.findAndParseCalculation(calculations, select.Value);
                        // If there are no measure calculations or if it's a subtotal row, try to get subtotal value
                        if (result == null) {
                            var primaryAggIdx = getAggIdxForNode(node);
                            var subtotal = findSubtotalValue(calculations, select, primaryAggIdx, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx);
                            // undefined means, the value cannot be found. Null is a valid value.
                            if (subtotal !== undefined)
                                result = subtotal;
                        }
                        measureValue.value = result;
                        // Size optimization: only set source index if it's not zero
                        if (measureIndex > 0)
                            measureValue.valueSourceIndex = measureIndex;
                        valueIndex.index++;
                        measureIndex++;
                    }
                }
                function parseIntersections(rowMemberType, measureSelects, instance, node, intersectionToSecondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx) {
                    debug.assertValue(instance, 'instance');
                    debug.assertValue(node, 'node');
                    debug.assertValue(intersectionToSecondaryAggIdx, 'intersectionToSecondaryAggIdx');
                    var intersections = instance.Intersections;
                    // NOTE: this variable is used as a passed by ref index
                    var valueIndex = { index: 0 };
                    if (intersections) {
                        for (var i = 0, ilen = intersections.length; i < ilen; i++) {
                            if (intersections[i].Calculations) {
                                var secondaryAggIdx = intersectionToSecondaryAggIdx[i];
                                readAndAddMeasureValues(rowMemberType, measureSelects, intersections[i].Calculations, node, valueIndex, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx);
                            }
                        }
                    }
                    else {
                        readAndAddMeasureValues(rowMemberType, measureSelects, instance.Calculations, node, valueIndex, 0, maxPrimaryAggIdx, maxSecondaryAggIdx);
                    }
                }
                /** Finds subtotal value among the calculations. If there is none, this method returns undefined.
                    Note, that value can be null as well as a sum of null measure values. */
                function findSubtotalValue(calculations, select, primaryAggIdx, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx) {
                    var subtotals = select.Subtotal;
                    if (subtotals) {
                        var AggIdx = computeAggIdx(primaryAggIdx, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx);
                        if (AggIdx < subtotals.length) {
                            return _dsr.DataShapeUtility.findAndParseCalculation(calculations, subtotals[AggIdx]);
                        }
                    }
                    return undefined;
                }
            })(DsrToMatrixParser || (DsrToMatrixParser = {}));
            /** Reads the DSR into a tree DataView, and derives the other data views from the tree, on a best effort basis. */
            var DsrToTreeStrategy = (function () {
                function DsrToTreeStrategy(context) {
                    debug.assertValue(context, 'context');
                    this._context = context;
                }
                DsrToTreeStrategy.prototype.read = function (dataShapeExprs, dataShape) {
                    debug.assertValue(dataShape, 'dataShape');
                    var metadata = this.readMetadata(dataShape.IsComplete);
                    var dataView = {
                        metadata: metadata
                    };
                    var root = this.parseTree(dataShapeExprs, dataShape);
                    debug.assertValue(root, 'root');
                    dataView.tree = { root: root };
                    var categorical = this.categorize(metadata, root);
                    if (categorical)
                        dataView.categorical = categorical;
                    var single = this.createSingleValue(metadata, root);
                    if (single)
                        dataView.single = single;
                    var table = this.createTable(metadata, root);
                    if (table)
                        dataView.table = table;
                    var matrix = DsrToMatrixParser.parse(this._context, dataShapeExprs, dataShape, dataView.metadata);
                    if (matrix)
                        dataView.matrix = matrix;
                    return dataView;
                };
                DsrToTreeStrategy.prototype.readMetadata = function (isComplete) {
                    var metadata = {
                        columns: [],
                    };
                    var context = this._context, selects = context.selects;
                    for (var i = 0, len = selects.length; i < len; i++) {
                        var select = selects[i];
                        if (!select)
                            continue;
                        var columnMetadata = context.columnMetadata(i);
                        metadata.columns.push(columnMetadata);
                    }
                    if (!isComplete)
                        metadata.segment = {};
                    return metadata;
                };
                DsrToTreeStrategy.prototype.parseTree = function (dataShapeExprs, dataShape) {
                    var root = {};
                    var aggregateCalcs = dataShape.Calculations || DsrToTreeStrategy.getFirstInstanceCalcs(dataShape.PrimaryHierarchy[0]), dynamicMember;
                    dynamicMember = _dsr.DataShapeUtility.getTopLevelPrimaryDynamicMember(dataShape, dataShapeExprs, true);
                    var primaryAxisGroupings;
                    if (dataShapeExprs && dataShapeExprs.Primary)
                        primaryAxisGroupings = dataShapeExprs.Primary.Groupings;
                    this.parseRecursive(root, aggregateCalcs, dynamicMember, primaryAxisGroupings, 0);
                    return root;
                };
                DsrToTreeStrategy.prototype.parseRecursive = function (node, aggregateCalcs, dynamicMember, primaryAxisGroupings, depth) {
                    debug.assertValue(node, 'node');
                    debug.assertValue(depth, 'depth');
                    var context = this._context;
                    // Read the Aggregate values, if available, from the static DataMember.
                    if (aggregateCalcs)
                        this.parseValues(context.selects, node, aggregateCalcs, depth);
                    if (dynamicMember) {
                        // Read the Detail values
                        var dynamicMemberInstances = dynamicMember.Instances, dynamicMemberInstancesLength = dynamicMemberInstances.length, aggregator;
                        if (dynamicMemberInstancesLength) {
                            node.children = [];
                            // NOTE: We currently only need to compute the client-side min/max for categorical charts, so we need only compute it at the root node.
                            // We can expand this as needed in the future.
                            if (depth === 0)
                                aggregator = TreeNodeValueAggregateComputer.create(node, context.selects);
                        }
                        if (primaryAxisGroupings) {
                            node.childIdentityFields = context.readKeys(primaryAxisGroupings, depth);
                        }
                        for (var i = 0; i < dynamicMemberInstancesLength; i++) {
                            var instance = dynamicMemberInstances[i];
                            var nestedNode = {};
                            node.children.push(nestedNode);
                            if (instance.RestartFlag && instance.RestartFlag === 1 /* Merge */)
                                nestedNode.isMerge = true;
                            this.parseValues(context.selects, nestedNode, instance.Calculations, depth, aggregator);
                            if (primaryAxisGroupings) {
                                nestedNode.identity = context.readIdentity(primaryAxisGroupings, instance, depth);
                            }
                            // Recursively read nested content
                            var nestedMembers = instance.Members;
                            if (nestedMembers && nestedMembers.length) {
                                var dynamicChild = _dsr.DataShapeUtility.getDynamicMember(nestedMembers, primaryAxisGroupings, depth + 1);
                                this.parseRecursive(nestedNode, DsrToTreeStrategy.getFirstInstanceCalcs(nestedMembers[0]), dynamicChild, primaryAxisGroupings, depth + 1);
                            }
                        }
                        if (aggregator)
                            aggregator.complete();
                    }
                };
                DsrToTreeStrategy.getFirstInstanceCalcs = function (member) {
                    if (member.Instances.length > 0)
                        return member.Instances[0].Calculations;
                    return null;
                };
                DsrToTreeStrategy.prototype.parseValues = function (selects, node, calculations, depth, aggregator) {
                    debug.assertValue(node, 'node');
                    debug.assertValue(calculations, 'calculations');
                    for (var i = 0, len = selects.length; i < len; i++) {
                        var select = selects[i];
                        if (!select)
                            continue;
                        if (select.Subtotal) {
                            var id = select.Subtotal[depth];
                            if (id) {
                                var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, id);
                                if (value !== undefined)
                                    ensureTreeNodeValues(node, i).subtotal = value;
                            }
                        }
                        if (select.Max) {
                            var id = select.Max[depth];
                            if (id) {
                                var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, id);
                                if (value !== undefined)
                                    ensureTreeNodeValues(node, i).max = value;
                            }
                        }
                        if (select.Min) {
                            var id = select.Min[depth];
                            if (id) {
                                var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, id);
                                if (value !== undefined)
                                    ensureTreeNodeValues(node, i).min = value;
                            }
                        }
                        if (select.Count) {
                            var id = select.Count[depth];
                            if (id) {
                                var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, id);
                                if (value !== undefined)
                                    ensureTreeNodeValues(node, i).count = value;
                            }
                        }
                        if (select.Value) {
                            var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, select.Value);
                            if (value !== undefined) {
                                if (select.Kind === 1 /* Group */) {
                                    node.name = value;
                                }
                                else {
                                    node.value = value;
                                    if (aggregator)
                                        aggregator.add(i, value);
                                }
                                ensureTreeNodeValues(node, i).value = value;
                            }
                        }
                        if (select.Highlight) {
                            var highlight = _dsr.DataShapeUtility.findAndParseCalculation(calculations, select.Highlight.Value);
                            if (highlight !== undefined) {
                                ensureTreeNodeValues(node, i).highlight = highlight;
                            }
                        }
                    }
                };
                DsrToTreeStrategy.prototype.categorize = function (metadata, root) {
                    debug.assertValue(metadata, 'metadata');
                    if (powerbi.DataViewAnalysis.countGroups(metadata.columns) > 1)
                        return null;
                    var view = {}, categoryColumn, categoryIdx;
                    for (var j = 0, jlen = metadata.columns.length; j < jlen; j++) {
                        var metadataColumn = metadata.columns[j];
                        if (!metadataColumn.isMeasure) {
                            categoryColumn = metadataColumn;
                            categoryIdx = metadataColumn.index;
                            continue;
                        }
                        var column = {
                            source: metadataColumn,
                            values: []
                        };
                        this.populateMeasureData(root, column, metadataColumn.index);
                        if (!view.values)
                            view.values = data.DataViewTransform.createValueColumns();
                        view.values.push(column);
                    }
                    if (categoryColumn) {
                        var nodes = root.children;
                        var category = { source: categoryColumn, values: [] };
                        var categoryIdentity;
                        if (nodes) {
                            for (var i = 0, ilen = nodes.length; i < ilen; i++) {
                                var node = nodes[i];
                                category.values.push(node.values[categoryIdx].value);
                                this.writeCategoricalValues(metadata, node, view.values);
                                if (node.identity) {
                                    if (!categoryIdentity)
                                        categoryIdentity = [];
                                    categoryIdentity.push(node.identity);
                                }
                                if (node.isMerge) {
                                    var viewSegment = view;
                                    viewSegment.lastMergeIndex = i;
                                }
                            }
                        }
                        if (categoryIdentity)
                            category.identity = categoryIdentity;
                        if (root.childIdentityFields)
                            category.identityFields = root.childIdentityFields;
                        view.categories = [category];
                    }
                    else {
                        this.writeCategoricalValues(metadata, root, view.values);
                    }
                    return view;
                };
                DsrToTreeStrategy.prototype.createTable = function (metadata, root) {
                    debug.assertValue(metadata, 'metadata');
                    var maxDepth;
                    var selects = this._context.selects;
                    for (var i = 0, len = selects.length; i < len; i++) {
                        var select = selects[i];
                        if (!select)
                            continue;
                        var depth = selects[i].Depth;
                        if (depth >= 0)
                            maxDepth = Math.max(depth, maxDepth || 0);
                    }
                    if (maxDepth > 0) {
                        // This would be lossy -- it ignores groups below the top level.
                        return null;
                    }
                    var lastMergeIndex;
                    var rows = [], selectsLength = selects.length, identity;
                    if (maxDepth >= 0) {
                        var nodes = root.children;
                        if (nodes) {
                            for (var i = 0, ilen = nodes.length; i < ilen; i++) {
                                var node = nodes[i];
                                this.toTableRow(node, selectsLength, rows);
                                if (node.isMerge)
                                    lastMergeIndex = i;
                                if (node.identity) {
                                    if (!identity)
                                        identity = [];
                                    identity.push(node.identity);
                                }
                            }
                        }
                    }
                    else {
                        debug.assert(powerbi.DataViewAnalysis.countGroups(metadata.columns) === 0, 'groups.length=0');
                        this.toTableRow(root, selectsLength, rows);
                    }
                    var totals = this.toTotals(root, selectsLength);
                    var table = { rows: rows, columns: metadata.columns };
                    if (identity)
                        table.identity = identity;
                    if (totals)
                        table.totals = totals;
                    if (lastMergeIndex >= 0) {
                        var tableSegment = table;
                        tableSegment.lastMergeIndex = lastMergeIndex;
                    }
                    return table;
                };
                DsrToTreeStrategy.prototype.toTableRow = function (node, selectsLength, rows) {
                    var row = [];
                    for (var j = 0; j < selectsLength; j++) {
                        var nodeValue = node.values[j];
                        if (!nodeValue)
                            continue;
                        row.push(nodeValue.value);
                    }
                    rows.push(row);
                };
                DsrToTreeStrategy.prototype.toTotals = function (root, selectsLength) {
                    var totals = [];
                    var values = root.values;
                    // Since we insert empty values into the array if a total is not found, we need to keep track of whether
                    // we had at least one valid total in the DataView so that for the case where there are no valid totals
                    // we can leave the totals property undefined instead of a big array of empty values.
                    var hasAtLeastOneTotal = false;
                    if (values) {
                        var selects = this._context.selects;
                        for (var j = 0; j < selectsLength; j++) {
                            // Null selects will not output anything into the row data, so we need to skip those here to ensure
                            // the totals and row data arrays stay in sync
                            if (!selects[j])
                                continue;
                            var measureData = values[j];
                            var subtotal = (measureData) ? measureData.subtotal : null;
                            hasAtLeastOneTotal = hasAtLeastOneTotal || (subtotal != null);
                            totals.push(subtotal);
                        }
                    }
                    return hasAtLeastOneTotal ? totals : null;
                };
                DsrToTreeStrategy.prototype.writeCategoricalValues = function (metadata, node, values) {
                    var columns = metadata.columns;
                    var idx = 0;
                    for (var j = 0, jlen = columns.length; j < jlen; j++) {
                        var column = columns[j];
                        if (!column.isMeasure)
                            continue;
                        var nodeValues = node.values[column.index];
                        var measureValues = values[idx++];
                        measureValues.values.push(nodeValues.value);
                        if (nodeValues.highlight !== undefined) {
                            if (!measureValues.highlights)
                                measureValues.highlights = [];
                            measureValues.highlights.push(nodeValues.highlight);
                        }
                    }
                };
                DsrToTreeStrategy.prototype.populateMeasureData = function (node, column, index) {
                    debug.assertValue(node, 'node');
                    if (!node.values)
                        return;
                    var measureData = node.values[index];
                    if (measureData) {
                        if (measureData.min !== undefined)
                            column.min = measureData.min;
                        if (measureData.max !== undefined)
                            column.max = measureData.max;
                        if (measureData.subtotal !== undefined)
                            column.subtotal = measureData.subtotal;
                        if (measureData.maxLocal !== undefined)
                            column.maxLocal = measureData.maxLocal;
                        if (measureData.minLocal !== undefined)
                            column.minLocal = measureData.minLocal;
                    }
                };
                DsrToTreeStrategy.prototype.createSingleValue = function (metadata, root) {
                    debug.assertValue(metadata, 'metadata');
                    debug.assertValue(root, 'root');
                    if (root.values) {
                        var columns = metadata.columns, measureColumn = null;
                        for (var j = 0, jlen = columns.length; j < jlen; j++) {
                            if (!columns[j].isMeasure)
                                continue;
                            if (measureColumn)
                                return null;
                            measureColumn = columns[j];
                        }
                        if (!measureColumn)
                            return null;
                        var measureValues = root.values[measureColumn.index];
                        if (!measureValues)
                            return null;
                        var value = powerbi.DataViewAnalysis.countGroups(metadata.columns) === 0 ? measureValues.value : measureValues.subtotal;
                        if (value === undefined)
                            return null;
                        return {
                            value: value
                        };
                    }
                    return null;
                };
                return DsrToTreeStrategy;
            })();
            var DsrWithPivotedColumnsStrategy = (function () {
                function DsrWithPivotedColumnsStrategy(context) {
                    debug.assertValue(context, 'context');
                    this._context = context;
                    this._categorySelects = [];
                    this._primaryMeasureSelects = [];
                    this._measureSelects = [];
                    this._secondarySelects = [];
                    this._categoryColumn = null;
                    this._seriesColumn = null;
                }
                DsrWithPivotedColumnsStrategy.prototype.read = function (dataShapeExprs, dataShape) {
                    debug.assertValue(dataShape, 'dataShape');
                    var dataView = {
                        metadata: this.readMetadata(dataShape.IsComplete)
                    };
                    var categorical = this.categorize(dataShape, dataView.metadata, dataShapeExprs);
                    if (categorical)
                        dataView.categorical = categorical;
                    var matrix = DsrToMatrixParser.parse(this._context, dataShapeExprs, dataShape, dataView.metadata);
                    if (matrix)
                        dataView.matrix = matrix;
                    return dataView;
                };
                DsrWithPivotedColumnsStrategy.prototype.readMetadata = function (isComplete) {
                    var metadata = {
                        columns: [],
                    };
                    var context = this._context, selects = context.selects;
                    for (var i = 0, len = selects.length; i < len; i++) {
                        var select = selects[i];
                        if (!select)
                            continue;
                        if (select.Kind === 2 /* Measure */) {
                            if (select.Depth === 0)
                                this._primaryMeasureSelects.push(select);
                            else
                                this._measureSelects.push(select);
                            continue;
                        }
                        debug.assert(select.Kind === 1 /* Group */, 'Unexpected Select.Kind');
                        var columnMetadata = context.columnMetadata(i);
                        metadata.columns.push(columnMetadata);
                        if (select.SecondaryDepth >= 0) {
                            // Secondary hierarchy is pivoted onto columns and considered as measure values.
                            this._secondarySelects.push(select);
                            this._secondaryDepth = Math.max(this._secondaryDepth || 0, select.SecondaryDepth);
                            this._seriesColumn = columnMetadata;
                        }
                        else {
                            this._categoryColumn = columnMetadata;
                            this._categorySelects.push(select);
                        }
                    }
                    if (!isComplete)
                        metadata.segment = {};
                    return metadata;
                };
                DsrWithPivotedColumnsStrategy.prototype.categorize = function (dataShape, metadata, dataShapeExprs) {
                    debug.assertValue(dataShape, 'dataShape');
                    debug.assertValue(metadata, 'metadata');
                    if (this._secondaryDepth !== 0 || this._categorySelects.length !== 1 || this._measureSelects.length < 1)
                        return null;
                    var primaryAxisGroupings;
                    var secondaryAxisGroupings;
                    if (dataShapeExprs) {
                        if (dataShapeExprs.Primary)
                            primaryAxisGroupings = dataShapeExprs.Primary.Groupings;
                        if (dataShapeExprs.Secondary)
                            secondaryAxisGroupings = dataShapeExprs.Secondary.Groupings;
                    }
                    var secondaryDynamicTopLevel = _dsr.DataShapeUtility.getTopLevelSecondaryDynamicMember(dataShape, dataShapeExprs);
                    var values = this.readColumnsFromSecondary(secondaryDynamicTopLevel, metadata, secondaryAxisGroupings, dataShape.Calculations);
                    var primaryDynamicTopLevel = _dsr.DataShapeUtility.getTopLevelPrimaryDynamicMember(dataShape, dataShapeExprs);
                    var categoriesResult = this.readCategoriesAndValues(primaryDynamicTopLevel, metadata, values, primaryAxisGroupings);
                    var result = {
                        categories: categoriesResult.categories,
                        values: values,
                    };
                    if (categoriesResult.lastMergeIndex !== undefined)
                        result.lastMergeIndex = categoriesResult.lastMergeIndex;
                    return result;
                };
                DsrWithPivotedColumnsStrategy.prototype.readColumnsFromSecondary = function (secondaryMember, metadata, secondaryAxisGroupings, aggregateCalculations) {
                    debug.assertValue(secondaryMember, 'secondaryMember');
                    debug.assertValue(metadata, 'metadata');
                    var valueIdentityFields, context = this._context;
                    if (secondaryAxisGroupings)
                        valueIdentityFields = context.readKeys(secondaryAxisGroupings, 0);
                    var values = data.DataViewTransform.createValueColumns([], valueIdentityFields), allSelects = context.selects, measureSelectsLen = this._measureSelects.length;
                    var instances = secondaryMember.Instances, instanceCount = instances.length;
                    if (instanceCount) {
                        for (var i = 0; i < instanceCount; i++) {
                            var instance = instances[i], calcs = instance.Calculations, identity;
                            if (secondaryAxisGroupings)
                                identity = context.readIdentity(secondaryAxisGroupings, instance, 0);
                            for (var j = 0, jlen = this._secondarySelects.length; j < jlen; j++) {
                                var secondarySelect = this._secondarySelects[j], label = _dsr.DataShapeUtility.findAndParseCalculation(calcs, secondarySelect.Value);
                                for (var k = 0; k < measureSelectsLen; k++) {
                                    // Create the metadata column
                                    var measureSelect = this._measureSelects[k];
                                    var columnMetadata = context.columnMetadata(allSelects.indexOf(measureSelect));
                                    if (label !== undefined)
                                        columnMetadata.groupName = label;
                                    metadata.columns.push(columnMetadata);
                                    // Create the value column
                                    var column = {
                                        source: columnMetadata,
                                        values: []
                                    };
                                    if (identity)
                                        column.identity = identity;
                                    this.addColumnAggregates(aggregateCalculations, measureSelect, column);
                                    values.push(column);
                                }
                            }
                        }
                    }
                    else {
                        for (var k = 0; k < measureSelectsLen; k++) {
                            // Create the metadata column
                            var measureSelect = this._measureSelects[k];
                            var columnMetadata = context.columnMetadata(allSelects.indexOf(measureSelect));
                            metadata.columns.push(columnMetadata);
                            // Create the value column
                            var column = {
                                source: columnMetadata,
                                values: []
                            };
                            this.addColumnAggregates(aggregateCalculations, measureSelect, column);
                            values.push(column);
                        }
                    }
                    for (var k = 0, klen = this._primaryMeasureSelects.length; k < klen; k++) {
                        // Create the metadata column
                        var primaryMeasureSelect = this._primaryMeasureSelects[k];
                        var columnMetadata = context.columnMetadata(allSelects.indexOf(primaryMeasureSelect));
                        metadata.columns.push(columnMetadata);
                        // Create the value column
                        var column = {
                            source: columnMetadata,
                            values: []
                        };
                        values.push(column);
                    }
                    if (this._seriesColumn) {
                        values.source = this._seriesColumn;
                    }
                    return values;
                };
                DsrWithPivotedColumnsStrategy.prototype.addColumnAggregates = function (calcs, measureSelect, column) {
                    if (calcs) {
                        if (measureSelect.Max) {
                            column.max = _dsr.DataShapeUtility.findAndParseCalculation(calcs, measureSelect.Max[0]);
                        }
                        if (measureSelect.Min) {
                            column.min = _dsr.DataShapeUtility.findAndParseCalculation(calcs, measureSelect.Min[0]);
                        }
                    }
                };
                DsrWithPivotedColumnsStrategy.prototype.readCategoriesAndValues = function (primaryMember, metadata, values, primaryAxisGroupings) {
                    debug.assertValue(primaryMember, 'primaryMember');
                    debug.assertValue(values, 'values');
                    var categorySelectIdx = 0, context = this._context, select = this._categorySelects[categorySelectIdx], category = {
                        source: this._categoryColumn,
                        values: [],
                    }, instances = primaryMember.Instances, identities;
                    if (primaryAxisGroupings) {
                        identities = category.identity = [];
                        category.identityFields = context.readKeys(primaryAxisGroupings, 0);
                    }
                    var primaryMeasureSelects = this._primaryMeasureSelects;
                    var lastMergeIndex;
                    for (var i = 0, len = instances.length; i < len; i++) {
                        var instance = instances[i];
                        if (instance.RestartFlag === 1 /* Merge */)
                            lastMergeIndex = i;
                        category.values.push(_dsr.DataShapeUtility.findAndParseCalculation(instance.Calculations, select.Value));
                        if (identities)
                            identities.push(context.readIdentity(primaryAxisGroupings, instance, 0));
                        var intersections = instance.Intersections, valueIdx = 0;
                        for (var j = 0, jlen = intersections.length; j < jlen; j++) {
                            var calculations = intersections[j].Calculations;
                            for (var k = 0, klen = this._measureSelects.length; k < klen; k++) {
                                var measureSelect = this._measureSelects[k];
                                var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, measureSelect.Value);
                                // If the value does not belong to the measure, it's from a subtotal column (already skipped), skip it.
                                // NOTE: null is a valid value
                                if (value === undefined)
                                    continue;
                                var valueCol = values[valueIdx++];
                                valueCol.values.push(value);
                                if (measureSelect.Highlight) {
                                    if (!valueCol.highlights)
                                        valueCol.highlights = [];
                                    var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, measureSelect.Highlight.Value);
                                    valueCol.highlights.push(value);
                                }
                            }
                        }
                        for (var j = 0, jlen = primaryMeasureSelects.length; j < jlen; j++) {
                            var measureSelect = primaryMeasureSelects[j];
                            var value = _dsr.DataShapeUtility.findAndParseCalculation(instance.Calculations, measureSelect.Value);
                            var valueCol = values[valueIdx++];
                            valueCol.values.push(value);
                            if (measureSelect.Highlight) {
                                if (!valueCol.highlights)
                                    valueCol.highlights = [];
                                var value = _dsr.DataShapeUtility.findAndParseCalculation(calculations, measureSelect.Highlight.Value);
                                valueCol.highlights.push(value);
                            }
                        }
                    }
                    return { categories: [category], lastMergeIndex: lastMergeIndex };
                };
                return DsrWithPivotedColumnsStrategy;
            })();
            var DsrReaderContext = (function () {
                function DsrReaderContext(selects, schemaName) {
                    debug.assertValue(selects, 'selects');
                    debug.assertAnyValue(schemaName, 'schemaName');
                    this.selects = selects;
                    this.schema = schemaName;
                    this.cacheItems = [];
                }
                DsrReaderContext.prototype.columnMetadata = function (selectIndex) {
                    debug.assertValue(selectIndex, 'selectIndex');
                    var select = this.selects[selectIndex];
                    debug.assertValue(select, 'select');
                    var column = {
                        displayName: '',
                        index: selectIndex,
                    };
                    if (select.Format)
                        column.format = select.Format;
                    column.type = _dsr.DataShapeUtility.describeDataType(select.Type, select.DataCategory);
                    if (select.Kind === 2 /* Measure */)
                        column.isMeasure = true;
                    return column;
                };
                DsrReaderContext.prototype.readIdentity = function (axisGroupings, instance, depth) {
                    debug.assertValue(axisGroupings, 'axisGroupings');
                    debug.assertValue(depth, 'depth');
                    var keyExprs = this.readKeys(axisGroupings, depth), expr;
                    var groupingKeys = axisGroupings[depth].Keys;
                    for (var i = 0, len = groupingKeys.length; i < len; i++) {
                        var key = groupingKeys[i], calcId = key.Calc || this.selects[key.Select].Value, valueExpr = _dsr.DataShapeUtility.findAndParseCalculationToSQExpr(instance.Calculations, calcId);
                        var exprToAdd = data.SQExprBuilder.equal(keyExprs[i], valueExpr);
                        expr = expr ? data.SQExprBuilder.and(expr, exprToAdd) : exprToAdd;
                    }
                    return data.createDataViewScopeIdentity(expr);
                };
                DsrReaderContext.prototype.readKeys = function (axisGroupings, depth) {
                    debug.assertValue(axisGroupings, 'axisGroupings');
                    debug.assertValue(depth, 'depth');
                    var axisCache = this.getAxisCache(axisGroupings);
                    var keys = axisCache.exprs[depth];
                    if (keys === undefined) {
                        keys = axisCache.exprs[depth] = [];
                        var groupingKeys = axisGroupings[depth].Keys;
                        for (var i = 0, len = groupingKeys.length; i < len; i++)
                            keys.push(this.convertKey(groupingKeys[i]));
                    }
                    return keys;
                };
                DsrReaderContext.prototype.getAxisCache = function (axisGroupings) {
                    debug.assertValue(axisGroupings, 'axisGroupings');
                    var cacheItems = this.cacheItems;
                    for (var i = 0, len = cacheItems.length; i < len; i++) {
                        var item = cacheItems[i];
                        if (item.axisGroupings === axisGroupings)
                            return item;
                    }
                    item = {
                        axisGroupings: axisGroupings,
                        exprs: [],
                    };
                    cacheItems.push(item);
                    return item;
                };
                DsrReaderContext.prototype.convertKey = function (key) {
                    debug.assertValue(key, 'key');
                    var source = key.Source;
                    return data.SQExprBuilder.fieldDef({
                        schema: this.schema,
                        // TODO: Currently allow fallback to EntitySet for legacy dashboard tiles but these aren't really interchangeable
                        // May need real upgrade in the future to convert EntitySet to Entity and then we can remove this.
                        entity: source.Entity || source.EntitySet,
                        column: source.Property,
                    });
                };
                return DsrReaderContext;
            })();
            /** Responsible for computing aggregates for tree nodes. */
            var TreeNodeValueAggregateComputer = (function () {
                function TreeNodeValueAggregateComputer(node, length, aggregators) {
                    debug.assertValue(node, 'node');
                    debug.assertValue(length, 'length');
                    debug.assertValue(aggregators, 'aggregators');
                    this.node = node;
                    this.length = length;
                    this.aggregators = aggregators;
                }
                TreeNodeValueAggregateComputer.create = function (node, selects) {
                    var nodeValues = node.values, foundAggregate = false, aggregators = {};
                    for (var i = 0, len = selects.length; i < len; i++) {
                        var select = selects[i];
                        if (!select || select.Kind !== 2 /* Measure */)
                            continue;
                        var valueAggregators, nodeMeasureValue;
                        if (nodeValues && (nodeMeasureValue = nodeValues[i])) {
                            valueAggregators = [];
                            if (nodeMeasureValue.min === undefined)
                                valueAggregators.push(new MinTreeNodeValueAggregator());
                            if (nodeMeasureValue.max === undefined)
                                valueAggregators.push(new MaxTreeNodeValueAggregator());
                            if (valueAggregators.length === 0)
                                continue;
                        }
                        else {
                            valueAggregators = [
                                new MinTreeNodeValueAggregator(),
                                new MaxTreeNodeValueAggregator(),
                            ];
                        }
                        aggregators[i] = valueAggregators;
                        foundAggregate = true;
                    }
                    if (foundAggregate)
                        return new TreeNodeValueAggregateComputer(node, len, aggregators);
                };
                TreeNodeValueAggregateComputer.prototype.add = function (index, value) {
                    var aggregators = this.aggregators[index];
                    if (!aggregators)
                        return;
                    for (var i = 0, len = aggregators.length; i < len; i++)
                        aggregators[i].update(value);
                };
                TreeNodeValueAggregateComputer.prototype.complete = function () {
                    var allAggregators = this.aggregators, node = this.node;
                    for (var selectIndex = 0, len = this.length; selectIndex < len; selectIndex++) {
                        var aggregators = allAggregators[selectIndex];
                        if (!aggregators)
                            continue;
                        for (var aggregatorIndex = 0, aggregatorsLength = aggregators.length; aggregatorIndex < aggregatorsLength; aggregatorIndex++) {
                            var aggregator = aggregators[aggregatorIndex], aggregatedValue = aggregator.value();
                            if (aggregatedValue !== undefined)
                                ensureTreeNodeValues(node, selectIndex)[aggregator.name] = aggregatedValue;
                        }
                    }
                };
                return TreeNodeValueAggregateComputer;
            })();
            var MaxTreeNodeValueAggregator = (function () {
                function MaxTreeNodeValueAggregator() {
                }
                Object.defineProperty(MaxTreeNodeValueAggregator.prototype, "name", {
                    get: function () {
                        return 'maxLocal';
                    },
                    enumerable: true,
                    configurable: true
                });
                MaxTreeNodeValueAggregator.prototype.update = function (value) {
                    if (typeof (value) !== 'number' || isNaN(value))
                        return;
                    var current = this.current;
                    this.current = (current === undefined) ? value : Math.max(current, value);
                };
                MaxTreeNodeValueAggregator.prototype.value = function () {
                    return this.current;
                };
                return MaxTreeNodeValueAggregator;
            })();
            var MinTreeNodeValueAggregator = (function () {
                function MinTreeNodeValueAggregator() {
                }
                Object.defineProperty(MinTreeNodeValueAggregator.prototype, "name", {
                    get: function () {
                        return 'minLocal';
                    },
                    enumerable: true,
                    configurable: true
                });
                MinTreeNodeValueAggregator.prototype.update = function (value) {
                    if (typeof (value) !== 'number' || isNaN(value))
                        return;
                    var current = this.current;
                    this.current = (current === undefined) ? value : Math.min(current || 0, value);
                };
                MinTreeNodeValueAggregator.prototype.value = function () {
                    return this.current;
                };
                return MinTreeNodeValueAggregator;
            })();
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            var JsonComparer = jsCommon.JsonComparer;
            var ExecuteSemanticQueryBatcher = (function () {
                /** Creates an ExecuteSemanticQueryBatcher object that will arrange a collection of executeSemanticQueries into
                *   batches before calling you back with the batch list.
                * @param preferredMaxBatches The maximum number of batches we would prefer to have. We cannot set a hard limit
                *                            on the number of batches for multi-model scenarios because with our current server
                *                            APIs we can only specify one model per request, therefore the mininum number of
                *                            batches will be the number of distinct models in the query collection.
                *                            Note: In future when we have multi-model support, if we find that users frequently
                *                            load slides with more datasources than our preferred max we can consider adding
                *                            server endpoints that allow specifying multiple datasources.
                * @param onBatchExecute      The callback that is invoked when the ExecuteSemanticQueryBatcher is done creating
                *                            the batches.
                * @ param timerFactory       Optional factory instance for creating timers
                */
                function ExecuteSemanticQueryBatcher(preferredMaxBatches, onBatchExecute, timerFactory) {
                    this.maxBatches = preferredMaxBatches;
                    this.queryExecuteCallback = onBatchExecute;
                    this.pending = [];
                    this.timerFactory = timerFactory || jsCommon.TimerPromiseFactory.instance;
                }
                /** Enqueue a query to run as part of one of the batches. The promise returned from this
                    this function will be resolved when the batch runs. */
                ExecuteSemanticQueryBatcher.prototype.enqueue = function (queudQuery) {
                    var _this = this;
                    this.pending.push(queudQuery);
                    if (!this.currentBatchDeferred) {
                        // Delay the completion after a timeout of zero.  This allow currently running JS to complete
                        // and potentially make more enqueue calls to be included in the current batch.
                        this.currentBatchDeferred = $.Deferred();
                        this.timerFactory.create(0).done(function () {
                            var batches = _this.createBatches();
                            _this.clearPending();
                            _this.queryExecuteCallback(batches);
                            _this.currentBatchDeferred.resolve();
                            _this.currentBatchDeferred = undefined;
                        });
                    }
                    return this.currentBatchDeferred.promise();
                };
                ExecuteSemanticQueryBatcher.prototype.clearPending = function () {
                    this.pending = [];
                };
                ExecuteSemanticQueryBatcher.prototype.createBatches = function () {
                    var batches = [];
                    var queriesByDataSource = this.sortQueriesByDataSource();
                    if (queriesByDataSource.length >= this.maxBatches) {
                        for (var i = 0, ilen = queriesByDataSource.length; i < ilen; ++i) {
                            batches.push(this.createBatchFromDataSourceGroup(queriesByDataSource[i]));
                        }
                    }
                    else {
                        // If we have fewer datasources than max preferred batches, split out the queries for the biggest
                        // datasource(s) so that we can utilize up to the max preferred number of connections.
                        batches = this.splitDataSourcesIntoBatches(queriesByDataSource, this.maxBatches);
                    }
                    return batches;
                };
                ExecuteSemanticQueryBatcher.prototype.sortQueriesByDataSource = function () {
                    var dataSourceGroups = [];
                    var queries = this.pending;
                    for (var i = 0, ilen = queries.length; i < ilen; ++i) {
                        var query = queries[i];
                        // Skip the queries that were cancelled
                        if (!query.execution.rejected()) {
                            var dataSourceGroup = this.findDataSourceGroup(query.options.dataSource, dataSourceGroups, query.options.cacheResponseOnServer);
                            if (dataSourceGroup) {
                                dataSourceGroup.queuedExecutions.push(query);
                            }
                            else {
                                var newDataSourceGroup = { dataSource: query.options.dataSource, queuedExecutions: [query], cacheResponseOnServer: query.options.cacheResponseOnServer };
                                dataSourceGroups.push(newDataSourceGroup);
                            }
                        }
                    }
                    return dataSourceGroups;
                };
                ExecuteSemanticQueryBatcher.prototype.findDataSourceGroup = function (dataSource, dataSourceGroups, shouldCache) {
                    for (var i = 0, ilen = dataSourceGroups.length; i < ilen; ++i) {
                        var dataSourceGroup = dataSourceGroups[i];
                        if (JsonComparer.equals(dataSource, dataSourceGroup.dataSource) && dataSourceGroup.cacheResponseOnServer === shouldCache)
                            return dataSourceGroup;
                    }
                    return null;
                };
                ExecuteSemanticQueryBatcher.prototype.createBatchFromDataSourceGroup = function (dataSourceGroup) {
                    var commands = [];
                    var promises = [];
                    var queuedExecutions = dataSourceGroup.queuedExecutions;
                    for (var i = 0, ilen = queuedExecutions.length; i < ilen; ++i) {
                        var query = queuedExecutions[i];
                        var queryOptions = queuedExecutions[i].options;
                        commands.push(queryOptions.command);
                        promises.push(query.deferred);
                    }
                    return {
                        dataSource: dataSourceGroup.dataSource,
                        commands: commands,
                        promises: promises,
                        cacheResponseOnServer: dataSourceGroup.cacheResponseOnServer
                    };
                };
                ExecuteSemanticQueryBatcher.prototype.splitDataSourcesIntoBatches = function (dataSourceGroups, maxBatches) {
                    // Start off with one dataSource per batch
                    var batches = [];
                    for (var i = 0, ilen = dataSourceGroups.length; i < ilen; ++i) {
                        batches.push(this.createBatchFromDataSourceGroup(dataSourceGroups[i]));
                    }
                    // Now try to split some of the batches if possible
                    batches = this.splitBatches(batches, maxBatches);
                    return batches;
                };
                ExecuteSemanticQueryBatcher.prototype.splitBatches = function (initialBatches, maxBatches) {
                    var batches = initialBatches.slice();
                    while (batches.length < maxBatches) {
                        // Find best candidate for splitting. This will be the batch with the most queries, though it needs to have
                        // more than one query otherwise it cannot be split.
                        var splitCandidate;
                        for (var i = 0, ilen = batches.length; i < ilen; ++i) {
                            var batch = batches[i];
                            if (batch.commands.length > 1) {
                                if (!splitCandidate || splitCandidate.commands.length < batch.commands.length)
                                    splitCandidate = batch;
                            }
                        }
                        if (splitCandidate) {
                            // Split the batch into two, and then loop again
                            batches.push(this.splitBatch(splitCandidate));
                            splitCandidate = null;
                        }
                        else {
                            // Cannot split any of the batches, finish this function
                            return batches;
                        }
                    }
                    return batches;
                };
                /** Splits half of the commands/promises out of the batch into a new batch. The new batch is set as the return value. */
                ExecuteSemanticQueryBatcher.prototype.splitBatch = function (batch) {
                    var queryCount = batch.commands.length;
                    var commands = batch.commands.splice(queryCount / 2);
                    var promises = batch.promises.splice(queryCount / 2);
                    return {
                        dataSource: batch.dataSource,
                        commands: commands,
                        promises: promises,
                        cacheResponseOnServer: batch.cacheResponseOnServer
                    };
                };
                return ExecuteSemanticQueryBatcher;
            })();
            dsr.ExecuteSemanticQueryBatcher = ExecuteSemanticQueryBatcher;
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (_data) {
        var dsr;
        (function (dsr) {
            function createExecuteSemanticQueryProxyHttpCommunication(httpService) {
                return new ExecuteSemanticQueryProxyHttpCommunication(httpService);
            }
            dsr.createExecuteSemanticQueryProxyHttpCommunication = createExecuteSemanticQueryProxyHttpCommunication;
            var ExecuteSemanticQueryProxy = (function () {
                function ExecuteSemanticQueryProxy(host, communication, delayedResultHandler, timerFactory, preferredMaxConnections) {
                    var _this = this;
                    if (preferredMaxConnections === void 0) { preferredMaxConnections = ExecuteSemanticQueryProxy.defaultPreferredMaxConnections; }
                    debug.assertValue(host, 'host');
                    this.promiseFactory = host.promiseFactory();
                    this.communication = communication;
                    this.delayedResultHandler = delayedResultHandler ? delayedResultHandler : new DefaultDelayedQueryResultHandler();
                    this.batcher = new dsr.ExecuteSemanticQueryBatcher(preferredMaxConnections, function (batches) {
                        for (var i = 0, ilen = batches.length; i < ilen; ++i)
                            _this.executeBatch(batches[i]);
                    }, timerFactory);
                    this.queryCache = new powerbi.RejectablePromiseCache(this.promiseFactory);
                }
                ExecuteSemanticQueryProxy.prototype.execute = function (options) {
                    var deferred = this.promiseFactory.defer();
                    var execution = powerbi.RejectablePromise2(deferred);
                    if (options.dataSource) {
                        var cacheKey = this.generateCacheKey(options);
                        if (this.queryCache.hasCacheEntry(cacheKey))
                            return this.queryCache.bindCacheEntry(cacheKey);
                        // If there is no cache entry, create one
                        // and batch the query for execution
                        var deferredPromise = this.queryCache.createCacheEntry(cacheKey);
                        var queuedExecution = {
                            options: options,
                            deferred: deferredPromise.deferred,
                            execution: deferredPromise.promise,
                        };
                        if (this.isCommunicationStopped) {
                            this.pausedQueries = this.pausedQueries || [];
                            this.pausedQueries.push(queuedExecution);
                        }
                        else {
                            this.batcher.enqueue(queuedExecution);
                        }
                        return this.queryCache.bindCacheEntry(cacheKey);
                    }
                    else {
                        // When there is no dataSource, we will use the command directly as the DSR source.
                        deferred.resolve(options.command);
                    }
                    return execution;
                };
                /**
                * Stops all future communication and reject and pending communication
                */
                ExecuteSemanticQueryProxy.prototype.stopCommunication = function () {
                    //Stop future communication
                    this.isCommunicationStopped = true;
                };
                /**
                * Resumes communication which enables future requests
                */
                ExecuteSemanticQueryProxy.prototype.resumeCommunication = function () {
                    this.isCommunicationStopped = false;
                    var pausedQueries = this.pausedQueries;
                    if (!pausedQueries)
                        return;
                    for (var i = 0, length = pausedQueries.length; i < length; i++) {
                        var queuedExecution = pausedQueries[i];
                        if (queuedExecution.execution.pending())
                            this.batcher.enqueue(queuedExecution);
                    }
                    this.pausedQueries = undefined;
                };
                /**
                 * Updates cache entries using an updater object. If a cache entry is affected by the update
                 * it is either re-written or cleared
                 * @param {ICacheUpdater} updater - updates the cache entry
                 * queryCache {RejectablePromiseCache<DataProviderData>} queryCache
                 */
                ExecuteSemanticQueryProxy.prototype.rewriteCacheEntries = function (rewriter) {
                    rewriteSemanticQueryCacheEntries(rewriter, this.queryCache);
                };
                /**
                 * Clear all cache entries
                 */
                ExecuteSemanticQueryProxy.prototype.clearCache = function () {
                    this.queryCache.clearAllEntries();
                };
                /**
                * Generates key used to access query cache based on the provided options
                * @param {DataProviderExecutionOptions} options - Properties of this object are used to generate cache key
                */
                ExecuteSemanticQueryProxy.prototype.generateCacheKey = function (options) {
                    if (options.dataSource) {
                        var dataSource = options.dataSource;
                        var objectKey = {
                            dbName: dataSource.dbName,
                            vsName: dataSource.vsName,
                            schemaName: dataSource.schemaName,
                            command: options.command
                        };
                        return cacheKeyObjectToString(objectKey);
                    }
                    return;
                };
                ExecuteSemanticQueryProxy.prototype.executeBatch = function (batch) {
                    var _this = this;
                    debug.assertValue(batch, 'batch');
                    debug.assert(batch.commands.length === batch.promises.length, 'Commands & promises sizes must match.');
                    var promises = batch.promises;
                    var schemaName = batch.dataSource.schemaName;
                    this.communication.execute(batch.commands, batch.dataSource, batch.cacheResponseOnServer).then(function (result) { return _this.onSuccess(result, promises, schemaName); }, function (result) { return _this.onError(promises); });
                };
                ExecuteSemanticQueryProxy.prototype.onSuccess = function (result, executions, schemaName) {
                    debug.assertValue(result, 'result');
                    debug.assertValue(executions, 'executions');
                    debug.assert(result.jobIds.length === executions.length, 'Results & promises sizes must match');
                    // The list of jobIds should match the order the queries were sent out. We'll need to resolve the results via the jobId
                    // as they can potentially be streamed back in any order (first query to complete on the backend starts streaming first).
                    var jobIds = result.jobIds;
                    var jobIdToExecution = {};
                    for (var i = 0, ilen = executions.length; i < ilen; ++i) {
                        jobIdToExecution[jobIds[i]] = executions[i];
                    }
                    var results = result.results;
                    for (var i = 0, ilen = results.length; i < ilen; ++i) {
                        var queryResultWithJobId = results[i];
                        var queryResult = queryResultWithJobId.result;
                        var execution = jobIdToExecution[queryResultWithJobId.jobId];
                        var data = queryResult.data;
                        var error = queryResult.error;
                        if (data) {
                            var dsrData = {
                                descriptor: data.descriptor,
                                dsr: data.dsr,
                                schemaName: schemaName,
                            };
                            execution.resolve(dsrData);
                        }
                        else if (error) {
                            var errorFactory = new _data.ServiceErrorToClientError(error);
                            execution.reject(errorFactory);
                        }
                        else if (queryResult.asyncResult) {
                            // If we're communicating with a server proxy that might return delayed results asynchronously, we must have a
                            // a valid delayedResultHandler registered in order to collect the delayed result later on.
                            this.delayedResultHandler.registerDelayedResult(queryResultWithJobId.jobId, execution, schemaName);
                        }
                    }
                };
                ExecuteSemanticQueryProxy.prototype.onError = function (executions) {
                    debug.assertValue(executions, 'executions');
                    for (var i = 0, len = executions.length; i < len; i++) {
                        executions[i].reject();
                    }
                };
                ExecuteSemanticQueryProxy.defaultPreferredMaxConnections = 4;
                return ExecuteSemanticQueryProxy;
            })();
            dsr.ExecuteSemanticQueryProxy = ExecuteSemanticQueryProxy;
            /**
             * Updates cache entries using an updater object. If a cache entry is affected by the update
             * it is either re-written or cleared
             * @param {ICacheUpdater} updater - updates the cache entry
             * queryCache {RejectablePromiseCache<DataProviderData>} queryCache
             */
            function rewriteSemanticQueryCacheEntries(rewriter, queryCache) {
                var cacheRewriter = {};
                if (rewriter.rewriteCacheKey)
                    cacheRewriter.rewriteKey = function (cacheKey) {
                        var objectKey = JSON.parse(cacheKey);
                        var newKey = rewriter.rewriteCacheKey(objectKey);
                        if (newKey !== objectKey)
                            return cacheKeyObjectToString(newKey);
                        return cacheKey;
                    };
                if (rewriter.rewriteCacheResult)
                    cacheRewriter.rewriteResult = function (result, cacheKey) {
                        var objectKey = JSON.parse(cacheKey);
                        var data = result;
                        var rewrittenResult = rewriter.rewriteCacheResult({
                            descriptor: data.descriptor,
                            dsr: data.dsr,
                            schemaName: objectKey.schemaName
                        });
                        return { descriptor: rewrittenResult.descriptor, dsr: rewrittenResult.dsr };
                    };
                queryCache.rewriteAllEntries(cacheRewriter);
            }
            dsr.rewriteSemanticQueryCacheEntries = rewriteSemanticQueryCacheEntries;
            /**
             * stringifies a cacheKey object
             * @param {ICacheKeyObject} objectKey
             */
            function cacheKeyObjectToString(objectKey) {
                return objectKey && JSON.stringify(objectKey);
            }
            var ExecuteSemanticQueryProxyHttpCommunication = (function () {
                function ExecuteSemanticQueryProxyHttpCommunication(httpService) {
                    debug.assertValue(httpService, 'httpService');
                    this.httpService = httpService;
                }
                ExecuteSemanticQueryProxyHttpCommunication.prototype.execute = function (commands, dataSource, cacheResponse) {
                    var requestOptions = this.httpService.powerbiRequestOptions();
                    var executeSemanticQueryRequest = {
                        semanticQueryDataShapeCommands: commands,
                        databaseName: dataSource.dbName,
                        virtualServerName: dataSource.vsName,
                        modelId: dataSource.modelId,
                    };
                    if (cacheResponse) {
                        // Send both for back compat
                        executeSemanticQueryRequest.commands = commands.map(function (command) { return { Command: command, CacheKey: JSON.stringify(command) }; });
                    }
                    return this.httpService.post(ExecuteSemanticQueryProxyHttpCommunication.uri, executeSemanticQueryRequest, requestOptions).then(function (result) { return result.data; });
                };
                ExecuteSemanticQueryProxyHttpCommunication.uri = '/explore/querydata';
                return ExecuteSemanticQueryProxyHttpCommunication;
            })();
            /** Default stub class for IExecuteSemanticQueryDelayedResultHandler. Any apps that support delayed query result scenarios
                need to provide their own implementation of this handler, so that appropriate logic can be invoked when a query result
                returns with an async placeholder instead of data or an error. */
            var DefaultDelayedQueryResultHandler = (function () {
                function DefaultDelayedQueryResultHandler() {
                }
                DefaultDelayedQueryResultHandler.prototype.registerDelayedResult = function (jobId, deferred, schemaName) {
                    debug.assertFail('Apps that want to support delayed query results need to specify an IExecuteSemanticQueryDelayedResultHandler implementation');
                    // Reject the promise so that consumers don't end up waiting for a result that will never come
                    deferred.reject(new powerbi.UnknownClientError());
                };
                DefaultDelayedQueryResultHandler.prototype.setQueryResolver = function (resolver) {
                    // No-op
                };
                return DefaultDelayedQueryResultHandler;
            })();
        })(dsr = _data.dsr || (_data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            /**
             * traverse a query binding descriptior
             * @param {QueryBindingDescriptor} descriptor - Query Binding Descriptor
             * @param {IQueryBindingDescriptorVisitorWithArg} visitor - visitor of query binding descriptor
             */
            function traverseQueryBindingDescriptorWithArg(descriptor, visitor, arg) {
                debug.assertValue(visitor, "visitor");
                debug.assertValue(descriptor, "descriptor");
                visitor.visitDescriptor(descriptor, arg);
                var selects = descriptor.Select;
                if (selects && selects.length)
                    for (var i = 0, length = selects.length; i < length; i++)
                        visitor.visitSelect(selects[i], arg);
                var expressions = descriptor.Expressions;
                if (expressions)
                    traverseExpressions(expressions, visitor, arg);
            }
            dsr.traverseQueryBindingDescriptorWithArg = traverseQueryBindingDescriptorWithArg;
            function traverseExpressions(expressions, visitor, arg) {
                debug.assertValue(expressions, 'expressions');
                visitor.visitExpressions(expressions, arg);
                debug.assertValue(expressions.Primary, 'Primary');
                traverseDataShapeExpressionsAxis(expressions.Primary, visitor, arg);
                var secondary = expressions.Secondary;
                if (secondary)
                    traverseDataShapeExpressionsAxis(secondary, visitor, arg);
            }
            function traverseDataShapeExpressionsAxis(axis, visitor, arg) {
                debug.assertValue(axis, 'axis');
                visitor.visitDataShapeExpressionsAxis(axis, arg);
                var groupings = axis.Groupings;
                debug.assertValue(groupings, 'groupings');
                for (var i = 0, length = groupings.length; i < length; i++)
                    traverseDataShapeExpressionsAxisGrouping(groupings[i], visitor, arg);
            }
            function traverseDataShapeExpressionsAxisGrouping(grouping, visitor, arg) {
                debug.assertValue(grouping, 'grouping');
                visitor.visitDataShapeExpressionsAxisGrouping(grouping, arg);
                var keys = grouping.Keys;
                debug.assertValue(keys, 'keys');
                for (var i = 0, length = keys.length; i < length; i++)
                    traverseDataShapeExpressionsAxisGroupingKey(keys[i], visitor, arg);
            }
            function traverseDataShapeExpressionsAxisGroupingKey(groupingKey, visitor, arg) {
                debug.assertValue(groupingKey, 'groupingKey');
                visitor.visitDataShapeExpressionsAxisGroupingKey(groupingKey, arg);
                debug.assertValue(groupingKey.Source, 'Source');
                visitor.visitConceptualPropertyReference(groupingKey.Source, arg);
            }
            var DefaultQueryBindingDescriptorVisitor = (function () {
                function DefaultQueryBindingDescriptorVisitor() {
                }
                DefaultQueryBindingDescriptorVisitor.prototype.visitDescriptor = function (discriptor, arg) {
                };
                DefaultQueryBindingDescriptorVisitor.prototype.visitSelect = function (select, arg) {
                };
                DefaultQueryBindingDescriptorVisitor.prototype.visitExpressions = function (expressions, arg) {
                };
                DefaultQueryBindingDescriptorVisitor.prototype.visitDataShapeExpressionsAxis = function (axis, arg) {
                };
                DefaultQueryBindingDescriptorVisitor.prototype.visitDataShapeExpressionsAxisGrouping = function (grouping, arg) {
                };
                DefaultQueryBindingDescriptorVisitor.prototype.visitDataShapeExpressionsAxisGroupingKey = function (groupingKey, arg) {
                };
                DefaultQueryBindingDescriptorVisitor.prototype.visitConceptualPropertyReference = function (propertyRef, arg) {
                };
                return DefaultQueryBindingDescriptorVisitor;
            })();
            dsr.DefaultQueryBindingDescriptorVisitor = DefaultQueryBindingDescriptorVisitor;
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            function createQueryCacheHandler() {
                return new QueryCacheHandler();
            }
            dsr.createQueryCacheHandler = createQueryCacheHandler;
            var QueryCacheHandler = (function () {
                function QueryCacheHandler() {
                }
                QueryCacheHandler.prototype.apply = function (queryProxy, changes) {
                    var rewriter = new QueryCacheRewriter(changes);
                    queryProxy.rewriteCacheEntries('dsr', rewriter);
                };
                return QueryCacheHandler;
            })();
            var QueryCacheRewriter = (function () {
                function QueryCacheRewriter(changes) {
                    this.descriptorRewriters = createQueryBindingDescriptorRewriters(changes);
                    this.schemaRewriters = data.createSchemaChangeRewriters(changes);
                }
                QueryCacheRewriter.prototype.rewriteCacheKey = function (cacheKey) {
                    var SemanticQuerySerializer = data.services.SemanticQuerySerializer;
                    var rewriters = this.schemaRewriters;
                    var command = cacheKey.command;
                    var query = SemanticQuerySerializer.deserializeQuery(command.Query);
                    for (var i = 0, length = rewriters.length; i < length; i++)
                        query = query.rewrite(rewriters[i]);
                    command.Query = SemanticQuerySerializer.serializeQuery(query);
                    cacheKey.command = command;
                    return cacheKey;
                };
                QueryCacheRewriter.prototype.rewriteCacheResult = function (result) {
                    var rewriters = this.descriptorRewriters;
                    for (var i = 0, length = rewriters.length; i < length; i++) {
                        var rewriter = rewriters[i];
                        dsr.traverseQueryBindingDescriptorWithArg(result.descriptor, rewriter, result.schemaName);
                    }
                    return result;
                };
                return QueryCacheRewriter;
            })();
            function createQueryBindingDescriptorRewriters(changes) {
                debug.assertValue(changes, 'changes');
                var rewriters = [];
                for (var i = 0, length = changes.length; i < length; i++) {
                    var change = changes[i];
                    if (change.entityRename) {
                        rewriters.push(new QueryBindingDescriptorEntityRewriter(change.entityRename));
                    }
                    if (change.propertyRename) {
                        rewriters.push(new QueryBindingDescriptorPropertyRewriter(change.propertyRename));
                    }
                }
                return rewriters;
            }
            var QueryBindingDescriptorEntityRewriter = (function (_super) {
                __extends(QueryBindingDescriptorEntityRewriter, _super);
                function QueryBindingDescriptorEntityRewriter(change) {
                    _super.call(this);
                    this.change = change;
                }
                QueryBindingDescriptorEntityRewriter.prototype.visitConceptualPropertyReference = function (propertyRef, schemaName) {
                    if (this.change.schema === schemaName && propertyRef.Entity === this.change.before)
                        propertyRef.Entity = this.change.after;
                };
                return QueryBindingDescriptorEntityRewriter;
            })(dsr.DefaultQueryBindingDescriptorVisitor);
            var QueryBindingDescriptorPropertyRewriter = (function (_super) {
                __extends(QueryBindingDescriptorPropertyRewriter, _super);
                function QueryBindingDescriptorPropertyRewriter(change) {
                    _super.call(this);
                    this.change = change;
                }
                QueryBindingDescriptorPropertyRewriter.prototype.visitConceptualPropertyReference = function (propertyRef, schemaName) {
                    if (this.change.schema === schemaName && propertyRef.Property === this.change.before)
                        propertyRef.Property = this.change.after;
                };
                return QueryBindingDescriptorPropertyRewriter;
            })(dsr.DefaultQueryBindingDescriptorVisitor);
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            var ArrayExtensions = jsCommon.ArrayExtensions;
            /** Represents a logical view of the data shape result metadata. */
            var QueryDescription = (function () {
                function QueryDescription(metadata, binding) {
                    debug.assertValue(metadata, 'metadata');
                    debug.assertValue(metadata.Select, 'metadata.Select');
                    debug.assertValue(binding, 'binding');
                    debug.assertValue(binding.Select, 'binding.Select');
                    debug.assert(metadata.Select.length === binding.Select.length, 'Metadata and Binding should have same number of select items.');
                    this._metadata = metadata;
                    this._binding = binding;
                }
                QueryDescription.prototype.getSelectRestatements = function () {
                    return this.getRestatements();
                };
                QueryDescription.prototype.getGroupRestatements = function () {
                    return this.getRestatements(1 /* Group */);
                };
                QueryDescription.prototype.getMeasureRestatements = function () {
                    return this.getRestatements(2 /* Measure */);
                };
                QueryDescription.prototype.getFilterRestatements = function () {
                    var filters = this._metadata.Filters;
                    if (ArrayExtensions.isUndefinedOrEmpty(filters))
                        return null;
                    var restatements = [];
                    for (var i = 0, len = filters.length; i < len; i++) {
                        var filter = filters[i];
                        restatements.push(filter ? filter.Restatement : '');
                    }
                    return ArrayExtensions.emptyToNull(restatements);
                };
                QueryDescription.prototype.getRestatements = function (kind) {
                    var metadata = this._metadata;
                    var binding = this._binding;
                    var restatements = [];
                    for (var i = 0, len = binding.Select.length; i < len; i++) {
                        var selectBinding = binding.Select[i], selectMetadata = metadata.Select[i];
                        if (!selectBinding)
                            continue;
                        if (kind === undefined || selectBinding.Kind === kind) {
                            restatements.push(selectMetadata.Restatement || '');
                        }
                    }
                    return ArrayExtensions.emptyToNull(restatements);
                };
                return QueryDescription;
            })();
            dsr.QueryDescription = QueryDescription;
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var dsr;
        (function (dsr) {
            function createQueryGenerator() {
                return new QueryGenerator(data.services.SemanticQuerySerializer);
            }
            dsr.createQueryGenerator = createQueryGenerator;
            var QueryGeneratorConstants = (function () {
                function QueryGeneratorConstants() {
                }
                QueryGeneratorConstants.DefaultDataVolume = 3;
                return QueryGeneratorConstants;
            })();
            var QueryGenerator = (function () {
                function QueryGenerator(serializer) {
                    debug.assertValue(serializer, 'serializer');
                    this.serializer = serializer;
                }
                QueryGenerator.prototype.run = function (options) {
                    debug.assertValue(options, 'options');
                    var query = options.query, mappings = options.mappings, highlightFilter = options.highlightFilter;
                    var indicesByName = Impl.getIndicesByName(query);
                    var mergedQueries = dsr.mergeMappings(mappings, options.projections, indicesByName);
                    // Provide a default data volume if none was specified.
                    var dataVolume = options.dataVolume;
                    if (!dataVolume)
                        dataVolume = QueryGeneratorConstants.DefaultDataVolume;
                    var dataShapeBinding = generateDataShapeBinding(this.serializer, options.projections, indicesByName, mergedQueries.mapping, highlightFilter, dataVolume, options.restartToken);
                    var queryDefinition = this.serializer.serializeQuery(query);
                    return {
                        command: {
                            Query: queryDefinition,
                            Binding: dataShapeBinding,
                        },
                        splits: mergedQueries.splits,
                    };
                };
                return QueryGenerator;
            })();
            // Exported for testability
            function generateDataShapeBinding(serializer, projections, indicesByName, mapping, highlightFilter, dataVolume, restartToken) {
                var binding = Impl.generateBaseDataShapeBinding(projections, indicesByName, mapping, dataVolume);
                if (binding) {
                    binding.Version = 1 /* Version1 */;
                    if (restartToken && binding.DataReduction && binding.DataReduction.Primary && binding.DataReduction.Primary.Window) {
                        binding.DataReduction.Primary.Window.RestartTokens = restartToken;
                    }
                    if (highlightFilter)
                        binding.Highlights = [serializer.serializeFilter(highlightFilter)];
                }
                return binding;
            }
            dsr.generateDataShapeBinding = generateDataShapeBinding;
            var Impl;
            (function (Impl) {
                function generateBaseDataShapeBinding(projections, indicesByName, mapping, dataVolume) {
                    debug.assertValue(projections, 'projections');
                    debug.assertValue(indicesByName, 'indicesByName');
                    debug.assertValue(mapping, 'mapping');
                    if (mapping.categorical)
                        return forCategorical(projections, indicesByName, mapping.categorical, dataVolume);
                    if (mapping.table)
                        return forTable(projections, indicesByName, mapping.table, dataVolume);
                    if (mapping.matrix)
                        return forMatrix(projections, indicesByName, mapping.matrix, dataVolume);
                }
                Impl.generateBaseDataShapeBinding = generateBaseDataShapeBinding;
                function forCategorical(projections, indicesByName, mapping, dataVolume) {
                    debug.assertValue(projections, 'projections');
                    debug.assertValue(indicesByName, 'indicesByName');
                    debug.assertValue(mapping, 'mapping');
                    var result = {
                        Primary: {
                            Groupings: [{ Projections: [] }],
                        }
                    };
                    var primaryDataReduction, secondaryDataReduction;
                    var primaryProjections = result.Primary.Groupings[0].Projections, hasCategories = false;
                    if (mapping.categories) {
                        var categories = mapping.categories;
                        pushIfAnyBind(primaryProjections, projections, indicesByName, categories);
                        pushIfAnyFor(primaryProjections, projections, indicesByName, categories);
                        hasCategories = primaryProjections.length > 0;
                        if (hasCategories)
                            primaryDataReduction = buildDataReductionAlgorithm(categories.dataReductionAlgorithm);
                    }
                    if (mapping.values) {
                        var valuesGrouped = mapping.values;
                        if (valuesGrouped.group) {
                            var valueGroupingProjections = projections[valuesGrouped.group.by.role];
                            if (valueGroupingProjections && valueGroupingProjections.length > 0) {
                                var visualGroupingTarget;
                                if (hasCategories && !containsAllProjections(valueGroupingProjections, primaryProjections, indicesByName)) {
                                    result.Secondary = {
                                        Groupings: [{ Projections: [] }]
                                    };
                                    visualGroupingTarget = result.Secondary.Groupings[0].Projections;
                                    secondaryDataReduction = buildDataReductionAlgorithm(valuesGrouped.group.dataReductionAlgorithm);
                                }
                                else {
                                    // NOTE: pivot the valueGroupings from the Secondary to the Primary when there are no categories.
                                    // This gives more performant queries in the backend.  Note that we invert this pivot in the DataViewTransform.
                                    visualGroupingTarget = primaryProjections;
                                    primaryDataReduction = buildDataReductionAlgorithm(valuesGrouped.group.dataReductionAlgorithm);
                                }
                                pushIfAny(visualGroupingTarget, valueGroupingProjections, indicesByName);
                            }
                            for (var i = 0, len = valuesGrouped.group.select.length; i < len; i++)
                                pushIfAnyRole(primaryProjections, projections, indicesByName, valuesGrouped.group.select[i]);
                            var valuesList = mapping.values;
                            if (valuesList.select) {
                                var valuesListProjections = [];
                                pushIfAnyRole(primaryProjections, projections, indicesByName, mapping.values, valuesListProjections);
                                pushIfAnySelect(primaryProjections, projections, indicesByName, mapping.values, valuesListProjections);
                                if (result.Secondary)
                                    result.Secondary.Groupings[0].SuppressedProjections = valuesListProjections;
                            }
                        }
                        else {
                            pushIfAnyRole(primaryProjections, projections, indicesByName, mapping.values);
                            pushIfAnySelect(primaryProjections, projections, indicesByName, mapping.values);
                        }
                    }
                    buildDataReduction(result, dataVolume, primaryDataReduction, secondaryDataReduction);
                    return result;
                }
                function forTable(projections, indicesByName, mapping, dataVolume) {
                    debug.assertValue(projections, 'projections');
                    debug.assertValue(indicesByName, 'indicesByName');
                    debug.assertValue(mapping, 'mapping');
                    var rows = mapping.rows;
                    var primaryProjections = [];
                    pushIfAnyRole(primaryProjections, projections, indicesByName, rows);
                    pushIfAnySelect(primaryProjections, projections, indicesByName, rows);
                    if (primaryProjections.length > 0) {
                        var result = {
                            Primary: {
                                Groupings: [{ Projections: primaryProjections }],
                            }
                        };
                        var hasRowsRoleMapping = rows;
                        if (hasRowsRoleMapping)
                            setSubtotals(result.Primary.Groupings, hasRowsRoleMapping);
                        var hasReductionAlgorithm = rows;
                        if (hasReductionAlgorithm) {
                            var reductionAlgorithm = buildDataReductionAlgorithm(hasReductionAlgorithm.dataReductionAlgorithm);
                            buildDataReduction(result, dataVolume, reductionAlgorithm);
                        }
                        return result;
                    }
                }
                function forMatrix(projections, indicesByName, mapping, dataVolume) {
                    debug.assertValue(projections, 'projections');
                    debug.assertValue(indicesByName, 'indicesByName');
                    debug.assertValue(mapping, 'mapping');
                    var result = {
                        Primary: {
                            Groupings: []
                        }
                    };
                    var primaryDataReduction, secondaryDataReduction;
                    var primaryGroupings = result.Primary.Groupings, hasRowGroups = false, hasColumnGroups = false;
                    if (mapping.rows) {
                        pushIfAnyForWithSeparateGroup(primaryGroupings, projections, indicesByName, mapping.rows);
                        hasRowGroups = primaryGroupings.length > 0;
                        if (hasRowGroups) {
                            primaryDataReduction = buildDataReductionAlgorithm(mapping.rows.dataReductionAlgorithm);
                            setSubtotals(primaryGroupings, mapping.rows);
                        }
                    }
                    if (mapping.columns) {
                        var groupings = [];
                        pushIfAnyForWithSeparateGroup(groupings, projections, indicesByName, mapping.columns);
                        hasColumnGroups = groupings.length > 0;
                        if (hasColumnGroups) {
                            setSubtotals(groupings, mapping.columns);
                            if (!hasRowGroups) {
                                // No primary groups, let's relocate secondary groups into the primary hierarchy and pivot hierarchies in the transformation phase
                                result.Primary.Groupings = groupings;
                                primaryDataReduction = buildDataReductionAlgorithm(mapping.columns.dataReductionAlgorithm);
                            }
                            else {
                                // Only create secondary grouping if we have groups to put there
                                result.Secondary = { Groupings: groupings };
                                secondaryDataReduction = buildDataReductionAlgorithm(mapping.columns.dataReductionAlgorithm);
                            }
                        }
                    }
                    if (mapping.values) {
                        // Get the array to store the projections.
                        // If we have column groups, we can put the measures into the innermost secondary projection,
                        // if there is no place for the secondary projections yet, let's create a temp array;
                        // after collecting the projections, we'll check if we have anything to put there (otherewise we may end up with empty secondary projections which is an invalid input for DSQT)
                        var targetGroupings = hasColumnGroups ? (result.Secondary && result.Secondary.Groupings ? result.Secondary.Groupings : []) : primaryGroupings;
                        groupCount = targetGroupings.length;
                        // We can put the measures into the innermost group, but if there isn't any, let's add one
                        if (groupCount === 0)
                            var groupCount = targetGroupings.push({ Projections: [] });
                        var innermostGroupingProjections = targetGroupings[groupCount - 1].Projections;
                        var projectionsPushed = pushIfAnyRole(innermostGroupingProjections, projections, indicesByName, mapping.values);
                        if (projectionsPushed > 0 && hasColumnGroups && !result.Secondary)
                            result.Secondary = { Groupings: targetGroupings };
                    }
                    buildDataReduction(result, dataVolume, primaryDataReduction, secondaryDataReduction);
                    return result;
                }
                function convertSubtotalType(dataViewRoleForMapping) {
                    switch (dataViewRoleForMapping.for.in.subtotalType) {
                        case 1 /* Before */:
                            return 1 /* Before */;
                        case 2 /* After */:
                            return 2 /* After */;
                        case 0 /* None */:
                            return 0 /* None */;
                    }
                }
                function setSubtotals(groupings, dataViewRoleForMapping) {
                    var subtotal = convertSubtotalType(dataViewRoleForMapping);
                    if (subtotal != null) {
                        for (var i = 0, ilen = groupings.length; i < ilen; i++)
                            groupings[i].Subtotal = subtotal;
                    }
                }
                function getIndicesByName(query) {
                    debug.assertValue(query, 'query');
                    var result = {}, select = query.select();
                    for (var i = 0, len = select.length; i < len; i++)
                        result[select[i].name] = i;
                    return result;
                }
                Impl.getIndicesByName = getIndicesByName;
                function containsAllProjections(projectionsToAdd, existingProjections, indicesByName) {
                    for (var i = 0, len = projectionsToAdd.length; i < len; i++) {
                        var queryReference = projectionsToAdd[i].queryRef, queryIndex = indicesByName[queryReference];
                        // indices should be a unique set of query references
                        if (existingProjections.indexOf(queryIndex) < 0)
                            return false;
                    }
                    return true;
                }
                function pushIfAnyRole(indices, projections, indicesByName, mapping, addedProjectionIndices) {
                    debug.assertValue(indices, 'indices');
                    debug.assertValue(projections, 'projections');
                    return pushIfAnyBind(indices, projections, indicesByName, mapping, addedProjectionIndices) + pushIfAnyFor(indices, projections, indicesByName, mapping, addedProjectionIndices);
                }
                function pushIfAnyBind(indices, projections, indicesByName, bindMapping, addedProjectionIndices) {
                    debug.assertValue(indices, 'indices');
                    debug.assertValue(projections, 'projections');
                    if (bindMapping && bindMapping.bind)
                        return pushIfAny(indices, projections[bindMapping.bind.to.role], indicesByName, addedProjectionIndices);
                    return 0;
                }
                function pushIfAnyFor(indices, projections, indicesByName, forMapping, addedProjectionIndices) {
                    debug.assertValue(indices, 'indices');
                    debug.assertValue(projections, 'projections');
                    if (forMapping && forMapping.for)
                        return pushIfAny(indices, projections[forMapping.for.in.role], indicesByName, addedProjectionIndices);
                    return 0;
                }
                function pushIfAnySelect(indices, projections, indicesByName, selectMapping, addedProjectionIndices) {
                    debug.assertValue(indices, 'indices');
                    debug.assertValue(projections, 'projections');
                    if (selectMapping && selectMapping.select) {
                        var result = 0;
                        for (var i = 0, len = selectMapping.select.length; i < len; i++)
                            result += pushIfAnyRole(indices, projections, indicesByName, selectMapping.select[i], addedProjectionIndices);
                        return result;
                    }
                    return 0;
                }
                function pushIfAny(indices, projections, indicesByName, addedProjectionIndices) {
                    debug.assertValue(indices, 'indices');
                    debug.assertValue(indicesByName, 'indicesByName');
                    if (!projections)
                        return 0;
                    for (var i = 0, len = projections.length; i < len; i++) {
                        var queryReference = projections[i].queryRef, queryIndex = indicesByName[queryReference];
                        // indices should be a unique set of query references
                        if (indices.indexOf(queryIndex) >= 0)
                            continue;
                        indices.push(queryIndex);
                        if (addedProjectionIndices)
                            addedProjectionIndices.push(queryIndex);
                    }
                    return indices.length;
                }
                function pushIfAnyForWithSeparateGroup(groupings, projections, indicesByName, forMapping) {
                    debug.assertValue(groupings, 'groupings');
                    debug.assertValue(projections, 'projections');
                    debug.assertValue(indicesByName, 'indicesByName');
                    if (!forMapping || !forMapping.for)
                        return;
                    var items = projections[forMapping.for.in.role];
                    if (items) {
                        for (var i = 0, len = items.length; i < len; i++) {
                            var queryReference = items[i].queryRef, queryIndex = indicesByName[queryReference];
                            if (!groupings.some(function (g) { return g.Projections.indexOf(queryIndex) >= 0; }))
                                groupings.push({ Projections: [queryIndex] });
                        }
                    }
                }
                function buildDataReduction(binding, dataVolume, primary, secondary) {
                    if (!primary && !secondary)
                        return;
                    binding.DataReduction = {};
                    if (dataVolume)
                        binding.DataReduction.DataVolume = dataVolume;
                    if (primary)
                        binding.DataReduction.Primary = primary;
                    if (secondary)
                        binding.DataReduction.Secondary = secondary;
                }
                function buildDataReductionAlgorithm(reduction) {
                    if (!reduction)
                        return;
                    var result;
                    if (reduction.top) {
                        result = {
                            Top: {}
                        };
                        if (reduction.top.count)
                            result.Top.Count = reduction.top.count;
                    }
                    if (reduction.bottom) {
                        result = {
                            Bottom: {}
                        };
                        if (reduction.bottom.count)
                            result.Bottom.Count = reduction.bottom.count;
                    }
                    if (reduction.sample) {
                        result = {
                            Sample: {}
                        };
                        if (reduction.sample.count)
                            result.Sample.Count = reduction.sample.count;
                    }
                    if (reduction.window) {
                        result = {
                            Window: {}
                        };
                        if (reduction.window.count)
                            result.Window.Count = reduction.window.count;
                    }
                    return result;
                }
            })(Impl || (Impl = {}));
        })(dsr = data.dsr || (data.dsr = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var segmentation;
        (function (segmentation) {
            var DataViewMerger;
            (function (DataViewMerger) {
                function mergeDataViews(source, segment) {
                    if (!areColumnArraysMergeEquivalent(source.metadata.columns, segment.metadata.columns)) {
                        // TODO: Figure out how to propagate error information from merging
                        debug.assertFail("Cannot merge data views with different metadata columns");
                    }
                    // The last segment is complete. We mark the source as complete.
                    if (!segment.metadata.segment)
                        delete source.metadata.segment;
                    if (source.table && segment.table)
                        mergeTables(source.table, segment.table);
                    if (source.categorical && segment.categorical)
                        mergeCategorical(source.categorical, segment.categorical);
                    // Tree cannot support subtotals hence we can get into situations
                    // where a node has no children in one segment and more than 1 child
                    // in another segment.
                    if (source.tree && segment.tree)
                        mergeTreeNodes(source.tree.root, segment.tree.root, true);
                    if (source.matrix && segment.matrix)
                        mergeTreeNodes(source.matrix.rows.root, segment.matrix.rows.root, false);
                }
                DataViewMerger.mergeDataViews = mergeDataViews;
                // Public for testability
                function mergeTables(source, segment) {
                    debug.assertValue(source, 'source');
                    debug.assertValue(segment, 'segment');
                    if (segment.rows.length === 0)
                        return;
                    merge(source.rows, segment.rows, segment.lastMergeIndex + 1);
                }
                DataViewMerger.mergeTables = mergeTables;
                // Public for testability
                function mergeCategorical(source, segment) {
                    debug.assertValue(source, 'source');
                    debug.assertValue(segment, 'segment');
                    // Merge categories values and identities
                    if (source.categories && segment.categories) {
                        var segmentCategoriesLength = segment.categories.length;
                        debug.assert(source.categories.length === segmentCategoriesLength, "Source and segment categories have different lengths.");
                        for (var categoryIndex = 0; categoryIndex < segmentCategoriesLength; categoryIndex++) {
                            var segmentCategory = segment.categories[categoryIndex];
                            var sourceCategory = source.categories[categoryIndex];
                            debug.assert(areColumnsMergeEquivalent(sourceCategory.source, segmentCategory.source), "Source and segment category have different sources.");
                            if (!sourceCategory.values && segmentCategory.values) {
                                sourceCategory.values = [];
                                debug.assert(!sourceCategory.identity, "Source category is missing values but has identities.");
                            }
                            if (segmentCategory.values) {
                                merge(sourceCategory.values, segmentCategory.values, segment.lastMergeIndex + 1);
                            }
                            if (!sourceCategory.identity && segmentCategory.identity) {
                                sourceCategory.identity = [];
                            }
                            if (segmentCategory.identity) {
                                merge(sourceCategory.identity, segmentCategory.identity, segment.lastMergeIndex + 1);
                            }
                        }
                    }
                    // Merge values for each value column
                    if (source.values && segment.values) {
                        var segmentValuesLength = segment.values.length;
                        debug.assert(source.values.length === segmentValuesLength, "Source and segment values have different lengths.");
                        for (var valueIndex = 0; valueIndex < segmentValuesLength; valueIndex++) {
                            var segmentValue = segment.values[valueIndex];
                            var sourceValue = source.values[valueIndex];
                            debug.assert(jsCommon.JsonComparer.equals(sourceValue.source, segmentValue.source), "Source and segment value have different sources.");
                            if (!sourceValue.values && segmentValue.values) {
                                sourceValue.values = [];
                            }
                            if (segmentValue.values) {
                                merge(sourceValue.values, segmentValue.values, segment.lastMergeIndex + 1);
                            }
                            if (segmentValue.highlights) {
                                merge(sourceValue.highlights, segmentValue.highlights, segment.lastMergeIndex + 1);
                            }
                        }
                    }
                }
                DataViewMerger.mergeCategorical = mergeCategorical;
                // Merges the segment array starting at the specified index into the source array 
                // and returns the segment slice that wasn't merged.
                // The segment array is spliced up to specified index in the process.
                function merge(source, segment, index) {
                    if (index >= segment.length)
                        return segment;
                    var result = [];
                    if (index !== undefined)
                        result = segment.splice(0, index);
                    Array.prototype.push.apply(source, segment);
                    return result;
                }
                // Public for testability
                function mergeTreeNodes(sourceRoot, segmentRoot, allowDifferentStructure) {
                    debug.assertValue(sourceRoot, 'sourceRoot');
                    debug.assertValue(segmentRoot, 'segmentRoot');
                    if (!segmentRoot.children || segmentRoot.children.length === 0)
                        return;
                    if (allowDifferentStructure && (!sourceRoot.children || sourceRoot.children.length === 0)) {
                        sourceRoot.children = segmentRoot.children;
                        return;
                    }
                    debug.assert(sourceRoot.children && sourceRoot.children.length >= 0, "Source tree has different structure than segment.");
                    var firstAppendIndex = findFirstAppendIndex(segmentRoot.children);
                    var lastSourceChild = sourceRoot.children[sourceRoot.children.length - 1];
                    var mergedChildren = merge(sourceRoot.children, segmentRoot.children, firstAppendIndex);
                    if (mergedChildren.length > 0)
                        mergeTreeNodes(lastSourceChild, mergedChildren[mergedChildren.length - 1], allowDifferentStructure);
                }
                DataViewMerger.mergeTreeNodes = mergeTreeNodes;
                function areColumnsMergeEquivalent(sourceColumn, segmentColumn) {
                    debug.assertValue(sourceColumn, 'sourceColumn');
                    debug.assertValue(segmentColumn, 'segmentColumn');
                    if (sourceColumn.displayName !== segmentColumn.displayName)
                        return false;
                    if (sourceColumn.isMeasure !== segmentColumn.isMeasure)
                        return false;
                    if (sourceColumn.type !== segmentColumn.type)
                        return false;
                    return true;
                }
                // Public for testability
                function areColumnArraysMergeEquivalent(sourceColumns, segmentColumns) {
                    debug.assertValue(sourceColumns, 'sourceColumns');
                    debug.assertValue(segmentColumns, 'segmentColumns');
                    if (sourceColumns.length !== segmentColumns.length)
                        return false;
                    for (var i = 0; i < sourceColumns.length; i++)
                        if (!areColumnsMergeEquivalent(sourceColumns[i], segmentColumns[i]))
                            return false;
                    return true;
                }
                DataViewMerger.areColumnArraysMergeEquivalent = areColumnArraysMergeEquivalent;
                function findFirstAppendIndex(children) {
                    if (children.length === 0)
                        return 0;
                    var i = 0;
                    for (; i < children.length; i++) {
                        var childSegment = children[i];
                        if (!childSegment.isMerge)
                            break;
                    }
                    return i;
                }
            })(DataViewMerger = segmentation.DataViewMerger || (segmentation.DataViewMerger = {}));
        })(segmentation = data.segmentation || (data.segmentation = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var SQExprConverter;
        (function (SQExprConverter) {
            function asScopeIdsContainer(filter, fieldSQExprs) {
                debug.assertValue(filter, 'filter');
                debug.assertValue(fieldSQExprs, 'fieldSQExprs');
                debug.assert(fieldSQExprs.length === 1, 'There should be exactly 1 field expression.');
                var filterItems = filter.conditions();
                debug.assert(filterItems.length === 1, 'There should be exactly 1 filter expression.');
                var filterItem = filterItems[0];
                if (filterItem) {
                    var visitor = new FilterScopeIdsCollectorVisitor(fieldSQExprs[0]);
                    if (filterItem.accept(visitor))
                        return visitor.getResult();
                }
            }
            SQExprConverter.asScopeIdsContainer = asScopeIdsContainer;
            /** Gets a comparand value from the given DataViewScopeIdentity. */
            function getFirstComparandValue(identity) {
                debug.assertValue(identity, 'identity');
                var comparandExpr = identity.expr.accept(new FindComparandVisitor());
                if (comparandExpr)
                    return comparandExpr.value;
            }
            SQExprConverter.getFirstComparandValue = getFirstComparandValue;
        })(SQExprConverter = data.SQExprConverter || (data.SQExprConverter = {}));
        /** Collect filter values from simple semantic filter that is similar to 'is any of' or 'is not any of', getResult() returns a collection of scopeIds.**/
        var FilterScopeIdsCollectorVisitor = (function (_super) {
            __extends(FilterScopeIdsCollectorVisitor, _super);
            function FilterScopeIdsCollectorVisitor(fieldSQExpr) {
                _super.call(this);
                this.isRoot = true;
                this.isNot = false;
                this.valueExprs = [];
                // Need to drop the entityVar before create the scopeIdentity. The ScopeIdentity created on the client is used to
                // compare the ScopeIdentity came from the server. But server doesn't have the entity variable concept, so we will
                // need to drop it in order to use JsonComparer.
                this.fieldExpr = data.SQExprBuilder.removeEntityVariables(fieldSQExpr);
            }
            FilterScopeIdsCollectorVisitor.prototype.getResult = function () {
                debug.assertValue(this.fieldExpr, 'fieldExpr');
                var valueExprs = this.valueExprs, scopeIds = [];
                for (var i = 0, len = valueExprs.length; i < len; i++) {
                    scopeIds.push(FilterScopeIdsCollectorVisitor.getScopeIdentity(this.fieldExpr, valueExprs[i]));
                }
                return {
                    isNot: this.isNot,
                    scopeIds: scopeIds,
                };
            };
            FilterScopeIdsCollectorVisitor.getScopeIdentity = function (fieldExpr, valueExpr) {
                debug.assertValue(valueExpr, 'valueExpr');
                debug.assertValue(fieldExpr, 'fieldExpr');
                return data.createDataViewScopeIdentity(data.SQExprBuilder.equal(fieldExpr, valueExpr));
            };
            FilterScopeIdsCollectorVisitor.prototype.visitOr = function (expr) {
                this.isRoot = false;
                return expr.left.accept(this) && expr.right.accept(this);
            };
            FilterScopeIdsCollectorVisitor.prototype.visitNot = function (expr) {
                if (!this.isRoot)
                    return this.unsupportedSQExpr();
                this.isNot = true;
                return expr.arg.accept(this);
            };
            FilterScopeIdsCollectorVisitor.prototype.visitConstant = function (expr) {
                if (this.isRoot && expr.type.primitiveType === 0 /* Null */)
                    return this.unsupportedSQExpr();
                this.valueExprs.push(expr);
                return true;
            };
            FilterScopeIdsCollectorVisitor.prototype.visitCompare = function (expr) {
                this.isRoot = false;
                if (expr.kind !== 0 /* Equal */)
                    return this.unsupportedSQExpr();
                return expr.left.accept(this) && expr.right.accept(this);
            };
            FilterScopeIdsCollectorVisitor.prototype.visitColumnRef = function (expr) {
                if (this.isRoot)
                    return this.unsupportedSQExpr();
                var fixedExpr = data.SQExprBuilder.removeEntityVariables(expr);
                return data.SQExpr.equals(this.fieldExpr, fixedExpr);
            };
            FilterScopeIdsCollectorVisitor.prototype.visitDefault = function (expr) {
                return this.unsupportedSQExpr();
            };
            FilterScopeIdsCollectorVisitor.prototype.unsupportedSQExpr = function () {
                return false;
            };
            return FilterScopeIdsCollectorVisitor;
        })(data.DefaultSQExprVisitor);
        var FindComparandVisitor = (function (_super) {
            __extends(FindComparandVisitor, _super);
            function FindComparandVisitor() {
                _super.apply(this, arguments);
            }
            FindComparandVisitor.prototype.visitAnd = function (expr) {
                return expr.left.accept(this) || expr.right.accept(this);
            };
            FindComparandVisitor.prototype.visitCompare = function (expr) {
                if (expr.kind === 0 /* Equal */) {
                    if (expr.right instanceof data.SQConstantExpr)
                        return expr.right;
                    if (expr.left instanceof data.SQConstantExpr)
                        return expr.left;
                }
            };
            return FindComparandVisitor;
        })(data.DefaultSQExprVisitor);
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var ArrayExtensions = jsCommon.ArrayExtensions;
        /** Recognizes DataViewScopeIdentity expression trees to extract comparison keys. */
        var ScopeIdentityKeyExtractor;
        (function (ScopeIdentityKeyExtractor) {
            function run(expr) {
                var extractor = new KeyExtractorImpl();
                expr.accept(extractor);
                if (extractor.malformed)
                    return null;
                return ArrayExtensions.emptyToNull(extractor.keys);
            }
            ScopeIdentityKeyExtractor.run = run;
            /** Recognizes expressions of the form:
              * 1) Equals(ColRef, Constant)
              * 2) And(Equals(ColRef1, Constant1), Equals(ColRef2, Constant2))
              */
            var KeyExtractorImpl = (function (_super) {
                __extends(KeyExtractorImpl, _super);
                function KeyExtractorImpl() {
                    _super.apply(this, arguments);
                    this.keys = [];
                }
                KeyExtractorImpl.prototype.visitAnd = function (expr) {
                    expr.left.accept(this);
                    expr.right.accept(this);
                };
                KeyExtractorImpl.prototype.visitCompare = function (expr) {
                    if (expr.kind !== 0 /* Equal */) {
                        this.visitDefault(expr);
                        return;
                    }
                    expr.left.accept(this);
                    expr.right.accept(this);
                };
                KeyExtractorImpl.prototype.visitColumnRef = function (expr) {
                    this.keys.push(expr);
                };
                KeyExtractorImpl.prototype.visitConstant = function (expr) {
                    // Do nothing -- comparison against constants is expected.
                };
                KeyExtractorImpl.prototype.visitDefault = function (expr) {
                    this.malformed = true;
                };
                return KeyExtractorImpl;
            })(data.DefaultSQExprVisitor);
        })(ScopeIdentityKeyExtractor = data.ScopeIdentityKeyExtractor || (data.ScopeIdentityKeyExtractor = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var SQExprConverter;
        (function (SQExprConverter) {
            function asSQFieldDef(sqExpr) {
                return sqExpr.accept(SQFieldDefinitionBuilder.instance);
            }
            SQExprConverter.asSQFieldDef = asSQFieldDef;
        })(SQExprConverter = data.SQExprConverter || (data.SQExprConverter = {}));
        var SQExprBuilder;
        (function (SQExprBuilder) {
            function fieldDef(fieldDef) {
                return wrapAggr(fieldDef) || wrapColumn(fieldDef) || wrapMeasure(fieldDef) || wrapEntity(fieldDef);
            }
            SQExprBuilder.fieldDef = fieldDef;
            function wrapAggr(fieldDef) {
                var aggr = fieldDef.aggregate;
                if (aggr !== undefined) {
                    var expr = wrapColumn(fieldDef) || wrapEntity(fieldDef);
                    if (expr)
                        return SQExprBuilder.aggregate(expr, aggr);
                }
            }
            function wrapColumn(fieldDef) {
                var column = fieldDef.column;
                if (column) {
                    var entityExpr = wrapEntity(fieldDef);
                    if (entityExpr)
                        return SQExprBuilder.columnRef(entityExpr, column);
                }
            }
            function wrapMeasure(fieldDef) {
                var measure = fieldDef.measure;
                if (measure) {
                    var entityExpr = wrapEntity(fieldDef);
                    if (entityExpr)
                        return SQExprBuilder.measureRef(entityExpr, measure);
                }
            }
            function wrapEntity(fieldDef) {
                return SQExprBuilder.entity(fieldDef.schema, fieldDef.entity, fieldDef.entityVar);
            }
        })(SQExprBuilder = data.SQExprBuilder || (data.SQExprBuilder = {}));
        var SQFieldDefinitionBuilder = (function (_super) {
            __extends(SQFieldDefinitionBuilder, _super);
            function SQFieldDefinitionBuilder() {
                _super.apply(this, arguments);
            }
            SQFieldDefinitionBuilder.prototype.visitColumnRef = function (expr) {
                var sourceRef = expr.source.accept(this);
                if (sourceRef) {
                    sourceRef.column = expr.ref;
                    return sourceRef;
                }
            };
            SQFieldDefinitionBuilder.prototype.visitMeasureRef = function (expr) {
                var sourceRef = expr.source.accept(this);
                if (sourceRef) {
                    sourceRef.measure = expr.ref;
                    return sourceRef;
                }
            };
            SQFieldDefinitionBuilder.prototype.visitAggr = function (expr) {
                var sourceRef = expr.arg.accept(this);
                if (sourceRef) {
                    sourceRef.aggregate = expr.func;
                    return sourceRef;
                }
            };
            SQFieldDefinitionBuilder.prototype.visitEntity = function (expr) {
                var fieldDef = {
                    schema: expr.schema,
                    entity: expr.entity
                };
                if (expr.variable)
                    fieldDef.entityVar = expr.variable;
                return fieldDef;
            };
            SQFieldDefinitionBuilder.instance = new SQFieldDefinitionBuilder();
            return SQFieldDefinitionBuilder;
        })(data.DefaultSQExprVisitor);
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var DateExtensions = jsCommon.DateExtensions;
        var StringExtensions = jsCommon.StringExtensions;
        var PrimitiveValueEncoding;
        (function (PrimitiveValueEncoding) {
            function decimal(value) {
                debug.assertValue(value, 'value');
                return value + 'M';
            }
            PrimitiveValueEncoding.decimal = decimal;
            function double(value) {
                debug.assertValue(value, 'value');
                return value + 'D';
            }
            PrimitiveValueEncoding.double = double;
            function integer(value) {
                debug.assertValue(value, 'value');
                return value + 'L';
            }
            PrimitiveValueEncoding.integer = integer;
            function dateTime(value) {
                debug.assertValue(value, 'value');
                // Currently, server doesn't support timezone. All date time data on the server don't have time zone information.
                // So, when we construct a dateTime object on the client, we will need to ignor user's time zone and force it to be UTC time.
                // When we subtract the timeZone offset, the date time object will remain the same value as you entered but dropped the local timeZone.
                var date = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
                var dateTimeString = date.toISOString();
                // If it ends with Z, we want to get rid of it, because with trailing Z, it will assume the dateTime is UTC, but we don't want any timeZone information, so
                // we will drop it.
                // Also, we need to add Prefix and Suffix to match the dsr value format for dateTime object.
                if (jsCommon.StringExtensions.endsWith(dateTimeString, 'Z'))
                    dateTimeString = dateTimeString.substr(0, dateTimeString.length - 1);
                return "datetime'" + dateTimeString + "'";
            }
            PrimitiveValueEncoding.dateTime = dateTime;
            function text(value) {
                debug.assertValue(value, 'value');
                return "'" + value.replace("'", "''") + "'";
            }
            PrimitiveValueEncoding.text = text;
            function nullEncoding() {
                return 'null';
            }
            PrimitiveValueEncoding.nullEncoding = nullEncoding;
            function boolean(value) {
                return value ? 'true' : 'false';
            }
            PrimitiveValueEncoding.boolean = boolean;
            /** Parses a typed value in a Data Shape Result. */
            function parseValue(dsqValue) {
                return parseValueHelper(dsqValue);
            }
            PrimitiveValueEncoding.parseValue = parseValue;
            function parseValueToSQExpr(dsqValue) {
                return parseValueHelper(dsqValue, true);
            }
            PrimitiveValueEncoding.parseValueToSQExpr = parseValueToSQExpr;
            function parseValueHelper(dsqValue, toSQExpr) {
                if (typeof (dsqValue) === "string") {
                    // Integer
                    if (StringExtensions.endsWith(dsqValue, 'L')) {
                        var intValue = parseInt(dsqValue, 10);
                        return toSQExpr ? data.SQExprBuilder.integer(intValue, dsqValue) : intValue;
                    }
                    // Double precision
                    if (StringExtensions.endsWith(dsqValue, 'D')) {
                        var doubleValue = parseFloatExtended(dsqValue);
                        return toSQExpr ? data.SQExprBuilder.double(doubleValue, dsqValue) : doubleValue;
                    }
                    // Decimal precision
                    if (StringExtensions.endsWith(dsqValue, 'M')) {
                        var decimalValue = parseFloatExtended(dsqValue);
                        return toSQExpr ? data.SQExprBuilder.decimal(decimalValue, dsqValue) : decimalValue;
                    }
                    if (StringExtensions.endsWith(dsqValue, "'")) {
                        // String
                        if (dsqValue.charAt(0) === "'") {
                            var stringValue = dsqValue.substring(1, dsqValue.length - 1).replace("''", "'");
                            return toSQExpr ? data.SQExprBuilder.text(stringValue, dsqValue) : stringValue;
                        }
                        // DateTime
                        if (dsqValue.indexOf("datetime'") === 0) {
                            var isoDate = dsqValue.substring(9, dsqValue.length - 1);
                            var dateValue = DateExtensions.parseIsoDate(isoDate);
                            return toSQExpr ? data.SQExprBuilder.dateTime(dateValue, dsqValue) : dateValue;
                        }
                    }
                    // Null
                    if (dsqValue === 'null')
                        return toSQExpr ? data.SQExprBuilder.nullConstant() : null;
                    // Boolean
                    if (dsqValue === 'true')
                        return toSQExpr ? data.SQExprBuilder.boolean(true) : true;
                    if (dsqValue === 'false')
                        return toSQExpr ? data.SQExprBuilder.boolean(false) : false;
                }
                //The server is sending boolean dsr value as true and false instead of 'true' and 'false'.
                if (typeof (dsqValue) === "boolean")
                    return toSQExpr ? data.SQExprBuilder.boolean(dsqValue) : dsqValue;
                //The server is sending null dsr value as null instead of 'null'.
                if (dsqValue == null)
                    return toSQExpr ? data.SQExprBuilder.nullConstant() : null;
                return dsqValue;
            }
            /** An extended implementation of Typescript's parseFloat which supports representations of Infinity such as 'INF'
            * used in DSR's.
            */
            function parseFloatExtended(value) {
                // The mainline case is when we have a finite number, so try to parse the raw string first and then fall back
                // to checking for Infinity if we get NaN as a result.
                var rawResult = parseFloat(value);
                if (isNaN(rawResult)) {
                    // Try to differentiate between Infinity and NaN. Running it through the parser again is slower than trying to
                    // detect Infinity ourselves, but since this isn't the mainline case it should be ok to take the safer option
                    // of the parser to catch the different cases of Infinity (e.g. positive/negative Infinity, suffixes).
                    return parseFloat(value.replace('INF', 'Infinity'));
                }
                return rawResult;
            }
        })(PrimitiveValueEncoding = data.PrimitiveValueEncoding || (data.PrimitiveValueEncoding = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /**
         * Represents the versions of the semantic query structure.
         * NOTE Keep this file in sync with the Sql\InfoNav\src\Data\Contracts\SemanticQuery\QueryVersions.cs
         *      file in the TFS Dev branch.
         */
        (function (SemanticQueryVersions) {
            /** The initial version of semantic query */
            SemanticQueryVersions[SemanticQueryVersions["Version0"] = 0] = "Version0";
            /** EDM references removed, Property split into Column/Measure, Filter targets are fixed */
            SemanticQueryVersions[SemanticQueryVersions["Version1"] = 1] = "Version1";
            /** Constants/DatePart replaced with Literal/DateSpan */
            SemanticQueryVersions[SemanticQueryVersions["Version2"] = 2] = "Version2";
        })(data.SemanticQueryVersions || (data.SemanticQueryVersions = {}));
        var SemanticQueryVersions = data.SemanticQueryVersions;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var ArrayExtensions = jsCommon.ArrayExtensions;
        /** Rewrites an expression tree, including all descendant nodes. */
        var SQExprRewriter = (function () {
            function SQExprRewriter() {
            }
            SQExprRewriter.prototype.visitColumnRef = function (expr) {
                var origArg = expr.source, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return expr;
                return new data.SQColumnRefExpr(rewrittenArg, expr.ref);
            };
            SQExprRewriter.prototype.visitMeasureRef = function (expr) {
                var origArg = expr.source, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return expr;
                return new data.SQMeasureRefExpr(rewrittenArg, expr.ref);
            };
            SQExprRewriter.prototype.visitAggr = function (expr) {
                var origArg = expr.arg, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return expr;
                return new data.SQAggregationExpr(rewrittenArg, expr.func);
            };
            SQExprRewriter.prototype.visitEntity = function (expr) {
                return expr;
            };
            SQExprRewriter.prototype.visitAnd = function (orig) {
                var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                if (origLeft === rewrittenLeft && origRight === rewrittenRight)
                    return orig;
                return new data.SQAndExpr(rewrittenLeft, rewrittenRight);
            };
            SQExprRewriter.prototype.visitBetween = function (orig) {
                var origArg = orig.arg, rewrittenArg = origArg.accept(this), origLower = orig.lower, rewrittenLower = origLower.accept(this), origUpper = orig.upper, rewrittenUpper = origUpper.accept(this);
                if (origArg === rewrittenArg && origLower === rewrittenLower && origUpper === rewrittenUpper)
                    return orig;
                return new data.SQBetweenExpr(rewrittenArg, rewrittenLower, rewrittenUpper);
            };
            SQExprRewriter.prototype.visitIn = function (orig) {
                var origArgs = orig.args, rewrittenArgs = this.rewriteAll(origArgs), origValues = orig.values, rewrittenValues;
                for (var i = 0, len = origValues.length; i < len; i++) {
                    var origValueTuple = origValues[i], rewrittenValueTuple = this.rewriteAll(origValueTuple);
                    if (origValueTuple !== rewrittenValueTuple && !rewrittenValues)
                        rewrittenValues = ArrayExtensions.take(origValues, i);
                    if (rewrittenValues)
                        rewrittenValues.push(rewrittenValueTuple);
                }
                if (origArgs === rewrittenArgs && !rewrittenValues)
                    return orig;
                return new data.SQInExpr(rewrittenArgs, rewrittenValues || origValues);
            };
            SQExprRewriter.prototype.rewriteAll = function (origExprs) {
                debug.assertValue(origExprs, 'origExprs');
                var rewrittenResult;
                for (var i = 0, len = origExprs.length; i < len; i++) {
                    var origExpr = origExprs[i], rewrittenExpr = origExpr.accept(this);
                    if (origExpr !== rewrittenExpr && !rewrittenResult)
                        rewrittenResult = ArrayExtensions.take(origExprs, i);
                    if (rewrittenResult)
                        rewrittenResult.push(rewrittenExpr);
                }
                return rewrittenResult || origExprs;
            };
            SQExprRewriter.prototype.visitOr = function (orig) {
                var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                if (origLeft === rewrittenLeft && origRight === rewrittenRight)
                    return orig;
                return new data.SQOrExpr(rewrittenLeft, rewrittenRight);
            };
            SQExprRewriter.prototype.visitCompare = function (orig) {
                var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                if (origLeft === rewrittenLeft && origRight === rewrittenRight)
                    return orig;
                return new data.SQCompareExpr(orig.kind, rewrittenLeft, rewrittenRight);
            };
            SQExprRewriter.prototype.visitContains = function (orig) {
                var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                if (origLeft === rewrittenLeft && origRight === rewrittenRight)
                    return orig;
                return new data.SQContainsExpr(rewrittenLeft, rewrittenRight);
            };
            SQExprRewriter.prototype.visitExists = function (orig) {
                var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return orig;
                return new data.SQExistsExpr(rewrittenArg);
            };
            SQExprRewriter.prototype.visitNot = function (orig) {
                var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return orig;
                return new data.SQNotExpr(rewrittenArg);
            };
            SQExprRewriter.prototype.visitStartsWith = function (orig) {
                var origLeft = orig.left, rewrittenLeft = origLeft.accept(this), origRight = orig.right, rewrittenRight = origRight.accept(this);
                if (origLeft === rewrittenLeft && origRight === rewrittenRight)
                    return orig;
                return new data.SQStartsWithExpr(rewrittenLeft, rewrittenRight);
            };
            SQExprRewriter.prototype.visitConstant = function (expr) {
                return expr;
            };
            SQExprRewriter.prototype.visitDateSpan = function (orig) {
                var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return orig;
                return new data.SQDateSpanExpr(orig.unit, rewrittenArg);
            };
            SQExprRewriter.prototype.visitDateAdd = function (orig) {
                var origArg = orig.arg, rewrittenArg = origArg.accept(this);
                if (origArg === rewrittenArg)
                    return orig;
                return new data.SQDateAddExpr(orig.unit, orig.amount, rewrittenArg);
            };
            SQExprRewriter.prototype.visitNow = function (orig) {
                return orig;
            };
            return SQExprRewriter;
        })();
        data.SQExprRewriter = SQExprRewriter;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        function createSchemaChangeRewriters(changes) {
            debug.assertValue(changes, 'changes');
            var rewriters = [];
            for (var i = 0, length = changes.length; i < length; i++) {
                var change = changes[i];
                if (change.entityRename) {
                    rewriters.push(new EntityRenameRewriter(change.entityRename));
                }
                if (change.propertyRename) {
                    rewriters.push(new PropertyRenameRewriter(change.propertyRename));
                }
            }
            return rewriters;
        }
        data.createSchemaChangeRewriters = createSchemaChangeRewriters;
        var EntityRenameRewriter = (function (_super) {
            __extends(EntityRenameRewriter, _super);
            function EntityRenameRewriter(change) {
                debug.assertValue(change, 'change');
                _super.call(this);
                this.change = change;
            }
            EntityRenameRewriter.prototype.visitEntity = function (expr) {
                var change = this.change;
                if (expr.schema === change.schema && expr.entity === change.before)
                    return new data.SQEntityExpr(expr.schema, change.after, expr.variable);
                return expr;
            };
            return EntityRenameRewriter;
        })(data.SQExprRewriter);
        var PropertyRenameRewriter = (function (_super) {
            __extends(PropertyRenameRewriter, _super);
            function PropertyRenameRewriter(change) {
                debug.assertValue(change, 'change');
                _super.call(this);
                this.change = change;
            }
            PropertyRenameRewriter.prototype.visitColumnRef = function (expr) {
                var change = this.change;
                if (this.matches(change, expr))
                    return new data.SQColumnRefExpr(expr.source, change.after);
                return expr;
            };
            PropertyRenameRewriter.prototype.visitMeasureRef = function (expr) {
                var change = this.change;
                if (this.matches(change, expr))
                    return new data.SQMeasureRefExpr(expr.source, change.after);
                return expr;
            };
            PropertyRenameRewriter.prototype.matches = function (change, expr) {
                debug.assertValue(change, 'change');
                debug.assertValue(expr, 'expr');
                var fieldDef = expr.asFieldDef();
                debug.assertValue(fieldDef, 'fieldDef');
                return (fieldDef.schema === change.schema && fieldDef.entity === change.entity && expr.ref === change.before);
            };
            return PropertyRenameRewriter;
        })(data.SQExprRewriter);
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var StringExtensions = jsCommon.StringExtensions;
        /** Represents an immutable expression within a SemanticQuery. */
        var SQExpr = (function () {
            function SQExpr() {
            }
            // TODO: remove this, and call SQExprConverter.asSQFieldDef instead.
            SQExpr.prototype.asFieldDef = function () {
                return data.SQExprConverter.asSQFieldDef(this);
            };
            SQExpr.equals = function (x, y, ignoreCase) {
                return SQExprEqualityVisitor.run(x, y, ignoreCase);
            };
            SQExpr.prototype.validate = function (schema) {
                var validator = new SQExprValidationVisitor(schema);
                this.accept(validator);
                return validator.errors;
            };
            SQExpr.prototype.accept = function (visitor, arg) {
                debug.assertFail('abstract method');
                return;
            };
            SQExpr.prototype.getMetadata = function (federatedSchema) {
                debug.assertValue(federatedSchema, 'federatedSchema');
                var field = this.asFieldDef();
                if (!field)
                    return;
                if (field.column || field.measure)
                    return this.getMetadataForProperty(field, federatedSchema);
                return SQExpr.getMetadataForEntity(field, federatedSchema);
            };
            SQExpr.prototype.getDefaultAggregate = function (federatedSchema, forceAggregation) {
                if (forceAggregation === void 0) { forceAggregation = false; }
                debug.assertValue(federatedSchema, 'federatedSchema');
                var property = this.getConceptualProperty(federatedSchema);
                if (!property)
                    return;
                var aggregate;
                if (property && property.kind === 0 /* Column */) {
                    var propertyDefaultAggregate = property.column ? property.column.defaultAggregate : null;
                    if ((property.type.integer || property.type.numeric) && propertyDefaultAggregate !== 1 /* None */) {
                        aggregate = defaultAggregateToQueryAggregateFunction(propertyDefaultAggregate);
                        if (aggregate === undefined)
                            aggregate = defaultAggregateForDataType(property.type);
                    }
                    // If we haven't found an appropriate aggregate, and want to force aggregation anyway, 
                    // aggregate on CountNonNull.
                    if (aggregate === undefined && forceAggregation) {
                        aggregate = 5 /* CountNonNull */;
                    }
                }
                return aggregate;
            };
            /** Return the SQExpr[] of group on columns if it has group on keys otherwise return the SQExpr of the column.*/
            SQExpr.prototype.getKeyColumns = function (schema) {
                var columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(this);
                if (!columnRefExpr)
                    return;
                var property = this.getConceptualProperty(schema);
                if (!property)
                    return;
                var keySQExprs = [];
                var keys = property.column ? property.column.keys : undefined;
                if (keys && keys.length > 0) {
                    for (var i = 0, len = keys.length; i < len; i++) {
                        keySQExprs.push(SQExprBuilder.columnRef(columnRefExpr.source, keys[i].name));
                    }
                }
                else
                    keySQExprs.push(columnRefExpr);
                return keySQExprs;
            };
            SQExpr.prototype.getConceptualProperty = function (federatedSchema) {
                var field = this.asFieldDef();
                if (!field)
                    return;
                return federatedSchema.schema(field.schema).findProperty(field.entity, field.column || field.measure);
            };
            SQExpr.prototype.getMetadataForProperty = function (field, federatedSchema) {
                debug.assertValue(field, 'field');
                debug.assertValue(federatedSchema, 'federatedSchema');
                var property = this.getConceptualProperty(federatedSchema);
                if (!property)
                    return;
                var format = property.format;
                var type = property.type;
                if (field.aggregate === 2 /* Count */ || field.aggregate === 5 /* CountNonNull */) {
                    type = powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Integer);
                    format = undefined;
                }
                return {
                    kind: (property.kind === 1 /* Measure */ || field.aggregate !== undefined) ? 1 /* Measure */ : 0 /* Column */,
                    type: type,
                    format: format,
                    idOnEntityKey: property.column ? property.column.idOnEntityKey : false,
                    aggregate: field.aggregate,
                    defaultAggregate: property.column ? property.column.defaultAggregate : null
                };
            };
            SQExpr.getMetadataForEntity = function (field, federatedSchema) {
                debug.assertValue(field, 'field');
                debug.assertValue(federatedSchema, 'federatedSchema');
                var entity = federatedSchema.schema(field.schema).entities.withName(field.entity);
                if (!entity)
                    return;
                // We only support count and countnonnull for entity.
                if (field.aggregate === 2 /* Count */ || field.aggregate === 5 /* CountNonNull */) {
                    return {
                        kind: 1 /* Measure */,
                        type: powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Integer),
                        format: undefined,
                        idOnEntityKey: false,
                        aggregate: field.aggregate
                    };
                }
            };
            return SQExpr;
        })();
        data.SQExpr = SQExpr;
        (function (FieldKind) {
            /** Indicates the field references a column, which evaluates to a distinct set of values (e.g., Year, Name, SalesQuantity, etc.). */
            FieldKind[FieldKind["Column"] = 0] = "Column";
            /** Indicates the field references a measure, which evaluates to a single value (e.g., SalesYTD, Sum(Sales), etc.). */
            FieldKind[FieldKind["Measure"] = 1] = "Measure";
        })(data.FieldKind || (data.FieldKind = {}));
        var FieldKind = data.FieldKind;
        // Exported for testability
        function defaultAggregateForDataType(type) {
            if (type.integer || type.numeric)
                return 0 /* Sum */;
            return 2 /* Count */;
        }
        data.defaultAggregateForDataType = defaultAggregateForDataType;
        // Exported for testability
        function defaultAggregateToQueryAggregateFunction(aggregate) {
            switch (aggregate) {
                case 6 /* Average */:
                    return 1 /* Avg */;
                case 3 /* Count */:
                    return 5 /* CountNonNull */;
                case 7 /* DistinctCount */:
                    return 2 /* Count */;
                case 5 /* Max */:
                    return 4 /* Max */;
                case 4 /* Min */:
                    return 3 /* Min */;
                case 2 /* Sum */:
                    return 0 /* Sum */;
                default:
                    return;
            }
        }
        data.defaultAggregateToQueryAggregateFunction = defaultAggregateToQueryAggregateFunction;
        var SQEntityExpr = (function (_super) {
            __extends(SQEntityExpr, _super);
            function SQEntityExpr(schema, entity, variable) {
                debug.assertValue(entity, 'entity');
                _super.call(this);
                this.schema = schema;
                this.entity = entity;
                if (variable)
                    this.variable = variable;
            }
            SQEntityExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitEntity(this, arg);
            };
            return SQEntityExpr;
        })(SQExpr);
        data.SQEntityExpr = SQEntityExpr;
        var SQPropRefExpr = (function (_super) {
            __extends(SQPropRefExpr, _super);
            function SQPropRefExpr(source, ref) {
                debug.assertValue(source, 'source');
                debug.assertValue(ref, 'ref');
                _super.call(this);
                this.source = source;
                this.ref = ref;
            }
            return SQPropRefExpr;
        })(SQExpr);
        data.SQPropRefExpr = SQPropRefExpr;
        var SQColumnRefExpr = (function (_super) {
            __extends(SQColumnRefExpr, _super);
            function SQColumnRefExpr(source, ref) {
                _super.call(this, source, ref);
            }
            SQColumnRefExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitColumnRef(this, arg);
            };
            return SQColumnRefExpr;
        })(SQPropRefExpr);
        data.SQColumnRefExpr = SQColumnRefExpr;
        var SQMeasureRefExpr = (function (_super) {
            __extends(SQMeasureRefExpr, _super);
            function SQMeasureRefExpr(source, ref) {
                _super.call(this, source, ref);
            }
            SQMeasureRefExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitMeasureRef(this, arg);
            };
            return SQMeasureRefExpr;
        })(SQPropRefExpr);
        data.SQMeasureRefExpr = SQMeasureRefExpr;
        var SQAggregationExpr = (function (_super) {
            __extends(SQAggregationExpr, _super);
            function SQAggregationExpr(arg, func) {
                debug.assertValue(arg, 'arg');
                debug.assertValue(func, 'func');
                _super.call(this);
                this.arg = arg;
                this.func = func;
            }
            SQAggregationExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitAggr(this, arg);
            };
            return SQAggregationExpr;
        })(SQExpr);
        data.SQAggregationExpr = SQAggregationExpr;
        var SQAndExpr = (function (_super) {
            __extends(SQAndExpr, _super);
            function SQAndExpr(left, right) {
                debug.assertValue(left, 'left');
                debug.assertValue(right, 'right');
                _super.call(this);
                this.left = left;
                this.right = right;
            }
            SQAndExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitAnd(this, arg);
            };
            return SQAndExpr;
        })(SQExpr);
        data.SQAndExpr = SQAndExpr;
        var SQBetweenExpr = (function (_super) {
            __extends(SQBetweenExpr, _super);
            function SQBetweenExpr(arg, lower, upper) {
                debug.assertValue(arg, 'arg');
                debug.assertValue(lower, 'lower');
                debug.assertValue(upper, 'upper');
                _super.call(this);
                this.arg = arg;
                this.lower = lower;
                this.upper = upper;
            }
            SQBetweenExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitBetween(this, arg);
            };
            return SQBetweenExpr;
        })(SQExpr);
        data.SQBetweenExpr = SQBetweenExpr;
        var SQInExpr = (function (_super) {
            __extends(SQInExpr, _super);
            function SQInExpr(args, values) {
                debug.assertValue(args, 'args');
                debug.assertValue(values, 'values');
                _super.call(this);
                this.args = args;
                this.values = values;
            }
            SQInExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitIn(this, arg);
            };
            return SQInExpr;
        })(SQExpr);
        data.SQInExpr = SQInExpr;
        var SQOrExpr = (function (_super) {
            __extends(SQOrExpr, _super);
            function SQOrExpr(left, right) {
                debug.assertValue(left, 'left');
                debug.assertValue(right, 'right');
                _super.call(this);
                this.left = left;
                this.right = right;
            }
            SQOrExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitOr(this, arg);
            };
            return SQOrExpr;
        })(SQExpr);
        data.SQOrExpr = SQOrExpr;
        var SQCompareExpr = (function (_super) {
            __extends(SQCompareExpr, _super);
            function SQCompareExpr(kind, left, right) {
                debug.assertValue(kind, 'kind');
                debug.assertValue(left, 'left');
                debug.assertValue(right, 'right');
                _super.call(this);
                this.kind = kind;
                this.left = left;
                this.right = right;
            }
            SQCompareExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitCompare(this, arg);
            };
            return SQCompareExpr;
        })(SQExpr);
        data.SQCompareExpr = SQCompareExpr;
        var SQContainsExpr = (function (_super) {
            __extends(SQContainsExpr, _super);
            function SQContainsExpr(left, right) {
                debug.assertValue(left, 'left');
                debug.assertValue(right, 'right');
                _super.call(this);
                this.left = left;
                this.right = right;
            }
            SQContainsExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitContains(this, arg);
            };
            return SQContainsExpr;
        })(SQExpr);
        data.SQContainsExpr = SQContainsExpr;
        var SQStartsWithExpr = (function (_super) {
            __extends(SQStartsWithExpr, _super);
            function SQStartsWithExpr(left, right) {
                debug.assertValue(left, 'left');
                debug.assertValue(right, 'right');
                _super.call(this);
                this.left = left;
                this.right = right;
            }
            SQStartsWithExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitStartsWith(this, arg);
            };
            return SQStartsWithExpr;
        })(SQExpr);
        data.SQStartsWithExpr = SQStartsWithExpr;
        var SQExistsExpr = (function (_super) {
            __extends(SQExistsExpr, _super);
            function SQExistsExpr(arg) {
                debug.assertValue(arg, 'arg');
                _super.call(this);
                this.arg = arg;
            }
            SQExistsExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitExists(this, arg);
            };
            return SQExistsExpr;
        })(SQExpr);
        data.SQExistsExpr = SQExistsExpr;
        var SQNotExpr = (function (_super) {
            __extends(SQNotExpr, _super);
            function SQNotExpr(arg) {
                debug.assertValue(arg, 'arg');
                _super.call(this);
                this.arg = arg;
            }
            SQNotExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitNot(this, arg);
            };
            return SQNotExpr;
        })(SQExpr);
        data.SQNotExpr = SQNotExpr;
        var SQConstantExpr = (function (_super) {
            __extends(SQConstantExpr, _super);
            function SQConstantExpr(type, value, valueEncoded) {
                debug.assertValue(type, 'type');
                _super.call(this);
                this.type = type;
                this.value = value;
                this.valueEncoded = valueEncoded;
            }
            SQConstantExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitConstant(this, arg);
            };
            return SQConstantExpr;
        })(SQExpr);
        data.SQConstantExpr = SQConstantExpr;
        var SQDateSpanExpr = (function (_super) {
            __extends(SQDateSpanExpr, _super);
            function SQDateSpanExpr(unit, arg) {
                debug.assertValue(unit, 'unit');
                debug.assertValue(arg, 'arg');
                _super.call(this);
                this.unit = unit;
                this.arg = arg;
            }
            SQDateSpanExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitDateSpan(this, arg);
            };
            return SQDateSpanExpr;
        })(SQExpr);
        data.SQDateSpanExpr = SQDateSpanExpr;
        var SQDateAddExpr = (function (_super) {
            __extends(SQDateAddExpr, _super);
            function SQDateAddExpr(unit, amount, arg) {
                debug.assertValue(unit, 'unit');
                debug.assertValue(amount, 'amount');
                debug.assertValue(arg, 'arg');
                _super.call(this);
                this.unit = unit;
                this.arg = arg;
                this.amount = amount;
            }
            SQDateAddExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitDateAdd(this, arg);
            };
            return SQDateAddExpr;
        })(SQExpr);
        data.SQDateAddExpr = SQDateAddExpr;
        var SQNowExpr = (function (_super) {
            __extends(SQNowExpr, _super);
            function SQNowExpr() {
                _super.call(this);
            }
            SQNowExpr.prototype.accept = function (visitor, arg) {
                return visitor.visitNow(this, arg);
            };
            return SQNowExpr;
        })(SQExpr);
        data.SQNowExpr = SQNowExpr;
        /** Provides utilities for creating & manipulating expressions. */
        var SQExprBuilder;
        (function (SQExprBuilder) {
            function entity(schema, entity, variable) {
                return new SQEntityExpr(schema, entity, variable);
            }
            SQExprBuilder.entity = entity;
            function columnRef(source, prop) {
                return new SQColumnRefExpr(source, prop);
            }
            SQExprBuilder.columnRef = columnRef;
            function measureRef(source, prop) {
                return new SQMeasureRefExpr(source, prop);
            }
            SQExprBuilder.measureRef = measureRef;
            function aggregate(source, aggregate) {
                return new SQAggregationExpr(source, aggregate);
            }
            SQExprBuilder.aggregate = aggregate;
            function and(left, right) {
                return new SQAndExpr(left, right);
            }
            SQExprBuilder.and = and;
            function between(arg, lower, upper) {
                return new SQBetweenExpr(arg, lower, upper);
            }
            SQExprBuilder.between = between;
            function inExpr(args, values) {
                return new SQInExpr(args, values);
            }
            SQExprBuilder.inExpr = inExpr;
            function or(left, right) {
                return new SQOrExpr(left, right);
            }
            SQExprBuilder.or = or;
            function compare(kind, left, right) {
                return new SQCompareExpr(kind, left, right);
            }
            SQExprBuilder.compare = compare;
            function contains(left, right) {
                return new SQContainsExpr(left, right);
            }
            SQExprBuilder.contains = contains;
            function exists(arg) {
                return new SQExistsExpr(arg);
            }
            SQExprBuilder.exists = exists;
            function equal(left, right) {
                return compare(0 /* Equal */, left, right);
            }
            SQExprBuilder.equal = equal;
            function not(arg) {
                return new SQNotExpr(arg);
            }
            SQExprBuilder.not = not;
            function startsWith(left, right) {
                return new SQStartsWithExpr(left, right);
            }
            SQExprBuilder.startsWith = startsWith;
            function nullConstant() {
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(0 /* Null */), null, data.PrimitiveValueEncoding.nullEncoding());
            }
            SQExprBuilder.nullConstant = nullConstant;
            function now() {
                return new SQNowExpr();
            }
            SQExprBuilder.now = now;
            function boolean(value) {
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(5 /* Boolean */), value, data.PrimitiveValueEncoding.boolean(value));
            }
            SQExprBuilder.boolean = boolean;
            function dateAdd(unit, amount, arg) {
                return new SQDateAddExpr(unit, amount, arg);
            }
            SQExprBuilder.dateAdd = dateAdd;
            function dateTime(value, valueEncoded) {
                if (valueEncoded === undefined)
                    valueEncoded = data.PrimitiveValueEncoding.dateTime(value);
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.DateTime), value, valueEncoded);
            }
            SQExprBuilder.dateTime = dateTime;
            function dateSpan(unit, arg) {
                return new SQDateSpanExpr(unit, arg);
            }
            SQExprBuilder.dateSpan = dateSpan;
            function decimal(value, valueEncoded) {
                if (valueEncoded === undefined)
                    valueEncoded = data.PrimitiveValueEncoding.decimal(value);
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Decimal), value, valueEncoded);
            }
            SQExprBuilder.decimal = decimal;
            function double(value, valueEncoded) {
                if (valueEncoded === undefined)
                    valueEncoded = data.PrimitiveValueEncoding.double(value);
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Double), value, valueEncoded);
            }
            SQExprBuilder.double = double;
            function integer(value, valueEncoded) {
                if (valueEncoded === undefined)
                    valueEncoded = data.PrimitiveValueEncoding.integer(value);
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(powerbi.ExtendedType.Integer), value, valueEncoded);
            }
            SQExprBuilder.integer = integer;
            function text(value, valueEncoded) {
                debug.assert(!valueEncoded || valueEncoded === data.PrimitiveValueEncoding.text(value), 'Incorrect encoded value specified.');
                return new SQConstantExpr(powerbi.ValueType.fromExtendedType(1 /* Text */), value, valueEncoded || data.PrimitiveValueEncoding.text(value));
            }
            SQExprBuilder.text = text;
            function setAggregate(expr, aggregate) {
                return SQExprChangeAggregateRewriter.rewrite(expr, aggregate);
            }
            SQExprBuilder.setAggregate = setAggregate;
            function removeAggregate(expr) {
                return SQExprRemoveAggregateRewriter.rewrite(expr);
            }
            SQExprBuilder.removeAggregate = removeAggregate;
            function removeEntityVariables(expr) {
                return SQExprRemoveEntityVariablesRewriter.rewrite(expr);
            }
            SQExprBuilder.removeEntityVariables = removeEntityVariables;
            function createExprWithAggregate(expr, schema, aggregateNonNumericFields) {
                debug.assertValue(expr, 'expr');
                debug.assertValue(expr, 'schema');
                var defaultAggregate = expr.getDefaultAggregate(schema, aggregateNonNumericFields);
                if (defaultAggregate !== undefined)
                    expr = SQExprBuilder.aggregate(expr, defaultAggregate);
                return expr;
            }
            SQExprBuilder.createExprWithAggregate = createExprWithAggregate;
        })(SQExprBuilder = data.SQExprBuilder || (data.SQExprBuilder = {}));
        /** Provides utilities for obtaining information about expressions. */
        var SQExprInfo;
        (function (SQExprInfo) {
            function getAggregate(expr) {
                return SQExprAggregateInfoVisitor.getAggregate(expr);
            }
            SQExprInfo.getAggregate = getAggregate;
        })(SQExprInfo = data.SQExprInfo || (data.SQExprInfo = {}));
        var SQExprEqualityVisitor = (function () {
            function SQExprEqualityVisitor(ignoreCase) {
                this.ignoreCase = ignoreCase;
            }
            SQExprEqualityVisitor.run = function (x, y, ignoreCase) {
                // Normalize falsy to null
                x = x || null;
                y = y || null;
                if (x === y)
                    return true;
                if (!x !== !y)
                    return false;
                debug.assertValue(x, 'x');
                debug.assertValue(y, 'y');
                if (ignoreCase)
                    return x.accept(SQExprEqualityVisitor.ignoreCaseInstance, y);
                return x.accept(SQExprEqualityVisitor.instance, y);
            };
            SQExprEqualityVisitor.prototype.visitColumnRef = function (expr, comparand) {
                return comparand instanceof SQColumnRefExpr && expr.ref === comparand.ref && this.equals(expr.source, comparand.source);
            };
            SQExprEqualityVisitor.prototype.visitMeasureRef = function (expr, comparand) {
                return comparand instanceof SQMeasureRefExpr && expr.ref === comparand.ref && this.equals(expr.source, comparand.source);
            };
            SQExprEqualityVisitor.prototype.visitAggr = function (expr, comparand) {
                return comparand instanceof SQAggregationExpr && expr.func === comparand.func && this.equals(expr.arg, comparand.arg);
            };
            SQExprEqualityVisitor.prototype.visitBetween = function (expr, comparand) {
                return comparand instanceof SQBetweenExpr && this.equals(expr.arg, comparand.arg) && this.equals(expr.lower, comparand.lower) && this.equals(expr.upper, comparand.upper);
            };
            SQExprEqualityVisitor.prototype.visitIn = function (expr, comparand) {
                if (!(comparand instanceof SQInExpr) || !this.equalsAll(expr.args, comparand.args))
                    return false;
                var values = expr.values, compareValues = comparand.values;
                if (values.length !== compareValues.length)
                    return false;
                for (var i = 0, len = values.length; i < len; i++) {
                    if (!this.equalsAll(values[i], compareValues[i]))
                        return false;
                }
                return true;
            };
            SQExprEqualityVisitor.prototype.visitEntity = function (expr, comparand) {
                return comparand instanceof SQEntityExpr && expr.schema === comparand.schema && expr.entity === comparand.entity && this.optionalEqual(expr.variable, comparand.variable);
            };
            SQExprEqualityVisitor.prototype.visitAnd = function (expr, comparand) {
                return comparand instanceof SQAndExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
            };
            SQExprEqualityVisitor.prototype.visitOr = function (expr, comparand) {
                return comparand instanceof SQOrExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
            };
            SQExprEqualityVisitor.prototype.visitCompare = function (expr, comparand) {
                return comparand instanceof SQCompareExpr && expr.kind === comparand.kind && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
            };
            SQExprEqualityVisitor.prototype.visitContains = function (expr, comparand) {
                return comparand instanceof SQContainsExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
            };
            SQExprEqualityVisitor.prototype.visitDateSpan = function (expr, comparand) {
                return comparand instanceof SQDateSpanExpr && expr.unit === comparand.unit && this.equals(expr.arg, comparand.arg);
            };
            SQExprEqualityVisitor.prototype.visitDateAdd = function (expr, comparand) {
                return comparand instanceof SQDateAddExpr && expr.unit === comparand.unit && expr.amount === comparand.amount && this.equals(expr.arg, comparand.arg);
            };
            SQExprEqualityVisitor.prototype.visitExists = function (expr, comparand) {
                return comparand instanceof SQExistsExpr && this.equals(expr.arg, comparand.arg);
            };
            SQExprEqualityVisitor.prototype.visitNot = function (expr, comparand) {
                return comparand instanceof SQNotExpr && this.equals(expr.arg, comparand.arg);
            };
            SQExprEqualityVisitor.prototype.visitNow = function (expr, comparand) {
                return comparand instanceof SQNowExpr;
            };
            SQExprEqualityVisitor.prototype.visitStartsWith = function (expr, comparand) {
                return comparand instanceof SQStartsWithExpr && this.equals(expr.left, comparand.left) && this.equals(expr.right, comparand.right);
            };
            SQExprEqualityVisitor.prototype.visitConstant = function (expr, comparand) {
                if (comparand instanceof SQConstantExpr && expr.type === comparand.type)
                    return expr.type.text && this.ignoreCase ? StringExtensions.equalIgnoreCase(expr.valueEncoded, comparand.valueEncoded) : expr.valueEncoded === comparand.valueEncoded;
                return false;
            };
            SQExprEqualityVisitor.prototype.optionalEqual = function (x, y) {
                // Only check equality if both values are specified.
                if (x && y)
                    return x === y;
                return true;
            };
            SQExprEqualityVisitor.prototype.equals = function (x, y) {
                return x.accept(this, y);
            };
            SQExprEqualityVisitor.prototype.equalsAll = function (x, y) {
                var len = x.length;
                if (len !== y.length)
                    return false;
                for (var i = 0; i < len; i++) {
                    if (!this.equals(x[i], y[i]))
                        return false;
                }
                return true;
            };
            SQExprEqualityVisitor.instance = new SQExprEqualityVisitor(false);
            SQExprEqualityVisitor.ignoreCaseInstance = new SQExprEqualityVisitor(true);
            return SQExprEqualityVisitor;
        })();
        /** Rewrites a root-level expression. */
        var SQExprRootRewriter = (function (_super) {
            __extends(SQExprRootRewriter, _super);
            function SQExprRootRewriter() {
                _super.apply(this, arguments);
            }
            SQExprRootRewriter.prototype.visitDefault = function (expr) {
                return expr;
            };
            return SQExprRootRewriter;
        })(data.DefaultSQExprVisitor);
        (function (SQExprValidationError) {
            SQExprValidationError[SQExprValidationError["invalidAggregateFunction"] = 0] = "invalidAggregateFunction";
            SQExprValidationError[SQExprValidationError["invalidSchemaReference"] = 1] = "invalidSchemaReference";
            SQExprValidationError[SQExprValidationError["invalidEntityReference"] = 2] = "invalidEntityReference";
            SQExprValidationError[SQExprValidationError["invalidColumnReference"] = 3] = "invalidColumnReference";
            SQExprValidationError[SQExprValidationError["invalidMeasureReference"] = 4] = "invalidMeasureReference";
            SQExprValidationError[SQExprValidationError["invalidLeftOperandType"] = 5] = "invalidLeftOperandType";
            SQExprValidationError[SQExprValidationError["invalidRightOperandType"] = 6] = "invalidRightOperandType";
        })(data.SQExprValidationError || (data.SQExprValidationError = {}));
        var SQExprValidationError = data.SQExprValidationError;
        var SQExprValidationVisitor = (function (_super) {
            __extends(SQExprValidationVisitor, _super);
            function SQExprValidationVisitor(schema) {
                debug.assertValue(schema, 'schema');
                _super.call(this);
                this.schema = schema;
            }
            SQExprValidationVisitor.prototype.visitColumnRef = function (expr) {
                var fieldDef = expr.asFieldDef();
                if (fieldDef) {
                    var entity = this.validateEntity(fieldDef.schema, fieldDef.entity);
                    if (entity) {
                        var prop = entity.properties.withName(fieldDef.column);
                        if (!prop || prop.kind !== 0 /* Column */)
                            this.register(3 /* invalidColumnReference */);
                    }
                }
                return expr;
            };
            SQExprValidationVisitor.prototype.visitMeasureRef = function (expr) {
                var fieldDef = expr.asFieldDef();
                if (fieldDef) {
                    var entity = this.validateEntity(fieldDef.schema, fieldDef.entity);
                    if (entity) {
                        var prop = entity.properties.withName(fieldDef.measure);
                        if (!prop || prop.kind !== 1 /* Measure */)
                            this.register(4 /* invalidMeasureReference */);
                    }
                }
                return expr;
            };
            SQExprValidationVisitor.prototype.visitAggr = function (expr) {
                var aggregateExpr = _super.prototype.visitAggr.call(this, expr);
                var columnRefExpr = SQExprColumnRefInfoVisitor.getColumnRefSQExpr(aggregateExpr.arg);
                if (columnRefExpr) {
                    var supportedFuncs = data.SQExprUtils.getSupportedAggregates(columnRefExpr, false, this.schema);
                    if (supportedFuncs.indexOf(expr.func) < 0)
                        this.register(0 /* invalidAggregateFunction */);
                }
                return aggregateExpr;
            };
            SQExprValidationVisitor.prototype.visitEntity = function (expr) {
                this.validateEntity(expr.schema, expr.entity);
                return expr;
            };
            SQExprValidationVisitor.prototype.visitContains = function (expr) {
                var left = expr.left;
                var right = expr.right;
                if (!(left instanceof SQColumnRefExpr))
                    this.register(5 /* invalidLeftOperandType */);
                else if (!(right instanceof SQConstantExpr) || !right.type.text)
                    this.register(6 /* invalidRightOperandType */);
                return expr;
            };
            SQExprValidationVisitor.prototype.visitStartsWith = function (expr) {
                var left = expr.left;
                var right = expr.right;
                if (!(left instanceof SQColumnRefExpr))
                    this.register(5 /* invalidLeftOperandType */);
                else if (!(right instanceof SQConstantExpr) || !right.type.text)
                    this.register(6 /* invalidRightOperandType */);
                return expr;
            };
            SQExprValidationVisitor.prototype.validateEntity = function (schemaName, entityName) {
                var schema = this.schema.schema(schemaName);
                if (schema) {
                    var entity = schema.entities.withName(entityName);
                    if (entity)
                        return entity;
                    this.register(2 /* invalidEntityReference */);
                }
                else {
                    this.register(1 /* invalidSchemaReference */);
                }
            };
            SQExprValidationVisitor.prototype.register = function (error) {
                if (!this.errors)
                    this.errors = [];
                this.errors.push(error);
            };
            return SQExprValidationVisitor;
        })(data.SQExprRewriter);
        /** Returns an expression's aggregate function, or undefined if it doesn't have one. */
        var SQExprAggregateInfoVisitor = (function (_super) {
            __extends(SQExprAggregateInfoVisitor, _super);
            function SQExprAggregateInfoVisitor() {
                _super.apply(this, arguments);
            }
            SQExprAggregateInfoVisitor.prototype.visitAggr = function (expr) {
                return expr.func;
            };
            SQExprAggregateInfoVisitor.prototype.visitDefault = function (expr) {
                return;
            };
            SQExprAggregateInfoVisitor.getAggregate = function (expr) {
                var visitor = new SQExprAggregateInfoVisitor();
                return expr.accept(visitor);
            };
            return SQExprAggregateInfoVisitor;
        })(data.DefaultSQExprVisitor);
        /** Returns a SQExprColumnRef expression or undefined.*/
        var SQExprColumnRefInfoVisitor = (function (_super) {
            __extends(SQExprColumnRefInfoVisitor, _super);
            function SQExprColumnRefInfoVisitor() {
                _super.apply(this, arguments);
            }
            SQExprColumnRefInfoVisitor.prototype.visitColumnRef = function (expr) {
                return expr;
            };
            SQExprColumnRefInfoVisitor.prototype.visitDefault = function (expr) {
                return;
            };
            SQExprColumnRefInfoVisitor.getColumnRefSQExpr = function (expr) {
                var visitor = new SQExprColumnRefInfoVisitor();
                return expr.accept(visitor);
            };
            return SQExprColumnRefInfoVisitor;
        })(data.DefaultSQExprVisitor);
        var SQExprChangeAggregateRewriter = (function (_super) {
            __extends(SQExprChangeAggregateRewriter, _super);
            function SQExprChangeAggregateRewriter(func) {
                debug.assertValue(func, 'func');
                _super.call(this);
                this.func = func;
            }
            SQExprChangeAggregateRewriter.prototype.visitAggr = function (expr) {
                if (expr.func === this.func)
                    return expr;
                return new SQAggregationExpr(expr.arg, this.func);
            };
            SQExprChangeAggregateRewriter.prototype.visitColumnRef = function (expr) {
                return new SQAggregationExpr(expr, this.func);
            };
            SQExprChangeAggregateRewriter.rewrite = function (expr, func) {
                debug.assertValue(expr, 'expr');
                debug.assertValue(func, 'func');
                var rewriter = new SQExprChangeAggregateRewriter(func);
                return expr.accept(rewriter);
            };
            return SQExprChangeAggregateRewriter;
        })(SQExprRootRewriter);
        var SQExprRemoveAggregateRewriter = (function (_super) {
            __extends(SQExprRemoveAggregateRewriter, _super);
            function SQExprRemoveAggregateRewriter() {
                _super.apply(this, arguments);
            }
            SQExprRemoveAggregateRewriter.prototype.visitAggr = function (expr) {
                return expr.arg;
            };
            SQExprRemoveAggregateRewriter.rewrite = function (expr) {
                debug.assertValue(expr, 'expr');
                return expr.accept(SQExprRemoveAggregateRewriter.instance);
            };
            SQExprRemoveAggregateRewriter.instance = new SQExprRemoveAggregateRewriter();
            return SQExprRemoveAggregateRewriter;
        })(SQExprRootRewriter);
        var SQExprRemoveEntityVariablesRewriter = (function (_super) {
            __extends(SQExprRemoveEntityVariablesRewriter, _super);
            function SQExprRemoveEntityVariablesRewriter() {
                _super.apply(this, arguments);
            }
            SQExprRemoveEntityVariablesRewriter.prototype.visitEntity = function (expr) {
                if (expr.variable)
                    return SQExprBuilder.entity(expr.schema, expr.entity);
                return expr;
            };
            SQExprRemoveEntityVariablesRewriter.rewrite = function (expr) {
                debug.assertValue(expr, 'expr');
                return expr.accept(SQExprRemoveEntityVariablesRewriter.instance);
            };
            SQExprRemoveEntityVariablesRewriter.instance = new SQExprRemoveEntityVariablesRewriter();
            return SQExprRemoveEntityVariablesRewriter;
        })(data.SQExprRewriter);
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var StringExtensions = jsCommon.StringExtensions;
        var SQExprUtils;
        (function (SQExprUtils) {
            /** Returns an array of supported aggregates for a given expr and role. */
            function getSupportedAggregates(expr, isGroupingOnly, schema) {
                var emptyList = [];
                var metadata = getMetadataForUnderlyingType(expr, schema);
                // don't use expr.validate as validate will be using this function and we end up in a recursive loop
                if (!metadata) {
                    return emptyList;
                }
                var valueType = metadata.type, fieldKind = metadata.kind, isPropertyIdentity = metadata.idOnEntityKey, Agg = data.QueryAggregateFunction; // alias
                if (!valueType)
                    return emptyList;
                // Cannot aggregate on model measures
                if (fieldKind === 1 /* Measure */)
                    return emptyList;
                // Cannot aggregate grouping exprs
                if (isGroupingOnly)
                    return emptyList;
                if (valueType.numeric || valueType.integer) {
                    if (metadata.defaultAggregate === 1 /* None */) {
                        return [2 /* Count */, 5 /* CountNonNull */];
                    }
                    else {
                        return [0 /* Sum */, 1 /* Avg */, 3 /* Min */, 4 /* Max */, 2 /* Count */, 5 /* CountNonNull */];
                    }
                }
                else if (valueType.text || valueType.bool || valueType.dateTime) {
                    if (isPropertyIdentity)
                        return [5 /* CountNonNull */];
                    return [2 /* Count */, 5 /* CountNonNull */];
                }
                debug.assertFail("Unexpected expr or role.");
                return emptyList;
            }
            SQExprUtils.getSupportedAggregates = getSupportedAggregates;
            function indexOfExpr(items, searchElement) {
                debug.assertValue(items, 'items');
                debug.assertValue(searchElement, 'searchElement');
                for (var i = 0, len = items.length; i < len; i++) {
                    if (data.SQExpr.equals(items[i], searchElement))
                        return i;
                }
                return -1;
            }
            SQExprUtils.indexOfExpr = indexOfExpr;
            function sequenceEqual(x, y) {
                debug.assertValue(x, 'x');
                debug.assertValue(y, 'y');
                var len = x.length;
                if (len !== y.length)
                    return false;
                for (var i = 0; i < len; i++) {
                    if (!data.SQExpr.equals(x[i], y[i]))
                        return false;
                }
                return true;
            }
            SQExprUtils.sequenceEqual = sequenceEqual;
            function uniqueName(namedItems, expr) {
                debug.assertValue(namedItems, 'namedItems');
                // Determine all names
                var names = {};
                for (var i = 0, len = namedItems.length; i < len; i++)
                    names[namedItems[i].name] = true;
                return StringExtensions.findUniqueName(names, defaultName(expr));
            }
            SQExprUtils.uniqueName = uniqueName;
            /** Generates a default expression name  */
            function defaultName(expr, fallback) {
                if (fallback === void 0) { fallback = 'select'; }
                if (!expr)
                    return fallback;
                return expr.accept(SQExprDefaultNameGenerator.instance, fallback);
            }
            SQExprUtils.defaultName = defaultName;
            function getMetadataForUnderlyingType(expr, schema) {
                // Unwrap the aggregate (if the expr has one), and look at the underlying type.
                var metadata = data.SQExprBuilder.removeAggregate(expr).getMetadata(schema);
                if (!metadata)
                    metadata = expr.getMetadata(schema);
                return metadata;
            }
            var SQExprDefaultNameGenerator = (function (_super) {
                __extends(SQExprDefaultNameGenerator, _super);
                function SQExprDefaultNameGenerator() {
                    _super.apply(this, arguments);
                }
                SQExprDefaultNameGenerator.prototype.visitEntity = function (expr) {
                    return expr.entity;
                };
                SQExprDefaultNameGenerator.prototype.visitColumnRef = function (expr) {
                    return expr.source.accept(this) + '.' + expr.ref;
                };
                SQExprDefaultNameGenerator.prototype.visitMeasureRef = function (expr, fallback) {
                    return expr.source.accept(this) + '.' + expr.ref;
                };
                SQExprDefaultNameGenerator.prototype.visitAggr = function (expr, fallback) {
                    return data.QueryAggregateFunction[expr.func] + '(' + expr.arg.accept(this) + ')';
                };
                SQExprDefaultNameGenerator.prototype.visitDefault = function (expr, fallback) {
                    return fallback || 'expr';
                };
                SQExprDefaultNameGenerator.instance = new SQExprDefaultNameGenerator();
                return SQExprDefaultNameGenerator;
            })(data.DefaultSQExprVisitorWithArg);
        })(SQExprUtils = data.SQExprUtils || (data.SQExprUtils = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var SemanticQueryRewriter = (function () {
            function SemanticQueryRewriter(exprRewriter) {
                this.exprRewriter = exprRewriter;
            }
            SemanticQueryRewriter.prototype.rewriteFrom = function (fromValue) {
                var fromContents = {};
                var originalFrom = fromValue, originalFromKeys = originalFrom.keys();
                for (var i = 0, len = originalFromKeys.length; i < len; i++) {
                    var keyName = originalFromKeys[i], originalEntityRef = originalFrom.entity(keyName), originalEntityExpr = data.SQExprBuilder.entity(originalEntityRef.schema, originalEntityRef.entity, keyName), updatedEntityExpr = originalEntityExpr.accept(this.exprRewriter);
                    fromContents[keyName] = {
                        schema: updatedEntityExpr.schema,
                        entity: updatedEntityExpr.entity,
                    };
                }
                return new data.SQFrom(fromContents);
            };
            SemanticQueryRewriter.prototype.rewriteSelect = function (selectItems, from) {
                debug.assertValue(from, 'from');
                if (!selectItems || selectItems.length === 0)
                    return;
                var select = [];
                for (var i = 0, len = selectItems.length; i < len; i++) {
                    var item = selectItems[i];
                    select.push({
                        name: item.name,
                        expr: data.SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from)
                    });
                }
                return select;
            };
            SemanticQueryRewriter.prototype.rewriteOrderBy = function (orderByItems, from) {
                debug.assertValue(from, 'from');
                if (!orderByItems || orderByItems.length === 0)
                    return;
                var orderBy = [];
                for (var i = 0, len = orderByItems.length; i < len; i++) {
                    var item = orderByItems[i], updatedExpr = data.SQExprRewriterWithSourceRenames.rewrite(item.expr.accept(this.exprRewriter), from);
                    orderBy.push({
                        direction: item.direction,
                        expr: updatedExpr,
                    });
                }
                return orderBy;
            };
            SemanticQueryRewriter.prototype.rewriteWhere = function (whereItems, from) {
                var _this = this;
                debug.assertValue(from, 'from');
                if (!whereItems || whereItems.length === 0)
                    return;
                var where = [];
                for (var i = 0, len = whereItems.length; i < len; i++) {
                    var originalWhere = whereItems[i];
                    var updatedWhere = {
                        condition: data.SQExprRewriterWithSourceRenames.rewrite(originalWhere.condition.accept(this.exprRewriter), from),
                    };
                    if (originalWhere.target)
                        updatedWhere.target = originalWhere.target.map(function (e) { return data.SQExprRewriterWithSourceRenames.rewrite(e.accept(_this.exprRewriter), from); });
                    where.push(updatedWhere);
                }
                return where;
            };
            return SemanticQueryRewriter;
        })();
        data.SemanticQueryRewriter = SemanticQueryRewriter;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var ArrayExtensions = jsCommon.ArrayExtensions;
        /**
         * Represents a semantic query that is:
         * 1) Round-trippable with a JSON QueryDefinition.
         * 2) Immutable
         * 3) Long-lived and does not have strong references to a conceptual model (only names).
         */
        var SemanticQuery = (function () {
            function SemanticQuery(from, where, orderBy, select) {
                debug.assertValue(from, 'from');
                debug.assertValue(select, 'select');
                this.fromValue = from;
                this.whereItems = where;
                this.orderByItems = orderBy;
                this.selectItems = select;
            }
            SemanticQuery.create = function () {
                if (!SemanticQuery.empty)
                    SemanticQuery.empty = new SemanticQuery(new SQFrom(), null, null, []);
                return SemanticQuery.empty;
            };
            SemanticQuery.createWithTrimmedFrom = function (from, where, orderBy, select) {
                var unreferencedKeyFinder = new UnreferencedKeyFinder(from.keys());
                // Where
                if (where) {
                    for (var i = 0, len = where.length; i < len; i++) {
                        var filter = where[i];
                        filter.condition.accept(unreferencedKeyFinder);
                        var filterTarget = filter.target;
                        if (filterTarget) {
                            for (var j = 0, jlen = filterTarget.length; j < jlen; j++)
                                if (filterTarget[j])
                                    filterTarget[j].accept(unreferencedKeyFinder);
                        }
                    }
                }
                // OrderBy
                if (orderBy) {
                    for (var i = 0, len = orderBy.length; i < len; i++)
                        orderBy[i].expr.accept(unreferencedKeyFinder);
                }
                for (var i = 0, len = select.length; i < len; i++)
                    select[i].expr.accept(unreferencedKeyFinder);
                var unreferencedKeys = unreferencedKeyFinder.result();
                for (var i = 0, len = unreferencedKeys.length; i < len; i++)
                    from.remove(unreferencedKeys[i]);
                return new SemanticQuery(from, where, orderBy, select);
            };
            SemanticQuery.prototype.from = function () {
                return this.fromValue.clone();
            };
            SemanticQuery.prototype.select = function (values) {
                if (arguments.length === 0)
                    return this.getSelect();
                return this.setSelect(values);
            };
            SemanticQuery.prototype.getSelect = function () {
                return ArrayExtensions.extendWithName(this.selectItems.map(function (s) {
                    return {
                        name: s.name,
                        expr: s.expr,
                    };
                }));
            };
            SemanticQuery.prototype.setSelect = function (values) {
                var selectItems = [], from = this.fromValue.clone();
                for (var i = 0, len = values.length; i < len; i++) {
                    var value = values[i];
                    selectItems.push({
                        name: value.name,
                        expr: SQExprRewriterWithSourceRenames.rewrite(value.expr, from)
                    });
                }
                return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.orderByItems, selectItems);
            };
            /** Removes the given expression from the select. */
            SemanticQuery.prototype.removeSelect = function (expr) {
                debug.assertValue(expr, 'expr');
                var originalItems = this.selectItems, selectItems = [];
                for (var i = 0, len = originalItems.length; i < len; i++) {
                    var originalExpr = originalItems[i];
                    if (data.SQExpr.equals(originalExpr.expr, expr))
                        continue;
                    selectItems.push(originalExpr);
                }
                return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, this.orderByItems, selectItems);
            };
            /** Removes the given expression from order by. */
            SemanticQuery.prototype.removeOrderBy = function (expr) {
                var sorts = this.orderBy();
                for (var i = sorts.length - 1; i >= 0; i--) {
                    if (data.SQExpr.equals(sorts[i].expr, expr))
                        sorts.splice(i, 1);
                }
                return SemanticQuery.createWithTrimmedFrom(this.fromValue.clone(), this.whereItems, sorts, this.selectItems);
            };
            SemanticQuery.prototype.selectNameOf = function (expr) {
                var index = data.SQExprUtils.indexOfExpr(this.selectItems.map(function (s) { return s.expr; }), expr);
                if (index >= 0)
                    return this.selectItems[index].name;
            };
            SemanticQuery.prototype.setSelectAt = function (index, expr) {
                debug.assertValue(expr, 'expr');
                if (index >= this.selectItems.length)
                    return;
                var select = this.select(), from = this.fromValue.clone(), originalName = select[index].name;
                select[index] = {
                    name: originalName,
                    expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
                };
                return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.orderByItems, select);
            };
            /** Adds a the expression to the select clause. */
            SemanticQuery.prototype.addSelect = function (expr) {
                debug.assertValue(expr, 'expr');
                var selectItems = this.select(), from = this.fromValue.clone();
                selectItems.push({
                    name: data.SQExprUtils.uniqueName(selectItems, expr),
                    expr: SQExprRewriterWithSourceRenames.rewrite(expr, from)
                });
                return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, this.orderByItems, selectItems);
            };
            SemanticQuery.prototype.orderBy = function (values) {
                if (arguments.length === 0)
                    return this.getOrderBy();
                return this.setOrderBy(values);
            };
            SemanticQuery.prototype.getOrderBy = function () {
                var result = [];
                var orderBy = this.orderByItems;
                if (orderBy) {
                    for (var i = 0, len = orderBy.length; i < len; i++) {
                        var clause = orderBy[i];
                        result.push({
                            expr: clause.expr,
                            direction: clause.direction,
                        });
                    }
                }
                return result;
            };
            SemanticQuery.prototype.setOrderBy = function (values) {
                debug.assertValue(values, 'values');
                var updatedOrderBy = [], from = this.fromValue.clone();
                for (var i = 0, len = values.length; i < len; i++) {
                    var clause = values[i];
                    updatedOrderBy.push({
                        expr: SQExprRewriterWithSourceRenames.rewrite(clause.expr, from),
                        direction: clause.direction,
                    });
                }
                return SemanticQuery.createWithTrimmedFrom(from, this.whereItems, updatedOrderBy, this.selectItems);
            };
            SemanticQuery.prototype.where = function (values) {
                if (arguments.length === 0)
                    return this.getWhere();
                return this.setWhere(values);
            };
            SemanticQuery.prototype.getWhere = function () {
                var result = [];
                var whereItems = this.whereItems;
                if (whereItems) {
                    for (var i = 0, len = whereItems.length; i < len; i++)
                        result.push(whereItems[i]);
                }
                return result;
            };
            SemanticQuery.prototype.setWhere = function (values) {
                debug.assertValue(values, 'values');
                var updatedWhere = [], from = this.fromValue.clone();
                for (var i = 0, len = values.length; i < len; i++) {
                    var filter = values[i];
                    var updatedFilter = {
                        condition: SQExprRewriterWithSourceRenames.rewrite(filter.condition, from),
                    };
                    var filterTarget = filter.target;
                    if (filterTarget) {
                        updatedFilter.target = [];
                        for (var j = 0, jlen = filterTarget.length; j < jlen; j++)
                            if (filterTarget[j]) {
                                var updatedTarget = SQExprRewriterWithSourceRenames.rewrite(filterTarget[j], from);
                                updatedFilter.target.push(updatedTarget);
                            }
                    }
                    updatedWhere.push(updatedFilter);
                }
                return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.orderByItems, this.selectItems);
            };
            SemanticQuery.prototype.addWhere = function (filter) {
                debug.assertValue(filter, 'filter');
                var updatedWhere = this.where(), incomingWhere = filter.where(), from = this.fromValue.clone();
                for (var i = 0, len = incomingWhere.length; i < len; i++) {
                    var clause = incomingWhere[i];
                    var updatedClause = {
                        condition: SQExprRewriterWithSourceRenames.rewrite(clause.condition, from),
                    };
                    if (clause.target)
                        updatedClause.target = clause.target.map(function (t) { return SQExprRewriterWithSourceRenames.rewrite(t, from); });
                    updatedWhere.push(updatedClause);
                }
                return SemanticQuery.createWithTrimmedFrom(from, updatedWhere, this.orderByItems, this.selectItems);
            };
            SemanticQuery.prototype.rewrite = function (exprRewriter) {
                var rewriter = new data.SemanticQueryRewriter(exprRewriter);
                var from = rewriter.rewriteFrom(this.fromValue);
                var where = rewriter.rewriteWhere(this.whereItems, from);
                var orderBy = rewriter.rewriteOrderBy(this.orderByItems, from);
                var select = rewriter.rewriteSelect(this.selectItems, from);
                return SemanticQuery.createWithTrimmedFrom(from, where, orderBy, select);
            };
            return SemanticQuery;
        })();
        data.SemanticQuery = SemanticQuery;
        /** Represents a semantic filter condition.  Round-trippable with a JSON FilterDefinition.  Instances of this class are immutable. */
        var SemanticFilter = (function () {
            function SemanticFilter(from, where) {
                debug.assertValue(from, 'from');
                debug.assertValue(where, 'where');
                this.fromValue = from;
                this.whereItems = where;
            }
            SemanticFilter.fromSQExpr = function (contract) {
                debug.assertValue(contract, 'contract');
                var from = new SQFrom();
                var rewrittenContract = SQExprRewriterWithSourceRenames.rewrite(contract, from);
                // DEVNOTE targets of some filters are visual specific and will get resolved only during query generation.
                //         Thus not setting a target here.
                var where = [{
                    condition: rewrittenContract
                }];
                return new SemanticFilter(from, where);
            };
            SemanticFilter.prototype.from = function () {
                return this.fromValue.clone();
            };
            SemanticFilter.prototype.conditions = function () {
                var expressions = [];
                var where = this.whereItems;
                for (var i = 0, len = where.length; i < len; i++) {
                    var filter = where[i];
                    expressions.push(filter.condition);
                }
                return expressions;
            };
            SemanticFilter.prototype.where = function () {
                var result = [];
                var whereItems = this.whereItems;
                for (var i = 0, len = whereItems.length; i < len; i++)
                    result.push(whereItems[i]);
                return result;
            };
            SemanticFilter.prototype.rewrite = function (exprRewriter) {
                var rewriter = new data.SemanticQueryRewriter(exprRewriter);
                var from = rewriter.rewriteFrom(this.fromValue);
                var where = rewriter.rewriteWhere(this.whereItems, from);
                return new SemanticFilter(from, where);
            };
            /** Merges a list of SemanticFilters into one. */
            SemanticFilter.merge = function (filters) {
                if (ArrayExtensions.isUndefinedOrEmpty(filters))
                    return null;
                if (filters.length === 1)
                    return filters[0];
                var firstFilter = filters[0];
                var from = firstFilter.from(), where = ArrayExtensions.take(firstFilter.whereItems, firstFilter.whereItems.length);
                for (var i = 1, len = filters.length; i < len; i++)
                    SemanticFilter.applyFilter(filters[i], from, where);
                return new SemanticFilter(from, where);
            };
            SemanticFilter.applyFilter = function (filter, from, where) {
                debug.assertValue(filter, 'filter');
                debug.assertValue(from, 'from');
                debug.assertValue(where, 'where');
                // Where
                var filterWhereItems = filter.whereItems;
                for (var i = 0; i < filterWhereItems.length; i++) {
                    var filterWhereItem = filterWhereItems[i];
                    var updatedWhereItem = {
                        condition: SQExprRewriterWithSourceRenames.rewrite(filterWhereItem.condition, from),
                    };
                    if (filterWhereItem.target)
                        updatedWhereItem.target = filterWhereItem.target.map(function (e) { return SQExprRewriterWithSourceRenames.rewrite(e, from); });
                    where.push(updatedWhereItem);
                }
            };
            return SemanticFilter;
        })();
        data.SemanticFilter = SemanticFilter;
        /** Represents a SemanticQuery/SemanticFilter from clause. */
        var SQFrom = (function () {
            function SQFrom(items) {
                this.items = items || {};
            }
            SQFrom.prototype.keys = function () {
                return Object.keys(this.items);
            };
            SQFrom.prototype.entity = function (key) {
                return this.items[key];
            };
            SQFrom.prototype.ensureEntity = function (entity, desiredVariableName) {
                debug.assertValue(entity, 'entity');
                // 1) Reuse a reference to the entity among the already referenced
                var keys = this.keys();
                for (var i = 0, len = keys.length; i < len; i++) {
                    var key = keys[i], item = this.items[key];
                    if (item && entity.entity === item.entity && entity.schema === item.schema)
                        return { name: key };
                }
                // 2) Add a reference to the entity
                var candidateName = desiredVariableName || this.candidateName(entity.entity), uniqueName = candidateName, i = 2;
                while (this.items[uniqueName]) {
                    uniqueName = candidateName + i++;
                }
                this.items[uniqueName] = entity;
                return { name: uniqueName, new: true };
            };
            SQFrom.prototype.remove = function (key) {
                delete this.items[key];
            };
            /** Converts the entity name into a short reference name.  Follows the Semantic Query convention of a short name. */
            SQFrom.prototype.candidateName = function (ref) {
                debug.assertValue(ref, 'ref');
                var idx = ref.lastIndexOf('.');
                if (idx >= 0 && (idx !== ref.length - 1))
                    ref = ref.substr(idx + 1);
                return ref.substring(0, 1).toLowerCase();
            };
            SQFrom.prototype.clone = function () {
                // NOTE: consider deprecating this method and instead making QueryFrom be CopyOnWrite (currently we proactively clone).
                var cloned = new SQFrom();
                // NOTE: we use extend rather than prototypical inheritance on items because we use Object.keys.
                $.extend(cloned.items, this.items);
                return cloned;
            };
            return SQFrom;
        })();
        data.SQFrom = SQFrom;
        var SQExprRewriterWithSourceRenames = (function (_super) {
            __extends(SQExprRewriterWithSourceRenames, _super);
            function SQExprRewriterWithSourceRenames(renames) {
                debug.assertValue(renames, 'renames');
                _super.call(this);
                this.renames = renames;
            }
            SQExprRewriterWithSourceRenames.prototype.visitEntity = function (expr) {
                var updatedName = this.renames[expr.entity];
                if (updatedName)
                    return new data.SQEntityExpr(expr.schema, expr.entity, updatedName);
                return _super.prototype.visitEntity.call(this, expr);
            };
            SQExprRewriterWithSourceRenames.prototype.rewriteFilter = function (filter) {
                debug.assertValue(filter, 'filter');
                var updatedTargets = undefined;
                if (filter.target)
                    updatedTargets = this.rewriteArray(filter.target);
                var updatedCondition = filter.condition.accept(this);
                if (filter.condition === updatedCondition && filter.target === updatedTargets)
                    return filter;
                var updatedFilter = {
                    condition: updatedCondition,
                };
                if (updatedTargets)
                    updatedFilter.target = updatedTargets;
                return updatedFilter;
            };
            SQExprRewriterWithSourceRenames.prototype.rewriteArray = function (exprs) {
                debug.assertValue(exprs, 'exprs');
                var updatedExprs;
                for (var i = 0, len = exprs.length; i < len; i++) {
                    var expr = exprs[i], rewrittenExpr = expr.accept(this);
                    if (expr !== rewrittenExpr && !updatedExprs)
                        updatedExprs = ArrayExtensions.take(exprs, i);
                    if (updatedExprs)
                        updatedExprs.push(rewrittenExpr);
                }
                return updatedExprs || exprs;
            };
            SQExprRewriterWithSourceRenames.rewrite = function (expr, from) {
                debug.assertValue(expr, 'expr');
                debug.assertValue(from, 'from');
                var renames = QuerySourceRenameDetector.run(expr, from);
                var rewriter = new SQExprRewriterWithSourceRenames(renames);
                return expr.accept(rewriter);
            };
            return SQExprRewriterWithSourceRenames;
        })(data.SQExprRewriter);
        data.SQExprRewriterWithSourceRenames = SQExprRewriterWithSourceRenames;
        /** Responsible for updating a QueryFrom based on SQExpr references. */
        var QuerySourceRenameDetector = (function (_super) {
            __extends(QuerySourceRenameDetector, _super);
            function QuerySourceRenameDetector(from) {
                debug.assertValue(from, 'from');
                _super.call(this);
                this.from = from;
                this.renames = {};
            }
            QuerySourceRenameDetector.run = function (expr, from) {
                var detector = new QuerySourceRenameDetector(from);
                expr.accept(detector);
                return detector.renames;
            };
            QuerySourceRenameDetector.prototype.visitEntity = function (expr) {
                // TODO: Renames must take the schema into account, not just entity set name.
                var existingEntity = this.from.entity(expr.variable);
                if (existingEntity && existingEntity.schema === expr.schema && existingEntity.entity === expr.entity)
                    return;
                var actualEntity = this.from.ensureEntity({
                    schema: expr.schema,
                    entity: expr.entity,
                }, expr.variable);
                this.renames[expr.entity] = actualEntity.name;
            };
            return QuerySourceRenameDetector;
        })(data.DefaultSQExprVisitorWithTraversal);
        /** Visitor for finding unreferenced sources. */
        var UnreferencedKeyFinder = (function (_super) {
            __extends(UnreferencedKeyFinder, _super);
            function UnreferencedKeyFinder(keys) {
                debug.assertValue(keys, 'keys');
                _super.call(this);
                this.keys = keys;
            }
            UnreferencedKeyFinder.prototype.visitEntity = function (expr) {
                var index = this.keys.indexOf(expr.variable);
                if (index >= 0)
                    this.keys.splice(index, 1);
            };
            UnreferencedKeyFinder.prototype.result = function () {
                return this.keys;
            };
            return UnreferencedKeyFinder;
        })(data.DefaultSQExprVisitorWithTraversal);
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /** Aids in building a SemanticQuery from a QueryDefinition. */
        var SemanticQueryBuilder = (function () {
            function SemanticQueryBuilder(from) {
                debug.assertValue(from, 'from');
                this.from = from;
                this.selectItems = [];
            }
            SemanticQueryBuilder.prototype.addWhere = function (filter) {
                debug.assertValue(filter, 'filter');
                if (!this.whereItems)
                    this.whereItems = [];
                this.whereItems.push(filter);
            };
            SemanticQueryBuilder.prototype.addOrderBy = function (sort) {
                debug.assertValue(sort, 'sort');
                if (!this.orderByItems)
                    this.orderByItems = [];
                this.orderByItems.push(sort);
            };
            SemanticQueryBuilder.prototype.addSelect = function (select) {
                debug.assertValue(select, 'select');
                this.selectItems.push(select);
            };
            SemanticQueryBuilder.prototype.toQuery = function () {
                return new data.SemanticQuery(this.from, this.whereItems, this.orderByItems, this.selectItems);
            };
            SemanticQueryBuilder.prototype.toFilter = function () {
                debug.assert(!this.orderByItems && this.selectItems.length === 0, 'toFilter must not have orderBy/select specified.');
                if (this.from && this.whereItems)
                    return new data.SemanticFilter(this.from, this.whereItems);
            };
            return SemanticQueryBuilder;
        })();
        data.SemanticQueryBuilder = SemanticQueryBuilder;
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (_data) {
        var JsonComparer = jsCommon.JsonComparer;
        var TimerPromiseFactory = jsCommon.TimerPromiseFactory;
        /** Factory method to create an IDataProxy instance. */
        function createDataProxy(promiseFactory, dataProviderFactory) {
            return new DataProxy(promiseFactory, dataProviderFactory);
        }
        _data.createDataProxy = createDataProxy;
        /** Factory method to create an ISingleExecutableDataProxy. */
        function createSingleExecutableDataProxy(dataProxy, promiseFactory, timerFactory) {
            return new SingleExecutionDataProxy(dataProxy, promiseFactory, timerFactory);
        }
        _data.createSingleExecutableDataProxy = createSingleExecutableDataProxy;
        var DataProxy = (function () {
            function DataProxy(promiseFactory, dataProviderFactory) {
                this.providerHost = {
                    promiseFactory: function () { return promiseFactory; },
                };
                this.dataProviderFactory = dataProviderFactory;
                this.dataProviders = {};
            }
            DataProxy.prototype.execute = function (options) {
                debug.assertValue(options, 'options');
                var provider = this.getProvider(options.type);
                return provider.execute(options.query);
            };
            DataProxy.prototype.getProvider = function (type) {
                var provider = this.dataProviders[type];
                if (provider)
                    return provider;
                var plugin = this.dataProviderFactory.getPlugin(type);
                if (plugin)
                    return this.dataProviders[type] = new DataProviderWrapper(plugin, this.providerHost.promiseFactory(), this.providerHost);
            };
            DataProxy.prototype.stopCommunication = function (providerType) {
                var provider = this.getProvider(providerType);
                provider.stopCommunication();
            };
            DataProxy.prototype.resumeCommunication = function (providerType) {
                var provider = this.getProvider(providerType);
                provider.resumeCommunication();
            };
            DataProxy.prototype.clearCache = function (providerType) {
                var provider = this.getProvider(providerType);
                provider.clearCache();
            };
            DataProxy.prototype.rewriteCacheEntries = function (providerType, rewriter) {
                var provider = this.getProvider(providerType);
                provider.rewriteCacheEntries(rewriter);
            };
            return DataProxy;
        })();
        var SingleExecutionDataProxy = (function () {
            function SingleExecutionDataProxy(proxy, promiseFactory, timerFactory) {
                this.proxy = proxy;
                this.promiseFactory = promiseFactory;
                this.timerFactory = timerFactory || TimerPromiseFactory.instance;
            }
            SingleExecutionDataProxy.prototype.execute = function (options) {
                var _this = this;
                var previousExecution = this.lastExecute;
                if (previousExecution && previousExecution.promise.pending()) {
                    if (JsonComparer.equals(options, previousExecution.query))
                        return previousExecution.promise;
                    // Simply reject this promise with an ignorable error since no message should be shown.
                    this.lastExecute.promise.reject(new powerbi.IgnorableClientError());
                }
                var deferred = this.promiseFactory.defer();
                var promise = powerbi.RejectablePromise2(deferred);
                var currentExecution = this.lastExecute = {
                    query: options,
                    deferred: deferred,
                    promise: promise
                };
                if (!this.queuedExecution) {
                    this.queuedExecution = true;
                    // Delay the completion after a timeout of zero.  This allow currently running JS to complete
                    this.timerFactory.create(0).done(function () {
                        _this.queuedExecution = false;
                        var execution = _this.lastExecute;
                        var proxyPromise = _this.proxy.execute(execution.query);
                        proxyPromise.then(function (result) { return execution.deferred.resolve(result); }, function (reason) { return execution.deferred.reject(reason); });
                        // reject the proxy promise if caller reject the execution promise
                        execution.promise.catch(function () { return proxyPromise.reject(); });
                    });
                }
                // Clear the last execution after completion.
                promise.finally(function () {
                    if (currentExecution === _this.lastExecute)
                        _this.lastExecute = undefined;
                });
                return promise;
            };
            return SingleExecutionDataProxy;
        })();
        var DataProviderWrapper = (function () {
            function DataProviderWrapper(plugin, promiseFactory, host) {
                debug.assertValue(plugin, 'plugin');
                debug.assertValue(promiseFactory, 'promiseFactory');
                debug.assertValue(host, 'host');
                this.name = plugin.name;
                this.promiseFactory = promiseFactory;
                this.provider = plugin.create(host);
            }
            /**
             * Retrieves data through an IDataProvider.
             * 1) Calls the provider execute method when specified
             * 2) Otherwise, it calls simply converts the argument to the dataView.
             */
            DataProviderWrapper.prototype.execute = function (options) {
                var _this = this;
                debug.assertValue(options, 'options');
                var dataViewDeferred = this.promiseFactory.defer();
                var provider = this.provider;
                if (provider.execute) {
                    // (1)
                    var providerExecution = provider.execute(options);
                    dataViewDeferred.promise.catch(function () { return providerExecution.reject(new _data.InvalidDataResponseClientError()); });
                    providerExecution.then(function (data) {
                        if (data) {
                            var transformed = _this.transform(data);
                            if (transformed.error) {
                                dataViewDeferred.reject(transformed.error);
                            }
                            dataViewDeferred.resolve({ dataProviderResult: transformed, dataViewSource: { data: data } });
                        }
                        else {
                            dataViewDeferred.reject(new _data.InvalidDataFormatClientError());
                        }
                    }, function (error) {
                        dataViewDeferred.reject(error);
                    });
                    var promise = powerbi.RejectablePromise2(dataViewDeferred);
                    // if promise is rejected, reject the provider execution
                    promise.catch(function (error) { return providerExecution.reject(error || new _data.InvalidDataResponseClientError()); });
                    return promise;
                }
                else {
                    // (2)
                    if (options.command)
                        dataViewDeferred.resolve({ dataProviderResult: this.transform(options.command) });
                    else
                        dataViewDeferred.reject();
                }
                return powerbi.RejectablePromise2(dataViewDeferred);
            };
            DataProviderWrapper.prototype.stopCommunication = function () {
                var provider = this.provider;
                if (provider.stopCommunication)
                    provider.stopCommunication();
            };
            DataProviderWrapper.prototype.resumeCommunication = function () {
                var provider = this.provider;
                if (provider.resumeCommunication)
                    provider.resumeCommunication();
            };
            DataProviderWrapper.prototype.clearCache = function () {
                var provider = this.provider;
                if (provider.clearCache)
                    provider.clearCache();
            };
            DataProviderWrapper.prototype.rewriteCacheEntries = function (rewriter) {
                var provider = this.provider;
                if (provider.rewriteCacheEntries)
                    provider.rewriteCacheEntries(rewriter);
            };
            DataProviderWrapper.prototype.transform = function (data) {
                var provider = this.provider;
                if (provider.transform)
                    return provider.transform(data);
                // When the IDataProvider does not implement its own transform implementation, we will provide one.
                var defaultDataView = {
                    metadata: { columns: [] },
                };
                defaultDataView[this.name] = data;
                return { dataView: defaultDataView };
            };
            return DataProviderWrapper;
        })();
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var StringExtensions = jsCommon.StringExtensions;
    var Formatting = jsCommon.Formatting;
    // ================================================================================
    // Formatting Encoder
    // ================================================================================
    var FormattingEncoder;
    (function (FormattingEncoder) {
        function preserveEscaped(format, specialChars) {
            // Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
            var length = specialChars.length;
            for (var i = 0; i < length; i++) {
                var oldText = "\\" + specialChars[i];
                var newText = String.fromCharCode(0xE000 + i);
                format = StringExtensions.replaceAll(format, oldText, newText);
            }
            return format;
        }
        FormattingEncoder.preserveEscaped = preserveEscaped;
        function restoreEscaped(format, specialChars) {
            // After formatting is complete we should restore the encoded escaped chars into the unescaped chars
            var length = specialChars.length;
            for (var i = 0; i < length; i++) {
                var oldText = String.fromCharCode(0xE000 + i);
                var newText = specialChars[i];
                format = StringExtensions.replaceAll(format, oldText, newText);
            }
            return StringExtensions.replaceAll(format, "\\", "");
        }
        FormattingEncoder.restoreEscaped = restoreEscaped;
        function preserveLiterals(format, literals) {
            // Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
            format = StringExtensions.replaceAll(format, "\"", "'");
            for (var i = 0;; i++) {
                var fromIndex = format.indexOf("'");
                if (fromIndex < 0) {
                    break;
                }
                var toIndex = format.indexOf("'", fromIndex + 1);
                if (toIndex < 0) {
                    break;
                }
                var literal = format.substring(fromIndex, toIndex + 1);
                literals.push(literal.substring(1, toIndex - fromIndex));
                var token = String.fromCharCode(0xE100 + i);
                format = format.replace(literal, token);
            }
            return format;
        }
        FormattingEncoder.preserveLiterals = preserveLiterals;
        function restoreLiterals(format, literals) {
            var count = literals.length;
            for (var i = 0; i < count; i++) {
                var token = String.fromCharCode(0xE100 + i);
                var literal = literals[i];
                format = format.replace(token, literal);
            }
            return format;
        }
        FormattingEncoder.restoreLiterals = restoreLiterals;
    })(FormattingEncoder || (FormattingEncoder = {}));
    // ================================================================================
    // FormattingService
    // ================================================================================
    var FormattingService = (function () {
        function FormattingService() {
        }
        FormattingService.prototype.formatValue = function (value, format, culture) {
            // Handle special cases
            if (value === undefined || value === null) {
                return '';
            }
            var gculture = this.getCulture(culture);
            if (DateTimeFormat.canFormat(value)) {
                // Dates
                return DateTimeFormat.format(value, format, gculture);
            }
            else if (NumberFormat.canFormat(value)) {
                // Numbers
                return NumberFormat.format(value, format, gculture);
            }
            else {
                // Other data types - return as string
                return value.toString();
            }
        };
        FormattingService.prototype.format = function (formatWithIndexedTokens, args, culture) {
            var _this = this;
            if (!formatWithIndexedTokens) {
                return "";
            }
            var result = formatWithIndexedTokens.replace(/({{)|(}})|{(\d+[^}]*)}/g, function (match, left, right, argToken) {
                if (left) {
                    return "{";
                }
                else if (right) {
                    return "}";
                }
                else {
                    var parts = argToken.split(":");
                    var argIndex = parseInt(parts[0], 10);
                    var argFormat = parts[1];
                    return _this.formatValue(args[argIndex], argFormat, culture);
                }
                return "";
            });
            return result;
        };
        FormattingService.prototype.isStandardNumberFormat = function (format) {
            return NumberFormat.isStandardFormat(format);
        };
        FormattingService.prototype.formatNumberWithCustomOverride = function (value, format, nonScientificOverrideFormat, culture) {
            var gculture = this.getCulture(culture);
            return NumberFormat.formatWithCustomOverride(value, format, nonScientificOverrideFormat, gculture);
        };
        FormattingService.prototype.dateFormatString = function (unit) {
            return this._dateTimeScaleFormatInfo.getFormatString(unit);
        };
        /** Sets the current localization culture
          * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
          */
        FormattingService.prototype.setCurrentCulture = function (cultureSelector) {
            if (this._currentCultureSelector !== cultureSelector) {
                this._currentCulture = this.getCulture(cultureSelector);
                this._currentCultureSelector = cultureSelector;
                this._dateTimeScaleFormatInfo = new DateTimeScaleFormatInfo(this._currentCulture);
            }
        };
        /** Gets the culture assotiated with the specified cultureSelector ("en", "en-US", "fr-FR" etc).
          * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
          * Exposing this function for testability of unsupported cultures */
        FormattingService.prototype.getCulture = function (cultureSelector) {
            if (cultureSelector == null) {
                if (this._currentCulture == null) {
                    this.initialize();
                }
                return this._currentCulture;
            }
            else {
                var culture = Globalize.findClosestCulture(cultureSelector);
                if (!culture)
                    culture = Globalize.culture("en-US");
                return culture;
            }
        };
        // By default the Globalization module initializes to the culture/calendar provided in the language/culture URL params
        FormattingService.prototype.initialize = function () {
            var cultureName = this.getUrlParam("language") || window["cultureInfo"] || window.navigator.userLanguage || window.navigator["language"] || Globalize.culture().name;
            this.setCurrentCulture(cultureName);
            var calendarName = this.getUrlParam("calendar");
            if (calendarName) {
                var culture = this._currentCulture;
                var c = culture.calendars[calendarName];
                if (c) {
                    culture.calendar = c;
                }
            }
        };
        FormattingService.prototype.getUrlParam = function (name) {
            var param = window.location.search.match(RegExp("[?&]" + name + "=([^&]*)"));
            return param ? param[1] : undefined;
        };
        return FormattingService;
    })();
    // ================================================================================
    // DateTimeFormat
    // --------------------------------------------------------------------------------
    // DateTimeFormat module contains the static methods for formatting the DateTimes. 
    // It extends the JQuery.Globalize functionality to support complete set of .NET 
    // formatting expressions for dates.
    // ================================================================================
    var DateTimeFormat;
    (function (DateTimeFormat) {
        var _currentCachedFormat;
        var _currentCachedProcessedFormat;
        // Evaluates if the value can be formatted using the NumberFormat
        function canFormat(value) {
            var result = value instanceof Date;
            return result;
        }
        DateTimeFormat.canFormat = canFormat;
        // Formats the date using provided format and culture
        function format(value, format, culture) {
            format = format || "G";
            var isStandard = format.length === 1;
            try {
                if (isStandard) {
                    return formatDateStandard(value, format, culture);
                }
                else {
                    return formatDateCustom(value, format, culture);
                }
            }
            catch (e) {
                return formatDateStandard(value, "G", culture);
            }
        }
        DateTimeFormat.format = format;
        // Formats the date using standard format expression
        function formatDateStandard(value, format, culture) {
            // In order to provide parity with .NET we have to support additional set of DateTime patterns.
            var patterns = culture.calendar.patterns;
            // Extend supported set of patterns
            ensurePatterns(culture.calendar);
            // Handle extended set of formats
            var output = Formatting.findDateFormat(value, format, culture.name);
            if (output.format.length === 1)
                format = patterns[output.format];
            else
                format = output.format;
            //need to revisit when globalization is enabled
            culture = Globalize.culture("en-US");
            return Globalize.format(output.value, format, culture);
        }
        // Formats the date using custom format expression
        function formatDateCustom(value, format, culture) {
            var result;
            var literals = [];
            format = FormattingEncoder.preserveEscaped(format, "\\dfFghHKmstyz:/%'\"");
            format = FormattingEncoder.preserveLiterals(format, literals);
            format = StringExtensions.replaceAll(format, "\"", "'");
            if (format.indexOf("F") > -1) {
                // F is not supported so we need to replace the F with f based on the milliseconds                        
                // Replace all sequences of F longer than 3 with "FFF"
                format = StringExtensions.replaceAll(format, "FFFF", "FFF");
                // Based on milliseconds update the format to use fff
                var milliseconds = value.getMilliseconds();
                if (milliseconds % 10 >= 1) {
                    format = StringExtensions.replaceAll(format, "FFF", "fff");
                }
                format = StringExtensions.replaceAll(format, "FFF", "FF");
                if ((milliseconds % 100) / 10 >= 1) {
                    format = StringExtensions.replaceAll(format, "FF", "ff");
                }
                format = StringExtensions.replaceAll(format, "FF", "F");
                if ((milliseconds % 1000) / 100 >= 1) {
                    format = StringExtensions.replaceAll(format, "F", "f");
                }
                format = StringExtensions.replaceAll(format, "F", "");
                if (format === "" || format === "%")
                    return "";
            }
            format = processCustomDateTimeFormat(format);
            result = Globalize.format(value, format, culture);
            result = localize(result, culture.calendar);
            result = FormattingEncoder.restoreLiterals(result, literals);
            result = FormattingEncoder.restoreEscaped(result, "\\dfFghHKmstyz:/%'\"");
            return result;
        }
        // Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
        function processCustomDateTimeFormat(format) {
            if (format === _currentCachedFormat) {
                return _currentCachedProcessedFormat;
            }
            _currentCachedFormat = format;
            format = Formatting.fixDateTimeFormat(format);
            _currentCachedProcessedFormat = format;
            return format;
        }
        // Localizes the time separator symbol
        function localize(value, dictionary) {
            var timeSeparator = dictionary[":"];
            if (timeSeparator === ":") {
                return value;
            }
            var result = "";
            var count = value.length;
            for (var i = 0; i < count; i++) {
                var char = value.charAt(i);
                switch (char) {
                    case ":":
                        result += timeSeparator;
                        break;
                    default:
                        result += char;
                        break;
                }
            }
            return result;
        }
        function ensurePatterns(calendar) {
            var patterns = calendar.patterns;
            if (patterns["g"] === undefined) {
                patterns["g"] = patterns["f"].replace(patterns["D"], patterns["d"]); // Generic: Short date, short time
                patterns["G"] = patterns["F"].replace(patterns["D"], patterns["d"]); // Generic: Short date, long time
            }
        }
    })(DateTimeFormat || (DateTimeFormat = {}));
    // ================================================================================
    // NumberFormat
    // --------------------------------------------------------------------------------
    // NumberFormat module contains the static methods for formatting the numbers. 
    // It extends the JQuery.Globalize functionality to support complete set of .NET 
    // formatting expressions for numeric types including custom formats.
    // ================================================================================
    var NumberFormat;
    (function (NumberFormat) {
        var _lastCustomFormatMeta;
        // Evaluates if the value can be formatted using the NumberFormat
        function canFormat(value) {
            var result = typeof (value) === "number";
            return result;
        }
        NumberFormat.canFormat = canFormat;
        function isStandardFormat(format) {
            debug.assertValue(format, 'format');
            var standardFormatRegex = /^[a-z]\d{0,2}$/gi; // a letter + up to 2 digits for precision specifier
            return standardFormatRegex.test(format);
        }
        NumberFormat.isStandardFormat = isStandardFormat;
        // Formats the number using specified format expression and culture
        function format(value, format, culture) {
            format = format || "G";
            try {
                if (isStandardFormat(format))
                    return formatNumberStandard(value, format, culture);
                return formatNumberCustom(value, format, culture);
            }
            catch (e) {
                return Globalize.format(value, undefined, culture);
            }
        }
        NumberFormat.format = format;
        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        function formatWithCustomOverride(value, format, nonScientificOverrideFormat, culture) {
            debug.assertValue(value, 'value');
            debug.assertValue(format, 'format');
            debug.assertValue(nonScientificOverrideFormat, 'nonScientificOverrideFormat');
            debug.assertValue(culture, 'culture');
            debug.assert(!isStandardFormat(format), 'Standard format');
            return formatNumberCustom(value, format, culture, nonScientificOverrideFormat);
        }
        NumberFormat.formatWithCustomOverride = formatWithCustomOverride;
        // Formats the number using standard format expression
        function formatNumberStandard(value, format, culture) {
            var result;
            var precision = (format.length > 1 ? parseInt(format.substr(1, format.length - 1), 10) : undefined);
            var numberFormatInfo = culture.numberFormat;
            var formatChar = format.charAt(0);
            switch (formatChar) {
                case "e":
                case "E":
                    if (precision === undefined) {
                        precision = 6;
                    }
                    var mantissaDecimalDigits = StringExtensions.repeat("0", precision);
                    format = "0." + mantissaDecimalDigits + formatChar + "+000";
                    result = formatNumberCustom(value, format, culture);
                    break;
                case "f":
                case "F":
                    result = precision !== undefined ? value.toFixed(precision) : value.toFixed(numberFormatInfo.decimals);
                    result = localize(result, numberFormatInfo);
                    break;
                case "g":
                case "G":
                    var abs = Math.abs(value);
                    if (abs === 0 || (1E-4 <= abs && abs < 1E15)) {
                        // For the range of 0.0001 to 1,000,000,000,000,000 - use the normal form
                        result = precision !== undefined ? value.toPrecision(precision) : value.toString();
                    }
                    else {
                        // Otherwise use exponential
                        result = precision !== undefined ? value.toExponential(precision) : value.toExponential();
                        result = result.replace("e", "E");
                    }
                    result = localize(result, numberFormatInfo);
                    break;
                case "r":
                case "R":
                    result = value.toString();
                    result = localize(result, numberFormatInfo);
                    break;
                case "x":
                case "X":
                    result = value.toString(16);
                    if (formatChar === "X") {
                        result = result.toUpperCase();
                    }
                    if (precision !== undefined) {
                        var actualPrecision = result.length;
                        var isNegative = value < 0;
                        if (isNegative) {
                            actualPrecision--;
                        }
                        var paddingZerosCount = precision - actualPrecision;
                        if (paddingZerosCount > 0) {
                            var paddingZeros = StringExtensions.repeat("0", paddingZerosCount);
                        }
                        if (isNegative) {
                            result = "-" + paddingZeros + result.substr(1);
                        }
                        else {
                            result = paddingZeros + result;
                        }
                    }
                    result = localize(result, numberFormatInfo);
                    break;
                default:
                    result = Globalize.format(value, format, culture);
            }
            return result;
        }
        // Formats the number using custom format expression
        function formatNumberCustom(value, format, culture, nonScientificOverrideFormat) {
            var result;
            var numberFormatInfo = culture.numberFormat;
            if (isFinite(value)) {
                // Split format into positive/zero/negative patterns
                var signSpecificFormats = format.split(";");
                if (signSpecificFormats.length > 1) {
                    var negativeFormat = format;
                    var positiveFormat = format;
                    var zeroFormat = format;
                    if (signSpecificFormats.length === 2) {
                        positiveFormat = zeroFormat = signSpecificFormats[0];
                        negativeFormat = signSpecificFormats[1];
                    }
                    else {
                        positiveFormat = signSpecificFormats[0];
                        negativeFormat = signSpecificFormats[1];
                        zeroFormat = signSpecificFormats[2];
                    }
                    // Pick a format based on the sign of value
                    if (value > 0) {
                        format = positiveFormat;
                    }
                    else if (value === 0) {
                        format = zeroFormat;
                    }
                    else {
                        format = negativeFormat;
                    }
                    value = Math.abs(value);
                }
                // Get format metadata
                var formatMeta = getCustomFormatMetadata(format);
                // Preserve literals and escaped chars
                if (formatMeta.hasEscapes) {
                    format = FormattingEncoder.preserveEscaped(format, "\\0#.,%‰");
                }
                var literals = [];
                if (formatMeta.hasQuotes) {
                    format = FormattingEncoder.preserveLiterals(format, literals);
                }
                // Scientific format
                if (formatMeta.hasE && !nonScientificOverrideFormat) {
                    var scientificMatch = /e[+-]*0+/gi.exec(format);
                    if (scientificMatch) {
                        // Case 2.1. Scientific custom format
                        var formatM = format.substr(0, scientificMatch.index);
                        var formatE = format.substr(scientificMatch.index + scientificMatch[0].indexOf("0"));
                        var precision = getCustomFormatPrecision(formatM, formatMeta);
                        var scale = getCustomFormatScale(formatM, formatMeta);
                        if (scale !== 1) {
                            value = value * scale;
                        }
                        var s = value.toExponential(precision);
                        var indexOfE = s.indexOf("e");
                        var mantissa = s.substr(0, indexOfE);
                        var exp = s.substr(indexOfE + 1);
                        var resultM = fuseNumberWithCustomFormat(mantissa, formatM, numberFormatInfo);
                        var resultE = fuseNumberWithCustomFormat(exp, formatE, numberFormatInfo);
                        if (resultE.charAt(0) === "+" && scientificMatch[0].charAt(1) !== "+") {
                            resultE = resultE.substr(1);
                        }
                        var e = scientificMatch[0].charAt(0);
                        result = resultM + e + resultE;
                    }
                }
                // Non scientific format
                if (result === undefined) {
                    var valueFormatted;
                    if (nonScientificOverrideFormat) {
                        valueFormatted = powerbi.formattingService.format(nonScientificOverrideFormat, [value], culture.name);
                    }
                    else {
                        var precision = getCustomFormatPrecision(format, formatMeta);
                        var scale = getCustomFormatScale(format, formatMeta);
                        if (scale !== 1) {
                            value = value * scale;
                        }
                        valueFormatted = toNonScientific(value, precision);
                    }
                    result = fuseNumberWithCustomFormat(valueFormatted, format, numberFormatInfo, !!nonScientificOverrideFormat);
                }
                if (formatMeta.hasQuotes) {
                    result = FormattingEncoder.restoreLiterals(result, literals);
                }
                if (formatMeta.hasEscapes) {
                    result = FormattingEncoder.restoreEscaped(result, "\\0#.,%‰");
                }
                _lastCustomFormatMeta = formatMeta;
            }
            else {
                return Globalize.format(value, undefined);
            }
            return result;
        }
        // Returns string with the fixed point respresentation of the number
        function toNonScientific(value, precision) {
            var result = "";
            var precisionZeros = 0;
            // Double precision numbers support actual 15-16 decimal digits of precision.
            if (precision > 16) {
                precisionZeros = precision - 16;
                precision = 16;
            }
            var digitsBeforeDecimalPoint = powerbi.Double.log10(Math.abs(value));
            if (digitsBeforeDecimalPoint < 16) {
                if (digitsBeforeDecimalPoint > 0) {
                    var maxPrecision = 16 - digitsBeforeDecimalPoint;
                    if (precision > maxPrecision) {
                        precisionZeros += precision - maxPrecision;
                        precision = maxPrecision;
                    }
                }
                result = value.toFixed(precision);
            }
            else if (digitsBeforeDecimalPoint === 16) {
                result = value.toFixed(0);
                precisionZeros += precision;
                if (precisionZeros > 0) {
                    result += ".";
                }
            }
            else {
                // Different browsers have different implementations of the toFixed(). 
                // In IE it returns fixed format no matter what's the number. In FF and Chrome the method returns exponential format for numbers greater than 1E21.
                // So we need to check for range and convert the to exponential with the max precision. 
                // Then we convert exponential string to fixed by removing the dot and padding with "power" zeros.
                result = value.toExponential(15);
                var indexOfE = result.indexOf("e");
                if (indexOfE > 0) {
                    var indexOfDot = result.indexOf(".");
                    var mantissa = result.substr(0, indexOfE);
                    var exp = result.substr(indexOfE + 1);
                    var powerZeros = parseInt(exp, 10) - (mantissa.length - indexOfDot - 1);
                    result = mantissa.replace(".", "") + StringExtensions.repeat("0", powerZeros);
                    if (precision > 0) {
                        result = result + "." + StringExtensions.repeat("0", precision);
                    }
                }
            }
            if (precisionZeros > 0) {
                result = result + StringExtensions.repeat("0", precisionZeros);
            }
            return result;
        }
        // Returns the formatMetadata of the format
        function getCustomFormatMetadata(format) {
            if (_lastCustomFormatMeta !== undefined && format === _lastCustomFormatMeta.format) {
                return _lastCustomFormatMeta;
            }
            var result = {
                format: format,
                hasEscapes: false,
                hasQuotes: false,
                hasE: false,
                hasCommas: false,
                hasDots: false,
                hasPercent: false,
                hasPermile: false,
                precision: -1,
                scale: -1,
            };
            var length = format.length;
            for (var i = 0; i < length; i++) {
                var c = format.charAt(i);
                switch (c) {
                    case "\\":
                        result.hasEscapes = true;
                        break;
                    case "'":
                    case "\"":
                        result.hasQuotes = true;
                        break;
                    case "e":
                    case "E":
                        result.hasE = true;
                        break;
                    case ",":
                        result.hasCommas = true;
                        break;
                    case ".":
                        result.hasDots = true;
                        break;
                    case "%":
                        result.hasPercent = true;
                        break;
                    case "‰":
                        result.hasPermile = true;
                        break;
                }
            }
            return result;
        }
        NumberFormat.getCustomFormatMetadata = getCustomFormatMetadata;
        // Returns the decimal precision of format based on the number of # and 0 chars after the decimal point
        function getCustomFormatPrecision(format, formatMeta) {
            if (formatMeta.precision > -1) {
                return formatMeta.precision;
            }
            var result = 0;
            if (formatMeta.hasDots) {
                var dotIndex = format.indexOf(".");
                if (dotIndex > -1) {
                    var count = format.length;
                    for (var i = dotIndex; i < count; i++) {
                        var char = format.charAt(i);
                        if (char === "#" || char === "0")
                            result++;
                    }
                    result = Math.min(19, result);
                }
            }
            formatMeta.precision = result;
            return result;
        }
        // Returns the scale factor of the format based on the "%" and scaling "," chars in the format
        function getCustomFormatScale(format, formatMeta) {
            if (formatMeta.scale > -1) {
                return formatMeta.scale;
            }
            var result = 1;
            if (formatMeta.hasPercent && format.indexOf("%") > -1) {
                result = result * 100;
            }
            if (formatMeta.hasPermile && format.indexOf("‰") > -1) {
                result = result * 1000;
            }
            if (formatMeta.hasCommas) {
                var dotIndex = format.indexOf(".");
                if (dotIndex === -1) {
                    dotIndex = format.length;
                }
                for (var i = dotIndex - 1; i > -1; i--) {
                    var char = format.charAt(i);
                    if (char === ",") {
                        result = result / 1000;
                    }
                    else {
                        break;
                    }
                }
            }
            formatMeta.scale = result;
            return result;
        }
        function fuseNumberWithCustomFormat(value, format, numberFormatInfo, suppressModifyValue) {
            var formatParts = format.split(".", 2);
            if (formatParts.length === 2) {
                var wholeFormat = formatParts[0];
                var fractionFormat = formatParts[1];
                var valueParts = value.split(".", 2);
                var wholeValue = valueParts[0];
                var fractionValue = valueParts.length === 2 ? valueParts[1].replace(/0+$/, "") : "";
                var wholeFormattedValue = fuseNumberWithCustomFormatLeft(wholeValue, wholeFormat, numberFormatInfo, suppressModifyValue);
                var fractionFormattedValue = fuseNumberWithCustomFormatRight(fractionValue, fractionFormat, suppressModifyValue);
                if (fractionFormattedValue.fmtOnly || fractionFormattedValue.value === "")
                    return wholeFormattedValue + fractionFormattedValue.value;
                return wholeFormattedValue + numberFormatInfo["."] + fractionFormattedValue.value;
            }
            return fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue);
        }
        function fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue) {
            var groupSymbolIndex = format.indexOf(",");
            var enableGroups = groupSymbolIndex > -1 && groupSymbolIndex < Math.max(format.lastIndexOf("0"), format.lastIndexOf("#")) && numberFormatInfo[","];
            var groupDigitCount = 0;
            var groupIndex = 0;
            var groupSizes = numberFormatInfo.groupSizes || [3];
            var groupSize = groupSizes[0];
            var groupSeparator = numberFormatInfo[","];
            var sign = "";
            var firstChar = value.charAt(0);
            if (firstChar === "+" || firstChar === "-") {
                sign = numberFormatInfo[firstChar];
                value = value.substr(1);
            }
            var isZero = value === "0";
            var result = "";
            var leftBuffer = "";
            var vi = value.length - 1;
            var fmtOnly = true;
            for (var fi = format.length - 1; fi > -1; fi--) {
                var formatChar = format.charAt(fi);
                switch (formatChar) {
                    case "0":
                    case "#":
                        fmtOnly = false;
                        if (leftBuffer !== "") {
                            result = leftBuffer + result;
                            leftBuffer = "";
                        }
                        if (!suppressModifyValue) {
                            if (vi > -1 || formatChar === "0") {
                                if (enableGroups) {
                                    // If the groups are enabled we'll need to keep track of the current group index and periodically insert group separator,
                                    if (groupDigitCount === groupSize) {
                                        result = groupSeparator + result;
                                        groupIndex++;
                                        if (groupIndex < groupSizes.length) {
                                            groupSize = groupSizes[groupIndex];
                                        }
                                        groupDigitCount = 1;
                                    }
                                    else {
                                        groupDigitCount++;
                                    }
                                }
                            }
                            if (vi > -1) {
                                if (isZero && formatChar === "#") {
                                }
                                else {
                                    result = value.charAt(vi) + result;
                                }
                                vi--;
                            }
                            else if (formatChar !== "#") {
                                result = formatChar + result;
                            }
                        }
                        break;
                    case ",":
                        break;
                    default:
                        leftBuffer = formatChar + leftBuffer;
                        break;
                }
            }
            // If the value didn't fit into the number of zeros provided in the format then we should insert the missing part of the value into the result
            if (!suppressModifyValue) {
                if (vi > -1 && result !== "") {
                    if (enableGroups) {
                        while (vi > -1) {
                            if (groupDigitCount === groupSize) {
                                result = groupSeparator + result;
                                groupIndex++;
                                if (groupIndex < groupSizes.length) {
                                    groupSize = groupSizes[groupIndex];
                                }
                                groupDigitCount = 1;
                            }
                            else {
                                groupDigitCount++;
                            }
                            result = value.charAt(vi) + result;
                            vi--;
                        }
                    }
                    else {
                        result = value.substr(0, vi + 1) + result;
                    }
                }
                // Insert sign in front of the leftBuffer and result
                return sign + leftBuffer + result;
            }
            if (fmtOnly)
                // If the format doesn't specify any digits to be displayed, then just return the format we've parsed up until now.
                return sign + leftBuffer;
            return sign + leftBuffer + value;
        }
        function fuseNumberWithCustomFormatRight(value, format, suppressModifyValue) {
            var vi = 0;
            var fCount = format.length;
            var vCount = value.length;
            if (suppressModifyValue) {
                debug.assert(fCount > 0, "Empty formatting string");
                if ((format.charAt(fCount - 1) !== "0") && (format.charAt(fCount - 1) !== "#"))
                    return {
                        value: value + format.charAt(fCount - 1),
                        fmtOnly: value === "",
                    };
                return {
                    value: value,
                    fmtOnly: value === "",
                };
            }
            var result = "", fmtOnly = true;
            for (var fi = 0; fi < fCount; fi++) {
                var formatChar = format.charAt(fi);
                if (vi < vCount) {
                    switch (formatChar) {
                        case "0":
                        case "#":
                            result += value[vi++];
                            fmtOnly = false;
                            break;
                        default:
                            result += formatChar;
                    }
                }
                else {
                    if (formatChar !== "#") {
                        result += formatChar;
                        fmtOnly = fmtOnly && (formatChar !== "0");
                    }
                }
            }
            return {
                value: result,
                fmtOnly: fmtOnly,
            };
        }
        function localize(value, dictionary) {
            var plus = dictionary["+"];
            var minus = dictionary["-"];
            var dot = dictionary["."];
            var comma = dictionary[","];
            if (plus === "+" && minus === "-" && dot === "." && comma === ",") {
                return value;
            }
            var count = value.length;
            var result = "";
            for (var i = 0; i < count; i++) {
                var char = value.charAt(i);
                switch (char) {
                    case "+":
                        result = result + plus;
                        break;
                    case "-":
                        result = result + minus;
                        break;
                    case ".":
                        result = result + dot;
                        break;
                    case ",":
                        result = result + comma;
                        break;
                    default:
                        result = result + char;
                        break;
                }
            }
            return result;
        }
    })(NumberFormat = powerbi.NumberFormat || (powerbi.NumberFormat = {}));
    /** DateTimeScaleFormatInfo is used to calculate and keep the Date formats used for different units supported by the DateTimeScaleModel */
    var DateTimeScaleFormatInfo = (function () {
        // Constructor
        /** Creates new instance of the DateTimeScaleFormatInfo class.
          * @param culture - culture which calendar info is going to be used to derive the formats.
          */
        function DateTimeScaleFormatInfo(culture) {
            var calendar = culture.calendar;
            var patterns = calendar.patterns;
            var monthAbbreviations = calendar["months"]["namesAbbr"];
            var cultureHasMonthAbbr = monthAbbreviations && monthAbbreviations[0];
            var yearMonthPattern = patterns["Y"];
            var monthDayPattern = patterns["M"];
            var fullPattern = patterns["f"];
            var longTimePattern = patterns["T"];
            var shortTimePattern = patterns["t"];
            var separator = fullPattern.indexOf(",") > -1 ? ", " : " ";
            var hasYearSymbol = yearMonthPattern.indexOf("yyyy'") === 0 && yearMonthPattern.length > 6 && yearMonthPattern[6] === '\'';
            this.YearPattern = hasYearSymbol ? yearMonthPattern.substr(0, 7) : "yyyy";
            var yearPos = fullPattern.indexOf("yy");
            var monthPos = fullPattern.indexOf("MMMM");
            this.MonthPattern = cultureHasMonthAbbr && monthPos > -1 ? (yearPos > monthPos ? "MMM yyyy" : "yyyy MMM") : yearMonthPattern;
            this.DayPattern = cultureHasMonthAbbr ? monthDayPattern.replace("MMMM", "MMM") : monthDayPattern;
            var minutePos = fullPattern.indexOf("mm");
            var pmPos = fullPattern.indexOf("tt");
            var shortHourPattern = pmPos > -1 ? shortTimePattern.replace(":mm ", "") : shortTimePattern;
            this.HourPattern = yearPos < minutePos ? this.DayPattern + separator + shortHourPattern : shortHourPattern + separator + this.DayPattern;
            this.MinutePattern = shortTimePattern;
            this.SecondPattern = longTimePattern;
            this.MillisecondPattern = longTimePattern.replace("ss", "ss.fff");
            switch (culture.name) {
                case "fi-FI":
                    this.DayPattern = this.DayPattern.replace("'ta'", ""); // Fix for finish 'ta' suffix for month names.
                    this.HourPattern = this.HourPattern.replace("'ta'", "");
                    break;
            }
        }
        // Methods
        /** Returns the format string of the provided DateTimeUnit.
          * @param unit - date or time unit
          */
        DateTimeScaleFormatInfo.prototype.getFormatString = function (unit) {
            switch (unit) {
                case 0 /* Year */:
                    return this.YearPattern;
                case 1 /* Month */:
                    return this.MonthPattern;
                case 2 /* Week */:
                case 3 /* Day */:
                    return this.DayPattern;
                case 4 /* Hour */:
                    return this.HourPattern;
                case 5 /* Minute */:
                    return this.MinutePattern;
                case 6 /* Second */:
                    return this.SecondPattern;
                case 7 /* Millisecond */:
                    return this.MillisecondPattern;
            }
            debug.assertFail('Unexpected unit: ' + unit);
        };
        return DateTimeScaleFormatInfo;
    })();
    powerbi.formattingService = new FormattingService();
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var services;
        (function (services) {
            var wireContracts;
            (function (wireContracts) {
            })(wireContracts = services.wireContracts || (services.wireContracts = {}));
            var DataViewObjectSerializer;
            (function (DataViewObjectSerializer) {
                function deserializeObjects(input, descriptors) {
                    debug.assertAnyValue(input, 'input');
                    if (!input || !descriptors)
                        return;
                    var result = {};
                    for (var objectName in input) {
                        var descriptor = descriptors[objectName];
                        if (!descriptor)
                            continue;
                        var objectEntries = input[objectName], resultEntries = result[objectName] = [];
                        for (var i = 0, len = objectEntries.length; i < len; i++)
                            resultEntries.push(deserializeObject(objectEntries[i], descriptor));
                    }
                    return result;
                }
                DataViewObjectSerializer.deserializeObjects = deserializeObjects;
                function deserializeObject(input, descriptor) {
                    debug.assertAnyValue(input, 'input');
                    if (!input)
                        return;
                    var result = {
                        properties: deserializeObjectProperties(input.properties, descriptor.properties),
                    };
                    var selector = deserializeSelector(input.selector);
                    if (selector)
                        result.selector = selector;
                    return result;
                }
                function deserializeSelector(input) {
                    debug.assertAnyValue(input, 'input');
                    if (!input)
                        return;
                    var result = {};
                    if (input.data)
                        result.data = input.data.map(function (v) { return deserializeDataRepetitionSelector(v); });
                    if (input.metadata)
                        result.metadata = input.metadata;
                    if (input.id)
                        result.id = input.id;
                    return result;
                }
                function deserializeDataRepetitionSelector(input) {
                    debug.assertValue(input, 'input');
                    if (input.scopeId)
                        return data.createDataViewScopeIdentity(services.SemanticQuerySerializer.deserializeExpr(input.scopeId));
                    if (input.wildcard)
                        return data.DataViewScopeWildcard.fromExprs(input.wildcard.map(services.SemanticQuerySerializer.deserializeExpr));
                }
                function deserializeObjectProperties(input, descriptors) {
                    debug.assertAnyValue(input, 'input');
                    if (!input)
                        return;
                    var result = {};
                    for (var propertyName in input) {
                        var propertyValue = deserializeObjectProperty(input[propertyName], descriptors[propertyName]);
                        // TODO: Trace/telemetry when parse fails.
                        if (propertyValue !== undefined)
                            result[propertyName] = propertyValue;
                    }
                    return result;
                }
                function deserializeObjectProperty(input, descriptor) {
                    debug.assertAnyValue(input, 'input');
                    debug.assertAnyValue(descriptor, 'descriptor');
                    if (!descriptor)
                        return;
                    var type = parseType(descriptor.type);
                    if (type.value)
                        return deserializePropertyValueType(input, type.value);
                    return deserializePropertyStructuralType(input, type.structural);
                }
                function deserializePropertyValueType(input, type) {
                    debug.assertValue(type, 'type');
                    if (type.primitiveType !== undefined) {
                        if (input.expr)
                            return services.SemanticQuerySerializer.deserializeExpr(input.expr);
                    }
                }
                function deserializePropertyStructuralType(input, type) {
                    debug.assertValue(type, 'type');
                    if (type.fill && type.fill.solid && type.fill.solid.color && input) {
                        var fillDefn = input;
                        if (fillDefn.solid && fillDefn.solid.color) {
                            return {
                                solid: { color: deserializePropertyValueType(fillDefn.solid.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */)) }
                            };
                        }
                        // NOTE: The specified fill color is invalid.
                        return;
                    }
                    if (type.fillRule) {
                        var fillRuleDefinition = input;
                        var deserializedFillRuleDefinition = getParsedFillRule(fillRuleDefinition, deserializePropertyValueType);
                        if (deserializedFillRuleDefinition) {
                            return deserializedFillRuleDefinition;
                        }
                    }
                    if (type.filter && input && input.filter)
                        return services.SemanticQuerySerializer.deserializeFilter(input.filter);
                    return input;
                }
                function serializeObjects(contract, descriptors) {
                    debug.assertAnyValue(contract, 'contract');
                    debug.assertAnyValue(descriptors, 'descriptors');
                    if (!contract || !descriptors)
                        return;
                    var result = {};
                    for (var objectName in contract) {
                        var descriptor = descriptors[objectName];
                        // TODO: Trace/telemetry when serialize fails.
                        if (!descriptor)
                            continue;
                        var objectEntries = contract[objectName], resultEntries = result[objectName] = [];
                        for (var i = 0, len = objectEntries.length; i < len; i++)
                            resultEntries.push(serializeObject(objectEntries[i], descriptor));
                    }
                    return result;
                }
                DataViewObjectSerializer.serializeObjects = serializeObjects;
                function serializeObject(contract, descriptor) {
                    debug.assertAnyValue(contract, 'contract');
                    debug.assertValue(descriptor, 'descriptor');
                    if (!contract)
                        return;
                    var properties = serializeObjectProperties(contract.properties, descriptor.properties);
                    if (!properties)
                        return;
                    var result = {
                        properties: properties,
                    };
                    var selector = serializeSelector(contract.selector);
                    if (selector)
                        result.selector = selector;
                    return result;
                }
                function serializeSelector(contract) {
                    debug.assertAnyValue(contract, 'contract');
                    if (!contract)
                        return;
                    var result = {};
                    if (contract.data)
                        result.data = contract.data.map(function (v) { return serializeDataRepetitionSelector(v); });
                    if (contract.metadata)
                        result.metadata = contract.metadata;
                    if (contract.id)
                        result.id = contract.id;
                    return result;
                }
                function serializeDataRepetitionSelector(contract) {
                    debug.assertValue(contract, 'contract');
                    var scopeId = contract;
                    if (scopeId.expr) {
                        return {
                            scopeId: services.SemanticQuerySerializer.serializeExpr(scopeId.expr),
                        };
                    }
                    var wildcard = contract;
                    if (wildcard.exprs) {
                        return {
                            wildcard: wildcard.exprs.map(services.SemanticQuerySerializer.serializeExpr)
                        };
                    }
                }
                function serializeObjectProperties(contract, descriptors) {
                    debug.assertAnyValue(contract, 'contract');
                    debug.assertValue(descriptors, 'descriptors');
                    if (!contract)
                        return;
                    var result = {};
                    for (var propertyName in contract) {
                        var propertyValue = serializeObjectProperty(contract[propertyName], descriptors[propertyName]);
                        // TODO: Trace/telemetry when serialize fails.
                        if (propertyValue !== undefined)
                            result[propertyName] = propertyValue;
                    }
                    return result;
                }
                function serializeObjectProperty(contract, descriptor) {
                    debug.assertAnyValue(contract, 'contract');
                    debug.assertAnyValue(descriptor, 'descriptor');
                    if (!descriptor)
                        return;
                    var type = parseType(descriptor.type);
                    if (type.value)
                        return serializePropertyValueType(contract, type.value);
                    return serializePropertyStructuralType(contract, type.structural);
                }
                function serializePropertyValueType(contract, type) {
                    debug.assertValue(type, 'type');
                    if (type.primitiveType !== undefined) {
                        if (contract instanceof data.SQExpr) {
                            return {
                                expr: services.SemanticQuerySerializer.serializeExpr(contract)
                            };
                        }
                    }
                }
                function serializePropertyStructuralType(contract, type) {
                    debug.assertValue(type, 'type');
                    if (type.fill && type.fill.solid && type.fill.solid.color && contract) {
                        var fillDefn = contract;
                        return {
                            solid: { color: serializePropertyValueType(fillDefn.solid.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */)) }
                        };
                    }
                    if (type.fillRule) {
                        var fillRuleDefinition = contract;
                        var serializedFillRuleDefinition = getParsedFillRule(fillRuleDefinition, serializePropertyValueType);
                        if (serializedFillRuleDefinition) {
                            return serializedFillRuleDefinition;
                        }
                    }
                    if (type.filter && contract)
                        return { filter: services.SemanticQuerySerializer.serializeFilter(contract) };
                    return contract;
                }
                function parseType(typeDescriptor) {
                    debug.assertValue(typeDescriptor, 'typeDescriptor');
                    var valueType = powerbi.ValueType.fromDescriptor(typeDescriptor);
                    if (valueType.primitiveType !== 0 /* Null */)
                        return { value: valueType };
                    return {
                        structural: typeDescriptor
                    };
                }
                function getParsedFillRule(fillRuleDefn, serializationDelegate) {
                    if (fillRuleDefn.linearGradient2) {
                        var gradient = fillRuleDefn.linearGradient2;
                        var linearGradient2 = {
                            max: {
                                color: serializationDelegate(gradient.max.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */))
                            },
                            min: {
                                color: serializationDelegate(gradient.min.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */))
                            }
                        };
                        if (gradient.max.value) {
                            linearGradient2.max.value = serializationDelegate(gradient.max.value, powerbi.ValueType.fromPrimitiveTypeAndCategory(3 /* Double */));
                        }
                        if (gradient.min.value) {
                            linearGradient2.min.value = serializationDelegate(gradient.min.value, powerbi.ValueType.fromPrimitiveTypeAndCategory(3 /* Double */));
                        }
                        return {
                            linearGradient2: linearGradient2
                        };
                    }
                    if (fillRuleDefn.linearGradient3) {
                        var gradient = fillRuleDefn.linearGradient3;
                        var linearGradient3 = {
                            max: {
                                color: serializationDelegate(gradient.max.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */))
                            },
                            mid: {
                                color: serializationDelegate(gradient.mid.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */))
                            },
                            min: {
                                color: serializationDelegate(gradient.min.color, powerbi.ValueType.fromPrimitiveTypeAndCategory(1 /* Text */))
                            }
                        };
                        if (gradient.max.value) {
                            linearGradient3.max.value = serializationDelegate(gradient.max.value, powerbi.ValueType.fromPrimitiveTypeAndCategory(3 /* Double */));
                        }
                        if (gradient.mid.value) {
                            linearGradient3.mid.value = serializationDelegate(gradient.mid.value, powerbi.ValueType.fromPrimitiveTypeAndCategory(3 /* Double */));
                        }
                        if (gradient.min.value) {
                            linearGradient3.min.value = serializationDelegate(gradient.min.value, powerbi.ValueType.fromPrimitiveTypeAndCategory(3 /* Double */));
                        }
                        return {
                            linearGradient3: linearGradient3
                        };
                    }
                    return null;
                }
            })(DataViewObjectSerializer = services.DataViewObjectSerializer || (services.DataViewObjectSerializer = {}));
        })(services = data.services || (data.services = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        var services;
        (function (services) {
            var SemanticQuerySerializer;
            (function (SemanticQuerySerializer) {
                var StringExtensions = jsCommon.StringExtensions;
                /** Returns the QueryDefinition that this SemanticQuery represents, including optional additional filter. */
                function serializeQuery(query) {
                    debug.assertValue(query, 'query');
                    // From
                    var queryFrom = [], from = query.from(), fromKeys = from.keys();
                    for (var i = 0, len = fromKeys.length; i < len; i++) {
                        var key = fromKeys[i], entity = from.entity(key);
                        queryFrom.push({
                            Name: key,
                            Entity: entity.entity,
                            Schema: entity.schema,
                        });
                    }
                    // Where
                    var queryWhere, whereItems = query.where();
                    if (whereItems && whereItems.length) {
                        queryWhere = [];
                        for (var i = 0, len = whereItems.length; i < len; i++) {
                            var filter = whereItems[i];
                            var queryFilter = {
                                Condition: QueryExpressionBuilder.create(filter.condition),
                            };
                            if (filter.target)
                                queryFilter.Target = filter.target.map(QueryExpressionBuilder.create);
                            queryWhere.push(queryFilter);
                        }
                    }
                    // OrderBy
                    var queryOrderBy, orderByItems = query.orderBy();
                    if (orderByItems && orderByItems.length) {
                        queryOrderBy = [];
                        for (var i = 0, len = orderByItems.length; i < len; i++) {
                            var clause = orderByItems[i];
                            queryOrderBy.push({
                                Direction: clause.direction,
                                Expression: QueryExpressionBuilder.create(clause.expr),
                            });
                        }
                    }
                    // Select
                    var querySelect = [], selectItems = query.select();
                    for (var i = 0, len = selectItems.length; i < len; i++)
                        querySelect.push(QueryExpressionBuilder.createNamed(selectItems[i]));
                    var contract = {
                        Version: 2 /* Version2 */,
                        From: queryFrom,
                        Select: querySelect,
                    };
                    if (queryWhere)
                        contract.Where = queryWhere;
                    if (queryOrderBy)
                        contract.OrderBy = queryOrderBy;
                    return contract;
                }
                SemanticQuerySerializer.serializeQuery = serializeQuery;
                function deserializeQuery(contract) {
                    debug.assertValue(contract, 'contract');
                    var queryVersion = contract.Version ? contract.Version : 0 /* Version0 */;
                    var upgradeToV1 = queryVersion < 1 /* Version1 */;
                    // From
                    var from = Deserializer.from(contract.From);
                    var builder = new data.SemanticQueryBuilder(from);
                    // Where
                    var where = contract.Where;
                    if (where) {
                        for (var i = 0, len = where.length; i < len; i++) {
                            var whereItem = Deserializer.filter(where[i], from);
                            if (whereItem) {
                                // DEVNOTE this is temporary code to upgrade the filter to the latest
                                //         version of semantic query; once the upgrade is done on the 
                                //         server side this code should turn into an assert.
                                if (upgradeToV1) {
                                    whereItem = FilterTargetUpgrader.Upgrade(queryVersion, whereItem);
                                }
                                builder.addWhere(whereItem);
                            }
                        }
                    }
                    // OrderBy
                    var orderBy = contract.OrderBy;
                    if (orderBy) {
                        for (var i = 0, len = orderBy.length; i < len; i++)
                            builder.addOrderBy(Deserializer.sort(orderBy[i], from));
                    }
                    // Select
                    var select = contract.Select, selectNames = {};
                    for (var i = 0, len = select.length; i < len; i++) {
                        builder.addSelect(Deserializer.select(select[i], selectNames, from));
                    }
                    return builder.toQuery();
                }
                SemanticQuerySerializer.deserializeQuery = deserializeQuery;
                function serializeFilter(filter) {
                    // From
                    var queryFrom = [], from = filter.from(), fromKeys = from.keys();
                    for (var i = 0, len = fromKeys.length; i < len; i++) {
                        var key = fromKeys[i], entity = from.entity(key);
                        queryFrom.push({
                            Name: key,
                            Entity: entity.entity,
                            Schema: entity.schema,
                        });
                    }
                    // Where
                    var queryWhere = [], where = filter.where();
                    for (var i = 0, len = where.length; i < len; i++) {
                        var filterClause = where[i];
                        var queryClause = {
                            Condition: QueryExpressionBuilder.create(filterClause.condition),
                        };
                        if (filterClause.target)
                            queryClause.Target = filterClause.target.map(QueryExpressionBuilder.create);
                        queryWhere.push(queryClause);
                    }
                    var contract = {
                        Version: 2 /* Version2 */,
                        From: queryFrom,
                        Where: queryWhere,
                    };
                    return contract;
                }
                SemanticQuerySerializer.serializeFilter = serializeFilter;
                function deserializeFilter(contract) {
                    debug.assertValue(contract, 'contract');
                    var filterVersion = contract.Version ? contract.Version : 0 /* Version0 */;
                    var upgradeToV1 = filterVersion < 1 /* Version1 */;
                    // From
                    var from = Deserializer.from(contract.From);
                    var builder = new data.SemanticQueryBuilder(from);
                    // Where
                    var where = contract.Where;
                    for (var i = 0, len = where.length; i < len; i++) {
                        var whereItem = Deserializer.filter(where[i], from);
                        if (whereItem) {
                            // DEVNOTE this is temporary code to upgrade the filter to the latest
                            //         version of semantic query; once the upgrade is done on the 
                            //         server side this code should turn into an assert.
                            if (upgradeToV1) {
                                whereItem = FilterTargetUpgrader.Upgrade(filterVersion, whereItem);
                            }
                            builder.addWhere(whereItem);
                        }
                    }
                    return builder.toFilter();
                }
                SemanticQuerySerializer.deserializeFilter = deserializeFilter;
                function serializeExpr(contract) {
                    debug.assertValue(contract, 'contract');
                    return QueryExpressionBuilder.createStandalone(contract);
                }
                SemanticQuerySerializer.serializeExpr = serializeExpr;
                function deserializeExpr(input) {
                    debug.assertValue(input, 'input');
                    return ExprBuilder.createStandalone(input);
                }
                SemanticQuerySerializer.deserializeExpr = deserializeExpr;
                var Deserializer;
                (function (Deserializer) {
                    function from(contract) {
                        debug.assertValue(contract, 'contract');
                        var items = {};
                        for (var i = 0, len = contract.length; i < len; i++) {
                            var source = contract[i];
                            items[source.Name] = {
                                entity: source.Entity,
                                schema: source.Schema,
                            };
                        }
                        return new data.SQFrom(items);
                    }
                    Deserializer.from = from;
                    function filter(contract, from) {
                        debug.assertValue(contract, 'contract');
                        debug.assertValue(from, 'from');
                        var condition = ExprBuilder.create(contract.Condition, from);
                        if (!condition)
                            return;
                        var sqFilter = {
                            condition: condition,
                        };
                        if (contract.Target)
                            sqFilter.target = contract.Target.map(function (t) { return ExprBuilder.create(t, from); });
                        return sqFilter;
                    }
                    Deserializer.filter = filter;
                    function sort(contract, from) {
                        debug.assertValue(contract, 'contract');
                        debug.assertValue(from, 'from');
                        return {
                            direction: contract.Direction,
                            expr: ExprBuilder.create(contract.Expression, from),
                        };
                    }
                    Deserializer.sort = sort;
                    function select(contract, selectNames, from) {
                        debug.assertValue(contract, 'contract');
                        debug.assertValue(from, 'from');
                        var expr = ExprBuilder.create(contract, from);
                        var name = contract.Name || StringExtensions.findUniqueName(selectNames, data.SQExprUtils.defaultName(expr));
                        selectNames[name] = true;
                        return {
                            name: name,
                            expr: expr,
                        };
                    }
                    Deserializer.select = select;
                })(Deserializer || (Deserializer = {}));
                var QueryExpressionBuilder = (function () {
                    function QueryExpressionBuilder(standalone) {
                        this.standalone = standalone;
                    }
                    QueryExpressionBuilder.create = function (expr) {
                        return expr.accept(QueryExpressionBuilder.instance);
                    };
                    QueryExpressionBuilder.createNamed = function (namedExpr) {
                        var container = namedExpr.expr.accept(QueryExpressionBuilder.instance);
                        if (namedExpr.name)
                            container.Name = namedExpr.name;
                        return container;
                    };
                    /** Serializes standalone expressions, which include entity names directly rather than variable references. */
                    QueryExpressionBuilder.createStandalone = function (expr) {
                        return expr.accept(QueryExpressionBuilder.standaloneInstance);
                    };
                    QueryExpressionBuilder.prototype.visitColumnRef = function (expr) {
                        return {
                            Column: {
                                Expression: expr.source.accept(this),
                                Property: expr.ref,
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitMeasureRef = function (expr) {
                        return {
                            Measure: {
                                Expression: expr.source.accept(this),
                                Property: expr.ref,
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitAggr = function (expr) {
                        return {
                            Aggregation: {
                                Expression: expr.arg.accept(this),
                                Function: expr.func,
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitBetween = function (expr) {
                        return {
                            Between: {
                                Expression: expr.arg.accept(this),
                                LowerBound: expr.lower.accept(this),
                                UpperBound: expr.upper.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitIn = function (expr) {
                        var values = expr.values, valuesSerialized = [];
                        for (var i = 0, len = values.length; i < len; i++)
                            valuesSerialized.push(this.serializeAll(values[i]));
                        return {
                            In: {
                                Expressions: this.serializeAll(expr.args),
                                Values: valuesSerialized,
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitEntity = function (expr) {
                        debug.assertValue(expr, 'expr');
                        var sourceRef;
                        if (this.standalone) {
                            var standaloneExpr = {
                                Schema: expr.schema,
                                Entity: expr.entity,
                            };
                            sourceRef = standaloneExpr;
                        }
                        else {
                            debug.assertValue(expr.variable, 'expr.variable');
                            sourceRef = { Source: expr.variable };
                        }
                        return {
                            SourceRef: sourceRef
                        };
                    };
                    QueryExpressionBuilder.prototype.visitAnd = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            And: {
                                Left: expr.left.accept(this),
                                Right: expr.right.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitOr = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            Or: {
                                Left: expr.left.accept(this),
                                Right: expr.right.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitCompare = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            Comparison: {
                                ComparisonKind: expr.kind,
                                Left: expr.left.accept(this),
                                Right: expr.right.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitContains = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            Contains: {
                                Left: expr.left.accept(this),
                                Right: expr.right.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitDateAdd = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            DateAdd: {
                                Expression: expr.arg.accept(this),
                                Amount: expr.amount,
                                TimeUnit: expr.unit,
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitDateSpan = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            DateSpan: {
                                Expression: expr.arg.accept(this),
                                TimeUnit: expr.unit
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitExists = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            Exists: {
                                Expression: expr.arg.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitNot = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            Not: {
                                Expression: expr.arg.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitNow = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return { Now: {} };
                    };
                    QueryExpressionBuilder.prototype.visitStartsWith = function (expr) {
                        debug.assertValue(expr, 'expr');
                        return {
                            StartsWith: {
                                Left: expr.left.accept(this),
                                Right: expr.right.accept(this),
                            }
                        };
                    };
                    QueryExpressionBuilder.prototype.visitConstant = function (expr) {
                        debug.assertValue(expr, 'expr');
                        switch (expr.type.primitiveType) {
                            case 5 /* Boolean */:
                            case 7 /* DateTime */:
                            case 2 /* Decimal */:
                            case 4 /* Integer */:
                            case 3 /* Double */:
                            case 0 /* Null */:
                            case 1 /* Text */:
                                return { Literal: { Value: expr.valueEncoded } };
                            default:
                                debug.assertFail('Unrecognized kind: ' + expr.type.primitiveType);
                        }
                    };
                    QueryExpressionBuilder.prototype.serializeAll = function (exprs) {
                        var result = [];
                        for (var i = 0, len = exprs.length; i < len; i++)
                            result.push(exprs[i].accept(this));
                        return result;
                    };
                    QueryExpressionBuilder.instance = new QueryExpressionBuilder();
                    QueryExpressionBuilder.standaloneInstance = new QueryExpressionBuilder(true);
                    return QueryExpressionBuilder;
                })();
                // DEVNOTE: once the temporary filter target upgrade code has been removed,
                //          the VisualFilterKind and FilterKindDetector should move to the
                //          VisualFilterMappingResolver.
                (function (VisualFilterKind) {
                    /** Indicates a column filter (e.g., Continent == Europe). (A.k.a. attribute filter, slicer) */
                    VisualFilterKind[VisualFilterKind["Column"] = 0] = "Column";
                    /** Indicates a measure filter (e.g., Sum(Sales) > 10,000). */
                    VisualFilterKind[VisualFilterKind["Measure"] = 1] = "Measure";
                    /** Indicates an exists filter. */
                    VisualFilterKind[VisualFilterKind["Exists"] = 2] = "Exists";
                })(SemanticQuerySerializer.VisualFilterKind || (SemanticQuerySerializer.VisualFilterKind = {}));
                var VisualFilterKind = SemanticQuerySerializer.VisualFilterKind;
                /** Visitor detecting the filter kind based on the filter condition. */
                var FilterKindDetector = (function (_super) {
                    __extends(FilterKindDetector, _super);
                    function FilterKindDetector() {
                        _super.call(this);
                        this.filterKind = 0 /* Column */;
                    }
                    FilterKindDetector.run = function (expr) {
                        debug.assertValue(expr, "expr");
                        var detector = new FilterKindDetector();
                        expr.accept(detector);
                        return detector.filterKind;
                    };
                    FilterKindDetector.prototype.visitMeasureRef = function (expr) {
                        this.filterKind = 1 /* Measure */;
                    };
                    FilterKindDetector.prototype.visitExists = function (expr) {
                        this.filterKind = 2 /* Exists */;
                    };
                    FilterKindDetector.prototype.visitAggr = function (expr) {
                        this.filterKind = 1 /* Measure */;
                    };
                    return FilterKindDetector;
                })(data.DefaultSQExprVisitorWithTraversal);
                SemanticQuerySerializer.FilterKindDetector = FilterKindDetector;
                var FilterTargetUpgrader = (function () {
                    function FilterTargetUpgrader() {
                    }
                    FilterTargetUpgrader.Upgrade = function (fromVersion, filter) {
                        if (!filter)
                            return null;
                        if (!filter.condition)
                            return null;
                        // DEVNOTE if we are deserializing a version 0 filter and the filter is
                        //         not an exists filter, drop the target.
                        var filterKind = FilterKindDetector.run(filter.condition);
                        if (fromVersion === 0 /* Version0 */ && filterKind !== 2 /* Exists */) {
                            return {
                                condition: filter.condition
                            };
                        }
                        return filter;
                    };
                    return FilterTargetUpgrader;
                })();
                var ExprBuilder;
                (function (ExprBuilder) {
                    function create(contract, from) {
                        debug.assertValue(contract, 'contract');
                        return fromColumnRef(contract.Column, from) || fromMeasureRef(contract.Measure, from) || fromSourceRef(contract.SourceRef, from) || fromAggr(contract.Aggregation, from) || fromAnd(contract.And, from) || fromBetween(contract.Between, from) || fromIn(contract.In, from) || fromOr(contract.Or, from) || fromContains(contract.Contains, from) || fromCompare(contract.Comparison, from) || fromDateAdd(contract.DateAdd, from) || fromDateSpan(contract.DateSpan, from) || fromExists(contract.Exists, from) || fromNot(contract.Not, from) || fromNow(contract.Now) || fromStartsWith(contract.StartsWith, from) || fromLiteral(contract.Literal) || createConst(contract);
                    }
                    ExprBuilder.create = create;
                    function createStandalone(contract) {
                        return create(contract, null);
                    }
                    ExprBuilder.createStandalone = createStandalone;
                    function createArray(contracts, from) {
                        var result = [];
                        for (var i = 0, len = contracts.length; i < len; i++)
                            result.push(create(contracts[i], from));
                        return result;
                    }
                    function createConst(contract) {
                        return fromBool(contract.Boolean) || fromDateTime(contract.DateTime) || fromDateTimeSecond(contract.DateTimeSecond) || fromDateTime(contract.Date) || fromDecimal(contract.Decimal) || fromInteger(contract.Integer) || fromNull(contract.Null) || fromNumber(contract.Number) || fromString(contract.String);
                    }
                    ExprBuilder.createConst = createConst;
                    function fromSourceRef(contract, from) {
                        if (!contract)
                            return;
                        if (from) {
                            // Normal mode: deserialize as a QuerySourceRefExpression (with a variable reference to the from).
                            var sourceRef = contract;
                            var sourceName = sourceRef.Source;
                            var entity = from.entity(sourceName);
                            if (entity)
                                return data.SQExprBuilder.entity(entity.schema, entity.entity, sourceName);
                        }
                        else {
                            // Standalone mode: deserialize as a StandaloneEntityRefExpression (with schema & entity names).
                            var entityRef = contract;
                            return data.SQExprBuilder.entity(entityRef.Schema, entityRef.Entity);
                        }
                    }
                    function fromColumnRef(contract, from) {
                        if (contract) {
                            var source = create(contract.Expression, from);
                            if (source)
                                return data.SQExprBuilder.columnRef(source, contract.Property);
                        }
                    }
                    function fromMeasureRef(contract, from) {
                        if (contract) {
                            var source = create(contract.Expression, from);
                            if (source)
                                return data.SQExprBuilder.measureRef(source, contract.Property);
                        }
                    }
                    function fromAggr(contract, from) {
                        if (contract)
                            return data.SQExprBuilder.aggregate(create(contract.Expression, from), contract.Function);
                    }
                    function fromAnd(contract, from) {
                        if (contract)
                            return data.SQExprBuilder.and(create(contract.Left, from), create(contract.Right, from));
                    }
                    function fromBetween(contract, from) {
                        if (contract) {
                            return data.SQExprBuilder.between(create(contract.Expression, from), create(contract.LowerBound, from), create(contract.UpperBound, from));
                        }
                    }
                    function fromIn(contract, from) {
                        if (contract) {
                            return data.SQExprBuilder.inExpr(createArray(contract.Expressions, from), contract.Values.map(function (v) { return createArray(v, from); }));
                        }
                    }
                    function fromOr(contract, from) {
                        if (contract)
                            return data.SQExprBuilder.or(create(contract.Left, from), create(contract.Right, from));
                    }
                    function fromContains(contract, from) {
                        if (contract) {
                            var left = create(contract.Left, from);
                            var right = create(contract.Right, from);
                            if (left && right)
                                return data.SQExprBuilder.contains(left, right);
                        }
                    }
                    function fromCompare(contract, from) {
                        if (contract) {
                            var left = create(contract.Left, from);
                            var right = create(contract.Right, from);
                            if (left && right)
                                return data.SQExprBuilder.compare(contract.ComparisonKind, left, right);
                        }
                    }
                    function fromDateAdd(contract, from) {
                        if (contract) {
                            var expression = create(contract.Expression, from);
                            return data.SQExprBuilder.dateAdd(contract.TimeUnit, contract.Amount, expression);
                        }
                    }
                    function fromDateSpan(contract, from) {
                        if (contract) {
                            var expression = create(contract.Expression, from);
                            return data.SQExprBuilder.dateSpan(contract.TimeUnit, expression);
                        }
                    }
                    function fromExists(contract, from) {
                        if (contract) {
                            var arg = create(contract.Expression, from);
                            if (arg)
                                return data.SQExprBuilder.exists(arg);
                        }
                    }
                    function fromNot(contract, from) {
                        if (contract) {
                            var arg = create(contract.Expression, from);
                            if (arg)
                                return data.SQExprBuilder.not(arg);
                        }
                    }
                    function fromNow(contract) {
                        if (contract)
                            return data.SQExprBuilder.now();
                    }
                    function fromStartsWith(contract, from) {
                        if (contract) {
                            var left = create(contract.Left, from);
                            var right = create(contract.Right, from);
                            if (left && right)
                                return data.SQExprBuilder.startsWith(left, right);
                        }
                    }
                    function fromBool(contract) {
                        if (contract)
                            return data.SQExprBuilder.boolean(contract.Value);
                    }
                    function fromDateTime(contract) {
                        if (contract) {
                            var date = fromDateTimeString(contract);
                            if (date)
                                return data.SQExprBuilder.dateTime(date);
                        }
                    }
                    function fromDateTimeSecond(contract) {
                        if (contract) {
                            var date = fromDateTimeString(contract);
                            return data.SQExprBuilder.dateSpan(5 /* Second */, data.SQExprBuilder.dateTime(date));
                        }
                    }
                    function fromDecimal(contract) {
                        if (contract) {
                            var value = contract.Value;
                            return data.SQExprBuilder.decimal(value);
                        }
                    }
                    function fromInteger(contract) {
                        if (contract) {
                            var value = contract.Value;
                            return data.SQExprBuilder.integer(value);
                        }
                    }
                    function fromNull(contract) {
                        if (contract)
                            return data.SQExprBuilder.nullConstant();
                    }
                    function fromNumber(contract) {
                        if (contract)
                            return data.PrimitiveValueEncoding.parseValueToSQExpr(contract.Value);
                    }
                    function fromString(contract) {
                        if (contract) {
                            var value = contract.Value;
                            return data.SQExprBuilder.text(value);
                        }
                    }
                    function fromDateTimeString(contract) {
                        debug.assertValue(contract, 'contract');
                        // TODO: handle date time parsing error instead of completely dropping it.
                        return jsCommon.DateExtensions.tryDeserializeDate(contract.Value);
                    }
                    function fromLiteral(contract) {
                        if (contract)
                            return data.PrimitiveValueEncoding.parseValueToSQExpr(contract.Value);
                    }
                })(ExprBuilder || (ExprBuilder = {}));
            })(SemanticQuerySerializer = services.SemanticQuerySerializer || (services.SemanticQuerySerializer = {}));
        })(services = data.services || (data.services = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var data;
    (function (data) {
        /** Serializes SQExpr in a form optimized in-memory comparison, but not intended for storage on disk. */
        var SQExprShortSerializer;
        (function (SQExprShortSerializer) {
            function serialize(expr) {
                return JSON.stringify(expr.accept(SQExprSerializer.instance));
            }
            SQExprShortSerializer.serialize = serialize;
            function serializeArray(exprs) {
                var str = '[';
                for (var i = 0, len = exprs.length; i < len; i++) {
                    if (i > 0)
                        str += ',';
                    str += SQExprShortSerializer.serialize(exprs[i]);
                }
                return str + ']';
            }
            SQExprShortSerializer.serializeArray = serializeArray;
            /** Responsible for serializing an SQExpr into a comparable string. */
            var SQExprSerializer = (function (_super) {
                __extends(SQExprSerializer, _super);
                function SQExprSerializer() {
                    _super.apply(this, arguments);
                }
                SQExprSerializer.prototype.visitColumnRef = function (expr) {
                    return {
                        col: {
                            s: expr.source.accept(this),
                            r: expr.ref,
                        }
                    };
                };
                SQExprSerializer.prototype.visitMeasureRef = function (expr) {
                    return {
                        measure: {
                            s: expr.source.accept(this),
                            r: expr.ref,
                        }
                    };
                };
                SQExprSerializer.prototype.visitAggr = function (expr) {
                    return {
                        agg: {
                            a: expr.arg.accept(this),
                            f: expr.func,
                        }
                    };
                };
                SQExprSerializer.prototype.visitEntity = function (expr) {
                    debug.assertValue(expr, 'expr');
                    debug.assertValue(expr.entity, 'expr.entity');
                    return {
                        e: expr.entity
                    };
                };
                SQExprSerializer.prototype.visitAnd = function (expr) {
                    debug.assertValue(expr, 'expr');
                    return {
                        and: {
                            l: expr.left.accept(this),
                            r: expr.right.accept(this),
                        }
                    };
                };
                SQExprSerializer.prototype.visitCompare = function (expr) {
                    debug.assertValue(expr, 'expr');
                    return {
                        comp: {
                            k: expr.kind,
                            l: expr.left.accept(this),
                            r: expr.right.accept(this),
                        }
                    };
                };
                SQExprSerializer.prototype.visitConstant = function (expr) {
                    debug.assertValue(expr, 'expr');
                    return {
                        const: {
                            t: expr.type.primitiveType,
                            v: expr.value,
                        }
                    };
                };
                SQExprSerializer.prototype.visitDefault = function (expr) {
                    debug.assertFail('Unexpected expression type found in DataViewScopeIdentity.');
                    return;
                };
                SQExprSerializer.instance = new SQExprSerializer();
                return SQExprSerializer;
            })(data.DefaultSQExprVisitor);
        })(SQExprShortSerializer = data.SQExprShortSerializer || (data.SQExprShortSerializer = {}));
    })(data = powerbi.data || (powerbi.data = {}));
})(powerbi || (powerbi = {}));
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
var powerbi;
(function (powerbi) {
    var yAxisPosition;
    (function (yAxisPosition) {
        yAxisPosition.left = 'Left';
        yAxisPosition.right = 'Right';
        //should be used to populate the control values
        function members() {
            return [{ value: yAxisPosition.left, displayName: function (resources) { return resources.get('Visual_yAxis_Left'); } }, { value: yAxisPosition.right, displayName: function (resources) { return resources.get('Visual_yAxis_Right'); } }];
        }
        yAxisPosition.members = members;
    })(yAxisPosition = powerbi.yAxisPosition || (powerbi.yAxisPosition = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=Data.js.map