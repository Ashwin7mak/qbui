// action creators
import * as actions from '../constants/actions';

let reportDataActions = {

    loadReport: function(id) {

        this.dispatch(actions.LOAD_REPORT, id);
    }
};

export default reportDataActions