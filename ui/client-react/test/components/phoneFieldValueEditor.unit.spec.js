import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import * as phoneNumberFormatter from '../../../common/src/formatter/phoneNumberFormatter';
import PhoneFieldValueEditor from '../../src/components/fields/phoneFieldValueEditor';

describe('PhoneFieldValueEditor', () => {
    const phoneNumber = "5555555555";
    const rawPhoneNumberWithExtVal = "5555555555x5555";
    const phoneNumberWithoutExt = "(555) 555-5555";
    const phoneNumberWithExt = "(555) 555-5555 x5555";
    const phoneNumberWithSpecialCharacters = "+1 (555) 555-5555.";
    const badInput =  "+1 abc(555)!!! 555-5555.:::fffeee";
    const placeholderText = phoneNumberFormatter.PLACEHOLDER;
    const ext = "5555";
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

    it('allows a user to only enter digits and the following special characters "( ) . - + "', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        domComponent = ReactDOM.findDOMNode(component);
        Simulate.change(domComponent.childNodes[0], {
            target: {value: badInput}
        });
        expect(component.state.phone).toEqual(phoneNumberWithSpecialCharacters);
    });

    it('renders an extension input box if includeExtension is true', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}}/>);
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[2].classList[3]).toEqual("extNumber");
    });
    it('does not render an extension input box if includeExtension is not defined', () => {
        component = TestUtils.renderIntoDocument(<MockParent />);
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes.length).toEqual(1);
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

    it('formats the phone number for display onBlur', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        component.setState({value: phoneNumber, display: ''});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[0];
        Simulate.blur(input);
        expect(component.state.display).toEqual(phoneNumberWithoutExt);
    });
    it('formats the phone number for display onBlur on extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: rawPhoneNumberWithExtVal, display: ''});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[2];
        Simulate.blur(input);
        expect(component.state.display).toEqual(phoneNumberWithExt);
    });
    it('displays phone number in phone number input box and ext in extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumber, display: phoneNumberWithExt});
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[0].value).toEqual(phoneNumberWithoutExt);
        expect(domComponent.childNodes[2].value).toEqual(ext);
    });
});
