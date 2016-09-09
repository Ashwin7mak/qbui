/**
 * Generate a random form tag for form
 * Created by xj on 9/7/16.
 */
(function() {
    'use strict';
    var tableConsts = require('./table.constants');
    var formTabBuilder = require('./form.tab.builder');
    var formSectionGenearator = require('./form.section.generator');
    var rawValueGenearator = require('./rawValue.generator');

    var tabs = {};
    const singleTab = 0;

    module.exports = {
        generateDefaultSingleTab: function(table) {
            var builderInstance = formTabBuilder.builder();
            builderInstance.withOrderIndex(singleTab);
            builderInstance.withTitle(rawValueGenearator.generateStringWithFixLength(22));
            var section = formSectionGenearator.generateDefaultSingleSection(table);
            builderInstance.withSection(section);

            tabs[singleTab] = builderInstance.build();
            return tabs;
        },
    };
}());
