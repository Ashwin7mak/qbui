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
    getSelectedAppId: () => {return params.appId;},
    toggleNav: () => {},
    match: {
        params: params
    },
    isNavCollapsed: false,
    isOpen: true
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

describe('BuilderWrapper tests', () => {
    'use strict';
    let component;

    beforeEach(() => {
        props = _.clone(defaultProps);
        spyOn(props, 'getApp').and.callThrough();
        spyOn(props, 'getSelectedAppId').and.callThrough();
        BuilderWrapperRewireAPI.__Rewire__('GlobalActions', MockGlobalActions);
        BuilderWrapperRewireAPI.__Rewire__('TableReadyDialog', MockTableReadyDialog);
    });

    afterEach(() => {
        props.getApp.calls.reset();
        props.getSelectedAppId.calls.reset();
        BuilderWrapperRewireAPI.__ResetDependency__('GlobalActions');
        BuilderWrapperRewireAPI.__ResetDependency__('TableReadyDialog');
    });

    it('test render of component with selected app', () => {
        component = mount(<MemoryRouter><BuilderWrapper {...props}/></MemoryRouter>);
        expect(component).toBeDefined();
        expect(props.getSelectedAppId).toHaveBeenCalled();
        expect(props.getApp).toHaveBeenCalled();
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
                <BuilderWrapper {...props} routes={childRoute}/>
            </MemoryRouter>);

        let child = component.find(ChildComponent);
        expect(child.length).toEqual(1);
        expect(Object.keys(child.nodes[0].props)).toContain('match');
        expect(Object.keys(child.nodes[0].props)).toContain('location');
        expect(Object.keys(child.nodes[0].props)).toContain('history');
    });
});
