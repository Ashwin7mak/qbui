/**
 * form.element.builder.js allows you to chain together commands to build a form element
 * Created by xj on 9/6/16.
 */
(function() {
    'use strict';

    var formElementConstants = require('./form.element.constants');
    var _ = require('lodash');

    module.exports = {

        builder: function() {
            var formElementUnderConstruction = {};

            return {
                build: function() {
                    return formElementUnderConstruction;
                },

                /************************************************************/
                /*                  Form Element Properties                 */
                /************************************************************/

                withOrderIndex: function(orderIndex) {
                    formElementUnderConstruction[formElementConstants.elementKeys.ORDER_INDEX] = orderIndex;
                    return this;
                },
                withUseAlternateLabel: function(useAlternateLabel) {
                    formElementUnderConstruction[formElementConstants.elementKeys.USE_ALT_LAB] = useAlternateLabel;
                    return this;
                },
                withReadOnly: function(readOnly) {
                    formElementUnderConstruction[formElementConstants.elementKeys.READ_ONLY] = readOnly;
                    return this;
                },
                withRequired: function(required) {
                    formElementUnderConstruction[formElementConstants.elementKeys.REQUIRED] = required;
                    return this;
                },
                withFieldId: function(fieldId) {
                    formElementUnderConstruction[formElementConstants.elementKeys.FIELD_ID] = fieldId;
                    return this;
                },
                withPositionSameRow: function(positionSameRow) {
                    formElementUnderConstruction[formElementConstants.elementKeys.POSITION_SAME_ROW] = positionSameRow;
                    return this;
                },
                withDisplayText: function(displayText) {
                    formElementUnderConstruction[formElementConstants.elementKeys.DISPLAY_TEXT] = displayText;
                    return this;
                },
                withLabelPosition: function(labelPosition) {
                    formElementUnderConstruction[formElementConstants.elementKeys.LAB_POSITION] = labelPosition;
                    return this;
                },
                withType: function(type) {
                    formElementUnderConstruction[formElementConstants.elementKeys.TYPE] = type;
                    return this;
                },
                withDisplayOptions: function(displayOptions) {
                    formElementUnderConstruction[formElementConstants.elementKeys.DISPLAY_OPTIONS] = displayOptions;
                    return this;
                },
            };
        }
    };
}());
