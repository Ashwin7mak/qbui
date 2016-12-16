/**
 * isomorphic validation of a field value
 * @returns validation result object {{ isInvalid: bool, def: inputfield, value: input value,
 * error: {messageid:messageKey string, code:number, data:Obj}}
 * @param def - field definition ({required : bool, fieldDef: {datatypeAttributes.clientSideAttributes.max_chars :# , etc}})
 * @param value - value to update to
 * @param checkRequired - if required fields should be tested, default false, true on save not on each value change
 */
'use strict';

var LimitConstants = require('./limitConstants');
var dataErrs = require('./dataEntryErrorCodes');
var constants = require('./constants');
var _ = require('lodash');
var EmailValidator = require('./validator/emailValidator');
var PhoneValidator = require('./validator/phoneValidator');

module.exports = {

    checkFieldValue: function(def, name, value, checkRequired) {
        checkRequired = checkRequired || false;
        var results = {
            value: value,
            def: def,
            isInvalid : false,
            error : {
                messageId : null,
                code : null,
                data: {} // key vals varies depending on error info for message template
            },
        };

        if (def === undefined || def === null) {
            return results;
        }

        if (typeof def.id !== 'undefined') {
            results.id = def.id;
        }

        // def passed is a field obj
        var fieldDef = def.fieldDef;

        // check require field is not empty, undefined or null,
        // checkRequired is before saving not on each value change
        if (checkRequired && _.has(fieldDef, 'required') && fieldDef.required &&
            (value === undefined || value === null ||
            (value.length !== undefined && value.length === 0) ||
            value === false)) {
            results.isInvalid = true;
            results.error.messageId = 'invalidMsg.required';
            results.error.code = dataErrs.REQUIRED_FIELD_EMPTY;
            results.error.data = {
                fieldId: fieldDef.id,
                fieldName : name
            };

        //check fields max chars not exceeded
        } else if (_.has(fieldDef, 'datatypeAttributes.clientSideAttributes.max_chars') &&
            fieldDef.datatypeAttributes.clientSideAttributes.max_chars > 0 &&
            fieldDef.datatypeAttributes.clientSideAttributes.max_chars <= LimitConstants.maxTextFieldValueLength &&
            value !== undefined && _.has(value, 'length') &&
            value.length > fieldDef.datatypeAttributes.clientSideAttributes.max_chars) {
            results.error.messageId = 'invalidMsg.maxChars';
            if (_.has(fieldDef, 'multipleChoice.choices')) {
                results.error.messageId = 'invalidMsg.choiceMaxLength';
            }
            results.isInvalid = true;
            results.error.code = dataErrs.MAX_LEN_EXCEEDED;
            results.error.data = {
                fieldId: fieldDef.id,
                maxNum : fieldDef.datatypeAttributes.clientSideAttributes.max_chars,
                hadNum: value.length
            };

        // check system limit text chars
        } else if (value !== undefined && typeof value === 'string' &&
            _.has(value, 'length') && value.length > LimitConstants.maxTextFieldValueLength) {
            //max input length is LimitConstants. maxTextFieldValueLength
            results.isInvalid = true;
            results.error.messageId  = 'invalidMsg.maxChars';
            if (_.has(this.props, 'fieldDef.multipleChoice.choices')) {
                results.error.messageId = 'invalidMsg.choiceMaxLength';
            }
            results.error.code = dataErrs.MAX_LEN_EXCEEDED;
            results.error.data = {
                fieldId: fieldDef.id,
                maxNum : LimitConstants.maxTextFieldValueLength,
                hadNum: value.length
            };
        }

        // Type specific validators
        if (_.has(fieldDef, 'datatypeAttributes.type')) {
            switch (fieldDef.datatypeAttributes.type) {
            case constants.EMAIL_ADDRESS :
                results = EmailValidator.validateAndReturnResults(value, name, results);
                break;
            case constants.PHONE_NUMBER :
                results = PhoneValidator.validateAndReturnResults(value, name, results);
                break;
            }
        }

        return results;
    }

};
