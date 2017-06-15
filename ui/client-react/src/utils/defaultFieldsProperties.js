import FieldFormats from './fieldFormats';
import {DefaultFieldProperties} from '../constants/defaultFieldPropertiesConstants';
const serverTypeConsts = require('../../../common/src/constants');
import _ from 'lodash';

let createDefaultFieldsProperties = (type, defaultTypeProperties, userDefaultProperties) => {

    let fieldDef = {datatypeAttributes: {type}};
    let fieldType = FieldFormats.getFormatType(fieldDef);
    userDefaultProperties = userDefaultProperties || {};
    defaultTypeProperties = defaultTypeProperties || {};
    let defaultScalarFieldsProperties = DefaultFieldProperties.defaultScalarFieldsProperties(type, fieldType);

    return _.merge(defaultScalarFieldsProperties, defaultTypeProperties, userDefaultProperties);
};

export const createScalarDefaultFieldsProperties = (userDefaultProperties = null) => {

    return {
        [FieldFormats.TEXT_FORMAT_MULTICHOICE]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TEXT, DefaultFieldProperties[FieldFormats.TEXT_FORMAT_MULTICHOICE], userDefaultProperties)
        },
        [FieldFormats.NUMBER_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.NUMERIC, DefaultFieldProperties[FieldFormats.NUMBER_FORMAT], userDefaultProperties)
        },
        [FieldFormats.DATE_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DATE, DefaultFieldProperties[FieldFormats.DATE_FORMAT], userDefaultProperties)
        },
        [FieldFormats.DURATION_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DURATION, DefaultFieldProperties[FieldFormats.DURATION_FORMAT], userDefaultProperties)
        },
        [FieldFormats.DATETIME_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DATE_TIME, DefaultFieldProperties[FieldFormats.DATETIME_FORMAT], userDefaultProperties)
        },
        [FieldFormats.TIME_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TIME_OF_DAY, DefaultFieldProperties[FieldFormats.TIME_FORMAT], userDefaultProperties)
        },
        [FieldFormats.CHECKBOX_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.CHECKBOX, DefaultFieldProperties[FieldFormats.CHECKBOX_FORMAT], userDefaultProperties)
        },
        [FieldFormats.USER_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.USER, DefaultFieldProperties[FieldFormats.USER_FORMAT], userDefaultProperties)
        },
        [FieldFormats.CURRENCY_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.CURRENCY, DefaultFieldProperties[FieldFormats.CURRENCY_FORMAT], userDefaultProperties)
        },
        [FieldFormats.RATING_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.RATING, DefaultFieldProperties[FieldFormats.RATING_FORMAT], userDefaultProperties)
        },
        [FieldFormats.PERCENT_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.PERCENT, DefaultFieldProperties[FieldFormats.PERCENT_FORMAT], userDefaultProperties)
        },
        [FieldFormats.URL]: {
            ...createDefaultFieldsProperties(serverTypeConsts.URL, DefaultFieldProperties[FieldFormats.URL], userDefaultProperties)
        },
        [FieldFormats.EMAIL_ADDRESS]: {
            ...createDefaultFieldsProperties(serverTypeConsts.EMAIL_ADDRESS, DefaultFieldProperties[FieldFormats.EMAIL_ADDRESS], userDefaultProperties)
        },
        [FieldFormats.PHONE_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.PHONE_NUMBER, DefaultFieldProperties[FieldFormats.PHONE_FORMAT], userDefaultProperties)
        },
        [FieldFormats.LINK_TO_RECORD]: {
            ...createDefaultFieldsProperties(serverTypeConsts.LINK_TO_RECORD, DefaultFieldProperties[FieldFormats.LINK_TO_RECORD], userDefaultProperties)
        },
        [FieldFormats.LIST_OF_RECORDS]: {
            ...createDefaultFieldsProperties(serverTypeConsts.LIST_OF_RECORDS, DefaultFieldProperties[FieldFormats.LIST_OF_RECORDS], userDefaultProperties)
        },
        [FieldFormats.TEXT_FORMAT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TEXT, DefaultFieldProperties[FieldFormats.TEXT_FORMAT], userDefaultProperties)
        }
    };
};
