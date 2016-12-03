import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {Nav, __RewireAPI__ as NavRewireAPI} from '../../src/components/nav/nav';

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
    let reportsStore = Fluxxor.createStore({
        getState: function() {
            return {list: []};
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
    let formStore = Fluxxor.createStore({
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
        ReportsStore: new reportsStore(),
        ReportDataStore: new reportDataStore(),
        RecordPendingEditsStore: new recordPendingEditsStore(),
        FieldsStore : new fieldsStore(),
        FormStore : new formStore(),
        ReportDataSearchStore: new reportDataSearchStore()
    };
    let flux = new Fluxxor.Flux(stores);
    flux.addActions({
        toggleLeftNav() {
            return;
        }
    });


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

        component = TestUtils.renderIntoDocument(<Nav flux={flux}></Nav>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test renders large by default', () => {
        component = TestUtils.renderIntoDocument(<Nav flux={flux}></Nav>);
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
                return <Nav ref="nav" flux={flux}></Nav>;
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
            ReportsStore: new reportsStore(),
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            FormStore : new formStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };
        let fluxWithAdminApp = new Fluxxor.Flux(storesWithAdminApp);

        component = TestUtils.renderIntoDocument(<Nav flux={fluxWithAdminApp}></Nav>);
        expect(TestUtils.scryRenderedComponentsWithType(component, V2V3FooterMock).length).toEqual(1);
    });

    it('test omits v2v3 footer for non-admins with v3 app(s)', () => {
        let storesWithV3App = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithV3App(),  // has an app with openInV3 = true
            ReportsStore: new reportsStore(),
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            FormStore : new formStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };
        let fluxWithV3App = new Fluxxor.Flux(storesWithV3App);
        component = TestUtils.renderIntoDocument(<Nav flux={fluxWithV3App}></Nav>);
        expect(TestUtils.scryRenderedComponentsWithType(component, V2V3FooterMock).length).toEqual(0);
    });

    it('test redirects non-admins with no v3 apps', () => {

        let storesWithoutV3App = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithoutV3App(),  // no admin rights and has no app with openInV3 = true
            ReportsStore: new reportsStore(),
            ReportDataStore: new reportDataStore(),
            RecordPendingEditsStore: new recordPendingEditsStore(),
            FieldsStore : new fieldsStore(),
            FormStore : new formStore(),
            ReportDataSearchStore: new reportDataSearchStore()
        };
        let fluxWithoutV3App = new Fluxxor.Flux(storesWithoutV3App);

        spyOn(WindowLocationUtilsMock, 'update');

        component = TestUtils.renderIntoDocument(<Nav flux={fluxWithoutV3App}></Nav>);

        expect(WindowLocationUtilsMock.update).toHaveBeenCalledWith("/qbase/pageNotFound");
    });


});
