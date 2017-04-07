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

const mockActions = {
    updateField() {}
};

describe('FieldProperties', () => {

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockActions, 'updateField');
    });

    it('test render of component with no props', () => {
        component = shallow(<FieldProperties />);

        expect(component).toBePresent();
    });

    it('test createTextPropertyContainer', () => {
        component = shallow(<FieldProperties />);
        let name = "awesome";
        let value = "possum";

        instance = component.instance();
        let textPropertyContainer = mount(instance.createTextPropertyContainer(name, value));
        expect(textPropertyContainer.find('.textPropertyTitle')).toHaveText(name);
        expect(textPropertyContainer.find('.textPropertyValue')).toHaveValue(value);
    });

    it('test createBooleanPropertyContainer', () => {
        component = shallow(<FieldProperties />);
        let name = "super";
        let value = true;

        instance = component.instance();
        let checkboxPropertyContainer = mount(instance.createCheckBoxPropertyContainer(name, value));
        expect(checkboxPropertyContainer.find('CheckBoxFieldValueEditor')).toHaveValue(value);
        expect(checkboxPropertyContainer.find('CheckBoxFieldValueEditor')).toHaveText(name);
    });

    it('test createNameProperty', () => {
        component = shallow(<FieldProperties />);

        let name = Locale.getMessage('fieldPropertyLabels.name');
        let value = "slick rick";

        instance = component.instance();
        let nameProperty = mount(instance.createNameProperty(value));
        expect(nameProperty.find('.textPropertyTitle')).toHaveText(name);
        expect(nameProperty.find('.textPropertyValue')).toHaveValue(value);
    });

    it('test createRequiredProperty', () => {
        component = shallow(<FieldProperties />);

        let name = Locale.getMessage('fieldPropertyLabels.required');
        let value = true;

        instance = component.instance();
        let requiredProperty = mount(instance.createRequiredProperty(value));
        expect(requiredProperty.find('CheckBoxFieldValueEditor')).toHaveValue(value);
        expect(requiredProperty.find('CheckBoxFieldValueEditor')).toHaveText(name);
    });

    it('test createPropertiesTitle', () => {
        component = shallow(<FieldProperties />);

        let name = "Meow";
        let value = `${name} properties`;

        instance = component.instance();
        let nameProperty = mount(instance.createPropertiesTitle(name));
        expect(nameProperty.find('.fieldPropertiesTitle')).toHaveText(value);
    });
});
