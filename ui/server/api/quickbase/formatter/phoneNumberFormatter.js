/*
 Given a raw phone number field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the phone number instance.
 */
(function () {
    'use strict';

    module.exports = {
        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var baseValue = fieldValue.value;
            if(fieldInfo && fieldInfo.includeExtension === false) {
                return baseValue.split('x')[0].trim();
            }
            return baseValue;
        }
    };
}());