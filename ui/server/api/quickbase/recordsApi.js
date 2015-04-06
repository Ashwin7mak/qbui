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
 meta data which is useful to clients who perform formatting or other orperation on the record data. This
 response is of the form:

    {
        "fields" : [..],
        "records": [..]
    }

 2) If the  flag is provided ?format=display, then record values are provided with the indivudual
 field values formatted as human readable display-ready strings.  This response also includes fields
 meta data an in the example JSON from the bullet above.

 3) IF the flag is provided ?format-raw, then the record values are returned with raw unformatted
 field values and without the fields meta data.  Example JSON would be:

    [
        [ { "id":2, "value": 1234525}, ... ],
        ...
    ]
 */
(function () {
    'use strict';
    var q = require('q');
    var request = require('request');

    module.exports = function (config) {
        var requestHelper = require('./requestHelper')(config);

        //Module constants:
        //TODO: Should these move? Where to?
        var OPEN_PAREN = '(';
        var CLOSE_PAREN = ') ';
        var DASH = '-';
        var PHONE_NUMBER = 'PHONE_NUMBER';
        var SLASH = '/';
        var FIELDS = 'fields';
        var RECORDS = 'records';
        var CONTENT_TYPE = 'Content-Type';
        var APPLICATION_JSON = 'application/json';
        var FORMAT = 'format'
        var DISPLAY = 'display';
        var RAW = 'raw';

        //Given a collection of records, fields, and the request context, format the record values for display
        function formatRecords(records, fields, req) {
            if(records && fields && req) {
                var fieldsMap = {};
                var formattedRecords = [];
                fields.forEach(function(entry) {
                    fieldsMap[entry.id.toString()] = entry;
                });
                records.forEach(function(record) {
                    var formattedRecord = [];
                    record.forEach(function(fieldValue) {
                        formattedRecord.push(
                            formatRecordValue(fieldValue, fieldsMap[fieldValue.id.toString()])
                        );
                    });
                    formattedRecords.push(formattedRecord);
                });
                return formattedRecords;
            }
            return records;
        }

        //Display formats record field values according to the field's display settings
        function formatRecordValue(fieldValue, fieldInfo) {
            switch(fieldInfo.type) {
                case PHONE_NUMBER:
                    fieldValue.value = formatPhoneNumber(fieldValue, fieldInfo);
                    break;
                default:
                    break;
            }
            return fieldValue;
        }

        //TODO: this is an example of a formatting method that could be used on the client if we can package it up
        //Given a raw number as input, formats as a legacy QuickBase phone number. Note, not internationalized
        function formatPhoneNumber(fieldValue, fieldInfo) {
            if(!fieldValue || !fieldValue.value) {
                return null;
            }
            var baseValue = fieldValue.value;
            var len = baseValue.length;
            var areaCode = '';
            var centralOffice = '';
            var finalFour = '';
            //slice positions in raw string:
            var final4Start = len - 4;
            var middle3Start = len - 7;
            var first3Start = len - 10;
            //If there are 4 or more characters, grab them
            if(final4Start >= 0) {
                finalFour = baseValue.slice(final4Start);
                //If there are more than 4 chars, parse the middle chars and insert the '-'
                if(final4Start > 0) {
                    var startIndex = middle3Start;
                    if(startIndex < 0) {
                        startIndex = 0;
                    }
                    centralOffice = baseValue.slice(startIndex, final4Start) + DASH;
                    //if there are more than 7 chars, parse and insert the parens
                    if(middle3Start > 0) {
                        startIndex = first3Start;
                        if(first3Start < 0) {
                            startIndex = 0;
                        }
                        areaCode = OPEN_PAREN + baseValue.slice(startIndex, middle3Start) + CLOSE_PAREN;
                    }
                }
            } else {
                finalFour = fieldValue.value;
            }
            //Concatenate & return results
            return areaCode + centralOffice + finalFour;
        }


        //Given an array of records and array of fields, remove any fields
        //not referenced in the records
        function removeUnusedFields(records, fields) {
            var returnFields = fields;
            if(records && fields &&
                records.length > 0 &&
                records[0].length != fields.length) {
                returnFields = [];
                for (var v in records[0]) {
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

        //TODO: only application/json is supported for content type.  Need a plan to support XML
        var recordsApi = {
            //Returns a promise that is resolved with the records and fields meta data
            //or is rejected with a descriptive error code
            fetchRecordsAndFields: function(req) {
                var deferred = q.defer();
                var context = this;
                q.all([
                    this.fetchRecords(req),
                    this.fetchFields(req)
                ]).then(
                    //success callback
                    function(response){
                        var records = JSON.parse(response[0].body);
                        var responseObject;
                        if(req.param(FORMAT) === RAW) {
                            //return raw undecorated record values due to flag format=raw
                            responseObject = records;
                        } else {
                            //response object will include a fields meta data block plus record values
                            var fields = removeUnusedFields(records, JSON.parse(response[1].body));
                            //format records for display if requested with the flag format=display
                            if(req.param(FORMAT) === DISPLAY) {
                                //display format the record field values
                                records = formatRecords(records, fields, req);
                            }
                            responseObject = {};
                            responseObject[FIELDS] = fields;
                            responseObject[RECORDS] = records;
                        }
                        deferred.resolve(responseObject);
                    },
                    //error callback
                    function(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            },

            //Returns a promise that is resolved with the records array or rejected with an error code
            fetchRecords: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                return this.executeRequest(opts);
            },

            //Returns a promise that is resolved with the table fields or rejected with an error code
            fetchFields: function(req) {
                var opts = requestHelper.setOptions(req);
                opts.headers[CONTENT_TYPE] = APPLICATION_JSON;
                opts.url = opts.url.replace(SLASH + RECORDS, SLASH + FIELDS);
                return this.executeRequest(opts, (req.param(FORMAT) === RAW));
            },

            //the immediately resolve flag is set, resolve the deferred without making a call
            executeRequest: function(opts, immediatelyResolve) {
                var deferred = q.defer();
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
        };
        return recordsApi;
    }
}());
