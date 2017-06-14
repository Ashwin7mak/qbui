/**
 * Created by rbeyer on 4/1/17.
 */
import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Locale from '../../../../../reuse/client/src/locales/locale';
import {FieldProperties, __RewireAPI__ as FieldPropertiesRewireAPI} from '../../../../src/components/builder/builderMenus/fieldProperties';
import serverTypeConsts from '../../../../../common/src/constants';

let component;
let instance;

let appId = 1;
let tableId = 2;
let formId = "view";
let field = {id: 6, required: true, name: "Dat Field", datatypeAttributes: {type: "TEXT"}};
let multiChoiceField = {id: 7, required: false, unique: false, name: "Leeloo Dallas MultiChoice", datatypeAttributes: {type: "TEXT"},
    multipleChoice: {choices: [{coercedValue: {value: "Fifth Element"}, displayValue: "Fifth Element"},
        {coercedValue: {value: "Ultimate Weapon"}, displayValue: "Ultimate Weapon"}]}};
let linkToRecordField = {id: 8, required: false, unique: false, name: "get parent record", parentTableId: "parentId", parentFieldId: 1, datatypeAttributes: {type: "LINK_TO_RECORD"}};
let fieldType = {required: false, datatypeAttributes: {type: serverTypeConsts.CHECKBOX}};
let formElement = {FormFieldElement: {fieldId: 6}};
let formElementMultiChoice = {FormFieldElement: {fieldId: 7}};
let formElementLinkToRecord = {FormFieldElement: {fieldId: 8}};

const mockActions = {
    updateField() {},
    getField() {return field;},
    getSelectedFormElement() {return formElement;}
};

describe('FieldProperties', () => {

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'updateField');
        spyOn(mockActions, 'getField');
        spyOn(mockActions, 'getSelectedFormElement');
    });

    afterEach(() => {
        mockActions.updateField.calls.reset();
        mockActions.getField.calls.reset();
        mockActions.getSelectedFormElement.calls.reset();
    });

    describe('component rendering', () => {
        it('with no props', () => {
            component = shallow(<FieldProperties />);

            expect(component).toBePresent();
        });

        it('with no selectedField prop', () => {
            component = shallow(<FieldProperties appId={appId} tableId={tableId} formId={formId}/>);

            expect(component).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).not.toBePresent();
            expect(component.find('CheckBoxFieldValueEditor')).not.toBePresent();
            expect(component.find('.textPropertyTitle')).not.toBePresent();
        });

        it('with selectedField prop that is multiChoice', () => {
            component = mount(<FieldProperties appId={appId} tableId={tableId} formId={formId}
                                               selectedField={multiChoiceField} formElement={formElementMultiChoice}/>);

            expect(component).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toHaveText(Locale.getMessage('fieldPropertyLabels.title'));
            expect(component.find('CheckBoxFieldValueEditor')).toBePresent();
            expect(component.find('CheckBoxFieldValueEditor').at(0)).toHaveValue(multiChoiceField.required);
            expect(component.find('CheckBoxFieldValueEditor').at(1)).toHaveValue(multiChoiceField.unique);
            expect(component.find('.textPropertyTitle')).toBePresent();
            expect(component.find('.textPropertyValue')).toHaveValue(multiChoiceField.name);
            expect(component.find('MultiLineTextFieldValueEditor')).toBePresent();
            expect(component.find('MultiLineTextFieldValueEditor')).toHaveValue(instance.buildMultiChoiceDisplayList(multiChoiceField.multipleChoice.choices));
        });

        it('with selectedField prop that is linkToRecord', () => {
            let app = {
                tables: [
                    {tableIcon: "icon1", name: "child table", id: "2"},
                    {tableIcon: "icon2", name: "parent table", id: "parentId", fields: [{id:1, name:"recordTitleField"}]}
                ]
            };
            component = mount(<FieldProperties appId={appId} tableId={tableId} formId={formId} app={app}
                                               selectedField={linkToRecordField} formElement={formElementLinkToRecord}/>);

            expect(component).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toHaveText(Locale.getMessage('fieldPropertyLabels.title'));
            expect(component.find('CheckBoxFieldValueEditor')).toBePresent();
            expect(component.find('CheckBoxFieldValueEditor').at(0)).toHaveValue(linkToRecordField.required);
            expect(component.find('CheckBoxFieldValueEditor').at(1)).toHaveValue(linkToRecordField.unique);
            expect(component.find('.textPropertyTitle')).toBePresent();
            expect(component.find('.textPropertyValue')).toHaveValue(linkToRecordField.name);
            expect(component.find('.linkToRecordLinkedToValue')).toBePresent();
            expect(component.find('.linkToRecordConnectedOnValue')).toBePresent();
        });

        it('will invoke only createRequireProperty if fieldType prop === checkbox ', () => {
            let app = {
                tables: [
                    {tableIcon: "icon1", name: "child table", id: "2"},
                    {tableIcon: "icon2", name: "parent table", id: "parentId", fields: [{id:1, name:"recordTitleField"}]}
                ]
            };
            component = mount(<FieldProperties appId={appId} tableId={tableId} formId={formId} app={app}
                                               selectedField={fieldType} />);

            expect(component).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toHaveText(Locale.getMessage('fieldPropertyLabels.title'));
            expect(component.find('CheckBoxFieldValueEditor')).toBePresent();
            expect(component.find('CheckBoxFieldValueEditor')).toHaveValue(fieldType.required);
            expect(component.find('CheckBoxFieldValueEditor').length).toEqual(1);
            expect(component.find('.textPropertyTitle')).toBePresent();
        });
    });

    describe('updating a property ', () => {
        it('updateField is dispatched', () => {
            component = mount(<FieldProperties appId={appId} tableId={tableId} formId={formId}
                                               selectedField={field} formElement={formElement}
                                               updateField={mockActions.updateField}/>);
            let checkBox = component.find('CheckBoxFieldValueEditor').at(0);
            checkBox.simulate('click');
            expect(mockActions.updateField).toHaveBeenCalled();
        });
    });

    describe('createTextPropertyContainer', () => {
        it('renders with proper title and value', () => {
            component = shallow(<FieldProperties />);
            let name = "awesome";
            let value = "possum";

            instance = component.instance();
            let textPropertyContainer = mount(instance.createTextPropertyContainer(name, value));
            expect(textPropertyContainer.find('.textPropertyTitle')).toHaveText(name);
            expect(textPropertyContainer.find('.textPropertyValue')).toHaveValue(value);
        });
    });

    describe('createBooleanPropertyContainer', () => {
        it('renders with proper title and value', () => {
            component = shallow(<FieldProperties />);
            let name = "super";
            let value = true;

            instance = component.instance();
            let checkboxPropertyContainer = mount(instance.createCheckBoxPropertyContainer(name, value));
            expect(checkboxPropertyContainer.find('CheckBoxFieldValueEditor')).toHaveValue(value);
            expect(checkboxPropertyContainer.find('CheckBoxFieldValueEditor')).toHaveText(name);
        });
    });

    describe('createNameProperty', () => {
        it('renders with proper property name, title, and value', () => {
            component = shallow(<FieldProperties />);

            let name = Locale.getMessage('fieldPropertyLabels.name');
            let value = "grand brand";

            instance = component.instance();
            let nameProperty = mount(instance.createNameProperty(value));
            expect(nameProperty.find('.textPropertyTitle')).toHaveText(name);
            expect(nameProperty.find('.textPropertyValue')).toHaveValue(value);
        });
    });

    describe('createRequiredProperty', () => {
        it('renders with proper property name, title, and value', () => {
            component = shallow(<FieldProperties />);

            let name = Locale.getMessage('fieldPropertyLabels.required');
            let value = true;

            instance = component.instance();
            let requiredProperty = mount(instance.createRequiredProperty(value));
            expect(requiredProperty.find('CheckBoxFieldValueEditor')).toHaveValue(value);
            expect(requiredProperty.find('CheckBoxFieldValueEditor')).toHaveText(name);
        });
    });

    describe('createUniqueProperty', () => {
        it('renders with proper property name, title, and value', () => {
            component = shallow(<FieldProperties />);

            let name = Locale.getMessage('fieldPropertyLabels.unique');
            let value = true;

            instance = component.instance();
            let requiredProperty = mount(instance.createUniqueProperty(value));
            expect(requiredProperty.find('CheckBoxFieldValueEditor')).toHaveValue(value);
            expect(requiredProperty.find('CheckBoxFieldValueEditor')).toHaveText(name);
        });
    });

    describe('updateFieldProps', () => {
        it('will update field properties', () => {
            component = shallow(<FieldProperties updateField={mockActions.updateField}
                                                 appId={appId}
                                                 tableId={tableId}
                                                 selectedField={{}}/>);

            let propertyName = 'mockPropertyName';
            let value = true;

            instance = component.instance();
            instance.updateFieldProps(value, propertyName);

            expect(mockActions.updateField).toHaveBeenCalledWith({},  appId, tableId, propertyName, value);
        });
    });

    describe('createPropertiesTitle', () => {
        it('renders with title container with proper name', () => {
            component = shallow(<FieldProperties />);

            let title = Locale.getMessage('fieldPropertyLabels.title');

            instance = component.instance();
            let nameProperty = mount(instance.createPropertiesTitle());
            expect(nameProperty.find('.fieldPropertiesTitle')).toHaveText(title);
        });
    });

    describe('updateMultiChoiceFieldProps', () => {
        it('confirm that multiChoice Text fields update correctly', () => {
            let newValues = "5\nfifthElement";
            let choices = [{coercedValue: {value: "5"}, displayValue: "5"},
                {coercedValue: {value: "fifthElement"}, displayValue: "fifthElement"}];
            let newField = multiChoiceField;
            newField.multipleChoice.choices = choices;
            component = shallow(<FieldProperties appId={appId} tableId={tableId} formId={formId}
                                                 selectedField={multiChoiceField} formElement={formElementMultiChoice}
                                                 updateField={mockActions.updateField}/>);

            instance = component.instance();
            instance.updateMultiChoiceFieldProps(newValues);
            expect(mockActions.updateField).toHaveBeenCalledWith(newField, appId, tableId);
        });
    });
});
