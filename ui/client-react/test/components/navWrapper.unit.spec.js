import React from 'react';
import ReactDOM from 'react-dom';
import {NavWrapper, __RewireAPI__ as NavWrapperRewireAPI}  from '../../src/components/nav/navWrapper';
import _ from 'lodash';

import {mount} from 'enzyme';

var MockNav = React.createClass({
    render: function() {
        return (
            <div>Nav</div>
        );
    }
});

const apps = [{id: 'app1', tables: [{id: 'table1'}, {id: 'tbl2'}]}];
const initialProps = {
    match: {
        params: {
            appId: 'app1',
            tblId: 'tbl1'
        }
    },
    locales: 'en-us',
    getApp: (appId) => {return _.find(apps, function(a) {return a.id === appId;});},
    getSelectedAppId: () => {},
    getSelectedTableId: () => {return initialProps.match.params.tblId;},
    clearSelectedApp: () => {},
    loadApp: () => {},
    loadApps: () => {},
    clearSelectedTable: () => {},
    selectTable: () => {},
    getFeatureSwitchStates: () => {},
    loadReports: () => {}
};
let props = {};

function setSpies() {
    spyOn(props, 'getApp').and.callThrough();
    spyOn(props, 'getSelectedAppId').and.callThrough();
    spyOn(props, 'getSelectedTableId').and.callThrough();
    spyOn(props, 'clearSelectedApp').and.callThrough();
    spyOn(props, 'loadApp').and.callThrough();
    spyOn(props, 'loadApps').and.callThrough();
    spyOn(props, 'clearSelectedTable').and.callThrough();
    spyOn(props, 'selectTable').and.callThrough();
    spyOn(props, 'getFeatureSwitchStates').and.callThrough();
    spyOn(props, 'loadReports').and.callThrough();
}

function resetSpies() {
    props.getApp.calls.reset();
    props.getSelectedAppId.calls.reset();
    props.getSelectedTableId.calls.reset();
    props.clearSelectedApp.calls.reset();
    props.loadApp.calls.reset();
    props.loadApps.calls.reset();
    props.clearSelectedTable.calls.reset();
    props.selectTable.calls.reset();
    props.getFeatureSwitchStates.calls.reset();
    props.loadReports.calls.reset();
}

describe('NavWrapper tests', () => {
    'use strict';
    let component;

    beforeEach(() => {
        NavWrapperRewireAPI.__Rewire__('Nav', MockNav);
    });

    afterEach(() => {
        resetSpies();
        NavWrapperRewireAPI.__ResetDependency__('Nav');
    });

    it('test render of component with appId and tableId in state', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = 'tbl1';
        setSpies();

        component = mount(<NavWrapper {...props}/>);
        expect(component).toBeDefined();

        expect(props.getApp).toHaveBeenCalled();
        expect(props.loadApps).not.toHaveBeenCalled();

        expect(props.loadApp).toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
        expect(props.loadReports).toHaveBeenCalled();
    });

    it('test render of component with appId not in state', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'appNotInStore';
        props.match.params.tblId = 'tbl1';
        setSpies();

        component = mount(<NavWrapper {...props}/>);
        expect(component).toBeDefined();

        expect(props.getApp).toHaveBeenCalled();
        expect(props.loadApps).toHaveBeenCalled();

        expect(props.loadApp).toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, props.match.params.tblId);
        expect(props.loadReports).toHaveBeenCalled();
    });

    it('test render of component with no app id', () => {
        props = _.clone(initialProps);
        props.match.params.appId = null;
        props.match.params.tblId = 'tbl1';
        setSpies();

        component = mount(<NavWrapper {...props}/>);

        expect(props.loadApps).toHaveBeenCalled();
        expect(props.loadApp).not.toHaveBeenCalled();
        expect(props.loadReports).not.toHaveBeenCalled();
    });

    it('test render of component with appId in state but no tableId', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = '';
        setSpies();

        component = mount(<NavWrapper {...props}/>);
        expect(component).toBeDefined();

        expect(props.getApp).toHaveBeenCalled();
        expect(props.loadApps).not.toHaveBeenCalled();

        expect(props.loadApp).toHaveBeenCalledWith(props.match.params.appId);
        expect(props.selectTable).not.toHaveBeenCalled();
        expect(props.loadReports).not.toHaveBeenCalled();
        expect(props.getSelectedTableId).toHaveBeenCalled();
        expect(props.clearSelectedTable).toHaveBeenCalled();
    });

    it('test re-render of component when receiving appId prop updates only', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = 'tbl1';
        setSpies();

        component = mount(<NavWrapper {...props}/>);
        props.getApp.calls.reset();
        props.getSelectedAppId.calls.reset();
        props.getSelectedTableId.calls.reset();

        props.clearSelectedApp.calls.reset();
        props.loadApp.calls.reset();
        props.loadApps.calls.reset();
        props.clearSelectedTable.calls.reset();
        props.selectTable.calls.reset();
        props.getFeatureSwitchStates.calls.reset();
        props.loadReports.calls.reset();

        //  update props
        const newApp = 'app2';
        component.setProps({
            match: {
                params: {
                    appId: newApp
                }
            }
        });

        expect(props.loadApp).toHaveBeenCalledWith(newApp);
        expect(props.getSelectedTableId).toHaveBeenCalled();
        expect(props.loadReports).not.toHaveBeenCalled();
    });

    it('test re-render of component when receiving tblId prop updates only', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = 'tbl1';
        setSpies();

        component = mount(<NavWrapper {...props}/>);
        props.getApp.calls.reset();
        props.getSelectedAppId.calls.reset();
        props.getSelectedTableId.calls.reset();

        props.clearSelectedApp.calls.reset();
        props.loadApp.calls.reset();
        props.loadApps.calls.reset();
        props.clearSelectedTable.calls.reset();
        props.selectTable.calls.reset();
        props.getFeatureSwitchStates.calls.reset();
        props.loadReports.calls.reset();

        //  update props
        const newTbl = 'tbl2';
        component.setProps({
            match: {
                params: {
                    tblId: newTbl
                }
            }
        });

        expect(props.loadApp).not.toHaveBeenCalled();
        expect(props.getSelectedAppId).toHaveBeenCalled();
        expect(props.getSelectedTableId).not.toHaveBeenCalled();
        expect(props.selectTable).toHaveBeenCalledWith(props.match.params.appId, newTbl);
        expect(props.loadReports).toHaveBeenCalled();
    });

    it('test re-render of component when receiving appId and tblId prop updates', () => {
        props = _.clone(initialProps);
        props.match.params.appId = 'app1';
        props.match.params.tblId = 'tbl1';
        setSpies();

        component = mount(<NavWrapper {...props}/>);
        props.getApp.calls.reset();
        props.getSelectedAppId.calls.reset();
        props.getSelectedTableId.calls.reset();

        props.clearSelectedApp.calls.reset();
        props.loadApp.calls.reset();
        props.loadApps.calls.reset();
        props.clearSelectedTable.calls.reset();
        props.selectTable.calls.reset();
        props.getFeatureSwitchStates.calls.reset();
        props.loadReports.calls.reset();

        //  update props
        const newApp = 'app2';
        const newTbl = 'tbl2';
        component.setProps({
            match: {
                params: {
                    appId: newApp,
                    tblId: newTbl
                }
            }
        });

        expect(props.loadApp).toHaveBeenCalledWith(newApp);
        expect(props.getSelectedAppId).not.toHaveBeenCalled();
        expect(props.getSelectedTableId).not.toHaveBeenCalled();
        expect(props.selectTable).toHaveBeenCalledWith(newApp, newTbl);
        expect(props.loadReports).toHaveBeenCalled();
    });

});
