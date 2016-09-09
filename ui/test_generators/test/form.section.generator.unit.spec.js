/**
 * A test to test form section generation code
 * Created by xj on 9/7/16.
 */
(function() {
    'use strict';

    var formSectionGenerator = require('../form.section.generator');
    var formSectionConstant = require('../form.section.constants');
    var constant = require('../../common/src/constants');
    var appConsts = require('../app.constants');
    var appGenerator = require('../app.generator');
    var _ = require('lodash');
    var assert = require('assert');
    const singleSection = 0;

    /**
     * Unit tests for form section generator
     */
    describe('Form section generator unit test', function() {
        function formSectionDataProvider() {
            var tableMap = {};
            var singleTableMap = {};
            tableMap.App1Table0 = {};
            tableMap.App1Table1 = {};
            singleTableMap.App1Table0 = {};

            tableMap.App1Table0.textField0 = {fieldType: constant.SCALAR, dataType: constant.TEXT, id: 0};
            tableMap.App1Table0.numericField0 = {fieldType: constant.SCALAR, dataType: constant.NUMERIC, id: 1};
            tableMap.App1Table0.dateField0 = {fieldType: constant.SCALAR, dataType: constant.DATE, id: 2};

            tableMap.App1Table1.textField0 = {fieldType: constant.SCALAR, dataType: constant.TEXT, id: 0};
            singleTableMap.App1Table0.textField0 = {fieldType: constant.SCALAR, dataType: constant.TEXT, id: 0};

            var generatedApp = appGenerator.generateAppWithTablesFromMap(tableMap);
            var generatedTables = generatedApp[appConsts.TABLES];
            var generatedAppSingleTable = appGenerator.generateAppWithTablesFromMap(singleTableMap);
            var generatedSingleTable = generatedAppSingleTable[appConsts.TABLES];

            return [
                {
                    message : 'Generate a single table with multiple fields',
                    testTable: generatedSingleTable
                },
                {
                    message : 'Generate multiple tables with multiple fields',
                    testTable: generatedTables
                },
            ];
        }

        /**
         * Unit test that validates generating form section
         */
        describe('test form section element create', function() {
            formSectionDataProvider().forEach(function(entry) {
                it('Test case : ' + entry.message, function(done) {

                    entry.testTable.forEach(function(table) {
                        var targetSection = formSectionGenerator.generateDefaultSingleSection(table);

                        if (typeof targetSection[singleSection][formSectionConstant.sectionKeys.ORDER_INDEX] === "undefined") {
                            assert.fail('Expected orderIndex field to be set ');
                        }
                        if (typeof targetSection[singleSection][formSectionConstant.sectionKeys.IS_PEUSDO] === "undefined") {
                            assert.fail('Expected isPeusdo field to be set ');
                        }
                        if (typeof targetSection[singleSection][formSectionConstant.sectionKeys.HEADER_ELEMENT] === "undefined") {
                            assert.fail('Expected headerElement field to be set ');
                        }
                        if (typeof targetSection[singleSection][formSectionConstant.sectionKeys.ELEMENTS] === "undefined") {
                            assert.fail('Expected elements field to be set ');
                        }
                    });

                    done();
                });
            });
        });
    });
}());
