import React, {PropTypes} from 'react';
import TextFieldValueRenderer from './textFieldValueRenderer';
import UrlUtils from '../../utils/urlUtils';
import UrlFileAttachmentReportLinkFormatter from '../../../../common/src/formatter/urlFileAttachmentReportLinkFormatter';
import './urlField.scss';

/**
 * # UrlFieldValueRenderer
 *
 * Renders URLs as links or buttons.
 * Includes support for email, tel, and sms icons if those protocols are specified.
 *
 */
const UrlFieldValueRenderer = React.createClass({
    displayName: 'UrlFieldValueRenderer',
    propTypes: {
        /**
        * The underlying value for the URL */
        value: PropTypes.string,

        /**
        * The value displayed to the user */
        display: PropTypes.string,

        /**
        * If true, clicking the link will open a new window/tab */
        openInNewWindow: PropTypes.bool,

        /**
        * If true, the link will be a button rather than a text link */
        showAsButton: PropTypes.bool,

        /**
        * Shows a link button as disabled if true */
        disabled: PropTypes.bool
    },
    getDefaultProps() {
        return {
            display: '',
            disabled: false,
            openInNewWindow: true,
            showAsButton: false,
            value: ''
        };
    },
    setLinkClasses() {
        let linkClasses = (this.props.showAsButton ? 'btn btn-default' : 'link');
        linkClasses += (this.props.disabled ? ' disabled' : '');

        return linkClasses;
    },
    renderLinkHref() {
        let linkHref = UrlFileAttachmentReportLinkFormatter.addProtocol(this.props.value);
        return encodeURI(linkHref);
    },
    renderLinkDisplayText() {
        if(displayingUrl(this.props.display, this.props.value)) {
            // Add the default protocol if a protocol is not provided
            return UrlFileAttachmentReportLinkFormatter.addProtocol(this.props.display);
        } else {
            // Otherwise only display the text
            return this.props.display;
        }
    },
    renderLink() {
        let target = (this.props.openInNewWindow ? '_blank' : '_self');

        // Don't render an empty button
        if (!this.props.display) {
            return <span className="link"></span>;
        }

        if (this.props.disabled) {
            return (
                <span className={this.setLinkClasses()}>
                    {this.renderLinkDisplayText()}
                </span>
            );
        } else {
            return (
                <a href={this.renderLinkHref()} target={target} className={this.setLinkClasses()}>
                    {this.renderLinkDisplayText()}
                    {this.renderIcon()}
                </a>
            );
        }
    },
    renderIcon() {
        if (!this.props.showAsButton && !this.props.disabled) {
            return (
                <div className="urlIcon">
                    {UrlUtils.renderIconForUrl(this.props.value)}
                </div>
            );
        }
    },
    render() {
        let classes = 'urlField';
        classes += (this.props.disabled ? ' disabled' : '');

        return (
            <div className={classes}>
                {this.renderLink()}
            </div>
        );

    }
});

function displayingUrl(linkText, linkHref) {
    return (linkText === linkHref);
}

export default UrlFieldValueRenderer;
