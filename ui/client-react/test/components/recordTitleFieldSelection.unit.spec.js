import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {mount} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import RecordTitleFieldSelection from '../../src/components/table/recordTitleFieldSelection';

import _ from 'lodash';

describe('RecordTitleFieldSelection functions', () => {
    let component;

    const props = {
        onChange: () => {},
        tableInfo: {
            tableNoun: {
                value: "tableNoun"
            },
            fields: {
                value: [
                    {id:1, builtIn: true,  type: "SCALAR",    name: "Date Created"},          // ignore, builtIn
                    {id:2, builtIn: false, type: "NOTSCALAR", name: "Some non scalar field"}, // ignore, not SCALAR
                    {id:3, builtIn: false, type: "SCALAR",    name: "Record ID#"},            // include, ID=3
                    {id:4, builtIn: false, type: "SCALAR",    name: "Some Field"}             // include not builtIn
                ]
            }
        }
    };

    beforeEach(() => {
        jasmineEnzyme();

    });

    afterEach(() => {

    });

    it('renders RecordTitleFieldSelection component with default title field', () => {
        component = mount(<RecordTitleFieldSelection {...props}/>);

        let selectLabel = component.find(".Select-value-label");
        expect(component.find(RecordTitleFieldSelection)).toBePresent();
        expect(selectLabel).toBePresent();
        expect(selectLabel.text()).toEqual("Default to tableNoun + ID");

    });

    it('renders RecordTitleFieldSelection with a provided title field and selection works', () => {

        let newProps = _.cloneDeep(props);
        newProps.tableInfo.recordTitleFieldId = {value:3};

        spyOn(newProps, 'onChange');

        component = mount(<RecordTitleFieldSelection {...newProps}/>);

        let selectLabel = component.find(".Select-value-label");
        expect(selectLabel).toBePresent();
        expect(selectLabel.text()).toEqual("Record ID#");

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
        expect(newProps.onChange).toHaveBeenCalledWith(3);
    });
});

