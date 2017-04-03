import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TableFieldInput from '../../src/components/table/tableFieldInput';
import {Simulate} from 'react-addons-test-utils';

let component;

const mockParentFunctions = {
    updateTableProperty() {},
    onFocusInput() {},
    onBlurInput() {}
};

describe('TableCreationDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a TableFieldInput', () => {
        component = shallow(<TableFieldInput title="Title"
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

        expect(component.find('.tableField')).toBePresent();
    });

    it('renders a TableFieldInput with validation error', () => {
        component = shallow(<TableFieldInput title="Title"
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

        expect(component.find('.tableField.validationFailed')).toBePresent();

    });

    it('renders an TableFieldInput with focus and a validation error', () => {
        component = shallow(<TableFieldInput title="Title"
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

        expect(component.find('.tableField.validationFailed')).not.toBePresent();

    });

    it('invokes callbacks from TableFieldInput', () => {
        spyOn(mockParentFunctions, 'onFocusInput');
        spyOn(mockParentFunctions, 'updateTableProperty');

        component = mount(<TableFieldInput title="Title"
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
