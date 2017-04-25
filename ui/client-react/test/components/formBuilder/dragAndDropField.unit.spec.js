import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DragAndDropField, {__RewireAPI__ as DragAndDropFieldRewireAPI} from '../../../src/components/formBuilder/dragAndDropField';

const MockDragDropHocs = {
    DraggableField(component) {return component;},
    DroppableFormElement(component) {return component;}
};

const MockFieldComponent = props => <div className="mockField"></div>;

let component;

describe('DragAndDropField', () => {
    beforeEach(() => {
        jasmineEnzyme();

        spyOn(MockDragDropHocs, 'DraggableField').and.callThrough();
        spyOn(MockDragDropHocs, 'DroppableFormElement').and.callThrough();

        DragAndDropFieldRewireAPI.__Rewire__('DraggableField', MockDragDropHocs.DraggableField);
        DragAndDropFieldRewireAPI.__Rewire__('DroppableFormElement', MockDragDropHocs.DroppableFormElement);
    });

    afterEach(() => {
        DragAndDropFieldRewireAPI.__ResetDependency__('DraggableField');
        DragAndDropFieldRewireAPI.__ResetDependency__('DroppableFormElement');
    });

    it('connects and element to both a drag and drop source', () => {
        DragAndDropField(MockFieldComponent);

        expect(MockDragDropHocs.DraggableField).toHaveBeenCalled();
        expect(MockDragDropHocs.DroppableFormElement).toHaveBeenCalled();
    });

    it('contains the passed in FieldComponent', () => {
        let DragDropComponent = DragAndDropField(MockFieldComponent);
        component = shallow(<DragDropComponent/>);

        expect(component.find('.dragAndDropField')).toBePresent();
        expect(component.find(MockFieldComponent)).toBePresent();
    });
});
