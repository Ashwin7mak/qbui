import React from 'react';

import QBForm from '../QBForm/qbform';
import Loader  from 'react-loader';
import * as SchemaConsts from "../../constants/schema";
import {connect} from 'react-redux';
import {editRecordStart, editRecordChange} from '../../actions/recordActions';
import {UNSAVED_RECORD_ID} from "../../constants/schema";

export const Record = React.createClass({

    displayName: 'Record',

    componentWillReceiveProps(nextProps) {
        let wasRecordEditOpen = _.has(this.props, 'pendEdits.recordEditOpen') && this.props.pendEdits.recordEditOpen === false;
        let shouldRecordEditOpen = _.has(nextProps, 'pendEdits.recordEditOpen') && !nextProps.pendEdits.recordEditOpen;
        if (wasRecordEditOpen !== shouldRecordEditOpen && _.has(nextProps, 'pendEdits.recordChanges') && _.isEmpty(nextProps.pendEdits.recordChanges)) {
            this.handleEditRecordStart(this.props.recId);
        }
    },

    componentDidMount() {
        if (_.has(this.props, 'pendEdits.recordEditOpen') && _.isEmpty(this.props.pendEdits.recordChanges) && this.props.pendEdits.recordEditOpen !== false) {
            this.handleEditRecordStart(this.props.recId);
        }
    },

    /**
     * Get the record as {fids, names}
     * fids is a fid lookup hash looks like {6: {id:6, value: <val>, display: <display>}}
     * names is not populated. Its here to keep in sync with the data structure used by grid for similar calls.
     *
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
     * When user starts editing a record (this is marked by first field change), if it's an existing (already stored)
     * record keep note its originalRecord values (for later undo/audit?).  If it's a new(unsaved) record, note all
     * it's non null values as changes to the new record to be saved.  Then initiate the edit record start action with
     * the app/table/recId and originalRec if there was one or changes if it's a new record.
     *
     * @param recId
     */
    handleEditRecordStart() {
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
        this.props.editRecordStart(this.props.appId, this.props.tblId, this.props.recId, origRec, changes);
    },


    /**
     * Initiate edit record change action to hold the unsaved field value change
     * @param change - {fid:fieldid, values : {oldVal :{}, newVal:{}, fieldName:name}
     */
    handleFieldChange(change) {
        change.recId = this.props.recId || UNSAVED_RECORD_ID;
        let origRec = change.recId ? this.getOrigRec() : null;
        this.props.editRecordChange(this.props.appId, this.props.tblId, change.recId, origRec, change);
    },

    render() {
        return <QBForm {...this.props}
                    key={"qbf-" + this.props.recId}
                    idKey={"qbf-" + this.props.recId}
                    onFieldChange={this.handleFieldChange}
                />;
    }
});

// similarly, abstract out the Redux dispatcher from the presentational component
// (another bit of boilerplate to keep the component free of Redux dependencies)
const mapStateToProps = (state) => {
    return {
        record: state.record
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        editRecordStart: (appId, tblId, recId, origRec, changes, isInlineEdit = false, fieldToStartEditing = null) => {
            dispatch(editRecordStart(appId, tblId, recId, origRec, changes, isInlineEdit, fieldToStartEditing));
        },
        editRecordChange: (appId, tblId, recId, origRec, changes) => {
            dispatch(editRecordChange(appId, tblId, recId, origRec, changes));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Record);
