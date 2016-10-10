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
    let dataErrs = require('../../../../common/src/dataEntryErrorCodes');
    var httpStatusCodes = require('../../constants/httpStatusCodes');

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

    //function isInteger(value) {
    //    let int = parseInt(value);
    //    return (typeof int === 'number' && (int % 1) === 0);
    //}

    module.exports = function(config) {
        var requestHelper = require('./requestHelper')(config);
        let routeHelper = require('../../routes/routeHelper');
        var groupFormatter = require('./formatter/groupFormatter');
        var recordFormatter = require('./formatter/recordFormatter')();
        var constants = require('../../../../common/src/constants');
        var url = require('url');

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';
        var CONTENT_LENGTH = 'content-length';

        var FIELDS = 'fields';
        var RECORD = 'record';
        var RECORDS = 'records';
        var GROUPS = 'groups';
        var FILTERED_RECORDS_COUNT = 'filteredCount';
        var request = defaultRequest;

        //Given an array of records and array of fields, remove any fields
        //not referenced in the records
        function removeUnusedFields(record, fields) {
            var returnFields = fields;
            if (record && fields && record.length !== fields.length) {
                returnFields = [];
                for (var idx = 0; idx < record.length; idx++) {
                    var f = findFieldById(record[idx].id, fields);
                    if (f !== null) {
                        returnFields.push(f);
                    }
                }
            }
            return returnFields;
        }

        //Given a field id and collection of fields, find and return the field ID
        function findFieldById(fieldId, fields) {
            for (var idx = 0; idx < fields.length; idx++) {
                if (fields[idx].id === fieldId) {
                    return fields[idx];
                }
            }
            return null;
        }

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

            isDisplayFormat: function(req) {
                return requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.FORMAT) === constants.FORMAT.DISPLAY;
            },

            isRawFormat: function(req) {
                return requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.FORMAT) === constants.FORMAT.RAW;
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
                            if (this.isRawFormat(req)) {
                                responseObject = record;
                            } else {
                                //response object will include a fields meta data block plus record values
                                var fields = removeUnusedFields(record, JSON.parse(response[1].body));

                                //format records for display if requested with the flag format=display
                                if (this.isDisplayFormat(req)) {
                                    record = recordFormatter.formatRecords([record], fields)[0];
                                }

                                responseObject = {};
                                responseObject[FIELDS] = fields;
                                responseObject[RECORD] = record;
                            }

                            resolve(responseObject);

                        }.bind(this),
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
                            var responseObject;

                            var records = jsonBigNum.parse(response[0].body);

                            //  report/results result is an object
                            if (!Array.isArray(records)) {
                                records = records.records;
                            }

                            var groupedRecords;

                            //  return raw undecorated record values due to flag format=raw
                            if (this.isRawFormat(req)) {
                                responseObject = records;
                            } else {
                                //  response object will include a fields meta data block plus record values
                                var fields = removeUnusedFields(records[0], JSON.parse(response[1].body));

                                if (this.isDisplayFormat(req)) {
                                    //  initialize perfLogger
                                    let perfLog = perfLogger.getInstance();
                                    perfLog.init("Format Display Records", {req:req, idsOnly:true});

                                    //  format records for display and log perf stats
                                    records = recordFormatter.formatRecords(records, fields);
                                    perfLog.log();

                                    //  re-init perfLogger
                                    perfLog.init("Build GroupList");

                                    //  if grouping, return a data structure organized according to the
                                    //  grouping requirements and log perf stats
                                    groupedRecords = groupFormatter.group(req, fields, records);
                                    perfLog.log();
                                }

                                responseObject = {};
                                responseObject[FIELDS] = fields;
                                responseObject[RECORDS] = [];
                                responseObject[GROUPS] = [];

                                //  if we are grouping our results, no need to send the flat result set.
                                if (groupedRecords && groupedRecords.hasGrouping === true) {
                                    responseObject[GROUPS] = groupedRecords;
                                } else {
                                    responseObject[RECORDS] = records;
                                }
                            }
                            if (response[2]) {
                                responseObject[FILTERED_RECORDS_COUNT] = response[2].body;
                            }

                            resolve(responseObject);
                        }.bind(this),
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
                // TODO: ENFORCE a row limit on all requests.  Check for offset and numOfRows query parameters and if both
                // are not supplied OR invalid, will set to default values.
                //
                // TODO: if invalid parameters, consider throwing an exception vs setting to defaults
                //
                //let rowLimitsValid = requestHelper.hasQueryParameter(req, constants.REQUEST_PARAMETER.OFFSET) &&
                //    requestHelper.hasQueryParameter(req, constants.REQUEST_PARAMETER.NUM_ROWS);
                //
                //if (rowLimitsValid) {
                //    //  we have row limit parameters..now ensure they are integers
                //    let reqOffset = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.OFFSET);
                //    let reqNumRows = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.NUM_ROWS);
                //    rowLimitsValid = isInteger(reqOffset) && isInteger(reqNumRows);
                //
                //    //  if the max number of records to query exceeds limit, throw exception
                //    if (rowLimitsValid) {
                //        // TODO: look at getting smarter about max row limit...the number of columns on the report should also be considered..
                //        if (parseInt(reqNumRows) > constants.PAGE.MAX_NUM_ROWS) {
                //            let errorMsg = constants.REQUEST_PARAMETER.NUM_ROWS + '=' + reqNumRows + ' request parameter is greater than maximum request limit of ' + constants.PAGE.MAX_NUM_ROWS;
                //            throw errorMsg;
                //        }
                //    }
                //}
                //
                ////  if we don't have valid row limits, then add the default offset and max number of rows.
                //if (!rowLimitsValid) {
                //    requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.OFFSET, constants.PAGE.DEFAULT_OFFSET);
                //    requestHelper.addQueryParameter(req, constants.REQUEST_PARAMETER.NUM_ROWS, constants.PAGE.DEFAULT_NUM_ROWS);
                //}

                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                //  get the request parameters
                let search = url.parse(req.url).search;

                if (routeHelper.isRecordsRoute(req.url)) {
                    if (req.params.recordId) {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url, req.params.recordId);
                    } else {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url);
                    }
                } else {
                    //  if not a records route, check to see if it is a request for reportComponents
                    /*eslint no-lonely-if:0 */
                    if (routeHelper.isReportComponentRoute(req.url)) {
                        //  For a reportComponents endpoint request, if sorting, use the records endpoint, with the
                        //  parameter list to retrieve the data; otherwise use the report/results endpoint.  This is
                        //  necessary as the reports endpoint does not accept request parameters like sortlist.
                        if (search && search.toLowerCase().indexOf(constants.REQUEST_PARAMETER.SORT_LIST.toLowerCase()) !== -1) {
                            opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url);
                        } else {
                            opts.url = requestHelper.getRequestJavaHost() + routeHelper.getReportsResultsRoute(req.url);
                        }
                    } else {
                        //  not an expected route; set to return all records for the given table
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url);
                    }
                }

                //  any request parameters to append?
                if (search) {
                    opts.url += search;
                }

                // TEMPORARY to get grouping to work with core changes...this removes the grouping tags
                // AND paging tags from the opts.url rest request so that core doesn't group.  Grouping
                // is still done in the node layer but since paging is in place, complex grouping will fail.
                // Given the report meta data doesn't have default grouping on prod/pre-prod, and the UI
                // only groups using equals, this should be fine for the interim until a complete solution
                // is implemented.
                let query = url.parse(opts.url, true).query;
                if (query && query.hasOwnProperty(constants.REQUEST_PARAMETER.SORT_LIST)) {
                    let sList = query[constants.REQUEST_PARAMETER.SORT_LIST];
                    if (sList) {
                        let sListArr = sList.split(constants.REQUEST_PARAMETER.LIST_DELIMITER);

                        let sortList = [];
                        sListArr.forEach((sort) => {
                            var sortEl = sort.split(constants.REQUEST_PARAMETER.GROUP_DELIMITER);
                            sortList.push(sortEl[0]);
                        });
                        if (sortList.length > 0) {
                            requestHelper.removeRequestParameter(opts, constants.REQUEST_PARAMETER.SORT_LIST);
                            let sortListStr = sortList.join(constants.REQUEST_PARAMETER.LIST_DELIMITER);
                            opts.url += '&' + constants.REQUEST_PARAMETER.SORT_LIST + '=' + sortListStr;
                        }
                    }
                }

                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Fetch the requested field meta data for a table.
             *
             * @param req
             * @returns Promise
             */
            fetchFields: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                if (routeHelper.isFieldsRoute(req.url)) {
                    if (req.params.fieldId) {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url, req.params.fieldId);
                    } else {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                    }
                } else {
                    //  not a fields route; set to return all fields for the given table
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                }

                //  any request parameters to append?
                let search = url.parse(req.url).search;
                if (search) {
                    opts.url += search;
                }

                return requestHelper.executeRequest(req, opts, this.isRawFormat(req));
            },

            /**
             * Fetch the count of all records that match a user query
             */
            fetchCountForRecords: function(req) {
                let opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsCountRoute(req.url);
                // Set the query parameter
                if (requestHelper.hasQueryParameter(req, constants.REQUEST_PARAMETER.QUERY)) {
                    let queryParam = requestHelper.getQueryParameterValue(req, constants.REQUEST_PARAMETER.QUERY);
                    opts.url += '?' + constants.REQUEST_PARAMETER.QUERY + '=' + queryParam;
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
                let errors = _validateChanges(req);
                if (errors.length === 0) {
                    var opts = requestHelper.setOptions(req);
                    opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                    //input expected in raw form for java
                    return requestHelper.executeRequest(req, opts);
                } else {
                    //return error
                    let errCode = httpStatusCodes.INVALID_INPUT;
                    return Promise.reject({response:{message:'validation error', status:errCode, errors: errors}}
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
                let errors = _validateChanges(req);
                if (errors.length === 0) {
                    var opts = requestHelper.setOptions(req);
                    opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                    //input expected in raw form for java
                    return requestHelper.executeRequest(req, opts);
                } else {
                    //return error
                    let errCode = httpStatusCodes.INVALID_INPUT;
                    return Promise.reject({response:{message:'validation error', status:errCode, errors: errors}}
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
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
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
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
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
            req.body.forEach((change, index) => {
                if (change && change.field) {
                    let field = change.field;

                    //text field length limit
                    if (field.type === "TEXT") {
                        // within max chars?
                        if (field.clientSideAttributes && field.clientSideAttributes.max_chars &&
                            field.clientSideAttributes.max_chars > 0 &&
                            change.value && change.value.length &&
                            change.value.length > field.clientSideAttributes.max_chars) {
                            errors.push({field, type: dataErrs.MAX_LEN_EXCEEDED, hadLength: change.value.length});
                        }
                    }
                    // required field has value?
                    if (field.required && (change.value === undefined || change.value === null || change.value === "" || change.value === false)) {
                        errors.push({field, type: dataErrs.REQUIRED_FIELD_EMPTY});
                    }
                }

            });
        }
        return errors;
    }
}());
