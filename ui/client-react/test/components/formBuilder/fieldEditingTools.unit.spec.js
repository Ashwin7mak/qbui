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
};

const location = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 4};
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
});



