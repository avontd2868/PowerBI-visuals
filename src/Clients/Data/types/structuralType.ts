//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    import SemanticFilter = powerbi.data.SemanticFilter;

    /** Describes a structural type in the client type system. Leaf properties should use ValueType. */
    export interface StructuralTypeDescriptor {
        fill?: FillTypeDescriptor;
        fillRule?: FillRuleTypeDescriptor;
        filter?: FilterTypeDescriptor;
        //border?: BorderTypeDescriptor;
        //etc.
    }

    export type StructuralObjectDefinition =
        FillDefinition |
        FillRuleDefinition |
        SemanticFilter;

    /** Defines instances of structural types. */
    export type StructuralObjectValue =
        Fill |
        FillRule |
        SemanticFilter;

    export module StructuralTypeDescriptor {
        export function isValid(type: StructuralTypeDescriptor): boolean {
            debug.assertValue(type, 'type');

            if (type.fill ||
                type.fillRule ||
                type.filter) {
                return true;
            }

            return false;
        }
    }
}
