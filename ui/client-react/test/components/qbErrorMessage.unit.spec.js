import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import QBErrorMessage  from '../../src/components/QBErrorMessage/qbErrorMessage';

describe('QBErrorMessage functions', () => {
    'use strict';

    let component;

    it('test render of default QBErrorMessage component', () => {
        component = TestUtils.renderIntoDocument(<QBErrorMessage message={[]} hidden={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render a list of server side messages', () => {
        let errorMessage = [
            {id: 1, invalidMessage: "error message #1", def: {fieldName: "test field 1"}},
            {id: 2, invalidMessage: "error message #2", def: {fieldName: "test field 2"}},
            {id: 3, invalidMessage: "error message #3", def: {fieldName: "test field 3"}},
            {id: 4, invalidMessage: "error message #4", def: {fieldName: "test field 4"}}
        ];
        component = TestUtils.renderIntoDocument(<QBErrorMessage message={errorMessage} hidden={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const errorRenderResult = ReactDOM.findDOMNode(component).getElementsByClassName("qbErrorMessageItem");
        expect(errorRenderResult.length).toBe(errorMessage.length);
    });

    it('renders a list of client-side validation error messages', () => {
        let errorMessage = [
            {id: 1, invalidMessage: "error message #1", def: {fieldLabel: "test field 1"}},
            {id: 2, invalidMessage: "error message #2", def: {fieldLabel: "test field 2"}}
        ];
        component = TestUtils.renderIntoDocument(<QBErrorMessage  message={errorMessage} hidden={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const errorRenderResult = ReactDOM.findDOMNode(component).getElementsByClassName("qbErrorMessageItem");
        expect(errorRenderResult.length).toBe(errorMessage.length);
    });
});
