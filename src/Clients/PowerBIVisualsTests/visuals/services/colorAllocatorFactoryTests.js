//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var visuals = powerbi.visuals;
    describe('ColorAllocatorFactory', function () {
        it('LinearGradient2: min value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient2({
                min: { value: 100, color: '#ff0000' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(100)).toBe('#ff0000');
        });
        it('LinearGradient2: max value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient2({
                min: { value: 100, color: '#ff0000' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(200)).toBe('#0000ff');
        });
        it('LinearGradient2: mid value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient2({
                min: { value: 100, color: '#ff0000' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(150)).toBe('#800080');
        });
        it('LinearGradient2: intermediate value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient2({
                min: { value: 100, color: '#ff0000' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(120)).toBe('#cc0033');
        });
        it('LinearGradient3: min value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: 100, color: '#ff0000' },
                mid: { value: 150, color: '#ffffff' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(100)).toBe('#ff0000');
        });
        it('LinearGradient3: max value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: 100, color: '#ff0000' },
                mid: { value: 150, color: '#ffffff' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(200)).toBe('#0000ff');
        });
        it('LinearGradient3: mid value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: 100, color: '#ff0000' },
                mid: { value: 170, color: '#ffffff' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(170)).toBe('#ffffff');
        });
        it('LinearGradient3: intermediate value', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: 100, color: '#ff0000' },
                mid: { value: 176, color: '#ffffff' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(178)).toBe('#eaeaff');
        });
        it('LinearGradient3: between min & mid', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: 100, color: '#ff0000' },
                mid: { value: 176, color: '#ffffff' },
                max: { value: 200, color: '#0000ff' },
            });
            expect(colorer.color(170)).toBe('#ffebeb');
        });
        it('LinearGradient2 clamping - test values outside the range', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient2({
                min: { value: 100, color: '#ff0000' },
                max: { value: 200, color: '#008000' },
            });
            expect(colorer.color(90)).toBe('#ff0000');
            expect(colorer.color(220)).toBe('#008000');
        });
        it('LinearGradient3 clamping - test values outside the range', function () {
            var colorer = visuals.createColorAllocatorFactory().linearGradient3({
                min: { value: 100, color: '#ff0000' },
                mid: { value: 150, color: '#ffffff' },
                max: { value: 200, color: '#008000' },
            });
            expect(colorer.color(0)).toBe('#ff0000');
            expect(colorer.color(300)).toBe('#008000');
        });
    });
})(powerbitests || (powerbitests = {}));
