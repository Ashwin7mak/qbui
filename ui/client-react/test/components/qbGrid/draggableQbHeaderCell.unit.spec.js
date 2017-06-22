import React, {PropTypes} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {DraggableQbHeaderCell} from '../../../src/components/dataTable/qbGrid/draggableQbHeaderCell';

let component;

const props = {
    connectDragSource: (obj) => {return obj;},
    connectDropTarget: (obj) => {return obj;},
    draggingColumnStart: () => {},
    draggingColumnEnd: () => {}
};

describe('DraggableQbHeaderCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a header cell', () => {
        component = shallow(<DraggableQbHeaderCell {...props} isDragging={false} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a sticky header cell', () => {
        component = shallow(<DraggableQbHeaderCell {...props} isDragging={false} isStickyCell={true} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a placeholder header cell when the cell is a placeholder and not dragging', () => {
        component = shallow(<DraggableQbHeaderCell {...props} isDragging={false} isPlaceholderCell={true} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });

    it('renders a placeholder header cell when the cell is dragging', () => {
        component = shallow(<DraggableQbHeaderCell {...props} isDragging={true} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });
});
