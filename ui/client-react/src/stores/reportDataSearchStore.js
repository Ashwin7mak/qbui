import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';

let ReportDataSearchStore = Fluxxor.createStore({

    initialize() {
        this.initInput();
        this.bindActions(
            actions.FILTER_SEARCH_PENDING, this.onFilterSearchPending
        );

    },
    initInput() {
        this.state =  {
            searchStringInput : '' // input string being debounced before filtering
        };
    },

    onFilterSearchPending(payload) {
        this.state.searchStringInput = payload.string;
        this.emit('change');
    },

    getState() {
        return this.state;
    },
});

export default ReportDataSearchStore;
