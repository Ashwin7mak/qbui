import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/appsStore';
import Fluxxor from 'fluxxor';

describe('Test Apps Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'AppsStore';
    let stores;
    let flux;

    beforeEach(() => {

        store = new Store();
        stores = {AppsStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default apps store state', () => {

        // verify default states
        expect(flux.store(STORE_NAME).apps).toBeNull();
        expect(flux.store(STORE_NAME).selectedAppId).toBeNull();
        expect(flux.store(STORE_NAME).selectedTableId).toBeNull();
        expect(flux.store(STORE_NAME).loading).toBeTruthy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();
        //  expect 14 bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_APP).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_APP_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_APP_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_TABLE).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UPDATED_TABLE_PROPS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_OWNER).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_OWNER_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_OWNER_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_USERS_DETAILS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UNASSIGN_USERS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UNASSIGN_USERS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UNASSIGN_USERS_SUCCESS).toBeDefined();
    });

    it('test load apps action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APPS
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loading).toBeTruthy();


        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load apps failed action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APPS_FAILED
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load apps success action with app, roles and users', () => {

        const users = [];
        users.push('appUsers');
        users.push('unfilteredUsers');
        const roles = ['roles'];

        const appSuccessActionTests = [
            {name:'test loading app into an empty store', app:{id: 'tableId'}, appExpectation: 1},
            {name:'test loading app with app in store', app:{id: 'tableId'}, appExpectation: 1},
            {name:'test loading app with app not in store', app:{id: 'tableId2'}, appExpectation: 2}
        ];

        appSuccessActionTests.forEach(test => {
            it(test.name, () => {
                const loadAppsAction = {
                    type: actions.LOAD_APPS_SUCCESS,
                    payload: [{users, roles, app:test.app}]
                };
                flux.dispatcher.dispatch(loadAppsAction);
                expect(flux.store(STORE_NAME).loading).toBeFalsy();
                expect(flux.store(STORE_NAME).error).toBeFalsy();

                //  will add to store if app not found
                expect(flux.store(STORE_NAME).apps.length).toEqual(test.appExpectation);

                //  these always replace
                expect(flux.store(STORE_NAME).appUsers.length).toEqual(1);
                expect(flux.store(STORE_NAME).appUsersUnfiltered.length).toEqual(1);
                expect(flux.store(STORE_NAME).appRoles.length).toEqual(1);

                expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
                expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
            });
        });

    });

    it('test select app action', () => {

        let selectAppAction = {
            type: actions.SELECT_APP,
            payload: 'abc'
        };

        flux.dispatcher.dispatch(selectAppAction);

        expect(flux.store(STORE_NAME).selectedAppId).toEqual('abc');
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test select table action', () => {

        let selectTableAction = {
            type: actions.SELECT_TABLE,
            payload: 123
        };

        flux.dispatcher.dispatch(selectTableAction);

        expect(flux.store(STORE_NAME).selectedTableId).toEqual(123);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app users failed action', () => {

        let loadAppsAction = {
            type: actions.SELECT_APP_FAILED
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loadingAppUsers).toBeFalsy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app users success action', () => {
        let users = [{"userId":1}];
        let unfilteredUsers = {"1": [{"userId":1}]};
        let app = {id:1};

        let loadAppsAction = {
            type: actions.SELECT_APP_SUCCESS,
            payload: {users:[users, unfilteredUsers], app:app}
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).error).toBeFalsy();
        expect(flux.store(STORE_NAME).loading).toBeFalsy();

        expect(flux.store(STORE_NAME).appUsers).toEqual(users);
        expect(flux.store(STORE_NAME).appUsersUnfiltered).toEqual(unfilteredUsers);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app owner action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APP_OWNER
        };

        flux.dispatcher.dispatch(loadAppsAction);

        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
    });

    it('test load app owner failed action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APP_OWNER_FAILED
        };

        flux.dispatcher.dispatch(loadAppsAction);

        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
    });

    it('test load app owner success action', () => {
        let appOwner = {firstName: "Duder", lastName: "McDuderson", email: "duder@duder.com", screenName: "duderino"};
        let loadAppsAction = {
            type: actions.LOAD_APP_OWNER_SUCCESS,
            payload: appOwner
        };

        flux.dispatcher.dispatch(loadAppsAction);

        expect(flux.store(STORE_NAME).appOwner).toEqual(appOwner);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test updated table props', () => {
        let loadAppsAction = {
            type: actions.LOAD_APPS_SUCCESS,
            payload: [{id: 'app1', tables: [{id:'table1', name: 'name'}]}]
        };

        flux.dispatcher.dispatch(loadAppsAction);

        let selectAppAction = {
            type: actions.SELECT_APP,
            payload: 'app1'
        };
        flux.dispatcher.dispatch(selectAppAction);

        let tableInfo = {name: 'new name'};
        let updatedTablePropsAction = {
            type: actions.UPDATED_TABLE_PROPS,
            payload: {tableId: 'table1', tableInfo: tableInfo}
        };

        flux.dispatcher.dispatch(updatedTablePropsAction);

        expect(flux.store(STORE_NAME).apps).toEqual([{id: 'app1', tables: [{name: 'new name'}]}]);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(3);
    });

    it('test load user', ()=>{
        let loadUserAction = {
            type: actions.LOAD_ALL_USERS
        };
        flux.dispatcher.dispatch(loadUserAction);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });

    it('test search user success', ()=>{
        let users = [{name: 'John', surname: 'doe'}];
        let loadUserSuccessAction = {
            type: actions.SEARCH_ALL_USERS_SUCCESS,
            payload: users
        };
        flux.dispatcher.dispatch(loadUserSuccessAction);
        expect(flux.store(STORE_NAME).realmUsers).toEqual(users);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test add user', ()=>{
        let addUser = {
            type: actions.ADD_USER
        };
        flux.dispatcher.dispatch(addUser);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test Set user role to add', ()=>{
        let setUserRole = {
            type: actions.SET_USER_ROLE_TO_ADD_TO_APP
        };
        flux.dispatcher.dispatch(setUserRole);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test on selected Row', ()=>{
        let onSelectedRow = {
            type: actions.SELECT_USERS_DETAILS,
            payload: []
        };
        flux.dispatcher.dispatch(onSelectedRow);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test on assign user fail', ()=>{
        let unassignUserFail = {
            type: actions.UNASSIGN_USERS_FAILED
        };
        flux.dispatcher.dispatch(unassignUserFail);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test on assign user ', ()=>{
        let unassignUser = {
            type: actions.UNASSIGN_USERS
        };
        flux.dispatcher.dispatch(unassignUser);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test on assign user success ', ()=>{
        let unassignUserSuccess = {
            type: actions.UNASSIGN_USERS,
            payload: {roleId: 1, userIds:[{userId: 3}]}
        };
        flux.dispatcher.dispatch(unassignUserSuccess);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test get app user failed', ()=>{
        let getAppUserFailed = {
            type: actions.GET_APP_USERS_FAILED,
        };
        flux.dispatcher.dispatch(getAppUserFailed);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test assign user to app success', ()=>{
        let assignUsersToAppSuccess = {
            type: actions.ASSIGN_USERS_TO_APP_SUCCESS,
        };
        flux.dispatcher.dispatch(assignUsersToAppSuccess);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test add user to app dialog', ()=>{
        let addUserToAppDialog = {
            type: actions.TOGGLE_ADD_USER_TO_APP_DIALOG,
            payload: {status: true}
        };
        flux.dispatcher.dispatch(addUserToAppDialog);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
    it('test get app user success', ()=>{
        let onGetAppUsersSuccess = {
            type: actions.GET_APP_USERS_SUCCESS,
            payload: {appUsers: ['', '']}
        };
        flux.dispatcher.dispatch(onGetAppUsersSuccess);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });
});
