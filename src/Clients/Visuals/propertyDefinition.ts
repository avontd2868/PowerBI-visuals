//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export interface VisualRoleDefinition {
        name: string;
        displayName?: string;    //TODO: Make this not optional & do call localization when possible (dinael)
        kind?: VisualRoleDefinitionKind;
        type?: DataViewMetadataColumnDataType;
    }

    export enum VisualRoleDefinitionKind {
        Category = 1,
        Measure = 1 << 1,
        Any = Category | Measure,
    }
}