import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';


import {FormBuilder} from '../../../src/components/formBuilder/formBuilder';
import QbForm from '../../../src/components/QBForm/qbform';

const mockFormData = {formMeta: {tabs: {0: {sections: {0: {elements: {0: 'fieldElement'}}}}}}};

let component;
let instance;

describe('FormBuilder (drag/drop container)', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('wraps QbForm in a drag drop container', () => {
        component = shallow(<FormBuilder formData={mockFormData} />);
        instance = component.instance();

        expect(component.find('.formBuilderContainer')).toBePresent();

        let qbForm = component.find(QbForm);
        expect(qbForm).toBePresent();
        expect(qbForm).toHaveProp('edit', true);
        expect(qbForm).toHaveProp('editingForm', true);
        expect(qbForm).toHaveProp('formData', mockFormData);
        expect(qbForm).toHaveProp('handleFormReorder', instance.handleFormReorder);
    });

    describe('handleFormReorder', () => {
        it('calls the moveField function to initiate moving the field when dropped', () => {
            let mockParent = {moveField(_formMeta, _newTabIndex, _newSectionIndex, _newOrderIndex, _draggedItemProps) {}};
            spyOn(mockParent, 'moveField');

            component = shallow(<FormBuilder formId={'view'} formData={mockFormData} moveFieldOnForm={mockParent.moveField} />);
            instance = component.instance();

            const draggedItemProps = {draggedItem: 5};
            instance.handleFormReorder(1, 2, 3, draggedItemProps);

            expect(mockParent.moveField).toHaveBeenCalledWith('view', 1, 2, 3, draggedItemProps);
        });
    });
});
