import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportActions  from '../../src/components/actions/reportActions';
import ActionIcon from '../../src/components/actions/actionIcon';

describe('ReportActions functions', () => {
    'use strict';

    let component;
    let rptId = 1;
    let appId = 1;
    let tblId = 1;
    let flux = {
        actions:{
            deleteRecordBulk: function() {return;}
        }
    };
    beforeEach(() => {
        spyOn(flux.actions, 'deleteRecordBulk');
    });

    afterEach(() => {
        flux.actions.deleteRecordBulk.calls.reset();
    });

    it('test render of component', () => {
        let selection = [];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} rptId={rptId} appId={appId} tblId={tblId} flux={flux}/>);
    });

    it('test render with 1 selected row', () => {
        let selection = [1];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} rptId={rptId} appId={appId} tblId={tblId} flux={flux}/>);

        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        expect(actionIcons[0].props.icon).toEqual("edit");
    });

    it('test render of >1 selected row', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} rptId={rptId} appId={appId} tblId={tblId} flux={flux}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);

        // only allow edit of single selection
        expect(actionIcons[0].props.icon).not.toEqual("edit");
    });

    it('test onClick event for delete', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} rptId={rptId} appId={appId} tblId={tblId} flux={flux}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        var node = ReactDOM.findDOMNode(actionIcons[2]);
        TestUtils.Simulate.click(node);

        expect(flux.actions.deleteRecordBulk).toHaveBeenCalled();
    });
});
