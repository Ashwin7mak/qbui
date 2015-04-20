'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');

describe('API - Numeric record test cases', function () {
    var numberDecimalOnly = .74765432;
    var numberDouble = 98765432100.74765;
    var numberNoSeparator = 99;
    var numberMultipleSeparators = 98765432100;

    var appWithNoFlags = {
        "name": "Numeric App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "numeric",
                    "type": "NUMERIC"
                }
         ]}
    ]};

    var appWithAllFlags = {
        "name": "Numeric App - all flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "numeric",
                "type": "NUMERIC",
                "decimalPlaces": 2,
                "clientSideAttributes": {
                    "width": 10,
                    "bold": false,
                    "word_wrap": false,
                    "help_text": "help",
                    "separator_start": 3,
                    "separator_mark": ".",
                    "separator_pattern": "THREE_THEN_TWO",
                    "decimal_mark": ","
                }
            }
            ]}
        ]};
    //
    //function  noFlagsNumericDataProvider(fid) {
    //    // Decimal number
    //    var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
    //    var expectedDecimalRecord = {"id": fid, "value": "0.74765432", "display": "0.74765432"};
    //
    //    // Double number
    //    var doubleInput = [{"id": fid, "value": numberDouble}];
    //    var expectedDoubleRecord = {"id": fid, "value": "98765432100.74765", "display": "98765432100.74765"};
    //
    //    // No separator number
    //    var noSeparatorInput = [{"id": fid, "value": numberNoSeparator}];
    //    var expectedNoSeparatorRecord = {"id": fid, "value": "99", "display": "99"};
    //
    //    // Multiple separator number
    //    var multiSeparatorInput = [{"id": fid, "value": numberMultipleSeparators}];
    //    var expectedMultiSeparatorRecord = {"id": fid, "value": "98765432100.74765", "display": "98765432100.74765"};
    //
    //    // No separator number
    //    var emptyInput = [{"id": fid, "value": ""}];
    //    var expectedEmptyRecord = {"id": fid, "value": null, "display": ""};
    //
    //    //null record value
    //    var nullInput = [{"id": fid, "value": null}];
    //    var expectedNullRecord = {"id": fid, "value": null, "display": ""};
    //
    //    return [
    //        { message: "display decimal number with no format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
    //        { message: "raw decimal number with no format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
    //        { message: "display double number with no format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
    //        { message: "raw double number with no format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
    //        { message: "display no separator number with no format flags", record: noSeparatorInput, format: "display", expectedFieldValue: expectedNoSeparatorRecord },
    //        { message: "raw no separator number with no format flags", record: noSeparatorInput, format: "raw", expectedFieldValue: noSeparatorInput },
    //        { message: "display multiple separator number with no format flags", record: multiSeparatorInput, format: "display", expectedFieldValue: expectedMultiSeparatorRecord },
    //        { message: "raw multiple separator number with no format flags", record: multiSeparatorInput, format: "raw", expectedFieldValue: multiSeparatorInput },
    //        { message: "display empty number with no format flags", record: emptyInput, format: "display", expectedFieldValue: expectedEmptyRecord },
    //        { message: "raw empty number with no format flags", record: emptyInput, format: "raw", expectedFieldValue: emptyInput },
    //        { message: "display null number with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
    //        { message: "raw null number with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
    //    ]
    //}
    //
    // it('Should create and retrieve numeric display records when no format flags set', function (done) {
    //    this.timeout(30000);
    //    recordBase.createApp(appWithNoFlags).then(function (appResponse) {
    //        var app = JSON.parse(appResponse.body);
    //        var numericField;
    //        app.tables[0].fields.forEach(function (field) {
    //            if (field.type === 'NUMERIC') {
    //                numericField = field;
    //            }
    //        });
    //        console.log('NUMERIC FIELD: ' +JSON.stringify(numericField));
    //        assert(numericField, 'failed to find numeric field');
    //        var records = noFlagsNumericDataProvider(numericField.id);
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
    //                            console.log('EXPECTED: ' +JSON.stringify(records[i].expectedFieldValue));
    //                            console.log('ACTUAL: ' +JSON.stringify(fieldValue));
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

    function  allFlagsNumericDataProvider(fid) {
        // Decimal number
        var decimalInput = [{"id": fid, "value": numberDecimalOnly}];
        var expectedDecimalRecord = {"id": fid, "value": "0.74765432", "display": "0,75"};

        // Double number
        var doubleInput = [{"id": fid, "value": numberDouble}];
        var expectedDoubleRecord = {"id": fid, "value": "98765432100.74765", "display": "98.76.54.32.100,75"};

        // No separator number
        var noSeparatorInput = [{"id": fid, "value": numberNoSeparator}];
        var expectedNoSeparatorRecord = {"id": fid, "value": "99", "display": "99,00"};

        // Multiple separator number
        var multiSeparatorInput = [{"id": fid, "value": numberMultipleSeparators}];
        var expectedMultiSeparatorRecord = {"id": fid, "value": "987654321005", "display": "98.76.54.32.100,00"};

        // No separator number
        var emptyInput = [{"id": fid, "value": ""}];
        var expectedEmptyRecord = {"id": fid, "value": null, "display": ""};

        //null record value
        var nullInput = [{"id": fid, "value": null}];
        var expectedNullRecord = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display decimal number with all format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with all format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with all format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with all format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display no separator number with all format flags", record: noSeparatorInput, format: "display", expectedFieldValue: expectedNoSeparatorRecord },
            { message: "raw no separator number with all format flags", record: noSeparatorInput, format: "raw", expectedFieldValue: noSeparatorInput },
            { message: "display multiple separator number with all format flags", record: multiSeparatorInput, format: "display", expectedFieldValue: expectedMultiSeparatorRecord },
            { message: "raw multiple separator number with all format flags", record: multiSeparatorInput, format: "raw", expectedFieldValue: multiSeparatorInput },
            { message: "display empty number with all format flags", record: emptyInput, format: "display", expectedFieldValue: expectedEmptyRecord },
            { message: "raw empty number with all format flags", record: emptyInput, format: "raw", expectedFieldValue: emptyInput },
            { message: "display null number with all format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with all format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    it('Should create and retrieve numeric display records when all format flags set', function (done) {
        this.timeout(30000);
        recordBase.createApp(appWithAllFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var numericField;
            app.tables[0].fields.forEach(function (field) {
                if (field.type === 'NUMERIC') {
                    numericField = field;
                }
            });
            console.log('NUMERIC FIELD: ' +JSON.stringify(numericField));
            assert(numericField, 'failed to find numeric field');
            var records = allFlagsNumericDataProvider(numericField.id);
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
                                console.log('EXPECTED: ' +JSON.stringify(records[i].expectedFieldValue));
                                console.log('ACTUAL: ' +JSON.stringify(fieldValue));
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
            done();
        });
    });
});
