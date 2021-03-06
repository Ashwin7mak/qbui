/**
 * Created by rbeyer on 2/22/17.
 */
import React from 'react';
import {shallow} from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import jasmineEnzyme from 'jasmine-enzyme';
import UserManagement  from '../../../../../src/components/app/settings/categories/userManagement';

describe('UserManagement functions', () => {
    'use strict';

    const appUsers = {
        10: [
            {
                "firstName": "Steve",
                "lastName": "Rogers",
                "screenName": "Cap",
                "email": "imissthe40s@shield.com",
                "userId": "RDUII_UB"
            }
        ],
        11: [
            {
                "firstName": "Tony",
                "lastName": "Stark",
                "screenName": "ironman",
                "email": "arcreactor@stark.com",
                "userId": "RDUII_UC"
            }
        ],
        12: [
            {
                "firstName": "administrator",
                "lastName": "none",
                "screenName": "administrator",
                "email": "administrator@quickbase.com",
                "userId": "10000"
            }
        ]
    };
    const appRoles = [
        {
            "id": 9,
            "name": "none",
            "description": "",
            "access": "NONE"
        },
        {
            "id": 10,
            "name": "Viewer",
            "description": "",
            "access": "BASIC"
        },
        {
            "id": 11,
            "name": "Participant",
            "description": ""
        },
        {
            "id": 12,
            "name": "Administrator",
            "description": ""
        }
    ];
    const usersResolved = [
        {
            "firstName": "Steve",
            "lastName": "Rogers",
            "screenName": "Cap",
            "email": "imissthe40s@shield.com",
            "userId": "RDUII_UB",
            "roleName": "Viewer",
            "name": "Steve Rogers",
            "isSelected": false,
            "roleId": 10
        },
        {
            "firstName": "Tony",
            "lastName": "Stark",
            "screenName": "ironman",
            "email": "arcreactor@stark.com",
            "userId": "RDUII_UC",
            "roleName": "Participant",
            "name": "Tony Stark",
            "isSelected": false,
            "roleId": 11
        },
        {
            "firstName": "administrator",
            "lastName": "none",
            "screenName": "administrator",
            "email": "administrator@quickbase.com",
            "userId": "10000",
            "roleName": "Administrator",
            "name": "administrator none",
            "isSelected": false,
            "roleId": 12
        }
    ];
    const appUsersEmpty = [];
    const appId = 1;
    const userColumns = ['name', 'roleName', 'email', 'screenName'];
    const selectedRows = [];

    beforeEach(() => {
        jasmineEnzyme();
    });

    it('test render of component', () => {
        let component = shallow(<UserManagement appUsers={appUsers} appRoles={appRoles} selectedRows={selectedRows} appId={appId}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test createUserColumns method', () => {
        let cellFormatter = (cellData) => {return <span>{cellData}</span>;};
        let component = shallow(<UserManagement appUsers={appUsers} appRoles={appRoles} selectedRows={selectedRows} appId={appId}/>);
        let instance = component.instance();
        let columns = instance.createUserColumns(cellFormatter);
        for (var i = 0; i < userColumns.length; i++) {
            expect(columns[i].property).toEqual(userColumns[i]);
        }
    });

    it('test createRows method with users and roles data', () => {
        let component = shallow(<UserManagement appUsers={appUsers} appRoles={appRoles} selectedRows={selectedRows} appId={appId}/>);
        let instance = component.instance();
        let users = instance.createUserRows();
        expect(users).toEqual(usersResolved);
    });

    it('test getActionCellProps method', () => {
        let component = shallow(<UserManagement appUsers={appUsersEmpty} appRoles={appRoles} selectedRows={selectedRows} appId={appId}/>);
        let instance = component.instance();
        let cellProps = instance.getActionCellProps();
        expect(cellProps).toEqual({isStickyCell: true});
    });


});
