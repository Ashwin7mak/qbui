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
        let newParams = '';

        if (urlQueryString) {
            newParams = this.buildQueryString(params);
        }

        AppHistory.history.push(location.pathname + params);
    },

    buildQueryString(urlQueryString, params) {
        if (urlQueryString) {
            const parsed = queryString.parse(urlQueryString);
            Object.keys(params).forEach(key => {
                // add the key:value pairs
                // overwrites the value if the key already exists as a query
                parsed[key] = params[key];
            });
            return '?' + queryString.stringify(parsed);
        }
        return '';
    },

    /**
     * push current url without query params
     */
    pushWithoutQuery() {

        AppHistory.history.push(location.pathname);
    }
};
