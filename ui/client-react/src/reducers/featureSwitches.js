import * as types from '../actions/types';
import _ from 'lodash';

const featureSwitches = (
    state = {
        //  default states

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
            switches
        };
    }

    case 'CREATE_ROW':
        return {
            ...state,
            switches: [...state.switches, action.feature]
        };

    case 'DELETE_ROW':
        return {
            ...state,
            switches: _.remove([...state.switches], fs => fs.id !== action.id)
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
        switchToConfirmEdit.editing = false;
        switchToConfirmEdit[action.property] = action.value;

        return {
            ...state,
            switches
        };
    }

    default:
        // return existing state by default in redux
        return state;
    }
};

export default featureSwitches;
