import AppHistory from '../globals/appHistory';

/**
 * Static class of window url param access functions
 *   extracted for mockability /testability
 */
class WindowLocationUtils {

    /**
     * Function to test if the parameter in the url include the parameter string

     *
     * @param lookFor
     * @returns {boolean}
     */
    static searchIncludes(lookFor) {
        return window.location.search.indexOf(lookFor) !== -1;
    }

    /**
     * Function to replace the current url history in the browser with a new url
     * this exists for testability
     *
     * @param url
     */
    static replace(url) {
        window.location.replace(url);
    }

    /**
     * Function to update the current url history in the browser with a new url
     * this exists for testability
     *
     * @param url
     */
    static update(url) {
        window.location.href = url;
    }

    /**
     * Function to return the current href
     * this exists for testability
     */
    static getHref() {
        return window.location.href;
    }

    /**
     * Function to return the current hostname
     * this exists for testability
     */
    static getHostname() {
        return window.location.hostname;
    }

    /**
     * push current url with key=value query param
     * @param key
     * @param value
     */
    static pushWithQuery(key, value) {

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
    }

    /**
     * push current url without query params
     */
    static pushWithoutQuery() {

        AppHistory.history.push(location.pathname);
    }
}

export default WindowLocationUtils;

