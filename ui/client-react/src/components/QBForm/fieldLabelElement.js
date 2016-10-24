import React from 'react';
import _ from 'lodash';

import FieldFormats from '../../utils/fieldFormats';

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
        isInvalid: React.PropTypes.bool,
        label: React.PropTypes.string,
    },

    getDefaultProps() {
        return {
            indicateRequiredOnLabel: false,
            label: '',
        };
    },

    render() {
        // symbol that a value required
        let requiredIndication = '';
        if (this.props.indicateRequiredOnLabel && ((this.props.element && this.props.element.required) || (this.props.relatedField && this.props.relatedField.required))) {
            requiredIndication = '*';
        }

        let classes = ['formElement', 'fieldLabel'];
        if (this.props.isInvalid) {
            classes.push('errorText');
        }

        const type = FieldFormats.getFormatType(_.get(this.props, 'relatedField.datatypeAttributes'));
        if (type === FieldFormats.CHECKBOX_FORMAT) {
            classes.push('checkbox-field-label');
            return <div className={classes.join(' ')}> </div>;
        }

        return <div className={classes.join(' ')}>{`${requiredIndication} ${this.props.label}`}</div>;
    }
});

export default FieldLabelElement;
