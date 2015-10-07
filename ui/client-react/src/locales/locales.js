
// import supported languages...
// TODO: would be nice to dynamically load based on the selected language
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';
import DE_DE from '../locales/de_de';
import Logger from '../utils/logger';

let logger = new Logger();

const defaultLocale = 'en-us';
const supportedLocales = ['en-us', 'de-de', 'fr-fr'];

//  todo: this will need to change and get set based on the authenticated user language preference (which may
//  todo: then affect how this object is implemented)...but, we do not want to use the browser as the source of
//  todo: truth as the supported QuickBase languages will be a subset of the languages offered in the browser.
let locale = document.documentElement.getAttribute('lang') || defaultLocale;

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
                    logger.info('Locale (' + locale + ') is invalid or not supported.  Using default: ' + defaultLocale);
                    return EN_US;
            }
        } catch (e) {
            //  any error automatically returns default locale
            logger.error('Error fetching locale: ' + e + '.  Using default: ' + defaultLocale);
            return EN_US;
        }
    }

    static changeLocale(newLocale) {
        try {
            if (supportedLocales.indexOf(newLocale.toLowerCase()) === -1) {
                logger.error('Invalid/unsupported change locale: ' + newLocale + '.  Locale not changed.');
            } else {
                locale = newLocale;
            }
        }
        catch (e) {
            logger.error('Exception changing locale: ' + e + '.  Locale not changed.');
        }
    }

}

export default Locale;