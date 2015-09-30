
import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';

let ReportDataStore = Fluxxor.createStore({

    initialize: function() {
        this.data = [ ];

        this.bindActions(
            'LOAD_REPORT', this.onLoadReport
        );

        this.logger = new Logger();
    },

    onLoadReport: function (reportID) {

        switch (reportID) {
            case 1:
                this.data = [
                    {name: 'Drew', place: 'Ottawa'},
                    {name: 'Don', place: 'Nashua'},
                    {name: 'Claude', place: 'Sonoma'},
                ];
                break;
            case 2:
                this.data = [
                    {name: 'Aditi', place: 'New York'},
                    {name: 'Claire', place: 'Berlin'},
                    {name: 'Rick', place: 'Los Angeles'}
                ];
                break;
            case 3:
                this.data = [
                    {name: 'Micah', place: 'Dallas'},
                    {name: 'Kana', place: 'Boston'},
                    {name: 'Matt', place: 'Portsmouth'}
                ];
                break;
            case 4:
                this.data = [
                    {name: 'Drew', place: 'Ottawa'},
                    {name: 'Don', place: 'Nashua'},
                    {name: 'Claude', place: 'Sonoma'},
                    {name: 'Aditi', place: 'New York'},
                    {name: 'Claire', place: 'Berlin'},
                    {name: 'Rick', place: 'Los Angeles'},
                    {name: 'Micah', place: 'Dallas'},
                    {name: 'Kana', place: 'Boston'},
                    {name: 'Matt', place: 'Portsmouth'},
                    {name: 'Chris', place: 'Cambridge'}
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