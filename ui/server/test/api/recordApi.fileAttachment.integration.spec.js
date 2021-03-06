(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');



    /**
     * Integration test for FileAttachment field formatting
     */
    describe('API - FileAttachment record test cases - ', function() {

        var localFile = 'file://c:/local/package/file/batFile.bat';
        var urlFile = 'http://www.intuit.com/some/file/zipFile.zip';
        var httpsURLFile = 'https://www.intuit.com/some/file/zipFile.zip';
        var linkText = 'some link text';

        var appWithNoFlags = {
            name  : 'FileAttachment App - no flags',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'file',
                    type              : 'CONCRETE',
                    datatypeAttributes: {
                        type: 'FILE_ATTACHMENT'
                    }
                }
                ]
            }
            ]
        };

        var appWithAllFlags = {
            name  : 'FileAttachment App - all flags',
            tables: [{
                name: 'table1', fields: [{
                    name              : 'file',
                    type              : 'CONCRETE',
                    datatypeAttributes: {
                        type    : 'FILE_ATTACHMENT',
                        linkText: linkText
                    }
                }
                ]
            }
            ]
        };

        /**
         * DataProvider containing Records and record display expectations for FileAttachment field with no display props set
         */
        function noFlagsFileAttachmentDataProvider(fid) {
            // Local file attachment
            var localFileAttachmentInput = [{id: fid, value: localFile}];
            var expectedLocalFileAttachmentRecord = {id: fid, value: localFile, display: localFile};

            // HTTP file attachment
            var httpFileAttachmentInput = [{id: fid, value: urlFile}];
            var expectedHttpFileAttachmentRecord = {id: fid, value: urlFile, display: urlFile};

            // HTTPS file attachment
            var httpsFileAttachmentInput = [{id: fid, value: httpsURLFile}];
            var expectedHttpsFileAttachmentRecord = {id: fid, value: httpsURLFile, display: httpsURLFile};

            // Null file attachment
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display local file attachment with no format flags',
                    record            : localFileAttachmentInput,
                    format            : 'display',
                    expectedFieldValue: expectedLocalFileAttachmentRecord
                },
                {
                    message           : 'raw local file attachment with no format flags',
                    record            : localFileAttachmentInput,
                    format            : 'raw',
                    expectedFieldValue: localFileAttachmentInput
                },
                {
                    message           : 'display http file attachment with no format flags',
                    record            : httpFileAttachmentInput,
                    format            : 'display',
                    expectedFieldValue: expectedHttpFileAttachmentRecord
                },
                {
                    message           : 'raw http file attachment with no format flags',
                    record            : httpFileAttachmentInput,
                    format            : 'raw',
                    expectedFieldValue: httpFileAttachmentInput
                },
                {
                    message           : 'display https file attachment with no format flags',
                    record            : httpsFileAttachmentInput,
                    format            : 'display',
                    expectedFieldValue: expectedHttpsFileAttachmentRecord
                },
                {
                    message           : 'raw https file attachment with no format flags',
                    record            : httpsFileAttachmentInput,
                    format            : 'raw',
                    expectedFieldValue: httpsFileAttachmentInput
                },
                {
                    message           : 'display null file attachment with no format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null file attachment with no format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates FileAttachment records formatting with no field property flags set
         */
        it('Should create and retrieve file attachment display records when no format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * noFlagsFileAttachmentDataProvider().length);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var fileAttachmentField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'file') {
                        fileAttachmentField = field;
                    }
                });
                assert(fileAttachmentField, 'failed to find file attachment field');
                var records = noFlagsFileAttachmentDataProvider(fileAttachmentField.id);
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
         * DataProvider containing Records and record display expectations for FileAttachment field with all display props set
         */
        function allFlagsFileAttachmentDataProvider(fid) {

            // Local file attachment
            var localFileAttachmentInput = [{id: fid, value: localFile}];
            var expectedLocalFileAttachmentRecord = {id: fid, value: localFile, display: linkText};

            // HTTP file attachment
            var httpFileAttachmentInput = [{id: fid, value: urlFile}];
            var expectedHttpFileAttachmentRecord = {id: fid, value: urlFile, display: linkText};

            // HTTPS file attachment
            var httpsFileAttachmentInput = [{id: fid, value: httpsURLFile}];
            var expectedHttpsFileAttachmentRecord = {id: fid, value: httpsURLFile, display: linkText};

            // Null file attachment
            var nullInput = [{id: fid, value: null}];
            var expectedNullRecord = {id: fid, value: null, display: ''};

            return [
                {
                    message           : 'display local file attachment with all format flags',
                    record            : localFileAttachmentInput,
                    format            : 'display',
                    expectedFieldValue: expectedLocalFileAttachmentRecord
                },
                {
                    message           : 'raw local file attachment with all format flags',
                    record            : localFileAttachmentInput,
                    format            : 'raw',
                    expectedFieldValue: localFileAttachmentInput
                },
                {
                    message           : 'display http file attachment with all format flags',
                    record            : httpFileAttachmentInput,
                    format            : 'display',
                    expectedFieldValue: expectedHttpFileAttachmentRecord
                },
                {
                    message           : 'raw http file attachment with all format flags',
                    record            : httpFileAttachmentInput,
                    format            : 'raw',
                    expectedFieldValue: httpFileAttachmentInput
                },
                {
                    message           : 'display https file attachment with all format flags',
                    record            : httpsFileAttachmentInput,
                    format            : 'display',
                    expectedFieldValue: expectedHttpsFileAttachmentRecord
                },
                {
                    message           : 'raw https file attachment with all format flags',
                    record            : httpsFileAttachmentInput,
                    format            : 'raw',
                    expectedFieldValue: httpsFileAttachmentInput
                },
                {
                    message           : 'display null file attachment with all format flags',
                    record            : nullInput,
                    format            : 'display',
                    expectedFieldValue: expectedNullRecord
                },
                {
                    message           : 'raw null file attachment with all format flags',
                    record            : nullInput,
                    format            : 'raw',
                    expectedFieldValue: nullInput
                }
            ];
        }

        /**
         * Integration test that validates FileAttachment records formatting with all field property flags set
         */
        it('Should create and retrieve file attachment display records when all format flags set', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT * allFlagsFileAttachmentDataProvider().length);
            recordBase.createApp(appWithAllFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var fileAttachmentField;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === 'file') {
                        fileAttachmentField = field;
                    }
                });
                assert(fileAttachmentField, 'failed to find file attachment field');
                var records = allFlagsFileAttachmentDataProvider(fileAttachmentField.id);
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
