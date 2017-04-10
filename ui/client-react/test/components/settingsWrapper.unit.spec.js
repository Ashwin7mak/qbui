import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {SettingsWrapper, __RewireAPI__ as SettingsWrapperRewireAPI}  from '../../src/components/settings/settingsWrapper';
import DefaultTopNavGlobalActions from '../../../reuse/client/src/components/topNav/defaultTopNavGlobalActions';
import TopNav from '../../../reuse/client/src/components/topNav/topNav';
import LeftNav from '../../../reuse/client/src/components/sideNavs/standardLeftNav';
import SimpleNavItem from '../../../reuse/client/src/components/simpleNavItem/simpleNavItem';

import Promise from 'bluebird';
import _ from 'lodash';

const apps = [{id: 'app1', tables: [{id: 'table1'}, {id: 'table2'}]}];

const appsStore = Fluxxor.createStore({
    getState: function() {
        return {
            apps: apps,
            selectedAppId: 'app1',
            selectedTableId: 'table2'
        };
    }
});
let stores = {
    AppsStore: new appsStore()
};
let flux = new Fluxxor.Flux(stores);
flux.actions = {
    selectTableId: () => {return;},
    selectAppId: () => {return;},
    loadApps: () => {return;}
};

const props = {
    params: {
        appId: 'app1',
        tblId: 'table1'
    },
    toggleNav: () => {},
    dispatch: () => {},
    flux: flux
};

describe('SettingsWrapper tests', () => {
    'use strict';
    let component;

    beforeEach(() => {
        spyOn(flux.actions, 'loadApps').and.callThrough();
        spyOn(flux.actions, 'selectAppId').and.callThrough();
        spyOn(flux.actions, 'selectTableId').and.callThrough();
        component = TestUtils.renderIntoDocument(<SettingsWrapper {...props}/>);
    });

    afterEach(() => {
        flux.actions.loadApps.calls.reset();
        flux.actions.selectAppId.calls.reset();
        flux.actions.selectTableId.calls.reset();
    });

    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test default action on mount', () => {
        expect(flux.actions.loadApps).toHaveBeenCalled();
        expect(flux.actions.selectAppId).toHaveBeenCalledWith(props.params.appId);
        expect(flux.actions.selectTableId).toHaveBeenCalledWith(props.params.tblId);
    });

    it('test render of nav components', () => {
        expect(TestUtils.scryRenderedComponentsWithType(component, LeftNav).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, TopNav).length).toEqual(1);
    });

    it('test render of child components', () => {
        const childComponent = React.createClass({
            render() {
                return <div className="childComponentClass" />;
            }
        });
        const childComponentEl = React.createFactory(childComponent);
        component = TestUtils.renderIntoDocument(<SettingsWrapper {...props}>{childComponentEl}</SettingsWrapper>);
        let child = TestUtils.scryRenderedComponentsWithType(component, childComponent);
        expect(child.length).toEqual(1);
        expect(child[0].props).toEqual({app: apps[0], table: apps[0].tables[1]});
    });
});
