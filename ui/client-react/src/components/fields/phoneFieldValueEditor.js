import React, {PropTypes} from 'react';
import {AsYouTypeFormatter, PhoneNumberUtil, PhoneNumberFormat as PNF} from 'google-libphonenumber';
import TextFieldValueEditor from './textFieldValueEditor';
import './phoneFieldValueEditor.scss';


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
        let {value, classes, ...otherProps} = this.props;
        value = this.state.value;
        classes = {
            officeNumber: "officeNumber",
            xNumber: "xNumber"
        }
        if (this.props.isHome) {
            return (
                <TextFieldValueEditor type="tel"
                                      onKeyDown={this.onKeyDown}
                                      value={value}
                                      {...otherProps} />
            );
        } else {
            return (
                <div className="officePhone">
                    <TextFieldValueEditor type="tel"
                                          classes={classes.officeNumber}
                                          onKeyDown={this.onKeyDown}
                                          value={value}
                                          {...otherProps} />
                    <p className="x">x</p>
                    <TextFieldValueEditor type="tel"
                                          classes={classes.xNumber}
                                          onKeyDown={this.onKeyDown}
                                          value={value}
                                          {...otherProps} />
                </div>
            );
        }
    },
    render() {
        return this.homeOrOfficePhoneField();
    }
});

export default PhoneFieldValueEditor;
