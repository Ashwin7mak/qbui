/*
 The purpose of this module is to process governance api requests for users in an account.
 */
(function() {
    'use strict';

    let perfLogger = require('../../../../src/perfLogger');
    let httpStatusCodes = require('../../../../src/constants/httpStatusCodes');
    let log = require('../../../../src/logger').getLogger();
    let _ = require('lodash');
    let fs = require('fs');
    let consts = require('../../../../../common/src/constants');

    module.exports = function(config) {

        let requestHelper = require('../../../../src/api/quickbase/requestHelper')(config);
        let routeHelper = require('../../../../src/routes/routeHelper');

        let accountUsersAPI = {

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
             * Get all the users in the account. Resolve either the dummy data or the actual one
             * @param req
             * @param useSSL
             * @returns {Promise}
             */
            getAccountUsers: function(req, accountId) {
                return new Promise((resolve, reject) => {
                    // make a request to the current stack to get the results
                    let opts = requestHelper.setOptions(req, false, true);
                    let host = requestHelper.getLegacyRealmBase(req, false);

                    opts.headers.host = host;
                    opts.url =  consts.PROTOCOL.HTTPS + host + routeHelper.getAccountUsersLegacyStackRoute(accountId);

                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(JSON.parse(response.body));
                        },
                        (error) => {
                            log.error({req: req}, "getAccountUsers.getAccountUsers(): Error retrieving account users.");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('getAccountUsers.getAccountUsers(): unexpected error retrieving account users.', ex, true);
                        reject(ex);
                    });
                });
            }
        };

        return accountUsersAPI;
    };

}());
