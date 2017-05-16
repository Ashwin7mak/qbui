import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TabbedSideNav from 'REUSE/components/sideNavs/tabbedSideMenu';

let component;
let instance;

describe('tabbedSideMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        //
    });

    afterEach(() => {
        //
    });

    it('does something', () => {
        component = shallow(<TabbedSideNav/>);
        instance = component.instance();
    });
});