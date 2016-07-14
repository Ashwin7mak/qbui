import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/reportDataStore';
import Fluxxor from 'fluxxor';
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
        expect(Object.keys(flux.store(STORE_NAME).reportModel).length).not.toBe(0);
        expect(flux.store(STORE_NAME).loading).toBeFalsy();
        expect(flux.store(STORE_NAME).error).toBeFalsy();

        //  expect bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_RECORDS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_RECORDS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_RECORDS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.FILTER_SELECTIONS_PENDING).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SHOW_FACET_MENU).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.HIDE_FACET_MENU).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SELECTED_ROWS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.NEW_BLANK_REPORT_RECORD).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.DELETE_REPORT_RECORD).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.RECORD_EDIT_CANCEL).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SAVE_REPORT_RECORD_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SAVE_REPORT_RECORD_FAILED).toBeDefined();
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
            metaData: {
                name: 'report_name'
            },
            recordData: {
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

        expect(flux.store(STORE_NAME).reportModel.model.name).toBe(payload.metaData.name);
        expect(flux.store(STORE_NAME).reportModel.model.columns).toBeDefined();
        expect(flux.store(STORE_NAME).reportModel.model.records).toBeDefined();
        expect(flux.store(STORE_NAME).reportModel.model.hasGrouping).toBe(false);
        expect(flux.store(STORE_NAME).reportModel.model.groupLevel).toBe(0);

        //  ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load reports success action with group data', () => {

        let payload = {
            metaData: {
                name: 'report_name',
                fids: [],
                sortList: "1:V"
            },
            recordData: {
                fields: [],
                records: [],
                facets: [],
                groups: {
                    hasGrouping: true,
                    fields: [{
                        field: [{
                            id: 1,
                            name: 'group-field1'
                        }],
                        groupType: 'V'
                    }],
                    gridColumns: [{
                        id: 2,
                        name: 'grid-field2'
                    }],
                    gridData: [{
                        id: 2,
                        value: 'grid-data2'
                    }],
                    totalRows: 1
                }
            }
        };

        let action = {
            type: actions.LOAD_REPORT_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(action);

        expect(flux.store(STORE_NAME).reportModel.model.name).toBe(payload.metaData.name);
        expect(flux.store(STORE_NAME).reportModel.model.columns).toBeDefined();
        expect(flux.store(STORE_NAME).reportModel.model.records).toBe(payload.recordData.groups.gridData);
        expect(flux.store(STORE_NAME).reportModel.model.hasGrouping).toBe(true);
        expect(flux.store(STORE_NAME).reportModel.model.groupLevel).toBe(1);

        //  ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load reports success action with sortlist data', () => {

        let payload = {
            metaData: {
                name: 'report_name',
                fids: [],
                sortList: ""
            },
            recordData: {
                fields: [],
                records: [],
                facets: [],
                groups: {
                    hasGrouping: true,
                    fields: [{
                        field: [{
                            id: 1,
                            name: 'group-field1'
                        }],
                        groupType: 'V'
                    }],
                    gridColumns: [{
                        id: 2,
                        name: 'grid-field2'
                    }],
                    gridData: [{
                        id: 2,
                        value: 'grid-data2'
                    }],
                    totalRows: 1
                }
            },
            sortList: "1:V"
        };

        let action = {
            type: actions.LOAD_REPORT_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(action);

        expect(flux.store(STORE_NAME).reportModel.model.name).toBe(payload.metaData.name);
        expect(flux.store(STORE_NAME).reportModel.model.columns).toBeDefined();
        expect(flux.store(STORE_NAME).reportModel.model.records).toBe(payload.recordData.groups.gridData);
        expect(flux.store(STORE_NAME).reportModel.model.hasGrouping).toBe(true);
        expect(flux.store(STORE_NAME).reportModel.model.groupLevel).toBe(1);

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

    it('test getReportData function', () => {

        let data = {
            fields : [{id:1, name:"field1"}, {id:2, name:"field2"}],
            records : [[{id: 1, display: "quickbase"}, {id:2, name:"inc"}],
                [{id: 1, display: "intuit"}, {id:2, name:"corp"}]]
        };
        let state = flux.store(STORE_NAME).reportModel.getReportData(data.fields, data.records, false);

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


    it('test load records success action with error data', () => {

        let payload = {
            metaData: {},
            recordData: {
                fields: [],
                records: [],
                facets: [{id:null, name:null, errorCode:12345}]
            }
        };

        let action = {
            type: actions.LOAD_REPORT_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(action);
        expect(flux.store(STORE_NAME).reportModel.model.filteredRecords).toBeDefined();
        let state = flux.store(STORE_NAME).getState();
        expect(state.data.facets.length).toBe(0);

        // ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load records success action with unspecified data', () => {

        let payload = {
            metaData: {},
            recordData: {
                fields: [],
                records: [],
            }
        };

        let action = {
            type: actions.LOAD_REPORT_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(action);
        expect(flux.store(STORE_NAME).reportModel.model.filteredRecords).toBeDefined();
        //facets error handles
        let state = flux.store(STORE_NAME).getState();
        expect(state.data.facets.length).toBe(0);

        // ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test filtered load records success action with no data', () => {

        let payload = {
            metaData: {},
            recordData: {
                fields: [],
                records: [],
                groups: []
            }
        };

        let action = {
            type: actions.LOAD_RECORDS_SUCCESS,
            payload: payload
        };

        flux.dispatcher.dispatch(action);
        expect(flux.store(STORE_NAME).reportModel.model.filteredRecords).toBeDefined();

        //  ensure the output of each report row includes an id, name and link
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test getState function after showing', () => {
        let action = {
            type: actions.SHOW_FACET_MENU,
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();

        expect(state.nonFacetClicksEnabled).toBeDefined(false);
    });

    it('test getState function after hiding', () => {
        let action = {
            type: actions.HIDE_FACET_MENU,
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();

        expect(state.nonFacetClicksEnabled).toBeDefined(true);
    });

    it('test filter selection pending action', () => {
        let selections = new FacetSelections();
        selections.addSelection(1, 'Development');
        let selectionsPendingAction = {
            type: actions.FILTER_SELECTIONS_PENDING,
            payload: {
                selections: selections,
            }
        };

        flux.dispatcher.dispatch(selectionsPendingAction);
        expect(flux.store(STORE_NAME).selections).toEqual(selections);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test selectedRows action', () => {

        let selectedRowsAction = {
            type: actions.SELECTED_ROWS,
            payload: "rows"
        };

        flux.dispatcher.dispatch(selectedRowsAction);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test saveReportRecordSuccess action', () => {

        //populate the model
        let reportPayload = {
            metaData: {},
            recordData: {
                fields: [{
                    builtId:false,
                    id:16,
                    name: "loc",
                    type: "SCALAR",
                    keyField: false,
                    datatypeAttributes : {
                        type: "TEXT"
                    }
                },
                    {
                        builtId:false,
                        id:8,
                        name: "Score",
                        type: "SCALAR",
                        keyField: true,
                        datatypeAttributes : {
                            type: "NUMERIC",
                            decimalPlaces: 3,
                        }
                    }
                ],
                records: [[
                    {id: 16, value: "Boston", display: "Boston"},
                    {id: 8, value: 1234, display: 1234},
                ],
                    [
                    {id: 16, value: "NYC", display: "NYC"},
                    {id: 8, value: 456, display: 456}
                    ]],
                groups: []
            }
        };

        let loadReportAction = {
            type: actions.LOAD_REPORT_SUCCESS,
            payload: reportPayload
        };
        flux.dispatcher.dispatch(loadReportAction);

        let saveReportRecordSuccessAction = {
            type: actions.SAVE_REPORT_RECORD_SUCCESS,
            payload: {recId : 1234, changes: [{fieldName:"loc", value:"test", display:"test"}]}
        };

        flux.dispatcher.dispatch(saveReportRecordSuccessAction);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(2);
    });


});
