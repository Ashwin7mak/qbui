import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportActions  from '../../src/components/actions/reportActions';
import ActionIcon from '../../src/components/actions/actionIcon';

describe('ReportActions functions', () => {
    'use strict';

    let component;


    it('test render of component', () => {
        let selection = [];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection}/>);
    });

    it('test render with 1 selected row', () => {
        let selection = [1];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection}/>);

        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);
        expect(actionIcons[0].props.icon).toEqual("edit");
    });

    it('test render of >1 selected row', () => {
        let selection = [1, 2, 3];
        component = TestUtils.renderIntoDocument(<ReportActions selection={selection}/>);
        let actionIcons = TestUtils.scryRenderedComponentsWithType(component, ActionIcon);

        // only allow edit of single selection
        expect(actionIcons[0].props.icon).not.toEqual("edit");
    });
});
