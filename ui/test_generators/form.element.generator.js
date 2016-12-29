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
    var NUMERIC_FIELD = 6;
    var NUMERIC_PERCENT_FIELD = 8;
    var NUMERIC_DURATION_FIELD = 13;
    var PHONE_NO_FIELD = 15;
    var EMAIL_FIELD = 16;
    var URL_FIELD = 17;

    const formElementDisplayOptions = ['ADD', 'EDIT', 'VIEW'];
    const formElementDisplayOptionsAddAndEdit = ['ADD', 'EDIT', 'VIEW'];

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

                builderInstance.withUseAlternateLabel(rawValue.generateBool());
                // builderInstance.withReadOnly(rawValue.generateBool());
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
        },
        generateDefaultElementsWithAddAndEdit: function(fields) {
            var elements = {};
            var elementIndex = 0;

            //Excluding builtin fields
            for (var i = 0; i < fields.length; i++) {
                var builderInstance = formElementBuilder.builder();

                //Make some fields required on the form.
                if (i === NUMERIC_FIELD || i === NUMERIC_PERCENT_FIELD || i === NUMERIC_DURATION_FIELD || i === PHONE_NO_FIELD || i === EMAIL_FIELD || i === URL_FIELD) {
                    builderInstance.withRequired(true);
                }
                builderInstance.withFieldId(fields[i][fieldConsts.fieldKeys.ID]);
                builderInstance.withOrderIndex(elementIndex);
                builderInstance.withPositionSameRow(false); //set to false displays fields one after the other.
                builderInstance.withDisplayText(rawValue.generateString());
                builderInstance.withDisplayOptions(formElementDisplayOptionsAddAndEdit);
                builderInstance.withLabelPosition('LEFT');
                builderInstance.withType('FIELD');

                elements[elementIndex] = {"FormFieldElement": builderInstance.build()};
                elementIndex++;
            }

            return elements;
        }
    };
}());
