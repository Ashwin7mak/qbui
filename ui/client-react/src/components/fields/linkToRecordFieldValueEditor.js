import React, {PropTypes} from 'react';
import Locale from "../../locales/locales";
import {CONTEXT} from "../../actions/context";
import {showRelationshipDialog, removeFieldFromForm} from '../../actions/formActions';
import {updateField} from '../../actions/fieldsActions';
import Select from '../select/reactSelectWrapper';
import {connect} from 'react-redux';
import LinkToRecordTableSelectionDialog from './linkToRecordTableSelectionDialog';

/**
 * # LinkToRecordFieldValueEditor
 *
 * A placeholder for link to record fields
 *
 */
const LinkToRecordFieldValueEditor = React.createClass({
    displayName: 'LinkToRecordFieldValueEditor',
    propTypes: {
        showRelationshipDialog: PropTypes.func,
        readyToShowRelationshipDialog: PropTypes.bool,
        updateField: PropTypes.func,
        removeFieldFromForm: PropTypes.func,
        tblId: PropTypes.string,
        tables: PropTypes.array,
        location: PropTypes.object,
        formId: PropTypes.string,
    },

    getDefaultProps() {
        return {
            formId: CONTEXT.FORM.VIEW
        };
    },

    getInitialState() {
        return {
            dialogWasClosed: false // once closed, don't reopen
        };
    },

    /**
     * get simple builder mode react-select component
     * @returns {XML}
     */
    getReactSelect() {
        const placeHolderMessage = Locale.getMessage("selection.placeholder");

        return <Select placeholder={placeHolderMessage}/>;
    },

    /**
     * parent table selected
     * @param tableId
     */
    tableSelected(tableId) {
        this.setState({dialogWasClosed: true});

        this.props.showRelationshipDialog(false);

        const parentTable = _.find(this.props.tables, {id: tableId});

        // update the field with the parent table ID and a name incorporating the selected table
        const field = this.props.fieldDef;
        field.parentTableId = tableId;
        field.name = Locale.getMessage('fieldsDefaultLabels.LINK_TO_RECORD_FROM', {parentTable: parentTable.name});

        this.props.updateField(field, this.props.appId, this.props.tblId);
    },

    /**
     * parent table dialog cancelled, remove the field
     * @returns {{id, type, content}|*|*}
     */
    cancelTableSelection() {

        this.props.showRelationshipDialog(false);
        return this.props.removeFieldFromForm(this.props.formId, this.props.location);
    },

    /**
     *
     * @returns {*}
     */
    render() {

        if (this.props.readyToShowRelationshipDialog && !this.state.dialogWasClosed) {
            return (
                <LinkToRecordTableSelectionDialog show={true}
                                                  childTableId={this.props.tblId}
                                                  tables={this.props.tables}
                                                  tableSelected={this.tableSelected}
                                                  onCancel={this.cancelTableSelection}/>);
        } else {
            return this.getReactSelect();
        }
    }
});

const mapStateToProps = (state) => {
    return {
        readyToShowRelationshipDialog: state.forms.readyToShowRelationshipDialog
    };
};


export default connect(mapStateToProps, {showRelationshipDialog, removeFieldFromForm, updateField})(LinkToRecordFieldValueEditor);
