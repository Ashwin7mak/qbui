import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DragAndDropElement, {__RewireAPI__ as DragAndDropElementRewireAPI} from '../../../src/components/formBuilder/dragAndDropElement';

const MockDragDropHocs = {
    DraggableField(component) {return component;},
    DroppableFormElement(component) {return component;}
};

const MockFieldComponent = props => <div className="mockField"></div>;

let component;

describe('DragAndDropElement', () => {
    beforeEach(() => {
        jasmineEnzyme();

        spyOn(MockDragDropHocs, 'DraggableField').and.callThrough();
        spyOn(MockDragDropHocs, 'DroppableFormElement').and.callThrough();

        DragAndDropElementRewireAPI.__Rewire__('DraggableField', MockDragDropHocs.DraggableField);
        DragAndDropElementRewireAPI.__Rewire__('DroppableFormElement', MockDragDropHocs.DroppableFormElement);
    });

    afterEach(() => {
        DragAndDropElementRewireAPI.__ResetDependency__('DraggableField');
        DragAndDropElementRewireAPI.__ResetDependency__('DroppableFormElement');
    });

    it('connects and element to both a drag and drop source', () => {
        DragAndDropElement(MockFieldComponent);

        expect(MockDragDropHocs.DraggableField).toHaveBeenCalled();
        expect(MockDragDropHocs.DroppableFormElement).toHaveBeenCalled();
    });

    it('contains the passed in FieldComponent', () => {
        let DragDropComponent = DragAndDropElement(MockFieldComponent);
        component = shallow(<DragDropComponent/>);

        expect(component.find('.dragAndDropElement')).toBePresent();
        expect(component.find(MockFieldComponent)).toBePresent();
    });
});
