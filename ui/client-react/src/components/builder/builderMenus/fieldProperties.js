import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
import './fieldProperties.scss';

const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || 'view');
    let currentForm = state.forms.find(form => form.id === formId);
    let selectedField = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields : []);
    return {
        selectedField: (selectedField.length === 1 ? selectedField[0] : null),
        form: state.forms[0]
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadForm(appId, tableId, reportId, formType, recordId) {
            return dispatch(loadForm(appId, tableId, reportId, formType, recordId));
        },

        updateFieldProps(fieldId, property, value) {
            return "";
        }
    };
};

let FieldProperties = React.createClass({
    propTypes: {
        selectedField: PropTypes.object
    },

    createPropertiesTitle(fieldName) {
        return (
            <div className="fieldPropertiesTitle">{fieldName} properties</div>
        );
    },

    createTextPropertyContainer(fieldId, propertyTitle, propertyValue) {
        return (
            <div className="fieldPropertyContainer">
                <div className="textPropertyTitle">{propertyTitle}</div>
                <TextFieldValueEditor value={propertyValue}
                                      classes="textPropertyValue"
                                      inputType="text"
                />
            </div>
        );
    },

    createCheckBoxPropertyContainer(fieldId, propertyTitle, propertyValue) {
        return (
            <div className="checkboxPropertyContainer">
                <CheckBoxFieldValueEditor value={propertyValue}
                                          label={propertyTitle}
                                          onChange={this.props.updateFieldProps(fieldId, 'required', !propertyValue)}
                />
            </div>
        );
    },

    createNameProperty(field) {
        return (this.createTextPropertyContainer(field.id, "Name", field.name));
    },

    createRequiredProperty(field) {
        return (this.createCheckBoxPropertyContainer(field.id, "Must be filled in", field.required));
    },

    getField() {
        if (this.props.selectedField) {
            let duder = this.props.selectedField.elementIndex;
            return this.props.form.formData.fields[duder + 5];
        } else {
            return null;
        }
    },

    render() {
        let field = this.getField();
        return ( field ?
            <div className="fieldPropertiesContainer">
                {this.createPropertiesTitle(field.name)}
                {this.createNameProperty(field)}
                {this.createRequiredProperty(field)}
            </div> : <div className="fieldPropertiesContainer"></div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldProperties);
