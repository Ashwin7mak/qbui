import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ToolPalette, {__RewireAPI__ as ToolPaletteRewireAPI} from '../../../src/components/builder/builderMenus/toolPalette';
import {SUPPORTED_NEW_FIELDS_WITH_PROPERTIES} from '../../../src/components/formBuilder/newFieldTypes';

// Mock this out so that no animations occur during a unit test.
const mockFlipMove = ({children}) => <ul>{children}</ul>;

const mockLocale = {
    getMessage(message) {return message;}
};

let component;

describe('ToolPalette', () => {
    beforeEach(() => {
        jasmineEnzyme();

        ToolPaletteRewireAPI.__Rewire__('Locale', mockLocale);
        ToolPaletteRewireAPI.__Rewire__('FlipMove', mockFlipMove);
    });

    afterEach(() => {
        ToolPaletteRewireAPI.__ResetDependency__('Locale');
        ToolPaletteRewireAPI.__ResetDependency__('FlipMove');
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

    describe('filtering fields', () => {
        it('filters fields based on the search text', () => {
            component = mount(<ToolPalette/>);

            component.setState({activeFieldFilter: 'text'});

            expect(component.find('.toolPaletteItem').length).toEqual(3);
            expect(component.find('.emptySearchResult')).not.toBePresent();
        });

        it('shows a message if no fields match the search text', () => {
            component = mount(<ToolPalette/>);

            component.setState({activeFieldFilter: 'zzz'});

            expect(component.find('.emptySearchResult')).toBePresent();
            expect(component.find('.toolPaletteItem')).not.toBePresent();
        });
    });

});
