import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {FieldTokenInMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import ToolPalette, {__RewireAPI__ as ToolPaletteRewireAPI} from '../../../src/components/builder/builderMenus/toolPalette';
import NewFieldsMenu, {__RewireAPI__ as NewFieldsMenuRewireAPI} from '../../../src/components/formBuilder/menus/newFieldsMenu';
import {ExistingFieldsMenu, __RewireAPI__ as ExistingFieldsMenuMenuRewireAPI} from '../../../src/components/formBuilder/menus/existingFieldsMenu';

let component;

describe('ToolPalette', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NewFieldsMenuRewireAPI.__Rewire__('DraggableFieldTokenInMenu', FieldTokenInMenu);
        ExistingFieldsMenuMenuRewireAPI.__Rewire__('DraggableFieldTokenInMenu', FieldTokenInMenu);
        ToolPaletteRewireAPI.__Rewire__('ExistingFieldsMenu', ExistingFieldsMenu);
    });

    afterEach(() => {
        NewFieldsMenuRewireAPI.__ResetDependency__('FieldTokenInMenu');
        ExistingFieldsMenuMenuRewireAPI.__ResetDependency__('FieldTokenInMenu');
        ToolPaletteRewireAPI.__ResetDependency__('ExistingFieldsMenu');
    });

    it('displays new fields', () => {
        component = mount(<ToolPalette />);
        expect(component.find(NewFieldsMenu)).toBePresent();
    });

    it('displays existing fields', () => {
        component = mount(<ToolPalette appId="1" tableId="2" />);
        expect(component.find(ExistingFieldsMenu)).toBePresent();
    });
});
