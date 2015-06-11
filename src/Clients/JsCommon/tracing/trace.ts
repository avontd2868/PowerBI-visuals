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
    export interface ITraceListener {
        logTrace(trace: TraceItem): void;
    }

    export class ConsoleTracer implements ITraceListener {
        public logTrace(trace: TraceItem): void {
            if (DEBUG) {
                switch (trace.type) {
                    case TraceType.Information:
                        console.info(trace.toString());
                        break;
                    case TraceType.UnexpectedError:
                    case TraceType.Error:
                    case TraceType.Fatal:
                        console.error(trace.toString());
                        break;
                    case TraceType.ExpectedError:
                    case TraceType.Warning:
                        console.warn(trace.toString());
                        break;
                    case TraceType.Verbose:
                        console.log(trace.toString());
                        break;
                    default:
                        console.log(trace.toString());
                        break;
                }
            }
        }
    }

    export module Trace {
        var traceMaxCount = 1000;
        var traces = new Array<TraceItem>(traceMaxCount);
        var lastTraceIndex: number = -1;
        var defaultListener = new ConsoleTracer();
        var listeners = new Array<ITraceListener>(defaultListener);

        /** Trace a warning. Please ensure that no PII is being logged.*/
        export function warning(text: string, requestId?: string): void {
            debug.assertValue(text, 'text');
            logTraceInternal(new TraceItem(text, TraceType.Warning, requestId));
        }

        /** Trace an error. Please ensure that no PII is being logged.*/
        export function error(text: string, includeStackTrace?: boolean, requestId?: string): void {
            debug.assertValue(text, 'text');
            if (includeStackTrace)
                text = StringExtensions.format("{0}.\nStack:\n{1}", text, getStackTrace());
            logTraceInternal(new TraceItem(text, TraceType.Error, requestId));
        }

        /** Trace an information. Please ensure that no PII is being logged.*/
        export function verbose(text: string, requestId?: string): void {
            debug.assertValue(text, 'text');
            logTraceInternal(new TraceItem(text, TraceType.Verbose, requestId));
        }

        export function addListener(listener: ITraceListener): void {
            debug.assertValue(listener, 'listener');
            listeners.push(listener);
        }

        export function removeListener(listener: ITraceListener): void {
            debug.assertValue(listener, 'listener');

            var index = listeners.indexOf(listener);
            if (index >= 0)
                listeners.splice(index, 1);
        }

        export function resetListeners(): void {
            listeners = new Array<ITraceListener>(defaultListener);
        }

        export function reset(): void {
            lastTraceIndex = -1;
        }

        export function getTraces(): Array<TraceItem> {
            if (lastTraceIndex < 0)
                return;

            var result = new Array<TraceItem>(lastTraceIndex+1);
            for (var i = 0; i <= lastTraceIndex; i++)
                result[i] = traces[i];

            return result;
        }

        /** used for unit-test only */
        export function disableDefaultListener(): void {
            removeListener(defaultListener);
        }

        export function enableDefaultListener(): void {
            addListener(defaultListener);
        }

        function logTraceInternal(trace: TraceItem): void {
            if ((lastTraceIndex + 1) >= traceMaxCount)
                reset();

            traces[++lastTraceIndex] = trace;

            for (var i = 0, len = listeners.length; i < len; i++)
                listeners[i].logTrace(trace);
        }
    }
} 