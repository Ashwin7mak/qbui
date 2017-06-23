import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {DraggableQbHeaderCell, DraggableHeaderCell, __RewireAPI__ as DraggableQbHeaderCellRewireAPI} from '../../../src/components/dataTable/qbGrid/draggableQbHeaderCell';

let component;

const props = {
    draggingColumnStart: () => {},
    draggingColumnEnd: () => {},
    labelBeingDragged: ''
};

class mockDraggableHeaderCell extends React.Component {
    render() {
        return <div />;
    }
}

describe('DraggableQbHeaderCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
        DraggableQbHeaderCellRewireAPI.__Rewire__('DraggableHeaderCell', mockDraggableHeaderCell);
    });

    afterEach(() => {
        DraggableQbHeaderCellRewireAPI.__ResetDependency__('DraggableHeaderCell');
    });

    it('renders a header cell', () => {
        component = shallow(<DraggableQbHeaderCell {...props} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a sticky header cell', () => {
        component = shallow(<DraggableQbHeaderCell {...props} isStickyCell={true} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a placeholder header cell when the cell is a placeholder and not dragging', () => {
        component = shallow(<DraggableQbHeaderCell {...props} isPlaceholderCell={true} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });

    it('renders a placeholder header cell when the cell is dragging', () => {
        component = shallow(<DraggableQbHeaderCell {...props} label={'Hello'} labelBeingDragged={'Hello'} />);

        expect(component).toHaveClassName('qbHeaderCell isDraggable');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });
});
