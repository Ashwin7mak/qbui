import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import DurationFieldValueEditor from '../../src/components/fields/durationFieldValueEditor';
import {DURATION_CONSTS} from '../../../common/src/constants';
import moment from 'moment';
import bigDecimal from 'bigdecimal';




describe('DurationFieldValueEditor', () => {
    let component;
    let domComponent;
    let numValue = 55;
    let MockParent = React.createClass({
        getInitialState() {
            return {
                value: null,
                display: null
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
                <DurationFieldValueEditor value={this.state.value}
                                          display={this.state.display}
                                          onChange={this.onChange}
                                          onBlur={this.onBlur}
                                          scale = {this.props.scale}
                                          fieldDef={{datatypeAttributes: {displayProtocol: false}}}
                                          attributes={this.props.attributes}/>
            );
        }
    });

    fit('converts an input of seconds to minutes', () => {
        component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: DURATION_CONSTS.MINUTES}} />);
        domComponent = ReactDOM.findDOMNode(component);
        Simulate.change(domComponent, {
            target: {value: numValue + ' ' + DURATION_CONSTS.SECONDS}
        });
        Simulate.blur(domComponent);
        let expectedMinutes;
        let expectedMilliSeconds = moment.duration(numValue, 'seconds').asMilliseconds();
        let newExpectedMilliSeconds = new bigDecimal.BigDecimal(expectedMilliSeconds.toString());
        expectedMinutes = newExpectedMilliSeconds.divide(DURATION_CONSTS.MILLIS_PER_MIN, DURATION_CONSTS.DEFAULT_DECIMAL_PLACES,  bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toPlainString();
        debugger;
        expect(component.state.value).toEqual(expectedMilliSeconds);
        expect(component.state.display).toEqual(expectedMinutes);
    });
    //
    // it('renders an extension input box if includeExtension is true', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}}/>);
    //     domComponent = ReactDOM.findDOMNode(component);
    //     expect(domComponent.childNodes.length).toEqual(3);
    // });
    // it('does not render an extension input box if includeExtension is not defined', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent />);
    //     domComponent = ReactDOM.findDOMNode(component);
    //     expect(domComponent.childNodes.length).toEqual(1);
    // });
    // it('does not render an extension input box if includeExtension is false', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
    //     domComponent = ReactDOM.findDOMNode(component);
    //     expect(domComponent.childNodes.length).toEqual(1);
    // });
    // it('has placeholder text', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
    //     domComponent = ReactDOM.findDOMNode(component);
    //     expect(domComponent.childNodes[0].placeholder).toEqual(placeholderText);
    // });
    //
    // it('formats the phone number for display onBlur', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: false}} />);
    //     component.setState({value: phoneNumber, display: ''});
    //     domComponent = ReactDOM.findDOMNode(component);
    //     let input = domComponent.childNodes[0];
    //     Simulate.blur(input);
    //     expect(component.state.display).toEqual(phoneNumberWithoutExt);
    // });
    // it('formats the phone number for display onBlur on extension input box', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
    //     component.setState({value: rawPhoneNumberWithExtVal, display: ''});
    //     domComponent = ReactDOM.findDOMNode(component);
    //     let input = domComponent.childNodes[2];
    //     Simulate.blur(input);
    //     expect(component.state.display).toEqual(phoneNumberWithExt);
    // });
    // it('displays phone number in phone number input box and ext in extension input box', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{includeExtension: true}} />);
    //     component.setState({value: phoneNumber, display: phoneNumberWithExt});
    //     domComponent = ReactDOM.findDOMNode(component);
    //     expect(domComponent.childNodes[0].value).toEqual(phoneNumberWithoutExt);
    //     expect(domComponent.childNodes[2].value).toEqual(ext);
    // });
});
