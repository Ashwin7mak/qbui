
import Logger from '../utils/logger';
import config from '../config/app.config';
import StringUtils from '../utils/stringUtils';

let logger = new Logger();

//  todo: this will need to change and get set based on the authenticated user language preference (which may
//  todo: then affect how this object is implemented)...we do not want to use the browser as the source of
//  todo: truth as the supported QuickBase languages will be a subset of the languages offered in the browser.
let locale = config.locale.default;

class Locale {

    /**
     * Return the current locale
     *
     * @returns {*}
     */
    static getLocale() {
        return locale;
    }

    /**
     * Return the currency code for the current locale.
     *
     * @returns {string|string}
     */
    static getCurrencyCode() {
        return Locale.getI18nBundle().currencyCode;
    }

    /**
     * Return the i18n bundle for the current locale.
     *
     * @returns {string}
     */
    static getI18nBundle() {
        let bundle = "";

        try {
            // this is where all supported locales are defined
            switch (locale.toLowerCase()) {
            case 'en-us':
                bundle = require('../locales/bundles/en_us');
                break;
            case 'fr-fr':
                bundle = require('../locales/bundles/fr_fr');
                break;
            case 'de-de':
                bundle = require('../locales/bundles/de_de');
                break;
            }
        } catch (e) {
            logger.error('Error fetching locale:', e);
        }

        if (!bundle) {
            logger.warn('Locale (' + locale + ') is invalid or not supported.  Using default: en-us');
            bundle = require('../locales/bundles/en_us');
        }

        return bundle;
    }

    /**
     * Change the locale to a new locale.  The locale supplied must be in the list of
     * supported locales defined in the run-time configuration object or no change is made.
     *
     * @param newLocale
     */
    static changeLocale(newLocale) {
        try {
            if (config.locale.supported.indexOf(newLocale.toLowerCase()) === -1) {
                logger.warn('Invalid/unsupported change locale: ' + newLocale + '.  Locale not changed.');
            } else {
                locale = newLocale;
            }
        } catch (e) {
            logger.error('Error changing locale..Locale not changed --> ', e);
        }
    }

    /**
     * Return a localized message based on the msgPath key.  Add an
     * optional token list for parameter substitution if the message
     * includes tokens.
     *
     * @param msgPath
     * @param tokens
     * @returns {*}
     */
    static getMessage(msgPath, tokens) {
        var messages =  Locale.getI18nBundle().messages;

        let message = msgPath.split('.').reduce((obj, pathPart) => {
            return obj[pathPart];
        }, messages);

        if (tokens) {
            message = StringUtils.format(message, tokens);
        }

        return message;
    }

    static getSupportedLocales() {
        return config.locale.supported;
    }

}

export default Locale;
