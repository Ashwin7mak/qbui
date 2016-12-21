const nav = (state = {trowserOpen: false, trowserContent: null}, action) => {

    // reducer - no mutations!
    switch (action.type) {
    case 'SHOW_TROWSER':
        return {
            trowserOpen: true,
            trowserContent: action.content
        };
    case 'HIDE_TROWSER':
        return {
            trowserOpen: false
        };

    default:
        // return existing state by default in redux
        return state;
    }
};

export default nav;
