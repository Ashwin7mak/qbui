import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();
import {sampleFormJSON} from '../components/QBForm/fakeData.js';

/**
 * FieldStore keeps the list of fields in a table since the sort and group feature (and others later) allow selecting a field that is not in the report for sorting/grouping.
 * So we need to be able to access all the fields for the table. This store provide it.
 */
let FormStore = Fluxxor.createStore({

    initialize: function() {
        this.formData = {};
        this.formLoading = false;
        this.error = false;

        this.bindActions(
            actions.LOAD_FORM_AND_RECORD, this.onLoadFormAndRecord,
            actions.LOAD_FORM_AND_RECORD_SUCCESS, this.onLoadFormAndRecordSuccess,
            actions.LOAD_FORM_AND_RECORD_FAILED, this.onLoadFormAndRecordFailed
        );

        this.logger = new Logger();
    },
    onLoadFormAndRecord: function() {
        this.formLoading = true;
        this.emit("change");
    },
    onLoadFormAndRecordFailed: function() {
        this.formLoading = false;
        this.formData = {};
        this.error = true;
        this.emit("change");
    },
    onLoadFormAndRecordSuccess: function(formData) {
        console.log("filling form data");
        this.formLoading = false;
        this.formData = sampleFormJSON;
        this.error = false;
        this.emit('change');
    },
    getState: function() {
        return {
            formData: this.formData,
            formLoading: this.formLoading,
            error: this.error
        };
    },
});

export default FormStore;
