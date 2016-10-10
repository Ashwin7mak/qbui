import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import EmailFieldValueEditor from '../../src/components/fields/emailFieldValueEditor';


let placeholderText = 'name@domain.com';
let defaultDomain = 'quickbase.com';

let I18nMessageMock = React.createClass({
    render() {
        return <span>Clear text</span>;
    }
});

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

let component, domComponent;

describe('EmailFieldValueEditor', () => {
    it('has placeholder text', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        domComponent = ReactDOM.findDOMNode(component).querySelector('input');

        expect(domComponent.placeholder).toEqual(placeholderText);
    });

    it('is editable', () => {
        let updatedEmail = 'test@quickbase.com';

        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        domComponent = ReactDOM.findDOMNode(component).querySelector('input');

        Simulate.change(domComponent, {
            target: {value: updatedEmail}
        });

        expect(component.state.value).toEqual(updatedEmail);
    });

    it('formats the displayed email onBlur', () => {
        let initialValue = 'test';
        let formattedValue = `test@${defaultDomain}`;

        let mockParentElement = buildMockParent({initialValue: initialValue});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        domComponent = ReactDOM.findDOMNode(component).querySelector('input');

        Simulate.blur(domComponent, {
            value: initialValue
        });

        expect(component.state.display).toEqual(formattedValue);
    });

    it('can be cleared', () => {
        let initialValue = 'test@quickbase.com';

        let mockParentElement = buildMockParent({initialValue: initialValue});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        domComponent = ReactDOM.findDOMNode(component);
        let clearButton = domComponent.querySelector('.deleteIcon span:first-child');

        Simulate.click(clearButton, {});

        expect(component.state.value).toEqual('');
    });

    it('shows only text when disabled', () => {
        let mockParentElement = buildMockParent({disabled: true});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        domComponent = ReactDOM.findDOMNode(component).querySelector('input');

        expect(domComponent).toBeNull();
    });

    it('shows only text when readOnly', () => {
        let mockParentElement = buildMockParent({readOnly: true});
        component = TestUtils.renderIntoDocument(React.createElement(mockParentElement));
        domComponent = ReactDOM.findDOMNode(component).querySelector('input');

        expect(domComponent).toBeNull();
    });
});
