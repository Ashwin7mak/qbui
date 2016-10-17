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
        isInvalid: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            indicateRequiredOnLabel: false
        };
    },

    render() {
        // symbol that a value required
        let requiredIndication = '';
        if (this.props.indicateRequiredOnLabel && ((this.props.element && this.props.element.required) || (this.props.relatedField && this.props.relatedField.required))) {
            requiredIndication = '*';
        }

        let fieldLabel = requiredIndication + ' ';
        if (this.props.element.useAlternateLabel) {
            fieldLabel += this.props.element.displayText;
        } else {
            fieldLabel += this.props.relatedField ? this.props.relatedField.name : '';
        }

        let classes = 'formElement fieldLabel';
        classes += this.props.isInvalid ? ' errorText' : '';

        return <div className={classes}>{fieldLabel}</div>;
    }
});

export default FieldLabelElement;
