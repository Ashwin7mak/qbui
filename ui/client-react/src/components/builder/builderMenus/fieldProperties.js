import React, {PropTypes, Component} from "react";
import {connect} from 'react-redux';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
import MultiLineTextFieldValueEditor from '../../fields/multiLineTextFieldValueEditor';
import FieldFormats from '../../../utils/fieldFormats';
import Locale from '../../../../../reuse/client/src/locales/locale';
import {updateField} from '../../../actions/fieldsActions';
import {getSelectedFormElement} from '../../../reducers/forms';
import {getField} from '../../../reducers/fields';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';
import * as tabIndexConstants from '../../formBuilder/tabindexConstants';

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
    createPropertiesTitle(key) {
        return (
            <div key={key} className="fieldPropertiesTitle">{Locale.getMessage('fieldPropertyLabels.title')}</div>
        );
    }

    /**
     * Generic method for any text field property that needs to be rendered
     * Using a textfieldvalueeditor to keep it green and it has handy props
     * @param propertyTitle
     * @param propertyValue
     * @param key
     * @returns {XML}
     */
    createTextPropertyContainer(propertyTitle, propertyValue, key) {
        return (
            <div key={key} className="textPropertyContainer">
                <div className="textPropertyTitle">{propertyTitle}</div>
                <TextFieldValueEditor value={propertyValue}
                                      tabIndex={tabIndexConstants.FIELD_PROP_TABINDEX}
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
     * @param isDisabled
     * @param key
     * @returns {XML}
     */
    createCheckBoxPropertyContainer(propertyTitle, propertyValue, key, isDisabled = false) {
        return (
            <div key={key} className="checkboxPropertyContainer">
                <CheckBoxFieldValueEditor value={propertyValue}
                                          label={propertyTitle}
                                          isDisabled={isDisabled}
                                          tabIndex={tabIndexConstants.FIELD_PROP_TABINDEX}
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
     * @param key
     * @returns {XML}
     */
    createMultiChoiceTextPropertyContainer(propertyTitle, propertyValue, key) {
        return (
            <div key={key} className="multiChoicePropertyContainer">
                <div className="multiChoicePropertyTitle">{propertyTitle}</div>
                <MultiLineTextFieldValueEditor
                    value={propertyValue}
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
            let choiceArr = choices.map(choice => choice.displayValue);
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
    createNameProperty(name, key) {
        return (this.createTextPropertyContainer(Locale.getMessage('fieldPropertyLabels.name'), name, key));
    }

    /**
     * hard coded required property creation since we know EVERY field type has a required property
     * this could be refactored out if the next iteration wants to go super generic
     * @param required
     * @returns {XML}
     */
    createRequiredProperty(required, key) {
        return (this.createCheckBoxPropertyContainer(Locale.getMessage('fieldPropertyLabels.required'), required, key));
    }

    /**
     * hard coded required property creation since we know EVERY field type has a required property
     * this could be refactored out if the next iteration wants to go super generic
     * @param required
     * @returns {XML}
     */
    createUniqueProperty(unique, key, isDisabled) {
        return (this.createCheckBoxPropertyContainer(Locale.getMessage('fieldPropertyLabels.unique'), unique, key, isDisabled));
    }


    /**
     * Find all field properties for a given field type
     * We know EVERY field type currently has a Name and Required property so generate those no matter what
     * We also know that we need to display the Title header for field properties so do that too.
     * TODO:: Currently the key iterators are hardcoded. Once this comes from a json object, set keys to unique id or index in array
     * @returns {Array}
     */
    findFieldProperties() {
        let key = 0;
        let fieldPropContainers = [
            this.createPropertiesTitle(key++),
            this.createNameProperty(this.props.selectedField.name, key++),
            this.createRequiredProperty(this.props.selectedField.required, key++)
        ];

        let formatType = FieldFormats.getFormatType(this.props.selectedField);

        if (formatType === FieldFormats.TEXT_FORMAT_MULTICHOICE) {
            let choices = this.buildMultiChoiceDisplayList(this.props.selectedField.multipleChoice.choices);
            fieldPropContainers.push(this.createMultiChoiceTextPropertyContainer(Locale.getMessage('fieldPropertyLabels.multiChoice'), choices, key++));
        }

        const table = _.find(this.props.app.tables, {id: this.props.tableId});
        if (table && table.recordTitleFieldId && this.props.selectedField.id === table.recordTitleFieldId) {
            fieldPropContainers.push(this.createUniqueProperty(true, key++, true));
        }

        return fieldPropContainers;
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
     * TODO: figure out how to handle bad user data for Number Multi Choice fields
     * @param newValues
     */
    updateMultiChoiceFieldProps(newValues) {
        let field = this.props.selectedField;
        let choices = newValues.split("\n");
        let newChoices = [];
        choices.forEach(function(curChoice) {
            newChoices.push({coercedValue: {value: curChoice}, displayValue: curChoice});
        });
        field.multipleChoice.choices = newChoices;
        this.props.updateField(field, this.props.appId, this.props.tableId);
    }

    render() {
        //only show something if we have selected a field
        return (
            <SideTrowser pullRight={true} sideMenuContent={
                <div className="fieldPropertiesContainer">
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
