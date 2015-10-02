// action creators
import * as actions from '../constants/actions';

let appsActions = {

    loadApps: function() {
        this.dispatch(actions.LOAD_APPS);
    },

    loadAppsWithTables: function() {
        this.dispatch(actions.LOAD_APPS_WITH_TABLES);
    }
};

export default appsActions