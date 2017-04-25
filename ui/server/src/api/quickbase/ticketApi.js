/*
 The purpose of this module is to process /ticket api requests.
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

        let ticketApi = {

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
             * Given a realmId get the logged in user's meta data.
             * NOTE: This api is NOT available in prod and is only available for debugging purposes.
             * @param req
             * @param realmId
             * @returns {Promise}
             */
            whoAmI: function(req, realmId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getWhoAmIRoute(req.url);
                    requestHelper.addQueryParameter(opts, constants.REQUEST_PARAMETER.REALM_ID, realmId);
                    //  make the api request to get the user object
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let user = JSON.parse(response.body);
                            resolve(user);
                        },
                        (error) => {
                            log.error({req: req}, "ticketApi.whoAmI(): Error retrieving user for ticket.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('ticketApi.whoAmI(): unexpected error fetching user', ex, true);
                        reject(ex);
                    });
                });
            }
        };
        return ticketApi;
    };
}());
