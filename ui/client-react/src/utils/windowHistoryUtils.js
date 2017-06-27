import AppHistory from '../globals/appHistory';
import WindowLocationUtils from './windowLocationUtils';

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
        const urlQueryString = WindowLocationUtils.getSearch();
        let newParams = WindowLocationUtils.buildQueryString(urlQueryString, params);

        AppHistory.history.push(WindowLocationUtils.getPathname() + newParams);
    },

    /**
     * push current url without query params
     */
    pushWithoutQuery() {

        AppHistory.history.push(WindowLocationUtils.getPathname());
    }
};
