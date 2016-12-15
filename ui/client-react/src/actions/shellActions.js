// action creators (no dispatching in Redux)

export const showTrowser = (content) => {
    return {
        type: 'SHOW_TROWSER',
        content
    };
};

export const hideTrowser = () => {
    return {
        type: 'HIDE_TROWSER'
    };
};
