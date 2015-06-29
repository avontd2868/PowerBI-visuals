// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

/// <disable>JS2025.InsertSpaceBeforeCommentText,JS2027.PunctuateCommentsCorrectly,JS2076.IdentifierIsMiscased,JS3085.VariableDeclaredMultipleTimes, JS3116.PreviousDeclarationWasHere, JS2074.IdentifierNameIsMisspelled, JS2030.FollowKeywordsWithSpace, JS2023.UseDoubleQuotesForStringLiterals, JS2028.UseCPlusPlusStyleComments, JS2026.CapitalizeComments, JS2008.DoNotUseCookies, JS2005.UseShortFormInitializations, JS2064.SpecifyNewWhenCallingConstructor, JS2024.DoNotQuoteObjectLiteralPropertyNames, JS2043.RemoveDebugCode, JS3045.MissingInputFile</disable>
/// <dictionary target='comment'>args,aspx,autocompletion,enqueue,Firefox,Hardcoded,interdependant,Kinda,Moderncop,Nav,param,params,powerview, secweb, serializer, sharepoint, silverlight, src, stylesheet, theming, untokenized, Xmla </dictionary>

// ModernCop Rules and Settings - Disabling some non critical warnings that we currently have per:
// http://secweb01/MSEC/Tools/Lists/MSEC%20Tool%20Errors%20and%20Warnings/AllItems.aspx?FilterField1=Tool&FilterValue1=Moderncop

/// <disable>JS2085.EnableStrictMode</disable>
// Justification: The violation is that strict mode is enabled for global scope, which could lead
// to unexpected behavior if the target JS file of this project is concatenated with other JS files.
// The target JS file of this project is not concatenated with other files.
"use strict";