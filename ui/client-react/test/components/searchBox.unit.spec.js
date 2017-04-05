import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import SearchBox from '../../src/components/search/searchBox';
import Icon from '../../../reuse/client/src/components/icon/icon';

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
        let placeholderText = "test";
        component = shallow(<SearchBox placeholder={placeholderText}/>);

        expect(component.find('input')).toBePresent();
    });
});
