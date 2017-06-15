import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TablesList from '../../src/components/nav/tablesList';
import NavItem from '../../src/components/nav/navItem';
import CreateNewItemButton from '../../src/components/nav/createNewItemButton';
import SearchBox from '../../src/components/search/searchBox';

let component;
let instance;
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

    it('sets searching to false when clicked', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable} />);

        instance = component.instance();
        component.setState({searching: true});
        instance.onClickTables();

        expect(component.state().searching).toEqual(false);
    });

    it('sets searching to true and searchText to an empty string when clicked', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable} />);

        instance = component.instance();
        component.setState({searching: false});
        instance.onClickTables();

        expect(component.state().searching).toEqual(true);
        expect(component.state().searchText).toEqual("");
    });

    it('sets searchText to target', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable} />);

        let ev = {target:{value: 'mockSearchValue'}};
        instance = component.instance();
        component.setState({searching: false});
        instance.onChangeSearch(ev);

        expect(component.state().searchText).toEqual('mockSearchValue');
    });

    it('sets searchText to an empty string', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable} />);

        instance = component.instance();
        component.setState({searchText: 'mockSearchValue'});
        instance.onClearSearch();

        expect(component.state().searchText).toEqual('');
    });
});
