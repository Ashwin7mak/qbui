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
 * Integration test for Numeric field formatting
 */
describe('API - Numeric record test cases', function () {
    var numberDecimalOnly = '0.74765432';
    var numberDouble = '9.876543210074765E10';
    var numberNoSeparator = '99';
    var numberMultipleSeparators = '98765432100';
    var numberMax = '7777777777777777777';
    var numberMin = '-1111111111111111111';

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

    /**
     * DataProvider containing Records and record display expectations for Numeric field with no display props set
     */
    function  noFlagsNumericDataProvider(fid) {
        // Decimal number
        var decimalInput = '[{"id": ' + fid + ', "value": ' + numberDecimalOnly + '}]';
        var expectedDecimalRecord = '{"id": ' + fid + ', "value": '+ numberDecimalOnly + ', "display": "0.74765432000000"}';

        // Double number
        var doubleInput = '[{"id": ' + fid + ', "value": '+ numberDouble + '}]';
        var expectedDoubleRecord = '{"id": ' + fid + ', "value": ' + numberDouble +', "display": "98765432100.74765000000000"}';

        // No separator number
        var noSeparatorInput = '[{"id": ' + fid + ', "value": '+ numberNoSeparator +'}]';
        var expectedNoSeparatorRecord = '{"id": ' + fid + ', "value": ' + numberNoSeparator + ', "display": "99.00000000000000"}';

        // Multiple separator number
        var multiSeparatorInput = '[{"id": ' + fid + ', "value": '+ numberMultipleSeparators + '}]';
        var expectedMultiSeparatorRecord = '{"id": ' + fid + ', "value": ' + numberMultipleSeparators + ', "display": "98765432100.00000000000000"}';

        // Null number
        var nullInput = '[{"id": ' + fid + ', "value": null}]';
        var expectedNullRecord = '{"id": ' + fid + ', "value": null, "display": ""}';

        // Max number
        var maxInput = '[{"id": ' + fid + ', "value": ' + numberMax + '}]';
        var expectedMaxRecord = '{"id": ' + fid + ', "value": ' + numberMax + ', "display": "7777777777777777777.00000000000000"}';

        // Min number
        var minInput = '[{"id": ' + fid + ', "value":' + numberMin + '}]';
        var expectedMinRecord = '{"id": ' + fid + ', "value": ' + numberMin + ', "display": "-1111111111111111111.00000000000000"}';

        return [
            { message: "display decimal number with no format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with no format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with no format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with no format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display no separator number with no format flags", record: noSeparatorInput, format: "display", expectedFieldValue: expectedNoSeparatorRecord },
            { message: "raw no separator number with no format flags", record: noSeparatorInput, format: "raw", expectedFieldValue: noSeparatorInput },
            { message: "display multiple separator number with no format flags", record: multiSeparatorInput, format: "display", expectedFieldValue: expectedMultiSeparatorRecord },
            { message: "raw multiple separator number with no format flags", record: multiSeparatorInput, format: "raw", expectedFieldValue: multiSeparatorInput },
            { message: "display max number with no format flags", record: maxInput, format: "display", expectedFieldValue: expectedMaxRecord },
            { message: "raw max number with no format flags", record: maxInput, format: "raw", expectedFieldValue: maxInput },
            { message: "display min number with no format flags", record: minInput, format: "display", expectedFieldValue: expectedMinRecord },
            { message: "raw min number with no format flags", record: minInput, format: "raw", expectedFieldValue: minInput },
            { message: "display null number with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput },
        ]
    }

    /**
     * Integration test that validates Numeric records formatting with no field property flags set
     */
    it('Should create and retrieve numeric display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsNumericDataProvider().length);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var numericField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'numeric') {
                    numericField = field;
                }
            });
            assert(numericField, 'failed to find numeric field');
            var records = noFlagsNumericDataProvider(numericField.id);
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
     * DataProvider containing Records and record display expectations for Numeric field with all display props set
     */
    function  allFlagsNumericDataProvider(fid) {
        // Decimal number
        var decimalInput = '[{"id": ' + fid + ', "value": ' + numberDecimalOnly + '}]';
        var expectedDecimalRecord = '{"id": ' + fid + ', "value": ' + numberDecimalOnly + ', "display": "0,75"}';

        // Double number
        var doubleInput = '[{"id": ' + fid + ', "value": ' + numberDouble + '}]';
        var expectedDoubleRecord = '{"id": ' + fid + ', "value": ' + numberDouble + ', "display": "98.76.54.32.100,75"}';

        // No separator number
        var noSeparatorInput = '[{"id": ' + fid + ', "value": ' + numberNoSeparator + '}]';
        var expectedNoSeparatorRecord = '{"id": ' + fid + ', "value": ' + numberNoSeparator + ', "display": "99,00"}';

        // Multiple separator number
        var multiSeparatorInput = '[{"id": ' + fid + ', "value": ' + numberMultipleSeparators + '}]';
        var expectedMultiSeparatorRecord = '{"id": ' + fid + ', "value": ' + numberMultipleSeparators + ', "display": "98.76.54.32.100,00"}';

        // Max number
        var maxInput = '[{"id": ' + fid + ', "value": ' + numberMax + '}]';
        var expectedMaxRecord = '{"id": ' + fid + ', "value": ' + numberMax + ', "display": "7.77.77.77.77.77.77.77.77.77,00"}';

        // Min number
        var minInput = '[{"id": ' + fid + ', "value": ' + numberMin + '}]';
        var expectedMinRecord = '{"id": ' + fid + ', "value": ' + numberMin + ', "display": "-1.11.11.11.11.11.11.11.11.11,00"}';

        // Null number
        var nullInput = '[{"id": ' + fid + ', "value": null}]';
        var expectedNullRecord = '{"id": ' + fid + ', "value": 0, "display": ""}';

        return [
            { message: "display decimal number with all format flags", record: decimalInput, format: "display", expectedFieldValue: expectedDecimalRecord },
            { message: "raw decimal number with all format flags", record: decimalInput, format: "raw", expectedFieldValue: decimalInput },
            { message: "display double number with all format flags", record: doubleInput, format: "display", expectedFieldValue: expectedDoubleRecord },
            { message: "raw double number with all format flags", record: doubleInput, format: "raw", expectedFieldValue: doubleInput },
            { message: "display no separator number with all format flags", record: noSeparatorInput, format: "display", expectedFieldValue: expectedNoSeparatorRecord },
            { message: "raw no separator number with all format flags", record: noSeparatorInput, format: "raw", expectedFieldValue: noSeparatorInput },
            { message: "display multiple separator number with all format flags", record: multiSeparatorInput, format: "display", expectedFieldValue: expectedMultiSeparatorRecord },
            { message: "raw multiple separator number with all format flags", record: multiSeparatorInput, format: "raw", expectedFieldValue: multiSeparatorInput },
            { message: "display max number with all format flags", record: maxInput, format: "display", expectedFieldValue: expectedMaxRecord },
            { message: "raw max number with all format flags", record: maxInput, format: "raw", expectedFieldValue: maxInput },
            { message: "display min number with all format flags", record: minInput, format: "display", expectedFieldValue: expectedMinRecord },
            { message: "raw min number with all format flags", record: minInput, format: "raw", expectedFieldValue: minInput },
            { message: "display null number with all format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null number with all format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Numeric records formatting with all field property flags set
     */
    it('Should create and retrieve numeric display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsNumericDataProvider().length);
        recordBase.createApp(appWithAllFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var numericField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'numeric') {
                    numericField = field;
                }
            });
            assert(numericField, 'failed to find numeric field');
            var records = allFlagsNumericDataProvider(numericField.id);
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
            done();
            // Do a JavaScript version of a sleep so we don't collide with the next test class
            //setTimeout(function() { done(); }, testConsts.TEST_CLASS_SLEEP);
        });
    });
});
