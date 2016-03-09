// action creators
import * as actions from '../constants/actions';

let facetMenuActions = {

    showFacetMenu(showParam) {
        let show = showParam ? showParam.show : true;
        this.dispatch(show ? actions.SHOW_FACET_MENU : actions.HIDE_FACET_MENU);
    },
    setFacetsExpanded(payload) {
        this.dispatch(actions.SET_FACETS_EXPANDED, payload);
    },
    setFacetsMoreRevealed(payload) {
        this.dispatch(actions.SET_FACETS_MORE_REVEALED, payload);
    }
};

export default facetMenuActions;
