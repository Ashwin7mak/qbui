/**
 * form.tab.builder.js allows you to chain together commands to build a form tab element
 * Created by xj on 9/6/16.
 */
(function() {
    'use strict';

    var formTabConstants = require('./form.tab.constants');
    var _ = require('lodash');

    module.exports = {

        builder: function() {
            var formTabUnderConstruction = {};
            var formTabSections = [];

            return {
                build: function() {
                    if (formTabSections.length > 0) {
                        formTabUnderConstruction[formTabConstants.tabKeys.SECTIONS] = formTabSections;
                    }
                    return formTabUnderConstruction;
                },

                /************************************************************/
                /*                  Form Tab Properties                     */
                /************************************************************/
                withOrderIndex: function(orderIndex) {
                    formTabUnderConstruction[formTabConstants.tabKeys.ORDER_INDEX] = orderIndex;
                    return this;
                },
                withTitle: function(title) {
                    formTabUnderConstruction[formTabConstants.tabKeys.TITLE] = title;
                    return this;
                },
                withSection: function(section) {
                    formTabSections.push(section);
                    return this;
                },
            };
        }
    };
}());
