import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import DraggableElement, {__RewireAPI__ as DraggableElementRewireAPI} from '../../../src/components/formBuilder/draggableElement';

const mockDragSource = (_types, _fieldDragSource, _collect) => component => component;
const MockFieldComponent = props => <div className="mockField" />;
const mockConnectDragSource = component => component;

let DraggableComponent;
let component;

describe('DraggableElement', () => {
    beforeEach(() => {
        jasmineEnzyme();

        DraggableElementRewireAPI.__Rewire__('DragSource', mockDragSource);

        DraggableComponent = DraggableElement(MockFieldComponent);
    });

    afterEach(() => {
        DraggableElementRewireAPI.__ResetDependency__('DragSource');
    });

    it('wraps a FieldComponent in a DragSource to make it draggable', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isDragging={false} selectedFields={[]} formBuilderChildrenTabIndex={[]} />);

        expect(component.find('.notDragging')).toBePresent();
        let parentDiv = component.find('.draggableField');
        expect(parentDiv).toBePresent();
        expect(parentDiv.find('MockFieldComponent')).toBePresent();
    });

    it('adds a dragging class when the component is being dragged', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isDragging={true} selectedFields={[]} formBuilderChildrenTabIndex={[]}/>);

        expect(component.find('.dragging')).toBePresent();
        expect(component.find('.notDragging')).not.toBePresent();
    });

    it('adds a dragging class when a left nav menu field token is being dragged', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isDragging={true} location={{a: 'b'}} selectedField={{a: 'b'}} formBuilderChildrenTabIndex={[]}/>);

        expect(component.find('.dragging')).toBePresent();
        expect(component.find('.notDragging')).not.toBePresent();
    });

    it('does not add a dragging class isTokenInMenuDragging is false', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isTokenInMenuDragging={false} location={{a: 'b'}} selectedField={{a: 'b'}} formBuilderChildrenTabIndex={[]}/>);

        expect(component.find('.notDragging')).toBePresent();
        expect(component.find('.dragging')).not.toBePresent();
    });

    it('does not add a dragging class isDragging is false', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isDragging={false} location={{a: 'b'}} selectedField={{a: 'b'}} formBuilderChildrenTabIndex={[]}/>);

        expect(component.find('.notDragging')).toBePresent();
        expect(component.find('.dragging')).not.toBePresent();
    });

    it('does not add a dragging class when isTokenInMenuDragging is true but the location and selection are not the same', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isTokenInMenuDragging={true} location={{a: 'c'}} selectedField={{a: 'b'}} formBuilderChildrenTabIndex={[]}/>);

        expect(component.find('.notDragging')).toBePresent();
        expect(component.find('.dragging')).not.toBePresent();
    });
});
