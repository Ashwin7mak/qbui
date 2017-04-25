import {UPDATE_FORM_ANIMATION_STATE} from './types';

export const updateFormAnimationState = (isAnimating) => {
    return {
        type: UPDATE_FORM_ANIMATION_STATE,
        isAnimating
    };
};
