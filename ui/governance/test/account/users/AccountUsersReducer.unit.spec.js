import AccountUsersReducer, {
    isFetching,
    usersSelector,
    getTotalPaidUsers,
    getTotalDeniedUsers,
    getTotalDeactivatedUsers,
    getTotalRealmUsers} from "../../../src/account/users/AccountUsersReducer";

import * as types from "../../../src/app/actionTypes";

let initialState = {};

function initializeState() {

    initialState = {
        users: [],
        status: {isFetching: false, error: null}
    };
}

beforeEach(() => {
    initializeState();
});

describe('Account Users Reducers Tests', () => {

    const noAppAccessUser = {
        "uid": 10000,
        "firstName": "Administrator",
        "lastName": "User for default SQL Installation",
        "email": "koala_bumbles@quickbase.com",
        "userName": "administrator",
        "lastAccess": "2017-02-28T19:32:04.223Z",
        "numGroupsMember": 0,
        "numGroupsManaged": 0,
        "hasAppAccess": false,
        "numAppsManaged": 2,
        "userBasicFlags": 24576,
        "accountTrusteeFlags": 0,
        "realmDirectoryFlags": 0,
        "systemRights": 1
    };

    const noSystemPermissionsUser = {
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
        "systemRights": 1
    };

    const deniedUser = {
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
        "realmDirectoryFlags": 0x0008,
        "systemRights": 1
    };

    const deactivatedUser = {
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
        "userBasicFlags": 0x00000040,
        "accountTrusteeFlags": 0,
        "realmDirectoryFlags": 0,
        "systemRights": 1
    };

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

    describe('Test initial state of the reducer', () => {

        it('return correct initial state', () => {
            expect(AccountUsersReducer(undefined, {})).toEqual(initialState);
        });
    });

    describe('Test changing of states', () => {

        it('returns new set of users on SET_USERS', () => {
            // change the state when the SET action type is sent
            const state = AccountUsersReducer(initialState, {type: types.GET_USERS_SUCCESS, users:ACCOUNT_USERS_DATA});
            expect(state.users).toEqual(ACCOUNT_USERS_DATA);
        });
    });

    describe('isFetching', () => {

        it("should return true while fetching the account users ", () => {
            expect(isFetching({AccountUsers:{...initialState, status: {...initialState.status, isFetching: true}}})).toEqual(true);
        });

        it("should return false while we have completed fetching the account users ", () => {
            expect(isFetching({AccountUsers:{...initialState}})).toEqual(false);
        });
    });

    describe('usersSelector', () => {

        it('should return an empty array if users information from the state is empty', () => {
            expect(usersSelector({AccountUsers: {...initialState}})).toEqual([]);
        });

        it('should return an empty array if users information from the state is empty', () => {
            expect(usersSelector({AccountUsers: {...initialState, users: ACCOUNT_USERS_DATA}})).toEqual(ACCOUNT_USERS_DATA);
        });
    });

    describe('getTotalPaidUsers', () => {

        it('should return 0 if no users', () => {
            expect(getTotalPaidUsers({AccountUsers: {...initialState}})).toEqual(0);
        });

        it('should return 0 if no paid users', () => {
            let noPaidUsers = [
                noAppAccessUser,
                noSystemPermissionsUser,
                deniedUser,
                deactivatedUser
            ];

            expect(getTotalPaidUsers({AccountUsers: {...initialState, users: noPaidUsers}})).toEqual(0);
        });

        it('should return number > 0 if paid users exist', () => {
            expect(getTotalPaidUsers({AccountUsers: {...initialState, users: ACCOUNT_USERS_DATA}})).toEqual(1);
        });
    });

    describe('getTotalDeniedUsers', () => {
        it('should return 0 if no users', () => {
            expect(getTotalDeniedUsers({AccountUsers: {...initialState}})).toEqual(0);
        });

        it('should return 0 if no denied users', () => {
            let noDeniedUsers = [
                noAppAccessUser,
                noSystemPermissionsUser,
                deactivatedUser
            ];

            expect(getTotalDeniedUsers({AccountUsers: {...initialState, users: noDeniedUsers}})).toEqual(0);
        });

        it('should return number > 0 if denied users exist', () => {
            expect(getTotalDeniedUsers({AccountUsers: {...initialState, users: [deniedUser, deniedUser, noAppAccessUser]}})).toEqual(2);
        });
    });

    describe('getTotalDeactivatedUsers', () => {
        it('should return 0 if no users', () => {
            expect(getTotalDeactivatedUsers({AccountUsers: {...initialState}})).toEqual(0);
        });

        it('should return 0 if no deactivated users', () => {
            let noDeactivatedUsers = [
                noAppAccessUser,
                noSystemPermissionsUser,
                deniedUser
            ];

            expect(getTotalDeactivatedUsers({AccountUsers: {...initialState, users: noDeactivatedUsers}})).toEqual(0);
        });

        it('should return number > 0 if deactivated users exist', () => {
            expect(getTotalDeactivatedUsers({AccountUsers: {...initialState, users: [deactivatedUser, deactivatedUser, noAppAccessUser]}})).toEqual(2);
        });
    });

    describe('getTotalRealmUsers', () => {
        it('should return 0 if no users', () => {
            expect(getTotalRealmUsers({AccountUsers: {...initialState}})).toEqual(0);
        });

        it('should return 0 if no realm users', () => {
            let noRealmUsers = [
                noAppAccessUser,
                noSystemPermissionsUser,
                deactivatedUser,
            ];

            expect(getTotalRealmUsers({AccountUsers: {...initialState, users: noRealmUsers}})).toEqual(0);
        });

        it('should return number > 0 if realm users exist', () => {
            expect(getTotalRealmUsers({AccountUsers: {...initialState, users: ACCOUNT_USERS_DATA}})).toEqual(1);
        });
    });
});

