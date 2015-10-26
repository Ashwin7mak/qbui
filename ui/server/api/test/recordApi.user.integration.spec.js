(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    require('should');
    var promise = require('bluebird');


    /**
     * Integration test for User field formatting
     */
    describe('API - User record test cases - ', function() {

        /**
         * Apps needed for testing
         */
        var appWithNoFlags = {
            name: 'User App - no flags',
            tables: [{
                name: 'table1', fields: [{
                    name: 'user',
                    type: 'SCALAR',
                    datatypeAttributes: {
                        type: 'USER',
                    },
                    indexed: true
                }
                ]
            }
            ]
        };

        var appWithAllFlags = {
            name: 'User App - all flags',
            tables: [{
                name: 'table1', fields: [{
                    name: 'user',
                    type: 'SCALAR',
                    datatypeAttributes: {
                        type: 'USER',
                        userDisplayFormat: 'LAST_THEN_FIRST'
                    },
                    indexed: true
                }
                ]
            }
            ]
        };

        /**
         * Generates and returns a random string of specified length
         */
        function generateRandomString(size) {
            var possible = 'abcdefghijklmnopqrstuvwxyz';
            var text = '';
            for (var i = 0; i < size; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        /**
         * DataProvider containing Records and record display expectations for User field with no display props set
         */
        function noFlagsUserDataProvider(fid) {

            // Generate user information needed for test
            var firstName = generateRandomString(10);
            var lastName = generateRandomString(10);
            var email = firstName + '_' + lastName + '@intuit.com';
            var firstThenLast = firstName + ' ' + lastName;
            var user = {
                id: null,
                firstName: firstName,
                lastName: lastName,
                screenName: email,
                email: email,
                challengeQuestion: 'who is your favorite scrum team?',
                challengeAnswer: 'blue',
                password: 'quickbase'
            };

            var retUser = {
                id: null,
                firstName: firstName,
                lastName: lastName,
                screenName: email,
                email: email
            };
            var userId;

            var deferred = promise.pending();
            recordBase.apiBase.createSpecificUser(user)
                .then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                    retUser.id = userId;
                    // User
                    var userInput = [{id: fid, value: userId}];
                    var expectedUserRecord = {id: fid, value: retUser, display: firstThenLast};

                    // Null User
                    var nullInput = [{id: fid, value: null}];
                    var expectedNullRecord = {id: fid, value: null, display: ''};

                    deferred.resolve([
                        {
                            message: 'display user with no format flags',
                            record: userInput,
                            format: 'display',
                            expectedFieldValue: expectedUserRecord
                        },
                        {
                            message: 'raw user with no format flags',
                            record: userInput,
                            format: 'raw',
                            expectedFieldValue: userInput
                        },
                        {
                            message: 'display null user with no format flags',
                            record: nullInput,
                            format: 'display',
                            expectedFieldValue: expectedNullRecord
                        },
                        {
                            message: 'raw null user with no format flags',
                            record: nullInput,
                            format: 'raw',
                            expectedFieldValue: nullInput
                        }
                    ]);
                }).catch(function(userError) {
                    deferred.reject(userError);
                    assert(false, 'failed to create user: ' + JSON.stringify(userError));
                });
            return deferred.promise;
        }

        /**
         * Integration test that validates User records formatting with no field property flags set
         */
        it('Should create and retrieve user display records when no format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsUserDataProvider().length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var userField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'user') {
                        userField = field;
                    }
                });
                assert(userField, 'failed to find user field');
                noFlagsUserDataProvider(userField.id).then(function(records) {
                    //For each of the cases, create the record and execute the request
                    var fetchRecordpromises = [];
                    records.forEach(function(currentRecord) {
                        var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                        fetchRecordpromises.push(recordBase.createAndFetchRecord(recordsEndpoint, currentRecord.record, '?format=' + currentRecord.format));
                    });

                    //When all the records have been created and fetched, assert the values match expectations
                    promise.all(fetchRecordpromises)
                        .then(function(results) {
                            for (var i = 0; i < results.length; i++) {
                                var currentRecord = results[i];
                                if (results[i].record) {
                                    currentRecord = results[i].record;
                                }

                                currentRecord.forEach(function(fieldValue) {
                                    if (fieldValue.id === records[i].expectedFieldValue.id) {
                                        assert.deepEqual(fieldValue, records[i].expectedFieldValue, 'Unexpected field value returned: ' +
                                            JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[i].expectedFieldValue));
                                    }
                                });
                            }
                            done();
                        }).catch(function(errorMsg) {
                            assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                            done();
                        });
                });
            });
        });

        /**
         * DataProvider containing Records and record display expectations for User field with all display props set
         */
        function allFlagsUserDataProvider(fid) {

            // Generate user information needed for test
            var firstName = generateRandomString(10);
            var lastName = generateRandomString(10);
            var email = firstName + '_' + lastName + '@intuit.com';
            var lastThenFirst = lastName + ', ' + firstName;
            var user = {
                id: null,
                firstName: firstName,
                lastName: lastName,
                screenName: email,
                email: email,
                challengeQuestion: 'who is your favorite scrum team?',
                challengeAnswer: 'blue',
                password: 'quickbase'
            };

            var retUser = {
                id: null,
                firstName: firstName,
                lastName: lastName,
                screenName: email,
                email: email
            };
            var userId;

            var deferred = promise.pending();
            recordBase.apiBase.createSpecificUser(user)
                .then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                    retUser.id = userId;
                    // User
                    var userInput = [{id: fid, value: userId}];
                    var expectedUserRecord = {id: fid, value: retUser, display: lastThenFirst};

                    // Null User
                    var nullInput = [{id: fid, value: null}];
                    var expectedNullRecord = {id: fid, value: null, display: ''};

                    deferred.resolve([
                        {
                            message: 'display user with all format flags',
                            record: userInput,
                            format: 'display',
                            expectedFieldValue: expectedUserRecord
                        },
                        {
                            message: 'raw user with all format flags',
                            record: userInput,
                            format: 'raw',
                            expectedFieldValue: userInput
                        },
                        {
                            message: 'display null user with all format flags',
                            record: nullInput,
                            format: 'display',
                            expectedFieldValue: expectedNullRecord
                        },
                        {
                            message: 'raw null user with all format flags',
                            record: nullInput,
                            format: 'raw',
                            expectedFieldValue: nullInput
                        }
                    ]);
                }).catch(function(userError) {
                    deferred.reject(userError);
                    assert(false, 'failed to create user: ' + JSON.stringify(userError));
                });
            return deferred.promise;
        }

        /**
         * Integration test that validates User records formatting with all field property flags set
         */
        it('Should create and retrieve user display records when all format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsUserDataProvider().length);
            recordBase.createApp(appWithAllFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var userField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'user') {
                        userField = field;
                    }
                });
                assert(userField, 'failed to find user field');
                allFlagsUserDataProvider(userField.id).then(function(records) {
                    //For each of the cases, create the record and execute the request
                    var fetchRecordpromises = [];
                    var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                    recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                        assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                        for (var i = 0; i < records.length; i++) {
                            //Get newly created records
                            fetchRecordpromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                        }

                        //When all the records have been fetched, assert the values match expectations
                        promise.all(fetchRecordpromises)
                            .then(function(results) {
                                for (var j = 0; j < results.length; j++) {
                                    var currentRecord = results[j];
                                    if (results[j].record) {
                                        currentRecord = results[j].record;
                                    }

                                    currentRecord.forEach(function(fieldValue) {
                                        if (fieldValue.id === records[j].expectedFieldValue.id) {
                                            assert.deepEqual(fieldValue, records[j].expectedFieldValue, 'Unexpected field value returned: ' +
                                                JSON.stringify(fieldValue) + ', ' + JSON.stringify(records[j].expectedFieldValue));
                                        }
                                    });
                                }
                                done();
                            }).catch(function(errorMsg) {
                                assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                                done();
                            });
                    });
                });
            });
        });

        //Cleanup the test realm after all tests in the block
        after(function(done) {
            //Realm deletion takes time, bump the timeout
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });
    });
}());
