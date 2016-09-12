/**
 * A test to test form tab generation code
 * Created by xj on 9/8/16.
 */
(function() {
    'use strict';

    var formSectionBuilder = require('../form.section.builder');
    var formTabGenerator = require('../form.tab.generator');
    var formTabConstant = require('../form.tab.constants');
    var constant = require('../../common/src/constants');
    var appConsts = require('../app.constants');
    var appGenerator = require('../app.generator');
    var _ = require('lodash');
    var assert = require('assert');
    const singleTab = 0;

    /**
     * Unit tests for form tab generator
     */
    describe('Form tab generator unit test', function() {
        function formTabDataProvider() {
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
         * Unit test that validates generating form tab
         */
        describe('test form tab creation', function() {
            formTabDataProvider().forEach(function(entry) {
                it('Test case : ' + entry.message, function(done) {

                    entry.testTable.forEach(function(table) {
                        var tabSection = formTabGenerator.generateDefaultSingleTab(table);

                        console.log(JSON.stringify(tabSection, null, 2));

                        if (typeof tabSection[singleTab][formTabConstant.tabKeys.ORDER_INDEX] === "undefined") {
                            assert.fail('Expected orderIndex field to be set ');
                        }
                        if (typeof tabSection[singleTab][formTabConstant.tabKeys.TITLE] === "undefined") {
                            assert.fail('Expected title field to be set ');
                        }
                        if (typeof tabSection[singleTab][formTabConstant.tabKeys.SECTIONS] === "undefined") {
                            assert.fail('Expected sections field to be set ');
                        }
                    });

                    done();
                });
            });
        });
    });
}());
