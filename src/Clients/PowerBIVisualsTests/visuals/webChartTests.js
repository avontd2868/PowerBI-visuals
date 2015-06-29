//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var WebChart = powerbi.visuals.WebChart;
describe("WebChart", function () {
    it('WebChart registered capabilities', function () {
        expect(powerbi.visuals.visualPluginFactory.create().getPlugin('webChart').capabilities).toBe(WebChart.capabilities);
    });
});
