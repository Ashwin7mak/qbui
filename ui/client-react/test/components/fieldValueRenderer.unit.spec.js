import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FieldValueRenderer  from '../../src/components/fields/fieldValueRenderer';
import FieldFormats from '../../src/utils/fieldFormats';
var simpleStringify = require('../../../common/src/simpleStringify.js');

describe('FieldValueRenderer functions', () => {
    'use strict';

    let component;


    describe('test render of component', () => {
        let dataProvider = [
            {test: "TEXT_FORMAT", type: FieldFormats.TEXT_FORMAT},
            {test: "NUMBER_FORMAT", type: FieldFormats.NUMBER_FORMAT},
            {test: "DATE_FORMAT", type: FieldFormats.DATE_FORMAT},
            {test: "DATETIME_FORMAT", type: FieldFormats.DATETIME_FORMAT},
            {test: "TIME_FORMAT", type: FieldFormats.TIME_FORMAT},
            {test: "CHECKBOX_FORMAT", type: FieldFormats.CHECKBOX_FORMAT},
            {test: "USER_FORMAT", type: FieldFormats.USER_FORMAT},
            {test: "CURRENCY_FORMAT", type: FieldFormats.CURRENCY_FORMAT},
            {test: "PERCENT_FORMAT", type: FieldFormats.PERCENT_FORMAT},
            {test: "RATING_FORMAT", type: FieldFormats.RATING_FORMAT},
            {test: "DURATION_FORMAT", type: FieldFormats.DURATION_FORMAT},
            {test: "PHONE_FORMAT", type: FieldFormats.PHONE_FORMAT},
            {test: "MULTI_LINE_TEXT_FORMAT", type: FieldFormats.MULTI_LINE_TEXT_FORMAT},
        ];
        dataProvider.forEach((data) => {
            it(data.test, () => {
                component = TestUtils.renderIntoDocument(<FieldValueRenderer type={data.type}/>);
                expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
            });
        });
    });


    it('test render of component choices', () => {
        let choices = [
            {displayValue:'a'},
            {displayValue:'b'},
            {displayValue:'c'},
        ];
        component = TestUtils.renderIntoDocument(<FieldValueRenderer type={FieldFormats.TEXT_FORMAT} fieldDef={{choices : choices}} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component bold', () => {
        component = TestUtils.renderIntoDocument(<FieldValueRenderer type={FieldFormats.TEXT_FORMAT} attributes={{clientSideAttributes : {bold: true}}} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let boldField = ReactDOM.findDOMNode(component);
        expect(boldField.classList.contains('bold')).toBeTruthy();
    });

    it('test render of component not bold', () => {
        component = TestUtils.renderIntoDocument(<FieldValueRenderer type={FieldFormats.TEXT_FORMAT} attributes={{clientSideAttributes : {bold: false}}} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let boldField = ReactDOM.findDOMNode(component);
        expect(boldField.classList.contains('bold')).toBeFalsy();
    });

    it('test render of component added class', () => {
        let classToAdd = "testFieldValueRenderer";
        component = TestUtils.renderIntoDocument(<FieldValueRenderer type={FieldFormats.TEXT_FORMAT} classes={classToAdd} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let addedClass = ReactDOM.findDOMNode(component);
        expect(addedClass.classList.contains(classToAdd)).toBeTruthy();
    });



});
