import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import DurationFieldValueEditor from '../../src/components/fields/durationFieldValueEditor';
import DurationEditorParsing from '../../src/components/fields/durationEditorParsing';
import TestData from './durationFieldValueEditorTestData';
import {DURATION_CONSTS} from '../../../common/src/constants';
import durationFormatter from '../../../common/src/formatter/durationFormatter';
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
                                          attributes={this.props.attributes}
                                          includeUnits={this.props.includeUnits}/>
            );
        }
    });

    TestData.dataProvider.forEach(function(test) {
        fit('converts a user input of ' + test.numValue + ' ' + test.type + ' to  ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let userInput = test.numValue + ' ' + test.type;
            if (test.type === undefined) {
                userInput = test.numValue;
            }
            let input = ReactDOM.findDOMNode(component);
            Simulate.change(input, {
                target: {value: userInput}
            });
            Simulate.blur(input, {
                value: userInput
            });
            let totalMilliSeconds = test.numValue * test.MILLIS_PER_TYPE;
            let convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
            let expectedResult = divideBigDecimal(convertedMilliSeconds, test.MILLIS_PER_SCALE);
            expect(component.state.value).toEqual(totalMilliSeconds);
            expect(component.state.display).toEqual(expectedResult);
        });
    });

    TestData.multiInputData.forEach(function(test) {
        it('converts a multi input of ' + test.description + ' to  ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let input = ReactDOM.findDOMNode(component);
            let userInput = '';
            let totalMilliSeconds = 0;
            let firstInputTotalMilliSeconds = 0;
            let secondInputTotalMilliSeconds = 0;
            let thirdInputMilliSeconds = 0;
            let convertedMilliSeconds;
            let convertedResult;
            if (test.multiInput.firstInput) {
                userInput += test.numValue + ' ' + test.multiInput.firstInput;
                firstInputTotalMilliSeconds = test.numValue * test.MILLIS_PER_TYPE.firstInput;
            }

            if (test.multiInput.secondInput) {
                userInput += ' ' + test.numValue + ' ' + test.multiInput.secondInput;
                secondInputTotalMilliSeconds = test.numValue * test.MILLIS_PER_TYPE.secondInput;
            }

            if (test.multiInput.thirdInput) {
                userInput += ' ' + test.numValue + ' ' + test.multiInput.thirdInput;
                thirdInputMilliSeconds = test.numValue * test.MILLIS_PER_TYPE.thirdInput;
            }
            //component.setState({value: userInput, display: ''});
            Simulate.change(input, {
                target: {value: userInput}
            });
            Simulate.blur(input);
            totalMilliSeconds += firstInputTotalMilliSeconds + secondInputTotalMilliSeconds + thirdInputMilliSeconds;
            convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
            convertedResult = divideBigDecimal(convertedMilliSeconds, test.MILLIS_PER_SCALE);
            expect(component.state.value).toEqual(totalMilliSeconds);
            expect(component.state.display).toEqual(convertedResult);
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
            let input = ReactDOM.findDOMNode(component);
            let seconds = 0;
            let minutes = 0;
            let hours = 0;
            Simulate.change(input, {
                target: {value: test.timeFormatVal}
            });
            Simulate.blur(input);
            if (test.SS) {
                seconds = test.SS * DURATION_CONSTS.MILLIS_PER_SECOND;
            }
            if (test.MM) {
                minutes = test.MM * DURATION_CONSTS.MILLIS_PER_MIN;
            }
            if (test.HH) {
                hours = test.HH * DURATION_CONSTS.MILLIS_PER_HOUR;
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
            let input = ReactDOM.findDOMNode(component);
            Simulate.change(input, {
                target: {value: userInput}
            });
            Simulate.blur(input);
            let totalMilliSeconds = test.numValue * test.MILLIS_PER_TYPE;
            let convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
            let expectedTimeFormat = durationFormatter.format({value:convertedMilliSeconds}, test);
            expect(component.state.display).toEqual(expectedTimeFormat);
        });
    });
    /**
     * If a user enters an invalid input, it returns the value to the user without any conversion
     * */
    TestData.invalidInput.forEach(function(test) {
        it('throws a validation error with an invalid input of ' + test.invalidInput, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let userInput = test.invalidInput;
            domComponent = ReactDOM.findDOMNode(component);
            let input = ReactDOM.findDOMNode(domComponent);
            Simulate.change(input, {
                target: {value: userInput}
            });
            Simulate.blur(input, {
                target:{value: test.invalidInput}
            });
            expect(component.state.display).toEqual(test.invalidInput);
        });
    });
    TestData.dataProvider.forEach(function(test) {
        it('displays value and scale on form edit', () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} includeUnits={true}/>);
            let userInput = test.numValue + ' ' + test.type;
            if (test.type === undefined) {
                userInput = test.numValue;
            }
            let input = ReactDOM.findDOMNode(component);
            Simulate.change(input, {
                target: {value: userInput}
            });
            Simulate.blur(input, {
                value: userInput
            });
            let result = component.state.display.replace(/[0-9.:]+/g, '').trim();
            let expectedResult = DurationEditorParsing.getPlaceholder(test.scale);
            expect(result).toEqual(expectedResult);
        });
    });
});
