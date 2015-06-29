//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

describe("VisualFactory", () => {
    var mockVisualKey = 'mock';
    var mockFactoryMethod: powerbi.IVisualFactoryMethod;

    beforeEach(() => {
        mockFactoryMethod = () => { return <powerbi.IVisual>{}; };

        var plugin: powerbi.IVisualPlugin = {
            name: mockVisualKey,
            capabilities: {},
            create: mockFactoryMethod
        };
        powerbi.visuals.plugins[mockVisualKey] = plugin;
    });

    afterEach(() => {
        delete powerbi.visuals.plugins[mockVisualKey];
    });

    it('getPlugin finds mock', () => {
        var plugin = powerbi.visuals.visualPluginFactory.create().getPlugin(mockVisualKey);

        expect(plugin).toBe(powerbi.visuals.plugins[mockVisualKey]);
    });

    it('getRegisteredVisuals includes test', () => {
        var registered = powerbi.visuals.visualPluginFactory.create().getVisuals()
            .filter(v => v.name === mockVisualKey);

        expect(registered).toEqual([powerbi.visuals.plugins[mockVisualKey]]);
    });
});