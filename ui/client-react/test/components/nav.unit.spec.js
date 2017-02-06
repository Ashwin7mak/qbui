import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {Nav, __RewireAPI__ as NavRewireAPI} from '../../src/components/nav/nav';
import * as ShellActions from '../../src/actions/shellActions';

let smallBreakpoint = false;
class BreakpointsMock {
    static isSmallBreakpoint() {
        return smallBreakpoint;
    }
}
let dispatchMethod = () => { };

var LeftNavMock = React.createClass({
    render() {
        return <div className="leftMenu"><a className="leftNavLink" onClick={() => this.props.onSelect()}>mock left
            nav</a></div>;
    }
});

var TrowserMock = React.createClass({
    render() {
        return <div>mock trowser</div>;
    }
});
var TopNavMock = React.createClass({
    render() {
        return <div>mock top nav</div>;
    }
});
var V2V3FooterMock = React.createClass({
    render() {
        return <div>mock v2 v3 admin toggle</div>;
    }
});

class WindowLocationUtilsMock {
    static update(url) { }
}


describe('Nav functions', () => {
    'use strict';

    var component;
    let navStore = Fluxxor.createStore({
        getState: function() {
            return {leftNavOpen: true};
        }
    });
    let appsStore = Fluxxor.createStore({
        getState: function() {
            return {};
        }
    });
    let appsStoreWithAdminApp = Fluxxor.createStore({
        getState: function() {
            return {apps: [{id:"1", accessRights: {appRights: ["EDIT_SCHEMA"]}}], selectedAppId: "1"};
        }
    });
    let appsStoreWithV3App = Fluxxor.createStore({
        getState: function() {
            return {apps: [{id:"1", openInV3: true}], selectedAppId: "1"};
        }
    });
    let appsStoreWithoutV3App = Fluxxor.createStore({
        getState: function() {
            return {apps: [{id:"1", openInV3: false}], selectedAppId: "1"};
        }
    });
    let appsStoreWithNoApps = Fluxxor.createStore({
        getState: function() {
            return {apps: null};
        }
    });
    let reportDataStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let recordPendingEditsStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let fieldsStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });

    let reportDataSearchStore = Fluxxor.createStore({
        getState: function() {
            return [];
        }
    });
    let stores = {
        NavStore: new navStore(),
        AppsStore: new appsStore(),
        ReportDataStore: new reportDataStore(),
        RecordPendingEditsStore: new recordPendingEditsStore(),
        FieldsStore : new fieldsStore(),
        ReportDataSearchStore: new reportDataSearchStore()
    };
    let flux = new Fluxxor.Flux(stores);
    let props = {
        qbui: {
            shell: {
                leftNavVisible: true,
                leftNavExpanded: false
            },
            reports: []
        }
    };

    beforeEach(() => {
        NavRewireAPI.__Rewire__('LeftNav', LeftNavMock);
        NavRewireAPI.__Rewire__('RecordTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('ReportManagerTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('TopNav', TopNavMock);
        NavRewireAPI.__Rewire__('V2V3Footer', V2V3FooterMock);
        NavRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);
    });

    afterEach(() => {
        NavRewireAPI.__ResetDependency__('LeftNav');
        NavRewireAPI.__ResetDependency__('RecordTrowser');
        NavRewireAPI.__ResetDependency__('ReportManagerTrowser');
        NavRewireAPI.__ResetDependency__('TopNav');
        NavRewireAPI.__ResetDependency__('V2V3Footer');
        NavRewireAPI.__ResetDependency__('WindowLocationUtils');
    });

    it('test render of component', () => {
        let MainComponent = React.createClass({
            render: function() {
                return (
                    <div>main component</div>
                );
            }
        });

        component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test renders large by default', () => {
        component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
        expect(TestUtils.scryRenderedComponentsWithType(component, LeftNavMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TopNavMock).length).toEqual(1);
    });

    it('test renders small based on break point', () => {
        var TestParent = React.createFactory(React.createClass({

            childContextTypes: {
                touch: React.PropTypes.bool
            },
            getChildContext: function() {
                return {touch: true};
            },
            render() {
                return <Nav {...props} ref="nav" flux={flux} dispatch={dispatchMethod}></Nav>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());

        component = parent.refs.nav;

        expect(TestUtils.scryRenderedComponentsWithType(component, LeftNavMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TopNavMock).length).toEqual(1);

        let leftLink = TestUtils.findRenderedDOMComponentWithClass(component, "leftNavLink");
        TestUtils.Simulate.click(leftLink);
    });

    it('test renders v2v3 footer for admins', () => {
        let storesWithAdminApp = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithAdminApp(), // has an app with admin access (EDIT_SCHEMA)
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };
        let fluxWithAdminApp = new Fluxxor.Flux(storesWithAdminApp);

        component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithAdminApp}></Nav>);
        expect(TestUtils.scryRenderedComponentsWithType(component, V2V3FooterMock).length).toEqual(1);
    });

    it('test omits v2v3 footer for non-admins with v3 app(s)', () => {
        let storesWithV3App = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithV3App(),  // has an app with openInV3 = true
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };
        let fluxWithV3App = new Fluxxor.Flux(storesWithV3App);
        component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithV3App}></Nav>);
        expect(TestUtils.scryRenderedComponentsWithType(component, V2V3FooterMock).length).toEqual(0);
    });

    it('test redirects non-admins with no v3 apps', () => {

        let storesWithoutV3App = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithoutV3App(),  // no admin rights and has no app with openInV3 = true
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };
        let fluxWithoutV3App = new Fluxxor.Flux(storesWithoutV3App);

        spyOn(WindowLocationUtilsMock, 'update');

        component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithoutV3App}></Nav>);

        expect(WindowLocationUtilsMock.update).toHaveBeenCalledWith("/qbase/notAvailable?appId=1");
    });

    it('renders the loading screen while no apps are loaded', () => {
        let storesWithoutApps = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithNoApps(),
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };

        let fluxWithoutApps = new Fluxxor.Flux(storesWithoutApps);
        component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithoutApps} />);

        let domComponent = ReactDOM.findDOMNode(component);
        let loadingScreen = domComponent.querySelector('.loadingScreen');
        let leftMenu = domComponent.querySelector('.leftMenu');

        expect(loadingScreen).not.toBeNull();
        // Left Menu is an element that is not on the loading screen, but is on the final nav screen
        expect(leftMenu).toBeNull();
    });

    it('does not render the loading screen if apps are loaded', () => {
        let storesWithApps = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithV3App(),
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };

        let fluxWithApps = new Fluxxor.Flux(storesWithApps);
        component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithApps} />);

        let domComponent = ReactDOM.findDOMNode(component);
        let loadingScreen = domComponent.querySelector('.loadingScreen');
        let leftMenu = domComponent.querySelector('.leftMenu');

        expect(loadingScreen).toBeNull();
        // Left Menu is an element that is not on the loading screen, but is on the final nav screen
        expect(leftMenu).not.toBeNull();
    });

    it('test onSelectItem method', () => {
        smallBreakpoint = true;
        NavRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);

        spyOn(ShellActions, "toggleLeftNav");
        component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux} dispatch={dispatchMethod}></Nav>);
        component.onSelectItem();
        expect(ShellActions.toggleLeftNav).toHaveBeenCalled();
        ShellActions.__ResetDependency__('Breakpoints');
    });

    it('test toggleNav method', () => {
        spyOn(ShellActions, "toggleLeftNav");
        component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux} dispatch={dispatchMethod}></Nav>);
        component.toggleNav();
        expect(ShellActions.toggleLeftNav).toHaveBeenCalled();
    });
});
