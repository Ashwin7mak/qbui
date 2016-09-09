/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let defaultRequest = require('request');
    let perfLogger = require('../../perfLogger');
    var httpStatusCodes = require('../../constants/httpStatusCodes');

    module.exports = function(config) {
        var requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        var constants = require('../../../../common/src/constants');

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        var request = defaultRequest;

        //TODO: only application/json is supported for content type.  Need a plan to support XML
        var appsApi = {

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
             *
             * @param req
             * @returns Promise
             */
            getAppUsers: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                return requestHelper.executeRequest(req, opts);
            }

        };
        return appsApi;
    };
}());
