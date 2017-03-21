/**
 * Contains the canned components that are created with a new table.
 */
(function() {
    var _ = require('lodash');
    let constants = require('../../../../common/src/constants');

    const cannedTextField = {[constants.REQUEST_PARAMETER.FIELD.NAME]:'Text',
        [constants.REQUEST_PARAMETER.FIELD.TYPE]:'SCALAR',
        [constants.REQUEST_PARAMETER.FIELD.DATA_TYPE_ATTRS]:{
            [constants.REQUEST_PARAMETER.FIELD.TYPE]:'TEXT'
        }
    };

    const cannedDateField = {
        [constants.REQUEST_PARAMETER.FIELD.NAME]:'Date',
        [constants.REQUEST_PARAMETER.FIELD.TYPE]:'SCALAR',
        [constants.REQUEST_PARAMETER.FIELD.DATA_TYPE_ATTRS]: {
            [constants.REQUEST_PARAMETER.FIELD.TYPE]: 'DATE'
        }
    };

    const cannedListAllReport = {/*'name': 'List All',*/
        [constants.REQUEST_PARAMETER.REPORT.TYPE]: 'TABLE'};

    const cannedListChangesReport = {[constants.REQUEST_PARAMETER.REPORT.NAME]: 'Latest Changes',
        [constants.REQUEST_PARAMETER.REPORT.TYPE]: 'TABLE',
        [constants.REQUEST_PARAMETER.REPORT.SORT_LIST]:  [
            {
                [constants.REQUEST_PARAMETER.REPORT.SORT.FIELD_ID]: constants.BUILTIN_FIELD_ID.DATE_MODIFIED,
                [constants.REQUEST_PARAMETER.REPORT.SORT.SORT_ORDER]: 'desc',
                [constants.REQUEST_PARAMETER.REPORT.SORT.GROUP_TYPE]: null
            }
        ]};

    const cannedForm = {
        //name: 'AXRBrcL1DR',
        [constants.REQUEST_PARAMETER.FORM.TABS]: {
            0: {
                [constants.REQUEST_PARAMETER.FORM.ORDER_IDX]: 0,
                [constants.REQUEST_PARAMETER.FORM.SECTIONS]: {
                    0: {
                        [constants.REQUEST_PARAMETER.FORM.PSEUDO]: true,
                        [constants.REQUEST_PARAMETER.FORM.ORDER_IDX]: 0,
                        [constants.REQUEST_PARAMETER.FORM.ELEMENTS]: {
                            0: {
                                [constants.REQUEST_PARAMETER.FORM.FORM_FIELD_EL]: {
                                    [constants.REQUEST_PARAMETER.FORM.TYPE]: 'FIELD',
                                    [constants.REQUEST_PARAMETER.FORM.ORDER_IDX]: 1,
                                    //fieldId: 6,
                                    [constants.REQUEST_PARAMETER.FORM.SHOW_AS_RADIO]: false
                                }
                            },
                            1: {
                                [constants.REQUEST_PARAMETER.FORM.FORM_FIELD_EL]: {
                                    [constants.REQUEST_PARAMETER.FORM.TYPE]: 'FIELD',
                                    [constants.REQUEST_PARAMETER.FORM.ORDER_IDX]: 1,
                                    //'fieldId': 7,
                                    [constants.REQUEST_PARAMETER.FORM.SHOW_AS_RADIO]: false
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    module.exports  = {
        getCannedFields: function() {
            return [cannedTextField, cannedDateField];
        },

        getCannedReports: function(tableName) {
            cannedListAllReport[constants.REQUEST_PARAMETER.REPORT.NAME] = 'All ' + tableName;
            return [cannedListAllReport, cannedListChangesReport];
        },

        getCannedForms: function(formName, fieldIds) {
            let form = _.clone(cannedForm);
            form[constants.REQUEST_PARAMETER.FORM.NAME] = formName + ' form';
            if (fieldIds.length === 2) {
                form.tabs[0].sections[0].elements[0].FormFieldElement.fieldId = fieldIds[0];
                form.tabs[0].sections[0].elements[1].FormFieldElement.fieldId = fieldIds[1];
            }
            return [form];
        }
    };
}());



