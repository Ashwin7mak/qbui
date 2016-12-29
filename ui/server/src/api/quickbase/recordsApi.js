/*
 The purpose of this module is to process /apps/<id>/tables/<id>/records api requests.  Depending
 on request flags, this may involve proxying requests to /apps/<id>/tables/<id>/records but
 may also involve making an additional request to /apps/<id>/tables/<id>/fields for the purpose
 of including fields meta data in the records response or to resolve display formats for
 the purpose of record formatting in the case where the display-format flag has been set.

 The endpoint accepts a flag used for formatting the response, the flag is called 'format' and valid
 values include 'raw' and 'display';

 1) If the flag is not provided, record values are returned in raw form, which is to say that they are
 not formatted for display.  Included in the response object are the records but also relevant fields
 meta data which is useful to clients who perform formatting or other operation on the record data. This
 response is of the form:

 {
 "fields" : [..],
 "records": [..]
 }

 2) If the  flag is provided ?format=display, then record values are provided with the individual
 field values formatted as human readable display-ready strings.  This response also includes fields
 meta data an in the example JSON from the bullet above. The individual record field values would be
 of the form:

 [
 [{ "id":2, "value": 123454, "display": "12-3454"}, ...]
 ...
 ]

 3) IF the flag is provided ?format-raw, then the record values are returned with raw unformatted
 field values and without the fields meta data.  Example JSON would be:

 [
 [ { "id":2, "value": 1234525}, ... ],
 ...
 ]
 */
(function() {
    'use strict';

    let Promise = require('bluebird');
    let defaultRequest = require('request');
    let _ = require('lodash');
    let log = require('../../logger').getLogger();
    let perfLogger = require('../../perfLogger');
    var httpStatusCodes = require('../../constants/httpStatusCodes');
    var recordValidator = require('./validator/recordValidator');

    /*
     * We can't use JSON.parse() with records because it is possible to lose decimal precision as a
     * result of the JavaScript implementation of its single numeric data type. In JS, all numbers are
     * 64 bit floating points where bits 0-51 store values, bits 52-62 store the exponent and
     * bit 63 is the sign bit. This is the IEEE 754 standard. Practically speaking, this means
     * that a java Long, which uses all bits 0-62 to store values, cannot be expressed in a JS
     * number without a loss of precision.  For this reason, we use a special implementation of
     * JSON.parse/stringify that depends on an implementation of BigDecimal, which is capable of
     * expressing all the precision of numeric values we expect to get from the java capabilities
     * APIs.  This is slower than using JSON.parse/stringify, but is necessary to avoid the loss
     * of precision. For more info, google it!
     */
    var jsonBigNum = require('json-bignum');

    module.exports = function(config) {
        var requestHelper = require('./requestHelper')(config);
        let fieldsApi = require('./fieldsApi')(config);
        let routeHelper = require('../../routes/routeHelper');
        var recordFormatter = require('./formatter/recordFormatter')();
        var constants = require('../../../../common/src/constants');
        var url = require('url');

        var FIELDS = 'fields';
        var RECORD = 'record';
        var RECORDS = 'records';
        var GROUPS = 'groups';
        var FILTERED_RECORDS_COUNT = 'filteredCount';
        var request = defaultRequest;

        //TODO: only application/json is supported for content type.  Need a plan to support XML
        var recordsApi = {

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

            fetchFields: function(req) {
                return fieldsApi.fetchFields(req);
            },

            /**
             * Fetch a single record and associated fields meta data from a table.
             *
             * @param req
             * @returns Promise
             */
            fetchSingleRecordAndFields: function(req) {
                return new Promise(function(resolve, reject) {
                    var fetchRequests = [this.fetchRecords(req), this.fetchFields(req)];

                    Promise.all(fetchRequests).then(
                        function(response) {
                            var record = jsonBigNum.parse(response[0].body);
                            var responseObject;

                            //return raw undecorated record values due to flag format=raw
                            if (requestHelper.isRawFormat(req)) {
                                responseObject = record;
                            } else {
                                //response object will include a fields meta data block plus record values
                                var fields = fieldsApi.removeUnusedFields(record, JSON.parse(response[1].body));

                                //format records for display if requested with the flag format=display
                                if (requestHelper.isDisplayFormat(req)) {
                                    record = recordFormatter.formatRecords([record], fields)[0];
                                }

                                responseObject = {};
                                responseObject[FIELDS] = fields;
                                responseObject[RECORD] = record;
                            }

                            resolve(responseObject);

                        },
                        function(response) {
                            reject(response);
                        }
                    ).catch(function(error) {
                        requestHelper.logUnexpectedError('recordsAPI..fetchSingleRecordAndFields', error, true);
                        reject(error);
                    });
                }.bind(this));

            },

            /**
             * Fetch all records and the fields meta data from a table.
             *
             * @param req
             * @returns Promise
             */
            fetchRecordsAndFields: function(req) {
                return new Promise(function(resolve, reject) {
                    var fetchRequests = [this.fetchRecords(req), this.fetchFields(req), this.fetchCountForRecords(req)];

                    Promise.all(fetchRequests).then(
                        function(response) {
                            let responseObject = {};
                            let records = jsonBigNum.parse(response[0].body);

                            //  return raw undecorated record values due to flag format=raw
                            if (requestHelper.isRawFormat(req)) {
                                responseObject = records;
                            } else {
                                //  build empty response object array elements to return
                                responseObject[RECORDS] = [];
                                responseObject[FILTERED_RECORDS_COUNT] = null;

                                let groupedRecords = {};
                                if (requestHelper.isDisplayFormat(req)) {
                                    responseObject[FIELDS] = fieldsApi.removeUnusedFields(records[0], JSON.parse(response[1].body));

                                    //  initialize perfLogger
                                    let perfLog = perfLogger.getInstance();
                                    perfLog.init("RecordsApi..Format Display Records", {req: req, idsOnly: true});

                                    records = recordFormatter.formatRecords(records, responseObject[FIELDS]);
                                    perfLog.log();
                                    //  NOTE: grouping is reporting concept and should not called from this endpoint as
                                    //  output with multiple pages will not page correctly.
                                }

                                responseObject[RECORDS] = records;
                            }

                            if (response[2]) {
                                responseObject[FILTERED_RECORDS_COUNT] = response[2].body;
                            }

                            resolve(responseObject);
                        },
                        function(response) {
                            reject(response);
                        }
                    ).catch(function(error) {
                        requestHelper.logUnexpectedError('recordsAPI..fetchRecordsAndFields', error, true);
                        reject(error);
                    });
                }.bind(this));
            },

            /**
             * Fetch the requested records data for a table.
             *
             * @param req
             * @returns Promise
             */
            fetchRecords: function(req) {

                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                //  get the request parameters
                let search = url.parse(req.url).search;
                let query = url.parse(opts.url, true).query;

                if (req.params && req.params.recordId) {
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url, req.params.recordId);
                } else {
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url);
                }

                //  any request parameters to append?
                if (search) {
                    opts.url += search;
                    //  remove the format display option as that's a node only parameter
                    requestHelper.removeRequestParameter(opts, constants.REQUEST_PARAMETER.FORMAT);
                }

                // Ensure the offset and numRows request parameter is set to either a supplied value or the defaults if invalid or not supplied
                let offset = requestHelper.getQueryParameterValue(opts, constants.REQUEST_PARAMETER.OFFSET);
                let numRows = requestHelper.getQueryParameterValue(opts, constants.REQUEST_PARAMETER.NUM_ROWS);
                if (offset === null || numRows === null || !Number.isInteger(+offset) || !Number.isInteger(+numRows)) {
                    offset = constants.PAGE.DEFAULT_OFFSET;
                    numRows = constants.PAGE.DEFAULT_NUM_ROWS;
                } else {
                    //  make sure the number of rows requested does not exceed the maximum allowed row fetch limit.
                    /*eslint no-lonely-if:0*/
                    if (numRows > constants.PAGE.MAX_NUM_ROWS) {
                        log.warn("Record request number of rows exceeds allowed limit.  Setting to max number of row limit of " + constants.PAGE.MAX_NUM_ROWS);
                        numRows = constants.PAGE.MAX_NUM_ROWS;
                    }
                }

                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Fetch the count of all records that match a user query
             */
            fetchCountForRecords: function(req) {
                let opts = requestHelper.setOptions(req, true);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;

                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsCountRoute(req.url);
                // Set the query parameter
                if (requestHelper.hasQueryParameter(req, constants.REQUEST_PARAMETER.QUERY)) {
                    let queryParam = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.QUERY);
                    opts.url += '?' + constants.REQUEST_PARAMETER.QUERY + '=' + encodeURIComponent(queryParam);
                }

                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Save a single record data to a table.
             *
             * @param req
             * @returns Promise
             */
            saveSingleRecord: function(req) {
                let answer = _validateChanges(req);
                if (answer.length === 0) {
                    var opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    //input expected in raw form for java
                    return requestHelper.executeRequest(req, opts);
                } else {
                    //log each error message
                    answer.forEach((error) => {
                        logRecordError(req, error, 'Invalid input saving record:');
                    });

                    //  return the error information
                    let errCode = httpStatusCodes.INVALID_INPUT;
                    return Promise.reject({response:{message:'validation error', status:errCode, errors: answer}}
                    );
                }
            },

            /**
             * Create a single record data add to a table.
             *
             * @param req
             * @returns Promise
             */
            createSingleRecord: function(req) {
                let answer = _validateChanges(req);
                if (answer.length === 0) {
                    var opts = requestHelper.setOptions(req);
                    opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                    //input expected in raw form for java
                    return requestHelper.executeRequest(req, opts);
                } else {
                    //log each error message individually
                    answer.forEach((error) => {
                        logRecordError(req, error, 'Invalid input creating record:');
                    });

                    //  return the error information
                    let errCode = httpStatusCodes.INVALID_INPUT;
                    return Promise.reject({response:{message:'validation error', status:errCode, errors: answer}}
                    );
                }
            },

            /**
             * Delete a single record on a table
             *
             * @param req
             * @returns Promise
             */
            deleteSingleRecord: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Delete record or records in bulk on a table
             *
             * @param req
             * @returns Promise
             */
            deleteRecordsBulk: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[constants.CONTENT_TYPE] = constants.APPLICATION_JSON;
                return requestHelper.executeRequest(req, opts);
            }

        };
        return recordsApi;
    };

    /**
     * Validate changes to a record  basic checks for boundaries/types etc
     *
     * @param req
     * @returns {Array}
     * @private
     */
    function _validateChanges(req) {
        let errors = [];

        if (req.body && req.body.length) {
            //look at each change
            req.body.forEach((change) => {
                if (change && change.fieldDef) {
                    // validate it
                    let results = recordValidator.checkFieldValue(change, change.fieldName, change.value, true);
                    if (results.isInvalid) {
                        errors.push(results);
                    }
                }
            });
        }
        return errors;
    }

    /**
     * Log information about a log message when adding or editing a record
     *
     * @param req
     * @param error
     * @param msgPrefix
     */
    function logRecordError(req, error, msgPrefix) {
        // make a copy of the error object and then remove the
        // def property as it could contain customer sensitive
        // information in the fieldDef array.
        if (error) {
            let errorObj = _.clone(error);
            delete errorObj.def;
            log.warn({req: req}, msgPrefix + JSON.stringify(errorObj).replace(/"/g, "'"));
        }
    }
}());
