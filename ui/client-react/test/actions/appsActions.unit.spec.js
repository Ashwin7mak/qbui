import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Apps Actions functions', () => {
    'use strict';

    let responseData = [];
    let promise;
    class mockAppService {
        constructor() { }
        getApps() {
            var p = Promise.defer();
            p.resolve({data: responseData});
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        appsActions.__Rewire__('AppService', mockAppService);

        promise = flux.actions.loadApps();

        //  expect a load apps event to get fired before the promise returns
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_APPS);
        flux.dispatchBinder.dispatch.calls.reset();

        promise.then(
            function() {
                done();
            },
            function() {
                done();
            }
        );
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
        promise = null;
    });

    it('test load apps action', () => {
        expect(promise.isFulfilled()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_APPS_SUCCESS, responseData);
    });


});
