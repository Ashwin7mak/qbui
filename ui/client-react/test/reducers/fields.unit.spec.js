import reducer from '../../src/reducers/fields';
import * as types from '../../src/actions/types';

let initialState = [];
const appId = '1';
const tblId = '2';

function event(app, tbl, type, content) {
    return {
        appId:app,
        tblId:tbl,
        type: type,
        content: content || null
    };
}

describe('Test fields reducer', () => {
    it('test load fields', () => {
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS));
        const currentField = _.find(state, field => field.appId === appId && field.tblId === tblId);

        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual([]);
        expect(currentField.keyField).toEqual(undefined);
        expect(currentField.fieldsLoading).toEqual(true);
        expect(currentField.error).toEqual(false);
    });
    it('test load fields success', () => {
        const keyField = {builtIn:false, keyField:true, id:10};
        const fields = [{builtIn:true, id:3}, {builtIn:false, id:8}, {builtIn:false, keyField:true, id:10}];
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields:fields}));
        const currentField = _.find(state, field => field.appId === appId && field.tblId === tblId);

        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual({fields:{data:fields}});
        expect(currentField.keyField).toEqual(keyField);
        expect(currentField.fieldsLoading).toEqual(false);
        expect(currentField.error).toEqual(false);
    });
    it('test load fields error', () => {
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS_ERROR));
        const currentField = _.find(state, field => field.appId === appId && field.tblId === tblId);

        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual([]);
        expect(currentField.keyField).toEqual(undefined);
        expect(currentField.fieldsLoading).toEqual(false);
        expect(currentField.error).toEqual(true);
    });
});

