import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {FieldTokenInMenu, DraggableFieldToken} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import FieldToken from '../../../src/components/formBuilder/fieldToken/fieldToken';

let component;
let instance;
let formId = 1;
let selectedField = 1;
let appId = 1;
let tblId = 1;
let relatedField = {};
let mockActions = {
    addNewFieldToForm(_formId, _location, _field) {}
};

describe('FieldTokenInMenu', () => {
    const type = 'textbox';
    const title = 'New Textbox';

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'addNewFieldToForm');
    });

    it('renders a field token for display in a menu', () => {
        component = shallow(<FieldTokenInMenu type={type} title={title} />);

        let fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('will invoke addNewFieldToForm when FieldToken node is clicked', () => {
        component = shallow(<DraggableFieldToken addNewFieldToForm={mockActions.addNewFieldToForm} relatedField={relatedField} type={type} title={title} formId={formId} selectedField={selectedField} appId={appId} tblId={tblId}/>);
        component.simulate('click');

        expect(mockActions.addNewFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, selectedField, relatedField);
    });

    it('adds a new field when dragging onto the form if the field has not been added yet', () => {
        component = shallow(<DraggableFieldToken addNewFieldToForm={mockActions.addNewFieldToForm} relatedField={relatedField} type={type} title={title} formId={formId} selectedField={selectedField} appId={appId} tblId={tblId}/>);

        instance = component.instance();
        instance.onHover({location: selectedField});

        expect(mockActions.addNewFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, {elementIndex: 0}, relatedField);
    });

    it('does not add a new field when dragging if the field has already been added', () => {
        component = shallow(<DraggableFieldToken addNewFieldToForm={mockActions.addNewFieldToForm} relatedField={relatedField} type={type} title={title} formId={formId} selectedField={selectedField} appId={appId} tblId={tblId}/>);
        instance = component.instance();
        component.setState({addedToForm: true});

        instance.onHover();

        expect(mockActions.addNewFieldToForm).not.toHaveBeenCalled();
    });
});
