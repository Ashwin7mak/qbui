(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var apiResponseErrors = require('../../src/constants/apiResponseErrors');
    var apiResponseFormatter = require('../../src/api/quickbase/formatter/apiResponseFormatter');
    var httpStatusCodeConstants = require('../../src/constants/httpStatusCodes');
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

        var uniqueTextFieldName = 'uniqueText';
        var initialTextValue = 'Planche';
        var differentTextValue = 'Layout';

        var appWithUniqueFields = {
            name: 'Unique Fields App',
            tables: [
                {
                    name: 'table1',
                    fields: [
                        {
                            name: uniqueTextFieldName,
                            unique: true,
                            datatypeAttributes: {type: 'TEXT'},
                            type: 'SCALAR',
                            required: false
                        }
                    ]
                }
            ]
        };

        var makeTestRecord = function(fieldId, value) {
            if (!value) {
                value = initialTextValue;
            }

            return [{
                id: fieldId,
                value: value,
                fieldDef: {unique: true}
            }];
        };

        function createTestAppWithUniqueField() {
            return recordBase.createApp(appWithUniqueFields)
                .then(appCreatedResponse => {
                    let app = JSON.parse(appCreatedResponse.body);
                    let table = app.tables[0];
                    let uniqueTextField = _.find(table.fields, {name: uniqueTextFieldName});
                    let recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, table.id);
                    return {
                        endpoint: recordsEndpoint,
                        fieldId: uniqueTextField.id
                    };
                });
        }

        function createInitialRecord(payload) {
            return recordBase.createRecord(payload.endpoint, makeTestRecord(payload.fieldId)).then(() => {
                return payload;
            });
        }

        function createSecondRecordWhichWillBeEdited(payload) {
            return recordBase.createAndFetchRecord(payload.endpoint, makeTestRecord(payload.fieldId, differentTextValue)).then(response => {
                return {
                    endpoint: payload.endpoint,
                    fieldId: payload.fieldId,
                    recordId: _.find(response.record, {id: 3}).value
                };
            });
        }

        function assertUniqueValidationErrorsAreFormattedCorrectly(payload) {
            assert.equal(payload.response.statusCode, 500);
            var nodeLayerResponse = payload.response.body.response;
            assert.equal(nodeLayerResponse.status, httpStatusCodeConstants.UNPROCESSABLE_ENTITY, 'The wrong http status code was returned for an invalid record');
            assert.equal(nodeLayerResponse.errors.length, 1, 'An incorrect number of invalid fields was returned');
            assert.equal(nodeLayerResponse.errors[0].error.messageId, 'invalidMsg.api.notUniqueSingleField', 'The wrong internationalized error message was returned');
            assert(nodeLayerResponse.errors[0].isInvalid);
        }

        function attemptToCreateDuplicateRecordAndAssertFailure(payload) {
            return recordBase.createRecord(payload.endpoint, makeTestRecord(payload.fieldId))
                .then(() => {
                    assert(false, 'Duplicate record was accepted and it should have failed.');
                }).catch(createDuplicateRecordError => {
                    assertUniqueValidationErrorsAreFormattedCorrectly(createDuplicateRecordError);
                    return createDuplicateRecordError;
                });
        }

        function attemptToEditRecordAndAssertFailure(payload) {
            return recordBase.editRecord(payload.endpoint, payload.recordId, makeTestRecord(payload.fieldId))
                .then(() => {
                    assert(false, 'Record edits were accepted but should have failed the referential integrity constraint');
                }).catch(editRecordError => {
                    assertUniqueValidationErrorsAreFormattedCorrectly(editRecordError);
                    return editRecordError;
                });
        }

        //Cleanup the test realm after all tests in the block
        after(() => {
            return recordBase.apiBase.cleanup();
        });
    });
}());
