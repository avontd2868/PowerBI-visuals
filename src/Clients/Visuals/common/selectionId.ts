//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import Selector = powerbi.data.Selector;

    /**
     * A combination of identifiers used to uniquely identify
     * data points and their bound geometry.
     */
    export class SelectionId {
        private selector: Selector;
        private key: string;

        public highlight: boolean;

        constructor(selector: Selector, highlight: boolean) {
            this.selector = selector;
            this.highlight = highlight;
            this.key = JSON.stringify({ selector: selector ? Selector.getKey(selector) : null, highlight: highlight });
        }

        public equals(other: SelectionId): boolean {
            if (!this.selector || !other.selector) {
                return (!this.selector === !other.selector) && this.highlight === other.highlight;
            }
            return this.highlight === other.highlight &&  Selector.equals(this.selector, other.selector);
        }

        /** Checks equality against other for all identifiers existing in this */
        public includes(other: SelectionId, ignoreHighlight: boolean = false): boolean {
            var thisSelector = this.selector;
            var otherSelector = other.selector;
            if (!thisSelector || !otherSelector) {
                return false;
            }
            var thisData = thisSelector.data;
            var otherData = otherSelector.data;
            if (!thisData && (thisSelector.metadata && thisSelector.metadata !== otherSelector.metadata))
                return false;
            if (!ignoreHighlight && this.highlight !== other.highlight)
                return false;
            if (thisData) {
                if (!otherData)
                    return false;
                if (thisData.length > 0) {
                    for (var i = 0, ilen = thisData.length; i < ilen; i++) {
                        var thisValue = <DataViewScopeIdentity>thisData[i];
                        if (!otherData.some((otherValue: DataViewScopeIdentity) => DataViewScopeIdentity.equals(thisValue, otherValue)))
                            return false;
                    }
                }
            }
            return true;
        }

        public getKey(): string {
            return this.key;
        }

        /** Temporary workaround since a few things currently rely on this, but won't need to. */
        public hasIdentity(): boolean {
            return (this.selector && !!this.selector.data);
        }

        public getSelector() {
            return this.selector;
        }

        public static createNull(highlight: boolean = false): SelectionId {
            return new SelectionId(null, highlight);
        }

        public static createWithId(id: DataViewScopeIdentity, highlight: boolean = false): SelectionId {
            var selector: powerbi.data.Selector = null;
            if (id) {
                selector = {
                    data: [id]
                };
            }
            return new SelectionId(selector, highlight);
        }

        public static createWithMeasure(measureId: string, highlight: boolean = false): SelectionId {
            var selector: powerbi.data.Selector = {};
            if (measureId)
                selector.metadata = measureId;
            return new SelectionId(selector, highlight);
        }

        public static createWithIdAndMeasure(id: DataViewScopeIdentity, measureId: string, highlight: boolean = false): SelectionId {
            var selector: powerbi.data.Selector = {};
            if (id) {
                selector.data = [id];
            }
            if (measureId)
                selector.metadata = measureId;
            if (!id && !measureId)
                selector = null;
            return new SelectionId(selector, highlight);
        }

        public static createWithIds(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, highlight: boolean = false): SelectionId {
            var selector: powerbi.data.Selector = null;
            var selectorData = SelectionId.idArray(id1, id2);
            if (selectorData)
                selector = { data: selectorData };
            
            return new SelectionId(selector, highlight);
        }

        public static createWithIdsAndMeasure(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, measureId: string, highlight: boolean = false): SelectionId {
            var selector: powerbi.data.Selector = {};
            var selectorData = SelectionId.idArray(id1, id2);
            if (selectorData)
                selector.data = selectorData;

            if (measureId)
                selector.metadata = measureId;
            if (!id1 && !id2 && !measureId)
                selector = null;
            return new SelectionId(selector, highlight);
        }

        public static createWithHighlight(original: SelectionId): SelectionId {
            debug.assertValue(original, 'original');
            debug.assert(!original.highlight, '!original.highlight');

            return new SelectionId(original.getSelector(), /*highlight*/ true);
        }

        private static idArray(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity): DataViewScopeIdentity[] {
            if (id1 || id2) {
                var data = [];
                if (id1)
                    data.push(id1);
                if (id2 && id2 !== id1)
                    data.push(id2);
                return data;
            }
        }
    }
}
