import React from 'react';
import TestUtils from 'react-addons-test-utils';
import IconInputBox  from '../../src/components/iconInputBox/iconInputBox';
import Icon  from '../../src/components/icon/icon';

describe('IconInputBox functions', () => {
    'use strict';

    let component;
    let mockCallbacks = {};

    beforeEach(() => {
        mockCallbacks = {
            onChangeEv : function(value) {
            },
            onClearEv : function(value) {
            }
        };
        spyOn(mockCallbacks, 'onChangeEv');
        spyOn(mockCallbacks, 'onClearEv');

    });

    afterEach(() => {
        mockCallbacks.onChangeEv.calls.reset();
        mockCallbacks.onClearEv.calls.reset();
    });
    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<IconInputBox placeholder="test"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let clearIcon = TestUtils.scryRenderedComponentsWithType(component, Icon);
        expect(clearIcon.length).toEqual(1);
        let searchInput = TestUtils.scryRenderedDOMComponentsWithClass(component, "searchInput");
        expect(searchInput.length).toEqual(1);
        expect(searchInput[0].placeholder).toEqual("test");
    });

    it('test render of component with value', () => {
        component = TestUtils.renderIntoDocument(<IconInputBox value="test" />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let searchInput = TestUtils.scryRenderedDOMComponentsWithClass(component, "searchInput");
        expect(searchInput.length).toEqual(1);
        expect(searchInput[0].value).toEqual("test");
        let clearIcon = TestUtils.scryRenderedComponentsWithType(component, Icon);
        expect(clearIcon.length).toEqual(1);
    });

    it('test render of component with no clear icon', () => {
        component = TestUtils.renderIntoDocument(<IconInputBox value="test" hideClearIcon={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let searchInput = TestUtils.scryRenderedDOMComponentsWithClass(component, "searchInput");
        expect(searchInput.length).toEqual(1);
        expect(searchInput[0].value).toEqual("test");
        let clearIcon = TestUtils.scryRenderedComponentsWithType(component, Icon);
        expect(clearIcon.length).toEqual(1);
    });

    it('test render of component with change event', () => {
        component = TestUtils.renderIntoDocument(<IconInputBox value="test" onChange={mockCallbacks.onChangeEv}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let searchInput = TestUtils.scryRenderedDOMComponentsWithClass(component, "searchInput");
        expect(searchInput.length).toEqual(1);

        TestUtils.Simulate.change(searchInput[0], {target: {value: "newvalue"}});
        expect(mockCallbacks.onChangeEv).toHaveBeenCalled();
    });

    it('test render of component with clear event', () => {
        component = TestUtils.renderIntoDocument(<IconInputBox value="test" onClear={mockCallbacks.onClearEv}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let clearIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "clearSearch");
        expect(clearIcon.length).toEqual(1);
        TestUtils.Simulate.click(clearIcon[0]);
        expect(mockCallbacks.onClearEv).toHaveBeenCalled();
    });
});

