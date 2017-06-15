import React, {PropTypes} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import QbHeaderCell from '../../../src/components/dataTable/qbGrid/qbHeaderCell';

let component;

describe('QbHeaderCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a header cell', () => {
        component = shallow(<QbHeaderCell/>);

        expect(component).toHaveClassName('qbHeaderCell');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a sticky header cell', () => {
        component = shallow(<QbHeaderCell isStickyCell={true} />);

        expect(component).toHaveClassName('qbHeaderCell');
        expect(component).toHaveClassName('stickyCell');
        expect(component).not.toHaveClassName('placeholderCell');
    });

    it('renders a placeholder header cell', () => {
        component = shallow(<QbHeaderCell isPlaceholderCell={true} />);

        expect(component).toHaveClassName('qbHeaderCell');
        expect(component).not.toHaveClassName('stickyCell');
        expect(component).toHaveClassName('placeholderCell');
    });
});
