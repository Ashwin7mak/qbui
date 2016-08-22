const serverTypeConsts = require('../../../common/src/constants');
/**
 * client-side Field Format utility class
 */
class FieldFormats {

    /**
     * get the formatter type given a field type
     * if the field type is not found it defaults to format.TEXT_FORMAT
     * @param fieldType
     * @return formatType from formats
     */
    static getFormatType(fieldType) {

        switch (fieldType) {
        case serverTypeConsts.NUMERIC:
            return FieldFormats.NUMBER_FORMAT;

        case serverTypeConsts.DATE :
            return FieldFormats.DATE_FORMAT;

        case serverTypeConsts.DATE_TIME:
            return FieldFormats.DATETIME_FORMAT;

        case serverTypeConsts.TIME_OF_DAY :
            return FieldFormats.TIME_FORMAT;

        case serverTypeConsts.CHECKBOX :
            return FieldFormats.CHECKBOX_FORMAT;

        case serverTypeConsts.USER :
            return FieldFormats.USER_FORMAT;

        case serverTypeConsts.CURRENCY :
            return FieldFormats.CURRENCY_FORMAT;

        case serverTypeConsts.RATING :
            return FieldFormats.RATING_FORMAT;

        case serverTypeConsts.PERCENT :
            return FieldFormats.PERCENT_FORMAT;

        default:
            return FieldFormats.TEXT_FORMAT;

        }
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

export default FieldFormats;

