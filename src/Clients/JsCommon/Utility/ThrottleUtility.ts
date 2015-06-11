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
     /** Responsible for throttling input function. */
    export class ThrottleUtility {
        private fn: () => void;
        private timerFactory: ITimerPromiseFactory;
        private delay: number;

        constructor(delay?: number) {
            this.timerFactory = TimerPromiseFactory.instance;
            this.delay = 0;
            if (delay) {
                this.delay = delay;
            }
        }

        public run(fn: () => void): void {
            if (!this.fn) {
                this.fn = fn;
                this.timerFactory.create(this.delay).done(() => this.timerComplete(this.fn));
            } else {
                this.fn = fn;
            }
        }

        // public for testing purpose
        public timerComplete(fn: () => void) {
            // run fn
            fn();
            
            // clear fn
            this.fn = null;
        }
    }
}