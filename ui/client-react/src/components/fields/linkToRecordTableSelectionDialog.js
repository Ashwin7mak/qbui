import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from "../../locales/locales";
import Select from '../select/reactSelectWrapper';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import _ from 'lodash';
import './linkToRecordTableSelectionDialog.scss';

const LinkToRecordTableSelectionDialog = React.createClass({
    displayName: 'LinkToRecordTableSelectionDialog',
    propTypes: {
        show: PropTypes.bool,
        tables: PropTypes.array,
        childTableId: PropTypes.string,
        tableSelected: PropTypes.func
    },

    /**
     * render a table name with an icon
     * @param option
     * @returns {XML}
     */
    renderOption(option) {

        return (<div className="tableOption">
                <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={option.icon}/>
                <div className="tableLabel">{option.label}</div>
            </div>);
    },

    /**
     * select a table
     * @param choice
     */
    selectChoice(choice) {
        this.setState({selectedValue: choice});
    },

    getInitialState() {
        return {selectedValue: null};
    },

    /**
     * get react-select containing possible parent tables with icons
     * @returns {XML}
     */
    getReactSelect() {
        const placeHolderMessage = Locale.getMessage("selection.tablesPlaceholder");
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;
        let selectedValue = _.get(this, 'state.selectedValue');

        let tableChoices = _.reject(this.props.tables, (table) => table.id === this.props.childTableId || !table.recordTitleFieldId);
        let choices = tableChoices.map(table => {
            return {
                value: table.id,
                icon: table.tableIcon,
                label: table.name
            };
        });

        return <Select
            className="tableSelector"
            value={selectedValue}
            optionRenderer={this.renderOption}
            options={choices}
            onChange={this.selectChoice}
            placeholder={placeHolderMessage}
            noResultsText={notFoundMessage}
            autosize={false}
            clearable={false}
        />;
    },

    /**
     * parent table was chosen
     */
    addToForm() {
        this.props.tableSelected(this.state.selectedValue.value);
    },

    render() {

        const table = _.find(this.props.tables, {id: this.props.childTableId});
        const tableChooserDescription = Locale.getMessage("builder.linkToRecord.tableChooserDescription", {tableNoun: table.tableNoun});
        return (
            <MultiStepDialog show={this.props.show}
                             canProceed={this.state.selectedValue !== null}
                             onCancel={this.props.onCancel}
                             onFinished={this.addToForm}
                             finishedButtonLabel={Locale.getMessage("builder.linkToRecord.addToForm")}
                             classes={"tableDataConnectionDialog allowOverflow"}
                             titles={[Locale.getMessage("builder.linkToRecord.dialogTitle")]}>
                <div>
                    <div className="tableChooserDescription">{tableChooserDescription}</div>

                    <div className="tableChooserHeading"><I18nMessage message="builder.linkToRecord.tableChooserHeading"/></div>
                    {this.getReactSelect()}
                </div>
            </MultiStepDialog>);
    }

});

export default LinkToRecordTableSelectionDialog;
