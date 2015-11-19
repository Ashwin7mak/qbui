
// import supported languages...
// TODO: would be nice to dynamically load based on the selected language
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';
import DE_DE from '../locales/de_de';
import Logger from '../utils/logger';

import config from '../config/app.config';

let logger = new Logger();

//  todo: this will need to change and get set based on the authenticated user language preference (which may
//  todo: then affect how this object is implemented)...we do not want to use the browser as the source of
//  todo: truth as the supported QuickBase languages will be a subset of the languages offered in the browser.
let locale = config.locale.default;

class Locale {

    static getLocale() {
        return locale;
    }

    static getI18nBundle() {
        try {
            switch (locale.toLowerCase()) {
            case 'en-us':
                return EN_US;
            case 'fr-fr':
                return FR_FR;
            case 'de-de':
                return DE_DE;
            default:
                logger.warn('Locale (' + locale + ') is invalid or not supported.  Using default: en-us');
                return EN_US;
            }
        } catch (e) {
            //  any error automatically returns default of en-us
            logger.error('Error fetching locale..Using default: en-us --> ' + e);
            return EN_US;
        }
    }

    static changeLocale(newLocale) {
        try {
            if (config.locale.supported.indexOf(newLocale.toLowerCase()) === -1) {
                logger.warn('Invalid/unsupported change locale: ' + newLocale + '.  Locale not changed.');
            } else {
                locale = newLocale;
            }
        } catch (e) {
            logger.error('Error changing locale..Locale not changed --> ' + e);
        }
    }

    static getSupportedLocales() {
        return config.locale.supported;
    }

}

export default Locale;
