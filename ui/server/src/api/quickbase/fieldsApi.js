/*
 The purpose of this module is to process /apps/<id>/ api requests.
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

        let fieldsApi = {

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
             * Fetch the requested field meta data for a table.
             *
             * @param req
             * @returns Promise
             */
            fetchFields: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                if (req.params.fieldId) {
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url, req.params.fieldId);
                } else {
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                }

                //  any request parameters to append?
                let search = url.parse(req.url).search;
                if (search) {
                    opts.url += search;
                }

                return requestHelper.executeRequest(req, opts);
            }

        };

        return fieldsApi;

    };
}());
