import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FieldValueEditor  from '../../src/components/fields/fieldValueEditor';
import FieldFormats from '../../src/utils/fieldFormats';
var simpleStringify = require('../../../common/src/simpleStringify.js');

import {__RewireAPI__ as NumberFieldValueRendererRewire}  from '../../src/components/fields/fieldValueRenderers';

import {DEFAULT_RECORD_KEY_ID} from '../../src/constants/schema';

function setupI18nNumberMock() {
    let I18nMessageMock = React.createClass({
        render: function() {
            return (
                <div>I18Mock</div>
            );
        }
    });
    NumberFieldValueRendererRewire.__Rewire__('I18nNumber', I18nMessageMock);
}

function tearDownI18nNumberMock() {
    NumberFieldValueRendererRewire.__ResetDependency__('I18nNumber');
}

const users = [
    {
        "userId": "58440038",
        firstName: "Aditi",
        lastName: "Goel",
        screenName: "agoel@quickbase.com",
        email: "agoel@quickbase.com"
    },
    {
        "userId": "58453016",
        firstName: "Drew",
        lastName: "Stevens",
        screenName: "dstevens@quickbase.com",
        email: "dstevens@quickbase.com"
    }
];

describe('FieldValueEditor functions', () => {
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
            {test: "MULTI_LINE_TEXT_FORMAT", type: FieldFormats.MULTI_LINE_TEXT_FORMAT}
        ];
        dataProvider.forEach((data) => {
            it(data.test, () => {
                component = TestUtils.renderIntoDocument(<FieldValueEditor fieldDef={{required: true}} type={data.type} appUsers={users}/>);
                expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
            });
        });
    });



    it('test render of component with no onChange ', () => {
        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT} onChange={undefined}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.isElementOfType(component, 'input').toBeTruthy);
        let input = TestUtils.scryRenderedDOMComponentsWithClass(component, "input");
    });

    it('test render of component with placeholder', () => {
        let ghostText = 'Enter here';
        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT} fieldDef={{placeholder:ghostText}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.isElementOfType(component, 'input').toBeTruthy);
        let input = TestUtils.scryRenderedDOMComponentsWithClass(component, "input");
        expect(input[0].placeholder).toEqual(ghostText);
    });

    it('test render of component isInvalid', () => {
        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT} isInvalid={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component required', () => {
        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT} fieldDef={{required : true}} indicateRequired = {true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of component required not shown', () => {
        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT} fieldDef={{required : true}} indicateRequired={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component choices', () => {
        let choices = [
            {displayValue:'a'},
            {displayValue:'b'},
            {displayValue:'c'},
        ];
        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT} fieldDef={{choices : choices}} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test onExitField', () => {
        var callbacks = {
            validateFieldValue : function validateFieldValue(def, target) {},
            onValidated : function onValidated(def, target) {},
        };
        spyOn(callbacks, 'validateFieldValue').and.callThrough();
        spyOn(callbacks, 'onValidated').and.callThrough();

        component = TestUtils.renderIntoDocument(<FieldValueEditor type={FieldFormats.TEXT_FORMAT}
                                  validateFieldValue={callbacks.validateFieldValue}
                                  onValidated={callbacks.onValidated}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        component.onExitField({target:{value:'test'}});
        expect(callbacks.validateFieldValue).toHaveBeenCalled();
        expect(callbacks.onValidated).toHaveBeenCalled();

    });

    it('does not render an editor for a Record ID field', () => {
        setupI18nNumberMock();

        let fieldDef = {
            id: DEFAULT_RECORD_KEY_ID,
            field: 'Record ID#'
        };

        component = TestUtils.renderIntoDocument(
            <FieldValueEditor type={FieldFormats.NUMBER_FORMAT} fieldDef={fieldDef} />
        );

        // There should not be an input to change the value
        let editableField = ReactDOM.findDOMNode(component).querySelectorAll('input');
        expect(editableField.length).toBe(0);

        tearDownI18nNumberMock();
    });
});
