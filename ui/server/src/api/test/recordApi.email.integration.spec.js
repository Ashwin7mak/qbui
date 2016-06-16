(function() {
    'use strict';
    var assert = require('assert');
    require('../../app');
    var config = require('../../config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');



    /**
     * Integration test for Email field formatting
     */
    describe('API - Email record test cases - ', function() {
        var email = 'first_name_last_name@quickbase.com';
        var linkText = 'some link text';

        var appWithNoFlags = {
            name  : 'Email App - no flags',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'email',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type: 'EMAIL_ADDRESS'
                    }
                }
                ]
            }
            ]
        };

        var appWithEntireEmailFlag = {
            name  : 'Email App - "entire email" flag',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'email',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type                : 'EMAIL_ADDRESS',
                        clientSideAttributes: {
                            width    : 10,
                            bold     : false,
                            word_wrap: false,
                            help_text: 'help',
                            format   : 'WHOLE'
                        }
                    }
                }
                ]
            }
            ]
        };

        var appWithBeforeAtSignFlag = {
            name  : 'Email App - "before @" flag',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'email',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type                : 'EMAIL_ADDRESS',
                        clientSideAttributes: {
                            width    : 10,
                            bold     : false,
                            word_wrap: false,
                            help_text: 'help',
                            format   : 'UP_TO_AT_SIGN'
                        }
                    }
                }
                ]
            }
            ]
        };

        var appWithBeforeUnderscoreFlag = {
            name  : 'Email App - "before _" flag',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'email',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type                : 'EMAIL_ADDRESS',
                        clientSideAttributes: {
                            width    : 10,
                            bold     : false,
                            word_wrap: false,
                            help_text: 'help',
                            format   : 'UP_TO_UNDERSCORE'
                        }
                    }
                }
                ]
            }
            ]
        };

        var appWithLinkTextFlag = {
            name  : 'Email App - "link text" flag',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'email',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type                : 'EMAIL_ADDRESS',
                        clientSideAttributes: {
                            width    : 10,
                            bold     : false,
                            word_wrap: false,
                            help_text: 'help',
                            linkText : linkText
                        }
                    }
                }
                ]
            }
            ]
        };

        var appWithAllFlags = {
            name  : 'Email App - all flags',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'email',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type                : 'EMAIL_ADDRESS',
                        clientSideAttributes: {
                            width    : 10,
                            bold     : false,
                            word_wrap: false,
                            help_text: 'help',
                            format   : 'WHOLE',
                            linkText : linkText
                        }
                    }
                }
                ]
            }
            ]
        };

        /**
         * DataProvider containing Records and record display expectations for Email field with no display props set
         */
        function noFlagsEmailDataProvider(fid) {
            // Email
            var emailInput = [{id: fid, value: email}];
            var expectedEmailRecord = {id: fid, value: email, display: email};

            // Empty email
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            // Null email
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display email with no format flags',
                    record            : emailInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmailRecord
                },
                {
                    message           : 'raw email with no format flags',
                    record            : emailInput,
                    format            : 'raw',
                    expectedFieldValue: emailInput
                },
                {
                    message           : 'display empty email with no format flags',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {
                    message           : 'raw empty email with no format flags',
                    record            : emptyInput,
                    format            : 'raw',
                    expectedFieldValue: emptyInput
                },
                {
                    message           : 'display null email with no format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null email with no format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates Email records formatting with no field property flags set
         */
        it('Should create and retrieve email display records when no format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsEmailDataProvider().length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var emailField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'email') {
                        emailField = field;
                    }
                });
                assert(emailField, 'failed to find email field');
                var records = noFlagsEmailDataProvider(emailField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
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
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
                            });
                });
            });
        });

        /**
         * DataProvider containing Records and record display expectations for Email field with 'Entire Email' display prop set
         */
        function entireEmailFlagEmailDataProvider(fid) {

            // Email
            var emailInput = [{id: fid, value: email}];
            var expectedEmailRecord = {id: fid, value: email, display: email};

            // Empty email
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            // Null email
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display email with "entire email" format flags',
                    record            : emailInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmailRecord
                },
                {
                    message           : 'raw email with "entire email" format flags',
                    record            : emailInput,
                    format            : 'raw',
                    expectedFieldValue: emailInput
                },
                {
                    message           : 'display empty email with "entire email" format flags',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {
                    message           : 'raw empty email with "entire email" format flags',
                    record            : emptyInput,
                    format            : 'raw',
                    expectedFieldValue: emptyInput
                },
                {
                    message           : 'display null email with "entire email" format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null email with "entire email" format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates Email records formatting with 'Entire Email' field property flags set
         */
        it('Should create and retrieve email display records when "entire email" format flag set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * entireEmailFlagEmailDataProvider().length);
            recordBase.createApp(appWithEntireEmailFlag).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var emailField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'email') {
                        emailField = field;
                    }
                });
                assert(emailField, 'failed to find email field');
                var records = entireEmailFlagEmailDataProvider(emailField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
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
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
                            });
                });
            });
        });

        /**
         * DataProvider containing Records and record display expectations for Email field with 'before @' display prop set
         */
        function beforeAtSignFlagEmailDataProvider(fid) {

            // Email
            var emailInput = [{id: fid, value: email}];
            var expectedEmailRecord = {id: fid, value: email, display: 'first_name_last_name'};

            // Empty email
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            // Null email
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display email with "before @" format flags',
                    record            : emailInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmailRecord
                },
                {
                    message           : 'raw email with "before @" format flags',
                    record            : emailInput,
                    format            : 'raw',
                    expectedFieldValue: emailInput
                },
                {
                    message           : 'display empty email with "before @" format flags',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {
                    message           : 'raw empty email with "before @" format flags',
                    record            : emptyInput,
                    format            : 'raw',
                    expectedFieldValue: emptyInput
                },
                {
                    message           : 'display null email with "before @" format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null email with "before @" format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates Email records formatting with 'before @' field property flags set
         */
        it('Should create and retrieve email display records when "before @" format flag set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * beforeAtSignFlagEmailDataProvider().length);
            recordBase.createApp(appWithBeforeAtSignFlag).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var emailField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'email') {
                        emailField = field;
                    }
                });
                assert(emailField, 'failed to find email field');
                var records = beforeAtSignFlagEmailDataProvider(emailField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
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
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
                            });
                });
            });
        });

        /**
         * DataProvider containing Records and record display expectations for Email field with 'before _' display prop set
         */
        function beforeUnderscoreFlagEmailDataProvider(fid) {

            // Email
            var emailInput = [{id: fid, value: email}];
            var expectedEmailRecord = {id: fid, value: email, display: 'first'};

            // Empty email
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            // Null email
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display email with "before _" format flags',
                    record            : emailInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmailRecord
                },
                {
                    message           : 'raw email with "before _" format flags',
                    record            : emailInput,
                    format            : 'raw',
                    expectedFieldValue: emailInput
                },
                {
                    message           : 'display empty email with "before _" format flags',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {
                    message           : 'raw empty email with "before _" format flags',
                    record            : emptyInput,
                    format            : 'raw',
                    expectedFieldValue: emptyInput
                },
                {
                    message           : 'display null email with "before _" format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null email with "before _" format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates Email records formatting with 'before _' field property flags set
         */
        it('Should create and retrieve email display records when "before _" format flag set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * beforeUnderscoreFlagEmailDataProvider().length);
            recordBase.createApp(appWithBeforeUnderscoreFlag).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var emailField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'email') {
                        emailField = field;
                    }
                });
                assert(emailField, 'failed to find email field');
                var records = beforeUnderscoreFlagEmailDataProvider(emailField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
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
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
                            });
                });
            });
        });

        /**
         * DataProvider containing Records and record display expectations for Email field with 'linkText' display prop set
         */
        function linkTextFlagEmailDataProvider(fid) {

            // Email
            var emailInput = [{id: fid, value: email}];
            var expectedEmailRecord = {id: fid, value: email, display: linkText};

            // Empty email
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            // Null email
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display email with "link text" format flags',
                    record            : emailInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmailRecord
                },
                {
                    message           : 'raw email with "link text" format flags',
                    record            : emailInput,
                    format            : 'raw',
                    expectedFieldValue: emailInput
                },
                {
                    message           : 'display empty email with "link text" format flags',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {
                    message           : 'raw empty email with "link text" format flags',
                    record            : emptyInput,
                    format            : 'raw',
                    expectedFieldValue: emptyInput
                },
                {
                    message           : 'display null email with "link text" format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null email with "link text" format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates Email records formatting with 'link text' field property flags set
         */
        it('Should create and retrieve email display records when "link text" format flag set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * linkTextFlagEmailDataProvider().length);
            recordBase.createApp(appWithLinkTextFlag).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var emailField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'email') {
                        emailField = field;
                    }
                });
                assert(emailField, 'failed to find email field');
                var records = linkTextFlagEmailDataProvider(emailField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
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
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
                            });
                });
            });
        });

        /**
         * DataProvider containing Records and record display expectations for Email field with all display props set
         */
        function allFlagsEmailDataProvider(fid) {

            // Email
            var emailInput = [{id: fid, value: email}];
            var expectedEmailRecord = {id: fid, value: email, display: linkText};

            // Empty email
            var emptyInput = [{id: fid, value: ''}];
            var expectedEmptyRecord = {id: fid, value: null, display: ''};

            // Null email
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display email with all format flags',
                    record            : emailInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmailRecord
                },
                {
                    message           : 'raw email with all format flags',
                    record            : emailInput,
                    format            : 'raw',
                    expectedFieldValue: emailInput
                },
                {
                    message           : 'display empty email with all format flags',
                    record            : emptyInput,
                    format            : 'display',
                    expectedFieldValue: expectedEmptyRecord
                },
                {
                    message           : 'raw empty email with all format flags',
                    record            : emptyInput,
                    format            : 'raw',
                    expectedFieldValue: emptyInput
                },
                {
                    message           : 'display null email with all format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null email with all format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates Email records formatting with all field property flags set
         */
        it('Should create and retrieve email display records when all format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsEmailDataProvider().length);
            recordBase.createApp(appWithAllFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var emailField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'email') {
                        emailField = field;
                    }
                });
                assert(emailField, 'failed to find email field');
                var records = allFlagsEmailDataProvider(emailField.id);
                //For each of the cases, create the record and execute the request
                var fetchRecordPromises = [];
                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, app.tables[0].id);
                recordBase.createRecords(recordsEndpoint, records).then(function(recordIdList) {
                    assert(recordIdList.length, records.length, 'Num of records created does not match num of expected records');
                    for (var i = 0; i < records.length; i++) {
                        //Get newly created records
                        fetchRecordPromises.push(recordBase.getRecord(recordsEndpoint, recordIdList[i], '?format=' + records[i].format));
                    }

                    //When all the records have been fetched, assert the values match expectations
                    promise.all(fetchRecordPromises)
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
                                done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
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
