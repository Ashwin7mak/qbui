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

    it('test render of drawer', () => {
        let drawerWrapper = shallow(<Drawer {...props}/>);
        let drawer = drawerWrapper.find('.drawer');
        expect(drawer.length).toBe(1);
    });

    it('test that onMount and onUnMount are called', () => {
        let drawerWrapper = shallow(<Drawer {...props}/>);
        let drawer = drawerWrapper.find('.drawer');
        expect(props.onMount).toHaveBeenCalled();
        drawerWrapper.unmount();
        expect(props.onUnmount).toHaveBeenCalled();
    });

});
