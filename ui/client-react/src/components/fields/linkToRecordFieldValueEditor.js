import React, {PropTypes} from 'react';
import Locale from "../../locales/locales";
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

    getInitialState() {
        let choice = {
            value: '',
            display: '',
        };
        if (this.props.value || this.props.value === 0) {
            choice.value = this.props.value;
            choice.display = this.props.display;
        }
        return {
            choice
        };
    },

    tableSelected(tableId) {

        this.setState({dialogOpen: false});
    },

    cancelTableSelection() {
        this.setState({dialogOpen: false});
    },

    getReactSelect() {
        const placeHolderMessage = "Select a table";
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;
        const emptyOptionText = '\u00a0'; //Non breaking space

        let selectedValue = _.get(this, 'state.choice.value');

        let choices = this.props.tables ?
            this.props.tables.map(table => {
                return {
                    value: table.id,
                    label: table.name
                };
            }) : [];

        return <Select
            value={selectedValue && {label: selectedValue}}
            /*optionRenderer={this.renderOption}*/
            options={choices}
            onChange={this.selectChoice}
            placeholder={placeHolderMessage}
            noResultsText={notFoundMessage}
            autosize={false}
            clearable={false}
            />;
    },

    tableSelected(tableId) {
        this.setState({showTableSelectionDialog: false});
        // persist
    },

    cancelTableSelection() {

        this.setState({showTableSelectionDialog: false});
        // remove field...
    },

    render() {
        let {value, display, onBlur, placeholder, ...otherProps} = this.props;

        if (this.props.dialogOpen) {
            return (
                <LinkToRecordTableSelectionDialog show={this.state.showTableSelectionDialog}
                                                  tables={this.props.tables}
                                                  tableSelected={this.tableSelected}
                                                  onCancel={this.cancelTableSelection}/> );
        } else {
            return this.getReactSelect();
        }
    }
});

export default connect(state => ({dialogOpen: state.animation.isRelationshipDialogShown}))(LinkToRecordFieldValueEditor)
