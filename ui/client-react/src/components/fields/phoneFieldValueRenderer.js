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
        attributes: React.PropTypes.object,

        /**
         * Disable the phone link */
        disabled: React.PropTypes.bool
    },

    getDefaultProps() {
        return {disabled: false};
    },

    renderLink() {
        let displayValue;
        let telPhoneNumberLink;
        let smsPhoneNumberLink;
        let extraDigits;
        let extension;
        let isDialable = false;
        if (typeof this.props.display === 'object') {
            let displayInfo = this.props.display;
            displayValue = displayInfo.display;
            telPhoneNumberLink = displayInfo.internetDialableNumber;
            smsPhoneNumberLink = 'sms:' + displayInfo.internationalNumber;
            extraDigits = displayInfo.extraDigits;
            extension = ((displayInfo.extension && displayInfo.extension.length) ? `${phoneNumberFormatter.EXTENSION_DELIM}${displayInfo.extension}` : null);
            isDialable = displayInfo.isDialable;
        } else {
            displayValue = this.props.display;
        }
        const disabledDisplay = (<span className="disabledPhoneFieldValueRenderer">
                                    {displayValue}{extraDigits}{extension}
                                 </span>);
        const displayWithIcons = (<div className="phoneQBIconWrapper phoneWrapper">
                                        <a href={telPhoneNumberLink} tabIndex="-1" className="telLink">
                                            <span tabIndex="0">
                                                {displayValue}
                                            </span>
                                        </a>
                                        {extraDigits && (<span className="extraDigits" tabIndex="0">{extraDigits}</span>)}
                                        {extension && <span className="extension" tabIndex="0">{extension}</span>}
                                        <div className="urlIcon phoneIcon">
                                            <a href={smsPhoneNumberLink} tabIndex="0" className="smsIconLink">
                                                <QBicon className="smsIcon" icon="speechbubble-outline"/>
                                            </a>
                                            {/*The phone icon is not in the tabindex because it does the same thing as the phoneNumber link*/}
                                            <a href={telPhoneNumberLink} tabIndex="-1" className="telIconLink">
                                                <QBicon icon="phone-outline"/>
                                            </a>
                                        </div>
                                    </div>);

        if (this.props.disabled || !isDialable) {
            return disabledDisplay;
        } else {
            return displayWithIcons;
        }
    },
    render() {
        let classes = (typeof this.props.display === 'object' && this.props.display.isDialable ? 'urlField' : '');
        classes += (this.props.disabled ? ' disabled' : '');
        return (
            <div className = {classes}>
                {this.renderLink()}
            </div>
        );
    }
});


export default PhoneFieldValueRenderer;
