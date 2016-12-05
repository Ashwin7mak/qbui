import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


import PhoneFieldValueRenderer  from '../../src/components/fields/phoneFieldValueRenderer';

describe('PhoneFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    const rawPhoneNumberVal = "5555555555";
    const rawPhoneNumberValWithExt = "5555555555x5555";
    const phoneNumberWithExt = "(555) 555-5555 x5555";
    const phoneNumberWithoutExt = "(555) 555-5555";
    const smsIcon = "iconTableUISturdy-speechbubble-outline";
    const phoneIcon = "iconTableUISturdy-phone-outline";
    let component;
    let domComponent;
    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component without extension', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={phoneNumberWithoutExt}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[0].innerText).toEqual(phoneNumberWithoutExt);
    });

    it('test render of component with extension', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={phoneNumberWithExt}
                                                                          display={phoneNumberWithExt}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[0].innerText).toEqual(phoneNumberWithExt);
    });

    it('test render of sms Icon', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={rawPhoneNumberVal}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[0].firstChild.classList[2]).toEqual(smsIcon);
    });
    it('test if href for sms Icon exists', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={rawPhoneNumberVal}/>);
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[0].href).toEqual('sms:' + rawPhoneNumberVal);
    });
    it('test if href for smsIcon removes extension', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberValWithExt}
                                                                          display={rawPhoneNumberValWithExt}/>);
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[0].href).toEqual('sms:' + rawPhoneNumberVal);
    });

    it('test render of phoneIcon', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={rawPhoneNumberVal}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[1].firstChild.classList[1]).toEqual(phoneIcon);
    });

    it('test if href for phone Icon exists', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={rawPhoneNumberVal}/>);
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[1].href).toEqual('tel:' + rawPhoneNumberVal);
    });
    it('test if href for phoneIcon removes extension', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberValWithExt}
                                                                          display={rawPhoneNumberValWithExt}/>);
        const phoneFieldValueRenderer = TestUtils.scryRenderedDOMComponentsWithTag(component, 'div');
        expect(phoneFieldValueRenderer[2].childNodes[1].href).toEqual('tel:' + rawPhoneNumberVal);
    });
    it('displays a url as a clickable link by default', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={phoneNumberWithExt} />);
        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        expect(domComponent.href).toEqual('tel:' + rawPhoneNumberVal);
        expect(domComponent.text).toEqual(phoneNumberWithExt);
    });

    it('displays only text if disabled', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={phoneNumberWithExt}
                                                                          disabled={true} />);
        domComponent = ReactDOM.findDOMNode(component);
        let aTag = domComponent.querySelector('a');
        let spanTag = domComponent.querySelector('span');
        expect(aTag).toEqual(null);
        expect(spanTag.textContent).toEqual(phoneNumberWithExt);
    });

    it('displays alternate text for the link', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={phoneNumberWithExt} />);

        domComponent = ReactDOM.findDOMNode(component).querySelector('a');
        expect(domComponent.href).toEqual('tel:' + rawPhoneNumberVal);
        expect(domComponent.textContent).toEqual(phoneNumberWithExt);
    });
});
