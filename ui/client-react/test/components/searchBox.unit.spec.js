import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import SearchBox from '../../src/components/search/searchBox';

/**
 * This component is relocated to the reuse library and renamed "IconInputBox".
 * This test is only to verify that this stub class is working.
 * Unit test for the actual code is in the reuse library.
 */

let component;

describe('SearchBox', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders the component', () => {
        component = mount(<SearchBox placeholder="test"/>);

        expect(component.find('input')).toBePresent();
    });
});
