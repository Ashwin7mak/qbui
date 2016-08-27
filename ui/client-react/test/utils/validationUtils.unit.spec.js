import React from 'react';
import TestUtils from 'react-addons-test-utils';
import _ from 'lodash';
import LimitConstants from '../../../common/src/limitConstants';
import ValidationUtils from '../../src/utils/validationUtils';

describe('test validateFieldValue', () => {

    it('null field definition gets no errors', () => {
        let def = null;
        let value = "hello";
        let result = ValidationUtils.checkFieldValue(def, value);
        expect(result).not.toBeNull();
        expect(result.isInvalid).toBeFalsy();
    });

    it('undefined field definition gets no errors', () => {
        let def = undefined;
        let value = "hello";
        let result = ValidationUtils.checkFieldValue(def, value);
        expect(result).not.toBeNull();
        expect(result.isInvalid).toBeFalsy();
    });

    describe('required test', () => {

        describe('required with some value gets no errors', () => {
            let dataProvider = [
                {test: '0 value ', value: 0},
                {test: 'string value ', value: "this"},
                {test: 'date object value', value: new Date()},
                {test: 'object value', value: {this:'is an', object:44}},
                {test: 'number value not error', value: -1223.34},
            ];
            dataProvider.forEach((data) => {
                it(data.test, () => {
                    let def = {required: true};
                    let value = data.value;
                    let result = ValidationUtils.checkFieldValue(def, value, true);
                    expect(result).not.toBeNull();
                    expect(result.isInvalid).toBeFalsy();
                });
            });
        });

        describe('required with ', () => {
            let dataProvider = [
                {test: 'null value gets error', value: null, isInvalid: true},
                {test: 'empty string value gets error', value: "", isInvalid: true},
                {test: 'undefined value gets error', value: undefined, isInvalid: true},
                {test: '0 value not error', value: 0, isInvalid: false},
            ];
            dataProvider.forEach((data) => {
                it(data.test, () => {
                    let def = {required: true};
                    let value = data.value;
                    let result = ValidationUtils.checkFieldValue(def, value, true);
                    expect(result).not.toBeNull();
                    expect(result.isInvalid).toEqual(data.isInvalid);
                });
            });
        });
    });

    describe('max field length test ', () => {
        let maxChars = 4;
        let def = {required: false, datatypeAttributes : {clientSideAttributes : {max_chars: maxChars}}};
        let defSys = {required: false};
        var chance = require('chance').Chance();
        let sysMaxString = chance.string({length: LimitConstants.maxTextFieldValueLength + 1});


        let dataProvider = [
            {test: `max: ${maxChars}`, value: null, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: undefined, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: '', isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: 'abcd', isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: 88, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: new Date(), isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: -44, isInvalid: false, def: def},
            {test: `max: ${maxChars}`, value: 'abcde', isInvalid: true, def: def},
            {test: `max: ${LimitConstants.maxTextFieldValueLength}`, value: sysMaxString, isInvalid: true, def: defSys},

        ];
        dataProvider.forEach((data) => {
            it(data.test + ` value:${data.value} expected isInvalid:${data.isInvalid}`, () => {
                let value = data.value;
                let result = ValidationUtils.checkFieldValue(data.def, value);
                expect(result).not.toBeNull();
                expect(result.isInvalid).toEqual(data.isInvalid);
            });
        });
    });
});
