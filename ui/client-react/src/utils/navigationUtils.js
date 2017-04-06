import AppHistory from '../globals/appHistory';
import {TABLE_LINK} from '../constants/urlConstants';
import StringUtils from '../utils/stringUtils';


class NavigationUtils {
    // Wrap the document.referrer for unit testing
    static referrer() {return document.referrer;}

    /**
     * A helper function that will send a user back to the previous page if within QuickBase or to a default page if
     * the previous page was outside of QuickBase.
     * @param defaultLocation
     */
    static goBackToPreviousLocation(defaultLocation) {
        // If the user arrived to this page from someone outside of quickbase.com, then the
        // referrer will be an empty string. In that case, because we don't know where the user
        // came from, we will send them back to a default location. Otherwise, we can send the user back
        // to the previous page they were on.
        // WARNING: This is not perfect. If only navigating within the SPA, then referrer may also be a blank string.
        if (this.referrer() === '') {
            return AppHistory.history.push(defaultLocation);
        }

        return AppHistory.history.goBack();
    }

    /**
     * A helper function to redirect back when the user is leaving the Form Builder pages
     * @param appId
     * @param tableId
     * @param previousLocation
     */
    static goBackFromFormBuilder(appId, tableId, previousLocation = null) {
        if (previousLocation) {
            return AppHistory.history.push(previousLocation);
        }

        // If not previous history, we go back to the default table report.
        // We can't go back to a record in form view because we don't have a record ID consistently.
        this.goBackToPreviousLocation(StringUtils.format(TABLE_LINK, [appId, tableId]));
    }
}

export default NavigationUtils;
