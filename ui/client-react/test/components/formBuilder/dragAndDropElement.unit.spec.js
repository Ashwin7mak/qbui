import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DragAndDropElement, {__RewireAPI__ as DragAndDropElementRewireAPI} from '../../../src/components/formBuilder/dragAndDropElement';

const MockDragDropHocs = {
    DraggableElement(component) {return component;},
    DroppableElement(component) {return component;}
};

const MockFieldComponent = props => <div className="mockField" />;

let component;

describe('DragAndDropElement', () => {
    beforeEach(() => {
        jasmineEnzyme();

        spyOn(MockDragDropHocs, 'DraggableElement').and.callThrough();
        spyOn(MockDragDropHocs, 'DroppableElement').and.callThrough();

        DragAndDropElementRewireAPI.__Rewire__('DraggableElement', MockDragDropHocs.DraggableElement);
        DragAndDropElementRewireAPI.__Rewire__('DroppableElement', MockDragDropHocs.DroppableElement);
    });

    afterEach(() => {
        DragAndDropElementRewireAPI.__ResetDependency__('DraggableElement');
        DragAndDropElementRewireAPI.__ResetDependency__('DroppableElement');
    });

    it('connects and element to both a drag and drop source', () => {
        DragAndDropElement(MockFieldComponent);

        expect(MockDragDropHocs.DraggableElement).toHaveBeenCalled();
        expect(MockDragDropHocs.DroppableElement).toHaveBeenCalled();
    });

    it('contains the passed in FieldComponent', () => {
        let DragDropComponent = DragAndDropElement(MockFieldComponent);
        component = shallow(<DragDropComponent/>);

        expect(component.find('.dragAndDropElement')).toBePresent();
        expect(component.find(MockFieldComponent)).toBePresent();
    });
});
