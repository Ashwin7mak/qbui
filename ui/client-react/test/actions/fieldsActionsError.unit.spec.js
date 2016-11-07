import Fluxxor from 'fluxxor';
import fieldsActions from '../../src/actions/fieldsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatus = 404;
let exStatus = 500;
let responseData = [{data: [1, 2, 3]}];

describe('Fields Actions getFields missing params -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';

    class mockFieldsService {
        constructor() { }
        getFields() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
            return p.promise;
        }
        getField(id) {
            return Promise.resolve({data:responseData});
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(fieldsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockFieldsService.prototype, 'getFields').and.callThrough();
        spyOn(mockFieldsService.prototype, 'getField').and.callThrough();

        fieldsActions.__Rewire__('FieldsService', mockFieldsService);
    });

    afterEach(() => {
        fieldsActions.__ResetDependency__('FieldsService');
    });

    it('test promise reject handling', (done) => {
        flux.actions.loadFields().then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFieldsService.prototype.getFields).not.toHaveBeenCalled();
                expect(mockFieldsService.prototype.getField).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FIELDS_FAILED, exStatus]);

                done();
            }
        );
    });
});
describe('Fields Actions getFields -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';

    class mockFieldsService {
        constructor() { }
        getFields() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
            return p.promise;
        }
        getField(id) {
            return Promise.resolve({data:responseData});
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(fieldsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockFieldsService.prototype, 'getFields').and.callThrough();
        spyOn(mockFieldsService.prototype, 'getField').and.callThrough();

        fieldsActions.__Rewire__('FieldsService', mockFieldsService);
    });

    afterEach(() => {
        fieldsActions.__ResetDependency__('FieldsService');
    });

    it('test promise reject handling', (done) => {
        flux.actions.loadFields(appId, tblId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFieldsService.prototype.getFields).toHaveBeenCalled();
                expect(mockFieldsService.prototype.getField).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FIELDS]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FIELDS_FAILED, errorStatus]);
                done();
            }
        );
    });
});

describe('Fields Actions getFields -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';

    class mockFieldsService {
        constructor() { }
        getFields() {
            return Promise.reject(null);
        }
        getField(id) {
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
    flux.addActions(fieldsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockFieldsService.prototype, 'getFields').and.callThrough();
        spyOn(mockFieldsService.prototype, 'getField').and.callThrough();
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        fieldsActions.__Rewire__('FieldsService', mockFieldsService);
        fieldsActions.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        fieldsActions.__ResetDependency__('FieldsService');
        fieldsActions.__ResetDependency__('Logger');
    });

    it('test exception handling', (done) => {
        flux.actions.loadFields(appId, tblId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFieldsService.prototype.getFields).toHaveBeenCalled();
                expect(mockFieldsService.prototype.getField).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FIELDS]);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            }
        );
    });
});
