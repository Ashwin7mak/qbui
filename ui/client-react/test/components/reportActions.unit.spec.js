import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {ReportActions}  from '../../src/components/actions/reportActions';
import ActionIcon from '../../src/components/actions/actionIcon';
import {mount} from 'enzyme';

describe('ReportActions functions', () => {
    'use strict';

    let component;
    let rptId = 1;
    let appId = 1;
    let tblId = 1;
    let props = {
        appId: appId,
        tblId: tblId,
        rptId: rptId,
        deleteRecords: () => {}
    };

    beforeEach(() => {
        spyOn(props, 'deleteRecords').and.callThrough();
    });

    afterEach(() => {
        props.deleteRecords.calls.reset();
    });

    it('test render of component', () => {
        let selection = [];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);
    });

    it('test render with 1 selected row', () => {
        let selection = [1];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);

        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        expect(actionIcons[0].props.icon).toEqual("edit");
    });

    it('test render of >1 selected row', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);

        // only allow edit of single selection
        expect(actionIcons[0].props.icon).not.toEqual("edit");
    });

    it('test onClick event for delete', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection} {...props}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        let node = ReactDOM.findDOMNode(actionIcons[3]);
        TestUtils.Simulate.click(node);

        // confirm via the modal dialog
        const confirmButton = document.querySelector(".qbModal .primaryButton");
        expect(confirmButton).not.toBe(null);
        TestUtils.Simulate.click(confirmButton);
        expect(props.deleteRecords).toHaveBeenCalled();
    });

});
