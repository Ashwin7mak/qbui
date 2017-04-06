import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {FieldTokenInMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import ToolPalette from '../../../src/components/builder/builderMenus/toolPalette';
import NewFieldsMenu, {__RewireAPI__ as NewFieldsMenuRewireAPI} from '../../../src/components/formBuilder/menus/newFieldsMenu';

let component;

fdescribe('ToolPalette', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NewFieldsMenuRewireAPI.__Rewire__('FieldTokenInMenu', FieldTokenInMenu);
    });

    afterEach(() => {
        NewFieldsMenuRewireAPI.__ResetDependency__('FieldTokenInMenu');
    });

    it('displays new fields', () => {
        component = mount(<ToolPalette />);
        expect(component.find(NewFieldsMenu)).toBePresent();
    });
});
