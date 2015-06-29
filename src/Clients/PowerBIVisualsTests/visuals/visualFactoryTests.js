//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
describe("VisualFactory", function () {
    var mockVisualKey = 'mock';
    var mockFactoryMethod;
    beforeEach(function () {
        mockFactoryMethod = function () {
            return {};
        };
        var plugin = {
            name: mockVisualKey,
            capabilities: {},
            create: mockFactoryMethod
        };
        powerbi.visuals.plugins[mockVisualKey] = plugin;
    });
    afterEach(function () {
        delete powerbi.visuals.plugins[mockVisualKey];
    });
    it('getPlugin finds mock', function () {
        var plugin = powerbi.visuals.visualPluginFactory.create().getPlugin(mockVisualKey);
        expect(plugin).toBe(powerbi.visuals.plugins[mockVisualKey]);
    });
    it('getRegisteredVisuals includes test', function () {
        var registered = powerbi.visuals.visualPluginFactory.create().getVisuals().filter(function (v) { return v.name === mockVisualKey; });
        expect(registered).toEqual([powerbi.visuals.plugins[mockVisualKey]]);
    });
});
