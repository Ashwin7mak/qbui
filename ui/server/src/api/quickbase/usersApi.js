/*
 The purpose of this module is to process /ticket api requests.
 */
(function() {
    'use strict';

    let env = require('../../config/environment');
    let defaultRequest = require('../../requestClient').getClient(env);
    let perfLogger = require('../../perfLogger');
    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');
        let cookieUtils = require('../../utility/cookieUtils');
        let ob32Utils = require('../../utility/ob32Utils');
        let request = defaultRequest;

        let usersApi = {

            /**
             * Allows you to override the request object
             * @param requestOverride
             */
            setRequestObject: function(requestOverride) {
                request = requestOverride;
            },
            /**
             * Allows you to override the requestHelper object
             * @param requestRequestOverride
             */
            setRequestHelperObject: function(requestHelperOverride) {
                requestHelper = requestHelperOverride;
            },

            /**
             * Get requesting user's meta data.
             * @param req
             * @returns {Promise}
             */
            getReqUser: function(req) {
                return new Promise((resolve, reject) => {
                    let ticket = req.cookies[constants.COOKIES.TICKET];
                    if (!ticket) {
                        ticket = req.headers.ticket;
                    }
                    if (ticket) {
                        let userId = cookieUtils.getUserId(ticket);
                        this.getUserById(req, userId).then(function(response) {
                            resolve(response);
                        },
                        function(error) {
                            log.error({req: req}, "usersApi.getReqUser(): Error retrieving user.");
                            reject(error);
                        }).catch(function(error) {
                            requestHelper.logUnexpectedError('usersApi..getReqUser', error, true);
                            reject(error);
                        });
                    }
                });
            },
            /**
             * Given a userId get that user's meta data.
             * @param req
             * @param userId
             * @returns {Promise}
             */
            getUserById: function(req, userId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req, true);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    if (routeHelper.isAdminRoute(req.url)) {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getUsersRouteForAdmin(req.url, userId);
                    } else {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getUsersRoute(req.url, userId);
                    }
                    //  make the api request to get the user object
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let user = JSON.parse(response.body);
                            resolve(user);
                        },
                        (error) => {
                            log.error({req: req}, "usersApi.getUserById(): Error retrieving user for userId:" + userId);
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('usersApi.getUserById(): unexpected error fetching user', ex, true);
                        reject(ex);
                    });
                });
            }
        };
        return usersApi;
    };
}());
