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

    var Promise = require('bluebird');
    var defaultRequest = require('request');
    var log = require('../../logger').getLogger();
    var perfLogger = require('../../perfLogger');

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
        let routeHelper = require('../../routes/routeHelper');
        var groupFormatter = require('./formatter/groupFormatter');
        var recordFormatter = require('./formatter/recordFormatter')();
        var constants = require('../../../../common/src/constants');
        var url = require('url');

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        var FIELDS = 'fields';
        var RECORD = 'record';
        var RECORDS = 'records';
        var GROUPS = 'groups';
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
                return req.param(constants.REQUEST_PARAMETER.FORMAT) === 'display';
            },

            isRawFormat: function(req) {
                return req.param(constants.REQUEST_PARAMETER.FORMAT) === 'raw';
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
                    var fetchRequests = [this.fetchRecords(req), this.fetchFields(req)];

                    Promise.all(fetchRequests).then(
                        function(response) {
                            var responseObject;

                            var records = jsonBigNum.parse(response[0].body);
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

                    //  any request parameters to append?
                    if (search) {
                        opts.url += search;
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

                        //  any request parameters to append?
                        if (search) {
                            opts.url += search;
                        }
                    } else {
                        //  not an expected route; set to return all records for the given table
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getRecordsRoute(req.url);
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

                //  get the request parameters
                let search = url.parse(req.url).search;

                if (routeHelper.isFieldsRoute(req.url)) {
                    if (req.params.fieldId) {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url, req.params.fieldId);
                    } else {
                        opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                    }

                    //  any request parameters to append?
                    if (search) {
                        opts.url += search;
                    }
                } else {
                    //  not a fields route; set to return all fields for the given table
                    opts.url = requestHelper.getRequestJavaHost() + routeHelper.getFieldsRoute(req.url);
                }

                return requestHelper.executeRequest(req, opts, this.isRawFormat(req));
            },

            /**
             * Save a single record data to a table.
             *
             * @param req
             * @returns Promise
             */
            saveSingleRecord: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                //input expected in raw form for java
                return requestHelper.executeRequest(req, opts);
            },

            /**
             * Create a single record data add to a table.
             *
             * @param req
             * @returns Promise
             */
            createSingleRecord: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                //input expected in raw form for java
                return requestHelper.executeRequest(req, opts);
            }

        };
        return recordsApi;
    };
}());
