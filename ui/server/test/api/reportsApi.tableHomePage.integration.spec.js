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

    xdescribe('API - Validate report table home page execution', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        var app;
        var userId;
        var reportId;
        var reportId2;

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
                    }).then(function() {
                        //create report 2
                        var reportEndpoint2 = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                        var reportToCreate2 = {
                            name: 'testReport2',
                            type: 'TABLE',
                            tableId: app.tables[0].id,
                            query: null,
                        };
                        //Create a report
                        recordBase.apiBase.executeRequest(reportEndpoint2, consts.POST, reportToCreate2).then(function(reportResults) {
                            reportId2 = JSON.parse(reportResults.body).id;
                            done();
                        });
                    });
                }).catch(function(error) {
                    log.error(JSON.stringify(error));
                    done();
                });
                return app;
            });
        });

        beforeEach(function(done) {
            //set the authentication to Admin
            recordBase.apiBase.createUserAuthentication(ADMIN_USER_ID).then(function() {
                done();
            });
        });

        /**
         * Function that creates JSON for roleId reportId map for custdefaulthomepage POST
         */
        function createRoleReportMapJSON(roleId, report_Id) {
            var jsonStr = '{"' + roleId + '":"' + report_Id + '"}';
            return JSON.parse(jsonStr);
        }

        /**
         * Negative Test the API GET table defaulthomepage and GET homepage should return empty if table POST defaulthomepage not set
         */
        xit('Negative Test - Verify GET defaulthomepage and GET report homepage returns empty meta data if defaulthomepage not set', function(done) {
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

        /**
         * Negative Test for roles.If POST custdefaulthomepage is set for participant and authenticate as viewer should return empty data for defaulthomepage and homepages GET'S.
         */
        xit('Negative Test - Give custdefaulthomepage permission to participant verify GET defaulthomepage as viewer', function(done) {
            //create user 1
            recordBase.apiBase.createUser().then(function(userResponse1) {
                var userId1 = JSON.parse(userResponse1.body).id;
                //add userId1 to participant appRole
                recordBase.apiBase.assignUsersToAppRole(app.id, "11", [userId1]).then(function() {
                    //create user2
                    recordBase.apiBase.createUser().then(function(userResponse2) {
                        var userId2 = JSON.parse(userResponse2.body).id;
                        //add userId2 to viewer appRole
                        recordBase.apiBase.assignUsersToAppRole(app.id, "10", [userId2]).then(function() {
                            //add custdefaulthomepage permission to participant
                            recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON("11", reportId)).then(function() {
                                //get the user authentication as viewer
                                recordBase.apiBase.createUserAuthentication(userId2).then(function() {
                                    //Execute a GET table defaulthomepage
                                    recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/defaulthomepage?format=' + FORMAT, consts.GET).then(function(defaultHomePageResults) {
                                        //verify GET defaulthomepage returns empty
                                        assert.deepEqual(defaultHomePageResults.body, "");
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
                        });
                    });
                });
            });
        });

        /**
         * Tests for API call for table POST defaulthomepage and GET defaulthomepage which is a call to the core api from node (node is only forwarding the request)
         * that returns the homepage report id(if any).
         */
        xit('Verify API calls POST defaulthomepage and GET defaulthomepage ', function(done) {
            //POST defaulthomepage for a table
            recordBase.apiBase.setDefaultTableHomePage(app.id, app.tables[0].id, "1").then(function() {
                //Execute a GET table home Page
                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/defaulthomepage?format=' + FORMAT, consts.GET).then(function(defaultHomePageResults) {
                    assert.deepEqual(JSON.parse(defaultHomePageResults.body), "1");
                    done();
                });
            });
        });

        /**
         * Data Provider for report homepage for various user roles
         */
        function reportHomePageTestCases() {
            return [
                {
                    message: 'Viewer Role',
                    roleId: 10,
                    reportId: 1,
                    reportName: 'testReport'
                },
                {
                    message: 'Participant Role',
                    roleId: 11,
                    reportId: 2,
                    reportName: 'testReport2'
                },
                {
                    message: 'Admin Role',
                    roleId: 12,
                    reportId: 1,
                    reportName: 'testReport'
                }
            ];
        }

        /**
         * Tests for API call for table POST custdefaulthomepage and GET report homepage which is intercepted by node and returns a report obj (metaData and data)
         */
        reportHomePageTestCases().forEach(function(testcase) {
            xit('Verify API calls POST custdefaulthomepage, and GET homepage for ' + testcase.message, function(done) {
                //create user
                recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                    //add user to appRole
                    recordBase.apiBase.assignUsersToAppRole(app.id, testcase.roleId, [userId]).then(function(userRoleResponse) {
                        //POST custdefaulthomepage for a table
                        recordBase.apiBase.setCustDefaultTableHomePageForRole(app.id, app.tables[0].id, createRoleReportMapJSON(testcase.roleId, testcase.reportId)).then(function() {
                            //get the user authentication
                            recordBase.apiBase.createUserAuthentication(userId).then(function() {
                                //Execute a GET report homepage which returns report object (metaData and data)
                                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/homepage?format=' + FORMAT, consts.GET).then(function(reportHomePageResults) {
                                    var results = JSON.parse(reportHomePageResults.body);
                                    //Verify returned results has right report Id and role info
                                    //verify report meta Data
                                    var reportMetaData = results.reportMetaData.data;
                                    assert.deepEqual(reportMetaData.id, testcase.reportId);
                                    assert.deepEqual(reportMetaData.name, testcase.reportName);

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
                });
            });
        });


        //Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup();
            done();
        });
    });
}());
