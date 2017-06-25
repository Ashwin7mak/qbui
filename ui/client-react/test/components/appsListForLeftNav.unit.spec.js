import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import {AppsList} from '../../src/components/nav/appsListForLeftNav';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import {Link} from 'react-router-dom';
import CreateNewItemButton from '../../../reuse/client/src/components/sideNavs/createNewItemButton';
import EmptyStateForLeftNav from "../../../reuse/client/src/components/sideNavs/emptyStateForLeftNav";
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
        expect(component.find(EmptyStateForLeftNav)).not.toBePresent();
        expect(component.find('.emptyState')).not.toBePresent();
        expect(component.find('.createNewIcon')).not.toBePresent();
    });

    it('renders empty message when there are no apps', () => {
        component = mount(<AppsList apps={[]}/>);

        expect(component.find(EmptyStateForLeftNav)).toBePresent();
        expect(component.find(CreateNewItemButton)).not.toBePresent();
        expect(component.find('.emptyState')).toBePresent();
        expect(component.find('.createNewIcon')).toBePresent();
    });

    it('renders empty message when apps are undefined', () => {
        component = mount(<AppsList/>);

        expect(component.find(EmptyStateForLeftNav)).toBePresent();
        expect(component.find(CreateNewItemButton)).not.toBePresent();
        expect(component.find('.emptyState')).toBePresent();
        expect(component.find('.createNewIcon')).toBePresent();
    });
});
