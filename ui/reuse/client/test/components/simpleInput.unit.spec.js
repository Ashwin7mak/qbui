import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import SimpleInput from '../../src/components/simpleInput/simpleInput';
import ErrorWrapper from '../../../../client-react/src/components/fields/errorWrapper';

let component;
let instance;

const mockPropFuncs = {
    onBlur() {},
    onChange() {}
};

let classNameTestCases = [
    //test default className
    {
        description: 'will render a default className for simpleInput',
        className: 'simpleInput'
    },
    {
        description: 'will render a default className for input',
        className: 'input'
    },
    {
        description: 'will render a default className for label',
        className: 'label'
    },
    //test passed in prop className
    {
        description: 'will render a passed in className for simpleInput',
        className: 'simpleInput',
        propClassName: 'mockPropClassName'
    },
    {
        description: 'will render a passed in className for input',
        className: 'input',
        propClassName: 'mockPropClassName',
        //label and input both concatenate their type 'Label' and 'Input' to the end of the classNames for clarity
        type: 'Input'
    },
    {
        description: 'will render a passed in className for label',
        className: 'label',
        propClassName: 'mockPropClassName',
        //label and input both concatenate their type 'Label' and 'Input' to the end of the classNames for clarity
        type: 'Label'
    },
    //test isInValid for simpleInput
    {
        description: 'will render an isInvalid className if there is a validationErrorMessage',
        className: 'simpleInput',
        isValidClassName: 'isInvalid',
        validationErrorMessage: 'mockValidationError'
    },
    {
        description: 'will NOT render an isInvalid className if there is NOT a validationErrorMessage',
        className: 'simpleInput',
        isValidClassName: 'isInvalid',
    }
];

describe('SimpleInput', () => {
    beforeEach(() => {
        jasmineEnzyme();

        spyOn(mockPropFuncs, 'onBlur');
        spyOn(mockPropFuncs, 'onChange');
    });

    describe('classNames', () => {
        classNameTestCases.forEach((testCase) => {

            it(`${testCase.description}`, () => {
                component = shallow(<SimpleInput className={testCase.propClassName}
                                                 validationErrorMessage={testCase.validationErrorMessage}/>);

                let className = testCase.propClassName ? `.${testCase.className} .${testCase.propClassName}` : `.${testCase.className}`;
                className = testCase.type ? `${className}${testCase.type}` : className;

                let result = component.find(className);

                expect(result).toBePresent();
            });
        });
    });

    describe('input', () => {
        it('will render a passed in placeHolder and value for input', () => {
            component = mount(<SimpleInput placeholder="mockPlaceHolder"
                                           value="mockValue"/>);

            let input = component.find(".input");

            expect(input).toHaveValue('mockValue');
            expect(input).toHaveProp('placeholder', 'mockPlaceHolder');
        });

        it('will invoke prop onChange and will not mask any characters', () => {
            component = shallow(<SimpleInput onChange={mockPropFuncs.onChange}/>);

            let input = component.find('.input');
            input.simulate('change', {target: {value: 'Mock Value'}});

            expect(mockPropFuncs.onChange).toHaveBeenCalledWith('Mock Value');
        });

        it('will invoke prop onChange and will mask characters, it will only accept an uppercase character', () => {
            component = shallow(<SimpleInput onChange={mockPropFuncs.onChange}
                                             mask={/^[A-Z]*$/}/>);

            instance = component.instance();
            spyOn(instance, 'onChange').and.callThrough();

            let input = component.find('.input');

            input.simulate('change', {target: {value: 'M'}});
            expect(mockPropFuncs.onChange).toHaveBeenCalledWith('M');
        });

        it('will invoke prop onChange and will mask characters, it will not accept a lowercase character', () => {
            component = shallow(<SimpleInput onChange={mockPropFuncs.onChange}
                                             mask={/^[A-Z]*$/}/>);

            instance = component.instance();
            spyOn(instance, 'onChange').and.callThrough();

            let input = component.find('.input');

            input.simulate('change', {target: {value: 'm'}});
            expect(mockPropFuncs.onChange).not.toHaveBeenCalled();
        });

        it('will invoke the prop onBlur', () => {
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
        it('will render a required * with the label if it is required', () => {
            component = shallow(<SimpleInput isRequired={true}
                                             label="Mock Label"/>);

            let label = component.find(".label");

            expect(label).toHaveText('* Mock Label');
        });

        it('will NOT render a required * with the label if it is NOT required', () => {
            component = shallow(<SimpleInput isRequired={false}
                                             label="Mock Label"/>);

            let label = component.find(".label");

            expect(label).toHaveText('Mock Label');
        });
    });

    describe('errorWrapper', () => {
        it('will render an errorWrapper with the mockValidationError message', () => {
            component = mount(<SimpleInput validationErrorMessage="mockValidationError"/>);

            let errorWrapper = component.find("ErrorWrapper");

            expect(errorWrapper).toHaveProp('invalidMessage', 'mockValidationError');
            expect(errorWrapper).toHaveProp('isInvalid', true);
        });

        it('will NOT render an errorWrapper with the mockValidationError message', () => {
            component = mount(<SimpleInput />);

            let errorWrapper = component.find("ErrorWrapper");

            expect(errorWrapper).toHaveProp('invalidMessage', undefined);
            expect(errorWrapper).toHaveProp('isInvalid', false);

        });
    });
});

