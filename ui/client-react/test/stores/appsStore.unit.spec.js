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

});
