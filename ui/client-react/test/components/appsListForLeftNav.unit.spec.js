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

    it('renders a new app button', () => {
        component = shallow(<AppsList />);

        expect(component.find(SearchBox).length).toEqual(1);
        expect(component.find(NavItem).length).toEqual(1);
        expect(component.find(CreateNewItemButton).length).toEqual(1);
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

    it('will createNewApp if a user has access rights', () => {
        spyOn(mockFuncs, 'showAppCreationDialog');
        component = mount(<AppsList apps={apps}
                                    showAppCreationDialog={mockFuncs.showAppCreationDialog}/>);

        instance = component.instance();
        spyOn(instance, 'allowCreateNewApp').and.returnValue(true);

        instance.createNewApp();

        expect(mockFuncs.showAppCreationDialog).toHaveBeenCalled();
    });

    it('will NOT createNewApp if a user does not have access rights', () => {
        spyOn(mockFuncs, 'showAppCreationDialog');
        component = mount(<AppsList apps={apps}
                                    showAppCreationDialog={mockFuncs.showAppCreationDialog}/>);

        instance = component.instance();
        spyOn(instance, 'allowCreateNewApp').and.returnValue(false);

        instance.createNewApp();

        expect(mockFuncs.showAppCreationDialog).not.toHaveBeenCalled();
    });

    it('a user is allowed to create an app', () => {
        let mockApp = {
            accessRights: {appRights: ['EDIT_SCHEMA']}
        };
        spyOn(mockFuncs, 'getApp').and.returnValue(mockApp);
        component = mount(<AppsList apps={apps}getApp={mockFuncs.getApp} />);

        instance = component.instance();
        let result = instance.allowCreateNewApp();

        expect(result).toEqual(true);
    });

    it('a user is NOT allowed to create an app', () => {
        let mockApp = {
            accessRights: {appRights: []}
        };
        spyOn(mockFuncs, 'getApp').and.returnValue(mockApp);
        component = mount(<AppsList apps={apps}getApp={mockFuncs.getApp} />);

        instance = component.instance();
        let result = instance.allowCreateNewApp();

        expect(result).toEqual(false);
    });
});
