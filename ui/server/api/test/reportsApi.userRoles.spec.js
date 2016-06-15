(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var log = require('../../logger').getLogger();
    var testConsts = require('./api.test.constants');
    var consts = require('../constants');
    var errorCodes = require('../errorCodes');

    var FORMAT = 'display';

    describe('API - Validate set tablehomepage and Validate report homepage', function() {
        // Set timeout for all tests in the spec file
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        // Global vars
        var app;
        var nonBuiltInFields;
        var generatedRecords;
        var records;

        var userId;
        var userIdsList = [];

        // App variable with different data fields
        var appWithNoFlags = {
            name: 'reportUserRoles',
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

        var user1 = {
            firstName        : "participantUser1",
            lastName         : "participantUser1",
            screenName       : "participantUser1",
            email            : "participantUser1@intuit.com",
            password         : 'quickbase',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer  : 'blue'
        };

        var user2 = {
            firstName        : "participantUser2",
            lastName         : "participantUser2",
            screenName       : "participantUser2",
            email            : "participantUser2@intuit.com",
            password         : 'quickbase',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer  : 'blue'
        };

        var user3 = {
            firstName        : "viewerUser1",
            lastName         : "viewerUser1",
            screenName       : "viewerUser1",
            email            : "viewerUser1@intuit.com",
            password         : 'quickbase',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer  : 'blue'
        };

        var user4 = {
            firstName        : "viewerUser2",
            lastName         : "viewerUser2",
            screenName       : "viewerUser2",
            email            : "viewerUser2@intuit.com",
            password         : 'quickbase',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer  : 'blue'
        };

        var user5 = {
            firstName        : "noneRole1",
            lastName         : "noneRole1",
            screenName       : "noneRole1",
            email            : "noneRole1@intuit.com",
            password         : 'quickbase',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer  : 'blue'
        };

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
         */
        before(function(done) {
            //create app, table with random fields and records
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                app = JSON.parse(appResponse.body);
                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                nonBuiltInFields = recordBase.getNonBuiltInFields(app.tables[0]);
                // Generate some record JSON objects to add to the app
                generatedRecords = recordBase.generateRecords(nonBuiltInFields, 10);
                // Add the records to the app
                recordBase.addRecords(app, app.tables[0], generatedRecords).then(function(returnedRecords) {
                    // Push the created records into an array (the add record call also returns the fields used)
                    var recordData = [];
                    for (var j in returnedRecords) {
                        recordData.push(returnedRecords[j].record);
                    }
                    records = recordData;
                }).then(function() {
                    //create 5 different users
                    recordBase.apiBase.createSpecificUser(user1).then(function(response) {
                        userIdsList.push(JSON.parse(response.body).id);
                        recordBase.apiBase.createSpecificUser(user2).then(function(response1) {
                            userIdsList.push(JSON.parse(response1.body).id);
                            recordBase.apiBase.createSpecificUser(user3).then(function(response2) {
                                userIdsList.push(JSON.parse(response2.body).id);
                                recordBase.apiBase.createSpecificUser(user4).then(function(response3) {
                                    userIdsList.push(JSON.parse(response3.body).id);
                                    recordBase.apiBase.createSpecificUser(user5).then(function(response4) {
                                        userIdsList.push(JSON.parse(response4.body).id);
                                        //add none role to user1
                                        recordBase.apiBase.assignUsersToAppRole(app.id, 9, [userIdsList[0]]).then(function() {
                                            //add participant role to user2 and user3
                                            recordBase.apiBase.assignUsersToAppRole(app.id, 10, [userIdsList[1], userIdsList[2]]).then(function() {
                                                //add viewer role to user4
                                                recordBase.apiBase.assignUsersToAppRole(app.id, 11, [userIdsList[3]]);
                                                //add admin role to user5
                                                recordBase.apiBase.assignUsersToAppRole(app.id, 12, [userIdsList[4]]);
                                                done();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                done(error);
            });
            return app;
        });

        /**
         * DataProvider for reports table home page
         */
        function reportHomePage() {
            return [
                {
                    message: 'Report with Participant Role access',
                    accessId: [10],
                    reportName: 'parReport'
                },
                {
                    message: 'Report with Viewer Role access',
                    accessId: [11],
                    reportName: 'viewerReport'
                },
                {
                    message: 'Report with None Role access',
                    accessId: [9],
                    reportName: 'noneReport'
                },
                {
                    message: 'Report with Viewer and participant role access',
                    accessId: [10, 11],
                    reportName: 'viewer_par_Report'
                },
                {
                    message: 'Report with Viewer and None role access',
                    accessId: [9, 11],
                    reportName: 'viewer_none_Report'
                },
                {
                    message: 'Report with all role access',
                    accessId: [9, 10, 11, 12],
                    reportName: 'All_Access_Report'
                }
            ];
        }

        reportHomePage().forEach(function(testCase) {
            it('Test case: ' + testCase.message, function(done) {
                //Create a report with different access permissions
                var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                var reportToCreate = {
                    name: testCase.reportName,
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null,
                    rolesWithGrantedAccess: testCase.accessId
                };
                //Create a report
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(reportResults) {
                    var report = JSON.parse(reportResults.body);
                    //set custom table HomePage with above created report
                    recordBase.apiBase.setDefaultTableHomePage(app.id, app.tables[0].id, report.id).then(function() {
                        //Execute a report table home Page
                        recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/homepage?format=' + FORMAT, consts.GET).then(function(homePageResults) {
                            var results = JSON.parse(homePageResults.body);
                            //Verify returned results has right report Id and role info
                            //verify report meta Data
                            var reportMetaData = JSON.parse(results.reportMetaData.data);
                            assert.deepEqual(reportMetaData.id, report.id);
                            assert.deepEqual(reportMetaData.name, testCase.reportName);
                            assert.deepEqual(reportMetaData.rolesWithGrantedAccess, testCase.accessId);

                            //verify report data
                            var reportData = results.reportData.data;
                            assert.deepEqual(reportData.groups, []);
                            assert.deepEqual(reportData.facets, []);
                            assert.deepEqual(reportData.records.length, 10);
                            done();
                        }).done(null, done);
                    }).done(null, done);
                }).done(null, function(error) {
                    // the then block threw an error
                    // so forward that error to Mocha
                    // same as calling .done(null, done)
                    done(error);
                });
            });
        });

        it('Negative Test - Default home page not set should return empty report meta data', function(done) {
            //Create a report with different access permissions
            var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
            var reportToCreate = {
                name: 'Test Report',
                type: 'TABLE',
                tableId: app.tables[0].id,
                query: null,
            };
            //Create a report
            recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(reportResults) {
                var report = JSON.parse(reportResults.body);
                //Execute a report table home Page
                recordBase.apiBase.executeRequest(recordBase.apiBase.resolveTablesEndpoint(app.id, app.tables[0].id) + '/homepage?format=' + FORMAT, consts.GET).then(function(homePageResults) {
                    var results = JSON.parse(homePageResults.body);
                    //Verify returned results has right report Id and role info
                    //verify report meta Data is empty
                    assert.deepEqual(results.reportMetaData.data, '');

                    //verify report data is empty
                    var reportData = results.reportData.data;
                    assert.deepEqual(results.reportData.data, '');
                    done();
                }).done(null, done);
            }).done(null, function(error) {
                // the then block threw an error
                // so forward that error to Mocha
                // same as calling .done(null, done)
                done(error);
            });
        });

    });

}());
