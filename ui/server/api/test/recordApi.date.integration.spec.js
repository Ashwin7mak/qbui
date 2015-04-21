'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');

/**
 * Integration test for Date field formatting
 */
describe('API - Date record test cases - ', function () {
    var dateCurrentYear = "2015-04-12T18:51:19z";
    var dateDiffYear = "2000-04-12T18:51:19z";

    var appWithNoFlags = {
        "name": "Date App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "date",
                    "type": "DATE"
                }
         ]}
    ]};

    var appWithAllFlags = {
        "name": "Date App - all flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "date",
                "type": "DATE",
                "showMonthAsName": true,
                "showDayOfWeek": true,
                "hideYearIfCurrent": true,
                "format": "MM-dd-uuuu",
                "timeZone": "America/New_York"
            }
            ]}
        ]};

    /**
     * DataProvider containing Records and record display expectations for Date field with no display props set
     */
    function  noFlagsDateDataProvider(fid) {
        // Date in current year
        var currentYearInput = [{"id": fid, "value": dateCurrentYear}];
        var expectedCurrentYearRecord = {"id": fid, "value": dateCurrentYear, "display": dateCurrentYear};

        // Date in different year
        var diffYearInput = [{"id": fid, "value": dateDiffYear}];
        var expectedDiffYearRecord = {"id": fid, "value": dateDiffYear, "display": dateDiffYear};

        // Empty date
        var emptyInput = [{"id": fid, "value": ""}];
        var expectedEmptyRecord = {"id": fid, "value": "", "display": ""};

        // Null date
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": "", "display": ""};

        return [
            { message: "display current year date with no format flags", record: currentYearInput, format: "display", expectedFieldValue: expectedCurrentYearRecord },
            //{ message: "raw current year date with no format flags", record: currentYearInput, format: "raw", expectedFieldValue: currentYearInput },
            //{ message: "display different year date with no format flags", record: diffYearInput, format: "display", expectedFieldValue: expectedDiffYearRecord },
            //{ message: "raw different year date with no format flags", record: diffYearInput, format: "raw", expectedFieldValue: diffYearInput },
            //{ message: "display empty number with no format flags", record: emptyInput, format: "display", expectedFieldValue: expectedEmptyRecord },
            //{ message: "raw empty number with no format flags", record: emptyInput, format: "raw", expectedFieldValue: emptyInput },
            //{ message: "display null number with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            //{ message: "raw null number with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Date records formatting with no field property flags set
     */
    it('Should create and retrieve date display records when no format flags set', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            console.log("APP: " + JSON.stringify(app));
            var dateField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'date') {
                    dateField = field;
                }
            });
            assert(dateField, 'failed to find date field');
            console.log("DATE FIELD: " + JSON.stringify(dateField));
            var records = noFlagsDateDataProvider(dateField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                console.log("REC ENDPOINT: " + JSON.stringify(recordsEndpoint));
                console.log("CURRENT REC: " + JSON.stringify(currentRecord.record));
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
                                console.log("ACT: " + JSON.stringify(fieldValue));
                                console.log("EXP: " + JSON.stringify(records[i].expectedFieldValue));
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

    ///**
    // * DataProvider containing Records and record display expectations for Numeric field with all display props set
    // */
    //function  allFlagsNumericDataProvider(fid) {
    //    // Decimal number
    //    var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
    //    var expectedDecimalRecord = {"id": fid, "value": numberDecimalOnly, "display": "0,75"};
    //
    //    // Double number
    //    var doubleInput = [{"id": fid, "value": numberDouble}];
    //    var expectedDoubleRecord = {"id": fid, "value": numberDouble, "display": "98.76.54.32.100,75"};
    //
    //    // No separator number
    //    var noSeparatorInput = [{"id": fid, "value": numberNoSeparator}];
    //    var expectedNoSeparatorRecord = {"id": fid, "value": numberNoSeparator, "display": "99,00"};
    //
    //    // Multiple separator number
    //    var multiSeparatorInput = [{"id": fid, "value": numberMultipleSeparators}];
    //    var expectedMultiSeparatorRecord = {"id": fid, "value": numberMultipleSeparators, "display": "98.76.54.32.100,00"};
    //
    //    // Null number
    //    var nullInput = [{"id": fid, "value": null}];
    //    var expectedNullRecord = {"id": fid, "value": 0, "display": ""};
    //
    //    return [
    //        { message: "display decimal number with all format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
    //        { message: "raw decimal number with all format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
    //        { message: "display double number with all format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
    //        { message: "raw double number with all format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
    //        { message: "display no separator number with all format flags", record: noSeparatorInput, format: "display", expectedFieldValue: expectedNoSeparatorRecord },
    //        { message: "raw no separator number with all format flags", record: noSeparatorInput, format: "raw", expectedFieldValue: noSeparatorInput },
    //        { message: "display multiple separator number with all format flags", record: multiSeparatorInput, format: "display", expectedFieldValue: expectedMultiSeparatorRecord },
    //        { message: "raw multiple separator number with all format flags", record: multiSeparatorInput, format: "raw", expectedFieldValue: multiSeparatorInput },
    //        { message: "display null number with all format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
    //        { message: "raw null number with all format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
    //    ]
    //}
    //
    ///**
    // * Integration test that validates Numeric records formatting with all field property flags set
    // */
    //it('Should create and retrieve numeric display records when all format flags set', function (done) {
    //    this.timeout(30000);
    //    recordBase.createApp(appWithAllFlags).then(function (appResponse) {
    //        var app = JSON.parse(appResponse.body);
    //        var numericField;
    //        app.tables[0].fields.forEach(function (field) {
    //            if (field.name === 'numeric') {
    //                numericField = field;
    //            }
    //        });
    //        //console.log('NUMERIC FIELD: ' +JSON.stringify(numericField));
    //        assert(numericField, 'failed to find numeric field');
    //        var records = allFlagsNumericDataProvider(numericField.id);
    //        //For each of the cases, create the record and execute the request
    //        var fetchRecordPromises = [];
    //        records.forEach(function (currentRecord) {
    //            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
    //            fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format='+currentRecord.format));
    //        });
    //
    //        //When all the records have been created and fetched, assert the values match expectations
    //        Promise.all(fetchRecordPromises)
    //            .then(function (results) {
    //                for (var i = 0; i < results.length; i++) {
    //                    var currentRecord = results[i];
    //                    if(results[i].record) {
    //                        currentRecord = results[i].record;
    //                    }
    //                    currentRecord.forEach(function (fieldValue) {
    //                        if (fieldValue.id === records[i].expectedFieldValue.id) {
    //                            //console.log('EXPECTED: ' +JSON.stringify(records[i].expectedFieldValue));
    //                            //console.log('ACTUAL: ' +JSON.stringify(fieldValue));
    //                            assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: '
    //                            + JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
    //                        }
    //                    });
    //                }
    //                done();
    //            }).catch(function (errorMsg) {
    //                assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
    //                done();
    //            });
    //    });
    //});

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(20000);
        recordBase.apiBase.cleanup().then(function () {
            done();
        });
    });
});
