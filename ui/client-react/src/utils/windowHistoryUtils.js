import AppHistory from '../globals/appHistory';

export const WindowHistoryUtils = {
    /**
     * push current url with key=value query param
     * @param key
     * @param value
     */
    pushWithQuery(key, value) {

        let urlQueryString = document.location.search;
        let newParam = key + '=' + value;
        let params = '?' + newParam;

        // If the "search" string exists, then build params from it
        if (urlQueryString) {
            let keyRegex = new RegExp('([\?&])' + key + '[^&]*');

            // If param exists already, update it
            if (urlQueryString.match(keyRegex) !== null) {
                params = urlQueryString.replace(keyRegex, "$1" + newParam);
            } else { // Otherwise, add it to end of query string
                params = urlQueryString + '&' + newParam;
            }
        }
        AppHistory.history.push(location.pathname + params);
    },

    /**
     * push current url without query params
     */
    pushWithoutQuery() {

        AppHistory.history.push(location.pathname);
    }
};
