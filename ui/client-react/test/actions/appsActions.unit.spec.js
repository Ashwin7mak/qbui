import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Apps Actions functions', () => {
    'use strict';

    let responseData = [{id:'tableId', link:'/app/tableId'}];

    class mockAppService {
        constructor() { }
        getApps() {
            var p = Promise.defer();
            p.resolve({data: responseData});
            return p.promise;
        }
        getApp(id) {
            var p = Promise.defer();
            p.resolve({data: {id:'tableId'}});
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        appsActions.__Rewire__('AppService', mockAppService);

        flux.actions.loadApps(true);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_APPS);
        flux.dispatchBinder.dispatch.calls.reset();
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
    });

    it('test load apps action', () => {
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_APPS_SUCCESS, responseData);
    });


});
