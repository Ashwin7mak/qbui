(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');


    /**
     * Integration test for Text field formatting
     */
    describe('API - Text record test cases', function() {

        // Application containing a Text field
        var exampleApp = {
            name  : 'Text App',
            tables: [
                {
                    name: 'table1', fields: [
                    {name: 'text', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'}
                    ]
                }
            ]
        };

        /**
         * Generates and returns a random string of specified length
         */
        function generateRandomString(size) {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var text = '';
            for (var i = 0; i < size; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        /**
         * DataProvider containing Records and record display expectations for Text field with various record values
         */
        function textRecordsDataProvider(fid) {
            var smallText = generateRandomString(10);
            var maxText = generateRandomString(3990);

            // Small text value
            var smallInput = [{id: fid, value: smallText}];
            var expectedSmallRecord = {id: fid, value: smallText, display: smallText};

            // Text value of 4000 characters
            var largeInput = [{id: fid, value: maxText}];
            var expectedLargeRecord = {id: fid, value: maxText, display: maxText};

            //Empty records
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            //null record value
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display small text',
                    record            : smallInput,
                    format            : 'display',
                    expectedFieldValue: expectedSmallRecord
                },
                {message: 'raw small text', record: smallInput, format: 'raw', expectedFieldValue: smallInput},
                {
                    message           : 'display maximum supported text',
                    record            : largeInput,
                    format            : 'display',
                    expectedFieldValue: expectedLargeRecord
                },
                {
                    message           : 'raw maximum supported text',
                    record            : largeInput,
                    format            : 'raw',
                    expectedFieldValue: largeInput
                },
                {
                    message           : 'display empty text',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {message: 'raw empty text', record: emptyInput, format: 'raw', expectedFieldValue: emptyInput},
                {
                    message           : 'display null text',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {message: 'raw null text', record: nullInput, format: 'raw', expectedFieldValue: nullInput}];
        }

        /**
         * Integration test that validates Text records formatting
         */
        it('Should create and retrieve display formatted text records', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * textRecordsDataProvider().length);
            recordBase.createApp(exampleApp).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var textField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'text') {
                        textField = field;
                    }
                });
                assert(textField, 'failed to find text field');
                var records = textRecordsDataProvider(textField.id);
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
