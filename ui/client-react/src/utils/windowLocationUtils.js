import {browserHistory} from 'react-router';

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
        return window.location.search.includes(lookFor);
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

    static getSubdomain() {
        return window.location.hostname.split(".")[0];
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
        browserHistory.push(location.pathname + params);
    }

    /**
     * push current url without query params
     */
    static pushWithoutQuery() {

        browserHistory.push(location.pathname);
    }
}

export default WindowLocationUtils;

