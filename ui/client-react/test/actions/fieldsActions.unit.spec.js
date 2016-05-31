import Fluxxor from 'fluxxor';
import fieldsActions from '../../src/actions/fieldsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Fields Actions functions', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let responseData = [{data: [1, 2, 3]}];

    class mockFieldsService {
        constructor() { }
        getFields() {
            return Promise.resolve({data: responseData});
        }
        getField(id) {
            return Promise.resolve({data: {id:id}});
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

    var fieldsActionTests = [
        {name:'test load fields action', appId: appId, tblId: tblId},
    ];

    fieldsActionTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadFields(test.appId, test.tblId).then(
                () => {
                    expect(mockFieldsService.prototype.getFields).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FIELDS]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FIELDS_SUCCESS, {appId, tblId, data:responseData}]);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });
});
