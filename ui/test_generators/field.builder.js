/**
 * Here are all of the functions useful in building a field.
 * They are structured using the builder pattern
 * Created by cschneider1 on 5/31/15.
 */
(function() {
    //These are constants common to all fields
    module.exports = {
            /************************************************************/
            /*                      Field Properties                    */
            /************************************************************/

            setId : function(id, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.ID] =  id;
                return fieldUnderConstruction;
            },

            setName : function(name, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.NAME] =  name;
                return fieldUnderConstruction;
            },

            setType : function(type, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.TYPE] =  type;
                return fieldUnderConstruction;
            },

            setTableId : function(tableId, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.TABLE_ID] =  tableId;
                return fieldUnderConstruction;
            },

            setBuiltIn : function(isBuiltIn, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.BUILT_IN] =  isBuiltIn;
                return fieldUnderConstruction;
            },

            setDataIsCopyable : function(isDataCopyable, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.DATA_IS_COPYABLE] =  isDataCopyable;
                return fieldUnderConstruction;
            },

            setIncludeInQuickSearch : function(includeInQuickSearch , fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.INCLUDE_IN_QUICKSEARCH] =  includeInQuickSearch;
                return fieldUnderConstruction;
            },

            setClientSideAttributes : function(clientSideAttributes , fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fieldKeys.CLIENT_SIDE_ATTRIBUTES] =  clientSideAttributes;
                return fieldUnderConstruction;
            },

            /************************************************************/
            /*               Formula Field Properties                   */
            /************************************************************/

            setFormula : function(formula , fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.formulaFieldKeys.FORMULA] =  formula;
                return fieldUnderConstruction;
            },

            /************************************************************/
            /*               Virtual Field Properties                   */
            /************************************************************/
            setRelationshipId : function(relationshipId, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.virtualFieldKeys.RELATIONSHIP_ID] =  relationshipId;
                return fieldUnderConstruction;
            },

            setReferenceFieldId : function(referenceFieldId, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.virtualFieldKeys.REFERENCE_FIELD_ID] =  referenceFieldId;
                return fieldUnderConstruction;
            },

            /************************************************************/
            /*               Concrete Field Properties                  */
            /************************************************************/

            setUserEditable : function(isUserEditable, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.concreteFieldKeys.USER_EDITABLE_VALUE] =  isUserEditable;
                return fieldUnderConstruction;
            },
            setRequired : function(isRequired, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.concreteFieldKeys.REQUIRED] =  isRequired;
                return fieldUnderConstruction;
            },

            /************************************************************/
            /*               Scalar Field Properties                    */
            /************************************************************/

            setUnique : function(isUnique, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.UNIQUE] =  isUnique;
                return fieldUnderConstruction;
            },

            setIndexed : function(isIndexed, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.INDEXED] =  isIndexed;
                return fieldUnderConstruction;
            },

            setKeyField : function(isKeyField, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.KEY_FIELD] =  isKeyField;
                return fieldUnderConstruction;
            },

            setForeignKey : function(isForeignKey, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.FOREIGN_KEY] =  isForeignKey;
                return fieldUnderConstruction;
            },

            setProxyFieldId : function(proxyFieldId, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.PROXY_FIELD_ID] =  proxyFieldId;
                return fieldUnderConstruction;
            },

            setDefaultValue : function(defaultValue, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.DEFAULT_VALUE] =  defaultValue;
                return fieldUnderConstruction;
            },

            setMultipleChoice : function(multipleChoice, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.MULTIPLE_CHOICE] =  multipleChoice;
                return fieldUnderConstruction;
            },

            setMultipleChoiceSourceAllowed : function(isMultipleChoiceSourceAllowed, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.scalarFieldKeys.MULTIPLE_CHOICE_SOURCE_ALLOWED] =  isMultipleChoiceSourceAllowed;
                return fieldUnderConstruction;
            },

            /************************************************************/
            /*               Specific Field Properties                  */
            /************************************************************/

            //DATE STUFF
            setShowMonthAsName : function(showMonthAsName, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateAndDateFormulaFieldKeys.SHOW_MONTH_AS_NAME] =  showMonthAsName;
                return fieldUnderConstruction;
            },

            setShowDayOfWeek : function(showDayOfWeek, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateAndDateFormulaFieldKeys.SHOW_DAY_OF_WEEK] =  showDayOfWeek;
                return fieldUnderConstruction;
            },

            setHideYearIfCurrent : function(hideYearIfCurrent, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateAndDateFormulaFieldKeys.HIDE_YEAR_IF_CURRENT] =  hideYearIfCurrent;
                return fieldUnderConstruction;
            },

            setDateFormat : function(dateFormat, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateAndDateFormulaFieldKeys.DATE_FORMAT] =  dateFormat;
                return fieldUnderConstruction;
            },

            //DATE TIME STUFF
            setShowTime : function(showTime, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME] =  showTime;
                return fieldUnderConstruction;
            },

            setShowTimeZone : function(showTimeZone, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.SHOW_TIME_ZONE] =  showTimeZone;
                return fieldUnderConstruction;
            },

            setTimeZone : function(timeZone, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateTimeAndDateTimeFormulatFieldKeys.TIME_ZONE] =  timeZone;
                return fieldUnderConstruction;
            },

            setSortOrderAscending : function(sortOrderAscending, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.dateTimeFormulaFieldKeys.SORT_ORDER_ASCENDING] =  sortOrderAscending;
                return fieldUnderConstruction;
            },

            //DURATION STUFF
            setDurationScale : function(durationScale, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.durationAndDurationFormulaFieldKeys.SCALE] =  durationScale;
                return fieldUnderConstruction;
            },

            //EMAIL STUFF
            setDefaultDomain : function(defaultDomain, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.emailAndEmailFormulaFieldKeys.DEFAULT_DOMAIN] =  defaultDomain;
                return fieldUnderConstruction;
            },

            setSortByDomain : function(sortByDomain, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.emailAndEmailFormulaFieldKeys.SORT_BY_DOMAIN] =  sortByDomain;
                return fieldUnderConstruction;
            },

            setShowEmailEveryone : function(showEmailEveryone, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.emailAndEmailFormulaFieldKeys.SHOW_EMAIL_EVERYONE] =  showEmailEveryone;
                return fieldUnderConstruction;
            },

            //FILE ATTACHMENT STUFF
            setFileLinkText : function(linkText, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fileAttachmentFieldKeys.LINK_TEXT] =  linkText;
                return fieldUnderConstruction;
            },

            setFileKeepAllRevisions : function(keepAllRevisions, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fileAttachmentFieldKeys.KEEP_ALL_REVISIONS] =  keepAllRevisions;
                return fieldUnderConstruction;
            },

            setRevisionsToKeep : function(numRevisionsToKeep, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fileAttachmentFieldKeys.REVISIONS_TO_KEEP] =  numRevisionsToKeep;
                return fieldUnderConstruction;
            },

            setAllowUsersToMakeOlderVersionCurrentVersion : function(allowUsersToMakeOlderVersionCurrentVersion, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.fileAttachmentFieldKeys.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION] =  allowUsersToMakeOlderVersionCurrentVersion;
                return fieldUnderConstruction;
            },

            //NUMERIC STUFF
            setDecimalPlaces : function(decimalPlaces, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.numericAndNumericFormulaFieldKeys.DECIMAL_PLACES] =  decimalPlaces;
                return fieldUnderConstruction;
            },

            setTreatNullAsZero : function(treatNullAsZero, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.numericAndNumericFormulaFieldKeys.TREAT_NULL_AS_ZERO] =  treatNullAsZero;
                return fieldUnderConstruction;
            },

            //PHONE NUMBER STUFF
            setIncludeExtension : function(includeExtension, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.phoneNumberAndPhoneNumberFormulaFieldKeys.INCLUDE_EXTENSION] =  includeExtension;
                return fieldUnderConstruction;
            },

            //REPORT LINK STUFF
            setReportLinkText : function(linkText, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.reportLinkFieldKeys.LINK_TEXT] =  linkText;
                return fieldUnderConstruction;
            },

            setLinkRelationshipId : function(relationshipId, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.reportLinkFieldKeys.RELATIONSHIP_ID] =  relationshipId;
                return fieldUnderConstruction;
            },

            setExactMatch : function(exactMatch, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.reportLinkFieldKeys.EXACT_MATCH] =  exactMatch;
                return fieldUnderConstruction;
            },

            setReportDisplayProtocol : function(displayProtocol, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.reportLinkFieldKeys.DISPLAY_PROTOCOL] =  displayProtocol;
                return fieldUnderConstruction;
            },

            setMultiChoiceSourceAllowed : function(multiChoiceSourceAllowed, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.reportLinkFieldKeys.MULTI_CHOICE_SOURCE_ALLOWED] =  multiChoiceSourceAllowed;
                return fieldUnderConstruction;
            },

            //SUMMARY FIELD STUFF
            setAggregateFunction : function(aggregateFunction, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.summaryFieldKeys.AGGREGATE_FUNCTION] =  aggregateFunction;
                return fieldUnderConstruction;
            },

            setSummaryDecimalPlaces : function(decimalPlaces, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.summaryFieldKeys.DECIMAL_PLACES] =  decimalPlaces;
                return fieldUnderConstruction;
            },

            setTreatNullAsZero : function(treatNullAsZero, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.summaryFieldKeys.TREAT_NULL_AS_ZERO] =  treatNullAsZero;
                return fieldUnderConstruction;
            },

            setExpression : function(expression, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.summaryFieldKeys.EXPRESSION] =  expression;
                return fieldUnderConstruction;
            },

            //TEXT STUFF
            setHtmlAllowed : function(htmlAllowed, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.textAndTextFormulaFieldKeys.HTML_ALLOWED] =  htmlAllowed;
                return fieldUnderConstruction;
            },

            //TIME OF DAY STUFF
            setTimeScale : function(scale, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.SCALE] =  scale;
                return fieldUnderConstruction;
            },

            setUse24HourClock : function(use24HourClock, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.USE_24_HOUR_CLOCK] =  use24HourClock;
                return fieldUnderConstruction;
            },

            setUseTimezone : function(useTimezone, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.timeOfDayAndTimeOfDayFormulaFieldKeys.USE_TIMEZONE] =  useTimezone;
                return fieldUnderConstruction;
            },

            //URL STUFF
            setUrlDisplayProtocol : function(displayProtocol, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.urlAndUrlFormulaFieldKeys.DISPLAY_PROTOCOL] =  displayProtocol;
                return fieldUnderConstruction;
            },

            setUrlLinkText : function(linkText, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.urlAndUrlFormulaFieldKeys.LINK_TEXT] =  linkText;
                return fieldUnderConstruction;
            },

            //USER STUFF
            setSendInvitesToUsers : function(sendInvitesToUsers, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.userAndUserFormulaFieldKeys.SEND_INVITES_TO_USERS] =  sendInvitesToUsers;
                return fieldUnderConstruction;
            },

            setUserDisplayFormat : function(userDisplayFormat, fieldUnderConstruction){
                fieldUnderConstruction[fieldConstants.userAndUserFormulaFieldKeys.USER_DISPLAY_FORMAT] =  userDisplayFormat;
                return fieldUnderConstruction;
            }
        };

}());