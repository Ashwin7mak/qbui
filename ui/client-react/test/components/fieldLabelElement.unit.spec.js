import React from 'react';
import TestUtils from 'react-addons-test-utils';
import FieldLabelElement from '../../src/components/QBForm/fieldLabelElement';

const relatedField = {
    id: 6,
    name: 'field',
    datatypeAttributes: {
        type: 'TEXT'
    },
    required: false
};
const element = {
    fieldId: 6,
    type: 'FIELD',
};
const label = 'label text';

describe('FieldLabelElement', () => {
    'use strict';

    it(`renders a component`, () => {
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={relatedField} label={label}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let domnode = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(domnode).toBeTruthy();
    });

    it(`contains 'fieldLabel' class`, () => {
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={relatedField} label={label}/>);
        let domnode = TestUtils.findRenderedDOMComponentWithClass(component, 'fieldLabel');
        expect(domnode).toBeTruthy();
    });

    it(`contains className 'checkbox-field-label' when element is a checkbox`, () => {
        const checkbox = Object.assign({},
            relatedField,
            {datatypeAttributes:
                {type: 'CHECKBOX'}
            });
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={checkbox} label={label}/>);
        let domnode = TestUtils.findRenderedDOMComponentWithClass(component, 'checkbox-field-label');
        expect(domnode).toBeTruthy();
    });

    it(`does not contain className 'checkbox-field-label' when element is not a checkbox`, () => {
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={relatedField} label={label}/>);
        let domnodes = TestUtils.scryRenderedDOMComponentsWithClass(component, 'checkbox-field-label');
        expect(domnodes.length).toEqual(0);
    });

    it(`contains className 'errorText' when isInvalid is set`, () => {
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={relatedField} isInvalid={true} label={label}/>);
        let domnode = TestUtils.findRenderedDOMComponentWithClass(component, 'errorText');
        expect(domnode).toBeTruthy();
    });

    it(`does not contain className 'errorText' when isInvalid is falsy`, () => {
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={relatedField} label={label}/>);
        let domnodes = TestUtils.scryRenderedDOMComponentsWithClass(component, 'errorText');
        expect(domnodes.length).toEqual(0);
    });

    it(`displays label text`, () => {
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={element} relatedField={relatedField} label={label}/>);
        let domnode = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(domnode.innerText).toContain(label);
    });

    it(`indicates when the field is required`, () => {
        const requiredElement = Object.assign({required: true}, element);
        let component = TestUtils.renderIntoDocument(<FieldLabelElement element={requiredElement} relatedField={relatedField} indicateRequiredOnLabel={true} label={label}/>);
        let domnode = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(domnode.innerText).toContain('*');
    });
});
