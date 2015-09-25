
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
            {name: 'All Tasks',id:1},
            {name: 'My Open Tasks',id:2},
            {name: 'My Overdue Tasks',id:3},
            {name: 'Task Summary',id:4},
            {name: 'Updated Tasks',id:5}
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