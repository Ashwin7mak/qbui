import React from 'react';
import {shallow, mount} from 'enzyme';
import Drawer from '../../../src/components/drawer/drawer';


describe('Drawer functions ', () => {
    'use strict';

    let props = {
        className: 'randomClassName',
        onMount: () => {},
        onUnmount: () => {}
    };

    beforeEach(() => {
        spyOn(props, 'onMount');
        spyOn(props, 'onUnmount');
    });

    it('renders basic drawer', () => {
        let drawerWrapper = shallow(<Drawer {...props}/>);
        let drawer = drawerWrapper.find('.drawer');
        expect(drawer.length).toBe(1);
    });

    it('calls onMount and onUnMount', () => {
        let drawerWrapper = shallow(<Drawer {...props}/>);
        let drawer = drawerWrapper.find('.drawer');
        expect(props.onMount).toHaveBeenCalled();
        drawerWrapper.unmount();
        expect(props.onUnmount).toHaveBeenCalled();
    });

    it('renders any children', () => {
        let drawerWrapper = mount(<Drawer {...props}><div className="aChild">goes here</div><div className="otherChild">ok</div></Drawer>);
        let aChild = drawerWrapper.find('.aChild');
        expect(aChild.length).toBe(1);
        let otherChild = drawerWrapper.find('.otherChild');
        expect(otherChild.length).toBe(1);
    });

    it('uses className prop', () => {
        let drawerWrapper = shallow(<Drawer {...props} className="randomClassName aBlueOne"/>);
        let byClassName = drawerWrapper.find('.randomClassName');
        expect(byClassName.length).toBe(1);
        let blueClassName = drawerWrapper.find('.aBlueOne');
        expect(blueClassName.length).toBe(1);
    });

});
