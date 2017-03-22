import AccountUsersReducer from '../../../src/account/users/AccountUsersReducer';
import * as types from '../../../src/app/actionTypes';

let initialState = {};

function initializeState() {

    initialState = {
        users: []
    };
}

beforeEach(() => {
    initializeState();
});

describe('Account Users Reducers Tests', () => {

    describe('Test initial state of the reducer', () => {
        it('return correct initial state', () => {
            expect(AccountUsersReducer(undefined, {})).toEqual(initialState);
        });
    });


    describe('Test changing of states', () => {

        const ACCOUNT_USERS_DATA = [
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

        it('returns new set of users on SET_USERS', () => {
            // change the state when the SET action type is sent
            const state = AccountUsersReducer(initialState, {type: types.SET_USERS, users:ACCOUNT_USERS_DATA});
            expect(state.users).toEqual(ACCOUNT_USERS_DATA);
        });
    });

});

