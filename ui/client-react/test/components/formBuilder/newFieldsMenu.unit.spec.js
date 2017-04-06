import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import NewFieldsMenu from '../../../src/components/formBuilder/menus/newFieldsMenu';
import ListOfElements from '../../../../reuse/client/src/components/sideNavs/listOfElements';
import {supportedNewFieldTypesWithProperties} from '../../../src/components/formBuilder/newFieldTypes';

let component;

describe('NewFieldsMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays a list of new field elements', () => {
        component = shallow(<NewFieldsMenu />);

        let listOfElements = component.find(ListOfElements);
        expect(listOfElements).toBePresent();
        expect(listOfElements).toHaveProp('elements', supportedNewFieldTypesWithProperties());
    });
});
