import React from 'react';
import {FilterSearchBox}  from '../../src/components/facet/filterSearchBox';
import * as actions from '../../src/constants/actions';
import {shallow} from 'enzyme';

describe('Filter Search box tests', () => {
    'use strict';

    let props = {
        search: {
            searchInput: 'searchInput',
            onChange: () => {},
            clearSearchString: () => {},
            searchBoxKey: 'key'
        }
    };

    it('verify search component renders', () => {
        let wrapper = shallow(<FilterSearchBox {...props}/>);
        const searchBoxValue = wrapper.find('.filterSearchBox').props().value;
        const placeHolderValue = wrapper.find('.filterSearchBox').props().placeholder;
        expect(searchBoxValue).toBe(props.search.searchInput);
        expect(placeHolderValue.length).toBeGreaterThan(0);
    });

});
