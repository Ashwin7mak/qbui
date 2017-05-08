import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import TopNav from 'REUSE/components/topNav/topNav';
import Icon from 'REUSE/components/icon/icon';

let component;

describe('TopNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a left menu icon that can be clicked', () => {
        const mockNavParent = {onNavClick() {}};
        spyOn(mockNavParent, 'onNavClick');

        component = shallow(<TopNav onNavClick={mockNavParent.onNavClick} />);

        let menuIcon = component.find('.toggleNavButton');
        expect(menuIcon).toBePresent();

        menuIcon.simulate('click');

        expect(mockNavParent.onNavClick).toHaveBeenCalled();
    });

    it('displays a title on small devices (title is hidden through css)', () => {
        const testTitle = 'test title';
        component = shallow(<TopNav title={testTitle} />);

        expect(component.find('.topTitle')).toHaveText(testTitle);
    });

    it('can optionally display elements in the center of the nav bar', () => {
        const testCenterElement = <div className="centerComponent">My center component</div>;
        // Using mount as the icons are nested inside of other components
        component = mount(<TopNav centerGlobalActions={testCenterElement}/>);

        expect(component.find('.center').find('.centerComponent')).toBePresent();
        expect(component.find('.center').find(Icon)).not.toBePresent();
    });

    it('displays actions passed in on the right side of the nav bar', () => {
        const testRightElement = <div className="rightComponent">My right component</div>;
        component = shallow(<TopNav globalActions={testRightElement} />);

        expect(component.find('.right').find('.rightComponent')).toBePresent();
    });
});
