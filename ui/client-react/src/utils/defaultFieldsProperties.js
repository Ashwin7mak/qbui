import Locale from '../locales/locales';
import FieldFormats from './fieldFormats';
const serverTypeConsts = require('../../../common/src/constants');

let arrayOfScalarTypes = [
    serverTypeConsts.NUMERIC,
    serverTypeConsts.DATE,
    serverTypeConsts.DURATION,
    serverTypeConsts.DATE_TIME,
    serverTypeConsts.TIME_OF_DAY,
    serverTypeConsts.CHECKBOX,
    serverTypeConsts.USER,
    serverTypeConsts.CURRENCY,
    serverTypeConsts.RATING,
    serverTypeConsts.PERCENT,
    serverTypeConsts.URL,
    serverTypeConsts.EMAIL_ADDRESS,
    serverTypeConsts.PHONE_NUMBER,
    serverTypeConsts.TEXT
];

class DefaultFieldsProperties {

    static createScalarDefaultFieldsProperties() {
        let defaultFieldProperties = {};

        arrayOfScalarTypes.forEach((type) => {
            let fieldDef = {datatypeAttributes: {type: type}};
            let fieldType = FieldFormats.getFormatType(fieldDef);

            defaultFieldProperties[type] = {
                "type": "SCALAR",
                "datatypeAttributes": {
                    "type": type
                },
                "name": Locale.getMessage(`fieldsDefaultLabels.${fieldType}`)
            };
        });
        return defaultFieldProperties;
    }
}

export default DefaultFieldsProperties;

