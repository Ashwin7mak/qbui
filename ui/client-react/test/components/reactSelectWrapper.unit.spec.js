import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Select from 'react-select';
import SelectWrapper from '../../src/components/select/reactSelectWrapper';

describe('ReactSelectWrapper', () => {
    'use strict';

    let component;

    afterEach(() => {
        if (component) {
            // unmount to prevent poluting dom with eventListeners
            ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode);
        }
    });

    it('renders component', () => {
        component = TestUtils.renderIntoDocument(<SelectWrapper />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('dropdown should initially be closed', () => {
        component = TestUtils.renderIntoDocument(<SelectWrapper />);
        expect(component.state.isOpen).toBeFalsy();
    });

    it('handleKey calls stopPropagation when Escape key is pressed and dropdown is open', () => {
        component = TestUtils.renderIntoDocument(<SelectWrapper />);
        component.setState({isOpen: true});

        const event = {key: 'Escape', stopPropagation: () => {}};
        spyOn(event, 'stopPropagation');

        component.handleKey(event);

        expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('does not call stopPropagation on Escape keydown event when dropdown is closed', () => {
        component = TestUtils.renderIntoDocument(<SelectWrapper />);
        expect(component.state.isOpen).toBeFalsy();

        const event = {key: 'Escape', stopPropagation: () => {}};
        spyOn(event, 'stopPropagation');

        component.handleKey(event);

        expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('does not call stopPropagation on non-Escape keydown event', () => {
        component = TestUtils.renderIntoDocument(<SelectWrapper />);
        expect(component.state.isOpen).toBeFalsy();

        const event = {key: 'End', stopPropagation: () => {}};
        spyOn(event, 'stopPropagation');

        component.handleKey(event);

        expect(event.stopPropagation).not.toHaveBeenCalled();
    });
});
