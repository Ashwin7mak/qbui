import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

let component;

describe('example jasmine/enzyme setup', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('does something', () => {
        expect(true).toEqual(true);
    });
});
