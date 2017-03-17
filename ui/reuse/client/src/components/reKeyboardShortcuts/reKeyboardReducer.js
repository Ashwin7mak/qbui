export const ADD_KEY_BINDINGS = 'reKeyboardShortcuts.ADD_KEY_BINDINGS';
export const REMOVE_ALL_KEY_BINDINGS = 'reKeyboardShortcuts.REMOVE_ALL_KEY_BINDINGS';

const reKeyboard = (state = [], action) => {
    switch (action.type) {
    case ADD_KEY_BINDINGS :
        // Existing binding sets are currently removed and replaced
        // TODO:: Make it possible to add single key bindings to a set
        return [
            ...state.filter(keyBindingSet => keyBindingSet.id !== action.id),
            {id: action.id, bindings: action.bindings}
        ];

    case REMOVE_ALL_KEY_BINDINGS :
        // Removes all keybindings for a set
        // TODO:: Make it possible to remove a single key from a key binding set
        return state.filter(keyBindingSet => keyBindingSet.id !== action.id);

    default :
        return state;
    }
};

export default reKeyboard;
