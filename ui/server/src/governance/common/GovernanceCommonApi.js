/*
 The purpose of this module is to expose common apis used for governance.
 */
(function() {
    'use strict';

    let httpStatusCodes = require('../../constants/httpStatusCodes');
    let consts = require('../../../../common/src/constants');

    module.exports = function(config) {

        let requestHelper = require('../../api/quickbase/requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');

        let governanceAPI = {

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
             * Get the context of the governance. Returns the Realm, Account, User Information
             * @param req
             * @param accountId
             * @returns {Promise}
             */
            getContext: function(req, accountId) {
                let opts = requestHelper.setOptions(req, false, true);
                let host = requestHelper.getLegacyRealmBase(req, false);

                opts.headers.host = host;
                opts.url = (config.isMockServer ? consts.PROTOCOL.HTTP : consts.PROTOCOL.HTTPS) + host + routeHelper.getGovernanceContextLegacyStackRoute(accountId);

                return requestHelper
                    .executeRequest(req, opts)
                    .then((response) => {
                        return JSON.parse(response.body);
                    })
                    .catch((ex) => {
                        requestHelper.logUnexpectedError("getContext.getContext(): Error retrieving account users.", ex, true);
                        throw ex;
                    });
            }
        };

        return governanceAPI;
    };

}());
