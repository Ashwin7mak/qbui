import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import GenericFacetMenu from '../../../src/components/facets/genericFacetMenu';

const testFacetName = 'Test Facet';
const testFacetSelectedValue = 'test';
const testNotSelectedValue = 'another value';
const testFacets = [
    {
        id: 16,
        name: testFacetName,
        values: [{value: testFacetSelectedValue}, {value: testNotSelectedValue}]
    }
];

const testSelectedFacetValues = {
    16: [testFacetSelectedValue]
};

const parentActions = {
    onClickFacetMenu() {},
    menuVisibilityChanged() {}
};

let component;

describe('FacetMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('shows a facet icon', () => {
        component = mount(<GenericFacetMenu />);

        expect(component.find('.facetButtons')).toBePresent();
        expect(component.find('.iconUISturdy-filter-tool')).toBePresent();
        expect(component.find('.iconUISturdy-filter-status')).not.toBePresent();
    });

    it('shows a filled in filter icon when there are selections', () => {
        component = mount(<GenericFacetMenu selectedFacetValues={testSelectedFacetValues}/>);

        expect(component.find('.iconUISturdy-filter-status')).toBePresent();
        expect(component.find('.iconUISturdy-filter-tool')).not.toBePresent();
    });

    it('has a filter icon that can be clicked to open or close the menu', () => {
        spyOn(parentActions, 'onClickFacetMenu');
        component = mount(<GenericFacetMenu onClickFacetMenu={parentActions.onClickFacetMenu} isMenuVisible={true} />);

        component.find('.facetButtons').simulate('click');

        expect(parentActions.onClickFacetMenu).toHaveBeenCalledWith(true);
    });

    it('renders a list of selected facets', () => {
        component = shallow(<GenericFacetMenu facets={testFacets} selectedFacetValues={testSelectedFacetValues} />);

        let facetToken = component.find('.facetToken');

        expect(facetToken).toIncludeText(testFacetName);
        expect(facetToken.find('.facetSelections .selectedTokenName').length).toEqual(1);
        expect(facetToken.find('.facetSelections .selectedTokenName')).toIncludeText(testFacetSelectedValue);
    });

    describe('onMenuShow', () => {
        it('fires the menuVisibilityChanged callback with true', () => {
            spyOn(parentActions, 'menuVisibilityChanged');
            component = shallow(<GenericFacetMenu menuVisibilityChanged={parentActions.menuVisibilityChanged}/>);

            component.instance().onMenuShow();

            expect(parentActions.menuVisibilityChanged).toHaveBeenCalledWith(true);
        });
    });

    describe('onMenuHide', () => {
        it('fires the menuVisibilityChanged callabck with false', () => {
            spyOn(parentActions, 'menuVisibilityChanged');
            component = shallow(<GenericFacetMenu menuVisibilityChanged={parentActions.menuVisibilityChanged}/>);

            component.instance().onMenuHide();

            expect(parentActions.menuVisibilityChanged).toHaveBeenCalledWith(false);
        });
    });
});
