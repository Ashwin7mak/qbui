import React from 'react';
import QBicon from '../../components/qbIcon/qbIcon.js';
import './urlField.scss';
import * as phoneNumberFormatter from '../../../../common/src/formatter/phoneNumberFormatter';

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
        let telPhoneNumberLink = 'tel:' + (this.props.value ? phoneNumberFormatter.getPhoneNumber(this.props.value) : '');
        let smsPhoneNumberLink = 'sms:' + (this.props.value ? phoneNumberFormatter.getPhoneNumber(this.props.value) : '');
        if (this.props.disabled) {
            return (
                <span>
                    {this.props.display}
                </span>
            );
        }
        if (!this.props.disabled) {
            console.log('this.props.display: ', this.props.display);
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
