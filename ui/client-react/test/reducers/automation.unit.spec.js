import reducer, {__RewireAPI__ as ReducerRewireAPI} from '../../src/reducers/automation';
import * as types from '../../src/actions/types';
import FacetSelections from '../../src/components/facet/facetSelections';
import _ from 'lodash';
import {UNSAVED_RECORD_ID} from '../../src/constants/schema';
import {NEW_RECORD_VALUE} from '../../src/constants/urlConstants';
import Diff from 'deep-diff';


/**
 * Unit tests for automation reducer
 *
 */
describe('Automation reducer functions', () => {


    describe('Automation reducer initialize', () => {
        it('returns correct initial state empty action', () => {
            let resultState = reducer(undefined, {});
            expect(resultState).toEqual({appId: null, list: null, error: undefined});
        });

        it('returns correct initial state on non-automation action', () => {
            let resultState = reducer(undefined, {type: types.CHANGE_LOCALE, id: 10});
            expect(resultState).toEqual({appId: null, list: null, error: undefined});
        });

        it('returns correct initial state on automation action', () => {
            let resultState = reducer(undefined, {type: types.LOAD_AUTOMATIONS, id: 10, content: 'TEST'});
            expect(resultState).toEqual({appId: 'TEST', list: null, error: undefined});
        });
    });

    describe('Automation reducer transitions', () => {
        let state = {appId: 'TEST'};

        it('returns correct initial state empty action', () => {
            let resultState = reducer(state, {});
            expect(resultState).toEqual({appId: 'TEST'});
        });

        it('returns correct initial state on load automations action', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATIONS_SUCCESS, id: 10, content: [{name: 'Auto 1'}]});
            expect(resultState).toEqual({appId: 'TEST', list: [{name: 'Auto 1'}], error: undefined});
        });

        it('returns correct initial state on load automations action failed', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATIONS_FAILED, id: 10, content: {message: 'error'}});
            expect(resultState).toEqual({appId: 'TEST', list: null, error: {message: 'error'}});
        });

        it('returns correct initial state on load automation action', () => {
            let resultState = reducer(state, {type: types.LOAD_AUTOMATION_SUCCESS, id: 10, content: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"}});
            expect(resultState).toEqual({appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"}, error: undefined});
        });

        it('returns correct state on save automation action', () => {
            let resultState = reducer(state, {type: types.SAVE_AUTOMATION_SUCCESS, id: 10, content: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"}});
            expect(resultState).toEqual({appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL"}, error: undefined});
        });
    });

    describe('Automation reducer setting email properties', () => {
        let state = {appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL", inputs: [
            {name: "toAddress", type: "TEXT", defaultValue: "test@test.com"},
            {name: "fromAddress", type: "TEXT",  defaultValue: "testing@quickbaserocks.com"},
            {name: "ccAddress", type: "TEXT",  defaultValue: null},
            {name: "subject", type: "TEXT", defaultValue: "Test subject"},
            {name: "body", type: "TEXT",  defaultValue: "Test body"}
        ]}};

        it('returns correct initial state empty action', () => {
            let resultState = reducer(state, {});
            expect(resultState).toEqual(state);
        });

        it('returns correct after change to', () => {
            let resultState = reducer(state, {type: types.CHANGE_AUTOMATION_EMAIL_TO, id: 10, content: {newTo: 'test2@test2.com'}});
            expect(resultState).toEqual({appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL", inputs: [
                {name: "toAddress", type: "TEXT", defaultValue: "test2@test2.com"},
                {name: "fromAddress", type: "TEXT",  defaultValue: "testing@quickbaserocks.com"},
                {name: "ccAddress", type: "TEXT",  defaultValue: null},
                {name: "subject", type: "TEXT", defaultValue: "Test subject"},
                {name: "body", type: "TEXT",  defaultValue: "Test body"}
            ]}});
        });

        it('returns correct after change subject', () => {
            let resultState = reducer(state, {type: types.CHANGE_AUTOMATION_EMAIL_SUBJECT, id: 10, content: {newSubject: 'Change subject'}});
            expect(resultState).toEqual({appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL", inputs: [
                {name: "toAddress", type: "TEXT", defaultValue: "test@test.com"},
                {name: "fromAddress", type: "TEXT",  defaultValue: "testing@quickbaserocks.com"},
                {name: "ccAddress", type: "TEXT",  defaultValue: null},
                {name: "subject", type: "TEXT", defaultValue: "Change subject"},
                {name: "body", type: "TEXT",  defaultValue: "Test body"}
            ]}});
        });

        it('returns correct after change body', () => {
            let resultState = reducer(state, {type: types.CHANGE_AUTOMATION_EMAIL_BODY, id: 10, content: {newBody: 'Change body'}});
            expect(resultState).toEqual({appId: 'TEST', automation: {id: 'auto1', name: 'Auto 1', active: true, type: "EMAIL", inputs: [
                {name: "toAddress", type: "TEXT", defaultValue: "test@test.com"},
                {name: "fromAddress", type: "TEXT",  defaultValue: "testing@quickbaserocks.com"},
                {name: "ccAddress", type: "TEXT",  defaultValue: null},
                {name: "subject", type: "TEXT", defaultValue: "Test subject"},
                {name: "body", type: "TEXT",  defaultValue: "Change body"}
            ]}});
        });
    });



});
