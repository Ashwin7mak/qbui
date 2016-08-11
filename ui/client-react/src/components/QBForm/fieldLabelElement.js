import React from 'react';
import './qbform.scss';

const FieldLabelElement = React.createClass({
    propTypes: {
        element: React.PropTypes.object,
        relatedField: React.PropTypes.object,
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
