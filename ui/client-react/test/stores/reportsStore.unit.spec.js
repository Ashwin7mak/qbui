import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/reportsStore';
import Fluxxor from 'fluxxor';

describe('Test Reports Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'ReportsStore';
    let stores;
    let flux;

    beforeEach(() => {
        store = new Store();
        stores = {ReportsStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default reports store state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).reports.length).toBe(0);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        //  expect 4 bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORTS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORTS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORTS_FAILED).toBeDefined();
    });

    it('test load reports action', () => {

        let loadReportsAction = {
            type: actions.LOAD_REPORTS
        };

        flux.dispatcher.dispatch(loadReportsAction);
        expect(flux.store(STORE_NAME).loading).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load reports failed action', () => {

        let loadReportsAction = {
            type: actions.LOAD_REPORTS_FAILED
        };

        flux.dispatcher.dispatch(loadReportsAction);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load reports success action', () => {

        let loadReportsAction = {
            type: actions.LOAD_REPORTS_SUCCESS,
            payload: {
                appId: 'appId',
                tblId: 'tblId',
                data: [
                    {
                        id: '1',
                        name: 'reportName1'
                    },
                    {
                        id: '2',
                        name: 'reportName2'
                    }
                ]
            }
        };

        flux.dispatcher.dispatch(loadReportsAction);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        let reports = flux.store(STORE_NAME).reports;
        expect(reports.length).toBe(2);

        //  ensure the output of each report row includes an id, name and link

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.error).toBeDefined();
        expect(state.loading).toBeDefined();
        expect(state.list).toBeDefined();

    });


});