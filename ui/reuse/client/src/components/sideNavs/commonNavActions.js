// The action type to be used for commonNavReducer and commonNavActions
export const TOGGLE_NAV = 'TOGGLE_NAV';

// The action that will toggle the nav (collapse on medium/large breakpoints, open/close on small breakpoint)
export const toggleNav = () => ({type: TOGGLE_NAV});

/**
 * Export common nav actions for mapDispatchToProps with the action type namespaced to the functional area
 * @param functionalAreaName
 */
export const commonNavActions = functionalAreaName => ({
    toggleNav: () => ({type: `${TOGGLE_NAV}_${functionalAreaName}`})
});

export default commonNavActions;
