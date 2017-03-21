/**
 * The original file in this location has moved to the reuse library.
 * What remains here is a stub so existing code does not have to change yet.
 **/

// import the default renaming it to what we want to export
import Locale from '../../../reuse/client/src/locales/locale';

// todo: REMOVE THIS WHEN TESTS CAN BE FIXED!!!!!!
// Right now, the tests do not have a way to initialize the bundles.
// So, if the bundle has not been initialized, we force the bundle to be set to the client-react bundle.
// This lets the tests pass for now. When we can go back in and update the tests
// to load just the bundles that are supposed to be loaded by the code, this can be removed.
import AppsBundleLoader from './appsBundleLoader';
if (!Locale.getI18nBundle()) {
    AppsBundleLoader.changeLocale('en-us');
}

export default Locale;
