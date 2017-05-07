const assert = require('assert');
const assertStatusOk = require('../testHelpers/assertStatusOk');
require('../../src/app');
const config = require('../../src/config/environment');
const recordBase = require('./recordApi.base')(config);
const testConsts = require('./api.test.constants');
const apiResponseErrors = require('../../src/constants/apiResponseErrors');
const _ = require('lodash');
const constants = require('../../../common/src/constants');

// -- TEST VALUES --
const testFieldType = constants.TEXT;
const testFieldName = 'test field';
const testFieldUniqueNameFromServer = `${testFieldName}2`;
const fieldNameValidationErrorCode = 'BadRequestInvalidFieldNameLength';

const appWithNoFields = {
    name: 'App With No Fields',
    tables: [
        {
            name: 'table1',
            fields: []
        }
    ]
};

const updatedFieldName = 'updated test field';
const appWithExistingField = {
    name: 'App With One Field',
    tables: [
        {
            name: 'table1',
            fields: [
                buildField(testFieldName, constants.TEXT),
            ]
        }
    ]
};


// -- THE TESTS --
/**
 * Basic checks for fields routes have been added.
 * TODO: Additional negative tests once we use the API in a way that is more likely to fail
 */
describe('FieldsAPI', function() {
    this.timeout(testConsts.INTEGRATION_TIMEOUT);

    it('gets a list of all fields on a table', () => {
        return createTestAppAndReturnFieldId(appWithExistingField, true)
            .then(getFields)
            .then(assertFieldsWereReturned);
    });

    // Create field is heavily tested in many of our other tests, because a field must be created before records can be saved/updated
    // This is left here to ensure the base API has not changed (or the test will break if it does)
    it('creates a new field', () => {
        return createTestAppAndReturnFieldId(appWithNoFields, false)
            .then(createField)
            .then(assertFieldWasCreated);
    });

    it('updates an existing field', () => {
        return createTestAppAndReturnFieldId(appWithExistingField, true)
            .then(updateField)
            .then(assertFieldWasUpdated);
    });

    it('forces a field name to be unique', () => {
        return createTestAppAndReturnFieldId(appWithExistingField, true)
            .then(createField)
            .then(assertFieldWasCreatedWithUniqueName);
    });

    it('returns an error if the field name is blank', () => {
        return createTestAppAndReturnFieldId(appWithNoFields, false, true)
            .then(createFieldWithBlankName)
            .then(assertFieldValidationError);
    });
});


// -- PRIVATE HELPER METHODS --
function createTestAppAndReturnFieldId(app, hasField) {
    return recordBase.createApp(app)
        .then(appCreatedResponse => {
            const appObject = JSON.parse(appCreatedResponse.body);
            const table = appObject.tables[0];

            let field = null;

            // We can't get a field on create field test, because no fields exist on the table yet
            if (hasField) {
                field = findFieldInTableOrFail(table, testFieldName);
            }

            const fieldsEndpoint = recordBase.apiBase.resolveFieldsEndpoint(appObject.id, table.id);

            return {
                app: appObject,
                table,
                field,
                fieldsEndpoint,
            };
        });
}

function getFields(payload) {
    return recordBase.apiBase.executeRequest(payload.fieldsEndpoint, constants.GET)
        .then(getFieldsResponse => {
            return JSON.parse(getFieldsResponse.body);
        });
}

function createField(payload, hasEmptyFieldName = false) {
    let newFieldName = hasEmptyFieldName ? '' : testFieldName;

    return recordBase.apiBase.executeRequest(payload.fieldsEndpoint, constants.POST, buildField(newFieldName, testFieldType))
        .then(createFieldResponse => {
            return {
                app: payload.app,
                table: payload.table,
                fieldsEndpoint: payload.fieldsEndpoint,
                createdField: JSON.parse(createFieldResponse.body),
                statusCode: createFieldResponse.statusCode
            };
        }, errorResponse => {
            // Pass through the error and expect the assertions to handle it correctly
            return errorResponse;
        });
}

function createFieldWithBlankName(payload) {
    return createField(payload, true);
}

function updateField(payload) {
    return recordBase.apiBase.executeRequest(payload.fieldsEndpoint + payload.field.id, constants.PATCH, buildField(updatedFieldName, testFieldType, true))
        .then(updatedFieldResponse => {
            return {
                app: payload.app,
                table: payload.table,
                responseBody: updatedFieldResponse.body,
                statusCode: updatedFieldResponse.statusCode
            };
        }, errorResponse => {
            // Pass through the error and expect the assertions to handle it correctly
            return errorResponse;
        });
}

function buildField(name, type, required = false) {
    return {
        name: name,
        datatypeAttributes: {type: type},
        type: constants.SCALAR,
        required: required
    };
}

/**
 * We find the field by name because we don't always have the id when we need it.
 * @param table
 * @param fieldName
 */
function findFieldInTableOrFail(table, fieldName) {
    const field = _.find(table.fields, {name: fieldName});
    assert.notEqual(undefined, field, `"${fieldName}" required for test was not created`);
    return field;
}

/**
 * Get a fresh version of the table from the API. Returns table json.
 * @param {Object} payload
 * @param {string} payload.app.id
 * @param {string} payload.table.id
 */
function refreshTable(payload) {
    return recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(payload.app.id, payload.table.id), constants.GET)
        .then(tableResponse => {
            return JSON.parse(tableResponse.body);
        });
}

function assertFieldsWereReturned(fields) {
    return new Promise(resolve => {
        assert.equal(fields.length, 6); // Total is 6 because 5 build in fields + 1 created field
        assert.equal(fields[5].name, testFieldName);
        resolve();
    });
}

function assertFieldWasCreatedWithUniqueName(payload) {
    // Assert the field was persisted to the table schema
    return assertStatusCodeOk(payload)
        .then(assertFieldIdReturned)
        .then(refreshTable)
        .then(refreshedTable => {
            // Can't find the field by name for this test because it has been changed by Core
            const createdField = refreshedTable.fields.find(field => field.id === payload.createdField.id);
            assert.equal(createdField.name, testFieldUniqueNameFromServer);
            assert.equal(createdField.datatypeAttributes.type, testFieldType);
            assert.equal(createdField.required, false);
        });
}

/**
 * Assert that the api call has a successful status code (200 by default)
 * @param payload
 * @param statusCode (optional)
 * @returns {Promise}
 */
function assertStatusCodeOk(payload, statusCode = constants.HttpStatusCode.OK) {
    return new Promise(resolve => {
        assertStatusOk(payload.statusCode);
        resolve(payload);
    });
}

/**
 * Assert the server returns the id of the new field
 * @param payload
 * @returns {Promise}
 */
function assertFieldIdReturned(payload) {
    return new Promise(resolve => {
        assert.notEqual(payload.createdField.id, null, 'The server did not return a new id for the created field');
        resolve(payload);
    });
}

function assertFieldWasUpdated(payload) {
    // Assert the field was updated in the table schema
    return assertStatusCodeOk(payload)
        .then(refreshTable)
        .then(refreshedTable => {
            const updatedField = findFieldInTableOrFail(refreshedTable, updatedFieldName);
            assert.equal(updatedField.name, updatedFieldName, 'The field name was not updated, but it should have been');
            assert.equal(updatedField.datatypeAttributes.type, testFieldType, 'The field type should not have been changed');
            assert.equal(updatedField.required, true, 'The required property was not updated and it should have been');
        });
}

function assertFieldWasCreated(payload) {
    // Assert the field was persisted to the table schema
    return assertStatusCodeOk(payload)
        .then(assertFieldIdReturned)
        .then(refreshTable)
        .then(refreshedTable => {
            const createdField = findFieldInTableOrFail(refreshedTable, testFieldName);
            assert.equal(createdField.name, testFieldName, 'The field name for the new field was different than expected');
            assert.equal(createdField.datatypeAttributes.type, testFieldType, 'The field type for a new field was different than expected');
            assert.equal(createdField.required, false, 'The required property for the new field was different than expected');
        });
}

function assertFieldValidationError(payload) {
    return new Promise(resolve => {
        assert.equal(payload.statusCode, constants.HttpStatusCode.BAD_REQUEST);

        const responseBody = JSON.parse(payload.body);
        assert.equal(responseBody.length, 1, 'There was more than 1 error returned from the server. Only expected name to be invalid');
        assert.equal(responseBody[0].code, fieldNameValidationErrorCode, 'The error code was different than expected for a blank field name');

        resolve(payload);
    });
}
