(function() {
    var _ = require('lodash');
    let constants = require('../../../../common/src/constants');

    const cannedTextField = {name:"Text",
        type:"SCALAR",
        datatypeAttributes:{type:"TEXT"}
    };

    const cannedDateField = {name:"Date",
        type:"SCALAR",
        datatypeAttributes:{type:"DATE"}
    };

    const cannedListAllReport = {"name": 'List All',
        "type": "TABLE"};

    const cannedListChangesReport = {name: "List Changes",
        type: "TABLE",
        sortList:  [
            {
                "fieldId": constants.BUILTIN_FIELD_ID.DATE_MODIFIED,
                "sortOrder": "desc",
                "groupType": null
            }
        ]};

    const cannedForm = {
        //name: "AXRBrcL1DR",
        tabs: {
            0: {
                orderIndex: 0,
                sections: {
                    0: {
                        pseudo: true,
                        orderIndex: 0,
                        elements: {
                            0: {
                                FormFieldElement: {
                                    type: "FIELD",
                                    orderIndex: 1,
                                    //fieldId: 6,
                                    showAsRadio: false
                                }
                            },
                            1: {
                                FormFieldElement: {
                                    type: "FIELD",
                                    orderIndex: 1,
                                    //"fieldId": 7,
                                    showAsRadio: false
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

        getCannedReports: function() {
            return [cannedListAllReport, cannedListChangesReport];
        },

        getCannedForms: function(formName, fieldIds) {
            let form = _.clone(cannedForm);
            form.name = formName;
            if (fieldIds.length === 2) {
                form.tabs[0].sections[0].elements[0].FormFieldElement.fieldId = fieldIds[0];
                form.tabs[0].sections[0].elements[1].FormFieldElement.fieldId = fieldIds[1];
            }
            return [form];
        }
    };
}());



