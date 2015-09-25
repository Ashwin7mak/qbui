
import Fluxxor from 'fluxxor'


let ReportDataStore = Fluxxor.createStore({
    initialize: function() {
        this.data = [ ];

        this.bindActions(
            'LOAD_REPORT', this.onLoadReport
        );
    },

    onLoadReport: function (reportID) {

        switch (reportID) {
            case 1:
                this.data = [
                    {name: 'Drew', place: 'Ottawa'},
                    {name: 'Don', place: 'Nashua'}
                ];
                break;
            case 2:
                this.data = [
                    {name: 'Aditi', place: 'New York'},
                    {name: 'Claire', place: 'Berlin'}
                ];
                break;
            case 3:
                this.data = [
                    {name: 'Claude', place: 'Sonoma'},
                    {name: 'Mark', place: 'Boston'}
                ];
                break;
            default:
                this.data = [];
        }

        this.emit("change");
    },

    getState: function () {
        return {
            data: this.data
        }
    }
});

export default ReportDataStore;