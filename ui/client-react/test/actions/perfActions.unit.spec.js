/* jshint proto: true */

import Fluxxor from 'fluxxor';
import perfActions from '../../src/actions/perfActions';
import * as actions from '../../src/constants/actions';

describe('Perf Actions functions', () => {
    'use strict';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(perfActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    it('test mark Perf action', () => {
        flux.actions.mark('test');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.MARK_PERF, 'test');
    });

    it('test mark Perf action no params', () => {
        flux.actions.mark();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.MARK_PERF, undefined);
    });

    it('test measure Perf action', () => {
        flux.actions.measure('label', 'start', 'end');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.MEASURE_PERF,
            Object({label: 'label', start: 'start', end: 'end'}));
    });

    it('test measure Perf action no params', () => {
        flux.actions.measure();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.MEASURE_PERF,
            Object({label: undefined, start: undefined, end: undefined}));
    });

    it('test new route Perf action', () => {
        flux.actions.newRoute('newRoute');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.NEW_ROUTE_PERF, 'newRoute');
    });

    it('test new route Perf action no params', () => {
        flux.actions.newRoute();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.NEW_ROUTE_PERF, undefined);
    });

    it('test doneRoute Perf action', () => {
        flux.actions.doneRoute('routeInfo');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.DONE_ROUTE_PERF, 'routeInfo');
    });

    it('test new route Perf action no params', () => {
        flux.actions.doneRoute();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.DONE_ROUTE_PERF, undefined);
    });


    it('test logMeasurements Perf action', () => {
        flux.actions.logMeasurements('info');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOG_MEASUREMENTS_PERF, 'info');
    });

    it('test new route Perf action no params', () => {
        flux.actions.logMeasurements();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOG_MEASUREMENTS_PERF, undefined);
    });

});
