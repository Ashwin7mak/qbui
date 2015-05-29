/**
 * field.generator.js will generate valid json for a particular field of a particular type. It leverages the builder pattern
 * to allow the caller to set various properties on the field
 * Created by cschneider1 on 5/28/15.
 */
(function () {
    'use strict';
    var consts = require('../server/api/quickbase/constants');
    var fieldConstants = require('./field.constants');
    var fieldDefaultConstants = require('./field.schema.defaults.js');

    //Generate a json field blob based on field type


    /************************************************************/
    /*                      Field Properties                    */
    /************************************************************/

    function withId(id, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.ID =  id;
        return fieldUnderConstruction;
    }

    function withName(name, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.NAME =  name;
        return fieldUnderConstruction;
    }

    function withType(type, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.TYPE =  type;
        return fieldUnderConstruction;
    }

    function withTableId(tableId, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.TABLE_ID =  tableId;
        return fieldUnderConstruction;
    }

    function withBuiltIn(isBuiltIn, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.BUILT_IN =  isBuiltIn;
        return fieldUnderConstruction;
    }

    function withDataIsCopyable(isDataCopyable, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.DATA_IS_COPYABLE =  isDataCopyable;
        return fieldUnderConstruction;
    }

    function withIncludeInQuickSearch(includeInQuickSearch , fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.INCLUDE_IN_QUICKSEARCH =  includeInQuickSearch;
        return fieldUnderConstruction;
    }

    function withClientSideAttributes(clientSideAttributes , fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fieldKeys.CLIENT_SIDE_ATTRIBUTES =  clientSideAttributes;
        return fieldUnderConstruction;
    }

    /************************************************************/
    /*               Formula Field Properties                   */
    /************************************************************/

    function withFormula(formula , fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.formulaFieldKeys.FORMULA =  formula;
        return fieldUnderConstruction;
    }

    /************************************************************/
    /*               Virtual Field Properties                   */
    /************************************************************/
    function withRelationshipId(relationshipId, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.virtualFieldKeys.RELATIONSHIP_ID =  relationshipId;
        return fieldUnderConstruction;
    }

    function withReferenceFieldId(referenceFieldId, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.virtualFieldKeys.REFERENCE_FIELD_ID =  referenceFieldId;
        return fieldUnderConstruction;
    }

    /************************************************************/
    /*               Concrete Field Properties                  */
    /************************************************************/

    function withUserEditable(isUserEditable, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.concreteFieldKeys.USER_EDITABLE_VALUE =  isUserEditable;
        return fieldUnderConstruction;
    }
    function withRequired(isRequired, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.concreteFieldKeys.REQUIRED =  isRequired;
        return fieldUnderConstruction;
    }

    /************************************************************/
    /*               Scalar Field Properties                    */
    /************************************************************/

    function withUnique(isUnique, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.UNIQUE =  isUnique;
        return fieldUnderConstruction;
    }

    function withIndexed(isIndexed, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.INDEXED =  isIndexed;
        return fieldUnderConstruction;
    }

    function withKeyField(isKeyField, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.KEY_FIELD =  isKeyField;
        return fieldUnderConstruction;
    }

    function withForeignKey(isForeignKey, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.FOREIGN_KEY =  isForeignKey;
        return fieldUnderConstruction;
    }

    function withProxyFieldId(proxyFieldId, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.PROXY_FIELD_ID =  proxyFieldId;
        return fieldUnderConstruction;
    }

    function withDefaultValue(defaultValue, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.DEFAULT_VALUE =  defaultValue;
        return fieldUnderConstruction;
    }

    function withMultipleChoice(multipleChoice, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.MULTIPLE_CHOICE =  multipleChoice;
        return fieldUnderConstruction;
    }

    function withMultipleChoiceSourceAllowed(isMultipleChoiceSourceAllowed, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.scalarFieldKeys.MULTIPLE_CHOICE_SOURCE_ALLOWED =  isMultipleChoiceSourceAllowed;
        return fieldUnderConstruction;
    }

    /************************************************************/
    /*               Specific Field Properties                  */
    /************************************************************/

    //DATE STUFF
    function withShowMonthAsName(showMonthAsName, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.SHOW_MONTH_AS_NAME =  showMonthAsName;
        return fieldUnderConstruction;
    }

    function withShowDayOfWeek(showDayOfWeek, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.SHOW_DAY_OF_WEEK =  showDayOfWeek;
        return fieldUnderConstruction;
    }

    function withHideYearIfCurrent(hideYearIfCurrent, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.HIDE_YEAR_IF_CURRENT =  hideYearIfCurrent;
        return fieldUnderConstruction;
    }

    function withDateFormat(dateFormat, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateAndDateFormulaFieldKeys.DATE_FORMAT =  dateFormat;
        return fieldUnderConstruction;
    }

    //DATE TIME STUFF
    function withShowTime(showTime, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME =  showTime;
        return fieldUnderConstruction;
    }

    function withShowTimeZone(showTimeZone, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE =  showTimeZone;
        return fieldUnderConstruction;
    }

    function withTimeZone(timeZone, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.TIME_ZONE =  timeZone;
        return fieldUnderConstruction;
    }

    function withSortOrderAscending(sortOrderAscending, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.dateTimeFormulaFieldKeys.SORT_ORDER_ASCENDING =  sortOrderAscending;
        return fieldUnderConstruction;
    }

    //DURATION STUFF
    function withDurationScale(durationScale, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.durationAndDurationFormulaFieldKeys.SCALE =  durationScale;
        return fieldUnderConstruction;
    }

    //EMAIL STUFF
    function withDefaultDomain(defaultDomain, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.emailAndEmailFormulaFieldKeys.DEFAULT_DOMAIN =  defaultDomain;
        return fieldUnderConstruction;
    }

    function withSortByDomain(sortByDomain, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.emailAndEmailFormulaFieldKeys.SORT_BY_DOMAIN =  sortByDomain;
        return fieldUnderConstruction;
    }

    function withShowEmailEveryone(showEmailEveryone, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.emailAndEmailFormulaFieldKeys.SHOW_EMAIL_EVERYONE =  showEmailEveryone;
        return fieldUnderConstruction;
    }

    //FILE ATTACHMENT STUFF
    function withFileLinkText(linkText, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.LINK_TEXT =  linkText;
        return fieldUnderConstruction;
    }

    function withFileKeepAllRevisions(keepAllRevisions, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.KEEP_ALL_REVISIONS =  keepAllRevisions;
        return fieldUnderConstruction;
    }

    function withRevisionsToKeep(numRevisionsToKeep, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.REVISIONS_TO_KEEP =  numRevisionsToKeep;
        return fieldUnderConstruction;
    }

    function withAllowUsersToMakeOlderVersionCurrentVersion(allowUsersToMakeOlderVersionCurrentVersion, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.fileAttachmentFieldKeys.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION =  allowUsersToMakeOlderVersionCurrentVersion;
        return fieldUnderConstruction;
    }

    //NUMERIC STUFF
    function withDecimalPlaces(decimalPlaces, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.numericAndNumericFormulaFieldKeys.DECIMAL_PLACES =  decimalPlaces;
        return fieldUnderConstruction;
    }

    function withTreatNullAsZero(treatNullAsZero, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.numericAndNumericFormulaFieldKeys.TREAT_NULL_AS_ZERO =  treatNullAsZero;
        return fieldUnderConstruction;
    }

    //PHONE NUMBER STUFF
    function withIncludeExtension(includeExtension, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.phoneNumberAndPhoneNumberFormulaFieldKeys.INCLUDE_EXTENSION =  includeExtension;
        return fieldUnderConstruction;
    }

    //REPORT LINK STUFF
    function withReportLinkText(linkText, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.LINK_TEXT =  linkText;
        return fieldUnderConstruction;
    }

    function withLinkRelationshipId(relationshipId, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.RELATIONSHIP_ID =  relationshipId;
        return fieldUnderConstruction;
    }

    function withExactMatch(exactMatch, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.EXACT_MATCH =  exactMatch;
        return fieldUnderConstruction;
    }

    function withReportDisplayProtocol(displayProtocol, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.DISPLAY_PROTOCOL =  displayProtocol;
        return fieldUnderConstruction;
    }

    function withMultiChoiceSourceAllowed(multiChoiceSourceAllowed, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.reportLinkFieldKeys.MULTI_CHOICE_SOURCE_ALLOWED =  multiChoiceSourceAllowed;
        return fieldUnderConstruction;
    }

    //SUMMARY FIELD STUFF
    function withAggregateFunction(aggregateFunction, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.summaryFieldKeys.AGGREGATE_FUNCTION =  aggregateFunction;
        return fieldUnderConstruction;
    }

    function withSummaryDecimalPlaces(decimalPlaces, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.summaryFieldKeys.DECIMAL_PLACES =  decimalPlaces;
        return fieldUnderConstruction;
    }

    function withTreatNullAsZero(treatNullAsZero, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.summaryFieldKeys.TREAT_NULL_AS_ZERO =  treatNullAsZero;
        return fieldUnderConstruction;
    }

    function withExpression(expression, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.summaryFieldKeys.EXPRESSION =  expression;
        return fieldUnderConstruction;
    }

    //TEXT STUFF
    function withHtmlAllowed(htmlAllowed, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.textAndTextFormulaFieldKeys.HTML_ALLOWED =  htmlAllowed;
        return fieldUnderConstruction;
    }

    //TIME OF DAY STUFF
    function withTimeScale(scale, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.SCALE =  scale;
        return fieldUnderConstruction;
    }

    function withUse24HourClock(use24HourClock, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.USE_24_HOUR_CLOCK =  use24HourClock;
        return fieldUnderConstruction;
    }

    function withUseTimezone(useTimezone, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.USE_TIMEZONE =  useTimezone;
        return fieldUnderConstruction;
    }

    //URL STUFF
    function withUrlDisplayProtocol(displayProtocol, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.urlAndUrlFormulaFieldKeys.DISPLAY_PROTOCOL =  displayProtocol;
        return fieldUnderConstruction;
    }

    function withUrlLinkText(linkText, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.urlAndUrlFormulaFieldKeys.LINK_TEXT =  linkText;
        return fieldUnderConstruction;
    }

    //USER STUFF
    function withSendInvitesToUsers(sendInvitesToUsers, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.userAndUserFormulaFieldKeys.SEND_INVITES_TO_USERS =  sendInvitesToUsers;
        return fieldUnderConstruction;
    }

    function withUserDisplayFormat(userDisplayFormat, fieldUnderConstruction){
        fieldUnderConstruction.fieldConstants.userAndUserFormulaFieldKeys.USER_DISPLAY_FORMAT =  userDisplayFormat;
        return fieldUnderConstruction;
    }

}());