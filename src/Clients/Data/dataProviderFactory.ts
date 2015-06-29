//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    export interface DataProviderReference {
        type?: string;
    }

    export interface IDataProviderFactory{
        getPlugin(type: string): IDataProviderPlugin;
    }

    export function createDataProviderFactory(plugins: { [name: string]: IDataProviderPlugin }): IDataProviderFactory {
        return new DataProviderFactory(plugins);
    }

    class DataProviderFactory {
        private plugins: { [name: string]: IDataProviderPlugin };

        constructor(plugins: { [name: string]: IDataProviderPlugin }) {
            debug.assertValue(plugins, 'plugins');

            this.plugins = plugins;
        }

        /** Returns the IDataProvider plugin for the specified type, if any.  If the type is unspecified, dsr is assumed. */
        public getPlugin(type: string): IDataProviderPlugin {
            var plugin: IDataProviderPlugin = this.plugins[normalizeProviderName(type || 'dsr')];

            if (!plugin) {
                debug.assertFail('Failed to load DataPlugin of type: ' + type);
                return;
            }

            return plugin;
        }
    }

    export module DataProviderUtils {
        /** Finds the IDataProvider plugin name referred to by the set of references. */
        export function findType(references: DataProviderReference[]): string {
            var type: string;
            for (var i = 0, len = references.length; i < len; i++) {
                var currentType = normalizeProviderName(references[i].type);
                if (type && type !== currentType)
                    return;

                type = currentType;
            }

            return type;
        }
    }

    function normalizeProviderName(type: string): string {
        return type || 'dsr';
    }
}