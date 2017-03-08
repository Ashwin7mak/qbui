import reducer from '../../src/reducers/animation';
import {UPDATE_FORM_ANIMATION_STATE} from '../../src/actions/types';

const initialState = {
    isFormAnimating: false
};

describe('Animation reducer', () => {
    it('returns the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    describe('isFormAnimating', () => {
        it('updates the state of isFormAnimating', () => {
            expect(reducer(initialState, {type: UPDATE_FORM_ANIMATION_STATE, isAnimating: true})).toEqual({
                isFormAnimating: true
            });

            expect(reducer({isFormAnimating: true}, {type: UPDATE_FORM_ANIMATION_STATE, isAnimating: false})).toEqual({
                isFormAnimating: false
            });
        });
    });
});