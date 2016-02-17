import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportManager from '../../src/components/report/reportManager';

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

    list: [
        {
            id: 1,
            name: 'List All',
            link: '/app/app1/table/table1/report/1'
        },
        {
            id: 2,
            name: 'List Changes',
            link: '/app/app1/table/table1/report/2'
        }
    ]
};


describe('Report Manager functions', () => {
    'use strict';

    var component;

    it('test render opened with app list', () => {

        component = TestUtils.renderIntoDocument(<ReportManager reportsData={reportsTestData}
                                                                onSelectReport={()=>{}} />);
    });

});
