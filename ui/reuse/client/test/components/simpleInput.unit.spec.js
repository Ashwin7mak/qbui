import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SimpleInput from '../../src/components/simpleInput/simpleInput';

let component;
let instance;

const mockPropFuncs = {
    onBlur() {},
    onChange() {}
};

describe('SimpleInput', () => {
    beforeEach(() => {
        jasmineEnzyme();

        spyOn(mockPropFuncs, 'onBlur');
        spyOn(mockPropFuncs, 'onChange');
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

    describe('input', () => {
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

        it('will render a passed in placeHolder and value for input', () => {
            component = mount(<SimpleInput placeholder="mockPlaceHolder"
                                           value="mockValue"/>);

            let input = component.find(".input");

            expect(input).toHaveValue('mockValue');
            expect(input).toHaveProp('placeholder', 'mockPlaceHolder');
        });

        it('will invoke prop on change and will not mask any characters', () => {
            component = shallow(<SimpleInput onChange={mockPropFuncs.onChange}/>);

            let input = component.find('.input');
            input.simulate('change', {target: {value: 'Mock Value'}});

            expect(mockPropFuncs.onChange).toHaveBeenCalledWith('Mock Value');
        });

        it('will invoke prop on change and will mask characters and only accept an uppercase character', () => {
            component = shallow(<SimpleInput onChange={mockPropFuncs.onChange}
                                             mask={/^[A-Z]*$/}/>);

            instance = component.instance();
            spyOn(instance, 'onChange').and.callThrough();

            let input = component.find('.input');

            input.simulate('change', {target: {value: 'M'}});
            expect(mockPropFuncs.onChange).toHaveBeenCalledWith('M');
        });

        it('will invoke prop on change and will mask characters and will not accept a lowercase character', () => {
            component = shallow(<SimpleInput onChange={mockPropFuncs.onChange}
                                             mask={/^[A-Z]*$/}/>);

            instance = component.instance();
            spyOn(instance, 'onChange').and.callThrough();

            let input = component.find('.input');

            input.simulate('change', {target: {value: 'm'}});
            expect(mockPropFuncs.onChange).not.toHaveBeenCalled();
        });

        it('will invoke passed in prop onBlur', () => {
            component = shallow(<SimpleInput onBlur={mockPropFuncs.onBlur}/>);

            let input = component.find('.input');
            input.simulate('blur');

            expect(mockPropFuncs.onBlur).toHaveBeenCalled();
        });

        it('will set a maxLength on the input box', () => {
            component = mount(<SimpleInput maxLength={2} />);

            let input = component.find('.input');

            expect(input).toHaveProp('maxLength', 2);
            expect(input.nodes[0].maxLength).toEqual(2);
        });
    });

    describe('label', () => {
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
});
