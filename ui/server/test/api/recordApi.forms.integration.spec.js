(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var log = require('../../src/logger').getLogger();
    var testConsts = require('./api.test.constants');
    var errorCodes = require('../../src/api/errorCodes');
    var testUtils = require('./api.test.Utils');
    var formGenerator = require('../../../test_generators/form.generator.js');
    var promise = require('bluebird');

    describe('API - Validate forms API endpoint execution', function() {
        const formTypeList = ['ADD', 'EDIT', 'VIEW'];
        let app;
        let forms;
        let targetFormBuildList;

        // App variable with different data fields
        const appWithNoFlags = {
            name: 'Form Integration App',
            tables: [
                {
                    name: 'Table with all support fields', fields: [
                        {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                        {name: 'Numeric Field', datatypeAttributes: {type: 'NUMERIC'}, type: 'SCALAR'},
                        {name: 'Currency Field', datatypeAttributes: {type: 'CURRENCY'}, type: 'SCALAR'},
                        {name: 'Percent Field', datatypeAttributes: {type: 'PERCENT'}, type: 'SCALAR'},
                        {name: 'Rating Field', datatypeAttributes: {type: 'RATING'}, type: 'SCALAR'},
                        {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
                        {name: 'Date Time Field', datatypeAttributes: {type: 'DATE_TIME'}, type: 'SCALAR'},
                        {name: 'Time of Day Field', datatypeAttributes: {type: 'TIME_OF_DAY'}, type: 'SCALAR'},
                        {name: 'Duration Field', datatypeAttributes: {type: 'DURATION'}, type: 'SCALAR'},
                        {name: 'Checkbox Field', datatypeAttributes: {type: 'CHECKBOX'}, type: 'SCALAR'},
                        {name: 'Phone Number Field', datatypeAttributes: {type: 'PHONE_NUMBER'}, type: 'SCALAR'},
                        {name: 'Email Field', datatypeAttributes: {type: 'EMAIL_ADDRESS'}, type: 'SCALAR'},
                        {name: 'Url Field', datatypeAttributes: {type: 'URL'}, type: 'SCALAR'},
                        {name: 'User Field', datatypeAttributes: {type: 'USER'}, type: 'SCALAR', "indexed": true}
                    ]
                },
                {
                    name: 'table2', fields: [
                        {name: 'Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                        {name: 'Numeric Field', datatypeAttributes: {type: 'NUMERIC'}, type: 'SCALAR'}
                    ]
                }
            ]
        };

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
         */
        before(function(done) {
            // Adding timeout() at top of each promises block enables Mocha resolves issues realted to network timeout,
            // and invoke done() method without further application code.
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);

                // Build forms using the info from created app
                forms = formGenerator.generateSingleTabAndSecFormWithAddAndEdit(app);

                let createRecordPromises = [];
                app.tables.map((table, index) => {
                    createRecordPromises.push(createRecordforAppTable(app, table));
                });
                promise.all(createRecordPromises).then(returnedRecords => {
                    let createReportPromises = [];
                    app.tables.map((table, index) => {
                        createReportPromises.push(createReportforTable(app, table));
                    });
                    promise.all(createReportPromises).then(reportResults => {
                        done();
                    });
                });
                return app;
            });
        });

        /**
         * Add records to each individual table under the provided app
         *
         * @param targetApp   the application to which the form being created belongs to
         * @param targetTable the application to which the form being created belongs to
         * @returns A promise to make node call
         */
        function createRecordforAppTable(targetApp, targetTable) {
            // Get the appropriate fields out of the Create App response (specifically the created field Ids)
            let nonBuiltInFields = recordBase.getNonBuiltInFields(targetTable);
            // Generate some record JSON objects to add to the app
            let generatedRecords = recordBase.generateRecords(nonBuiltInFields, 10);

            return new promise(function(resolve, reject) {
                recordBase.addRecords(targetApp, targetTable, generatedRecords).then(function(returnedRecords) {
                    resolve(returnedRecords);
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    reject(error);
                });
            });
        }

        /**
         * Build a test report for each individual table under the provided app
         *
         * @param targetApp   the application to which the form being created belongs to
         * @param targetTable the application to which the form being created belongs to
         * @returns A promise to make node call
         */
        function createReportforTable(targetApp, targetTable) {
            const reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(targetApp.id, targetTable.id);

            let reportToCreate = {
                name: 'testReportForTable' + targetTable.id,
                type: 'TABLE',
                tableId: targetTable.id,
                query: null
            };

            return new promise(function(resolve, reject) {
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(reportResults) {
                    let reportId = JSON.parse(reportResults.body).id;
                    resolve(reportId);
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    reject(error);
                });
            });
        }

        /**
         * Create a form on the specified table
         *
         * @param appId     the application to which the form being created belongs to
         * @param tableId   the application to which the form being created belongs to
         * @param form      the form is about to build
         * @return A promise to make node call
         *
         */
        function createForm(appId, tableId, form) {
            return new promise(function(resolve, reject) {
                const formEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);
                recordBase.apiBase.executeRequest(formEndpoint, 'POST', form).then(function(result) {
                    let formID =  JSON.parse(result.body).id;
                    resolve({appId, tableId, formID});
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    reject(error);
                });
            });
        }

        /**
         * get a form by using form id
         *
         * appId     the application to which the form being created belongs to
         * tableId   the table to which the form that is being created belongs to
         * formId    the form id
         * @return A promise to make node call
         *
         */
        function retriveFormByID(appId, tableId, formId) {
            const formEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId, formId);

            return new promise(function(resolve, reject) {
                recordBase.apiBase.executeRequest(formEndpoint, 'GET').then(function(result) {
                    const responseBody =  JSON.parse(result.body);
                    let resultFormID = responseBody.formId;
                    let resultAppID = responseBody.appId;
                    let resultTableID = responseBody.tableId;
                    resolve({'appId': resultAppID, 'tableId': resultTableID, 'formID' : resultFormID});
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    reject(error);
                });
            });
        }

        /**
         * get a form on the specified table by form type
         *
         * appId     the application to which the form being created belongs to
         * tableId   the table to which the form that is being created belongs to
         * formType  the form type
         * @return A promise to make node call
         *
         */
        function retriveFormByType(appId, tableId, formType) {
            const formEndpoint = recordBase.apiBase.resolveFormsEndpoint(appId, tableId);

            return new promise(function(resolve, reject) {
                recordBase.apiBase.executeRequest(formEndpoint, 'GET', null, null, '?formType=' + formType).then(function(result) {
                    const responseBody =  JSON.parse(result.body);
                    let resultFormID = responseBody.formId;
                    let resultAppID = responseBody.appId;
                    let resultTableID = responseBody.tableId;
                    resolve({'appId': resultAppID, 'tableId': resultTableID, 'formID' : resultFormID, formType});
                }).catch(function(error) {
                    console.log(JSON.stringify(error));
                    reject(error);
                });
            });
        }

        /**
         * Form creation test
         */
        describe("Form creation test cases", function() {
            it('Form creation normal case', function(done) {
                this.timeout(testConsts.INTEGRATION_TIMEOUT);
                let createFormsPromises = [];
                app.tables.map((table, index) => {
                    createFormsPromises.push(createForm(app.id, table.id, forms[index]));
                });

                promise.all(createFormsPromises).then(formIdList => {
                    //console.log(formIdList);
                    targetFormBuildList = formIdList;
                    assert(formIdList.length === app.tables.length, "Form creation test case is failed");
                    done();
                });
            });
        });

        /**
         * Get form information by form Id for a given table in the app
         */
        describe("Form request by form ID test cases", function() {
            it('Get form by ID', function(done) {

                if (!targetFormBuildList) {
                    assert(false, "Form creation test case is failed");
                    done();
                }
                this.timeout(testConsts.INTEGRATION_TIMEOUT);
                let getFormsPromises = [];

                targetFormBuildList.forEach(form => {
                    getFormsPromises.push(retriveFormByID(form.appId, form.tableId, form.formID));
                });

                promise.all(getFormsPromises).then(formIdList => {
                    assert.deepEqual(formIdList, targetFormBuildList);
                    done();
                });
            });
        });


        /**
         * Get form information by using provided form type.
         */
        describe("Form request by form type test cases", function() {
            it('Get form by form type normal case', function(done) {

                if (!targetFormBuildList) {
                    assert(false, "Form creation test case is failed");
                    done();
                }
                this.timeout(testConsts.INTEGRATION_TIMEOUT);
                let getFormsPromises = [];

                targetFormBuildList.forEach(form => {
                    formTypeList.forEach(formType => {
                        getFormsPromises.push(retriveFormByType(form.appId, form.tableId, formType));
                    });
                });

                promise.all(getFormsPromises).then(formIdList => {
                    //console.log(formIdList);
                    assert(formIdList.length === app.tables.length * formTypeList.length, "Get form by type test case is failed");
                    done();
                });
            });
        });

        // Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
