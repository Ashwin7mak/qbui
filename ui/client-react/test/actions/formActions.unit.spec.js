import Fluxxor from 'fluxxor';
import formActions from '../../src/actions/formActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Form Actions functions', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let recordId = '2';
    let responseData = {
        "formId": 1,
        "tableId": "0wbfabsaaaaac",
        "appId": "0wbfabsaaaaab"
    };

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(formActions);

    class mockFormService {
        constructor() { }
        getFormAndRecord() {
            return Promise.resolve({data: responseData});
        }
    }
    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
        formActions.__Rewire__('FormService', mockFormService);
    });

    afterEach(() => {
        formActions.__ResetDependency__('FormService');
    });

    var formActionTests = [
        {name:'test loadFormAndRecord action', appId: appId, tblId: tblId, recordId: recordId},
    ];

    formActionTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadFormAndRecord(test.appId, test.tblId, test.recordId).then(
                () => {
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FORM_AND_RECORD]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FORM_AND_RECORD_SUCCESS, responseData]);
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
