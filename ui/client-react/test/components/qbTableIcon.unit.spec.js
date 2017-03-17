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

describe('TableIcon', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders an icon from the table font set', () => {
        let iconName = AVAILABLE_ICON_FONTS.TABLE_STURDY + "-dots";
        component = mount(<TableIcon icon={iconName} />);
        expect(component.find(`.${iconName}`)).toBePresent();
    });

    // This test is to see what happens when invalid data is passed in.
    // With the old TableIcon component, passing in "invalidData" would result
    // in class="qbIcon invalidData" being written into the DOM. With this new component
    // using the Icon component under the covers, passing in "invalidData" results
    // in class="qbIcon iconTableUISturdy-invalidData".
    it('renders an invalid icon', () => {
        let iconName = "invalidDataGoesHere";
        let className = AVAILABLE_ICON_FONTS.UI_STURDY + "-" + iconName;
        component = mount(<TableIcon icon={iconName} />);
        expect(component.find(`.${className}`)).toBePresent();
    });

});
