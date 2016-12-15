const nav = (state = {}, action) => {
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
        return state;
    }
};

export default nav;
