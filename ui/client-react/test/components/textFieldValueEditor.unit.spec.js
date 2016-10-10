import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import TextFieldValueEditor  from '../../src/components/fields/textFieldValueEditor';

describe('TextFieldValueEditor functions', () => {
    'use strict';

    let component;


    it('test render of TextFieldValueEditor component', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with no onChange ', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor onChange={undefined}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.isElementOfType(component, 'input').toBeTruthy);
        let input = TestUtils.scryRenderedDOMComponentsWithClass(component, "input");
    });

    it('test render of component with placeholder', () => {
        let ghostText = 'Enter here';
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor placeholder={ghostText}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.isElementOfType(component, 'input').toBeTruthy);
        let input = TestUtils.scryRenderedDOMComponentsWithClass(component, "input");
        expect(input[0].placeholder).toEqual(ghostText);
    });


    it('test render of component with added className', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor value={text} classes="unitTesting" />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
        expect(textFieldValueRenderer.classList.contains('unitTesting')).toBeTruthy();
    });

    it('test render of component isInvalid', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor isInvalid={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component required', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor fieldDef={{required : true}} indicateRequired = {true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component required not shown', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor fieldDef={{required : true}} indicateRequired={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component choices', () => {
        let choices = [
            {displayValue:'a'},
            {displayValue:'b'},
            {displayValue:'c'},
        ];
        component = TestUtils.renderIntoDocument(<TextFieldValueEditor fieldDef={{choices : choices}} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test onChange', () => {
        var newValue = "new text";
        var callbacks = {
            onChange : function onChange(target) {
            }
        };
        spyOn(callbacks, 'onChange').and.callThrough();

        component = TestUtils.renderIntoDocument(<TextFieldValueEditor onChange={callbacks.onChange} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const textField = TestUtils.findRenderedDOMComponentWithClass(component, "textField");
        expect(textField).toBeTruthy();
        TestUtils.Simulate.change(textField, {"target": {"value":newValue}});

        expect(callbacks.onChange).toHaveBeenCalledWith(newValue);

    });

    it('test onBlur', () => {
        var newValue = "new text";
        var callbacks = {
            onBlur : function onBlur(target) {
            }
        };
        spyOn(callbacks, 'onBlur').and.callThrough();

        component = TestUtils.renderIntoDocument(<TextFieldValueEditor onBlur={callbacks.onBlur} fieldDef={{datatypeAttributes : {some:'settings'}}}  />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const textField = TestUtils.findRenderedDOMComponentWithClass(component, "textField");
        expect(textField).toBeTruthy();
        TestUtils.Simulate.blur(textField, {"target": {"value":newValue}});
        expect(callbacks.onBlur).toHaveBeenCalledWith({value: newValue, display: newValue});
    });
});

describe('TextFieldValueEditor', () => {
    it('can optionally set a different text input type for better mobile keyboard support (url or phone)', () => {
        let component = TestUtils.renderIntoDocument(<TextFieldValueEditor inputType="tel" />);
        let textInput = ReactDOM.findDOMNode(component);

        expect(textInput.type).toEqual('tel');
    });

    let inputValueTestCases = [
        {
            name: 'uses the display value by default',
            displayValue: 'display',
            rawValue: 'raw',
            expectation: 'display'
        },
        {
            name: 'uses the raw value if the display value is not set',
            displayValue: null,
            rawValue: 'raw',
            expectation: 'raw'
        },
        {
            name: 'uses a blank string if both display value and raw value are null',
            displayValue: null,
            rawValue: null,
            expectation: ''
        },
    ];

    inputValueTestCases.forEach(function(testCase) {
        it(testCase.name, () => {
            let component = TestUtils.renderIntoDocument(<TextFieldValueEditor value={testCase.rawValue}
                                                                               display={testCase.displayValue} />);
            let textInput = ReactDOM.findDOMNode(component);

            expect(textInput.value).toEqual(testCase.expectation);
        });
    });
});
