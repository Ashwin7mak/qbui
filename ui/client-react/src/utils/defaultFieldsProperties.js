import Locale from '../locales/locales';
import FieldFormats from './fieldFormats';
import {DefaultFieldProperties} from '../constants/defaultFieldPropertiesConstants';
const serverTypeConsts = require('../../../common/src/constants');
import _ from 'lodash';

let createDefaultFieldsProperties = (type, defaultTypeProperties, userDefaultProperties) => {
    let fieldDef = {datatypeAttributes: {type: type}};
    let fieldType = FieldFormats.getFormatType(fieldDef);
    userDefaultProperties = userDefaultProperties || {};
    defaultTypeProperties = defaultTypeProperties || {};

    let defaultScalarFieldsProperties = {
        "type": "SCALAR",
        "datatypeAttributes": {
            "type": type
        },
        "name": Locale.getMessage(`fieldsDefaultLabels.${fieldType}`),
        "required": false
    };
    return _.merge(defaultScalarFieldsProperties, defaultTypeProperties, userDefaultProperties);
};

export const createScalarDefaultFieldsProperties = (userDefaultProperties) =>{
    return {
        [serverTypeConsts.NUMERIC]: {
            ...createDefaultFieldsProperties(serverTypeConsts.NUMERIC, DefaultFieldProperties[serverTypeConsts.NUMERIC], userDefaultProperties)
        },
        [serverTypeConsts.DATE]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DATE, DefaultFieldProperties[serverTypeConsts.DATE], userDefaultProperties)
        },
        [serverTypeConsts.DURATION]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DURATION, DefaultFieldProperties[serverTypeConsts.DURATION], userDefaultProperties)
        },
        [serverTypeConsts.DATE_TIME]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DATE_TIME, DefaultFieldProperties[serverTypeConsts.DATE_TIME], userDefaultProperties)
        },
        [serverTypeConsts.TIME_OF_DAY]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TIME_OF_DAY, DefaultFieldProperties[serverTypeConsts.TIME_OF_DAY], userDefaultProperties)
        },
        [serverTypeConsts.CHECKBOX]: {
            ...createDefaultFieldsProperties(serverTypeConsts.CHECKBOX, DefaultFieldProperties[serverTypeConsts.CHECKBOX], userDefaultProperties)
        },
        [serverTypeConsts.USER]: {
            ...createDefaultFieldsProperties(serverTypeConsts.USER, DefaultFieldProperties[serverTypeConsts.USER], userDefaultProperties)
        },
        [serverTypeConsts.CURRENCY]: {
            ...createDefaultFieldsProperties(serverTypeConsts.CURRENCY, DefaultFieldProperties[serverTypeConsts.CURRENCY], userDefaultProperties)
        },
        [serverTypeConsts.RATING]: {
            ...createDefaultFieldsProperties(serverTypeConsts.RATING, DefaultFieldProperties[serverTypeConsts.RATING], userDefaultProperties)
        },
        [serverTypeConsts.PERCENT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.PERCENT, DefaultFieldProperties[serverTypeConsts.PERCENT], userDefaultProperties)
        },
        [serverTypeConsts.URL]: {
            ...createDefaultFieldsProperties(serverTypeConsts.URL, DefaultFieldProperties[serverTypeConsts.URL], userDefaultProperties)
        },
        [serverTypeConsts.EMAIL_ADDRESS]: {
            ...createDefaultFieldsProperties(serverTypeConsts.EMAIL_ADDRESS, DefaultFieldProperties[serverTypeConsts.EMAIL_ADDRESS], userDefaultProperties)
        },
        [serverTypeConsts.PHONE_NUMBER]: {
            ...createDefaultFieldsProperties(serverTypeConsts.PHONE_NUMBER, DefaultFieldProperties[serverTypeConsts.PHONE_NUMBER], userDefaultProperties)
        },
        [serverTypeConsts.TEXT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TEXT, DefaultFieldProperties[serverTypeConsts.TEXT], userDefaultProperties)
        }
    };
};
