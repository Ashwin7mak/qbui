import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';

import {LinkToRecordFieldValueEditor} from '../../src/components/fields/linkToRecordFieldValueEditor';
import MultiChoiceFieldValueEditor from '../../src/components/fields/multiChoiceFieldValueEditor';
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

    //props object for a form builder
    let newRecordProps = {newFormFieldId: 'newFieldId'};

    //props object for a edit/view form
    let existingRecordProps = {};

    //common props
    const props = {
        hideRelationshipDialog: () => {},
        updateField: () => {},
        removeFieldFromForm: () => {},
        tblId: "childTableId",
        tables: [
            {id: "childTableId", name: "childTable", tableIcon: "childIcon", tableNoun: "child"},
            {id: "parentTableId", name: "parentTable", tableIcon: "parentIcon", tableNoun: "parent"}
        ],
        childTableId: "childTableId",
        location: {},
        formId: 1,
        fieldDef: {id: 'newFieldId'}
    };

    Object.assign(newRecordProps, props);
    Object.assign(existingRecordProps, props);

    it('renders LinkToRecordValueEditor component', () => {
        component = mount(<LinkToRecordFieldValueEditor {...newRecordProps}/>);
        expect(component.find(LinkToRecordTableSelectionDialog)).toBePresent();
    });

    it('simulates selecting a table', () => {
        spyOn(newRecordProps, "hideRelationshipDialog");
        spyOn(newRecordProps, "updateField");
        component = shallow(<LinkToRecordFieldValueEditor {...newRecordProps}/>);

        component.instance().tableSelected("parentTableId");
        expect(newRecordProps.hideRelationshipDialog).toHaveBeenCalled();
        expect(newRecordProps.updateField).toHaveBeenCalled();
    });

    it('simulates cancelling table selection', () => {
        spyOn(newRecordProps, "removeFieldFromForm");
        component = shallow(<LinkToRecordFieldValueEditor {...newRecordProps}/>);
        component.instance().cancelTableSelection();

        expect(newRecordProps.removeFieldFromForm).toHaveBeenCalled();
    });

    it('renders a multichoicefieldeditor for edit form', () => {
        component = mount(<LinkToRecordFieldValueEditor {...existingRecordProps}/>);
        expect(component.find(MultiChoiceFieldValueEditor)).toBePresent();
    });
});
