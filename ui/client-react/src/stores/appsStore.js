import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();
import _ from 'lodash';

let AppsStore = Fluxxor.createStore({

    initialize: function() {
        this.apps = [];
        this.loading = false;
        this.error = false;

        this.bindActions(
            actions.LOAD_APPS, this.onLoadApps,
            actions.LOAD_APPS_SUCCESS, this.onLoadAppsSuccess,
            actions.LOAD_APPS_FAILED, this.onLoadAppsFailed,
            actions.SELECT_APP, this.onSelectApp,
            actions.SELECT_TABLE, this.onSelectTable
        );

        this.logger = new Logger();
    },
    onLoadApps: function() {
        this.loading = true;
        this.emit("change");
    },
    onLoadAppsFailed: function() {
        this.loading = false;
        this.error = true;
        this.emit("change");
    },
    onLoadAppsSuccess: function(apps) {

        this.loading = false;
        this.error = false;

        this.apps = apps;

        this.emit('change');
    },

    onSelectApp: function(appId) {
        this.selectedAppId = appId;

        this.emit('change');
    },
    onSelectTable: function(tblId) {
        this.selectedTableId = tblId;

        this.emit('change');
    },
    getState: function() {
        return {
            apps: this.apps,
            selectedAppId: this.selectedAppId,
            selectedTableId: this.selectedTableId,
            loading: this.loading,
            error: this.error
        };
    },
});

export default AppsStore;
