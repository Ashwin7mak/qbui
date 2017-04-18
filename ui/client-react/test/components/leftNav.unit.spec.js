import React from 'react';
import {mount} from 'enzyme';
import createRouterContext from 'react-router-test-context';
import LeftNav from '../../src/components/nav/leftNav';
import NavItem, {__RewireAPI__ as NavItemRewireAPI} from '../../src/components/nav/navItem';
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

let reportsTestData = {
    error: false,
    loading: false,
    list: [
        {
            id: 1,
            name: 'List All',
            link: '/app/app1/table/table1/report/1'
        }
    ]
};

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

let navItemTestData =
    describe('Left Nav functions', () => {
        'use strict';

        var component;
        const context = createRouterContext();

        beforeEach(() => {
            NavItemRewireAPI.__Rewire__('I18nMessage', I18nMessageMock);
        });

        afterEach(() => {
            NavItemRewireAPI.__ResetDependency__('I18nMessage');
        });


        it('test render opened with app list', () => {

            component = mount(
                <LeftNav open={true}
                         appsListOpen={true}
                         apps={appsTestData}
                         items={navItemsTestData}
                         onToggleAppsList={() => {}} />,
                {context});
        });


        it('test render opened with app,table,reports', () => {
            component = mount(
                <LeftNav open={true}
                         appsListOpen={true}
                         apps={appsTestData}
                         selectedAppId={'app1'}
                         items={navItemsTestData}/>,
                {context});
        });

        it('test render closed with app,table,reports', () => {
            component = mount(
                <LeftNav open={false}
                         appsListOpen={true}
                         apps={appsTestData}
                         selectedAppId={'app1'}
                         items={navItemsTestData}/>,
                {context});

        });
    });

describe('LeftNav', () => {
    let component;
    let validAppId = 'app1';
    let invalidAppId = 'doesnotexist';
    const context = createRouterContext();

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
});
