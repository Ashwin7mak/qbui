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
(function () {
    'use strict';
    var Promise = require('bluebird');
    var request = require('request');
    module.exports = function (config) {
        var requestHelper = require('./requestHelper')(config);
        var recordFormatter = require('./recordFormatter')();

        //Module constants:
        var PHONE_NUMBER = 'PHONE_NUMBER';
        var SLASH = '/';
        var FIELDS = 'fields';
        var RECORDS = 'records';
        var RECORD = 'record';
        var CONTENT_TYPE = 'Content-Type';
        var APPLICATION_JSON = 'application/json';
        var FORMAT = 'format';
        var DISPLAY = 'display';
        var RAW = 'raw';

        //Given an array of records and array of fields, remove any fields
        //not referenced in the records
        function removeUnusedFields(record, fields) {
            var returnFields = fields;
            if(record && fields &&
                record.length != fields.length) {
                returnFields = [];
                for (var v in record) {
                    var f = findFieldById(v.id, fields);
                    if(f) {
                        returnFields.push(f);
                    }
                }
            }
            return returnFields;
        }

        //Given a field id and collection of fields, find and return the field ID
        function findFieldById(fieldId, fields) {
            for(var f in fields) {
                if(f.id === fieldId) {
                    return f;
                }
            }
        }

        //the immediately resolve flag is set, resolve the deferred without making a call
        function executeRequest(opts, immediatelyResolve) {
            var deferred = Promise.pending();
            if(immediatelyResolve) {
                deferred.resolve(null);
            } else {
                request(opts, function(error, response) {
                    if(error) {
                        deferred.reject(new Error(error));
                    } else if (response.statusCode != 200) {
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }
                });
            }
            return deferred.promise;
        }

        //TODO: only application/json is supported for content type.  Need a plan to support XML
        var recordsApi = {
            fetchSingleRecordAndFields: function(req) {
                var deferred = Promise.pending();
                Promise.all([
                    this.fetchRecords(req),
                    this.fetchFields(req)
                ]).then(function(response) {
                    var record = JSON.parse(response[0].body);
                    var responseObject;
                    if(req.param(FORMAT) === RAW) {
                        //return raw undecorated record values due to flag format=raw
                        responseObject = record;
                    } else {
                        //response object will include a fields meta data block plus record values
                        var fields = removeUnusedFields(record, JSON.parse(response[1].body));
                        //format records for display if requested with the flag format=display
                        if(req.param(FORMAT) === DISPLAY) {
                            //display format the record field values
                            record = recordFormatter.formatRecords([record], fields)[0];
                        }
                        responseObject = {};
                        responseObject[FIELDS] = fields;
                        responseObject[RECORD] = record;
                    }
                    deferred.resolve(responseObject);
                }).catch(function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //Returns a promise that is resolved with the records and fields meta data
            //or is rejected with a descriptive error code
            fetchRecordsAndFields: function(req) {
                var deferred = Promise.pending();
                Promise.all([
                    this.fetchRecords(req),
                    this.fetchFields(req)
                ]).then(function(response) {
                    var records = JSON.parse(response[0].body);
                    var responseObject;
                    if(req.param(FORMAT) === RAW) {
                        //return raw undecorated record values due to flag format=raw
                        responseObject = records;
                    } else {
                        //response object will include a fields meta data block plus record values
                        var fields = removeUnusedFields(records[0], JSON.parse(response[1].body));
                        //format records for display if requested with the flag format=display
                        if(req.param(FORMAT) === DISPLAY) {
                            //display format the record field values
                            records = recordFormatter.formatRecords(records, fields);
                        }
                        responseObject = {};
                        responseObject[FIELDS] = fields;
                        responseObject[RECORDS] = records;
                    }
                    deferred.resolve(responseObject);
                }).catch(function(error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },

            //Returns a promise that is resolved with the records array or rejected with an error code
            fetchRecords: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                return executeRequest(opts);
            },

            //Returns a promise that is resolved with the table fields or rejected with an error code
            fetchFields: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.url = opts.url.substring(0, opts.url.indexOf(RECORDS)) + FIELDS;
                return executeRequest(opts, (req.param(FORMAT) === RAW));
            }
        };
        return recordsApi;
    }
}());
