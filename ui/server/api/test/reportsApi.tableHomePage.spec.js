(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var log = require('../../logger').getLogger();
    var recordBase = require('./recordApi.base')(config);
    var consts = require('../../../common/src/constants');
    var testConsts = require('./api.test.constants');
    var errorCodes = require('../errorCodes');

    describe('API - Validate report table home page execution', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        var app;
        var userId;
        var reportId;

        var FORMAT = 'display';
        var ADMIN_USER_ID = "10000";

        // App variable with different data fields
        var appWithNoFlags = {
            name: 'homePageReport',
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
         * Setup method. Generates JSON for an app, a table with different fields, and 10 records with different field types.
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
                var generatedRecords = recordBase.generateRecords(nonBuiltInFields, 10);
                //Add records to the table
                recordBase.addRecords(app, app.tables[0], generatedRecords).then(function(returnedRecords) {
                    //create report
                    var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                    var reportToCreate = {
                        name: 'testReport',
                        type: 'TABLE',
                        tableId: app.tables[0].id,
                        query: null,
                    };
                    //Create a report
                    recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(reportResults) {
                        reportId = JSON.parse(reportResults.body).id;
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
         * Data Provider for report homepage for various user roles
         */
        function reportHomePageTestCases() {
            return [
                {
                    message: 'Viewer Role',
                    roleId: 10,
                    roleReportIdMap: {"10":"1"},
                },
                {
                    message: 'Participant Role',
                    roleId: 11,
                    roleReportIdMap: {"11":"1"}
                },
                {
                    message: 'Admin Role',
                    roleId: 12,
                    roleReportIdMap: {"12":"1"}
                }
            ];
        }

        reportHomePageTestCases().forEach(function(testcase) {
            it('Verify API calls POST custdefaulthomepage, GET defaulthomepage and GET homepage for ', function(done) {
                //create user
                recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                    //add user to appRole
                    recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]).then(function() {
                        //POST custdefaulthomepage for a table
                        recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, testcase.roleReportIdMap).then(function() {
                            //get the user authentication
                            recordBase.apiBase.createUserAuthentication(userId).then(function() {
                                //Execute a GET table defaulthomepage
                                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/defaulthomepage?format=' + FORMAT, consts.GET).then(function(defaultHomePageResults) {
                                    assert.deepEqual(JSON.parse(defaultHomePageResults.body), "1");
                                    //Execute a GET report homepage
                                    recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/homepage?format=' + FORMAT, consts.GET).then(function(reportHomePageResults) {
                                        var results = JSON.parse(reportHomePageResults.body);
                                        //Verify returned results has right report Id and role info
                                        //verify report meta Data
                                        var reportMetaData = results.reportMetaData.data;
                                        assert.deepEqual(reportMetaData.id, reportId);
                                        assert.deepEqual(reportMetaData.name, 'testReport');

                                        //verify report data
                                        var reportData = results.reportData.data;
                                        assert.deepEqual(reportData.groups, []);
                                        assert.deepEqual(reportData.facets, []);
                                        assert.deepEqual(reportData.records.length, 10);

                                        //finally reset authentication back to Admin
                                        recordBase.apiBase.createUserAuthentication(ADMIN_USER_ID).then(function() {
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        it('Verify API calls POST defaulthomepage, GET defaulthomepage and GET homepage for ', function(done) {
            //POST defaulthomepage for a table
            recordBase.apiBase.setDefaultTableHomePage(app.id, '{\"' + app.tables[0].id + '\":"1"}').then(function() {
                //Execute a GET table home Page
                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/defaulthomepage?format=' + FORMAT, consts.GET).then(function(defaultHomePageResults) {
                    assert.deepEqual(JSON.parse(defaultHomePageResults.body), "1");
                    //Execute a GET report homepage
                    recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/homepage?format=' + FORMAT, consts.GET).then(function(reportHomePageResults) {
                        var results = JSON.parse(reportHomePageResults.body);
                        //Verify returned results has right report Id and role info
                        //verify report meta Data
                        var reportMetaData = results.reportMetaData.data;
                        assert.deepEqual(reportMetaData.id, reportId);
                        assert.deepEqual(reportMetaData.name, 'testReport');

                        //verify report data
                        var reportData = results.reportData.data;
                        assert.deepEqual(reportData.groups, []);
                        assert.deepEqual(reportData.facets, []);
                        assert.deepEqual(reportData.records.length, 10);
                        done();
                    });
                });
            });
        });

        it('Verify GET defaulthomepage and GET report homepage returns empty meta data if defaulthomepage not set', function(done) {
            //Execute a GET table home Page
            recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/defaulthomepage?format=' + FORMAT, consts.GET).then(function(defaultHomePageResults) {
                assert.deepEqual(defaultHomePageResults.body, '');
                //Execute a GET report homepage
                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/homepage?format=' + FORMAT, consts.GET).then(function(reportHomePageResults) {
                    var results = JSON.parse(reportHomePageResults.body);
                    //verify report meta Data is empty
                    assert.deepEqual(results.reportMetaData.data, '');

                    //verify report data is empty
                    var reportData = results.reportData.data;
                    assert.deepEqual(results.reportData.data, '');
                    done();
                });
            });
        });


    });
}());
