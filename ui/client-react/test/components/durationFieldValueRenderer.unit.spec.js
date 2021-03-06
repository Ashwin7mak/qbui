import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import moment from 'moment';
import consts from '../../../common/src/constants';
import DurationFieldValueRenderer, {__RewireAPI__ as DurationFieldValueRendererRewireAPI}  from '../../src/components/fields/durationFieldValueRenderer';


var LocalesMock = {
    getLocale: function() {
        return 'a testing locale';
    },
    getMessage: function(message) {
        return message;
    }
};

var I18nMessageMock = React.createClass({
    render: function() {
        return <span>{" " + this.props.value + " " + this.props.message}</span>;
    }
});

var I18nNumberMock = React.createClass({
    render: function() {
        return <span>{" " + this.props.value + " " }</span>;
    }
});

var IntlNumberOnlyMock = function(locale, intlOps, number) {
    let opts = JSON.stringify(intlOps);
    return `${locale} formatted number ${number} opts:${opts}`;
};

describe('DurationFieldValueRenderer', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
        DurationFieldValueRendererRewireAPI.__Rewire__('Locale', LocalesMock);
        DurationFieldValueRendererRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        DurationFieldValueRendererRewireAPI.__Rewire__('I18nNumber', I18nNumberMock);
        DurationFieldValueRendererRewireAPI.__Rewire__('IntlNumberOnly', IntlNumberOnlyMock);


    });
    afterEach(() => {
        DurationFieldValueRendererRewireAPI.__ResetDependency__('Locale');
        DurationFieldValueRendererRewireAPI.__ResetDependency__('I18nMessage');
        DurationFieldValueRendererRewireAPI.__ResetDependency__('I18nNumber');
        DurationFieldValueRendererRewireAPI.__ResetDependency__('IntlNumberOnly');
    });

    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component smart units', () => {
        let millisecs = 23456;
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} />);
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
                                                                             attributes={{scale: consts.DURATION_CONSTS.SCALES.SECONDS}}/>);
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
                scale: consts.DURATION_CONSTS.SCALES.WEEKS
            },
            {
                description: 'as Days',
                milli: moment.duration(value, 'days').asMilliseconds(),
                units: 'days',
                scale: consts.DURATION_CONSTS.SCALES.DAYS
            },
            {
                description: 'as Hours',
                milli: moment.duration(value, 'hours').asMilliseconds(),
                units: 'hours',
                scale: consts.DURATION_CONSTS.SCALES.HOURS
            },
            {
                description: 'as Minutes',
                milli: moment.duration(value, 'hours').asMilliseconds(),
                units: 'minutes',
                scale: consts.DURATION_CONSTS.SCALES.MINUTES
            },
            {
                description: 'as Seconds',
                milli: moment.duration(value, 'hours').asMilliseconds(),
                units: 'seconds',
                scale: consts.DURATION_CONSTS.SCALES.SECONDS
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

    it('test render of component with display does not get reformatted for locale', () => {
        let millisecs = 23456;
        let displayProp = '123 pre calculated value';
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} attributes={{scale:consts.DURATION_CONSTS.SCALES.WEEKS}} display={displayProp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let componentDiv = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(componentDiv).toBeTruthy();
        expect(componentDiv).toHaveText(displayProp);
    });

    it('test render of component with display of timebase units does not get reformatted for locale', () => {
        let millisecs = 23456;
        let displayProp = '123 pre calculated value';
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} attributes={{scale:consts.DURATION_CONSTS.SCALES.HHMMSS}} display={displayProp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let componentDiv = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(componentDiv).toBeTruthy();
        expect(componentDiv).toHaveText(displayProp);
    });

    it('test render of component with display and smart units gets formatted', () => {
        let millisecs = 23456;
        let displayProp = '123 pre calculated value';
        component = TestUtils.renderIntoDocument(<DurationFieldValueRenderer value={millisecs} attributes={{scale:consts.DURATION_CONSTS.SCALES.SMART_UNITS}} display={displayProp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let componentDiv = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(componentDiv).toBeTruthy();
        expect(componentDiv).not.toHaveText(displayProp);
    });

});
