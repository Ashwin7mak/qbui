//TEMPORARY IMPORT FROM CLIENT-REACT
import Logger from '../../../client-react/src/utils/logger';
//TEMPORARY IMPORT FROM CLIENT-REACT

import Locale from '../../../reuse/client/src/locales/locale';
import _ from 'lodash';

let logger = new Logger();

class GovernanceBundleLoader {

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
                            // BAD BAD BAD - we should not be importing the client-react strings!
                            // However, governance imports client-react code for the grid that needs these strings.
                            // They have to stay here until that code is removed.
                            newAppBundle = _.merge(
                                require('../../../client-react/src/locales/bundles/apps-en_us'),    // NAUGHTY! EVIL! NO!
                                require('../../../reuse/client/src/locales/bundles/reuse-en_us'),
                                require('./bundles/governance-en_us')
                            );
                            break;
                        case 'fr-fr':
                            // BAD BAD BAD - we should not be importing the client-react strings!
                            // However, governance imports client-react code for the grid that needs these strings.
                            // They have to stay here until that code is removed.
                            newAppBundle = _.merge(
                                require('../../../client-react/src/locales/bundles/apps-fr_fr'),    // NAUGHTY! EVIL! NO!
                                require('../../../reuse/client/src/locales/bundles/reuse-fr_fr'),
                                require('./bundles/governance-fr_fr')
                            );
                            break;
                        case 'de-de':
                            // BAD BAD BAD - we should not be importing the client-react strings!
                            // However, governance imports client-react code for the grid that needs these strings.
                            // They have to stay here until that code is removed.
                            newAppBundle = _.merge(
                                require('../../../client-react/src/locales/bundles/apps-de_de'),    // NAUGHTY! EVIL! NO!
                                require('../../../reuse/client/src/locales/bundles/reuse-de_de'),
                                require('./bundles/governance-de_de')
                            );
                            break;
                    }
                } catch (e) {
                    logger.error('Error fetching app locale bundle:', e);
                }

                if (!newAppBundle) {
                    logger.warn('Locale (' + newLocale + ') is invalid or not supported.  Using default: en-us');
                    // BAD BAD BAD - we should not be importing the client-react strings!
                    // However, governance imports client-react code for the grid that needs these strings.
                    // They have to stay here until that code is removed.
                    newAppBundle = _.merge(
                        require('../../../client-react/src/locales/bundles/apps-en_us'),    // NAUGHTY! EVIL! NO!
                        require('../../../reuse/client/src/locales/bundles/reuse-en_us'),
                        require('./bundles/governance-en_us')
                    );
                }

                Locale.changeLocale(newLocale, newAppBundle.default);
            }
        } catch (e) {
            logger.error('Error changing locale..Locale not changed --> ', e);
        }
    }


}

export default GovernanceBundleLoader;
