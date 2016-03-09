import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';

let FacetMenuStore = Fluxxor.createStore({

    initialize() {
        this.initMenu();
        this.bindActions(
            actions.SHOW_FACET_MENU, this.onShowMenu,
            actions.HIDE_FACET_MENU, this.onHideMenu,
            actions.SET_FACETS_EXPANDED, this.onSetExpanded,
            actions.SET_FACETS_MORE_REVEALED, this.onSetMoreRevealed,
            actions.LOAD_REPORT, this.onChangedReport
        );

    },
    initMenu() {
        this.state =  {
            show: false,
            expandedFacetFields : [],
            moreRevealedFacetFields :[]
        };
    },
    onShowMenu() {
        this.state.show = true;
        this.emit("change");
    },
    onHideMenu() {
        this.state.show = false;
        this.emit("change");
    },
    onSetExpanded(payload) {
        this.state.expandedFacetFields = payload.expanded;
        this.emit("change");
    },
    onSetMoreRevealed(payload) {
        this.state.moreRevealedFacetFields = payload.moreRevealed;
        this.emit("change");
    },
    onChangedReport() {
        this.initMenu();
        this.emit("change");
    },
    getState() {
        return this.state;
    },
});

export default FacetMenuStore;
