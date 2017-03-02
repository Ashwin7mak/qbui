/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');
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

            getCurrentUser: function(req) {
                let ticketCookie = req.cookies[constants.COOKIES.TICKET];
                if (ticketCookie) {
                    let userId = ob32Utils.decoder(cookieUtils.breakTicketDown(ticketCookie, 2));
                    return this.getUserById(req, userId);
                }
            },
            getUserById: function(req, userId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getUsersRoute(req.url, userId);

                    //  make the api request to get the app
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let user = JSON.parse(response.body);
                            resolve(user);
                        },
                        (error) => {
                            log.error({req: req}, "usersApi.getUserById(): Error retrieving user for id: " + userId);
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
