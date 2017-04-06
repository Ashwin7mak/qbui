import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
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

export const FieldProperties = React.createClass({
    propTypes: {
        selectedField: PropTypes.object,
        appId: PropTypes.string,
        tableId: PropTypes.string,
        formId: PropTypes.string
    },

    createPropertiesTitle(fieldName) {
        return (
            <div className="fieldPropertiesTitle">{fieldName} properties</div>
        );
    },

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
    },

    createCheckBoxPropertyContainer(propertyTitle, propertyValue) {
        return (
            <div className="checkboxPropertyContainer">
                <CheckBoxFieldValueEditor value={propertyValue}
                                          label={propertyTitle}
                                          onChange={(newValue) => this.updateFieldProps(newValue, 'required')}
                />
            </div>
        );
    },

    createNameProperty(name) {
        return (this.createTextPropertyContainer(Locale.getMessage('fieldPropertyLabels.name'), name));
    },

    createRequiredProperty(required) {
        return (this.createCheckBoxPropertyContainer(Locale.getMessage('fieldPropertyLabels.required'), required));
    },

    updateFieldProps(newValue, propertyName) {
        let field = this.getField();
        field[propertyName] = newValue;
        this.props.updateField(field, this.props.appId, this.props.tableId);
    },

    getField() {
        //return this.props.selectedField ? this.props.fields[0].fields[this.props.selectedField.elementIndex + 5] : null;
        return this.props.selectedField;
    },

    render() {
        let field = this.getField();
        if (field) {
            return (
                <SideTrowser pullRight={true} sideMenuContent={
                    <div className="fieldPropertiesContainer">
                        {this.createPropertiesTitle(field.name)}
                        {this.createNameProperty(field.name)}
                        {this.createRequiredProperty(field.required)}
                    </div>
                }>
                    {this.props.children}
                </SideTrowser>
            );
        } else {
            return(
                <SideTrowser pullRight={true} sideMenuContent={<div className="fieldPropertiesContainer"></div>}>
                    {this.props.children}
                </SideTrowser>
            );
        }
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldProperties);