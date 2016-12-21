import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Select from 'react-select';
import UserFieldValueEditor  from '../../src/components/fields/userFieldValueEditor';

describe('UserFieldValueEditor', () => {
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

    const fieldDef = {
        builtIn: false,
        datatypeAttributes: {
            type: "USER",
            userDisplayFormat: "FIRST_THEN_LAST"
        },
        required: false
    };

    it('test render of component with required set', () => {

        const requiredfieldDef = Object.assign({}, fieldDef, {required: true});
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with users and selection operations', () => {
        let blurVal = null;
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor value={{userId: "1"}} appUsers={appUsers} fieldDef={fieldDef} onBlur={(val) => {blurVal = val;}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let select = TestUtils.findRenderedComponentWithType(component, Select);

        // open options

        let selectControl = ReactDOM.findDOMNode(select).querySelector('.Select-control');
        TestUtils.SimulateNative.mouseDown(selectControl, {button: 0});

        let options = ReactDOM.findDOMNode(select).querySelectorAll(".Select-option");
        expect(options.length).toEqual(0);

        let selectInput = ReactDOM.findDOMNode(select).querySelector('input');
        TestUtils.Simulate.change(selectInput, "user4");

        TestUtils.Simulate.blur(selectInput);

        expect(blurVal.value).toEqual(appUsers[0]);

    });

    it(`displays matching users when searched - "John"`, () => {
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor appUsers={appUsers} fieldDef={fieldDef} />);

        // open dropdown
        let select = TestUtils.findRenderedComponentWithType(component, Select);
        let selectControl = ReactDOM.findDOMNode(select).querySelector('.Select-control');
        TestUtils.SimulateNative.mouseDown(selectControl, {button: 0});

        // change text in search input
        let selectInput = ReactDOM.findDOMNode(select).querySelector('input');
        selectInput.value = 'John';
        TestUtils.Simulate.change(selectInput);

        let options = ReactDOM.findDOMNode(select).querySelectorAll('.Select-option');
        expect(options.length).toEqual(4);
    });

    it(`displays matching users when searched - "user"`, () => {
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor appUsers={appUsers} fieldDef={fieldDef} />);

        // open dropdown
        let select = TestUtils.findRenderedComponentWithType(component, Select);
        let selectControl = ReactDOM.findDOMNode(select).querySelector('.Select-control');
        TestUtils.SimulateNative.mouseDown(selectControl, {button: 0});

        // change text in search input
        let selectInput = ReactDOM.findDOMNode(select).querySelector('input');
        selectInput.value = 'user';
        TestUtils.Simulate.change(selectInput);

        let options = ReactDOM.findDOMNode(select).querySelectorAll('.Select-option');
        expect(options.length).toEqual(5);
    });

    it(`displays 'Nobody matches "<search-string>"' when the search does not match a user`, () => {
        component = TestUtils.renderIntoDocument(<UserFieldValueEditor appUsers={appUsers} fieldDef={fieldDef} />);

        // open dropdown
        let select = TestUtils.findRenderedComponentWithType(component, Select);
        let selectControl = ReactDOM.findDOMNode(select).querySelector('.Select-control');
        TestUtils.SimulateNative.mouseDown(selectControl, {button: 0});

        // change text in search input
        let selectInput = ReactDOM.findDOMNode(select).querySelector('input');
        selectInput.value = 'thing';
        TestUtils.Simulate.change(selectInput);

        let results = ReactDOM.findDOMNode(select).querySelector('.Select-noresults');
        expect(results.innerText).toEqual(`Nobody matches "thing"`);
    });
});
