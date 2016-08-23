/**
 * Client side validation of a field value
 * @returns validation result object {{ isInvalid: bool, invalidMessage}}
 * @param def - field definition ({required : bool,datatypeAttributes.clientSideAttributes.max_chars :# })
 * @param value - value to update to
 * @param checkRequired - if required fields should be tested, default false, true on save
 */
import LimitConstants from '../../../common/src/limitConstants';
import Locales from "../locales/locales";

class ValidationUtils {
    static checkFieldValue(def, value, checkRequired = false) {
        let results = {
            isInvalid : false,
            value: value,
            invalidMessage : null
        };

        if (def === undefined || def === null) {
            return results;
        }

        if (typeof def.id !== 'undefined') {
            results.id = def.id;
        }

        // check require field is not empty, checkRequired before saving not on change
        if (checkRequired && _.has(def, 'required') && def.required &&
            (value === undefined || value === null || (value.length !== undefined && value.length === 0))) {
            let msg = Locales.getMessage('invalidMsg.required', {fieldName: def.headerName || def.name});
            results.isInvalid = true;
            results.invalidMessage = msg;

            //check fields max chars not exceeded
        } else if (_.has(def, 'datatypeAttributes.clientSideAttributes.max_chars') &&
            value !== undefined && _.has(value, 'length') && value.length > def.datatypeAttributes.clientSideAttributes.max_chars) {
            let msg = Locales.getMessage('invalidMsg.maxChars', {num: def.datatypeAttributes.clientSideAttributes.max_chars});
            results.isInvalid = true;
            results.invalidMessage = msg;

            // check system limit text chars
        } else if (value !== undefined && _.has(value, 'length') && value.length > LimitConstants.maxTextFieldValueLength) {
            //max input length is LimitConstants. maxTextFieldValueLength
            let msg = Locales.getMessage('invalidMsg.maxChars', {num: LimitConstants.maxTextFieldValueLength});
            results.isInvalid = true;
            results.invalidMessage = msg;
        }

        return results;
    }

}

export default ValidationUtils;
