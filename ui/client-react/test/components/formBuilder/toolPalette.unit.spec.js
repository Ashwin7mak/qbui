import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import ElementToken from '../../../../reuse/client/src/components/dragAndDrop/elementToken/elementToken';
import ToolPalette, {__RewireAPI__ as ToolPaletteRewireAPI} from '../../../src/components/builder/builderMenus/toolPalette';
import NewFieldsMenu, {__RewireAPI__ as NewFieldsMenuRewireAPI} from '../../../src/components/formBuilder/menus/newFieldsMenu';
import {ExistingFieldsMenu, __RewireAPI__ as ExistingFieldsMenuMenuRewireAPI} from '../../../src/components/formBuilder/menus/existingFieldsMenu';

let component;

describe('ToolPalette', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NewFieldsMenuRewireAPI.__Rewire__('DraggableFieldTokenInMenu', ElementToken);
        ExistingFieldsMenuMenuRewireAPI.__Rewire__('DraggableFieldTokenInMenu', ElementToken);
        ToolPaletteRewireAPI.__Rewire__('ExistingFieldsMenu', ExistingFieldsMenu);
    });

    afterEach(() => {
        NewFieldsMenuRewireAPI.__ResetDependency__('DraggableFieldTokenInMenu');
        ExistingFieldsMenuMenuRewireAPI.__ResetDependency__('DraggableFieldTokenInMenu');
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
