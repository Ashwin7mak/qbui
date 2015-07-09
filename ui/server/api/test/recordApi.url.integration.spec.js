'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');
var testConsts = require('./api.test.constants');

/**
 * Integration test for URL field formatting
 */
describe('API - URL record test cases - ', function () {

    var httpURL = "http://www.intuit.com";
    var httpWOProto = httpURL.split("//")[1];
    var httpsURL = "https://www.google.com";
    var httpsWOProto = httpsURL.split("//")[1];
    var noProtoURL = "www.quickbase.com/some/url/location.html";
    var linkText = "some link text";

    var appWithNoFlags = {
        "name": "URL App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "url",
                    "type": "URL"
                }
         ]}
    ]};

    var appWithDontShowHttpFlag = {
        "name": "URL App - DontShowHttp flag",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "url",
                "type": "URL",
                "displayProtocol": false
            }
            ]}
        ]};

    var appWithAllFlags = {
        "name": "URL App - all flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "url",
                "type": "URL",
                "linkText": linkText,
                "displayProtocol": false
            }
            ]}
        ]};

    /**
    * DataProvider containing Records and record display expectations for URL field with no display props set
    */
    function  noFlagsURLDataProvider(fid) {
        // HTTP URL
        var httpURLInput = [{"id": fid, "value": httpURL}];
        var expectedHttpURLRecord = {"id": fid, "value": httpURL, "display": httpURL};

        // HTTPS URL
        var httpsURLInput = [{"id": fid, "value": httpsURL}];
        var expectedHttpsURLRecord = {"id": fid, "value": httpsURL, "display": httpsURL};

        // No Proto URL
        var noProtoInput = [{"id": fid, "value": noProtoURL}];
        var expectedNoProtoRecord = {"id": fid, "value": noProtoURL, "display": noProtoURL};

        // Null URL
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display http url with no format flags", record: httpURLInput, format: "display", expectedFieldValue: expectedHttpURLRecord },
            { message: "raw http url with no format flags", record: httpURLInput, format: "raw", expectedFieldValue: httpURLInput },
            { message: "display https url with no format flags", record: httpsURLInput, format: "display", expectedFieldValue: expectedHttpsURLRecord },
            { message: "raw https url with no format flags", record: httpsURLInput, format: "raw", expectedFieldValue: httpsURLInput },
            { message: "display no proto url with no format flags", record: noProtoInput, format: "display", expectedFieldValue: expectedNoProtoRecord },
            { message: "raw no proto url with no format flags", record: noProtoInput, format: "raw", expectedFieldValue: noProtoInput },
            { message: "display null url with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null url with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates URL records formatting with no field property flags set
    */
    it('Should create and retrieve url display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsURLDataProvider().length);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var urlField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'url') {
                    urlField = field;
                }
            });
            assert(urlField, 'failed to find url field');
            var records = noFlagsURLDataProvider(urlField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }

                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    /**
    * DataProvider containing Records and record display expectations for URL field with 'Dont Show Http' display prop set
    */
    function  dontShowHttpFlagURLDataProvider(fid) {

        // HTTP URL
        var httpURLInput = [{"id": fid, "value": httpURL}];
        var expectedHttpURLRecord = {"id": fid, "value": httpURL, "display": httpWOProto};

        // HTTPS URL
        var httpsURLInput = [{"id": fid, "value": httpsURL}];
        var expectedHttpsURLRecord = {"id": fid, "value": httpsURL, "display": httpsWOProto};

        // No Proto URL
        var noProtoInput = [{"id": fid, "value": noProtoURL}];
        var expectedNoProtoRecord = {"id": fid, "value": noProtoURL, "display": noProtoURL};

        // Null URL
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display http url with 'dont show http' format flags", record: httpURLInput, format: "display", expectedFieldValue: expectedHttpURLRecord },
            { message: "raw http url with 'dont show http' format flags", record: httpURLInput, format: "raw", expectedFieldValue: httpURLInput },
            { message: "display https url with 'dont show http' format flags", record: httpsURLInput, format: "display", expectedFieldValue: expectedHttpsURLRecord },
            { message: "raw https url with 'dont show http' format flags", record: httpsURLInput, format: "raw", expectedFieldValue: httpsURLInput },
            { message: "display no proto url with 'dont show http' format flags", record: noProtoInput, format: "display", expectedFieldValue: expectedNoProtoRecord },
            { message: "raw no proto url with 'dont show http' format flags", record: noProtoInput, format: "raw", expectedFieldValue: noProtoInput },
            { message: "display null url with 'dont show http' format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null url with 'dont show http' format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates URL records formatting with 'Don't Show HTTP' field property flags set
    */
    it('Should create and retrieve url display records when "dont show http" format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * dontShowHttpFlagURLDataProvider().length);
        recordBase.createApp(appWithDontShowHttpFlag).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var urlField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'url') {
                    urlField = field;
                }
            });
            assert(urlField, 'failed to find url field');
            var records = dontShowHttpFlagURLDataProvider(urlField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }

                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    /**
     * DataProvider containing Records and record display expectations for URL field with all display props set
     */
    function  allFlagsURLDataProvider(fid) {

        // HTTP URL
        var httpURLInput = [{"id": fid, "value": httpURL}];
        var expectedHttpURLRecord = {"id": fid, "value": httpURL, "display": linkText};

        // HTTPS URL
        var httpsURLInput = [{"id": fid, "value": httpsURL}];
        var expectedHttpsURLRecord = {"id": fid, "value": httpsURL, "display": linkText};

        // No Proto URL
        var noProtoInput = [{"id": fid, "value": noProtoURL}];
        var expectedNoProtoRecord = {"id": fid, "value": noProtoURL, "display": linkText};

        // Null URL
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display http url with all format flags", record: httpURLInput, format: "display", expectedFieldValue: expectedHttpURLRecord },
            { message: "raw http url with all format flags", record: httpURLInput, format: "raw", expectedFieldValue: httpURLInput },
            { message: "display https url with all format flags", record: httpsURLInput, format: "display", expectedFieldValue: expectedHttpsURLRecord },
            { message: "raw https url with all format flags", record: httpsURLInput, format: "raw", expectedFieldValue: httpsURLInput },
            { message: "display no proto url with all format flags", record: noProtoInput, format: "display", expectedFieldValue: expectedNoProtoRecord },
            { message: "raw no proto url with all format flags", record: noProtoInput, format: "raw", expectedFieldValue: noProtoInput },
            { message: "display null url with all format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null url with all format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates URL records formatting with all field property flags set
     */
    it('Should create and retrieve url display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsURLDataProvider().length);
        recordBase.createApp(appWithAllFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var urlField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'url') {
                    urlField = field;
                }
            });
            assert(urlField, 'failed to find url field');
            var records = allFlagsURLDataProvider(urlField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
            });

            //When all the records have been created and fetched, assert the values match expectations
            Promise.all(fetchRecordPromises)
                .then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var currentRecord = results[i];
                        if(results[i].record) {
                            currentRecord = results[i].record;
                        }

                        currentRecord.forEach(function (fieldValue) {
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                            }
                        });
                    }
                    done();
                }).catch(function (errorMsg) {
                    assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                    done();
                });
        });
    });

    //Pause between test suites
    afterEach(function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT)
        //Do a JavaScript version of a sleep because our requests per second are being capped
        setTimeout(function() { done(); }, testConsts.AFTER_TEST_SLEEP);
    });

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(20000);
        recordBase.apiBase.cleanup().then(function () {
            done();
        });
    });
});
