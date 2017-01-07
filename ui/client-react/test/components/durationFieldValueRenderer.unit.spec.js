import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import moment from 'moment';
import consts from '../../../common/src/constants';
import DurationFieldValueRenderer, {__RewireAPI__ as DurationFieldValueRendererRewireAPI}  from '../../src/components/fields/durationFieldValueRenderer';

var I18nMessageMock = React.createClass({
    render: function() {
        return <span>{" " + this.props.value + " " + this.props.message}</span>;
    }
});

describe('DurationFieldValueRenderer', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
        DurationFieldValueRendererRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);

    });
    afterEach(() => {
        DurationFieldValueRendererRewireAPI.__ResetDependency__('I18nMessage');
    });

    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component smart units', () => {
        let millisecs = 23456;
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let durationFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        let expected = moment.duration(millisecs).asSeconds();
        expect(durationFieldValueRenderer).toHaveText(expected);
        expect(durationFieldValueRenderer).toHaveText('durationWithUnits.Seconds');
    });


    it('test render of component with ms value with includeUnits ', () => {
        let millisecs = 23456;
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs}
                                                                             includeUnits={true}
                                                                             attributes={{scale: consts.DURATION_CONSTS.SECONDS}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const durationFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        let expected = String(moment.duration(millisecs).asSeconds());
        expect(durationFieldValueRenderer).toHaveText(expected);
        expect(durationFieldValueRenderer).toHaveText('seconds');
    });

    describe('test various unit types', () => {
        var value = 5;
        var dataProvider = [
            {
                description: 'as Weeks',
                milli: moment.duration(value, 'weeks').asMilliseconds(),
                units: 'weeks',
                scale: consts.DURATION_CONSTS.WEEKS
            },
            {
                description: 'as Days',
                milli: moment.duration(value, 'days').asMilliseconds(),
                units: 'days',
                scale: consts.DURATION_CONSTS.DAYS
            },
            {
                description: 'as Hours',
                milli: moment.duration(value, 'hours').asMilliseconds(),
                units: 'hours',
                scale: consts.DURATION_CONSTS.HOURS
            },
            {
                description: 'as Minutes',
                milli: moment.duration(value, 'hours').asMilliseconds(),
                units: 'minutes',
                scale: consts.DURATION_CONSTS.MINUTES
            },
            {
                description: 'as Seconds',
                milli: moment.duration(value, 'hours').asMilliseconds(),
                units: 'seconds',
                scale: consts.DURATION_CONSTS.SECONDS
            }
        ];
        dataProvider.forEach((test) => {
            it("displays ms value as " + test.description, () => {
                let millisecs = test.milli;
                component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs}
                                                                                     includeUnits={true}
                                                                                     attributes={{scale: test.scale}}/>);
                expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
                let durationFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
                expect(durationFieldValueRenderer).toHaveText(test.units);
            });
        });

    });

    it('test render of component with class', () => {
        let millisecs = 23456;
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} classes={"testclass"}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let durationFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(durationFieldValueRenderer.classList.contains('testclass')).toBeTruthy();
    });

    it('test render of component with display does not get reformatted', () => {
        let millisecs = 23456;
        let displayProp = '123 pre calculated value';
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} attributes={{scale:consts.DURATION_CONSTS.WEEKS}} display={displayProp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let componentDiv = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(componentDiv).toBeTruthy();
        expect(componentDiv).toHaveText(displayProp);
    });

    it('test render of component with display and smart units gets formatted', () => {
        let millisecs = 23456;
        let displayProp = '123 pre calculated value';
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} attributes={{scale:consts.DURATION_CONSTS.SMART_UNITS}} display={displayProp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let componentDiv = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(componentDiv).toBeTruthy();
        expect(componentDiv).not.toHaveText(displayProp);
    });

});
