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