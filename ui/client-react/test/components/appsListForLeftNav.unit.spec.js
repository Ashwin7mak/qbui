import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AppsList from '../../src/components/nav/appsListForLeftNav';
import NavItem from '../../src/components/nav/createNewItemButton';
import CreateNewItemButton from '../../src/components/nav/navItem';
import SearchBox from '../../src/components/search/searchBox';

let component;

describe('AppsListForLeftNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
    });

    it('renders a new app button', () => {
        component = shallow(<AppsList />);

        expect(component.find(CreateNewItemButton).length).toEqual(1);
        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(1);
    });
});
