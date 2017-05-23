import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import {ExistingFieldsMenu, __RewireAPI__ as ExistingFieldsMenuRewireApi} from '../../../src/components/formBuilder/menus/existingFieldsMenu';
import {FieldTokenInExistingMenu} from '../../../src/components/formBuilder/fieldToken/fieldTokenInMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';

let component;

describe('ExistingFieldsMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        ExistingFieldsMenuRewireApi.__Rewire__('FieldTokenInExistingMenu', FieldTokenInExistingMenu);
    });

    afterEach(() => {
        ExistingFieldsMenuRewireApi.__ResetDependency__('FieldTokenInExistingMenu');
    });

    fit('displays a list of new field elements', () => {
        component = shallow(<ExistingFieldsMenu existingFields={[<div></div>]}/>);

        let listOfElements = component.find(ListOfElements);
        expect(listOfElements).toBePresent();
        expect(listOfElements).toHaveProp('elements', [<div></div>]);
    });
});
