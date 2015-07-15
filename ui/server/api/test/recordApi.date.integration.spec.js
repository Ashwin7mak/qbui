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
 * Integration test for Date field formatting
 */
describe('API - Date record test cases - ', function () {
    var dateCurrentYear = "2015-04-12";
    var dateDiffYear = "2000-04-12";

    var appWithNoFlags = {
        "name": "Date App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "date",
                    "type": "DATE"
                }
         ]}
    ]};

    var appWithAllFlags_DD_MM_YYYY = {
        "name": "Date App - all flags",
        "dateFormat": "dd-MM-uuuu",
        "timeZone": "America/New_York",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "date",
                "type": "DATE",
                "showMonthAsName": true,
                "showDayOfWeek": true,
                "hideYearIfCurrent": true
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
    * DataProvider containing Records and record display expectations for Date field with no display props set
    */
    function  noFlagsDateDataProvider(fid) {
        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": "04-12-2015"};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": "04-12-2000"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year date with no format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year date with no format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year date with no format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year date with no format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null date with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null date with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates Date records formatting with no field property flags set
    */
    it('Should create and retrieve date display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsDateDataProvider().length);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            var records = noFlagsDateDataProvider(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    //recordBase.sleep(testConsts.DEFAULT_SLEEP, function(){});
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
    * DataProvider containing Records and record display expectations for DD_MM_YYYY Date field with all display props set
    */
    function  allFlagsDateDataProvider_DD_MM_YYYY(fid) {

        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": "Sunday, 12-Apr"};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": "Wednesday, 12-Apr-2000"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year date with all DD_MM_YYYY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year date with all DD_MM_YYYY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year date with all DD_MM_YYYY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year date with all DD_MM_YYYY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null date with all DD_MM_YYYY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null date with all DD_MM_YYYY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates DD_MM_YYYY Date records formatting with all field property flags set
    */
    it('Should create and retrieve DD_MM_YYYY date display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateDataProvider_DD_MM_YYYY().length);
        recordBase.createApp(appWithAllFlags_DD_MM_YYYY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            var records = allFlagsDateDataProvider_DD_MM_YYYY(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    //recordBase.sleep(testConsts.DEFAULT_SLEEP, function(){});
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
    * DataProvider containing Records and record display expectations for MM_DD_YYYY Date field with all display props set
    */
    function  allFlagsDateDataProvider_MM_DD_YYYY(fid) {

        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": "Sunday, Apr-12"};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": "Wednesday, Apr-12-2000"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year date with all MM_DD_YYYY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year date with all MM_DD_YYYY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year date with all MM_DD_YYYY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year date with all MM_DD_YYYY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null date with all MM_DD_YYYY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null date with all MM_DD_YYYY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates MM_DD_YYYY Date records formatting with all field property flags set
    */
    it('Should create and retrieve MM_DD_YYYY date display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateDataProvider_MM_DD_YYYY().length);
        recordBase.createApp(appWithAllFlags_MM_DD_YYYY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            var records = allFlagsDateDataProvider_MM_DD_YYYY(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    //recordBase.sleep(testConsts.DEFAULT_SLEEP, function(){});
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
    * DataProvider containing Records and record display expectations for MM_DD_YY Date field with all display props set
    */
    function  allFlagsDateDataProvider_MM_DD_YY(fid) {

        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": "Sunday, Apr-12"};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": "Wednesday, Apr-12-00"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year date with all MM_DD_YY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year date with all MM_DD_YY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year date with all MM_DD_YY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year date with all MM_DD_YY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null date with all MM_DD_YY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null date with all MM_DD_YY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates MM_DD_YY Date records formatting with all field property flags set
    */
    it('Should create and retrieve MM_DD_YY date display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateDataProvider_MM_DD_YY().length);
        recordBase.createApp(appWithAllFlags_MM_DD_YY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            var records = allFlagsDateDataProvider_MM_DD_YY(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    //recordBase.sleep(testConsts.DEFAULT_SLEEP, function(){});
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
    * DataProvider containing Records and record display expectations for DD_MM_YY Date field with all display props set
    */
    function  allFlagsDateDataProvider_DD_MM_YY(fid) {

        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": "Sunday, 12-Apr"};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": "Wednesday, 12-Apr-00"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year date with all DD_MM_YY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year date with all DD_MM_YY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year date with all DD_MM_YY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year date with all DD_MM_YY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null date with all DD_MM_YY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null date with all DD_MM_YY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
    * Integration test that validates DD_MM_YY Date records formatting with all field property flags set
    */
    it('Should create and retrieve DD_MM_YY date display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateDataProvider_DD_MM_YY().length);
        recordBase.createApp(appWithAllFlags_DD_MM_YY).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            var records = allFlagsDateDataProvider_DD_MM_YY(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    //recordBase.sleep(testConsts.DEFAULT_SLEEP, function(){});
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
     * DataProvider containing Records and record display expectations for YYYY_MM_DD Date field with all display props set
     */
    function  allFlagsDateDataProvider_YYYY_MM_DD(fid) {

        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": "Sunday, Apr-12"};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": "Wednesday, 2000-Apr-12"};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display current year date with all YYYY_MM_DD_MM_YY format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            { message: "raw current year date with all YYYY_MM_DD_MM_YY format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            { message: "display different year date with all YYYY_MM_DD_MM_YY format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            { message: "raw different year date with all YYYY_MM_DD_MM_YY format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            { message: "display null date with all YYYY_MM_DD_MM_YY format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null date with all YYYY_MM_DD_MM_YY format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates YYYY_MM_DD Date records formatting with all field property flags set
     */
    it('Should create and retrieve YYYY_MM_DD date display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDateDataProvider_YYYY_MM_DD().length);
        recordBase.createApp(appWithAllFlags_YYYY_MM_DD).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            var records = allFlagsDateDataProvider_YYYY_MM_DD(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
            recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList){
                assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                for(var i=0; i < records.length; i++){
                    //Get newly created records
                    //recordBase.sleep(testConsts.DEFAULT_SLEEP, function(){});
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

    //Pause between test suites
    afterEach(function (done) {
        done();
        //this.timeout(testConsts.INTEGRATION_TIMEOUT)
        //recordBase.sleep(testConsts.TEST_GROUP_SLEEP, function(){ done();});
    });

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.apiBase.cleanup().then(function () {
            // Do a JavaScript version of a sleep so we don't collide with the next test class
            setTimeout(function() { done(); }, testConsts.TEST_CLASS_SLEEP);
        });
    });
});
