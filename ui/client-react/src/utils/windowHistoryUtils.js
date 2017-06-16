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

    buildQueryString(urlQueryString, params) {
        let parsed = {};
        if (urlQueryString) {
            parsed = queryString.parse(urlQueryString);
        }
        Object.keys(params).forEach(key => {
            // add the key:value pairs
            // overwrites the value if the key already exists as a query
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
