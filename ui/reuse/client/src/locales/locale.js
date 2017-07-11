import MessageFormat from 'messageformat';
// IMPORTS FROM CLIENT REACT
import Logger from 'APP/utils/logger';
import config from 'APP/config/app.config';
import StringUtils from 'APP/utils/stringUtils';
// IMPORTS FROM CLIENT REACT

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
            const logger = new Logger();
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

    /**
     * Return a pluralized message based on the msgPath and format object.
     * A value must be supplied for every argument in the message pattern (msgPath) the instance was constructed with.
     *
     * msgPath:
     *      i.e: test.testMsg
     *
     * message: should be in ICU message syntax:
     *      i.e: "{value, plural,\n =0 {0 {nameForRecord} record}\n =1 {1 {nameForRecord} record}\n other {# {nameForRecord} records}\n}"
     *
     * Usage: Locale.getPluralizedMessage('test.testMsg', {value: 2, nameForRecord: 'Customer'});
     *
     * @param msgPath
     * @param params
     * @return {*}
     */
    static getPluralizedMessage(msgPath, params) {
        let formattedMsg = new MessageFormat(locale).compile(Locale.getMessage(msgPath));

        // value and nameForRecord are required. Use empty string (nameForRecord: '') for empty value.
        if (!params) {
            const logger = new Logger();
            logger.warn('An object parameter and field is required to pluralize the input message.');
            return;
        }

        return formattedMsg(params);
    }

    static getSupportedLocales() {
        return config.locale.supported;
    }

}

export default Locale;
