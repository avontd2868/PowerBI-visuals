//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export interface VisualConfig {

        visualType: string;

        projections: data.QueryProjectionsByRole[];

        // this is the one that has info like Total, Combochart viz types, legend settings, etc...
        // each IVisual implementation, should simply cast this to whatever object they expect
        config?: any;
    }
}