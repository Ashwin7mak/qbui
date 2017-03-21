import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {NEW_FORM_RECORD_ID} from '../../../src/constants/schema';
import {FormBuilderContainer, __RewireAPI__ as FormBuilderRewireAPI} from '../../../src/components/builder/formBuilderContainer';
import Loader from 'react-loader';

const appId = 1;
const tblId = 2;
const formType = 'edit';

const mockActions = {
    loadForm() {},
    updateForm() {},
    toggleFormBuilderChildrenTabIndex() {}
};

let component;
let instance;

describe('FormBuilderContainer', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'loadForm');
        spyOn(mockActions, 'updateForm');
        spyOn(mockActions, 'toggleFormBuilderChildrenTabIndex');
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
        const testFormData = {fields: [], formMeta: {name: 'some form', includeBuiltIns: false}};
        let testCases = [
            {
                description: 'loads the FormBuilder if a form has loaded',
                forms: [{loading: false, formData: testFormData}],
                expectedLoaded: true,
                expectedFormData: testFormData
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

                let formBuilderComponent = component.find({formData: testCase.expectedFormData});
                expect(formBuilderComponent).toBePresent();
            });
        });
    });

    describe('saving on FormBuilder', () => {
        it('test saveButton on the formBuilder footer', () => {
            let forms = [{formData:{loading: false, formType: {}, formMeta: {}}}] ;

            component = mount(<FormBuilderContainer appId={appId}
                                                    forms={forms}
                                                    tblId={tblId}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);

            let saveButton = component.find('.saveFormButton');

            saveButton.simulate('click');

            expect(mockActions.updateForm).toHaveBeenCalled();
        });
    });

    describe('toggle children tab indexes', () => {
        it('will toggle the children tab indexes if enter is pressed and the tab indexes are not already 0', () => {
            let forms = [{formData:{loading: false, formType: {}, formMeta: {}}}];
            let e = {
                which: 13,
                preventDefault() {return;}
            };

            component = mount(<FormBuilderContainer appId={appId}
                                                    forms={forms}
                                                    tblId={tblId}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).toHaveBeenCalled();
        });

        it('will toggle the children tab indexes if space is pressed and the tab indexes are not already 0', () => {
            let forms = [{formData:{loading: false, formType: {}, formMeta: {}}}];
            let e = {
                which: 32,
                preventDefault() {return;}
            };

            component = mount(<FormBuilderContainer appId={appId}
                                                    forms={forms}
                                                    tblId={tblId}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).toHaveBeenCalled();
        });

        it('will not toggle the children tab indexes if space or enter are not pressed', () => {
            let forms = [{formData:{loading: false, formType: {}, formMeta: {}}}];
            let e = {
                which: 19,
                preventDefault() {return;}
            };

            component = mount(<FormBuilderContainer appId={appId}
                                                    forms={forms}
                                                    tblId={tblId}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).not.toHaveBeenCalled();
        });

        it('enter and space will not toggle the children tab indexes if the tabIndex is currently 0', () => {
            let forms = [{formBuilderChildrenTabIndex: [{tabIndex: "0"}], formData:{loading: false, formType: {}, formMeta: {}}}];
            let e = {
                which: 32,
                preventDefault() {return;}
            };

            component = mount(<FormBuilderContainer appId={appId}
                                                    forms={forms}
                                                    tblId={tblId}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).not.toHaveBeenCalled();
        });
    });

});
