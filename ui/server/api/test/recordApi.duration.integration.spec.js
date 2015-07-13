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
var bigDecimal = require('bigdecimal');

/**
 * Integration test for Duration field formatting
 */
describe('API - Duration record test cases', function () {

    var duration = 1234456;
    // 2^63 = 9223372036854775807
    var durationMax = '9223372036854775807';
    var durationMin = '-9223372036854775807';
    var DEFAULT_DECIMAL_PLACES = 14;
    var ALL_FLAGS_DECIMAL_PLACES = 4;
    var MILLIS_PER_DAY = new bigDecimal.BigDecimal(86400000);
    var MILLIS_PER_WEEK = new bigDecimal.BigDecimal(604800000);

    var appWithNoFlags = {
        "name": "Duration App - no flags",
        "tables": [{
                "name": "table1", "fields": [{
                    "name": "duration",
                    "type": "DURATION"
                }
         ]}
    ]};

    var appWithAllFlags = {
        "name": "Duration App - all flags",
        "tables": [{
            "name": "table1", "fields": [{
                "name": "duration",
                "type": "DURATION",
                "scale": "Days",
                "decimalPlaces": 4
            }
            ]}
        ]};

    /**
     * DataProvider containing Records and record display expectations for Duration field with no display props set
     */
    function  noFlagsDurationDataProvider(fid) {

        // Default duration
        var durationInput = '[{"id": ' + fid + ', "value": '+ duration + '}]';
        var durationExpectedDisplay = new bigDecimal.BigDecimal(duration).divide(MILLIS_PER_WEEK,
                DEFAULT_DECIMAL_PLACES,
                bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + " weeks";
        var expectedDurationRecord = '{"id": ' + fid + ', "value": ' + duration + ', "display": "' + durationExpectedDisplay + '"}';

        // Null number
        var nullInput = '[{"id": ' + fid + ', "value": null}]';
        var expectedNullRecord = '{"id": ' + fid + ', "value": null, "display": ""}';

        // Max number
        var maxInput = '[{"id": ' + fid + ', "value": ' + durationMax + '}]';
        var maxExpectedDisplay = new bigDecimal.BigDecimal(durationMax).divide(MILLIS_PER_WEEK,
            DEFAULT_DECIMAL_PLACES,
            bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + " weeks";
        var expectedMaxRecord = '{"id": ' + fid + ', "value": ' + durationMax + ', "display": "'+ maxExpectedDisplay +'"}';

        // Min number
        var minInput = '[{"id": ' + fid + ', "value":' + durationMin + '}]';
        var minExpectedDisplay = new bigDecimal.BigDecimal(durationMin).divide(MILLIS_PER_WEEK,
                DEFAULT_DECIMAL_PLACES,
                bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + " weeks";
        var expectedMinRecord = '{"id": ' + fid + ', "value": ' + durationMin + ', "display": "' + minExpectedDisplay + '"}';

        return [
            { message: "display duration with no format flags", record: durationInput, format: "display", expectedFieldValue: expectedDurationRecord },
            { message: "raw duration with no format flags", record: durationInput, format: "raw", expectedFieldValue: durationInput },
            { message: "display max duration with no format flags", record: maxInput, format: "display", expectedFieldValue: expectedMaxRecord },
            { message: "raw max duration with no format flags", record: maxInput, format: "raw", expectedFieldValue: maxInput },
            { message: "display min duration with no format flags", record: minInput, format: "display", expectedFieldValue: expectedMinRecord },
            { message: "raw min duration with no format flags", record: minInput, format: "raw", expectedFieldValue: minInput },
            { message: "display null duration with no format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null duration with no format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Duration records formatting with no field property flags set
     */
    it('Should create and retrieve duration display records when no format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsDurationDataProvider().length);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var durationField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'duration') {
                    durationField = field;
                }
            });
            assert(durationField, 'failed to find numeric field');
            var records = noFlagsDurationDataProvider(durationField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                recordBase.sleep(testConsts.TEST_CASE_SLEEP, function(){});
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                fetchRecordPromises.push(
                    recordBase.createAndFetchRecord(recordsEndpoint, jsonBigNum.parse(currentRecord.record), '?format='+currentRecord.format)
                );
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
     * DataProvider containing Records and record display expectations for Duration field with all display props set
     */
    function  allFlagsDurationDataProvider(fid) {
        // Default duration
        var durationInput = '[{"id": ' + fid + ', "value": '+ duration + '}]';
        var durationExpectedDisplay = new bigDecimal.BigDecimal(duration).divide(MILLIS_PER_DAY,
                DEFAULT_DECIMAL_PLACES,
                bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + " weeks";
        var expectedDurationRecord = '{"id": ' + fid + ', "value": ' + duration + ', "display": "' + durationExpectedDisplay + '"}';

        // Null number
        var nullInput = '[{"id": ' + fid + ', "value": null}]';
        var expectedNullRecord = '{"id": ' + fid + ', "value": null, "display": ""}';

        // Max number
        var maxInput = '[{"id": ' + fid + ', "value": ' + durationMax + '}]';
        var maxExpectedDisplay = new bigDecimal.BigDecimal(durationMax).divide(MILLIS_PER_DAY,
                ALL_FLAGS_DECIMAL_PLACES,
                bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + " days";
        var expectedMaxRecord = '{"id": ' + fid + ', "value": ' + durationMax + ', "display": "'+ maxExpectedDisplay +'"}';

        // Min number
        var minInput = '[{"id": ' + fid + ', "value":' + durationMin + '}]';
        var minExpectedDisplay = new bigDecimal.BigDecimal(durationMin).divide(MILLIS_PER_DAY,
                ALL_FLAGS_DECIMAL_PLACES,
                bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toString() + " days";
        var expectedMinRecord = '{"id": ' + fid + ', "value": ' + durationMin + ', "display": "' + minExpectedDisplay + '"}';

        return [
            { message: "display duration with all format flags", record:durationInput, format: "display", expectedFieldValue: expectedDurationRecord },
            { message: "raw duration with all format flags", record: durationInput, format: "raw", expectedFieldValue: durationInput },
            { message: "display max duration with all format flags", record: maxInput, format: "display", expectedFieldValue: expectedMaxRecord },
            { message: "raw max duration with all format flags", record: maxInput, format: "raw", expectedFieldValue: maxInput },
            { message: "display min duration with all format flags", record: minInput, format: "display", expectedFieldValue: expectedMinRecord },
            { message: "raw min duration with all format flags", record: minInput, format: "raw", expectedFieldValue: minInput },
            { message: "display null duration with all format flags", record: nullInput, format: "display", expectedFieldValue: expectedNullRecord },
            { message: "raw null duration with all format flags", record: nullInput, format: "raw", expectedFieldValue: nullInput }
        ]
    }

    /**
     * Integration test that validates Duration records formatting with all field property flags set
     */
    it('Should create and retrieve duration display records when all format flags set', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsDurationDataProvider().length);
        recordBase.createApp(appWithAllFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var durationField;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === 'duration') {
                    durationField = field;
                }
            });
            assert(durationField, 'failed to find duration field');
            var records = allFlagsDurationDataProvider(durationField.id);
            //For each of the cases, create the record and execute the request
            var fetchRecordPromises = [];
            records.forEach(function (currentRecord) {
                recordBase.sleep(testConsts.TEST_CASE_SLEEP, function(){});
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
                            if (fieldValue.id === records[i].expectedFieldValue.id) {
                                assert.deepEqual(fieldValue, jsonBigNum.parse(records[i].expectedFieldValue), 'Unexpected field value returned: '
                                + JSON.stringify(fieldValue) + ', ' + records[i].expectedFieldValue);
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
