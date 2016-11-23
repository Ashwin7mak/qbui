import React, {PropTypes} from 'react';
import {AsYouTypeFormatter, PhoneNumberUtil, PhoneNumberFormat as PNF} from 'google-libphonenumber';
import TextFieldValueEditor from './textFieldValueEditor';


const PhoneFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            value: '',
            formatter: new AsYouTypeFormatter('US'),
            parser: new PhoneNumberUtil()
        };
    },
    onKeyDown(ev) {
        // var AsYouTypeFormatter = require('google-libphonenumber').AsYouTypeFormatter;
        // var newNumber = this.state.parser.parse(ev.target.value, PNF.INTERNATIONAL);

        var newNumber = this.state.formatter.inputDigit(ev.key);
        this.setState({value: newNumber});
    },
    homeOrOfficePhoneField() {
        let {value, ...otherProps} = this.props;
        value = this.state.value;
        if (!this.props.isHome) {
            return (
                <TextFieldValueEditor onKeyDown={this.onKeyDown}
                                      value={value}
                                      {...otherProps} />
            );
        } else {
            return (
                <div>
                    <input type="tel" value={this.state.value} onKeyDown={this.onKeyDown} />
                    <p>X</p>
                    <input />
                </div>
            );
        }
    },
    render() {
        return this.homeOrOfficePhoneField();
    }
});

export default PhoneFieldValueEditor;
