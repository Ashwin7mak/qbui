/**
 * Generate a random form section for form
 * Created by xj on 9/7/16.
 */
(function() {
    'use strict';
    var tableConsts = require('./table.constants');
    var formSectionBuilder = require('./form.section.builder');
    var formElementGenerator = require('./form.element.generator');
    var rawValue = require('./rawValue.generator');

    var sections = {};
    const singleSection = 0;

    module.exports = {
        generateDefaultSingleSection: function(table) {
            var builderInstance = formSectionBuilder.builder();
            builderInstance.withOrderIndex(singleSection);
            builderInstance.withHeaderElement(formElementGenerator.generateDefaultHeaderElement());
            builderInstance.withIsPeusdo(rawValue.generateBool());
            var elements = formElementGenerator.generateDefaultElements(table[tableConsts.FIELDS]);
            builderInstance.withElements(elements);

            sections[singleSection] = builderInstance.build();
            return sections;
        },
        generateDefaultSingleSectionWithAddAndEdit: function(table) {
            var builderInstance = formSectionBuilder.builder();
            builderInstance.withOrderIndex(singleSection);
            builderInstance.withHeaderElement(formElementGenerator.generateDefaultHeaderElement());
            builderInstance.withIsPeusdo(rawValue.generateBool());
            var elements = formElementGenerator.generateDefaultElementsWithAddAndEdit(table[tableConsts.FIELDS]);
            builderInstance.withElements(elements);

            sections[singleSection] = builderInstance.build();
            return sections;
        },
    };
}());
