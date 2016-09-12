/**
 * form.section.builder.js allows you to chain together commands to build a form section element
 * Created by xj on 9/6/16.
 */
(function() {
    'use strict';

    var formSectionConstants = require('./form.section.constants');
    var _ = require('lodash');

    module.exports = {

        builder: function() {
            var formSectionUnderConstruction = {};
            var formSectionElements = {};

            return {
                build: function() {
                    if (formSectionElements) {
                        formSectionUnderConstruction[formSectionConstants.sectionKeys.ELEMENTS] = formSectionElements;
                    }
                    return formSectionUnderConstruction;
                },

                /************************************************************/
                /*                  Form Section Properties                 */
                /************************************************************/
                withOrderIndex: function(orderIndex) {
                    formSectionUnderConstruction[formSectionConstants.sectionKeys.ORDER_INDEX] = orderIndex;
                    return this;
                },
                withHeaderElement: function(headerElement) {
                    formSectionUnderConstruction[formSectionConstants.sectionKeys.HEADER_ELEMENT] = headerElement;
                    return this;
                },
                withIsPeusdo: function(isPeusdo) {
                    formSectionUnderConstruction[formSectionConstants.sectionKeys.IS_PEUSDO] = isPeusdo;
                    return this;
                },
                withElement: function(element) {
                    formSectionElements.push(element);
                    return this;
                },
                withAdditionalElements: function(elements) {
                    formSectionElements.concat(elements);
                },
                withElements: function(elements) {
                    formSectionElements = Object.assign({}, elements);
                },
            };
        }
    };
}());
