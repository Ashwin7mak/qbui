/*
 The purpose of this module is to process /apps/<id>/ api requests.
 */
(function() {
    'use strict';

    let env = require('../../config/environment');
    let defaultRequest = require('../../requestClient').getClient(env);
    let Promise = require('bluebird');
    let log = require('../../logger').getLogger();
    let _ = require('lodash');

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
             * @param includeQueryParameters
             * @returns Promise
             */
            fetchFields: function(req, includeQueryParameters) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                if (req.params && req.params.fieldId) {
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url, req.params.fieldId);
                } else {
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                }

                //  Include query parameters only when instructed to do so
                if (includeQueryParameters === true) {
                    //  any request parameters to append?
                    let search = url.parse(req.url).search;
                    if (search) {
                        opts.url += search;
                    }
                }

                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Function to fetch schema for all fields that belong to a table
             * Helper method that internally uses fetchFields without expecting
             * the caller to create the url for the table.
             * @param req
             * @param tableId
             * @returns {Promise}
             */
            getFieldsForTable:function(req, tableId) {
                //get fields
                return new Promise((resolve, reject) =>{
                    let tablesRootUrl = routeHelper.getTablesRoute(req.url, tableId);
                    let fieldsRootUrl = routeHelper.getFieldsRoute(tablesRootUrl);

                    let getFieldReq = _.clone(req);
                    getFieldReq.url = fieldsRootUrl;
                    this.fetchFields(getFieldReq).then(
                        (fieldsResponse) => {
                            let fields = JSON.parse(fieldsResponse.body);
                            resolve(fields);
                        },
                        (error) => {
                            log.error({req: req}, "tablesApi.getFieldsForTable(): Error getting field schema from core");
                            reject(error);
                        }
                    );
                });
            },

            createField: function(req) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            let fieldId = null;
                            if (response.body) {
                                fieldId = JSON.parse(response.body).id;
                            }
                            resolve(fieldId);
                        },
                        (error) => {
                            log.error({req: req}, "fieldsApi.createField(): Error creating field on core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('fieldsApi.createField(): unexpected error creating field on core', ex, true);
                        reject(ex);
                    });
                });
            },

            patchField: function(req, tableId, fieldId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url, tableId, fieldId);
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            log.error({req: req}, "fieldsApi.patchField(): Error patching field on core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('fieldsApi.patchField(): unexpected error patching field on core', ex, true);
                        reject(ex);
                    });
                });
            },
            getField: function(req, tableId, fieldId) {
                return new Promise((resolve, reject) => {
                    let opts = requestHelper.setOptions(req);
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url, tableId, fieldId);
                    requestHelper.executeRequest(req, opts).then(
                        (response) => {
                            resolve(JSON.parse(response.body));
                        },
                        (error) => {
                            log.error({req: req}, "fieldsApi.getField(): Error getting field from core");
                            reject(error);
                        }
                    ).catch((ex) => {
                        requestHelper.logUnexpectedError('fieldsApi.getField(): unexpected error getting field from core', ex, true);
                        reject(ex);
                    });
                });
            }
        };

        return fieldsApi;

    };
}());
