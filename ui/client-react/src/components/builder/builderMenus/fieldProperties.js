import React, {PropTypes, Component} from "react";
import {connect} from 'react-redux';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
import MultiLinTextFieldValueEditor from '../../fields/multiLineTextFieldValueEditor';
import FieldFormats from '../../../utils/fieldFormats';
import Locale from '../../../../../reuse/client/src/locales/locale';
import {updateField} from '../../../actions/fieldsActions';
import {getSelectedFormElement} from '../../../reducers/forms';
import {getField} from '../../../reducers/fields';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';

import './fieldProperties.scss';

const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || 'view');
    let formElement = getSelectedFormElement(state, formId);

    return {
        selectedField: (_.has(formElement, 'FormFieldElement') ? getField(state, formElement.FormFieldElement.fieldId, ownProps.appId, ownProps.tableId) : undefined),
        fields: state.fields
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateField: (field, appId, tableId) => {
            dispatch(updateField(field, appId, tableId));
        }
    };
};

export class FieldProperties extends Component {
    constructor(props) {
        super(props);

        this.createPropertiesTitle = this.createPropertiesTitle.bind(this);
        this.createTextPropertyContainer = this.createTextPropertyContainer.bind(this);
        this.createCheckBoxPropertyContainer = this.createCheckBoxPropertyContainer.bind(this);
        this.createMultiChoiceTextPropertyContainer = this.createMultiChoiceTextPropertyContainer.bind(this);
        this.createNameProperty = this.createNameProperty.bind(this);
        this.createRequiredProperty = this.createRequiredProperty.bind(this);
        this.findFieldProperties = this.findFieldProperties.bind(this);
        this.updateFieldProps = this.updateFieldProps.bind(this);
        this.updateMultiChoiceFieldProps = this.updateMultiChoiceFieldProps.bind(this);
        this.buildMultiChoiceDisplayList = this.buildMultiChoiceDisplayList.bind(this);
    }

    /**
     * Creates the headline at the top of the right panel saying the field name and the text properties after it
     * @param fieldName
     * @returns {XML}
     */
    createPropertiesTitle(fieldName) {
        return (
            <div className="fieldPropertiesTitle">{fieldName} {Locale.getMessage('fieldPropertyLabels.title')}</div>
        );
    }

    /**
     * Generic method for any text field property that needs to be rendered
     * Using a textfieldvalueeditor to keep it green and it has handy props
     * @param propertyTitle
     * @param propertyValue
     * @returns {XML}
     */
    createTextPropertyContainer(propertyTitle, propertyValue) {
        return (
            <div className="fieldPropertyContainer">
                <div className="textPropertyTitle">{propertyTitle}</div>
                <TextFieldValueEditor value={propertyValue}
                                      classes="textPropertyValue"
                                      inputType="text"
                                      onChange={(newValue) => this.updateFieldProps(newValue, 'name')}
                />
            </div>
        );
    }

    /**
     * Generic method for any boolean field property that needs to be rendered
     * Using a checkboxfieldvalueeditor to keep it green and the awesome label/onChange built in support
     * @param propertyTitle
     * @param propertyValue
     * @returns {XML}
     */
    createCheckBoxPropertyContainer(propertyTitle, propertyValue) {
        return (
            <div className="checkboxPropertyContainer">
                <CheckBoxFieldValueEditor value={propertyValue}
                                          label={propertyTitle}
                                          onChange={(newValue) => this.updateFieldProps(newValue, 'required')}
                />
            </div>
        );
    }

    /**
     * Generic method for any multichoice field property that needs to be rendered
     * Using a MultiLinTextFieldValueEditor to keep it green and textarea built in support
     * @param propertyTitle
     * @param propertyValue
     * @returns {XML}
     */
    createMultiChoiceTextPropertyContainer(propertyTitle, propertyValue) {
        return (
            <div className="fieldPropertyContainer">
                <div className="textPropertyTitle">{propertyTitle}</div>
                <MultiLinTextFieldValueEditor value={propertyValue}
                                              onChange={(newValue) => this.updateMultiChoiceFieldProps(newValue)}
                />
            </div>
        );
    }

    /**
     * takes the array of choices objects and creates a string separated by newline characters to display each
     * option on a separate line in the textarea
     * @param choices
     * @returns empty string OR string with each choice newline separated
     */
    buildMultiChoiceDisplayList(choices) {
        let list = "";
        if (choices.length > 0) {
            let choiceArr = choices.map(function(choice) {return choice.displayValue;});
            list = choiceArr.join("\n");
        }
        return list;
    }

    /**
     * hard coded name property creation since we know EVERY field type has a name
     * this could be refactored out if the next iteration wants to go super generic
     * @param name
     * @returns {XML}
     */
    createNameProperty(name) {
        return (this.createTextPropertyContainer(Locale.getMessage('fieldPropertyLabels.name'), name));
    }

    /**
     * hard coded required property creation since we know EVERY field type has a required property
     * this could be refactored out if the next iteration wants to go super generic
     * @param required
     * @returns {XML}
     */
    createRequiredProperty(required) {
        return (this.createCheckBoxPropertyContainer(Locale.getMessage('fieldPropertyLabels.required'), required));
    }

    /**
     *
     */
    findFieldProperties() {
        if (FieldFormats.getFormatType(this.props.selectedField === (FieldFormats.TEXT_FORMAT_MULTICHOICE || FieldFormats.NUMBER_FORMAT_MULTICHOICE))) {
            let choices = this.buildMultiChoiceDisplayList(this.props.selectedField.multipleChoice.choices);
            return (this.createMultiChoiceTextPropertyContainer(Locale.getMessage('fieldPropertyLabels.multiChoice'), choices));
        }
        return null;
    }

    /**
     * takes the new property value and the name of the property we need to set
     * updates that value in the field object and then calls fieldAction to dispatch to reducer store
     * @param newValue
     * @param propertyName
     */
    updateFieldProps(newValue, propertyName) {
        let field = this.props.selectedField;
        field[propertyName] = newValue;
        this.props.updateField(field, this.props.appId, this.props.tableId);
    }

    /**
     * takes the new multichoice list value and creates the choices array for the field object
     * updates that value in the field object and then calls fieldAction to dispatch to reducer store
     * @param newValues
     */
    updateMultiChoiceFieldProps(newValues) {
        let field = this.props.selectedField;
        let choices = newValues.split("\n");
        let newChoices = [];
        choices.forEach(function(curChoice) {
            let coerced = FieldFormats.getFormatType(field) === FieldFormats.TEXT_FORMAT_MULTICHOICE ? curChoice : Number(curChoice);
            newChoices.push({coercedValue: {value: coerced}, displayValue: curChoice});
        });
        field.multipleChoice.choices = newChoices;
        this.props.updateField(field, this.props.appId, this.props.tableId);
    }

    render() {
        //only show something if we have selected a field
        return (
            <SideTrowser pullRight={true} sideMenuContent={
                <div className="fieldPropertiesContainer">
                    {this.props.selectedField && this.createPropertiesTitle(this.props.selectedField.name)}
                    {this.props.selectedField && this.createNameProperty(this.props.selectedField.name)}
                    {this.props.selectedField && this.createRequiredProperty(this.props.selectedField.required)}
                    {this.props.selectedField && this.findFieldProperties()}
                </div>
            }>
                {this.props.children}
            </SideTrowser>
        );
    }
}

FieldProperties.propTypes = {
    selectedField: PropTypes.object,
    appId: PropTypes.string,
    tableId: PropTypes.string,
    formId: PropTypes.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldProperties);
