import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import * as ShellActions from '../../src/actions/shellActions';
import {Nav,  __RewireAPI__ as NavRewireAPI} from '../../src/components/nav/nav';
import {mount, shallow} from 'enzyme';

let smallBreakpoint = false;
class BreakpointsMock {
    static isSmallBreakpoint() {
        return smallBreakpoint;
    }
}

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
        return <div className="topNav">mock top nav</div>;
    }
});

class WindowLocationUtilsMock {
    static update(url) { }
}


describe('Nav', () => {
    'use strict';

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

    let stores = {
        NavStore: new navStore(),
        AppsStore: new appsStore()
    };
    let flux = new Fluxxor.Flux(stores);

    let props = {
        toggleAppsList: (state) => {},
        toggleLeftNav: (state) => {},
        hideTrowser: () => {},
        showTrowser: (content) => {},
        loadForm: (app, tbl, rpt, type, edit, show) => {},
        loadReports: (ctx, app, tbl) => {},
        fields: [],
        record: [],
        report: [],
        params: {
            appId: '1',
            tblId: '2',
            recordId: '3'
        },
        forms: [{id: 'view'}],
        shell: {
            leftNavVisible: true,
            leftNavExpanded: false
        },
        reports: [],
        router: []
    };

    beforeEach(() => {
        spyOn(props, 'toggleAppsList').and.callThrough();
        spyOn(props, 'toggleLeftNav').and.callThrough();
        spyOn(props, 'hideTrowser').and.callThrough();
        spyOn(props, 'showTrowser').and.callThrough();
        spyOn(props, 'loadForm').and.callThrough();
        spyOn(props, 'loadReports').and.callThrough();
        NavRewireAPI.__Rewire__('LeftNav', LeftNavMock);
        NavRewireAPI.__Rewire__('RecordTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('ReportManagerTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('TopNav', TopNavMock);
        NavRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);
    });

    afterEach(() => {
        props.toggleAppsList.calls.reset();
        props.toggleLeftNav.calls.reset();
        props.hideTrowser.calls.reset();
        props.showTrowser.calls.reset();
        props.loadForm.calls.reset();
        props.loadReports.calls.reset();
        NavRewireAPI.__ResetDependency__('LeftNav');
        NavRewireAPI.__ResetDependency__('RecordTrowser');
        NavRewireAPI.__ResetDependency__('ReportManagerTrowser');
        NavRewireAPI.__ResetDependency__('TopNav');
        NavRewireAPI.__ResetDependency__('WindowLocationUtils');
    });

    it('test render of component', () => {
        let component = shallow(<Nav {...props} flux={flux}></Nav>);
        expect(component).toBeDefined();
    });

    it('test renders large by default', () => {
        let component = mount(<Nav {...props} flux={flux}></Nav>);
        let leftNav = component.find('.leftMenu');
        expect(leftNav.length).toBe(1);
        let topNav = component.find('.topNav');
        expect(topNav.length).toBe(1);
    });

    it('renders the loading screen while no apps are loaded', () => {
        let storesWithoutApps = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithNoApps()
        };

        let fluxWithoutApps = new Fluxxor.Flux(storesWithoutApps);
        let component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithoutApps} />);
        let domComponent = ReactDOM.findDOMNode(component);

        let loadingScreen = domComponent.querySelector('.loadingScreen');
        let leftMenu = domComponent.querySelector('.leftMenu');

        expect(loadingScreen).not.toBeNull();
        expect(leftMenu).toBeNull();
    });

    it('does not render the loading screen if apps are loaded', () => {
        let storesWithApps = {
            NavStore: new navStore(),
            AppsStore: new appsStoreWithV3App()
        };

        let fluxWithApps = new Fluxxor.Flux(storesWithApps);
        let component = TestUtils.renderIntoDocument(<Nav {...props} flux={fluxWithApps} />);

        let domComponent = ReactDOM.findDOMNode(component);
        let loadingScreen = domComponent.querySelector('.loadingScreen');
        let leftMenu = domComponent.querySelector('.leftMenu');

        expect(loadingScreen).toBeNull();
        expect(leftMenu).not.toBeNull();
    });

    it('test onSelectItem method on small breakpoint', () => {
        NavRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);
        smallBreakpoint = true;

        let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
        component.onSelectItem();
        expect(props.toggleLeftNav).toHaveBeenCalled();

        NavRewireAPI.__ResetDependency__('Breakpoints');
    });

    it('test toggleNav method', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
        component.toggleNav();
        expect(props.toggleLeftNav).toHaveBeenCalled();
    });

    it('test onSelectTableReports method', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
        component.onSelectTableReports();
        expect(props.showTrowser).toHaveBeenCalled();
        expect(props.loadReports).toHaveBeenCalled();
    });

    it('test hideTrowser method', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
        component.hideTrowser();
        expect(props.hideTrowser).toHaveBeenCalled();
    });

    it('test toggle apps list method', () => {
        let testCases = [
            {name:'leftNav is expanded', expanded: true},
            {name:'leftNav is collapsed', expanded: false}
        ];
        testCases.forEach(testCase => {
            props.shell.leftNavExpanded = testCase.expanded;
            let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
            component.toggleAppsList(testCase.expanded);
            if (testCase.expanded) {
                expect(props.toggleAppsList(testCase.expanded));
            } else {
                expect(props.toggleAppsList(true));
                expect(props.toggleLeftNav(true));
            }
        });
    });

    describe('navigateToBuilder function', () => {
        it('renders a component without form type or form id', () => {
            let expectedRouter = ['/qbase/builder/app/1/table/2/form'];
            props.forms = [];
            props.router = [];

            let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
            component.navigateToBuilder();

            expect(props.router).toEqual(expectedRouter);
        });

        it('renders a component with a form type', () => {
            let expectedRouter = ['/qbase/builder/app/1/table/2/form?formType=view'];
            props.forms = [{id: 'view'}];
            props.router = [];

            let component = TestUtils.renderIntoDocument(<Nav {...props} flux={flux}></Nav>);
            component.navigateToBuilder();

            expect(props.router).toEqual(expectedRouter);
        });
    });
});
