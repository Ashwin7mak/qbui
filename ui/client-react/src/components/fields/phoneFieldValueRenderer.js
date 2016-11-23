import React from 'react';
import QBicon from '../../components/qbIcon/qbIcon.js';
import Breakpoints from "../../utils/breakpoints";
import './fields.scss';
import './phoneField.scss';
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
    renderQBIcon() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        console.log('issmall: ', isSmall);
        if (isSmall) {
            return (
                <div className = "phoneIcon">
                    <QBicon className ="smsIcon" icon="mail" />
                    <QBicon icon="mail" />
                </div>
            );
        } else {
            return <span />;
        }
    },
    renderLinkHref() {
        let phoneNumberLink = 'callto:' + this.props.value;
        return encodeURI(phoneNumberLink);
    },
    render() {
        // Remove value from props to be replaced by the formatted email
        let {value, ...otherProps} = this.props;

        // Format as an email link
        value = (value || this.props.display);
        // let phoneNumber = UrlFileAttachmentReportLinkFormatter.addProtocol(value, 'callto:');
        // <UrlFieldValueRenderer value={phoneNumber} openInNewWindow={false} {...otherProps} inputType="number" />
        return (
            <a href={this.renderLinkHref()} tabIndex="-1">
                <span>
                    {this.props.display}
                </span>
                {this.renderQBIcon()}
            </a>
        );
    }
});


export default PhoneFieldValueRenderer;
