import {updateFormAnimationState} from '../../src/actions/animationActions';
import {UPDATE_FORM_ANIMATION_STATE} from '../../src/actions/types';

describe('updateFormAnimationState', () => {
    it('updates the state indicating whether an animation is currently active', () => {
        expect(updateFormAnimationState(true)).toEqual({
            type: UPDATE_FORM_ANIMATION_STATE,
            isAnimating: true
        });

        expect(updateFormAnimationState(false)).toEqual({
            type: UPDATE_FORM_ANIMATION_STATE,
            isAnimating: false
        });
    });
});
