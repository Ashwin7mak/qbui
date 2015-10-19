import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Locale from '../locales/locales';
import Logger from '../utils/logger';
var logger = new Logger();

let NavStore = Fluxxor.createStore({

    initialize: function() {
        this.state = {
            leftNavOpen: true,
            mobileLeftNavOpen: false,
            trouserOpen: false,
            leftNavItems: []
        };

        this.setLocaleBundle();

        this.bindActions(
            actions.SHOW_TROUSER, this.onShowTrouser,
            actions.HIDE_TROUSER, this.onHideTrouser,
            actions.TOGGLE_LEFT_NAV, this.onToggleLeftNav,
            actions.CHANGE_LOCALE, this.onChangeLocale
        );

        this.state.leftNavItems.push({ key: 'nav.home', link:'/apps', icon:'home'});
    },

    onChangeLocale: function() {
        logger.debug('changing locale: ' + Locale.getLocale());
        this.setLocaleBundle();
        this.emit('change');
    },

    onShowTrouser: function() {
        this.state.trouserOpen = true;
        this.emit('change');
    },

    onHideTrouser: function() {
        this.state.trouserOpen = false;
        this.emit('change');
    },

    onToggleLeftNav: function() {
        this.state.leftNavOpen = !this.state.leftNavOpen;
        this.state.mobileLeftNavOpen = !this.state.mobileLeftNavOpen;
        this.emit('change');
    },

    getState: function() {
        return this.state;
    },

    setLocaleBundle: function() {
        this.state.i18n = Locale.getI18nBundle();
    }
});

export default NavStore;