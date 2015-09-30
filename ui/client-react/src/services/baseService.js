//
import cookie from 'react-cookie';
import uuid from 'uuid';
import constants from './constants';
import axios from 'axios';
import Configuration from '../config/app.config';

class BaseService {

    constructor() {
        this.baseUrl = '/api/api/' + Configuration.api.version + '/';
        this.setRequestInterceptor();
        this.setResponseInterceptor();
    }

    getCookie(cookieName) {
        return cookie.load(cookieName);
    }

    /**
     * Http get request for the given url
     *
     * @param url - request url.  Can be relative or set to explicit domain
     * @param conf - optional http header configuration
     * @returns {*} - promise
     */
    get(url, conf) {
        let config = conf || {};
        return axios.get(this.baseUrl + url, config);
    }

    /**
     * Axiom interceptor for all http requests -- add a session tracking id and session ticket
     */
    setRequestInterceptor() {
        axios.interceptors.request.use(function (config) {
            config.headers[constants.HEADER.SESSION] = uuid.v1();
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
            function (response) {
                //  success
                return response;
            },
            function (error) {
                switch (error.status) {
                    //TODO: not sure if this is okay to do or not...
                    case 400:
                        window.location.href = "/pageNotFound";
                        break;
                    case 401:
                        window.location.href = "/unauthorized";
                        break;
                    case 403:
                        window.location.href = "/unauthorized";
                        break;
                    case 404:
                        window.location.href = "/pageNotFound";
                        break;
                    case 500:
                        window.location.href = "/internalServerError";
                        break;
                }
                return Promise.reject(error);
            }
        );
    }



}

export default BaseService;