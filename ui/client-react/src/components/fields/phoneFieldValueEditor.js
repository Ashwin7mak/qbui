import React, {PropTypes} from 'react';
import TextFieldValueEditor from './textFieldValueEditor';
import './phoneFieldValueEditor.scss';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';
import _ from 'lodash';


const PhoneFieldValueEditor = React.createClass({
    displayName: 'PhoneFieldValueEditor',
    propTypes: {
        /**
         * the value to render */
        value: React.PropTypes.any,
        /**
         * text field attributes
         */
        attributes: React.PropTypes.object

    },
    onChangeOfficeNumber(ev) {
       console.log('officeNumberOnChange: ', ev.target.value)
        console.log('this.props.value: ', this.props.value);
        let tempExtNumber = this.props.value.split('x')[1];
        let updatedValue = ev.target.value + 'x' + tempExtNumber;
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        console.log('onChangeExtNumber: ', ev.target.value);
        console.log('this.props.value: ', this.props.value);
        let tempOfficeNumber = this.props.value.split('x')[0];
        let updatedValue =  tempOfficeNumber + 'x' + ev.target.value;
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onBlur(ev) {
        let theVals = {
            value: ev.target.value
        };
        theVals.display = textFormatter.format(theVals, this.props.fieldDef.datatypeAttributes);
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },
    render() {
        let {value, onBlur, onChange, ...otherProps} = this.props;
        if (this.props.attributes.includeExtension) {
            let officeNumber = this.props.value.split('x')[0];
            let officeExt = this.props.value.split('x')[1];
            return (
                <div className="officePhone">
                    <input type="tel"
                           className="officeNumber"
                           onChange={this.onChangeOfficeNumber}
                           onBlur={this.onBlur}
                           value={officeNumber || ''}
                           {...otherProps} />
                    <span className="x">x</span>
                    <input type="tel"
                           className="extNumber"
                           onChange={this.onChangeExtNumber}
                           onBlur={this.onBlur}
                           value={officeExt || ''}
                           {...otherProps} />
                </div>
            );
        } else {
            return (
                <TextFieldValueEditor type="tel"
                                      value={value || ''}
                                      {...otherProps} />
            );
        }
    }
});

export default PhoneFieldValueEditor;
