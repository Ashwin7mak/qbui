// action creators

let appsActions = {

    loadApps: function() {
        this.dispatch('LOAD_APPS');
    },

    loadAppsWithTables: function() {
        this.dispatch('LOAD_APPS_WITH_TABLES');
    }
};

export default appsActions