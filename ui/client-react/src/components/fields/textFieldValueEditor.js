import React from 'react';
import ReactDOM from 'react-dom';
import './fields.scss';
import QBToolTip from '../qbToolTip/qbToolTip';
import QBicon from '../qbIcon/qbIcon';
import * as textFormatter from '../../../../common/src/formatter/textFormatter';

/**
 * # TextFieldValueEditor
 *
 * An editable rendering of a single line text field as an input box. The component can be supplied a value or not. Used within a FieldValueEditor
 *
 */

const TextFieldValueEditor = React.createClass({
    displayName: 'TextFieldValueEditor',

    propTypes: {
        /**
         * the value to fill in the input box */
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),  // should be string but duration is a number for edit but rendered as text

        /**
         * optional string to display when input is empty aka ghost text */
        placeholder: React.PropTypes.string,

        /**
         * renders with red border if true */
        isInvalid: React.PropTypes.bool,

        /**
         * message to display in the tool tip when isInvalid */
        invalidMessage: React.PropTypes.string,

        /**
         * optional additional classes for the input to customize styling */
        classes: React.PropTypes.string,

        /**
        * shows a button that will allow a user to clear the field in one click */
        showClearButton: React.PropTypes.bool,

        /**
         * listen for changes by setting a callback to the onChange prop.  */
        onChange: React.PropTypes.func,

        /**
         * listen for losing focus by setting a callback to the onBlur prop. */
        onBlur: React.PropTypes.func,

        idKey: React.PropTypes.any,

        /**
         * data type attributes for the field */
        fieldDef: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            isInvalid: false,
            showClearButton: false
        };
    },

    onChange(ev) {
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    },

    clearInput(ev) {
        if (this.props.onChange) {
            this.props.onChange('');
            this.refs.mainInput.focus();
        }
    },

    //send up the chain an object with value and formatted display value
    onBlur(ev) {
        let theVals = {
            value: ev.target.value
        };
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
        let classes = 'input textField';
        // error state css class
        if (this.props.isInvalid) {
            classes += ' error';
        }
        if (this.props.classes) {
            classes += ' ' + this.props.classes;
        }

        let inputBox = <input ref="textInput"
                          className={classes}
                          value={this.props.display ? this.props.display : this.props.value}
                          type="text"
                          key={'inp' + this.props.idKey}
                          placeholder={this.props.placeholder}
                          onChange={this.onChange}
                          onBlur={this.onBlur}
                          ref="mainInput" />;

        let inputBoxWithTooltip =  (this.props.isInvalid ?
                (<QBToolTip location="top" tipId="invalidInput" delayHide={3000}
                            plainMessage={this.props.invalidMessage}>
                    {inputBox}
                </QBToolTip>) :
                inputBox
        );

// i18nMessageKey="fields.textField.clear"
        if (this.props.showClearButton) {
            return (
                <span className="inputDeleteIcon">
                    {inputBoxWithTooltip}
                    <QBToolTip tipId="clearInput" plainMessage="hello" >
                        <QBicon onClick={this.clearInput} className="deleteIcon" icon="clear-mini" />
                    </QBToolTip>
                </span>
            );
        } else {
            return inputBoxWithTooltip;
        }
    }
});

export default TextFieldValueEditor;
