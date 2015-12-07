import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import LeftNav from '../../src/components/nav/leftNav';

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

    beforeEach(() => {
        LeftNav.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        LeftNav.__ResetDependency__('I18nMessage');
    });

    it('test render opened with app list', () => {
        component = TestUtils.renderIntoDocument(<LeftNav open={true} apps={appsTestData} reportsData={reportsTestData} items={navItemsTestData}/>);
    });

    it('test render opened with app,table,reports', () => {
        component = TestUtils.renderIntoDocument(<LeftNav open={true} apps={appsTestData} selectedAppId={'app1'} reportsData={reportsTestData} items={navItemsTestData}/>);
    });

    it('test render closed with app,table,reports', () => {
        component = TestUtils.renderIntoDocument(<LeftNav open={false} apps={appsTestData} selectedAppId={'app1'} reportsData={reportsTestData} items={navItemsTestData}/>);
    });

});
