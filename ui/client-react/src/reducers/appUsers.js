import * as types from '../actions/types';

const appUser = (
	state = {
	//  default states
    successDialogOpen: false,
    addedAppUser: []
},
	action) => {

    switch (action.type) {
    case types.TOGGLE_ADD_TO_APP_SUCCESS_DIALOG: {
        return {
            ...state,
            successDialogOpen: action.content.isOpen,
            addedAppUser: [action.content.email]
        };
    }

    default:
    // return existing state by default in redux
        return state;
    }
};

export default appUser;
