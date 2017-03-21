// IMPORTS FROM CLIENT REACT
import Logger from '../../../../client-react/src/utils/logger';
import config from '../../../../client-react/src/config/app.config';
import StringUtils from '../../../../client-react/src/utils/stringUtils';
// IMPORTS FROM CLIENT REACT

let logger = new Logger();

//  todo: this will need to change and get set based on the authenticated user language preference (which may
//  todo: then affect how this object is implemented)...we do not want to use the browser as the source of
//  todo: truth as the supported QuickBase languages will be a subset of the languages offered in the browser.
let locale = config.locale.default;
let bundle = undefined; // changeLocale() must be called to initialize this variable before getMessage() is ever called.

class Locale {

    /**
     * Verify the locale is supported
     *
     * @param locale
     */
    static isSupported(aLocale) {
        return (config.locale.supported.indexOf(aLocale.toLowerCase()) >= 0) ;
    }

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
        return bundle;
    }

    /**
     * Change the locale to a new locale.  The locale supplied must be in the list of
     * supported locales defined in the run-time configuration object or no change is made.
     *
     * @param newLocale
     * @param newBundle
     */
    static changeLocale(newLocale, newBundle) {
        if (!newBundle) {
            throw new Error('A bundle is required. Call your application bundle loader changeLocale() function instead.');
        }

        if (!Locale.isSupported(newLocale)) {
            logger.warn('Invalid/unsupported change locale: ' + newLocale + '.  Locale not changed.');
        } else {
            locale = newLocale;
            bundle = newBundle;
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
