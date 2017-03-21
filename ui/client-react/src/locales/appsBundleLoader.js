import Logger from '../utils/logger';
import Locale from '../../../reuse/client/src/locales/locales';

let logger = new Logger();

class AppsBundleLoader {

    /**
     * Change the locale to a new locale.  The locale supplied must be in the list of
     * supported locales defined in the run-time configuration object or no change is made.
     *
     * @param newLocale
     */
    static changeLocale(newLocale) {

        try {
            // verify that locale is valid
            if (!Locale.isSupported(newLocale)) {
                logger.warn('Invalid/unsupported change locale: ' + newLocale + '.  Locale not changed.');
            } else {

                // Now load the app bundle
                let newAppBundle = "";

                try {
                    // this is where all supported locales are defined
                    switch (newLocale.toLowerCase()) {
                        case 'en-us':
                            newAppBundle = require('./bundles/apps-en_us');
                            break;
                        case 'fr-fr':
                            newAppBundle = require('./bundles/apps-fr_fr');
                            break;
                        case 'de-de':
                            newAppBundle = require('./bundles/apps-de_de');
                            break;
                    }
                } catch (e) {
                    logger.error('Error fetching app locale bundle:', e);
                }

                if (!newAppBundle) {
                    logger.warn('Locale (' + newLocale + ') is invalid or not supported.  Using default: en-us');
                    newAppBundle = require('./bundles/apps-en_us');
                }

                Locale.changeLocale(newLocale, newAppBundle.default);
            }
        } catch (e) {
            logger.error('Error changing locale..Locale not changed --> ', e);
        }
    }


}

export default AppsBundleLoader;
