
// import supported languages...
// TODO: dynamically load based on selection
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';
import Logger from '../utils/logger';

// todo: implement as an ES6 class
// todo: this seems questionable as a proper way to read in the user's locale
var Locale = document.documentElement.getAttribute('lang') || 'en-us';
var logger = new Logger();

var getI18nBundle = function() {

    'use strict';
    logger.debug('Fetching locale: ' + Locale);

    try {
        switch (Locale.toLowerCase()) {
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
        logger.error('Error fetching locale: ' + e);
        return EN_US;
    }
}

export { Locale, getI18nBundle };