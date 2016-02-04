import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Apps Actions getApps -- ', () => {
    'use strict';

    let responseData = [{id:'tableId', link:'/app/tableId'}];
    class mockAppService {
        constructor() { }
        getApps() {
            var p = Promise.defer();
            p.reject({message:'someError'});
            return p.promise;
        }
        getApp(id) {
            return Promise.resolve({data:responseData});
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
    });

    it('test promise reject handling', (done) => {
        flux.actions.loadApps(true).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                expect(mockAppService.prototype.getApp).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_FAILED]);
                done();
            });
    });
});

describe('Apps Actions getApp -- ', () => {
    'use strict';

    let responseData = [{id:'tableId', link:'/app/tableId'}];
    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve({data: responseData});
        }
        getApp(id) {
            var p = Promise.defer();
            p.reject({message:'someError'});
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
    });

    it('test promise reject handling', (done) => {
        flux.actions.loadApps(true).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                expect(mockAppService.prototype.getApp).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_FAILED]);
                done();
            });
    });
});

describe('Apps Actions getApps -- ', () => {
    'use strict';

    let responseData = [{id:'tableId', link:'/app/tableId'}];
    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve(null);
        }
        getApp(id) {
            return Promise.resolve(null);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
    });

    it('test exception handling', (done) => {
        flux.actions.loadApps(true).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                expect(mockAppService.prototype.getApp).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_FAILED]);
                done();
            });
    });
});

describe('Apps Actions getApp -- ', () => {
    'use strict';

    let responseData = [{id:'tableId', link:'/app/tableId'}];
    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve({data: responseData});
        }
        getApp(id) {
            return Promise.resolve(null);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
    });

    it('test exception handling', (done) => {
        flux.actions.loadApps(true).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                expect(mockAppService.prototype.getApp).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_FAILED]);
                done();
            });
    });
});

