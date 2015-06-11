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

module jsCommon {
    export interface IError extends Error {
        stack?: string;
        argument?: string;
    }

    export module Errors {
        export function infoNavAppAlreadyPresent(): IError {
            return {
                name: 'infoNavAppAlreadyPresent',
                message: 'Cannot initialize embedded scenario when the InfoNav App is already present in this context',
                stack: getExceptionStackTrace()
            };
        }

        export function invalidOperation(message: string): IError {
            return {
                name: 'invalidOperation',
                message: message,
                stack: getExceptionStackTrace()
            };
        }

        export function argument(argumentName: string, message: string): IError {
            return {
                name: 'invalidArgumentError',
                argument: argumentName,
                message: message,
                stack: getExceptionStackTrace()
            };
        }

        export function argumentNull(argumentName: string): IError {
            return {
                name: 'argumentNull',
                argument: argumentName,
                message: 'Argument was null',
                stack: getExceptionStackTrace()
            };
        }

        export function argumentUndefined(argumentName: string): IError {
            return {
                name: 'argumentUndefined',
                argument: argumentName,
                message: 'Argument was undefined',
                stack: getExceptionStackTrace()
            };
        }

        export function argumentOutOfRange(argumentName: string): IError {
            return {
                name: 'argumentOutOfRange',
                argument: argumentName,
                message: 'Argument was out of range',
                stack: getExceptionStackTrace()
            };
        }

        export function pureVirtualMethodException(className: string, methodName: string): IError {
            return {
                name: 'pureVirtualMethodException',
                message: 'This method must be overriden by the derived class:' + className + '.' + methodName,
                stack: getExceptionStackTrace()
            };
        }

        export function notImplementedException(message: string): IError {
            return {
                name: 'notImplementedException',
                message: message,
                stack: getExceptionStackTrace()
            };
        }

        function getExceptionStackTrace(): string {
            return getStackTrace(/*leadingFramesToRemove*/2);
        }
    }

    /**
    * getStackTrace - Captures the stack trace, if available.
    * It optionally takes the number of frames to remove from the stack trace.
    * By default, it removes the last frame to consider the calling type's
    * constructor and the temporary error used to capture the stack trace (below).
    * More levels can be requested as needed e..g. when an error is created
    * from a helper method. <Min requirement: IE10, Chrome, Firefox, Opera>
    */
    export function getStackTrace(leadingFramesToRemove = 1): string {
        var stackTrace: string,
            stackSegments: string[];

        try {
            // needs to throw for stack trace to work in IE
            throw new Error();
        } catch (error) {
            stackTrace = error.stack;
            if (stackTrace != null) {
                stackSegments = stackTrace.split('\n');
                stackSegments.splice(1, leadingFramesToRemove);
                // Finally
                stackTrace = stackSegments.join('\n');
            }
        }

        return stackTrace;
    }
}