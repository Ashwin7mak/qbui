import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Select from 'react-select';
import UserFieldValueEditor  from '../../src/components/fields/userFieldValueEditor';

describe('UserFieldValueEditor functions', () => {
    'use strict';

    const matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;



    const appUsers = [
        {
            email: "user1@email.com",
            firstName: "John",
            lastName: "Smith",
            screenName: "firstuser",
            userId: "1"
        },
        {
            email: "user2@email.com",
            firstName: "John",
            lastName: "Smith",
            userId: "2"
        },
        {
            email: "user3@email.com",
            userId: "3"
        },
        {
            email: "user4@email.com",
            firstName: "John",
            lastName: "Smith",
            userId: "4"
        },
        {
            email: "user5@email.com",
            firstName: "John",
            lastName: "Smith",
            deactivated: true,
            userId: "5"
        }
    ];

    it('test render of component with required set', () => {

        const fieldDef = {
            builtIn: false,
            dataTypeAttributes: {
                type: "USER",
                userDisplayFormat: "FIRST_THEN_LAST"
            },
            required: true
        };
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with users and selection operations', () => {

        const fieldDef = {
            builtIn: false,
            dataTypeAttributes: {
                type: "USER",
                userDisplayFormat: "FIRST_THEN_LAST"
            },
            required: false
        };

        let blurVal = null;
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef} onBlur={(val) => {blurVal = val;}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let select = TestUtils.findRenderedComponentWithType(component, Select);

        // open options

        let selectArrow = ReactDOM.findDOMNode(select).querySelector('.Select-arrow');
        TestUtils.Simulate.mouseDown(selectArrow, {button: 0});

        let options = ReactDOM.findDOMNode(select).querySelectorAll(".Select-option");
        expect(options.length).toEqual(0);

        let selectInput = ReactDOM.findDOMNode(select).querySelector('input');
        TestUtils.Simulate.change(selectInput, "user4");

        TestUtils.Simulate.blur(selectInput);

        expect(blurVal.value).toEqual(appUsers[0]);

    });

});
