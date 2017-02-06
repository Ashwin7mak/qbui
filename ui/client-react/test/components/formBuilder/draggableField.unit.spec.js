import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DraggableField from '../../../src/components/formBuilder/draggableField';

const mockDragSource = (_types, _fieldDragSource, collect) => component => component;
const MockFieldComponent = props => <div className="mockField"></div>;
const mockConnectDragSource = component => component;

let ComponentClass;
let component;

describe('DraggableField', () => {
    beforeEach(() => {
        jasmineEnzyme();

        DraggableField.__Rewire__('DragSource', mockDragSource);

        ComponentClass = DraggableField(MockFieldComponent);
    });

    afterEach(() => {
        DraggableField.__ResetDependency__('DragSource');
    });

    it('wraps a FieldComponent in a DragSource to make it draggable', () => {
        component = shallow(<ComponentClass connectDragSource={mockConnectDragSource} isDragging={false} />);

        expect(component.find('.notDragging')).toBePresent();
        let parentDiv = component.find('.draggableField');
        expect(parentDiv).toBePresent();
        expect(parentDiv.find(MockFieldComponent)).toBePresent();
    });

    it('adds a dragging class when the component is being dragged', () => {
        component = shallow(<ComponentClass connectDragSource={mockConnectDragSource} isDragging={true} />);

        expect(component.find('.dragging')).toBePresent();
        expect(component.find('.notDragging')).not.toBePresent();
    });
});
