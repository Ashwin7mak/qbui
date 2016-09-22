/**
 * isomorphic validation of a field value
 * @returns validation result object {{ isInvalid: bool, def: inputfield, value: input value,
 * error: {messageid:messageKey string, code:number, data:Obj}}
 * @param def - field definition ({required : bool, datatypeAttributes.clientSideAttributes.max_chars :# , etc})
 * @param value - value to update to
 * @param checkRequired - if required fields should be tested, default false, true on save not on each value change
 */
(function() {
    'use strict';

    var LimitConstants = require('./limitConstants');
    let dataErrs = require('./dataEntryErrorCodes');

    module.exports = {

        checkFieldValue: function(def, value, checkRequired = false) {
            let results = {
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

            let field = def;
            if (def.field) {
                field = def.field;
            }
            // check require field is not empty, undefined or null,
            // checkRequired is before saving not on each value change
            if (checkRequired && _.has(field, 'required') && field.required &&
                (value === undefined || value === null ||
                (value.length !== undefined && value.length === 0))) {
                results.isInvalid = true;
                results.error.messageId = 'invalidMsg.required';
                results.error.code = dataErrs.REQUIRED_FIELD_EMPTY;
                results.error.data = {
                     field : field,
                     fieldId: field.id,
                     fieldName : def.headerName || field.name
                 };

            //check fields max chars not exceeded
            } else if (_.has(field, 'datatypeAttributes.clientSideAttributes.max_chars') &&
                field.datatypeAttributes.clientSideAttributes.max_chars > 0 &&
                value !== undefined && _.has(value, 'length') &&
                value.length > field.datatypeAttributes.clientSideAttributes.max_chars) {
                 results.isInvalid = true;
                 results.error.messageId = 'invalidMsg.maxChars';
                 results.error.code = dataErrs.MAX_LEN_EXCEEDED;
                 results.error.data = {
                    field: field,
                    fieldId: field.id,
                    maxNum : field.datatypeAttributes.clientSideAttributes.max_chars,
                    hadNum: value.length
                };

            // check system limit text chars
             } else if (value !== undefined && _.has(value, 'length') &&
                value.length > LimitConstants.maxTextFieldValueLength) {
                //max input length is LimitConstants. maxTextFieldValueLength
                results.isInvalid = true;
                results.error.messageId  = 'invalidMsg.maxChars';
                results.error.code = dataErrs.MAX_LEN_EXCEEDED;
                results.error.data = {
                    field: field,
                    fieldId: field.id,
                    maxNum : LimitConstants.maxTextFieldValueLength,
                    hadNum: value.length
                };
            }

            return results;
        }

    };

}());

