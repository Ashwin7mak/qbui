import React from 'react';
import {PropTypes} from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import Well from 'react-bootstrap/lib/Well';
import {connect} from 'react-redux';
import RecordTitleFieldSelection from '../table/recordTitleFieldSelection';
import {updateField, setRequiredPropForRecordTitleField} from '../../actions/fieldsActions';
import {setStageEditMode} from '../../actions/formActions';
import {getFields} from '../../reducers/fields';
import {updateAppTableProperties} from '../../actions/appActions';
import {I18nMessage} from "../../utils/i18nMessage";
import {Button} from 'react-bootstrap';
import Locale from '../../locales/locales';
import FieldUtils from '../../utils/fieldUtils';
import FieldFormats from '../../utils/fieldFormats';
import Icon, {AVAILABLE_ICON_FONTS} from '../../../../reuse/client/src/components/icon/icon';
import Stage from '../../../../reuse/client/src/components/stage/stage';
import thwartClicksWrapper from '../hoc/thwartClicksWrapper';

import './formBuilderStage.scss';

class FormBuilderStage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            editingStage: false
        };
    }
    toggleStage() {
        this.setState({open: !this.state.open});
    }

    onChangeTitleField(fieldId) {
        this.setState({editingStage: false});
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

    onEditStage() {
        this.setState({editingStage: true});
    }
    closeEditStage() {
        this.setState({editingStage: false});
    }

    render() {
        let titlePicker = null;

        let recordTitleFieldId = _.get(this.props, "table.recordTitleFieldId", '') || '';
        if (this.state.editingStage) {
            let RecordTitleFieldSelectionWrapped = thwartClicksWrapper(RecordTitleFieldSelection);
            titlePicker = <div>
                <RecordTitleFieldSelectionWrapped handleClickOutside={this.closeEditStage.bind(this)}
                                                  outsideClickIgnoreClass="recordTitleFieldSelect"
                                                  onChange={this.onChangeTitleField.bind(this)}
                                                  table={this.props.table}
                                                  selectedValue={recordTitleFieldId}
                                                  recordTitleFieldDescription="tableCreation.recordTitleFieldDescription"/>
            </div>;

        } else {
            let recordTitleFieldLabel = Locale.getMessage("tableCreation.recordTitleFieldDefault", {recordName: this.props.table.tableNoun});
            if (recordTitleFieldId) {
                let recordTitleField = _.find(this.props.fields, field => field.id === recordTitleFieldId);
                recordTitleFieldLabel = <div className="selectedOption"><Icon icon={FieldUtils.getFieldSpecificIcon(FieldFormats.getFormatType(recordTitleField))} /> <span className="selectedOptionLabel">{recordTitleField.name}</span></div>;
            }

            titlePicker = <div onClick={this.onEditStage.bind(this)}>
                <div className="titleField">{recordTitleFieldLabel}</div>
            </div>;
        }

        let tableName = this.props.table ? this.props.table.name : "";
        let headline = <h4 className="formHeader"><Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.table.tableIcon} />
                        <span className="heading">Form for {tableName}</span>
                    </h4>;

        return <Stage stageHeadline={headline} className="formStage" open={this.state.open}>
            <div className="editableStage">
                <div className="recordTitleFieldDescription">
                    <I18nMessage message ="tableCreation.recordTitleFieldHeading"/>
                </div>
                {titlePicker}
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
    setRequiredPropForRecordTitleField,
    setStageEditMode
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderStage);
