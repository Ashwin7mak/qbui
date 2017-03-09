import * as types from '../actions/types';

const featureSwitches = (
    state = {
        //  default states
        switches: [],
        overrides: [],
        states: [],
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_FEATURE_SWITCHES:

        // update switches

        return {
            ...state,
            switches: [...action.switches]
        };

    case types.CREATED_FEATURE_SWITCH: {

        // add new switch

        const newSwitch = {...action.feature, overrides: []};

        return {
            ...state,
            switches: [...state.switches, newSwitch]
        };
    }

    case types.EDIT_FEATURE_SWITCH: {

        // set editing column on switch with given ID

        const switches = [...state.switches]; // always make a copy

        const switchToEdit = switches.find(item => item.id === action.id);
        switchToEdit.editing = action.column;

        return {
            ...state,
            switches
        };
    }

    case types.FEATURE_SWITCH_UPDATED: {

        // update feature switch with given ID with edited property-value

        const switches = [...state.switches];
        const switchToConfirmEdit = switches.find(item => item.id === action.id);

        switchToConfirmEdit[action.property] = action.value;
        switchToConfirmEdit.editing = false;

        return {
            ...state,
            switches
        };
    }

    case types.FEATURE_SWITCHES_DELETED: {

        // keep switches whose ids are not in the deleted ids array
        return {
            ...state,
            switches: state.switches.filter(fs => action.ids.indexOf(fs.id) === -1)
        };
    }

    // overrides

    case types.SET_FEATURE_OVERRIDES: {

        // set the overrides to those of feature switch with given ID

        const currentSwitch = state.switches.find(item => item.id === action.id);
        return {
            ...state,
            overrides: currentSwitch && currentSwitch.overrides ? [...currentSwitch.overrides] : []
        };
    }

    case types.CREATED_OVERRIDE:

        // add new override

        return {
            ...state,
            overrides: [...state.overrides, {...action.override}]
        };

    case types.EDIT_OVERRIDE: {
        const overrides = [...state.overrides];

        const overrideToEdit = overrides.find(item => item.id === action.id);
        overrideToEdit.editing = action.column;

        return {
            ...state,
            overrides
        };
    }

    case types.OVERRIDE_UPDATED: {
        const overrides = [...state.overrides];

        const overrideToConfirmEdit = overrides.find(item => item.id === action.id);
        overrideToConfirmEdit.editing = false;
        overrideToConfirmEdit[action.property] = action.value;

        return {
            ...state,
            overrides
        };
    }

    case types.OVERRIDES_DELETED: {

        return {
            ...state,
            overrides: state.overrides.filter(override => action.ids.indexOf(override.id) === -1)
        };
    }

    case types.SET_FEATURE_SWITCH_STATES:
        return {
            ...state,
            states: [...action.states]
        };

    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
