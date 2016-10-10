import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import EmailFieldValueRenderer from '../../src/components/fields/emailFieldValueRenderer';

let defaultProtocol = 'mailto:';
let emailIconClass = '.iconTableUISturdy-mail';

let testEmail = 'mailto:test@quickbase.com';
let testEmailWithoutProtocol = 'test@quickbase.com';

let component, domComponent;


describe('EmailFieldValueRenderer', () => {
    it('displays an email as a link with an email icon', () => {
        component = TestUtils.renderIntoDocument(<EmailFieldValueRenderer display={testEmail} />);
        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        let linkText = domComponent.querySelector('.link');
        let icon = domComponent.querySelector(emailIconClass);

        expect(domComponent.href).toEqual(testEmail);
        expect(linkText.textContent).toEqual(testEmail);
        expect(icon).not.toBeNull();
    });

    it('adds a protocol to the link if one is not provided', () => {
        component = TestUtils.renderIntoDocument(<EmailFieldValueRenderer display={testEmailWithoutProtocol}/>);
        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        let linkText = domComponent.querySelector('.link');

        expect(domComponent.href).toEqual(defaultProtocol + testEmailWithoutProtocol);
        expect(linkText.textContent).toEqual(testEmailWithoutProtocol);
    });
});
