import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ToolPalette, {__RewireAPI__ as ToolPaletteRewireAPI} from '../../../src/components/builder/builderMenus/toolPalette';
import {SUPPORTED_NEW_FIELDS_WITH_PROPERTIES} from '../../../src/components/formBuilder/newFieldTypes';

const mockLocale = {
    getMessage(message) {return message;}
};

let component;

describe('ToolPalette', () => {
    beforeEach(() => {
        jasmineEnzyme();

        ToolPaletteRewireAPI.__Rewire__('Locale', mockLocale);
    });

    afterEach(() => {
        ToolPaletteRewireAPI.__ResetDependency__('Locale');
    });

    it('displays groups of fields', () => {
        component = mount(<ToolPalette />);

        const headers = component.find('.toolPaletteItemHeader');
        expect(headers.length).toEqual(SUPPORTED_NEW_FIELDS_WITH_PROPERTIES.length);
        SUPPORTED_NEW_FIELDS_WITH_PROPERTIES.forEach((groupType, index) => {
            expect(headers.at(index)).toHaveText(groupType.titleI18nKey);
        });
    });

    it('displays all of the supported fields', () => {
        component = mount(<ToolPalette/>);

        const fieldTypes = component.find('.toolPaletteItem');
        SUPPORTED_NEW_FIELDS_WITH_PROPERTIES.reduce((fields, currentFieldGroup) => [...fields, ...currentFieldGroup.fieldTypes], []).forEach((field, index) => {
            expect(fieldTypes.at(index)).toIncludeText(field.title);
        });
    });
});
