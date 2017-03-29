// The action type to be used for commonNavReducer and commonNavActions
export const TOGGLE_NAV = 'TOGGLE_NAV';

// The action that will toggle the nav (collapse on medium/large breakpoints, open/close on small breakpoint)
export const toggleNav = () => ({type: TOGGLE_NAV});
