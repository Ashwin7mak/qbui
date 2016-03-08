import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/reportDataStore';
import Fluxxor from 'fluxxor';
import _ from 'lodash';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('Test ReportData Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'ReportDataStore';
    let stores;
    let flux;

    const appId = 'appId';
    const tblId = 'tblId';
    const rptId = 'rptId';

    beforeEach(() => {
        store = new Store();
        stores = {ReportDataStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default report store state', () => {
        // verify default states
        expect(_.keys(flux.store(STORE_NAME).data).length).toBe(0);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        //  expect 3 bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT_FAILED).toBeDefined();
    });

    it('test load reports action', () => {

        let loadReportAction = {
            type: actions.LOAD_REPORT,
            payload: {
                appId: appId,
                tblId: tblId,
                rptId: rptId
            }
        };

        flux.dispatcher.dispatch(loadReportAction);
        expect(flux.store(STORE_NAME).loading).toBeTruthy();

        expect(flux.store(STORE_NAME).appId).toBe(appId);
        expect(flux.store(STORE_NAME).tblId).toBe(tblId);
        expect(flux.store(STORE_NAME).rptId).toBe(rptId);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load reports failed action', () => {

        let loadReportAction = {
            type: actions.LOAD_REPORT_FAILED
        };

        flux.dispatcher.dispatch(loadReportAction);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load reports success action with no data', () => {

        let payload = {
            name: 'report_name',
            data: {
                fields: [],
                records: [],
                facets: []
            }
        };

        let loadReportAction = {
            type: actions.LOAD_REPORT_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(loadReportAction);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        expect(flux.store(STORE_NAME).data.name).toBe(payload.name);
        expect(flux.store(STORE_NAME).data.columns).toBeDefined();
        expect(flux.store(STORE_NAME).data.records).toBeDefined();

        //  ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });


    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.error).toBeDefined();
        expect(state.loading).toBeDefined();
        expect(state.data).toBeDefined();
        expect(state.appId).not.toBeDefined();
        expect(state.tblId).not.toBeDefined();
        expect(state.searchStringForFiltering).toBe('');
        expect(state.selections).toEqual(new FacetSelections());
    });

    it('test getState function after report is loaded', () => {
        let loadReportAction = {
            type: actions.LOAD_REPORT,
            payload: {
                appId: appId,
                tblId: tblId,
                rptId: rptId
            }
        };
        flux.dispatcher.dispatch(loadReportAction);
        let state = flux.store(STORE_NAME).getState();

        expect(state.appId).toBeDefined(appId);
        expect(state.tblId).toBeDefined(tblId);
        expect(state.rptId).toBeDefined(rptId);
    });

    it('test search', () => {
        let searchForAction = {
            type: actions.SEARCH_FOR,
            payload: ''
        };
        flux.dispatcher.dispatch(searchForAction);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
    });



    it('test getReportData function', () => {

        let data = {
            fields : [{id:1, name:"field1"}, {id:2, name:"field2"}],
            records : [[{id: 1, display: "quickbase"}, {id:2, name:"inc"}],
                [{id: 1, display: "intuit"}, {id:2, name:"corp"}]]
        };
        let state = flux.store(STORE_NAME).getReportData(data);

        //  expect the following to be returned when 'getting ReportData'
        expect(state).toBeDefined();
        expect(state.length).toBeDefined();
        expect(state.length).toBe(2);
    });

    it('test load records action', () => {

        let loadRecordsAction = {
            type: actions.LOAD_RECORDS,
            payload: {
                appId: appId,
                tblId: tblId,
                rptId: rptId,
                filter : {selections : {}, facet: "", search: "abc"}
            }
        };

        flux.dispatcher.dispatch(loadRecordsAction);
        expect(flux.store(STORE_NAME).loading).toBeTruthy();

        expect(flux.store(STORE_NAME).appId).toBe(appId);
        expect(flux.store(STORE_NAME).tblId).toBe(tblId);
        expect(flux.store(STORE_NAME).rptId).toBe(rptId);
        expect(flux.store(STORE_NAME).selections).toEqual({});
        expect(flux.store(STORE_NAME).facetExpression).toEqual('');
        expect(flux.store(STORE_NAME).searchStringForFiltering).toEqual('abc');

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load records failed action', () => {

        let action = {
            type: actions.LOAD_RECORDS_FAILED
        };

        flux.dispatcher.dispatch(action);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load records success action with no data', () => {

        let payload = {
            data: {
                fields: [],
                records: []
            }
        };

        let action = {
            type: actions.LOAD_RECORDS_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(action);
        expect(flux.store(STORE_NAME).data.filteredRecords).toBeDefined();

        //  ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

});
