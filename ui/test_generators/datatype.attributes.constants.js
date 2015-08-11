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
        dataTypeKeys: {
            TYPE                  : 'type',
            CLIENT_SIDE_ATTRIBUTES: 'clientSideAttributes',
        },

        availableDataTypes: [
            consts.CHECKBOX,
            consts.TEXT,
            consts.BIGTEXT,
            consts.PHONE_NUMBER,
            consts.DATE_TIME,
            consts.DATE,
            consts.DURATION,
            consts.TIME_OF_DAY,
            consts.NUMERIC,
            consts.CURRENCY,
            consts.RATING,
            consts.PERCENT,
            consts.URL,
            consts.EMAIL_ADDRESS,
            consts.USER,
            consts.FILE_ATTACHMENT],

        /******************************************************************/
        /*                  FIELD JSON KEYS                               */
        /******************************************************************/
        CHECKBOX       : {
            dataTypeKeys: addCheckboxHierarchy({}),
            types       : addJsonTypeCheckboxHierarchy({})
        },
        TEXT           : {
            dataTypeKeys: addTextHierarchy({}),
            types       : addJsonTypeTextHierarchy({})
        },
        BIGTEXT        : {
            dataTypeKeys: addTextHierarchy({}),
            types       : addJsonTypeTextHierarchy({})
        },
        PHONE_NUMBER   : {
            dataTypeKeys: addPhoneNumberHierarchy({}),
            types       : addJsonTypePhoneNumberHierarchy({})
        },
        DATE_TIME      : {
            dataTypeKeys: addDateTimeHierarchy({}),
            types       : addJsonTypeDateTimeHierarchy({})
        },
        DATE           : {
            dataTypeKeys: addDateHierarchy({}),
            types       : addJsonTypeDateHierarchy({})
        },
        DURATION       : {
            dataTypeKeys: addDurationHierarchy({}),
            types       : addJsonTypeDurationHierarchy({})
        },
        TIME_OF_DAY    : {
            dataTypeKeys: addTimeOfDayHierarchy({}),
            types       : addJsonTypeTimeOfDayHierarchy({})
        },
        NUMERIC        : {
            dataTypeKeys: addNumericHierarchy({}),
            types       : addJsonTypeNumericHierarchy({})
        },
        CURRENCY       : {
            dataTypeKeys: addNumericHierarchy({}),
            types       : addJsonTypeNumericHierarchy({})
        },
        RATING         : {
            dataTypeKeys: addNumericHierarchy({}),
            types       : addJsonTypeNumericHierarchy({})
        },
        PERCENT        : {
            dataTypeKeys: addNumericHierarchy({}),
            types       : addJsonTypeNumericHierarchy({})
        },
        URL            : {
            dataTypeKeys: addUrlHierarchy({}),
            types       : addJsonTypeUrlHierarchy({})
        },
        EMAIL_ADDRESS  : {
            dataTypeKeys: addEmailHierarchy({}),
            types       : addJsonTypeEmailHierarchy({})
        },
        USER           : {
            dataTypeKeys: addUserHierarchy({}),
            types       : addJsonTypeUserHierarchy({})
        },
        FILE_ATTACHMENT: {
            dataTypeKeys: addFileAttachmentHierarchy({}),
            types       : addJsonTypeFileAttachmentHierarchy({})
        }
    });

    /*******************************************************************************************/
    /*                         IMPOSE FIELD HIERARCHY ON JSON PROPERTIES                       */
    /*******************************************************************************************/
    /**
     * Add all of the common field keys to a map
     */
    function addDataTypeAttributeKeys(mapToModify) {
        mapToModify.TYPE = 'type';
        mapToModify.CLIENT_SIDE_ATTRIBUTES = 'clientSideAttributes';
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
     * Add the formula hierarch and the numeric keys to the map
     * @param mapToModify
     */
    function addCheckboxHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarch and the numeric keys to the map
     * @param mapToModify
     */
    function addNumericHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
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
        addDataTypeAttributeKeys(mapToModify);
        addDateKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add all date time formula keys to the map
     */
    function addDateTimeHierarchy(mapToModify) {
        addDateHierarchy(mapToModify);
        addDateTimeKeys(mapToModify)
        mapToModify.SORT_ORDER_ASCENDING = 'sortOrderAscending';

    }

    /**
     * Add the date time formula hierarchy and the time of day keys to the map
     * @param mapToModify
     */
    function addTimeOfDayHierarchy(mapToModify) {
        addDateTimeHierarchy(mapToModify);
        addTimeOfDayKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the email keys to the map
     * @param mapToModify
     */
    function addEmailHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
        addEmailKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and phone number keys to the map
     * @param mapToModify
     */
    function addPhoneNumberHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
        addPhoneNumberKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and text keys to the map
     * @param mapToModify
     */
    function addTextHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
        addTextKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add Url hierarchy to the map
     * @param mapToModify
     */
    function addUrlHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
        addUrlKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the user formula hierarchy to the map
     */
    function addUserHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify);
        addUserKeys(mapToModify);
        return mapToModify;
    }

    /**
     * Add the concrete hierarchy and the file attachment keys to the map
     * @param mapToModify
     */
    function addFileAttachmentHierarchy(mapToModify) {
        addDataTypeAttributeKeys(mapToModify)
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
        mapToModify.TYPE = 'string';
        mapToModify.CLIENT_SIDE_ATTRIBUTES = 'object'
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
     * Add the formula hierarch and the numeric JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeCheckboxHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarch and the numeric JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeNumericHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
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
        addFieldJsonTypes(mapToModify);
        addDateJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add all date time formula JsonTypes to the map
     */
    function addJsonTypeDateTimeHierarchy(mapToModify) {
        addJsonTypeDateHierarchy(mapToModify);
        addDateTimeJsonTypes(mapToModify)
        mapToModify.SORT_ORDER_ASCENDING = 'sortOrderAscending';

    }

    /**
     * Add the date time formula hierarchy and the time of day JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeTimeOfDayHierarchy(mapToModify) {
        addJsonTypeDateTimeHierarchy(mapToModify);
        addTimeOfDayJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the formula hierarchy and the email JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeEmailHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addEmailJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and phone number JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypePhoneNumberHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addPhoneNumberJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add formula hierarchy and text JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeTextHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addTextJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add Url hierarchy to the map
     * @param mapToModify
     */
    function addJsonTypeUrlHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addUrlJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the user formula hierarchy to the map
     */
    function addJsonTypeUserHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify);
        addUserJsonTypes(mapToModify);
        return mapToModify;
    }

    /**
     * Add the concrete hierarchy and the file attachment JsonTypes to the map
     * @param mapToModify
     */
    function addJsonTypeFileAttachmentHierarchy(mapToModify) {
        addFieldJsonTypes(mapToModify)
        addFileAttachmentJsonTypes(mapToModify);
        return mapToModify;
    }
}());
