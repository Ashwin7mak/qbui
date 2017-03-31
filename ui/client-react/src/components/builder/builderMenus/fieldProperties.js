import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
import {updateField} from '../../../actions/fieldsActions';
import './fieldProperties.scss';

const mapStateToProps = (state, ownProps) => {
    let formId = (ownProps.formId || 'view');
    let currentForm = state.forms.find(form => form.id === formId);
    let selectedField = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields : []);
    return {
        selectedField: (selectedField.length === 1 ? selectedField[0] : null),
        form: state.forms[0],
        fields: state.fields
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateField: (field) => {
            dispatch(updateField(field));
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
        return (this.createTextPropertyContainer("Name", name));
    },

    createRequiredProperty(required) {
        return (this.createCheckBoxPropertyContainer("Must be filled in", required));
    },

    updateFieldProps(newValue, propertyName) {
        let field = this.getField();
        field[propertyName] = newValue;
        this.props.updateField(field);
    },

    getField() {
        /*return (this.props.fields.length !== 0 && this.props.selectedField) ?
            this.props.fields[0].fields.fields.data[this.props.selectedField.elementIndex + 5] : null;*/
        return this.props.selectedField ? this.props.form.formData.fields[this.props.selectedField.elementIndex + 5] : null;
    },

    render() {
        let field = this.getField();
        return (field ?
            <div className="fieldPropertiesContainer">
                {this.createPropertiesTitle(field.name)}
                {this.createNameProperty(field.name)}
                {this.createRequiredProperty(field.required)}
            </div> : <div className="fieldPropertiesContainer"></div>
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldProperties);
