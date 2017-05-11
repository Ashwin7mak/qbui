import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import GenericFacetItem from '../../../src/components/facets/genericFacetItem';

let component;

const testFacetName = 'test';
const testSelectedValue = 'a';
const testFacetValues = [
    {value: testSelectedValue},
    {value: 'b'}
];

const testSelectedFacetValues = [testSelectedValue];

const testFacet = {
    id: 16,
    name: testFacetName,
    hasMore: false,
    values: []
};
const testFacetWithValues = {
    ...testFacet,
    values: testFacetValues
};

const parentActions = {
    onClickClearFacetValues() {},
    onClickFacet() {},
    onClickFacetValue() {}
};

describe('GenericFacetItem', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('displays the name of the facet which can be clicked', () => {
        spyOn(parentActions, 'onClickFacet');

        component = mount(<GenericFacetItem facet={testFacet} onClickFacet={parentActions.onClickFacet} isExpanded={false}/>);

        expect(component.find('.facetName')).toIncludeText(testFacetName);
        expect(component.find('.clearFacetContainer')).not.toBePresent();
        expect(component.find('.listMore')).not.toBePresent();

        component.find('.facetName').simulate('click');

        expect(parentActions.onClickFacet).toHaveBeenCalledWith(testFacet, false, undefined);
    });

    it('displays a clickable button that will clear facets when there are selected facets', () => {
        spyOn(parentActions, 'onClickClearFacetValues');

        component = mount(<GenericFacetItem
            facet={testFacetWithValues}
            selectedFacetValues={testSelectedFacetValues}
            onClickClearFacetValues={parentActions.onClickClearFacetValues}
            isExpanded={true}
        />);

        expect(component.find('.clearFacetContainer')).toBePresent();

        component.find('.clearSelectedFacetsButton').simulate('mouseDown');

        expect(parentActions.onClickClearFacetValues).toHaveBeenCalledWith(testFacetWithValues);
    });

    it('can display a "show more" button below the list of facet values', () => {
        component = mount(<GenericFacetItem
            facet={{...testFacetWithValues, hasMore: true}}
            isExpanded={true}
        />);

        expect(component.find('.listMore')).toBePresent();
    });
});
