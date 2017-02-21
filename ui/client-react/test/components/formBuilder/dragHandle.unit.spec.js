import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import DragHandle from '../../../src/components/formBuilder/dragHandle/dragHandle';

let component;

describe('DragHandle', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a drag handle', () => {
        component = shallow(<DragHandle/>);
        expect(component.find('.dragHandle')).toBePresent();
    });
});

