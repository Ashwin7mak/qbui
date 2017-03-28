import {TOGGLE_NAV} from './commonNavActions';

// CLIENT REACT IMPORTS
import Breakpoints from '../../../../../client-react/src/utils/breakpoints';
// CLIENT REACT IMPORTS

/**
 * Use this when you setup your root reduces to quickly get a reducer for common nav actions
 * E.g.,
 * combineReducers({
 *   nav: commonNavReducer('governance'),
 *   anotherReducer,
 * })
 * Remember to pass the isNavOpen and isNavCollapsed state to the StandardLeftNav or similar component.
 * Plus it's already tested, so drop it in and attach it to a button and you are ready to go.
 * @param functionalAreaName - Optionally, namespace this reducer to your functional area. However, this will change the expected actions.
 * @returns {function(*=, *)}
 */
const commonNavReducer = (functionalAreaName = null) => {
    return (state = {isNavOpen: false, isNavCollapsed: false}, action = {type: null}) => {
        if (action.type === `${TOGGLE_NAV}${functionalAreaName ? `_${functionalAreaName}` : ''}`) {
            if (Breakpoints.isSmallBreakpoint()) {
                return {...state, isNavOpen: !state.isNavOpen, isNavCollapsed: false};
            }

            return {...state, isNavCollapsed: !state.isNavCollapsed};
        }

        return state;
    };
};

export default commonNavReducer;
