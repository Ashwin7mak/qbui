import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();

/**
 * Form store keeps the layout + record data needed to display a record on a form.
 * This needs to be extended to support add/edit form types
 */
let FormStore = Fluxxor.createStore({

    initialize() {
        this.formData = {};
        this.formLoading = false;
        this.errorStatus = null;

        this.editFormData = {};
        this.editFormLoading = false;
        this.editFormErrorStatus = null;

        this.bindActions(
            actions.LOAD_FORM_AND_RECORD, this.onLoadForm,
            actions.LOAD_FORM_AND_RECORD_SUCCESS, this.onLoadFormSuccess,
            actions.LOAD_FORM_AND_RECORD_FAILED, this.onLoadFormFailed,

            actions.LOAD_EDIT_FORM, this.onLoadEditForm,
            actions.LOAD_EDIT_FORM_SUCCESS, this.onLoadEditFormSuccess,
            actions.LOAD_EDIT_FORM_FAILED, this.onLoadEditFormFailed,

            actions.LOAD_EDIT_FORM_AND_RECORD, this.onLoadEditForm,
            actions.LOAD_EDIT_FORM_AND_RECORD_SUCCESS, this.onLoadEditFormSuccess,
            actions.LOAD_EDIT_FORM_AND_RECORD_FAILED, this.onLoadEditFormFailed
        );

        this.logger = new Logger();
    },
    onLoadForm() {
        this.formLoading = true;
        this.errorStatus = null;
        this.emit("change");
    },
    onLoadFormFailed(errorStatus) {
        this.formLoading = false;
        this.formData = {};
        this.errorStatus = errorStatus;
        this.emit("change");
    },
    onLoadFormSuccess(formData) {
        this.formLoading = false;
        this.formData = formData;
        this.errorStatus = null;
        this.emit('change');
    },
    onLoadEditForm() {
        this.editFormLoading = true;
        this.editFormErrorStatus = null;
        this.emit("change");
    },
    onLoadEditFormFailed(errorStatus) {
        this.editFormLoading = false;
        this.editFormData = {};
        this.editFormErrorStatus = errorStatus;
        this.emit("change");
    },
    onLoadEditFormSuccess(formData) {
        this.editFormLoading = false;
        this.editFormData = formData;
        this.editFormErrorStatus = null;
        this.emit('change');
    },
    getState() {
        return {
            formData: this.formData,
            formLoading: this.formLoading,
            errorStatus: this.errorStatus,

            editFormData: this.editFormData,
            editFormLoading: this.editFormLoading,
            editFormErrorStatus: this.editFormErrorStatus,
        };
    },
});

export default FormStore;
