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

    /** Represents a batch of operations that can accumulate, and then be invoked together. */
    export class DeferredBatch<T> {
        private _operation: () => JQueryPromise<T>;
        private _timerFactory: ITimerPromiseFactory;
        private _batches: JQueryDeferred<T>[];
        private _maxBatchSize: number;
        private _batchSize: number;

        constructor(operation: () => JQueryPromise<T>, timerFactory?: ITimerPromiseFactory, maxBatchSize?: number) {
            debug.assertValue(operation, 'operation');

            this._operation = operation;
            this._timerFactory = timerFactory || TimerPromiseFactory.instance;
            this._batches = [];

            if (maxBatchSize) {
                this._maxBatchSize = maxBatchSize;
                this._batchSize = 0;
            }
        }

        /** Returns a promise of future invocation of the batch. */
        public enqueue(): JQueryPromise<T> {
            var current = this._batches,
                currentBatch: JQueryDeferred<T>;
            ++this._batchSize;

            if (current.length === 0) {
                currentBatch = $.Deferred<T>();
                current.push(currentBatch);

                // Delay the completion after a timeout of zero.  This allow currently running JS to complete
                // and potentially make more enqueue calls to be included in the current batch.
                this._timerFactory.create(0).done(() => this.completeBatches());
            }
            else if (this._maxBatchSize && this._batchSize >= this._maxBatchSize) {
                // We've reached the maximum batch size
                this._batchSize = 0;
                currentBatch = $.Deferred<T>();
                current.push(currentBatch);
            }
            else {
                // This batch still has space, reuse it
                currentBatch = current[current.length - 1];
            }

            return currentBatch.promise();
        }

        private completeBatches(): void {
            var batch: JQueryDeferred<T>;
            while (batch = this._batches.pop())
                this.completeBatch(batch);
        }

        private completeBatch(batch: JQueryDeferred<T>) {
            this._operation()
                .done(r => batch.resolve(r))
                .fail(r => batch.reject(r));
        }
    }
} 