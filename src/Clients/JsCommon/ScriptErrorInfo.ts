//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

interface ScriptErrorInfo {
    message: string;
    sourceUrl: string;
    lineNumber: number;
    columnNumber: number;
    stack: string;
}

interface ErrorInfoKeyValuePair {
    errorInfoKey: string;
    errorInfoValue: string;
}

interface ErrorDetails {
    message: string;
    additionalErrorInfo: ErrorInfoKeyValuePair[];
}
