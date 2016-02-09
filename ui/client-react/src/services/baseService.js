//
import cookie from 'react-cookie';
import constants from './constants';
import axios from 'axios';
import Configuration from '../config/app.config';
import Promise from 'bluebird';
import StringUtils from '../utils/stringUtils';

class BaseService {

    constructor() {
        this.setRequestInterceptor();
        this.setResponseInterceptor();
    }

    /**
     * Get the cookie in string format.
     *
     * @param cookieName
     * @returns {*} - cookie
     */
    getCookie(cookieName) {
        return cookie.load(cookieName);
    }

    /**
     * Http get request
     *
     * @param url - request url.  Can be relative or set to explicit domain
     * @param conf - optional http header configuration
     * @returns {*} - promise
     */
    get(url, conf) {
        let config = conf || {};
        return axios.get(url, config);
    }

    /**
     * Http post request
     *
     * @param url - request url.  Can be relative or set to explicit domain
     * @param data - optional data properties
     * @param conf - optional http header configuration
     * @returns {*} - promise
     */
    post(url, data, conf) {
        let config = conf || {};
        return axios.post(url, data, config);
    }

    /**
     * Axiom interceptor for all http requests -- add a session tracking id and session ticket
     */
    setRequestInterceptor() {
        axios.interceptors.request.use(function(config) {
            config.headers[constants.HEADER.SESSION_ID] = Configuration.sid;
            let ticket = this.getCookie(constants.COOKIE.TICKET);
            if (ticket) {
                config.headers[constants.HEADER.TICKET] = ticket;
            }
            return config;
        }.bind(this));
    }

    /**
     * Axiom interceptor for all http responses
     */
    setResponseInterceptor() {
        axios.interceptors.response.use(
            function success(response) {
                //  success
                return response;
            },
            function fail(error) {
                switch (error.status) {
                case 400:
                    window.location.href = '/pageNotFound';
                    break;
                case 401:
                    window.location.href = '/unauthorized';
                    break;
                case 403:
                    window.location.href = '/unauthorized';
                    break;
                case 404:
                    //window.location.href = '/pageNotFound';
                    break;
                case 500:
                    window.location.href = '/internalServerError';
                    break;
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Takes a tokenized url string and replaces each token element with the content of
     * the corresponding array element using the array's zero based index.
     *
     * Example1:
     *      constructUrl('/api/v1/apps/{0}/tables/{1}',['123abc456', '234xyz456'])
     *        outputs
     *      /api/v1/apps/123abc456/tables/234xyz456
     *
     * Example2:
     *      constructUrl('/api/v1/apps/{0}/tables/{0}/reports/{1}',['123abc456', 'xyz123'])
     *        outputs
     *      /api/v1/apps/123abc456/tables/123abc456/reports/xyz123
     *
     * @param urlMask
     * @tokens array of tokens
     * @returns urlMask input with tokens replaced
     */
    constructUrl(urlMask, tokens) {
        return StringUtils.format(urlMask, tokens);
    }

}

export default BaseService;
