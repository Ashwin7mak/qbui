import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';

import {LinkToRecordFieldValueEditor} from '../../src/components/fields/linkToRecordFieldValueEditor';
import LinkToRecordTableSelectionDialog from '../../src/components/fields/linkToRecordTableSelectionDialog';

describe('LinkToRecordValueEditor functions', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.tableDataConnectionDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    let component;

    const parentTableFields = {id: 1, datatypeAttributes: {type: 'TEXT'}};
    const props = {
        hideRelationshipDialog: () => {},
        newFormFieldId: 'newFieldId',
        updateField: () => {},
        removeFieldFromForm: () => {},
        tblId: "childTableId",
        tables: [
            {
                id: "childTableId",
                name: "childTable",
                tableIcon: "childIcon",
                tableNoun: "child",
                fields: []
            },
            {
                id: "parentTableId",
                name: "parentTable",
                tableIcon: "parentIcon",
                tableNoun: "parent",
                fields: [
                    parentTableFields
                ]
            }
        ],
        childTableId: "childTableId",
        location: {},
        formId: 1,
        fieldDef: {id: 'newFieldId'}
    };

    it('renders LinkToRecordValueEditor component', () => {

        component = mount(<LinkToRecordFieldValueEditor {...props}/>);
        expect(component.find(LinkToRecordTableSelectionDialog)).toBePresent();
    });

    it('simulates selecting a table', () => {
        spyOn(props, "hideRelationshipDialog");
        spyOn(props, "updateField");
        component = shallow(<LinkToRecordFieldValueEditor {...props}/>);

        component.instance().tableSelected("parentTableId", parentTableFields);
        expect(props.hideRelationshipDialog).toHaveBeenCalled();
        expect(props.updateField).toHaveBeenCalled();
    });

    it('simulates cancelling table selection', () => {
        spyOn(props, "removeFieldFromForm");
        component = shallow(<LinkToRecordFieldValueEditor {...props}/>);
        component.instance().cancelTableSelection();

        expect(props.removeFieldFromForm).toHaveBeenCalled();
    });
});
