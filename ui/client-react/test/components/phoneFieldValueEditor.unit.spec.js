import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import PhoneFieldValueEditor from '../../src/components/fields/phoneFieldValueEditor';

describe('PhoneFieldValueEditor', () => {
    const phoneNumber = "5555555555";
    const phoneNumberWithoutExt = "(555) 555-5555";
    const phoneNumberWithExt = "(555) 555-5555 x5555";
    const placeholderText = "(xxx) xxx-xxxx";
    const ext = "5555"
    let component;
    let domComponent;
    let MockParent = React.createClass({
        getInitialState() {
            return {
                phone: null,
                displayNumber: phoneNumberWithoutExt,
            };
        },
        onChange(newValue) {
            this.setState({phone: newValue});
        },
        onBlur(updatedValueObject) {
            this.setState(updatedValueObject);
        },
        render() {
            return (
                <PhoneFieldValueEditor value={this.state.value}
                                       display={this.state.display}
                                       onChange={this.onChange}
                                       onBlur={this.onBlur}
                                       fieldDef={{datatypeAttributes: {displayProtocol: false}}}
                                       attributes={this.props.attributes} />
            );
        }
    });

    it('allows a user to edit the raw value of a phone', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        domComponent = ReactDOM.findDOMNode(component);
        Simulate.change(domComponent.childNodes[0], {
            target: {value: phoneNumber}
        });
        expect(component.state.phone).toEqual(phoneNumber);
        expect(component.state.displayNumber).toEqual(phoneNumberWithoutExt);
    });

    it('renders an extension input box if includeExtension is true', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}}/>);
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[2].classList[3]).toEqual("extNumber");
    });

    it('does not render an extension input box if includeExtension is false', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes.length).toEqual(1);
    });
    it('has placeholder text', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[0].placeholder).toEqual(placeholderText);
    });

    it('formats the phone for display onBlur', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        component.setState({value: phoneNumber, display: ''});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[0];
        Simulate.blur(input, {
            target: {value: phoneNumber}
        });
        expect(component.state.display).toEqual(phoneNumberWithoutExt);
    });

    fit('displays phone number in phone number input box and ext in extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumber, display: phoneNumberWithExt});
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[0].value).toEqual(phoneNumberWithoutExt);
        expect(domComponent.childNodes[2].value).toEqual(ext);
    });
});
