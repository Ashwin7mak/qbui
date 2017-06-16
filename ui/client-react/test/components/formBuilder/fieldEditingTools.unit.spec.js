import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {FieldEditingTools} from '../../../src/components/formBuilder/fieldEditingTools/fieldEditingTools';

const mockParentProps = {
    removeFieldFromForm(_location) {},
    selectFieldOnForm(_formId, _location) {},
    deselectField(_formId, _location) {},
    markFieldForDeletion(_formId, relationshipId) {}
};

const formBuilderChildrenTabIndex = ["0"];
const formId = 'view';
const relatedField = {id: 6, tableId: 'tableId'};
const location = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 4};
const diffSelectedLocation = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 3};
let component;

describe('FieldEditingTools', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a delete button if there are more than one field on the form', () => {
        spyOn(mockParentProps, 'removeFieldFromForm');

        component = shallow(<FieldEditingTools
            app={{id: 'app1'}} tblId={'tbl1'}
            numberOfFieldsOnForm={2}
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            selectedFields={[]}
            location={location}
            relatedField={relatedField}
            removeFieldFromForm={mockParentProps.removeFieldFromForm}
        />);

        let deleteButton = component.find('.deleteFieldIcon button');

        expect(deleteButton).toBePresent();
        expect(deleteButton).not.toBeDisabled();

        deleteButton.simulate('click');

        expect(mockParentProps.removeFieldFromForm).toHaveBeenCalledWith(formId, 'app1', 'tbl1', relatedField, location);
        mockParentProps.removeFieldFromForm.calls.reset();
    });

    it('has disabled delete button if the field is a recordtitle field', () => {
        component = shallow(<FieldEditingTools
            app={{id: 'app1'}} tblId={'tbl1'}
            numberOfFieldsOnForm={2}
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            selectedFields={[]}
            location={location}
            relatedField={relatedField}
            removeFieldFromForm={mockParentProps.removeFieldFromForm}
            fieldId={relatedField.id}
            table={{recordTitleFieldId: relatedField.id}}
        />);

        let deleteButton = component.find('.deleteFieldIcon button');

        expect(deleteButton).toBePresent();
        expect(deleteButton).toBeDisabled();
    });

    it('has delete button if the field is a detail key field field', () => {
        component = shallow(<FieldEditingTools
            app={{id: 'app1', relationships: [{detailAppId: 'app1', detailTableId: 'tbl1', detailFieldId: relatedField.id}]}} tblId={'tbl1'}
            numberOfFieldsOnForm={2}
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            selectedFields={[]}
            location={location}
            relatedField={relatedField}
            removeFieldFromForm={mockParentProps.removeFieldFromForm}
            fieldId={relatedField.id}
            table={{recordTitleFieldId: relatedField.id}}
        />);

        let deleteButton = component.find('.deleteFieldIcon button');

        expect(deleteButton).toBePresent();
        expect(deleteButton).toBeDisabled();
    });

    it('does not have a a delete button if there is only one field on the form', () => {
        spyOn(mockParentProps, 'removeFieldFromForm');

        component = shallow(<FieldEditingTools
            numberOfFieldsOnForm={1}
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            selectedFields={[]}
            location={location}
            relatedField={relatedField}
            removeFieldFromForm={mockParentProps.removeFieldFromForm}
        />);

        let deleteButton = component.find('.deleteFieldIcon button');

        expect(deleteButton).not.toBePresent();
    });

    it('selects a field when an element is clicked', () => {
        spyOn(mockParentProps, 'selectFieldOnForm');

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[]}
            selectFieldOnForm={mockParentProps.selectFieldOnForm}
            deselectField={mockParentProps.deselectField}
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
            bottom: 1500,
            top: 100
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementDownIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementDownIntoView).toHaveBeenCalled();
    });

    it('scrolls into view when the selectedFormElement is at the top of the page', () => {
        let container = {
            bottom: 50,
            top: 10
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementUpIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementUpIntoView).toHaveBeenCalled();
    });

    it('will not scroll down into view when the selectedFormElement is already in view', () => {
        let container = {
            bottom: 50,
            top: 50
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementDownIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementDownIntoView).not.toHaveBeenCalled();
    });

    it('will not scroll up into view when the selectedFormElement is already in view', () => {
        let container = {
            bottom: 50,
            top: 350
        };

        component = shallow(<FieldEditingTools
            formBuilderChildrenTabIndex={formBuilderChildrenTabIndex}
            location={location}
            selectedFields={[location]}
        />);

        let instance = component.instance();
        spyOn(instance, 'getSelectedFormElementContainer').and.returnValue(container);
        spyOn(instance, 'scrollElementUpIntoView');

        instance.updateScrollLocation();

        expect(instance.scrollElementUpIntoView).not.toHaveBeenCalled();
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



