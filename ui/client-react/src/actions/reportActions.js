// action creators
import * as actions from '../constants/actions';

let reportActions = {
    //
    // uncomment when action is implemented..
    //
    //addReport: function(report){
    //    this.dispatch('ADD_REPORT', report);
    //},
    //removeReport: function(index){
    //    this.dispatch('REMOVE_REPORT', index);
    //},
    loadReports: function(report) {
        this.dispatch(actions.LOAD_REPORTS, report);
    }
};

export default reportActions