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

    //  TODO: disabled until individual tests can be run..
    xdescribe('Validate FormsApi integration tests', function() {
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
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'}
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
                        name: 'testForm'
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

        // Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });

        /**
         * Tests for API call for table GET FORMCOMPONENTS which is intercepted by node and returns a formMeta obj which contains (formData and recordData and fieldsData) information
         */
        xit('Verify API call GET FORMCOMPONENTS', function(done) {
            //get the actual record from the table
            recordBase.apiBase.executeRequest(recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id) + 1, consts.GET).then(function(actualRecordsResults) {
                var actualRecord = JSON.parse(actualRecordsResults.body);
                actualRecords.push(actualRecord.record);

                //Execute a GET form components (metaData and data)
                // TODO: this test fails because 10000 admin user does not have access rights to view the form component.  Disabled until able to grant those rights to the admin user or create another user with appropriate rights
                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id) + 1 + '/FORMCOMPONENTS?formType=view&format=' + FORMAT, consts.GET).then(function(formComponentsResults) {
                    var results = JSON.parse(formComponentsResults.body);

                    //verify form meta Data
                    var formMetaData = results.formMeta;
                    assert.deepEqual(formMetaData.appId, app.id);
                    assert.deepEqual(formMetaData.tableId, app.tables[0].id);
                    assert.deepEqual(formMetaData.formId, formId);
                    assert.deepEqual(formMetaData.name, 'testForm');

                    //verify record data..should be empty as no fields are defined on the form
                    assert.deepEqual(results.record, {});
                    assert.deepEqual(results.fields, {});
                    done();
                });
            });
        });

        /**
         * Tests for API call for table GET FORMCOMPONENTS which is intercepted by node and returns a formMeta obj which contains (formData and recordData and fieldsData) information
         */
        xit('Negative Test to Verify API call GET FORMCOMPONENTS with record that does not exist', function(done) {
            //Execute a GET report homepage which returns report object (metaData and data)
            recordBase.apiBase.executeRequest(recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id) + 6 + '/FORMCOMPONENTS?formType=view&format=' + FORMAT, consts.GET).then(function(formComponentsResults) {
                var results = JSON.parse(formComponentsResults.body);
                //TODO verify it returns no record found.
                done();
            });
        });
    });
}());
