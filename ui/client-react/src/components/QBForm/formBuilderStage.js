import React from 'react';
import {PropTypes} from 'react';
import {connect} from 'react-redux';
import RecordTitleFieldSelection from '../table/recordTitleFieldSelection';
import {updateField, setRequiredForRecordTitleSelection} from '../../actions/fieldsActions';
import {getFields} from '../../reducers/fields';
import {updateAppTableProperties} from '../../actions/appActions';
import {I18nMessage} from "../../utils/i18nMessage";
import {Button} from 'react-bootstrap';
import Locale from '../../locales/locales';

import './formBuilderStage.scss';
/**
 * table properties section for choosing a record title field
 */
class FormBuilderStage extends React.Component {

    constructor(props) {
        super(props);
    }

    onChangeTitleField(fieldId) {
        //reset the previously selected field's required prop only if a particular prop was set on it
        let previousTitleField = _.find(this.props.fields, field => field.id === this.props.table.recordTitleFieldId);
        if (previousTitleField && previousTitleField.isRequiredForRecordTitleField === true) {
            this.props.updateField(previousTitleField, this.props.table.appId, this.props.table.id, "required", false);
            this.props.setRequiredForRecordTitleSelection(this.props.table.appId, this.props.table.id, previousTitleField.id, false);
        }
        //update the recordTitleFieldId on the table and update field's property as required.
        let newTableInfo = _.clone(this.props.table);
        newTableInfo.recordTitleFieldId = fieldId;
        this.props.updateAppTableProperties(this.props.table.appId, this.props.table.id, newTableInfo);

        let newTitleField = _.find(this.props.fields, field => field.id === fieldId);
        if (newTitleField && !newTitleField.required) {
            this.props.updateField(newTitleField, this.props.table.appId, this.props.table.id, "required", true);
            this.props.setRequiredForRecordTitleSelection(this.props.table.appId, this.props.table.id, newTitleField.id, true);
        }
    }

    render() {
        let titlePicker = null;

        let recordTitleFieldId = _.get(this.props, "table.recordTitleFieldId", '') || '';
        if (this.props.editingStage) {
            titlePicker = <div>
                <RecordTitleFieldSelection onChange={this.onChangeTitleField.bind(this)} table={this.props.table} selectedValue={recordTitleFieldId} recordTitleFieldDescription="tableCreation.recordTitleFieldDescription"/>
            </div>;
        } else {
            let recordTitleFieldLabel = Locale.getMessage("tableCreation.recordTitleFieldDefault", {recordName: this.props.table.tableNoun});
            if (recordTitleFieldId) {
                let recordTitleField = _.find(this.props.fields, field => field.id === recordTitleFieldId);
                recordTitleFieldLabel = recordTitleField ? recordTitleField.name : "";
            }

            titlePicker = <div onClick={this.props.onEditStage}>
                <span className="titleField">{recordTitleFieldLabel}</span>
            </div>;
        }

        let tableName = this.props.table ? this.props.table.name : "";
        return <div className="formStage">
                <h4>Form for {tableName}</h4>
                <div className="editableStage">
                    <div className="recordTitleFieldDescription">
                        {this.props.editingStage ?
                            <I18nMessage message ="tableCreation.recordTitleFieldDescription"/> :
                            <I18nMessage message ="tableCreation.recordTitleFieldHeading"/>}
                    </div>
                    <div className="pickerSelector">
                        {titlePicker}
                    </div>
                </div>
            </div>;
    }

}

FormBuilderStage.propTypes = {
    table: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        fields: getFields(state, ownProps.table.appId, ownProps.table.id)
    };
};

const mapDispatchToProps = {
    updateField,
    updateAppTableProperties,
    setRequiredForRecordTitleSelection
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderStage);
