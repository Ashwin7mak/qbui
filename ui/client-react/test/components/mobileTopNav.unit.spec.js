import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import TopNav from '../../src/components/header/mobileTopNav';
import MobileSearchBar from '../../src/components/search/mobileSearchBar';
import _ from 'lodash';


var MobileSearchBarMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});


describe('Mobile TopNav functions', () => {
    'use strict';

    var component;
    let flux = {
        actions:{
            toggleLeftNav: function() {return;},
            toggleSearch: function() {return;},
        }
    };

    beforeEach(() => {
        TopNav.__Rewire__('MobileSearchBar', MobileSearchBarMock);
        component = TestUtils.renderIntoDocument(<TopNav title="nav title" flux={flux}/>);
        spyOn(flux.actions, 'toggleLeftNav');
        spyOn(flux.actions, 'toggleSearch');
    });

    afterEach(() => {
        TopNav.__ResetDependency__('MobileSearchBar');
    });

    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test toggles nav on hamburger click', () => {
        let navToggleButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "navToggleButton");
        expect(navToggleButton.length).toEqual(1);
        TestUtils.Simulate.click(navToggleButton[0]);
        expect(flux.actions.toggleLeftNav).toHaveBeenCalled();
    });

    it('test shows title', () => {
        let navTitle = TestUtils.scryRenderedDOMComponentsWithClass(component, "navTitle");
        expect(navTitle.length).toEqual(1);
        expect(ReactDOM.findDOMNode(navTitle[0]).textContent).toBe("nav title");
    });

    it('test opens search on icon click', () => {
        let toggleSearchButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "toggleSearchButton");
        expect(toggleSearchButton.length).toEqual(1);
        TestUtils.Simulate.click(toggleSearchButton[0]);
        expect(flux.actions.toggleSearch).toHaveBeenCalled();
    });


});
