import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AVAILABLE_ICON_FONTS from '../../src/constants/iconConstants';

import QbIcon from '../../src/components/qbIcon/qbIcon';

let component;

describe('QbIcon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the default font set', () => {
        component = shallow(<QbIcon icon="pencil" />);

        expect(component.find(`.${AVAILABLE_ICON_FONTS.DEFAULT}-pencil`)).toBePresent();
    });

    it('renders an icon from a different font set', () => {
        component = shallow(<QbIcon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/>);

        expect(component.find(`.${AVAILABLE_ICON_FONTS.TABLE_STURDY}-Dimensions`)).toBePresent();
    });
});
