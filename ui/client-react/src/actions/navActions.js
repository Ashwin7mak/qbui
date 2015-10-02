// action creators
import * as actions from '../constants/actions';

let navActions = {

    showTrouser: function() {
        this.dispatch(actions.SHOW_TROUSER);
    },

    hideTrouser: function() {
        this.dispatch(actions.HIDE_TROUSER);
    },

    toggleLeftNav: function() {
        this.dispatch(actions.TOGGLE_LEFT_NAV);
    },
};

export default navActions