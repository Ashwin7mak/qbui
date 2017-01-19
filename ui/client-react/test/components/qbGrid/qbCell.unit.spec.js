import React, {PropTypes} from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import QbCell from '../../../src/components/dataTable/qbGrid/qbCell';

let component;

describe('QbCell', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a cell', () => {
        component = shallow(<QbCell/>);

        expect(component).toHaveClassName('qbCell');
        expect(component).not.toHaveClassName('stickyCell');
    });

    it('renders a sticky cell', () => {
        component = shallow(<QbCell isStickyCell={true} />);

        expect(component).toHaveClassName('qbCell');
        expect(component).toHaveClassName('stickyCell');
    });
});
