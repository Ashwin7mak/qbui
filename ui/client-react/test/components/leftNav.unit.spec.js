import React from 'react';
import {mount} from 'enzyme';
import LeftNav from '../../src/components/nav/leftNav';
import {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import {MemoryRouter} from 'react-router-dom';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>{this.props.message}</div>
        );
    }
});


let appsTestData = [
    {
        id: 'app1',
        name: 'app1',
        icon: 'apple',
        link: '/app/app1',
        tables: [
            {
                id: 'table1',
                name: 'table1',
                icon: 'book',
                link: '/app/app1/table/table1'
            }
        ]
    }
];

let navItemsTestData = [
    {
        id:101,
        heading:true,
        key:101,
        name:'testHeading'
    },
    {
        id:102,
        key:102,
        name:'nav',
        link:'/apps'
    }
];

describe('Left Nav functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        NavItemRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        NavItemRewireAPI.__ResetDependency__('I18nMessage');
    });


    it('test render opened with app list', () => {

        component = mount(
                <MemoryRouter>
                    <LeftNav open={true}
                         appsListOpen={true}
                         apps={appsTestData}
                         items={navItemsTestData}
                             onToggleAppsList={() => {}} />
                </MemoryRouter>);
    });


    it('test render opened with app,table,reports', () => {
        component = mount(
                <MemoryRouter>
                    <LeftNav open={true}
                         appsListOpen={true}
                         apps={appsTestData}
                         selectedAppId={'app1'}
                         items={navItemsTestData}/>
                </MemoryRouter>);
    });

    it('test render closed with app,table,reports', () => {
        component = mount(
                <MemoryRouter>
                    <LeftNav open={false}
                         appsListOpen={true}
                         apps={appsTestData}
                         selectedAppId={'app1'}
                         items={navItemsTestData}/>
                </MemoryRouter>);

    });
});

describe('LeftNav', () => {
    let component;
    let validAppId = 'app1';
    let invalidAppId = 'doesnotexist';

    it('renders the apps list if an app is not selected', () => {
        component = mount(
            <MemoryRouter>
                <LeftNav open={false}
                         appsListOpen={false}
                         apps={appsTestData}
                         selectedAppId={null}
                         items={navItemsTestData}/>
            </MemoryRouter>);

        expect(component.find('.appsList').length).toEqual(1);
        expect(component.find('.tablesList').length).toEqual(0);
    });

    it('renders the tables list if a valid app is currently selected', () => {
        component = mount(
            <MemoryRouter>
                <LeftNav open={false}
                         appsListOpen={false}
                         apps={appsTestData}
                         selectedAppId={validAppId}
                         items={navItemsTestData}/>
            </MemoryRouter>);

        expect(component.find('.tablesList').length).toEqual(1);
        expect(component.find('.appsList').length).toEqual(0);
    });

    it('renders the apps list if an invalid/non-existing app is currently selected', () => {
        component = mount(
            <MemoryRouter>
                <LeftNav open={false}
                         appsListOpen={true}
                         apps={appsTestData}
                         selectedAppId={invalidAppId}
                         items={navItemsTestData}/>
            </MemoryRouter>);

        expect(component.find('.appsList').length).toEqual(1);
        expect(component.find('.tablesList').length).toEqual(0);
    });


    it('reloads the applist clicking on the brand ', () => {
        let wentTo = '';
        spyOn(WindowLocationUtils, 'getOrigin').and.returnValue('http://roothost');
        spyOn(WindowLocationUtils, 'update').and.callFake(function(url) {
            wentTo = url;
        });
        let expectedAppsURL = 'http://roothost/qbase/apps';
        component = mount(
            <MemoryRouter>
                <LeftNav open={true}
                         appsListOpen={false}
                         apps={appsTestData}
                         selectedAppId={validAppId}
                         items={navItemsTestData}/>
            </MemoryRouter>);

        console.log(component.html());
        expect(component.find('.branding').length).toEqual(1);
        component.find('.branding').simulate('click');
        expect(WindowLocationUtils.getOrigin).toHaveBeenCalled();
        expect(WindowLocationUtils.update).toHaveBeenCalledWith(expectedAppsURL);
        expect(wentTo).toEqual(expectedAppsURL);
    });
});
