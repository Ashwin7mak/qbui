(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');


    /**
     * Integration test for TimeOfDay field formatting
     */
    describe('API - TimeOfDay record test cases - ', function() {
        // The Java API is only accepting time in/out for Time of Day fields
        var earlyTODIn = '09:00:00';
        var lateTODIn = '15:00:00';
        var earlyTODOut = '09:00:00';
        var lateTODOut = '15:00:00';

        var appWithNoFlags = {
            name  : 'TimeOfDay App - no flags',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'timeOfDay',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type: 'TIME_OF_DAY'
                    }
                }
                ]
            }
            ]
        };

        var appWithAllFlags_HH_MM = {
            name      : 'TimeOfDay App - HH_MM format',
            dateFormat: 'MM-dd-uuuu',
            timeZone  : 'America/New_York',
            tables    : [{
                name: 'table1', fields: [{
                    name              : 'timeOfDay',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type          : 'TIME_OF_DAY',
                        scale         : 'HH:MM',
                        use24HourClock: true
                    }
                }
                ]
            }
            ]
        };

        var appWithAllFlags_HH_MM_SS = {
            name      : 'TimeOfDay App - HH_MM_SS format',
            dateFormat: 'dd-MM-uuuu',
            timeZone  : 'America/New_York',
            tables    : [{
                name: 'table1', fields: [{
                    name              : 'timeOfDay',
                    type              : 'SCALAR',
                    datatypeAttributes: {
                        type          : 'TIME_OF_DAY',
                        scale         : 'HH:MM:SS',
                        use24HourClock: true
                    }
                }
                ]
            }
            ]
        };

        /**
         * DataProvider containing Records and record display expectations for TimeOfDay field with no display props set
         */
        function noFlagsTimeOfDayDataProvider(fid) {
            // TimeOfDay in morning
            var earlyTODInput = [{id: fid, value: earlyTODIn}];
            var expectedEarlyTODRecord = {id: fid, value: earlyTODOut, display: '9:00 am'};

            // TimeOfDay in afternoon
            var lateTODInput = [{id: fid, value: lateTODIn}];
            var expectedLateTODRecord = {id: fid, value: lateTODOut, display: '3:00 pm'};

            // Null date
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display early timeOfDay with no format flags',
                    record            : earlyTODInput,
                    format            : 'display',
                    expectedFieldValue: expectedEarlyTODRecord
                },
                {
                    message           : 'raw early timeOfDay with no format flags',
                    record            : earlyTODInput,
                    format            : 'raw',
                    expectedFieldValue: earlyTODInput
                },
                {
                    message           : 'display different year timeOfDay with no format flags',
                    record            : lateTODInput,
                    format            : 'display',
                    expectedFieldValue: expectedLateTODRecord
                },
                {
                    message           : 'raw different year timeOfDay with no format flags',
                    record            : lateTODInput,
                    format            : 'raw',
                    expectedFieldValue: lateTODInput
                },
                {
                    message           : 'display null timeOfDay with no format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null timeOfDay with no format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates TimeOfDay records formatting with no field property flags set
         */
        it('Should create and retrieve timeOfDay display records when no format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsTimeOfDayDataProvider().length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var timeOfDayField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'timeOfDay') {
                        timeOfDayField = field;
                    }
                });
                assert(timeOfDayField, 'failed to find timeOfDay field');
                var records = noFlagsTimeOfDayDataProvider(timeOfDayField.id);
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
         * DataProvider containing Records and record display expectations for HH_MM TimeOfDay field with all display props set
         */
        function allFlagsTimeOfDayDataProvider_HH_MM(fid) {

            // TimeOfDay in early
            var earlyTODInput = [{id: fid, value: earlyTODIn}];
            var expectedEarlyTODRecord = {id: fid, value: earlyTODOut, display: '09:00'};

            // TimeOfDay in different year
            var lateTODInput = [{id: fid, value: lateTODIn}];
            var expectedLateTODRecord = {id: fid, value: lateTODOut, display: '15:00'};

            // Null date
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display early timeOfDay with all HH_MM format flags',
                    record            : earlyTODInput,
                    format            : 'display',
                    expectedFieldValue: expectedEarlyTODRecord
                },
                {
                    message           : 'raw early timeOfDay with all HH_MM format flags',
                    record            : earlyTODInput,
                    format            : 'raw',
                    expectedFieldValue: earlyTODInput
                },
                {
                    message           : 'display different year timeOfDay with all HH_MM format flags',
                    record            : lateTODInput,
                    format            : 'display',
                    expectedFieldValue: expectedLateTODRecord
                },
                {
                    message           : 'raw different year timeOfDay with all HH_MM format flags',
                    record            : lateTODInput,
                    format            : 'raw',
                    expectedFieldValue: lateTODInput
                },
                {
                    message           : 'display null timeOfDay with all HH_MM format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null timeOfDay with all HH_MM format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates HH_MM TimeOfDay records formatting with all field property flags set
         */
        it('Should create and retrieve HH_MM timeOfDay display records when all format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsTimeOfDayDataProvider_HH_MM().length);
            recordBase.createApp(appWithAllFlags_HH_MM).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var timeOfDayField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'timeOfDay') {
                        timeOfDayField = field;
                    }
                });
                assert(timeOfDayField, 'failed to find timeOfDay field');
                var records = allFlagsTimeOfDayDataProvider_HH_MM(timeOfDayField.id);
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
         * DataProvider containing Records and record display expectations for HH_MM_SS TimeOfDay field with all display props set
         */
        function allFlagsTimeOfDayDataProvider_HH_MM_SS(fid) {

            // TimeOfDay in early
            var earlyTODInput = [{id: fid, value: earlyTODIn}];
            var expectedEarlyTODRecord = {id: fid, value: earlyTODOut, display: '09:00:00'};

            // TimeOfDay in different year
            var lateTODInput = [{id: fid, value: lateTODIn}];
            var expectedLateTODRecord = {id: fid, value: lateTODOut, display: '15:00:00'};

            // Null date
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display early timeOfDay with all HH_MM_SS format flags',
                    record            : earlyTODInput,
                    format            : 'display',
                    expectedFieldValue: expectedEarlyTODRecord
                },
                {
                    message           : 'raw early timeOfDay with all HH_MM_SS format flags',
                    record            : earlyTODInput,
                    format            : 'raw',
                    expectedFieldValue: earlyTODInput
                },
                {
                    message           : 'display different year timeOfDay with all HH_MM_SS format flags',
                    record            : lateTODInput,
                    format            : 'display',
                    expectedFieldValue: expectedLateTODRecord
                },
                {
                    message           : 'raw different year timeOfDay with all HH_MM_SS format flags',
                    record            : lateTODInput,
                    format            : 'raw',
                    expectedFieldValue: lateTODInput
                },
                {
                    message           : 'display null timeOfDay with all HH_MM_SS format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null timeOfDay with all format HH_MM_SS flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates HH_MM_SS TimeOfDay records formatting with all field property flags set
         */
        it('Should create and retrieve HH_MM_SS timeOfDay display records when all format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsTimeOfDayDataProvider_HH_MM_SS().length);
            recordBase.createApp(appWithAllFlags_HH_MM_SS).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var timeOfDayField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'timeOfDay') {
                        timeOfDayField = field;
                    }
                });
                assert(timeOfDayField, 'failed to find timeOfDay field');
                var records = allFlagsTimeOfDayDataProvider_HH_MM_SS(timeOfDayField.id);
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
