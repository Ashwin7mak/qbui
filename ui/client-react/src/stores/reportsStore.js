
import Fluxxor from 'fluxxor'


let ReportsStore = Fluxxor.createStore({
    initialize: function() {
        this.reports = [ ];

        this.bindActions(
            'ADD_TABLE', this.onAddReport,
            'REMOVE_TABLE', this.onRemoveReport,
            'LOAD_REPORTS', this.onLoadReports
        );
    },
    onAddReport: function (report) {
        this.reports.push(report);
        this.emit("change");
    },
    onRemoveReport: function (id) {
        this.reports.splice(index, 1);
        this.emit("change");
    },
    onLoadReports: function (dbid) {
        //mock data
        this.reports = [
            {id:0, name: 'Home', link:'/apps', icon:'home'},
            {id:1, name: 'Report #1', link:'/app/1/table/1/report/1'},
            {id:2, name: 'Report #2',link:'/app/1/table/1/report/2'},
            {id:3, name: 'Report #3',link:'/app/1/table/1/report/3'}
        ];
        this.emit("change");
    },

    getState: function () {
        return {
            list: this.reports
        }
    }
});

export default ReportsStore;