/**
 * Created by rbeyer on 4/1/17.
 */
import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Locale from '../../../../../reuse/client/src/locales/locale';
import {FieldProperties, __RewireAPI__ as FieldPropertiesRewireAPI} from '../../../../src/components/builder/builderMenus/fieldProperties';

let component;
let instance;

let appId = 1;
let tableId = 2;
let formId = "view";
let field = {id: 6, required: true, name: "Dat Field", datatypeAttributes: {type: "TEXT"}};
let multiChoicefield = {id: 7, required: false, name: "Leeloo Dallas MultiChoice", datatypeAttributes: {type: "TEXT"},
    multipleChoice: {choices: [{coercedValue: {value: "Fifth Element"}, displayValue: "Fifth Element"},
        {coercedValue: {value: "Ultimate Weapon"}, displayValue: "Ultimate Weapon"}]}};
let formElement = {FormFieldElement: {fieldId: 6}};
let formElementMultiChoice = {FormFieldElement: {fieldId: 7}};


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
                                               selectedField={multiChoicefield} formElement={formElementMultiChoice}/>);

            expect(component).toBePresent();
            instance = component.instance();
            expect(component.find('.fieldPropertiesTitle')).toBePresent();
            expect(component.find('.fieldPropertiesTitle')).toHaveText(`${multiChoicefield.name} properties`);
            expect(component.find('CheckBoxFieldValueEditor')).toBePresent();
            expect(component.find('CheckBoxFieldValueEditor')).toHaveValue(multiChoicefield.required);
            expect(component.find('.textPropertyTitle')).toBePresent();
            expect(component.find('.textPropertyValue')).toHaveValue(multiChoicefield.name);
            expect(component.find('MultiLineTextFieldValueEditor')).toBePresent();
            expect(component.find('MultiLineTextFieldValueEditor')).toHaveValue(instance.buildMultiChoiceDisplayList(multiChoicefield.multipleChoice.choices));
        });
    });

    describe('updating a property ', () => {
        it('updateField is dispatched', () => {
            component = mount(<FieldProperties appId={appId} tableId={tableId} formId={formId}
                                               selectedField={field} formElement={formElement}
                                               updateField={mockActions.updateField}/>);
            let checkBox = component.find('CheckBoxFieldValueEditor');
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
            let value = "slick rick";

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

    describe('createPropertiesTitle', () => {
        it('renders with title container with proper name', () => {
            component = shallow(<FieldProperties />);

            let name = "Meow";
            let value = `${name} properties`;

            instance = component.instance();
            let nameProperty = mount(instance.createPropertiesTitle(name));
            expect(nameProperty.find('.fieldPropertiesTitle')).toHaveText(value);
        });
    });
});
