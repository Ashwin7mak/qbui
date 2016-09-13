import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


import MultiLineTextFieldValueEditor  from '../../src/components/fields/multiLineTextFieldValueEditor';

fdescribe('MultiLineTextFieldValueEditor functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('resizes on keyup', () => {
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        spyOn(component, 'resize');
        // debugger;
        let textArea = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.keyUp(
            textArea,
            {}
        );
        expect(component.resize).toHaveBeenCalled();
    });

    it('does not resize on keyup when size is greater than 200', () => {
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor />);
        spyOn(component, 'getScrollHeight').and.returnValue(300);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        spyOn(component, 'resize');
        let textArea = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.keyUp(
            textArea,
            {}
        );
        expect(component.resize).not.toHaveBeenCalled();
    });

    it('resizes to max height when the component first loads for long texts', () => {
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor />);
        spyOn(component, 'getScrollHeight').and.returnValue(300);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        component.resize();

        let textArea = ReactDOM.findDOMNode(component);
        expect(component.state.style.height).toBe(200);
    });

    it('invokes onChange when a user types in text', () => {
        let mockEvent = {
            target: {
                value: 'Test Test Test Test Test'
            }
        };
        let mockParent = {
            onChange: function() {
                return '';
            }
        };
        spyOn(mockParent, 'onChange');
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor onChange={mockParent.onChange} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textArea = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.change(textArea, mockEvent);
        expect(mockParent.onChange).toHaveBeenCalledWith(mockEvent.target.value);
    });

    it('test render of component with value', () => {
        let text = "testing testing 1 2 3";
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor value={text}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textArea = ReactDOM.findDOMNode(component);
        expect(textArea.value).toBe(text);
    });

});
