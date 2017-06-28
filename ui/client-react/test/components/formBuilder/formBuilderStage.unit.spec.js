import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {mount} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {FormBuilderStage} from '../../../src/components/formBuilder/formBuilderStage';

import _ from 'lodash';

describe('FormBuilderStage functions', () => {
    let component;

    const props = {
        setRequiredPropForRecordTitleField: () => {},
        updateAppTableProperties: () => {},
        table: {
            tableNoun: 'tableNoun',
            fields: [
                    {id:1, builtIn: true,  type: 'SCALAR',    name: 'Date Created'},          // ignore, builtIn
                    {id:2, builtIn: false, type: 'NOTSCALAR', name: 'Some non scalar field'}, // ignore, not SCALAR
                    {id:3, builtIn: false, type: 'SCALAR',    name: 'Record ID#'},            // include, ID=3
                    {id:4, builtIn: false, type: 'SCALAR',    name: 'Some Field'}             // include not builtIn
            ]
        }
    };

    beforeEach(() => {
        jasmineEnzyme();

    });

    afterEach(() => {

    });

    it('renders the stage with default props', () => {
        component = mount(<FormBuilderStage {...props}/>);

        let selectLabel = component.find('.titleField');
        expect(selectLabel).toBePresent();
        expect(selectLabel.text()).toEqual('Default to tableNoun + ID');

    });

    it('renders the title field picker when titleField is clicked on', () => {
        component = mount(<FormBuilderStage {...props}/>);

        let selectLabel = component.find('.titleField');
        expect(selectLabel).toBePresent();
        selectLabel.simulate('click');

        let titlePicker = component.find('RecordTitleFieldSelection');
        expect(titlePicker).toBePresent();
    });

    it('selecting a value on the picker hides the picker and renders the titleField', () => {
        component = mount(<FormBuilderStage {...props}/>);

        let titleField = component.find('.titleField');
        expect(titleField).toBePresent();
        titleField.simulate('click');

        let titlePicker = component.find('RecordTitleFieldSelection');
        expect(titlePicker).toBePresent();

        let select = component.find(".Select-value");
        expect(select).toBePresent();
        select.simulate('mouseDown', {button: 0});

        // need to focus on the new input element to get the dropdown to render
        let input = component.find("input");
        expect(input).toBePresent();
        input.simulate('focus');

        let menu = component.find('.Select-menu-outer');
        expect(menu).toBePresent();

        let options = component.find('.Select-option');
        expect(options.length).toEqual(3);

        // click on record ID#
        options.at(0).simulate('mouseDown', {button: 0});

        titlePicker = component.find('RecordTitleFieldSelection');
        expect(titlePicker).not.toBePresent();
        titleField = component.find('.titleField');
        expect(titleField).toBePresent();
    });
});

