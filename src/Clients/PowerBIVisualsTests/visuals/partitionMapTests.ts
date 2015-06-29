//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

import PartitionMap = powerbi.visuals.PartitionMap;

describe("PartitionMap", () => {

    it('PartitionMap registered capabilities', () => {
        expect(powerbi.visuals.visualPluginFactory.create().getPlugin('partitionMap').capabilities).toBe(PartitionMap.capabilities);
    });
}); 