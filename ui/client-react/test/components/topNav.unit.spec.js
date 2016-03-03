import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import TopNav from '../../src/components/header/topNav';
import {MenuItem, OverlayTrigger} from 'react-bootstrap';
import _ from 'lodash';
import Locale from '../../src/locales/locales';

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

    let globalActions = [
        {msg: 'globalActions.user', link: '/user', icon: 'user'},
        {msg: 'globalActions.help', link: '/help', icon: 'help'}
    ];
    let component;

    let navStore = Fluxxor.createStore({
        getState: function() {
            return {leftNavOpen: true};
        }
    });

    let stores = {
        NavStore: new navStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.addActions({
        showTrowser: function() {
            return;
        },
        changeLocale: function(locale) {
            return;
        },
        searchFor: function(text) {
            return;
        }
    });

    beforeEach(() => {
        TopNav.__Rewire__('I18nMessage', I18nMessageMock);
        TopNav.__Rewire__('CurrentDate', CurrentDateMock);
        component = TestUtils.renderIntoDocument(<TopNav flux={flux} globalActions={globalActions}/>);
        spyOn(flux.actions, 'showTrowser');
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
        var menuItems = TestUtils.scryRenderedDOMComponentsWithClass(component, "localeLink");
        var localeMenuItems = Locale.getSupportedLocales();
        expect(menuItems.length).toBe(localeMenuItems.length);

        //  test with zero supported locales
        var LocaleMock = {
            getSupportedLocales: () => {
                return [];
            },
            getMessage: () => {
                return "";
            }
        };
        TopNav.__Rewire__('Locale', LocaleMock);
        var noLocaleComponent = TestUtils.renderIntoDocument(<TopNav flux={flux}/>);
        menuItems = TestUtils.scryRenderedDOMComponentsWithClass(noLocaleComponent, "localeLink");
        expect(menuItems.length).toBe(0);
        TopNav.__ResetDependency__('Locale');
    });

    it('test changes locale on selecting menu item', () => {
        var localeMenuOptions = TestUtils.scryRenderedDOMComponentsWithClass(component, "localeLink");

        let localeoption = ReactDOM.findDOMNode(localeMenuOptions[1]);
        localeoption = localeoption.querySelector("a"); //get to the element that registers click event for change of locale.
        TestUtils.Simulate.click(localeoption);
        expect(flux.actions.changeLocale).toHaveBeenCalledWith(localeoption.title);
    });

    it('test search on change of searchtext', () => {
        let searchInputContainer = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconssturdy-search");
        expect(searchInputContainer.length).toEqual(1);
        TestUtils.Simulate.click(searchInputContainer[0]);

        let searchInputBox = document.querySelector(".searchPopover .searchInput");
        searchInputBox.value = "value";
        TestUtils.Simulate.change(searchInputBox);
        expect(flux.actions.searchFor).toHaveBeenCalledWith(searchInputBox.value);
    });

});
