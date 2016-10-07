/**
 * Generate a form for a given app, table
 * Created by xj on 9/1/16.
 */
(function() {
    'use strict';
    var tableConsts = require('./table.constants');
    var formConsts = require('./form.constants');
    var formBuilder = require('./form.builder');
    var appConsts = require('./app.constants');
    var rawValueGenearator = require('./rawValue.generator');
    var formTabGeneator = require('./form.tab.generator');

    var chance = require('chance').Chance();
    var _ = require('lodash');

    var singleTabAndSectionForm = {};

    var singleTabAndSectionViewForm = {};
    var singleTabAndSectionEditForm = {};
    var singleTabAndSectionCreateForm = {};

    module.exports = {
        getFormBuilder: function() {
            var builderInstance = formBuilder.builder();
            return builderInstance;
        },

        generateSingleTabAndSecForm: function(app) {
            var tables = app[appConsts.TABLES];
            var tableIndex = 0;

            _.forEach(tables, function(table) {
                var builderInstance = formBuilder.builder();
                var appId = table[tableConsts.APP_ID];
                var tableId = table[tableConsts.ID];

                builderInstance.withAppId(appId);
                builderInstance.withTableId(tableId);
                builderInstance.withName(rawValueGenearator.generateStringWithFixLength(10));
                builderInstance.withDescription(rawValueGenearator.generateStringWithFixLength(20));
                builderInstance.withWrapLabel(rawValueGenearator.generateBool());
                builderInstance.withIncludeBuiltIns(rawValueGenearator.generateBool());
                builderInstance.withWrapElements(rawValueGenearator.generateBool());
                builderInstance.withNewFieldAction('DO_NOTHING');
                builderInstance.withTab(formTabGeneator.generateDefaultSingleTab(table));

                singleTabAndSectionForm[tableIndex] = builderInstance.build();
                tableIndex++;
            });

            return singleTabAndSectionForm;
        },

        generateSingleTabAndSecFormWithAddAndEdit: function(app) {
            var tables = app[appConsts.TABLES];
            var tableIndex = 0;

            _.forEach(tables, function(table) {
                var builderInstance = formBuilder.builder();
                var appId = table[tableConsts.APP_ID];
                var tableId = table[tableConsts.ID];

                builderInstance.withAppId(appId);
                builderInstance.withTableId(tableId);
                builderInstance.withName(rawValueGenearator.generateStringWithFixLength(10));
                builderInstance.withDescription(rawValueGenearator.generateStringWithFixLength(20));
                builderInstance.withWrapLabel(rawValueGenearator.generateBool());
                builderInstance.withIncludeBuiltIns(rawValueGenearator.generateBool());
                builderInstance.withWrapElements(rawValueGenearator.generateBool());
                builderInstance.withNewFieldAction('DO_NOTHING');
                builderInstance.withTab(formTabGeneator.generateDefaultSingleTabWithAddAndEdit(table));

                singleTabAndSectionForm[tableIndex] = builderInstance.build();
                tableIndex++;
            });

            return singleTabAndSectionForm;
        },

        generateSingleTabAndSecCreateForm: function(table) {
            var builderInstance = formBuilder.builder();
            var appId = table[tableConsts.APP_ID];
            var tableId = table[tableConsts.ID];

            builderInstance.withAppId(appId);
            builderInstance.withTableId(tableId);
            builderInstance.withName(rawValueGenearator.generateStringWithFixLength(10));
            builderInstance.withDescription(rawValueGenearator.generateStringWithFixLength(20));
            builderInstance.withWrapLabel(rawValueGenearator.generateBool());
            builderInstance.withIncludeBuiltIns(rawValueGenearator.generateBool());
            builderInstance.withWrapElements(rawValueGenearator.generateBool());
            builderInstance.withNewFieldAction('DO_NOTHING');
            builderInstance.withTab(formTabGeneator.generateDefaultSingleTab(table));

            singleTabAndSectionCreateForm[singleTabAndSectionCreateForm.size++] = builderInstance.build();

            return singleTabAndSectionCreateForm;
        },

        generateSingleTabAndSecEditForm: function(table) {
            var builderInstance = formBuilder.builder();
            var appId = table[tableConsts.APP_ID];
            var tableId = table[tableConsts.ID];

            builderInstance.withAppId(appId);
            builderInstance.withTableId(tableId);
            builderInstance.withName(rawValueGenearator.generateStringWithFixLength(10));
            builderInstance.withDescription(rawValueGenearator.generateStringWithFixLength(20));
            builderInstance.withWrapLabel(rawValueGenearator.generateBool());
            builderInstance.withIncludeBuiltIns(rawValueGenearator.generateBool());
            builderInstance.withWrapElements(rawValueGenearator.generateBool());
            builderInstance.withNewFieldAction('DO_NOTHING');
            builderInstance.withTab(formTabGeneator.generateDefaultSingleTab(table));

            singleTabAndSectionEditForm[singleTabAndSectionEditForm.size++] = builderInstance.build();

            return singleTabAndSectionEditForm;
        },

        generateSingleTabAndSecViewForm: function(table) {
            var builderInstance = formBuilder.builder();
            var appId = table[tableConsts.APP_ID];
            var tableId = table[tableConsts.ID];

            builderInstance.withAppId(appId);
            builderInstance.withTableId(tableId);
            builderInstance.withName(rawValueGenearator.generateStringWithFixLength(10));
            builderInstance.withDescription(rawValueGenearator.generateStringWithFixLength(20));
            builderInstance.withWrapLabel(rawValueGenearator.generateBool());
            builderInstance.withIncludeBuiltIns(rawValueGenearator.generateBool());
            builderInstance.withWrapElements(rawValueGenearator.generateBool());
            builderInstance.withNewFieldAction('DO_NOTHING');
            builderInstance.withTab(formTabGeneator.generateDefaultSingleTab(table));

            singleTabAndSectionCreateForm[singleTabAndSectionCreateForm.size++] = builderInstance.build();

            return singleTabAndSectionCreateForm;
        },
    };
}());
