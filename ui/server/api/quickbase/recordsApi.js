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
        var groupFormatter = require('./formatter/groupFormatter');
        var recordFormatter = require('./formatter/recordFormatter')();
        var constants = require('./../constants');

        //Module constants:
        var APPLICATION_JSON = 'application/json';
        var CONTENT_TYPE = 'Content-Type';

        var FIELDS = 'fields';
        var RECORD = 'record';
        var RECORDS = 'records';
        var REPORTS = 'reports';
        var GROUPS = 'groups';
        var REPORTCOMPONENTS = 'reportcomponents';
        var RESULTS = 'results';
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
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;

                let inputUrl = opts.url; //JAVA api is case sensitive so dont loose camel case here.
                let inputUrl_toLower = opts.url.toLowerCase(); // but for convinience of string matches convert to lower case

                //the request came in for report/{reportId}/results.
                // Convert that to report/{reportId}/facets/results to get facets data
                if (inputUrl_toLower.indexOf(REPORTCOMPONENTS) !== -1) {
                    // this bypass is for grouping but in ag-grid
                    // change url from .../reports/<id>/reportcomponents?sortList=..
                    // to .../records?sortList=.. because /reports/results api does not support sortList param.
                    if (inputUrl_toLower.indexOf(constants.REQUEST_PARAMETER.SORT_LIST.toLowerCase()) !== -1) {
                        let reportIndex = inputUrl_toLower.indexOf(REPORTS);
                        let paramsIndex = inputUrl_toLower.indexOf("?"); // get the index for url params starting after ?
                        opts.url = inputUrl.substring(0, reportIndex) + RECORDS + inputUrl.substring(paramsIndex);
                    } else {
                        opts.url = inputUrl.substring(0, inputUrl_toLower.indexOf(REPORTCOMPONENTS)) + RESULTS;
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
                var inputUrl = opts.url.toLowerCase();

                //If the endpoint provided is the records or report execution endpoint,
                // replace records or reports with the /fields path
                if (inputUrl.indexOf(RECORDS) !== -1) {
                    opts.url = inputUrl.substring(0, inputUrl.indexOf(RECORDS)) + FIELDS;
                } else if (inputUrl.indexOf(REPORTS) !== -1) {
                    opts.url = inputUrl.substring(0, inputUrl.indexOf(REPORTS)) + FIELDS;
                }

                //TODO: why do we immediately resolve if the format is raw?
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
                var responseObject;
                //convert data to raw form for java if not already in raw form?
                // var record = jsonBigNum.parse(req[0].body);
                // send put to server to update the record and return the result promise
                return requestHelper.executeRequest(req, opts);
            },

        };
        return recordsApi;
    };
}());
