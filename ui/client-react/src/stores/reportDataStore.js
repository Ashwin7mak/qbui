
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
                    {name: 'Drew', color: 'red'},
                    {name: 'Don', color: 'blue'}
                ];
                break;
            case 2:
                this.data = [
                    {name: 'Aditi', number: 123},
                    {name: 'Claire', number: 456}
                ];
                break;
            case 3:
                this.data = [
                    {name: 'Claude', place: 'Sonoma'},
                    {name: 'Mark', place: 'Boston'}
                ];
                break;
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