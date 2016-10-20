import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import QBErrorMessage  from '../../src/components/QBErrorMessage/qbErrorMessage';

describe('QBErrorMessage functions', () => {
    'use strict';

    let component;

    let flux = {
    };

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<QBErrorMessage flux={flux} message={[]} hidden={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    // it('test render a list of server side messages', () => {
    //     let errorMessage = [
    //         {id: 1, invalidMessage: "error message #1"},
    //         {id: 2, invalidMessage: "error message #2"},
    //         {id: 3, invalidMessage: "error message #3"},
    //         {id: 4, invalidMessage: "error message #4"},
    //     ];
    //     component = TestUtils.renderIntoDocument(<QBErrorMessage flux={flux} message={errorMessage} hidden={false}/>);
    //     expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    //
    //     ReactDOM.findDOMNode(component).getElementsByClassName("qbErrorMessageItem").forEach(
    //         function(panel, idx) {
    //         });
    //
    // });
});
