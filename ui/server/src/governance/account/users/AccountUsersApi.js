/*
 The purpose of this module is to process governance api requests for users in an account.
 */
(function() {
    'use strict';

    let httpStatusCodes = require('../../../constants/httpStatusCodes');
    let consts = require('../../../../../common/src/constants');

    module.exports = function(config) {

        let requestHelper = require('../../../api/quickbase/requestHelper')(config);
        let routeHelper = require('../../../routes/routeHelper');

        let accountUsersAPI = {

            /**
             * Allows you to override the requestHelper object
             * @param requestHelperOverride
             */
            setRequestHelperObject: function(requestHelperOverride) {
                requestHelper = requestHelperOverride;
            },

            /**
             * Get all the users in the account. Resolve either the dummy data or the actual one
             * @param req
             * @param accountId
             * @returns {Promise}
             */
            getAccountUsers: function(req, accountId) {
                let opts = requestHelper.setOptions(req, false, true);
                let host = requestHelper.getLegacyRealmBase(req, false);

                opts.headers.host = host;
                opts.url =  (config.isMockServer ? consts.PROTOCOL.HTTP : consts.PROTOCOL.HTTPS) + host + routeHelper.getAccountUsersLegacyStackRoute(accountId);

                return requestHelper
                    .executeRequest(req, opts)
                    .then((response) => {
                        return JSON.parse(response.body);
                    })
                    .catch((ex) => {
                        requestHelper.logUnexpectedError('getAccountUsers.getAccountUsers(): unexpected error retrieving account users.', ex, true);
                        throw ex;
                    });
            }
        };

        return accountUsersAPI;
    };

}());
