/**
 * Here are all of the functions useful in building a field.
 * They are structured using the builder pattern
 * Created by cschneider1 on 5/31/15.
 */
(function() {
    var dataTypeConstants = require('./datatype.attributes.constants');

    //These are constants common to all fields
    module.exports = {

        builder : function(){
            var fieldUnderConstruction = {};

            return {
                build : function() {
                    return fieldUnderConstruction;
                },

                /************************************************************/
                /*              Datatype Attributes Properties              */
                /************************************************************/


                withType :  function(type) {
                    fieldUnderConstruction[dataTypeConstants.dataTypeKeys.TYPE] = type;
                    return this;
                },

                withClientSideAttributes :  function(clientSideAttributes) {
                    fieldUnderConstruction[dataTypeConstants.dataTypeKeys.CLIENT_SIDE_ATTRIBUTES] = clientSideAttributes;
                    return this;
                },

                /************************************************************/
                /*               Specific Datatype Properties               */
                /************************************************************/

                //DATE STUFF
                withShowMonthAsName :  function(showMonthAsName, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SHOW_MONTH_AS_NAME] = showMonthAsName;
                    return this;
                },

                withShowDayOfWeek :  function(showDayOfWeek, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SHOW_DAY_OF_WEEK] = showDayOfWeek;
                    return this;
                },

                withHideYearIfCurrent :  function(hideYearIfCurrent, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].HIDE_YEAR_IF_CURRENT] = hideYearIfCurrent;
                    return this;
                },

                withDateFormat :  function(dateFormat, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].DATE_FORMAT] = dateFormat;
                    return this;
                },

                //DATE TIME STUFF
                withShowTime :  function(showTime, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SHOW_TIME] = showTime;
                    return this;
                },

                withShowTimeZone :  function(showTimeZone, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SHOW_TIME_ZONE] = showTimeZone;
                    return this;
                },

                withTimeZone :  function(timeZone, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].TIME_ZONE] = timeZone;
                    return this;
                },

                withSortOrderAscending :  function(sortOrderAscending, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SORT_ORDER_ASCENDING] = sortOrderAscending;
                    return this;
                },

                //DURATION STUFF
                withDurationScale :  function(durationScale, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SCALE] = durationScale;
                    return this;
                },

                //EMAIL STUFF
                withDefaultDomain :  function(defaultDomain, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].DEFAULT_DOMAIN] = defaultDomain;
                    return this;
                },

                withSortByDomain :  function(sortByDomain, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SORT_BY_DOMAIN] = sortByDomain;
                    return this;
                },

                withShowEmailEveryone :  function(showEmailEveryone, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SHOW_EMAIL_EVERYONE] = showEmailEveryone;
                    return this;
                },

                //FILE ATTACHMENT STUFF
                withFileLinkText :  function(linkText, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].LINK_TEXT] = linkText;
                    return this;
                },

                withFileKeepAllRevisions :  function(keepAllRevisions, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].KEEP_ALL_REVISIONS] = keepAllRevisions;
                    return this;
                },

                withRevisionsToKeep :  function(numRevisionsToKeep, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].REVISIONS_TO_KEEP] = numRevisionsToKeep;
                    return this;
                },

                withAllowUsersToMakeOlderVersionCurrentVersion :  function(allowUsersToMakeOlderVersionCurrentVersion, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION] = allowUsersToMakeOlderVersionCurrentVersion;
                    return this;
                },

                //NUMERIC STUFF
                withDecimalPlaces :  function(decimalPlaces, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].DECIMAL_PLACES] = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero :  function(treatNullAsZero, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].TREAT_NULL_AS_ZERO] = treatNullAsZero;
                    return this;
                },

                //PHONE NUMBER STUFF
                withIncludeExtension :  function(includeExtension, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].INCLUDE_EXTENSION] = includeExtension;
                    return this;
                },

                //REPORT LINK STUFF
                withReportLinkText :  function(linkText, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].LINK_TEXT] = linkText;
                    return this;
                },

                withLinkRelationshipId :  function(relationshipId, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].RELATIONSHIP_ID] = relationshipId;
                    return this;
                },

                withExactMatch :  function(exactMatch, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].EXACT_MATCH] = exactMatch;
                    return this;
                },

                withReportDisplayProtocol :  function(displayProtocol, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].DISPLAY_PROTOCOL] = displayProtocol;
                    return this;
                },

                withMultiChoiceSourceAllowed :  function(multiChoiceSourceAllowed, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].MULTI_CHOICE_SOURCE_ALLOWED] = multiChoiceSourceAllowed;
                    return this;
                },

                //SUMMARY FIELD STUFF
                withAggregateFunction :  function(aggregateFunction, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].AGGREGATE_FUNCTION] = aggregateFunction;
                    return this;
                },

                withSummaryDecimalPlaces :  function(decimalPlaces, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].DECIMAL_PLACES] = decimalPlaces;
                    return this;
                },

                withTreatNullAsZero :  function(treatNullAsZero, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].TREAT_NULL_AS_ZERO] = treatNullAsZero;
                    return this;
                },

                withExpression :  function(expression, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].EXPRESSION] = expression;
                    return this;
                },

                //TEXT STUFF
                withHtmlAllowed :  function(htmlAllowed, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].HTML_ALLOWED] = htmlAllowed;
                    return this;
                },

                //TIME OF DAY STUFF
                withTimeScale :  function(scale, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SCALE] = scale;
                    return this;
                },

                withUse24HourClock :  function(use24HourClock, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].USE_24_HOUR_CLOCK] = use24HourClock;
                    return this;
                },

                withUseTimezone :  function(useTimezone, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].USE_TIMEZONE] = useTimezone;
                    return this;
                },

                //URL STUFF
                withUrlDisplayProtocol :  function(displayProtocol, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].DISPLAY_PROTOCOL] = displayProtocol;
                    return this;
                },

                withUrlLinkText :  function(linkText, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].LINK_TEXT] = linkText;
                    return this;
                },

                //USER STUFF
                withSendInvitesToUsers :  function(sendInvitesToUsers, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].SEND_INVITES_TO_USERS] = sendInvitesToUsers;
                    return this;
                },

                withUserDisplayFormat : function(userDisplayFormat, dataType) {
                    fieldUnderConstruction[dataTypeConstants[dataType].USER_DISPLAY_FORMAT] = userDisplayFormat;
                    return this;
                }
            };
        }

    };

}());