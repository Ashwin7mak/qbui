/*
 Given a raw URL field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the URL instance.
 */
(function () {
    'use strict';
    //Module constants:
    var PROTOCOL_SPLIT_STRING = '://';
    var DISPLAY_PROTOCOL_DEFAULT = true;

    module.exports = {
        //Given a URL string as input, formats as a URL with display preferences applied.
        format: function (fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var baseValue = fieldValue.value;
            if(fieldInfo && fieldInfo.linkText) {
                baseValue = fieldInfo.linkText;
            } else {
                //Resolve the displayProtocol display property
                var displayProtocol = DISPLAY_PROTOCOL_DEFAULT;
                if (fieldInfo) {
                    if (fieldInfo.displayProtocol === false) {
                        displayProtocol = false;
                    }
                }
                //If displayProtocol is false, split off the protocol, if there is one on the value
                if (!displayProtocol) {
                    console.log("display protocol false, attempting to parse off the protocol");
                    var protocolIndex = baseValue.indexOf(PROTOCOL_SPLIT_STRING);
                    console.log("protocol intex: " + protocolIndex);
                    if (protocolIndex !== -1) {
                        baseValue = baseValue.slice(protocolIndex + PROTOCOL_SPLIT_STRING.length);
                    }
                }
            }
            return baseValue;
        }
    };
}());