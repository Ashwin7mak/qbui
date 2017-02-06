import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';


import {FormBuilder, __RewireAPI__ as FormBuilderRewire} from '../../../src/components/formBuilder/formBuilder';
import QbForm from '../../../src/components/QBForm/qbform';

const mockFormData = {formMeta: {tabs: {0: {sections: {0: {elements: {0: 'fieldElement'}}}}}}};
const mockFormBuilder = {moveField: function(_newTabIndex, _newSectionIndex, _newOrderIndex, _draggedItemProps) {}};

let component;
let instance;

describe('FormBuilder (drag/drop container)', () => {
    beforeEach(() => {
        jasmineEnzyme();
        FormBuilderRewire.__Rewire__('FormBuilderUtils', mockFormBuilder);
        spyOn(mockFormBuilder, 'moveField');
    });

    afterEach(() => {
        FormBuilderRewire.__ResetDependency__('FormBuilderUtils');
    });

    it('wraps QbForm in a drag drop container', () => {
        component = shallow(<FormBuilder formData={mockFormData} />);
        instance = component.instance();
        // Calling component did mount manually because I don't want to render child components for this test
        // and the componentDidMount stuff will be removed once the redux store is build.
        // TODO:: Remove componentDidMount - https://quickbase.atlassian.net/browse/MC-112
        instance.componentDidMount();

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
            component = shallow(<FormBuilder formData={mockFormData} />);
            instance = component.instance();
            // Calling component did mount manually because I don't want to render child components for this test
            // and the componentDidMount stuff will be removed once the redux store is build.
            // TODO:: Remove componentDidMount - https://quickbase.atlassian.net/browse/MC-112
            instance.componentDidMount();

            const draggedItemProps = {draggedItem: 5};
            instance.handleFormReorder(1, 2, 3, draggedItemProps);

            expect(mockFormBuilder.moveField).toHaveBeenCalledWith(mockFormData.formMeta, 1, 2, 3, draggedItemProps);
        });
    });
});
