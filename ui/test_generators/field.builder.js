/**
 * Here are all of the functions useful in building a field.
 * They are structured using the builder pattern
 * Created by cschneider1 on 5/31/15.
 */
(function() {
    var fieldConstants = require('./field.constants');

    //These are constants common to all fields
    module.exports = {

        builder : function(){
            var fieldUnderConstruction = {};

            return {
                build : function() {
                    return fieldUnderConstruction;
                },

                /************************************************************/
                /*                      Field Properties                    */
                /************************************************************/

                withId :  function(id) {
                    fieldUnderConstruction[fieldConstants.ID] = id;
                    return this;
                },

                withName :  function(name) {
                    fieldUnderConstruction[fieldConstants.NAME] = name;
                    return this;
                },

                withType :  function(type) {
                    fieldUnderConstruction[fieldConstants.TYPE] = type;
                    return this;
                },

                withTableId :  function(tableId) {
                    fieldUnderConstruction[fieldConstants.TABLE_ID] = tableId;
                    return this;
                },

                withBuiltIn :  function(isBuiltIn) {
                    fieldUnderConstruction[fieldConstants.BUILT_IN] = isBuiltIn;
                    return this;
                },

                withDataIsCopyable :  function(isDataCopyable) {
                    fieldUnderConstruction[fieldConstants.DATA_IS_COPYABLE] = isDataCopyable;
                    return this;
                },

                withIncludeInQuickSearch :  function(includeInQuickSearch) {
                    fieldUnderConstruction[fieldConstants.INCLUDE_IN_QUICKSEARCH] = includeInQuickSearch;
                    return this;
                },

                withClientSideAttributes :  function(clientSideAttributes) {
                    fieldUnderConstruction[fieldConstants.CLIENT_SIDE_ATTRIBUTES] = clientSideAttributes;
                    return this;
                },

                /************************************************************/
                /*               Formula Field Properties                   */
                /************************************************************/

                withFormula :  function(formula, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].FORMULA] = formula;
                    return this;
                },

                /************************************************************/
                /*               Virtual Field Properties                   */
                /************************************************************/
                withRelationshipId :  function(relationshipId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].RELATIONSHIP_ID] = relationshipId;
                    return this;
                },

                withReferenceFieldId :  function(referenceFieldId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].REFERENCE_FIELD_ID] = referenceFieldId;
                    return this;
                },

                /************************************************************/
                /*               Concrete Field Properties                  */
                /************************************************************/

                withUserEditable :  function(isUserEditable, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].USER_EDITABLE_VALUE] = isUserEditable;
                    return this;
                },

                withRequired :  function(isRequired, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].REQUIRED] = isRequired;
                    return this;
                },

                /************************************************************/
                /*               Scalar Field Properties                    */
                /************************************************************/

                withUnique :  function(isUnique, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].UNIQUE] = isUnique;
                    return this;
                },

                withIndexed :  function(isIndexed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].INDEXED] = isIndexed;
                    return this;
                },

                withKeyField :  function(isKeyField, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].KEY_FIELD] = isKeyField;
                    return this;
                },

                withForeignKey :  function(isForeignKey, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].FOREIGN_KEY] = isForeignKey;
                    return this;
                },

                withProxyFieldId :  function(proxyFieldId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].PROXY_FIELD_ID] = proxyFieldId;
                    return this;
                },

                withDefaultValue :  function(defaultValue, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DEFAULT_VALUE] = defaultValue;
                    return this;
                },

                withMultipleChoice :  function(multipleChoice, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].MULTIPLE_CHOICE] = multipleChoice;
                    return this;
                },

                withMultipleChoiceSourceAllowed :  function(isMultipleChoiceSourceAllowed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].MULTIPLE_CHOICE_SOURCE_ALLOWED] = isMultipleChoiceSourceAllowed;
                    return this;
                },

                /************************************************************/
                /*               Specific Field Properties                  */
                /************************************************************/

                //DATE STUFF
                withShowMonthAsName :  function(showMonthAsName, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SHOW_MONTH_AS_NAME] = showMonthAsName;
                    return this;
                },

                withShowDayOfWeek :  function(showDayOfWeek, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SHOW_DAY_OF_WEEK] = showDayOfWeek;
                    return this;
                },

                withHideYearIfCurrent :  function(hideYearIfCurrent, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].HIDE_YEAR_IF_CURRENT] = hideYearIfCurrent;
                    return this;
                },

                withDateFormat :  function(dateFormat, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DATE_FORMAT] = dateFormat;
                    return this;
                },

                //DATE TIME STUFF
                withShowTime :  function(showTime, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SHOW_TIME] = showTime;
                    return this;
                },

                withShowTimeZone :  function(showTimeZone, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SHOW_TIME_ZONE] = showTimeZone;
                    return this;
                },

                withTimeZone :  function(timeZone, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].TIME_ZONE] = timeZone;
                    return this;
                },

                withSortOrderAscending :  function(sortOrderAscending, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SORT_ORDER_ASCENDING] = sortOrderAscending;
                    return this;
                },

                //DURATION STUFF
                withDurationScale :  function(durationScale, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SCALE] = durationScale;
                    return this;
                },

                //EMAIL STUFF
                withDefaultDomain :  function(defaultDomain, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DEFAULT_DOMAIN] = defaultDomain;
                    return this;
                },

                withSortByDomain :  function(sortByDomain, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SORT_BY_DOMAIN] = sortByDomain;
                    return this;
                },

                withShowEmailEveryone :  function(showEmailEveryone, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SHOW_EMAIL_EVERYONE] = showEmailEveryone;
                    return this;
                },

                //FILE ATTACHMENT STUFF
                withFileLinkText :  function(linkText, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].LINK_TEXT] = linkText;
                    return this;
                },

                withFileKeepAllRevisions :  function(keepAllRevisions, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].KEEP_ALL_REVISIONS] = keepAllRevisions;
                    return this;
                },

                withRevisionsToKeep :  function(numRevisionsToKeep, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].REVISIONS_TO_KEEP] = numRevisionsToKeep;
                    return this;
                },

                withAllowUsersToMakeOlderVersionCurrentVersion :  function(allowUsersToMakeOlderVersionCurrentVersion, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION] = allowUsersToMakeOlderVersionCurrentVersion;
                    return this;
                },

                //NUMERIC STUFF
                withDecimalPlaces :  function(decimalPlaces, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DECIMAL_PLACES] = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero :  function(treatNullAsZero, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].TREAT_NULL_AS_ZERO] = treatNullAsZero;
                    return this;
                },

                //PHONE NUMBER STUFF
                withIncludeExtension :  function(includeExtension, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].INCLUDE_EXTENSION] = includeExtension;
                    return this;
                },

                //REPORT LINK STUFF
                withReportLinkText :  function(linkText, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].LINK_TEXT] = linkText;
                    return this;
                },

                withLinkRelationshipId :  function(relationshipId, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].RELATIONSHIP_ID] = relationshipId;
                    return this;
                },

                withExactMatch :  function(exactMatch, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].EXACT_MATCH] = exactMatch;
                    return this;
                },

                withReportDisplayProtocol :  function(displayProtocol, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DISPLAY_PROTOCOL] = displayProtocol;
                    return this;
                },

                withMultiChoiceSourceAllowed :  function(multiChoiceSourceAllowed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].MULTI_CHOICE_SOURCE_ALLOWED] = multiChoiceSourceAllowed;
                    return this;
                },

                //SUMMARY FIELD STUFF
                withAggregateFunction :  function(aggregateFunction, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].AGGREGATE_FUNCTION] = aggregateFunction;
                    return this;
                },

                withSummaryDecimalPlaces :  function(decimalPlaces, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DECIMAL_PLACES] = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero :  function(treatNullAsZero, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].TREAT_NULL_AS_ZERO] = treatNullAsZero;
                    return this;
                },

                withExpression :  function(expression, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].EXPRESSION] = expression;
                    return this;
                },

                //TEXT STUFF
                withHtmlAllowed :  function(htmlAllowed, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].HTML_ALLOWED] = htmlAllowed;
                    return this;
                },

                //TIME OF DAY STUFF
                withTimeScale :  function(scale, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SCALE] = scale;
                    return this;
                },

                withUse24HourClock :  function(use24HourClock, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].USE_24_HOUR_CLOCK] = use24HourClock;
                    return this;
                },

                withUseTimezone :  function(useTimezone, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].USE_TIMEZONE] = useTimezone;
                    return this;
                },

                //URL STUFF
                withUrlDisplayProtocol :  function(displayProtocol, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].DISPLAY_PROTOCOL] = displayProtocol;
                    return this;
                },

                withUrlLinkText :  function(linkText, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].LINK_TEXT] = linkText;
                    return this;
                },

                //USER STUFF
                withSendInvitesToUsers :  function(sendInvitesToUsers, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].SEND_INVITES_TO_USERS] = sendInvitesToUsers;
                    return this;
                },

                withUserDisplayFormat : function(userDisplayFormat, fieldType) {
                    fieldUnderConstruction[fieldConstants[fieldType].USER_DISPLAY_FORMAT] = userDisplayFormat;
                    return this;
                }
            };
        }

    };

}());