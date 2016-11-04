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

    static getHref() {
        return window.location.href;
    }

    /**
     * We need to get the subdomain for redirect url construction
     * To get the real subdomain we need to split on the '.' character
     * And then take the first entry in the array
     * Example: team.quickbase.com
     * Example returns {team}
     */
    static getSubdomain() {
        return window.location.hostname.split(".").shift();
    }

    /**
     * We need to get the subdomain for redirect url construction
     * To get the real subdomain we need to split on the '.' character
     * And then take the first entry in the array
     * Example: team.quickbase.com
     * Example returns {team}
     */
    static getHostname() {
        var hostnameSplit = window.location.hostname.split(".");
        var hostname = hostnameSplit.pop(); //we can't assume that we are deployed on TLD .com
        hostname = "." + hostnameSplit.pop() + "." + hostname;
        return hostname;
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

