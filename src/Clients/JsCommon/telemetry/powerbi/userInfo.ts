//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.session {
    /** Global user information */
    //Defined in the index.cshtml of the PowerBIPortal project
    //populated with the user info from the signed in session
    export var userInfo: UserInfo;

    export interface UserInfo {
        name: string;
        givenName: string;
        surname: string;
        puid: string;
        userVoiceSsoToken: string;
        alternateEmail: string;
    }

    export class UserInfoUtils {
        public static getFullName(): string {
            return powerbi.session.userInfo.givenName + ' ' + powerbi.session.userInfo.surname;
        }

        public static isInternalUser(): boolean {
            // Internal email addresses are in the format someone@microsoft.com, or someone@xxxxx.microsoft.com (ie. someone@ntdev.microsoft.com)
            var lowerUserName = powerbi.session.userInfo.name.toLowerCase();
            return lowerUserName.indexOf('@microsoft.com') >= 0 || lowerUserName.indexOf('.microsoft.com') >= 0;
        }

        public static getEmailAddressForReceivingMail(): string {
            // the UPN the user logged in with may not be a real mailbox and/or the user may have a preferred email address
            // when contacting the user via email the address returned by this function should be used  
            var userInfo = powerbi.session.userInfo;

            if(userInfo == null) {
                return '';
            }
            
            return jsCommon.StringExtensions.isNullOrEmpty(userInfo.alternateEmail)  
                ? userInfo.name
                : userInfo.alternateEmail;
        }
    }
}