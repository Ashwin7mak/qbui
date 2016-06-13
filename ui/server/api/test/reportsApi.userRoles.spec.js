(function() {
    'use strict';
    var assert = require('assert');
    var promise = require('bluebird');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var log = require('../../logger').getLogger();
    var testConsts = require('./api.test.constants');
    var testUtils = require('./api.test.Utils');
    var errorCodes = require('../errorCodes');

    // Bluebird Promise library
    var Promise = require('bluebird');
    // Generator modules
    var appGenerator = require('../../../test_generators/app.generator.js');

    describe('API - Validate report visibility for different users with different roles', function() {
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

        function addUsersToAppRole(appId, roleId, userIds) {
            var deferred = promise.pending();
            var userJSON = {
                id      : userIds
            };
            var userRolesEndpoint = recordBase.apiBase.resolveUserRolesEndpoint(appId, roleId);
            recordBase.apiBase.executeRequest(userRolesEndpoint, 'POST',userJSON).then(function(result) {
                //console.log('Report create result');
                var parsed = JSON.parse(result.body);
                var id = parsed.id;
                deferred.resolve(id);
            }).catch(function(error) {
                console.error(JSON.stringify(error));
                deferred.reject(error);
            });
            return deferred.promise;
        };

        ///**
        // * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
        // */
        //before(function(done) {
        //    this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
        //    //create app, table with random fields and records
        //    recordBase.createApp(appWithNoFlags).then(function (appResponse) {
        //        app = JSON.parse(appResponse.body);
        //        // Get the appropriate fields out of the Create App response (specifically the created field Ids)
        //        nonBuiltInFields = recordBase.getNonBuiltInFields(app.tables[0]);
        //        // Generate some record JSON objects to add to the app
        //        generatedRecords = recordBase.generateRecords(nonBuiltInFields, 10);
        //        // Add the records to the app
        //        recordBase.addRecords(app, app.tables[0], generatedRecords).then(function (returnedRecords) {
        //            // Push the created records into an array (the add record call also returns the fields used)
        //            var recordData = [];
        //            for (var j in returnedRecords) {
        //                recordData.push(returnedRecords[j].record);
        //            }
        //            records = recordData;
        //            //create 10 users
        //            for (var i = 0; i <= 10; i++) {
        //                recordBase.apiBase.createUser().then(function (userResponse) {
        //                    userId = JSON.parse(userResponse.body).id;
        //                    userIdsList.push(userId);
        //                    console.log("the userids list is: " + userIdsList);
        //                });
        //            }
        //        }).then(function() {
        //            //add users from the list to access NONE ie role is none
        //            addUsersToAppRole(app.id, 9, [userIdsList[0], userIdsList[1]]);
        //            //add users from the list to access BASIC ie role is VIEWER
        //            addUsersToAppRole(app.id, 10, [userIdsList[2], userIdsList[3], userIdsList[9]]);
        //            //add users from the list to access BASIC_WITH_SHARE ie role is PARTCIPANT
        //            addUsersToAppRole(app.id, 11, [userIdsList[4], userIdsList[5], userIdsList[8]]);
        //            //add users from the list to access ADMIN ie role is ADMINISTRATOR
        //            addUsersToAppRole(app.id, 12, [userIdsList[6], userIdsList[7]]);
        //            done();
        //        });
        //        }).catch(function (error) {
        //            log.error(JSON.stringify(error));
        //            done();
        //        });
        //});
        /**
         * Setup method. Generates JSON for an app, a table with different fields, and a single record with different field types.
         */
        before(function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * appWithNoFlags.length);
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
                                        done();
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
                    message: 'raw user with all format flags',
                }
            ];
        }

        reportUserPermissions().forEach(function(testcase) {
            it.only('Test case: '+testcase.message, function (done) {
                this.timeout(testConsts.INTEGRATION_TIMEOUT * reportUserPermissions().length);
                console.log("the user id's list is: "+userIdsList);
                done();
            });
        });


    });
}());