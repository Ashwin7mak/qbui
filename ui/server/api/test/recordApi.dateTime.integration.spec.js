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
 * Integration test for DateTime field formatting
 */
describe('API - DateTime record test cases - ', function () {
    var dateCurrentYear = "2015-04-12T05:51:19Z";
    var dateDiffYear = "2000-04-12T05:51:19Z";
    var UTC = "[UTC]";

    var appWithNoFlags = {
        "name": "DateTime App - no flags",
        "timeZone": "America/New_York",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "dateTime",
                    "type":"SCALAR",
                    "datatypeAttributes": {
                        "type": "DATE_TIME"
                    }
                }
         ]}
    ]};

    var appWithAllFlags_DD_MM_YYYY = {
        "name": "DateTime App - all flags",
        "dateFormat": "dd-MM-uuuu",
        "timeZone": "America/New_York",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "dateTime",
                "type":"SCALAR",
                "datatypeAttributes": {
                    "type": "DATE_TIME",
                    "showTime": true,
                    "showTimeZone": true,
                    "showMonthAsName": true,
                    "showDayOfWeek": true,
                    "hideYearIfCurrent": true
                }
            }
            ]}
        ]};

    var appWithAllFlags_MM_DD_YYYY = JSON.parse(JSON.stringify(appWithAllFlags_DD_MM_YYYY));
    appWithAllFlags_MM_DD_YYYY.dateFormat = "MM-dd-uuuu";

    var appWithAllFlags_MM_DD_YY = JSON.parse(JSON.stringify(appWithAllFlags_DD_MM_YYYY));
    appWithAllFlags_MM_DD_YY.dateFormat = "MM-dd-uu";

    var appWithAllFlags_DD_MM_YY = JSON.parse(JSON.stringify(appWithAllFlags_DD_MM_YYYY));
    appWithAllFlags_DD_MM_YY.dateFormat = "dd-MM-uu";

    var appWithAllFlags_YYYY_MM_DD = JSON.parse(JSON.stringify(appWithAllFlags_DD_MM_YYYY));
    appWithAllFlags_YYYY_MM_DD.dateFormat = "uuuu-MM-dd";


    /**
    * DataProvider containing Records and record display expectations for DateTime field with no display props set
    */
    function  noFlagsDateTimeDataProvider(fid) {
        // DateTime in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear+UTC, "display": "04-12-2015 1:51 AM"};

        // DateTime in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear+UTC, "display": "04-12-2000 1:51 AM"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year dateTime with no format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year dateTime with no format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year dateTime with no format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year dateTime with no format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null dateTime with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null dateTime with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates DateTime records formatting with no field property flags set
    */
    it('Should create and retrieve dateTime display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsDateTimeDataProvider().length);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateTimeField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'dateTime') {
                    dateTimeField = field;
                }
            });
            assert(dateTimeField, 'failed to find dateTime field');
            var records = noFlagsDateTimeDataProvider(dateTimeField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format='+records[i].format));
                }

                //When all the records have been fetched, assert the values match expectations
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
    });

    /**
    * DataProvider containing Records and record display expectations for DD_MM_YYYY DateTime field with all display props set
    */
    function  allFlagsDateTimeDataProvider_DD_MM_YYYY(fid) {

        // DateTime in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear+UTC, "display": "Sunday, 12-Apr 1:51 AM EDT"};

        // DateTime in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear+UTC, "display": "Wednesday, 12-Apr-2000 1:51 AM EDT"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year dateTime with all DD_MM_YYYY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year dateTime with all DD_MM_YYYY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year dateTime with all DD_MM_YYYY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year dateTime with all DD_MM_YYYY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null dateTime with all DD_MM_YYYY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null dateTime with all DD_MM_YYYY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates DD_MM_YYYY DateTime records formatting with all field property flags set
    */
    it('Should create and retrieve DD_MM_YYYY dateTime display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateTimeDataProvider_DD_MM_YYYY().length);
        recordBase.createApp(appWithAllFlags_DD_MM_YYYY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateTimeField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'dateTime') {
                    dateTimeField = field;
                }
            });
            assert(dateTimeField, 'failed to find dateTime field');
            var records = allFlagsDateTimeDataProvider_DD_MM_YYYY(dateTimeField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format='+records[i].format));
                }

                //When all the records have been fetched, assert the values match expectations
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
    });

    /**
    * DataProvider containing Records and record display expectations for MM_DD_YYYY DateTime field with all display props set
    */
    function  allFlagsDateTimeDataProvider_MM_DD_YYYY(fid) {

        // DateTime in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear+UTC, "display": "Sunday, Apr-12 1:51 AM EDT"};

        // DateTime in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear+UTC, "display": "Wednesday, Apr-12-2000 1:51 AM EDT"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year dateTime with all MM_DD_YYYY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year dateTime with all MM_DD_YYYY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year dateTime with all MM_DD_YYYY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year dateTime with all MM_DD_YYYY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null dateTime with all MM_DD_YYYY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null dateTime with all MM_DD_YYYY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates MM_DD_YYYY DateTime records formatting with all field property flags set
    */
    it('Should create and retrieve MM_DD_YYYY dateTime display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateTimeDataProvider_MM_DD_YYYY().length);
        recordBase.createApp(appWithAllFlags_MM_DD_YYYY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateTimeField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'dateTime') {
                    dateTimeField = field;
                }
            });
            assert(dateTimeField, 'failed to find dateTime field');
            var records = allFlagsDateTimeDataProvider_MM_DD_YYYY(dateTimeField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format='+records[i].format));
                }

                //When all the records have been fetched, assert the values match expectations
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
    });

    /**
    * DataProvider containing Records and record display expectations for MM_DD_YY DateTime field with all display props set
    */
    function  allFlagsDateTimeDataProvider_MM_DD_YY(fid) {

        // DateTime in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear+UTC, "display": "Sunday, Apr-12 1:51 AM EDT"};

        // DateTime in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear+UTC, "display": "Wednesday, Apr-12-00 1:51 AM EDT"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year dateTime with all MM_DD_YY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year dateTime with all MM_DD_YY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year dateTime with all MM_DD_YY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year dateTime with all MM_DD_YY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null dateTime with all MM_DD_YY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null dateTime with all MM_DD_YY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates MM_DD_YY DateTime records formatting with all field property flags set
    */
    it('Should create and retrieve MM_DD_YY dateTime display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateTimeDataProvider_MM_DD_YY().length);
        recordBase.createApp(appWithAllFlags_MM_DD_YY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateTimeField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'dateTime') {
                    dateTimeField = field;
                }
            });
            assert(dateTimeField, 'failed to find dateTime field');
            var records = allFlagsDateTimeDataProvider_MM_DD_YY(dateTimeField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format='+records[i].format));
                }

                //When all the records have been fetched, assert the values match expectations
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
    });

    /**
    * DataProvider containing Records and record display expectations for DD_MM_YY DateTime field with all display props set
    */
    function  allFlagsDateTimeDataProvider_DD_MM_YY(fid) {

        // DateTime in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear+UTC, "display": "Sunday, 12-Apr 1:51 AM EDT"};

        // DateTime in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear+UTC, "display": "Wednesday, 12-Apr-00 1:51 AM EDT"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year dateTime with all DD_MM_YY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year dateTime with all DD_MM_YY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year dateTime with all DD_MM_YY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year dateTime with all DD_MM_YY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null dateTime with all DD_MM_YY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null dateTime with all DD_MM_YY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates DD_MM_YY DateTime records formatting with all field property flags set
    */
    it('Should create and retrieve DD_MM_YY dateTime display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateTimeDataProvider_DD_MM_YY().length);
        recordBase.createApp(appWithAllFlags_DD_MM_YY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateTimeField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'dateTime') {
                    dateTimeField = field;
                }
            });
            assert(dateTimeField, 'failed to find dateTime field');
            var records = allFlagsDateTimeDataProvider_DD_MM_YY(dateTimeField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format='+records[i].format));
                }

                //When all the records have been fetched, assert the values match expectations
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
    });

    /**
    * DataProvider containing Records and record display expectations for YYYY_MM_DD DateTime field with all display props set
    */
    function  allFlagsDateTimeDataProvider_YYYY_MM_DD(fid) {

        // DateTime in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear+UTC, "display": "Sunday, Apr-12 1:51 AM EDT"};

        // DateTime in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear+UTC, "display": "Wednesday, 2000-Apr-12 1:51 AM EDT"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year dateTime with all YYYY_MM_DD format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year dateTime with all YYYY_MM_DD format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year dateTime with all YYYY_MM_DD format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year dateTime with all YYYY_MM_DD format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null dateTime with all YYYY_MM_DD format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null dateTime with all YYYY_MM_DD format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates YYYY_MM_DD DateTime records formatting with all field property flags set
    */
    it('Should create and retrieve YYYY_MM_DD dateTime display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateTimeDataProvider_YYYY_MM_DD().length);
        recordBase.createApp(appWithAllFlags_YYYY_MM_DD).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateTimeField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'dateTime') {
                    dateTimeField = field;
                }
            });
            assert(dateTimeField, 'failed to find dateTime field');
            var records = allFlagsDateTimeDataProvider_YYYY_MM_DD(dateTimeField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format='+records[i].format));
                }

                //When all the records have been fetched, assert the values match expectations
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
    });

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.apiBase.cleanup().then(function () {
            done();
        });
    });
});
