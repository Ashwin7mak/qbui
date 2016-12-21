import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import PhoneFormatter from '../../../common/src/formatter/phoneNumberFormatter';
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
    const testExtension = '5432';
    const telHref = `tel:${rawPhoneNumberVal}`;

    function buildPhoneNumberDisplayObject(options = {}) {
        return Object.assign({isDialable: true, display: '', extension: ''}, options);
    }

    let component;
    let domComponent;
    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer display="" />);
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
                                                                          display={buildPhoneNumberDisplayObject({display: rawPhoneNumberVal})}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const smsIconElement = TestUtils.findRenderedDOMComponentWithClass(component, smsIcon);

        expect(smsIconElement).not.toBeNull();
    });

    it('test if href for sms Icon exists', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={buildPhoneNumberDisplayObject({internationalNumber: rawPhoneNumberVal})}/>);
        const smsLink = TestUtils.findRenderedDOMComponentWithClass(component, 'smsIconLink');

        expect(smsLink.href).toEqual('sms:' + rawPhoneNumberVal);
    });

    it('test render of phoneIcon', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={buildPhoneNumberDisplayObject({display: rawPhoneNumberVal})}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const phoneIconElement = TestUtils.findRenderedDOMComponentWithClass(component, phoneIcon);

        expect(phoneIconElement).not.toBeNull();
    });

    it('test if href for phone Icon exists', () => {
        component = TestUtils.renderIntoDocument(<PhoneFieldValueRenderer value={rawPhoneNumberVal}
                                                                          display={buildPhoneNumberDisplayObject({internetDialableNumber: telHref})}/>);
        const telLink = TestUtils.findRenderedDOMComponentWithClass(component, 'telIconLink');

        expect(telLink.href).toEqual(telHref);
    });

    it('displays a url as a clickable link when the phone number is dialable', () => {
        component = TestUtils.renderIntoDocument(
            <PhoneFieldValueRenderer
                value={rawPhoneNumberVal}
                display={buildPhoneNumberDisplayObject({isDialable: true, display: rawPhoneNumberVal, internetDialableNumber: telHref})}
            />);
        const telLink = TestUtils.findRenderedDOMComponentWithClass(component, 'telLink');
        expect(telLink.href).toEqual(telHref);
        expect(telLink.text).toEqual(rawPhoneNumberVal);
    });

    it('displays the phone number as text if it is not dialable', () => {
        component = TestUtils.renderIntoDocument(
            <PhoneFieldValueRenderer
                value={rawPhoneNumberVal}
                display={buildPhoneNumberDisplayObject({isDialable: false, display: rawPhoneNumberVal})}
            />);
        const telLinks = ReactDOM.findDOMNode(component).querySelectorAll('a');
        expect(telLinks.length).toEqual(0);
    });

    it('displays a phone number as text if a string is provided as the display prop instead of an object describing all relevant display information', () => {
        component = TestUtils.renderIntoDocument(
            <PhoneFieldValueRenderer value={rawPhoneNumberVal} display={rawPhoneNumberVal} />);
        const telLinks = ReactDOM.findDOMNode(component).querySelectorAll('a');
        expect(telLinks.length).toEqual(0);
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
        let alternateDisplayText = 'Call me maybe.';

        component = TestUtils.renderIntoDocument(
            <PhoneFieldValueRenderer
                value={rawPhoneNumberVal}
                display={buildPhoneNumberDisplayObject({display: alternateDisplayText, internetDialableNumber: telHref})}
            />
        );

        domComponent = TestUtils.findRenderedDOMComponentWithClass(component, 'telLink');
        expect(domComponent.href).toEqual(telHref);
        expect(domComponent.textContent).toEqual(alternateDisplayText);
    });

    it('displays any extra digits after a phone number as text (not a link)', () => {
        let testExtraDigits = '123456789';

        component = TestUtils.renderIntoDocument(
            <PhoneFieldValueRenderer
                value={rawPhoneNumberVal}
                display={buildPhoneNumberDisplayObject({
                    isDialable: true,
                    display: rawPhoneNumberVal,
                    internetDialableNumber: telHref,
                    extraDigits: testExtraDigits
                })}
            />
        );

        const mainNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'mainNumber');
        expect(mainNumber.classList.contains('noLink')).toEqual(false);

        const extraDigits = TestUtils.findRenderedDOMComponentWithClass(component, 'extraDigits');
        expect(extraDigits.classList.contains('noLink')).toEqual(true);

        const telLink = TestUtils.findRenderedDOMComponentWithClass(component, 'telLink');
        expect(telLink.href).toEqual(telHref);
        expect(telLink.textContent).toEqual(`${rawPhoneNumberVal}${testExtraDigits}`);
    });

    it('displays the extension after a phone number as text (not a link)', () => {
        component = TestUtils.renderIntoDocument(
            <PhoneFieldValueRenderer
                value={rawPhoneNumberVal}
                display={buildPhoneNumberDisplayObject({
                    isDialable: true,
                    display: rawPhoneNumberVal,
                    internetDialableNumber: telHref,
                    extension: testExtension
                })}
            />
        );

        const mainNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'mainNumber');
        expect(mainNumber.classList.contains('noLink')).toEqual(false);

        const extraDigits = TestUtils.findRenderedDOMComponentWithClass(component, 'extension');
        expect(extraDigits.classList.contains('noLink')).toEqual(true);

        const telLink = TestUtils.findRenderedDOMComponentWithClass(component, 'telLink');
        expect(telLink.href).toEqual(telHref);
        expect(telLink.textContent).toEqual(`${rawPhoneNumberVal}${PhoneFormatter.EXTENSION_DELIM}${testExtension}`);
    });
});
