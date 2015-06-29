//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {

    export interface ILocalStorageService {
        getData(key: string): any;
        setData(key: string, data: any): void;
    }

    class LocalStorageService implements ILocalStorageService {

        getData(key: string): any {
            try {
                if (localStorage) {
                    return JSON.parse(localStorage[key]);
                }
            }
            catch (exception) {}

            return null;
        }

        setData(key: string, data: any) {
            try {
                if (localStorage) {
                    localStorage[key] = JSON.stringify(data);
                }
            }
            catch (e) {}
        }
    }

    export var localStorageService: ILocalStorageService = new LocalStorageService();
}