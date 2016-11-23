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
                let isPost = requestHelper.isPost(req);
                let openInMercury = false;
                if (isPost === true) {
                    let resp = JSON.parse(opts.body);
                    //TODO openInMercury should be a common constant
                    //TODO confirm the default behavior if invalid value..
                    if (resp) {
                        openInMercury = resp.openInMercury;
                    }
                }
                opts.url = requestHelper.getLegacyHost() + routeHelper.getApplicationStackRoute(req.params.appId, isPost, openInMercury);

                //return requestHelper.executeRequest(req, opts);
                return Promise.resolve('ok');
            }

        };

        return legacyApi;

    };
}());
