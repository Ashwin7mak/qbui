(function() {
    'use strict';
    var assert = require('assert');
    require('../../src/app');
    var config = require('../../src/config/environment');
    var recordBase = require('./recordApi.base')(config);
    var testConsts = require('./api.test.constants');
    var promise = require('bluebird');


    /**
     * Integration test for Date field formatting
     */
    describe('API - Summary numeric record test cases - ', function() {

        var FK_FIELD_NAME = 'numericFk';
        var RECORD_ID_NAME = 'Record ID#';
        var NUMERIC_FIELD_NAME = 'numericField';
        var MASTER_TABLE_TEXT = 'textField';

        var numericValue1 = 2.6666666;
        var numericValue2 = 3;
        var expectedDisplaySum = '5.67';

        var appWithNoFlags = {
            name  : 'Date App - no flags',
            tables: [{
                name  : 'table1',
                fields: [
                    {
                        name              : NUMERIC_FIELD_NAME,
                        datatypeAttributes: {type: 'NUMERIC', decimalPlaces: 13},
                        type              : 'SCALAR'
                    },
                    {name: FK_FIELD_NAME, datatypeAttributes: {type: 'NUMERIC'}, type: 'SCALAR'}
                ]
            },
                {
                    name  : 'table2',
                    fields: [{name: MASTER_TABLE_TEXT, datatypeAttributes: {type: 'TEXT'}, type: 'SCALAR'}]
                }
            ]
        };

        /**
         * Integration test that validates DD_MM_YY Date records formatting with all field property flags set
         */
        it('Create a numeric summary field, insert records, query for them, and validate for display', function(done) {
            this.timeout(testConsts.INTEGRATION_TIMEOUT);
            recordBase.createApp(appWithNoFlags).then(function(appResponse) {
                var app = JSON.parse(appResponse.body);
                var refField = null;
                var masterTableText = null;
                var masterTablePkField = null;
                var detailTableFkField = null;
                app.tables[0].fields.forEach(function(field) {
                    if (field.name === NUMERIC_FIELD_NAME) {
                        refField = field;
                    } else if (field.name === FK_FIELD_NAME) {
                        detailTableFkField = field;
                    }
                });
                var detailTableId = app.tables[0].id;
                var masterTableId = app.tables[1].id;
                app.tables[1].fields.forEach(function(field) {
                    if (field.name === RECORD_ID_NAME) {
                        masterTablePkField = field;
                    } else if (field.name === MASTER_TABLE_TEXT) {
                        masterTableText = field;
                    }
                });

                var relationshipToCreate = {
                    appId        : app.id,
                    masterTableId: masterTableId,
                    masterFieldId: masterTablePkField.id,
                    detailTableId: detailTableId,
                    detailFieldId: detailTableFkField.id,
                    description  : 'Two star crossed tables in a relationship of referential integrity'
                };
                recordBase.createRelationship(relationshipToCreate).then(function(relResponse) {
                    var relationship = JSON.parse(relResponse.body);
                    var numericSummaryField = {
                        name              : 'numericSummary',
                        type              : 'SUMMARY',
                        aggregateFunction : 'SUM',
                        datatypeAttributes: {
                            type           : 'NUMERIC',
                            treatNullAsZero: true,
                            decimalPlaces  : 2
                        },
                        relationshipId    : relationship.id,
                        referenceFieldId  : refField.id
                    };
                    recordBase.createField(app.id, masterTableId, numericSummaryField).then(function(fieldsResponse) {
                        var summaryField = JSON.parse(fieldsResponse.body);
                        //insert one record into the master table and cache the ID.
                        var masterRecord = [{id: masterTableText.id, value: 'record 1'}];
                        var masterRecordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, masterTableId);
                        recordBase.createAndFetchRecord(masterRecordEndpoint, masterRecord).then(function() {
                            //Insert multiple records into the details table
                            var detailsRecords = [
                                [{id: detailTableFkField.id, value: 1}, {id: refField.id, value: numericValue1}],
                                [{id: detailTableFkField.id, value: 1}, {id: refField.id, value: numericValue2}],
                            ];
                            var fetchRecordPromises = [];
                            detailsRecords.forEach(function(rec) {
                                var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, detailTableId);
                                fetchRecordPromises.push(recordBase.createAndFetchRecord(recordsEndpoint, rec, '?format=display'));
                            });
                            //retrieve & validate the master record's summary value
                            promise.all(fetchRecordPromises).then(function() {
                                recordBase.fetchRecord(app.id, masterTableId, 1, '?format=display').then(function(summaryRecResp) {
                                    var summaryRec = JSON.parse(summaryRecResp.body).record;
                                    summaryRec.forEach(function(fieldValue) {
                                        if (fieldValue.id === summaryField.id) {
                                            assert.equal(fieldValue.display, expectedDisplaySum,
                                                         'Unexpected value returned in summary field column');
                                            done();
                                        }
                                    });

                                }).catch(function(errorMsg) {
                                    done(new Error('unable to resolve all records: ' + JSON.stringify(errorMsg)));
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
            this.timeout(20000);
            recordBase.apiBase.cleanup().then(function() {
                done();
            });
        });

    });
}());
