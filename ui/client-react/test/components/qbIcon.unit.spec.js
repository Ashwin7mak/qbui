import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import QbIcon, {AVAILABLE_FONTS} from '../../src/components/qbIcon/qbIcon';

let component;

describe('QbIcon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the default font set', () => {
        component = shallow(<QbIcon icon="pencil" />);

        expect(component.find(`.${AVAILABLE_FONTS.DEFAULT}-pencil`)).toBePresent();
    });

    it('renders an icon from a different font set', () => {
        component = shallow(<QbIcon iconFont={AVAILABLE_FONTS.TABLE_STURDY} icon="Dimensions"/>);

        expect(component.find(`.${AVAILABLE_FONTS.TABLE_STURDY}-Dimensions`)).toBePresent();
    });
});
