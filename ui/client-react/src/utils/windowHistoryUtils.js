import queryString from 'query-string';

import AppHistory from '../globals/appHistory';

export const WindowHistoryUtils = {
    /**
     * push current url with key=value query param
     * @param key
     * @param value
     */
    pushWithQuery(key, value) {
        this.pushWithQueries({[key]: value});
    },

    /**
     * push current url with key=value query param
     * @param {Object} params
     */
    pushWithQueries(params = {}) {
        const urlQueryString = location.search;
        let newParams = this.buildQueryString(urlQueryString, params);

        AppHistory.history.push(location.pathname + newParams);
    },

    /**
     * Given a params object, builds query string with key value pairs.
     * param = {
     *   name: 'Jon',
     *   value: 33
     * }
     *   returns "?name=Jon&value=33"
     *
     * @param {string} urlQueryString string to parse for existing parameters
     * @param params
     * @returns {string}
     */
    buildQueryString(urlQueryString, params) {
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
        return '?' + queryString.stringify(parsed);
    },

    /**
     * push current url without query params
     */
    pushWithoutQuery() {

        AppHistory.history.push(location.pathname);
    }
};
