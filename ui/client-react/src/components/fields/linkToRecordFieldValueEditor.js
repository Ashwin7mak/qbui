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
        updateField: PropTypes.func,
        removeFieldFromForm: PropTypes.func,
        dialogOpen: PropTypes.bool,
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

    /**
     * get simple builder mode react-select component
     * @returns {XML}
     */
    getReactSelect() {
        const placeHolderMessage = Locale.getMessage("selection.tablesPlaceholder");

        return <Select placeholder={placeHolderMessage}/>;
    },

    /**
     * parent table selected
     * @param tableId
     */
    tableSelected(tableId) {
        this.props.showRelationshipDialog(false);

        const field = this.props.fieldDef;
        field.parentTableId = tableId;
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

        if (this.props.dialogOpen) {
            return (
                <LinkToRecordTableSelectionDialog show={this.props.dialogOpen}
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
        dialogOpen: state.forms.showRelationshipDialog
    };
};


export default connect(mapStateToProps, {showRelationshipDialog, removeFieldFromForm, updateField})(LinkToRecordFieldValueEditor);
