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
        expect(flux.store(STORE_NAME).selectedAppId).toBeFalsy();
        expect(flux.store(STORE_NAME).selectedTableId).toBeFalsy();
        expect(flux.store(STORE_NAME).loading).toBeTruthy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();
        //  expect 11 bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_APP).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_TABLE).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_USERS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_USERS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_USERS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_ROLES).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_ROLES_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APP_ROLES_FAILED).toBeDefined();
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

    it('test load apps success action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APPS_SUCCESS,
            payload: ['app1', 'app2', 'app3']
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        expect(flux.store(STORE_NAME).apps.length).toEqual(3);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });


    it('test select app action', () => {

        let selectAppAction = {
            type: actions.SELECT_APP,
            payload: 'abc',
        };

        flux.dispatcher.dispatch(selectAppAction);

        expect(flux.store(STORE_NAME).selectedAppId).toEqual('abc');
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test select table action', () => {

        let selectTableAction = {
            type: actions.SELECT_TABLE,
            payload: 123,
        };

        flux.dispatcher.dispatch(selectTableAction);

        expect(flux.store(STORE_NAME).selectedTableId).toEqual(123);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app users action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APP_USERS
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loadingAppUsers).toBeTruthy();


        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app users failed action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APP_USERS_FAILED
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loadingAppUsers).toBeFalsy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app users success action', () => {
        let users = [{"userId":1}];
        let unfilteredUsers = {"1": [{"userId":1}]};
        let loadAppsAction = {
            type: actions.LOAD_APP_USERS_SUCCESS,
            payload: [users, unfilteredUsers]
        };

        flux.dispatcher.dispatch(loadAppsAction);
        expect(flux.store(STORE_NAME).loadingAppUsers).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        expect(flux.store(STORE_NAME).appUsers).toEqual(users);
        expect(flux.store(STORE_NAME).appUsersUnfiltered).toEqual(unfilteredUsers);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app roles action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APP_ROLES
        };

        flux.dispatcher.dispatch(loadAppsAction);


        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app roles failed action', () => {

        let loadAppsAction = {
            type: actions.LOAD_APP_ROLES_FAILED
        };

        flux.dispatcher.dispatch(loadAppsAction);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load app roles success action', () => {
        let roles = {"1": {"name": "duder", "id": 1337, "description": "the duderest duder to ever duder"}};
        let loadAppsAction = {
            type: actions.LOAD_APP_ROLES_SUCCESS,
            payload: roles
        };

        flux.dispatcher.dispatch(loadAppsAction);

        expect(flux.store(STORE_NAME).appRoles).toEqual(roles);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });



});
