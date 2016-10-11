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

    it('validates an email if validateFieldValue is enabled', () => {
        let email = 'test@email.com';
        let mockParent = {
            onValidated(result) {
                return result;
            }
        };
        let fieldDef = {
            headerName: 'email'
        };

        spyOn(mockParent, 'onValidated');

        component = TestUtils.renderIntoDocument(<EmailFieldValueEditor value={email}
                                                                        fieldDef={fieldDef}
                                                                        onValidated={mockParent.onValidated}
                                                                        validateFieldValue={true} />);
        emailInput = ReactDOM.findDOMNode(component).querySelector('input');

        Simulate.blur(emailInput, {
            value: email
        });

        expect(mockParent.onValidated).toHaveBeenCalledWith({
            isInvalid: false,
            invalidMessage: 'Format the email like name@domain.com'
        });
    });
});
