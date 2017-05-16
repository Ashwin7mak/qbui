import {FORBIDDEN, INTERNAL_SERVER_ERROR} from "../../../../client-react/src/constants/urlConstants";
import * as actions from "../../../src/account/users/AccountUsersActions";
import {__RewireAPI__ as AccountUsersActionsRewireAPI} from "../../../src/account/users/AccountUsersActions";
import * as types from "../../../src/app/actionTypes";
import * as gridTypes from "../../../src/common/grid/standardGridActionTypes";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Promise from "bluebird";
import FacetSelections from "../../../../reuse/client/src/components/facets/facetSelections";
import GovernanceBundleLoader from '../../../src/locales/governanceBundleLoader';
import {FACET_FIELDID} from "./grid/AccountUsersGridFacet.unit.spec";

describe('Account Users Actions Tests', () => {


    // Dummy Data
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
            "firstName": "FirstNameFilter",
            "lastName": "lastNameFilter",
            "email": "emailFilter@g88.net",
            "userName": "userNameFilter",
            "lastAccess": "1900-01-01T00:00:00Z",
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
        let mockAccountId = 1, mockGridID = 1, mockItemsPerPage = 10;
        const mockWindowUtils = {
            update: url => url,
        };

        let middleware = [thunk];
        const mockStore = configureMockStore(middleware);

        // Mock the service
        class mockAccountUsersService {
            constructor() {
            }

            // resolve the promise with dummy responseData
            getAccountUsers() {
                return Promise.resolve({data: ACCOUNT_USERS_DATA});
            }
        }

        beforeEach(() => {
            spyOn(mockWindowUtils, 'update');
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', mockAccountUsersService);
            AccountUsersActionsRewireAPI.__Rewire__('WindowLocationUtils', mockWindowUtils);
            GovernanceBundleLoader.changeLocale('en-us');
        });

        afterEach(() => {
            AccountUsersActionsRewireAPI.__ResetDependency__('AccountUsersService', mockAccountUsersService);
            AccountUsersActionsRewireAPI.__ResetDependency__('WindowLocationUtils', mockWindowUtils);
            GovernanceBundleLoader.changeLocale('en-us');
        });

        it('gets dummy users', (done) => {
            const expectedActions = [
                {type: types.GET_USERS_FETCHING},
                {type: types.GET_USERS_SUCCESS, users: ACCOUNT_USERS_DATA},
                {type: gridTypes.SET_TOTALRECORDS, gridId: mockGridID, totalRecords: ACCOUNT_USERS_DATA.length}
            ];
            // expect the dummy data when the fetchAccountUsers is called
            const store = mockStore({});
            return store.dispatch(actions.fetchAccountUsers(mockAccountId, mockGridID, mockItemsPerPage)).then(() =>
                    expect(store.getActions(mockAccountId, mockGridID, mockItemsPerPage)).toEqual(expectedActions)
                , error => expect(false).toBe(true)).then(done, done);
        });

        it('should do nothing if we receive a 401', (done) => {
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', class {
                constructor() {
                }

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
                constructor() {
                }

                getAccountUsers(accountId) {
                    return Promise.reject({response: {status: 403}});
                }
            });
            const store = mockStore({});
            store.dispatch(actions.fetchAccountUsers(mockAccountId, mockGridID, mockItemsPerPage)).then(() => {
                expect(mockWindowUtils.update).toHaveBeenCalledWith(FORBIDDEN);
            }, e => expect(false).toEqual(true)).then(done, done);
        });

        it('should redirect to INTERNAL_SERVER_ERROR when encountering any other error', (done) => {
            AccountUsersActionsRewireAPI.__Rewire__('AccountUsersService', class {
                constructor() {
                }

                getAccountUsers(accountId) {
                    return Promise.reject({response: {status: 500}});
                }
            });
            const store = mockStore({});
            store.dispatch(actions.fetchAccountUsers(mockAccountId, mockGridID, mockItemsPerPage)).then(() => {
                expect(mockWindowUtils.update).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
            }, e => expect(false).toEqual(true)).then(done, done);
        });
    });

    describe('Update Actions', () => {

        let middleware = [thunk];
        const mockStore = configureMockStore(middleware),
            GRID_ID = 1,
            ITERMS_PER_PAGE = 10;


        it('dispatches sort correctly', () => {

            const store = mockStore({AccountUsers: {users: ACCOUNT_USERS_DATA}});

            let gridState = {
                sortFids: [1],                      // sort by firstName ascending
                pagination: {
                    currentPage: 1,
                    itemsPerPage: ITERMS_PER_PAGE
                }, // no pagination
                searchTerm: ""                      // search term
            };

            store.dispatch(actions.doUpdate(GRID_ID, gridState));

            const expectedAction = [
                {
                    type: gridTypes.SET_SEARCH,
                    gridId: GRID_ID,
                    searchTerm: ""
                },
                {
                    type: gridTypes.SET_PAGINATION,
                    gridId: GRID_ID,
                    pagination: {
                        filteredRecords: ACCOUNT_USERS_DATA.length,
                        totalPages: 1,
                        currentPage: 1,
                        itemsPerPage: ITERMS_PER_PAGE,
                        firstRecordInCurrentPage: 1,
                        lastRecordInCurrentPage: 3
                    }
                },
                {
                    type: gridTypes.SET_ITEMS,
                    gridId: GRID_ID,
                    items: [
                        {
                            "uid": 10000,
                            "id": 10000,
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
                            "uid": 20000,
                            "id": 20000,
                            "firstName": "FirstNameFilter",
                            "lastName": "lastNameFilter",
                            "email": "emailFilter@g88.net",
                            "userName": "userNameFilter",
                            "lastAccess": "1900-01-01T00:00:00Z",
                            "numGroupsMember": 0,
                            "numGroupsManaged": 1,
                            "hasAppAccess": true,
                            "numAppsManaged": 0,
                            "userBasicFlags": 8192,
                            "accountTrusteeFlags": 0,
                            "realmDirectoryFlags": 4,
                            "systemRights": 0
                        },
                        {
                            "uid": 30000,
                            "id": 30000,
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
                        }]
                }
            ];

            expect(store.getActions(GRID_ID)).toEqual(expectedAction);
        });

        it('dispatches search correctly', () => {

            const store = mockStore({AccountUsers: {users: ACCOUNT_USERS_DATA}});

            const searchTerm = "ZAdministrator";

            let gridState = {
                sortFids: [],                       // no sorting
                pagination: {
                    currentPage: 1,
                    itemsPerPage: ITERMS_PER_PAGE
                }, // no pagination
                searchTerm: searchTerm        // search for Zadministrator
            };

            store.dispatch(actions.doUpdate(GRID_ID, gridState));

            const expectedActions = [
                {
                    type: gridTypes.SET_SEARCH,
                    gridId: GRID_ID,
                    searchTerm: searchTerm
                },
                {
                    type: gridTypes.SET_PAGINATION,
                    gridId: GRID_ID,
                    pagination: {
                        filteredRecords: 1,
                        totalPages: 1,
                        currentPage: 1,
                        itemsPerPage: ITERMS_PER_PAGE,
                        firstRecordInCurrentPage: 1,
                        lastRecordInCurrentPage: 1
                    }
                },
                {
                    type: gridTypes.SET_ITEMS,
                    gridId: GRID_ID,
                    items: [
                        {
                            "uid": 30000,
                            "id": 30000,
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
                        }]
                }
            ];

            expect(store.getActions(GRID_ID)).toEqual(expectedActions);
        });

        it('dispatches pagination correctly', () => {

            const store = mockStore({AccountUsers: {users: ACCOUNT_USERS_DATA}});

            let gridState = {
                sortFids: [1],                       // no sorting
                pagination: {
                    currentPage: 2,
                    itemsPerPage: 2
                },               // paginate to next page
                searchTerm: ""                      // no search
            };

            store.dispatch(actions.doUpdate(GRID_ID, gridState));

            const expectedActions = [
                {
                    type: gridTypes.SET_SEARCH,
                    gridId: GRID_ID,
                    searchTerm: ""
                },
                {
                    type: gridTypes.SET_PAGINATION,
                    gridId: GRID_ID,
                    pagination: {
                        filteredRecords: 3,
                        totalPages: 2,
                        currentPage: 2,
                        itemsPerPage: 2,
                        firstRecordInCurrentPage: 3,
                        lastRecordInCurrentPage: 3
                    }
                },
                {
                    type: gridTypes.SET_ITEMS,
                    gridId: GRID_ID,
                    items: [
                        {
                            "uid": 30000,
                            "id": 30000,
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
                        }]
                }
            ];
            expect(store.getActions(GRID_ID)).toEqual(expectedActions);
        });

    });

    describe('Filter Action', () => {

        it('Filter the text columns by firstName correctly', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "FirstNameFilter");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].firstName).toEqual('FirstNameFilter');
        });

        it('Filter the text columns by lastName correctly', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "lastNameFilter");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].lastName).toEqual('lastNameFilter');
        });

        it('Filter the text columns by email correctly', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "emailFilter");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].email).toEqual('emailFilter@g88.net');
        });

        it('Filter the text columns by userName correctly', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "userNameFilter");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].userName).toEqual('userNameFilter');
        });

        it('Filter the text columns by lastAccess correctly', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "never");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].lastAccess).toEqual("1900-01-01T00:00:00Z");
        });

        it('Filter the text columns by hasAppAccess correctly', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "Quick Base Staff");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].userName).toEqual('administrator');
        });

        it('Filter case insensitive search', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "quick Base staff");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].userName).toEqual('administrator');
        });

        it('Filter substring search', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "staff");
            expect(filteredUsers.length).toEqual(1);
            expect(filteredUsers[0].userName).toEqual('administrator');
        });

        it('Filter the text columns by unknown search term', () => {
            let filteredUsers = actions.searchUsers(ACCOUNT_USERS_DATA, "randomText");
            expect(filteredUsers.length).toEqual(0);
        });

        it('Filter the text columns when array or search items are empty', () => {
            expect(actions.searchUsers([], "searchTerm")).toEqual([]);
            expect(actions.searchUsers(ACCOUNT_USERS_DATA, "")).toEqual(ACCOUNT_USERS_DATA);
        });
    });

    describe('Paginate Action', () => {


        const users = [{firstName: 'user1'}, {firstName: 'user2'}, {firstName: 'user3'}];

        it('return correct pagination result when no records', () => {

            let paginatedUsers = actions.paginateUsers([]);
            expect(paginatedUsers.currentPageRecords).toEqual([]);
            expect(paginatedUsers.firstRecordInCurrentPage).toEqual(0);
            expect(paginatedUsers.lastRecordInCurrentPage).toEqual(0);
        });

        it('return correct pagination result when going previous', () => {

            let paginatedUsers = actions.paginateUsers(users, 1, 2);
            expect(paginatedUsers.currentPageRecords).toEqual([users[0], users[1]]);
            expect(paginatedUsers.firstRecordInCurrentPage).toEqual(1);
            expect(paginatedUsers.lastRecordInCurrentPage).toEqual(2);
        });

        it('return correct pagination when going next', () => {

            let paginatedUsers = actions.paginateUsers(users, 2, 2);
            expect(paginatedUsers.currentPageRecords).toEqual([users[2]]);
            expect(paginatedUsers.firstRecordInCurrentPage).toEqual(3);
            expect(paginatedUsers.lastRecordInCurrentPage).toEqual(3);
        });

        it('return correct pagination when page number > length of record next', () => {

            let userOverflow1 = actions.paginateUsers(users, 3, 2);
            expect(userOverflow1.currentPageRecords).toEqual([{firstName: 'user1'}, {firstName: 'user2'}]);
            expect(userOverflow1.firstRecordInCurrentPage).toEqual(1);
            expect(userOverflow1.lastRecordInCurrentPage).toEqual(2);
        });
    });

    describe('Faceting Action', () => {

        it('gets the users based on Quick Base access status', () => {
            let selected = new FacetSelections();
            selected.addSelection(FACET_FIELDID.QUICKBASE_ACCESS_STATUS, 'Quick Base Staff');
            selected.addSelection(FACET_FIELDID.QUICKBASE_ACCESS_STATUS, 'No App Access');
            selected.addSelection(FACET_FIELDID.QUICKBASE_ACCESS_STATUS, 'Paid Seat');

            let facetUsers = actions.facetUser(ACCOUNT_USERS_DATA, selected);

            expect(facetUsers).toEqual(ACCOUNT_USERS_DATA);
        });

        it('gets the right info for user in group', () => {
            let selected = new FacetSelections();
            selected.addSelection(FACET_FIELDID.INGROUP, true);


            let facetUsers = actions.facetUser(ACCOUNT_USERS_DATA, selected);

            expect(facetUsers.length).toBeGreaterThan(0);

            _.forEach(facetUsers, function(user) {
                expect(user.numGroupsMember).toBeGreaterThan(0);
            });
        });

        it('facets users not in group', () => {
            let selected = new FacetSelections();
            selected.addSelection(FACET_FIELDID.INGROUP, false);

            let facetUsers = actions.facetUser(ACCOUNT_USERS_DATA, selected);

            expect(facetUsers.length).toBeGreaterThan(0);

            _.forEach(facetUsers, function(user) {
                expect(user.numGroupsMember).toEqual(0);
            });
        });

        it('gets correct info for the users who dont manage groups', () => {
            let selected = new FacetSelections();
            selected.addSelection(FACET_FIELDID.GROUPMANAGER, false);

            let facetUsers = actions.facetUser(ACCOUNT_USERS_DATA, selected);

            expect(facetUsers.length).toBeGreaterThan(0);

            _.forEach(facetUsers, function(user) {
                expect(user.numGroupsManaged).toEqual(0);
            });
        });

        it('gets correct info for the users who manage groups', () => {
            let selected = new FacetSelections();
            selected.addSelection(5, true);

            let facetUsers = actions.facetUser(ACCOUNT_USERS_DATA, selected);

            expect(facetUsers.length).toBeGreaterThan(0);

            _.forEach(facetUsers, function(user) {
                expect(user.numGroupsManaged).toBeGreaterThan(0);
            });
        });

        it('facets columns combination', () => {
            let selected = new FacetSelections();
            selected.addSelection(FACET_FIELDID.INGROUP, true);
            selected.addSelection(FACET_FIELDID.GROUPMANAGER, true);

            let facetUsers = actions.facetUser(ACCOUNT_USERS_DATA, selected);
            expect(facetUsers.length).toBeGreaterThan(0);
            _.forEach(facetUsers, function(user) {
                expect(user.numGroupsManaged).toBeGreaterThan(0);
                expect(user.numGroupsMember).toBeGreaterThan(0);
            });
        });
    });

    describe('Sort Action', () => {

        it('sorts by firstname by default', () => {
            let sortedUsersAsc = actions.sortUsers(ACCOUNT_USERS_DATA, []);
            expect(sortedUsersAsc[0].firstName).toEqual('Administrator');
            expect(sortedUsersAsc[1].firstName).toEqual('FirstNameFilter');
            expect(sortedUsersAsc[2].firstName).toEqual('Zadministrator');
        });

        it('sorts the text columns by firstname correctly', () => {
            let sortedUsersAsc = actions.sortUsers(ACCOUNT_USERS_DATA, [1]);
            expect(sortedUsersAsc[0].firstName).toEqual('Administrator');
            expect(sortedUsersAsc[1].firstName).toEqual('FirstNameFilter');
            expect(sortedUsersAsc[2].firstName).toEqual('Zadministrator');

            let sortedUsersDsc = actions.sortUsers(ACCOUNT_USERS_DATA, [-1]);
            expect(sortedUsersDsc[0].firstName).toEqual('Zadministrator');
            expect(sortedUsersDsc[1].firstName).toEqual('FirstNameFilter');
            expect(sortedUsersDsc[2].firstName).toEqual('Administrator');
        });

        it('sorts the numeric columns by Quick Base Access Status correctly', () => {
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
