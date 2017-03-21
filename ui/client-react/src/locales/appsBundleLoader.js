import Logger from '../utils/logger';
import Locale from '../../../reuse/client/src/locales/locale';
import _ from 'lodash';

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

                // Now load the bundles
                let newBundle = "";

                try {
                    // this is where all supported locales are defined
                    switch (newLocale.toLowerCase()) {
                    case 'en-us':
                        newBundle = _.merge(
                            require('./bundles/apps-en_us'),
                            require('../../../reuse/client/src/locales/bundles/reuse-en_us')
                        );
                        break;
                    case 'fr-fr':
                        newBundle = _.merge(
                            require('./bundles/apps-fr_fr'),
                            require('../../../reuse/client/src/locales/bundles/reuse-fr_fr')
                        );
                        break;
                    case 'de-de':
                        newBundle = _.merge(
                            require('./bundles/apps-de_de'),
                            require('../../../reuse/client/src/locales/bundles/reuse-de_de')
                        );
                        break;
                    }
                } catch (e) {
                    logger.error('Error fetching app locale bundle:', e);
                }

                if (!newBundle) {
                    logger.warn('Locale (' + newLocale + ') is invalid or not supported.  Using default: en-us');
                    newBundle = _.merge(
                        require('./bundles/apps-en_us'),
                        require('../../../reuse/client/src/locales/bundles/reuse-en_us')
                    );
                }

                Locale.changeLocale(newLocale, newBundle.default);
            }
        } catch (e) {
            logger.error('Error changing locale..Locale not changed --> ', e);
        }
    }


}

export default AppsBundleLoader;
