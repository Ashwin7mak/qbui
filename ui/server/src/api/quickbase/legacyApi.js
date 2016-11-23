/*
 TODO
 */
(function() {
    'use strict';

    let defaultRequest = require('request');

    module.exports = function(config) {
        let requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        let constants = require('../../../../common/src/constants');
        let url = require('url');

        let request = defaultRequest;

        let legacyApi = {

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
             * TODO
             *
             * @param req
             * @returns Promise
             */
            stackPreference: function(req) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                //  reset url to call the legacy stack
                let value = opts.body;
                opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackRoute(req.params.appId, requestHelper.isGet(req), value);

                //return requestHelper.executeRequest(req, opts);
                return Promise.resolve('ok');
            }

        };

        return legacyApi;

    };
}());
