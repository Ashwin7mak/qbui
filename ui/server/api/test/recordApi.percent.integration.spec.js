'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');
var testConsts = require('./api.test.constants');

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
var BigDecimal = require('bigdecimal');


/**
 * Integration test for Percent field formatting
 */
describe('API - Percent record test cases', function () {
    var numberDecimalOnly = '0.74765432';
    var numberDouble = '9.876543210074765E10';
    var numberInt = '99';

    var appWithNoFlags = {
        "name": "Percent App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "percent",
                    "type": "PERCENT"
                }
         ]}
    ]};

    var appWithAllFlags = {
        "name": "Percent App - all flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "percent",
                "type": "PERCENT",
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

    /**
     * DataProvider containing Records and record display expectations for Percent field with no display props set
     */
    function  noFlagsPercentDataProvider(fid) {
        // Decimal number
        var decimalInput = '[{"id": ' + fid + ', "value": ' + numberDecimalOnly + '}]';
        var expectedDecimalRecord = '{"id": ' + fid + ', "value": ' + numberDecimalOnly + ', "display": "0.74765432000000%"}';

        // Double number
        var doubleInput = '[{"id": ' + fid + ', "value": ' + numberDouble + '}]';
        var expectedDoubleRecord = '{"id": ' + fid + ', "value": ' + numberDouble + ', "display": "98765432100.74765000000000%"}';

        // Int number
        var intInput = '[{"id": ' + fid + ', "value": ' + numberInt+ '}]';
        var expectedIntRecord = '{"id": ' + fid + ', "value": ' + numberInt + ', "display": "99.00000000000000%"}';

        // Null number
        var nullInput = '[{"id": ' + fid + ', "value": null}]';
        var expectedNullRecord = '{"id": ' + fid + ', "value": null, "display": ""}';

        return [
            { message: "display decimal number with no format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with no format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with no format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with no format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display int number with no format flags", record: intInput, format: "display", expectedFieldValue: expectedIntRecord },
            { message: "raw int number with no format flags", record: intInput, format: "raw", expectedFieldValue: intInput },
            { message: "display null number with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Percent records formatting with no field property flags set
     */
    it('Should create and retrieve percent display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsPercentDataProvider().length);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var percentField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'percent') {
                    percentField = field;
                }
            });
            assert(percentField, 'failed to find percent field');
            var records = noFlagsPercentDataProvider(percentField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, jsonBigNum.parse(currentRecord.record), '?format='+currentRecord.format));
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
                            if (fieldValue.id === jsonBigNum.parse(records[i].expectedFieldValue).id) {
                                assert.deepEqual(fieldValue, jsonBigNum.parse(records[i].expectedFieldValue), 'Unexpected field value returned: '
                                + jsonBigNum.stringify(fieldValue) + ', ' + records[i].expectedFieldValue);
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
     * DataProvider containing Records and record display expectations for Percent field with all display props set
     */
    function  allFlagsPercentDataProvider(fid) {
        // Decimal number
        var decimalInput = '[{"id": ' + fid + ', "value": ' + numberDecimalOnly + '}]';
        var expectedDecimalRecord = '{"id": ' + fid + ', "value": ' + numberDecimalOnly + ', "display": "0,75%"}';

        // Double number
        var doubleInput = '[{"id": ' + fid + ', "value": ' + numberDouble + '}]';
        var expectedDoubleRecord = '{"id": ' + fid + ', "value": ' + numberDouble + ', "display": "98.76.54.32.100,75%"}';

        // Int number
        var intInput = '[{"id": ' + fid + ', "value": ' + numberInt + '}]';
        var expectedIntRecord = '{"id": ' + fid + ', "value": ' + numberInt + ', "display": "99,00%"}';

        // Null number
        var nullInput = '[{"id": ' + fid + ', "value": null}]';
        var expectedNullRecord = '{"id": ' + fid + ', "value": null, "display": ""}';

        return [
            { message: "display decimal number with all format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with all format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with all format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with all format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display int number with all format flags", record: intInput, format: "display", expectedFieldValue: expectedIntRecord },
            { message: "raw int number with all format flags", record: intInput, format: "raw", expectedFieldValue: intInput },
            { message: "display null number with all format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with all format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Percent records formatting with all field property flags set
     */
    it('Should create and retrieve percent display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsPercentDataProvider().length);
        recordBase.createApp(appWithAllFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var percentField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'percent') {
                    percentField = field;
                }
            });
            assert(percentField, 'failed to find percent field');
            var records = allFlagsPercentDataProvider(percentField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, jsonBigNum.parse(currentRecord.record), '?format='+currentRecord.format));
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
                            if (fieldValue.id === jsonBigNum.parse(records[i].expectedFieldValue).id) {
                                assert.deepEqual(fieldValue, jsonBigNum.parse(records[i].expectedFieldValue), 'Unexpected field value returned: '
                                + jsonBigNum.stringify(fieldValue) + ', ' + records[i].expectedFieldValue);
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
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.apiBase.cleanup().then(function () {
            // Do a JavaScript version of a sleep so we don't collide with the next test class
            setTimeout(function() { done(); }, testConsts.AFTER_TEST_SLEEP);
        });
    });
});
