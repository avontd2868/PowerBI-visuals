 //-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export module AnimatorCommon {
        export var MinervaAnimationDuration = 250;
    }

    /** We just need to have a non-null animator to allow axis animations in cartesianChart .
      * Use this temporarily for Line/Scatter until we add more animations (MinervaPlugins only).
      */
    export class NullAnimator {
        public animate(options: any): any
        {
            return null;
        }
    }
}