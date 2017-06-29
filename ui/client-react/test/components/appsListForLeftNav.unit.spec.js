import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AppsList} from '../../src/components/nav/appsListForLeftNav';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import {Link} from 'react-router-dom';
import CreateNewItemButton from '../../../reuse/client/src/components/sideNavs/createNewItemButton';
import SearchBox from '../../src/components/search/searchBox';

let component;
let instance;

let apps = [
    {name: 'mockAppName1', id: 1},
    {name: 'mockAppName2', id: 2},
    {name: 'mockAppName3', id: 3}
];

let mockFuncs = {
    getApp() {},
    showAppCreationDialog() {}
};

const LinkMock = React.createClass({
    render() {
        return <div className="linkMock">{this.props.children}</div>;
    }
});

describe('AppsListForLeftNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
        NavItemRewireAPI.__Rewire__('Link', LinkMock);
    });

    afterEach(() => {
        NavItemRewireAPI.__ResetDependency__('Link');
    });

    it('renders a list of apps', () => {
        component = shallow(<AppsList apps={apps}/>);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(4);
        expect(component.find(CreateNewItemButton).length).toEqual(1);
    });

    it('sets searching to false when clicked', () => {
        component = shallow(<AppsList apps={apps}/>);

        instance = component.instance();
        component.setState({searching: true});
        instance.onClickApps();

        expect(component.state().searching).toEqual(false);
    });

    it('will createNewApp', () => {
        spyOn(mockFuncs, 'showAppCreationDialog');
        component = mount(<AppsList apps={apps}
                                    showAppCreationDialog={mockFuncs.showAppCreationDialog}/>);

        instance = component.instance();
        instance.createNewApp();

        expect(mockFuncs.showAppCreationDialog).toHaveBeenCalled();
    });

    it('renders a new app button', () => {
        component = shallow(<AppsList apps={apps}/>);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(4);
        expect(component.find(CreateNewItemButton)).toBePresent();
        expect(component.find('.emptyState')).not.toBePresent();
        expect(component.find('.createNewIcon')).not.toBePresent();
        expect(component.find('.iconMessage')).not.toBePresent();
    });

    it('renders empty message when there are no apps', () => {
        component = mount(<AppsList apps={[]}/>);

        expect(component.find(CreateNewItemButton)).not.toBePresent();
        expect(component.find('.emptyState')).toBePresent();
        expect(component.find('.createNewIcon')).toBePresent();
        expect(component.find('.iconMessage')).toBePresent();
    });

    it('renders empty message when apps are undefined', () => {
        component = mount(<AppsList/>);

        expect(component.find(CreateNewItemButton)).not.toBePresent();
        expect(component.find('.emptyState')).toBePresent();
        expect(component.find('.createNewIcon')).toBePresent();
        expect(component.find('.iconMessage')).toBePresent();
    });

    it('sets the searchText state to an empty string', () => {
        component = mount(<AppsList/>);

        component.setState({searchText: 'mockSearchText'});

        instance = component.instance();
        instance.onClearSearch();

        expect(component).toHaveState('searchText', '');
    });

    it('changes the searchText state', () => {
        let ev = {
            target: {
                value: 'newMockSearchText'
            }
        };
        component = mount(<AppsList/>);

        component.setState({searching: false});

        instance = component.instance();
        instance.onClickApps(ev);

        expect(component).toHaveState('searching', true);
        expect(component).toHaveState('searchText', '');
    });
});
