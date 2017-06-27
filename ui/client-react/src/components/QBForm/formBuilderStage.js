import React from 'react';
import {PropTypes} from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import {connect} from 'react-redux';
import RecordTitleFieldSelection from '../table/recordTitleFieldSelection';
import {updateField, setRequiredPropForRecordTitleField} from '../../actions/fieldsActions';
import {getFields} from '../../reducers/fields';
import {updateAppTableProperties} from '../../actions/appActions';
import {I18nMessage} from "../../utils/i18nMessage";
import {Button} from 'react-bootstrap';
import Locale from '../../locales/locales';
import FieldUtils from '../../utils/fieldUtils';
import FieldFormats from '../../utils/fieldFormats';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import Stage from '../../../../reuse/client/src/components/stage/stage';

import './formBuilderStage.scss';

class FormBuilderStage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
    }
    toggleStage() {
        this.setState({open: !this.state.open});
    }

    onChangeTitleField(fieldId) {
        //reset the previously selected field's required prop only if a particular prop was set on it
        let previousTitleField = _.find(this.props.fields, field => field.id === this.props.table.recordTitleFieldId);
        if (previousTitleField && previousTitleField.isRequiredForRecordTitleField === true) {
            this.props.setRequiredPropForRecordTitleField(this.props.table.appId, this.props.table.id, previousTitleField.id, false);
        }
        //update the recordTitleFieldId on the table and update field's property as required.
        let newTableInfo = _.clone(this.props.table);
        newTableInfo.recordTitleFieldId = fieldId;
        this.props.updateAppTableProperties(this.props.table.appId, this.props.table.id, newTableInfo);

        let newTitleField = _.find(this.props.fields, field => field.id === fieldId);
        if (newTitleField && !newTitleField.required) {
            this.props.setRequiredPropForRecordTitleField(this.props.table.appId, this.props.table.id, newTitleField.id, true, true);
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
                recordTitleFieldLabel = <span><Icon icon={FieldUtils.getFieldSpecificIcon(FieldFormats.getFormatType(recordTitleField))} /> <span>{recordTitleField.name}</span></span>;
            }

            titlePicker = <div onClick={this.props.onEditStage}>
                <div className="titleField">{recordTitleFieldLabel}</div>
            </div>;
        }

        let tableName = this.props.table ? this.props.table.name : "";
        let headline = <h4 className="formHeader"><Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.table.tableIcon} />
                        <span className="heading">Form for {tableName}</span>
                    </h4>
        //return <div className="formStage">
        //        <h4 className="formHeader"><Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.table.tableIcon} />
        //            <span className="heading">Form for {tableName}</span>
        //        </h4>
        //    <Collapse in={this.state.open}>
        //
        //            <div className="editableStage">
        //                <div className="recordTitleFieldDescription">
        //                    {this.props.editingStage ?
        //                        <I18nMessage message ="tableCreation.recordTitleFieldDescription"/> :
        //                        <I18nMessage message ="tableCreation.recordTitleFieldHeading"/>}
        //                </div>
        //                <div className="pickerSelector">
        //                    {titlePicker}
        //                </div>
        //            </div>
        //
        //    </Collapse>
        //    <button className="toggleStage" onClick={this.toggleStage.bind(this)}><Icon icon={this.state.open ? 'caret-up' : 'caret-down'} /></button>
        //</div>;

        return <Stage stageHeadline={headline} className="formStage">
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
        </Stage>;
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
    setRequiredPropForRecordTitleField
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderStage);
