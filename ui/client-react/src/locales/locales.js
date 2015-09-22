
import ReactIntl from 'react-intl';
// import supported languages...
// TODO: would be nice to dynamically load based on selection
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';
import {Logger,LOG_LEVEL} from '../utils/logger';

// todo: should be retrieved/set as a configuration value per build..
var logConfig = {
    logLevel: LOG_LEVEL.DEBUG,
    logToConsole: true,
    logToServer: false
};
var logger = new Logger(logConfig);

// todo: implement as a ES6 class
var getLocale = function(locale) {
    'use strict';
    logger.debug('Fetching locale: ' + locale);
    try {
        switch (locale.toLowerCase()) {
            case 'en-us':
                return EN_US;
            case 'fr-fr':
                return FR_FR;
            default:
                logger.error('Locale not found.  Returning default: en_US');
                return EN_US;
        }
    }
    catch (e) {
        //  any error automatically returns default locale
        logger.error('Error fetching locale; error=' + e);
        return EN_US;
    }
}

export { getLocale, ReactIntl };