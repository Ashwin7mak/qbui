import React, {PropTypes} from 'react';
import Locale from "../../locales/locales";
import {I18nMessage} from '../../utils/i18nMessage';
import Select from '../select/reactSelectWrapper';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

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

        /** Optional prop to pass in placeholder text. Defaults to: 'name@domain.com' (internationalized). */
        placeholder: PropTypes.string
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
            choice,
            dialogOpen: true
        };
    },

    onBlur(updatedValues) {
        // Format the displayed url before passing up to the parent
        //updatedValues.display = UrlFileAttachmentReportLinkFormatter.format(updatedValues, (this.props.fieldDef ? this.props.fieldDef.datatypeAttributes : null));
        //if (this.props.onBlur) {
        //    this.props.onBlur(updatedValues);
        //}
    },


    tableSelected() {

        this.setState({dialogOpen: false});
    },

    cancelTableSelection() {
        this.setState({dialogOpen: false});
    },

    getReactSelect() {
        const placeHolderMessage = Locale.getMessage("selection.placeholder");
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;
        const emptyOptionText = '\u00a0'; //Non breaking space

        let selectedValue = _.get(this, 'state.choice.value');

        let choices = this.props.appTables ?
            this.props.appTables.map(table => {
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
    render() {
        let {value, display, onBlur, placeholder, ...otherProps} = this.props;

        if (this.state.dialogOpen) {
            return (
                <MultiStepDialog show={true}
                                 onCancel={this.cancelTableSelection}
                                 onFinished={this.tableSelected}
                                 finishedButtonLabel="Create connection"
                                 classes={"tableDataConnectionDialog allowOverflow"}
                                 titles={["Create table data connection"]}>
                    <div>
                        <div className="tableChooserHeader">Link to a single record in:</div>

                        {this.getReactSelect()}
                    </div>
                </MultiStepDialog>);
        } else {
            return this.getReactSelect();
        }
    }
});

export default LinkToRecordFieldValueEditor;
