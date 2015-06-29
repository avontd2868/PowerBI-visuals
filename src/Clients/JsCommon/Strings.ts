//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module InJs {

    /** Holder for UI strings until Localization is implemented */
    export module Strings {

        /** Date time format which will be localized. */
        export var dateTimeFormat = "M/d/yyyy h:mm tt";

        /** Title for error displayed when an error occurs on the server during Interpret */
        export var serverErrorTitleText = "Sorry, something went wrong";

        /** Detailed message for error displayed when an error occurs on the server during Interpret */
        export var serverErrorDetailsText = "Please try your query again. If the error continues please contact your system administrator.";

        /** Detailed message for error displayed when a timeout occurs during Interpret */
        export var serverTimeoutDetailsText =
            "There was a timeout processing your request. Please try again. If the error continues please contact your system administrator.";

        /** Detailed message for error displayed when invalid semantic query exception is raised */
        export var serverReloadDetailsText =
            "There was a mismatch in the metadata. This usually occurs when the data on the server has been updated. Please refresh the browser and try your query again.";

        /** Template for the Error Code displayed on a server error (when a Power BI Q&A error is present). */
        export var infoNavErrorCodeTemplate = "{0} ({1})";

        /** Template for error message including an activity id. */
        export var infoNavErrorWithActivityIdTemplate = "{0} (Activity Id: {1})";

        /** The display title for the error field containing an error code */
        export var errorCodeText = "Error Code";

        /** The display title for the error field containing an activity id */
        export var errorActivityIdText = "Activity Id";

        /** The display title for the error field containing an request id */
        export var errorRequestIdText = "Request Id";

        /** The display title for the error field containing a line number */
        export var errorLineNumberText = "Line number";

        /** The display title for the error field containing a column number */
        export var errorColumnNumberText = "Column number";

        /** The display title for the error field containing a stack trace */
        export var errorStackTraceText = "Stack trace";

        /** The display title for the error field containing a source file */
        export var errorSourceFileText = "Source file";

        /** The display title for the error field containing a timestamp */
        export var errorTimestampText = "Time";

        /** The call stack for an error. */
        export var errorCallStackText = "Call stack";

        /** Title displayed when no results are found for a query */
        export var emptyResultTitleText = "Sorry, I wasn't able to find a good answer.";

        /** Description displayed when no results are found for a query */
        export var emptyResultDescriptionText = "";

        /** Link text displayed to show additional error details */
        export var showDetailsText = "Show technical details";

        /** Label for showing more visualization types */
        export var showMoreVisualizationsLabel = "show more";

        /** Label for showing less visualization types */
        export var showFewerVisualizationsLabel = "show fewer";

        /** Label for stacked bar chart visualization type. */
        export var stackedBarChartVisualizationsLabel = "bar chart";

        /** Label for clustered bar chart visualization type. */
        export var clusteredBarChartVisualizationsLabel = "clustered bar chart";

        /** Label for 100% percent bar chart visualization type. */
        export var hundredPercentBarChartVisualizationsLabel = "100% stacked bar chart";

        /** Label for column chart visualization type. */
        export var stackedColumnChartVisualizationsLabel = "column chart";

        /** Label for clustered column chart visualization type. */
        export var clusteredColumnChartVisualizationsLabel = "clustered column chart";

        /** Label for 100% percent column chart visualization type. */
        export var hundredPercentColumnChartVisualizationsLabel = "100% stacked column chart";

        /** Label for scatter chart visualization type. */
        export var scatterChartVisualizationsLabel = "scatter chart";

        /** Label for line chart visualization type. */
        export var lineChartVisualizationsLabel = "line chart";

        /** Label for line chart visualization type. */
        export var pieChartVisualizationsLabel = "pie chart";

        /** Label for map visualization type. */
        export var mapVisualizationsLabel = "map";

        /** Label for matrix visualization type. */
        export var matrixVisualizationsLabel = "matrix";

        /** Label for table visualization type. */
        export var tableVisualizationsLabel = "table";

        /** Label for card visualization type. */
        export var cardVisualizationsLabel = "card";

        /** Label for the settings link within our SharePoint app */
        export var sharePointAppSettingsLinkLabel = "Settings";

        /** Label for the add samples link within our SharePoint app */
        export var sharePointAppAddSamplesLinkLabel = "Add sample data...";

        /** Title for the settings pane within our SharePoint app */
        export var sharePointAppSettingsPaneTitle = "Settings";

        /** Label for the button that closes the Settings pane inside our SharePoint app */
        export var sharePointAppCloseSettingsPaneButtonLabel = "Close";

        /** The error message displayed when a user attempts to add a workbook using an invalid url */
        export var sharePointSettingsInvalidModelUrlLabel = "Please enter a valid URL";

        /** The information message displayed to the user while a workbook is being loaded */
        export var sharePointSettingsRetrievingModelLabel = "Looking for a workbook at the given URL...";

        /** The message displayed to the user to publish the a workbook*/
        export var sharePointSettingsModelNeedsPublishingLabel = "Your workbook needs to be enabled for web viewing before it can be searched with Power BI Q&A.";

        /** The error message displayed to the user when there was a problem retrieving the specified workbook */
        export var sharePointSettingsModelRetrievalFailedLabel = "There was a problem retrieving the specified workbook";

        /** The error message displayed to the user when there was a problem removing the specified workbook */
        export var sharePointSettingsModelRemovalFailedLabel = "There was a problem removing the specified workbook";

        /** The error message displayed to the user when an already existing workbook has been specified */
        export var sharePointSettingsDuplicateModelSpecifiedLabel = "The specified workbook has already been added";

        /** The title for the Models section of the Settings page */
        export var sharePointSettingsModelsSectionTitleLabel = "Models";

        /** The message displayed to the user while the list of workbooks is retrieved in the settings pane */
        export var sharePointSettingsModelsLoadingLabel = "Please wait...";

        /** The title for the dialog used to add new workbooks inside the SharePoint settings pane */
        export var sharePointSettingsAddModelDialogTitle = "Add workbook";

        /** The label for the button used to add a new workbook inside the SharePoint settings pane */
        export var sharePointSettingsAddModelBtnLabel = "Add workbook...";

        /** The description text for the add workbook dialog */
        export var sharePointSettingsAddModelDialogText = "To add a new workbook, enter the workbook's URL in the box below and click 'Add'.";

        /** The label for the button used to add a new workbook inside the SharePoint settings pane */
        export var sharePointSettingsAddModelDialogAddActionLabel = "Add";

        /** The label for the button used to remove an individual workbook inside the SharePoint settings pane */
        export var sharePointSettingsRemoveModelBtnLabel = "Remove";

        /** The title text for the confirmation dialog used to remove workbooks inside the SharePoint settings pane */
        export var sharePointSettingsRemoveModelDialogTitle = "Are you sure you want to remove this workbook?";

        /** The text for the dialog used to remove workbooks inside the SharePoint settings pane */
        export var sharePointSettingsRemoveModelDialogText = "This will remove {0} from the list of workbooks.";

        /** The label for the column containing workbook names inside the SharePoint settings pane */
        export var sharePointSettingsModelNameColumnLabel = "Workbook Name";

        /** The label for the column containing workbook URLs inside the SharePoint settings pane */
        export var sharePointSettingsModelUrlColumnLabel = "URL";

        /** The label for the column containing workbook status descriptions inside the SharePoint settings pane */
        export var sharePointSettingsModelStatusColumnLabel = "Status";

        /** The message displayed to the user when the Models control is unable to initialize */
        export var sharePointSettingsModelsLoadFailedLabel = "We were unable to load the list of workbooks at this time, please try again later";

        /** The message displayed to the user whent the BI Center app is not installed */
        export var sharePointSettingsBICenterAppNotInstalled = "Please install the BI Center app to configure Power BI Q&A";

        /** The message displayed to the user when the BI Center app is in error state */
        export var sharePointSettingsBICenterAppErrorInstallation = "Please fix the status of BI Center app to configure Power BI Q&A";

        /** The first paragraph of the description text for the Models section of the SharePoint settings page */
        export var sharePointSettingsModelsSectionFirstParagraghText = "These are the workbooks that Power BI Q&A will use when querying for results.";

        /** The second paragraph of the description text for the Models section of the SharePoint settings page */
        export var sharePointSettingsModelsSectionSecondParagraghText =
            "To add a workbook, click on the 'Add workbook...' button below. Similarly, you may remove previously added workbooks by clicking the Remove button for the corresponding workbook.";

        /** The message displayed when there is an error in adding a model */
        export var sharePointSettingsAddModelErrorText = "The add operation failed. Error: {0}";

        /** The following represent the possible status values for a Power BI Q&A workbook within the Settings Page */
        export var sharePointSettingsModelStatusNoneLabel = "None";
        export var sharePointSettingsModelStatusValidatingLabel = "Validating";
        export var sharePointSettingsModelStatusPublishingLabel = "Publishing";
        export var sharePointSettingsModelStatusDeletePendingLabel = "Deleting";
        export var sharePointSettingsModelStatusPublishSuccessfulLabel = "Published";

        /** The following represent the possible error code status for a Power BI Q&A workbook when publishing */
        export var sharePointSettingsModelPublishErrorNone = "None";
        export var sharePointSettingsModelPublishMissingError = "Workbook does not contain a model";
        export var sharePointSettingsModelPublishAboveLimitError = "Workbook size without model is above size limit";
        export var sharePointSettingsModelPublishXmlaError = "Xmla operation exception was thrown";
        export var sharePointSettingsModelNotPublishedError = "The workbook is not published";
        export var sharePointSettingsModelPublishCheckoutError = "Workbook in this checkout type is already being processed";
        export var sharePointSettingsModelPublishUnknownError = "Unknown error";

        /** Add workbook error: URL is not a SharePoint URL */
        export var addModelNonSharePointUrlError = "This is not a SharePoint URL. You must provide the URL of an Excel workbook in the current SharePoint site.";

        /** Add workbook error: URL is in sharepoint but we can’t resolve the document IDs (doesn’t exist) */
        export var addModelSharePointDocumentNotFoundError = "No document exists for this URL. You must provide the URL of an Excel workbook in the current SharePoint site.";

        /** Add workbook error: URL is not a workbook */
        export var addModelSharePointInvalidUrlError = "This URL is not an Excel workbook. You must provide the URL of an Excel workbook in the current SharePoint site.";

        /** Add workbook error: URL is not in this site */
        export var addModelSharePointUrlNotInCurrentSiteError = "This Excel workbook is not stored in the same site as the Power BI Q&A application is installed in.  You must provide the URL of an Excel workbook in the current SharePoint site.";

        /** Add workbook error: Initial PUT to add the workbook fails */
        export var addModelOperationFailedError = "The workbook could not be added at this time.  Please try again.  If the problem persists, please contact support.";

        /** Add workbook error: Add workbook is disallowed */
        export var addModelDisallowedError = "The workbook could not be added since it is disallowed by the server.";

        /** The text for the link to be appended to SharePoint add workbook errors */
        export var addModelErrorHelpLinkText = "Find out more about adding workbooks";

        /** The text for the error indicating that the app could not load the workbooks list from the server */
        export var sharePointAppLoadModelsErrorText = "There was a problem accessing the current set of workbooks. Refresh the page to try again.  If the problem persists, please contact support.";

        /** The title text for the message indicating that no workbooks have been configured for Power BI Q&A */
        export var sharePointAppNoModelsConfiguredTitle = "You need to set up Power BI Q&A";

        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        export var sharePointAppNoModelsConfiguredMessage = "You need to choose the workbooks to search before you can start asking questions using Power BI Q&A.";

        /** The title text for the message indicating that no workbooks have been configured for Power BI Q&A */
        export var sharePointAppNoModelsConfiguredUserTitle = "Oops, not ready yet";

        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        export var sharePointAppNoModelsConfiguredUserMessage = "No workbooks have been set up for Power BI Q&A. Contact a site owner to set up the site.";

        /** The label for the button shown on the no models configured dialog */
        export var sharePointAppNoModelsActionLabel = "Go to settings...";

        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        export var sharePointSettingsAccessDeniedMessage = "You do not have permission to manage the Power BI Q&A application for this site.  Only Site Owners or users with the manage site permission level can manage the Power BI Q&A application.";

        /** The label for the button used to cancel an action inside a dialog */
        export var dialogCancelActionLabel = "Cancel";

        /** The label for the button used to close a dialog */
        export var dialogCloseActionLabel = "Close";

        /** The label for the dialog button used to send */
        export var dialogSendActionLabel = "Send";

        /** The label for the dialog button used to refresh the page in case of a fatal error */
        export var dialogRefreshPageActionLabel = "Refresh Page";

        /** The label for the dialog button used to go back to Power BI Portal */
        export var dialogGoBackActionLabel = "Go Back";

        /** The title for the error dialogs within the app */
        export var errorDialogTitle = "oops, something went wrong";

        /** The text for the dialog shown upon encountering a fatal error */
        export var fatalErrorDialogText = "The page could not be loaded at this time.  Refresh the page to try again.  If the problem persists, please contact support.";
        
        /** The text for the dialog shown upon encountering an unsupported url error */
        export var unsupportedUrlMessageText = "The URL of this page has changed. Please return to SharePoint to get the latest URL.";

        /** The title of the warning shown when a workbook is missing a linguistic schema */
        export var linguisticSchemaWarningTitle = "Get better search results";

        /** The template for a single workbook linguistic schema warning */
        export var linguisticSchemaSingleWorkbookWarningTemplate = "{WorkbookLink} will return better results if you add language information to the workbook.";

        /** The template for a single workbook linguistic schema warning */
        export var linguisticSchemaMultipleWorkbookWarningTemplate = "{WorkbookLink} and other workbooks will return better results if you add language information to the workbooks.";

        /** The link for showing more info about the linguistic schema warning */
        export var linguisticSchemaWarningMoreInfoLink = "Learn about language modeling";

        /** The label for the link allowing the user to open the current workbook in a new browser tab */
        export var refinementPaneOpenWorkbookLabel = "Open workbook";

        /** The format for the last modified date displayed in the refinement pane */
        export var refinementPaneLastModifiedDateFormat = "MMM' 'd', 'yyyy' at 'h':'mmtt";

        /** The title of the window notifying the user that they are running on an unsupported browser */
        export var unsupportedBrowserMessageTitle = "Unsupported browser detected";

        /** The contents of the window notifying the user that they are running on an unsupported browser */
        export var unsupportedBrowserMessageText = "Power BI Q&A requires Internet Explorer 10 or higher, please upgrade your browser and try again";

        /** The message in the suggestion dropdown allowing the user to specify the meaning of an unrecognized term */
        export var modelingClarifyTermCommand = "Help us understand what {term} means";

        /** The message in the suggestion dropdown allowing the user to change how the system understands a recognized term */
        export var modelingAddSynonymTermCommand = "Change how {term} is being understood";

        /** The message displayed to the user when they have selected a term that has no associated phrasing templates */
        export var modelingTermHasNoTemplates = "Sorry, we don't have any suggestions for the term you selected";

        /** The display string for the modeling template allowing the user to declare a global synonym for a selection */
        export var modelingSynonymTemplateDisplayText = "the same as";

        /** The error message shown when the user is navigating away with pending add models */
        export var pendingAddModelOperationsText = "There are pending publish operations.";

        /** Text displayed beside the show collage button. */
        export var showCollageText = "See some other questions we do have answers for...";

        /** Text displayed when silverlight is not available. */
        export var silverlightInstallRequiredText = "Power BI Q&A requires Silverlight 5. Click here to Install Silverlight";

        /** Notification title displayed when a request has timed out due to workbooks not being loaded. */
        export var workbooksLoadingTimeoutTitle = "Please wait";

        /** Notification text displayed when a request has timed out . */
        export var workbooksLoadingTimeoutText = "Contacting Power BI Q&A service...";

        /** Text displayed when a request has timed out. */
        export var interpretRetryMaxCountExceededMessageText = "There was a timeout executing your query. Please try again later. If the problem persists, contact your administrator.";

        /** The title text for the message indicating that sample workbooks are not configured Power BI Q&A */
        export var sharePointAppNoSamplesTitle = "We've been making some great changes to our sample workbooks";

        /** The message text for the message indicating that sample workbooks are not configured Power BI Q&A */
        export var sharePointAppNoSamplesMessage = "Go back to the Power BI page, click the settings gear in the top right corner and click add sample data to update your samples.";

        /** The text branding to be shown at the top of application page */
        export var powerBIChromeBrandingText = 'Power BI for Office 365';

        /** The text shown when the user doesn't have valid SharePoint Context token while requesting the App Page or call GetAppMetaData for interpret */
        export var notAuthenticatedErrorMessage = "You need to sign in before we can show you this page.  Click the Refresh Page button to continue.";

        /** The text for the error when there are any problems with accessing the service, either an expired access token or invalid short-lived PowerBI token*/
        export var tokenInvalidOrExpiredErrorText = "We couldn’t connect to Power BI right now.";

        /** The title text for the dialog prompt that is raised when the token has expired */
        export var connectionExpiredTitleText = 'Connection expired';

        /** The title text for the help viewer control */
        export var helpViewerControlTitleText = 'ABOUT THIS DATA';

        /** The title text for the feedback section inside the help viewer control */
        export var helpViewerFeedbackBannerTitle = 'Learn More. Give Feedback.';

        /** The text content for the feedback section inside the help viewer control */
        export var helpViewerFeedbackBannerText = 'We\'re working to improve Power BI Q&A. Share feedback and learn more about what\'s coming next.';

        /** The caption text for the help viewer control letting the user know that there is no help content available for the current model */
        export var helpViewerHelpUnavailableCaptionText = 'We\'re sorry, there is no help content available at this time.';

        /** The caption text for the help viewer control letting the user know that a help page is being loaded */
        export var helpViewerHelpLoadingCaptionText = 'Looking for content...';

        /** The text of the link allowing the user to return to the Power BI site */
        export var backToBISiteLinkText = 'Back to Power BI Site';

        /** The text of the link allowing the user to return to display the featured questions set */
        export var showFeaturedQuestionsLinkText = 'Show Featured Questions';

        /** The text of the link allowing the user to copy a link to the current result to their clipboard */
        export var copyResultLinkText = 'Copy URL';

        /** The text of the link allowing the user to send an email with the link to the current result URL */
        export var shareResultLinkText = 'Share';

        /** The subject line for the share result email */
        export var shareResultEmailSubjectText = 'Check out this data insight';

        /** The body for the share result email */
        export var shareResultEmailBodyTemplateText = '{0}\r\rDiscovered with Power BI Q&A';

        /** The notification text for when the user copies a result URL to their clipboard */
        export var resultLinkCopiedNotificationText = 'A link to this result was copied to the clipboard.';

        /** Collage item editor: the tile of the editor dialog when editing a new item */
        export var CollageItemEditorAddItemTitle = 'Feature a question';

        /** Collage item editor: the tile of the editor dialog when editing an existing item */
        export var CollageItemEditorEditItemTitle = 'Edit featured question';

        /** Collage item editor: The tile of the form region used to input an utterance */
        export var CollageItemEditorUtteranceFormRegionTitle = 'Type a question';

        /** Collage item editor: Placeholder on text input field for user utterance */
        export var CollageItemEditorUtteranceInputPlaceholder = 'Enter your question...';

        /** Collage item editor: Caption on text input field for user utterance */
        export var CollageItemEditorUtteranceInputCaption = 'You can ask anything about the workbooks currently available on the site';

        /** Collage item editor: Caption on text input field for user utterance when the dialog is busy finding an answer */
        export var CollageItemEditorUtteranceInputSearchingCaption = 'We\'re trying to find an answer to your question...';

        /** Collage item editor: Caption on text input field for user utterance when the dialog is busy finding an answer */
        export var CollageItemEditorUtteranceInputNoResultsCaption = 'We\'re sorry, we couldn\'t find an answer to your question';

        /** Collage item editor: Caption on text input field for user utterance when the dialog has found an answer */
        export var CollageItemEditorUtteranceInputResultFoundCaption = 'We\'ve found an answer to your question!';

        /** Collage item editor: Label for checkbox determining whether the user provided utterance should be featured on the Power BI site */
        export var CollageItemEditorFeatureOnPowerBICheckboxCaption = 'Show on the Power BI site home page';

        /** Collage item editor: The tile of the form region in which the user can pick the size of the tile for the featured question */
        export var CollageItemEditorTileSizeFormRegionTitle = 'Tile size';

        /** Collage item editor: The caption for the radio button allowing the user to select a small tile size */
        export var CollageItemEditorTileSizeSmallCaption = 'Small';

        /** Collage item editor: The caption for the radio button allowing the user to select a large tile size */
        export var CollageItemEditorTileSizeLargeCaption = 'Large';

        /** Collage item editor: The title of the form region in which the user can pick from one of the predetermined tile colors */
        export var CollageItemEditorTileColorRegionTitle = 'Background color';

        /** Collage item editor: The title of the form region in which the user can pick from one of the predetermined tile backgrounds */
        export var CollageItemEditorTileIconRegionTitle = 'Background icon';

        /** Collage item editor: The title of the form region in which the user can provide a custom image url for the tile background */
        export var CollageItemCustomImageRegionTitle = 'Background image';

        /** Collage item editor: The text placeholder for the input field allowing the user to specify a custom image url */
        export var CollageItemCustomImageUrlInputPlaceholder = 'Enter image URL here (optional)';

        /** Collage item editor: The caption telling the user the best size for external images */
        export var CollageItemCustomImageUrlCaption = 'For best results use an image that is 250 pixels wide or larger';

        /** Collage item editor: The caption telling the user we're trying to load the specified image */
        export var CollageItemCustomImageUrlLoadingCaption = 'Loading image...';

        /** Collage item editor: The caption telling the user we couldn't load an image from the specified url */
        export var CollageItemCustomImageUrlLoadErrorCaption = 'We\'re sorry, we couldn\'t find an image at the specified location';

        /** Collage item editor: The caption telling the user they entered an invalid url */
        export var CollageItemCustomImageUrlBadAddressCaption = 'Please enter a valid URL';

        /** Collage item editor: The caption telling the user loaded an image from the specified url */
        export var CollageItemCustomImageUrlSuccessCaption = 'Image loaded successfully';

        /** Collage item editor: The title of the form region in which users can see the item being created */
        export var CollageItemEditorPreviewRegionTitle = 'Preview';

        /** Collage item editor: The label for the button allowing users to save their work */
        export var CollageItemEditorSaveBtnTxt = 'Save';

        /** Collage item editor: The label for the button allowing users to close the editor without saving their work */
        export var CollageItemEditorCancelBtnTxt = 'Cancel';

        /** Collage item control: The title of the message letting the user know they have reached the max number of possible items */
        export var CollageControlMaxNumberOfItemsMessageTitle = 'Maximum number of featured questions reached';

        /** Collage item control: The text of the message letting the user know they have reached the max number of possible items */
        export var CollageControlMaxNumberOfItemsMessageText = 'You have reached the maximum number of featured questions that can be displayed. Please remove some questions to continue';

        /** The title of the dialog asking the user to confirm whether they want to remove a featured question from the collage */
        export var CollageDeleteItemDialogTitle = 'Remove Featured Question';

        /** The text content of the dialog asking the user to confirm whether they want to remove a featured question from the collage */
        export var CollageDeleteItemDialogText = 'Are you sure you want to permanently remove this featured question?';

        /** The description of the pulldown list allowing the user to switch between result sources */
        export var ModelSelectionControlPulldownDescriptionText = 'results from';

        /** The text used inside a buton when asking the user a yes/no question/prompt */
        export var YesDialogOption = 'Yes';

        /** The text used inside a buton when asking the user a yes/no question/prompt */
        export var NoDialogOption = 'No';

        /** The text tile in the main help page*/
        export var mainHelpPageTitle = 'Q&A';

        /** The text description in the main help page*/
        export var mainHelpPageDescription = 'Power BI Q&A makes it easy for anyone to discover and explore their data.';

        /** The text of workbook list title in the main help page*/
        export var mainHelpPageWorkbookListTitle = 'Workbooks';

        /** The text description in the model help page*/
        export var modelHelpPageDescription = 'Here are some examples of questions you could ask about this workbook.';

        /** The text of question list title in the model help page*/
        export var modelHelpPageQuestionListTitle = 'Featured questions';

        /** The text of add featured question on help page*/
        export var helpPageAddFeaturedQuestion = 'add featured question';

        /** The text of featured questions on help page*/
        export var helpPageFeaturedQuestions = 'featured questions';

        /** The text of empty list on help page*/
        export var helpPageNoItemsListed = 'no items listed';

        /** The tooltip for the button which allows users to flag utterances */
        export var flagUtteranceTooltip = 'Flag the result of this question as not helpful.';

        /** The tooltip for the user feedback button which allows users to rate answers */
        export var utteranceFeedbackTooltip = 'Help improve Q&A';

        /** The title for the user feedback dialog which allows users to rate answers */
        export var utteranceFeedbackDialogTitle = 'Q&A Feedback';

        /** The prompt for the user feedback dialog which allows users to rate answers */
        export var utteranceFeedbackDialogPrompt = 'Please rate how well Q&A helped find data to answer your question.';

        /** A feedback option, displayed in the dialog which allows users to rate answers */
        export var utteranceFeedbackResultBad = 'Way Off';

        /** A feedback option, displayed in the dialog which allows users to rate answers */
        export var utteranceFeedbackResultMedium = 'Got Close';

        /** A feedback option, displayed in the dialog which allows users to rate answers */
        export var utteranceFeedbackResultGood = 'Great';

        /** The error text for the model selection control if one or more sources fail to load */
        export var modelSelectionHasErrors = 'Some workbooks did not load successfully';
    }
}