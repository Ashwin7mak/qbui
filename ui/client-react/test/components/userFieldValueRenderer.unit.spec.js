import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';


import UserFieldValueRenderer  from '../../src/components/fields/userFieldValueRenderer';

describe('UserFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });

    let component;

    // test basic rendering
    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<UserFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const userFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');

        // get the tooltip to display
        TestUtils.Simulate.mouseOver(userFieldValueRenderer);

        // no tooltip if no values to display
        const tooltips = document.getElementsByClassName("tipUserFieldValue");
        expect(tooltips.length).toBe(0);
    });

    // typical rendering with tooltip
    it('test render of component with value screenName and email', () => {
        const user = {
            screenName: "screenname",
            email: "email@email.com"
        };
        const display = "display name";

        component = TestUtils.renderIntoDocument(<UserFieldValueRenderer display={display} value={user}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const userFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');

        // check the display text
        expect(userFieldValueRenderer).toHaveText(display);

        // get the tooltip to display
        TestUtils.Simulate.mouseOver(userFieldValueRenderer);

        const tooltips = document.getElementsByClassName("tipUserFieldValue");
        expect(tooltips.length).toBe(1);

        // find the tooltip lines
        const tipEntries = document.querySelectorAll(".tooltip-inner>div");
        expect(tipEntries.length).toBe(2);

        // check the text of the tooltip
        const screenNames = document.querySelectorAll(".tooltip-inner .tipScreenName");
        expect(screenNames.length).toBe(1);

        const emails = document.querySelectorAll(".tooltip-inner .tipEmail");
        expect(emails.length).toBe(1);
    });

    it('test render of component with email but no screenName', () => {
        const user = {
            email: "email@email.com"
        };
        const display = "display name";

        component = TestUtils.renderIntoDocument(<UserFieldValueRenderer display={display} value={user}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const userFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');

        TestUtils.Simulate.mouseOver(userFieldValueRenderer);

        // the tooltips are appended to the document body so now there should be another one
        const tipEntries = document.querySelectorAll(".tooltip-inner>div");
        expect(tipEntries.length).toBe(3); // there were 2 now just one more (no screen name this time)

        // the new tooltip should just have the email line
        expect(tipEntries[2]).toHaveText(user.email);
    });


});
