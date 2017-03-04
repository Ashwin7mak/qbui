import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import * as ShellActions from '../../src/actions/shellActions';
import {Nav,  __RewireAPI__ as NavRewireAPI} from '../../src/components/nav/nav';


let smallBreakpoint = false;
class BreakpointsMock {
    static isSmallBreakpoint() {
        return smallBreakpoint;
    }
}
let dispatchMethod = () => { };

//mock the actions so we can spy on them
//and rewire nav to use the mock
let ShellActionsMock = {
    toggleLeftNav : function() {
        ShellActions.toggleLeftNav();
    },
    showTrowser : function showTrowser() {
        ShellActions.showTrowser();
    },
    hideTrowser : function hideTrowser() {
        ShellActions.hideTrowser();
    },
    toggleAppsList : function toggleAppsList() {
        ShellActions.toggleAppsList();
    }
};

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



class WindowLocationUtilsMock {
    static update(url) { }
}


describe('Nav', () => {
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
    let appsStoreWithV3App = Fluxxor.createStore({
        getState: function() {
            return {apps: [{id:"1"}], selectedAppId: "1"};
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
        NavRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);
    });

    afterEach(() => {
        NavRewireAPI.__ResetDependency__('LeftNav');
        NavRewireAPI.__ResetDependency__('RecordTrowser');
        NavRewireAPI.__ResetDependency__('ReportManagerTrowser');
        NavRewireAPI.__ResetDependency__('TopNav');
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

    it('renders the loading screen while no apps are loaded', () => {
        let storesWithoutApps = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithNoApps(),
            ReportDataStore: new reportDataStore(),
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
        spyOn(ShellActionsMock, "toggleLeftNav");

        NavRewireAPI.__Rewire__('ShellActions', ShellActionsMock);
        NavRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);

        component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux} dispatch={dispatchMethod}></Nav>);
        component.onSelectItem();

        expect(ShellActionsMock.toggleLeftNav).toHaveBeenCalled();
        NavRewireAPI.__ResetDependency__('Breakpoints');
        NavRewireAPI.__ResetDependency__('ShellActions');
        ShellActionsMock.toggleLeftNav.calls.reset();
    });

    it('test toggleNav method', () => {
        spyOn(ShellActionsMock, "toggleLeftNav");
        NavRewireAPI.__Rewire__('ShellActions', ShellActionsMock);

        component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux} dispatch={dispatchMethod}></Nav>);
        component.toggleNav();

        expect(ShellActionsMock.toggleLeftNav).toHaveBeenCalled();
        NavRewireAPI.__ResetDependency__('ShellActions');
        ShellActionsMock.toggleLeftNav.calls.reset();
    });

    describe('navigateToBuilder function', () => {
        it('renders a component without form type or form id', () => {
            let routeParams = {appId: 1, tblId: 2};
            let router = [];
            let expectedRouter = [];

            component = TestUtils.renderIntoDocument(<Nav params={routeParams} {...props} flux={flux} router={router}
                                                          dispatch={dispatchMethod}></Nav>);
            component.navigateToBuilder();

            expectedRouter.push('/qbase/builder/app/1/table/2/form');

            expect(router).toEqual(expectedRouter);
        });

        it('renders a component with a form type', () => {
            let routeParams = {appId: 1, tblId: 2};
            props = {
                qbui: {
                    forms: [{id: 'view'}],
                    shell: {
                        leftNavVisible: true,
                        leftNavExpanded: false
                    },
                    reports: []
                }
            };
            let router = [];
            let expectedRouter = [];

            component = TestUtils.renderIntoDocument(<Nav params={routeParams} {...props} flux={flux} router={router}
                                                          dispatch={dispatchMethod}></Nav>);

            component.navigateToBuilder();

            expectedRouter.push('/qbase/builder/app/1/table/2/form?formType=view');

            expect(router).toEqual(expectedRouter);
        });
    });
});
