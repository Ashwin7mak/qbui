/**
 * A test to test our test generation code
 * Created by cschneider1 on 6/1/15.
 */
'use strict';

var should = require('should');
var relationshipGenerator = require('../relationship.generator');
var relationshipConsts = require('../relationship.constants');
var appConsts = require('../app.constants');
var tableConsts = require('../table.constants');
var fieldConsts = require('../field.constants');
var consts = require('../../server/api/constants');
var appGenerator = require('../app.generator');
var _ = require('lodash');
var assert = require('assert');

/**
 * Unit tests for relationship generator
 */
describe('Relationship generator unit test', function() {

    function relationshipProvider() {
        var tableMap = {};
        tableMap['App1Table0'] = {};
        tableMap['App1Table1'] = {};
        tableMap['App1Table2'] = {};
        tableMap['App1Table3'] = {};

        tableMap['App1Table0']['textField0'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
        tableMap['App1Table0']['numericField0'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
        tableMap['App1Table0']['dateField0'] = {fieldType: consts.SCALAR, dataType: consts.DATE};

        tableMap['App1Table1']['dateField1'] = {fieldType: consts.SCALAR, dataType: consts.DATE};

        tableMap['App1Table2']['numericField2'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};

        tableMap['App1Table3']['textField3'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};

        var generatedApp = appGenerator.generateAppWithTablesFromMap(tableMap);

        var appId = 'A_0';
        generatedApp[appConsts.ID] = appId;

        var tableIdPrefix = 'T_';
        var tableIndex = 0;

        var generatedTables = generatedApp[appConsts.TABLES];
        var fieldIndex;
        var currentFields;
        var currentFieldType;

        var generatedTableMap = {};

        _.forEach(generatedTables, function(table) {
            table[tableConsts.ID] = tableIdPrefix + tableIndex;
            table[tableConsts.APP_ID] = appId;
            generatedTableMap[tableIdPrefix + tableIndex] = table;
            tableIndex++;

            fieldIndex = 0;

            currentFields = table[tableConsts.FIELDS];

            _.forEach(currentFields, function(field) {
                currentFieldType = field[fieldConsts.fieldKeys.TYPE];
                field[fieldConsts.fieldKeys.ID] = fieldIndex;
                field[fieldConsts[currentFieldType].UNIQUE] = true;
                fieldIndex++;
            });
        });

        return [
            {
                message    : "Generate a relationship on App1->Table1->dateField1: App1->Table2->dateField2", app: generatedApp, masterTable: generatedTableMap['T_0'],
                detailTable: generatedTableMap['T_1'], expectedRelationship: {
                appId        : appId, masterAppId: appId, masterTableId: 'T_0',
                masterFieldId: 2, detailAppId: appId, detailTableId: 'T_1', detailFieldId: 0
            }
            },

            {
                message    : "Generate a relationship on App1->Table1->numericField1 : App1->Table3->numericField3", app: generatedApp, masterTable: generatedTableMap['T_0'],
                detailTable: generatedTableMap['T_2'], expectedRelationship: {
                appId        : appId, masterAppId: appId, masterTableId: 'T_0',
                masterFieldId: 1, detailAppId: appId, detailTableId: 'T_2', detailFieldId: 0
            }
            },

            {
                message    : "Generate a relationship on App1->Table1->textField1 : App1->Table4->textField4", app: generatedApp, masterTable: generatedTableMap['T_0'],
                detailTable: generatedTableMap['T_3'], expectedRelationship: {
                appId        : appId, masterAppId: appId, masterTableId: 'T_0',
                masterFieldId: 0, detailAppId: appId, detailTableId: 'T_3', detailFieldId: 0
            }
            }
        ];
    }

    /**
     * Unit test that validates generating a relationship with a specified master and detail table
     */
    describe('test generating a relationship given 2 tables', function() {
        relationshipProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var expectedRelationship = entry.expectedRelationship;
                var masterTable = entry.masterTable;
                var detailTable = entry.detailTable;

                var relationship = relationshipGenerator.generateRelationship(masterTable, detailTable);

                var validRelationshipObject = relationshipGenerator.validateRelationshipProperties(relationship);

                if (!validRelationshipObject) {
                    assert.fail('Relationship was found invalid ' + relationship);
                }

                if (expectedRelationship[relationshipConsts.APP_ID] !== relationship[relationshipConsts.APP_ID]) {
                    assert.fail('Expected appId ' + expectedRelationship[relationshipConsts.APP_ID] + ' to match actual appId ' + relationship[relationshipConsts.APP_ID]);
                }

                if (expectedRelationship[relationshipConsts.MASTER_APP_ID] !== relationship[relationshipConsts.MASTER_APP_ID]) {
                    assert.fail('Expected masterAppId ' + expectedRelationship[relationshipConsts.MASTER_APP_ID] + ' to match actual masterAppId ' + relationship[relationshipConsts.APP_ID]);
                }

                if (expectedRelationship[relationshipConsts.MASTER_TABLE_ID] !== relationship[relationshipConsts.MASTER_TABLE_ID]) {
                    assert.fail('Expected masterTableId ' + expectedRelationship[relationshipConsts.MASTER_TABLE_ID] + ' to match actual masterTableId ' + relationship[relationshipConsts.MASTER_TABLE_ID]);
                }

                if (expectedRelationship[relationshipConsts.MASTER_FIELD_ID] !== relationship[relationshipConsts.MASTER_FIELD_ID]) {
                    assert.fail('Expected masterFieldId ' + expectedRelationship[relationshipConsts.MASTER_FIELD_ID] + ' to match actual masterFieldId ' + relationship[relationshipConsts.MASTER_FIELD_ID]);
                }

                if (expectedRelationship[relationshipConsts.DETAIL_APP_ID] !== relationship[relationshipConsts.DETAIL_APP_ID]) {
                    assert.fail('Expected detailAppid ' + expectedRelationship[relationshipConsts.DETAIL_APP_ID] + ' to match actual detailAppid ' + relationship[relationshipConsts.DETAIL_APP_ID]);
                }

                if (expectedRelationship[relationshipConsts.DETAIL_TABLE_ID] !== relationship[relationshipConsts.DETAIL_TABLE_ID]) {
                    assert.fail('Expected detailTableId ' + expectedRelationship[relationshipConsts.DETAIL_TABLE_ID] + ' to match actual detailTableId ' + relationship[relationshipConsts.DETAIL_TABLE_ID]);
                }

                if (expectedRelationship[relationshipConsts.DETAIL_FIELD_ID] !== relationship[relationshipConsts.DETAIL_FIELD_ID]) {
                    assert.fail('Expected detailFieldId ' + expectedRelationship[relationshipConsts.DETAIL_FIELD_ID] + ' to match actual detailFieldId ' + relationship[relationshipConsts.DETAIL_FIELD_ID]);
                }

                if (typeof expectedRelationship[relationshipConsts.REFERENTIAL_INTEGRITY] === 'boolean' && expectedRelationship[relationshipConsts.REFERENTIAL_INTEGRITY] !== relationship[relationshipConsts.REFERENTIAL_INTEGRITY]) {
                    assert.fail('Expected referentialIntegrity ' + expectedRelationship[relationshipConsts.REFERENTIAL_INTEGRITY] + ' to match actual referentialIntegrity ' + relationship[relationshipConsts.REFERENTIAL_INTEGRITY]);
                }

                if (typeof expectedRelationship[relationshipConsts.CASCADE_DELETE] === 'boolean' && expectedRelationship[relationshipConsts.CASCADE_DELETE] !== relationship[relationshipConsts.CASCADE_DELETE]) {
                    assert.fail('Expected cascadeDelete ' + expectedRelationship[relationshipConsts.CASCADE_DELETE] + ' to match actual cascadeDelete ' + relationship[relationshipConsts.CASCADE_DELETE]);
                }

                done();
            });
        });
    });

    /**
     * Unit test that validates generating a relationship with a specified app and master and detail tableIds
     */
    describe('test generating a relationship given an app and two table ids', function() {
        relationshipProvider().forEach(function(entry) {
            it('Test case: ' + entry.message, function(done) {
                var expectedRelationship = entry.expectedRelationship;
                var masterTable = entry.masterTable;
                var detailTable = entry.detailTable;

                var app = entry.app;

                var relationship = relationshipGenerator.generateRelationshipFromApp(app, masterTable[tableConsts.ID], detailTable[tableConsts.ID]);

                var validRelationshipObject = relationshipGenerator.validateRelationshipProperties(relationship);

                if (!validRelationshipObject) {
                    assert.fail('Relationship was found invalid ' + relationship);
                }

                if (expectedRelationship[relationshipConsts.APP_ID] !== relationship[relationshipConsts.APP_ID]) {
                    assert.fail('Expected appId ' + expectedRelationship[relationshipConsts.APP_ID] + ' to match actual appId ' + relationship[relationshipConsts.APP_ID]);
                }

                if (expectedRelationship[relationshipConsts.MASTER_APP_ID] !== relationship[relationshipConsts.MASTER_APP_ID]) {
                    assert.fail('Expected masterAppId ' + expectedRelationship[relationshipConsts.MASTER_APP_ID] + ' to match actual masterAppId ' + relationship[relationshipConsts.APP_ID]);
                }

                if (expectedRelationship[relationshipConsts.MASTER_TABLE_ID] !== relationship[relationshipConsts.MASTER_TABLE_ID]) {
                    assert.fail('Expected masterTableId ' + expectedRelationship[relationshipConsts.MASTER_TABLE_ID] + ' to match actual masterTableId ' + relationship[relationshipConsts.MASTER_TABLE_ID]);
                }

                if (expectedRelationship[relationshipConsts.MASTER_FIELD_ID] !== relationship[relationshipConsts.MASTER_FIELD_ID]) {
                    assert.fail('Expected masterFieldId ' + expectedRelationship[relationshipConsts.MASTER_FIELD_ID] + ' to match actual masterFieldId ' + relationship[relationshipConsts.MASTER_FIELD_ID]);
                }

                if (expectedRelationship[relationshipConsts.DETAIL_APP_ID] !== relationship[relationshipConsts.DETAIL_APP_ID]) {
                    assert.fail('Expected detailAppid ' + expectedRelationship[relationshipConsts.DETAIL_APP_ID] + ' to match actual detailAppid ' + relationship[relationshipConsts.DETAIL_APP_ID]);
                }

                if (expectedRelationship[relationshipConsts.DETAIL_TABLE_ID] !== relationship[relationshipConsts.DETAIL_TABLE_ID]) {
                    assert.fail('Expected detailTableId ' + expectedRelationship[relationshipConsts.DETAIL_TABLE_ID] + ' to match actual detailTableId ' + relationship[relationshipConsts.DETAIL_TABLE_ID]);
                }

                if (expectedRelationship[relationshipConsts.DETAIL_FIELD_ID] !== relationship[relationshipConsts.DETAIL_FIELD_ID]) {
                    assert.fail('Expected detailFieldId ' + expectedRelationship[relationshipConsts.DETAIL_FIELD_ID] + ' to match actual detailFieldId ' + relationship[relationshipConsts.DETAIL_FIELD_ID]);
                }

                if (typeof expectedRelationship[relationshipConsts.REFERENTIAL_INTEGRITY] === 'boolean' && expectedRelationship[relationshipConsts.REFERENTIAL_INTEGRITY] !== relationship[relationshipConsts.REFERENTIAL_INTEGRITY]) {
                    assert.fail('Expected referentialIntegrity ' + expectedRelationship[relationshipConsts.REFERENTIAL_INTEGRITY] + ' to match actual referentialIntegrity ' + relationship[relationshipConsts.REFERENTIAL_INTEGRITY]);
                }

                if (typeof expectedRelationship[relationshipConsts.CASCADE_DELETE] === 'boolean' && expectedRelationship[relationshipConsts.CASCADE_DELETE] !== relationship[relationshipConsts.CASCADE_DELETE]) {
                    assert.fail('Expected cascadeDelete ' + expectedRelationship[relationshipConsts.CASCADE_DELETE] + ' to match actual cascadeDelete ' + relationship[relationshipConsts.CASCADE_DELETE]);
                }

                done();
            });
        });
    });
});



