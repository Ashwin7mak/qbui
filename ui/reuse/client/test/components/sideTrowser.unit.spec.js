import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import SideTrowserBase from '../../src/components/sideTrowser/sideTrowserBase';
import SideMenuBase from '../../src/components/reSideMenu/reSideMenuBase';

let component;

describe('SideTrowserBase', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a SideMenuBase with options for SideTrowser styling', () => {
        component = shallow(<SideTrowserBase sideMenuContent="test" />);

        let sideMenu = component.find(SideMenuBase);
        expect(sideMenu).toBePresent();
        expect(sideMenu).toHaveProp('baseClass', 'sideTrowser');
        expect(sideMenu).toHaveProp('sideMenuContent', 'test');
    });
});
