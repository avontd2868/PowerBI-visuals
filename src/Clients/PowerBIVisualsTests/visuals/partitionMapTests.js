//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var PartitionMap = powerbi.visuals.PartitionMap;
describe("PartitionMap", function () {
    it('PartitionMap registered capabilities', function () {
        expect(powerbi.visuals.visualPluginFactory.create().getPlugin('partitionMap').capabilities).toBe(PartitionMap.capabilities);
    });
});
