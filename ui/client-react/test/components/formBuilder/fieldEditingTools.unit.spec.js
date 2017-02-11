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
    deleteField(_tabIndex, _sectionIndex, _orderIndex) {}
};

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
        const tabIndex = 0;
        const sectionIndex = 1;
        const orderIndex = 3;
        spyOn(mockParentProps, 'deleteField');

        component = shallow(<FieldEditingTools
            tabIndex={tabIndex}
            sectionIndex={sectionIndex}
            orderIndex={orderIndex}
            onClickDelete={mockParentProps.deleteField}
        />);

        let deleteButton = component.find('.deleteFieldIcon');
        expect(deleteButton).toBePresent();

        deleteButton.simulate('click');

        expect(mockParentProps.deleteField).toHaveBeenCalledWith(tabIndex, sectionIndex, orderIndex);
    });

    it('positions the editing tools over the next sibling element', () => {
        component = shallow(<FieldEditingTools/>);
        let instance = component.instance();

        instance.setPositionOfFieldEditingTools(component.find('.fieldEditingTools'));

        expect(instance.state).toEqual({
            position: 'absolute',
            zIndex: 0,
            top: '-5px',
            left: '-15px',
            height: '76px',
            width: '140px'
        });
    });
});



