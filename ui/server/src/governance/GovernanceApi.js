/*
 The purpose of this module is to process governance api requests for users in an account.
 */
(function() {
    'use strict';

    let perfLogger = require('../perfLogger');
    let httpStatusCodes = require('../constants/httpStatusCodes');
    let log = require('../logger').getLogger();
    let _ = require('lodash');
    let fs = require('fs');
    let consts = require('../../../common/src/constants');

    module.exports = function(config) {

        let requestHelper = require('../api/quickbase/requestHelper')(config);
        let routeHelper = require('../routes/routeHelper');

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
             * @param requestHelperOverride
             */
            setRequestHelperObject: function(requestHelperOverride) {
                requestHelper = requestHelperOverride;
            },

            /**
             * Get the context of the governance
             * @param req
             * @param accountId
             * @returns {Promise}
             */
            getGovernanceContext: function(req, accountId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req, false, true);
                    let host = requestHelper.getLegacyRealmBase(req, false);

                    opts.headers.host = host;
                    opts.url =  consts.PROTOCOL.HTTPS + host + routeHelper.getGovernanceContextLegacyStackRoute(accountId);
                    requestHelper.executeRequest(req, opts).then(
                         (response) => {
                             resolve(JSON.parse(response.body));
                         },
                         (error) => {
                             log.error({req: req}, "getGovernanceContext.getGovernanceContext(): Error retrieving account users.");
                             reject(error);
                         }
                     ).catch((ex) => {
                         requestHelper.logUnexpectedError('getGovernanceContext.getGovernanceContext(): unexpected error retrieving account users.', ex, true);
                         reject(ex);
                     });
                });
            }
        };

        return accountUsersAPI;
    };

}());
