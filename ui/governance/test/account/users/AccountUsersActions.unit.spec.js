import * as actions from '../../../src/account/users/AccountUsersActions';
import * as types from '../../../src/app/actionTypes';
import {__RewireAPI__ as AccountUsersActionsRewireAPI} from '../../../src/account/users/AccountUsersActions';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('Account Users Actions Tests', () => {

    let ACCOUNT_USERS_DATA = [
        {
            "uid": 10000,
            "firstName": "Administrator",
            "lastName": "User for default SQL Installation",
            "email": "koala_bumbles@quickbase.com",
            "userName": "administrator",
            "lastAccess": "2017-02-28T19:32:04.223Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 0,
            "hasAppAccess": true,
            "numAppsManaged": 2,
            "userBasicFlags": 24576,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 0,
            "systemRights": -1
        },
        {
            "uid": 56760756,
            "firstName": "Koala",
            "lastName": "Bumbles",
            "email": "koala.bumbles.jr@g88.net",
            "userName": "koala.bumbles.jr@g88.net",
            "lastAccess": "2017-02-22T23:29:02.56Z",
            "numGroupsMember": 0,
            "numGroupsManaged": 1,
            "hasAppAccess": true,
            "numAppsManaged": 0,
            "userBasicFlags": 8192,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 13362,
            "systemRights": 0
        }];

    var middleware =  [thunk];
    const mockStore = configureMockStore(middleware);

    // Mock the service
    class mockAccountUsersService {

        constructor() { }

        // resolve the promise with responseData
        getAccountUsers(id) {
            return Promise.resolve({data: ACCOUNT_USERS_DATA});
        }
    }

    beforeEach(() => {
        AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', mockAccountUsersService);
    });

    afterEach(() => {
        AccountUsersActionsRewireAPI.__ResetDependency__('AccountUsersService');
    });

    it('gets users', (done) => {

        const expectedActions = [
            {type: types.SET_USERS, users: ACCOUNT_USERS_DATA}
        ];

        const store = mockStore({});

        // expect the dummy data when the fetchAccountUsers is called
        return store.dispatch(actions.fetchAccountUsers(1)).then(

            () => {
                expect(store.getActions(1)).toEqual(expectedActions);
                done();
            },

            (e) => {
                expect(false).toBe(true);
                done();
            });
    });

});
