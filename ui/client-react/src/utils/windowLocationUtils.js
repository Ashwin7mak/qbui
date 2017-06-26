import queryString from 'query-string';

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
     * Function to return the current pathname
     * this exists for testability
     */
    static getPathname() {
        return window.location.pathname;
    }

    /**
     * Function to returns a DOMString containing the canonical
     * form of the origin of the current location.
     * i.e. for url https://developer.mozilla.org/en-US/search?q=URL#search-results-close-container';
     * origin is https://developer.mozilla.org
     */
    static getOrigin() {
        return window.location.origin;
    }

    /**
     * Returns the search portion of the url.
     *
     * i.e. for url https://developer.mozilla.org/en-US/search?q=URL#search-results-close-container';
     * search portion is "?q=URL"
     * @returns {*}
     */
    static getSearch() {
        return window.location.search;
    }

    /**
     * Given a params object, builds query string with key value pairs. Order of the key/value pairs are not guaranteed.
     * params = {
     *   name: 'Jon',
     *   value: 33
     * }
     *   returns "?name=Jon&value=33"
     *
     * @param {string} urlQueryString string to parse for existing parameters
     * @param {object} params
     * @returns {string}
     */
    static buildQueryString(urlQueryString, params = {}) {
        let parsed = {};
        if (urlQueryString) {
            // keep existing query strings
            parsed = queryString.parse(urlQueryString);
        }
        Object.keys(params).forEach(key => {
            // add the key:value pairs
            // overwrites the value in urlQueryString if the same key already exists
            parsed[key] = params[key];
        });
        const newQueryString = queryString.stringify(parsed);
        return newQueryString.length ? '?' + newQueryString : '';
    }

    /**
     * Calls window.addEventListener. This is mostly for ease of testing.
     */
    static addEventListener(...args) {
        window.addEventListener(...args);
    }

    /**
     * Calls window.removeEventListener. This is mostly for ease of testing.
     */
    static removeEventListener(...args) {
        window.removeEventListener(...args);
    }
}

export default WindowLocationUtils;

