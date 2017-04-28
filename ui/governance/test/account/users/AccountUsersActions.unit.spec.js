import {FORBIDDEN, INTERNAL_SERVER_ERROR} from  "../../../../client-react/src/constants/urlConstants";
import * as actions from "../../../src/account/users/AccountUsersActions";
import {__RewireAPI__ as AccountUsersActionsRewireAPI} from "../../../src/account/users/AccountUsersActions";
import * as types from "../../../src/app/actionTypes";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Promise from "bluebird";

describe('Account Users Actions Tests', () => {
    // Dummy Data
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
            "uid": 30000,
            "firstName": "Zadministrator",
            "lastName": "ZUser for default SQL Installation",
            "email": "Zkoala_bumbles@quickbase.com",
            "userName": "Zadministrator",
            "lastAccess": "2019-02-28T19:32:04.223Z",
            "numGroupsMember": 100,
            "numGroupsManaged": 100,
            "hasAppAccess": false,
            "numAppsManaged": 200,
            "userBasicFlags": 24576,
            "accountTrusteeFlags": 0,
            "realmDirectoryFlags": 0,
            "systemRights": 0
        },
        {
            "uid": 20000,
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
            "realmDirectoryFlags": 4,
            "systemRights": 0
        }];

    describe('Fetch Actions', () => {
        let mockAccountId = 1;
        const mockWindowUtils = {
            update: url => url,
        };

        let middleware = [thunk];
        const mockStore = configureMockStore(middleware);

        // Mock the service
        class mockAccountUsersService {
            constructor() {}
            // resolve the promise with dummy responseData
            getAccountUsers() {
                return Promise.resolve({data: ACCOUNT_USERS_DATA});
            }
        }

        beforeEach(() => {
            spyOn(mockWindowUtils, 'update');
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', mockAccountUsersService);
            AccountUsersActionsRewireAPI.__Rewire__('WindowLocationUtils', mockWindowUtils);
        });

        afterEach(() => {
            AccountUsersActionsRewireAPI.__ResetDependency__('AccountUsersService', mockAccountUsersService);
            AccountUsersActionsRewireAPI.__ResetDependency__('WindowLocationUtils', mockWindowUtils);
        });

        it('gets dummy users', (done) => {
            const expectedActions = [
                {type: types.GET_USERS_FETCHING},
                {type: types.GET_USERS_SUCCESS, users: ACCOUNT_USERS_DATA}
            ];
            // expect the dummy data when the fetchAccountUsers is called
            const store = mockStore({});
            return store.dispatch(actions.fetchAccountUsers(mockAccountId)).then(() =>
                    expect(store.getActions(mockAccountId)).toEqual(expectedActions)
                , error => expect(false).toBe(true)).then(done, done);
        });

        it('should do nothing if we receive a 401', (done) => {
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', class {
                constructor() {}
                getAccountUsers(accountId) {
                    return Promise.reject({response: {status: 401}});
                }
            });
            const store = mockStore({});
            store.dispatch(actions.fetchAccountUsers(mockAccountId)).then(() => {
                expect(mockWindowUtils.update).not.toHaveBeenCalledWith(FORBIDDEN);
                expect(mockWindowUtils.update).not.toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
            }, e => expect(false).toEqual(true)).then(done, done);
        });

        it('should redirect to FORBIDDEN when encountering a 403', (done) => {
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', class {
                constructor() {}
                getAccountUsers(accountId) {
                    return Promise.reject({response: {status: 403}});
                }
            });
            const store = mockStore({});
            store.dispatch(actions.fetchAccountUsers(mockAccountId)).then(() => {
                expect(mockWindowUtils.update).toHaveBeenCalledWith(FORBIDDEN);
            }, e => expect(false).toEqual(true)).then(done, done);
        });

        it('should redirect to INTERNAL_SERVER_ERROR when encountering any other error', (done) => {
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', class {
                constructor() {}
                getAccountUsers(accountId) {
                    return Promise.reject({response: {status: 500}});
                }
            });
            const store = mockStore({});
            store.dispatch(actions.fetchAccountUsers(mockAccountId)).then(() => {
                expect(mockWindowUtils.update).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
            }, e => expect(false).toEqual(true)).then(done, done);
        });
    });

    describe('Update Actions', () => {

        let middleware = [thunk];
        const mockStore = configureMockStore(middleware);
        let USERS = [
            {
                "uid": 10000,
                "firstName": "Administrator",
            },
            {
                "uid": 10000,
                "firstName": "ZAdministrator",
            },
            {
                "uid": 10000,
                "firstName": "BAdministrator",
            }];

        let SORTED_USERS = [
            {
                "uid": 10000,
                "firstName": "Administrator",
            },
            {
                "uid": 10000,
                "firstName": "BAdministrator",
            },
            {
                "uid": 10000,
                "firstName": "ZAdministrator",
            }];

        it('dispatches correctly', () => {

            const store = mockStore({AccountUsers: {users: USERS}});
            store.dispatch(actions.doUpdate(1, {sortFids: [1]}));
            expect(store.getActions(1)).toEqual([{type: types.GET_USERS_SUCCESS, users: SORTED_USERS}]);
        });
    });

    describe('Sort Action', () => {

        it('sorts the text columns by firstname correctly', () => {
            let sortedUsersAsc = actions.sortUsers(ACCOUNT_USERS_DATA, [1]);
            expect(sortedUsersAsc[0].firstName).toEqual('Administrator');
            expect(sortedUsersAsc[1].firstName).toEqual('Koala');
            expect(sortedUsersAsc[2].firstName).toEqual('Zadministrator');

            let sortedUsersDsc = actions.sortUsers(ACCOUNT_USERS_DATA, [-1]);
            expect(sortedUsersDsc[0].firstName).toEqual('Zadministrator');
            expect(sortedUsersDsc[1].firstName).toEqual('Koala');
            expect(sortedUsersDsc[2].firstName).toEqual('Administrator');
        });

        it('sorts the numeric columns by QuickBase Access Status correctly', () => {
            let sortedUsersAsc = actions.sortUsers(ACCOUNT_USERS_DATA, [8]);
            expect(sortedUsersAsc[0].numGroupsMember).toEqual(0);
            expect(sortedUsersAsc[1].numGroupsMember).toEqual(0);
            expect(sortedUsersAsc[2].numGroupsMember).toEqual(100);

            let sortedUsersDsc = actions.sortUsers(ACCOUNT_USERS_DATA, [-8]);
            expect(sortedUsersDsc[0].numGroupsMember).toEqual(100);
            expect(sortedUsersDsc[1].numGroupsMember).toEqual(0);
            expect(sortedUsersDsc[2].numGroupsMember).toEqual(0);
        });

        it('sorts the boolean columns by HasAnyRealmPermissions correctly', () => {
            let sortedUsersAsc = actions.sortUsers(ACCOUNT_USERS_DATA, [12]);
            expect(sortedUsersAsc[0].realmDirectoryFlags).toEqual(0);
            expect(sortedUsersAsc[1].realmDirectoryFlags).toEqual(0);
            expect(sortedUsersAsc[2].realmDirectoryFlags).toEqual(4);

            let sortedUsersDsc = actions.sortUsers(ACCOUNT_USERS_DATA, [-12]);
            expect(sortedUsersDsc[0].realmDirectoryFlags).toEqual(4);
            expect(sortedUsersDsc[1].realmDirectoryFlags).toEqual(0);
            expect(sortedUsersDsc[2].realmDirectoryFlags).toEqual(0);
        });
    });
});
