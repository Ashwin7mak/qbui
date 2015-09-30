// action creators

let reportActions = {
    addReport: function(report){
        this.dispatch('ADD_REPORT', report);
    },
    removeReport: function(index){
        this.dispatch('REMOVE_REPORT', index);
    },
    loadReports: function(dbid) {
        this.dispatch('LOAD_REPORTS', dbid);
    }
};

export default reportActions