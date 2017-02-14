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
    var constants = require('../../../common/src/constants');

    describe('API - Unique Fields', function() {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);

        var uniqueTextFieldName = 'uniqueText';
        var uniqueNumericFieldName = 'uniqueNumeric';
        var nonUniqueTextFieldName = 'notUniqueText';
        var initialTextValue = 'Planche';
        var differentTextValue = 'Layout';
        var numericValue = 1234;

        var appWithUniqueFields = {
            name: 'Unique Fields App',
            tables: [
                {
                    name: 'table1',
                    fields: [
                        {
                            name: uniqueTextFieldName,
                            unique: true,
                            datatypeAttributes: {type: constants.TEXT},
                            type: 'SCALAR',
                            required: false
                        }
                    ]
                }
            ]
        };

        var appWithoutUniqueFields = {
            name: 'Unique Fields App',
            tables: [
                {
                    name: 'table1',
                    fields: [
                        {
                            name: nonUniqueTextFieldName,
                            unique: false,
                            datatypeAttributes: {type: constants.TEXT},
                            type: 'SCALAR',
                            required: false
                        }
                    ]
                }
            ]
        };

        var appWithUniqueNumericField = {
            name: 'Unique Fields App with Numeric Field',
            tables: [
                {
                    name: 'table1',
                    fields: [
                        {
                            name: uniqueNumericFieldName,
                            unique: true,
                            datatypeAttributes: {type: constants.NUMERIC},
                            type: 'SCALAR',
                            required: false
                        }
                    ]
                }
            ]
        };

        it('correctly rejects a duplicate value in a unique field', () => {
            return createTestApp(appWithUniqueFields, uniqueTextFieldName)
                .then(createTestRecord)
                .then(attemptToCreateDuplicateRecordAndAssertFailure);
        });

        it('correctly rejects a record edit that duplicates a value in a unique field', () => {
            return createTestApp(appWithUniqueFields, uniqueTextFieldName)
                .then(createTestRecord)
                .then(createSecondRecordWhichWillBeEdited)
                .then(attemptToEditRecordAndAssertFailure);
        });

        it('correctly rejects a numeric field that duplicates a value in a unique field', () => {
            return createTestApp(appWithUniqueNumericField, uniqueNumericFieldName)
                .then(createTestRecord)
                .then(attemptToCreateDuplicateRecordAndAssertFailure);
        });

        it('allows a duplicate value when the unique property is set to false (default behavior, negative test)', () => {
            return createTestApp(appWithoutUniqueFields, nonUniqueTextFieldName)
                .then(createTestRecord)
                .then(createDuplicateRecordAndAssertSuccess);
        });

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

        function createTestApp(app, testFieldName) {
            return recordBase.createApp(app)
                .then(appCreatedResponse => {
                    var appObject = JSON.parse(appCreatedResponse.body);
                    var table = appObject.tables[0];
                    var uniqueTextField = _.find(table.fields, {name: testFieldName});
                    var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(appObject.id, table.id);
                    return {
                        endpoint: recordsEndpoint,
                        fieldId: uniqueTextField.id,
                        fieldType: uniqueTextField.datatypeAttributes.type
                    };
                });
        }

        function createTestRecord(payload) {
            var value = null;
            if (payload.fieldType === 'NUMERIC') {
                value = numericValue;
            }

            return recordBase.createRecord(payload.endpoint, makeTestRecord(payload.fieldId, value)).then(recordCreatedId => {
                return _.merge(payload, {recordId: recordCreatedId});
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
            return createTestRecord(payload)
                .then(() => {
                    assert(false, 'Duplicate record was accepted and it should have failed.');
                }).catch(createDuplicateRecordError => {
                    assertUniqueValidationErrorsAreFormattedCorrectly(createDuplicateRecordError);
                    return createDuplicateRecordError;
                });
        }

        function createDuplicateRecordAndAssertSuccess(payload) {
            return createTestRecord(payload)
                .then(recordCreated => {
                    assert(recordCreated.recordId, 'A record was not successfully created and it should have been.');
                    return recordCreated;
                }).catch(createDuplicateRecordError => {
                    assert(false, 'Duplicate record was rejected and it should have suceeded when unique is set to false.');
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
