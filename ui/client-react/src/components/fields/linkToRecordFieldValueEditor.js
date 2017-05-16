import React, {PropTypes} from 'react';
import Locale from "../../locales/locales";
import {CONTEXT} from "../../actions/context";
import {showRelationshipDialog, removeFieldFromForm} from '../../actions/formActions';
import {updateField} from '../../actions/fieldsActions';
import {I18nMessage} from '../../utils/i18nMessage';
import Select from '../select/reactSelectWrapper';
import {connect} from 'react-redux';
import LinkToRecordTableSelectionDialog from './linkToRecordTableSelectionDialog';

import './linkToRecordFieldValueEditor.scss';
/**
 * # LinkToRecordFieldValueEditor
 *
 * A placeholder for link to record fields
 *
 */
const LinkToRecordFieldValueEditor = React.createClass({
    displayName: 'LinkToRecordFieldValueEditor',
    propTypes: {

        value: PropTypes.string,

        onBlur: PropTypes.func,

        /**
         * A boolean to disabled field on form builder
         */
        isDisabled: React.PropTypes.bool,

    },
    getDefaultProps() {
        return {
            value: ''
        };
    },


    getReactSelect() {
        const placeHolderMessage = "Select a table";

        return <Select placeholder={placeHolderMessage}/>;
    },

    tableSelected(tableId) {
        this.props.showRelationshipDialog(false);

        let field = this.props.fieldDef;
        field.parentTableId = tableId;
        this.props.updateField(field, this.props.appId, this.props.tblId);

    },

    cancelTableSelection() {

        this.props.showRelationshipDialog(false);
        return this.props.removeFieldFromForm(this.props.formId, this.props.location);
    },

    render() {
        let {value, display, onBlur, placeholder, ...otherProps} = this.props;

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

LinkToRecordFieldValueEditor.propTypes = {
    location: PropTypes.object,
    formId: PropTypes.string
};

LinkToRecordFieldValueEditor.defaultProps = {
    formId: CONTEXT.FORM.VIEW,
};

const mapStateToProps = (state) => {
    return {
        dialogOpen: state.forms.showRelationshipDialog
    };
};


export default connect(mapStateToProps, {showRelationshipDialog, removeFieldFromForm, updateField})(LinkToRecordFieldValueEditor);
