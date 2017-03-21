import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QbIconActions  from '../../src/components/actions/iconActions';
import {__RewireAPI__ as IconActionsRewireAPI} from '../../../reuse/client/src/components/iconActions/iconActions';

const I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>I18Mock</div>
        );
    }
});

describe('QbIconActions functions', () => {
    'use strict';

    let component;

    const actions = [
        {msg: 'action1', icon:'icon1'},
        {msg: 'action2', icon:'icon2'},
        {msg: 'action3', icon:'icon3'}
    ];

    beforeEach(() => {
        IconActionsRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        IconActionsRewireAPI.__ResetDependency__('I18nMessage');
    });

    it('test render of empty component', () => {
        const emptyActions = [];
        component = TestUtils.renderIntoDocument(<QbIconActions flux={{}} actions={emptyActions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of no-menu component', () => {
        component = TestUtils.renderIntoDocument(<QbIconActions flux={{}} actions={actions} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconActionButton");
        expect(icons.length).toEqual(actions.length);

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(0);
    });

    it('test render of all-menu component', () => {
        component = TestUtils.renderIntoDocument(<QbIconActions flux={{}} actions={actions} maxButtonsBeforeMenu={0}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconActionButton");
        expect(icons.length).toEqual(1); // the dropdown button

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(actions.length);
    });

    it('test render of menu after 1st component', () => {
        component = TestUtils.renderIntoDocument(<QbIconActions flux={{}} actions={actions} maxButtonsBeforeMenu={1}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        var icons = TestUtils.scryRenderedDOMComponentsWithClass(component, "iconActionButton");
        expect(icons.length).toEqual(2);

        var menuItems = TestUtils.scryRenderedDOMComponentsWithTag(component, "li");
        expect(menuItems.length).toEqual(actions.length - 1);
    });
});
