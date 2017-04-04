import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ToolPalette from '../../../src/components/builder/builderMenus/toolPalette';
import NewFieldsMenu from '../../../src/components/formBuilder/menus/newFieldsMenu';

let component;

describe('ToolPalette', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays new fields', () => {
        component = mount(<ToolPalette />);
        expect(component.find(NewFieldsMenu)).toBePresent();
    });
});
