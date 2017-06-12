import React, {PropTypes} from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import Locale from "../../locales/locales";
import Select from '../select/reactSelectWrapper';
import MultiStepDialog from '../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import FieldUtils from '../../utils/fieldUtils';
import RelationshipUtils from '../../utils/relationshipUtils';
import FieldFormats from '../../utils/fieldFormats';
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

    getInitialState() {
        return {
            selectedTableId: null,
            selectedFieldId: null,
            advancedSettingsOpen: false};
    },

    /**
     * render a table name with an icon
     * @param option
     * @returns {XML}
     */
    renderTableOption(option) {

        return (<div className="tableOption">
                <Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={option.icon}/>
                <div className="tableLabel">{option.label}</div>
            </div>);
    },

    /**
     * render a table name with an icon
     * @param option
     * @returns {XML}
     */
    renderFieldOption(option) {

        return (
            <div className="fieldOption">
                <div className="fieldIconContainer">
                    <Icon icon={option.icon}/>
                </div>
                <div className="fieldLabel">{option.label}</div>
            </div>);
    },
    /**
     * select a table
     * @param choice
     */
    selectField(field) {
        this.setState({selectedFieldId: field.value});
    },

    /**
     * select a table
     * @param choice
     */
    selectTable(table) {

        if (table.value !== this.state.selectedTableId) {
            const selectedTable = _.find(this.props.tables, {id: table.value});

            this.setState({selectedTableId: table.value});
            if (selectedTable.recordTitleFieldId) {
                this.setState({selectedFieldId: selectedTable.recordTitleFieldId});
            } else {
                // no record title field ID, pick first field (record ID will always be an option)
                const fieldChoices = this.getFieldChoices(selectedTable);
                this.setState({selectedFieldId: fieldChoices[0].id});
            }
        }
    },

    /**
     * get react-select containing possible parent tables with icons
     * @returns {XML}
     */
    getTableSelect() {
        const placeHolderMessage = Locale.getMessage("selection.tablesPlaceholder");
        const notFoundMessage = <I18nMessage message="selection.notFound"/>;

        const tableChoices = _.reject(this.props.tables, table => table.id === this.props.childTableId);
        const choices = tableChoices.map(table => {
            return {
                value: table.id,
                icon: table.tableIcon,
                label: table.name
            };
        });

        return <Select
            className="tableSelector"
            value={this.state.selectedTableId}
            optionRenderer={this.renderTableOption}
            options={choices}
            onChange={this.selectTable}
            placeholder={placeHolderMessage}
            noResultsText={notFoundMessage}
            autosize={false}
            clearable={false}
        />;
    },

    /**
     * get valid parent table fields
     * @param table
     */
    getFieldChoices(table) {
        const fields = table ? table.fields : [];

        return _.filter(fields, field => RelationshipUtils.isValidRelationshipKeyField(field));
    },

    /**
     * get react-select for master table field
     * @returns {XML}
     */
    getFieldSelect() {

        const selectedTable = _.find(this.props.tables, {id: this.state.selectedTableId});

        const fieldChoices =this.getFieldChoices(selectedTable);

        const choices = fieldChoices.map(field => {

            return {
                value: field.id,
                icon: FieldUtils.getFieldSpecificIcon(FieldFormats.getFormatType(field)),
                label: field.name
            };
        });

        return <Select
            className="fieldSelector"
            value={this.state.selectedFieldId}
            optionRenderer={this.renderFieldOption}
            options={choices}
            onChange={this.selectField}
            autosize={false}
            clearable={false}
        />;
    },
    /**
     * parent table was chosen
     */
    addToForm() {
        const selectedTable = _.find(this.props.tables, {id: this.state.selectedTableId});
        const selectedField = _.find(selectedTable.fields, {id: this.state.selectedFieldId});

        this.props.tableSelected(this.state.selectedTableId, selectedField);
    },

    /**
     * show/hide advanced settings (field selection)
     */
    toggleAdvancedSettings() {

        this.setState({advancedSettingsOpen: !this.state.advancedSettingsOpen});
    },

    render() {

        const table = _.find(this.props.tables, {id: this.props.childTableId});
        const selectedTable = _.find(this.props.tables, {id: this.state.selectedTableId});
        const tableChooserDescription = Locale.getMessage("builder.linkToRecord.tableChooserDescription", {tableNoun: table.tableNoun});

        const advancedSettingsClasses = ["advancedSettings"];
        if (this.state.selectedTableId) {
            advancedSettingsClasses.push("advancedSettingsEnabled");
        }

        if (this.state.advancedSettingsOpen) {
            advancedSettingsClasses.push("advancedSettingsInfoEnabled");
        }
        return (
            <MultiStepDialog show={this.props.show}
                             canProceed={this.state.selectedTableId !== null}
                             onCancel={this.props.onCancel}
                             onFinished={this.addToForm}
                             finishedButtonLabel={Locale.getMessage("builder.linkToRecord.addToForm")}
                             classes={"tableDataConnectionDialog allowOverflow"}
                             fixedHeight={false}
                             titles={[Locale.getMessage("builder.linkToRecord.dialogTitle")]}>
                <div>
                    <div className="tableChooserDescription">{tableChooserDescription}</div>

                    <div className="tableChooserHeading"><I18nMessage message="builder.linkToRecord.tableChooserHeading"/></div>
                    {this.getTableSelect()}

                    <div className={advancedSettingsClasses.join(" ")}>
                        <div className="advancedSettingsToggle" >
                            <span className="advancedSettingsToggleClickable" onClick={this.toggleAdvancedSettings}>
                                <Icon icon="caret-down" className="toggleAdvancedIcon"/> <I18nMessage message="builder.linkToRecord.advancedSettingsHeading"/>
                            </span>
                        </div>
                        <div className="advancedSettingsInfo">
                            <div className="advancedSettingsDescription">
                                <I18nMessage message="builder.linkToRecord.fieldChooserDescription" tableName={selectedTable && selectedTable.name}/>
                            </div>

                            {this.getFieldSelect()}
                        </div>
                    </div>
                </div>
            </MultiStepDialog>);
    }
});

export default LinkToRecordTableSelectionDialog;
