import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Breakpoints from '../../src/utils/breakpoints';

import MultiLineTextFieldValueEditor  from '../../src/components/fields/multiLineTextFieldValueEditor';

class BreakpointsAlwaysSmallMock {

    static isSmallBreakpoint() {
        return true;
    }
}

describe('MultiLineTextFieldValueEditor functions', () => {
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

        let textArea = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.keyUp(
            textArea,
            {}
        );

        expect(component.resize).toHaveBeenCalled();
    });

    it('does not resize on keyup when size is greater than 200px', () => {
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        spyOn(component, 'getScrollHeight').and.returnValue(MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT  + 100);
        spyOn(component, 'resize');

        let textArea = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.keyUp(
            textArea,
            {}
        );

        expect(component.resize).not.toHaveBeenCalled();
    });

    it('resizes to max height when the component first loads when textarea is over 200px', () => {
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        spyOn(component, 'getScrollHeight').and.returnValue(MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT + 100);

        component.resize();

        expect(component.state.style.height).toBe(MultiLineTextFieldValueEditor.MAX_TEXTAREA_HEIGHT);
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

    it('invokes parent\'s onBlur with textArea value and formatted display value', () => {
        let expectedVals = {
            value: 'test test',
            display: 'display test'
        };

        let mockEvent = {
            target: {
                value: expectedVals.value
            }
        };
        let mockParent = {
            onBlur: function(ev) {
                return '';
            }
        };
        let mockTextFormatter = {
            format: function() {
                return expectedVals.display;
            }
        };
        let mockFieldDef = {
            datatypeAttributes: 'foo'
        };

        spyOn(mockParent, 'onBlur');

        MultiLineTextFieldValueEditor.__Rewire__('textFormatter', mockTextFormatter);
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor fieldDef={mockFieldDef} onBlur={mockParent.onBlur} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let textArea = ReactDOM.findDOMNode(component);
        TestUtils.Simulate.blur(
            textArea,
            mockEvent
        );

        expect(mockParent.onBlur).toHaveBeenCalledWith(expectedVals);
        MultiLineTextFieldValueEditor.__ResetDependency__('textFormatter');
    });

    it('test render with specified width', () => {
        let fieldDef = {
            datatypeAttributes: {
                clientSideAttributes: {
                    width: 20
                }
            }
        }
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor fieldDef={fieldDef}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textArea = component.refs.textarea;
        expect(+(textArea.getAttribute('cols'))).toEqual(20);
    });
    it('test render with specified height', () => {
        let fieldDef = {
            datatypeAttributes: {
                clientSideAttributes: {
                    num_lines: 20
                }
            }
        }
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor fieldDef={fieldDef}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textArea = component.refs.textarea;
        expect(+(textArea.getAttribute('rows'))).toEqual(20);
    });
    it('test render with specified width on small breakpoint', () => {
        MultiLineTextFieldValueEditor.__Rewire__('Breakpoints', BreakpointsAlwaysSmallMock);
        let fieldDef = {
            datatypeAttributes: {
                clientSideAttributes: {
                    width: 20
                }
            }
        }
        component = TestUtils.renderIntoDocument(<MultiLineTextFieldValueEditor fieldDef={fieldDef}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textArea = component.refs.textarea;
        expect(+(textArea.getAttribute('cols'))).toEqual(1);
        MultiLineTextFieldValueEditor.__ResetDependency__('Breakpoints');
    });
});
