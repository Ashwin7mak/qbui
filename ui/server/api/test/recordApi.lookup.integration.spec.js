'use strict';
var should = require('should');
var assert = require('assert');
var app = require('../../app');
var config = require('../../config/environment');
var recordBase = require('./recordApi.base')(config);
var Promise = require('bluebird');
var _ = require('lodash');
var testConsts = require('./api.test.constants');


/**
 * Integration test for Date field formatting
 */
describe('API - Lookup numeric record test cases - ', function () {

    var FK_FIELD_NAME = 'numericFk';
    var RECORD_ID_NAME = 'Record ID#';
    var NUMERIC_FIELD_NAME = 'numericField';
    var MASTER_TABLE_NUMERIC = 'textField';

    var numericValue = 2.6666666;
    var expectedDisplayOfNumericValue = '2.67';

    var appWithNoFlags = {
        "name": "Date App - no flags",
        "tables": [{
            "name": "table1",
            "fields": [
                {
                    "name": NUMERIC_FIELD_NAME,
                    "type": "NUMERIC",
                    "decimalPlaces": 13
                },
                { "name": FK_FIELD_NAME, "type":"NUMERIC"}
            ]
        },
            { "name": "table2", "fields":[{"name": MASTER_TABLE_NUMERIC, "type": "NUMERIC"}] }
        ]
    };

    /**
     * Integration test that validates DD_MM_YY Date records formatting with all field property flags set
     */
    it('Create a numeric lookup field, insert records, query for them, and validate for display', function (done) {
        this.timeout(testConsts.INTEGRATION_TIMEOUT);
        recordBase.createApp(appWithNoFlags).then(function (appResponse) {
            var app = JSON.parse(appResponse.body);
            var refField = null;
            var masterTableNumeric = null;
            var masterTablePkField = null;
            var detailTableFkField = null;
            app.tables[0].fields.forEach(function (field) {
                if (field.name === NUMERIC_FIELD_NAME) {
                    refField = field;
                } else if(field.name === FK_FIELD_NAME) {
                    detailTableFkField = field;
                }
            });
            var detailTableId = app.tables[0].id;
            var masterTableId = app.tables[1].id;
            app.tables[1].fields.forEach(function(field){
                if(field.name === RECORD_ID_NAME) {
                    masterTablePkField = field;
                } else if (field.name === MASTER_TABLE_NUMERIC) {
                    masterTableNumeric = field;
                }
            });

            var relationshipToCreate = {
                "appId": app.id,
                "masterTableId": masterTableId,
                "masterFieldId": masterTablePkField.id,
                "detailTableId": detailTableId,
                "detailFieldId": detailTableFkField.id,
                "description": "Two star crossed tables in a relationship of referential integrity"
            };
            recordBase.createRelationship(relationshipToCreate).then(function(relResponse) {
                var relationship = JSON.parse(relResponse.body);
                var numericLookupField = {
                    "name": "numericLookup",
                    "type": "LOOKUP",
                    "datatypeAttributes": {
                        "type":"NUMERIC",
                        "treatNullAsZero": true,
                        "decimalPlaces": 2
                    },
                    "relationshipId": relationship.id,
                    "referenceFieldId": refField.id
                };
                recordBase.createField(app.id, detailTableId, numericLookupField).then(function(fieldsResponse){
                    var lookupField = JSON.parse(fieldsResponse.body);
                    //insert one record into the master table and cache the ID.
                    var masterRecord = [{"id": masterTableNumeric.id, "value": numericValue }];
                    var masterRecordEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, masterTableId);
                    recordBase.createAndFetchRecord(masterRecordEndpoint, masterRecord).then(function(masterRecResp){
                        var masterRec = masterRecResp;
                        //Insert multiple records into the details table
                        var detailsRecord =
                            [{ "id": detailTableFkField.id, "value": 1},{ "id": refField.id, "value": numericValue }];

                            var recordsEndpoint = recordBase.apiBase.resolveRecordsEndpoint(app.id, detailTableId);
                            recordBase.createAndFetchRecord(recordsEndpoint, detailsRecord, '?format=display').then(function(results){
                                var detailRec = results.record;
                                detailRec.forEach(function(fieldValue){
                                    if(fieldValue.id === lookupField.id) {
                                        assert.equal(fieldValue.display, expectedDisplayOfNumericValue, 'Unexpected numeric lookup value returned');
                                        done();
                                    }

                                });
                            }).catch(function (errorMsg) {
                                assert(false, 'unable to resolve all records: ' + JSON.stringify(errorMsg));
                                done();
                            });
                        });
                    });
                });
            });
        });

    //Cleanup the test realm after all tests in the block
    after(function (done) {
        //Realm deletion takes time, bump the timeout
        this.timeout(20000);
        recordBase.apiBase.cleanup().then(function () {
            done();
        });
    });

});