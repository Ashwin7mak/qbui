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
 * Integration test for TimeOfDay field formatting
 */
describe('API - TimeOfDay record test cases - ', function () {
    var earlyTOD = "1970-01-01T09:00:00Z[UTC]";
    var lateTOD = "1970-01-01T15:00:00Z[UTC]";


    var appWithNoFlags = {
        "name": "TimeOfDay App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "timeOfDay",
                    "type": "TIME_OF_DAY"
                }
         ]}
    ]};

    var appWithAllFlags_HH_MM = {
        "name": "TimeOfDay App - HH_MM format",
        "dateFormat": "MM-dd-uuuu",
        "timeZone": "America/New_York",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "timeOfDay",
                "type": "TIME_OF_DAY",
                "scale": "HH:MM",
                "use24HourClock": true
            }
            ]}
        ]};

    var appWithAllFlags_HH_MM_SS = {
        "name": "TimeOfDay App - HH_MM_SS format",
        "dateFormat": "dd-MM-uuuu",
        "timeZone": "America/New_York",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "timeOfDay",
                "type": "TIME_OF_DAY",
                "scale": "HH:MM:SS",
                "use24HourClock": true
            }
            ]}
        ]};

    /**
    * DataProvider containing Records and record display expectations for TimeOfDay field with no display props set
    */
    function  noFlagsTimeOfDayDataProvider(fid) {
        // TimeOfDay in morning
        var earlyTODInput = [{"id": fid, "value": earlyTOD}];
        var expectedEarlyTODRecord = {"id": fid, "value": earlyTOD, "display": "9:00 AM"};

        // TimeOfDay in afternoon
        var lateTODInput = [{"id": fid, "value": lateTOD}];
        var expectedLateTODRecord = {"id": fid, "value": lateTOD, "display": "3:00 PM"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display early timeOfDay with no format flags", record: earlyTODInput, format: "display", expectedFieldValue: expectedEarlyTODRecord },
            { message: "raw early timeOfDay with no format flags", record: earlyTODInput, format: "raw", expectedFieldValue: earlyTODInput },
            { message: "display different year timeOfDay with no format flags", record: lateTODInput, format: "display", expectedFieldValue: expectedLateTODRecord },
            { message: "raw different year timeOfDay with no format flags", record: lateTODInput, format: "raw", expectedFieldValue: lateTODInput },
            { message: "display null timeOfDay with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null timeOfDay with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates TimeOfDay records formatting with no field property flags set
    */
    it('Should create and retrieve timeOfDay display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var timeOfDayField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'timeOfDay') {
                    timeOfDayField = field;
                }
            });
            assert(timeOfDayField, 'failed to find timeOfDay field');
            var records = noFlagsTimeOfDayDataProvider(timeOfDayField.id);
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
    * DataProvider containing Records and record display expectations for HH_MM TimeOfDay field with all display props set
    */
    function  allFlagsTimeOfDayDataProvider_HH_MM(fid) {

        // TimeOfDay in early
        var earlyTODInput = [{"id": fid, "value": earlyTOD}];
        var expectedEarlyTODRecord = {"id": fid, "value": earlyTOD, "display": "09:00"};

        // TimeOfDay in different year
        var lateTODInput = [{"id": fid, "value": lateTOD}];
        var expectedLateTODRecord = {"id": fid, "value": lateTOD, "display": "15:00"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display early timeOfDay with all HH_MM format flags", record: earlyTODInput, format: "display", expectedFieldValue: expectedEarlyTODRecord },
            { message: "raw early timeOfDay with all HH_MM format flags", record: earlyTODInput, format: "raw", expectedFieldValue: earlyTODInput },
            { message: "display different year timeOfDay with all HH_MM format flags", record: lateTODInput, format: "display", expectedFieldValue: expectedLateTODRecord },
            { message: "raw different year timeOfDay with all HH_MM format flags", record: lateTODInput, format: "raw", expectedFieldValue: lateTODInput },
            { message: "display null timeOfDay with all HH_MM format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null timeOfDay with all HH_MM format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates HH_MM TimeOfDay records formatting with all field property flags set
    */
    it('Should create and retrieve HH_MM timeOfDay display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.createApp(appWithAllFlags_HH_MM).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var timeOfDayField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'timeOfDay') {
                    timeOfDayField = field;
                }
            });
            assert(timeOfDayField, 'failed to find timeOfDay field');
            var records = allFlagsTimeOfDayDataProvider_HH_MM(timeOfDayField.id);
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
     * DataProvider containing Records and record display expectations for HH_MM_SS TimeOfDay field with all display props set
     */
    function  allFlagsTimeOfDayDataProvider_HH_MM_SS(fid) {

        // TimeOfDay in early
        var earlyTODInput = [{"id": fid, "value": earlyTOD}];
        var expectedEarlyTODRecord = {"id": fid, "value": earlyTOD, "display": "09:00:00"};

        // TimeOfDay in different year
        var lateTODInput = [{"id": fid, "value": lateTOD}];
        var expectedLateTODRecord = {"id": fid, "value": lateTOD, "display": "15:00:00"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display early timeOfDay with all HH_MM_SS format flags", record: earlyTODInput, format: "display", expectedFieldValue: expectedEarlyTODRecord },
            { message: "raw early timeOfDay with all HH_MM_SS format flags", record: earlyTODInput, format: "raw", expectedFieldValue: earlyTODInput },
            { message: "display different year timeOfDay with all HH_MM_SS format flags", record: lateTODInput, format: "display", expectedFieldValue: expectedLateTODRecord },
            { message: "raw different year timeOfDay with all HH_MM_SS format flags", record: lateTODInput, format: "raw", expectedFieldValue: lateTODInput },
            { message: "display null timeOfDay with all HH_MM_SS format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null timeOfDay with all format HH_MM_SS flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates HH_MM_SS TimeOfDay records formatting with all field property flags set
     */
    it('Should create and retrieve HH_MM_SS timeOfDay display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.createApp(appWithAllFlags_HH_MM_SS).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var timeOfDayField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'timeOfDay') {
                    timeOfDayField = field;
                }
            });
            assert(timeOfDayField, 'failed to find timeOfDay field');
            var records = allFlagsTimeOfDayDataProvider_HH_MM_SS(timeOfDayField.id);
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

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(20000);
        recordBase.apiBase.cleanup().then(function () {
            // Do a JavaScript version of a sleep so we don't collide with the next test class
            setTimeout(function() { done(); }, testConsts.AFTER_TEST_SLEEP);
        });
    });
});
