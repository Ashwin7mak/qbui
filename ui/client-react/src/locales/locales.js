
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

    // return message in bundle.messages object by dot-separated path
    static getMessage(msgPath) {
        var messages =  Locale.getI18nBundle().messages;

        let message = msgPath.split('.').reduce((obj, pathPart) => {
            return obj[pathPart];
        }, messages);

        return message;
    }

    static getSupportedLocales() {
        return config.locale.supported;
    }

}

export default Locale;
