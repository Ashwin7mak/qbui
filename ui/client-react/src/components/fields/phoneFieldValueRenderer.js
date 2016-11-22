import React from 'react';
import './fields.scss';
import UrlFileAttachmentReportLinkFormatter from '../../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import UrlFieldValueRenderer from './urlFieldValueRenderer';
/**
 * # TextFieldValueRenderer
 *
 * A TextFieldValueRenderer is a read only rendering of the field containing a single line text.
 *
 * The value can be rendered as bold or not and classes can be optionally pass in for custom styling.
 */
const PhoneFieldValueRenderer = React.createClass({
    displayName: 'PhoneFieldValueRenderer',
    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,
        /**
         * text field attributes
         */
        attributes: React.PropTypes.object

    },
    render() {
        // Remove value from props to be replaced by the formatted email
        let {value, ...otherProps} = this.props;

        // Format as an email link
        value = (value || this.props.display);
        let phoneNumber = UrlFileAttachmentReportLinkFormatter.addProtocol(value, 'callto:');

        return (
            <UrlFieldValueRenderer value={phoneNumber} openInNewWindow={false} {...otherProps} inputType="number" />
        );
    }
});


export default PhoneFieldValueRenderer;
