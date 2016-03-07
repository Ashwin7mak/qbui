// action creators
import * as actions from '../constants/actions';

let facetMenuActions = {

    showFacetMenu() {
        this.dispatch(actions.SHOW_FACET_MENU);
    },
    hideFacetMenu() {
        this.dispatch(actions.HIDE_FACET_MENU);
    },
    setFacetsExpanded(payload) {
        this.dispatch(actions.SET_FACETS_EXPANDED, payload);
    },
    setFacetsMoreRevealed(payload) {
        this.dispatch(actions.SET_FACETS_MORE_REVEALED, payload);
    }
};

export default facetMenuActions;
