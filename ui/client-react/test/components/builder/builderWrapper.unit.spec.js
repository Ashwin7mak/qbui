import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';
import {BuilderWrapper, __RewireAPI__ as BuilderWrapperRewireAPI}  from '../../../src/components/builder/builderWrapper';

import {mount} from 'enzyme';

import _ from 'lodash';

const apps = [{id: 'app1', tables: [{id: 'table1'}, {id: 'tbl2'}]}];
const params = {
    appId: 'app1',
    tblId: 'tbl1'
};
const defaultProps = {
    getApp: () => {},
    getApps: () => {},
    selectedAppId: params.appId,
    loadApp: (appId) => {},
    loadApps: () => {},
    match: {
        params: params
    },
    isNavCollapsed: false,
    isOpen: true,
    location: {
        pathname: '/some/report/path'
    }
};
let props = {};

var MockGlobalActions = React.createClass({
    render: function() {
        return (
            <div>Global Actions</div>
        );
    }
});
var MockTableReadyDialog = React.createClass({
    render: function() {
        return (
            <div>Table Ready Dialog</div>
        );
    }
});

function setSpyOn() {
    spyOn(props, 'getApp').and.callThrough();
    spyOn(props, 'loadApp').and.callThrough();
    spyOn(props, 'loadApps').and.callThrough();
}

function resetSpyOn() {
    props.getApp.calls.reset();
    props.loadApp.calls.reset();
    props.loadApps.calls.reset();
}

describe('BuilderWrapper tests', () => {
    'use strict';
    let component;

    beforeEach(() => {
        BuilderWrapperRewireAPI.__Rewire__('GlobalActions', MockGlobalActions);
        BuilderWrapperRewireAPI.__Rewire__('TableReadyDialog', MockTableReadyDialog);
    });

    afterEach(() => {
        resetSpyOn();
        BuilderWrapperRewireAPI.__ResetDependency__('GlobalActions');
        BuilderWrapperRewireAPI.__ResetDependency__('TableReadyDialog');
    });

    it('test render of report component with selected app', () => {
        props = _.clone(defaultProps);
        setSpyOn();

        component = mount(<MemoryRouter><BuilderWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();
        expect(props.getApp).toHaveBeenCalled();
        expect(props.loadApps).toHaveBeenCalled();
    });

    it('test render of report component with app to get loaded', () => {
        defaultProps.getApp = () => {return params.appId;};
        defaultProps.selectedAppId = null;
        props = _.clone(defaultProps);
        setSpyOn();

        component = mount(<MemoryRouter><BuilderWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();
        expect(props.getApp).toHaveBeenCalled();
        expect(props.loadApp).toHaveBeenCalled();
        expect(props.loadApps).not.toHaveBeenCalled();
    });

    it('test render of form component with selected app', () => {
        props.location.pathname = '/some/form/path';
        props = _.clone(defaultProps);
        setSpyOn();

        component = mount(<MemoryRouter><BuilderWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();
        expect(props.getApp).toHaveBeenCalled();
    });

    it('test render of child routes', () => {
        props = _.clone(defaultProps);
        setSpyOn();

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
                <BuilderWrapper {...props} routes={childRoute}/>
            </MemoryRouter>);

        let child = component.find(ChildComponent);
        expect(child.length).toEqual(1);
        expect(Object.keys(child.nodes[0].props)).toContain('match');
        expect(Object.keys(child.nodes[0].props)).toContain('location');
        expect(Object.keys(child.nodes[0].props)).toContain('history');
    });
});
