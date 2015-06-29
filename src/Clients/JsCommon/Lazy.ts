//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {

    /** Represents a lazily instantiated value. */
    export class Lazy<T> {
        private _value: T;
        private _factoryMethod: () => T;

        constructor(factoryMethod: () => T) {
            Utility.throwIfNullOrUndefined(factoryMethod, this, 'constructor', 'factoryMethod');

            this._factoryMethod = factoryMethod;
        }

        public getValue(): T {
            if (this._factoryMethod !== null) {
                this._value = this._factoryMethod();

                // Optimization: Release the factoryMethod, as it could be holding a large object graph.
                this._factoryMethod = null;
            }

            return this._value;
        }
    }
}