import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import DurationFieldValueEditor from '../../src/components/fields/durationFieldValueEditor';
import TestData from './durationFieldValueEditorTestData';
import {DURATION_CONSTS} from '../../../common/src/constants';
import durationFormatter from '../../../common/src/formatter/durationFormatter';
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
                                          attributes={this.props.attributes} />
            );
        }
    });

    TestData.dataProvider.forEach(function(test) {
        it('converts a user input of ' + test.numValue + ' ' + test.type + ' to  ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let userInput = test.numValue + ' ' + test.type;
            if (test.type === undefined) {
                userInput = test.numValue;
            }
            component.setState({value: userInput, display: ''});
            let input = ReactDOM.findDOMNode(component);
            Simulate.blur(input);
            let totalMilliSeconds = moment.duration(test.numValue, test.momentJSTYPE).asMilliseconds();
            let convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
            let expectedResult = divideBigDecimal(convertedMilliSeconds, test.MILLIS_PER_SCALE);
            expect(component.state.value).toEqual(totalMilliSeconds);
            expect(component.state.display).toEqual(expectedResult);
        });
    });

    TestData.placeholderData.forEach(function(test) {
        it('displays the correct placeholder for ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            domComponent = ReactDOM.findDOMNode(component);
            expect(domComponent.placeholder).toEqual(test.placeholder);
        });
    });

    TestData.timeFormatData.forEach(function(test) {
        it('converts ' + test.timeFormatVal + ' to ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            domComponent = ReactDOM.findDOMNode(component);
            let seconds = 0;
            let minutes = 0;
            let hours = 0;
            Simulate.change(domComponent, {
                target: {value: test.timeFormatVal}
            });
            Simulate.blur(domComponent);
            if (test.SS) {
                seconds = moment.duration(test.SS, 'Seconds').asMilliseconds();
            }
            if (test.MM) {
                minutes = moment.duration(test.MM, 'Minutes').asMilliseconds();
            }
            if (test.HH) {
                hours = moment.duration(test.HH, 'Hours').asMilliseconds();
            }
            let totalMilliSeconds = seconds + minutes + hours;
            let convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
            let expectedResult = divideBigDecimal(convertedMilliSeconds, test.MILLIS_PER_SCALE);
            expect(component.state.value).toEqual(totalMilliSeconds);
            expect(component.state.display).toEqual(expectedResult);
        });
    });
    TestData.timeFormatDataProvider.forEach(function(test) {
        it('converts a user input of ' + test.numValue + ' ' + test.type + ' to  ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let userInput = test.numValue + ' ' + test.type;
            if (test.type === undefined) {
                userInput = test.numValue;
            }
            component.setState({value: userInput, display: ''});
            let input = ReactDOM.findDOMNode(component);
            Simulate.blur(input);
            let totalMilliSeconds = moment.duration(test.numValue, test.momentJSTYPE).asMilliseconds();
            let convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
            let expectedTimeFormat = durationFormatter.format({value:convertedMilliSeconds}, test);
            expect(component.state.display).toEqual(expectedTimeFormat);
        });
    });
    TestData.invalidInput.forEach(function(test) {
        fit('throws a validation error with an invalid input of ' + test.invalidInput, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let userInput = test.invalidInput;
            component.setState({value: userInput, display: ''});
            domComponent = ReactDOM.findDOMNode(component);
            let input = ReactDOM.findDOMNode(domComponent);
            Simulate.blur(input, {
                target:{value: test.invalidInput}
            });
            // debugger;
            expect(component.state.display).toEqual(test.invalidInput);
        });
    });
});
