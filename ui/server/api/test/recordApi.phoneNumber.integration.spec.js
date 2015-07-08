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
 * Integration test for PhoneNumber field formatting
 */
describe('API - PhoneNumber record test cases', function () {
    //Cache the init promise so that test methods can use it as init.then(function(){...})
    var exampleApp = {
        "name": "PhoneNumber App",
        "tables": [
            {
                "name": "table1", "fields": [
                {"name": "phone", "type": "PHONE_NUMBER"}
            ]
            }
        ]
    };

    /**
     * DataProvider containing Records and record display expectations for PhoneNumber field with various record values
     */
    function phoneRecordsDataProvider(fid) {
        //Standard phone number
        var recordsInput = [{"id": fid, "value": "12345678"}];
        var expectedRecords = {"id": fid, "value": "(1) 234-5678", "display": "(1) 234-5678"};

        //More than 10 digit number
        var largeInput = [{"id": fid, "value": "1234567890123"}];
        var largeExpected = {"id": fid, "value": "123 (456) 789-0123", "display": "123 (456) 789-0123"};

        //Empty records
        var emptyPhoneRecords = [{"id": fid, "value": ""}];
        var expectedEmptyPhoneRecords = {"id": fid, "value": null, "display": ""};

        //null record value
        var nullPhoneRecords = [{"id": fid, "value": null}];
        var nullExpectedPhoneRecords = {"id": fid, "value": null, "display": ""};

        return [
            { message: "display phone number", record: recordsInput, format: "display", expectedFieldValue: expectedRecords },
            { message: "raw phone number", record: recordsInput, format: "raw", expectedFieldValue: recordsInput },
            { message: "display empty phone number", record: emptyPhoneRecords, format: "display", expectedFieldValue: expectedEmptyPhoneRecords},
            { message: "raw empty phone number", record: emptyPhoneRecords, format: "raw", expectedFieldValue: emptyPhoneRecords},
            { message: "display too-long phone number", record: largeInput, format: "display", expectedFieldValue: largeExpected },
            { message: "raw too-long phone number", record: largeInput, format: "raw", expectedFieldValue: largeInput },
            { message: "display null phone number", record: nullPhoneRecords, format: "display", expectedFieldValue: nullExpectedPhoneRecords },
            { message: "raw null phone number", record: nullPhoneRecords, format: "raw", expectedFieldValue: nullPhoneRecords }]
    }

    /**
     * Integration test that validates PhoneNumber records formatting 
     */
    it('Should create and retrieve display formatted phone records', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.createApp(exampleApp).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var phoneField;
            app.tables[0].fields.forEach(function (field) {
                if (field.type === 'PHONE_NUMBER') {
                    phoneField = field;
                }
            });
            assert(phoneField, 'failed to find phone field');
            var records = phoneRecordsDataProvider(phoneField.id);
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
