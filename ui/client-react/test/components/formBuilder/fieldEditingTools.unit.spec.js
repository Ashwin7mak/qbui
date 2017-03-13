import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import FieldEditingTools, {__RewireAPI__ as FieldEditingToolsRewireAPI} from '../../../src/components/formBuilder/fieldEditingTools/fieldEditingTools';
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
    openFieldPreferences(_location) {}
};

const location = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 4};

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
        component = shallow(<FieldEditingTools/>);

        expect(component.find(DragHandle)).toBePresent();
    });

    it('has a delete button', () => {
        spyOn(mockParentProps, 'removeField');

        component = shallow(<FieldEditingTools
            location={location}
            removeField={mockParentProps.removeField}
        />);

        let deleteButton = component.find('.deleteFieldIcon');
        expect(deleteButton).toBePresent();

        deleteButton.simulate('click');

        expect(mockParentProps.removeField).toHaveBeenCalledWith(location);
    });

    it('has a field preferences button', () => {
        spyOn(mockParentProps, 'openFieldPreferences');

        component = shallow(<FieldEditingTools
            location={location}
            onClickFieldPreferences={mockParentProps.openFieldPreferences}
        />);

        let preferencesIcon = component.find('.fieldPreferencesIcon');
        expect(preferencesIcon).toBePresent();

        preferencesIcon.simulate('click');

        expect(mockParentProps.openFieldPreferences).toHaveBeenCalledWith(location);
    });

    it('positions the editing tools over the next sibling element', () => {
        component = shallow(<FieldEditingTools/>);
        let instance = component.instance();

        instance.setPositionOfFieldEditingTools(component.find('.fieldEditingTools'));

        expect(instance.state).toEqual({
            position: 'absolute',
            zIndex: 2,
            top: '-5px',
            left: '-10px',
            height: '76px',
            width: '130px'
        });
    });
});



