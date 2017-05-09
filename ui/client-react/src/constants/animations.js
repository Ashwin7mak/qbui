export const FORM_ELEMENT_ENTER = {
    from: {transform: 'scale(0)', opacity: 0, transformOrigin: 'left top'},
    to: {transform: '', opacity: '', transformOrigin: 'left top'},
};

export const FORM_ELEMENT_LEAVE = {
    from: {transform: 'scale(1)', opacity: 1, transformOrigin: 'left top', transitionDuration: '0.3s'},
    to: {transform: 'scale(0)', opacity: 0, transformOrigin: 'left top', transitionDuration: '0.3s'},
};
