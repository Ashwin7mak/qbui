import * as types from '../actions/types';
import _ from 'lodash';

const featureSwitches = (
    state = {
        //  default states
        edited: false,
        switches: [],
        states: [],
    },
    action) => {

    // reducer - no mutations!
    switch (action.type) {
    case types.SET_FEATURE_SWITCHES:
        return {
            ...state,
            switches: action.switches
        };

    case types.SET_FEATURE_SWITCH_STATES:
        return {
            ...state,
            states: action.states
        };

    case types.SET_SWITCH_DEFAULT_STATE: {
        const switches = [...state.switches];
        const switchToToggle = switches.find(item => item.id === action.id);
        switchToToggle.defaultOn = action.defaultOn;

        return  {
            ...state,
            switches,
            edited: true
        };
    }

    case 'CREATE_ROW':
        return {
            ...state,
            switches: [...state.switches, action.feature],
            edited: true
        };

    case 'DELETE_ROW':
        return {
            ...state,
            switches: _.remove([...state.switches], fs => fs.id !== action.id),
            edited: true
        };

    case 'EDIT_ROW': {
        const switches = [...state.switches];
        const switchToEdit = switches.find(item => item.id === action.id);
        switchToEdit.editing = action.column;
        return {
            ...state,
            switches
        };
    }

    case 'CONFIRM_EDIT': {
        const switches = [...state.switches];
        const switchToConfirmEdit = switches.find(item => item.id === action.id);
        delete switchToConfirmEdit.editing;
        switchToConfirmEdit[action.property] = action.value;

        return {
            ...state,
            switches,
            edited: true
        };
    }

    case 'SAVED_FEATURE_SWITCHES':
        return {
            ...state,
            edited: false
        };

    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
