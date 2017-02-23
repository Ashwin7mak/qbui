/**
 * Created by rbeyer on 2/22/17.
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
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
            "roleName": "Viewer"
        },
        {
            "firstName": "Tony",
            "lastName": "Stark",
            "screenName": "ironman",
            "email": "arcreactor@stark.com",
            "userId": "RDUII_UC",
            "roleName": "Participant"
        },
        {
            "firstName": "administrator",
            "lastName": "none",
            "screenName": "administrator",
            "email": "administrator@quickbase.com",
            "userId": "10000",
            "roleName": "Administrator"
        }
    ];
    const appUsersEmpty = [];
    const appId = 1;
    const userColumns = ['firstName','lastName','screenName','email','roleName'];

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<UserManagement appUsers={appUsers}
                                                                     appRoles={appRoles}
                                                                    appId={appId}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test createUserColumns method', () => {
        let cellFormatter = (cellData) => {return <span>{cellData}</span>;};
        let component = TestUtils.renderIntoDocument(<UserManagement appUsers={appUsers}
                                                                     appRoles={appRoles}
                                                                     appId={appId}/>);
        let columns = component.createUserColumns(cellFormatter);
        for (var i = 0; i < userColumns.length; i++) {
            expect(columns[i].property).toEqual(userColumns[i]);
        }
    });

    it('test createRows method with users and roles data', () => {
        let component = TestUtils.renderIntoDocument(<UserManagement appUsers={appUsers}
                                                                     appRoles={appRoles}
                                                                     appId={appId}/>);
        let users = component.createUserRows();
        expect(users).toEqual(usersResolved);
    });

    it('test createRows method with NO users and roles data', () => {
        let component = TestUtils.renderIntoDocument(<UserManagement appUsers={appUsersEmpty}
                                                                     appRoles={appRoles}
                                                                     appId={appId}/>);
        let users = component.createUserRows();
        expect(users).toEqual([]);
    });
});
