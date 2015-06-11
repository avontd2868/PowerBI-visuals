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

module powerbi {

    export declare var build;

    /**
     * Do not blindly copy ng.IRequestConfig as the idea of this interface is 
     * to lessen flexibility for cleaner code. We may eventually need to add 
     * properties but when we do let's think about how to impose code consistency.
     */
    export interface IRequestOptions {
        params?: { [index: string]: string; };
        headers?: { [index: string]: string; };
        retryCount?: number;
        timeout?: any; // number | promise
        responseType?: string;
        silentlyFailOnExpiry?: boolean;
        enableTelemetry?: boolean; // Turns on telemetry for the network request
        telemetryDescription?: string; // Used to log telemetry about why the request was made (do not include PII here).
        disableRedirectToSignupOnUnlicensedUser?: boolean; // If set and true, disables signup redirect when we have an unlicensed user error
    }

    export interface IHttpResult<TContract> {
        data: TContract;
        status: HttpStatusCode;
        headers: (headerName: string) => string;
        activityId?: string;
        requestId?: string;
    }

    export enum HttpStatusCode {
        AngularCancelOrTimeout = 0, // Angular returns a status code of 0 for timeout or cancel
        OK = 200,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        NotFound = 404,
        RequestTimeout = 408,
        RequestEntityTooLarge = 413,
    }

    export interface HttpPromise<TContract> extends IPromise2<IHttpResult<TContract>, IHttpResult<TContract>> {
    }

    export interface IHttpService {
        get<TContract>(url: string, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        post<TContract>(url: string, data: any, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        put<TContract>(url: string, data: any, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        delete<TContract>(url: string, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        powerbiRequestOptions(): IRequestOptions;
        defaultRetryRequestOptions(): IRequestOptions;

        // TODO: Change this to an event bridge event once event bridge is moved to common code.
        registerResponseCallback(callback: (success: boolean) => void): void;
        unregisterResponseCallback(callback: (success: boolean) => void): void;
    }
}