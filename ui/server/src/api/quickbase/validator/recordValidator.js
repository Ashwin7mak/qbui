// This module is not wrapped in a self-invoking function because it makes it impossible to rewire dependencies
'use strict';
var _ = require('lodash');
var ValidationUtils = require('../../../../../common/src/validationUtils');
var constants = require('../../../../../common/src/constants');
var phoneValidator = require('./phoneValidator');

/**
 * A wrapper for the common validator utils that has additional server-side only validations
 * @type {{checkFieldValue: recordValidator.checkFieldValue}}
 */
var recordValidator = {
    checkFieldValue: function(def, name, value, checkRequired) {
        var fieldDef = def.fieldDef;

        var results = ValidationUtils.checkFieldValue(def, name, value, checkRequired);

        // Type specific validators
        if (_.has(fieldDef, 'datatypeAttributes.type')) {
            switch (fieldDef.datatypeAttributes.type) {
            case constants.PHONE_NUMBER :
                results = phoneValidator.validateAndReturnResults(value, name, results);
                break;
            }
        }

        return results;
    }
};

module.exports = recordValidator;

