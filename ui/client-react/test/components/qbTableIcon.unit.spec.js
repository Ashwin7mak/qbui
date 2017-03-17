import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AVAILABLE_ICON_FONTS from '../../src/constants/iconConstants';
import TableIcon  from '../../src/components/qbTableIcon/qbTableIcon';

/**
 * This component is replaced by the component "Icon" in the reuse library.
 * This test is only to verify that this stub class is working.
 */

let component;

fdescribe('TableIcon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the table font set', () => {
        let iconName = AVAILABLE_ICON_FONTS.TABLE_STURDY + "-dots";

        component = mount(<TableIcon icon={iconName} />);

        expect(component.find(`.${iconName}`)).toBePresent();
    });
});
