import React from 'react';
import Fluxxor from "fluxxor";
import QBForm from '../QBForm/qbform';
import Loader  from 'react-loader';
import * as SchemaConsts from "../../constants/schema";

let FluxMixin = Fluxxor.FluxMixin(React);
let Record = React.createClass({
    mixins: [FluxMixin],
    displayName: 'Record',

    /**
     * Get the record as {fids, names}
     * fids is a fid lookup hash looks like {6: {id:6, value: <val>, display: <display>}}
     * names is not populated. Its here to keep in sync with the data structure used by grid for similar calls.
     * @returns {*}
     */
    getOrigRec() {
        let orig = {names:{}, fids:{}};
        let rec = this.props.formData.record;
        for (var key in rec) {
            let field = rec[key];
            orig.fids[field.id] = field;
        }
        return _.cloneDeep(orig);
    },
    /**
     * When user starts editing a record (this is marked by first field change), if it's an existing (already stored) record keep note
     * its originalRecord values (for later undo/audit?)
     * if it's a new (unsaved) record note all it's non null values as changes to the new record
     * to be saved.
     * Then initiate the recordPendingEditsStart action with the app/table/recId and originalRec if there
     * was one or changes if it's a new record
     * @param recId
     */
    handleEditRecordStart() {
        const flux = this.getFlux();
        let origRec = null;
        let changes = {};
        if (this.props.recId) {
            origRec = this.getOrigRec();
        } else {
            let rec = this.props.formData.record;
            for (var key in rec) {
                let field = rec[key];
                if (field.value !== null) {
                    let change = {
                        //the + before field.id is needed turn the field id from string into a number
                        oldVal: {value: null, id: +field.id},
                        newVal: {value: field.value}
                    };
                    changes[field.id] = change;
                }
            }
        }
        flux.actions.recordPendingEditsStart(this.props.appId, this.props.tblId, this.props.recId, origRec, changes);
    },


    /**
     * Initiate recordPendingEditsChangeField action to hold the unsaved field value change
     * @param change - {fid:fieldid, values : {oldVal :{}, newVal:{}, fieldName:name}
     */
    handleFieldChange(change) {
        // the first time field change is called recordChanges should be empty. at this time save the original records values to diff later with new values
        if (_.has(this.props, 'pendEdits.recordChanges') && _.isEmpty(this.props.pendEdits.recordChanges)) {
            this.handleEditRecordStart(this.props.recId);
        }
        change.recId = this.props.recId;
        // call action to hold the field value change
        const flux = this.getFlux();
        flux.actions.recordPendingEditsChangeField(this.props.appId, this.props.tblId, this.props.recId, change);
    },


    render() {

        return <QBForm {...this.props}
                    key={"qbf-" + this.props.recId}
                    idKey={"qbf-" + this.props.recId}
                    onFieldChange={this.handleFieldChange}/>;
    }
});

export default Record;
