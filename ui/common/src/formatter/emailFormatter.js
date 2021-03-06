/*
 Given a raw email field value and field meta data from the Java capabilities API, this module is capable of
 display formatting the email.
 */
(function() {
    'use strict';
    var _ = require('lodash');

    //Module constants:
    var BLANK_EMAIL = '';
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
        if (email && typeof email === 'string') {
            return email.indexOf('@') >= 0;
        } else {
            return false;
        }
    }

    module.exports = {
        addDefaultDomain: function(email, domain) {
            // If a string of emails is provided, check the domain for each email
            var emails = _.map(this.splitEmails(email), function(singleEmail) {
                // Core and current stack add a domain to a blank string, so that
                // same functionality occurs here. To remove, just check if email is
                // blank before adding a default domain. `if (domain && email && !hasDomain(email)) {`
                if (domain && !hasDomain(singleEmail)) {
                    singleEmail = singleEmail + (domain.indexOf('@') >= 0 ? domain : '@' + domain);
                }

                return singleEmail;
            });

            return emails.join(';');
        },

        /**
         * Check if a fieldValue was not passed in or does not have the required value property
         * @param fieldValue
         * @returns {boolean}
         * @private
         */
        _fieldValueDoesNotExist: function(fieldValue) {
            return (!fieldValue || !fieldValue.value);
        },

        /**
         * Given a email string as input, formats as a email with display preferences applied.
         * @param fieldValue
         * @param fieldInfo
         * @returns {String}
         */
        format: function(fieldValue, fieldInfo) {
            if  (this._fieldValueDoesNotExist(fieldValue)) {
                return BLANK_EMAIL;
            }

            //Default behavior is to return the raw value as display
            var baseValue = fieldValue.value;

            // Add a default domain if a default domain exists and a domain is not provided on the email
            baseValue = this.addDefaultDomain(baseValue, fieldInfo.defaultDomain);

            //If there are clientSideAttributes, evaluate format & linkText attributes
            if (fieldInfo && fieldInfo.clientSideAttributes) {
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
        },


        /**
         * Formats a single email or a field with a value that contains a list of emails from the fieldValue object
         * @param fieldValue
         * @param fieldInfo
         * @returns {String}
         */
        formatListOfEmailsFromFieldValueObject: function(fieldValue, fieldInfo) {
            if (this._fieldValueDoesNotExist(fieldValue)) {
                return BLANK_EMAIL;
            }

            return this.formatListOfEmails(fieldValue.value, fieldInfo);
        },

        /**
         * Formats a list of emails in a string.
         * Emails can be separated by a semicolon (;), comma (,), or passed in as an array
         */
        formatListOfEmails: function(emails, fieldInfo) {
            // Abort if emails is null or empty
            if (!emails || emails.length === 0) {
                return emails;
            }

            if (!_.isArray(emails)) {
                emails = this.splitEmails(emails);
            }

            for (var i = 0; i < emails.length; i++) {
                emails[i] = this.format({value: emails[i]}, fieldInfo);
            }

            return emails.join(';');
        },
        splitEmails: function(emails) {
            // Can't split if it is empty or null
            if (!emails || emails.length === 0) {
                return emails;
            }

            // The filter removes any blank strings from the final array
            return emails.split(/\s*[;,\s\t]\s*/).filter(function(singleEmail) {return singleEmail;});
        }
    };
}());
