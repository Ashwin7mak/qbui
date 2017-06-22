import React, {PropTypes} from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {QbCell} from '../../../src/components/dataTable/qbGrid/qbCell';

let component;
const label = 'label';
const labelBeingDraggedSame = 'label';
const labelBeingDraggedDiff = 'labelBeingDragged';

describe('QbCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a cell', () => {
        component = shallow(<QbCell label={label} />);

        expect(component).toHaveClassName('qbCell');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a sticky cell', () => {
        component = shallow(<QbCell label={label} isStickyCell={true} />);

        expect(component).toHaveClassName('qbCell');
        expect(component).toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a placeholder cell when isPlaceholderCell prop is true', () => {
        component = shallow(<QbCell label={label} isPlaceholderCell={true} />);
        expect(component).toHaveClassName('qbCell');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });

    it('renders a placeholder cell when label is being dragged', () => {
        component = shallow(<QbCell label={label} labelBeingDragged={labelBeingDraggedSame} />);
        expect(component).toHaveClassName('qbCell');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });

    it('renders a non-placeholder cell when label a different label is being dragged', () => {
        component = shallow(<QbCell label={label} labelBeingDragged={labelBeingDraggedDiff} />);
        expect(component).toHaveClassName('qbCell');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a non-placeholder cell after the label has been dragged to a new column', () => {
        component = shallow(<QbCell label={label} labelBeingDragged={labelBeingDraggedSame} />);

        expect(component).toHaveClassName('qbCell');
        expect(component).toHaveClassName('placeholderCell');

        component.setProps({labelBeingDragged: labelBeingDraggedDiff});

        expect(component).toHaveClassName('qbCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });
});
