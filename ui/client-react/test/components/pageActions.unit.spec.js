import React from 'react';
import TestUtils from 'react-addons-test-utils';
import PageActions  from '../../src/components/actions/pageActions';

describe('PageActions functions', () => {
    'use strict';

    let component;

    const actions = [
        {name: 'action1', icon:'icon1'},
        {name: 'action2', icon:'icon2'},
        {name: 'action3', icon:'icon3'}
    ];

    it('test render of empty component', () => {
        const emptyActions = [];
        component = TestUtils.renderIntoDocument(<PageActions actions={emptyActions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of no-menu component', () => {
        component = TestUtils.renderIntoDocument(<PageActions actions={actions} menuAfter={actions.length}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "pageActionButton");
        expect(icons.length).toEqual(actions.length);

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(0);
    });

    it('test render of all-menu component', () => {
        component = TestUtils.renderIntoDocument(<PageActions actions={actions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "pageActionButton");
        expect(icons.length).toEqual(1); // the dropdown button

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(actions.length);
    });

    it('test render of menu after 1st component', () => {
        component = TestUtils.renderIntoDocument(<PageActions actions={actions} menuAfter={1}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "pageActionButton");
        expect(icons.length).toEqual(2);

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(actions.length - 1);
    });
});
