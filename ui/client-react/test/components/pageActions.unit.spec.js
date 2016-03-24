import React from 'react';
import TestUtils from 'react-addons-test-utils';
import IconActions  from '../../src/components/actions/iconActions';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>I18Mock</div>
        );
    }
});

describe('IconActions functions', () => {
    'use strict';

    let component;

    const actions = [
        {msg: 'action1', icon:'icon1'},
        {msg: 'action2', icon:'icon2'},
        {msg: 'action3', icon:'icon3'}
    ];

    beforeEach(() => {
        IconActions.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        IconActions.__ResetDependency__('I18nMessage');
    });

    it('test render of empty component', () => {
        const emptyActions = [];
        component = TestUtils.renderIntoDocument(<IconActions actions={emptyActions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of no-menu component', () => {
        component = TestUtils.renderIntoDocument(<IconActions actions={actions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconActionButton");
        expect(icons.length).toEqual(actions.length);

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(0);
    });

    it('test render of all-menu component', () => {
        component = TestUtils.renderIntoDocument(<IconActions actions={actions} menuAfter={0}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconActionButton");
        expect(icons.length).toEqual(1); // the dropdown button

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(actions.length);
    });

    it('test render of menu after 1st component', () => {
        component = TestUtils.renderIntoDocument(<IconActions actions={actions} menuAfter={1}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconActionButton");
        expect(icons.length).toEqual(2);

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(actions.length - 1);
    });
});
