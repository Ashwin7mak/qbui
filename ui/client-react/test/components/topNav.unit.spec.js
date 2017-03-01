import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import TopNav, {__RewireAPI__ as TopNavRewireAPI} from '../../src/components/header/topNav';
import GlobalActions from '../../src/components/actions/globalActions';
import Locale from '../../src/locales/locales';

var CurrentDateMock = React.createClass({
    render: function() {
        return (
            <div>date</div>
        );
    }
});

describe('TopNav functions', () => {
    'use strict';

    let globalActionsData = [
        {msg: 'globalActions.user', link: '/user', icon: 'user'},
        {msg: 'globalActions.help', link: '/help', icon: 'help'}
    ];
    let globalActions = (<GlobalActions actions={globalActionsData} startTabIndex={0}
                           position={"top"}/>);
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
        searchFor: function(text) {
            return;
        },
        changeLocale: function(locale) {
            return;
        },
    });

    beforeEach(() => {
        component = TestUtils.renderIntoDocument(<TopNav flux={flux} globalActions={globalActions}/>);
        spyOn(flux.actions, 'searchFor');
        spyOn(flux.actions, 'changeLocale');
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
        TopNavRewireAPI.__Rewire__('Locale', LocaleMock);
        var noLocaleComponent = TestUtils.renderIntoDocument(<TopNav flux={flux}/>);
        menuItems = TestUtils.scryRenderedDOMComponentsWithClass(noLocaleComponent, "localeLink");
        expect(menuItems.length).toBe(0);
        TopNavRewireAPI.__ResetDependency__('Locale');
    });

    it('test changes locale on selecting menu item', () => {
        var localeMenuOptions = TestUtils.scryRenderedDOMComponentsWithClass(component, "localeLink");

        let localeoption = ReactDOM.findDOMNode(localeMenuOptions[1]);
        localeoption = localeoption.querySelector("a"); //get to the element that registers click event for change of locale.
        TestUtils.Simulate.click(localeoption);
        expect(flux.actions.changeLocale).toHaveBeenCalledWith(localeoption.title);
    });

    it('test global search renders', () => {
        let searchInputContainer = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconTableUISturdy-search");
        expect(searchInputContainer.length).toEqual(1);
    });

});
