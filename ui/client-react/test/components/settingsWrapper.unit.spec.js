import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';
import {SettingsWrapper, __RewireAPI__ as SettingsWrapperRewireAPI}  from '../../src/components/settings/settingsWrapper';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';

import TopNav from '../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../reuse/client/src/components/sideNavs/standardLeftNav';
import SimpleNavItem from '../../../reuse/client/src/components/simpleNavItem/simpleNavItem';
import {mount} from 'enzyme';

import Promise from 'bluebird';
import _ from 'lodash';

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
    getApp: (appId) => {return _.find(apps, function(a) {return a.id === appId;});},
    getSelectedAppId: () => {},
    getSelectedTableId: () => {},
    toggleNav: () => {},
    clearSelectedApp: () => {},
    selectTable: (appId, tblId) => {},
    clearSelectedTable: () => {},
    loadApp: (appId) => {},
    loadApps: () => {},
    getFeatureSwitchStates: () => {}
};

let props = {};

describe('SettingsWrapper tests', () => {
    'use strict';
    let component;

    beforeEach(() => {
        props = _.clone(initialProps);
        spyOn(props, 'toggleNav').and.callThrough();
        spyOn(props, 'clearSelectedApp').and.callThrough();
        spyOn(props, 'selectTable').and.callThrough();
        spyOn(props, 'clearSelectedTable').and.callThrough();
        spyOn(props, 'getApp').and.callThrough();
        spyOn(props, 'loadApp').and.callThrough();
        spyOn(props, 'loadApps').and.callThrough();
        spyOn(props, 'getFeatureSwitchStates').and.callThrough();
    });

    afterEach(() => {
        props.toggleNav.calls.reset();
        props.clearSelectedApp.calls.reset();
        props.selectTable.calls.reset();
        props.clearSelectedTable.calls.reset();
        props.getApp.calls.reset();
        props.loadApp.calls.reset();
        props.loadApps.calls.reset();
        props.getFeatureSwitchStates.calls.reset();
    });

    it('test render of component', () => {
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();
    });

    it('test default action on mount with app not in store', () => {
        props.match.params.appId = 'appNotInStore';
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);

        expect(props.loadApps).toHaveBeenCalled();
        expect(props.loadApp).toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
    });

    it('test default action on mount with no app id', () => {
        props.match.params.appId = null;
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);

        expect(props.loadApps).toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalled();
        expect(props.selectTable).not.toHaveBeenCalled();
    });

    it('test default action on mount with app already in store', () => {
        props.match.params.appId = 'app1';
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);

        expect(props.loadApps).not.toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
    });

    it('test default action on mount with app already in store and no table and no selected table', () => {
        props.match.params.appId = 'app1';
        props.match.params.tblId = null;
        props.getSelectedTableId = () => {return null;};
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);

        expect(props.loadApps).not.toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).not.toHaveBeenCalled();
        expect(props.clearSelectedTable).not.toHaveBeenCalled();
    });

    it('test default action on mount with app already in store and no table and a selected table', () => {
        props.match.params.appId = 'app1';
        props.match.params.tblId = null;
        props.getSelectedTableId = () => {return true;};
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        expect(props.loadApps).not.toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).not.toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
        expect(props.clearSelectedTable).toHaveBeenCalled();
    });

    it('test render of nav components', () => {
        component = mount(<MemoryRouter><SettingsWrapper {...props}/></MemoryRouter>);
        const leftNav = component.find(LeftNav);
        const topNav = component.find(TopNav);
        expect(leftNav.length).toBe(1);
        expect(topNav.length).toBe(1);
    });

    it('test render of child routes', () => {
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
                <SettingsWrapper {...props} routes={childRoute}/>
            </MemoryRouter>);

        let child = component.find(ChildComponent);
        expect(child.length).toEqual(1);
        expect(Object.keys(child.nodes[0].props)).toContain('match');
        expect(Object.keys(child.nodes[0].props)).toContain('location');
        expect(Object.keys(child.nodes[0].props)).toContain('history');

    });
});
