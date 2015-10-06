
// import supported languages...
// TODO: dynamically load based on selection
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';
import DE_DE from '../locales/de_de';
import Logger from '../utils/logger';

let logger = new Logger();

//  todo: this will need to change and get set based on authenticated user preferences...do not
//  todo: believe this should get set from the browser as supported QuickBase languages will be a subset
//  todo: of the language list in the browser
let locale = document.documentElement.getAttribute('lang') || 'en-us';

class Locale {

    static getLocale() {
        return locale;
    }

    static getI18nBundle() {
        logger.debug('Fetching locale: ' + locale);

        try {
            switch (locale.toLowerCase()) {
                case 'en-us':
                    return EN_US;
                case 'fr-fr':
                    return FR_FR;
                case 'de-de':
                    return DE_DE;
                default:
                    logger.info('Locale (' + locale + ') is invalid or not supported.  Returning default: EN_US');
                    return EN_US;
            }
        } catch (e) {
            //  any error automatically returns default locale
            logger.error('Error fetching locale: ' + e);
            return EN_US;
        }
    }

    static changeLocale(newLocale) {
        locale = newLocale;
    }

}

export default Locale;