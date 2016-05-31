import Fluxxor from 'fluxxor';
import fieldsActions from '../../src/actions/fieldsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Fields Actions getFields missing params -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let responseData = [{data: [1, 2, 3]}];

    class mockFieldsService {
        constructor() { }
        getFields() {
            var p = Promise.defer();
            p.reject({message:'someError'});
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
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FIELDS_FAILED]);

                done();
            }
        );
    });
});
describe('Fields Actions getFields -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let responseData = [{data: [1, 2, 3]}];

    class mockFieldsService {
        constructor() { }
        getFields() {
            var p = Promise.defer();
            p.reject({message:'someError'});
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
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FIELDS_FAILED]);
                done();
            }
        );
    });
});

describe('Fields Actions getFields -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let responseData = [{data: [1, 2, 3]}];

    class mockFieldsService {
        constructor() { }
        getFields() {
            return Promise.resolve(null);
        }
        getField(id) {
            return Promise.resolve(null);
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

    it('test exception handling', (done) => {
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
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FIELDS_FAILED]);
                done();
            }
        );
    });
});
