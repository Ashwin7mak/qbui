/**
 * field.constants.js holds all constants associated with field types throughout the entire hierarchy
 * divided by hierarchy
 * Created by cschneider1 on 5/29/15.
 */
(function() {
    var consts = require('../server/api/constants');


    //These are constants common to all fields
    module.exports = Object.freeze({
        //Field property names common to all fields
        fieldKeys: {
            ID                    : 'id',
            NAME                  : 'name',
            TYPE                  : 'type',
            TABLE_ID              : 'tableId',
            BUILT_IN              : 'builtIn',
            DATA_IS_COPYABLE      : 'dataIsCopyable',
            INCLUDE_IN_QUICKSEARCH: 'includeInQuickSearch',
            CLIENT_SIDE_ATTRIBUTES: 'clientSideAttributes',
        },
        /******************************************************************/
        /*            FIELD TYPES AVAILABLE FOR USE IN TABLES             */
        /******************************************************************/
        availableFieldTypes: [
            consts.CHECKBOX,
            consts.TEXT,
            consts.MULTI_LINE_TEXT,
            consts.BIGTEXT,
            consts.PHONE_NUMBER,
            consts.DATE_TIME,
            consts.FORMULA_DATE_TIME,
            consts.DATE,
            consts.DURATION,
            consts.FORMULA_DURATION,
            consts.FORMULA_DATE,
            consts.FORMULA_TIME_OF_DAY,
            consts.TIME_OF_DAY,
            consts.NUMERIC,
            consts.FORMULA_NUMERIC,
            consts.CURRENCY,
            consts.RATING,
            consts.FORMULA_CURRENCY,
            consts.PERCENT,
            consts.FORMULA_PERCENT,
            consts.URL,
            consts.EMAIL_ADDRESS,
            consts.USER,
            consts.FORMULA_USER,
            consts.FILE_ATTACHMENT,
            consts.REPORT_LINK,
            consts.SUMMARY,
            consts.LOOKUP,
            consts.FORMULA_PHONE_NUMBER,
            consts.FORMULA_URL,
            consts.FORMULA_CHECKBOX,
            consts.FORMULA_TEXT,
            consts.FORMULA_EMAIL_ADDRESS],

        /******************************************************************/
        /*                  FIELD JSON KEYS                               */
        /******************************************************************/
        CHECKBOX: {
            fieldKeys: addScalarHierarchy({}),
            types: addJsonTypeScalarHierarchy({})
        },
        TEXT: {
            fieldKeys: addTextHierarchy({}),
            types: addJsonTypeTextHierarchy({})
        },
        MULTI_LINE_TEXT: {
            fieldKeys: addTextHierarchy({}),
            types: addJsonTypeTextHierarchy({})
        },
        BIGTEXT: {
            fieldKeys: addTextHierarchy({}),
            types: addJsonTypeTextHierarchy({})
        },
        PHONE_NUMBER: {
            fieldKeys: addPhoneNumberHierarchy({}),
            types: addJsonTypePhoneNumberHierarchy({})
        },
        DATE_TIME: {
            fieldKeys: addDateTimeHierarchy({}),
            types: addJsonTypeDateTimeHierarchy({})
        },
        FORMULA_DATE_TIME: {
            fieldKeys: addDateTimeFormulaHierarchy({}),
            types: addJsonTypeDateTimeFormulaHierarchy({})
        },
        DATE: {
            fieldKeys: addDateHierarchy({}),
            types: addJsonTypeDateHierarchy({})
        },
        DURATION: {
            fieldKeys: addDurationHierarchy({}),
            types: addJsonTypeDurationHierarchy({})
        },
        FORMULA_DURATION: {
            fieldKeys: addDurationFormulaHierarchy({}),
            types: addJsonTypeDurationFormulaHierarchy({})
        },
        FORMULA_DATE: {
            fieldKeys: addDateFormulaHierarchy({}),
            types: addJsonTypeDateFormulaHierarchy({})
        },
        FORMULA_TIME_OF_DAY: {
            fieldKeys: addTimeOfDayFormulaHierarchy({}),
            types: addJsonTypeTimeOfDayFormulaHierarchy({})
        },
        TIME_OF_DAY: {
            fieldKeys: addTimeOfDayHierarchy({}),
            types: addJsonTypeTimeOfDayHierarchy({})
        },
        NUMERIC: {
            fieldKeys: addNumericHierarchy({}),
            types: addJsonTypeNumericHierarchy({})
        },
        FORMULA_NUMERIC: {
            fieldKeys: addNumericFormulaHierarchy({}),
            types: addJsonTypeNumericFormulaHierarchy({})
        },
        CURRENCY: {
            fieldKeys: addNumericHierarchy({}),
            types: addJsonTypeNumericHierarchy({})
        },
        RATING: {
            fieldKeys: addNumericHierarchy({}),
            types: addJsonTypeNumericHierarchy({})
        },
        FORMULA_CURRENCY: {
            fieldKeys: addNumericFormulaHierarchy({}),
            types: addJsonTypeNumericFormulaHierarchy({})
        },
        PERCENT: {
            fieldKeys: addNumericHierarchy({}),
            types: addJsonTypeNumericHierarchy({})
        },
        FORMULA_PERCENT: {
            fieldKeys: addNumericFormulaHierarchy({}),
            types: addJsonTypeNumericFormulaHierarchy({})
        },
        URL: {
            fieldKeys: addUrlHierarchy({}),
            types: addJsonTypeUrlHierarchy({})
        },
        EMAIL_ADDRESS: {
            fieldKeys: addEmailHierarchy({}),
            types: addJsonTypeEmailHierarchy({})
        },
        USER: {
            fieldKeys: addUserHierarchy({}),
            types: addJsonTypeUserHierarchy({})
        },
        FORMULA_USER: {
            fieldKeys: addUserFormulaHierarchy({}),
            types: addJsonTypeUserFormulaHierarchy({})
        },
        FILE_ATTACHMENT: {
            fieldKeys: addFileAttachmentHierarchy({}),
            types: addJsonTypeFileAttachmentHierarchy({})
        },
        REPORT_LINK: {
            fieldKeys: addReportLinkHierarchy({}),
            types: addJsonTypeReportLinkHierarchy({})
        },
        SUMMARY: {
            fieldKeys: addSummaryHierarchy({}),
            types: addJsonTypeSummaryHierarchy({})
        },
        LOOKUP: {
            fieldKeys: addVirtualHierarchy({}),
            types: addJsonTypeVirtualHierarchy({})
        },
        FORMULA_PHONE_NUMBER: {
            fieldKeys: addPhoneNumberFormulaHierarchy({}),
            types: addJsonTypePhoneNumberFormulaHierarchy({})
        },
        FORMULA_URL: {
            fieldKeys: addUrlFormulaHierarchy({}),
            types: addJsonTypeUrlFormulaHierarchy({})
        },
        FORMULA_CHECKBOX: {
            fieldKeys: addFormulaHierarchy({}),
            types: addJsonTypeFormulaHierarchy({})
        },
        FORMULA_TEXT: {
            fieldKeys: addTextFormulaHierarchy({}),
            types: addJsonTypeTextFormulaHierarchy({})
        },
        FORMULA_EMAIL_ADDRESS: {
            fieldKeys: addEmailFormulaHierarchy({}),
            types: addJsonTypeEmailFormulaHierarchy({})
        }
    });

    /*******************************************************************************************/
    /*                         IMPOSE FIELD HIERARCHY ON JSON PROPERTIES                       */
    /*******************************************************************************************/
    /**
     * Add all of the common field keys to a map
     */
    function addFieldKeys(mapToModify) {
        mapToModify.ID = 'id';
        mapToModify.NAME = 'name';
        mapToModify.TYPE = 'type';
        mapToModify.TABLE_ID = 'tableId';
        mapToModify.BUILT_IN = 'builtIn';
        mapToModify.DATA_IS_COPYABLE = 'dataIsCopyable';
        mapToModify.INCLUDE_IN_QUICKSEARCH = 'includeInQuickSearch';
        mapToModify.CLIENT_SIDE_ATTRIBUTES = 'clientSideAttributes';
    }

    function addFormulaKeys(mapToModify) {
        mapToModify.FORMULA = 'formula';
    }

    function addVirtualKeys(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'relationshipId';
        mapToModify.REFERENCE_FIELD_ID = 'referenceFieldId';
    }

    /**
     * Add all of the concrete field keys to a map
     */
    function addConcreteKeys(mapToModify) {
        addFieldKeys(mapToModify);
        mapToModify.USER_EDITABLE_VALUE = 'userEditableValue';
        mapToModify.REQUIRED = 'required';
    }

    /**
     * Add all of the concrete field keys to a map
     */
    function addScalarKeys(mapToModify) {
        mapToModify.UNIQUE = 'unique';
        mapToModify.INDEXED = 'indexed';
        mapToModify.KEY_FIELD = 'keyField';
        mapToModify.FOREIGN_KEY = 'foreignKey';
        mapToModify.PROXY_FIELD_ID = 'proxyFieldId';
        mapToModify.DEFAULT_VALUE = 'defaultValue';
        mapToModify.MULTIPLE_CHOICE = 'multipleChoice';
        mapToModify.MULTIPLE_CHOICE_SOURCE_ALLOWED = 'multipleChoiceSourceAllowed';
    }

    /**
     * Add all of the concrete field keys to a map
     */
    function addNumericKeys(mapToModify) {
        mapToModify.DECIMAL_PLACES = 'decimalPlaces';
        mapToModify.TREAT_NULL_AS_ZERO = 'treatNullAsZero';
    }

    /**
     * Add all date keys to the mapToModify
     * @param mapToModify
     */
    function addDateKeys(mapToModify) {
        mapToModify.SHOW_MONTH_AS_NAME = 'showMonthAsName';
        mapToModify.SHOW_DAY_OF_WEEK = 'showDayOfWeek';
        mapToModify.HIDE_YEAR_IF_CURRENT = 'hideYearIfCurrent';
        mapToModify.DATE_FORMAT = 'dateFormat';
    }

    /**
     * Add all date time keys to the map
     * @param mapToModify
     */
    function addDateTimeKeys(mapToModify) {
        mapToModify.SHOW_TIME = 'showTime';
        mapToModify.SHOW_TIME_ZONE = 'showTimeZone';
        mapToModify.TIME_ZONE = 'timeZone';
    }

    /**
     * Add all duration specific keys to the map
     * @param mapToModify
     */
    function addDurationKeys(mapToModify) {
        mapToModify.SCALE = 'scale';
    }

    /**
     * Add all email address specific keys to the map
     * @param mapToModify
     */
    function addEmailKeys(mapToModify) {
        mapToModify.DEFAULT_DOMAIN = 'defaultDomain';
        mapToModify.SORT_BY_DOMAIN = 'sortByDomain';
        mapToModify.SHOW_EMAIL_EVERYONE = 'showEmailEveryone';
    }

    /**
     * Add all file attachment specific keys to the map
     * @param mapToModify
     */
    function addFileAttachmentKeys(mapToModify) {
        mapToModify.LINK_TEXT = 'linkText';
        mapToModify.KEEP_ALL_REVISIONS = 'keepAllRevisions';
        mapToModify.REVISIONS_TO_KEEP = 'revisionToKeep';
        mapToModify.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION = 'allowUsersToMakeOlderVersionsTheCurrentVersion';
    }

    /**
     * Add all phone number specific keys to the map
     * @param mapToModify
     */
    function addPhoneNumberKeys(mapToModify) {
        mapToModify.INCLUDE_EXTENSION = 'includeExtension';
    }

    /**
     * Add all report link specific keys to the map
     * @param mapToModify
     */
    function addReportLinkKeys(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'relationshipId';
        mapToModify.DISPLAY_PROTOCOL = 'displayProtocol';
        mapToModify.LINK_TEXT = 'linkText';
        mapToModify.EXACT_MATCH = 'exactMatch';
        mapToModify.MULTI_CHOICE_SOURCE_ALLOWED = 'multiChoiceSourceAllowed';
    }

    /**
     * Add all summary field specific keys to the map
     * @param mapToModify
     */
    function addSummaryKeys(mapToModify) {
        mapToModify.AGGREGATE_FUNCTION = 'aggregateFunction';
        mapToModify.DECIMAL_PLACES = 'decimalPlaces';
        mapToModify.TREAT_NULL_AS_ZERO = 'treatNullAsZero';
        mapToModify.EXPRESSION = 'expression';
    }

    /**
     * Add all text field specific keys to the map
     */
    function addTextKeys(mapToModify) {
        mapToModify.HTML_ALLOWED = 'htmlAllowed';
    }

    /**
     * Add all time of day keys to the map
     * @param mapToModify
     */
    function addTimeOfDayKeys(mapToModify) {
        mapToModify.SCALE = 'scale';
        mapToModify.USE_24_HOUR_CLOCK = 'use24HourClock';
        mapToModify.USE_TIMEZONE = 'useTimezone';
    }

    /**
     * Add all url keys to the map
     * @param mapToModify
     */
    function addUrlKeys(mapToModify) {
        mapToModify.DISPLAY_PROTOCOL = 'displayProtocol';
        mapToModify.LINK_TEXT = 'linkText';
    }

    function addUserKeys(mapToModify) {
        mapToModify.SEND_INVITES_TO_USERS = 'sendInvitesToUsers';
        mapToModify.USER_DISPLAY_FORMAT = 'userDisplayFormat';
    }

    /**
     * Add field and formula keys to the map
     * @param mapToModify
     */
    function addFormulaHierarchy(mapToModify) {
        addFieldKeys(mapToModify);
        addFormulaKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarch and the numeric keys to the map
     * @param mapToModify
     */
    function addNumericFormulaHierarchy(mapToModify) {
        addFormulaHierarchy(mapToModify);
        addNumericKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the numeric hierarchy and the duration keys to the map
     * @param mapToModify
     */
    function addDurationFormulaHierarchy(mapToModify) {
        addNumericFormulaHierarchy(mapToModify);
        addDurationKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the date keys to the map
     * @param mapToModify
     */
    function addDateFormulaHierarchy(mapToModify) {
        addFormulaHierarchy(mapToModify);
        addDateKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add all date time formula keys to the map
     */
    function addDateTimeFormulaHierarchy(mapToModify){
        addDateFormulaHierarchy(mapToModify);
        addDateTimeKeys(mapToModify)
        mapToModify.SORT_ORDER_ASCENDING = 'sortOrderAscending';
        return mapToModify;

    }

    /**
     * Add the date time formula hierarchy and the time of day keys to the map
     * @param mapToModify
     */
    function addTimeOfDayFormulaHierarchy(mapToModify){
        addDateTimeFormulaHierarchy(mapToModify);
        addTimeOfDayKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the email keys to the map
     * @param mapToModify
     */
    function addEmailFormulaHierarchy(mapToModify){
        addFormulaHierarchy(mapToModify);
        addEmailKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and phone number keys to the map
     * @param mapToModify
     */
    function addPhoneNumberFormulaHierarchy(mapToModify){
        addFormulaHierarchy(mapToModify);
        addPhoneNumberKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and text keys to the map
     * @param mapToModify
     */
    function addTextFormulaHierarchy(mapToModify){
        addFormulaHierarchy(mapToModify);
        addTextKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add UrlFormula hierarchy to the map
     * @param mapToModify
     */
    function addUrlFormulaHierarchy(mapToModify){
        addFormulaHierarchy(mapToModify);
        addUrlKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the user formula hierarchy to the map
     */
    function addUserFormulaHierarchy(mapToModify){
        addFormulaHierarchy(mapToModify);
        addUserKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add field keys and concrete keys to the map
     * @param mapToModify
     */
    function addConcreteHierarchy(mapToModify){
        addFieldKeys(mapToModify);
        addConcreteKeys(mapToModify);
        return mapToModify;
    }

    /**
     * add the concrete hierarchy and the scalar keys to the map
     * @param mapToModify
     */
    function addScalarHierarchy(mapToModify){
        addConcreteHierarchy(mapToModify);
        addScalarKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarch and the numeric keys to the map
     * @param mapToModify
     */
    function addNumericHierarchy(mapToModify) {
        addScalarHierarchy(mapToModify);
        addNumericKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the numeric hierarchy and the duration keys to the map
     * @param mapToModify
     */
    function addDurationHierarchy(mapToModify) {
        addNumericHierarchy(mapToModify);
        addDurationKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the date keys to the map
     * @param mapToModify
     */
    function addDateHierarchy(mapToModify) {
        addScalarHierarchy(mapToModify);
        addDateKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add all date time formula keys to the map
     */
    function addDateTimeHierarchy(mapToModify){
        addDateHierarchy(mapToModify);
        addDateTimeKeys(mapToModify)
        mapToModify.SORT_ORDER_ASCENDING = 'sortOrderAscending';

    }

    /**
     * Add the date time formula hierarchy and the time of day keys to the map
     * @param mapToModify
     */
    function addTimeOfDayHierarchy(mapToModify){
        addDateTimeHierarchy(mapToModify);
        addTimeOfDayKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the email keys to the map
     * @param mapToModify
     */
    function addEmailHierarchy(mapToModify){
        addScalarHierarchy(mapToModify);
        addEmailKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and phone number keys to the map
     * @param mapToModify
     */
    function addPhoneNumberHierarchy(mapToModify){
        addScalarHierarchy(mapToModify);
        addPhoneNumberKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and text keys to the map
     * @param mapToModify
     */
    function addTextHierarchy(mapToModify){
        addScalarHierarchy(mapToModify);
        addTextKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add Url hierarchy to the map
     * @param mapToModify
     */
    function addUrlHierarchy(mapToModify){
        addScalarHierarchy(mapToModify);
        addUrlKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the user formula hierarchy to the map
     */
    function addUserHierarchy(mapToModify){
        addScalarHierarchy(mapToModify);
        addUserKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add field keys and virtual field keys to the map
     */
    function addVirtualHierarchy(mapToModify){
        addFieldKeys(mapToModify);
        addVirtualKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add virtual hierarchy and the summary keys to the map
     * @param mapToModify
     */
    function addSummaryHierarchy(mapToModify){
        addVirtualHierarchy(mapToModify);
        addSummaryKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add field keys and report link keys to the map
     * @param mapToModify
     */
    function addReportLinkHierarchy(mapToModify){
        addFieldKeys(mapToModify);
        addReportLinkKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the concrete hierarchy and the file attachment keys to the map
     * @param mapToModify
     */
    function addFileAttachmentHierarchy(mapToModify){
        addConcreteHierarchy(mapToModify)
        addFileAttachmentKeys(mapToModify);
        return mapToModify;
    }

    /*******************************************************************************************/
    /*                         IMPOSE FIELD HIERARCHY ON JSON TYPE MAPPING                       */
    /*******************************************************************************************/
    /**
     * Add all of the common field JsonTypes to a map
     */
    function addFieldJsonTypes(mapToModify) {
        //Field property names
        mapToModify.ID = 'string';
        mapToModify.NAME = 'string';
        mapToModify.TYPE = 'string';
        mapToModify.TABLE_ID = 'string';
        mapToModify.BUILT_IN = 'boolean';
        mapToModify.DATA_IS_COPYABLE = 'boolean';
        mapToModify.INCLUDE_IN_QUICKSEARCH = 'boolean';
        mapToModify.CLIENT_SIDE_ATTRIBUTES = 'object'
    }

    function addFormulaJsonTypes(mapToModify) {
        mapToModify.FORMULA = 'string';
    }

    function addVirtualJsonTypes(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'string';
        mapToModify.REFERENCE_FIELD_ID = 'number';
    }

    /**
     * Add all of the concrete field JsonTypes to a map
     */
    function addConcreteJsonTypes(mapToModify) {
        addFieldJsonTypes(mapToModify);
        mapToModify.USER_EDITABLE_VALUE = 'boolean';
        mapToModify.REQUIRED = 'boolean';
    }

    /**
     * Add all of the concrete field JsonTypes to a map
     */
    function addScalarJsonTypes(mapToModify) {
        mapToModify.UNIQUE = 'boolean';
        mapToModify.INDEXED = 'boolean';
        mapToModify.KEY_FIELD = 'boolean';
        mapToModify.FOREIGN_KEY = 'boolean';
        mapToModify.PROXY_FIELD_ID = 'string';
        mapToModify.DEFAULT_VALUE = 'object';
        mapToModify.MULTIPLE_CHOICE = 'object';
        mapToModify.MULTIPLE_CHOICE_SOURCE_ALLOWED = 'boolean';
    }

    /**
     * Add all of the concrete field JsonTypes to a map
     */
    function addNumericJsonTypes(mapToModify) {
        mapToModify.DECIMAL_PLACES = 'number';
        mapToModify.TREAT_NULL_AS_ZERO = 'boolean';
    }

    /**
     * Add all date JsonTypes to the mapToModify
     * @param mapToModify
     */
    function addDateJsonTypes(mapToModify) {
        mapToModify.SHOW_MONTH_AS_NAME = 'boolean';
        mapToModify.SHOW_DAY_OF_WEEK = 'boolean';
        mapToModify.HIDE_YEAR_IF_CURRENT = 'boolean';
        mapToModify.DATE_FORMAT = 'string';
    }

    /**
     * Add all date time JsonTypes to the map
     * @param mapToModify
     */
    function addDateTimeJsonTypes(mapToModify) {
        mapToModify.SHOW_TIME = 'boolean';
        mapToModify.SHOW_TIME_ZONE = 'boolean';
        mapToModify.TIME_ZONE = 'string';
    }

    /**
     * Add all duration specific JsonTypes to the map
     * @param mapToModify
     */
    function addDurationJsonTypes(mapToModify) {
        mapToModify.SCALE = 'string';
    }

    /**
     * Add all email address specific JsonTypes to the map
     * @param mapToModify
     */
    function addEmailJsonTypes(mapToModify) {
        mapToModify.DEFAULT_DOMAIN = 'boolean';
        mapToModify.SORT_BY_DOMAIN = 'boolean';
        mapToModify.SHOW_EMAIL_EVERYONE = 'boolean';
    }

    /**
     * Add all file attachment specific JsonTypes to the map
     * @param mapToModify
     */
    function addFileAttachmentJsonTypes(mapToModify) {
        mapToModify.LINK_TEXT = 'string';
        mapToModify.KEEP_ALL_REVISIONS = 'boolean';
        mapToModify.REVISIONS_TO_KEEP = 'number';
        mapToModify.ALLOW_USERS_TO_MAKE_OLDER_VERSIONS_THE_CURRENT_VERSION = 'boolean';
    }

    /**
     * Add all phone number specific JsonTypes to the map
     * @param mapToModify
     */
    function addPhoneNumberJsonTypes(mapToModify) {
        mapToModify.INCLUDE_EXTENSION = 'boolean';
    }

    /**
     * Add all report link specific JsonTypes to the map
     * @param mapToModify
     */
    function addReportLinkJsonTypes(mapToModify) {
        mapToModify.RELATIONSHIP_ID = 'string';
        mapToModify.DISPLAY_PROTOCOL = 'boolean';
        mapToModify.LINK_TEXT = 'string';
        mapToModify.EXACT_MATCH = 'boolean';
        mapToModify.MULTI_CHOICE_SOURCE_ALLOWED = 'boolean';
    }

    /**
     * Add all summary field specific JsonTypes to the map
     * @param mapToModify
     */
    function addSummaryJsonTypes(mapToModify) {
        mapToModify.AGGREGATE_FUNCTION = 'string';
        mapToModify.DECIMAL_PLACES = 'number';
        mapToModify.TREAT_NULL_AS_ZERO = 'boolean';
        mapToModify.EXPRESSION = 'string';
    }

    /**
     * Add all text field specific JsonTypes to the map
     */
    function addTextJsonTypes(mapToModify) {
        mapToModify.HTML_ALLOWED = 'boolean';
    }

    /**
     * Add all time of day JsonTypes to the map
     * @param mapToModify
     */
    function addTimeOfDayJsonTypes(mapToModify) {
        mapToModify.SCALE = 'number';
        mapToModify.USE_24_HOUR_CLOCK = 'boolean';
        mapToModify.USE_TIMEZONE = 'boolean';
    }

    /**
     * Add all url JsonTypes to the map
     * @param mapToModify
     */
    function addUrlJsonTypes(mapToModify) {
        mapToModify.DISPLAY_PROTOCOL = 'string';
        mapToModify.LINK_TEXT = 'string';
    }

    function addUserJsonTypes(mapToModify) {
        mapToModify.SEND_INVITES_TO_USERS = 'boolean';
        mapToModify.USER_DISPLAY_FORMAT = 'string';
    }

    /**
     * Add field and formula JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeFormulaHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addFormulaJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarch and the numeric JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeNumericFormulaHierarchy(mapToModify) {
        addJsonTypeFormulaHierarchy(mapToModify);
        addNumericJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the numeric hierarchy and the duration JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeDurationFormulaHierarchy(mapToModify) {
        addJsonTypeNumericFormulaHierarchy(mapToModify);
        addDurationJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the date JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeDateFormulaHierarchy(mapToModify) {
        addJsonTypeFormulaHierarchy(mapToModify);
        addDateJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add all date time formula JsonTypes to the map
     */
    function addJsonTypeDateTimeFormulaHierarchy(mapToModify){
        addJsonTypeFormulaHierarchy(mapToModify);
        addDateTimeJsonTypes(mapToModify)
        mapToModify.SORT_ORDER_ASCENDING = 'sortOrderAscending';

    }

    /**
     * Add the date time formula hierarchy and the time of day JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeTimeOfDayFormulaHierarchy(mapToModify){
        addJsonTypeDateTimeFormulaHierarchy(mapToModify);
        addTimeOfDayJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the email JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeEmailFormulaHierarchy(mapToModify){
        addJsonTypeFormulaHierarchy(mapToModify);
        addEmailJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and phone number JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypePhoneNumberFormulaHierarchy(mapToModify){
        addJsonTypeFormulaHierarchy(mapToModify);
        addPhoneNumberJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and text JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeTextFormulaHierarchy(mapToModify){
        addJsonTypeFormulaHierarchy(mapToModify);
        addTextJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add UrlFormula hierarchy to the map
     * @param mapToModify
     */
    function addJsonTypeUrlFormulaHierarchy(mapToModify){
        addJsonTypeFormulaHierarchy(mapToModify);
        addUrlJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the user formula hierarchy to the map
     */
    function addJsonTypeUserFormulaHierarchy(mapToModify){
        addJsonTypeFormulaHierarchy(mapToModify);
        addUserJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add field JsonTypes and concrete JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeConcreteHierarchy(mapToModify){
        addFieldJsonTypes(mapToModify);
        addConcreteJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * add the concrete hierarchy and the scalar JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeScalarHierarchy(mapToModify){
        addJsonTypeConcreteHierarchy(mapToModify);
        addScalarJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarch and the numeric JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeNumericHierarchy(mapToModify) {
        addJsonTypeScalarHierarchy(mapToModify);
        addNumericJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the numeric hierarchy and the duration JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeDurationHierarchy(mapToModify) {
        addJsonTypeNumericHierarchy(mapToModify);
        addDurationJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the date JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeDateHierarchy(mapToModify) {
        addJsonTypeScalarHierarchy(mapToModify);
        addDateJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add all date time formula JsonTypes to the map
     */
    function addJsonTypeDateTimeHierarchy(mapToModify){
        addJsonTypeDateHierarchy(mapToModify);
        addDateTimeJsonTypes(mapToModify)
        mapToModify.SORT_ORDER_ASCENDING = 'sortOrderAscending';

    }

    /**
     * Add the date time formula hierarchy and the time of day JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeTimeOfDayHierarchy(mapToModify){
        addJsonTypeDateTimeHierarchy(mapToModify);
        addTimeOfDayJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the email JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeEmailHierarchy(mapToModify){
        addJsonTypeScalarHierarchy(mapToModify);
        addEmailJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and phone number JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypePhoneNumberHierarchy(mapToModify){
        addJsonTypeScalarHierarchy(mapToModify);
        addPhoneNumberJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and text JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeTextHierarchy(mapToModify){
        addJsonTypeScalarHierarchy(mapToModify);
        addTextJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add Url hierarchy to the map
     * @param mapToModify
     */
    function addJsonTypeUrlHierarchy(mapToModify){
        addJsonTypeScalarHierarchy(mapToModify);
        addUrlJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the user formula hierarchy to the map
     */
    function addJsonTypeUserHierarchy(mapToModify){
        addJsonTypeScalarHierarchy(mapToModify);
        addUserJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add field JsonTypes and virtual field JsonTypes to the map
     */
    function addJsonTypeVirtualHierarchy(mapToModify){
        addFieldJsonTypes(mapToModify);
        addVirtualJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add virtual hierarchy and the summary JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeSummaryHierarchy(mapToModify){
        addJsonTypeVirtualHierarchy(mapToModify);
        addSummaryJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add field JsonTypes and report link JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeReportLinkHierarchy(mapToModify){
        addFieldJsonTypes(mapToModify);
        addReportLinkJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the concrete hierarchy and the file attachment JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeFileAttachmentHierarchy(mapToModify){
        addJsonTypeConcreteHierarchy(mapToModify)
        addFileAttachmentJsonTypes(mapToModify);
        return mapToModify;
    }
}());
