import {loadForm, __RewireAPI__ as FormActionsRewireAPI} from '../../src/actions/formActions';
import * as types from '../../src/actions/types';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

class WindowLocationUtilsMock {
    static pushWithoutQuery() { }
}

describe('Form Actions error functions', () => {

    beforeEach(() => {
        FormActionsRewireAPI.__Rewire__('WindowLocationUtils', WindowLocationUtilsMock);

    });

    afterEach(() => {
        FormActionsRewireAPI.__ResetDependency__('WindowLocationUtils');
    });

    // we mock the Redux store when testing async action creators

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);

    const errorStatus = 404;

    class mockFormService {
        constructor() { }
        getFormAndRecord() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
            return p.promise;
        }
        getForm() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
            return p.promise;
        }
    }

    beforeEach(() => {
        spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
        spyOn(mockFormService.prototype, 'getForm').and.callThrough();
        FormActionsRewireAPI.__Rewire__('FormService', mockFormService);
    });

    afterEach(() => {
        FormActionsRewireAPI.__ResetDependency__('FormService');
    });

    it('test missing params to loadForm', (done) => {

        const store = mockStore({});

        return store.dispatch(loadForm()).then(
            () => {
                expect(false).toBe(true);
                done();
            }).catch(error => {
                expect(mockFormService.prototype.getForm).not.toHaveBeenCalled();
                done();
            });
    });

    it('test promise reject handling loadForm', (done) => {

        const expectedActions = [
            {type: types.LOADING_FORM, id: 'edit'},
            {type: types.LOAD_FORM_ERROR, id: 'edit', error: 404}
        ];
        const store = mockStore({});

        return store.dispatch(loadForm("appId", "tblId", "report", "edit", "new")).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(mockFormService.prototype.getForm).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('test promise reject handling loadForm with record ID', (done) => {

        const expectedActions = [
            {type: types.LOADING_FORM, id: 'edit'},
            {type: types.LOAD_FORM_ERROR, id: 'edit', error: 404}
        ];
        const store = mockStore({});

        return store.dispatch(loadForm("appId", "tblId", "report", "edit", "123")).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(mockFormService.prototype.getFormAndRecord).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });
});
