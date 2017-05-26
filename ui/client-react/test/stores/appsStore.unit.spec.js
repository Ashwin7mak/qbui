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
        //  expect 14 bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_OWNER).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_OWNER_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_OWNER_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_USERS_DETAILS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UNASSIGN_USERS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UNASSIGN_USERS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.UNASSIGN_USERS_SUCCESS).toBeDefined();
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

    //  REVIEW below
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
});
