import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import EmailFieldValueEditor from '../../src/components/fields/emailFieldValueEditor';


let placeholderText = 'name@domain.com';
let defaultDomain = 'quickbase.com';

function buildMockParent(options = {disabled: false, readOnly: false, initialValue: null}) {
    return React.createClass({
        getInitialState() {
            return {value: options.initialValue, display: null};
        },
        onChange(newValue) {
            this.setState({value: newValue});
        },
        onBlur(newValues) {
            this.setState(newValues);
        },
        render() {
            let fieldDef = {
                datatypeAttributes: {defaultDomain: 'quickbase.com'}
            };

            return <EmailFieldValueEditor value={this.state.value}
                                          display={this.state.display}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                          disabled={options.disabled}
                                          readOnly={options.readOnly}
                                          fieldDef={fieldDef} />;
        }
    });
}

let component, domComponent, emailInput;

describe('EmailFieldValueEditor', () => {
    it('has placeholder text', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        expect(emailInput.placeholder).toEqual(placeholderText);
    });

    it('is editable', () => {
        let updatedEmail = 'test@quickbase.com';

        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        Simulate.change(emailInput, {
            target: {value: updatedEmail}
        });

        expect(component.state.value).toEqual(updatedEmail);
    });

    it('formats the displayed email onBlur', () => {
        let initialValue = 'test';
        let formattedValue = `test@${defaultDomain}`;

        let mockParentElement = buildMockParent({initialValue: initialValue});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        Simulate.blur(emailInput, {
            value: initialValue
        });

        expect(component.state.display).toEqual(formattedValue);
    });

    it('can be cleared', () => {
        let initialValue = 'test@quickbase.com';

        let mockParentElement = buildMockParent({initialValue: initialValue});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        domComponent = ReactDOM.findDOMNode(component);
        let clearButton = domComponent.querySelector('.clearIcon span:first-child');

        Simulate.click(clearButton, {});

        expect(component.state.value).toEqual('');
    });

    it('shows only text when disabled', () => {
        let mockParentElement = buildMockParent({disabled: true});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        expect(emailInput).toBeNull();
    });

    it('shows only text when readOnly', () => {
        let mockParentElement = buildMockParent({readOnly: true});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        expect(emailInput).toBeNull();
    });

    it('uses the value (not the display) for editing', () => {
        // The TextFieldValueEditor defaults to display if both display and value are provided
        // Due to the formatting that occurs on display, it is better for the user to edit the underlying value
        let value = 'value';
        let display = 'display';

        component = TestUtils.renderIntoDocument(<EmailFieldValueEditor value={value} display={display} />);
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        expect(emailInput.value).toEqual(value);
    });
});
