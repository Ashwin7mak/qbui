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
            display: ''
        }
    },
    render() {
        let emailLink = UrlFileAttachmentReportLinkFormatter.addProtocol(this.props.value, 'mailto:');
        // Remove value from props to be replaced by the formatted email
        let {value, ...otherProps} = this.props;

        return (
            <UrlFieldValueRenderer value={emailLink} {...otherProps} />
        );
    }
});

export default EmailFieldValueRenderer;
