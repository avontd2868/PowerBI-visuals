//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

import WebChart = powerbi.visuals.WebChart;

describe("WebChart", () => {

    it('WebChart registered capabilities', () => {
        expect(powerbi.visuals.visualPluginFactory.create().getPlugin('webChart').capabilities).toBe(WebChart.capabilities);
    });
});