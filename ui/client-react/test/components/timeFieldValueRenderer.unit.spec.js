import React from 'react';
import TestUtils from 'react-addons-test-utils';

import TimeFieldValueRenderer  from '../../src/components/fields/timeFieldValueRenderer';
import timeFormatter from '../../../common/src/formatter/timeOfDayFormatter';

describe('TimeFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TimeFieldValueRenderer/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with value', () => {
        let time = '23:45';
        let timeFormatted = timeFormatter.format({value: time}, null);
        component = TestUtils.renderIntoDocument(<TimeFieldValueRenderer value={time}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const timeFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(timeFieldValueRenderer).toHaveText(timeFormatted);
    });

    it('test render of component classes', () => {
        let time = '23:45';
        let classes = 'bold';
        component = TestUtils.renderIntoDocument(<TimeFieldValueRenderer value={time} classes={classes}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let timeFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(timeFieldValueRenderer.classList.contains('bold')).toBeTruthy();
        expect(timeFieldValueRenderer.classList.contains('dateCell')).toBeTruthy();
    });

});
