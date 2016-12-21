import form from './form';

const formStack = (state = [], action) => {

    // reducer - no mutations!
    switch (action.type) {
    case 'PUSH_FORM':
        return [
            ...state,
            form(undefined, action)
        ];

    case 'POP_FORM':
        return state.slice(0, -1);

    case 'SET_FORM':
        return [ form(undefined, action) ];

    default:
        // return existing state by default in Redux
        return state;
    }
};

export default formStack;
