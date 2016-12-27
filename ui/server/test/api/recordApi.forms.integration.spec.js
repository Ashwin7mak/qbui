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

    describe('API - Validate forms API endpoint execution', function() {
        let app;
        let forms;

        // App variable with different data fields
        const appWithNoFlags = {
            name: 'Form Integration App',
            tables: [
                {
                    name: 'table1', fields: [
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
                        {name: 'Null Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'},
                        {name: 'Empty Text Field', datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'}
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
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                forms = formGenerator.generateSingleTabAndSecFormWithAddAndEdit(app);
                done();
            }).catch(function(error) {
                log.error(JSON.stringify(error));
                done();
            });
            return app;
        });

        function createForms(formIdList, done) {
            app.tables.forEach((table, index) => {
                const formEndpoint = recordBase.apiBase.resolveFormsEndpoint(app.id, table.id);
                // Create form
                recordBase.apiBase.executeRequest(formEndpoint, 'POST', forms[index]).then(function(result) {
                    let formID =  JSON.parse(result.body);
                    console.log(result.body);
                    formIdList.push(formID.id);
                    done();
                }).catch(function(error) {
                    log.error(JSON.stringify(error));
                    done();
                });
            });
        }

        /**
         * Form creation test
         */
        it('Create a form', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            let createdFormIds = [];

            createForms(createdFormIds, function() {
                console.log("---------------");
                console.log(app.tables.length);
                console.log(createdFormIds);
                console.log("--------s------");
            });

            done();
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
