// IMPORTS FROM CLIENT REACT
import Logger from '../../../../client-react/src/utils/logger';
// IMPORTS FROM CLIENT REACT

import Locale from './locale';
import _ from 'lodash';

let logger = new Logger();

/**
 * The bundle loader class that is specific to the reuse library Functional Area.
 * Each functional area has its own localized string bundles. These need to be loaded
 * by a bundle loader class specific to the functional area. Each bundle loader class
 * must be initialized in the application startup as soon as possible because calls
 * made to Locale.getMessage() will fail until the bundle loader has loaded the proper
 * strings. Initialize the bundle loader for each application by calling the changeLocale()
 * function.
 */
class ReuseBundleLoader {

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

                // Now load the bundles
                let newBundle = "";

                try {
                    // this is where all supported locales are defined
                    switch (newLocale.toLowerCase()) {
                    case 'en-us':
                        newBundle = require('./bundles/reuse-en_us');
                        break;
                    case 'fr-fr':
                        newBundle = require('./bundles/reuse-fr_fr');
                        break;
                    case 'de-de':
                        newBundle = require('./bundles/reuse-de_de');
                        break;
                    }
                } catch (e) {
                    logger.error('Error fetching reuse locale bundle:', e);
                }

                if (!newBundle) {
                    logger.warn('Locale (' + newLocale + ') is invalid or not supported.  Using default: en-us');
                    newBundle = require('./bundles/reuse-en_us');
                }

                Locale.changeLocale(newLocale, newBundle.default);
            }
        } catch (e) {
            logger.error('Error changing locale..Locale not changed --> ', e);
        }
    }


}

export default ReuseBundleLoader;
