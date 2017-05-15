import {UPDATE_FORM_ANIMATION_STATE} from '../actions/types';

const Animation = (state = {isFormAnimating: false}, action) => {
    switch (action.type) {

    case UPDATE_FORM_ANIMATION_STATE :
        // Updates the animation state of a form so multiple drop events are not called while building
        return Object.assign({}, state, {isFormAnimating: action.isAnimating});

        case 'UPDATE_RELATIONSHIP_DIALOG' :
            return {...state, isRelationshipDialogShown: true};

    default :
        return state;
    }
};

export default Animation;
