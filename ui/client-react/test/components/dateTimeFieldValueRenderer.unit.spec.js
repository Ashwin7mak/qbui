import React from 'react';
import TestUtils from 'react-addons-test-utils';

import DateTimeFieldValueRenderer  from '../../src/components/fields/dateTimeFieldValueRenderer';
import dateTimeFormatter from '../../../common/src/formatter/dateTimeFormatter';

describe('DateTimeFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<DateTimeFieldValueRenderer/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with date only', () => {
        let dateTime = '09-15:2015T23:45:00Z';
        let dateTimeFormatted = dateTimeFormatter.format({value: dateTime}, null);
        component = TestUtils.renderIntoDocument(<DateTimeFieldValueRenderer value={dateTime}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const dateTimeFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(dateTimeFieldValueRenderer).toHaveText(dateTimeFormatted);
    });

    it('test render of component with date time', () => {
        let dateTime = '09-15:2015T23:45:00Z';
        let attributes = {showTime:true};
        let dateTimeFormatted = dateTimeFormatter.format({value: dateTime}, attributes);
        component = TestUtils.renderIntoDocument(<DateTimeFieldValueRenderer value={dateTime} attributes={attributes}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const dateTimeFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(dateTimeFieldValueRenderer).toHaveText(dateTimeFormatted);
    });

    it('test render of component with date and time', () => {
        let dateTime = '09-15:2015T23:45:00Z';
        let attributes = {showTime:true};
        let dateTimeFormatted = dateTimeFormatter.format({value: dateTime}, attributes);
        component = TestUtils.renderIntoDocument(<DateTimeFieldValueRenderer value={dateTime} attributes={attributes}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const dateTimeFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(dateTimeFieldValueRenderer).toHaveText(dateTimeFormatted);
    });

    it('test render of component classes', () => {
        let dateTime = '09-15:2015T23:45:00Z';
        let classes = 'bold';
        component = TestUtils.renderIntoDocument(<DateTimeFieldValueRenderer value={dateTime} classes={classes}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let dateTimeFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(dateTimeFieldValueRenderer.classList.contains('bold')).toBeTruthy();
        expect(dateTimeFieldValueRenderer.classList.contains('dateCell')).toBeTruthy();
    });

});
