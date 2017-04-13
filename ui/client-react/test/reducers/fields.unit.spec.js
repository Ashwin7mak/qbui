import {tableFieldsObj, tableFieldsReportDataObj, getField} from '../../src/reducers/fields';
import reducer from '../../src/reducers/fields';
import {BUILTIN_FIELD_ID} from '../../../common/src/constants';
import * as types from '../../src/actions/types';

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
        const currentField = tableFieldsObj(state, appId, tblId);
        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual([]);
        expect(currentField.keyField).toEqual(undefined);
        expect(currentField.fieldsLoading).toEqual(true);
        expect(currentField.error).toEqual(false);
    });
    it('test load fields success', () => {
        const keyField = {builtIn:true, id:BUILTIN_FIELD_ID.RECORD_ID};
        const fields = [{builtIn:true, id:3}, {builtIn:false, id:8}, {builtIn:false, keyField:true, id:10}];
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields:fields}));
        const currentField = tableFieldsObj(state, appId, tblId);

        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual(fields);
        expect(currentField.keyField).toEqual(keyField);
        expect(currentField.fieldsLoading).toEqual(false);
        expect(currentField.error).toEqual(false);
    });
    it('test load fields error', () => {
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS_ERROR));
        const currentField = tableFieldsObj(state, appId, tblId);
        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual([]);
        expect(currentField.keyField).toEqual(undefined);
        expect(currentField.fieldsLoading).toEqual(false);
        expect(currentField.error).toEqual(true);

        const reportObj = tableFieldsReportDataObj(state, appId, tblId);
        expect(reportObj.fields.data.length).toEqual(0);
    });
    it('test load form success', () => {
        const keyField = {builtIn:true, id:BUILTIN_FIELD_ID.RECORD_ID};
        const fields = [{builtIn:true, id:3}, {builtIn:false, id:8}, {builtIn:false, keyField:true, id:10}];
        const state = reducer([], {appId:appId, tblId:tblId, type:types.LOAD_FORM_SUCCESS, formData:{fields:fields}});
        const currentField = tableFieldsObj(state, appId, tblId);

        expect(currentField.appId).toEqual(appId);
        expect(currentField.tblId).toEqual(tblId);
        expect(currentField.fields).toEqual(fields);
        expect(currentField.keyField).toEqual(keyField);
        expect(currentField.fieldsLoading).toEqual(false);
        expect(currentField.error).toEqual(false);

        const reportObj = tableFieldsReportDataObj(state, appId, tblId);
        expect(reportObj.fields.data.length).toEqual(fields.length);

        const reportObjNotFound = tableFieldsReportDataObj();
        expect(reportObjNotFound.fields.data.length).toEqual(0);
    });

    it('test update field', () => {
        //load some fields so we can update them!
        const fields = [{builtIn:true, id:3}, {builtIn:false, id:8}, {builtIn:false, keyField:true, id:10}];
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields:fields}));
        const currentFieldList = tableFieldsObj(state, appId, tblId);
        expect(currentFieldList.fields).toEqual(fields);
        //okay lets update now
        const field = {builtIn:true, keyField:false, id:10};
        const upState = reducer(state, {type: types.UPDATE_FIELD, field: field, appId: appId, tblId: tblId});
        const updatedField = getField(upState, field.id, appId, tblId);
        expect(updatedField).toEqual(field);
    });

    it('test get field', () => {
        //load a field so we can get it!
        const field = {builtIn:true, keyField:true, id:10, required: false, name: "fielderino"};
        const fields = [field];
        const state = reducer([], event(appId, tblId, types.LOAD_FIELDS_SUCCESS, {fields:fields}));
        expect(getField(state, field.id, appId, tblId)).toEqual(field);
    });
});

