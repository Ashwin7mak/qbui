import * as actions from '../../src/actions/featureSwitchActions';
import * as types from '../../src/actions/types';

describe('Feature switch actions', () => {

    it('should create an action for loaded switches', () => {
        const switches = [{id: "id", name: "Feature", teamName: "team", description: "desc", defaultOn: false}];
        expect(actions.loadSwitchesSuccess(switches)).toEqual({type: types.SET_FEATURE_SWITCHES, switches});
    });

    it('should create an action for created feature', () => {
        const feature = {id: "id", name: "Feature", teamName: "team", description: "desc", defaultOn: false};
        expect(actions.createdFeatureSwitch(feature)).toEqual({type: types.CREATED_FEATURE_SWITCH, feature});
    });

    it('should create an action for deleted features', () => {
        const ids = ['id1', 'id2', 'id3'];
        expect(actions.featureSwitchesDeleted(ids)).toEqual({type: types.FEATURE_SWITCHES_DELETED, ids});
    });

    it('should create an action for edit feature', () => {
        const id = 'id1';
        const column = 'name';
        expect(actions.editFeatureSwitch(id, column)).toEqual({type: types.EDIT_FEATURE_SWITCH, id, column});
    });

    it('should create an action for feature switch updated', () => {
        const id = 'id';
        const property = 'property';
        const value = 'value';
        expect(actions.featureSwitchUpdated(id, property, value)).toEqual({type: types.FEATURE_SWITCH_UPDATED, id, property, value});
    });

    it('should create an action for set feature switch overrides', () => {
        const id = 'id1';

        expect(actions.setFeatureSwitchOverrides(id)).toEqual({type: types.SET_FEATURE_OVERRIDES, id});
    });

    it('should create an action for create feature switch override', () => {
        const override = {id: 'id', entityType: 'app', entityValue: '123', on: true};
        expect(actions.createdOverride(override)).toEqual({type: types.CREATED_OVERRIDE, override});
    });

    it('should create an action for edit override', () => {
        const id = 'id1';
        const column = 'name';
        expect(actions.editOverride(id, column)).toEqual({type: types.EDIT_OVERRIDE, id, column});
    });

    it('should create an action for feature switch override updated', () => {
        const id = 'id';
        const property = 'property';
        const value = 'value';
        expect(actions.overrideUpdated(id, property, value)).toEqual({type: types.OVERRIDE_UPDATED, id, property, value});
    });

    it('should create an action for deleted overrides', () => {
        const ids = ['id1', 'id2', 'id3'];
        expect(actions.overridesDeleted(ids)).toEqual({type: types.OVERRIDES_DELETED, ids});
    });


    it('should create an action for loaded feature states', () => {
        const states = [{'Feature 1': true}, {'Feature 2': false}];
        expect(actions.loadStatesSuccess(states)).toEqual({type: types.SET_FEATURE_SWITCH_STATES, states});
    });
});
