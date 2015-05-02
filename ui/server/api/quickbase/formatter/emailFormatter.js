/*
 Given a raw email field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the email.
 */
(function () {
    'use strict';
    //Module constants:
    var WHOLE = 'WHOLE';
    var UP_TO_UNDERSCORE = 'UP_TO_UNDERSCORE';
    var UP_TO_AT_SIGN = 'UP_TO_AT_SIGN';
    var AT_SIGN = '@';
    var UNDERSCORE = '_';
    var FORMAT_DEFAULT = WHOLE;
    var SUPPORTED_FORMATS = {};
    SUPPORTED_FORMATS[WHOLE] = true;
    SUPPORTED_FORMATS[UP_TO_UNDERSCORE] = true;
    SUPPORTED_FORMATS[UP_TO_AT_SIGN] = true;


    module.exports = {
        //Given a email string as input, formats as a email with display preferences applied.
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var baseValue = fieldValue.value;
            //Resolve the format
            var format = FORMAT_DEFAULT;
            if(fieldInfo && fieldInfo.clientSideAttributes &&
                SUPPORTED_FORMATS[fieldInfo.clientSideAttributes.format]) {
                format = fieldInfo.format;
            }
            if(format === UP_TO_AT_SIGN) {
                baseValue = baseValue.split(AT_SIGN)[0];
            } else if(format === UP_TO_UNDERSCORE) {
                baseValue = baseValue.split(UNDERSCORE)[0];
            }
            return baseValue;
        }
    };
}());