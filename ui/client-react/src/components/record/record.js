import React from 'react';
import Fluxxor from "fluxxor";
import QBForm from '../QBForm/qbform';
import Loader  from 'react-loader';
import * as SchemaConsts from "../../constants/schema";

let FluxMixin = Fluxxor.FluxMixin(React);
let Record = React.createClass({
    mixins: [FluxMixin],
    displayName: 'Record',

    componentWillReceiveProps(nextProps) {
        let wasRecordEditOpen = _.has(this.props, 'pendEdits.recordEditOpen') && this.props.pendEdits.recordEditOpen === false;
        let shouldRecordEditOpen = _.has(nextProps, 'pendEdits.recordEditOpen') && !nextProps.pendEdits.recordEditOpen;
        if (wasRecordEditOpen !== shouldRecordEditOpen && _.has(nextProps, 'pendEdits.recordChanges') && _.isEmpty(nextProps.pendEdits.recordChanges)) {
            this.handleEditRecordStart(this.props.recId);
        }
    },
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
        } else if (this.props.formData && !this.props.formData.record) {
            let fields = this.props.formData.formMeta.fields;
            //for the fields on the form
            fields.forEach((fieldId) => {
                // get the fields definition
                let fieldDef = _.find(this.props.formData.fields,
                    (field => fieldId === field.id));
                if (fieldDef && !fieldDef.builtIn) {
                    let value = null;
                    if (fieldDef.defaultValue && fieldDef.defaultValue.coercedValue) {
                        // if there is a default value use that as new record changes
                        value = fieldDef.defaultValue.coercedValue.value;
                    }
                    //add as change the field to the changes set
                    let change = {
                        //the + before field.id is needed turn the field id from string into a number
                        oldVal: {value: undefined, id: +fieldDef.id},
                        newVal: {value: value},
                        fieldName: fieldDef.name, //or get name of field in form ?
                        fieldDef: fieldDef
                    };
                    changes[fieldDef.id] = change;
                }
            });
        } else {
            // we have the records use its values for changes
            let rec = this.props.formData.record;
            for (var key in rec) {
                let field = rec[key];
                let fieldDef = _.find(this.props.formData.fields,
                    (item => item.id === field.id));
                if (fieldDef && !fieldDef.builtIn && field.value !== null) {
                    let change = {
                        //the + before field.id is needed turn the field id from string into a number
                        oldVal: {value: null, id: +field.id},
                        newVal: {value: field.value},
                        fieldName: fieldDef.name, //or get name of field in form ?
                        fieldDef: fieldDef
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
