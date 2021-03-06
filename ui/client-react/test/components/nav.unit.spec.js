import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import * as ShellActions from '../../src/actions/shellActions';
import {Nav,  __RewireAPI__ as NavRewireAPI} from '../../src/components/nav/nav';
import {AppCreationDialog} from '../../src/components/app/appCreationDialog';
import {TableCreationDialog} from '../../src/components/table/tableCreationDialog';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {NEW_TABLE_IDS_KEY} from '../../src/constants/localStorage';
import * as UrlConsts from "../../src/constants/urlConstants";


import _ from 'lodash';
import {CONTEXT} from '../../src/actions/context';

let smallBreakpoint = false;

class BreakpointsMock {
    static isSmallBreakpoint() {
        return smallBreakpoint;
    }
}

const LeftNavMock = React.createClass({
    render() {
        return <div className="leftMenu"><a className="leftNavLink" onClick={() => this.props.onSelect()}>mock left
            nav</a></div>;
    }
});

const TrowserMock = React.createClass({
    render() {
        return <div>mock trowser</div>;
    }
});

const TopNavMock = React.createClass({
    render() {
        return <div className="topNav">mock top nav</div>;
    }
});

const TableCreationDialogMock = React.createClass({
    render() {
        return <div>mock table creation dialog</div>;
    }
});

const mockFormStore = {updateFormRedirectRoute(_route) {}};

const mockReportStore = {updateReportRedirectRoute(_route) {}};

class WindowLocationUtilsMock {
    static update(url) { }
}
const query = {
    'editRec': 9
};

describe('Nav Unit tests', () => {
    'use strict';
    beforeEach(() => {
        jasmineEnzyme();
    });

    let props = {
        toggleAppsList: (state) => {},
        toggleLeftNav: (state) => {},
        hideTrowser: () => {},
        showTrowser: (content) => {},
        loadForm: (app, tbl, rpt, type, edit, show) => {},
        loadReports: (ctx, app, tbl) => {},
        updateFormRedirectRoute: (route) => {},
        showTableCreationDialog: () => {},
        showTableReadyDialog: () => {},
        enterBuilderMode: (context) => {},
        loadApps: () => {},
        loadApp: () => {},
        updateReportRedirectRoute: (ctx, route) => {},
        getApp: (appId) => {},
        getApps: () => {},
        appOwner: null,
        appRoles: null,
        selectedAppId: null,
        selectedApp: null,
        selectedTableId: null,
        appUsers: {},
        appUnfilteredUsers: {},
        isAppsLoading: false,
        forms: {},
        fields: [],
        record: [],
        report: [{
            id: CONTEXT.REPORT.NAV,
            rptId: '3'
        }],
        match:{
            params: {
                appId: '1',
                tblId: '2',
                recordId: '3',
                rptId: '4'
            }
        },
        shell: {
            leftNavVisible: true,
            leftNavExpanded: false,
            fieldsSelectMenu: {
                fieldsListCollapsed: true,
                addBefore: null,
                availableColumns: []
            }
        },
        app: {
            app: null,
            apps: [],
            loading: false,
            error: false
        },
        reports: [],
        history: [],
        reportBuilder: true,
        location: {
            query: query
        }
    };

    beforeEach(() => {
        spyOn(props, 'toggleAppsList').and.callThrough();
        spyOn(props, 'toggleLeftNav').and.callThrough();
        spyOn(props, 'hideTrowser').and.callThrough();
        spyOn(props, 'showTrowser').and.callThrough();
        spyOn(props, 'loadForm').and.callThrough();
        spyOn(props, 'loadReports').and.callThrough();
        spyOn(props, 'enterBuilderMode').and.callThrough();
        spyOn(props, 'loadApps').and.callThrough();
        NavRewireAPI.__Rewire__('LeftNav', LeftNavMock);
        NavRewireAPI.__Rewire__('AppCreationDialog', AppCreationDialog);
        NavRewireAPI.__Rewire__('RecordTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('ReportManagerTrowser', TrowserMock);
        NavRewireAPI.__Rewire__('TopNav', TopNavMock);
        NavRewireAPI.__Rewire__('TableCreationDialog', TableCreationDialogMock);
        NavRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);
        NavRewireAPI.__Rewire__('Analytics', () => null); // Turn off analytics component for unit tests
    });

    afterEach(() => {
        props.toggleAppsList.calls.reset();
        props.toggleLeftNav.calls.reset();
        props.hideTrowser.calls.reset();
        props.showTrowser.calls.reset();
        props.loadForm.calls.reset();
        props.loadReports.calls.reset();
        props.enterBuilderMode.calls.reset();
        props.loadApps.calls.reset();
        NavRewireAPI.__ResetDependency__('LeftNav');
        NavRewireAPI.__ResetDependency__('AppCreationDialog');
        NavRewireAPI.__ResetDependency__('RecordTrowser');
        NavRewireAPI.__ResetDependency__('ReportManagerTrowser');
        NavRewireAPI.__ResetDependency__('TopNav');
        NavRewireAPI.__ResetDependency__('TableCreationDialog');
        NavRewireAPI.__ResetDependency__('WindowLocationUtils');
        NavRewireAPI.__ResetDependency__('Analytics');
    });

    it('test render of component', () => {
        let component = shallow(<Nav {...props}/>);
        expect(component).toBeDefined();
    });

    it('test renders large by default', () => {
        let cloneProps = _.cloneDeep(props);
        cloneProps.selectedAppId = 'mockSelectedAppId';
        let component = mount(<Nav {...cloneProps}/>);
        let leftNav = component.find('.leftMenu');
        expect(leftNav.length).toBe(1);
        let topNav = component.find('.topNav');
        expect(topNav.length).toBe(1);
        let appCreationDialog = component.find(AppCreationDialog);
        expect(appCreationDialog.length).toBe(1);
        let tableCreationDialog = component.find(TableCreationDialogMock);
        expect(tableCreationDialog.length).toBe(1);
    });

    it('will not render TableCreation if mockSelectedAppId is null', () => {
        let component = mount(<Nav {...props}/>);

        let tableCreationDialog = component.find(TableCreationDialogMock);
        expect(tableCreationDialog.length).toBe(0);
    });

    it('renders the loading screen while no apps are loaded', () => {
        let cloneProps = _.clone(props);
        cloneProps.areAppsLoading = true;

        let component = TestUtils.renderIntoDocument(<Nav {...cloneProps}/>);
        let domComponent = ReactDOM.findDOMNode(component);

        let loadingScreen = domComponent.querySelector('.loadingScreen');
        let leftMenu = domComponent.querySelector('.leftMenu');

        expect(loadingScreen).not.toBeNull();
        expect(leftMenu).toBeNull();
    });

    it('does not render the loading screen if apps are loaded', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props}/>);

        let domComponent = ReactDOM.findDOMNode(component);
        let loadingScreen = domComponent.querySelector('.loadingScreen');
        let leftMenu = domComponent.querySelector('.leftMenu');

        expect(loadingScreen).toBeNull();
        expect(leftMenu).not.toBeNull();
    });

    it('test onSelectItem method on small breakpoint', () => {
        NavRewireAPI.__Rewire__('Breakpoints', BreakpointsMock);
        smallBreakpoint = true;

        let component = TestUtils.renderIntoDocument(<Nav {...props}/>);
        component.onSelectItem();
        expect(props.toggleLeftNav).toHaveBeenCalled();

        NavRewireAPI.__ResetDependency__('Breakpoints');
    });

    it('test toggleNav method', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props}/>);
        component.toggleNav();
        expect(props.toggleLeftNav).toHaveBeenCalled();
    });

    it('test onSelectTableReports method', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props}/>);
        component.onSelectTableReports();
        expect(props.showTrowser).toHaveBeenCalled();
        expect(props.loadReports).toHaveBeenCalled();
    });

    it('test hideTrowser method', () => {
        let component = TestUtils.renderIntoDocument(<Nav {...props}/>);
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
            let component = TestUtils.renderIntoDocument(<Nav {...props}/>);
            component.toggleAppsList(testCase.expanded);
            if (testCase.expanded) {
                expect(props.toggleAppsList(testCase.expanded));
            } else {
                expect(props.toggleAppsList(true));
                expect(props.toggleLeftNav(true));
            }
        });
    });

    it('renders form builder component without form type or form id', () => {
        let expectedRouter = ['/qbase/builder/app/1/table/2/form'];
        props.forms = {};
        props.history = [];

        let component = TestUtils.renderIntoDocument(<Nav {...props}updateFormRedirectRoute={mockFormStore.updateFormRedirectRoute} />);
        component.navigateToFormBuilder();

        expect(props.history).toEqual(expectedRouter);
    });

    it('renders form builder component with a form type', () => {
        let expectedRouter = ['/qbase/builder/app/1/table/2/form?formType=view'];
        props.forms = {'view': {}};
        props.history = [];

        let component = TestUtils.renderIntoDocument(<Nav {...props}updateFormRedirectRoute={mockFormStore.updateFormRedirectRoute} />);
        component.navigateToFormBuilder();

        expect(props.history).toEqual(expectedRouter);
    });

    it('renders form builder and sets the redirect route', () => {
        spyOn(mockFormStore, 'updateFormRedirectRoute');

        const testLocation = {
            pathname: '/previousLocation',
            query: query
        };
        props.forms = [];
        props.history = [];

        let component = TestUtils.renderIntoDocument(<Nav {...props}location={testLocation} updateFormRedirectRoute={mockFormStore.updateFormRedirectRoute} />);
        component.navigateToFormBuilder();

        expect(mockFormStore.updateFormRedirectRoute).toHaveBeenCalledWith(testLocation.pathname);
    });

    it('enters report builder', () => {
        let component = shallow(<Nav {...props}updateReportRedirectRoute={mockReportStore.updateReportRedirectRoute} />);

        let instance = component.instance();

        instance.navigateToReportBuilder();

        expect(props.enterBuilderMode).toHaveBeenCalled();
    });

    it('renders report builder component without form type or form id', () => {
        let expectedRouter = ['/qbase/builder/app/1/table/2/report/3'];
        props.history = [];

        let component = TestUtils.renderIntoDocument(<Nav {...props}updateReportRedirectRoute={mockReportStore.updateReportRedirectRoute} />);
        component.navigateToReportBuilder();

        expect(props.history).toEqual(expectedRouter);
    });

    it('renders report builder and sets the redirect route', () => {
        spyOn(mockReportStore, 'updateReportRedirectRoute');

        const testLocation = {
            pathname: '/previousLocation',
            query: query
        };
        props.history = [];

        let component = TestUtils.renderIntoDocument(<Nav {...props}location={testLocation} updateReportRedirectRoute={mockReportStore.updateReportRedirectRoute} />);
        component.navigateToReportBuilder();

        expect(mockReportStore.updateReportRedirectRoute).toHaveBeenCalledWith(testLocation.pathname);
    });

    describe('app and table creation ', () => {
        it('ensures a table was created and both sessionStorage getItem and setItem were called', () => {
            spyOn(window.sessionStorage, 'getItem');
            spyOn(window.sessionStorage, 'setItem');
            spyOn(props, 'loadApp');
            spyOn(props, 'showTableReadyDialog');

            let component = shallow(<Nav {...props} />);
            let instance = component.instance();
            instance.tableCreated();

            expect(props.loadApp).toHaveBeenCalledWith(props.selectedAppId);
            expect(window.sessionStorage.getItem).toHaveBeenCalledWith(NEW_TABLE_IDS_KEY);
            expect(window.sessionStorage.setItem).toHaveBeenCalledWith(NEW_TABLE_IDS_KEY, '');
            expect(props.showTableReadyDialog).toHaveBeenCalled();
        });

        it('invokes showTableCreationDialog when createNewTable is called', () => {
            spyOn(props, 'showTableCreationDialog');

            let component = shallow(<Nav {...props} />);
            let instance = component.instance();
            instance.createNewTable();

            expect(props.showTableCreationDialog).toHaveBeenCalled();
        });
    });

    describe('updateRecordTrowser ', () => {
        it('will invoke loadForm with childAppId, childTableId, childReportId, formType, editRec, showTrowser', () => {
            let cloneProps = _.cloneDeep(props);
            cloneProps.location.query = {
                [UrlConsts.DETAIL_APPID]: {},
                [UrlConsts.DETAIL_TABLEID]: {},
                [UrlConsts.DETAIL_KEY_FID]: {},
                [UrlConsts.EDIT_RECORD_KEY]: {},
                [UrlConsts.DETAIL_REPORTID]: {}
            };

            let component = shallow(<Nav {...cloneProps} />);

            let instance = component.instance();
            instance.updateRecordTrowser();

            expect(props.loadForm).toHaveBeenCalledWith({}, {}, {}, 'edit', {}, true);
        });

        it('will invoke loadForm with appId, tblId, rptId, formType, editRec, showTrowser', () => {
            let cloneProps = _.cloneDeep(props);
            cloneProps.location.query = {[UrlConsts.EDIT_RECORD_KEY]: {}};

            let component = shallow(<Nav {...cloneProps} />);

            let instance = component.instance();
            instance.updateRecordTrowser();

            expect(props.loadForm).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId, props.match.params.rptId, 'edit', {}, true);
        });

        it('will NOT invoke loadForm because there is not an edit record query parameter or the trowser is open or there is no new record id', () => {
            let cloneProps = _.cloneDeep(props);
            cloneProps.location.query = {};
            let component = shallow(<Nav {...cloneProps} />);

            let instance = component.instance();
            instance.updateRecordTrowser();

            expect(props.loadForm).not.toHaveBeenCalled();
        });
    });
});
