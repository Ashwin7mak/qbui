
import ReactIntl from 'react-intl';
// import supported languages...
// TODO: would be nice to dynamically load based on selection
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';

var getLocale = function(locale) {
    'use strict';
    console.log('Fetching locale: ' + locale);
    try {
        switch (locale.toLowerCase()) {
            case 'en-us':
                return EN_US;
            case 'fr-fr':
                return FR_FR;
            default:
                console.log('Locale not found.  Returning default: en_US');
                return EN_US;
        }
    }
    catch (e) {
        //  any error automatically returns default locale
        console.log('Error fetching locale; error=' + e);
        return EN_US;
    }
}

export { getLocale, ReactIntl };