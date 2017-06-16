import React from 'react';
import {PropTypes} from 'react';
import Select from 'react-select';
import {I18nMessage} from "../../utils/i18nMessage";
import Locale from '../../locales/locales';
import {DEFAULT_RECORD_KEY_ID} from '../../constants/schema';

import './recordTitleFieldSelection.scss';

class RecordTitleFieldSelection extends React.Component {

    constructor(props) {
        super(props);
    }

    selectField = field =>  {
        this.props.onChange(field.value || null);
    };

    getSelect() {

        let tableNoun = _.get(this.props, "tableInfo.tableNoun.value", "");

        if (tableNoun.trim() === "") {
            tableNoun = Locale.getMessage("tableCreation.recordName");
        }

        const defaultName = Locale.getMessage("tableCreation.recordTitleFieldDefault", {recordName: tableNoun});
        const defaultChoice = {id:'', name:defaultName};
        let tableFields = _.get(this.props, "tableInfo.fields.value", []);

        tableFields = _.reject(tableFields, field => field.type !== "SCALAR" || (field.builtIn && field.id !== DEFAULT_RECORD_KEY_ID));
        const choices = [...tableFields, defaultChoice].map(field => {
            return {
                value: field.id,
                label: field.name
            };
        });

        const selectedValue = _.get(this.props, "tableInfo.recordTitleFieldId.value", '') || '';
        return <Select className="recordTitleFieldSelect"
                       value={selectedValue}
                       options={choices}
                       onChange={this.selectField}
                       autosize={false}
                       clearable={false} />;
    }

    render() {
        return (
            <div className="recordTitleFieldSection">
                <h4><I18nMessage message ="tableCreation.recordTitleFieldHeading"/></h4>
                <div className="recordTitleFieldDescription"><I18nMessage message ="tableCreation.recordTitleFieldDescription"/>
                </div>
                <div className="recordTitleFieldSelection">{this.getSelect()}</div>
            </div>);
    }

}

RecordTitleFieldSelection.propTypes = {
    onChange: PropTypes.func.isRequired,
    tableInfo: PropTypes.object.isRequired,

};

export default RecordTitleFieldSelection;
