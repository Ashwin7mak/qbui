/*
 Given a raw user field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the user value.
 */
(function () {
    'use strict';
    //Module constants:
    var FIRST_THEN_LAST = 'FIRST_THEN_LAST';
    var LAST_THEN_FIRST = 'LAST_THEN_FIRST';
    var SCREEN_NAME = 'SCREEN_NAME';
    var USER_ID = 'USER_ID';
    var DEFAULT_FORMAT = LAST_THEN_FIRST;
    var SUPPORTED_FORMATS = {};
    SUPPORTED_FORMATS[FIRST_THEN_LAST] = true;
    SUPPORTED_FORMATS[LAST_THEN_FIRST] = true;
    SUPPORTED_FORMATS[SCREEN_NAME] = true;
    SUPPORTED_FORMATS[USER_ID] = true;

    module.exports = {
        //Given a user string as input, formats as a email with display preferences applied.
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }

            //Parse the user object
            var baseValue = fieldValue.value;

            //Resolve display format
            var format = DEFAULT_FORMAT;
            if (fieldInfo && SUPPORTED_FORMATS[fieldInfo.userDisplayFormat]) {
                format = fieldInfo.userDisplayFormat;
            }

            //Format the results
            switch (format) {
                case FIRST_THEN_LAST:
                    baseValue = baseValue.firstName + ' ' + baseValue.lastName;
                    break;
                case LAST_THEN_FIRST:
                    baseValue = baseValue.lastName + ', ' + baseValue.firstName;
                    break;
                case SCREEN_NAME:
                    baseValue = baseValue.screenName;
                    break;
                case USER_ID:
                    baseValue = baseValue.userId;
                    break;
            }
            return baseValue;
        }
    };
}());
