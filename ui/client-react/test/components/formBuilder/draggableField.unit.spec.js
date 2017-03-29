import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {FieldEditingTools, __RewireAPI__ as FieldEditingToolsRewireAPI} from '../../../src/components/formBuilder/fieldEditingTools/fieldEditingTools';
import DraggableField, {__RewireAPI__ as DraggableFieldRewireAPI} from '../../../src/components/formBuilder/draggableField';

const mockDragSource = (_types, _fieldDragSource, _collect) => component => component;
const MockFieldComponent = props => <div className="mockField"></div>;
const mockConnectDragSource = component => component;

let DraggableComponent;
let component;

describe('DraggableField', () => {
    beforeEach(() => {
        jasmineEnzyme();

        DraggableFieldRewireAPI.__Rewire__('DragSource', mockDragSource);
        DraggableFieldRewireAPI.__Rewire__('FieldEditingTools', FieldEditingTools);

        DraggableComponent = DraggableField(MockFieldComponent);
    });

    afterEach(() => {
        DraggableFieldRewireAPI.__Rewire__('FieldEditingTools');
        DraggableFieldRewireAPI.__ResetDependency__('DragSource');
    });

    it('wraps a FieldComponent in a DragSource to make it draggable', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isDragging={false} selectedFields={[]} formBuilderChildrenTabIndex={[]} />);

        expect(component.find('.notDragging')).toBePresent();
        let parentDiv = component.find('.draggableField');
        expect(parentDiv).toBePresent();
        expect(parentDiv.find(MockFieldComponent)).toBePresent();
    });

    it('adds a dragging class when the component is being dragged', () => {
        component = shallow(<DraggableComponent connectDragSource={mockConnectDragSource} isDragging={true} selectedFields={[]} formBuilderChildrenTabIndex={[]}/>);

        expect(component.find('.dragging')).toBePresent();
        expect(component.find('.notDragging')).not.toBePresent();
    });
});
