import * as actions from '../constants/actions';

import Fluxxor from 'fluxxor';
import Logger from '../utils/logger';
var logger = new Logger();


/**
 * FieldStore keeps the list of fields in a table since the sort and group feature (and others later) allow selecting a field that is not in the report for sorting/grouping.
 * So we need to be able to access all the fields for the table. This store provide it.
 */
let FieldsStore = Fluxxor.createStore({

    initialize() {
        this.fields = [];
        this.currentTable = null;
        this.fieldsLoading = false;
        this.error = false;

        this.bindActions(
            actions.LOAD_FIELDS, this.onLoadFields,
            actions.LOAD_FIELDS_SUCCESS, this.onLoadFieldsSuccess,
            actions.LOAD_FIELDS_FAILED, this.onLoadFieldsFailed,
            actions.SELECT_TABLE, this.onSelectTable
        );

        this.logger = new Logger();
    },
    onLoadFields() {
        this.fieldsLoading = true;
        this.emit("change");
    },
    onLoadFieldsFailed() {
        this.fieldsLoading = false;
        this.fields = [];
        this.error = true;
        this.emit("change");
    },
    onLoadFieldsSuccess(fields) {
        this.fieldsLoading = false;
        this.fields = fields;
        this.error = false;
        this.emit('change');
    },
    onSelectTable(tblId) {
        this.currentTable = tblId;
        this.fields = [];
        this.emit('change');
    },
    getKeyField() {
        let answer;
        if (typeof this.fields.data !== 'undefined') {
            answer = this.fields.data.find(field => (field.keyField && field.keyField === true));
        }
        return answer;
    },
    getState() {
        return {
            fields: this.fields,
            keyField: this.getKeyField(),
            currentTable: this.currentTable,
            fieldsLoading: this.fieldsLoading,
            error: this.error
        };
    }
});

export default FieldsStore;
