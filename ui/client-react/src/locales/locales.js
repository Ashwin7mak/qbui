
// import supported languages...
// TODO: would be nice to dynamically load based on the selected language
import EN_US from '../locales/en_us';
import FR_FR from '../locales/fr_fr';
import DE_DE from '../locales/de_de';
import Logger from '../utils/logger';

let logger = new Logger();

//  todo: this will need to change and get set based on authenticated user preferences...we do not
//  todo: want to use the browser as the source of truth of locale as the supported QuickBase languages
//  todo: will be a subset of the languages offered in the browser
let defaultLocale = 'en-us';
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
                    locale = defaultLocale;
                    return EN_US;
            }
        } catch (e) {
            //  any error automatically returns default locale
            logger.error('Error fetching locale: ' + e + '.  Using default: ' + defaultLocale);
            locale = defaultLocale;
            return EN_US;
        }
    }

    static changeLocale(newLocale) {
        // could enforce validation, but the getI18nBundle always falls back to EN_US when an invalid locale is injected..
        locale = newLocale;
    }

}

export default Locale;