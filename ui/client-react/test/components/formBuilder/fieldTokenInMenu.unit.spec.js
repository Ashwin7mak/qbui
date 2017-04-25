import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {FieldTokenInMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import FieldToken from '../../../src/components/formBuilder/fieldToken/fieldToken';

let component;
let formId = 1;
let selectedField = 1;
let appId = 1;
let tblId = 1;
let relatedField = {};
let mockActions = {
    addNewFieldToForm(_formId, _location, _field) {}
};

describe('FieldTokenInMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'addNewFieldToForm');
    });

    it('renders a field token for display in a menu', () => {
        const type = 'textbox';
        const title = 'New Textbox';
        component = shallow(<FieldTokenInMenu type={type} title={title} />);

        let fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('will invoke addNewFieldToForm when FieldToken node is clicked', () => {
        const type = 'textbox';
        const title = 'New Textbox';
        component = shallow(<FieldTokenInMenu addNewFieldToForm={mockActions.addNewFieldToForm} relatedField={relatedField} type={type} title={title} formId={formId} selectedField={selectedField} appId={appId} tblId={tblId}/>);
        component.find(FieldToken).simulate('click');

        expect(mockActions.addNewFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, selectedField, relatedField);
    });
});
