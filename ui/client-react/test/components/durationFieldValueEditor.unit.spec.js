import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import DurationFieldValueEditor from '../../src/components/fields/durationFieldValueEditor';
import TestData from './durationFieldValueEditorTestData';
import {DURATION_CONSTS} from '../../../common/src/constants';
import moment from 'moment';
import bigDecimal from 'bigdecimal';

fdescribe('DurationFieldValueEditor', () => {
    let component;
    let domComponent;
    let divideBigDecimal = function(numerator, millis) {
        return numerator.divide(millis, DURATION_CONSTS.DEFAULT_DECIMAL_PLACES,  bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toPlainString();
    };
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

    TestData.dataProvider.forEach(function(test) {
        it('converts a user input of ' + test.type + ' to  ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            domComponent = ReactDOM.findDOMNode(component);
            let userInput = test.numValue + ' ' + test.type;
            if (test.type === '') {
                userInput = test.numValue;
            }
            Simulate.change(domComponent, {
                target: {value: userInput}
            });
            Simulate.blur(domComponent);
            let expectedResult;
            let type = test.type;
            if (type === '') {
                type = test.scale;
            }
            let expectedMilliSeconds = moment.duration(test.numValue, type).asMilliseconds();
            let newExpectedMilliSeconds = new bigDecimal.BigDecimal(expectedMilliSeconds.toString());
            expectedResult = divideBigDecimal(newExpectedMilliSeconds, test.MILLIS_PER_SCALE);
            expect(component.state.value).toEqual(expectedMilliSeconds);
            expect(component.state.display).toEqual(expectedResult);
        });
    });
    // fit('converts an input of seconds to minutes', () => {
    //     component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: DURATION_CONSTS.MINUTES}} />);
    //     domComponent = ReactDOM.findDOMNode(component);
    //     Simulate.change(domComponent, {
    //         target: {value: numValue + ' ' + DURATION_CONSTS.SECONDS}
    //     });
    //     Simulate.blur(domComponent);
    //     let expectedMinutes;
    //     let expectedMilliSeconds = moment.duration(numValue, 'seconds').asMilliseconds();
    //     let newExpectedMilliSeconds = new bigDecimal.BigDecimal(expectedMilliSeconds.toString());
    //     expectedMinutes = newExpectedMilliSeconds.divide(DURATION_CONSTS.MILLIS_PER_MIN, DURATION_CONSTS.DEFAULT_DECIMAL_PLACES,  bigDecimal.RoundingMode.HALF_UP()).stripTrailingZeros().toPlainString();
    //     debugger;
    //     expect(component.state.value).toEqual(expectedMilliSeconds);
    //     expect(component.state.display).toEqual(expectedMinutes);
    // });
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
