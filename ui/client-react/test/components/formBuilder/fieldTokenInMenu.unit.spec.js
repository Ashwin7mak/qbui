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
    addFieldToForm(_formId, _location, _field) {},
    updateFormAnimationState(_state) {}
};

describe('FieldTokenInMenu', () => {
    const type = 'textbox';
    const title = 'New Textbox';

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'addFieldToForm');
        spyOn(mockActions, 'updateFormAnimationState');
    });

    it('renders a field token for display in an EXISTING menu', () => {
        component = shallow(<FieldTokenInMenu type={type} title={title} name={name}/>);

        let fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('renders a field token for display in a NEW menu', () => {
        component = shallow(<FieldTokenInMenu type={type} title={title} />);

        let fieldToken = component.find(FieldToken);

        expect(fieldToken).toHaveProp('isDragging', false);
        expect(fieldToken).toHaveProp('type', type);
        expect(fieldToken).toHaveProp('title', title);
    });

    it('will invoke addFieldToForm when FieldToken node is clicked', () => {
        component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                                 relatedField={relatedField} type={type} title={title} formId={formId}
                                                 selectedField={selectedField} appId={appId} tblId={tblId}/>);
        component.simulate('click');

        expect(mockActions.addFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, selectedField, relatedField);
    });

    it('will invoke addFieldToForm when FieldToken enter is pressed', () => {
        let e = {
            which: 13,
            preventDefault() {
                return;
            }
        };

        component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                                 relatedField={relatedField} type={type} title={title} formId={formId}
                                                 selectedField={selectedField} appId={appId} tblId={tblId}/>);
        instance = component.instance();
        instance.onEnterClickToAdd(e);

        expect(mockActions.addFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, selectedField, relatedField);
    });

    it('will invoke addFieldToForm when space is pressed', () => {
        let e = {
            which: 32,
            preventDefault() {
                return;
            }
        };

        component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                              relatedField={relatedField} type={type} title={title} formId={formId}
                                              selectedField={selectedField} appId={appId} tblId={tblId}/>);
        instance = component.instance();
        instance.onEnterClickToAdd(e);

        expect(mockActions.addFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, selectedField, relatedField);
    });

    it('will not invoke addFieldToForm when keys space or enter are pressed', () => {
        let e = {
            which: 9,
            preventDefault() {
                return;
            }
        };

        component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                              relatedField={relatedField} type={type} title={title} formId={formId}
                                              selectedField={selectedField} appId={appId} tblId={tblId}/>);
        instance = component.instance();
        instance.onEnterClickToAdd(e);

        expect(mockActions.addFieldToForm).not.toHaveBeenCalled();

        it('adds a new field when dragging onto the form if the field has not been added yet', () => {
            component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                                     relatedField={relatedField} type={type} title={title}
                                                     formId={formId} selectedField={selectedField} appId={appId}
                                                     tblId={tblId}/>);

            instance = component.instance();
            instance.onHover({location: selectedField});

            expect(mockActions.addFieldToForm).toHaveBeenCalledWith(formId, appId, tblId, 1, relatedField);
        });

        it('does not add a new field when dragging if the field has already been added', () => {
            component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                                     relatedField={relatedField} type={type} title={title}
                                                     formId={formId} selectedField={selectedField} appId={appId}
                                                     tblId={tblId}/>);
            instance = component.instance();
            component.setState({addedToForm: true});

            instance.onHover();

            expect(mockActions.addFieldToForm).not.toHaveBeenCalled();
        });

        it('resets the state when dragging is complete', () => {
            component = shallow(<DraggableFieldToken addFieldToForm={mockActions.addFieldToForm}
                                                     updateFormAnimationState={mockActions.updateFormAnimationState}
                                                     relatedField={relatedField} type={type} title={title}
                                                     formId={formId} selectedField={selectedField} appId={appId}
                                                     tblId={tblId}/>);
            instance = component.instance();
            component.setState({addedToForm: true});

            instance.endDrag();

            expect(component).toHaveState('addedToForm', false);
            expect(mockActions.updateFormAnimationState).toHaveBeenCalledWith(false);
        });
    });
});
