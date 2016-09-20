import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import CheckBoxFieldValueEditor from '../../src/components/fields/checkBoxFieldValueEditor';

let I18nMessageMock = React.createClass({
    render() {
        if (this.props.message === 'fields.checkbox.yes') {
            return <span>Yes</span>;
        } else if (this.props.message === 'fields.checkbox.no') {
            return <span>No</span>;
        }
    }
});

function buildMockParent(options = {disabled: false, readOnly: false}) {
    return React.createClass({
        getInitialState() {
            return {value: false};
        },
        onChange(newValue) {
            this.setState({value: newValue});
        },
        render() {
            return <CheckBoxFieldValueEditor value={this.state.value}
                                             onChange={this.onChange}
                                             disabled={options.disabled}
                                             readOnly={options.readOnly} />;
        }
    });
}

let component;

function findElements(query) {
    return ReactDOM.findDOMNode(component).querySelectorAll(query);
};

function it_is_unchecked(){
    let checkbox = findElements('[type="checkbox"]');
    expect(checkbox[0].checked).toBe(false);
}

function it_is_checked() {
    let checkbox = findElements('[type="checkbox"]');
    expect(checkbox[0].checked).toBe(true);
}

function it_does_not_have_a_label() {
    let labels = findElements('label');
    expect(labels[0].textContent).toBe(' ');
}

function it_has_a_label(text) {
    let labels = findElements('label');
    expect(labels[0].textContent).toBe(text);
}

describe('CheckBoxFieldValueEditor', () => {
    it('has a default of an unchecked checkbox without a label', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueEditor />);
        it_is_unchecked();
        it_does_not_have_a_label();
    });

    it('is checked if the value is set to true', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueEditor value={true} />);
        it_is_checked();
        it_does_not_have_a_label();
    });

    it('toggles the value when clicked', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        let domComponent = ReactDOM.findDOMNode(component).querySelector('label');

        Simulate.click(domComponent);
        expect(component.state.value).toBe(true);

        Simulate.click(domComponent);
        expect(component.state.value).toBe(false);
    });

    it('toggles the value when the spacebar key is pressed while focused on checkbox', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        let domComponent = ReactDOM.findDOMNode(component).querySelector('label');

        Simulate.keyDown(domComponent, {keyCode: 32});
        expect(component.state.value).toBe(true);
    });

    it('does not toggle the value when other keys are pressed', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
        let domComponent = ReactDOM.findDOMNode(component).querySelector('label');

        // Test for backspace key
        Simulate.keyDown(domComponent, {keyCode: 8});
        expect(component.state.value).toBe(false);

        // Test for tab key
        Simulate.keyDown(domComponent, {key: 9});
        expect(component.state.value).toBe(false);

        // Test for enter key
        Simulate.keyDown(domComponent, {key: 13});
        expect(component.state.value).toBe(false);
    });

    it('displays an asterisk if the checkbox is required', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueEditor required={true} />);

        let asterisk = findElements('.required-symbol');
        expect(asterisk.length).toBe(1);
        expect(asterisk[0].textContent).toBe('*');
    });

    it('asterisk is hidden when a checkbox is not required', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueEditor required={false} />);

        let asterisk = findElements('.required-symbol');
        expect(asterisk.length).toBe(0);
    });

    it('has a red border if the checkbox is invalid', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueEditor invalid={true} />);

        let invalidCheckBox = findElements('.invalid');
        expect(invalidCheckBox.length).toBe(1);
    });

    it('does not have a red border when the checkbox is valid', () => {
        component = TestUtils.renderIntoDocument(<CheckBoxFieldValueEditor invalid={false} />);

        let invalidCheckBox = findElements('.invalid');
        expect(invalidCheckBox.length).toBe(0);
    });

    it('cannot be edited when the checkbox is disabled', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent({disabled: true})));
        let domComponent = ReactDOM.findDOMNode(component).querySelector('label');

        Simulate.click(domComponent);
        expect(component.state.value).toBe(false);
    });

    it('cannot be edited when the checkbox is read only', () => {
        component = TestUtils.renderIntoDocument(React.createElement(buildMockParent({readOnly: true})));
        let domComponent = ReactDOM.findDOMNode(component).querySelector('label');

        Simulate.click(domComponent);
        expect(component.state.value).toBe(false);
    });
});
