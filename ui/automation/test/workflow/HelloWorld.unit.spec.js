import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from '../../src/workflow/HelloWorld';
import AutomationBundleLoader from '../../src/locales/automationBundleLoader';
import TestUtils from 'react-addons-test-utils';

describe('HelloWorld', () => {
    beforeEach(() => {
        AutomationBundleLoader.changeLocale('en-us');
    });

    it("should set the appropriate props on its children", () => {
        const helloWorldApp = TestUtils.renderIntoDocument(<HelloWorld/>);
        const inputNode = ReactDOM.findDOMNode(helloWorldApp.refs.input);

        const newValue = 'Hello Automation Team';
        inputNode.value = newValue;
        TestUtils.Simulate.change(inputNode);

        const nameNode = ReactDOM.findDOMNode(helloWorldApp.refs.name);
        expect(nameNode.textContent).toEqual(newValue);
    });
});
