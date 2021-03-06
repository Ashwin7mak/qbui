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

    var singleTabAndSectionViewForm = {};
    var singleTabAndSectionEditForm = {};
    var singleTabAndSectionCreateForm = {};

    module.exports = {
        getFormBuilder: function() {
            var builderInstance = formBuilder.builder();
            return builderInstance;
        },

        generateFormProperties: function(app, formTabWithDisplayOptions) {
            var tables = app[appConsts.TABLES];
            var tableIndex = 0;
            var singleTabAndSectionForm = [];
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
                builderInstance.withTab(formTabWithDisplayOptions(table));

                singleTabAndSectionForm[tableIndex] = JSON.parse(JSON.stringify(builderInstance.build()));
                tableIndex++;
            });

            return singleTabAndSectionForm;
        },

        generateSingleTabAndSecForm: function(app) {
            var self = this;
            return self.generateFormProperties(app, formTabGeneator.generateDefaultSingleTab);
        },

        generateSingleTabAndSecFormWithAddAndEdit: function(app) {
            var self = this;
            return self.generateFormProperties(app, formTabGeneator.generateDefaultSingleTabWithAddAndEdit);
        },

    };
}());
