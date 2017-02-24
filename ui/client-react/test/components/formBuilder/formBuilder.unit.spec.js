import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';


import {FormBuilder} from '../../../src/components/formBuilder/formBuilder';
import QbForm from '../../../src/components/QBForm/qbform';

const mockFormData = {formMeta: {tabs: [{orderIndex: 0,
    sections: [{orderIndex: 1,
        columns: [{orderIndex: 2,
            rows: [{orderIndex: 3,
                elements: [{orderIndex: 4}]
            }]
        }]
    }]
}]}};

let component;
let instance;

describe('FormBuilder (drag/drop container)', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('wraps QbForm in a drag drop container', () => {
        component = shallow(<FormBuilder formData={mockFormData} showCustomDragLayer={false} />);
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
            let mockParent = {moveField(_formMeta, _newLocation, _draggedItemProps) {}};
            spyOn(mockParent, 'moveField');

            component = shallow(<FormBuilder formId={'view'} formData={mockFormData} moveFieldOnForm={mockParent.moveField} />);
            instance = component.instance();

            const newLocation = {location: 1};
            const draggedItemProps = {draggedItem: 5};
            instance.handleFormReorder(newLocation, draggedItemProps);

            expect(mockParent.moveField).toHaveBeenCalledWith('view', newLocation, draggedItemProps);
        });
    });
});
