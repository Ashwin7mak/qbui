import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/formStore';
import Fluxxor from 'fluxxor';

describe('Test Form Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'FormStore';
    let stores;
    let flux;

    beforeEach(() => {
        store = new Store();
        stores = {FormStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default form store state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).formData).toEqual({});
        expect(flux.store(STORE_NAME).formLoading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        //  expect these bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_FORM_AND_RECORD).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FORM_AND_RECORD_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FORM_AND_RECORD_FAILED).toBeDefined();
    });

    it('test onLoadFormAndRecord action', () => {

        let loadFormAndRecordAction = {
            type: actions.LOAD_FORM_AND_RECORD
        };

        flux.dispatcher.dispatch(loadFormAndRecordAction);
        expect(flux.store(STORE_NAME).formLoading).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test onLoadFormAndRecord failed action', () => {

        let loadFormAndRecordAction = {
            type: actions.LOAD_FORM_AND_RECORD_FAILED
        };

        flux.dispatcher.dispatch(loadFormAndRecordAction);
        expect(flux.store(STORE_NAME).formLoading).toBeFalsy();
        expect(flux.store(STORE_NAME).formData).toEqual({});
        expect(flux.store(STORE_NAME).error).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test onLoadFormAndRecord success action', () => {

        let loadFormAndRecordAction = {
            type: actions.LOAD_FORM_AND_RECORD_SUCCESS,
            payload: [{
                "formId": 1,
                "tableId": "0wbfabsaaaaac",
                "appId": "0wbfabsaaaaab"
            }
            ]
        };

        flux.dispatcher.dispatch(loadFormAndRecordAction);
        expect(flux.store(STORE_NAME).formLoading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();
        expect(flux.store(STORE_NAME).formData).toEqual(loadFormAndRecordAction.payload);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });


    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.error).toBeDefined();
        expect(state.formLoading).toBeDefined();
        expect(state.formData).toBeDefined();
    });


});
