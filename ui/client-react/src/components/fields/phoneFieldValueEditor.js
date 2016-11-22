import React, {PropTypes} from 'react';
import {AsYouTypeFormatter, PhoneNumberUtil, PhoneNumberFormat as PNF} from 'google-libphonenumber';

const PhoneFieldValueEditor = React.createClass({
    getInitialState() {
        return {
            value: '',
            formatter: new AsYouTypeFormatter('US'),
            parser: new PhoneNumberUtil
        };
    },
    onKeyDown(ev) {
        // var AsYouTypeFormatter = require('google-libphonenumber').AsYouTypeFormatter;
        // var newNumber = this.state.parser.parse(ev.target.value, PNF.INTERNATIONAL);

        var newNumber = this.state.formatter.inputDigit(ev.key);
        this.setState({value: newNumber});
    },
    render() {
        return <input type="tel" value={this.state.value} onKeyDown={this.onKeyDown} />
    }
});

export default PhoneFieldValueEditor;
