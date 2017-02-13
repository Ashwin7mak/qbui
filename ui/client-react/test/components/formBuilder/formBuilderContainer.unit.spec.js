import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {NEW_FORM_RECORD_ID} from '../../../src/constants/schema';

import {FormBuilderContainer} from '../../../src/components/builder/formBuilderContainer';
import Loader from 'react-loader';
import FormBuilder from '../../../src/components/formBuilder/formBuilder';

const appId = 1;
const tblId = 2;
const formType = 'edit';

const mockActions = {
    loadForm() {}
};

let component;
let instance;

describe('FormBuilderContainer', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'loadForm');
    });

    describe('load form data', () => {
        let testCases = [
            {
                description: 'loads the form',
                formType: formType,
                expectedFormType: formType
            },
            {
                description: 'loads the default view form if a formType is not passed in as a prop',
                formType: null,
                expectedFormType: 'view'
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<FormBuilderContainer appId={appId} tblId={tblId} formType={testCase.formType} loadForm={mockActions.loadForm} />);
                instance = component.instance();

                instance.componentDidMount();

                expect(mockActions.loadForm).toHaveBeenCalledWith(appId, tblId, null, testCase.expectedFormType, NEW_FORM_RECORD_ID);
            });
        });

    });


    describe('showing FormBuilder', () => {
        let testCases = [
            {
                description: 'loads the FormBuilder if a form has loaded',
                forms: [{loading: false, formData: {formMeta: {includeBuiltIns: false}}}],
                expectedLoaded: true,
                expectedFormData: {formMeta: {includeBuiltIns: false}}
            },
            {
                description: 'shows the loading spinner if there is no form data',
                forms: [],
                expectedLoaded: false,
                expectedFormData: null
            },
            {
                description: 'shows the loading spinner if the form is not finished loading',
                forms: [{loading: true}],
                expectedLoaded: false,
                expectedFormData: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<FormBuilderContainer forms={testCase.forms} />);


                expect(component.find(Loader)).toBePresent();
                expect(component.find(Loader)).toHaveProp('loaded', testCase.expectedLoaded);

                expect(component.find(FormBuilder)).toBePresent();
                expect(component.find(FormBuilder)).toHaveProp('formData', testCase.expectedFormData);
            });
        });
    });

});
