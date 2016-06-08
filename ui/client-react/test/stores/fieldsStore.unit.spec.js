import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/fieldsStore';
import Fluxxor from 'fluxxor';

describe('Test Fields Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'FieldsStore';
    let stores;
    let flux;

    beforeEach(() => {
        store = new Store();
        stores = {FieldsStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default fields store state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).fields.length).toBe(0);
        expect(flux.store(STORE_NAME).fieldsLoading).toBeFalsy();
        expect(flux.store(STORE_NAME).currentTable).toBeNull();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        //  expect these bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_FIELDS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FIELDS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FIELDS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECT_TABLE).toBeDefined();
    });

    it('test load fields action', () => {

        let loadFieldsAction = {
            type: actions.LOAD_FIELDS
        };

        flux.dispatcher.dispatch(loadFieldsAction);
        expect(flux.store(STORE_NAME).fieldsLoading).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load fields failed action', () => {

        let loadFieldsAction = {
            type: actions.LOAD_FIELDS_FAILED
        };

        flux.dispatcher.dispatch(loadFieldsAction);
        expect(flux.store(STORE_NAME).fieldsLoading).toBeFalsy();
        expect(flux.store(STORE_NAME).fields.length).toBe(0);
        expect(flux.store(STORE_NAME).error).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load fields success action', () => {

        let loadFieldsAction = {
            type: actions.LOAD_FIELDS_SUCCESS,
            payload: [
                {
                    id: '1',
                    name: 'fieldName1'
                },
                {
                    id: '2',
                    name: 'fieldName2'
                }
            ]
        };

        flux.dispatcher.dispatch(loadFieldsAction);
        expect(flux.store(STORE_NAME).fieldsLoading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        let fields = flux.store(STORE_NAME).fields;
        expect(fields.length).toBe(2);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test select table action', () => {

        let selectTableAction = {
            type: actions.SELECT_TABLE,
            payload:'tblId'
        };

        flux.dispatcher.dispatch(selectTableAction);
        expect(flux.store(STORE_NAME).fields.length).toBe(0);
        expect(flux.store(STORE_NAME).currentTable).toBe('tblId');

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.error).toBeDefined();
        expect(state.fieldsLoading).toBeDefined();
        expect(state.fields).toBeDefined();
        expect(state.currentTable).toBeDefined();

    });


});
