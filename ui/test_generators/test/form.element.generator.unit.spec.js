/**
 * A test to test form element generation code
 * Created by xj on 9/7/16.
 */
(function() {
    'use strict';

    var formElementGenerator = require('../form.element.generator');
    var formElementConstants = require('../form.element.constants');
    var constant = require('../../common/src/constants');
    var _ = require('lodash');
    var assert = require('assert');

    /**
     * Unit tests for form element generator
     */
    describe('Form element generator unit test', function() {
        function formElementDataProvider() {
            var singleFields = [], multipleFields = [];

            var textField = {fieldType: constant.SCALAR, dataType: constant.TEXT, id: 0};
            var numericField = {fieldType: constant.SCALAR, dataType: constant.NUMERIC, id: 1};
            var dateField = {fieldType: constant.SCALAR, dataType: constant.DATE, id: 2};

            singleFields.push(textField);
            multipleFields.push(textField);
            multipleFields.push(numericField);
            multipleFields.push(dateField);

            return [
                {
                    message : 'Generate a single field form element',
                    testFields: singleFields
                },
                {
                    message : 'Generate multiple fields form elements',
                    testFields: multipleFields
                }
            ];
        }

        /**
         * Unit test that validates generating elements with a specified field attributes
         */
        describe('test generating elements given single or multiple fields', function() {
            formElementDataProvider().forEach(function(entry) {
                it('Test case (field check): ' + entry.message, function(done) {
                    var targetElements = formElementGenerator.generateDefaultElements(entry.testFields);

                    entry.testFields.forEach(function(element) {
                        if (targetElements[element.id].FormFieldElement.fieldId !== element.id) {
                            assert.fail('Expected field Id ' + element.id + ' to match actual field Id ' + targetElements[element.id].fieldId);
                        }
                        if (typeof targetElements[element.id].FormFieldElement.required === "undefined") {
                            assert.fail('Expected required field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.useAlternateLabel === "undefined") {
                            assert.fail('Expected useAlternateLabel field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.useAlternateLabel === "undefined") {
                            assert.fail('Expected useAlternateLabel field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.orderIndex === "undefined") {
                            assert.fail('Expected orderIndex field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.readOnly === "undefined") {
                            assert.fail('Expected readOnly field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.positionSameRow === "undefined") {
                            assert.fail('Expected positionSameRow field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.displayText === "undefined") {
                            assert.fail('Expected displayText field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.labelPosition === "undefined") {
                            assert.fail('Expected labelPosition field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.type === "undefined") {
                            assert.fail('Expected type field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.displayOptions === "undefined") {
                            assert.fail('Expected displayOptions field to be set ');
                        }
                        if (typeof targetElements[element.id].FormFieldElement.displayText === "undefined") {
                            assert.fail('Expected displayText field to be set ');
                        }
                    });
                    done();
                });
            });
        });

        /**
         * Unit test that validates generating head element
         */
        describe('test form header element', function() {
            it('Test case (header element check): ', function(done) {
                var targetHeaderElementsObject = formElementGenerator.generateDefaultHeaderElement();
                var targetHeaderElements = targetHeaderElementsObject.FormHeaderElement;

                if (typeof targetHeaderElements[formElementConstants.elementKeys.TYPE] === "undefined") {
                    assert.fail('Expected type field to be set ');
                }
                if (typeof targetHeaderElements[formElementConstants.elementKeys.LAB_POSITION] === "undefined") {
                    assert.fail('Expected labelPosition field to be set ');
                }
                if (typeof targetHeaderElements[formElementConstants.elementKeys.DISPLAY_OPTIONS] === "undefined") {
                    assert.fail('Expected displayOptions field to be set ');
                }
                if (typeof targetHeaderElements[formElementConstants.elementKeys.DISPLAY_TEXT] === "undefined") {
                    assert.fail('Expected displayText field to be set ');
                }

                done();
            });
        });
    });
}());
