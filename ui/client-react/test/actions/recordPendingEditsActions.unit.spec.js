import Fluxxor from 'fluxxor';
import recordPendingEditsActions from '../../src/actions/recordPendingEditsActions';
import * as actions from '../../src/constants/actions';

describe('Record Pending Edits Actions functions ', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let recId = '3';
    let changes = {data: 'that changed', also : 'modified'};
    let origRec = {original: 'data before changes', more : {sub: 'info'}};

    let startInputs = {
        appId: appId,
        tblId: tblId,
        recId: recId,
        origRec: origRec,
        changes:{}
    };
    let changeRecInputs = {
        appId: appId,
        tblId: tblId,
        recId: recId,
        changes: changes,
    };
    let cancelRecInputs = {
        appId: appId,
        tblId: tblId,
        recId: recId
    };
    let commitRecInputs = {
        appId: appId,
        tblId: tblId,
        recId: recId
    };


    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(recordPendingEditsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    afterEach(() => {
        flux.dispatchBinder.dispatch.calls.reset();
    });

    it('test recordPendingEditsStart parameters', () => {
        flux.actions.recordPendingEditsStart(appId, tblId, recId, origRec, {});
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.RECORD_EDIT_START, startInputs);
    });

    it('test recordPendingEditsChangeField parameters', () => {
        flux.actions.recordPendingEditsChangeField(appId, tblId, recId, changes);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.RECORD_EDIT_CHANGE_FIELD, changeRecInputs);
    });

    it('test recordPendingEditsCancel', () => {
        flux.actions.recordPendingEditsCancel(appId, tblId, recId);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.RECORD_EDIT_CANCEL, cancelRecInputs);
    });

    it('test recordPendingEditsCommit', () => {
        flux.actions.recordPendingEditsCommit(appId, tblId, recId);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.RECORD_EDIT_SAVE, commitRecInputs);
    });

});
