import React from 'react';
import {PropTypes} from 'react';
import Select from 'react-select';
import {I18nMessage} from "../../utils/i18nMessage";
import Locale from '../../locales/locales';
import FieldUtils from '../../utils/fieldUtils';
import FieldFormats from '../../utils/fieldFormats';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon.js';
import {DEFAULT_RECORD_KEY_ID} from '../../constants/schema';

import './recordTitleFieldSelection.scss';

/**
 * table properties section for choosing a record title field
 */
class RecordTitleFieldSelection extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * callback with new field
     * @param field
     */
    selectField = field =>  {
        this.props.onChange(field.value || null); // update with field ID (map to null if empty string value was selected)
    };

    getOption(option) {
        return <div className="pickerOption"><Icon icon={FieldUtils.getFieldSpecificIcon(FieldFormats.getFormatType({datatypeAttributes: {type: option.type}}))} /> <span className="pickerOptionLabel">{option.label}</span></div>;
    }
    getValue(option) {
        return <div className="selectedOption"><Icon icon={FieldUtils.getFieldSpecificIcon(FieldFormats.getFormatType({datatypeAttributes: {type: option.type}}))} /> <span className="selectedOptionLabel">{option.label}</span></div>;
    }
    /**
     * get react-select component
     * @returns {XML}
     */
    getSelect() {

        let tableNoun = _.get(this.props, "table.tableNoun", "");

        if (tableNoun.trim() === "") {
            tableNoun = Locale.getMessage("tableCreation.recordName"); // if empty, use a default string
        }

        const defaultName = Locale.getMessage("tableCreation.recordTitleFieldDefault", {recordName: tableNoun});
        const defaultChoice = {id:'', name:defaultName}; // default choice at bottom of select

        let tableFields = _.get(this.props, "table.fields", []);

        // ignore built-in fields except for record ID
        tableFields = _.reject(tableFields, field => field.type !== "SCALAR" || (field.builtIn && field.id !== DEFAULT_RECORD_KEY_ID));
        const choices = [...tableFields, defaultChoice].map(field => {
            return {
                value: field.id,
                label: field.name,
                type: field.datatypeAttributes ? field.datatypeAttributes.type : null
            };
        });

        return <Select className="recordTitleFieldSelect"
                       value={this.props.selectedValue || ""}
                       options={choices}
                       optionRenderer={this.getOption}
                       valueRenderer={this.getValue}
                       onChange={this.selectField}
                       autosize={false}
                       clearable={false} />;
    }

    render() {
        return (
            <div className="recordTitleFieldSection">
                <div className="recordTitleFieldSelection">{this.getSelect()}</div>
            </div>);
    }

}

RecordTitleFieldSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    table: PropTypes.object.isRequired,
    selectedValue: PropTypes.string

};

export default RecordTitleFieldSelection;
