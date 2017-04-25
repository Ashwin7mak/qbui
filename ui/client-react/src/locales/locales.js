/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/

// import the default renaming it to what we want to export
import Locale from '../../../reuse/client/src/locales/locale';

// todo: REMOVE THIS WHEN TESTS CAN BE FIXED!!!!!!
// We don't have a way right now to initialize the testing bundles without editing
// every single one of them. So, this is here temporarily to ensure that at least
// the client-react bundle is loaded so tests will continue to pass. In the future,
// we'll either update all the tests with potentially a common class per functional area...
// or change the testing framework to inject "environment initialization" code into
// every test. Then this can be removed.
import AppsBundleLoader from './appsBundleLoader';
if (!Locale.getI18nBundle()) {
    AppsBundleLoader.changeLocale('en-us');
}
// todo: REMOVE THIS WHEN TESTS CAN BE FIXED!!!!!!

export default Locale;
