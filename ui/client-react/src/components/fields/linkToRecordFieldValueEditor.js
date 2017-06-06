import React, {PropTypes} from 'react';
import Locale from "../../locales/locales";
import {CONTEXT} from "../../actions/context";
import {hideRelationshipDialog} from '../../actions/relationshipBuilderActions';
import {updateField} from '../../actions/fieldsActions';
import {getDroppedNewFormFieldId} from '../../reducers/relationshipBuilder';
import Select from '../select/reactSelectWrapper';
import {connect} from 'react-redux';
import LinkToRecordTableSelectionDialog from './linkToRecordTableSelectionDialog';
import MultiChoiceFieldValueEditor from './multiChoiceFieldValueEditor';
import RecordService from '../../services/recordService';

/**
 * # LinkToRecordFieldValueEditor
 *
 * A placeholder for link to record fields
 *
 */
export const LinkToRecordFieldValueEditor = React.createClass({
    displayName: 'LinkToRecordFieldValueEditor',
    propTypes: {
        hideRelationshipDialog: PropTypes.func,
        newFormFieldId: PropTypes.string,
        updateField: PropTypes.func,
        removeFieldFromForm: PropTypes.func,
        tblId: PropTypes.string,
        tables: PropTypes.array,
        formId: PropTypes.string,
    },

    getDefaultProps() {
        return {
            formId: CONTEXT.FORM.VIEW
        };
    },
    getInitialState() {
        return {
            choices: []
        };
    },

    /**
     * parent table selected
     * @param tableId
     */
    tableSelected(tableId) {

        this.props.hideRelationshipDialog();

        const parentTable = _.find(this.props.tables, {id: tableId});

        // update the field with the parent table ID and a name incorporating the selected table
        const field = this.props.fieldDef;
        field.parentAppId = parentTable.appId;
        field.parentTableId = tableId;
        field.parentFieldId = parentTable.recordTitleFieldId;

        field.name = Locale.getMessage('fieldsDefaultLabels.LINK_TO_RECORD_FROM', {parentTable: parentTable.name});

        this.props.updateField(field, this.props.appId, this.props.tblId);
    },

    /**
     * parent table dialog cancelled, remove the field
     * @returns {{id, type, content}|*|*}
     */
    cancelTableSelection() {

        this.props.hideRelationshipDialog();
        this.props.removeFieldFromForm();
    },

    getChoices() {
        const recordService = new RecordService();
        const queryParams = {
            columns: [this.props.fieldDef.parentFieldId],
            format: 'display'
        };
        let promise = recordService.getRecords(this.props.fieldDef.parentAppId, this.props.fieldDef.parentTableId, queryParams);
        promise.then((data) => {
            let records = data.data.records;
            let choices = [];
            //the records will always return record Id in addition to the required parentfieldId values so parse these out
            if (Array.isArray(records)) {
                records.map(record => {
                    record.map(field => {
                        if (field.id === this.props.fieldDef.parentFieldId) {
                            choices.push({coercedValue: {value: field.value}, displayValue: field.display});
                        }
                    });
                });
                this.setState({choices});
            }
        }).catch((recordResponseError) => {
            logger.parseAndLogError(LogLevel.ERROR, recordResponseError.response, 'recordService.getRecords:');
        });
    },

    /**
     *
     * @returns {*}
     */
    render() {
        if (this.props.newFormFieldId && this.props.newFormFieldId === this.props.fieldDef.id) {
            return (
                <LinkToRecordTableSelectionDialog show={true}
                                                  childTableId={this.props.tblId}
                                                  tables={this.props.tables}
                                                  tableSelected={this.tableSelected}
                                                  onCancel={this.cancelTableSelection}/>);
        } else {
            return <MultiChoiceFieldValueEditor choices={this.state.choices} onOpen={this.getChoices}
                {...this.props} showAsRadio={false}/>;
        }
    }
});

const mapStateToProps = (state) => {
    return {
        newFormFieldId: getDroppedNewFormFieldId(state),
    };
};


export default connect(mapStateToProps, {hideRelationshipDialog, updateField})(LinkToRecordFieldValueEditor);
