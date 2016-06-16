import * as actions from '../../src/constants/actions';

import PerfStore from '../../src/stores/perfStore';
import Fluxxor from 'fluxxor';

describe('Test PerfStore Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'PerfStore';
    let stores;
    let flux;
    let hasUrlParm = false;

    var mockPerfLogUtils = {
        mark: function(info) {
        },
        measure: function(a, b, c) {
        },
        send: function(info) {
        },
        done: function(info) {
        }
    };

    class mockMethod {
        static searchIncludes(findThis) {
            return hasUrlParm;
        }
    }

    var mockReactPerfUtils  = {
        devPerfInit: function(config, perf) {
        },
        devPerfPrint: function(config, global) {
        }
    };

    beforeEach(() => {
        store = new PerfStore();
        stores = {PerfStore: store};
        flux = new Fluxxor.Flux(stores);
        spyOn(mockPerfLogUtils, 'mark').and.callThrough();
        spyOn(mockPerfLogUtils, 'measure').and.callThrough();
        spyOn(mockPerfLogUtils, 'send').and.callThrough();
        spyOn(mockPerfLogUtils, 'done').and.callThrough();

        spyOn(mockReactPerfUtils, 'devPerfInit').and.callThrough();
        spyOn(mockReactPerfUtils, 'devPerfPrint').and.callThrough();
        PerfStore.__Rewire__('PerfLogUtils', mockPerfLogUtils);
        PerfStore.__Rewire__('ReactPerfUtils', mockReactPerfUtils);
        PerfStore.__Rewire__('WindowLocationUtils', mockMethod);

        spyOn(flux.store(STORE_NAME), 'emit');

    });

    afterEach(() => {
        mockReactPerfUtils.devPerfInit.calls.reset();
        mockReactPerfUtils.devPerfPrint.calls.reset();
        mockPerfLogUtils.mark.calls.reset();
        mockPerfLogUtils.measure.calls.reset();
        mockPerfLogUtils.send.calls.reset();
        mockPerfLogUtils.done.calls.reset();
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
        afterEach(() => {
            PerfStore.__ResetDependency__('PerfLogUtils');
            PerfStore.__ResetDependency__('ReactPerfUtils');
            PerfStore.__ResetDependency__('WindowLocationUtils');
        });

    });

    it('test default PerfStore state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).getState()).toEqual({});
        //  expect bindActions
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_APPS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORTS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORTS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORTS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FIELDS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FIELDS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_FIELDS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_RECORDS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_RECORDS_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_RECORDS_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.MARK_PERF).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.MEASURE_PERF).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOG_MEASUREMENTS_PERF).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.DONE_ROUTE_PERF).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.NEW_ROUTE_PERF).toBeDefined();
    });

    it('test perf markPerf', () => {

        let markPerf = {
            type: actions.MARK_PERF,
        };

        flux.dispatcher.dispatch(markPerf);
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(mockPerfLogUtils.mark).toHaveBeenCalled();
    });

    it('test perf measurePerf', () => {

        let measurePerf = {
            type: actions.MEASURE_PERF,
            payload:{}
        };

        flux.dispatcher.dispatch(measurePerf);
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(mockPerfLogUtils.measure).toHaveBeenCalled();
    });
    it('test perf logMeasurements', () => {

        let logMeasurements = {
            type: actions.LOG_MEASUREMENTS_PERF,
            payload: 'test'
        };
        flux.dispatcher.dispatch(logMeasurements);

        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(mockPerfLogUtils.send).toHaveBeenCalled();
        expect(mockPerfLogUtils.send).toHaveBeenCalledWith('test');
    });

    it('test perf doneRoutePerf', () => {

        let doneRoutePerf = {
            type: actions.DONE_ROUTE_PERF,
            payload: 'test'
        };
        flux.dispatcher.dispatch(doneRoutePerf);

        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(mockPerfLogUtils.done).toHaveBeenCalled();
        expect(mockPerfLogUtils.done).toHaveBeenCalledWith('test');
    });


    it('test perf newRoutePerf', () => {

        let newRoutePerf = {
            type: actions.NEW_ROUTE_PERF,
            payload: 'test'
        };
        flux.dispatcher.dispatch(newRoutePerf);

        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(mockPerfLogUtils.mark).toHaveBeenCalled();
        expect(mockPerfLogUtils.mark).toHaveBeenCalledWith('test');
    });

    describe('test with dev tables ', () => {
        beforeEach(() => {
            hasUrlParm = true;
        });

        afterEach(() => {
            hasUrlParm = false;
        });

        it('doneRoutePerf ', () => {
            let doneRoutePerf = {
                type: actions.DONE_ROUTE_PERF,
                payload: 'test'
            };
            flux.dispatcher.dispatch(doneRoutePerf);

            expect(mockReactPerfUtils.devPerfPrint).toHaveBeenCalled();
            expect(mockPerfLogUtils.done).toHaveBeenCalledWith('test');

        });

        it('newRoutePerf', () => {
            let newRoutePerf = {
                type: actions.NEW_ROUTE_PERF,
                payload: 'test'
            };
            flux.dispatcher.dispatch(newRoutePerf);

            expect(mockReactPerfUtils.devPerfInit).toHaveBeenCalled();
            expect(mockPerfLogUtils.mark).toHaveBeenCalledWith('test');
        });

    });



    describe('test perf loadActions', () => {

        var dataProvider = [
            {type:actions.LOAD_APPS},
            {type:actions.LOAD_REPORTS},
            {type:actions.LOAD_REPORT},
            {type:actions.LOAD_FIELDS},
            {type:actions.LOAD_FIELDS},
        ];
        dataProvider.forEach(function(data) {
            it(data.type, function() {
                let testAction = {
                    type: data.type,
                };
                flux.dispatcher.dispatch(testAction);
                expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
                expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
                expect(mockPerfLogUtils.mark).toHaveBeenCalled();
                expect(mockPerfLogUtils.mark.calls.mostRecent().args[0]).toMatch('loading-' + data.type);
                expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
            });
        });
    });

    describe('test perf loadEndActions', () => {
        var dataProvider = [
            {type:actions.LOAD_APPS_SUCCESS, instigator:actions.LOAD_APPS},
            {type:actions.LOAD_APPS_FAILED, instigator:actions.LOAD_APPS},
            {type:actions.LOAD_REPORTS_SUCCESS, instigator:actions.LOAD_REPORTS},
            {type:actions.LOAD_REPORTS_FAILED, instigator:actions.LOAD_REPORTS},
            {type:actions.LOAD_REPORT_SUCCESS, instigator:actions.LOAD_REPORT},
            {type:actions.LOAD_REPORT_FAILED, instigator:actions.LOAD_REPORT},
            {type:actions.LOAD_FIELDS_SUCCESS, instigator:actions.LOAD_FIELDS},
            {type:actions.LOAD_FIELDS_FAILED, instigator:actions.LOAD_FIELDS},
            {type:actions.LOAD_RECORDS_SUCCESS, instigator:actions.LOAD_RECORDS},
            {type:actions.LOAD_RECORDS_FAILED, instigator:actions.LOAD_RECORDS},
        ];
        dataProvider.forEach(function(data) {
            it(data.type, () => {
                let testEndAction = {
                    type: data.type,
                };

                flux.dispatcher.dispatch(testEndAction);
                expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalled();
                expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
                expect(mockPerfLogUtils.measure).toHaveBeenCalled();
                expect(mockPerfLogUtils.measure.calls.mostRecent().args[0]).toMatch(data.instigator);
                expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
            });
        });
    });

});
