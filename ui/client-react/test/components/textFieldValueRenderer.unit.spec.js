import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import TextFieldValueRenderer from "../../src/components/fields/textFieldValueRenderer";

describe('TextFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with value', () => {
        let text = "testing testing 1 2 3";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer value={text}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer).toHaveText(text);
    });

    it('test render of component with bold', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer value={text} isBold={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('bold')).toBeTruthy();
    });

    it('test render of component with added className', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer value={text} classes="unitTesting" />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('unitTesting')).toBeTruthy();
    });

    it('test render of component with html allowed', () => {
        let text = "some text <i>italic</i>";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer attributes={{htmlAllowed : true}} value={text} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        let italic = ReactDOM.findDOMNode(textFieldValueRenderer).querySelectorAll("i");
        expect(italic.length).toBe(1);
    });

    it('test render of component with no html allowed', () => {
        let text = "some text <i>italic</i>";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer attributes={{htmlAllowed : false}} value={text} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        let italic = ReactDOM.findDOMNode(textFieldValueRenderer).querySelectorAll("i");
        expect(italic.length).toBe(0);
    });


});
