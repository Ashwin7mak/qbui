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

        /**
         * Given an id and collection of fields, search for the id in
         * the collection and return the field if found; otherwise return null.
         *
         * @param fields
         * @param id
         * @returns {*}
         */
        function findFieldById(fields, id) {
            if (Array.isArray(fields)) {
                for (let idx = 0; idx < fields.length; idx++) {
                    if (fields[idx].id === id) {
                        return fields[idx];
                    }
                }
            }
            return null;
        }

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
             * For each field in the given array of fields, search the records array and
             * include in the returned fields array if the field is contained in the records
             * array.  If the field is not in the records array, it will not be included in
             * the returned list.
             *
             * @param array of records
             * @param array of fields
             * @returns array of fields where the field element is found in one of the records
             */
            removeUnusedFields: function(records, fields) {
                let returnFields = fields;
                if (Array.isArray(records) && Array.isArray(fields)) {
                    if (records.length !== fields.length) {
                        returnFields = [];
                        records.forEach((record) => {
                            var field = findFieldById(fields, record.id);
                            if (field !== null) {
                                returnFields.push(field);
                            }
                        });
                    }
                }
                return returnFields;
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
