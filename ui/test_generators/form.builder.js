/**
 * form.builder.js allows you to chain together commands to build a form
 *
 * Form structure includes multiple tabs, sections, head and field elements.
 * form.build.js exposes a list of utility methods to generate single
 * or multiple form contains customizable sub components.
 * When the form is built, form.build.js also leverage a list of chain builders, as below.
 *
 * form.tab.builder.js     -> responses to generate form tab element.
 * form.section.builder.js -> responses to generate form section element.
 * form.element.builder.js -> responses to generate form section header element, and field element
 *
 * Created by xj on 9/2/16.
 */
(function() {
    'use strict';
    var formConstants = require('./form.constants');
    var _ = require('lodash');

    module.exports = {

        builder: function() {
            var formUnderConstruction = {};
            var formTabs = {};

            return {
                build: function() {
                    if (formTabs[0]) {
                        formUnderConstruction[formConstants.formKeys.FORM_TABS] = formTabs[0];
                    }
                    return formUnderConstruction;
                },

                /**
                 * Clone a form into a builder so that we can modify it or append
                 * properties to it.
                 * @param form
                 * @returns this
                 */
                cloneIntoBuilder: function(form) {
                    if (form[formConstants.formKeys.TABLE_ID]) {
                        formUnderConstruction[formConstants.formKeys.TABLE_ID] = form[formConstants.formKeys.TABLE_ID];
                    }
                    if (form[formConstants.formKeys.APP_ID]) {
                        formUnderConstruction[formConstants.formKeys.APP_ID] = form[formConstants.formKeys.APP_ID];
                    }
                    if (form[formConstants.formKeys.FORM_NAME]) {
                        formUnderConstruction[formConstants.formKeys.FORM_NAME] = form[formConstants.formKeys.FORM_NAME];
                    }
                    if (form[formConstants.formKeys.FORM_DESC]) {
                        formUnderConstruction[formConstants.formKeys.FORM_DESC] = form[formConstants.formKeys.FORM_DESC];
                    }
                    if (form[formConstants.formKeys.FORM_WRAP]) {
                        formUnderConstruction[formConstants.formKeys.FORM_WRAP] = form[formConstants.formKeys.FORM_WRAP];
                    }
                    if (form[formConstants.formKeys.FORM_INC_BUILDIN]) {
                        formUnderConstruction[formConstants.formKeys.FORM_INC_BUILDIN] = form[formConstants.formKeys.FORM_INC_BUILDIN];
                    }
                    if (form[formConstants.formKeys.FORM_WRAP_ELMNT]) {
                        formUnderConstruction[formConstants.formKeys.FORM_WRAP_ELMNT] = form[formConstants.formKeys.FORM_WRAP_ELMNT];
                    }
                    if (form[formConstants.formKeys.FORM_NEW_FIELD_ACTION]) {
                        formUnderConstruction[formConstants.formKeys.FORM_NEW_FIELD_ACTION] = form[formConstants.formKeys.FORM_NEW_FIELD_ACTION];
                    }

                    return this;
                },

                /************************************************************/
                /*                  Form Properties                         */
                /************************************************************/
                withTableId: function(tableId) {
                    formUnderConstruction[formConstants.formKeys.TABLE_ID] = tableId;
                    return this;
                },
                withAppId: function(appId) {
                    formUnderConstruction[formConstants.formKeys.APP_ID] = appId;
                    return this;
                },
                withName: function(name) {
                    formUnderConstruction[formConstants.formKeys.FORM_NAME] = name;
                    return this;
                },
                withDescription: function(description) {
                    formUnderConstruction[formConstants.formKeys.FORM_DESC] = description;
                    return this;
                },
                withWrapLabel: function(wrapLabel) {
                    formUnderConstruction[formConstants.formKeys.FORM_WRAP] = wrapLabel;
                    return this;
                },
                withIncludeBuiltIns: function(includeBuiltIns) {
                    formUnderConstruction[formConstants.formKeys.FORM_INC_BUILDIN] = includeBuiltIns;
                    return this;
                },
                withWrapElements: function(wrapElements) {
                    formUnderConstruction[formConstants.formKeys.FORM_WRAP_ELMNT] = wrapElements;
                    return this;
                },
                withNewFieldAction: function(newFieldAction) {
                    formUnderConstruction[formConstants.formKeys.FORM_NEW_FIELD_ACTION] = newFieldAction;
                    return this;
                },
                withTab: function(tab) {
                    formTabs[0] = tab;
                    return this;
                }
            };
        }
    };
}());
