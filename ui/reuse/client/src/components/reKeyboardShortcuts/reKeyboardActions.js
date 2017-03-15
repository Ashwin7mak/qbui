import {ADD_KEY_BINDINGS, REMOVE_ALL_KEY_BINDINGS} from './reKeyboardReducer';

export const addAllKeyBindings = (id, bindings) => {
    return {
        type: ADD_KEY_BINDINGS,
        id,
        bindings
    };
};

export const removeAllKeyBindings = (id) => {
    return {
        type: REMOVE_ALL_KEY_BINDINGS,
        id
    };
};
