const serverTypeConsts = require('../../../common/src/constants');
/**
 * client-side Field Format utility class
 */
class FieldFormats {

    /**
     * get the formatter type given a field type
     * if the field type is not found it defaults to format.TEXT_FORMAT
     * @param fieldDef
     * @return formatType from formats
     */
    static getFormatType(fieldDef) {
        if (fieldDef.datatypeAttributes) {
            switch (fieldDef.datatypeAttributes.type) {
            case serverTypeConsts.NUMERIC:
                if (_.has(fieldDef, 'multipleChoice.choices')) {
                    return FieldFormats.NUMBER_FORMAT_MULTICHOICE;
                    if (_.has(fieldDef, 'showAsRadio')) {
                        return FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS;
                    }
                }
                return FieldFormats.NUMBER_FORMAT;

            case serverTypeConsts.DATE :
                return FieldFormats.DATE_FORMAT;

            case serverTypeConsts.DURATION :
                return FieldFormats.DURATION_FORMAT;

            case serverTypeConsts.DATE_TIME:
                return FieldFormats.DATETIME_FORMAT;

            case serverTypeConsts.TIME_OF_DAY :
                return FieldFormats.TIME_FORMAT;

            case serverTypeConsts.CHECKBOX :
                return FieldFormats.CHECKBOX_FORMAT;

            case serverTypeConsts.USER :
                return FieldFormats.USER_FORMAT;

            case serverTypeConsts.CURRENCY :
                if (_.has(fieldDef, 'multipleChoice.choices')) {
                    return FieldFormats.CURRENCY_FORMAT_MULTICHOICE;
                }
                return FieldFormats.CURRENCY_FORMAT;

            case serverTypeConsts.RATING :
                if (_.has(fieldDef, 'multipleChoice.choices')) {
                    return FieldFormats.RATING_FORMAT_MULTICHOICE;
                }
                return FieldFormats.RATING_FORMAT;

            case serverTypeConsts.PERCENT :
                if (_.has(fieldDef, 'multipleChoice.choices')) {
                    return FieldFormats.PERCENT_FORMAT_MULTICHOICE;
                }
                return FieldFormats.PERCENT_FORMAT;

            case serverTypeConsts.URL :
                return FieldFormats.URL;

            case serverTypeConsts.EMAIL_ADDRESS :
                return FieldFormats.EMAIL_ADDRESS;

            case serverTypeConsts.PHONE_NUMBER :
                return FieldFormats.PHONE_FORMAT;

            case serverTypeConsts.TEXT :
                let numLines = 1;
                if (_.has(fieldDef, 'multipleChoice.choices')) {
                    if (_.has(fieldDef, 'showAsRadio')) {
                        return FieldFormats.TEXT_FORMAT_RADIO_BUTTONS
                    }
                    return FieldFormats.TEXT_FORMAT_MULTICHOICE;
                }
                if (_.has(fieldDef, 'clientSideAttributes.num_lines')) {
                    numLines = fieldDef.clientSideAttributes.num_lines;
                }
                if (numLines > 1) {
                    return FieldFormats.MULTI_LINE_TEXT_FORMAT;
                }
                return FieldFormats.TEXT_FORMAT;

            case serverTypeConsts.TEXT_FORMULA :
                return FieldFormats.TEXT_FORMULA_FORMAT;

            case serverTypeConsts.URL_FORMULA :
                return FieldFormats.URL_FORMULA_FORMAT;

            case serverTypeConsts.NUMERIC_FORMULA :
                return FieldFormats.NUMERIC_FORMULA_FORMAT;

            default:
                return FieldFormats.TEXT_FORMAT;

            }
        }
        return FieldFormats.TEXT_FORMAT;
    }
}

FieldFormats.TEXT_FORMAT = 1;
FieldFormats.NUMBER_FORMAT = 2;
FieldFormats.DATE_FORMAT = 3;
FieldFormats.DATETIME_FORMAT = 4;
FieldFormats.TIME_FORMAT = 5;
FieldFormats.CHECKBOX_FORMAT = 6;
FieldFormats.USER_FORMAT = 7;
FieldFormats.CURRENCY_FORMAT = 8;
FieldFormats.PERCENT_FORMAT = 9;
FieldFormats.RATING_FORMAT = 10;
FieldFormats.DURATION_FORMAT = 11;
FieldFormats.PHONE_FORMAT = 12;
FieldFormats.MULTI_LINE_TEXT_FORMAT = 13;
FieldFormats.URL = 14;
FieldFormats.EMAIL_ADDRESS = 15;
FieldFormats.TEXT_FORMULA_FORMAT = 16;
FieldFormats.URL_FORMULA_FORMAT = 17;
FieldFormats.NUMERIC_FORMULA_FORMAT = 18;
FieldFormats.TEXT_FORMAT_MULTICHOICE = 19;
FieldFormats.RATING_FORMAT_MULTICHOICE = 20;
FieldFormats.CURRENCY_FORMAT_MULTICHOICE = 21;
FieldFormats.PERCENT_FORMAT_MULTICHOICE = 22;
FieldFormats.NUMBER_FORMAT_MULTICHOICE = 23;
FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS = 24;
FieldFormats.TEXT_FORMAT_RADIO_BUTTONS = 25;

export default FieldFormats;
