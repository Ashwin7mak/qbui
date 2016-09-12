/**
 * A test to test form generation code
 * Created by xj on 9/7/16.
 */
(function() {
    'use strict';

    var formGenerator = require('../form.generator');
    var formConsts = require('../form.constants');
    var appConsts = require('../app.constants');
    var tableConsts = require('../table.constants');
    var fieldConsts = require('../field.constants');
    var consts = require('../../common/src/constants');
    var appGenerator = require('../app.generator');
    var _ = require('lodash');
    var assert = require('assert');

    /**
     * Unit tests for form generator
     */
    describe('Relationship generator unit test', function() {

        function formDataProvider() {
            var tablesMap = {};
            tablesMap.App1Table0 = {};
            tablesMap.App1Table1 = {};
            tablesMap.App1Table2 = {};
            tablesMap.App1Table3 = {};

            tablesMap.App1Table0.textField0 = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tablesMap.App1Table0.numericField0 = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tablesMap.App1Table0.dateField0 = {fieldType: consts.SCALAR, dataType: consts.DATE};

            tablesMap.App1Table1.dateField1 = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tablesMap.App1Table2.numericField2 = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tablesMap.App1Table3.textField3 = {fieldType: consts.SCALAR, dataType: consts.TEXT};

            var tableMap = {};
            tableMap.App1Table0 = {};
            tableMap.App1Table0.textField0 = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableMap.App1Table0.numericField0 = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tableMap.App1Table0.dateField0 = {fieldType: consts.SCALAR, dataType: consts.DATE};

            var generatedSingleTableApp = appGenerator.generateAppWithTablesFromMap(tableMap);
            var generatedMutiTableApp = appGenerator.generateAppWithTablesFromMap(tablesMap);

            var appId = 'A_0';
            generatedMutiTableApp[appConsts.ID] = appId;
            generatedSingleTableApp[appConsts.ID] = appId;

            var tableIdPrefix = 'T_';
            var tableIndex = 0;

            var generatedTables = generatedMutiTableApp[appConsts.TABLES];
            var generatedTable = generatedSingleTableApp[appConsts.TABLES];
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

            _.forEach(generatedTable, function(table) {
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
                    message: 'Genearte an app with multiple tables',
                    data: generatedMutiTableApp
                },
                {
                    message: 'Genearte an app with single table',
                    data: generatedSingleTableApp
                }
            ];
        }


        /**
         * Unit test that validates generating a form with a specified tab, section, etc.
         */
        describe('test generating a form for a given app', function() {
            formDataProvider().forEach(function(entry) {
                it('Test case form fields validation ' + entry.message, function(done) {
                    var forms = formGenerator.generateSingleTabAndSecForm(entry.data);

                    var tables = entry.data[appConsts.TABLES];
                    var tableIndex = 0;

                    _.forEach(tables, function(table) {
                        var form = forms[tableIndex];

                        if (typeof form[formConsts.formKeys.TABLE_ID] === "undefined") {
                            assert.fail('Expected tableId field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.APP_ID] === "undefined") {
                            assert.fail('Expected appId field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_NAME] === "undefined") {
                            assert.fail('Expected name field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_DESC] === "undefined") {
                            assert.fail('Expected description field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_WRAP] === "undefined") {
                            assert.fail('Expected wrapLabel field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_INC_BUILDIN] === "undefined") {
                            assert.fail('Expected includeBuiltIns field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_WRAP_ELMNT] === "undefined") {
                            assert.fail('Expected wrapElements field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_NEW_FIELD_ACTION] === "undefined") {
                            assert.fail('Expected newFieldAction field to be set ');
                        }
                        if (typeof form[formConsts.formKeys.FORM_TABS] === "undefined") {
                            assert.fail('Expected tabs field to be set ');
                        }
                    });

                    done();
                });
            });
        });
    });
}());

