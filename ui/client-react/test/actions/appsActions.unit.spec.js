import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';

describe('Apps Actions functions', () => {
    'use strict';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    it('test load apps action', () => {
        flux.actions.loadApps();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_APPS);
    });


    it('test load apps with tables action', () => {
        flux.actions.loadAppsWithTables();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_APPS_WITH_TABLES);
    });

});
