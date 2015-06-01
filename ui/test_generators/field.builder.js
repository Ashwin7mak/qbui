/**
 * Here are all of the functions useful in building a field.
 * They are structured using the builder pattern
 * Created by cschneider1 on 5/31/15.
 */
(function() {
    //These are constants common to all fields
    module.exports = {

        Builder : function() {
            var fieldUnderConstruction = {};
            module.exports = {
                build : function() {
                    return fieldUnderConstruction;
                },

                /************************************************************/
                /*                      Field Properties                    */
                /************************************************************/

                withId :  function(id) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.ID = id;
                    return this;
                },

                withName :  function(name) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.NAME = name;
                    return this;
                },

                withType :  function(type) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.TYPE = type;
                    return this;
                },

                withTableId :  function(tableId) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.TABLE_ID = tableId;
                    return this;
                },

                withBuiltIn :  function(isBuiltIn) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.BUILT_IN = isBuiltIn;
                    return this;
                },

                withDataIsCopyable :  function(isDataCopyable) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.DATA_IS_COPYABLE = isDataCopyable;
                    return this;
                },

                withIncludeInQuickSearch :  function(includeInQuickSearch) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.INCLUDE_IN_QUICKSEARCH = includeInQuickSearch;
                    return this;
                },

                withClientSideAttributes :  function(clientSideAttributes) {
                    fieldUnderConstruction.fieldConstants.fieldKeys.CLIENT_SIDE_ATTRIBUTES = clientSideAttributes;
                    return this;
                },

                /************************************************************/
                /*               Formula Field Properties                   */
                /************************************************************/

                withFormula :  function(formula) {
                    fieldUnderConstruction.fieldConstants.formulaFieldKeys.FORMULA = formula;
                    return this;
                },

                /************************************************************/
                /*               Virtual Field Properties                   */
                /************************************************************/
                withRelationshipId :  function(relationshipId) {
                    fieldUnderConstruction.fieldConstants.virtualFieldKeys.RELATIONSHIP_ID = relationshipId;
                    return this;
                },

                withReferenceFieldId :  function(referenceFieldId) {
                    fieldUnderConstruction.fieldConstants.virtualFieldKeys.REFERENCE_FIELD_ID = referenceFieldId;
                    return this;
                },

                /************************************************************/
                /*               Concrete Field Properties                  */
                /************************************************************/

                withUserEditable :  function(isUserEditable) {
                    fieldUnderConstruction.fieldConstants.concreteFieldKeys.USER_EDITABLE_VALUE = isUserEditable;
                    return this;
                },

                withRequired :  function(isRequired) {
                    fieldUnderConstruction.fieldConstants.concreteFieldKeys.REQUIRED = isRequired;
                    return this;
                },

                /************************************************************/
                /*               Scalar Field Properties                    */
                /************************************************************/

                withUnique :  function(isUnique) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.UNIQUE = isUnique;
                    return this;
                },

                withIndexed :  function(isIndexed) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.INDEXED = isIndexed;
                    return this;
                },

                withKeyField :  function(isKeyField) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.KEY_FIELD = isKeyField;
                    return this;
                },

                withForeignKey :  function(isForeignKey) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.FOREIGN_KEY = isForeignKey;
                    return this;
                },

                withProxyFieldId :  function(proxyFieldId) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.PROXY_FIELD_ID = proxyFieldId;
                    return this;
                },

                withDefaultValue :  function(defaultValue) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.DEFAULT_VALUE = defaultValue;
                    return this;
                },

                withMultipleChoice :  function(multipleChoice) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.MULTIPLE_CHOICE = multipleChoice;
                    return this;
                },

                withMultipleChoiceSourceAllowed :  function(isMultipleChoiceSourceAllowed) {
                    fieldUnderConstruction.fieldConstants.scalarFieldKeys.MULTIPLE_CHOICE_SOURCE_ALLOWED = isMultipleChoiceSourceAllowed;
                    return this;
                },

                /************************************************************/
                /*               Specific Field Properties                  */
                /************************************************************/

                //DATE STUFF
                withShowMonthAsName :  function(showMonthAsName) {
                    fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.SHOW_MONTH_AS_NAME = showMonthAsName;
                    return this;
                },

                withShowDayOfWeek :  function(showDayOfWeek) {
                    fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.SHOW_DAY_OF_WEEK = showDayOfWeek;
                    return this;
                },

                withHideYearIfCurrent :  function(hideYearIfCurrent) {
                    fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.HIDE_YEAR_IF_CURRENT = hideYearIfCurrent;
                    return this;
                },

                withDateFormat :  function(dateFormat) {
                    fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.DATE_FORMAT = dateFormat;
                    return this;
                },

                //DATE TIME STUFF
                withShowTime :  function(showTime) {
                    fieldUnderConstruction.fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME = showTime;
                    return this;
                },

                withShowTimeZone :  function(showTimeZone) {
                    fieldUnderConstruction.fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE = showTimeZone;
                    return this;
                },

                withTimeZone :  function(timeZone) {
                    fieldUnderConstruction.fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.TIME_ZONE = timeZone;
                    return this;
                },

                withSortOrderAscending :  function(sortOrderAscending) {
                    fieldUnderConstruction.fieldConstants.dateTimeFormulaFieldKeys.SORT_ORDER_ASCENDING = sortOrderAscending;
                    return this;
                },

                //DURATION STUFF
                withDurationScale :  function(durationScale) {
                    fieldUnderConstruction.fieldConstants.durationAndDurationFormulaFieldKeys.SCALE = durationScale;
                    return this;
                },

                //EMAIL STUFF
                withDefaultDomain :  function(defaultDomain) {
                    fieldUnderConstruction.fieldConstants.emailAndEmailFormulaFieldKeys.DEFAULT_DOMAIN = defaultDomain;
                    return this;
                },

                withSortByDomain :  function(sortByDomain) {
                    fieldUnderConstruction.fieldConstants.emailAndEmailFormulaFieldKeys.SORT_BY_DOMAIN = sortByDomain;
                    return this;
                },

                withShowEmailEveryone :  function(showEmailEveryone) {
                    fieldUnderConstruction.fieldConstants.emailAndEmailFormulaFieldKeys.SHOW_EMAIL_EVERYONE = showEmailEveryone;
                    return this;
                },

                //FILE ATTACHMENT STUFF
                withFileLinkText :  function(linkText) {
                    fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.LINK_TEXT = linkText;
                    return this;
                },

                withFileKeepAllRevisions :  function(keepAllRevisions) {
                    fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.KEEP_ALL_REVISIONS = keepAllRevisions;
                    return this;
                },

                withRevisionsToKeep :  function(numRevisionsToKeep) {
                    fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.REVISIONS_TO_KEEP = numRevisionsToKeep;
                    return this;
                },

                withAllowUsersToMakeOlderVersionCurrentVersion :  function(allowUsersToMakeOlderVersionCurrentVersion) {
                    fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION = allowUsersToMakeOlderVersionCurrentVersion;
                    return this;
                },

                //NUMERIC STUFF
                withDecimalPlaces :  function(decimalPlaces) {
                    fieldUnderConstruction.fieldConstants.numericAndNumericFormulaFieldKeys.DECIMAL_PLACES = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero :  function(treatNullAsZero) {
                    fieldUnderConstruction.fieldConstants.numericAndNumericFormulaFieldKeys.TREAT_NULL_AS_ZERO = treatNullAsZero;
                    return this;
                },

                //PHONE NUMBER STUFF
                withIncludeExtension :  function(includeExtension) {
                    fieldUnderConstruction.fieldConstants.phoneNumberAndPhoneNumberFormulaFieldKeys.INCLUDE_EXTENSION = includeExtension;
                    return this;
                },

                //REPORT LINK STUFF
                withReportLinkText :  function(linkText) {
                    fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.LINK_TEXT = linkText;
                    return this;
                },

                withLinkRelationshipId :  function(relationshipId) {
                    fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.RELATIONSHIP_ID = relationshipId;
                    return this;
                },

                withExactMatch :  function(exactMatch) {
                    fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.EXACT_MATCH = exactMatch;
                    return this;
                },

                withReportDisplayProtocol :  function(displayProtocol) {
                    fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.DISPLAY_PROTOCOL = displayProtocol;
                    return this;
                },

                withMultiChoiceSourceAllowed :  function(multiChoiceSourceAllowed) {
                    fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.MULTI_CHOICE_SOURCE_ALLOWED = multiChoiceSourceAllowed;
                    return this;
                },

                //SUMMARY FIELD STUFF
                withAggregateFunction :  function(aggregateFunction) {
                    fieldUnderConstruction.fieldConstants.summaryFieldKeys.AGGREGATE_FUNCTION = aggregateFunction;
                    return this;
                },

                withSummaryDecimalPlaces :  function(decimalPlaces) {
                    fieldUnderConstruction.fieldConstants.summaryFieldKeys.DECIMAL_PLACES = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero :  function(treatNullAsZero) {
                    fieldUnderConstruction.fieldConstants.summaryFieldKeys.TREAT_NULL_AS_ZERO = treatNullAsZero;
                    return this;
                },

                withExpression :  function(expression) {
                    fieldUnderConstruction.fieldConstants.summaryFieldKeys.EXPRESSION = expression;
                    return this;
                },

                //TEXT STUFF
                withHtmlAllowed :  function(htmlAllowed) {
                    fieldUnderConstruction.fieldConstants.textAndTextFormulaFieldKeys.HTML_ALLOWED = htmlAllowed;
                    return this;
                },

                //TIME OF DAY STUFF
                withTimeScale :  function(scale) {
                    fieldUnderConstruction.fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.SCALE = scale;
                    return this;
                },

                withUse24HourClock :  function(use24HourClock) {
                    fieldUnderConstruction.fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.USE_24_HOUR_CLOCK = use24HourClock;
                    return this;
                },

                withUseTimezone :  function(useTimezone) {
                    fieldUnderConstruction.fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.USE_TIMEZONE = useTimezone;
                    return this;
                },

                //URL STUFF
                withUrlDisplayProtocol :  function(displayProtocol) {
                    fieldUnderConstruction.fieldConstants.urlAndUrlFormulaFieldKeys.DISPLAY_PROTOCOL = displayProtocol;
                    return this;
                },

                withUrlLinkText :  function(linkText) {
                    fieldUnderConstruction.fieldConstants.urlAndUrlFormulaFieldKeys.LINK_TEXT = linkText;
                    return this;
                },

                //USER STUFF
                withSendInvitesToUsers :  function(sendInvitesToUsers) {
                    fieldUnderConstruction.fieldConstants.userAndUserFormulaFieldKeys.SEND_INVITES_TO_USERS = sendInvitesToUsers;
                    return this;
                },

                withUserDisplayFormat : function(userDisplayFormat) {
                    fieldUnderConstruction.fieldConstants.userAndUserFormulaFieldKeys.USER_DISPLAY_FORMAT = userDisplayFormat;
                    return this;
                }
            };
        }

    };

}());