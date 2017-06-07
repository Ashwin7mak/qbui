import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';
import {SettingsWrapper, __RewireAPI__ as SettingsWrapperRewireAPI}  from '../../src/components/settings/settingsWrapper';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';

import TopNav from '../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../reuse/client/src/components/sideNavs/standardLeftNav';
import SimpleNavItem from '../../../reuse/client/src/components/simpleNavItem/simpleNavItem';

import {mount, shallow} from 'enzyme';

import Promise from 'bluebird';
import _ from 'lodash';
import {Provider} from "react-redux";

const apps = [{id: 'app1', tables: [{id: 'table1'}, {id: 'tbl2'}]}];
const params = {
    appId: 'app1',
    tblId: 'tbl1'
};

const initialProps = {

    match: {
        params: params
    },
    isNavCollapsed: false,
    isOpen: true,
    selectedAppId: null,
    selectedTableId: null,
    getApp: (appId) => {return _.find(apps, function(a) {return a.id === appId;});},
    shell: {
        topNavVisible: true
    },
    toggleNav: () => {},
    clearSelectedApp: () => {},
    selectTable: (appId, tblId) => {},
    clearSelectedTable: () => {},
    loadApp: (appId) => {},
    loadApps: () => {},
    getFeatureSwitchStates: () => {}
};

let props = {};

function setSpies() {
    spyOn(props, 'toggleNav').and.callThrough();
    spyOn(props, 'clearSelectedApp').and.callThrough();
    spyOn(props, 'selectTable').and.callThrough();
    spyOn(props, 'clearSelectedTable').and.callThrough();
    spyOn(props, 'getApp').and.callThrough();
    spyOn(props, 'loadApp').and.callThrough();
    spyOn(props, 'loadApps').and.callThrough();
    spyOn(props, 'getFeatureSwitchStates').and.callThrough();
}

function resetSpies() {
    props.toggleNav.calls.reset();
    props.clearSelectedApp.calls.reset();
    props.selectTable.calls.reset();
    props.clearSelectedTable.calls.reset();
    props.getApp.calls.reset();
    props.loadApp.calls.reset();
    props.loadApps.calls.reset();
    props.getFeatureSwitchStates.calls.reset();
}

describe('SettingsWrapper tests', () => {
    'use strict';
    let component;

    afterEach(() => {
        resetSpies();
    });

    it('test render of component', () => {
        props = _.clone(initialProps);
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();
    });

    it('test default action on mount with app not in store', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'appNotInStore';
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(props.loadApps).toHaveBeenCalled();
        expect(props.loadApp).toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
    });

    it('test default action on mount with no app id', () => {
        props = _.clone(initialProps);
        props.match.params.appId = null;
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(props.loadApps).toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalled();
        expect(props.selectTable).not.toHaveBeenCalled();
    });

    it('test default action on mount with app already in store', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(props.loadApps).not.toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
    });

    it('test default action on mount with app already in store and no table and no selected table', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = null;
        props.selectedTableId = null;
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);

        expect(props.loadApps).not.toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).not.toHaveBeenCalled();
        expect(props.clearSelectedTable).not.toHaveBeenCalled();
    });

    it('test default action on mount with app already in store and no table and a selected table', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = null;
        props.selectedTableId = '1';
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(props.loadApps).not.toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).not.toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
        expect(props.clearSelectedTable).toHaveBeenCalled();
    });

    it('test render of left and top nav components', () => {
        props = _.clone(initialProps);
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        const leftNav = component.find(LeftNav);
        const topNav = component.find(TopNav);
        expect(leftNav.length).toBe(1);
        expect(topNav.length).toBe(1);
    });

    it('test re-render of component with appId update only', () => {
        props = _.clone(initialProps);
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();

        resetSpies();

        //  update props
        const newApp = 'app2';
        component.setProps({
            match: {
                params: {
                    appId: newApp,
                    tblId: params.tblId
                }
            }
        });

        expect(props.getFeatureSwitchStates).not.toHaveBeenCalledWith(newApp);
        expect(props.selectTable).not.toHaveBeenCalled();
        expect(props.clearSelectedApp).not.toHaveBeenCalled();
    });

    it('test re-render of component with tblId update only', () => {
        props = _.clone(initialProps);
        setSpies();

        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();

        resetSpies();

        //  update props
        const newTbl = 'tbl2';
        component.setProps({
            match: {
                params: {
                    appId: params.appId,
                    tblId: newTbl
                }
            }
        });

        expect(props.clearSelectedApp).not.toHaveBeenCalled();
        expect(props.selectTable).not.toHaveBeenCalled();

    });

    it('test render of child routes', () => {
        props = _.clone(initialProps);
        setSpies();

        const reduxStore = {
            getState: function() {
                return {
                    shell: {}
                };
            },
            subscribe: ()=>{}
        };

        const ChildComponent = React.createClass({
            render() {
                return <div className="childComponentClass" />;
            }
        });
        const childRoute = [{
            path: '/aRoute',
            exact: true,
            component: ChildComponent
        }];
        let initialEntries = ['/one', '/aRoute'];
        component = mount(
            <MemoryRouter initialEntries={initialEntries} initialIndex={1}>
                <Provider store={reduxStore}>
                <SettingsWrapper {...props} routes={childRoute}/>
                </Provider>
            </MemoryRouter>);

        let child = component.find(ChildComponent);
        expect(child.length).toEqual(1);
        expect(Object.keys(child.nodes[0].props)).toContain('match');
        expect(Object.keys(child.nodes[0].props)).toContain('location');
        expect(Object.keys(child.nodes[0].props)).toContain('history');

    });
});
