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

    it('renders an icon using a CSS class', () => {
        let cssClassName = AVAILABLE_ICON_FONTS.TABLE_STURDY + "-dots";
        component = mount(<TableIcon icon={cssClassName} />);
        expect(component.find(`.${cssClassName}`)).toBePresent();
    });

    // As a bonus, by using an embedded Icon component, previously invalid input could render
    // an icon that didn't before. The Icon component supports a default font.
    // If you pass in a CSS class name to the TableIcon component that happens to match
    // the name of an icon in the UI font, it will display. We don't encourage
    // use of this new function.
    it('renders invalid input that happens to match the name of an icon in the UI font', () => {
        let iconName = "hamburger";
        let className = AVAILABLE_ICON_FONTS.UI_STURDY + "-" + iconName;
        component = mount(<TableIcon icon={iconName} />);
        expect(component.find(`.${className}`)).toBePresent();
    });

});
