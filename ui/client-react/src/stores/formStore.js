import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();

/**
 * Form store keeps the layout + record data needed to display a record on a form.
 * This needs to be extended to support add/edit form types
 */
let FormStore = Fluxxor.createStore({

    initialize: function() {
        this.formData = {};
        this.formLoading = false;
        this.errorStatus = null;

        this.bindActions(
            actions.LOAD_FORM_AND_RECORD, this.onLoadFormAndRecord,
            actions.LOAD_FORM_AND_RECORD_SUCCESS, this.onLoadFormAndRecordSuccess,
            actions.LOAD_FORM_AND_RECORD_FAILED, this.onLoadFormAndRecordFailed
        );

        this.logger = new Logger();
    },
    onLoadFormAndRecord: function() {
        this.formLoading = true;
        this.errorStatus = null;
        this.emit("change");
    },
    onLoadFormAndRecordFailed: function(errorStatus) {
        this.formLoading = false;
        this.formData = {};
        this.errorStatus = errorStatus;
        this.emit("change");
    },
    onLoadFormAndRecordSuccess: function(formData) {
        this.formLoading = false;
        this.formData = formData;
        this.errorStatus = null;
        this.emit('change');
    },
    getState: function() {
        return {
            formData: this.formData,
            formLoading: this.formLoading,
            errorStatus: this.errorStatus
        };
    },
});

export default FormStore;
