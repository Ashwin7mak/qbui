// action creators
import * as actions from '../constants/actions';

let appsActions = {

    loadApps() {
        this.dispatch(actions.LOAD_APPS);
    },

    loadAppsWithTables() {
        this.dispatch(actions.LOAD_APPS_WITH_TABLES);
    }
};

export default appsActions;
