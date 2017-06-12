import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {NEW_FORM_RECORD_ID} from '../../../src/constants/schema';
import {FormBuilderContainer, __RewireAPI__ as FormBuilderRewireAPI} from '../../../src/components/builder/formBuilderContainer';
import * as tabIndexConstants from '../../../../client-react/src/components/formBuilder/tabindexConstants';
import NavigationUtils from '../../../src/utils/navigationUtils';
import {__RewireAPI__ as NewfieldsMenuRewireAPI} from '../../../src/components/formBuilder/menus/newFieldsMenu';
import {ExistingFieldsMenu, __RewireAPI__ as ExistingFieldsRewireAPI} from '../../../src/components/formBuilder/menus/existingFieldsMenu';
import {__RewireAPI__ as ToolPaletteRewireAPI} from '../../../src/components/builder/builderMenus/toolPalette';
import {ENTER_KEY, SPACE_KEY} from '../.././../../reuse/client/src/components/keyboardShortcuts/keyCodeConstants';
import {FieldTokenInMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import Loader from 'react-loader';
import SaveOrCancelFooter from '../../../src/components/saveOrCancelFooter/saveOrCancelFooter';

const appId = "1";
const tblId = "2";
const formType = 'edit';
const currentForm = {formData:{loading: false, formType: {}, formMeta: {}}, formBuilderChildrenTabIndex: ["0"], id: 'view'};
const selectedField = {tabIndex: 0, sectionIndex: 0, columnIndex: 0, rowIndex: 0, elementIndex: 3};

const mockActions = {
    loadForm() {},
    updateForm() {},
    toggleFormBuilderChildrenTabIndex() {},
    toggleToolPaletteChildrenTabIndex() {},
    keyboardMoveFieldUp(_formId, _location) {},
    keyboardMoveFieldDown(_formId, _location) {},
    removeFieldFromForm(_formId, _location) {},
    deselectField(_formId, _location) {},
    setFormBuilderPendingEditToFalse(_formId, _location) {},
    setFieldsPropertiesPendingEditToFalse(_formId, _location) {}
};

const previousLocation = '/somewhere/over/the/rainbow';
const testParamsProp = {params: {appId, tblId}};
const testLocationProp = {query: {formType, previous: previousLocation}};

const FormBuilderMock = React.createClass({
    render: function() {
        return <div>FormBuilder mock</div>;
    }
});

let component;
let instance;

var FieldPropertiesMock = React.createClass({
    render: function() {
        return (
            <div>{this.props.children}</div>
        );
    }
});

describe('FormBuilderContainer', () => {
    beforeEach(() => {
        jasmineEnzyme();
        FormBuilderRewireAPI.__Rewire__('FormBuilder', FormBuilderMock);
        NewfieldsMenuRewireAPI.__Rewire__('FieldTokenInMenu', FieldTokenInMenu);
        ExistingFieldsRewireAPI.__Rewire__('FieldTokenInMenu', FieldTokenInMenu);
        ToolPaletteRewireAPI.__Rewire__('ExistingFieldsMenu', ExistingFieldsMenu);
        FormBuilderRewireAPI.__Rewire__('FieldProperties', FieldPropertiesMock);
        FormBuilderRewireAPI.__Rewire__('FormBuilderCustomDragLayer', () => null); // Returning null so that DragDropContext error is not thrown in unit test

        spyOn(mockActions, 'loadForm');
        spyOn(mockActions, 'updateForm');
        spyOn(mockActions, 'toggleFormBuilderChildrenTabIndex');
        spyOn(mockActions, 'keyboardMoveFieldUp');
        spyOn(mockActions, 'keyboardMoveFieldDown');
        spyOn(mockActions, 'toggleToolPaletteChildrenTabIndex').and.callThrough();
        spyOn(mockActions, 'removeFieldFromForm');
        spyOn(mockActions, 'deselectField');
        spyOn(mockActions, 'setFormBuilderPendingEditToFalse');
        spyOn(mockActions, 'setFieldsPropertiesPendingEditToFalse');
    });

    afterEach(() => {
        FormBuilderRewireAPI.__ResetDependency__('FormBuilder');
        ToolPaletteRewireAPI.__ResetDependency__('ExistingFieldsMenu');
        NewfieldsMenuRewireAPI.__ResetDependency__('FieldTokenInMenu');
        ExistingFieldsRewireAPI.__ResetDependency__('FieldTokenInMenu');
        FormBuilderRewireAPI.__ResetDependency__('FieldProperties');
        FormBuilderRewireAPI.__ResetDependency__('FormBuilderCustomDragLayer');
        FormBuilderRewireAPI.__ResetDependency__('AppHistory');

        mockActions.loadForm.calls.reset();
        mockActions.updateForm.calls.reset();
        mockActions.toggleFormBuilderChildrenTabIndex.calls.reset();
        mockActions.keyboardMoveFieldUp.calls.reset();
        mockActions.keyboardMoveFieldDown.calls.reset();
        mockActions.removeFieldFromForm.calls.reset();
        mockActions.deselectField.calls.reset();
        mockActions.toggleToolPaletteChildrenTabIndex.calls.reset();
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
                component = shallow(<FormBuilderContainer
                    match={testParamsProp}
                    location={{query: {formType: testCase.formType}}}
                    loadForm={mockActions.loadForm}
                />);
                instance = component.instance();

                instance.componentDidMount();

                expect(mockActions.loadForm).toHaveBeenCalledWith(appId, tblId, null, testCase.expectedFormType, NEW_FORM_RECORD_ID);
            });
        });

    });

    describe('onCancel', () => {
        it('exits form builder', () => {
            spyOn(NavigationUtils, 'goBackToLocationOrTable');

            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                      isPendingEdit={false}
                                                      location={testLocationProp}
                                                      redirectRoute={previousLocation}/>);

            instance = component.instance();
            instance.closeFormBuilder();

            expect(NavigationUtils.goBackToLocationOrTable).toHaveBeenCalledWith(appId, tblId, previousLocation);
        });
    });


    describe('showing FormBuilder', () => {
        const testFormData = {fields: [], formMeta: {name: 'some form', includeBuiltIns: false}};
        let testCases = [
            {
                description: 'loads the FormBuilder if a form has loaded',
                currentForm: {loading: false, formData: testFormData},
                expectedLoaded: true,
                expectedFormData: testFormData
            },
            {
                description: 'shows the loading spinner if there is no form data',
                currentForm: undefined,
                expectedLoaded: false,
                expectedFormData: null
            },
            {
                description: 'shows the loading spinner if the form is not finished loading',
                currentForm: {loading: true},
                expectedLoaded: false,
                expectedFormData: null
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<FormBuilderContainer currentForm={testCase.currentForm} />);


                expect(component.find(Loader)).toBePresent();
                expect(component.find(Loader)).toHaveProp('loaded', testCase.expectedLoaded);

                let formBuilderComponent = component.find({formData: testCase.expectedFormData});
                expect(formBuilderComponent).toBePresent();
            });
        });
    });

    describe('saving on FormBuilder', () => {
        it('updates the form when the save button is clicked', () => {
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    currentForm={currentForm}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);

            let saveButton = component.find(SaveOrCancelFooter).dive().find('.mainTrowserFooterButton');

            saveButton.simulate('click');

            expect(mockActions.updateForm).toHaveBeenCalled();
        });
    });

    describe('keyboard navigation for formBuilder', () => {
        it(`will toggle the children tab indices if space is pressed and the tab indices are not already ${tabIndexConstants.FORM_TAB_INDEX}`, () => {
            let e = {
                which: 32,
                preventDefault() {}
            };

            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    currentForm={currentForm}
                                                    selectedField={selectedField}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).toHaveBeenCalled();
        });

        it('will not toggle the children tab indices if space or enter are not pressed', () => {
            let e = {
                which: 19,
                preventDefault() {}
            };

            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    currentForm={currentForm}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).not.toHaveBeenCalled();
        });

        it('escapeCurrentContext hotKey will invoke cancel if children tabindices do not equal parents tabindices and there is not a selected field', () => {
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={undefined}
                                                    toolPaletteChildrenTabIndex={undefined}
                                                    selectedField={undefined}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            spyOn(instance, 'onCancel');
            instance.escapeCurrentContext();

            expect(instance.onCancel).toHaveBeenCalled();
        });


        it('escapeCurrentContext hotKey will invoke toggleFormBuilderChildrenTabIndex if formBuilderChildrenTabIndex has the same index as form tab index', () => {
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    isPendingEdit={true}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={tabIndexConstants.FORM_TAB_INDEX}
                                                    toolPaletteChildrenTabIndex={undefined}
                                                    selectedField={undefined}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.escapeCurrentContext();

            expect(mockActions.toggleFormBuilderChildrenTabIndex).toHaveBeenCalledWith(currentForm.id, tabIndexConstants.FORM_TAB_INDEX);
        });

        it('escapeCurrentContext hotKey will invoke toggleToolPaletteChildrenTabIndex if toolPaletteChildrenTabIndex has the same index as tool palette tab index', () => {
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    isPendingEdit={true}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={undefined}
                                                    toolPaletteChildrenTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                                                    selectedField={undefined}
                                                    toggleToolPaletteChildrenTabIndex={mockActions.toggleToolPaletteChildrenTabIndex}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.escapeCurrentContext();

            expect(mockActions.toggleToolPaletteChildrenTabIndex).toHaveBeenCalledWith(currentForm.id, tabIndexConstants.TOOL_PALETTE_TABINDEX);
        });

        it('escapeCurrentContext hotKey will invoke toggleToolPaletteChildrenTabIndex if the enter key is pressed', () => {
            let e = {
                which: ENTER_KEY,
                preventDefault() {}
            };
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    isPendingEdit={true}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={undefined}
                                                    toolPaletteChildrenTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                                                    selectedField={undefined}
                                                    toggleToolPaletteChildrenTabIndex={mockActions.toggleToolPaletteChildrenTabIndex}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.toggleToolPaletteChildrenTabIndex(e);

            expect(mockActions.toggleToolPaletteChildrenTabIndex).toHaveBeenCalledWith(currentForm.id, '-1');
        });

        it('escapeCurrentContext hotKey will invoke toggleToolPaletteChildrenTabIndex if the space key is pressed', () => {
            let e = {
                which: SPACE_KEY,
                preventDefault() {}
            };
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    isPendingEdit={true}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={undefined}
                                                    toolPaletteChildrenTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                                                    selectedField={undefined}
                                                    toggleToolPaletteChildrenTabIndex={mockActions.toggleToolPaletteChildrenTabIndex}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.toggleToolPaletteChildrenTabIndex(e);

            expect(mockActions.toggleToolPaletteChildrenTabIndex).toHaveBeenCalledWith(currentForm.id, '-1');
        });

        it('escapeCurrentContext hotKey will not invoke toggleToolPaletteChildrenTabIndex if an invalid key is pressed', () => {
            let e = {
                which: 'INVALID_KEY_BOARD_PRESS',
                preventDefault() {}
            };
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    isPendingEdit={true}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={undefined}
                                                    toolPaletteChildrenTabIndex={tabIndexConstants.TOOL_PALETTE_TABINDEX}
                                                    selectedField={undefined}
                                                    toggleToolPaletteChildrenTabIndex={mockActions.toggleToolPaletteChildrenTabIndex}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.toggleToolPaletteChildrenTabIndex(e);

            expect(mockActions.toggleToolPaletteChildrenTabIndex).not.toHaveBeenCalled();
        });

        it('escapeCurrentContext hotKey will invoke deselectField if a field is selected', () => {
            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    isPendingEdit={true}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={undefined}
                                                    toolPaletteChildrenTabIndex={undefined}
                                                    selectedField={selectedField}
                                                    deselectField={mockActions.deselectField}
                                                    loadForm={mockActions.loadForm}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.escapeCurrentContext();

            expect(mockActions.deselectField).toHaveBeenCalledWith(currentForm.id, selectedField);
        });

        it(`enter and space will not toggle the children tab indices if the tabIndex is currently ${tabIndexConstants.FORM_TAB_INDEX}`, () => {
            let e = {
                which: 32,
                preventDefault() {return;}
            };

            component = shallow(<FormBuilderContainer match={testParamsProp}
                                                    currentForm={currentForm}
                                                    formBuilderChildrenTabIndex={tabIndexConstants.FORM_TAB_INDEX}
                                                    loadForm={mockActions.loadForm}
                                                    toggleFormBuilderChildrenTabIndex={mockActions.toggleFormBuilderChildrenTabIndex}
                                                    updateForm={mockActions.updateForm} />);


            instance = component.instance();
            instance.updateChildrenTabIndex(e);

            expect(mockActions.toggleFormBuilderChildrenTabIndex).not.toHaveBeenCalled();
        });

        it('will remove a field', () => {
            component = shallow(<FormBuilderContainer
                selectedField={selectedField}
                currentForm={currentForm}
                location={location}
                removeFieldFromForm={mockActions.removeFieldFromForm}
            />);

            instance = component.instance();

            instance.removeField();

            expect(mockActions.removeFieldFromForm).toHaveBeenCalledWith(currentForm.id, selectedField);
        });

        it('will move a field up if the selected form element is not at index 0', () => {
            component = shallow(<FormBuilderContainer
                selectedField={selectedField}
                currentForm={currentForm}
                location={location}
                keyboardMoveFieldUp={mockActions.keyboardMoveFieldUp}
            />);

            instance = component.instance();

            instance.keyboardMoveFieldUp();

            expect(mockActions.keyboardMoveFieldUp).toHaveBeenCalledWith(currentForm.id, selectedField);
        });

        it('will not move a field up if the selected form element is at index 0', () => {
            const locationAtIndexZero = {tabIndex: 0, sectionIndex: 1, columnIndex: 2, rowIndex: 3, elementIndex: 0};

            component = shallow(<FormBuilderContainer
                currentForm={currentForm}
                location={locationAtIndexZero}
                selectedField={locationAtIndexZero}
                keyBoardMoveFieldUp={mockActions.keyboardMoveFieldUp}
            />);

            instance = component.instance();

            instance.keyboardMoveFieldUp();

            expect(mockActions.keyboardMoveFieldUp).not.toHaveBeenCalled();
        });

        it('will move a field down if the selected form element is not located at the last index', () => {
            let currentFormData = {formData: {formMeta: {tabs:[{sections: [{columns: [{elements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}]}]}]}}, id: 'view'};

            component = shallow(<FormBuilderContainer
                selectedField={selectedField}
                currentForm={currentFormData}
                location={location}
                keyboardMoveFieldDown={mockActions.keyboardMoveFieldDown}
            />);

            instance = component.instance();

            instance.keyboardMoveFieldDown();

            expect(mockActions.keyboardMoveFieldDown).toHaveBeenCalledWith(currentFormData.id, selectedField);
        });

        it('will not move a field down if the selected form element is greater than the last index', () => {
            let currentFormData = {formData: {formMeta: {tabs:[{sections: [{columns: [{elements: []}]}]}]}}, id: 'view'};

            component = shallow(<FormBuilderContainer
                selectedField={selectedField}
                currentForm={currentFormData}
                location={location}
                keyboardMoveFieldDown={mockActions.keyboardMoveFieldDown}
            />);

            instance = component.instance();

            instance.keyboardMoveFieldDown();

            expect(mockActions.keyboardMoveFieldDown).not.toHaveBeenCalled();
        });
    });

    describe('formBuilderContainer save and cancel footer', () => {
        it('will return two right align buttons on the footer', () => {
            component = shallow(<FormBuilderContainer
                selectedField={selectedField}
                location={location}
                loadForm={mockActions.loadForm}
                keyboardMoveFieldDown={mockActions.keyboardMoveFieldDown}
            />);

            const saveOrCancelFooter = component.find(SaveOrCancelFooter).dive();

            expect(saveOrCancelFooter.find({className: 'alternativeTrowserFooterButton'})).toBePresent();
            expect(saveOrCancelFooter.find({className: 'mainTrowserFooterButton'})).toBePresent();
        });
    });
});
