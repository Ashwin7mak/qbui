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
    removeFieldFromForm(_location) {},
    openFieldPreferences(_location) {},
    selectFieldOnForm(_formId, _location) {}
};

const formBuilderChildrenTabIndex = ["0"];
const formId = 'view';
const location = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 4};
const diffSelectedLocation = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 3};
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
        component = shallow(<FieldEditingTools formBuilderChildrenTabIndex={formBuilderChildrenTabIndex} selectedFields={[]}/>);

        expect(component.find(DragHandle)).toBePresent();
    });

    it('has a delete button', () => {
        spyOn(mockParentProps, 'removeFieldFromForm');

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            selectedFields={[]}
            location={location}
            removeFieldFromForm={mockParentProps.removeFieldFromForm}
        />);

        let deleteButton = component.find('.deleteFieldIcon button');

        expect(deleteButton).toBePresent();

        deleteButton.simulate('click');

        expect(mockParentProps.removeFieldFromForm).toHaveBeenCalledWith(formId, location);
    });

    it('has a field preferences button', () => {
        spyOn(mockParentProps, 'openFieldPreferences');

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
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
        spyOn(mockParentProps, 'selectFieldOnForm');

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
            selectFieldOnForm={mockParentProps.selectFieldOnForm}
        />);

        let onClickField = component.find('.fieldEditingTools');

        onClickField.simulate('click');

        expect(mockParentProps.selectFieldOnForm).toHaveBeenCalledWith(formId, location);
    });

    it('adds a selectedFormElement class to the field that is selected', () => {
        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let selectedFormElement = component.find('.selectedFormElement');

        expect(selectedFormElement).toBePresent();
    });

    it('does not add a selectedFormElement class to any fields, when no fields are selected', () => {
        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[]}
        />);

        let selectedFormElement = component.find('.selectedFormElement');

        expect(selectedFormElement).not.toBePresent();
    });

    it('scrolls into view when the selectedFormElement is at the bottom of the page', () => {
        let container = {
            height: 1500,
            top: 100
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
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
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementIntoView).toHaveBeenCalled();
    });

    it('will not scroll into view when the selectedFormElement is already in view', () => {
        let container = {
            height: 50,
            top: 50
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementIntoView).not.toHaveBeenCalled();
    });

    it('will select a field when enter is pressed', () => {
        let e = {
            which: 13
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[diffSelectedLocation]}
            formId={formId}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).toHaveBeenCalledWith(e);
    });

    it('will select a field when space is pressed', () => {
        let e = {
            which: 32
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[diffSelectedLocation]}
            formId={formId}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).toHaveBeenCalledWith(e);
    });

    it('will not select a field when a user presses a key that is not enter or space', () => {
        let e = {
            which: 29
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[diffSelectedLocation]}
            formId={formId}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).not.toHaveBeenCalled();
    });

    /**
     * This allows enter to click on buttons inside of a field
     * */
    it('will not select a field when the field is already selected', () => {
        let e = {
            which: 13
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
            keyboardMoveFieldDown={mockParentProps.keyboardMoveFieldDown}
        />);

        let instance = component.instance();
        spyOn(instance, 'onClickField');

        instance.selectedCurrentField(e);

        expect(instance.onClickField).not.toHaveBeenCalled();
    });
});



