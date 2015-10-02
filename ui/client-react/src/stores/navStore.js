import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

var logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize: function() {
        this.state = {
            leftNavOpen: true,
            trouserOpen: false,
            leftNavItems: []
        };

        this.bindActions(
            actions.SHOW_TROUSER, this.onShowTrouser,
            actions.HIDE_TROUSER, this.onHideTrouser,
            actions.TOGGLE_LEFT_NAV, this.onToggleLeftNav
        );

        this.state.leftNavItems.push({id:0, name: 'Home', link:'/apps', icon:'home'});

        this.logger = new Logger();
    },

    onShowTrouser: function () {
        this.state.trouserOpen = true;
        this.emit("change");
    },

    onHideTrouser: function () {
        this.state.trouserOpen = false;
        this.emit("change");
    },

    onToggleLeftNav: function () {
        this.state.leftNavOpen = !this.state.leftNavOpen;
        this.emit("change");
    },

    getState: function () {
        return this.state;
    }
});

export default NavStore;