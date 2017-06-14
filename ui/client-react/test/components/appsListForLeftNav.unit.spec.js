import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AppsList from '../../src/components/nav/appsListForLeftNav';
import NavItem from '../../src/components/nav/navItem';
import CreateNewItemButton from '../../src/components/nav/createNewItemButton';
import SearchBox from '../../src/components/search/searchBox';

let component;

describe('AppsListForLeftNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a new app button', () => {
        component = shallow(<AppsList />);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(1);
        expect(component.find(CreateNewItemButton).length).toEqual(1);
    });

    it('renders a list of apps', () => {
        component = shallow(<AppsList apps={[{name: 'mockAppName1', id: 1}, {name: 'mockAppName2', id: 2}, {name: 'mockAppName3', id: 3}]}/>);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(4);
        expect(component.find(CreateNewItemButton).length).toEqual(1);
    });
});
