import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {FieldEditingTools, __RewireAPI__ as FieldEditingToolsRewireAPI} from '../../../src/components/formBuilder/fieldEditingTools/fieldEditingTools';
import DragHandle from '../../../src/components/formBuilder/dragHandle/dragHandle';

const mockReactDom = {
    findDOMNode(_element) {
        return {nextElementSibling: {
            offsetTop: 5,
            offsetLeft: 5,
            offsetHeight: 50,
            offsetWidth: 100
        }};
    }
};

const mockParentProps = {
    removeField(_location) {},
    openFieldPreferences(_location) {},
    selectField(_formId, _location) {},
    keyBoardMoveFieldUp(_formId, _location) {},
    keyboardMoveFieldDown(_formId, _location) {}
};

const location = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 4};
const diffSelectedLocation = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 3};
const formId = 'view';
let component;

describe('FieldEditingTools', () => {
    beforeEach(() => {
        jasmineEnzyme();

        FieldEditingToolsRewireAPI.__Rewire__('ReactDom', mockReactDom);
    });

    afterEach(() => {
        FieldEditingToolsRewireAPI.__ResetDependency__('ReactDom');
    });

    it('has a drag handle', () => {
        component = shallow(<FieldEditingTools selectedFields={[]}/>);

        expect(component.find(DragHandle)).toBePresent();
    });

    it('has a delete button', () => {
        spyOn(mockParentProps, 'removeField');

        component = shallow(<FieldEditingTools
            selectedFields={[]}
            location={location}
            removeField={mockParentProps.removeField}
        />);

        let deleteButton = component.find('.deleteFieldIcon button');

        expect(deleteButton).toBePresent();

        deleteButton.simulate('click');

        expect(mockParentProps.removeField).toHaveBeenCalledWith(location);
    });

    it('has a field preferences button', () => {
        spyOn(mockParentProps, 'openFieldPreferences');

        component = shallow(<FieldEditingTools
            selectedFields={[]}
            location={location}
            onClickFieldPreferences={mockParentProps.openFieldPreferences}
        />);

        let preferencesIcon = component.find('.fieldPreferencesIcon button');

        expect(preferencesIcon).toBePresent();

        preferencesIcon.simulate('click');

        expect(mockParentProps.openFieldPreferences).toHaveBeenCalledWith(location);
    });

    it('selects a field when an element is clicked', () => {
        spyOn(mockParentProps, 'selectField');

        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[location]}
            selectField={mockParentProps.selectField}
        />);

        let onClickField = component.find('.fieldEditingTools');

        onClickField.simulate('click');

        expect(mockParentProps.selectField).toHaveBeenCalledWith(formId, location);
    });

    it('adds a selectedFormElement class to the field that is selected', () => {
        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[location]}
        />);

        let selectedFormElement = component.find('.selectedFormElement');

        expect(selectedFormElement).toBePresent();
    });

    it('does not add a selectedFormElement class to any fields, when no fields are selected', () => {
        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[]}
        />);

        let selectedFormElement = component.find('.selectedFormElement');

        expect(selectedFormElement).not.toBePresent();
    });

    it('scrolls into view when the selectedFormElement is at the bottom of the page of the page', () => {
        let container = {
            height: 150,
            top: 100
        };

        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementIntoView).toHaveBeenCalled();
    });

    it('scrolls into view when the selectedFormElement is at the top of the page', () => {
        let container = {
            height: 50,
            top: 10
        };

        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementIntoView).toHaveBeenCalled();
    });

    it('will not scroll into view when the selectedFormElement is at the top of the page', () => {
        let container = {
            height: 50,
            top: 50
        };

        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementIntoView).not.toHaveBeenCalled();
    });

    it('will move a field up if the selected form element is not at index 0', () => {
        spyOn(mockParentProps, 'keyBoardMoveFieldUp');

        component = shallow(<FieldEditingTools
            location={location}
            selectedFields={[location]}
            formId={formId}
            keyBoardMoveFieldUp={mockParentProps.keyBoardMoveFieldUp}
        />);

        let instance = component.instance();

        instance.keyboardMoveFieldUp();

        expect(mockParentProps.keyBoardMoveFieldUp).toHaveBeenCalledWith(formId, location);
    });

    it('will not move a field up if the selected form element is at index 0', () => {
        const locationAtIndexZero = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 0};

        spyOn(mockParentProps, 'keyBoardMoveFieldUp');

        component = shallow(<FieldEditingTools
            location={locationAtIndexZero}
            selectedFields={[locationAtIndexZero]}
            formId={formId}
            keyBoardMoveFieldUp={mockParentProps.keyBoardMoveFieldUp}
        />);

        let instance = component.instance();

        instance.keyboardMoveFieldUp();

        expect(mockParentProps.keyBoardMoveFieldUp).not.toHaveBeenCalled();
    });

    it('will move a field down if the selected form element is not located at the last index', () => {
        let currentForm = {formData: {formMeta: {fields:[1, 2, 3, 4, 5, 6]}}};

        spyOn(mockParentProps, 'keyboardMoveFieldDown');

        component = shallow(<FieldEditingTools
            currentForm = {currentForm}
            location={location}
            selectedFields={[location]}
            formId={formId}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();

        instance.keyboardMoveFieldDown();

        expect(mockParentProps.keyboardMoveFieldDown).toHaveBeenCalledWith(formId, location);
    });

    it('will not move a field down if the selected form element is greater than the last index', () => {
        let currentForm = {formData: {formMeta: {fields: [1, 2, 3, 4]}}};

        spyOn(mockParentProps, 'keyboardMoveFieldDown');

        component = shallow(<FieldEditingTools
            currentForm = {currentForm}
            location={location}
            selectedFields={[location]}
            formId={formId}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();

        instance.keyboardMoveFieldDown();

        expect(mockParentProps.keyboardMoveFieldDown).not.toHaveBeenCalled();
    });

    it('will select a field when enter is pressed', () => {
        let currentForm = {formBuilderChildrenTabIndex: ["0"]};

        spyOn(mockParentProps, 'keyboardMoveFieldDown');

        let e = {
            which: 13
        };
        component = shallow(<FieldEditingTools
            currentForm = {currentForm}
            location={location}
            selectedFields={[diffSelectedLocation]}
            formId={formId}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).toHaveBeenCalledWith(e);
    });

    it('will select a field when space is pressed', () => {
        let currentForm = {formBuilderChildrenTabIndex: ["0"]};

        spyOn(mockParentProps, 'keyboardMoveFieldDown');

        let e = {
            which: 32
        };
        component = shallow(<FieldEditingTools
            currentForm = {currentForm}
            location={location}
            selectedFields={[diffSelectedLocation]}
            formId={formId}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).toHaveBeenCalledWith(e);
    });

    it('will not select a field when a user presses a key that is not enter or space', () => {
        let currentForm = {formBuilderChildrenTabIndex: ["0"]};

        spyOn(mockParentProps, 'keyboardMoveFieldDown');

        let e = {
            which: 29
        };
        component = shallow(<FieldEditingTools
            currentForm={currentForm}
            location={location}
            selectedFields={[diffSelectedLocation]}
            formId={formId}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).not.toHaveBeenCalled();
    });

    it('will not select a field when the field is already selected', () => {
        let currentForm = {formBuilderChildrenTabIndex: ["0"]};

        spyOn(mockParentProps, 'keyboardMoveFieldDown');

        let e = {
            which: 13
        };
        component = shallow(<FieldEditingTools
            currentForm={currentForm}
            location={location}
            selectedFields={[location]}
            formId={formId}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).not.toHaveBeenCalled();
    });
});



