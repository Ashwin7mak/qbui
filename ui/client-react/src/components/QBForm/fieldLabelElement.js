import React from 'react';
import './qbform.scss';

/**
 * render a form field's label
 */
const FieldLabelElement = React.createClass({
    propTypes: {
        element: React.PropTypes.object, // FormFieldElement from form API
        relatedField: React.PropTypes.object, // field from Form data
    },

    render() {

        let fieldLabel = "";
        if (this.props.element.useAlternateLabel) {
            fieldLabel = this.props.element.displayText;
        } else {
            fieldLabel = this.props.relatedField ? this.props.relatedField.name : "";
        }

        return <div className="formElement fieldLabel">{fieldLabel}</div>;
    }
});

export default FieldLabelElement;
