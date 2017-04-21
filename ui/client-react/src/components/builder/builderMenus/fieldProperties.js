import React, {PropTypes, Component} from "react";
import {connect} from 'react-redux';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
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
        this.createNameProperty = this.createNameProperty.bind(this);
        this.createRequiredProperty = this.createRequiredProperty.bind(this);
        this.updateFieldProps = this.updateFieldProps.bind(this);
    }

    /**
     * Creates the headline at the top of the right panel saying the field name and the text properties after it
     * @param fieldName
     * @returns {node}
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
     * @returns {node}
     */
    createTextPropertyContainer(propertyTitle, propertyValue) {
        return (
            <div className="fieldPropertyContainer">
                <div className="textPropertyTitle">{propertyTitle}</div>
                <TextFieldValueEditor value={propertyValue}
                                      tabIndex={tabIndexConstants.fieldPropsTabIndex}
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
     * @returns {node}
     */
    createCheckBoxPropertyContainer(propertyTitle, propertyValue) {
        return (
            <div className="checkboxPropertyContainer">
                <CheckBoxFieldValueEditor value={propertyValue}
                                          label={propertyTitle}
                                          tabIndex={tabIndexConstants.fieldPropsTabIndex}
                                          onChange={(newValue) => this.updateFieldProps(newValue, 'required')}
                />
            </div>
        );
    }

    /**
     * hard coded name property creation since we know EVERY field type has a name
     * this could be refactored out if the next iteration wants to go super generic
     * @param name
     * @returns {node}
     */
    createNameProperty(name) {
        return (this.createTextPropertyContainer(Locale.getMessage('fieldPropertyLabels.name'), name));
    }

    /**
     * hard coded required property creation since we know EVERY field type has a required property
     * this could be refactored out if the next iteration wants to go super generic
     * @param required
     * @returns {node}
     */
    createRequiredProperty(required) {
        return (this.createCheckBoxPropertyContainer(Locale.getMessage('fieldPropertyLabels.required'), required));
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

    render() {
        //only show something if we have selected a field
        return (
            <SideTrowser pullRight={true} sideMenuContent={
                <div className="fieldPropertiesContainer">
                    {this.props.selectedField && this.createPropertiesTitle(this.props.selectedField.name)}
                    {this.props.selectedField && this.createNameProperty(this.props.selectedField.name)}
                    {this.props.selectedField && this.createRequiredProperty(this.props.selectedField.required)}
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
