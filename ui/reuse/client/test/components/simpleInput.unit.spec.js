import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SimpleInput from '../../src/components/simpleInput/simpleInput';

let component;

const mockFunctions = {
//
};

// component.find('input').at(0).simulate('change', {target: {value: 'Mock App Name'}});

describe('SimpleInput', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('will render a SimpleInput component', () => {
        component = shallow(<SimpleInput />);

        let simpleInput = component.find(".simpleInput");

        expect(simpleInput).toBePresent();
    });

    it('will render a default className for simpleInput', () => {
        component = shallow(<SimpleInput className="mockSimpleInputClassName"/>);

        let simpleInput = component.find(".simpleInput");

        expect(simpleInput).toBePresent();
    });

    it('will render a passed in className for simpleInput', () => {
        component = shallow(<SimpleInput className="mockSimpleInputClassName"/>);

        let simpleInput = component.find(".simpleInput .mockSimpleInputClassName");

        expect(simpleInput).toBePresent();
    });

    it('will render an isInvalid className if there is a validationErrorMessage', () => {
        component = shallow(<SimpleInput validationErrorMessage="mockValidationError"/>);

        let isInvalid = component.find(".simpleInput .isInvalid");

        expect(isInvalid).toBePresent();
    });

    it('will NOT render an isInvalid className if there is a validationErrorMessage', () => {
        component = shallow(<SimpleInput />);

        let isInvalid = component.find(".simpleInput .isInvalid");

        expect(isInvalid).not.toBePresent();
    });

    it('will render a default className for input', () => {
        component = shallow(<SimpleInput className="mockClassName"/>);

        let input = component.find(".input");

        expect(input).toBePresent();
    });

    it('will render a passed in className for input', () => {
        component = shallow(<SimpleInput className="mockClassName"/>);

        let input = component.find(".input .mockClassNameInput");

        expect(input).toBePresent();
    });

    it('will render a default className for label', () => {
        component = shallow(<SimpleInput className="mockClassName"/>);

        let label = component.find(".label");

        expect(label).toBePresent();
    });

    it('will render a passed in className for label', () => {
        component = shallow(<SimpleInput className="mockClassName"/>);

        let label = component.find(".label .mockClassNameLabel");

        expect(label).toBePresent();
    });

    it('will render a required * with label if it is required', () => {
        component = shallow(<SimpleInput isRequired={true}
                                         label="Mock Label"/>);

        let label = component.find(".label");

        expect(label).toHaveText('* Mock Label');
    });

    it('will NOT render a required * with label if it is NOT required', () => {
        component = shallow(<SimpleInput isRequired={false}
                                         label="Mock Label"/>);

        let label = component.find(".label");

        expect(label).toHaveText('Mock Label');
    });
});
