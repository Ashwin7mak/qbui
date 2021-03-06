(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');
    var _ = require('lodash');


    /**
     * Integration test for PhoneNumber field formatting
     */
    describe('API - PhoneNumber record test cases', function() {
        //Cache the init promise so that test methods can use it as init.then(function(){...})
        var exampleApp = {
            name  : 'PhoneNumber App',
            tables: [
                {
                    name: 'table1', fields: [
                    {name: 'phone', datatypeAttributes: {type: 'PHONE_NUMBER'}, type: 'SCALAR'}
                    ]
                }
            ]
        };

        function buildDisplayValue(options) {
            var defaults = {
                countryCode: 1,
                display: '',
                extension: null,
                extraDigits: null,
                internationalNumber: null,
                internetDialableNumber: null,
                isDialable: false
            };

            if (!options) {
                return defaults;
            }

            return _.assign(defaults, options);
        }

        /**
         * DataProvider containing Records and record display expectations for PhoneNumber field with various record values
         */
        function phoneRecordsDataProvider(fid) {
            //Standard phone number
            var recordsInput = [{id: fid, value: '12345678'}];
            var expectedRecords = {id: fid, value: '12345678', display: buildDisplayValue({display: '(1) 234-5678'})};

            //More than 10 digit number
            var largeInput = [{id: fid, value: '1234567890123'}];
            var largeExpected = {id: fid, value: '1234567890123', display: buildDisplayValue({
                countryCode: 1,
                display: '(234) 567-8901',
                extraDigits: '23',
                internationalNumber: '+1 234-567-8901',
                internetDialableNumber: 'tel:+1-234-567-8901',
                isDialable: true,
            })};

            //Possible international number
            var possibleInternationalInput = [{id: fid, value: '33970736012'}];
            var possibleInternationalExpected = {id: fid, value: '33970736012', display: buildDisplayValue({
                countryCode: 33,
                display: '+33 9 70 73 60 12',
                internationalNumber: '+33 9 70 73 60 12',
                internetDialableNumber: 'tel:+33-9-70-73-60-12',
                isDialable: true
            })};

            //Empty records
            var emptyPhoneRecords = [{id: fid, value: ''}];
            var expectedEmptyPhoneRecords = {id: fid, value: null, display: buildDisplayValue({display: '', countryCode: null})};

            //null record value
            var nullPhoneRecords = [{id: fid, value: null}];
            var nullExpectedPhoneRecords = {id: fid, value: null, display: buildDisplayValue({display: '', countryCode: null})};

            return [
                {
                    message           : 'display phone number',
                    record            : recordsInput,
                    format            : 'display',
                    expectedFieldValue: expectedRecords
                },
                {message: 'raw phone number', record: recordsInput, format: 'raw', expectedFieldValue: recordsInput},
                {
                    message           : 'display empty phone number',
                    record            : emptyPhoneRecords,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyPhoneRecords
                },
                {
                    message           : 'raw empty phone number',
                    record            : emptyPhoneRecords,
                    format            : 'raw',
                    expectedFieldValue: emptyPhoneRecords
                },
                {
                    message           : 'display too-long phone number',
                    record            : largeInput,
                    format            : 'display',
                    expectedFieldValue: largeExpected
                },
                {
                    message           : 'raw too-long phone number',
                    record            : largeInput,
                    format            : 'raw',
                    expectedFieldValue: largeInput
                },
                {
                    message           : 'display null phone number',
                    record            : nullPhoneRecords,
                    format            : 'display',
                    expectedFieldValue: nullExpectedPhoneRecords
                },
                {
                    message           : 'raw null phone number',
                    record            : nullPhoneRecords,
                    format            : 'raw',
                    expectedFieldValue: nullPhoneRecords
                },
                {
                    message           : 'display a possible international phone number',
                    record            : possibleInternationalInput,
                    format            : 'display',
                    expectedFieldValue: possibleInternationalExpected
                },
                {
                    message           : 'raw null phone number',
                    record            : possibleInternationalInput,
                    format            : 'raw',
                    expectedFieldValue: possibleInternationalInput
                }
            ];
        }

        /**
         * Integration test that validates PhoneNumber records formatting
         */
        it('Should create and retrieve display formatted phone records', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * phoneRecordsDataProvider().length);
            recordBase.createApp(exampleApp).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var phoneField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.datatypeAttributes.type === 'PHONE_NUMBER') {
                        phoneField = field;
                    }
                });
                assert(phoneField, 'failed to find phone field');
                var records = phoneRecordsDataProvider(phoneField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
                            .then(function(results) {
                                for (var j = 0; j < results.length; j++) {
                                    var currentRecord = results[j];
                                    if (results[j].record) {
                                        currentRecord = results[j].record;
                                    }

                                    currentRecord.forEach(function(fieldValue) {
                                        if (fieldValue.id === records[j].expectedFieldValue.id) {
                                            assert.deepEqual(fieldValue, records[j].expectedFieldValue, 'Unexpected field value returned: ' +
                                                                                                              JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[j].expectedFieldValue));
                                        }
                                    });
                                }
                                done();
                            }).catch(function(errorMsg) {
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
                            });
                });
            });
        });

        //Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
