(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var log = require('../../logger').getLogger();
    //var testConsts = require('./api.test.constants');
    var consts = require('../constants');
    var testUtils = require('./api.test.Utils');
    var errorCodes = require('../errorCodes');

    // Bluebird Promise library
    var Promise = require('bluebird');
    // Generator modules
    var appGenerator = require('../../../test_generators/app.generator.js');

    var FORMAT = 'display';

    describe('API - Validate report visibility for different users with different roles', function() {
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
                    {name: 'Date Field', datatypeAttributes: {type: 'DATE'}, type: 'SCALAR'},
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
            this.timeout(consts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
            //create app, table with random fields and records
            recordBase.createApp(appWithNoFlags).then(function (appResponse) {
                app = JSON.parse(appResponse.body);

                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                nonBuiltInFields = recordBase.getNonBuiltInFields(app.tables[0]);
                // Generate some record JSON objects to add to the app
                generatedRecords = recordBase.generateRecords(nonBuiltInFields, 10);
                // Add the records to the app
                recordBase.addRecords(app, app.tables[0], generatedRecords).then(function (returnedRecords) {
                    // Push the created records into an array (the add record call also returns the fields used)
                    var recordData = [];
                    for (var j in returnedRecords) {
                        recordData.push(returnedRecords[j].record);
                    }
                    records = recordData;
                }).then(function() {
                    //create 5 different users
                    recordBase.apiBase.createSpecificUser(user1).then(function (response) {
                        userIdsList.push(JSON.parse(response.body).id);
                        console.log("the user id list is: " + userIdsList);
                        recordBase.apiBase.createSpecificUser(user2).then(function (response) {
                            userIdsList.push(JSON.parse(response.body).id);
                            console.log("the user id list is: " + userIdsList);
                            recordBase.apiBase.createSpecificUser(user3).then(function (response) {
                                userIdsList.push(JSON.parse(response.body).id);
                                console.log("the user id list is: " + userIdsList);
                                recordBase.apiBase.createSpecificUser(user4).then(function (response) {
                                    userIdsList.push(JSON.parse(response.body).id);
                                    console.log("the user id list is: " + userIdsList);
                                    recordBase.apiBase.createSpecificUser(user5).then(function (response) {
                                        userIdsList.push(JSON.parse(response.body).id);
                                        console.log("the user id list is: " + userIdsList);
                                        //add participant role to user1 and user2
                                        recordBase.apiBase.assignUsersToAppRole(app.id, 11, [userIdsList[0], userIdsList[1]]).then(function () {
                                            //add viewer role to user3 and user4
                                            recordBase.apiBase.assignUsersToAppRole(app.id, 10, [userIdsList[2], userIdsList[3]]).then(function () {
                                               //add NONE role to user5
                                                recordBase.apiBase.assignUsersToAppRole(app.id, 9, [userIdsList[4]]);
                                                done();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }).catch(function (error) {
                log.error(JSON.stringify(error));
                done();
            });
            return app, userIdsList;
        });

        /**
         * DataProvider containing Records and record display expectations for User field with no display props set
         */
        function reportUserPermissions() {
            return [
                {
                    message: 'Report with just Participant permissions',
                    accessId: [10]
                },
                //{
                //    message: 'Report with just Viewer permissions',
                //    accessId: [11]
                //},
                //{
                //    message: 'Report with just None permissions',
                //    accessId: [9]
                //},
                //{
                //    message: 'Report with Viewer and participant permissions',
                //    accessId: [10, 11]
                //},
                //{
                //    message: 'Report with Viewer and None permissions',
                //    accessId: [9, 11]
                //},
                //{
                //    message: 'Report with Participant, Viewer and None permissions',
                //    accessId: [9, 10, 11]
                //}
            ];
        }

        reportUserPermissions().forEach(function(testCase) {
            it.only('Test case: ' + testCase.message, function (done) {
                this.timeout(consts.INTEGRATION_TIMEOUT * reportUserPermissions().length);
                //Create a report with different access permissions
                var reportEndpoint = recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                var reportToCreate = {
                    name: testUtils.generateRandomString(5),
                    type: 'TABLE',
                    tableId: app.tables[0].id,
                    query: null,
                    rolesWithGrantedAccess: testCase.accessId
                };
                //Create a report
                recordBase.apiBase.executeRequest(reportEndpoint, consts.POST, reportToCreate).then(function(report) {
                    var r = JSON.parse(report.body);
                    //Execute a report
                    recordBase.apiBase.executeRequest(reportEndpoint + r.id + '/results?format=' + FORMAT, consts.GET).then(function(reportResults) {
                        var results = JSON.parse(reportResults.body);
                        //Verify returned record ids
                        //verifyRecords(results);
                        done();
                    });
                }).catch(function(error) {
                    log.error(JSON.stringify(error));
                    done();
                });
            });
        });


    });
}());