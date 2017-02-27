import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DroppableElement, {__RewireAPI__ as DroppableElementRewireAPI} from '../../../src/components/formBuilder/droppableFormElement';

const mockDropTarget = (_types, _formTarget, _collect) => component => component;
const MockFieldComponent = props => <div className="mockField"></div>;
const mockConnectDropTarget = component => component;

let DroppableComponent;
let component;

describe('DroppableFormElement', () => {
    beforeEach(() => {
        jasmineEnzyme();

        DroppableElementRewireAPI.__Rewire__('DropTarget', mockDropTarget);

        DroppableComponent = DroppableElement(MockFieldComponent);
    });

    afterEach(() => {
        DroppableElementRewireAPI.__ResetDependency__('DropTarget');
    });

    let testCases = [
        {
            description: 'adds a class when a draggable item is hovering over the component',
            isOver: true,
            canDrop: true,
            expectedClassName: 'droppableField dropHovering'
        },
        {
            description: 'has a class for when an item is not hovering over the element',
            isOver: false,
            canDrop: true,
            expectedClassName: 'droppableField notDropHovering'
        },
        {
            description: 'does not have the hovering class if the currently dragged element cannot be dropped here',
            isOver: true,
            canDrop: false,
            expectedClassName: 'droppableField notDropHovering'
        }
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            component = shallow(<DroppableComponent connectDropTarget={mockConnectDropTarget} isOver={testCase.isOver} canDrop={testCase.canDrop} />);

            expect(component.find('.droppableField')).toHaveProp('className', testCase.expectedClassName);
        });
    });
});
