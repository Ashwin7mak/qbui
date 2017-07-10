import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import DialogFieldInput from '../../src/components/multiStepDialog/dialogFieldInput';
import {Simulate} from 'react-addons-test-utils';
import {MAX_TABLE_NAME_LENGTH} from '../../../../client-react/src/constants/componentConstants';

let component;

const mockParentFunctions = {
    updateTableProperty() {},
    onFocusInput() {},
    onBlurInput() {}
};

describe('DialogFieldInput', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a DialogFieldInput', () => {
        component = shallow(<DialogFieldInput title="Title"
                         name="name"
                         placeholder="placeHolder"
                         value=""
                         onChange={mockParentFunctions.updateTableProperty}
                         onFocus={mockParentFunctions.onFocusInput}
                         onBlur={mockParentFunctions.onBlurInput}
                         required
                         hasFocus={true}
                         edited={false}
                         validationError={null}/>);

        let inputs = component.find("input");
        expect(inputs).toBePresent();

        expect(component.find('.dialogField')).toBePresent();
    });

    it('renders a DialogFieldInput with validation error', () => {
        component = shallow(<DialogFieldInput title="Title"
                                             name="name"
                                             placeholder="placeHolder"
                                             value=""
                                             onChange={mockParentFunctions.updateTableProperty}
                                             onFocus={mockParentFunctions.onFocusInput}
                                             onBlur={mockParentFunctions.onBlurInput}
                                             required
                                             hasFocus={false}
                                             edited={true}
                                             validationError={"Should not be empty!"}/>);

        expect(component.find('.dialogField.validationFailed')).toBePresent();

    });

    it('renders an DialogFieldInput with focus and a validation error', () => {
        component = shallow(<DialogFieldInput title="Title"
                                             name="name"
                                             placeholder="placeHolder"
                                             value=""
                                             onChange={mockParentFunctions.updateTableProperty}
                                             onFocus={mockParentFunctions.onFocusInput}
                                             onBlur={mockParentFunctions.onBlurInput}
                                             required
                                             hasFocus={true}
                                             edited={false}
                                             validationError={"Should not be empty!"}/>);

        expect(component.find('.dialogField.validationFailed')).not.toBePresent();

    });

    it('maxLength is set properly on input field', () => {

        component = mount(<DialogFieldInput title="Title"
                                              name="name"
                                              placeholder="placerHolder"
                                              value=""
                                              onChange={mockParentFunctions.updateTable}
                                              onBlur={mockParentFunctions.onBlurInput}
                                              required
                                              hasFocus={true}
                                              edited={false}
                                              validationError={null}
                                              maxLength={MAX_TABLE_NAME_LENGTH}/>);

        let inputFields = component.find("input");
        let inputField = inputFields.get(0);

        expect(inputField.maxLength).toBe(MAX_TABLE_NAME_LENGTH);
    });

    it('invokes callbacks from DialogFieldInput', () => {
        spyOn(mockParentFunctions, 'onFocusInput');
        spyOn(mockParentFunctions, 'updateTableProperty');

        component = mount(<DialogFieldInput title="Title"
                                             name="description"
                                             component="textarea"
                                             placeholder="placeHolder"
                                             value=""
                                             onChange={mockParentFunctions.updateTableProperty}
                                             onFocus={mockParentFunctions.onFocusInput}
                                             onBlur={mockParentFunctions.onBlurInput}
                                             required
                                             hasFocus={true}
                                             edited={false}
                                             validationError={null}/>);
        let textareas = component.find("textarea");
        expect(textareas).toBePresent();

        let textarea = textareas.get(0);

        Simulate.focus(textarea);
        Simulate.change(textarea);
        expect(mockParentFunctions.onFocusInput).toHaveBeenCalled();

        textarea.value = 'new description';
        Simulate.change(textarea);
        Simulate.keyDown(textarea, {key: "Tab", keyCode: 9, which: 9}); // tab out
        expect(mockParentFunctions.updateTableProperty).toHaveBeenCalled();

    });
});
