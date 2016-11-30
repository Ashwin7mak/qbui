import React from 'react';
import QBicon from '../../components/qbIcon/qbIcon.js';
import './urlField.scss';

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
        let telPhoneNumberLink = 'tel:' + (this.props.value ? this.props.value.split('x')[0] : '');
        let smsPhoneNumberLink = 'sms:' + (this.props.value ? this.props.value.split('x')[0] : '');
        telPhoneNumberLink = encodeURI(telPhoneNumberLink);
        smsPhoneNumberLink = encodeURI(smsPhoneNumberLink);
        if (this.props.disabled) {
            return (
                <span>
                    {this.props.display}
                </span>
            );
        }
        if (!this.props.disabled) {
            return (
                <div className = "phoneQBIconWrapper">
                    <a href={telPhoneNumberLink} tabIndex="-1">
                        <span>
                            {this.props.display}
                        </span>
                    </a>
                    <div className="urlIcon phoneIcon">
                        <a href={smsPhoneNumberLink} tabIndex="-1">
                            <QBicon className="smsIcon" icon="speechbubble-outline" />
                        </a>
                        <a href={telPhoneNumberLink} tabIndex="-1">
                            <QBicon icon="phone-outline" />
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
        let classes = 'urlField';
        classes += (this.props.disabled ? ' disabled' : '');
        return (
            <div className = {classes}>
                {this.renderLink()}
            </div>
        );
    }
});


export default PhoneFieldValueRenderer;
