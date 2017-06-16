import {__RewireAPI__ as FieldsActionsRewireAPI} from '../../src/actions/fieldsActions';
import * as fieldActions from '../../src/actions/fieldsActions';
import * as types from '../../src/actions/types';
import Promise from 'bluebird';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockReportsStore = mockStore(middlewares);

Promise.onPossiblyUnhandledRejection(function() {
    // swallow the error..otherwise the log gets cluttered with the exception
});

function event(appId, tblId, type, content) {
    return {
        appId,
        tblId,
        type: type,
        content: content || null
    };
}

describe('Field Actions success workflow', () => {

    const appId = '1';
    const tblId = '2';
    const childtblId = '3';
    const field = {id: 10};
    const newFieldId = 20;
    const childFieldId = 20;
    const relationshipid = 2;
    const fieldWithRelationship = {
        id: 25,
        parentTableId:tblId,
        parentFieldId: newFieldId,
        childTableName:'childTableName'
    };

    let relationship = {
        masterAppId: appId,
        masterTableId: tblId,
        masterFieldId: newFieldId,
        detailAppId: appId,
        detailTableId: childtblId,
        detailFieldId: childFieldId,
        id: relationshipid,
        description: "Referential integrity relationship between Master / Child Tables",
        referentialIntegrity: false,
        cascadeDelete: false
    };

    let mockRelationshipResponse = {
        data:  {relationship}
    };

    let mockFormResponse = {
        data: {
            formMeta: {
                "tabs": {
                    "0": {
                        "fields": [6, 7],
                        "sections": {
                            "0": {
                                "fields": [6, 7],
                                "elements": {
                                    "0": {
                                        "FormFieldElement": {
                                            "type": "FIELD",
                                            "fieldId": 6,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };


    let mockResponseGetFields = {
        data: [field]
    };
    let mockResponseCreateField = {
        data: {id: newFieldId}
    };
    class mockFieldService {
        getFields() {
            return Promise.resolve(mockResponseGetFields);
        }
        createField() {
            return Promise.resolve(mockResponseCreateField);
        }
        updateField() {
            return Promise.resolve();
        }
    }

    class mockAppService {
        createRelationship() {
            return Promise.resolve(mockRelationshipResponse);
        }
    }

    class mockFormService {
        getForm() {
            return Promise.resolve(mockFormResponse);
        }
        updateForm() {
            return Promise.resolve(mockFormResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockFieldService.prototype, 'getFields').and.callThrough();
        spyOn(mockFieldService.prototype, 'createField').and.callThrough();
        spyOn(mockFieldService.prototype, 'updateField').and.callThrough();

        spyOn(mockAppService.prototype, 'createRelationship').and.callThrough();
        spyOn(mockFormService.prototype, 'getForm').and.callThrough();
        spyOn(mockFormService.prototype, 'updateForm').and.callThrough();

        FieldsActionsRewireAPI.__Rewire__('FieldsService', mockFieldService);
        FieldsActionsRewireAPI.__Rewire__('AppService', mockAppService);
        FieldsActionsRewireAPI.__Rewire__('FormService', mockFormService);


    });

    afterEach(() => {
        FieldsActionsRewireAPI.__ResetDependency__('FieldsService');
        FieldsActionsRewireAPI.__ResetDependency__('AppService', mockAppService);
        FieldsActionsRewireAPI.__ResetDependency__('FormService', mockFormService);
        mockFieldService.prototype.getFields.calls.reset();
        mockFieldService.prototype.createField.calls.reset();
        mockFieldService.prototype.updateField.calls.reset();

        mockAppService.prototype.createRelationship.calls.reset();
        mockFormService.prototype.getForm.calls.reset();
        mockFormService.prototype.updateForm.calls.reset();
    });

    it('verify saveNewField action', (done) => {
        const formId = null;
        const expectedActions = [
            {type: types.UPDATE_FIELD_ID, oldFieldId: field.id, newFieldId, formId, appId, tblId}
        ];
        const store = mockReportsStore({});
        return store.dispatch(fieldActions.saveNewField(appId, tblId, field, formId)).then(
            () => {
                expect(mockFieldService.prototype.createField).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });


    it('verify saveNewFieldWithRelationship action', (done) => {
        const formId = null;
        const expectedActions = [
            {type: types.UPDATE_FIELD_ID, oldFieldId: fieldWithRelationship.id, newFieldId, formId, appId, tblId}
        ];
        let mockUpdateParent = () => {
            return Promise.resolve();
        };
        FieldsActionsRewireAPI.__Rewire__('updateParentFormForRelationship', mockUpdateParent);
        const store = mockReportsStore({});
        return store.dispatch(fieldActions.saveNewField(appId, tblId, fieldWithRelationship, formId)).then(
            () => {
                expect(mockFieldService.prototype.createField).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockAppService.prototype.createRelationship).toHaveBeenCalled();

                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('verify updateFieldProperties action', (done) => {
        const expectedActions = [];
        const store = mockReportsStore({});
        return store.dispatch(fieldActions.updateFieldProperties(appId, tblId, field)).then(
            () => {
                expect(mockFieldService.prototype.updateField).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('verify loadFields action', (done) => {
        const expectedActions = [
            event(appId, tblId, types.LOAD_FIELDS),
            event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields: mockResponseGetFields.data})
        ];
        const store = mockReportsStore({});
        return store.dispatch(fieldActions.loadFields(appId, tblId)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockFieldService.prototype.getFields).toHaveBeenCalled();
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    describe('updateAllFieldsWIthEdits with no fields', () => {
        let fields = [];
        let mockGetFields = () => {
            return fields;
        };

        beforeEach(() => {
            FieldsActionsRewireAPI.__Rewire__('getFields', mockGetFields);
        });
        afterEach(() => {
            FieldsActionsRewireAPI.__ResetDependency__('getFields');
        });

        it('verify no fields to update', (done) => {
            fields = [];
            const store = mockReportsStore({});
            return store.dispatch(fieldActions.updateAllFieldsWithEdits(appId, tblId)).then(
                () => {
                    expect(mockFieldService.prototype.updateField).not.toHaveBeenCalled();
                    expect(true).toBe(true);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('updateAllFieldsWIthEdits with multiple fields', () => {
        let fields = [{id: 1}, {id: 2}, {id: 3}];
        let mockGetFields = () => {
            return fields;
        };

        beforeEach(() => {
            FieldsActionsRewireAPI.__Rewire__('getFields', mockGetFields);
        });
        afterEach(() => {
            FieldsActionsRewireAPI.__ResetDependency__('getFields');
        });

        it('verify multiple fields to update', (done) => {
            fields = [];
            const store = mockReportsStore({});
            return store.dispatch(fieldActions.updateAllFieldsWithEdits(appId, tblId)).then(
                () => {
                    expect(mockFieldService.prototype.updateField.calls.count()).toEqual(fields.length);
                    expect(true).toBe(true);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('saveAllFieldsWIthEdits with no fields', () => {
        let fields = [];
        let mockGetFields = () => {
            return fields;
        };

        beforeEach(() => {
            FieldsActionsRewireAPI.__Rewire__('getFields', mockGetFields);
        });
        afterEach(() => {
            FieldsActionsRewireAPI.__ResetDependency__('getFields');
        });

        it('verify no fields to update', (done) => {
            fields = [];
            const store = mockReportsStore({});
            return store.dispatch(fieldActions.saveAllNewFields(appId, tblId)).then(
                () => {
                    expect(mockFieldService.prototype.createField).not.toHaveBeenCalled();
                    expect(true).toBe(true);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });

    describe('saveAllFieldsWIthEdits with multiple fields', () => {
        let fields = [{id: 1}, {id: 2}, {id: 3}];
        let mockGetFields = () => {
            return fields;
        };

        beforeEach(() => {
            FieldsActionsRewireAPI.__Rewire__('getFields', mockGetFields);
        });
        afterEach(() => {
            FieldsActionsRewireAPI.__ResetDependency__('getFields');
        });

        it('verify multiple fields to update', (done) => {
            fields = [];
            const store = mockReportsStore({});
            return store.dispatch(fieldActions.saveAllNewFields(appId, tblId)).then(
                () => {
                    expect(mockFieldService.prototype.createField.calls.count()).toEqual(fields.length);
                    expect(true).toBe(true);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                });
        });
    });
});

describe('Field Actions failure workflow', () => {
    const appId = '1';
    const tblId = '2';
    const field = {id: 10};

    let errorResponse = {
        response: {
            error: {status:500}
        }
    };
    class mockFieldService {
        getFields() {
            return Promise.reject(errorResponse);
        }
        createField() {
            return Promise.reject(errorResponse);
        }
        updateField() {
            return Promise.reject(errorResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockFieldService.prototype, 'getFields').and.callThrough();
        spyOn(mockFieldService.prototype, 'createField').and.callThrough();
        spyOn(mockFieldService.prototype, 'updateField').and.callThrough();
        FieldsActionsRewireAPI.__Rewire__('FieldsService', mockFieldService);
    });
    afterEach(() => {
        FieldsActionsRewireAPI.__ResetDependency__('FieldsService');
        mockFieldService.prototype.getFields.calls.reset();
        mockFieldService.prototype.createField.calls.reset();
        mockFieldService.prototype.updateField.calls.reset();
    });

    let saveNewFieldTestCases = [
        {name:'verify missing appId parameter', appId:null, tblId:tblId, field:field},
        {name:'verify missing tblId parameter', appId:appId, tblId:null, field:field},
        {name:'verify missing field parameter', appId:appId, tblId:tblId, field:null},
        {name:'verify missing parameters'},
        {name:'verify createField reject response', appId:appId, tblId:tblId, field:field, rejectTest:true}
    ];

    saveNewFieldTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            let expectedActions = [];
            expectedActions.push(event(testCase.appId, testCase.tblId, types.LOAD_FIELDS_ERROR, {error:jasmine.any(Object)}));

            const store = mockReportsStore({});
            return store.dispatch(fieldActions.saveNewField(testCase.appId, testCase.tblId, testCase.field)).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.rejectTest === true) {
                        expect(mockFieldService.prototype.createField).toHaveBeenCalled();
                    } else {
                        expect(mockFieldService.prototype.createField).not.toHaveBeenCalled();
                    }
                    done();
                });
        });
    });

    let updateFieldsPropertiesTestCases = [
        {name:'verify missing appId parameter', appId:null, tblId:tblId, field:field},
        {name:'verify missing tblId parameter', appId:appId, tblId:null, field:field},
        {name:'verify missing field parameter', appId:appId, tblId:tblId, field:null},
        {name:'verify missing parameters'},
        {name:'verify createField reject response', appId:appId, tblId:tblId, field:field, rejectTest:true}
    ];

    updateFieldsPropertiesTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            let expectedActions = [];
            expectedActions.push(event(testCase.appId, testCase.tblId, types.LOAD_FIELDS_ERROR, {error:jasmine.any(Object)}));

            const store = mockReportsStore({});
            return store.dispatch(fieldActions.updateFieldProperties(testCase.appId, testCase.tblId, testCase.field)).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.rejectTest === true) {
                        expect(mockFieldService.prototype.updateField).toHaveBeenCalled();
                    } else {
                        expect(mockFieldService.prototype.updateField).not.toHaveBeenCalled();
                    }
                    done();
                });
        });
    });

    let loadFieldsTestCases = [
        {name:'verify missing appId parameter', tblId:tblId},
        {name:'verify missing tblId parameter', appId:appId},
        {name:'verify missing parameters'},
        {name:'verify getFields reject response', appId:appId, tblId:tblId, rejectTest:true}
    ];

    loadFieldsTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            let expectedActions = [];
            if (testCase.rejectTest === true) {
                expectedActions.push(event(testCase.appId, testCase.tblId, types.LOAD_FIELDS));
            }
            expectedActions.push(event(testCase.appId, testCase.tblId, types.LOAD_FIELDS_ERROR, {error:jasmine.any(Object)}));

            const store = mockReportsStore({});
            return store.dispatch(fieldActions.loadFields(testCase.appId, testCase.tblId)).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.rejectTest === true) {
                        expect(mockFieldService.prototype.getFields).toHaveBeenCalled();
                    } else {
                        expect(mockFieldService.prototype.getFields).not.toHaveBeenCalled();
                    }
                    done();
                });
        });
    });

    describe('setFieldsPropertiesPendingEditToFalse', () => {
        it('creates an action that sets isPendingEdit to false', () => {
            expect(fieldActions.setFieldsPropertiesPendingEditToFalse()).toEqual({
                type: types.SET_IS_PENDING_EDIT_TO_FALSE});
        });
    });
});
