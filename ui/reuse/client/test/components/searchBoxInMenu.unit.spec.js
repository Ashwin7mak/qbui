import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import SearchBoxInMenu from '../../src/components/searchBoxInMenu/searchBoxInMenu';

let component;

describe('SearchBoxInMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays the current search text', () => {
        const testText = 'Testing 1 2 3';
        component = mount(<SearchBoxInMenu searchText={testText} />);

        expect(component.find('input')).toHaveProp('value', testText);
    });
});
