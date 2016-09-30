(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');


    /**
     * Integration test for Checkbox Field
     */
    describe('API - Checkbox test cases', function() {

        // Application containing a Checkbox field
        var checkboxApp = {
            name  : 'Checkbox App',
            tables: [
                {
                    name: 'table1', fields: [
                        {name: 'checkbox', datatypeAttributes: {type: 'CHECKBOX'}, type: 'SCALAR'},
                        {
                            name: 'checkbox',
                            datatypeAttributes: {type: 'CHECKBOX'},
                            type: 'SCALAR',
                            required: false
                        }
                    ]
                }
            ]
        };

        function checkboxDataProvider(fid) {
            return [
                {
                    message: 'display checkbox',
                    record: `[{id: ${fid}, value: ${false}}]`,
                    format: 'display',
                    expectedFieldValue: `{id: ${fid}, value: ${false}, display: ${false}}`
                },
                {
                    message: 'display checkbox',
                    record: `[{id: ${fid}, value: ${true}}]`,
                    format: 'display',
                    expectedFieldValue: `{id: ${fid}, value: ${true}, display: ${true}}`
                }
            ];
        }

        /**
         * Integration test that saves and retrives Checkbox records
         */
        it('Should create and retrieve valid checkbox records', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * checkboxDataProvider().length);

            recordBase.createApp(checkboxApp).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var checkboxField;
                var requiredCheckboxField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'checkbox') {
                        checkboxField = field;
                    }
                });
                assert(checkboxField, 'Did not find checkbox field');

                var records = checkboxDataProvider(checkboxField.id);
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
