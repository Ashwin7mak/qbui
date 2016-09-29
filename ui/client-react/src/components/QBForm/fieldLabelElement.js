import React from 'react';
import './qbform.scss';

/**
 * render a form field's label
 */
const FieldLabelElement = React.createClass({
    displayName: 'FieldLabelElement',
    propTypes: {
        element: React.PropTypes.object, // FormFieldElement from form API
        relatedField: React.PropTypes.object, // field from Form data
        indicateRequiredOnLabel: React.PropTypes.bool,
        //always render a non-breaking space even if required sign isnt there
        //this is needed to line up required and non required field labels
        reserveSpaceForRequired: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            indicateRequiredOnLabel: false,
            reserveSpaceForRequired: false
        };
    },

    render() {
        // symbol that a value required
        let requiredIndication = this.props.reserveSpaceForRequired ? '\u00a0' : '';
        if (this.props.indicateRequiredOnLabel && ((this.props.element && this.props.element.required) || (this.props.relatedField && this.props.relatedField.required))) {
            requiredIndication = '*';
        }

        let fieldLabel = requiredIndication + ' ';
        if (this.props.element.useAlternateLabel) {
            fieldLabel += this.props.element.displayText;
        } else {
            fieldLabel += this.props.relatedField ? this.props.relatedField.name : "";
        }

        return <div className="formElement fieldLabel">{fieldLabel}</div>;
    }
});

export default FieldLabelElement;
