import React, {PropTypes} from 'react';
import EmailFormatter from '../../../../common/src/formatter/emailFormatter';
import UrlFileAttachmentReportLinkFormatter from '../../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import UrlFieldValueRenderer from './urlFieldValueRenderer';
/**
 * # UrlFieldValueRenderer
 *
 * Renders emails as links
 * A small wrapper for UrlFieldValueRenderer specifically for Emails
 *
 * The component will automatically add `mailto:` to an email address. Otherwise,
 * it will leave the protocol specified by the user and display the appropriate
 * icon.
 */
const EmailFieldValueRenderer = React.createClass({
    displayName: 'EmailFieldValueRenderer',
    propTypes: {
        /**
        * The underlying value for the URL */
        value: PropTypes.string,

        /**
        * The value displayed to the user */
        display: PropTypes.string,
    },
    getDefaultProps() {
        return {
            display: '',
            value: null
        };
    },
    render() {
        // Remove value from props to be replaced by the formatted email
        let {value, ...otherProps} = this.props;

        // Format as an email link
        value = (value || this.props.display);
        let emailLink = UrlFileAttachmentReportLinkFormatter.addProtocol(value, 'mailto:');

        return (
            <UrlFieldValueRenderer value={emailLink} {...otherProps} inputType="email" />
        );
    }
});

export default EmailFieldValueRenderer;
