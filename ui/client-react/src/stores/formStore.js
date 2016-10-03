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
            actions.LOAD_FORM_AND_RECORD, this.onLoadForm,
            actions.LOAD_FORM_AND_RECORD_SUCCESS, this.onLoadFormSuccess,
            actions.LOAD_FORM_AND_RECORD_FAILED, this.onLoadFormFailed,

            actions.LOAD_FORM, this.onLoadForm,
            actions.LOAD_FORM_SUCCESS, this.onLoadFormSuccess,
            actions.LOAD_FORM_FAILED, this.onLoadFormFailed
        );

        this.logger = new Logger();
    },
    onLoadForm: function() {
        this.formLoading = true;
        this.errorStatus = null;
        this.emit("change");
    },
    onLoadFormFailed: function(errorStatus) {
        this.formLoading = false;
        this.formData = {};
        this.errorStatus = errorStatus;
        this.emit("change");
    },
    onLoadFormSuccess: function(formData) {
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
