//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export type DisplayNameGetter = ((resourceProvider: IStringResourceProvider) => string) | string;

    export function createDisplayNameGetter(displayNameKey: string): (IStringResourceProvider) => string {
        return (resourceProvider: IStringResourceProvider) => resourceProvider.get(displayNameKey);
    }
}