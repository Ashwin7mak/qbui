import React from 'react';
import QBicon from '../../components/qbIcon/qbIcon.js';
import Breakpoints from "../../utils/breakpoints";
import './fields.scss';
import './phoneField.scss';

const PhoneFieldValueRenderer = React.createClass({
    displayName: 'PhoneFieldValueRenderer',
    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,
        /**
         * text field attributes
         */
        attributes: React.PropTypes.object

    },
    renderLink() {
        let isSmall = Breakpoints.isSmallBreakpoint();
        let telPhoneNumberLink = 'tel:' + this.props.value;
        let smsPhoneNumberLink = 'sms:' + this.props.value;
        telPhoneNumberLink = encodeURI(telPhoneNumberLink);
        smsPhoneNumberLink = encodeURI(smsPhoneNumberLink);
        if (isSmall) {
            return (
                <div className = "qbIconWrapper">
                    <a href={telPhoneNumberLink} tabIndex="-1">
                        <span>
                            {this.props.display}
                        </span>
                    </a>
                    <div className="phoneIcon">
                        <a href={smsPhoneNumberLink} tabIndex="-1">
                            <QBicon className="smsIcon" icon="edit" />
                        </a>
                        <a href={telPhoneNumberLink} tabIndex="-1">
                            <QBicon icon="mail" />
                        </a>
                    </div>
                </div>
            );
        } else {
            return (
                <a href={telPhoneNumberLink} tabIndex="-1">
                    <span>
                        {this.props.display}
                    </span>
                </a>
            );
        }
    },
    render() {
        return (
            <div className = "phoneWrapper">
                {this.renderLink()}
            </div>
        );
    }
});


export default PhoneFieldValueRenderer;
