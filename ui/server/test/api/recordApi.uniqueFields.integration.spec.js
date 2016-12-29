(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var apiResponseErrors = require('../../src/constants/apiResponseErrors');
    var _ = require('lodash');

    /**
     * Integration test for Checkbox Field
     */
    describe('API - Unique Fields', function() {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);

        it('correctly rejects a duplicate value in a unique field', () => {
            return createTestAppWithUniqueField()
                .then(createInitialRecord)
                .then(attemptToCreateDuplicateRecordAndAssertFailure);
        });

        it('correctly rejects a record edit that duplicates a value in a unique field', () => {
            return createTestAppWithUniqueField()
                .then(createInitialRecord)
                .then(createSecondRecordWhichWillBeEdited)
                .then(attemptToEditRecordAndAssertFailure);
        });

        var appWithUniqueFields = {
            name: 'Unique Fields App',
            tables: [
                {
                    name: 'table1',
                    fields: [
                        {
                            name: 'uniqueText',
                            unique: true,
                            datatypeAttributes: {type: 'TEXT'},
                            type: 'SCALAR',
                            required: false
                        }
                    ]
                }
            ]
        };

        var testRecord = function(fieldId, value) {
            if (!value) {
                value = 'test';
            }
            return [{record: [
                {
                    id: fieldId,
                    value: value
                }
            ]}];
        };

        function createTestAppWithUniqueField() {
            return recordBase.createApp(appWithUniqueFields)
                .then(appCreatedResponse => {
                    let app = JSON.parse(appCreatedResponse.body);
                    let table = app.tables[0];
                    let uniqueTextField = _.find(table.fields, {name: 'uniqueText'});
                    let recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                    return {
                        endpoint: recordsEndpoint,
                        fieldId: uniqueTextField.id
                    };
                });
        }

        function createInitialRecord(payload) {
            return recordBase.createRecords(payload.endpoint, testRecord(payload.fieldId)).then(() => {
                return payload;
            });
        }

        function createSecondRecordWhichWillBeEdited(payload) {
            return recordBase.createAndFetchRecord(payload.endpoint, testRecord(payload.fieldId, 'testB')[0].record).then((response) => {
                return {
                    endpoint: payload.endpoint,
                    fieldId: payload.fieldId,
                    recordId: _.find(response.record, {id: 3}).value
                };
            });
        }

        function attemptToCreateDuplicateRecordAndAssertFailure(payload) {
            return recordBase.createRecords(payload.endpoint, testRecord(payload.fieldId, 'test')).then(createDuplicateRecordResponse => {
                assert(false, 'Duplicate record was accepted and it should have failed.');
            }, createDuplicateRecordResponsesError => {
                var responseBody = JSON.parse(createDuplicateRecordResponsesError.response.body)[0];
                assert.equal(responseBody.code, apiResponseErrors.NOT_UNIQUE_VALUE, 'Error code ' + responseBody.code + ' does not match expected NotUniqueKeyFieldValue error code');
            });
        }

        function attemptToEditRecordAndAssertFailure(payload) {
            return recordBase.editRecord(payload.endpoint, payload.recordId, testRecord(payload.fieldId)[0].record)
                .then(function(response) {
                    assert(false, 'Record edits were accepted but should have failed the referential integrity constraint');
                }, function(errResponse) {
                    assert.equal(JSON.parse(errResponse.response.body)[0].code, apiResponseErrors.INVALID_RECORD);
                    assert.equal(JSON.parse(errResponse.response.body)[0].message,  apiResponseErrors.NOT_UNIQUE_VALUE_MESSAGE);
                });
        }

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
