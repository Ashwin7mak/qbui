import React from 'react';
import Fluxxor from "fluxxor";
import QBForm from '../QBForm/qbform';
import ValidationUtils from "../../utils/validationUtils";
import * as SchemaConsts from "../../constants/schema";

let FluxMixin = Fluxxor.FluxMixin(React);
let Record = React.createClass({
    mixins: [FluxMixin],
    displayName: 'Record',

    componentDidMount: function() {
        //this.handleEditRecordStart(this.props.recId);
    },
    /**
     * When entering inline edit on a record, if it's an existing (already stored) record keep note
     * its originalRecord values (for later undo/audit?)
     * if it's a new (unsaved) record note all it's non null values as changes to the new record
     * to be saved.
     * Then initiate the recordPendingEditsStart action with the app/table/recId and originalRec if there
     * was one or changes if it's a new record
     * @param recId
     */
    handleEditRecordStart(recId) {
        const flux = this.getFlux();
        let origRec = null;
        let changes = {};
        //if (recId !== SchemaConsts.UNSAVED_RECORD_ID) {
        origRec = this.props.formData.record;
        //} else {
        //    //add each non null value as to the new record as a change
        //    let newRec = _.find(this.props.reportData.data.filteredRecords, (rec) => {
        //        return rec[this.props.uniqueIdentifier].value === recId;
        //    });
        //    if (newRec) {
        //        changes = {};
        //        // loop thru the values in the new rec add any non nulls to change set
        //        // so it will be treated as dirty/not saved
        //        Object.keys(newRec).forEach((key) => {
        //            let field = newRec[key];
        //            if (field.value !== null) {
        //                let change = {
        //                    //the + before field.id is needed turn the field id from string into a number
        //                    oldVal: {value: null, id: +field.id},
        //                    newVal: {value: field.value},
        //                    fieldName: key
        //                };
        //                changes[field.id] = change;
        //            }
        //        });
        //    }
        //}
        flux.actions.recordPendingEditsStart(this.props.appId, this.props.tblId, recId, origRec, changes);
    },

    /**
     * When an inline edit is canceled
     * Initiate a recordPendingEditsCancel action the the app/table/recid
     * @param recId
     */
    handleEditRecordCancel(recId) {
        const flux = this.getFlux();
        flux.actions.recordPendingEditsCancel(this.props.appId, this.props.tblId, recId);
    },

    /**
     * Initiate recordPendingEditsChangeField action to hold the unsaved field value change
     * @param change - {fid:fieldid, values : {oldVal :{}, newVal:{}, fieldName:name}
     */
    handleFieldChange(change) {
        change.recId = this.props.recId;
        // call action to hold the field value change
        const flux = this.getFlux();
        flux.actions.recordPendingEditsChangeField(this.props.appId, this.props.tblId, change.recId, change);
    },

    /**
     * User wants to save changes to a record. First we do client side validation
     * and if validation is successful we initiate the save action for the new or existing record
     * if validation if not ok we stay in edit mode and show the errors (TBD)
     * @param id
     * @returns {boolean}
     */
    handleRecordSaveClicked(id) {
        //validate changed values
        //get pending changes
        let validationResult = this.validateRecord(this.props.pendEdits.recordChanges);
        if (validationResult.ok) {
            //signal record save action, will update an existing records with changed values
            // or add a new record
            let changes = null;
            if (id.value === SchemaConsts.UNSAVED_RECORD_ID) {
                changes = this.handleRecordAdd(this.props.pendEdits.recordChanges);
            } else {
                changes = this.handleRecordChange(id);
            }
        }
        return validationResult;
    },
    /**
     * Save changes to an existing record
     * @param recId
     * @returns {Array}
     */
    handleRecordChange(recId) {
        const flux = this.getFlux();

        // get the current edited data
        let changes = {};
        if (_.has(this.props, 'pendEdits.recordChanges')) {
            changes = _.cloneDeep(this.props.pendEdits.recordChanges);
        }


        //calls action to save the record changes
        // validate happen here or in action

        let payload = [];
        // columns id and new values array
        //[{"id":6, "value":"Claire"}]


        Object.keys(changes).forEach((key) => {
            let newValue = changes[key].newVal.value;
            let newDisplay = changes[key].newVal.display;
            if (_.has(this.props, 'pendEdits.originalRecord.fids')) {
                if (newValue !== this.props.pendEdits.originalRecord.fids[key].value) {
                    //get each columns matching field description
                    if (_.has(this.props, 'fields.fields.data')) {
                        let matchingField = _.find(this.props.fields.fields.data, (field) => {
                            return field.id === +key;
                        });
                        this.createColChange(newValue, newDisplay, matchingField, payload);
                    }
                }
            }
        });

        this.getConstrainedUnchangedValues(changes, payload);
        //for (changes)
        flux.actions.recordPendingEditsCommit(this.props.appId, this.props.tblId, recId.value);
        flux.actions.saveReportRecord(this.props.appId, this.props.tblId, recId.value, payload);
        return payload;
    },

    render() {
        return <QBForm {...this.props} edit={true}
                                       idKey={"qfm-" + this.props.recId}
                                       onEditRecordStart={this.handleEditRecordStart}
                                       onEditRecordCancel={this.handleEditRecordCancel}
                                       onFieldChange={this.handleFieldChange}
                                       onRecordChange={this.handleRecordChange}
                                       onRecordSaveClicked={this.handleRecordSaveClicked}
                                       validateRecord={this.validateRecord}
                                       validateFieldValue={ValidationUtils.checkFieldValue}/>;
    }
});

export default Record;
