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

// NOTE: This test relies on the fact that our integration tests do not pass through the node layer
// on their way to core. We currently only assert Node layer interception when the request is returned.
// If this changes, then these tests will break because the Node layer will convert the empty strings to null
// and they will pass validation. The tests would need to be updated to show success when an empty string is
// used for a numeric field and we would have to find another way to produce the InvalidRecord error in Core.

// We need to use function() instead of fat-arrow syntax for the first function
// because fat arrow functions do not have their own 'this' context so `this.timeout` cannot be found.
describe('Invalid Records Response', function() {
    this.timeout(testConsts.INTEGRATION_TIMEOUT);

    // Constants are specific to the logic flow in this test
    var CREATE_RECORD = 'create';
    var EDIT_RECORD = 'edit';

    var invalidNumericValue = '';
    var numericFieldName = 'Numeric Field';
    var percentFieldName = 'Percent Field';
    var durationFieldName = 'Duration Field';
    var ratingFieldName = 'Rating Field';
    var textFieldName = 'Text Field';

    var appWithNumericFields = {
        name: 'App With Numeric Fields',
        tables: [
            {
                name: 'table1',
                fields: [
                    buildField(numericFieldName, constants.NUMERIC),
                    buildField(percentFieldName, constants.PERCENT),
                    buildField(durationFieldName, constants.DURATION),
                    buildField(ratingFieldName, constants.RATING),
                    buildField(textFieldName, constants.TEXT)
                ]
            }
        ]
    };

    // To speed up the test suite, the negative test is included at the end with the text field instead
    // of building a new app/fields only for that quick negative test
    it('rejects a blank string for a numeric-type fields when record created', () => {
        return createTestAppAndReturnFieldIds(appWithNumericFields, CREATE_RECORD)
            .then(assertBlankStringNumericIsInvalid)
            .then(assertBlankStringPercentIsInvalid)
            .then(assertBlankStringDurationIsInvalid)
            .then(assertBlankStringRatingIsInvalid)
            .then(assertBlankStringIsValidForText);
    });

    it('rejects a blank string for a numeric-type fields when record edited', () => {
        return createTestAppAndReturnFieldIds(appWithNumericFields, EDIT_RECORD)
            .then(createValidNumericRecords)
            .then(assertBlankStringNumericIsInvalid)
            .then(assertBlankStringPercentIsInvalid)
            .then(assertBlankStringDurationIsInvalid)
            .then(assertBlankStringRatingIsInvalid)
            .then(assertBlankStringIsValidForText);
    });

    function createTestAppAndReturnFieldIds(app, createOrEdit) {
        return recordBase.createApp(app)
            .then(appCreatedResponse => {
                var appObject = JSON.parse(appCreatedResponse.body);
                var table = appObject.tables[0];
                var fields = {
                    [numericFieldName]: findFieldInTableOrFail(table, numericFieldName),
                    [percentFieldName]: findFieldInTableOrFail(table, percentFieldName),
                    [durationFieldName]: findFieldInTableOrFail(table, durationFieldName),
                    [ratingFieldName]: findFieldInTableOrFail(table, ratingFieldName),
                    [textFieldName]: findFieldInTableOrFail(table, textFieldName),
                };
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(appObject.id, table.id);
                return {
                    endpoint: recordsEndpoint,
                    fields: fields,
                    createdOrEdit: createOrEdit
                };
            });
    }

    function buildRecord(fieldId, value) {
        return {
            id: fieldId,
            value: value || invalidNumericValue
        };
    }

    function createValidNumericRecords(payload) {
        var newFields = _.map(payload.fields, field => {
            // Create the record with correct datatype for single text field. The rest are numeric.
            if (field.datatypeAttributes.type === constants.TEXT) {
                return buildRecord(field.id, 'test');
            }

            return buildRecord(field.id, 13);
        });

        return recordBase.createRecord(payload.endpoint, newFields)
            .then(newRecordId => {
                assert(_.isNumber(newRecordId), 'A valid record id was not returned from the createRecord request');
                return Object.assign({}, payload, {newRecordId: newRecordId});
            })
            .catch(error => {
                assert(false, 'A valid record was not created and it should have been.');
            });
    }

    function attemptToCreateRecordWithValueOfBlankString(recordsEndpoint, field, payload) {
        var promise;
        if (payload.createOrEdit === EDIT_RECORD) {
            promise = recordBase.editRecord(recordsEndpoint, payload.newRecordId, [buildRecord(field.id)]);
        } else {
            promise = recordBase.createRecord(recordsEndpoint, [buildRecord(field.id)]);
        }

        return promise
            .then(() => {
                assert(false, `${field.name} accepted a blank string and it should have failed`);
            })
            .catch(createRecordError => {
                assertExpectedError(createRecordError.response);
                return payload;
            });
    }

    function assertBlankStringNumericIsInvalid(payload) {
        return attemptToCreateRecordWithValueOfBlankString(payload.endpoint, payload.fields[numericFieldName], payload);
    }

    function assertBlankStringPercentIsInvalid(payload) {
        return attemptToCreateRecordWithValueOfBlankString(payload.endpoint, payload.fields[percentFieldName], payload);
    }

    function assertBlankStringDurationIsInvalid(payload) {
        return attemptToCreateRecordWithValueOfBlankString(payload.endpoint, payload.fields[durationFieldName], payload);
    }

    function assertBlankStringRatingIsInvalid(payload) {
        return attemptToCreateRecordWithValueOfBlankString(payload.endpoint, payload.fields[ratingFieldName], payload);
    }

    function assertBlankStringIsValidForText(payload) {
        return recordBase.createRecord(payload.endpoint, [buildRecord(payload.fields[textFieldName].id)])
            .then((newRecordId) => {
                assert(_.isNumber(newRecordId), 'A new record ID was not returned suggesting a problem creating the record. The record should have been created.');
                return payload;
            })
            .catch(createRecordError => {
                assert(false, `${field.name} (text field) did not accept a blank string as a valid value`);
            });
    }

    function assertExpectedError(response) {
        // Core currently returns 404 (Not found) instead of 422 (Unprocessable Entity).
        // Node layer converts to 500 when promise is rejected and Client-UI relies on this status code currently.
        // But Node response body has correct error code (422)
        // https://quickbase.atlassian.net/browse/CORE-1070
        assert.equal(response.statusCode, 500);
        var nodeLayerResponse = response.body.response;
        assert.equal(nodeLayerResponse.status, httpStatusCodeConstants.UNPROCESSABLE_ENTITY, 'The wrong HTTP status code was returned for an invalid record');
        assert.equal(nodeLayerResponse.errors.length, 1, 'An incorrect number of invalid fields was returned');
        assert.equal(nodeLayerResponse.errors[0].error.messageId, 'invalidMsg.api.invalidRecord', 'The wrong I18nMessageKey was returned.');
        assert(nodeLayerResponse.errors[0].isInvalid, 'isInvalid should be false');
    }

    function buildField(name, type) {
        return {
            name: name,
            datatypeAttributes: {type: type},
            type: constants.SCALAR,
            required: false
        };
    }

    function findFieldInTableOrFail(table, fieldName) {
        var field = _.find(table.fields, {name: fieldName});
        assert.notEqual(undefined, field, `"${fieldName}" required for test was not created`);
        return field;
    }

    //Cleanup the test realm after all tests in the block
    after(() => {
        return recordBase.apiBase.cleanup();
    });
});
