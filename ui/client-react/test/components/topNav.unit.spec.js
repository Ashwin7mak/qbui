import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import TopNav from '../../src/components/header/topNav';
import {MenuItem, OverlayTrigger} from 'react-bootstrap';
import _ from 'lodash';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>test</div>
        );
    }
});

var CurrentDateMock = React.createClass({
    render: function() {
        return (
            <div>date</div>
        );
    }
});

describe('TopNav functions', () => {
    'use strict';

    var component;
    let flux = {
        actions:{
            toggleLeftNav: function() {return;},
            showTrouser: function() {return;},
            changeLocale: function(locale) {return;},
            searchFor: function(text) {return;}
        }
    };

    beforeEach(() => {
        TopNav.__Rewire__('I18nMessage', I18nMessageMock);
        TopNav.__Rewire__('CurrentDate', CurrentDateMock);
        component = TestUtils.renderIntoDocument(<TopNav flux={flux}/>);
        spyOn(flux.actions, 'toggleLeftNav');
        spyOn(flux.actions, 'showTrouser');
        spyOn(flux.actions, 'changeLocale');
        spyOn(flux.actions, 'searchFor');
    });

    afterEach(() => {
        TopNav.__ResetDependency__('I18nMessage');
        TopNav.__ResetDependency__('CurrentDate');
    });

    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test renders all locale menu options', () => {
        var menuItems = TestUtils.scryRenderedComponentsWithType(component, MenuItem);
        expect(menuItems.length).toBeGreaterThan(4); //3 locales
    });

    it('test toggles nav on hamburger click', () => {
        let toggleNavButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "toggleNavButton");
        expect(toggleNavButton.length).toEqual(1);
        TestUtils.Simulate.click(toggleNavButton[0]);
        expect(flux.actions.toggleLeftNav).toHaveBeenCalled();
    });

    it('test shows trouser on addNew button click', () => {
        let addNewButton = TestUtils.scryRenderedDOMComponentsWithClass(component, "addNewButton");
        expect(addNewButton.length).toEqual(1);
        TestUtils.Simulate.click(addNewButton[0]);
        expect(flux.actions.showTrouser).toHaveBeenCalled();
    });

    it('test changes locale on selecting menu item', () => {
        var localeMenuOptions = TestUtils.scryRenderedDOMComponentsWithClass(component, "localeLink");

        /*var newlocaleMenuOptions = localeMenuOptions.filter((option) => {
            return ReactDOM.findDOMNode(option).className == "localeLink";
        });*/

        //let localoption = ReactDOM.findDOMNode(newlocaleMenuOptions[1]);
        TestUtils.Simulate.click(localeMenuOptions[1]);
        expect(flux.actions.changeLocale).toHaveBeenCalledWith("");
    });

    it('test search on change of searchtext', () => {
        let searchInputContainer = TestUtils.scryRenderedDOMComponentsWithClass(component, "glyphicon-search");
        expect(searchInputContainer.length).toEqual(1);
        TestUtils.Simulate.click(searchInputContainer[0]);

        let searchInputBox = document.querySelector(".searchInputBox");
        searchInputBox.value = "value";
        TestUtils.Simulate.change(searchInputBox);
        expect(flux.actions.searchFor).toHaveBeenCalledWith(searchInputBox.value);
    });


});
