import React from 'react';
import QBicon from '../../components/qbIcon/qbIcon.js';
import './urlField.scss';
import * as phoneNumberFormatter from '../../../../common/src/formatter/phoneNumberFormatter';

const PhoneFieldValueRenderer = React.createClass({
    displayName: 'PhoneFieldValueRenderer',
    propTypes: {
        /**
         * the value to for sms and tel link */
        value: React.PropTypes.string,
        /**
         * the display to render */
        display: React.PropTypes.object.isRequired,
        /**
         * phone field attributes
         */
        attributes: React.PropTypes.object
    },
    renderLink() {
        let displayValue;
        let telPhoneNumberLink;
        let smsPhoneNumberLink;
        let extraDigits;
        let extension;
        if (typeof this.props.display === 'object') {
            displayValue = this.props.display.display;
            telPhoneNumberLink = this.props.display.internetDialableNumber;
            smsPhoneNumberLink = 'sms:' + this.props.display.internationalNumber;
            extraDigits = (this.props.display.isDialable ? this.props.display.extraDigits : '');
            extension = ((this.props.display.extension && this.props.display.extension.length) ? `${phoneNumberFormatter.EXTENSION_DELIM}${this.props.display.extension}` : null);
        }
        const disabledDisplay = (<span>
                                    {displayValue}{extraDigits}{extension}
                                 </span>);
        const displayWithIcons = (<div className="phoneQBIconWrapper phoneWrapper">
                                        <a href={telPhoneNumberLink} tabIndex="-1">
                                            <span tabIndex="0">
                                                {displayValue}
                                            </span>
                                            {extraDigits && (
                                                <span className="extraDigits" tabIndex="0">
                                                {extraDigits}
                                                </span>
                                            )}
                                            {extension && <span className="extension" tabIndex="0">{extension}</span>}
                                        </a>
                                        <div className="urlIcon phoneIcon">
                                            <a href={smsPhoneNumberLink} tabIndex="0">
                                                <QBicon className="smsIcon" icon="speechbubble-outline"/>
                                            </a>
                                            {/*The phone icon is not in the tabindex because it does the same thing as the phoneNumber link*/}
                                            <a href={telPhoneNumberLink} tabIndex="-1">
                                                <QBicon icon="phone-outline"/>
                                            </a>
                                        </div>
                                    </div>);

        if (this.props.disabled || !this.props.display.isDialable) {
            return disabledDisplay;
        } else {
            return displayWithIcons;
        }
    },
    render() {
        let classes = (this.props.display.isDialable ? 'urlField' : '');
        classes += (this.props.disabled ? ' disabled' : '');
        return (
            <div className = {classes}>
                {this.renderLink()}
            </div>
        );
    }
});


export default PhoneFieldValueRenderer;
