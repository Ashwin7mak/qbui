//
import cookie from 'react-cookie';
import constants from './constants';
import axios from 'axios';
import Configuration from '../config/app.config';
import StringUtils from '../utils/stringUtils';
import WindowLocationUtils from '../utils/windowLocationUtils';
import uuid from 'uuid';

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
     * Http patch request
     *
     * @param url - request url.  Can be relative or set to explicit domain
     * @param data - optional data properties
     * @param conf - optional http header configuration
     * @returns {*} - promise
     */
    patch(url, data, conf) {
        let config = conf || {};
        return axios.patch(url, data, config);
    }

    /**
     * Http delete request
     *
     * @param url - request url.  Can be relative or set to explicit domain
     * @param conf - optional http header configuration
     * @returns {*} - promise
     */
    delete(url, conf) {
        let config = conf || {};
        return axios.delete(url, config);
    }

    deleteBulk(url, conf) {
        let config = conf || {};
        return axios.delete(url, config);
    }

    /**
     * Axiom interceptor for all http requests -- add a session tracking id and session ticket
     */
    setRequestInterceptor() {
        axios.interceptors.request.use(config => {
            //  a unique id per request
            config.headers[constants.HEADER.SESSION_ID] = uuid.v1();
            //  not including now, but this is where we would add another header
            //  if want to send unique id per user session --> config.uid

            let ticket = this.getCookie(constants.COOKIE.TICKET);
            if (ticket) {
                config.headers[constants.HEADER.TICKET] = ticket;
            }
            return config;
        });
    }

    /**
     * Axiom interceptor for all http responses
     */
    setResponseInterceptor() {
        let self = this;
        axios.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                self.checkResponseStatus(error);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Check the response status
     *
     * @param error
     */
    checkResponseStatus(error) {
        //  A 401 exception (no ticket) is immediately redirected to a login page so that the
        //  user can enter in their credentials.
        //
        //  All other errors are handled on a case by case basis at the action or service layer
        //  as how the error is communicated back to the user is predicated on the context..
        switch (error.status) {
        case 401:   // invalid/no ticket
            let currentStackSignInUrl = Configuration.unauthorizedRedirect || this.constructRedirectUrl();
            WindowLocationUtils.update(currentStackSignInUrl);
            break;
        }
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

    /**
     * Construct a redirect url so that the user is sent to the login page and then redirected back to where they were prior to unauthorized error
     * This method is only hit if the unauthorizedRedirect value in the current runtime environment for app.config.js is null
     *
     * First we store the only constant part of the string, the current stacks endpoint and parameter arguments
     * Then we create a variable to store where the user was trying to get to (window.location.href) so that our redirect url can have the user sent back there
     * To find the hostname for current stack, we can do a string replace on the current window.location.hostname value and strip out ".newstack"
     * Now we combine these 3 values with an https to construct the full redirect url.
     *
     * example prod output: team.quickbase.com/db/main?a=nsredirect&nsurl=https://team.newstack.quickbase.com/apps
     */
    constructRedirectUrl() {
        let currentStackSignInUrl = "/db/main?a=nsredirect&nsurl=";
        let newStackDestination = WindowLocationUtils.getHref();
        let currentStackDomain = WindowLocationUtils.getSubdomain() + ".quickbase.com";
        currentStackSignInUrl = "https://" + currentStackDomain + currentStackSignInUrl + newStackDestination;
        return currentStackSignInUrl;
    }

}

export default BaseService;
