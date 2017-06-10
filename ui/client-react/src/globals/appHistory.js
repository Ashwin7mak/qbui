import createHistory from "history/createBrowserHistory";
import qhistory from 'qhistory';
import {stringify, parse} from 'query-string';
import {getPendEdits} from '../reducers/record';
import {UNSAVED_RECORD_ID} from '../constants/schema';
import {ShowAppModal, HideAppModal} from '../components/qbModal/appQbModalFunctions';
import WindowUtils from '../utils/windowLocationUtils';
import {CONTEXT} from '../actions/context';
import _ from 'lodash';
// Uses singleton pattern
// Only one instance of this class may be instantiated so that the same history can be used
// throughout the app
// Better than a global variable because a singleton can be scoped and only used when imported
let self = null; // eslint-disable-line

/**
 * This singleton class maintains the current customized browserHistory that includes event listeners
 * for when a route changes. This helps us detect if there are pending edits to a form before redirecting.
 */
class AppHistory {
    constructor() {
        if (!self) {
            // A custom browser history object that can be used by React Router
            this.history = qhistory(createHistory({
                //todo handle outside app location change
                getUserConfirmation(message, callback) {
                    // Show some custom dialog to the user and call
                    // callback(true) to continue the transition, or
                    // callback(false) to abort it.
                    if (self) {
                        self.callback = callback;
                        if (self.getIsPendingEdit()) {
                            self.showPendingEditsConfirmationModal();
                        } else {
                            // cancel any pending pending edits that don't require confirmation, i.e. started inline editing
                            self._discardChanges(false);
                        }
                    } else {
                        return callback(true);
                    }
                }
            }), stringify, parse);

            // get redux stores and call actions
            this.store = null;
            this.editRecordCancel = null;
            this.createRecord = null;
            this.updateRecord = null;
            this.showErrorMsgDialog = null;
            this.updateForm = null;
            this.saveReport = null;
            this.saveFormComplete = null;
            this.hideTrowser = null;
            this.getNavReport = null;
            this.setFieldsPropertiesPendingEditToFalse = null;
            this.setFormBuilderPendingEditToFalse = null;
            this.setReportBuilderPendingEditToFalse = null;

            // Keep track of the event listeners so they can be canceled
            this.cancelListenBefore = null;
            this.cancelListenBeforeUnload = null;

            self = this;
        }

        return self;
    }

    /**
     * Setups the singleton for use with Redux store outside of React.
     * @param redux store
     */
    setup(store, storeFunc) {
        //  redux store
        self.store = store;
        if (storeFunc) {
            self.editRecordCancel = storeFunc.editRecordCancel;
            self.createRecord = storeFunc.createRecord;
            self.updateRecord = storeFunc.updateRecord;
            self.showErrorMsgDialog = storeFunc.showErrorMsgDialog;
            self.updateForm = storeFunc.updateForm;
            self.saveReport = storeFunc.saveReport;
            self.saveFormComplete = storeFunc.saveFormComplete;
            self.hideTrowser = storeFunc.hideTrowser;
            self.getNavReport = storeFunc.getNavReport;
            self.setFieldsPropertiesPendingEditToFalse = storeFunc.setFieldsPropertiesPendingEditToFalse;
            self.setFormBuilderPendingEditToFalse = storeFunc.setFormBuilderPendingEditToFalse;
            self.setReportBuilderPendingEditToFalse = storeFunc.setReportBuilderPendingEditToFalse;
        }

        self._setupHistoryListeners();

        return self;
    }

    /**
     * Clears the AppHistory singleton and event listeners
     */
    reset() {
        if (self && self.cancelListenBefore) {self.cancelListenBefore();}
        if (self && self.cancelListenBeforeUnload) {self.cancelListenBeforeUnload();}
        self = null; // eslint-disable-line
    }

    /**
     * Add the global listeners to route changes
     * @private
     */
    _setupHistoryListeners() {
        // Setup listener for route changes within the app
        self.cancelListenBefore = self.history.block((location, action) => {
            if (self) {
                if (self.getIsPendingEdit()) {
                    return "Ask confirmation"; //this message return is not used just triggers the prompt
                } else {
                    // cancel any pending pending edits that don't require confirmation, i.e. started inline editing
                    self._discardChanges(false);
                }
            }
        });

        // Setup listener for route changes outside of the app (e.g., pasting in a new url)
        WindowUtils.addEventListener("beforeunload", event => {
            if (self && self.getIsPendingEdit()) {
                // No need to internationalize as it will not appear in the modal on evergreen browsers.
                if (event) {
                    event.returnValue = 'Save changes before leaving?';
                }
                return 'Save changes before leaving?';
            }
        });

        self.cancelListenBeforeUnload = () => {
            window.removeEventListener("beforeunload", ()=>{this.noop();});
        };
    }

    /**
     * isPendingEdit checks to see if there are any pending edits in record, fields or forms store
     * @return boolean
     * */
    getIsPendingEdit = () => {
        let hasPendingEdit = false;
        if (self.store) {
            const state = self.store.getState();
            //fetch stores that have pendEdits
            let {recordStore, formsStore, fieldsStore, reportBuilderStore} = self.getStores(state);

            if (formsStore.isPendingEdit || fieldsStore.isPendingEdit || recordStore.isPendingEdit || reportBuilderStore.isPendingEdit) {
                //for form builder
                hasPendingEdit = true;
            }
        }
        return hasPendingEdit;
    };

    getStores(state) {
        let recordStore = (state.record && state.record.records && state.record.recordIdBeingEdited) ? state.record : undefined;

        if (!recordStore) {
            recordStore = {};
        } else {
            recordStore = getPendEdits(recordStore);
        }
        return {
            recordStore: recordStore,
            formsStore: (state.forms && state.forms.view) ? state.forms.view : {},
            fieldsStore: (state.fields && state.fields[0]) ? state.fields[0] : {},
            reportBuilderStore: state.reportBuilder  || {}
        };
    }


    getFieldsFromFormStore() {
        let fields = [];
        if (self.store) {
            const state = self.store.getState();
            //  fetch the 1st form in the store
            //  TODO: revisit to ensure appropriate support for store with multiple forms
            const viewFields = _.get(state, `forms[${CONTEXT.FORM.VIEW}].formData.fields`);
            const editFields = _.get(state, `forms[${CONTEXT.FORM.EDIT}].formData.fields`);
            return viewFields || editFields || fields;
        }
        return fields;
    }

    getFieldsFromReportStore() {
        let fields = [];
        if (self.store) {
            const state = self.store.getState();
            if (Array.isArray(state.report) && state.report.length > 0) {
                if (_.isEmpty(state.report[0]) === false) {
                    const reportState = state.report;
                    const reportStore = self.getNavReport(reportState);
                    if (_.has(reportStore, 'data.fields')) {
                        fields = reportStore.data.fields;
                    }
                }
            }
        }
        return fields;
    }

    /**
     * Displays a modal that asks a user about unsaved changes
     * @param onSave Function that handles if the user wants to save changes and then continue
     * @param onDisard Function that handles if the user wants to discard changes and then continue
     * @param onCancel Function that handles if the user wants to cancel navigation
     */
    showPendingEditsConfirmationModal(onSave, onDiscard, onCancel) {
        ShowAppModal({
            type: 'alert',
            messageI18nKey: 'pendingEditModal.modalBodyMessage',
            primaryButtonI18nKey: 'pendingEditModal.modalSaveButton',
            primaryButtonOnClick: (onSave ? onSave : self._saveChanges),
            middleButtonI18nKey: 'pendingEditModal.modalDoNotSaveButton',
            middleButtonOnClick: (onDiscard ? onDiscard : self._discardChanges),
            leftButtonI18nKey: 'pendingEditModal.modalStayButton',
            leftButtonOnClick: (onCancel ? onCancel : self._haltRouteChange)
        });
    }

    _hideModal() {
        HideAppModal();
    }

    /**
     * Helper method to get fields from the right store.
     * For inline edit on reports get fields from ReportStore
     * Otherwise, get fields from FormStore.
     */
    getFields() {
        let fields = null;
        if (self.store) {
            const state = self.store.getState();
            const {recordStore} = self.getStores(state);

            if (recordStore.isInlineEditOpen) {
                fields = self.getFieldsFromReportStore();
            } else {
                fields = self.getFieldsFromFormStore();
            }
        }
        return fields;
    }

    /**
     * Default save changes for record
     * @param store, recordStore, continueToDestination, haltRouteChange
     */
    _saveChangesForRecord() {
        if (self.store && _.isFunction(self.createRecord) && _.isFunction(self.updateRecord)) {
            const state = self.store.getState();
            const {recordStore} = self.getStores(state);
            const appId = recordStore.currentEditingAppId;
            const tableId = recordStore.currentEditingTableId;
            const recordId = recordStore.currentEditingRecordId;

            let fields = self.getFields(self.store);

            if (recordStore.currentEditingRecordId === UNSAVED_RECORD_ID) {
                let params = {
                    context: CONTEXT.REPORT.NAV,
                    recordChanges: recordStore.recordChanges,
                    fields: fields,
                    colList: [],
                    showNotificationOnSuccess: true,
                    addNewRow: false
                };
                self.store.dispatch(self.createRecord(appId, tableId, params)).then(
                    () => {
                        self._continueToDestination();
                        self.store.dispatch(self.saveFormComplete(CONTEXT.FORM.EDIT));
                        self.store.dispatch(self.hideTrowser());
                    },
                    () => {
                        self._haltRouteChange();
                    }
                );
            } else {
                let params = {
                    context: CONTEXT.REPORT.NAV,
                    pendEdits: recordStore,
                    fields: fields,
                    colList: [],
                    showNotificationOnSuccess: true,
                    addNewRow: false
                };

                self.store.dispatch(self.updateRecord(appId, tableId, recordId, params)).then(
                    () => {
                        self._continueToDestination();
                        self.store.dispatch(self.saveFormComplete(CONTEXT.FORM.EDIT));
                        self.store.dispatch(self.hideTrowser());
                    },
                    () => {
                        self._haltRouteChange();
                    }
                );
            }
            self.store.dispatch(self.showErrorMsgDialog());
        }
    }

    /**
     * Default save changes for form builder
     * @param store, formStore, continueToDestination, haltRouteChange
     */
    _saveChangesForFormBuilder() {
        if (self.store && _.isFunction(self.updateForm)) {
            const state = self.store.getState();
            //fetch stores that have pendEdits
            let {formsStore, fieldsStore} = self.getStores(state);
            let appId;
            let tableId;
            let formType;
            let formMeta;

            if (formsStore && formsStore.formData && formsStore.formData.formMeta) {
                appId = formsStore.formData.formMeta.appId;
                tableId = formsStore.formData.formMeta.tableId;
                formType = formsStore.formData.formType;
                formMeta = formsStore.formData.formMeta;

                self.store.dispatch(self.updateForm(appId, tableId, formType, formMeta)).then(
                    () => {
                        self._continueToDestination();
                        if (fieldsStore.isPendingEdit) {
                            self.setFieldsPropertiesPendingEditToFalse();
                        }
                        if (formsStore.isPendingEdit) {
                            self.setFormBuilderPendingEditToFalse();
                        }
                    }
                );
            }
        }
    }

    /**
     * Default save changes for report builder
     */
    _saveChangesForReportBuilder() {
        if (self.store) {
            const state = self.store.getState();
            //fetch stores that have pendEdits
            let {reportBuilderStore} = self.getStores(state);
            let reportData = (_.find(state.report, {'id': CONTEXT.REPORT.NAV}));
            let {appId, tblId, rptId} = reportData;
            let {name, fids} = reportData.data;
            let reportDef = {
                name,
                fids
            };

            self.store.dispatch(self.saveReport(appId, tblId, rptId, reportDef)).then(
                () => {
                    self._continueToDestination();
                    if (reportBuilderStore.isPendingEdit) {
                        self.setReportBuilderPendingEditToFalse();
                    }
                }
            );
        }
    }

    /*
     * All functions below reference 'self' instead of 'this' because of a context change
     * after being called from the modal
     */
    _saveChanges() {
        self._hideModal();
        if (self.store) {
            const state = self.store.getState();
            let {recordStore, formsStore, fieldsStore, reportBuilderStore} = self.getStores(state);

            if (formsStore.isPendingEdit || fieldsStore.isPendingEdit) {
                self._saveChangesForFormBuilder();
            } else if (recordStore.isPendingEdit) {
                self._saveChangesForRecord();
            } else if (reportBuilderStore.isPendingEdit) {
                self._saveChangesForReportBuilder();
            }
        }
    }

    _discardChangesForReportBuilder() {
        self.store.dispatch(self.setReportBuilderPendingEditToFalse(CONTEXT.REPORT.NAV));
        self._continueToDestination();
    }

    _discardChangesForFormBuilder(fieldsStoreIsPendingEdit, formsStoreIsPendingEdit) {
        if (fieldsStoreIsPendingEdit) {
            self.setFieldsPropertiesPendingEditToFalse();
        }
        if (formsStoreIsPendingEdit) {
            self.setFormBuilderPendingEditToFalse();
        }
        self._continueToDestination();
    }

    _discardChangesForRecord(recordStore) {
        self.store.dispatch(self.editRecordCancel(recordStore.currentEditingAppId, recordStore.currentEditingTableId, recordStore.currentEditingRecordId));
        self.store.dispatch(self.hideTrowser());
        self._continueToDestination();

    }

    _discardChanges(hideModal = true) {
        if (hideModal) {
            self._hideModal();
        }

        if (self.store) {
            //  clean up pending edits in store
            const state = self.store.getState();
            let {recordStore, formsStore, fieldsStore, reportBuilderStore} = self.getStores(state);

            if (recordStore.isPendingEdit) {
                self._discardChangesForRecord(recordStore);
            }

            if (fieldsStore.isPendingEdit || formsStore.isPendingEdit) {
                self._discardChangesForFormBuilder(fieldsStore.isPendingEdit, formsStore.isPendingEdit);
            }

            if (reportBuilderStore.isPendingEdit) {
                self._discardChangesForReportBuilder();
            }
            self._continueToDestination();
        }
    }

    _continueToDestination() {
        if (self.callback) {
            self.callback(true);
        }
    }

    _haltRouteChange() {
        self._hideModal();
        self.callback(false);
    }
}

export default (new AppHistory());
