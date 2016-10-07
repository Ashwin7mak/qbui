/*
 Given a raw email field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the email.
 */
(function() {
    'use strict';
    //Module constants:
    var WHOLE = 'WHOLE';
    var UP_TO_UNDERSCORE = 'UP_TO_UNDERSCORE';
    var UP_TO_AT_SIGN = 'UP_TO_AT_SIGN';
    var AT_SIGN = '@';
    var UNDERSCORE = '_';
    var SUPPORTED_FORMATS = {};
    SUPPORTED_FORMATS[WHOLE] = true;
    SUPPORTED_FORMATS[UP_TO_UNDERSCORE] = true;
    SUPPORTED_FORMATS[UP_TO_AT_SIGN] = true;

    function hasDomain(email) {
        return email.indexOf('@') >= 0;
    }

    module.exports = {
        addDefaultDomain: function(email, domain) {
            // Core and current stack add a domain to a blank string, so that
            // same functionality occurs here. To remove, just check if email is
            // blank before adding a default domain. `if (domain && email && !hasDomain(email)) {`
            if (domain && !hasDomain(email)) {
                email = email + '@' + domain;
            }
            return email;
        },
        //Given a email string as input, formats as a email with display preferences applied.
        format: function(fieldValue, fieldInfo) {
            if (!fieldValue || !fieldValue.value) {
                return '';
            }
            //Default behavior is to return the raw value as display
            var baseValue = fieldValue.value;
            //If there are clientSideAttributes, evaluate format & linkText attributes
            if (fieldInfo && fieldInfo.clientSideAttributes) {
                baseValue = this.addDefaultDomain(baseValue, fieldInfo.defaultDomain);

                if (fieldInfo.clientSideAttributes.linkText) {
                    //If there is a linkText set, use that
                    baseValue = fieldInfo.clientSideAttributes.linkText;
                    //Otherwise, see if there is a display format setting and use that
                } else if (fieldInfo && fieldInfo.clientSideAttributes &&
                    SUPPORTED_FORMATS[fieldInfo.clientSideAttributes.format]) {
                    //Resolve the format
                    var format = fieldInfo.clientSideAttributes.format;
                    if (format === UP_TO_AT_SIGN) {
                        baseValue = baseValue.split(AT_SIGN)[0];
                    } else if (format === UP_TO_UNDERSCORE) {
                        baseValue = baseValue.split(UNDERSCORE)[0];
                    }
                }

            }
            return baseValue;
        }
    };
}());
