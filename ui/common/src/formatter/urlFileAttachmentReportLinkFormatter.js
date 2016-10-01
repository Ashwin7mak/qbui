/*
 Given a raw URL field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the URL instance.
 */
(function() {
    'use strict';
    //Module constants:
    //Escaped / for regex
    var PROTOCOL_SPLIT_STRING = ":\/\/";
    var SUPPORTED_PROTOCOLS = [
        PROTOCOL_SPLIT_STRING,
        'callto',
        'imessage',
        'mailto',
        'sms',
        'skype',
        'tel'
    ];
    var DISPLAY_PROTOCOL_DEFAULT = true;

    function getProtocolStringForRegex() {
        return SUPPORTED_PROTOCOLS.reduce(function(regexString, protocol, currentIndex) {
            regexString += (protocol + (currentIndex < SUPPORTED_PROTOCOLS.length ? '|' : ''));
            return regexString;
        }, '');
    }

    module.exports = {
        //Given a URL string as input, formats as a URL with display preferences applied.
        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            var baseValue = fieldValue.value;
            if (fieldInfo && fieldInfo.linkText) {
                baseValue = fieldInfo.linkText;
            } else {
                //Resolve the displayProtocol display property
                var displayProtocol = DISPLAY_PROTOCOL_DEFAULT;
                if (fieldInfo && fieldInfo.displayProtocol === false) {
                    displayProtocol = false;
                }
                //If displayProtocol is false, split off the protocol, if there is one on the value
                if (!displayProtocol) {
                    baseValue = this.stripProtocol(baseValue);
                }
            }
            return baseValue;
        },
        stripProtocol: function(url) {
            var protocolRegex = new RegExp('^(.{2,5}' + getProtocolStringForRegex() + '):?', 'i');
            return url.replace(protocolRegex, '');
        },
        protocolIsMissingFrom: function(url) {
            return (url === this.stripProtocol(url));
        },
        addProtocol: function(url, protocol) {
            protocol = (protocol ? protocol : 'http://');
            if (this.protocolIsMissingFrom(url)) {
                url = protocol + url;
            }
            return url;
        }
    };
}());
