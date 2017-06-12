import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import NewFieldsMenu, {__RewireAPI__ as NewsFieldsMenuRewireApi} from '../../../src/components/formBuilder/menus/newFieldsMenu';
import {FieldTokenInMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import {supportedNewFieldTypesWithProperties} from '../../../src/components/formBuilder/newFieldTypes';

let component;

describe('NewFieldsMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NewsFieldsMenuRewireApi.__Rewire__('DraggableFieldTokenInMenu', FieldTokenInMenu);
    });

    afterEach(() => {
        NewsFieldsMenuRewireApi.__ResetDependency__('FieldTokenInMenu');
    });

    it('displays a list of new field elements', () => {
        component = shallow(<NewFieldsMenu/>);

        let listOfElements = component.find(ListOfElements);
        expect(listOfElements).toBePresent();
        expect(listOfElements).toHaveProp('elements', supportedNewFieldTypesWithProperties());
    });
});
