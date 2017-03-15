import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AVAILABLE_ICON_FONTS from '../../src/constants/iconConstants';

import QbIcon from '../../src/components/qbIcon/qbIcon';

/**
 * This component is relocated to the reuse library and renamed "ReIcon".
 * This test is only to verify that this stub class is working.
 * Unit test for the actual code is in the reuse library.
 */

let component;

describe('QbIcon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the default font set', () => {
        component = shallow(<QbIcon icon="pencil" />);

        expect(component.find(`.${AVAILABLE_ICON_FONTS.DEFAULT}-pencil`)).toBePresent();
    });
});
