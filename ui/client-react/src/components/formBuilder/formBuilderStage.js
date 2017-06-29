import React from 'react';
import {PropTypes} from 'react';
import {connect} from 'react-redux';
import RecordTitleFieldSelection from '../table/recordTitleFieldSelection';
import {setRequiredPropForRecordTitleField} from '../../actions/fieldsActions';
import {getFields, getField} from '../../reducers/fields';
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

export class FormBuilderStage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editingStage: false
        };
    }
    /**
     * On selection of a field as title field
     * 1. make the picker uneditable
     * 2. reset the required prop on the previously selected record title field (only if that value was set for the purpose of record title field selection during this form session)
     * 3. set the required prop on the newly selected record title field
     * 4. update the recordTitleFieldId on the table
     * @param fieldId
     */
    onChangeTitleField = (fieldId) => {
        this.setState({editingStage: false});

        let previousTitleField = this.props.recordTitleField;
        if (previousTitleField && previousTitleField.isRequiredForRecordTitleField === true) {
            this.props.setRequiredPropForRecordTitleField(this.props.table.appId, this.props.table.id, previousTitleField.id, false);
        }

        let newTableInfo = _.clone(this.props.table);
        newTableInfo.recordTitleFieldId = fieldId;
        this.props.updateAppTableProperties(this.props.table.appId, this.props.table.id, newTableInfo);

        let newTitleField = _.find(this.props.fields, {id: fieldId});
        if (newTitleField && !newTitleField.required) {
            this.props.setRequiredPropForRecordTitleField(this.props.table.appId, this.props.table.id, newTitleField.id, true, true);
        }
    }

    onEditStage = () => {
        this.setState({editingStage: true});
    }
    closeEditStage = () => {
        this.setState({editingStage: false});
    }

    render() {
        let titlePicker = null;

        let recordTitleField = this.props.recordTitleField;
        if (this.state.editingStage) {
            let RecordTitleFieldSelectionWrapped = thwartClicksWrapper(RecordTitleFieldSelection);
            titlePicker = (
                <div>
                    <RecordTitleFieldSelectionWrapped handleClickOutside={this.closeEditStage}
                                                      outsideClickIgnoreClass="recordTitleFieldSelect"
                                                      onChange={this.onChangeTitleField}
                                                      table={this.props.table}
                                                      selectedValue={recordTitleField ? recordTitleField.id : null}/>
                </div>
            );

        } else {
            let recordTitleFieldLabel = Locale.getMessage("tableCreation.recordTitleFieldDefault", {recordName: this.props.table.tableNoun});
            recordTitleFieldLabel = recordTitleField ? <div className="selectedOption"><Icon icon={FieldUtils.getFieldSpecificIcon(FieldFormats.getFormatType(recordTitleField))} /> <span className="selectedOptionLabel">{recordTitleField.name}</span></div> : recordTitleFieldLabel;


            titlePicker = (
                <div onClick={this.onEditStage}>
                    <div className="titleField">{recordTitleFieldLabel}</div>
                </div>
            );
        }

        let headline = (
                <h4 className="formHeader"><Icon iconFont={AVAILABLE_ICON_FONTS.TABLE_STURDY} icon={this.props.table.tableIcon} />
                    <I18nMessage message ="builder.formBuilder.stage.title" tableName={this.props.table.name}/>
                </h4>
            );

        return (
            <Stage stageHeadline={headline} className="formStage" open={true}>
                <div className="editableStage">
                    <div className="recordTitleFieldDescription">
                        <I18nMessage message ="tableCreation.recordTitleFieldHeading"/>
                    </div>
                    {titlePicker}
                </div>
            </Stage>
        );
    }

}

FormBuilderStage.propTypes = {
    table: PropTypes.object.isRequired,
    fields: PropTypes.object,
    recordTitleField: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
    let recordTitleFieldId = _.get(ownProps, "table.recordTitleFieldId", '');
    return {
        fields: getFields(state, ownProps.table.appId, ownProps.table.id),
        recordTitleField: recordTitleFieldId ? getField(state, recordTitleFieldId, ownProps.table.appId, ownProps.table.id) : null
    };
};

const mapDispatchToProps = {
    updateAppTableProperties,
    setRequiredPropForRecordTitleField
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormBuilderStage);
