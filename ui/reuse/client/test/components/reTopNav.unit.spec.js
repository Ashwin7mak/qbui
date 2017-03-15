import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReTopNav from '../../src/components/reTopNav/reTopNav';
import ReIcon from '../../src/components/reIcon/reIcon';

let component;

describe('ReTopNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('has a left menu icon that can be clicked', () => {
       const mockNavParent = {onNavClick() {}};
       spyOn(mockNavParent, 'onNavClick');

       component = shallow(<ReTopNav onNavClick={mockNavParent.onNavClick} />);

       let menuIcon = component.find('.toggleNavButton');
       expect(menuIcon).toBePresent();

       menuIcon.simulate('click');

       expect(mockNavParent.onNavClick).toHaveBeenCalled();
    });
    
    it('displays a title on small devices (title is hidden through css)', () => {
        const testTitle = 'test title';
        component = shallow(<ReTopNav title={testTitle} />);
        
        expect(component.find('.topTitle')).toHaveText(testTitle);
    });
    
    it('has default actions (favorite and search, disabled) in the center of the nav bar if none are provided', () => {
        // Using mount as the icons are nested inside of other components
        component = mount(<ReTopNav/>);

        let centerIcons = component.find('.center').find(ReIcon);
        expect(centerIcons.at(0)).toHaveProp('icon', 'search');
        expect(centerIcons.at(1)).toHaveProp('icon', 'star-full');
    });
    
    it('can optionally display different elements in the center of the nav bar', () => {
        const testCenterElement = <div className="centerComponent">My center component</div>;
        // Using mount as the icons are nested inside of other components
        component = mount(<ReTopNav centerGlobalActions={testCenterElement}/>);

        expect(component.find('.center').find('.centerComponent')).toBePresent();
        expect(component.find('.center').find(ReIcon)).not.toBePresent();
    });
    
    it('displays actions passed in on the right side of the nav bar', () => {
        const testRightElement = <div className="rightComponent">My right component</div>;
        component = shallow(<ReTopNav globalActions={testRightElement} />);

        expect(component.find('.right').find('.rightComponent')).toBePresent();
    });
});
