import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatus = 404;
let exStatus = 500;
let responseData = [{id:'tableId', link:'/app/tableId'}];

describe('Apps Actions getApps -- ', () => {
    'use strict';

    class mockAppService {
        constructor() { }
        getApps() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
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
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_FAILED, errorStatus]);
                done();
            }
        );
    });
});

describe('Apps Actions getApp -- ', () => {
    'use strict';

    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve({data: responseData});
        }
        getApp(id) {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
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
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_FAILED, errorStatus]);
                done();
            }
        );
    });
});

describe('Apps Actions getApps -- ', () => {
    'use strict';

    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.reject(null);
        }
        getApp(id) {
            return Promise.reject(null);
        }
    }

    class mockLogger {
        constructor() {}
        logException() {}
        debug() {}
        warn() {}
        error() {}
        parseAndLogError() {}
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
        appsActions.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
        appsActions.__ResetDependency__('Logger');
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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            }
        );
    });
});

describe('Apps Actions getApp -- ', () => {
    'use strict';

    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve({data: responseData});
        }
        getApp(id) {
            return Promise.reject(null);
        }
    }

    class mockLogger {
        constructor() {}
        logException() {}
        debug() {}
        warn() {}
        error() {}
        parseAndLogError() {}
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
        appsActions.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
        appsActions.__ResetDependency__('Logger');
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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            }
        );
    });
});

