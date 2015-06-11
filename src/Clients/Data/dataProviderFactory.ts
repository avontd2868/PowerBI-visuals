/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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