//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var SelectionId = powerbi.visuals.SelectionId;
    var Selector = powerbi.data.Selector;
    describe("SelectionId tests", function () {
        var categoryA = powerbitests.mocks.dataViewScopeIdentity("A");
        var categoryB = powerbitests.mocks.dataViewScopeIdentity("B");
        var seriesa = powerbitests.mocks.dataViewScopeIdentity("a");
        var seriesb = powerbitests.mocks.dataViewScopeIdentity("b");
        var measure1 = "measure1";
        var measure2 = "measure2";
        var idA = SelectionId.createWithId(categoryA);
        var idB = SelectionId.createWithId(categoryB);
        var ida = SelectionId.createWithId(seriesa);
        var idb = SelectionId.createWithId(seriesb);
        var id1 = SelectionId.createWithMeasure(measure1);
        var id2 = SelectionId.createWithMeasure(measure2);
        var idAa = SelectionId.createWithIds(categoryA, seriesa);
        var idAb = SelectionId.createWithIds(categoryA, seriesb);
        var idBa = SelectionId.createWithIds(categoryB, seriesa);
        var idA1 = SelectionId.createWithIdAndMeasure(categoryA, measure1);
        var idA2 = SelectionId.createWithIdAndMeasure(categoryA, measure2);
        var idB1 = SelectionId.createWithIdAndMeasure(categoryB, measure1);
        it('SelectionId equals single identifier', function () {
            expect(idA.equals(SelectionId.createWithId(categoryA))).toBe(true);
            expect(idA.equals(idB)).toBe(false);
            expect(ida.equals(SelectionId.createWithId(seriesa))).toBe(true);
            expect(ida.equals(idb)).toBe(false);
            expect(id1.equals(SelectionId.createWithMeasure(measure1))).toBe(true);
            expect(id1.equals(id2)).toBe(false);
        });
        it('SelectionId equals two identifiers', function () {
            expect(idAa.equals(SelectionId.createWithIds(categoryA, seriesa))).toBe(true);
            expect(idAa.equals(idAb)).toBe(false);
            expect(idAa.equals(idBa)).toBe(false);
            expect(idAa.equals(idA1)).toBe(false);
            expect(idA1.equals(SelectionId.createWithIdAndMeasure(categoryA, measure1))).toBe(true);
            expect(idA1.equals(idA2)).toBe(false);
            expect(idA1.equals(idB1)).toBe(false);
            expect(idA1.equals(idAa)).toBe(false);
        });
        it('SelectionId equals different identifiers', function () {
            expect(idA.equals(ida)).toBe(false);
            expect(idA.equals(idAa)).toBe(false);
            expect(idA.equals(idA1)).toBe(false);
            expect(idb.equals(id1)).toBe(false);
            expect(idb.equals(idAb)).toBe(false);
            expect(id1.equals(idA)).toBe(false);
            expect(id1.equals(idA1)).toBe(false);
        });
        it('SelectionId includes with category', function () {
            expect(idA.includes(idA)).toBe(true);
            expect(idA.includes(idAb)).toBe(true);
            expect(idA.includes(idA1)).toBe(true);
            expect(idA.includes(idB)).toBe(false);
            expect(idA.includes(ida)).toBe(false);
            expect(idA.includes(id1)).toBe(false);
        });
        it('SelectionId includes with series', function () {
            expect(ida.includes(ida)).toBe(true);
            expect(ida.includes(idAa)).toBe(true);
            expect(ida.includes(idA)).toBe(false);
            expect(ida.includes(idb)).toBe(false);
            expect(ida.includes(id1)).toBe(false);
        });
        it('SelectionId includes with measure', function () {
            expect(id1.includes(id1)).toBe(true);
            expect(id1.includes(idA1)).toBe(true);
            expect(id1.includes(idA)).toBe(false);
            expect(id1.includes(ida)).toBe(false);
            expect(id1.includes(id2)).toBe(false);
        });
        it('SelectionId includes with two identifiers', function () {
            expect(idAa.includes(idAa)).toBe(true);
            expect(idAa.includes(idA1)).toBe(false);
            expect(idAa.includes(idA)).toBe(false);
            expect(idA1.includes(idA1)).toBe(true);
            expect(idA1.includes(idA)).toBe(true);
            expect(idAa.includes(idBa)).toBe(false);
            expect(idA1.includes(idB1)).toBe(false);
        });
        it('SelectionId createNull', function () {
            var selectionId = SelectionId.createNull();
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: null, highlight: false }));
        });
        it('SelectionId createWithId', function () {
            var selectionId = SelectionId.createWithId(categoryA);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA] }), highlight: false }));
        });
        it('SelectionId createWithMeasure', function () {
            var selectionId = SelectionId.createWithMeasure(measure1);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ metadata: measure1 }), highlight: false }));
        });
        it('SelectionId createWithIdAndMeasure', function () {
            var selectionId = SelectionId.createWithIdAndMeasure(categoryA, measure1);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA], metadata: measure1 }), highlight: false }));
        });
        it('SelectionId createWithIds', function () {
            var selectionId = SelectionId.createWithIds(categoryA, seriesa);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA, seriesa] }), highlight: false }));
        });
        it('SelectionId createWithIdsAndMeasure', function () {
            var selectionId = SelectionId.createWithIdsAndMeasure(categoryA, seriesa, measure1);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA, seriesa], metadata: measure1 }), highlight: false }));
            selectionId = SelectionId.createWithIdsAndMeasure(undefined, seriesa, measure1);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [seriesa], metadata: measure1 }), highlight: false }));
            selectionId = SelectionId.createWithIdsAndMeasure(categoryA, undefined, measure1);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA], metadata: measure1 }), highlight: false }));
            selectionId = SelectionId.createWithIdsAndMeasure(categoryA, seriesa, undefined);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA, seriesa] }), highlight: false }));
        });
        it('SelectionId createWithHighlight', function () {
            var selectionId = SelectionId.createWithIdsAndMeasure(categoryA, seriesa, measure1);
            expect(selectionId.getKey()).toEqual(JSON.stringify({ selector: Selector.getKey({ data: [categoryA, seriesa], metadata: measure1 }), highlight: false }));
            var selectionIdWithHighlight = SelectionId.createWithHighlight(selectionId);
            expect(selectionIdWithHighlight.getSelector()).toBe(selectionId.getSelector());
            expect(selectionIdWithHighlight.getKey()).not.toBe(selectionId.getKey());
        });
        it('SelectionId creates using undefined', function () {
            var nullKey = SelectionId.createNull().getKey();
            var ids = SelectionId.createWithIdAndMeasure(undefined, undefined);
            expect(ids.getKey()).toEqual(nullKey);
            var idAndMeasure = SelectionId.createWithIdAndMeasure(undefined, undefined);
            expect(idAndMeasure.getKey()).toEqual(nullKey);
            var idsAndMeasure = SelectionId.createWithIdsAndMeasure(undefined, undefined, undefined);
            expect(idsAndMeasure.getKey()).toEqual(nullKey);
        });
    });
})(powerbitests || (powerbitests = {}));
