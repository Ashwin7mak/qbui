import {loadForm, updateForm, createForm, __RewireAPI__ as FormActionsRewireAPI} from '../../src/actions/formActions';
import * as types from '../../src/actions/types';
import WindowLocationUtils from '../../src/utils/windowLocationUtils';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

class WindowLocationUtilsMock {
    static pushWithoutQuery() { }
}

describe('Form Actions load form error functions', () => {

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
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }
        getForm() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }
        updateForm() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }
        createForm() {
            return Promise.reject({response:{message:'someError', status:errorStatus}});
        }
    }

    beforeEach(() => {
        spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
        spyOn(mockFormService.prototype, 'getForm').and.callThrough();
        spyOn(mockFormService.prototype, 'updateForm').and.callThrough();
        spyOn(mockFormService.prototype, 'createForm').and.callThrough();
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
            }
        );
    });
    it('test missing params to updateForm', (done) => {
        const store = mockStore({});
        return store.dispatch(updateForm()).then(
            () => {
                expect(false).toBe(true);
                done();
            }).catch(error => {
                expect(mockFormService.prototype.updateForm).not.toHaveBeenCalled();
                done();
            }
        );
    });
    it('test missing params to createForm', (done) => {
        const store = mockStore({});
        return store.dispatch(createForm()).then(
            () => {
                expect(false).toBe(true);
                done();
            }).catch(error => {
                expect(mockFormService.prototype.createForm).not.toHaveBeenCalled();
                expect(mockFormService.prototype.updateForm).not.toHaveBeenCalled();
                done();
            }
        );
    });

    var NEW = 'new';
    var loadFormTestCases = [
        {name:'test promise reject handling loadForm of new record', appId:'1', tblId:'2', rptId:'3', type:'edit', id:NEW},
        {name:'test promise reject handling loadForm', appId:'1', tblId:'2', rptId:'3', type:'edit', id:'123'}
    ];
    const loadFormExpectedActions = [
        {type: types.LOADING_FORM, id: 'edit'},
        {type: types.LOAD_FORM_ERROR, id: 'edit', error: 404}
    ];
    loadFormTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const store = mockStore({});
            return store.dispatch(loadForm(testCase.appId, testCase.tblId, testCase.rptId, testCase.type, testCase.id)).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    if (testCase.id === NEW) {
                        expect(mockFormService.prototype.getForm).toHaveBeenCalled();
                    } else {
                        expect(mockFormService.prototype.getFormAndRecord).toHaveBeenCalled();
                    }
                    expect(store.getActions()).toEqual(loadFormExpectedActions);
                    done();
                }
            );
        });
    });

    var VIEW = 'view';
    const saveFormExpectedActions = [
        {id:VIEW, type:types.SAVING_FORM, content:null},
        {id:VIEW, type:types.SAVING_FORM_ERROR, content:404}
    ];
    it('test promise reject handling updateForm', (done) => {
        const store = mockStore({});
        return store.dispatch(updateForm(1, 2, VIEW, {})).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(mockFormService.prototype.updateForm).toHaveBeenCalled();
                expect(mockFormService.prototype.createForm).not.toHaveBeenCalled();
                expect(store.getActions()).toEqual(saveFormExpectedActions);
                done();
            }
        );
    });
    it('test promise reject handling createForm', (done) => {
        const store = mockStore({});
        return store.dispatch(createForm(1, 2, VIEW, {})).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(mockFormService.prototype.createForm).toHaveBeenCalled();
                expect(mockFormService.prototype.updateForm).not.toHaveBeenCalled();
                expect(store.getActions()).toEqual(saveFormExpectedActions);
                done();
            }
        );
    });

});
