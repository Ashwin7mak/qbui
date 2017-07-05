import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TablesList, {__RewireAPI__ as TablesListRewireAPI} from '../../src/components/nav/tablesList';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import {Link} from 'react-router-dom';
import CreateNewItemButton from '../../../reuse/client/src/components/sideNavs/createNewItemButton';
import SearchBox from '../../src/components/search/searchBox';

let component;
let instance;

let mockFunc = {
    getAppTables(_selectedAppId, _apps) {},
    onCreateNewTable(_selectedAppId, _apps) {}
};

const LinkMock = React.createClass({
    render() {
        return <div className="linkMock">{this.props.children}</div>;
    }
});

describe('TablesList', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NavItemRewireAPI.__Rewire__('Link', LinkMock);
        TablesListRewireAPI.__Rewire__('Link', LinkMock);
        spyOn(mockFunc, 'getAppTables').and.returnValue([{}]);
    });

    afterEach(() => {
        mockFunc.getAppTables.calls.reset();
        NavItemRewireAPI.__ResetDependency__('Link');
        TablesListRewireAPI.__ResetDependency__('Link');
    });

    it('sets searching to false when clicked', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable}/>);

        instance = component.instance();
        component.setState({searching: true});
        instance.onClickTables();

        expect(component.state().searching).toEqual(false);
    });

    it('sets searching to true and searchText to an empty string when clicked', () => {
        component = mount(<TablesList getAppTables={mockFunc.getAppTables}
                                      onCreateNewTable={mockFunc.onCreateNewTable}/>);

        instance = component.instance();
        component.setState({searching: false});
        instance.onClickTables();

        expect(component.state().searching).toEqual(true);
        expect(component.state().searchText).toEqual("");
    });

    it('sets searchText to target', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable}/>);

        let ev = {target: {value: 'mockSearchValue'}};
        instance = component.instance();
        component.setState({searching: false});
        instance.onChangeSearch(ev);

        expect(component.state().searchText).toEqual('mockSearchValue');
    });

    it('sets searchText to an empty string', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable}/>);

        instance = component.instance();
        component.setState({searchText: 'mockSearchValue'});
        instance.onClearSearch();

        expect(component.state().searchText).toEqual('');
    });

    it('renders a new button', () => {
        component = shallow(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable}
                                        tables={['1', '2']}/>);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(4);
        expect(component.find(CreateNewItemButton)).toBePresent();
        expect(component.find('.emptyState')).not.toBePresent();
        expect(component.find('.createNewIcon')).not.toBePresent();
        expect(component.find('.iconMessage')).not.toBePresent();
    });

    it('renders empty message when there are no tables', () => {
        component = mount(<TablesList getAppTables={mockFunc.getAppTables}
                                        onCreateNewTable={mockFunc.onCreateNewTable}
                                        tables={[]}/>);

        expect(component.find(CreateNewItemButton)).not.toBePresent();
        expect(component.find('.emptyState')).toBePresent();
        expect(component.find('.createNewIcon')).toBePresent();
        expect(component.find('.iconMessage')).toBePresent();
    });

    it('renders empty message when tables are undefined', () => {
        component = mount(<TablesList getAppTables={mockFunc.getAppTables}
                                      onCreateNewTable={mockFunc.onCreateNewTable}/>);

        expect(component.find(CreateNewItemButton)).not.toBePresent();
        expect(component.find('.emptyState')).toBePresent();
        expect(component.find('.createNewIcon')).toBePresent();
        expect(component.find('.iconMessage')).toBePresent();
    });
});
