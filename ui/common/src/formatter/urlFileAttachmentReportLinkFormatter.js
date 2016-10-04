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

                if (displayProtocol) {
                    // If display protocol is true, make sure a protocol is displayed
                    baseValue = this.addProtocol(baseValue);
                } else {
                    //If displayProtocol is false, split off the protocol, if there is one on the value
                    baseValue = this.stripProtocol(baseValue);
                }
            }
            return baseValue;
        },
        protocolRegex: new RegExp('^(.{2,5}' + SUPPORTED_PROTOCOLS.join('|') + '):?', 'i'),
        getProtocolFromUrl: function(url) {
            var protocolMatch = url.match(this.protocolRegex);
            return (protocolMatch === null ? null : protocolMatch[0].split(':')[0]);
        },
        stripProtocol: function(url) {
            return url.replace(this.protocolRegex, '');
        },
        isLikelyAFilePath(url) {
            return /^.:/.test(url);
        },
        protocolIsMissingFrom: function(url) {
            return (url === this.stripProtocol(url));
        },
        addProtocol: function(url, protocol) {
            if (!protocol) {
                protocol = (this.isLikelyAFilePath(url) ? 'file://' : 'http://');
            }

            if (this.protocolIsMissingFrom(url)) {
                url = protocol + url;
            }
            return url;
        }
    };
}());
