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
        console.log('onChangeExtNumber: ', ev);
        let updatedValue = ev;
        if (this.props.value && this.props.value.split('x')[1]) {
            updatedValue = ev + 'x' + this.props.value.split('x')[1];

        }
        if (this.props.onChange) {
            this.props.onChange(updatedValue);
        }
    },
    onChangeExtNumber(ev) {
        console.log('onChangeExtNumber: ', ev);
        if (this.props.value) {
            let updatedValue = this.props.value.split('x')[0] + 'x' + ev;
            if (this.props.onChange) {
                this.props.onChange(updatedValue);
            }
        }

    },
    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }

    },
    onBlur(ev) {
        let theVals = {
            value: this.props.value.split('x').join('')
        };

        if (ev.value === this.props.value.split('x')[1]) {
            theVals = {
                value: this.props.value.split('x')[0] + 'x' + ev.value
            };
        } else if (this.props.value.split('x')[1]) {
            theVals = {
                value: ev.value + 'x' +  this.props.value.split('x')[1]
            };
        }
        let attrs = null;
        if (this.props.fieldDef && this.props.fieldDef.datatypeAttributes) {
            attrs = this.props.fieldDef.datatypeAttributes;
        }
        theVals.display = textFormatter.format(theVals, attrs);
        if (this.props.onBlur) {
            this.props.onBlur({value: theVals.value, display: theVals.display});
        }
    },
    render() {
        if (this.props.attributes.includeExtension) {
            let officeNumber;
            let officeExt;
            if (this.props.value) {
                let tempValue = this.props.value.split('x');
                officeNumber = tempValue[0];
                officeExt = tempValue[1];
            }
            let classes = {
                officeNumber: "officeNumber",
                extNumber: "extNumber"
            };
            return (
                <div className="officePhone">
                    <TextFieldValueEditor type="tel"
                           classes={classes.officeNumber}
                           onChange={this.onChangeOfficeNumber}
                           onBlur={this.onBlur}
                           value={officeNumber || ''} />
                    <span className="x">x</span>
                    <TextFieldValueEditor type="tel"
                           classes={classes.extNumber}
                           onChange={this.onChangeExtNumber}
                           onBlur={this.onBlur}
                           value={officeExt || ''} />
                </div>
            );
        } else {
            return (
                <TextFieldValueEditor type="tel"
                                      value={this.props.value || ''}
                                      onChange={this.onChange}
                                      onBlur={this.onBlur}
                                      {...this.props} />
            );
        }
    }
});

export default PhoneFieldValueEditor;
