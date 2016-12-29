import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import DurationFieldValueEditor from '../../src/components/fields/durationFieldValueEditor';
import DurationEditorParsing from '../../src/components/fields/durationEditorParsing';
import {DURATION_CONSTS} from '../../../common/src/constants';
import durationFormatter from '../../../common/src/formatter/durationFormatter';
import bigDecimal from 'bigdecimal';
import Locale from '../../src/locales/locales';

// gen a repeatable seed for random values, so it can be reproduced
var Chance = require('chance');
var seed = new Chance().integer({min: 1, max: 1000000000});
var chance = new Chance(seed);
var TestData = require('./durationFieldValueEditorTestData')(chance);
let languages = [
    'en-us',
    'fr-fr',
    'de-de'
];

describe('DurationFieldValueEditor seed:' + (seed), () => {
    beforeEach(function() {
        Locale.changeLocale('en-us');
    });
    afterEach(function() {
        Locale.changeLocale('en-us');
    });
    let component;
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
    languages.forEach(function(language) {
        TestData.multiInputData.forEach(function(test) {
            it('(' + language + ') converts a multi input of ' + test.description + ' to  ' + test.scale, () => {
                Locale.changeLocale(language);
                Locale.getI18nBundle();
                component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
                let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
                let userInput = '';
                let totalMilliSeconds = 0;
                let firstInputTotalMilliSeconds = 0;
                let secondInputTotalMilliSeconds = 0;
                let thirdInputMilliSeconds = 0;
                let convertedMilliSeconds;
                let convertedResult;
                if (test.multiInput.firstInput) {
                    userInput += test.numValue + ' ' + Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.multiInput.firstInput);
                    firstInputTotalMilliSeconds = test.numValue * test.MILLIS_PER_TYPE.firstInput;
                }

                if (test.multiInput.secondInput) {
                    userInput += ' ' + test.numValue + ' ' + Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.multiInput.secondInput);
                    secondInputTotalMilliSeconds = test.numValue * test.MILLIS_PER_TYPE.secondInput;
                }

                if (test.multiInput.thirdInput) {
                    userInput += ' ' + test.numValue + ' ' + Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.multiInput.thirdInput);
                    thirdInputMilliSeconds = test.numValue * test.MILLIS_PER_TYPE.thirdInput;
                }
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
            it('(' + language + ') displays the correct placeholder for ' + test.scale + ' in French', () => {
                Locale.changeLocale(language);
                Locale.getI18nBundle();
                let localeType = Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.placeholder);
                if (localeType === undefined) {
                    localeType = test.placeholder || '';
                }
                component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
                let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
                expect(input.placeholder).toEqual(localeType);
            });
        });
        TestData.dataProvider.forEach(function(test) {
            it('(' + language + ') converts a user input of ' + -test.numValue + ' ' + test.type + ' to  ' + test.scale, () => {
                Locale.changeLocale(language);
                Locale.getI18nBundle();
                let localeType = Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.type);
                component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
                let userInput = -test.numValue + ' ' + (localeType || '');
                let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
                Simulate.change(input, {
                    target: {value: userInput}
                });
                Simulate.blur(input, {
                    value: userInput
                });
                let totalMilliSeconds = -test.numValue * test.MILLIS_PER_TYPE;
                let convertedMilliSeconds = new bigDecimal.BigDecimal(totalMilliSeconds.toString());
                let expectedResult = divideBigDecimal(convertedMilliSeconds, test.MILLIS_PER_SCALE);
                expect(component.state.value).toEqual(totalMilliSeconds);
                expect(component.state.display).toEqual(expectedResult);
            });
            it('(' + language + ') converts a user input of ' + test.numValue + ' ' + test.type + ' to  ' + test.scale, () => {
                Locale.changeLocale(language);
                Locale.getI18nBundle();
                let localeType = Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.type);
                component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
                let userInput = test.numValue + ' ' + (localeType || '');
                let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
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
            it('(' + language + ') displays value and scale on form edit', () => {
                Locale.changeLocale(language);
                Locale.getI18nBundle();
                let localeType = Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.type);
                component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} includeUnits={true}/>);
                let userInput = test.numValue + (localeType || '');
                let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
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
        TestData.timeFormatDataProvider.forEach(function(test) {
            it('(' + language + ') converts a user input of ' + test.numValue + ' ' + test.type + ' to  ' + test.scale, () => {
                Locale.changeLocale(language);
                Locale.getI18nBundle();
                let localeType = Locale.getMessage(DURATION_CONSTS.ACCEPTED_TYPE.ACCEPTED_DURATION_TYPE + test.type);
                component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
                let userInput = test.numValue + ' ' + localeType;
                if (test.type === undefined) {
                    userInput = test.numValue;
                }
                let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
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
    });
    /**
     * If a user enters an invalid input, it returns the value to the user without any conversion
     * */
    TestData.invalidInput.forEach(function(test) {
        it('throws a validation error with an invalid input of ' + test.invalidInput, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let userInput = test.invalidInput;
            let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
            Simulate.change(input, {
                target: {value: userInput}
            });
            Simulate.blur(input, {
                target:{value: test.invalidInput}
            });
            expect(component.state.display).toEqual(test.invalidInput);
        });
    });
    TestData.timeFormatData.forEach(function(test) {
        it('converts ' + test.timeFormatVal + ' to ' + test.scale, () => {
            component = TestUtils.renderIntoDocument(<MockParent attributes={{scale: test.scale}} />);
            let input = TestUtils.findRenderedDOMComponentWithTag(component, 'input');
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
});
