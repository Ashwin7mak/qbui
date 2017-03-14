import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import ReIcon, {RE_AVAILABLE_ICON_FONTS} from '../../src/components/reIcon/reIcon';

let component;

describe('ReIcon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the default font set', () => {
        component = shallow(<ReIcon icon="pencil" />);

        expect(component.find(`.${RE_AVAILABLE_ICON_FONTS.DEFAULT}-pencil`)).toBePresent();
    });

    it('renders an icon from a different font set', () => {
        component = shallow(<ReIcon iconFont={RE_AVAILABLE_ICON_FONTS.TABLE_STURDY} icon="Dimensions"/>);

        expect(component.find(`.${RE_AVAILABLE_ICON_FONTS.TABLE_STURDY}-Dimensions`)).toBePresent();
    });
});
