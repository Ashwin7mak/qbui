import React, {PropTypes} from 'react';
import QBicon from '../../components/qbIcon/qbIcon.js';
import './urlField.scss';
import * as phoneNumberFormatter from '../../../../common/src/formatter/phoneNumberFormatter';
import _ from 'lodash';

const PhoneFieldValueRenderer = React.createClass({
    displayName: 'PhoneFieldValueRenderer',
    propTypes: {
        /**
         * the value to for sms and tel link */
        value: PropTypes.string,
        /**
         * the display to render */
        display: PropTypes.any.isRequired,
        /**
         * phone field attributes
         */
        attributes: PropTypes.object,

        /**
         * Disable the phone link */
        disabled: PropTypes.bool,

        /**
         * if false, extension will not be displayed */
        includeExtension: PropTypes.bool,
    },

    getDefaultProps() {
        return {
            disabled: false,
            includeExtension: true,
        };
    },

    shouldIncludeExtension() {
        let displayInfo = this.props.display;
        return (this.props.includeExtension && (displayInfo.extension && displayInfo.extension.length));
    },

    renderLink() {
        let displayValue;
        let telPhoneNumberLink;
        let smsPhoneNumberLink;
        let extraDigits;
        let extension;
        let isDialable = false;
        if (_.isObject(this.props.display)) {
            let displayInfo = this.props.display;
            displayValue = displayInfo.display;
            telPhoneNumberLink = displayInfo.internetDialableNumber;
            smsPhoneNumberLink = 'sms:' + displayInfo.internationalNumber;
            extraDigits = displayInfo.extraDigits;
            extension = (this.shouldIncludeExtension() ? `${phoneNumberFormatter.EXTENSION_DELIM}${displayInfo.extension}` : null);
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
        let classes = (_.isObject(this.props.display) && this.props.display.isDialable ? 'urlField' : '');
        classes += (this.props.disabled ? ' disabled' : '');
        return (
            <div className = {classes}>
                {this.renderLink()}
            </div>
        );
    }
});


export default PhoneFieldValueRenderer;
