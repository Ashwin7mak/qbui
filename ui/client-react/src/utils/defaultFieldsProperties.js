import Locale from '../locales/locales';
import FieldFormats from './fieldFormats';
import {DefaultFieldProperties} from '../constants/defaultFieldPropertiesConstants'
const serverTypeConsts = require('../../../common/src/constants');
import _ from 'lodash';

let createDefaultFieldsProperties = (type, defaultTypeProperties, userDefaultProperties) => {
        let fieldDef = {datatypeAttributes: {type: type}};
        let fieldType = FieldFormats.getFormatType(fieldDef);
        let defaultProperties = userDefaultProperties || defaultTypeProperties;

        let defaultScalarFieldsProperties ={
                "type": "SCALAR",
                "datatypeAttributes": {
                    "type": type
                },
                "name": Locale.getMessage(`fieldsDefaultLabels.${fieldType}`),
                "required": false
        };
            return _.merge(defaultScalarFieldsProperties, defaultProperties);
};

export const createScalarDefaultFieldsProperties = (userDefaultProperties) =>{
    return {
        [serverTypeConsts.NUMERIC]: {
            ...createDefaultFieldsProperties(serverTypeConsts.NUMERIC, DefaultFieldProperties.defaultNumericProperties, userDefaultProperties)
        },
        [serverTypeConsts.DATE]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DATE)
        },
        [serverTypeConsts.DURATION]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DURATION)
        },
        [serverTypeConsts.DATE_TIME]: {
            ...createDefaultFieldsProperties(serverTypeConsts.DATE_TIME)
        },
        [serverTypeConsts.TIME_OF_DAY]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TIME_OF_DAY)
        },
        [serverTypeConsts.CHECKBOX]: {
            ...createDefaultFieldsProperties(serverTypeConsts.CHECKBOX)
        },
        [serverTypeConsts.USER]: {
            ...createDefaultFieldsProperties(serverTypeConsts.USER)
        },
        [serverTypeConsts.CURRENCY]: {
            ...createDefaultFieldsProperties(serverTypeConsts.CURRENCY)
        },
        [serverTypeConsts.RATING]: {
            ...createDefaultFieldsProperties(serverTypeConsts.RATING)
        },
        [serverTypeConsts.PERCENT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.PERCENT)
        },
        [serverTypeConsts.URL]: {
            ...createDefaultFieldsProperties(serverTypeConsts.URL)
        },
        [serverTypeConsts.EMAIL_ADDRESS]: {
            ...createDefaultFieldsProperties(serverTypeConsts.EMAIL_ADDRESS)
        },
        [serverTypeConsts.PHONE_NUMBER]: {
            ...createDefaultFieldsProperties(serverTypeConsts.PHONE_NUMBER)
        },
        [serverTypeConsts.TEXT]: {
            ...createDefaultFieldsProperties(serverTypeConsts.TEXT)
        }
    }
};
