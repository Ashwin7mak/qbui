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
    const placeholderText = '(xxx) xxx-xxxx';
    const ext = "5555";
    let component;
    let phoneNumberNode;
    let extentionNode;
    let MockParent = React.createClass({
        getInitialState() {
            return {
                value: null,
                display: null
            };
        },
        onChange(newValue) {
            this.setState({value: newValue, display: newValue});
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
                                       attributes={this.props.attributes}
                                       ref="phoneField" />
            );
        }
    });

    const mockLocale = {
        getMessage(_messageKey) {
            return placeholderText;
        }
    };

    beforeAll(() => {
        PhoneFieldValueEditor.__Rewire__('Locale', mockLocale);
    });

    afterAll(() => {
        PhoneFieldValueEditor.__ResetDependency__('Locale');
    });

    it('allows a user to edit the value of a phone number', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');
        Simulate.change(phoneNumberNode, {
            target: {value: phoneNumber}
        });
        expect(component.state.value).toEqual(phoneNumber);
    });

    it('allows a user to edit extra digits beyond the phone number', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueEditor display={{display: '8675309', extraDigits: '1234'}} />);
        let phoneInput = TestUtils.findRenderedDOMComponentWithClass(component, 'textField');

        expect(phoneInput.value).toEqual('8675309 1234');
    });

    it('allows a user to only enter digits and the following special characters "( ) . - + "', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');
        Simulate.change(phoneNumberNode, {
            target: {value: badInput}
        });
        expect(component.state.value).toEqual(phoneNumberWithSpecialCharacters);
    });

    it('renders an extension input box if includeExtension is true', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}}/>);
        extentionNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.extention, 'input');
        expect(extentionNode).toBeTruthy();
    });

    it('does not render an extension input box if includeExtension is not defined', () => {
        component = TestUtils.renderIntoDocument(<MockParent />);
        expect(component.refs.phoneField.refs.extention).toBeFalsy();
    });

    it('does not render an extension input box if includeExtension is false', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        expect(component.refs.phoneField.refs.extention).toBeFalsy();
    });

    it('has placeholder text', () => {
        spyOn(mockLocale, 'getMessage').and.callThrough();
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');

        expect(phoneNumberNode.placeholder).toEqual(placeholderText);
        expect(mockLocale.getMessage).toHaveBeenCalledWith('placeholder.phone');
    });

    it('formats the phone number for display onBlur', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        component.setState({value: phoneNumber});
        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');
        Simulate.blur(phoneNumberNode);

        expect(component.state.display).toEqual(phoneNumberWithoutExt);
    });

    it('formats an international phone number for display onBlur', () => {
        const internationalNumber = '+33968686868';
        const formattedInternationalNumber = '+33 9 68 68 68 68';

        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        component.setState({value: internationalNumber});

        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');

        Simulate.blur(phoneNumberNode);

        expect(component.state.display).toEqual(formattedInternationalNumber);
    });

    it('formats the phone number for display onBlur on extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: rawPhoneNumberWithExtVal});

        extentionNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.extention, 'input');
        Simulate.blur(extentionNode);
        expect(component.state.display).toEqual(phoneNumberWithExt);
    });

    it('displays phone number in phone number input box and ext in extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumberWithExt, display: phoneNumberWithExt});
        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');
        extentionNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.extention, 'input');
        // There is an extra space in the input, because extra spaces are not trimmed until blur so that users
        // can enter spaces as needed until the value is formatted
        expect(phoneNumberNode.value).toEqual(phoneNumberWithoutExt + ' ');
        expect(extentionNode.value).toEqual(ext);
    });

    it('allows a user to edit the phone number without clearing the extension', () => {
        let updatedPhoneNumber = '8675309';
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumberWithExt, display: {display: phoneNumberWithoutExt, extension: ext}});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[0];

        Simulate.change(input, {target: {value: updatedPhoneNumber}});

        expect(domComponent.childNodes[0].value).toEqual(updatedPhoneNumber);
        expect(domComponent.childNodes[2].value).toEqual(ext);
    });

    it('allows a user to edit the extension first without clearing the main phone number', () => {
        let updatedExtension = '5678';
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumberWithExt, display: {display: phoneNumberWithoutExt, extension: ext}});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[2];

        Simulate.change(input, {target: {value: updatedExtension}});

        expect(domComponent.childNodes[0].value).toEqual(phoneNumberWithoutExt);
        expect(domComponent.childNodes[2].value).toEqual(updatedExtension);
    });

    it('renders a single phone input field when all props are null', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={undefined}
                                                             onChange={undefined}
                                                             onBlur={undefined}/>);
        component.setState({value: undefined});
        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneField.refs.phoneNumber, 'input');
        expect(phoneNumberNode.tagName).toEqual("INPUT");
    });

    it('switches focus to the extension if the extension delimiter is pressed', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueEditor attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumberWithExt});

        phoneNumberNode = TestUtils.findRenderedDOMComponentWithTag(component.refs.phoneNumber, 'input');
        spyOn(component, 'focusOnExtension');

        Simulate.change(phoneNumberNode, {target: {value: phoneNumberFormatter.EXTENSION_DELIM}});

        expect(component.focusOnExtension).toHaveBeenCalled();
    });
});
