/**
 * Generate a random form element for form
 * Created by xj on 9/6/16.
 */
(function() {
    'use strict';
    var fieldConsts = require('./field.constants');
    var formElementBuilder = require('./form.element.builder');
    var rawValue = require('./rawValue.generator');

    var chance = require('chance').Chance();
    var _ = require('lodash');

    const formElementDisplayOptions = ['ADD', 'EDIT', 'VIEW'];

    module.exports = {
        generateDefaultHeaderElement: function() {
            var builderInstance = formElementBuilder.builder();

            builderInstance.withType('HEADER');
            builderInstance.withLabelPosition('LEFT');
            builderInstance.withDisplayOptions(formElementDisplayOptions);
            builderInstance.withDisplayText(rawValue.generateStringWithFixLength(51));
            return {"FormHeaderElement": builderInstance.build()};
        },

        generateDefaultElements: function(fields) {
            var elements = {};
            var elementIndex = 0;

            _.forEach(fields, function(field) {
                var builderInstance = formElementBuilder.builder();

                //builderInstance.withUseAlternateLabel(rawValue.generateBool());
                //builderInstance.withReadOnly(rawValue.generateBool());
                builderInstance.withRequired(rawValue.generateBool());
                builderInstance.withFieldId(field[fieldConsts.fieldKeys.ID]);
                builderInstance.withOrderIndex(elementIndex);
                builderInstance.withPositionSameRow(rawValue.generateBool()); //all fields displays in same row if we comment out this
                builderInstance.withDisplayText(rawValue.generateString());
                builderInstance.withDisplayOptions(formElementDisplayOptions);
                builderInstance.withLabelPosition('LEFT');
                builderInstance.withType('FIELD');

                elements[elementIndex] = {"FormFieldElement": builderInstance.build()};
                elementIndex++;
            });

            return elements;
        }
    };
}());
