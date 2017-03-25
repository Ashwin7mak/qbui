import React, {PropTypes} from 'react';
import TextFieldValueEditor from '../../fields/textFieldValueEditor';
import CheckBoxFieldValueEditor from '../../fields/checkBoxFieldValueEditor';
import './fieldProperties.scss';

let FieldProperties = React.createClass({
    propTypes: {
    },

    createPropertiesTitle() {
        return (
            <div className="fieldPropertiesTitle">Field properties</div>
        );
    },

    createTextPropertyContainer(propertyTitle) {
        return (
            <div className="fieldPropertyContainer">
                <div className="textPropertyTitle">{propertyTitle}</div>
                <TextFieldValueEditor classes="textPropertyValue"/>
            </div>
        );
    },

    createCheckBoxPropertyContainer(propertyTitle) {
        return (
            <div className="checkboxPropertyContainer">
                <CheckBoxFieldValueEditor classes="checkboxPropertyValue"/>
                <div className="checkboxPropertyTitle">{propertyTitle}</div>
            </div>
        );
    },

    createNameProperty() {
        return (this.createTextPropertyContainer("Name"));
    },

    createRequiredProperty() {
        return (this.createCheckBoxPropertyContainer("Must be filled in"));
    },

    render() {
        return (
            <div className="fieldPropertiesContainer">
                {this.createPropertiesTitle()}
                {this.createNameProperty()}
                {this.createRequiredProperty()}
            </div>
        );
    }
});

export default FieldProperties;
