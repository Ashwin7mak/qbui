import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import NewFieldsMenu, {__RewireAPI__ as NewsFieldsMenuRewireApi} from '../../../src/components/formBuilder/menus/newFieldsMenu';
import ElementToken from '../../../../reuse/client/src/components/dragAndDrop/elementToken/elementToken';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import {supportedNewFieldTypesWithProperties} from '../../../src/components/formBuilder/newFieldTypes';

let component;

describe('NewFieldsMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NewsFieldsMenuRewireApi.__Rewire__('DraggableFieldTokenInMenu', ElementToken);
    });

    afterEach(() => {
        NewsFieldsMenuRewireApi.__ResetDependency__('DraggableFieldTokenInMenu');
    });

    it('displays a list of new field elements', () => {
        component = shallow(<NewFieldsMenu/>);

        let listOfElements = component.find(ListOfElements);
        expect(listOfElements).toBePresent();
        expect(listOfElements).toHaveProp('elements', supportedNewFieldTypesWithProperties());
    });
});
