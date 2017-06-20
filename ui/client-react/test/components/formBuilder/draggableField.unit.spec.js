import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {DraggableField, DragAndDropField} from '../../../src/components/formBuilder/draggableField';
import {CONTEXT} from '../../../src/actions/context';
import {DraggableFieldTokenInMenu} from "../../../src/components/formBuilder/draggableFieldTokenInMenu";

const formId = CONTEXT.FORM.VIEW;

let component;
let instance;

describe('DraggableField', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a DragDropField and passes the correct props along with any additional props passed to the component', () => {
        const testAdditionalProp = 'test';
        component = shallow(<DraggableField
            additionalProp={testAdditionalProp}
        />);

        instance = component.instance();
        let dragAndDropField = component.find(DragAndDropField);

        expect(dragAndDropField).toHaveProp('beginDrag', instance.beginDrag);
        expect(dragAndDropField).toHaveProp('onHover', instance.onHover);
        expect(dragAndDropField).toHaveProp('checkIsDragging', instance.isDragging);
        expect(dragAndDropField).toHaveProp('endDrag', instance.endDrag);
        expect(dragAndDropField).toHaveProp('fieldEditingTools');
    });


    // This component is a container which doesn't directly render any content.
    // Therefore, we are testing internal implementation details rather than interacting through the component.
    // Most components do not need implementation detail type testing.
    describe('dragging functions', () => {
        describe('beginDrag', () => {
            const testProps = {someProp: 'test'};

            it('returns props passed to it', () => {
                component = shallow(<DraggableField />);
                instance = component.instance();

                expect(instance.beginDrag(testProps)).toEqual(testProps);
            });

            it('calls an action to update the dragging state', () => {
                const isInDraggingState = jasmine.createSpy('isInDraggingState');
                component = shallow(<DraggableField isInDraggingState={isInDraggingState} />);
                instance = component.instance();

                instance.beginDrag(testProps);

                expect(isInDraggingState).toHaveBeenCalledWith(formId);
            });

            it('calls an action to select a field', () => {
                const selectFieldOnForm = jasmine.createSpy('selectFieldOnForm');
                const testLocation = {orderIndex: 3};
                component = shallow(<DraggableField selectFieldOnForm={selectFieldOnForm} location={testLocation} />);
                instance = component.instance();

                instance.beginDrag(testProps);

                expect(selectFieldOnForm).toHaveBeenCalledWith(formId, testLocation);
            });
        });

        describe('handleFormReorder', () => {
            let moveFieldOnForm;

            beforeEach(() => {
                moveFieldOnForm = jasmine.createSpy('moveFieldOnForm');
            });

            it('immediately exits if the moveFieldOnForm prop is not provided', () => {
                component = shallow(<DraggableField />);
                instance = component.instance();

                expect(instance.handleFormReorder).not.toThrowError();
            });

            it('calls the method to reorder the form if form element is selected', () => {
                const selectedFormElement = {name: 'Test Field', positionSameRow: false};
                component = shallow(<DraggableField moveFieldOnForm={moveFieldOnForm} selectedFormElement={selectedFormElement} />);
                instance = component.instance();

                instance.handleFormReorder({}, {}, true);

                expect(moveFieldOnForm).toHaveBeenCalledWith(formId, {}, {containingElement: selectedFormElement, element: undefined});
            });

            it('does not call the method to reorder the form if nothing is selected', () => {
                component = shallow(<DraggableField moveFieldOnForm={moveFieldOnForm} />);
                instance = component.instance();

                instance.handleFormReorder({}, {}, true);

                expect(moveFieldOnForm).not.toHaveBeenCalled();
            });
        });

        describe('endDrag', () => {
            it('does not fail if the actions are missing', () => {
                component = shallow(<DraggableField />);
                instance = component.instance();

                expect(instance.endDrag).not.toThrowError();
            });

            it('calls endDraggingState with the current formId', () => {
                const endDraggingState = jasmine.createSpy('endDraggingState');
                component = shallow(<DraggableField endDraggingState={endDraggingState} />);
                instance = component.instance();

                instance.endDrag();

                expect(endDraggingState).toHaveBeenCalledWith(formId);
            });

            it('calls updateFormAnimationState with false (indicates animation has stopped)', () => {
                const updateFormAnimationState = jasmine.createSpy('updateFormAnimationState');
                component = shallow(<DraggableField updateFormAnimationState={updateFormAnimationState} />);
                instance = component.instance();

                instance.endDrag();

                expect(updateFormAnimationState).toHaveBeenCalledWith(false);
            });
        });

        describe('onHover', () => {
            beforeEach(() => {
                component = shallow(<DraggableField />);
                instance = component.instance();
            });

            it('does not reorder the form if there is no containing element', () => {
                spyOn(instance, 'handleFormReorder');

                instance.onHover();

                expect(instance.handleFormReorder).not.toHaveBeenCalled();
            });

            it('does not reorder the form if the current drop target is the same as the element being dragged', () => {
                const testDropElement = {containingElement: {id: 1}};
                spyOn(instance, 'handleFormReorder');

                instance.onHover(testDropElement, testDropElement);

                expect(instance.handleFormReorder).not.toHaveBeenCalled();
            });

            it('reorders the form if the dragging item is different than the current drop target', () => {
                const testDropElement = {containingElement: {id: 1}, location: 1};
                const testDragElement = {containingElemnet: {id: 2}};
                spyOn(instance, 'handleFormReorder');

                instance.onHover(testDropElement, testDragElement);

                expect(instance.handleFormReorder).toHaveBeenCalledWith(testDropElement.location, testDragElement);
            });
        });
    });
});



