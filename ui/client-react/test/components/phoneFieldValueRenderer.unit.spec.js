import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


import PhoneFieldValueRenderer  from '../../src/components/fields/phoneFieldValueRenderer';

const phoneNumber = "5555555555";
const phoneNumberWithExt = "5555555555x5555";
const smsIcon = "iconTableUISturdy-speechbubble-outline";
const phoneIcon = "iconTableUISturdy-phone-outline";

describe('PhoneFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    fit('test render of component', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    fit('test render of component with value', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={phoneNumber} display={phoneNumber}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[0].innerText).toEqual(phoneNumber);
    });

    fit('test render of component with extension', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={phoneNumberWithExt} display={phoneNumberWithExt}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[0].innerText).toEqual(phoneNumberWithExt);
    });

    fit('test render of sms Icon', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={phoneNumber} display={phoneNumber}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[0].firstChild.classList[2]).toEqual(smsIcon);
    });

    fit('test render of phoneIcon', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={phoneNumber} display={phoneNumber}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[1].firstChild.classList[1]).toEqual(phoneIcon);
    });
});
