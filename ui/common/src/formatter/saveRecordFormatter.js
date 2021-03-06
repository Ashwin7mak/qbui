'use strict';
var phoneFormatter = require('../../src/formatter/phoneNumberFormatter');
var constants = require('../../src/constants');
var _ = require('lodash');

var SaveRecordFormatter =  {
    /**
     * Formats a list of changes on a record so they are in a format ready to be sent to the Core api
     * For example, in the UI, phone numbers can have some special characters, but all of those must be removed before saving
     * @param changes
     * @returns {*}
     */
    formatRecordForSaving: function(changes) {
        var fixedChanges = _.cloneDeep(changes);

        if (_.isArray(fixedChanges)) {
            fixedChanges = _.map(fixedChanges, function(change) {
                return SaveRecordFormatter.formatFieldForSaving(change);
            });
        }

        return fixedChanges;
    },

    /**
     * Some fields need additional formatting before they can be sent to Core
     * For example, in the UI, phone numbers can have some special characters, but all those must be removed before saving.
     * @param change
     */
    formatFieldForSaving: function(change) {
        if (_.has(change, 'fieldDef.datatypeAttributes.type')) {
            switch (change.fieldDef.datatypeAttributes.type) {
            case constants.DURATION :
                if (change.value === '') {
                    change.value = null;
                } else {
                    // Valid values are converted to millisecond numbers save the number
                    // Invalid values should be left as strings
                    change.value = /^\d+$/g.test(change.value) ? Number(change.value) : change.value;
                }
                break;
            case constants.NUMERIC :
            case constants.CURRENCY :
            case constants.PERCENT :
            case constants.RATING :
                // Core only accepts null for an empty numeric field. If an empty string is passed, an invalidRecord error is returned.
                if (change.value === '') {
                    change.value = null;
                }
                break;
            case constants.PHONE_NUMBER :
                // removes special characters from phone
                change.value = phoneFormatter.stripSpecialCharactersExceptExtension(change.value);
                break;
            case constants.USER :
                // replace user objects in value property with user IDs
                change.value = change.value ? change.value.userId : "";
                break;
            }
        }

        return change;
    }
};

module.exports = SaveRecordFormatter;
