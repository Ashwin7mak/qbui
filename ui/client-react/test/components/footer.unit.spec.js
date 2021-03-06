import React from 'react';

import ReactDOM from 'react-dom';
import Footer, {__RewireAPI__ as FooterRewireAPI}  from '../../src/components/footer/footer';
import Nav from '../../../node_modules/react-bootstrap/lib/Nav';
import NavItem from '../../../node_modules/react-bootstrap/lib/NavItem';
import Navbar from '../../../node_modules/react-bootstrap/lib/Navbar';

import TestUtils from 'react-addons-test-utils';

var I18nMessageMock = React.createClass({

    render: function() {
        return (
            <div>test</div>
        );
    }
});


describe('Footer functions', () => {
    'use strict';

    var component;
    beforeEach(() => {
        //var TestUtils = ReactAddons.TestUtils;
        FooterRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        component = TestUtils.renderIntoDocument(<Footer />);
    });

    afterEach(() => {
        FooterRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('test render of footer', () => {
        expect(ReactDOM.findDOMNode(component).textContent).toMatch("test");

    });

    it('test contains Navbar', () => {
        expect(TestUtils.scryRenderedComponentsWithType(component, Navbar).length).toEqual(1);

    });

    it('test contains Nav', () => {
        var _Navbar = TestUtils.scryRenderedComponentsWithType(component, Navbar);
        expect(TestUtils.scryRenderedComponentsWithType(component, Navbar).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(_Navbar[0], Nav).length).toEqual(1);

    });

    it('test contains NavItem', () => {
        var _Nav = TestUtils.scryRenderedComponentsWithType(component, Nav);
        expect(TestUtils.scryRenderedComponentsWithType(component, Nav).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(_Nav[0], NavItem).length).toEqual(1);
    });

});
