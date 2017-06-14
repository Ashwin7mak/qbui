import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TablesList from '../../src/components/nav/tablesList';
import NavItem from '../../src/components/nav/navItem';
import CreateNewItemButton from '../../src/components/nav/createNewItemButton';
import SearchBox from '../../src/components/search/searchBox';

let component;
let mockFunc = {
    getAppTables(_selectedAppId, _apps) {},
    onCreateNewTable(_selectedAppId, _apps) {}
};

describe('TablesList', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockFunc, 'getAppTables').and.returnValue([{}]);
    });

    afterEach(() => {
        mockFunc.getAppTables.calls.reset();
    });

    it('renders a new table button', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable} />);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(4);
        expect(component.find(CreateNewItemButton).length).toEqual(1);
    });
});
