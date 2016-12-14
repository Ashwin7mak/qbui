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
    let domComponent;
    let MockParent = React.createClass({
        getInitialState() {
            return {
                value: null,
            };
        },
        onChange(newValue) {
            this.setState({value: newValue});
        },
        onBlur(updatedValueObject) {
            this.setState(updatedValueObject);
        },
        render() {
            return (
                <PhoneFieldValueEditor value={this.state.value}
                                       onChange={this.onChange}
                                       onBlur={this.onBlur}
                                       fieldDef={{datatypeAttributes: {displayProtocol: false}}}
                                       attributes={this.props.attributes} />
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

    it('allows a user to edit the raw value of a phone', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        domComponent = ReactDOM.findDOMNode(component);
        Simulate.change(domComponent.childNodes[0], {
            target: {value: phoneNumber}
        });
        expect(component.state.value).toEqual(phoneNumber);
    });

    it('allows a user to only enter digits and the following special characters "( ) . - + "', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        domComponent = ReactDOM.findDOMNode(component);
        Simulate.change(domComponent.childNodes[0], {
            target: {value: badInput}
        });
        expect(component.state.value).toEqual(phoneNumberWithSpecialCharacters);
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
        spyOn(mockLocale, 'getMessage').and.callThrough();
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[0].placeholder).toEqual(placeholderText);
        expect(mockLocale.getMessage).toHaveBeenCalledWith('placeholder.phone');
    });

    it('formats the phone number for display onBlur', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
        component.setState({value: phoneNumber});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[0];
        Simulate.blur(input);
        expect(component.state.display).toEqual(phoneNumberWithoutExt);
    });

    it('formats the phone number for display onBlur on extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: rawPhoneNumberWithExtVal});
        domComponent = ReactDOM.findDOMNode(component);
        let input = domComponent.childNodes[2];
        Simulate.blur(input);
        expect(component.state.display).toEqual(phoneNumberWithExt);
    });

    it('displays phone number in phone number input box and ext in extension input box', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumberWithExt});
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[0].value).toEqual(phoneNumberWithoutExt);
        expect(domComponent.childNodes[2].value).toEqual(ext);
    });

    it('renders a single phone input field when all props are null', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={undefined}
                                                             onChange={undefined}
                                                             onBlur={undefined}/>);
        component.setState({value: undefined});
        domComponent = ReactDOM.findDOMNode(component);
        expect(domComponent.childNodes[0].tagName).toEqual("INPUT");
    });

    it('switches focus to the extension if the extension delimiter is pressed', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueEditor attributes={{includeExtension: true}} />);
        component.setState({value: phoneNumberWithExt});

        domComponent = ReactDOM.findDOMNode(component);
        spyOn(component, 'focusOnExtension');

        let phoneInput = domComponent.querySelector('input.officeNumber');
        Simulate.change(phoneInput, {target: {value: phoneNumberFormatter.EXTENSION_DELIM}});

        expect(component.focusOnExtension).toHaveBeenCalled();
    });
});
