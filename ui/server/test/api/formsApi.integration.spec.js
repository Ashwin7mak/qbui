(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var log = require('../../src/logger').getLogger();
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var testConsts = require('./api.test.constants');
    var errorCodes = require('../../src/api/errorCodes');

    describe('Validate FormsApi integration tests', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        var app;
        var userId;
        var formId;

        var FORMAT = 'display';
        var actualRecords = [];
        var expectedRecords = [];

        // App variable with different data fields
        var appWithNoFlags = {
            name: 'test forms',
            tables: [
                {
                    name: 'table1', fields: [
                    {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                    {name: 'Date Time Field', datatypeAttributes: {type: 'DATE_TIME'}, type: 'SCALAR'},
                    {name: 'Email Field', datatypeAttributes: {type: 'EMAIL_ADDRESS'}, type: 'SCALAR'},
                    {name: 'Checkbox Field', datatypeAttributes: {type: 'CHECKBOX'}, type: 'SCALAR'},
                    {name: 'Null Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Empty Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                    ]
                }
            ]

        };

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and 5 records with different field types
         */
        before(function(done) {
            this.timeout(consts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            //create app, table with random fields and records
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                var nonBuiltInFields = recordBase.getNonBuiltInFields(app.tables[0]);
                // Generate some record JSON objects to add to the app
                var generatedRecords = recordBase.generateRecords(nonBuiltInFields, 5);
                //Add records to the table
                recordBase.addRecords(app, app.tables[0], generatedRecords).then(function(recordIdList) {
                    assert(recordIdList.length, generatedRecords.length, 'Num of records created does not match num of expected records');
                    //create a form
                    var formEndpoint = recordBase.apiBase.resolveFormsEndpoint(app.id, app.tables[0].id);
                    var formToCreate = {
                        tableId: app.tables[0].id,
                        appId: app.id,
                        name: 'testForm',
                    };
                    //Create a form
                    recordBase.apiBase.executeRequest(formEndpoint, consts.POST, formToCreate).then(function(reportResults) {
                        formId = JSON.parse(reportResults.body).id;
                        done();
                    });
                });
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
            return app;
        });

        /**
         * Tests for API call for table GET FORMCOMPONENTS which is intercepted by node and returns a formMeta obj which contains (formData and recordData and fieldsData) information
         */
        it('Verify API call GET FORMCOMPONENTS', function(done) {
            //get the actual record from the table
            recordBase.apiBase.executeRequest(recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id) + 1, consts.GET).then(function(actualRecordsResults) {
                var actualRecord = JSON.parse(actualRecordsResults.body);
                actualRecords.push(actualRecord.record);

                //Execute a GET report homepage which returns report object (metaData and data)
                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id) + 1 + '/FORMCOMPONENTS', consts.GET).then(function(formComponentsResults) {
                    var results = JSON.parse(formComponentsResults.body);

                    //Verify returned results has right form Id
                    //verify form meta Data
                    var formMetaData = JSON.parse(results.formMeta.body);
                    assert.deepEqual(formMetaData.appId, app.id);
                    assert.deepEqual(formMetaData.tableId, app.tables[0].id);
                    assert.deepEqual(formMetaData.formId, formId);
                    assert.deepEqual(formMetaData.name, 'testForm');

                    //verify record data
                    var recordsData = results.record;
                    expectedRecords.push(recordsData);
                    //Verify it returns single record
                    assert.deepEqual(expectedRecords.length, 1);
                    //Verify the record retruned is same as the generated record with recordId 1.
                    assert.deepEqual(actualRecords[0], expectedRecords[0]);

                    //verify fields data
                    var fieldsData = results.fields;
                    assert.deepEqual(fieldsData.length, 9);
                    done();
                });
            });
        });

        /**
         * Tests for API call for table GET FORMCOMPONENTS which is intercepted by node and returns a formMeta obj which contains (formData and recordData and fieldsData) information
         */
        xit('Negative Test to Verify API call GET FORMCOMPONENTS with Record that dose not Exists', function(done) {
            //Execute a GET report homepage which returns report object (metaData and data)
            recordBase.apiBase.executeRequest(recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id) + 6 + '/FORMCOMPONENTS', consts.GET).then(function(formComponentsResults) {
                var results = JSON.parse(formComponentsResults.body);
                //TODO verify it returns no recor found error.
                done();
            });
        });
    });
}());
